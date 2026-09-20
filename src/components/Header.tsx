import React from 'react';
import { Layers, ShieldCheck, Terminal, Cpu, Sparkles, Play, Video } from 'lucide-react';

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenVideoTour?: () => void;
  isVideoTourActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onScrollToSection,
  onOpenVideoTour,
  isVideoTourActive = false
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#080b11]/85 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollToSection('hero')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20 text-white font-mono font-bold text-lg">
            <Layers className="w-5 h-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#080b11]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono">ToolNorm</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Canonical Tool Normalization</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onScrollToSection('problem')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
          >
            The Problem
          </button>
          <button
            onClick={() => onScrollToSection('pipeline')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
          >
            Engine Pipeline
          </button>
          <button
            onClick={() => onScrollToSection('studio')}
            className="px-3 py-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Live Studio
          </button>
          <button
            onClick={() => onScrollToSection('clustering')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
          >
            Clustering
          </button>
          <button
            onClick={() => onScrollToSection('benchmarks')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
          >
            Benchmarks
          </button>
          <button
            onClick={() => onScrollToSection('stack')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
          >
            Stack & Roadmap
          </button>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center space-x-2.5">
          {/* Watch Video Demo Tour Button */}
          {onOpenVideoTour && (
            <button
              onClick={onOpenVideoTour}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
                isVideoTourActive 
                  ? 'bg-red-500/15 text-red-400 border-red-500/40 shadow-sm shadow-red-500/20' 
                  : 'bg-zinc-900/90 text-zinc-200 hover:text-white hover:bg-zinc-800 border-zinc-700/80 hover:border-orange-500/40'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isVideoTourActive ? 'bg-red-400 opacity-75' : 'bg-orange-400 opacity-75'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isVideoTourActive ? 'bg-red-500' : 'bg-orange-500'}`}></span>
              </span>
              <span className="hidden sm:inline">Demo Tour</span>
              <span className="sm:hidden">Tour</span>
            </button>
          )}

          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full text-[11px] text-zinc-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pydantic v2 Verified</span>
          </div>

          <button
            onClick={() => onScrollToSection('studio')}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Inspect Engine</span>
          </button>
        </div>
      </div>
    </header>
  );
};
