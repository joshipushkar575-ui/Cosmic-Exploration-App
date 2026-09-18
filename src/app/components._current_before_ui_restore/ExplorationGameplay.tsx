import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Zap, Gem, Target, Clock, MapPin, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { motion } from 'motion/react';

interface ExplorationGameplayProps {
  gameProgress: {
    currentPlanet: string;
    level: number;
    score: number;
    resourcesCollected: number;
    achievements: string[];
  };
  onGameUpdate: (updates: any) => void;
  onBack: () => void;
}

interface GameState {
  playerPosition: { x: number; y: number };
  energy: number;
  resources: number;
  discoveries: number;
  timeRemaining: number;
  isGameActive: boolean;
  levelComplete: boolean;
  currentObjective: string;
}

interface Resource {
  id: string;
  x: number;
  y: number;
  type: 'crystal' | 'mineral' | 'artifact';
  value: number;
  collected: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  type: 'crater' | 'storm' | 'radiation';
}

export function ExplorationGameplay({ gameProgress, onGameUpdate, onBack }: ExplorationGameplayProps) {
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: { x: 5, y: 5 },
    energy: 100,
    resources: 0,
    discoveries: 0,
    timeRemaining: 300, // 5 minutes
    isGameActive: true,
    levelComplete: false,
    currentObjective: 'Collect 5 resources to complete the level'
  });

  const [gameGrid] = useState<{ resources: Resource[], obstacles: Obstacle[] }>(() => {
    // Generate random resources and obstacles based on planet difficulty
    const resources: Resource[] = [];
    const obstacles: Obstacle[] = [];
    const gridSize = 10;
    
    // Generate resources
    for (let i = 0; i < 8; i++) {
      resources.push({
        id: `resource-${i}`,
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        type: ['crystal', 'mineral', 'artifact'][Math.floor(Math.random() * 3)] as any,
        value: Math.floor(Math.random() * 50) + 10,
        collected: false
      });
    }
    
    // Generate obstacles
    for (let i = 0; i < 5; i++) {
      obstacles.push({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
        type: ['crater', 'storm', 'radiation'][Math.floor(Math.random() * 3)] as any
      });
    }
    
    return { resources, obstacles };
  });

  // Game timer
  useEffect(() => {
    if (!gameState.isGameActive || gameState.levelComplete) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          return { ...prev, timeRemaining: 0, isGameActive: false };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.isGameActive, gameState.levelComplete]);

  // Check for level completion
  useEffect(() => {
    if (gameState.resources >= 5 && !gameState.levelComplete) {
      setGameState(prev => ({ ...prev, levelComplete: true, isGameActive: false }));
      
      // Update game progress
      const newScore = gameProgress.score + (gameState.resources * 50) + (gameState.timeRemaining * 2);
      const newLevel = gameProgress.level + 1;
      
      onGameUpdate({
        score: newScore,
        level: newLevel,
        resourcesCollected: gameProgress.resourcesCollected + gameState.resources
      });
    }
  }, [gameState.resources, gameState.levelComplete, gameProgress, onGameUpdate, gameState.timeRemaining]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState.isGameActive) return;
    
    setGameState(prev => {
      const newPosition = { ...prev.playerPosition };
      const energyCost = 2;
      
      if (prev.energy < energyCost) return prev;
      
      switch (direction) {
        case 'up':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'down':
          newPosition.y = Math.min(9, newPosition.y + 1);
          break;
        case 'left':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'right':
          newPosition.x = Math.min(9, newPosition.x + 1);
          break;
      }
      
      // Check for resource collection
      const resourceAtPosition = gameGrid.resources.find(
        r => r.x === newPosition.x && r.y === newPosition.y && !r.collected
      );
      
      if (resourceAtPosition) {
        resourceAtPosition.collected = true;
        return {
          ...prev,
          playerPosition: newPosition,
          energy: Math.max(0, prev.energy - energyCost + 5), // Restore some energy
          resources: prev.resources + 1,
          discoveries: prev.discoveries + resourceAtPosition.value
        };
      }
      
      // Check for obstacles
      const obstacleAtPosition = gameGrid.obstacles.find(
        o => o.x === newPosition.x && o.y === newPosition.y
      );
      
      if (obstacleAtPosition) {
        return {
          ...prev,
          playerPosition: newPosition,
          energy: Math.max(0, prev.energy - (energyCost * 2)) // Double energy cost for obstacles
        };
      }
      
      return {
        ...prev,
        playerPosition: newPosition,
        energy: Math.max(0, prev.energy - energyCost)
      };
    });
  }, [gameState.isGameActive, gameGrid]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGameCell = (x: number, y: number) => {
    const isPlayer = gameState.playerPosition.x === x && gameState.playerPosition.y === y;
    const resource = gameGrid.resources.find(r => r.x === x && r.y === y && !r.collected);
    const obstacle = gameGrid.obstacles.find(o => o.x === x && o.y === y);
    
    let cellContent = null;
    let cellClass = "aspect-square w-full border border-cyan-400/[0.10] bg-slate-950/25 flex items-center justify-center text-[9px] sm:text-xs transition-colors";
    
    if (isPlayer) {
      cellContent = <div className="h-3.5 w-3.5 rounded-full border border-cyan-100/70 bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)] animate-pulse sm:h-4 sm:w-4" />;
      cellClass += " bg-cyan-400/[0.12] shadow-[inset_0_0_14px_rgba(34,211,238,0.10)]";
    } else if (resource) {
      cellClass += " bg-emerald-400/[0.08]";
      cellContent = resource.type === 'crystal' ? '💎' : resource.type === 'mineral' ? '⚡' : '🏺';
    } else if (obstacle) {
      cellClass += " bg-red-400/[0.07]";
      cellContent = obstacle.type === 'crater' ? '🕳️' : obstacle.type === 'storm' ? '🌪️' : '☢️';
    }
    
    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {cellContent}
      </div>
    );
  };

  if (gameState.levelComplete) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg"
        >
          <GlassCard
            glow
            className="rounded-3xl border-cyan-300/20 bg-slate-950/60 p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.55),0_0_55px_rgba(34,211,238,0.10)] backdrop-blur-2xl sm:p-8"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.12] to-violet-400/[0.08] text-5xl shadow-[0_0_45px_rgba(34,211,238,0.14)]">
              🚀
            </div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
              MISSION ACCOMPLISHED
            </div>
            <h2 className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Level Complete
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Expedition data successfully transmitted.
            </p>
            <div className="my-6 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.045] p-3">
                <div className="text-xl font-bold text-emerald-200">{gameState.resources}</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">Resources</div>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-3">
                <div className="text-xl font-bold text-cyan-200">{gameState.timeRemaining}s</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">Time Bonus</div>
              </div>

              <div className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.045] p-3">
                <div className="text-xl font-bold text-violet-200">
                  {(gameState.resources * 50) + (gameState.timeRemaining * 2)}
                </div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">Score</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onBack}
                className="rounded-2xl border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 font-medium text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                Main Menu
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 px-4 py-2.5 font-semibold text-white shadow-[0_8px_30px_rgba(34,211,238,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-400 hover:shadow-[0_12px_38px_rgba(34,211,238,0.26)]"
              >
                Next Level →
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CosmicIconButton
            onClick={onBack}
            size="md"
            glow="cyan"
            label="Exit exploration"
          >
            <ArrowLeft />
          </CosmicIconButton>

          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              ACTIVE EXPEDITION
            </div>
            <h1 className="mt-0.5 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-xl font-bold capitalize tracking-tight text-transparent sm:text-2xl">
              {gameProgress.currentPlanet}
            </h1>
          </div>
        </div>

        <div className="hidden rounded-full border border-emerald-300/15 bg-emerald-300/[0.045] px-3 py-1.5 sm:flex sm:items-center sm:gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Mission Live
          </span>
        </div>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <GlassCard className="rounded-2xl border-amber-300/10 bg-slate-950/40 p-4 text-center shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
          <Zap className="mx-auto mb-2 h-5 w-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.40)]" />
          <div className="text-xl font-bold text-amber-100">{gameState.energy}%</div>
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">Energy</div>
          <div className="mx-auto mt-2 h-1 max-w-24 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-300"
              style={{ width: `${gameState.energy}%` }}
            />
          </div>
        </GlassCard>
        
        <GlassCard className="rounded-2xl border-emerald-300/10 bg-slate-950/40 p-4 text-center shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
          <Gem className="mx-auto mb-2 h-5 w-5 text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.38)]" />
          <div className="text-xl font-bold text-emerald-100">{gameState.resources}/5</div>
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">Resources</div>
          <div className="mx-auto mt-2 h-1 max-w-24 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-300"
              style={{ width: `${Math.min(100, (gameState.resources / 5) * 100)}%` }}
            />
          </div>
        </GlassCard>
        
        <GlassCard className="rounded-2xl border-cyan-300/10 bg-slate-950/40 p-4 text-center shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
          <Clock className="mx-auto mb-2 h-5 w-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.38)]" />
          <div className="text-xl font-bold text-cyan-100">{formatTime(gameState.timeRemaining)}</div>
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">Time Left</div>
        </GlassCard>
        
        <GlassCard className="rounded-2xl border-violet-300/10 bg-slate-950/40 p-4 text-center shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
          <Target className="mx-auto mb-2 h-5 w-5 text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.40)]" />
          <div className="text-xl font-bold text-violet-100">{gameState.discoveries}</div>
          <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">Discovery Points</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Grid */}
        <div className="lg:col-span-2">
          <GlassCard
            glow
            className="rounded-3xl border-cyan-300/15 bg-slate-950/45 p-4 shadow-[0_20px_65px_rgba(0,0,0,0.34)] sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06]">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Exploration Grid</h3>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-slate-600">Planetary surface scan</p>
                </div>
              </div>

              <div className="hidden rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:block">
                10 × 10 GRID
              </div>
            </div>
            <div className="grid grid-cols-10 gap-0.5 rounded-2xl border border-cyan-300/10 bg-black/30 p-2 shadow-[inset_0_0_40px_rgba(34,211,238,0.035)] sm:gap-1 sm:p-3">
              {Array.from({ length: 100 }, (_, i) => {
                const x = i % 10;
                const y = Math.floor(i / 10);
                return renderGameCell(x, y);
              })}
            </div>
            
            {/* Mobile Controls */}
            <div className="mt-4 flex flex-col items-center gap-2 md:hidden">
              <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                Navigation
              </div>

              <CosmicIconButton
                onClick={() => movePlayer('up')}
                size="lg"
                glow="cyan"
                label="Move up"
              >
                <ChevronUp />
              </CosmicIconButton>

              <div className="flex gap-2">
                <CosmicIconButton onClick={() => movePlayer('left')} size="lg" glow="cyan" label="Move left">
                  <ChevronLeft />
                </CosmicIconButton>

                <CosmicIconButton onClick={() => movePlayer('down')} size="lg" glow="cyan" label="Move down">
                  <ChevronDown />
                </CosmicIconButton>

                <CosmicIconButton onClick={() => movePlayer('right')} size="lg" glow="cyan" label="Move right">
                  <ChevronRight />
                </CosmicIconButton>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Game Info */}
        <div className="space-y-4 lg:space-y-5">
          <GlassCard
            glow
            className="rounded-3xl border-violet-300/15 bg-slate-950/45 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.28)]"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/[0.07]">
                <Target className="h-4 w-4 text-violet-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Current Objective</h3>
                <p className="text-[8px] uppercase tracking-[0.16em] text-slate-600">Mission directive</p>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-300/10 bg-violet-300/[0.035] p-3">
              <p className="text-sm leading-relaxed text-slate-300">{gameState.currentObjective}</p>
            </div>
          </GlassCard>

          <GlassCard className="rounded-3xl border-white/[0.10] bg-slate-950/40 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Mission Controls</h3>
              <span className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-cyan-200">
                INPUT
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">🎮 Arrow Keys or WASD to move</p>
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">💎 Collect resources for points</p>
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">⚡ Moving costs energy</p>
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">🚧 Avoid obstacles — double energy cost</p>
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">🎯 Collect 5 resources to win</p>
            </div>
          </GlassCard>

          <GlassCard className="rounded-3xl border-white/[0.10] bg-slate-950/40 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Scanner Legend</h3>
              <span className="text-[8px] uppercase tracking-[0.14em] text-slate-600">LIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.035] px-3 py-2">
                <div className="h-3.5 w-3.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
                <span className="text-xs text-slate-300">You</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.035] px-3 py-2">
                <span className="text-base">💎</span>
                <span className="text-xs text-slate-300">Crystal</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] px-3 py-2">
                <span className="text-base">⚡</span>
                <span className="text-xs text-slate-300">Mineral</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-violet-300/10 bg-violet-300/[0.035] px-3 py-2">
                <span className="text-base">🏺</span>
                <span className="text-xs text-slate-300">Artifact</span>
              </div>

              <div className="col-span-2 flex items-center gap-2 rounded-xl border border-red-300/10 bg-red-300/[0.035] px-3 py-2">
                <span className="text-base">🕳️</span>
                <span className="text-xs text-slate-300">Crater / Hazard Zone</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}