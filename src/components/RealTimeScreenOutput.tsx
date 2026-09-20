import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Maximize2, 
  Minimize2, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Eye,
  Flame,
  ArrowRight
} from 'lucide-react';
import { RouterSimulationResult } from '../utils/routerSimulator';

interface RealTimeScreenOutputProps {
  query: string;
  mode: 'without_toolnorm' | 'with_toolnorm';
  isSimulating: boolean;
  simulationStep: number;
  simResult: RouterSimulationResult;
  onToggleMode: (newMode: 'without_toolnorm' | 'with_toolnorm') => void;
  onTriggerSimulation: () => void;
}

interface LogEntry {
  id: number;
  timestamp: string;
  tag: 'INIT' | 'PROMPT' | 'VECTOR' | 'HALLUCINATE' | 'ERROR' | 'INTERCEPT' | 'CANONICAL' | 'PYDANTIC' | 'DISPATCH' | 'SUCCESS';
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  detail?: string;
}

export const RealTimeScreenOutput: React.FC<RealTimeScreenOutputProps> = ({
  query,
  mode,
  isSimulating,
  simulationStep,
  simResult,
  onToggleMode,
  onTriggerSimulation
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'payload_diff' | 'thought_stream'>('console');
  const [copied, setCopied] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [crtEffect, setCrtEffect] = useState<boolean>(false);
  const [displayedLogs, setDisplayedLogs] = useState<LogEntry[]>([]);
  const [streamIndex, setStreamIndex] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const streamTimerRef = useRef<number | null>(null);

  // Generate deterministic log entries based on current query and mode
  const targetLogs: LogEntry[] = React.useMemo(() => {
    const timeNow = () => new Date().toISOString().substring(14, 23);
    const q = query.trim();

    if (mode === 'without_toolnorm') {
      return [
        {
          id: 1,
          timestamp: '00:00.012',
          tag: 'INIT',
          level: 'info',
          message: 'Autonomous Router runtime spawned on :3000 (Unshielded Mode)',
          detail: 'No schema normalization middleware active. Stochastic tool resolution enabled.'
        },
        {
          id: 2,
          timestamp: '00:00.041',
          tag: 'PROMPT',
          level: 'info',
          message: `Inbound user prompt received: "${q}"`,
          detail: `Intent identified: ${simResult.intent}`
        },
        {
          id: 3,
          timestamp: '00:00.082',
          tag: 'VECTOR',
          level: 'warn',
          message: `Candidate retrieval found ${simResult.candidateTools.length} conflicting microservice tools`,
          detail: `Semantic overlap detected: ${simResult.candidateTools.map(c => `${c.name} (${Math.round(c.semanticMatchScore * 100)}%)`).join(' vs ')}`
        },
        {
          id: 4,
          timestamp: '00:00.119',
          tag: 'HALLUCINATE',
          level: 'error',
          message: `STOCHASTIC GENERATION COLLISION: Synthesized hybrid parameter name`,
          detail: `Selected: "${simResult.withoutToolNorm.selectedToolName}". LLM blended competing schemas into invalid payload.`
        },
        {
          id: 5,
          timestamp: '00:00.147',
          tag: 'ERROR',
          level: 'error',
          message: `RUNTIME REJECTION: HTTP 422 Unprocessable Entity`,
          detail: simResult.withoutToolNorm.errorMessage
        },
        {
          id: 6,
          timestamp: '00:00.165',
          tag: 'ERROR',
          level: 'error',
          message: `FATAL: Pipeline halted. Deterministic Reliability: 0.0%`,
          detail: `Agent blocked waiting for clarification. Recovery latency: +${simResult.withoutToolNorm.latencyMs}ms wasted.`
        }
      ];
    } else {
      return [
        {
          id: 1,
          timestamp: '00:00.008',
          tag: 'INIT',
          level: 'info',
          message: 'ToolNorm AI Canonical Gateway initialized [DETERMINISTIC_BORDER: ACTIVE]',
          detail: 'Pydantic v2 validator loaded. Semantic cluster registry online.'
        },
        {
          id: 2,
          timestamp: '00:00.024',
          tag: 'PROMPT',
          level: 'info',
          message: `Inbound prompt captured: "${q}"`,
          detail: `Cluster mapping intent: ${simResult.category.toUpperCase()}`
        },
        {
          id: 3,
          timestamp: '00:00.052',
          tag: 'INTERCEPT',
          level: 'info',
          message: `Trapping stochastic output before external microservice dispatch`,
          detail: `Intercepted ${simResult.candidateTools.length} heterogeneous variants. Routing to orthogonal canonical hub.`
        },
        {
          id: 4,
          timestamp: '00:00.081',
          tag: 'CANONICAL',
          level: 'success',
          message: `Matched Canonical Action: "${simResult.withToolNorm.canonicalToolName}"`,
          detail: `Orthogonal similarity: 0.992 • Semantic Ambiguity: 0.000`
        },
        {
          id: 5,
          timestamp: '00:00.103',
          tag: 'PYDANTIC',
          level: 'success',
          message: 'Pydantic v2 Schema Coercion & Contract Validation Passed',
          detail: `Enforced: additionalProperties=false. Zero hallucinated fields, zero dropped arguments.`
        },
        {
          id: 6,
          timestamp: '00:00.124',
          tag: 'DISPATCH',
          level: 'success',
          message: `Normalized payload forwarded to execution target`,
          detail: `Payload: ${JSON.stringify(simResult.withToolNorm.normalizedPayload)}`
        },
        {
          id: 7,
          timestamp: '00:00.138',
          tag: 'SUCCESS',
          level: 'success',
          message: `EXECUTION VERIFIED: HTTP 200 OK in ${simResult.withToolNorm.latencyMs}ms (Deterministic 100%)`,
          detail: `Downstream agent received clean, structured output without crashes.`
        }
      ];
    }
  }, [query, mode, simResult]);

  // Stream logs progressively whenever targetLogs or mode changes or when simulation triggers
  useEffect(() => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setDisplayedLogs([]);
    setStreamIndex(0);
    setIsStreaming(true);

    let current = 0;
    streamTimerRef.current = window.setInterval(() => {
      if (current < targetLogs.length) {
        const item = targetLogs[current];
        setDisplayedLogs(prev => [...prev, item]);
        current++;
        setStreamIndex(current);
      } else {
        setIsStreaming(false);
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      }
    }, 180);

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [targetLogs, mode, isSimulating]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedLogs, autoScroll]);

  const handleCopyLogs = () => {
    const text = displayedLogs.map(l => `[${l.timestamp}] [${l.tag}] ${l.message} - ${l.detail || ''}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplay = () => {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setDisplayedLogs([]);
    setStreamIndex(0);
    setIsStreaming(true);

    let current = 0;
    streamTimerRef.current = window.setInterval(() => {
      if (current < targetLogs.length) {
        setDisplayedLogs(prev => [...prev, targetLogs[current]]);
        current++;
        setStreamIndex(current);
      } else {
        setIsStreaming(false);
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      }
    }, 150);
  };

  return (
    <div className="mt-8 bg-[#06080e] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden font-mono">
      
      {/* Terminal Screen Header Bar */}
      <div className="bg-[#0b0f19] px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Window dots + Live indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600 shadow-xs" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600 shadow-xs" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600 shadow-xs" />
          </div>

          <div className="h-4 w-px bg-zinc-700/80 mx-0.5 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              REAL-TIME SCREEN OUT: <span className="text-orange-400">/dev/tty0</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              Live Router Telemetry
            </span>
          </div>
        </div>

        {/* Center: Live stream indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isStreaming 
                ? 'bg-amber-400' 
                : mode === 'without_toolnorm' ? 'bg-red-400' : 'bg-emerald-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isStreaming 
                ? 'bg-amber-500' 
                : mode === 'without_toolnorm' ? 'bg-red-500' : 'bg-emerald-500'
            }`} />
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${
            isStreaming 
              ? 'text-amber-400' 
              : mode === 'without_toolnorm' ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {isStreaming ? 'STREAMING TRACE...' : mode === 'without_toolnorm' ? 'CRASH INTERCEPTED' : 'CANONICAL ROUTED'}
          </span>
        </div>

        {/* Right: Screen Controls & Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick toggle mode directly from the screen */}
          <button
            onClick={() => onToggleMode(mode === 'without_toolnorm' ? 'with_toolnorm' : 'without_toolnorm')}
            title="Toggle between Unshielded Failure vs ToolNorm Shielded"
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
              mode === 'without_toolnorm'
                ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {mode === 'without_toolnorm' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Switch to ToolNorm Shield</span>
                <span className="sm:hidden">Shield</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Switch to Unshielded</span>
                <span className="sm:hidden">Unshielded</span>
              </>
            )}
          </button>

          {/* Re-stream replay button */}
          <button
            onClick={handleReplay}
            title="Re-stream real-time log execution"
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy logs */}
          <button
            onClick={handleCopyLogs}
            title="Copy real-time terminal output"
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Screen Tabs Bar: Console Output | Payload Diff | Agent Thought Stream */}
      <div className="bg-[#090c14] px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'console'
                ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Stdout / Stderr Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('payload_diff')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payload_diff'
                ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Payload Diff Screen</span>
          </button>

          <button
            onClick={() => setActiveTab('thought_stream')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'thought_stream'
                ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Chain of Thought</span>
          </button>
        </div>

        {/* Screen Status Info */}
        <div className="hidden md:flex items-center gap-4 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="text-zinc-400">FPS:</span> 60.0
          </span>
          <span className="flex items-center gap-1">
            <span className="text-zinc-400">Latency:</span>{' '}
            <span className={mode === 'without_toolnorm' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {mode === 'without_toolnorm' ? `${simResult.withoutToolNorm.latencyMs}ms (Wasted)` : `${simResult.withToolNorm.latencyMs}ms`}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-zinc-400">Reliability:</span>{' '}
            <span className={mode === 'without_toolnorm' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {mode === 'without_toolnorm' ? '0% FAIL' : '100% PASS'}
            </span>
          </span>
        </div>
      </div>

      {/* Main Terminal Screen Output Display */}
      <div className={`p-4 sm:p-5 min-h-[320px] max-h-[420px] overflow-y-auto relative text-xs sm:text-[13px] leading-relaxed select-text ${
        crtEffect ? 'bg-[#030508] shadow-inner' : 'bg-[#05070d]'
      }`}>
        
        {/* CRT Scanline Visual Effect Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent opacity-40 bg-[length:100%_4px]" />

        {/* Tab 1: Live Stdout/Stderr Console */}
        {activeTab === 'console' && (
          <div className="space-y-2 relative z-10">
            {/* Terminal Command Invocation */}
            <div className="text-zinc-400 pb-2 mb-2 border-b border-zinc-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">agent@toolnorm:~$</span>
                <span className="text-zinc-200">
                  ./dispatch_router --mode={mode} --query="{query}" --pydantic-strict
                </span>
              </div>
              <span className="text-[11px] text-zinc-600 hidden sm:inline">PID 10842</span>
            </div>

            {/* Render each log entry progressively */}
            {displayedLogs.map((log) => {
              const tagColor = 
                log.level === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                log.level === 'warn' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                log.level === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';

              const msgColor =
                log.level === 'error' ? 'text-red-300 font-semibold' :
                log.level === 'warn' ? 'text-amber-300 font-medium' :
                log.level === 'success' ? 'text-emerald-300 font-semibold' :
                'text-zinc-300';

              return (
                <div key={log.id} className="flex items-start gap-2.5 py-0.5 animate-in fade-in duration-200">
                  {/* Timestamp */}
                  <span className="text-zinc-600 select-none text-[11px] shrink-0 font-mono">
                    [{log.timestamp}]
                  </span>

                  {/* Tag badge */}
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase shrink-0 font-mono ${tagColor}`}>
                    {log.tag}
                  </span>

                  {/* Message & detail */}
                  <div className="flex-1 min-w-0">
                    <span className={msgColor}>{log.message}</span>
                    {log.detail && (
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5 pl-2 border-l border-zinc-800">
                        {log.detail}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Blinking Cursor at bottom of console */}
            <div className="flex items-center gap-2 pt-2 text-zinc-500">
              <span className="text-orange-400 font-bold">&gt;</span>
              {isStreaming ? (
                <span className="text-zinc-400 italic text-[11px] animate-pulse">
                  Streaming execution frame {streamIndex}/{targetLogs.length}...
                </span>
              ) : (
                <span className="inline-block w-2 h-4 bg-orange-400 animate-pulse" />
              )}
            </div>

            <div ref={terminalEndRef} />
          </div>
        )}

        {/* Tab 2: Payload Diff Screen */}
        {activeTab === 'payload_diff' && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Without ToolNorm (Raw Confused Payload) */}
            <div className="p-3.5 rounded-xl bg-[#090d16] border border-red-500/30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-red-500/20 text-xs text-red-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Stochastic Unshielded Output</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300">
                  REJECTED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mb-2">
                Target: <code className="text-amber-300">{simResult.withoutToolNorm.selectedToolName || 'ambiguous_target'}</code>
              </div>
              <pre className="p-3 rounded-lg bg-black/70 text-red-300 text-xs overflow-x-auto border border-red-500/20">
                {JSON.stringify(simResult.withoutToolNorm.generatedPayload, null, 2)}
              </pre>
              <div className="mt-3 p-2 rounded bg-red-950/40 border border-red-500/30 text-[11px] text-red-400">
                <strong>Failure Diagnostic:</strong> {simResult.withoutToolNorm.errorMessage}
              </div>
            </div>

            {/* With ToolNorm (Canonical Pydantic Coerced) */}
            <div className="p-3.5 rounded-xl bg-[#090d16] border border-emerald-500/30">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-500/20 text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ToolNorm Canonical Output</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  VALIDATED
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mb-2">
                Canonical Action: <code className="text-emerald-300">{simResult.withToolNorm.canonicalToolName}</code>
              </div>
              <pre className="p-3 rounded-lg bg-black/70 text-emerald-300 text-xs overflow-x-auto border border-emerald-500/20">
                {JSON.stringify(simResult.withToolNorm.normalizedPayload, null, 2)}
              </pre>
              <div className="mt-3 p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-400">
                <strong>Contract Guarantee:</strong> 100% match, zero parameter drift, strict Pydantic model adhered.
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Agent Thought Stream */}
        {activeTab === 'thought_stream' && (
          <div className="relative z-10 space-y-3">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
              <div className="flex items-center justify-between text-zinc-400 font-bold mb-1">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agent Internal Deliberation Frame:</span>
                </span>
                <span className="text-[10px] text-zinc-500">Transformer Layer 24</span>
              </div>
              <p className="text-zinc-300 italic leading-relaxed">
                "{mode === 'without_toolnorm' 
                  ? `User is querying for "${query}". Checking candidate tools in catalog: Tool A has 'city', Tool B has 'location', Tool C has 'cityName'. Since all 3 have similar vector embeddings (>0.87), I am synthesizing a hybrid parameter 'loc_target' to accommodate multiple endpoints... [WARNING: Unvalidated synthesis]`
                  : `User is querying for "${query}". ToolNorm Canonical Layer intercepted prompt. Routing directly to orthogonal canonical cluster 'WEATHER_GET_CONDITIONS'. Coercing inputs into canonical contract: { location: '${query.includes('Jaipur') ? 'Jaipur, India' : 'Target'}', temperature_unit: 'celsius' }. Dispatching with additionalProperties=false.`
                }"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#0a0d18] border border-zinc-800">
                <span className="text-zinc-500 block">Candidate Tool 1:</span>
                <span className="text-zinc-200 font-bold">get_weather</span>
                <span className="text-zinc-400 block mt-0.5 text-[10px]">Sim: 0.88 (Legacy REST)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0a0d18] border border-zinc-800">
                <span className="text-zinc-500 block">Candidate Tool 2:</span>
                <span className="text-zinc-200 font-bold">weather_lookup</span>
                <span className="text-zinc-400 block mt-0.5 text-[10px]">Sim: 0.89 (Internal RPC)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0a0d18] border border-zinc-800">
                <span className="text-zinc-500 block">Candidate Tool 3:</span>
                <span className="text-zinc-200 font-bold">currentWeather</span>
                <span className="text-zinc-400 block mt-0.5 text-[10px]">Sim: 0.87 (Client SDK)</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Terminal Screen Footer Status Bar */}
      <div className="bg-[#0b0f19] px-4 py-2 border-t border-zinc-800 flex flex-wrap items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">Buffer:</span> 1,024 lines
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400">
            <span>Encoding:</span> UTF-8 / JSON
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-zinc-400">
            <span>Pydantic:</span> v2.7.1
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-zinc-500">Displaying:</span>
          <span className="text-zinc-200 font-bold">{displayedLogs.length} events</span>
          <button
            onClick={onTriggerSimulation}
            className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Re-run Simulation</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
};
