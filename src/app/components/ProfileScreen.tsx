import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';
import { CosmicBackground } from './CosmicBackground';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Settings, 
  Trophy, 
  Star, 
  Users, 
  Heart,
  MessageCircle,
  Share,
  Award,
  Target,
  Zap,
  Globe,
  Telescope,
  Moon,
  Sun,
  Satellite,
  Rocket,
  Eye,
  Camera,
  Navigation,
  Compass
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

interface CommunityPost {
  id: string;
  user: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  earned: boolean;
  rarity: 'common' | 'rare' | 'legendary';
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userData');
    onNavigate('auth');
  };
  const userStats = {
    level: 8,
    xp: 2450,
    nextLevelXp: 3000,
    planetsExplored: 4,
    eventsWatched: 7,
    achievements: 6,
    observationHours: 47,
    photosCapture: 23
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Light',
      description: 'Successfully observed your first deep-sky object through telescope',
      icon: Telescope,
      earned: true,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Luna Observer',
      description: 'Photographed all 8 major lunar phases in one cycle',
      icon: Moon,
      earned: true,
      rarity: 'common'
    },
    {
      id: '3',
      title: 'Solar Tracker',
      description: 'Safely observed and documented solar activity for 30 days',
      icon: Sun,
      earned: false,
      rarity: 'rare'
    },
    {
      id: '4',
      title: 'Constellation Master',
      description: 'Identified and logged all 88 official constellations',
      icon: Star,
      earned: false,
      rarity: 'legendary'
    },
    {
      id: '5',
      title: 'Planetary Photographer',
      description: 'Captured clear images of Venus, Mars, Jupiter, and Saturn',
      icon: Camera,
      earned: true,
      rarity: 'rare'
    },
    {
      id: '6',
      title: 'ISS Spotter',
      description: 'Successfully tracked and photographed the International Space Station',
      icon: Satellite,
      earned: true,
      rarity: 'rare'
    },
    {
      id: '7',
      title: 'Meteor Shower Maven',
      description: 'Observed and counted meteors during 5 different annual showers',
      icon: Zap,
      earned: false,
      rarity: 'rare'
    },
    {
      id: '8',
      title: 'Deep Space Pioneer',
      description: 'Observed galaxies, nebulae, and star clusters beyond our solar system',
      icon: Eye,
      earned: true,
      rarity: 'rare'
    },
    {
      id: '9',
      title: 'Messier Marathon',
      description: 'Observed all 110 Messier objects in the catalog',
      icon: Target,
      earned: false,
      rarity: 'legendary'
    },
    {
      id: '10',
      title: 'Night Navigator',
      description: 'Used stars for celestial navigation and found your location',
      icon: Navigation,
      earned: false,
      rarity: 'rare'
    },
    {
      id: '11',
      title: 'Eclipse Chaser',
      description: 'Witnessed and documented a total solar or lunar eclipse',
      icon: Sun,
      earned: true,
      rarity: 'legendary'
    },
    {
      id: '12',
      title: 'Comet Hunter',
      description: 'Discovered or observed a comet visible to amateur astronomers',
      icon: Rocket,
      earned: false,
      rarity: 'legendary'
    }
  ];

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      user: 'AstroPhotoMike',
      avatar: 'AM',
      content: 'Finally captured the Orion Nebula with my 8" telescope! 45 minutes of stacked exposures. The detail in M42 never ceases to amaze me. Check out those Trapezium stars! 🔭✨',
      image: 'https://images.unsplash.com/photo-1615392030676-6c532fe0c302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBuZWJ1bGElMjBwdXJwbGUlMjBibHVlfGVufDF8fHx8MTc1ODgwMTY0NXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 89,
      comments: 24,
      timestamp: '4h ago'
    },
    {
      id: '2',
      user: 'TelescopeNova',
      avatar: 'TN',
      content: 'Just earned my "ISS Spotter" badge! Caught the International Space Station passing over at magnitude -3.2. Perfect timing at sunset. Anyone else tracking ISS passes this week?',
      likes: 56,
      comments: 15,
      timestamp: '8h ago'
    },
    {
      id: '3',
      user: 'DeepSkyHunter',
      avatar: 'DS',
      content: 'Geminids meteor shower observation log: Counted 47 meteors in 2 hours from a Bortle 3 site. Best fireball was at 23:42 UTC - absolutely spectacular! Weather looking good for tonight too 🌠',
      likes: 73,
      comments: 19,
      timestamp: '1d ago'
    },
    {
      id: '4',
      user: 'LunarObserver',
      avatar: 'LO',
      content: 'Completed my lunar phase photography project! All 8 major phases captured over 29.5 days. The terminator details during the waxing gibbous phase were incredible. Working on a time-lapse next! 🌙',
      likes: 112,
      comments: 31,
      timestamp: '2d ago'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'You', xp: 2450, avatar: 'YU' },
    { rank: 2, name: 'AstroMike', xp: 2380, avatar: 'AM' },
    { rank: 3, name: 'SpaceQueen', xp: 2210, avatar: 'SQ' },
    { rank: 4, name: 'CosmicTom', xp: 2100, avatar: 'CT' },
    { rank: 5, name: 'StarLily', xp: 1950, avatar: 'SL' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <CosmicBackground variant="nebula">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="text-white hover:text-violet-300 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Profile & Community</h1>
              <p className="text-gray-300">Your cosmic journey and social hub</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-violet-300"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <GlassCard className="p-6 text-center" glow intensity="medium">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">YU</span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">Space Explorer</h2>
              <p className="text-gray-300 mb-4">Level {userStats.level} Cosmic Adventurer</p>
              
              {/* XP Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>{userStats.xp} XP</span>
                  <span>{userStats.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{userStats.observationHours}</div>
                  <div className="text-xs text-gray-400">Hours Observed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{userStats.photosCapture}</div>
                  <div className="text-xs text-gray-400">Photos Captured</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{userStats.eventsWatched}</div>
                  <div className="text-xs text-gray-400">Events Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{userStats.achievements}</div>
                  <div className="text-xs text-gray-400">Badges Earned</div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                Edit Profile
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full mt-3 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                Logout
              </Button>
            </GlassCard>

            {/* Leaderboard */}
            <GlassCard className="p-6 mt-6" intensity="medium">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top Explorers
              </h3>
              
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div 
                    key={player.rank}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      player.name === 'You' ? 'bg-violet-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      player.rank === 1 ? 'bg-yellow-500 text-black' :
                      player.rank === 2 ? 'bg-gray-400 text-black' :
                      player.rank === 3 ? 'bg-orange-500 text-black' :
                      'bg-gray-600 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{player.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{player.name}</div>
                      <div className="text-gray-400 text-xs">{player.xp} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Achievements */}
            <GlassCard className="p-6" intensity="medium">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      className={`p-3 rounded-lg border transition-all ${
                        achievement.earned 
                          ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                          : 'bg-white/5 border-white/10 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          achievement.earned 
                            ? achievement.rarity === 'legendary' 
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30' 
                              : achievement.rarity === 'rare'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30'
                            : 'bg-gray-600'
                        }`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white text-sm truncate">{achievement.title}</h4>
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">{achievement.description}</p>
                        </div>
                        
                        {achievement.earned && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Community Posts */}
            <GlassCard className="p-6" intensity="medium">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Community Hub
              </h3>
              
              <div className="space-y-4">
                {communityPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{post.avatar}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{post.user}</span>
                          <span className="text-gray-400 text-xs">{post.timestamp}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                        
                        {post.image && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <ImageWithFallback 
                              src={post.image} 
                              alt="Community post"
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-gray-400">
                          <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                            <Share className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </CosmicBackground>
  );
}
