import React, { useState } from 'react';
import { Cpu, ShieldCheck, Database, Check, GitCommit, FileCode, CheckCircle, ChevronRight, Activity } from 'lucide-react';

export const ArchitecturePipeline: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(2); // Pydantic model by default

  const stages = [
    {
      id: 0,
      zone: 'Stochastic Generation',
      zoneColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      title: 'Input Parser',
      description: 'Ingests heterogeneous raw function declarations, Swagger/OpenAPI specs, or legacy RPC schemas.',
      tech: 'Python AST / JSON Parser',
      sample: `{
  "raw_input": "check weather in LA",
  "source_format": "unstructured_rpc"
}`
    },
    {
      id: 1,
      zone: 'Stochastic Generation',
      zoneColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      title: 'LLM Semantic Analysis',
      description: 'Analyzes intent, extracts semantic entities, and identifies target functional domain without mutating arguments.',
      tech: 'OpenAI Responses / Structured Outputs',
      sample: `{
  "intent": "weather_lookup",
  "extracted_entities": {
    "location": "Los Angeles, CA",
    "temporal": "current"
  }
}`
    },
    {
      id: 2,
      zone: 'Canonical Bridge',
      zoneColor: 'text-orange-400 border-orange-500/40 bg-orange-500/15',
      title: 'Pydantic Canonical Model',
      description: 'The deterministic central spine: strictly enforces type boundaries, required parameter declarations, and immutability.',
      tech: 'Pydantic v2 BaseModel',
      sample: `class WeatherCanonical(BaseModel):
    location: str = Field(..., description="Target locality")
    unit: Literal["celsius", "fahrenheit"] = "celsius"
    
    class Config:
        frozen = True
        extra = "forbid"`
    },
    {
      id: 3,
      zone: 'Deterministic Validation',
      zoneColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      title: 'Schema Validation',
      description: 'Executes zero-tolerance schema conformance, checking type assertions, range constraints, and forbidden keys.',
      tech: 'Strict JSON Schema & Type Guard',
      sample: `{
  "schema_status": "PASSED",
  "errors_count": 0,
  "invariants_checked": [
    "type_safety",
    "bounds_check",
    "zero_extra_keys"
  ]
}`
    },
    {
      id: 4,
      zone: 'Deterministic Validation',
      zoneColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      title: 'Semantic Similarity Check',
      description: 'Computes directional cosine similarity between pre-normalization docstrings and post-normalization canonical signatures.',
      tech: 'all-MiniLM-L6-v2 + scikit-learn',
      sample: `{
  "original_doc": "Gets weather info for a place.",
  "canonical_doc": "Retrieves meteorological conditions.",
  "cosine_similarity": 0.942,
  "status": "APPROVED (>= 0.90)"
}`
    },
    {
      id: 5,
      zone: 'Deterministic Validation',
      zoneColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      title: 'Evaluation Engine',
      description: 'Final execution gate. Approves the tool invocation, stamps metadata telemetry, and authorizes autonomous dispatch.',
      tech: 'Confidence Gatekeeper',
      sample: `{
  "result": "VALIDATED",
  "confidence": "HIGH (0.99)",
  "action": "EXECUTE",
  "execution_token": "tk_norm_948271"
}`
    }
  ];

  return (
    <section id="pipeline" className="py-20 bg-[#080b11] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header from Slide 6 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Slide 6 & 7 Architectural Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trapping stochastic outputs <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              within deterministic borders
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Bridging raw generative reasoning with the mathematical rigor of Pydantic and Sentence Transformers, guaranteeing that zero invalid parameters can breach the boundary.
          </p>
        </div>

        {/* Dual Pillar Banner (Slide 7) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12 items-stretch">
          <div className="md:col-span-5 bg-[#0b0f19] border border-amber-500/30 rounded-xl p-5">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Semantic Understanding
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20">LLM Reasoning</span>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20">Sentence Transformers</span>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20">Embedding Similarity</span>
            </div>
            <p className="text-xs text-zinc-400 mt-3">Interprets ambiguous user intent and heterogeneous tool documentation with fluid contextual understanding.</p>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-orange-500/20 to-amber-600/20 border border-orange-500/30 text-center">
            <span className="text-xs font-bold font-mono text-orange-400">ToolNorm Core</span>
            <span className="text-[11px] text-zinc-300 mt-1 leading-tight">A standardized tool layer built for reliable, scalable agents</span>
          </div>

          <div className="md:col-span-5 bg-[#0b0f19] border border-emerald-500/30 rounded-xl p-5">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Deterministic Rigor
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20">Pydantic Schema Validation</span>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20">Strict JSON Enforcement</span>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20">Measurable Evaluation</span>
            </div>
            <p className="text-xs text-zinc-400 mt-3">Guarantees parameter typing, field bounds, and strict zero-invention constraints prior to tool execution.</p>
          </div>
        </div>

        {/* Interactive Pipeline Stages Navigation (Slide 6 Pipeline Flow) */}
        <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 sm:p-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Interactive 6-Stage Pipeline</span>
            <span className="text-xs font-mono text-orange-400">Click any stage node to inspect state</span>
          </div>

          {/* Pipeline stage tracker */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {stages.map((stg) => {
              const isSelected = selectedStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setSelectedStage(stg.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-zinc-800 border-orange-500 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500'
                      : 'bg-[#070a10] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">0{stg.id + 1}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${stg.zoneColor}`}>
                      {stg.id <= 1 ? 'Stochastic' : stg.id === 2 ? 'Bridge' : 'Deterministic'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight font-mono">{stg.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1">{stg.tech}</p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Dive Display */}
          <div className="bg-[#070a10] rounded-xl border border-zinc-800 p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${stages[selectedStage].zoneColor}`}>
                  Zone: {stages[selectedStage].zone}
                </span>
                <span className="text-xs font-mono text-zinc-400">Stage {selectedStage + 1} of 6</span>
              </div>

              <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-orange-400" />
                <span>{stages[selectedStage].title}</span>
              </h3>

              <p className="text-zinc-300 text-sm leading-relaxed">
                {stages[selectedStage].description}
              </p>

              <div className="pt-3 border-t border-zinc-800 space-y-2 font-mono text-xs text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Underlying Engine:</span>
                  <span className="text-white font-semibold">{stages[selectedStage].tech}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Validation Mode:</span>
                  <span className={selectedStage >= 2 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {selectedStage >= 2 ? 'Strict Deterministic Boundary' : 'Contextual Semantic Synthesis'}
                  </span>
                </div>
              </div>
            </div>

            {/* Code / State Payload Preview */}
            <div className="lg:col-span-6 bg-[#0b0f19] rounded-xl border border-zinc-800 p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3 text-zinc-400">
                <span className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  Stage Snapshot Artifact
                </span>
                <span className="text-[10px] text-zinc-500">Stage 0{selectedStage + 1} State</span>
              </div>

              <pre className="text-zinc-300 overflow-x-auto text-[11px] leading-relaxed max-h-56">
                <code>{stages[selectedStage].sample}</code>
              </pre>

              <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3 h-3" />
                  State Verified
                </span>
                <span>Latency: 2.1ms</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
