import { ArrowLeft, Lock, Star, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PlanetSelectionScreenProps {
  gameProgress: {
    planetsUnlocked: string[];
    level: number;
    score: number;
  };
  onPlanetSelected: (planet: string) => void;
  onBack: () => void;
}

interface Planet {
  id: string;
  name: string;
  difficulty: number;
  description: string;
  color: string;
  requirements: string;
  rewards: string;
  imageQuery: string;
}

const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    difficulty: 1,
    description: 'The closest planet to the Sun. Perfect for beginners.',
    color: 'from-orange-500 to-red-500',
    requirements: 'Unlocked by default',
    rewards: '100 XP, Solar Crystal',
    imageQuery: 'mercury planet space'
  },
  {
    id: 'venus',
    name: 'Venus',
    difficulty: 2,
    description: 'The hottest planet with acid clouds. Moderate challenge.',
    color: 'from-yellow-500 to-orange-500',
    requirements: 'Unlocked by default',
    rewards: '200 XP, Atmospheric Sample',
    imageQuery: 'venus planet atmosphere'
  },
  {
    id: 'earth',
    name: 'Earth',
    difficulty: 1,
    description: 'Our home planet. Learn about terrestrial life.',
    color: 'from-blue-500 to-green-500',
    requirements: 'Unlocked by default',
    rewards: '150 XP, Bio Sample',
    imageQuery: 'earth planet blue marble'
  },
  {
    id: 'mars',
    name: 'Mars',
    difficulty: 3,
    description: 'The red planet with ancient river valleys.',
    color: 'from-red-500 to-orange-600',
    requirements: 'Score 500+',
    rewards: '300 XP, Martian Mineral',
    imageQuery: 'mars planet red surface'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    difficulty: 4,
    description: 'Gas giant with the Great Red Spot.',
    color: 'from-orange-400 to-yellow-600',
    requirements: 'Level 5+',
    rewards: '500 XP, Gas Giant Data',
    imageQuery: 'jupiter planet gas giant'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    difficulty: 4,
    description: 'Ringed planet with numerous moons.',
    color: 'from-yellow-300 to-orange-400',
    requirements: 'Level 8+',
    rewards: '600 XP, Ring Particles',
    imageQuery: 'saturn planet rings'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    difficulty: 5,
    description: 'Ice giant tilted on its side.',
    color: 'from-cyan-400 to-blue-500',
    requirements: 'Level 12+',
    rewards: '800 XP, Ice Crystal',
    imageQuery: 'uranus planet ice blue'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    difficulty: 5,
    description: 'Windy ice giant with the fastest winds.',
    color: 'from-blue-600 to-indigo-600',
    requirements: 'Level 15+',
    rewards: '1000 XP, Storm Data',
    imageQuery: 'neptune planet blue windy'
  }
];

export function PlanetSelectionScreen({ gameProgress, onPlanetSelected, onBack }: PlanetSelectionScreenProps) {
  const isPlanetUnlocked = (planet: Planet) => {
    if (gameProgress.planetsUnlocked.includes(planet.id)) return true;
    
    switch (planet.id) {
      case 'mars':
        return gameProgress.score >= 500;
      case 'jupiter':
        return gameProgress.level >= 5;
      case 'saturn':
        return gameProgress.level >= 8;
      case 'uranus':
        return gameProgress.level >= 12;
      case 'neptune':
        return gameProgress.level >= 15;
      default:
        return false;
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < difficulty ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="relative z-10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>
        <h1 className="text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Choose Your Destination
        </h1>
      </div>

      {/* Planet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {planets.map((planet) => {
          const isUnlocked = isPlanetUnlocked(planet);
          
          return (
            <GlassCard
              key={planet.id}
              className={`p-6 transition-all duration-300 ${
                isUnlocked
                  ? 'hover:bg-white/10 cursor-pointer hover:scale-105'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              onClick={() => isUnlocked && onPlanetSelected(planet.id)}
            >
              <div className="space-y-4">
                {/* Planet Image */}
                <div className="relative">
                  <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${planet.color} p-1`}>
                    <div className="w-full h-full rounded-lg overflow-hidden bg-black/20">
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&crop=entropy`}
                        alt={planet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Lock Overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="flex items-center gap-1">
                      {getDifficultyStars(planet.difficulty)}
                    </div>
                  </div>
                </div>

                {/* Planet Info */}
                <div className="space-y-2">
                  <h3 className="text-lg text-white">{planet.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{planet.description}</p>
                </div>

                {/* Requirements & Rewards */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3 h-3 text-gray-500" />
                    <span className={isUnlocked ? 'text-green-400' : 'text-gray-400'}>
                      {planet.requirements}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-gray-400">{planet.rewards}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-2 rounded-lg transition-all ${
                    isUnlocked
                      ? `bg-gradient-to-r ${planet.color} hover:opacity-80`
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                  onClick={() => isUnlocked && onPlanetSelected(planet.id)}
                  disabled={!isUnlocked}
                >
                  {isUnlocked ? 'Explore' : 'Locked'}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Progress Info */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl text-cyan-400">{gameProgress.planetsUnlocked.length}/8</div>
            <div className="text-sm text-gray-400">Planets Unlocked</div>
          </div>
          <div>
            <div className="text-2xl text-purple-400">{gameProgress.level}</div>
            <div className="text-sm text-gray-400">Explorer Level</div>
          </div>
          <div>
            <div className="text-2xl text-blue-400">{gameProgress.score.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Score</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}