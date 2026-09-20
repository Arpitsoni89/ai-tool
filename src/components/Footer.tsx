import React, { useState } from 'react';
import { Layers, Copy, Check, Terminal, Shield, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('pip install toolnorm-ai');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#05070c] border-t border-zinc-800/80 py-16 text-zinc-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">ToolNorm AI</span>
            </div>
            <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-sm">
              Standardized tool normalization and deterministic validation layer for autonomous AI agents. Eliminating semantic ambiguity across heterogeneous APIs.
            </p>
            
            {/* Pip install button */}
            <div className="pt-2">
              <div
                onClick={handleCopyInstall}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-orange-500/50 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                title="Click to copy command"
              >
                <Terminal className="w-3.5 h-3.5 text-orange-400" />
                <span>pip install toolnorm-ai</span>
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-500" />}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">Navigation</div>
            <div>
              <button onClick={() => onScrollToSection('problem')} className="hover:text-orange-400 transition-colors cursor-pointer">
                The Problem (Slide 2 & 3)
              </button>
            </div>
            <div>
              <button onClick={() => onScrollToSection('pipeline')} className="hover:text-orange-400 transition-colors cursor-pointer">
                Engine Pipeline (Slide 6 & 7)
              </button>
            </div>
            <div>
              <button onClick={() => onScrollToSection('studio')} className="hover:text-orange-400 transition-colors cursor-pointer">
                Live Studio (Slide 10)
              </button>
            </div>
            <div>
              <button onClick={() => onScrollToSection('clustering')} className="hover:text-orange-400 transition-colors cursor-pointer">
                Semantic Clustering (Slide 8)
              </button>
            </div>
            <div>
              <button onClick={() => onScrollToSection('benchmarks')} className="hover:text-orange-400 transition-colors cursor-pointer">
                100-Tool Benchmarks (Slide 9)
              </button>
            </div>
          </div>

          {/* Standards & Specs */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px] mb-3">Standards & Governance</div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Compatible with Pydantic v2.6+, OpenAPI 3.1.0, OpenAI Function Calling, and Anthropic Tools JSON specs.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3 h-3" />
                Pydantic Verified
              </span>
              <span>•</span>
              <span className="text-zinc-400">all-MiniLM-L6-v2</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} ToolNorm AI Project. Standardized Tool Layer for Enterprise Agents.
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
