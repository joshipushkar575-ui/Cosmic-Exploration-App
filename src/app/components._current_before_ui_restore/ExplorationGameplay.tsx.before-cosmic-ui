import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Zap, Gem, Target, Clock, MapPin, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
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
    let cellClass = "w-8 h-8 border border-cyan-500/20 flex items-center justify-center text-xs";
    
    if (isPlayer) {
      cellContent = <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />;
      cellClass += " bg-cyan-500/20";
    } else if (resource) {
      cellClass += " bg-green-500/20";
      cellContent = resource.type === 'crystal' ? '💎' : resource.type === 'mineral' ? '⚡' : '🏺';
    } else if (obstacle) {
      cellClass += " bg-red-500/20";
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
      <div className="relative z-10 p-6 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <GlassCard className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl text-cyan-400">Level Complete!</h2>
            <div className="space-y-2">
              <p className="text-gray-300">Resources Collected: {gameState.resources}</p>
              <p className="text-gray-300">Time Bonus: {gameState.timeRemaining}s</p>
              <p className="text-cyan-400">Score Earned: {(gameState.resources * 50) + (gameState.timeRemaining * 2)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
              >
                Main Menu
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg transition-all"
              >
                Next Level
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative z-10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit Game
        </button>
        <h1 className="text-xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent capitalize">
          Exploring {gameProgress.currentPlanet}
        </h1>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-lg text-white">{gameState.energy}%</div>
          <div className="text-xs text-gray-400">Energy</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Gem className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-lg text-white">{gameState.resources}/5</div>
          <div className="text-xs text-gray-400">Resources</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-lg text-white">{formatTime(gameState.timeRemaining)}</div>
          <div className="text-xs text-gray-400">Time Left</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg text-white">{gameState.discoveries}</div>
          <div className="text-xs text-gray-400">Discovery Points</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Grid */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="text-lg text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Exploration Grid
            </h3>
            <div className="grid grid-cols-10 gap-1 mb-4 bg-black/20 p-4 rounded-lg">
              {Array.from({ length: 100 }, (_, i) => {
                const x = i % 10;
                const y = Math.floor(i / 10);
                return renderGameCell(x, y);
              })}
            </div>
            
            {/* Mobile Controls */}
            <div className="flex flex-col items-center gap-2 md:hidden">
              <button
                onClick={() => movePlayer('up')}
                className="p-3 bg-cyan-500/20 rounded-lg"
              >
                <ChevronUp className="w-6 h-6 text-cyan-400" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => movePlayer('left')}
                  className="p-3 bg-cyan-500/20 rounded-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-cyan-400" />
                </button>
                <button
                  onClick={() => movePlayer('down')}
                  className="p-3 bg-cyan-500/20 rounded-lg"
                >
                  <ChevronDown className="w-6 h-6 text-cyan-400" />
                </button>
                <button
                  onClick={() => movePlayer('right')}
                  className="p-3 bg-cyan-500/20 rounded-lg"
                >
                  <ChevronRight className="w-6 h-6 text-cyan-400" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Game Info */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-lg text-white mb-4">Current Objective</h3>
            <p className="text-gray-300 text-sm">{gameState.currentObjective}</p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg text-white mb-4">Controls</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🎮 Arrow Keys or WASD to move</p>
              <p>💎 Collect resources for points</p>
              <p>⚡ Moving costs energy</p>
              <p>🚧 Avoid obstacles (double energy cost)</p>
              <p>🎯 Collect 5 resources to win</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg text-white mb-4">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">You</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <span className="text-gray-300">Crystal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-gray-300">Mineral</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏺</span>
                <span className="text-gray-300">Artifact</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🕳️</span>
                <span className="text-gray-300">Crater</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}