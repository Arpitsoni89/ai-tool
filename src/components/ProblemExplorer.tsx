import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Activity, 
  FileCode2, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Terminal,
  Zap,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { simulateAgentRouting, RouterSimulationResult } from '../utils/routerSimulator';
import { RealTimeScreenOutput } from './RealTimeScreenOutput';

export const ProblemExplorer: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState<string>('What is the weather in Jaipur?');
  const [mode, setMode] = useState<'without_toolnorm' | 'with_toolnorm'>('without_toolnorm');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [selectedFailureMode, setSelectedFailureMode] = useState<1 | 2 | 3>(1);
  const [showTraceLogs, setShowTraceLogs] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sampleQueries = [
    'What is the weather in Jaipur?',
    'Did customer txn #882 payment complete?',
    'How many units of SKU-409 remain in stock?',
    'Schedule sync with product lead tomorrow at 3pm'
  ];

  // Derive dynamic simulation data from current query
  const simResult: RouterSimulationResult = simulateAgentRouting(activeQuery);

  const runSimulation = (targetMode: 'without_toolnorm' | 'with_toolnorm' = mode) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMode(targetMode);
    setSimulationState('running');
    setSimulationStep(1);

    // Stage 1: Vector intent parsing
    timerRef.current = setTimeout(() => {
      setSimulationStep(2);

      // Stage 2: Catalog matching & cosine similarity
      timerRef.current = setTimeout(() => {
        setSimulationStep(3);

        // Stage 3: Schema verification & dispatch
        timerRef.current = setTimeout(() => {
          setSimulationState('completed');
          setSimulationStep(4);
        }, 320);
      }, 350);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleQueryPreset = (q: string) => {
    setActiveQuery(q);
    // Auto-run simulation with new query
    if (timerRef.current) clearTimeout(timerRef.current);
    setSimulationState('running');
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
      setTimeout(() => {
        setSimulationStep(3);
        setTimeout(() => {
          setSimulationState('completed');
          setSimulationStep(4);
        }, 280);
      }, 300);
    }, 280);
  };

  return (
    <section id="problem" className="py-20 bg-[#070a10] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Slide 2) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Fundamental Bottleneck in Autonomous AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Identical functions speak <br className="hidden sm:block" />
            <span className="text-red-400">entirely different languages</span>
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            When three independent microservices implement identical capabilities, their syntax, parameter labels, and type assumptions diverge wildly—breaking downstream LLM agent reliability.
          </p>
        </div>

        {/* Visual representation of Slide 2: 3 Fragmented Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Tool 1 */}
          <div className="bg-[#0b0f19] rounded-xl p-5 border border-zinc-800 relative hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-3">
              <span className="text-xs font-mono font-bold text-zinc-300">Tool A: Legacy Weather</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">REST v1</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-zinc-300 bg-[#070a10] p-3 rounded-lg border border-zinc-800/80">
              <div><span className="text-zinc-500">"name":</span> <span className="text-amber-300 font-semibold">"get_weather"</span>,</div>
              <div><span className="text-zinc-500">"description":</span> <span className="text-zinc-300">"Gets weather info for a place."</span>,</div>
              <div>
                <span className="text-zinc-500">"parameters":</span> [&#123;
                <div className="pl-4">
                  <span className="text-zinc-500">"name":</span> <span className="text-red-400 font-bold underline decoration-red-500">"city"</span>
                </div>
                &#125;]
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Uses key `city` (string)</span>
            </div>
          </div>

          {/* Tool 2 */}
          <div className="bg-[#0b0f19] rounded-xl p-5 border border-zinc-800 relative hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-3">
              <span className="text-xs font-mono font-bold text-zinc-300">Tool B: Meteo Microservice</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Internal RPC</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-zinc-300 bg-[#070a10] p-3 rounded-lg border border-zinc-800/80">
              <div><span className="text-zinc-500">"name":</span> <span className="text-amber-300 font-semibold">"weather_lookup"</span>,</div>
              <div><span className="text-zinc-500">"description":</span> <span className="text-zinc-300">"Returns current meteorological conditions."</span>,</div>
              <div>
                <span className="text-zinc-500">"parameters":</span> [&#123;
                <div className="pl-4">
                  <span className="text-zinc-500">"name":</span> <span className="text-red-400 font-bold underline decoration-red-500">"location"</span>
                </div>
                &#125;]
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Uses key `location` (geo/address)</span>
            </div>
          </div>

          {/* Tool 3 */}
          <div className="bg-[#0b0f19] rounded-xl p-5 border border-zinc-800 relative hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-3">
              <span className="text-xs font-mono font-bold text-zinc-300">Tool C: Mobile Client SDK</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">GraphQL</span>
            </div>
            <div className="space-y-2 font-mono text-xs text-zinc-300 bg-[#070a10] p-3 rounded-lg border border-zinc-800/80">
              <div><span className="text-zinc-500">"name":</span> <span className="text-amber-300 font-semibold">"currentWeather"</span>,</div>
              <div><span className="text-zinc-500">"description":</span> <span className="text-zinc-300">"Find current weather based on a city."</span>,</div>
              <div>
                <span className="text-zinc-500">"parameters":</span> [&#123;
                <div className="pl-4">
                  <span className="text-zinc-500">"name":</span> <span className="text-red-400 font-bold underline decoration-red-500">"cityName"</span>
                </div>
                &#125;]
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Uses camelCase `cityName`</span>
            </div>
          </div>
        </div>

        {/* Slide 3: Interactive Agent Router Failure Simulator */}
        <div className="bg-[#0b0f19] rounded-2xl border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">Slide 3 Interactive Diagnostic</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Live Router Engine
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">Semantic Ambiguity Breaks Autonomous Tool Selection</h3>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start md:self-auto">
              <button
                onClick={() => runSimulation('without_toolnorm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'without_toolnorm'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Without ToolNorm (Raw)</span>
              </button>
              <button
                onClick={() => runSimulation('with_toolnorm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'with_toolnorm'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>With ToolNorm (Canonical)</span>
              </button>
            </div>
          </div>

          {/* User Prompt Input & Working Simulate Agent Router Button */}
          <div className="mb-6">
            <label className="block text-xs font-mono text-zinc-400 mb-2 flex items-center justify-between">
              <span>Agent Input Prompt:</span>
              <span className="text-[11px] text-zinc-500">Press Enter or click Simulate to dispatch</span>
            </label>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={activeQuery}
                  onChange={(e) => setActiveQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') runSimulation(mode);
                  }}
                  className="w-full bg-[#070a10] border border-zinc-700/80 hover:border-zinc-600 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
                  placeholder="Type query to test autonomous router..."
                />
              </div>

              {/* Working Simulate Agent Router Button */}
              <button
                onClick={() => runSimulation(mode)}
                disabled={simulationState === 'running'}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg disabled:opacity-80 shrink-0 ${
                  simulationState === 'running'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    : mode === 'without_toolnorm'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-500/20'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                }`}
              >
                {simulationState === 'running' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Routing Step {simulationStep}/3...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Simulate Agent Router</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[11px] text-zinc-500 font-mono">Test Scenarios:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQueryPreset(q)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                    activeQuery === q
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Active Simulation Step Progress Bar */}
          {simulationState === 'running' && (
            <div className="mb-6 p-3 rounded-xl bg-[#070a10] border border-amber-500/40 font-mono text-xs animate-pulse">
              <div className="flex items-center justify-between text-amber-300 font-bold mb-2">
                <span className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {simulationStep === 1 && 'Phase 1: Parsing user prompt intent and semantic vectors...'}
                    {simulationStep === 2 && 'Phase 2: Calculating cosine similarity against heterogeneous candidate schemas...'}
                    {simulationStep === 3 && 'Phase 3: Evaluating parameter contracts and deterministic border...'}
                  </span>
                </span>
                <span>{Math.round((simulationStep / 3) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${(simulationStep / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Execution Simulation Flow (Slide 3 Visual Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* 1. Prompt Box */}
            <div className="lg:col-span-3 bg-[#070a10] p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Incoming Intent</span>
                <p className="text-xs font-semibold text-white font-mono break-words">"{activeQuery}"</p>
                <div className="mt-2.5 p-2 rounded bg-zinc-900/80 border border-zinc-800/80 text-[10px] font-mono text-zinc-400">
                  <span className="text-zinc-500">Category:</span> <span className="text-orange-400 uppercase font-bold">{simResult.category}</span>
                  <div className="text-zinc-400 mt-1 line-clamp-2">{simResult.intent}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  <span>Router Input</span>
                </span>
                <span className="text-[10px] text-zinc-500">{simResult.candidateTools.length} candidates</span>
              </div>
            </div>

            {/* 2. Central Router Node */}
            <div className={`lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center relative overflow-hidden ${
              simulationState === 'running'
                ? 'border-amber-500/60 bg-amber-950/20'
                : mode === 'without_toolnorm'
                ? 'border-red-500/40 bg-red-950/10'
                : 'border-emerald-500/40 bg-emerald-950/10'
            }`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-2 transition-transform duration-300 ${
                simulationState === 'running'
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-400 scale-110'
                  : mode === 'without_toolnorm'
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}>
                {simulationState === 'running' ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Layers className="w-6 h-6" />
                )}
              </div>
              <span className="text-xs font-mono font-bold text-white">AI Logic Router</span>
              <span className={`text-[11px] font-mono mt-0.5 font-semibold ${
                mode === 'without_toolnorm' ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {mode === 'without_toolnorm' ? 'Unshielded Stochastic' : 'ToolNorm Canonical Guard'}
              </span>

              {/* Latency badge */}
              <div className="mt-3 px-2 py-0.5 rounded bg-black/50 border border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-zinc-500" />
                <span>Router Latency:</span>
                <span className="text-white font-bold">
                  {mode === 'without_toolnorm' ? `${simResult.withoutToolNorm.latencyMs}ms` : `${simResult.withToolNorm.latencyMs}ms`}
                </span>
              </div>
            </div>

            {/* 3. Outcome & The 3 Slide Failures */}
            <div className="lg:col-span-6 flex flex-col">
              {mode === 'without_toolnorm' ? (
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-red-500/20 mb-3 gap-2">
                      <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>ROUTER FAILURE: STOCHASTIC RESOLUTION CRASH</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-semibold self-start sm:self-auto">
                        Ambiguity Collision
                      </span>
                    </div>

                    {/* Generated Broken Payload Display */}
                    <div className="mb-3 p-2.5 rounded bg-[#070a10] border border-red-500/20 font-mono text-xs">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                        <span>Invoked: <code className="text-amber-300">{simResult.withoutToolNorm.selectedToolName}</code></span>
                        <span className="text-red-400">Status: REJECTED</span>
                      </div>
                      <div className="text-[11px] text-red-300">
                        <code>{JSON.stringify(simResult.withoutToolNorm.generatedPayload)}</code>
                      </div>
                      <div className="mt-1.5 text-[10px] text-red-400/90 font-mono">
                        {simResult.withoutToolNorm.errorMessage}
                      </div>
                    </div>

                    {/* Interactive Failure Modes Tabs from Slide 3 */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        Slide 3 Failure Mechanisms (Click to Inspect):
                      </div>

                      {/* Failure 1 */}
                      <button
                        onClick={() => setSelectedFailureMode(1)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-start gap-2.5 ${
                          selectedFailureMode === 1
                            ? 'bg-red-900/30 border-red-500/50 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">1</div>
                        <div>
                          <div className="font-semibold text-red-300">Hallucination of incorrect parameters</div>
                          {selectedFailureMode === 1 && (
                            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                              {simResult.withoutToolNorm.failureDescription}
                            </p>
                          )}
                        </div>
                      </button>

                      {/* Failure 2 */}
                      <button
                        onClick={() => setSelectedFailureMode(2)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-start gap-2.5 ${
                          selectedFailureMode === 2
                            ? 'bg-red-900/30 border-red-500/50 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">2</div>
                        <div>
                          <div className="font-semibold text-red-300">Failure to trigger the optimal tool</div>
                          {selectedFailureMode === 2 && (
                            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                              Candidate tool similarity scores collided across overlapping descriptions ({simResult.candidateTools.map(c => `${c.name}: ${c.semanticMatchScore}`).join(', ')}). Router cannot deterministically select target.
                            </p>
                          )}
                        </div>
                      </button>

                      {/* Failure 3 */}
                      <button
                        onClick={() => setSelectedFailureMode(3)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer flex items-start gap-2.5 ${
                          selectedFailureMode === 3
                            ? 'bg-red-900/30 border-red-500/50 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">3</div>
                        <div>
                          <div className="font-semibold text-red-300">Dropping required arguments due to schema confusion</div>
                          {selectedFailureMode === 3 && (
                            <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                              Inconsistent parameter optionality between competing APIs causes the LLM to omit mandatory inputs, triggering runtime schema rejection.
                            </p>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-red-500/20 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-red-400">Deterministic Reliability: 0%</span>
                    <button
                      onClick={() => runSimulation('with_toolnorm')}
                      className="text-orange-400 hover:text-orange-300 underline font-bold cursor-pointer"
                    >
                      Solve with ToolNorm ➔
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-3">
                      <span className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>TOOLNORM CANONICAL LAYER RESOLVED</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        100% Deterministic Pass
                      </span>
                    </div>

                    <div className="p-3 bg-[#070a10] rounded-lg border border-emerald-500/20 font-mono text-xs text-zinc-300 space-y-2 mb-3">
                      <div className="text-emerald-400 font-semibold">// Target Tool Call Normalized:</div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Canonical Target:</span>
                        <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {simResult.withToolNorm.canonicalToolName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Normalized Arguments:</span>
                        <pre className="mt-1 p-2 rounded bg-black/60 text-amber-300 text-[11px] overflow-x-auto">
                          {JSON.stringify(simResult.withToolNorm.normalizedPayload, null, 2)}
                        </pre>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">Pydantic Validation:</span>
                        <span className="text-emerald-400 font-bold">Passed (0 errors, {simResult.withToolNorm.latencyMs}ms)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500">Semantic Ambiguity Score:</span>
                        <span className="text-emerald-300 font-bold">0.00 (Orthogonal Cluster)</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-zinc-900/60 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                      <span className="text-orange-400 font-bold">Deterministic Border Check:</span> <code className="text-zinc-300">additionalProperties: false</code> enforced. Zero parameter invention, zero dropped arguments.
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Zero Invented Keys</span>
                    <span className="text-emerald-400 font-bold">Confidence: {simResult.withToolNorm.confidenceScore}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Real-Time Screen Output Terminal Display (Slide 3) */}
          <RealTimeScreenOutput
            query={activeQuery}
            mode={mode}
            isSimulating={simulationState === 'running'}
            simulationStep={simulationStep}
            simResult={simResult}
            onToggleMode={(newMode) => runSimulation(newMode)}
            onTriggerSimulation={() => runSimulation(mode)}
          />

          {/* Collapsible Router Trace Logs */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <button
              onClick={() => setShowTraceLogs(!showTraceLogs)}
              className="flex items-center justify-between w-full text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-orange-400" />
                <span>Router Decision Trace Logs ({mode === 'without_toolnorm' ? simResult.withoutToolNorm.trace.length : simResult.withToolNorm.trace.length} steps)</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-orange-400">
                <span>{showTraceLogs ? 'Hide Decision Trace' : 'View Decision Trace'}</span>
                {showTraceLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showTraceLogs && (
              <div className="mt-3 space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto bg-[#070a10] p-3 rounded-xl border border-zinc-800">
                {(mode === 'without_toolnorm' ? simResult.withoutToolNorm.trace : simResult.withToolNorm.trace).map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 py-1 border-b border-zinc-800/40 last:border-0">
                    <span className="text-[10px] text-zinc-500 w-6">0{idx + 1}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                      t.status === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-zinc-300 font-semibold shrink-0">{t.step}:</span>
                    <span className="text-zinc-400 text-[11px]">{t.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
