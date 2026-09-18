import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { GlassCard } from './GlassCard';
import { CosmicBackground } from './CosmicBackground';
import { 
  Bot, 
  Calendar, 
  Globe, 
  Sparkles, 
  Zap, 
  Star, 
  Rocket, 
  Clock, 
  Eye, 
  Telescope, 
  Sun, 
  Moon, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Compass
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAstronomy } from '../hooks/useAstronomy';
import { useAstronomicalEvents } from '../hooks/useAstronomicalEvents';
import { useLocation } from '../hooks/useLocation';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Live Astronomy and Location Hooks
  const { planets, sun, moon, lastUpdated, isLoading, isOffline, refresh } = useAstronomy();
  const { events } = useAstronomicalEvents();
  const { location, setPreset, requestBrowserLocation, isDetecting, presetCities } = useLocation();

  // Get current date and time
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDateStr = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Filter out Earth for the planetary observation list (Earth is the observer)
  const observablePlanets = planets.filter(p => p.name !== 'Earth');
  const upcomingEvents = events.slice(0, 4);

  // Get user age from localStorage
  const getUserAge = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData).age;
    }
    return null;
  };

  const getAgeBasedScreen = (age: number) => {
    if (age >= 1 && age <= 12) return 'kids';
    if (age >= 13 && age <= 18) return 'teenager';
    if (age >= 19 && age <= 35) return 'adult';
    if (age >= 36 && age <= 80) return 'senior';
    return 'home';
  };

  const userAge = getUserAge();

  return (
    <CosmicBackground variant="galaxy">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-violet-400" />
              VYOM
            </h1>
            <p className="text-gray-300">Welcome back, Space Explorer</p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm">
              <span className="text-gray-400">{currentDateStr}</span>
              <span className="text-cyan-400 font-mono">{currentTime} Local</span>

              {/* Location Badge with Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-violet-300 transition-colors cursor-pointer"
                  title="Click to change location or detect GPS"
                >
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  <span>{location.cityName || `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}</span>
                </button>

                {showLocationPicker && (
                  <div className="absolute left-0 top-full mt-2 z-50 bg-black/90 backdrop-blur-xl border border-white/30 rounded-xl p-3 min-w-[220px] shadow-2xl space-y-2">
                    <div className="text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                      <span>Observing Station</span>
                      <button
                        onClick={requestBrowserLocation}
                        disabled={isDetecting}
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                      >
                        <Compass className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                        {isDetecting ? 'Detecting...' : 'Detect GPS'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {presetCities.map(city => (
                        <button
                          key={city}
                          onClick={() => {
                            setPreset(city);
                            setShowLocationPicker(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                            location.cityName?.includes(city) ? 'bg-violet-600/40 text-white font-medium' : 'text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Last Updated State & Refresh */}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3 text-gray-500" />
                <span>Updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</span>
                <button
                  onClick={refresh}
                  className="p-1 hover:text-white transition-colors"
                  title="Recalculate celestial positions"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                {isOffline && (
                  <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-mono">Offline Ephemeris</span>
                )}
              </div>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onNavigate('chat')}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-full px-6 py-3 hover:from-violet-600 hover:to-cyan-600"
            >
              <Bot className="w-5 h-5 mr-2" />
              Chat with AI
            </Button>
          </motion.div>
        </motion.div>

        {/* Live Sun & Moon Celestial Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          {/* Sun Telemetry */}
          <GlassCard className="p-4" intensity="light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,165,0,0.5)]">
                  <Sun className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm flex items-center gap-1.5">
                    Sun
                    <span className="text-xs text-yellow-300 font-normal">in {sun.constellation}</span>
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Alt: <span className="text-white">{sun.altitude.toFixed(1)}°</span> • Az: <span className="text-white">{sun.azimuth.toFixed(0)}°</span>
                  </p>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="flex items-center justify-end gap-1 text-gray-300">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span>Rise: {sun.riseTime}</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-gray-300 mt-0.5">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span>Set: {sun.setTime}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Moon Telemetry */}
          <GlassCard className="p-4" intensity="light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm flex items-center gap-1.5">
                    Moon {moon.phaseEmoji}
                    <span className="text-xs text-purple-300 font-normal">{moon.phaseName}</span>
                  </h3>
                  <p className="text-gray-400 text-xs">
                    Illum: <span className="text-white">{moon.illumination}%</span> • Age: <span className="text-white">{moon.ageDays}d</span>
                  </p>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="flex items-center justify-end gap-1 text-gray-300">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span>Rise: {moon.riseTime}</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-gray-300 mt-0.5">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span>Set: {moon.setTime}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Live Planetary Positions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" glow intensity="medium">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-400" />
                  Live Planetary Positions
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('explorer')}
                  className="text-violet-400 hover:text-violet-300"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View 3D
                </Button>
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {observablePlanets.map((planet, index) => (
                  <motion.div
                    key={planet.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => onNavigate('explorer')}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Planet Image */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <ImageWithFallback
                            src={planet.image}
                            alt={planet.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                            style={{ 
                              boxShadow: `0 0 15px ${planet.color}40`
                            }}
                          />
                          <div className="absolute -top-1 -right-1">
                            <span className="text-yellow-400 text-xs font-mono bg-black/70 px-1 py-0.5 rounded">
                              {planet.magnitude}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Planet Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white font-medium text-base">{planet.name}</h3>
                            <p className="text-gray-400 text-xs">{planet.constellation}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400 mb-1">Rise/Set</div>
                            <div className="flex items-center gap-1 text-xs">
                              <TrendingUp className="w-3 h-3 text-green-400" />
                              <span className="text-gray-300">{planet.riseTime}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <TrendingDown className="w-3 h-3 text-red-400" />
                              <span className="text-gray-300">{planet.setTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div className="flex items-center gap-1 text-gray-300">
                            <Globe className="w-3 h-3 text-cyan-400" />
                            <span>{planet.distanceFromEarth}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-300">
                            <Telescope className="w-3 h-3 text-violet-400" />
                            <span>{planet.angularSize}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-300">
                            <Eye className="w-3 h-3 text-yellow-400" />
                            <span className="truncate">{planet.visibility}</span>
                          </div>
                        </div>
                        
                        {planet.nextOpposition !== 'N/A' && (
                          <div className="text-xs">
                            <span className="text-orange-400">Opposition: </span>
                            <span className="text-gray-300">{planet.nextOpposition}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Upcoming Space Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6" glow intensity="medium">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                  Upcoming Events
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('events')}
                  className="text-violet-400 hover:text-violet-300"
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id || event.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => onNavigate('events')}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <h3 className="text-white font-medium">{event.name}</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.date}
                          {event.countdownDays >= 0 && (
                            <span className="text-xs text-cyan-400 ml-1">
                              ({event.countdownDays === 0 ? 'Tonight' : `in ${event.countdownDays}d`})
                            </span>
                          )}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{event.time}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        {event.type === 'meteor' && <Star className="w-4 h-4 text-white" />}
                        {event.type === 'planet' && <Globe className="w-4 h-4 text-white" />}
                        {event.type === 'eclipse' && <Zap className="w-4 h-4 text-white" />}
                        {event.type === 'mission' && <Calendar className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6" intensity="light">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Explore Cosmos', icon: Rocket, screen: 'explorer', gradient: 'from-purple-500 to-pink-500' },
                { label: 'Space Events', icon: Calendar, screen: 'events', gradient: 'from-blue-500 to-cyan-500' },
                { label: 'Cosmic Game', icon: Zap, screen: 'game', gradient: 'from-cyan-500 to-blue-500' },
                { label: 'AI Assistant', icon: Bot, screen: 'chat', gradient: 'from-green-500 to-teal-500' },
                { label: 'Profile', icon: Star, screen: 'profile', gradient: 'from-orange-500 to-red-500' },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(action.screen)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${action.gradient} text-white hover:shadow-lg transition-all`}
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Age-Based Section Entry */}
        {userAge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <GlassCard className="p-6" intensity="medium">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {userAge >= 1 && userAge <= 12 && "Welcome to Space Explorers! 🚀"}
                  {userAge >= 13 && userAge <= 18 && "Space Academy Awaits You! 🌟"}
                  {userAge >= 19 && userAge <= 35 && "Join the Research Hub! 🔬"}
                  {userAge >= 36 && userAge <= 80 && "Wisdom Council Welcomes You! 👑"}
                </h2>
                <p className="text-gray-300 mb-4">
                  {userAge >= 1 && userAge <= 12 && "Fun games, quizzes, and adventures designed just for young astronomers!"}
                  {userAge >= 13 && userAge <= 18 && "Competitions, challenges, and advanced learning for future space scientists!"}
                  {userAge >= 19 && userAge <= 35 && "Collaborate on real research, access professional tools, and advance your career!"}
                  {userAge >= 36 && userAge <= 80 && "Share your knowledge, mentor others, and leave a lasting legacy in space science!"}
                </p>
                <Button
                  onClick={() => onNavigate(getAgeBasedScreen(userAge))}
                  className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8 py-3 rounded-full"
                >
                  {userAge >= 1 && userAge <= 12 && "Start Playing! 🎮"}
                  {userAge >= 13 && userAge <= 18 && "Join Academy! 🏆"}
                  {userAge >= 19 && userAge <= 35 && "Enter Research Hub! 🧪"}
                  {userAge >= 36 && userAge <= 80 && "Join Wisdom Council! 📚"}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </CosmicBackground>
  );
}