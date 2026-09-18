import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { CosmicBackground } from './CosmicBackground';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Star, 
  Globe, 
  Zap, 
  Award,
  Target,
  Trophy,
  ChevronRight,
  Compass,
  Moon
} from 'lucide-react';
import { useAstronomicalEvents } from '../hooks/useAstronomicalEvents';
import { useLocation } from '../hooks/useLocation';

interface EventsScreenProps {
  onNavigate: (screen: string) => void;
}

export function EventsScreen({ onNavigate }: EventsScreenProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'missions'>('events');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { events, missions } = useAstronomicalEvents();
  const { location } = useLocation();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meteor': return Star;
      case 'eclipse': return Zap;
      case 'planet': return Globe;
      case 'mission': return Target;
      case 'moon': return Moon;
      default: return Star;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <CosmicBackground variant="galaxy">
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
              className="mr-4"
            >
              <ArrowLeft />
            </CosmicIconButton>
            <div>
              <h1 className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent">Events & Missions</h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <span>Dynamically Calculated Cosmic Events</span>
                <span>•</span>
                <span className="text-violet-300 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-violet-400" />
                  {location.cityName || `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-yellow-300/15 bg-yellow-300/[0.06] px-3 py-2 shadow-[0_6px_24px_rgba(250,204,21,0.08)] backdrop-blur-xl">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-yellow-100">2,450 XP</span>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="rounded-2xl border-white/[0.12] bg-slate-950/35 p-1.5" intensity="light">
            <div className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`group flex-1 rounded-xl px-4 py-3 font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === 'events'
                    ? 'border border-violet-300/20 bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-white shadow-[0_0_24px_rgba(139,92,246,0.12)]'
                    : 'border border-transparent text-slate-400 hover:bg-white/[0.045] hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2 text-cyan-400" />
                Upcoming Real Events ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('missions')}
                className={`group flex-1 rounded-xl px-4 py-3 font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === 'missions'
                    ? 'border border-cyan-300/20 bg-gradient-to-r from-cyan-500/15 to-violet-500/15 text-white shadow-[0_0_24px_rgba(34,211,238,0.10)]'
                    : 'border border-transparent text-slate-400 hover:bg-white/[0.045] hover:text-white'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2 text-pink-400" />
                Observation Missions ({missions.length})
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Content */}
        {activeTab === 'events' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {events.map((event, index) => {
              const EventIcon = getEventIcon(event.type);
              const isExpanded = selectedEventId === event.id;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.01 }}
                >
                  <GlassCard 
                    className={`group relative overflow-hidden p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.12] ${
                      event.completed
                        ? 'border-emerald-400/30'
                        : 'border-white/[0.12] hover:border-violet-300/25'
                    }`} 
                    glow={!event.completed}
                    intensity="medium"
                    onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br ${
                          event.type === 'meteor' ? 'from-yellow-400/30 to-orange-500/20 shadow-[0_0_26px_rgba(251,191,36,0.16)]' :
                          event.type === 'eclipse' ? 'from-violet-400/30 to-pink-500/20 shadow-[0_0_26px_rgba(168,85,247,0.18)]' :
                          event.type === 'planet' ? 'from-blue-400/30 to-cyan-400/20 shadow-[0_0_26px_rgba(34,211,238,0.16)]' :
                          'from-emerald-400/30 to-teal-400/20 shadow-[0_0_26px_rgba(20,184,166,0.16)]'
                        } backdrop-blur-xl`}>
                          <EventIcon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-50">{event.name}</h3>
                            {event.countdownDays === 0 ? (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse">
                                Happening Today
                              </Badge>
                            ) : event.countdownDays > 0 ? (
                              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                in {event.countdownDays} days
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                                Completed
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-1 text-cyan-300">
                              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-3.5 h-3.5" />
                              {event.time}
                            </span>
                          </div>
                          
                          <p className="mb-3 text-sm leading-relaxed text-slate-300/90">
                            {event.description}
                          </p>
                          
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(event.difficulty)}>
                                {event.difficulty}
                              </Badge>
                              <span className="text-yellow-400 text-sm font-medium">
                                +{event.points} XP
                              </span>
                            </div>
                            
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="rounded-xl border border-violet-300/15 bg-violet-300/[0.045] px-3 py-2 text-violet-200 transition-all duration-300 hover:border-violet-300/30 hover:bg-violet-300/[0.09] hover:text-white"
                            >
                              {isExpanded ? 'Less Details' : 'View Details'}
                              <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
              >
                <GlassCard className="group p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.12]" glow intensity="medium">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-violet-400/25 to-cyan-400/20 shadow-[0_0_28px_rgba(139,92,246,0.14)] backdrop-blur-xl">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{mission.title}</h3>
                        <p className="text-gray-300 text-sm mb-3">{mission.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{mission.progress}/10</span>
                          </div>
                          
                          <div className="h-2 w-full overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.07]">
                            <motion.div 
                              className="h-2 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.25)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${(mission.progress / 10) * 100}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4">
                            <span className="text-yellow-400 text-sm font-medium">
                              {mission.reward}
                            </span>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                              {mission.badge}
                            </Badge>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="rounded-xl border border-cyan-200/20 bg-gradient-to-r from-violet-500/90 to-cyan-400/85 px-4 text-white shadow-[0_8px_26px_rgba(34,211,238,0.12)] hover:from-violet-400 hover:to-cyan-300"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </CosmicBackground>
  );
}