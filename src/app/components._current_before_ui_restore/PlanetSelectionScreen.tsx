import { ArrowLeft, Lock, Star, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
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
        className={`h-3.5 w-3.5 transition-transform duration-300 ${
          i < difficulty ? 'fill-current text-amber-300 drop-shadow-[0_0_7px_rgba(251,191,36,0.45)]' : 'text-slate-700'
        }`}
      />
    ));
  };

  return (
    <div className="relative z-10 min-h-screen p-4 space-y-6 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <CosmicIconButton
          onClick={onBack}
          size="md"
          glow="cyan"
          label="Back to game menu"
        >
          <ArrowLeft />
        </CosmicIconButton>

        <div className="text-right">
          <div className="mb-1 flex items-center justify-end gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-300/50" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
              MISSION SELECT
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            Choose Your Destination
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Select a world and begin your expedition
          </p>
        </div>
      </div>

      {/* Planet Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {planets.map((planet) => {
          const isUnlocked = isPlanetUnlocked(planet);
          
          return (
            <GlassCard
              key={planet.id}
              className={`group overflow-hidden rounded-3xl border p-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)] transition-all duration-300 sm:p-5 ${
                isUnlocked
                  ? 'cursor-pointer border-white/[0.11] bg-slate-950/40 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:bg-white/[0.055] hover:shadow-[0_24px_65px_rgba(0,0,0,0.38)]'
                  : 'cursor-not-allowed border-white/[0.07] bg-slate-950/30 opacity-60'
              }`}
              onClick={() => isUnlocked && onPlanetSelected(planet.id)}
            >
              <div className="space-y-4">
                {/* Planet Image */}
                <div className="relative">
                  <div className={`relative h-36 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${planet.color} p-px shadow-[0_12px_35px_rgba(0,0,0,0.30)] transition-transform duration-500 ${
                    isUnlocked ? 'group-hover:scale-[1.02]' : ''
                  }`}>
                    <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-slate-950/80">
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&crop=entropy`}
                        alt={planet.name}
                        className="h-full w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-white/[0.06]" />
                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.10]" />
                    </div>
                  </div>
                  
                  {/* Lock Overlay */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/72 backdrop-blur-[2px]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.055] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  )}
                  
                  {/* Difficulty Badge */}
                  <div className="absolute right-2 top-2 rounded-xl border border-white/[0.12] bg-slate-950/65 px-2 py-1.5 shadow-[0_8px_25px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                    <div className="mb-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Difficulty
                    </div>
                    <div className="flex items-center gap-0.5">
                      {getDifficultyStars(planet.difficulty)}
                    </div>
                  </div>
                </div>

                {/* Planet Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-100">{planet.name}</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">{planet.description}</p>
                </div>

                {/* Requirements & Rewards */}
                <div className="space-y-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                      <Lock className="h-3 w-3 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Access
                      </div>
                      <span className={isUnlocked ? 'font-medium text-emerald-300' : 'text-slate-400'}>
                        {planet.requirements}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-amber-300/10 bg-amber-300/[0.045]">
                      <Zap className="h-3 w-3 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Mission Reward
                      </div>
                      <span className="text-slate-400">{planet.rewards}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full rounded-2xl border py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isUnlocked
                      ? `border-white/[0.16] bg-gradient-to-r ${planet.color} shadow-[0_8px_25px_rgba(0,0,0,0.20)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_32px_rgba(0,0,0,0.30)]`
                      : 'cursor-not-allowed border-white/[0.08] bg-white/[0.05] text-slate-500'
                  }`}
                  onClick={() => isUnlocked && onPlanetSelected(planet.id)}
                  disabled={!isUnlocked}
                >
                  {isUnlocked ? 'Explore Planet →' : 'Locked'}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Progress Info */}
      <GlassCard
        glow
        className="rounded-3xl border-white/[0.12] bg-slate-950/45 p-4 shadow-[0_20px_65px_rgba(0,0,0,0.30)] sm:p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Expedition Status
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Your current progress across the solar system
            </p>
          </div>
          <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.75)]" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4 text-center">
            <div className="text-2xl font-bold text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.28)]">
              {gameProgress.planetsUnlocked.length}/8
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Planets Unlocked
            </div>
          </div>

          <div className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.045] p-4 text-center">
            <div className="text-2xl font-bold text-violet-200 drop-shadow-[0_0_12px_rgba(139,92,246,0.28)]">
              {gameProgress.level}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Explorer Level
            </div>
          </div>

          <div className="rounded-2xl border border-blue-300/15 bg-blue-300/[0.045] p-4 text-center">
            <div className="text-2xl font-bold text-blue-200 drop-shadow-[0_0_12px_rgba(96,165,250,0.28)]">
              {gameProgress.score.toLocaleString()}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Total Score
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}