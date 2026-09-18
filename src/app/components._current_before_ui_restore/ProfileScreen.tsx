import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
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
      case 'common': return 'bg-white/[0.06] text-slate-300 border-white/[0.12]';
      case 'rare': return 'bg-cyan-400/[0.08] text-cyan-200 border-cyan-300/20';
      case 'legendary': return 'bg-amber-400/[0.08] text-amber-200 border-amber-300/20';
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
            <CosmicIconButton
              onClick={() => onNavigate('home')}
              size="md"
              glow="violet"
              label="Back to home"
              className="mr-3"
            >
              <ArrowLeft />
            </CosmicIconButton>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">Profile & Community</h1>
              <p className="text-slate-400 text-sm">Your cosmic journey and social hub</p>
            </div>
          </div>

          <CosmicIconButton
            size="md"
            glow="cyan"
            label="Profile settings"
          >
            <Settings />
          </CosmicIconButton>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <GlassCard
              className="relative overflow-hidden rounded-3xl border-white/[0.14] bg-slate-950/50 p-6 text-center shadow-[0_22px_70px_rgba(0,0,0,0.40),0_0_45px_rgba(139,92,246,0.10)] backdrop-blur-2xl"
              glow
              intensity="strong"
            >
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/90 via-indigo-500/80 to-cyan-400/90 mx-auto mb-5 flex items-center justify-center border border-white/20 shadow-[0_0_45px_rgba(139,92,246,0.30)] after:absolute after:inset-1 after:rounded-full after:border after:border-white/10">
                <span className="relative z-10 text-white text-2xl font-bold tracking-wider drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">YU</span>
              </div>
              
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Space Explorer</h2>
              <p className="text-slate-400 text-sm mb-5">Level {userStats.level} Cosmic Adventurer</p>
              
              {/* XP Progress */}
              <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{userStats.xp} XP</span>
                  <span>{userStats.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-white/[0.07] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400 h-2 rounded-full shadow-[0_0_14px_rgba(34,211,238,0.30)]"
                    style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[0.04]">
                  <div className="text-xl font-bold text-white">{userStats.observationHours}</div>
                  <div className="text-[11px] text-slate-500">Hours Observed</div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[0.04]">
                  <div className="text-xl font-bold text-white">{userStats.photosCapture}</div>
                  <div className="text-[11px] text-slate-500">Photos Captured</div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center transition-all duration-300 hover:border-violet-300/20 hover:bg-violet-300/[0.04]">
                  <div className="text-xl font-bold text-white">{userStats.eventsWatched}</div>
                  <div className="text-[11px] text-slate-500">Events Tracked</div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-center transition-all duration-300 hover:border-violet-300/20 hover:bg-violet-300/[0.04]">
                  <div className="text-xl font-bold text-white">{userStats.achievements}</div>
                  <div className="text-[11px] text-slate-500">Badges Earned</div>
                </div>
              </div>

              <Button className="w-full rounded-xl border border-cyan-300/20 bg-gradient-to-r from-violet-500/85 to-cyan-400/75 text-white shadow-[0_10px_30px_rgba(34,211,238,0.12)] hover:from-violet-400 hover:to-cyan-300 hover:text-slate-950">
                Edit Profile
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full mt-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.04] text-rose-300 hover:border-rose-300/35 hover:bg-rose-400/[0.08] hover:text-rose-200"
              >
                Logout
              </Button>
            </GlassCard>

            {/* Leaderboard */}
            <GlassCard className="mt-6 rounded-3xl border-white/[0.12] bg-slate-950/45 p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl" intensity="strong">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.35)]" />
                Top Explorers
              </h3>
              
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div 
                    key={player.rank}
                    className={`group flex items-center gap-3 rounded-2xl border p-2.5 transition-all duration-300 ${
                      player.name === 'You'
                        ? 'border-violet-300/20 bg-violet-400/[0.08] shadow-[0_0_25px_rgba(139,92,246,0.08)]'
                        : 'border-white/[0.06] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border shadow-[0_4px_15px_rgba(0,0,0,0.20)] ${
                      player.rank === 1 ? 'border-amber-200/30 bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950' :
                      player.rank === 2 ? 'border-white/20 bg-white/20 text-white' :
                      player.rank === 3 ? 'border-orange-200/30 bg-orange-400/80 text-slate-950' :
                      'border-white/[0.10] bg-white/[0.07] text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/80 to-cyan-400/70 flex items-center justify-center border border-white/10 shadow-[0_5px_18px_rgba(139,92,246,0.15)]">
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
            <GlassCard className="rounded-3xl border-white/[0.12] bg-slate-950/45 p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl" intensity="strong">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.30)]" />
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
                      className={`group rounded-2xl border p-3 transition-all duration-300 ${
                        achievement.earned
                          ? 'border-white/[0.12] bg-white/[0.045] hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.06]'
                          : 'border-white/[0.06] bg-white/[0.02] opacity-55'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                          achievement.earned
                            ? achievement.rarity === 'legendary'
                              ? 'border-amber-300/20 bg-gradient-to-br from-amber-400/70 to-orange-500/70 shadow-[0_0_24px_rgba(251,191,36,0.16)]'
                              : achievement.rarity === 'rare'
                                ? 'border-violet-300/20 bg-gradient-to-br from-violet-500/70 to-cyan-400/60 shadow-[0_0_24px_rgba(139,92,246,0.15)]'
                                : 'border-cyan-300/20 bg-gradient-to-br from-cyan-400/70 to-blue-500/70 shadow-[0_0_24px_rgba(34,211,238,0.15)]'
                            : 'border-white/[0.08] bg-white/[0.04]'
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
                            <div className="w-6 h-6 rounded-full border border-emerald-200/30 bg-emerald-400/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.20)]">
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
            <GlassCard className="rounded-3xl border-white/[0.12] bg-slate-950/45 p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl" intensity="strong">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.25)]" />
                Community Hub
              </h3>
              
              <div className="space-y-4">
                {communityPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.045] shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/80 to-cyan-400/70 flex items-center justify-center border border-white/10 shadow-[0_6px_20px_rgba(139,92,246,0.16)]">
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
                        
                        <div className="flex items-center gap-2 text-slate-500">
                          <button
                            type="button"
                            aria-label={`Like ${post.user}'s post`}
                            className="group inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/20 hover:bg-rose-300/[0.08] hover:text-rose-300 hover:shadow-[0_8px_24px_rgba(244,63,94,0.12)] active:translate-y-0 active:scale-95"
                          >
                            <Heart className="size-4 transition-transform duration-300 group-hover:scale-110" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button
                            type="button"
                            aria-label={`View comments on ${post.user}'s post`}
                            className="group inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[0.08] hover:text-cyan-300 hover:shadow-[0_8px_24px_rgba(34,211,238,0.12)] active:translate-y-0 active:scale-95"
                          >
                            <MessageCircle className="size-4 transition-transform duration-300 group-hover:scale-110" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button
                            type="button"
                            aria-label={`Share ${post.user}'s post`}
                            className="group inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] p-2 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.08] hover:text-emerald-300 hover:shadow-[0_8px_24px_rgba(52,211,153,0.12)] active:translate-y-0 active:scale-95"
                          >
                            <Share className="size-4 transition-transform duration-300 group-hover:scale-110" />
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
