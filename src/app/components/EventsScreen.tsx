import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GlassCard } from './GlassCard';
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('home')}
              className="text-white hover:text-violet-300 mr-4 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Events & Missions</h1>
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <span>Dynamically Calculated Cosmic Events</span>
                <span>•</span>
                <span className="text-violet-300 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-violet-400" />
                  {location.cityName || `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">2,450 XP</span>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="p-1" intensity="light">
            <div className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'events' 
                    ? 'bg-violet-500/30 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2 text-cyan-400" />
                Upcoming Real Events ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('missions')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === 'missions' 
                    ? 'bg-violet-500/30 text-white' 
                    : 'text-gray-400 hover:text-white'
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
                    className={`p-6 cursor-pointer hover:bg-white/15 transition-all ${
                      event.completed ? 'border-green-500/50' : ''
                    }`} 
                    glow={!event.completed}
                    intensity="medium"
                    onClick={() => setSelectedEventId(isExpanded ? null : event.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                          event.type === 'meteor' ? 'from-yellow-500 to-orange-500' :
                          event.type === 'eclipse' ? 'from-purple-500 to-pink-500' :
                          event.type === 'planet' ? 'from-blue-500 to-cyan-500' :
                          'from-green-500 to-teal-500'
                        } flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <EventIcon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">{event.name}</h3>
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
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-2">
                            <span className="flex items-center gap-1 text-cyan-300">
                              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <Clock className="w-3.5 h-3.5" />
                              {event.time}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 text-sm leading-relaxed mb-3">
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
                              className="text-violet-400 hover:text-violet-300 cursor-pointer"
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
                <GlassCard className="p-6 cursor-pointer hover:bg-white/15 transition-all" glow intensity="medium">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
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
                          
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full"
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
                            className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white cursor-pointer"
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