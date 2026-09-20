import React, { useState } from 'react';
import { Terminal, ArrowRight, Check, Copy, Sparkles, Shield, Cpu, Zap, Activity, Play } from 'lucide-react';

interface HeroSectionProps {
  onExploreStudio: () => void;
  onExploreProblem: () => void;
  onOpenVideoTour?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onExploreStudio, 
  onExploreProblem,
  onOpenVideoTour
}) => {
  const [copied, setCopied] = useState(false);

  const rawSampleSnippet = `{
  "tool_call": {
    "name": "search",
    "args": { "query": "data...", "limit": 5 }
  },
  "action_data": {
    "id": 882,
    "params": { "location": "US-NY", "date": "2024-10-27" }
  },
  "invoke": {
    "function": "db_query",
    "sql": "SELECT * FROM users..."
  }
}`;

  const canonicalSnippet = `{
  "canonical_action": {
    "tool_name": "normalized_search_v1",
    "parameters": {
      "query_string": "weather forecast",
      "location_code": "US-NY",
      "date_range": {
        "start": "2024-10-27T00:00:00Z",
        "end": "2024-10-27T23:59:59Z"
      },
      "result_limit": 10
    },
    "metadata": {
      "source_tool": "heterogeneous_cluster",
      "normalization_timestamp": "2024-10-27T18:00:00Z",
      "status": "normalized",
      "confidence_score": 0.99
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(canonicalSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden bg-cyber-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-600/15 via-amber-500/10 to-orange-400/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs font-mono">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>Deterministic Tool Normalization for Autonomous AI</span>
          </div>
        </div>

        {/* Primary Headline directly from Slide 1 */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Make AI agents understand <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              heterogeneous tools consistently
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Refracting chaotic, disparate API definitions into deterministic, Pydantic-validated canonical schemas with zero loss of semantic intent and zero invented parameters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {onOpenVideoTour && (
              <button
                onClick={onOpenVideoTour}
                className="flex items-center gap-2.5 px-6 py-3 bg-red-600/90 hover:bg-red-500 text-white font-semibold rounded-xl text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-red-400/50"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>Watch Demo Tour</span>
                <span className="text-xs text-red-200 font-mono bg-red-800/60 px-1.5 py-0.5 rounded">70s</span>
              </button>
            )}

            <button
              onClick={onExploreStudio}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl text-sm shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Normalization Studio</span>
            </button>

            <button
              onClick={onExploreProblem}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              <span>The Ambiguity Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Transformation Dual Terminal (Reproducing Slide 1) */}
        <div className="relative mt-12 max-w-5xl mx-auto">
          {/* Cybernetic grid overlay box */}
          <div className="p-1 rounded-2xl bg-gradient-to-b from-orange-500/30 via-zinc-800/40 to-zinc-900/80 shadow-2xl">
            <div className="bg-[#0b0f19] rounded-[14px] p-4 sm:p-6 border border-zinc-800/80 overflow-hidden relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">toolnorm-refraction-stream.json</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <Activity className="w-3 h-3" />
                    <span>Engine Active: 99.1% Fidelity</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Raw Heterogeneous Tools */}
                <div className="lg:col-span-5 bg-[#070a10] rounded-xl p-4 border border-zinc-800/80 font-mono text-xs">
                  <div className="flex items-center justify-between text-zinc-400 mb-2.5 pb-2 border-b border-zinc-800/60">
                    <span className="text-red-400/90 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      Raw Heterogeneous Tool Calls
                    </span>
                    <span className="text-[10px] text-zinc-500">Unstandardized</span>
                  </div>
                  <pre className="text-zinc-300 leading-relaxed overflow-x-auto text-[11px]">
                    <code>{rawSampleSnippet}</code>
                  </pre>
                  <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[11px] text-amber-400/90 flex items-center justify-between">
                    <span>⚠ Divergent keys: `args`, `params`, `sql`</span>
                  </div>
                </div>

                {/* Center: Animated Refraction Engine */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 p-0.5 shadow-lg shadow-orange-500/40 animate-pulse">
                      <div className="w-full h-full bg-[#0d121f] rounded-[14px] flex items-center justify-center">
                        <Cpu className="w-7 h-7 text-orange-400" />
                      </div>
                    </div>
                    {/* Laser pulses */}
                    <div className="hidden lg:block absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent to-orange-500" />
                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-gradient-to-r from-orange-500 to-emerald-400" />
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-[11px] font-mono font-bold text-orange-400 block tracking-wide">
                      ToolNorm AI
                    </span>
                    <span className="text-[10px] text-zinc-400 block">Refraction Prism</span>
                  </div>
                </div>

                {/* Right: Normalized Canonical Action */}
                <div className="lg:col-span-5 bg-[#070a10] rounded-xl p-4 border border-orange-500/30 font-mono text-xs relative">
                  <div className="flex items-center justify-between text-zinc-400 mb-2.5 pb-2 border-b border-zinc-800/60">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Canonical Action Schema
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800/60 hover:bg-zinc-700 transition-colors"
                      title="Copy canonical JSON"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-emerald-300/90 leading-relaxed overflow-x-auto text-[11px]">
                    <code>{canonicalSnippet}</code>
                  </pre>
                  <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[11px] text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" />
                      Deterministic Pydantic Output
                    </span>
                    <span className="font-bold">Confidence: 0.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars / Stats row (Slide 9 & 5 metrics) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/70 hover:border-orange-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">98.7%</div>
            <div className="text-xs font-semibold text-orange-400">Schema Preservation</div>
            <div className="text-[11px] text-zinc-400 mt-1">Pydantic structural integrity check</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/70 hover:border-orange-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">94.2%</div>
            <div className="text-xs font-semibold text-orange-400">Semantic Preservation</div>
            <div className="text-[11px] text-zinc-400 mt-1">all-MiniLM-L6-v2 cosine similarity</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/70 hover:border-orange-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">0</div>
            <div className="text-xs font-semibold text-orange-400">Invented Parameters</div>
            <div className="text-[11px] text-zinc-400 mt-1">Zero loss of functional capability</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/70 hover:border-orange-500/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">96.5%</div>
            <div className="text-xs font-semibold text-orange-400">Selection Consistency</div>
            <div className="text-[11px] text-zinc-400 mt-1">Autonomous prompt-to-tool routing</div>
          </div>
        </div>

      </div>
    </section>
  );
};
