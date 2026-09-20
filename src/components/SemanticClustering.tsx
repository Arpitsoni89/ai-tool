import React, { useState } from 'react';
import { SEMANTIC_CLUSTERS } from '../data/presets';
import { SemanticCluster } from '../types';
import { Network, ArrowRight, CheckCircle, Radio, Sparkles, Filter } from 'lucide-react';

export const SemanticClustering: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<SemanticCluster>(SEMANTIC_CLUSTERS[0]);
  const [activeQuery, setActiveQuery] = useState<string>(SEMANTIC_CLUSTERS[0].queries[0]);
  const [isRouting, setIsRouting] = useState<boolean>(false);

  const handleSelectCluster = (cluster: SemanticCluster) => {
    setSelectedCluster(cluster);
    setActiveQuery(cluster.queries[0]);
  };

  const handleTriggerQuery = (query: string) => {
    setActiveQuery(query);
    setIsRouting(true);
    setTimeout(() => setIsRouting(false), 350);
  };

  return (
    <section id="clustering" className="py-20 bg-[#080b11] border-t border-zinc-800 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header from Slide 8 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono mb-3">
            <Network className="w-3.5 h-3.5" />
            <span>Slide 8 Semantic Clustering Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Guaranteeing downstream selection <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              through semantic clustering
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Instead of exposing raw disparate tool declarations directly to autonomous agents, ToolNorm aggregates tools into dense semantic hubs, ensuring 96.5% deterministic selection accuracy.
          </p>
        </div>

        {/* Cluster Selection Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {SEMANTIC_CLUSTERS.map((cluster) => {
            const isSelected = selectedCluster.id === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => handleSelectCluster(cluster)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400'
                    : 'bg-[#0b0f19] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                <span>{cluster.name}</span>
              </button>
            );
          })}
        </div>

        {/* Slide 8 Visual Radar Representation */}
        <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 sm:p-8">
          
          {/* Query prompt bar */}
          <div className="mb-8 p-4 rounded-xl bg-[#070a10] border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Test Agent Intent:</span>
              <p className="text-sm font-mono font-bold text-white">"{activeQuery}"</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">Query Presets:</span>
              {selectedCluster.queries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTriggerQuery(q)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    activeQuery === q
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  Prompt {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Radar Visualization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Heterogeneous Tools Influx */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-orange-400" />
                <span>Heterogeneous Inputs ({selectedCluster.heterogeneousTools.length})</span>
              </span>

              <div className="space-y-2 font-mono text-xs">
                {selectedCluster.heterogeneousTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isRouting
                        ? 'bg-orange-950/20 border-orange-500/50 scale-[1.02]'
                        : 'bg-[#070a10] border-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-zinc-200 font-semibold">{tool}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">raw declaration</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Concentric Cluster Hub (Reproducing Slide 8 Visual) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 relative">
              {/* Outer concentric rings */}
              <div className="relative flex items-center justify-center">
                {/* Ring 3 */}
                <div className="w-64 h-64 rounded-full border border-orange-500/20 absolute animate-pulse pointer-events-none" />
                {/* Ring 2 */}
                <div className="w-48 h-48 rounded-full border border-orange-500/35 absolute pointer-events-none" />
                {/* Central Cluster Hub from Slide 8 */}
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 p-1 shadow-2xl shadow-orange-500/40 z-10 flex items-center justify-center text-center">
                  <div className="w-full h-full bg-[#0d121f] rounded-full flex flex-col items-center justify-center p-3 border border-orange-400/40">
                    <span className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-wider">
                      Cluster Hub
                    </span>
                    <span className="text-xs font-extrabold font-mono text-white mt-1 leading-tight">
                      {selectedCluster.name}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 mt-1">
                      (96.5% Precision)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Resolved Canonical Target */}
            <div className="lg:col-span-4 bg-[#070a10] rounded-xl border border-emerald-500/30 p-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Downstream Target Assigned</span>
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-500/20">
                  Routed
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-zinc-500 text-[10px] block">Canonical Signature:</span>
                  <p className="text-white font-bold text-sm">{selectedCluster.canonicalTool}</p>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] block">Cluster Domain Scope:</span>
                  <p className="text-zinc-300 text-xs mt-0.5">{selectedCluster.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cosine Closeness:</span>
                    <span className="text-orange-400 font-bold">0.962</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Router Decision:</span>
                    <span className="text-emerald-400 font-bold">Deterministic 1-Hop</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
