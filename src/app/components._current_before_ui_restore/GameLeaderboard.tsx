import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, Star, Users, Clock, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { motion } from 'motion/react';

interface GameLeaderboardProps {
  currentScore: number;
  onBack: () => void;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  resourcesCollected: number;
  planetsExplored: number;
  totalPlayTime: string;
  avatar: string;
  lastActive: string;
  ageGroup: 'kids' | 'teenager' | 'adult' | 'senior';
}

interface LeaderboardStats {
  totalPlayers: number;
  averageScore: number;
  topScore: number;
  yourRank: number;
}

export function GameLeaderboard({ currentScore, onBack }: GameLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'ageGroup'>('global');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalPlayers: 0,
    averageScore: 0,
    topScore: 0,
    yourRank: 0
  });

  useEffect(() => {
    // Generate mock leaderboard data
    const generateMockData = (): LeaderboardEntry[] => {
      const names = [
        'CosmicExplorer', 'StarNavigator', 'NebulaHunter', 'GalaxyRover', 'AstroSeeker',
        'VoidWanderer', 'PlanetHopper', 'StellarPilot', 'SpaceNomad', 'OrbitRunner',
        'CosmicVoyager', 'StardustTracer', 'AstroAdventurer', 'GalacticScout', 'SpaceRanger'
      ];
      
      const avatars = ['🚀', '👨‍🚀', '👩‍🚀', '🛸', '🌟', '⭐', '🌙', '🪐', '🌌', '☄️'];
      const ageGroups: LeaderboardEntry['ageGroup'][] = ['kids', 'teenager', 'adult', 'senior'];
      
      return Array.from({ length: 50 }, (_, i) => ({
        id: `player-${i}`,
        name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000),
        score: Math.floor(Math.random() * 50000) + 1000,
        level: Math.floor(Math.random() * 20) + 1,
        resourcesCollected: Math.floor(Math.random() * 500) + 50,
        planetsExplored: Math.floor(Math.random() * 8) + 1,
        totalPlayTime: `${Math.floor(Math.random() * 20) + 1}h ${Math.floor(Math.random() * 60)}m`,
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        lastActive: Math.floor(Math.random() * 7) + 1 + ' days ago',
        ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)]
      })).sort((a, b) => b.score - a.score);
    };

    const mockData = generateMockData();
    
    // Add current player to the list
    const currentPlayer: LeaderboardEntry = {
      id: 'current-player',
      name: 'You',
      score: currentScore,
      level: JSON.parse(localStorage.getItem('vyomGameProgress') || '{}').level || 1,
      resourcesCollected: JSON.parse(localStorage.getItem('vyomGameProgress') || '{}').resourcesCollected || 0,
      planetsExplored: JSON.parse(localStorage.getItem('vyomGameProgress') || '{}').planetsUnlocked?.length || 3,
      totalPlayTime: '2h 30m',
      avatar: '👤',
      lastActive: 'Now',
      ageGroup: 'adult'
    };
    
    const allData = [...mockData, currentPlayer].sort((a, b) => b.score - a.score);
    setLeaderboardData(allData);
    
    // Calculate stats
    const totalPlayers = allData.length;
    const averageScore = Math.floor(allData.reduce((sum, entry) => sum + entry.score, 0) / totalPlayers);
    const topScore = allData[0].score;
    const yourRank = allData.findIndex(entry => entry.id === 'current-player') + 1;
    
    setStats({ totalPlayers, averageScore, topScore, yourRank });
  }, [currentScore]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 2:
        return 'from-gray-300/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'from-orange-400/20 to-red-500/20 border-orange-400/30';
      default:
        return '';
    }
  };

  const filteredData = leaderboardData.filter(entry => {
    if (activeTab === 'ageGroup') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userAge = userData.age || 25;
      const userAgeGroup = userAge <= 12 ? 'kids' : userAge <= 18 ? 'teenager' : userAge <= 35 ? 'adult' : 'senior';
      return entry.ageGroup === userAgeGroup;
    }
    return true;
  }).slice(0, 20);

  return (
    <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CosmicIconButton
            onClick={onBack}
            size="md"
            glow="cyan"
            label="Back to Game"
          >
            <ArrowLeft />
          </CosmicIconButton>

          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/60">
              VYOM • GAME HUB
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              Cosmic Leaderboard
            </h1>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Live Rankings
          </div>
          <div className="mt-1 text-sm text-slate-300">
            Explore • Discover • Rise
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <GlassCard className="group p-4 sm:p-5 text-center rounded-2xl">
          <Users className="w-6 h-6 text-cyan-300 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.45)] transition-transform duration-300 group-hover:scale-110" />
          <div className="text-xl font-semibold tracking-tight text-white">{stats.totalPlayers.toLocaleString()}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">Total Players</div>
        </GlassCard>
        
        <GlassCard className="group p-4 sm:p-5 text-center rounded-2xl">
          <Trophy className="w-6 h-6 text-yellow-300 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)] transition-transform duration-300 group-hover:scale-110" />
          <div className="text-xl font-semibold tracking-tight text-white">#{stats.yourRank}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">Your Rank</div>
        </GlassCard>
        
        <GlassCard className="group p-4 sm:p-5 text-center rounded-2xl">
          <Star className="w-6 h-6 text-violet-300 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(167,139,250,0.45)] transition-transform duration-300 group-hover:scale-110" />
          <div className="text-xl font-semibold tracking-tight text-white">{stats.topScore.toLocaleString()}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">Top Score</div>
        </GlassCard>
        
        <GlassCard className="group p-4 sm:p-5 text-center rounded-2xl">
          <Zap className="w-6 h-6 text-emerald-300 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.45)] transition-transform duration-300 group-hover:scale-110" />
          <div className="text-xl font-semibold tracking-tight text-white">{stats.averageScore.toLocaleString()}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">Average Score</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2 backdrop-blur-xl">
        {/* Tab Filter */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.06] bg-black/20 p-1">
          {[
            { id: 'global', label: 'Global', icon: '🌍' },
            { id: 'friends', label: 'Friends', icon: '👥' },
            { id: 'ageGroup', label: 'Age Group', icon: '👶' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group rounded-xl px-3 py-2 sm:px-4 text-sm transition-all duration-300 flex items-center gap-2 border ${
                activeTab === tab.id
                  ? 'border-cyan-300/25 bg-cyan-300/[0.10] text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.10)]'
                  : 'border-transparent bg-white/[0.025] text-slate-400 hover:border-white/[0.10] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Time Filter */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.06] bg-black/20 p-1">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id as any)}
              className={`rounded-xl px-3 py-2 text-xs sm:text-sm transition-all duration-300 border ${
                timeFilter === filter.id
                  ? 'border-violet-300/25 bg-violet-300/[0.10] text-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.10)]'
                  : 'border-transparent bg-white/[0.025] text-slate-400 hover:border-white/[0.10] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <GlassCard className="p-4 sm:p-6 rounded-3xl">
        <div className="space-y-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {activeTab === 'global' ? 'Global Rankings' : 
             activeTab === 'friends' ? 'Friends Rankings' : 
             'Age Group Rankings'}
          </h3>
          </div>
          
          <div className="space-y-3">
            {filteredData.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative overflow-hidden p-3 sm:p-4 rounded-2xl bg-white/[0.035] border backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.065] hover:shadow-[0_10px_35px_rgba(0,0,0,0.20)] ${
                  entry.id === 'current-player' 
                    ? 'border-cyan-300/30 bg-cyan-300/[0.075] shadow-[0_0_28px_rgba(34,211,238,0.08)]' 
                    : getRankColor(index + 1) || 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[52px] sm:min-w-[64px]">
                      {getRankIcon(index + 1)}
                      <span className="text-sm sm:text-base font-semibold text-slate-300 tabular-nums">{index + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.055] text-xl sm:text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_18px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105">
                        {entry.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={entry.id === 'current-player' ? 'font-semibold text-cyan-200' : 'font-medium text-white'}>
                            {entry.name}
                          </span>
                          {entry.id === 'current-player' && (
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan-200">You</span>
                          )}
                        </div>
                        <div className="mt-1 text-xs sm:text-sm text-slate-500">
                          Level {entry.level} • {entry.planetsExplored} planets explored
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-semibold tabular-nums text-white">{entry.score.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-slate-500">{entry.totalPlayTime}</div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500 sm:grid-cols-3 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-300/70" />
                    {entry.resourcesCollected} resources
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-300/70" />
                    {entry.lastActive}
                  </div>
                  <div className="text-right capitalize">
                    {entry.ageGroup} league
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Your Current Position */}
      <GlassCard className="p-4 sm:p-6 rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/60">
              Personal telemetry
            </div>
            <h3 className="mt-1 text-lg sm:text-xl font-semibold text-white">Your Progress</h3>
          </div>
          <div className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1 text-[10px] uppercase tracking-wider text-cyan-200">
            Current Run
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]">
            <div className="text-2xl font-semibold tabular-nums text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.20)]">{currentScore.toLocaleString()}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Current Score</div>
          </div>
          <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]">
            <div className="text-2xl font-semibold tabular-nums text-violet-200 drop-shadow-[0_0_12px_rgba(139,92,246,0.20)]">#{stats.yourRank}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Global Rank</div>
          </div>
          <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]">
            <div className="text-2xl font-semibold tabular-nums text-emerald-200 drop-shadow-[0_0_12px_rgba(52,211,153,0.20)]">
              {stats.topScore > currentScore ? (stats.topScore - currentScore).toLocaleString() : '0'}
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Points to #1</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}