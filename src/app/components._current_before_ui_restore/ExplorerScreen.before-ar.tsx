import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { GlassCard } from './GlassCard';
import { CosmicBackground } from './CosmicBackground';
import { 
  ArrowLeft, 
  Eye, 
  Maximize, 
  RotateCcw,
  Play, 
  Pause, 
  Zap, 
  Info,
  Globe,
  Star,
  Compass
} from 'lucide-react';
import { useAstronomy } from '../hooks/useAstronomy';
import { useLocation } from '../hooks/useLocation';
import { OriginalSolarSystem3D } from './OriginalSolarSystem3D';

interface ExplorerScreenProps {
  onNavigate: (screen: string) => void;
}

interface PlanetViewModel {
  name: string;
  size: number;
  distance: number;
  color: string;
  info: string;
  orbital_period: number;
  realSize: number; // Actual diameter in km
  distanceFromSun: number; // Real current distance in AU
  distanceFromEarth: string;
  magnitude: string;
  constellation: string;
  currentPosition: number; // True heliocentric orbital position in degrees
  moons: number;
  type: 'terrestrial' | 'gas-giant' | 'ice-giant';
}

const VISUAL_DISTANCES: Record<string, number> = {
  Mercury: 70,
  Venus: 100,
  Earth: 130,
  Mars: 160,
  Jupiter: 220,
  Saturn: 280,
  Uranus: 340,
  Neptune: 400
};

const VISUAL_SIZES: Record<string, number> = {
  Mercury: 6,
  Venus: 10,
  Earth: 12,
  Mars: 8,
  Jupiter: 35,
  Saturn: 30,
  Uranus: 18,
  Neptune: 16
};

export function ExplorerScreen({ onNavigate }: ExplorerScreenProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetViewModel | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'3d' | 'ar'>('3d');

  const { planets: livePlanets, lastUpdated } = useAstronomy();
  const { location } = useLocation();

  // Construct planets with live calculated telemetry
  const planets: PlanetViewModel[] = useMemo(() => {
    return livePlanets.map(p => ({
      name: p.name,
      size: VISUAL_SIZES[p.name] || 10,
      distance: VISUAL_DISTANCES[p.name] || 100,
      color: p.color,
      info: p.facts[0] || 'Solar system planet',
      orbital_period: p.orbitalPeriodDays,
      realSize: p.realDiameterKm,
      distanceFromSun: p.distanceFromSunNumAU,
      distanceFromEarth: p.distanceFromEarth,
      magnitude: p.magnitude,
      constellation: p.constellation,
      currentPosition: Math.round(p.heliocentricLongitude),
      moons: p.moonsCount,
      type: p.type
    }));
  }, [livePlanets]);

  const handlePlanetClick = (planet: PlanetViewModel) => {
    setSelectedPlanet(planet);
  };

  return (
    <CosmicBackground variant="deep-space">
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
              <h1 className="text-2xl font-bold text-white">3D Cosmic Explorer</h1>
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <span>Interactive Solar System</span>
                <span>•</span>
                <span className="text-cyan-400 font-mono text-xs">Positions: Live Real-Time Heliocentric Longitude</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === '3d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('3d')}
              className="text-white cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-1" />
              3D View
            </Button>
            <Button
              variant={viewMode === 'ar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('ar')}
              className="text-white cursor-pointer"
            >
              <Maximize className="w-4 h-4 mr-1" />
              AR Mode
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
          {/* 3D Solar System Viewer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 h-full"
          >
            <GlassCard className="h-full p-6 flex flex-col" glow intensity="medium">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-white">Solar System</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    JPL Astronomical Elements
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                    className="text-white hover:text-violet-300 cursor-pointer"
                    title={isAnimating ? 'Pause motion' : 'Play motion'}
                  >
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Reset selection
                      setSelectedPlanet(null);
                    }}
                    className="text-white hover:text-violet-300 cursor-pointer"
                    title="Reset view"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Solar System Container */}
              <div className="relative flex-1 bg-black/40 rounded-lg overflow-hidden">
                <OriginalSolarSystem3D />

                {/* View Mode Indicator */}
                <div className="absolute top-4 right-4 z-50">
                  <GlassCard className="px-3 py-1" intensity="light">
                    <span className="text-white text-xs flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      {viewMode.toUpperCase()} Mode
                    </span>
                  </GlassCard>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Planet Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 h-full"
          >
            <GlassCard className="h-full p-6 flex flex-col overflow-y-auto" intensity="medium">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Planet Info
              </h2>

              {selectedPlanet ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-3"
                      style={{ 
                        backgroundColor: selectedPlanet.color,
                        boxShadow: `0 0 30px ${selectedPlanet.color}60`
                      }}
                    />
                    <h3 className="text-xl font-bold text-white">{selectedPlanet.name}</h3>
                    <p className="text-xs text-violet-300 font-mono mt-0.5">Helio Lon: {selectedPlanet.currentPosition}°</p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-gray-400 text-xs">Diameter</p>
                        <p className="text-white font-medium text-xs">{selectedPlanet.realSize.toLocaleString()} km</p>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-gray-400 text-xs">Sun Distance</p>
                        <p className="text-white font-medium text-xs">{selectedPlanet.distanceFromSun.toFixed(2)} AU</p>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-gray-400 text-xs">Orbit Period</p>
                        <p className="text-white font-medium text-xs">{selectedPlanet.orbital_period} days</p>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-gray-400 text-xs">Earth Distance</p>
                        <p className="text-white font-medium text-xs">{selectedPlanet.distanceFromEarth}</p>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-gray-400 text-xs">Magnitude</p>
                        <p className="text-white font-medium text-xs">{selectedPlanet.magnitude}</p>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-gray-400 text-xs">Moons</p>
                        <p className="text-white font-medium text-xs">{selectedPlanet.moons}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-gray-400 text-xs mb-1">Constellation & Type</p>
                      <p className="text-white font-medium text-xs capitalize mb-1">
                        {selectedPlanet.constellation} • {selectedPlanet.type.replace('-', ' ')}
                      </p>
                      <p className="text-gray-300 text-xs leading-relaxed">{selectedPlanet.info}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white cursor-pointer"
                    onClick={() => setSelectedPlanet(null)}
                  >
                    Close Details
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center text-gray-400 my-auto py-12">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50 text-cyan-400" />
                  <p className="text-sm">Click any planet in the solar system to inspect its real coordinates and physical telemetry</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <GlassCard className="p-4" intensity="light">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">Animation Speed:</span>
                <div className="flex gap-1.5">
                  {[0.5, 1, 2].map((spd) => (
                    <Button
                      key={spd}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSpeedMultiplier(spd)}
                      className={`text-white text-xs cursor-pointer ${speedMultiplier === spd ? 'bg-white/20 border border-white/30' : ''}`}
                    >
                      {spd}x
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="text-white text-xs text-gray-300">
                <span className="text-gray-400">Planets: </span>
                {planets.length} • 
                <span className="text-gray-400 ml-2">Ephemeris: </span>
                <span className="text-cyan-400">NASA JPL Standish Elements</span> •
                <span className="text-gray-400 ml-2">Status: </span>
                {isAnimating ? 'In Motion' : 'Paused'}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}