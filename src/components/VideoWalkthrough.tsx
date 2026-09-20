import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  X, 
  Sparkles, 
  Activity, 
  Layers, 
  Video, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export interface Chapter {
  id: number;
  sectionId: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  speechText: string;
  actionHint: string;
  keyHighlight: string;
}

export const WALKTHROUGH_CHAPTERS: Chapter[] = [
  {
    id: 0,
    sectionId: 'hero',
    title: '01. Live Tool Refraction',
    subtitle: 'Slide 1: Deterministic Tool Normalization',
    durationSeconds: 11,
    speechText: 'Autonomous AI agents frequently fail when calling heterogeneous tools. ToolNorm AI standardizes chaotic tool definitions into validated canonical schemas in real time.',
    actionHint: 'Observing raw JSON payload refracting into canonical format',
    keyHighlight: '99.1% Fidelity • Sub-15ms Latency'
  },
  {
    id: 1,
    sectionId: 'problem',
    title: '02. Semantic Ambiguity Modes',
    subtitle: 'Slides 2 & 3: Fragmented Languages & Failures',
    durationSeconds: 12,
    speechText: 'Notice how three weather tools require different parameters like city, location, or cityName. Without normalization, LLMs hallucinate invalid parameters and crash.',
    actionHint: 'Simulating agent query routing failure vs ToolNorm rescue',
    keyHighlight: 'Hallucinated Params • Trigger Collision • Type Drift'
  },
  {
    id: 2,
    sectionId: 'pipeline',
    title: '03. Deterministic Architecture',
    subtitle: 'Slides 6 & 7: Trapping Stochastic LLM Outputs',
    durationSeconds: 12,
    speechText: 'Our architecture traps stochastic LLM outputs inside deterministic boundaries—combining Pydantic v2 coercion with MiniLM cosine similarity guards.',
    actionHint: 'Traversing the 6-stage deterministic verification pipeline',
    keyHighlight: 'Pydantic v2 • Strict Type Assertions • Cosine Guards'
  },
  {
    id: 3,
    sectionId: 'studio',
    title: '04. Live Normalization Studio',
    subtitle: 'Slides 4, 5 & 10: Real-Time Schema Transformation',
    durationSeconds: 14,
    speechText: 'In the live studio, explore instant schema transformation, dynamic JSON Schema Draft 2020-12 generation, and rigorous validation checks.',
    actionHint: 'Refracting heterogeneous tools into validated JSON Schema & Pydantic models',
    keyHighlight: 'Draft 2020-12 • Zero Invented Fields • Real-Time Linter'
  },
  {
    id: 4,
    sectionId: 'clustering',
    title: '05. Semantic Hub Clustering',
    subtitle: 'Slide 8: Orthogonal Tool Hubs',
    durationSeconds: 11,
    speechText: 'Instead of confusing agents with hundreds of similar tools, ToolNorm groups them into orthogonal semantic clusters with zero trigger collisions.',
    actionHint: 'Measuring cluster cosine separation and intent dispatching',
    keyHighlight: '96.5% Selection Accuracy • Vector Centroids'
  },
  {
    id: 5,
    sectionId: 'benchmarks',
    title: '06. 100-Tool Dataset Evaluation',
    subtitle: 'Slide 9: Empirical Validation Metrics',
    durationSeconds: 11,
    speechText: 'Empirically tested across 100 diverse enterprise tools—achieving 99.4% execution fidelity with less than 15 milliseconds of latency overhead.',
    actionHint: 'Reviewing 4 architectural gauges and search catalog',
    keyHighlight: '99.4% Reliability • 100% Parameter Match • 14ms Overhead'
  },
  {
    id: 6,
    sectionId: 'stack',
    title: '07. Tech Stack & Registry Roadmap',
    subtitle: 'Slides 11 & 12: Production-Ready Foundation',
    durationSeconds: 11,
    speechText: 'Built purely on standard validation primitives, paving the path to autonomous universal registries for production multi-agent systems.',
    actionHint: 'Reviewing standard Python ML matrix and universal registry evolution',
    keyHighlight: 'No Vendor Lock-in • Universal Autonomous Registry'
  }
];

interface VideoWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const VideoWalkthrough: React.FC<VideoWalkthroughProps> = ({
  isOpen,
  onClose,
  onScrollToSection
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [chapterElapsedSeconds, setChapterElapsedSeconds] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isCleanMode, setIsCleanMode] = useState<boolean>(false); // Hides controls for screen recording
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const totalDurationSeconds = useMemo(() => {
    return WALKTHROUGH_CHAPTERS.reduce((acc, chap) => acc + chap.durationSeconds, 0);
  }, []);

  const currentChapter = WALKTHROUGH_CHAPTERS[currentChapterIndex] || WALKTHROUGH_CHAPTERS[0];

  // Calculate cumulative elapsed seconds across all chapters
  const cumulativeElapsedSeconds = useMemo(() => {
    let elapsed = 0;
    for (let i = 0; i < currentChapterIndex; i++) {
      elapsed += WALKTHROUGH_CHAPTERS[i].durationSeconds;
    }
    return elapsed + chapterElapsedSeconds;
  }, [currentChapterIndex, chapterElapsedSeconds]);

  // Gentle synthesizer chime on chapter change if not muted
  const playSynthesizedChime = (freq: number = 520) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted
    }
  };

  // Scroll to current section when chapter changes
  useEffect(() => {
    if (isOpen && currentChapter) {
      onScrollToSection(currentChapter.sectionId);
      playSynthesizedChime(440 + currentChapterIndex * 40);
    }
  }, [currentChapterIndex, isOpen]);

  // Main playback timer loop
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervalMs = 200;
    const stepSeconds = (intervalMs / 1000) * playbackSpeed;

    timerRef.current = window.setInterval(() => {
      setChapterElapsedSeconds((prev) => {
        const next = prev + stepSeconds;
        if (next >= currentChapter.durationSeconds) {
          // Chapter finished, advance to next or loop
          if (currentChapterIndex < WALKTHROUGH_CHAPTERS.length - 1) {
            setCurrentChapterIndex(curr => curr + 1);
            return 0;
          } else {
            // End reached: pause
            setIsPlaying(false);
            return currentChapter.durationSeconds;
          }
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, isPlaying, currentChapterIndex, playbackSpeed, currentChapter.durationSeconds]);

  // Keyboard shortcut listener (Space = Play/Pause, Left/Right = Chapters, Esc = Close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextChapter();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevChapter();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentChapterIndex]);

  const handleNextChapter = () => {
    if (currentChapterIndex < WALKTHROUGH_CHAPTERS.length - 1) {
      setCurrentChapterIndex(c => c + 1);
      setChapterElapsedSeconds(0);
    }
  };

  const handlePrevChapter = () => {
    if (chapterElapsedSeconds > 2) {
      setChapterElapsedSeconds(0);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(c => c - 1);
      setChapterElapsedSeconds(0);
    }
  };

  const handleSeekChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setChapterElapsedSeconds(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setCurrentChapterIndex(0);
    setChapterElapsedSeconds(0);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Top Banner: Video Tour Active Mode Indicator */}
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2 bg-[#0b0f19]/90 backdrop-blur-md border border-orange-500/40 rounded-full shadow-2xl text-xs font-mono text-zinc-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 ${isPlaying ? 'opacity-75' : 'opacity-0'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-red-500' : 'bg-zinc-500'}`}></span>
            </span>
            <span className="font-bold text-orange-400 uppercase tracking-wider">
              {isPlaying ? 'Tour Active • Playing' : 'Tour Paused'}
            </span>
          </div>

          <div className="h-3.5 w-px bg-zinc-700" />

          <span className="text-zinc-300 font-semibold hidden sm:inline">
            {currentChapter.title}
          </span>

          <div className="h-3.5 w-px bg-zinc-700 hidden sm:block" />

          <span className="text-zinc-400">
            {formatTime(cumulativeElapsedSeconds)} / {formatTime(totalDurationSeconds)}
          </span>

          <button
            onClick={() => setIsCleanMode(!isCleanMode)}
            title={isCleanMode ? "Show Overlays & Controls" : "Hide Overlays for Screen Recording"}
            className="ml-1 p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            {isCleanMode ? <Eye className="w-3.5 h-3.5 text-orange-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            title="Exit Video Tour"
            className="ml-1 p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Subtitle & Narration HUD (can be hidden in Clean Mode) */}
      {!isCleanMode && (
        <div className="fixed bottom-28 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-3xl pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#080b11]/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 ring-1 ring-white/10">
            {/* Top row: Chapter metadata and live equalizer */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-orange-500/30">
                  Chapter {currentChapterIndex + 1} of {WALKTHROUGH_CHAPTERS.length}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {currentChapter.subtitle}
                </span>
              </div>

              {/* Audio voiceover visualizer bars */}
              <div className="flex items-center gap-1">
                <div className="flex items-end gap-0.5 h-3 px-1">
                  {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                    <span 
                      key={i}
                      className="w-1 bg-orange-400 rounded-full transition-all duration-150"
                      style={{
                        height: isPlaying ? `${Math.max(20, (h * ((i + 1) % 3 + 1)) % 100)}%` : '20%',
                        opacity: isPlaying ? 0.9 : 0.3
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-orange-400/90 ml-1 font-semibold">
                  AI Narrator
                </span>
              </div>
            </div>

            {/* Narration caption body */}
            <p className="text-sm sm:text-base font-sans text-zinc-100 font-medium leading-relaxed">
              "{currentChapter.speechText}"
            </p>

            {/* Live action simulated status bar */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[11px] font-medium">{currentChapter.actionHint}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[11px]">
                <span className="text-orange-400 font-bold">{currentChapter.keyHighlight}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Dock Controller (Always accessible at the bottom) */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-4xl pointer-events-auto transition-opacity duration-300 ${isCleanMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
        <div className="bg-[#0b0f19]/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black ring-1 ring-white/10">
          
          {/* Progress timeline with 7 segmented chapter blocks */}
          <div className="mb-3">
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
              {WALKTHROUGH_CHAPTERS.map((chap, idx) => {
                const isPast = idx < currentChapterIndex;
                const isCurrent = idx === currentChapterIndex;
                const chapterPercent = isCurrent 
                  ? (chapterElapsedSeconds / chap.durationSeconds) * 100 
                  : isPast ? 100 : 0;

                return (
                  <button
                    key={chap.id}
                    onClick={() => handleSeekChapter(idx)}
                    title={`${chap.title} (${chap.durationSeconds}s)`}
                    className="group relative h-2 rounded-full bg-zinc-800 overflow-hidden cursor-pointer hover:h-2.5 transition-all"
                  >
                    <div 
                      className={`h-full transition-all duration-200 ${
                        isCurrent 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-400' 
                          : isPast 
                            ? 'bg-orange-500/60' 
                            : 'bg-transparent'
                      }`}
                      style={{ width: `${chapterPercent}%` }}
                    />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
                  </button>
                );
              })}
            </div>

            {/* Chapter labels on larger screens */}
            <div className="hidden md:grid grid-cols-7 gap-1.5 text-[9px] font-mono text-zinc-500 text-center">
              {WALKTHROUGH_CHAPTERS.map((chap, idx) => (
                <span 
                  key={chap.id}
                  onClick={() => handleSeekChapter(idx)}
                  className={`truncate cursor-pointer hover:text-orange-300 ${idx === currentChapterIndex ? 'text-orange-400 font-bold' : ''}`}
                >
                  {chap.title.split('. ')[1] || chap.title}
                </span>
              ))}
            </div>
          </div>

          {/* Player controls row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Previous, Play/Pause, Next, Replay */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0 && chapterElapsedSeconds < 1}
                title="Previous Chapter (Left Arrow)"
                className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause Tour (Space)" : "Resume Tour (Space)"}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex === WALKTHROUGH_CHAPTERS.length - 1}
                title="Next Chapter (Right Arrow)"
                className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                title="Restart Tour From Beginning"
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

              {/* Timestamp */}
              <div className="text-xs font-mono text-zinc-400 px-2 hidden sm:block">
                <span className="text-zinc-100 font-bold">{formatTime(cumulativeElapsedSeconds)}</span>
                <span className="mx-1 text-zinc-600">/</span>
                <span>{formatTime(totalDurationSeconds)}</span>
              </div>
            </div>

            {/* Center: Current active chapter info */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-white font-bold">{currentChapter.title}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 truncate max-w-[200px]">{currentChapter.keyHighlight}</span>
            </div>

            {/* Right: Audio Chime Toggle, Speed Selector, Clean Recording Toggle, Close */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Sound Chimes */}
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (!nextMuted) playSynthesizedChime(600);
                }}
                title={isMuted ? "Unmute Chapter Chimes" : "Mute Chimes"}
                className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isMuted ? 'text-zinc-500 hover:text-zinc-300' : 'text-orange-400 bg-orange-500/10'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-[11px] font-mono">
                {[1, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      playbackSpeed === speed 
                        ? 'bg-orange-500 text-white font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Screen Record Clean Mode Toggle */}
              <button
                onClick={() => setIsCleanMode(!isCleanMode)}
                title={isCleanMode ? "Show Narration Overlays" : "Clean Mode (Hide captions for Screen Recording with Loom/OBS)"}
                className={`p-2 rounded-lg text-xs transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 ${
                  isCleanMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] hidden md:inline">
                  {isCleanMode ? 'Recording View' : 'Record Mode'}
                </span>
              </button>

              <button
                onClick={onClose}
                title="Exit Tour"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
