import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Medal, Crown, Star, Users, Clock, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
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
    <div className="relative z-10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Game
        </button>
        <h1 className="text-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Cosmic Leaderboard
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-lg text-white">{stats.totalPlayers.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Players</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-lg text-white">#{stats.yourRank}</div>
          <div className="text-xs text-gray-400">Your Rank</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg text-white">{stats.topScore.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Top Score</div>
        </GlassCard>
        
        <GlassCard className="p-4 text-center">
          <Zap className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-lg text-white">{stats.averageScore.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Average Score</div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Tab Filter */}
        <div className="flex gap-2">
          {[
            { id: 'global', label: 'Global', icon: '🌍' },
            { id: 'friends', label: 'Friends', icon: '👥' },
            { id: 'ageGroup', label: 'Age Group', icon: '👶' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Time Filter */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id as any)}
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                timeFilter === filter.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {activeTab === 'global' ? 'Global Rankings' : 
             activeTab === 'friends' ? 'Friends Rankings' : 
             'Age Group Rankings'}
          </h3>
          
          <div className="space-y-3">
            {filteredData.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg bg-white/5 border transition-all hover:bg-white/10 ${
                  entry.id === 'current-player' 
                    ? 'border-cyan-500/50 bg-cyan-500/10' 
                    : getRankColor(index + 1) || 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[60px]">
                      {getRankIcon(index + 1)}
                      <span className="text-lg">{index + 1}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={entry.id === 'current-player' ? 'text-cyan-400' : 'text-white'}>
                            {entry.name}
                          </span>
                          {entry.id === 'current-player' && (
                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">You</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          Level {entry.level} • {entry.planetsExplored} planets explored
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg text-white">{entry.score.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">{entry.totalPlayTime}</div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {entry.resourcesCollected} resources
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
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
      <GlassCard className="p-6">
        <h3 className="text-lg text-white mb-4">Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl text-cyan-400">{currentScore.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Current Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-purple-400">#{stats.yourRank}</div>
            <div className="text-sm text-gray-400">Global Rank</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-green-400">
              {stats.topScore > currentScore ? (stats.topScore - currentScore).toLocaleString() : '0'}
            </div>
            <div className="text-sm text-gray-400">Points to #1</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}