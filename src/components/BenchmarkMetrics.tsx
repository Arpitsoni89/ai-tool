import React, { useState } from 'react';
import { BENCHMARK_METRICS, BENCHMARK_TOOLS_DATA } from '../data/presets';
import { BarChart3, Search, CheckCircle, SlidersHorizontal, Info, Award } from 'lucide-react';

export const BenchmarkMetrics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Weather', 'Payment', 'Database', 'Calendar', 'Inventory', 'Search', 'DevOps'];

  const filteredTools = BENCHMARK_TOOLS_DATA.filter(tool => {
    const matchesSearch = tool.rawToolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.canonicalToolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || tool.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <section id="benchmarks" className="py-20 bg-[#070a10] border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header from Slide 9 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Slide 9 Rigorous Empirical Evaluation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Measuring semantic preservation <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              across a 100-tool dataset
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            Exhaustive benchmarking over 100 real-world microservice schemas evaluating structural integrity, sentence embedding cosine fidelity, and autonomous routing precision.
          </p>
        </div>

        {/* 4 Arc Gauges (Directly reproducing the 4 gauges from Slide 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Gauge 1: Schema Preservation */}
          <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center text-center relative hover:border-orange-500/30 transition-all">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-zinc-800" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#f97316"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.987)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-white">98.7%</span>
                <span className="text-[10px] font-mono text-emerald-400">PASSED</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">{BENCHMARK_METRICS.schemaPreservation.label}</h4>
            <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{BENCHMARK_METRICS.schemaPreservation.detail}</p>
          </div>

          {/* Gauge 2: Semantic Preservation */}
          <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center text-center relative hover:border-orange-500/30 transition-all">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-zinc-800" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#fb923c"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.942)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-white">94.2%</span>
                <span className="text-[10px] font-mono text-orange-400">COSINE</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">{BENCHMARK_METRICS.semanticPreservation.label}</h4>
            <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{BENCHMARK_METRICS.semanticPreservation.detail}</p>
          </div>

          {/* Gauge 3: Normalization Consistency */}
          <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center text-center relative hover:border-orange-500/30 transition-all">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-zinc-800" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#ea580c"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.991)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-white">99.1%</span>
                <span className="text-[10px] font-mono text-emerald-400">STABLE</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">{BENCHMARK_METRICS.normalizationConsistency.label}</h4>
            <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{BENCHMARK_METRICS.normalizationConsistency.detail}</p>
          </div>

          {/* Gauge 4: Downstream Selection Consistency */}
          <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 flex flex-col items-center text-center relative hover:border-orange-500/30 transition-all">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-zinc-800" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.965)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-extrabold font-mono text-white">96.5%</span>
                <span className="text-[10px] font-mono text-emerald-400">ACCURACY</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white font-mono">{BENCHMARK_METRICS.downstreamSelection.label}</h4>
            <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{BENCHMARK_METRICS.downstreamSelection.detail}</p>
          </div>

        </div>

        {/* Methodology Footnote Banner directly citing Slide 9 bottom label */}
        <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-12 flex items-center gap-3 text-xs font-mono text-zinc-400">
          <Info className="w-4 h-4 text-orange-400 shrink-0" />
          <span>
            <strong className="text-zinc-300">Methodology Note:</strong> Cosine similarity via <code className="text-orange-300 bg-zinc-800 px-1 py-0.5 rounded">all-MiniLM-L6-v2</code> is utilized as a directional signal, not absolute proof of semantic preservation.
          </span>
        </div>

        {/* 100-Tool Dataset Interactive Explorer */}
        <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                <span>Benchmark Corpus Sample Browser</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Explore individual tool metrics across heterogeneous categories</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search raw or canonical tool..."
                className="w-full bg-[#070a10] border border-zinc-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white font-bold'
                    : 'bg-[#070a10] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table of Benchmark Tools */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Pre-Normalization Raw Tool</th>
                  <th className="pb-3 font-semibold">Canonical Target Signature</th>
                  <th className="pb-3 font-semibold text-center">Cosine Similarity</th>
                  <th className="pb-3 font-semibold text-center">Params Preserved</th>
                  <th className="pb-3 font-semibold text-center">Schema Status</th>
                  <th className="pb-3 font-semibold text-right">Selection Consistency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTools.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 text-amber-300 font-semibold">{t.rawToolName}</td>
                    <td className="py-3 text-emerald-400 font-bold">{t.canonicalToolName}</td>
                    <td className="py-3 text-center text-orange-400 font-bold">{(t.semanticSimilarity * 100).toFixed(1)}%</td>
                    <td className="py-3 text-center text-zinc-300">{t.paramsPreserved}</td>
                    <td className="py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        Valid
                      </span>
                    </td>
                    <td className="py-3 text-right text-emerald-300 font-bold">{(t.selectionConsistency * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
