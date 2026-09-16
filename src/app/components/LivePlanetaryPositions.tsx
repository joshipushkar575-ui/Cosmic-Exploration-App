import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, Bot, Settings, Globe, Eye, TrendingUp, TrendingDown, Star, Zap, Clock, Play, Pause, Compass } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAstronomy } from '../hooks/useAstronomy';
import { useLocation } from '../hooks/useLocation';

interface LivePlanetaryPositionsProps {
  onNavigate: (screen: string) => void;
}

export function LivePlanetaryPositions({ onNavigate }: LivePlanetaryPositionsProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true); // true = exact live coordinates; false = orbit motion

  // Real astronomy telemetry and location
  const { planets, lastUpdated, isLoading } = useAstronomy();
  const { location } = useLocation();

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isLiveMode) return;
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, [isLiveMode]);

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1570556319136-3cfc640168a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBnYWxheHklMjBzdGFycyUyMG5lYnVsYSUyMGNvc21vcyUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU5MTQxMjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Floating cosmic particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: Math.random() * 0.5 + 0.2
            }}
            animate={{ 
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              opacity: [null, Math.random() * 0.8 + 0.2, Math.random() * 0.3 + 0.1]
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>
      
      {/* Title & Coordinates Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-8 text-center px-4"
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl mx-auto max-w-lg px-6 py-4 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
            Live Planetary Positions
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-4 h-4 text-violet-400 animate-pulse" />
            <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 rounded-full"></div>
            <Star className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300">
            <span className="flex items-center gap-1 text-violet-300">
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              {location.cityName || `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">JPL Ephemeris Calculated</span>
          </div>

          {/* Mode Toggle Controls */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsLiveMode(true)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isLiveMode ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg' : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Exact Current Coordinates
            </button>
            <button
              onClick={() => setIsLiveMode(false)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                !isLiveMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Play className="w-3 h-3" />
              Simulate Orbit Motion
            </button>
          </div>
        </div>
      </motion.div>

      {/* Central Solar System */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-12 pb-32">
        <div className="relative w-[1000px] h-[1000px] max-w-[90vw] max-h-[90vw]">
          {/* Orbital Paths */}
          {planets.map((planet, index) => (
            <motion.div
              key={`orbit-${planet.name}`}
              className="absolute top-1/2 left-1/2 border border-white/20 rounded-full"
              style={{
                width: `${planet.orbitRadius * 2}px`,
                height: `${planet.orbitRadius * 2}px`,
                marginLeft: `-${planet.orbitRadius}px`,
                marginTop: `-${planet.orbitRadius}px`,
              }}
              animate={{ 
                borderColor: hoveredPlanet === index ? `${planet.color}60` : 'rgba(255,255,255,0.2)'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}

          {/* Central Sun */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-500 shadow-[0_0_60px_#ffd700] z-20"
            animate={{ rotate: rotation * 0.5 }}
            transition={{ duration: 0, ease: "linear" }}
          >
            <div className="w-full h-full rounded-full bg-gradient-radial from-yellow-200 to-orange-600 animate-pulse" />
            
            {/* Enhanced sun corona */}
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-yellow-400/20 to-orange-500/40 scale-150" />
            
            {/* Sun rays */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-8 bg-yellow-400/70 rounded-full"
                  style={{
                    top: '-16px',
                    left: '50%',
                    marginLeft: '-2px',
                    transformOrigin: '50% 56px',
                    transform: `rotate(${i * 30}deg)`,
                  }}
                  animate={{ 
                    opacity: [0.4, 1, 0.4],
                    scaleY: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.15,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </div>
            
            {/* Sun flares */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`flare-${i}`}
                  className="absolute w-2 h-12 bg-gradient-to-t from-transparent to-yellow-300/80 rounded-full blur-sm"
                  style={{
                    top: '-24px',
                    left: '50%',
                    marginLeft: '-4px',
                    transformOrigin: '50% 64px',
                    transform: `rotate(${i * 60}deg)`,
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scaleY: [0.5, 1.5, 0.5]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: "easeInOut" 
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Planets driven by real heliocentric coordinates */}
          {planets.map((planet, index) => {
            // True heliocentric ecliptic longitude in radians
            const helioAngleRad = (planet.heliocentricLongitude) * (Math.PI / 180);
            
            // In simulation mode, add real proportional orbital motion
            const orbitalSpeedRatio = 365.25 / (planet.orbitalPeriodDays || 365.25);
            const displayAngle = isLiveMode 
              ? helioAngleRad 
              : helioAngleRad + (rotation * orbitalSpeedRatio * 0.05) * (Math.PI / 180);

            const x = Math.cos(displayAngle) * planet.orbitRadius;
            const y = Math.sin(displayAngle) * planet.orbitRadius;

            return (
              <motion.div
                key={planet.name}
                className="absolute top-1/2 left-1/2 cursor-pointer z-30"
                style={{
                  marginLeft: `${x - planet.size}px`,
                  marginTop: `${y - planet.size}px`,
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onHoverStart={() => setHoveredPlanet(index)}
                onHoverEnd={() => setHoveredPlanet(null)}
                onClick={() => setSelectedPlanet(selectedPlanet === index ? null : index)}
              >
                {/* Planet */}
                <div className="relative">
                  <motion.div
                    className="relative"
                    animate={{ rotate: rotation * 0.2 }}
                  >
                    <ImageWithFallback
                      src={planet.image}
                      alt={planet.name}
                      className="rounded-full object-cover border-2 border-white/40"
                      style={{ 
                        width: `${planet.size * 2}px`,
                        height: `${planet.size * 2}px`,
                        boxShadow: `0 0 ${planet.size}px ${planet.color}60`,
                        filter: 'brightness(1.1) contrast(1.2)'
                      }}
                    />
                    
                    {/* Saturn's rings */}
                    {planet.hasFeature === 'rings' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="border-2 border-gray-300/40 rounded-full"
                          style={{
                            width: `${planet.size * 3}px`,
                            height: `${planet.size * 1.5}px`,
                            transform: 'rotateX(75deg)',
                          }}
                        />
                        <div 
                          className="absolute border-2 border-gray-400/30 rounded-full"
                          style={{
                            width: `${planet.size * 2.5}px`,
                            height: `${planet.size * 1.2}px`,
                            transform: 'rotateX(75deg)',
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Jupiter's Great Red Spot */}
                    {planet.hasFeature === 'great-red-spot' && (
                      <div 
                        className="absolute bg-red-500/60 rounded-full"
                        style={{
                          width: `${planet.size * 0.4}px`,
                          height: `${planet.size * 0.3}px`,
                          top: '40%',
                          left: '60%',
                          boxShadow: '0 0 4px rgba(255, 0, 0, 0.5)'
                        }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Enhanced planet glow */}
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      boxShadow: `inset 0 0 ${planet.size}px ${planet.color}40, 0 0 ${planet.size * 1.5}px ${planet.color}30`
                    }}
                    animate={{ 
                      opacity: hoveredPlanet === index ? [0.6, 1, 0.6] : 0.4
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                  
                  {/* Planet name label */}
                  <motion.div 
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full whitespace-nowrap"
                    animate={{ 
                      scale: hoveredPlanet === index ? 1.1 : 1,
                      backgroundColor: hoveredPlanet === index ? `${planet.color}20` : 'rgba(0,0,0,0.8)'
                    }}
                  >
                    {planet.name}
                  </motion.div>
                </div>

                {/* Enhanced Info Card */}
                <AnimatePresence>
                  {selectedPlanet === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/30 rounded-2xl p-5 min-w-[320px] shadow-2xl z-40"
                      style={{ 
                        boxShadow: `0 0 40px ${planet.color}40, inset 0 0 20px ${planet.color}10`,
                        background: `linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.8))`
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <ImageWithFallback
                            src={planet.image}
                            alt={planet.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                            style={{ 
                              boxShadow: `0 0 20px ${planet.color}50`
                            }}
                          />
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{ 
                              background: `linear-gradient(45deg, transparent, ${planet.color}20)`
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-xl mb-1">{planet.name}</h3>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <p className="text-gray-300 text-sm">Constellation: {planet.constellation}</p>
                          </div>
                          {planet.name !== 'Earth' && (
                            <p className="text-gray-400 text-xs mt-1">Magnitude: <span className="text-yellow-300">{planet.magnitude}</span></p>
                          )}
                        </div>
                      </div>
                    
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 text-xs font-medium">Distance (Earth)</span>
                          </div>
                          <span className="text-white text-sm font-semibold">{planet.distanceFromEarth}</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Eye className="w-4 h-4 text-violet-400" />
                            <span className="text-violet-400 text-xs font-medium">Visibility</span>
                          </div>
                          <span className="text-white text-sm font-semibold truncate">{planet.visibility}</span>
                        </div>
                        {planet.riseTime !== 'N/A' && (
                          <>
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-xs font-medium">Rise Time</span>
                              </div>
                              <span className="text-white text-sm font-semibold">{planet.riseTime}</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingDown className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-xs font-medium">Set Time</span>
                              </div>
                              <span className="text-white text-sm font-semibold">{planet.setTime}</span>
                            </div>
                          </>
                        )}
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-medium">Helio Longitude</span>
                          </div>
                          <span className="text-white text-sm font-semibold">{planet.heliocentricLongitude.toFixed(1)}°</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-xs font-medium">Sun Distance</span>
                          </div>
                          <span className="text-white text-sm font-semibold">{planet.distanceFromSun}</span>
                        </div>
                      </div>
                    
                      {planet.nextOpposition && planet.nextOpposition !== 'N/A' && (
                        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 mb-4 border border-orange-500/30">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 text-sm font-medium">Next Opposition</span>
                          </div>
                          <span className="text-white font-semibold">{planet.nextOpposition}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-white/20 pt-4">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-violet-400" />
                          Fascinating Facts
                        </h4>
                        <div className="space-y-2">
                          {planet.facts.map((fact, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-3 p-2 bg-white/5 rounded-lg border border-white/10"
                            >
                              <span className="text-violet-400 mt-1 text-lg">•</span>
                              <span className="text-gray-300 text-sm leading-relaxed">{fact}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPlanet(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          Close
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-4 bg-black/70 backdrop-blur-xl border border-white/30 rounded-2xl px-6 py-3 shadow-2xl">
          {[
            { icon: Home, label: 'Home', screen: 'home', color: 'violet' },
            { icon: Search, label: 'Explore', screen: 'explorer', color: 'cyan' },
            { icon: Bot, label: 'AI Chat', screen: 'chat', color: 'green' },
            { icon: Settings, label: 'Profile', screen: 'profile', color: 'orange' },
          ].map((item, index) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.screen)}
              className="relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 group cursor-pointer"
              style={{
                background: `linear-gradient(135deg, transparent, ${item.color === 'violet' ? '#8b5cf6' : item.color === 'cyan' ? '#06b6d4' : item.color === 'green' ? '#10b981' : '#f59e0b'}20)`
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${item.color === 'violet' ? '#8b5cf6' : item.color === 'cyan' ? '#06b6d4' : item.color === 'green' ? '#10b981' : '#f59e0b'}20, transparent)`,
                  boxShadow: `0 0 20px ${item.color === 'violet' ? '#8b5cf6' : item.color === 'cyan' ? '#06b6d4' : item.color === 'green' ? '#10b981' : '#f59e0b'}30`
                }}
              />
              <item.icon 
                className={`w-6 h-6 text-white group-hover:text-${item.color}-400 transition-colors z-10`}
                style={{ 
                  filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))'
                }}
              />
              <span className={`text-xs text-gray-300 group-hover:text-${item.color}-300 transition-colors z-10 font-medium`}>
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}