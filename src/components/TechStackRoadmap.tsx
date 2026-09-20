import React from 'react';
import { TECH_STACK_COLUMNS } from '../data/presets';
import { Cpu, Rocket, TrendingUp, Layers, CheckCircle2, Globe, Shield, Sparkles, Terminal } from 'lucide-react';

export const TechStackRoadmap: React.FC = () => {
  return (
    <section id="stack" className="py-20 bg-[#080b11] border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Tech Stack Matrix (Slide 11) */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Slide 11 Engineering Foundation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built on standard Python ML <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                and validation frameworks
              </span>
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
              No proprietary vendor lock-in. Powered by standard Python ML primitives, battle-tested Pydantic schema validation, and sentence embeddings.
            </p>
          </div>

          {/* 5 Column Framework Grid (Exact replica of Slide 11 Matrix) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {TECH_STACK_COLUMNS.map((col, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f19] rounded-xl border border-zinc-800 p-4 flex flex-col justify-between hover:border-orange-500/40 transition-all group"
              >
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 pb-2 mb-3 border-b border-zinc-800 flex items-center justify-between">
                    <span>{col.title}</span>
                    <span className="text-[10px] text-zinc-600">0{idx + 1}</span>
                  </div>

                  <div className="space-y-3">
                    {col.frameworks.map((fw, fIdx) => (
                      <div key={fIdx} className="p-2.5 rounded-lg bg-[#070a10] border border-zinc-800/80">
                        <div className="font-mono text-xs font-bold text-white group-hover:text-orange-300 transition-colors">
                          {fw.name}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                          {fw.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Standard ML Stack</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Roadmap - From Fragmented APIs to Autonomous Universal Tool Registries (Slide 12) */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono mb-3">
              <Rocket className="w-3.5 h-3.5" />
              <span>Slide 12 Evolution Trajectory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From fragmented APIs to <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                autonomous universal tool registries
              </span>
            </h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
              How ToolNorm bridges current API fragmentation into fully self-orchestrating multi-agent ecosystems.
            </p>
          </div>

          {/* Interactive Trajectory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Phase 1: Today */}
            <div className="bg-[#0b0f19] rounded-2xl border border-orange-500/40 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
                  Today (Normalization)
                </span>
                <span className="text-xs font-mono text-zinc-500">v1.4 Available</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">Consistent Baseline Language</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                ToolNorm establishes a consistent baseline language for heterogeneous tool descriptions, standardizing arguments, schema constraints, and typing.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-zinc-400 font-mono">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  Canonical schema refraction
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  Pydantic v2 deterministic validation
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  all-MiniLM-L6-v2 cosine gating
                </li>
              </ul>
            </div>

            {/* Phase 2: Horizon */}
            <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono font-bold">
                  Near Horizon
                </span>
                <span className="text-xs font-mono text-zinc-500">Q3 Enterprise</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">Dynamic Clustering Federation</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Automated online vector clustering that groups disparate SaaS plugins (Stripe, Salesforce, Jira, GitHub) into dynamic cluster hubs on the fly.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-zinc-400 font-mono">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  Multi-tenant cluster indices
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  Automated conflict resolution
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  Sub-millisecond edge caching
                </li>
              </ul>
            </div>

            {/* Phase 3: Tomorrow */}
            <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                  Tomorrow (Autonomous)
                </span>
                <span className="text-xs font-mono text-zinc-500">Future Vision</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">Universal Tool Registries</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Dynamic tool generation, automated clustering, and universal registries for enterprise AI agents with self-healing API adapters.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-zinc-400 font-mono">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Self-synthesizing API clients
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Autonomous cross-agent federation
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Global verifiable schema ledger
                </li>
              </ul>
            </div>

          </div>

          {/* The Manifesto Card from Slide 12 */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-orange-950/40 via-zinc-900/80 to-amber-950/30 border border-orange-500/40 shadow-2xl relative">
            <div className="max-w-3xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400 block mb-2">
                The ToolNorm Manifesto
              </span>
              <blockquote className="text-xl sm:text-2xl font-bold text-white leading-relaxed font-sans">
                "AI agents depend on hundreds of tools, but lack a common language. ToolNorm provides the standardized, validated layer necessary for reliable, scalable AI action."
              </blockquote>
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="text-orange-400 font-bold">ToolNorm AI Core Team</span>
                <span>•</span>
                <span>Bridging Stochastic Reasoning with Deterministic Rigor</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
