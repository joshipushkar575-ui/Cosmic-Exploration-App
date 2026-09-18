import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, Users, Rocket } from 'lucide-react';
import { GlassCard } from './GlassCard';
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
          <div className="relative z-10 p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
              <div className="text-right">
                <h1 className="text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cosmic Explorer
                </h1>
                <p className="text-gray-400 text-sm">Open World Space Adventure</p>
              </div>
            </div>

            {/* Game Stats */}
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl text-cyan-400">{gameProgress.score.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-purple-400">{gameProgress.level}</div>
                  <div className="text-sm text-gray-400">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-blue-400">{gameProgress.resourcesCollected}</div>
                  <div className="text-sm text-gray-400">Resources Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-violet-400">{gameProgress.planetsUnlocked.length}/8</div>
                  <div className="text-sm text-gray-400">Planets Unlocked</div>
                </div>
              </div>
            </GlassCard>

            {/* Game Menu Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard 
                className="p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentView('planetSelection')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Rocket className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2">Start Exploration</h3>
                    <p className="text-gray-400 text-sm">Choose a planet and begin your cosmic journey</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentView('leaderboard')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2">Leaderboard</h3>
                    <p className="text-gray-400 text-sm">Compare your scores with other explorers</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentView('achievements')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2">Achievements</h3>
                    <p className="text-gray-400 text-sm">Track your exploration milestones</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-2">Multiplayer</h3>
                    <p className="text-gray-400 text-sm">Coming Soon - Explore with friends</p>
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
                    <p className="text-gray-400 text-sm">Level {gameProgress.level} • Continue your journey</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('gameplay')}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all"
                  >
                    Continue
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