import React, { useState } from 'react';
import { JsonSchemaDraftVersion, SchemaValidationReport } from '../types';
import { DRAFT_METASCHEMAS } from '../utils/jsonSchemaValidator';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Wrench, 
  Zap, 
  Sliders, 
  Check, 
  Bug, 
  RefreshCw,
  FileCode
} from 'lucide-react';

interface SchemaValidationIndicatorProps {
  report: SchemaValidationReport;
  selectedDraft: JsonSchemaDraftVersion;
  onDraftChange: (draft: JsonSchemaDraftVersion) => void;
  onApplyFix?: (fixPath: string, suggestion?: string) => void;
  onInjectCorruptSchema?: (scenario: 'hallucinated_type' | 'missing_required' | 'unbounded_extra' | 'clean') => void;
  isCustomTesting?: boolean;
}

export const SchemaValidationIndicator: React.FC<SchemaValidationIndicatorProps> = ({
  report,
  selectedDraft,
  onDraftChange,
  onApplyFix,
  onInjectCorruptSchema,
  isCustomTesting = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'diagnostics' | 'simulate'>('rules');

  const meta = DRAFT_METASCHEMAS[selectedDraft];

  return (
    <div className="rounded-xl border transition-all duration-300 overflow-hidden bg-zinc-900/90 shadow-md border-zinc-800">
      {/* Primary Indicator Bar */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Status & Pulse */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {report.isValid ? (
              <>
                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-red-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                JSON Schema Conformance
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                report.isValid 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {report.isValid ? 'DRAFT VALID' : `${report.errorCount} ERROR${report.errorCount > 1 ? 'S' : ''}`}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-sm font-bold font-mono flex items-center gap-1.5 ${
                report.isValid ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {report.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{meta.label} Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Deterministic Border Breach</span>
                  </>
                )}
              </span>

              <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                ({report.passedCount}/{report.totalChecks} checks)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Draft Selector & Audit Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Draft selector dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={selectedDraft}
              onChange={(e) => onDraftChange(e.target.value as JsonSchemaDraftVersion)}
              className="bg-black/60 text-zinc-300 border border-zinc-700 hover:border-orange-500/50 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              title="Select JSON Schema standard draft version"
            >
              <option value="2020-12">Draft 2020-12 (OpenAPI 3.1)</option>
              <option value="draft-07">Draft-07 (OpenAI Tools)</option>
              <option value="draft-04">Draft-04 (Legacy)</option>
            </select>
          </div>

          {/* Toggle Inspect Audit Panel */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isExpanded 
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' 
                : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span>{isExpanded ? 'Hide Audit' : 'Audit Draft'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Real-Time Diagnostic Audit Panel */}
      {isExpanded && (
        <div className="border-t border-zinc-800 bg-[#070a10] p-4 sm:p-5">
          {/* Audit Sub-navigation */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'rules'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Draft Rules ({report.rules.length})
              </button>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'diagnostics'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Diagnostics</span>
                {(report.errorCount > 0 || report.warningCount > 0) && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    report.errorCount > 0 ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    {report.errorCount + report.warningCount}
                  </span>
                )}
              </button>
              {onInjectCorruptSchema && (
                <button
                  onClick={() => setActiveTab('simulate')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'simulate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Bug className="w-3 h-3 text-amber-400" />
                  <span>Stress-Test Dialect</span>
                </button>
              )}
            </div>

            <div className="text-[11px] font-mono text-zinc-500 hidden md:flex items-center gap-1">
              <span>Metaschema:</span>
              <a 
                href={report.draftUri} 
                target="_blank" 
                rel="noreferrer"
                className="text-orange-400/80 hover:text-orange-300 underline flex items-center gap-1"
              >
                <span>{selectedDraft}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Tab 1: Standard Draft Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {report.rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono transition-colors flex items-start justify-between gap-3 ${
                    rule.status === 'passed'
                      ? 'bg-zinc-900/60 border-zinc-800/80'
                      : rule.status === 'failed'
                      ? 'bg-red-950/30 border-red-500/40'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {rule.status === 'passed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {rule.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    {rule.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-zinc-200 flex items-center gap-2">
                        <span>{rule.name}</span>
                        <span className="text-[10px] text-zinc-500">[{rule.id}]</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{rule.details}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                    rule.status === 'passed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : rule.status === 'failed'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {rule.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Live Diagnostics & Fixes */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {report.diagnostics.length === 0 ? (
                <div className="py-6 text-center text-zinc-500 font-mono text-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-zinc-300 font-semibold">Zero Schema Defects Detected</p>
                  <p className="text-[11px] mt-1 text-zinc-500">Generated schema conforms strictly to {meta.label} specifications with full parameter contract fidelity.</p>
                </div>
              ) : (
                report.diagnostics.map((diag, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs font-mono ${
                      diag.severity === 'error'
                        ? 'bg-red-950/40 border-red-500/40 text-red-200'
                        : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1.5 font-bold">
                        {diag.severity === 'error' ? (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className="text-zinc-300">{diag.path}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-zinc-400">
                        keyword: {diag.keyword}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 mb-2">{diag.message}</p>

                    {diag.fixSuggestion && (
                      <div className="p-2 rounded bg-black/40 border border-zinc-800/80 flex items-center justify-between gap-2 text-[10px]">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-orange-400" />
                          <span>Fix: {diag.fixSuggestion}</span>
                        </span>
                        {onApplyFix && (
                          <button
                            onClick={() => onApplyFix(diag.path, diag.fixSuggestion)}
                            className="px-2 py-0.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors cursor-pointer shrink-0"
                          >
                            Apply Fix
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Simulate Corrupt Output & Border Rejection */}
          {activeTab === 'simulate' && onInjectCorruptSchema && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-orange-400 font-bold">Deterministic Validation Testbench:</span> Test how ToolNorm traps raw LLM hallucination errors and schema drift against the <span className="text-white font-semibold">{meta.label}</span> standard.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => onInjectCorruptSchema('hallucinated_type')}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-200 group-hover:text-orange-400 font-semibold">
                    <span>1. Inject Invalid Python Type</span>
                    <Bug className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Simulates LLM returning non-standard <code className="text-amber-400">"varchar"</code> or <code className="text-amber-400">"str"</code> types.
                  </p>
                </button>

                <button
                  onClick={() => onInjectCorruptSchema('missing_required')}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-200 group-hover:text-orange-400 font-semibold">
                    <span>2. Inject Missing Required Prop</span>
                    <Bug className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Simulates hallucinated required argument missing from properties dictionary.
                  </p>
                </button>

                <button
                  onClick={() => onInjectCorruptSchema('unbounded_extra')}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-200 group-hover:text-orange-400 font-semibold">
                    <span>3. Breach Deterministic Border</span>
                    <Bug className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Sets <code className="text-amber-400">additionalProperties: true</code> to test boundary leak detection.
                  </p>
                </button>

                <button
                  onClick={() => onInjectCorruptSchema('clean')}
                  className="p-2.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-500/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-emerald-300 font-semibold">
                    <span>4. Restore Valid Canonical Schema</span>
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Restores strictly validated canonical schema conforming to {meta.label}.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-zinc-500 font-mono gap-2">
            <span>Standard: JSON Schema Draft Core &amp; Validation Specification</span>
            <span>Evaluated at: {new Date(report.evaluatedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
