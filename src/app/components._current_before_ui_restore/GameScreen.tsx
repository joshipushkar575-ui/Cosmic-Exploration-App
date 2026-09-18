import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, Users, Rocket } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { CosmicBackground } from './CosmicBackground';
import { PlanetSelectionScreen } from './PlanetSelectionScreen';
import { ExplorationGameplay } from './ExplorationGameplay';
import { GameLeaderboard } from './GameLeaderboard';
import { GameAchievements } from './GameAchievements';

interface GameScreenProps {
  onNavigate: (screen: string) => void;
}

type GameView = 'menu' | 'planetSelection' | 'gameplay' | 'leaderboard' | 'achievements';

interface GameProgress {
  currentPlanet: string;
  level: number;
  score: number;
  resourcesCollected: number;
  planetsUnlocked: string[];
  achievements: string[];
}

export function GameScreen({ onNavigate }: GameScreenProps) {
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    currentPlanet: '',
    level: 1,
    score: 0,
    resourcesCollected: 0,
    planetsUnlocked: ['mercury', 'venus', 'earth'],
    achievements: []
  });

  useEffect(() => {
    // Load game progress from localStorage
    const savedProgress = localStorage.getItem('vyomGameProgress');
    if (savedProgress) {
      setGameProgress(JSON.parse(savedProgress));
    }
  }, []);

  const saveGameProgress = (progress: GameProgress) => {
    setGameProgress(progress);
    localStorage.setItem('vyomGameProgress', JSON.stringify(progress));
  };

  const handlePlanetSelected = (planet: string) => {
    const updatedProgress = { ...gameProgress, currentPlanet: planet };
    saveGameProgress(updatedProgress);
    setCurrentView('gameplay');
  };

  const handleGameUpdate = (updates: Partial<GameProgress>) => {
    const updatedProgress = { ...gameProgress, ...updates };
    saveGameProgress(updatedProgress);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'planetSelection':
        return (
          <PlanetSelectionScreen
            gameProgress={gameProgress}
            onPlanetSelected={handlePlanetSelected}
            onBack={() => setCurrentView('menu')}
          />
        );
      case 'gameplay':
        return (
          <ExplorationGameplay
            gameProgress={gameProgress}
            onGameUpdate={handleGameUpdate}
            onBack={() => setCurrentView('menu')}
          />
        );
      case 'leaderboard':
        return (
          <GameLeaderboard
            currentScore={gameProgress.score}
            onBack={() => setCurrentView('menu')}
          />
        );
      case 'achievements':
        return (
          <GameAchievements
            gameProgress={gameProgress}
            onBack={() => setCurrentView('menu')}
          />
        );
      default:
        return (
          <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <CosmicIconButton
                onClick={() => onNavigate('home')}
                size="md"
                glow="cyan"
                label="Back to home"
              >
                <ArrowLeft />
              </CosmicIconButton>

              <div className="text-right">
                <div className="mb-1 flex items-center justify-end gap-2">
                  <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-300/50" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                    VYOM GAME HUB
                  </span>
                </div>
                <h1 className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                  Cosmic Explorer
                </h1>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Open World Space Adventure
                </p>
              </div>
            </div>

            {/* Game Stats */}
            <GlassCard
              glow
              className="rounded-3xl border-white/[0.13] bg-slate-950/45 p-4 sm:p-5 shadow-[0_20px_65px_rgba(0,0,0,0.32)]"
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                <div className="group rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4 text-center transition-all duration-300 hover:border-cyan-300/25 hover:bg-cyan-300/[0.07]">
                  <div className="text-2xl font-bold text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.30)]">
                    {gameProgress.score.toLocaleString()}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    Total Score
                  </div>
                </div>

                <div className="group rounded-2xl border border-violet-300/15 bg-violet-300/[0.045] p-4 text-center transition-all duration-300 hover:border-violet-300/25 hover:bg-violet-300/[0.07]">
                  <div className="text-2xl font-bold text-violet-200 drop-shadow-[0_0_12px_rgba(139,92,246,0.30)]">
                    {gameProgress.level}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    Current Level
                  </div>
                </div>

                <div className="group rounded-2xl border border-blue-300/15 bg-blue-300/[0.045] p-4 text-center transition-all duration-300 hover:border-blue-300/25 hover:bg-blue-300/[0.07]">
                  <div className="text-2xl font-bold text-blue-200 drop-shadow-[0_0_12px_rgba(96,165,250,0.30)]">
                    {gameProgress.resourcesCollected}
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    Resources Found
                  </div>
                </div>

                <div className="group rounded-2xl border border-purple-300/15 bg-purple-300/[0.045] p-4 text-center transition-all duration-300 hover:border-purple-300/25 hover:bg-purple-300/[0.07]">
                  <div className="text-2xl font-bold text-purple-200 drop-shadow-[0_0_12px_rgba(168,85,247,0.30)]">
                    {gameProgress.planetsUnlocked.length}/8
                  </div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    Planets Unlocked
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Game Menu Options */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <GlassCard 
                className="group cursor-pointer rounded-3xl border-white/[0.11] bg-slate-950/35 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:bg-white/[0.055] hover:shadow-[0_22px_60px_rgba(0,0,0,0.35)] sm:p-7"
                onClick={() => setCurrentView('planetSelection')}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.14] to-blue-400/[0.06] shadow-[0_0_30px_rgba(34,211,238,0.12)] transition-transform duration-300 group-hover:scale-110">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-100 sm:text-xl">Start Exploration</h3>
                    <p className="text-sm leading-relaxed text-slate-400">Choose a planet and begin your cosmic journey</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="group cursor-pointer rounded-3xl border-white/[0.11] bg-slate-950/35 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:bg-white/[0.055] hover:shadow-[0_22px_60px_rgba(0,0,0,0.35)] sm:p-7"
                onClick={() => setCurrentView('leaderboard')}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-400/[0.14] to-purple-400/[0.06] shadow-[0_0_30px_rgba(139,92,246,0.12)] transition-transform duration-300 group-hover:scale-110">
                    <Trophy className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-100 sm:text-xl">Leaderboard</h3>
                    <p className="text-sm leading-relaxed text-slate-400">Compare your scores with other explorers</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="group cursor-pointer rounded-3xl border-white/[0.11] bg-slate-950/35 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:bg-white/[0.055] hover:shadow-[0_22px_60px_rgba(0,0,0,0.35)] sm:p-7"
                onClick={() => setCurrentView('achievements')}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-300/20 bg-gradient-to-br from-blue-400/[0.14] to-cyan-400/[0.06] shadow-[0_0_30px_rgba(96,165,250,0.12)] transition-transform duration-300 group-hover:scale-110">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-100 sm:text-xl">Achievements</h3>
                    <p className="text-sm leading-relaxed text-slate-400">Track your exploration milestones</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-300/15 bg-gradient-to-br from-purple-400/[0.12] to-violet-400/[0.05] shadow-[0_0_28px_rgba(168,85,247,0.08)]">
                    <Users className="w-8 h-8 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-100 sm:text-xl">Multiplayer</h3>
                    <p className="text-sm leading-relaxed text-slate-400">Coming Soon - Explore with friends</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Current Mission */}
            {gameProgress.currentPlanet && (
              <GlassCard className="p-6">
                <h3 className="text-lg text-white mb-4">Current Mission</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-400 capitalize">{gameProgress.currentPlanet} Exploration</p>
                    <p className="text-sm leading-relaxed text-slate-400">Level {gameProgress.level} • Continue your journey</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentView('gameplay')}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-gradient-to-r from-violet-500/90 via-blue-500/90 to-cyan-400/90 px-6 py-2.5 font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/40 hover:from-violet-400 hover:via-blue-400 hover:to-cyan-300 hover:text-slate-950 hover:shadow-[0_14px_36px_rgba(34,211,238,0.24)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
                  >
                    <span className="relative z-10">Continue</span>
                  </button>
                </div>
              </GlassCard>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CosmicBackground />
      {renderCurrentView()}
    </div>
  );
}