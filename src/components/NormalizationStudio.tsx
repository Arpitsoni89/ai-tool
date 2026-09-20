import React, { useState, useMemo, useEffect } from 'react';
import { RAW_TOOL_PRESETS, generateCanonicalOutput } from '../data/presets';
import { RawToolDefinition, CanonicalToolOutput, JsonSchemaDraftVersion } from '../types';
import { SchemaValidationIndicator } from './SchemaValidationIndicator';
import { generateJsonSchemaForTool, validateJsonSchemaDraft, DRAFT_METASCHEMAS } from '../utils/jsonSchemaValidator';
import { 
  Sparkles, 
  Check, 
  Copy, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Cpu, 
  Database, 
  AlertCircle, 
  Code2, 
  ShieldCheck, 
  FileCode, 
  Bug,
  HelpCircle,
  Zap,
  RotateCcw
} from 'lucide-react';

export const NormalizationStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demo' | 'manual'>('demo');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RAW_TOOL_PRESETS[0].id);
  const [manualJsonInput, setManualJsonInput] = useState<string>(RAW_TOOL_PRESETS[0].rawJson);
  const [isNormalizing, setIsNormalizing] = useState<boolean>(false);
  const [outputTab, setOutputTab] = useState<'canonical_json' | 'json_schema' | 'pydantic_model' | 'parameters_audit'>('canonical_json');
  const [copied, setCopied] = useState<boolean>(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Selected JSON Schema Draft (Draft 2020-12, Draft-07, Draft-04)
  const [selectedDraft, setSelectedDraft] = useState<JsonSchemaDraftVersion>('2020-12');

  // Current raw tool definition
  const currentPreset = RAW_TOOL_PRESETS.find(p => p.id === selectedPresetId) || RAW_TOOL_PRESETS[0];

  const [canonicalOutput, setCanonicalOutput] = useState<CanonicalToolOutput>(
    generateCanonicalOutput(currentPreset)
  );

  // Generated JSON Schema representation (stringified for real-time validation & inspection)
  const [currentSchemaString, setCurrentSchemaString] = useState<string>(() => {
    const generated = generateJsonSchemaForTool(
      canonicalOutput.canonicalName,
      canonicalOutput.canonicalDescription,
      canonicalOutput.parameters,
      '2020-12'
    );
    return JSON.stringify(generated, null, 2);
  });

  const [isSchemaUserEdited, setIsSchemaUserEdited] = useState<boolean>(false);

  // Re-generate schema when canonical output or selected draft changes (unless user actively editing corrupt test)
  useEffect(() => {
    if (!isSchemaUserEdited) {
      const generated = generateJsonSchemaForTool(
        canonicalOutput.canonicalName,
        canonicalOutput.canonicalDescription,
        canonicalOutput.parameters,
        selectedDraft
      );
      setCurrentSchemaString(JSON.stringify(generated, null, 2));
    }
  }, [canonicalOutput, selectedDraft, isSchemaUserEdited]);

  // Real-time validation computation: runs instantaneously whenever schema or draft changes
  const validationReport = useMemo(() => {
    return validateJsonSchemaDraft(currentSchemaString, selectedDraft);
  }, [currentSchemaString, selectedDraft]);

  const handleSelectPreset = (preset: RawToolDefinition) => {
    setSelectedPresetId(preset.id);
    setManualJsonInput(preset.rawJson);
    setJsonError(null);
    setIsSchemaUserEdited(false);
    const newCanonical = generateCanonicalOutput(preset);
    setCanonicalOutput(newCanonical);

    const generated = generateJsonSchemaForTool(
      newCanonical.canonicalName,
      newCanonical.canonicalDescription,
      newCanonical.parameters,
      selectedDraft
    );
    setCurrentSchemaString(JSON.stringify(generated, null, 2));
  };

  const handleNormalize = () => {
    setIsNormalizing(true);
    setJsonError(null);
    setIsSchemaUserEdited(false);

    setTimeout(() => {
      try {
        if (activeTab === 'manual') {
          const parsed = JSON.parse(manualJsonInput);
          const syntheticRaw: RawToolDefinition = {
            id: 'custom-' + Date.now(),
            rawName: parsed.name || parsed.tool || parsed.function || 'unnamed_tool',
            category: 'weather',
            vendor: 'Custom Manual Input',
            rawDescription: parsed.description || parsed.desc || 'Custom tool definition provided via JSON editor.',
            rawJson: manualJsonInput,
            parameters: Array.isArray(parsed.parameters)
              ? parsed.parameters.map((p: any) => ({
                  name: p.name || 'arg',
                  type: p.type || 'string',
                  required: p.required ?? true,
                  description: p.description || ''
                }))
              : Object.keys(parsed.parameters || {}).map(k => ({
                  name: k,
                  type: typeof parsed.parameters[k],
                  required: true,
                  description: ''
                }))
          };
          const newCanonical = generateCanonicalOutput(syntheticRaw);
          setCanonicalOutput(newCanonical);

          const generated = generateJsonSchemaForTool(
            newCanonical.canonicalName,
            newCanonical.canonicalDescription,
            newCanonical.parameters,
            selectedDraft
          );
          setCurrentSchemaString(JSON.stringify(generated, null, 2));
        } else {
          const newCanonical = generateCanonicalOutput(currentPreset);
          setCanonicalOutput(newCanonical);

          const generated = generateJsonSchemaForTool(
            newCanonical.canonicalName,
            newCanonical.canonicalDescription,
            newCanonical.parameters,
            selectedDraft
          );
          setCurrentSchemaString(JSON.stringify(generated, null, 2));
        }
      } catch (err: any) {
        setJsonError('Invalid JSON input: ' + err.message);
      } finally {
        setIsNormalizing(false);
      }
    }, 450);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stress-test injection: simulate various stochastic failure modes caught by deterministic border
  const handleInjectCorruptSchema = (scenario: 'hallucinated_type' | 'missing_required' | 'unbounded_extra' | 'clean') => {
    setIsSchemaUserEdited(true);

    if (scenario === 'clean') {
      setIsSchemaUserEdited(false);
      const cleanObj = generateJsonSchemaForTool(
        canonicalOutput.canonicalName,
        canonicalOutput.canonicalDescription,
        canonicalOutput.parameters,
        selectedDraft
      );
      setCurrentSchemaString(JSON.stringify(cleanObj, null, 2));
      return;
    }

    try {
      const baseObj = JSON.parse(currentSchemaString);

      if (scenario === 'hallucinated_type') {
        // Inject non-standard python / database type "varchar" or "str"
        const firstPropKey = Object.keys(baseObj.properties || {})[0] || 'location';
        if (baseObj.properties && baseObj.properties[firstPropKey]) {
          baseObj.properties[firstPropKey].type = 'varchar';
        }
      } else if (scenario === 'missing_required') {
        // Add a required field that is not defined in properties dictionary
        baseObj.required = Array.isArray(baseObj.required) ? [...baseObj.required] : [];
        if (!baseObj.required.includes('hallucinated_auth_token')) {
          baseObj.required.push('hallucinated_auth_token');
        }
      } else if (scenario === 'unbounded_extra') {
        // Break deterministic border by allowing arbitrary extra keys
        baseObj.additionalProperties = true;
      }

      setCurrentSchemaString(JSON.stringify(baseObj, null, 2));
    } catch {
      // Fallback
    }
  };

  // Quick fix handler
  const handleApplyFix = (path: string, suggestion?: string) => {
    try {
      const obj = JSON.parse(currentSchemaString);

      if (path.includes('/type') && suggestion && suggestion.includes('Replace')) {
        // Fix type hallucination
        const match = suggestion.match(/"([^"]+)"$/);
        const correctType = match ? match[1] : 'string';
        
        for (const key of Object.keys(obj.properties || {})) {
          const t = obj.properties[key].type;
          if (t === 'varchar' || t === 'str' || t === 'dict' || t === 'list' || t === 'bool') {
            obj.properties[key].type = correctType;
          }
        }
      } else if (path.includes('/required') && obj.required) {
        // Filter out required items that aren't in properties
        const propKeys = Object.keys(obj.properties || {});
        obj.required = obj.required.filter((r: string) => propKeys.includes(r));
      } else if (path.includes('/additionalProperties')) {
        obj.additionalProperties = false;
      } else if (path.includes('/$schema')) {
        obj.$schema = DRAFT_METASCHEMAS[selectedDraft].uri;
      }

      setCurrentSchemaString(JSON.stringify(obj, null, 2));
    } catch {
      // ignore
    }
  };

  return (
    <section id="studio" className="py-20 bg-[#070a10] border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header from Slide 10 */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Slide 10 Interactive Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Inspecting the normalization engine in real-time
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Test ToolNorm's refraction engine with curated benchmark schemas or paste your own raw JSON to watch canonical conversion, Pydantic code generation, and real-time JSON Schema Draft validation.
          </p>
        </div>

        {/* Workbench Container */}
        <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 shadow-2xl p-6 sm:p-8">
          
          {/* Top Bar: Switcher (Demo Dataset vs Manual JSON) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-zinc-400">Input Mode:</span>
              <div className="inline-flex p-1 rounded-lg bg-zinc-900 border border-zinc-800">
                <button
                  onClick={() => { setActiveTab('demo'); setJsonError(null); }}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'demo' ? 'bg-orange-500 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Demo Dataset
                </button>
                <button
                  onClick={() => { setActiveTab('manual'); setJsonError(null); }}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                    activeTab === 'manual' ? 'bg-orange-500 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Manual JSON
                </button>
              </div>
            </div>

            {/* Presets chips when in Demo mode */}
            {activeTab === 'demo' && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-zinc-500 font-mono hidden md:inline">Presets:</span>
                {RAW_TOOL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                      selectedPresetId === preset.id
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {preset.rawName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prominent Action Button: NORMALIZE TOOL */}
          <div className="my-6">
            <button
              onClick={handleNormalize}
              disabled={isNormalizing}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:via-amber-600 hover:to-orange-600 text-white font-bold font-mono text-sm tracking-wider uppercase shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-75"
            >
              {isNormalizing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing Stochastic ➔ Deterministic Validation...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5 text-white" />
                  <span>NORMALIZE TOOL</span>
                </>
              )}
            </button>
          </div>

          {/* Error banner if invalid JSON */}
          {jsonError && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{jsonError}</span>
            </div>
          )}

          {/* Main Side-by-Side Comparison Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Input Payload (Raw Tool Definition) */}
            <div className="lg:col-span-6 bg-[#070a10] rounded-xl border border-zinc-800 p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
                <span className="text-zinc-400 font-bold flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Raw Tool Definition (Input)</span>
                </span>
                <span className="text-[10px] text-zinc-500">
                  {activeTab === 'demo' ? currentPreset.vendor : 'Custom Raw JSON'}
                </span>
              </div>

              {activeTab === 'demo' ? (
                <div>
                  <div className="mb-2 p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
                    <span className="text-zinc-500">Description:</span> {currentPreset.rawDescription}
                  </div>
                  <pre className="text-zinc-300 overflow-x-auto text-[11px] leading-relaxed p-2 bg-[#090d16] rounded border border-zinc-800/60 max-h-80">
                    <code>{currentPreset.rawJson}</code>
                  </pre>
                </div>
              ) : (
                <div>
                  <textarea
                    value={manualJsonInput}
                    onChange={(e) => setManualJsonInput(e.target.value)}
                    rows={12}
                    className="w-full bg-[#090d16] border border-zinc-700/80 rounded p-3 text-[11px] text-zinc-200 font-mono focus:outline-none focus:border-orange-500 leading-relaxed resize-y"
                    placeholder="Paste raw tool JSON here..."
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Accepts OpenAPI, Function calling JSON, or custom JSON tool schemas.</p>
                </div>
              )}
            </div>

            {/* Right: Canonical Output & Real-Time Validation Telemetry */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Telemetry Readout Grid with Integrated Real-Time Schema Indicator */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Telemetry 1: Semantic Similarity */}
                  <div className="p-3 rounded-lg bg-[#070a10] border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400 block mb-1">Semantic Similarity (all-MiniLM-L6-v2)</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold font-mono text-orange-400">
                        {canonicalOutput.metadata.semanticSimilarity.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">(Pass &ge; 0.90)</span>
                    </div>
                  </div>

                  {/* Telemetry 2: Parameter Fidelity */}
                  <div className="p-3 rounded-lg bg-[#070a10] border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-400 block mb-1">Parameter Count &amp; Fidelity</span>
                    <div className="text-sm font-bold font-mono text-white">
                      Maintained
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">0 invented, 0 dropped</span>
                  </div>
                </div>

                {/* REAL-TIME VALIDATION INDICATOR (Dedicated Card checking against standard JSON Schema draft) */}
                <SchemaValidationIndicator
                  report={validationReport}
                  selectedDraft={selectedDraft}
                  onDraftChange={(d) => setSelectedDraft(d)}
                  onApplyFix={handleApplyFix}
                  onInjectCorruptSchema={handleInjectCorruptSchema}
                  isCustomTesting={isSchemaUserEdited}
                />
              </div>

              {/* Canonical Output Multi-Tab View with JSON Schema Draft */}
              <div className="bg-[#070a10] rounded-xl border border-orange-500/30 p-4 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 mb-3 gap-2">
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setOutputTab('canonical_json')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                        outputTab === 'canonical_json'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Canonical Action
                    </button>
                    <button
                      onClick={() => setOutputTab('json_schema')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                        outputTab === 'json_schema'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>JSON Schema ({DRAFT_METASCHEMAS[selectedDraft].label})</span>
                      <span className={`w-2 h-2 rounded-full ${validationReport.isValid ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    </button>
                    <button
                      onClick={() => setOutputTab('pydantic_model')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                        outputTab === 'pydantic_model'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Pydantic Model
                    </button>
                    <button
                      onClick={() => setOutputTab('parameters_audit')}
                      className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer whitespace-nowrap ${
                        outputTab === 'parameters_audit'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Parameter Audit
                    </button>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {outputTab === 'json_schema' && isSchemaUserEdited && (
                      <button
                        onClick={() => handleInjectCorruptSchema('clean')}
                        className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                        title="Reset schema to clean canonical output"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(
                        outputTab === 'pydantic_model'
                          ? canonicalOutput.pydanticCode
                          : outputTab === 'json_schema'
                          ? currentSchemaString
                          : canonicalOutput.canonicalJson
                      )}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: Canonical Invocation JSON */}
                {outputTab === 'canonical_json' && (
                  <pre className="text-emerald-300/90 overflow-x-auto text-[11px] leading-relaxed p-2 bg-[#090d16] rounded border border-zinc-800/60 max-h-72">
                    <code>{canonicalOutput.canonicalJson}</code>
                  </pre>
                )}

                {/* Tab 2: Generated JSON Schema Draft with Live Validation Highlight */}
                {outputTab === 'json_schema' && (
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5 px-1 font-mono">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-orange-400" />
                        <span>Standard Metaschema: <code className="text-zinc-300">{DRAFT_METASCHEMAS[selectedDraft].uri}</code></span>
                      </span>
                      <span className={validationReport.isValid ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {validationReport.isValid ? '✓ Standard Compliant' : `⚠ ${validationReport.errorCount} Dialect Error(s)`}
                      </span>
                    </div>

                    <textarea
                      value={currentSchemaString}
                      onChange={(e) => {
                        setIsSchemaUserEdited(true);
                        setCurrentSchemaString(e.target.value);
                      }}
                      rows={14}
                      spellCheck={false}
                      className={`w-full bg-[#090d16] rounded p-2.5 text-[11px] leading-relaxed font-mono resize-y border transition-colors ${
                        validationReport.isValid
                          ? 'border-zinc-800/80 text-cyan-300/90 focus:border-emerald-500/50'
                          : 'border-red-500/60 text-red-200 focus:border-red-500'
                      }`}
                    />
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>* Live editable — edits validate instantaneously against {DRAFT_METASCHEMAS[selectedDraft].label}.</span>
                      <span>additionalProperties: false (Strict Border)</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Pydantic Model */}
                {outputTab === 'pydantic_model' && (
                  <pre className="text-amber-200/90 overflow-x-auto text-[11px] leading-relaxed p-2 bg-[#090d16] rounded border border-zinc-800/60 max-h-72">
                    <code>{canonicalOutput.pydanticCode}</code>
                  </pre>
                )}

                {/* Tab 4: Parameter Audit */}
                {outputTab === 'parameters_audit' && (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {canonicalOutput.parameters.map((p, idx) => (
                      <div key={idx} className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] flex items-center justify-between">
                        <div>
                          <span className="text-white font-bold">{p.name}</span>
                          <span className="ml-2 text-zinc-400 font-mono">({p.type})</span>
                          {p.description && <p className="text-[10px] text-zinc-500">{p.description}</p>}
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${p.required ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
                          {p.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Confidence: {canonicalOutput.metadata.confidenceScore}</span>
                  <span>Validation Latency: {canonicalOutput.metadata.latencyMs}ms</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
