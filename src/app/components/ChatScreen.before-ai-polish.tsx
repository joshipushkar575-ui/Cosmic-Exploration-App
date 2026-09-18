import { supabase } from "../../lib/supabase";
import { getAr00Data, getAr00LunarPhase, type Ar00Response, type Ar00LunarPhase } from '../services/api/ar00Service';

import { useAstronomy } from '../hooks/useAstronomy';
import { useAstronomicalEvents } from '../hooks/useAstronomicalEvents';
import { useNasaApod } from '../hooks/useNasaApod';
import { useNasaNeo } from '../hooks/useNasaNeo';
import { useNasaDonki } from '../hooks/useNasaDonki';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GlassCard } from './GlassCard';
import { CosmicBackground } from './CosmicBackground';
import { getVisibleConstellations } from '../services/astronomy/constellationVisibility';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Sparkles,
  Globe,
  Telescope,
  Rocket
} from 'lucide-react';

interface ChatScreenProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatScreen({ onNavigate }: ChatScreenProps) {
  const { planets, sun, moon, location, lastUpdated } = useAstronomy();
  const { events } = useAstronomicalEvents();
  const { data: nasaApod } = useNasaApod();
  const { data: nasaNeo } = useNasaNeo();
  const {
    solarFlares,
    cmes,
    storms,
  } = useNasaDonki();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm VYOM AI, your cosmic exploration assistant. I can help you learn about space, planets, stars, and the universe. What would you like to explore today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
const [ar00LunarPhase, setAr00LunarPhase] =
    useState<Ar00Response<Ar00LunarPhase> | null>(null);

  const [ar00Context, setAr00Context] =
    useState<Ar00Response | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAr00LunarPhase = async () => {
      const result = await getAr00LunarPhase();

      if (!cancelled) {
        setAr00LunarPhase(result);
      }
    };

    loadAr00LunarPhase();

    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = [
    { text: 'Explore Planets', icon: Globe },
    { text: 'Learn Astronomy', icon: Telescope },
    { text: 'Space-Time Travel', icon: Rocket },
  ];

  const handleSendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const lower = messageText.toLowerCase();

      // ============================================================
      // VYOM SMART SOURCE ROUTING
      // Astronomy calculations should use AR00 directly whenever
      // possible, avoiding unnecessary Gemini quota usage.
      // ============================================================

      const isMoonPhaseQuestion =
        (lower.includes('moon') &&
          (lower.includes('phase') ||
            lower.includes('chand') ||
            lower.includes('चंद्रमा') ||
            lower.includes('चांद'))) ||
        lower.includes('lunar phase') ||
        (lower.includes('चंद्रमा') && lower.includes('चरण'));

      const locationData = {
        latitude: location?.latitude,
        longitude: location?.longitude,
        elevation: location?.elevation,
      };

      // ------------------------------------------------------------
      // 1. MOON PHASE -> AR00 DIRECT
      // ------------------------------------------------------------

      if (isMoonPhaseQuestion) {
        try {
          const result = await getAr00LunarPhase(new Date());

          if (result.success && result.data) {
            const moonData = result.data;

            const phaseLabel = moonData.phaseName
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/Quarter/g, ' Quarter');

            const aiResponse: Message = {
              id: (Date.now() + 1).toString(),
              text:
                `🌙 **Current Moon Phase**\n\n` +
                `**${phaseLabel}**\n\n` +
                `• Illumination: **${(moonData.illuminatedFraction * 100).toFixed(1)}%**\n` +
                `• Phase angle: **${moonData.phaseAngle.toFixed(2)}°**\n` +
                `• Lunar age: **${moonData.ageDays.toFixed(2)} days**\n` +
                `• Waxing: **${moonData.isWaxing ? 'Yes' : 'No'}**\n\n` +
                `*Source: VYOM Local Astronomy Engine.*`,
              sender: 'ai',
              timestamp: new Date()
            };

            setAr00Context(result);
            setMessages(prev => [...prev, aiResponse]);
            return;
          }

          throw new Error(
            result.error || 'AR00 Moon phase data unavailable.'
          );
        } catch (ar00Error) {
          console.error('AR00 Moon phase request failed:', ar00Error);

          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            text:
              '🌙 I could not retrieve the current Moon phase from AR00.space right now. ' +
              'The astronomy calculation is unavailable at the moment, so I will not guess the value.',
            sender: 'ai',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, errorResponse]);
          return;
        }
      }

      // ------------------------------------------------------------
      // 2. DIRECT AR00 ASTRONOMY ROUTES
      // ------------------------------------------------------------

      let directAr00Type:
        | 'lunar-position'
        | 'solar-position'
        | 'planets'
        | 'meteor-showers'
        | 'constellations'
        | null = null;

      if (
        lower.includes('moon position') ||
        lower.includes('moon distance') ||
        lower.includes('moon altitude') ||
        lower.includes('where is the moon')
      ) {
        directAr00Type = 'lunar-position';
      } else if (
        lower.includes('sun position') ||
        lower.includes('solar position') ||
        lower.includes('where is the sun')
      ) {
        directAr00Type = 'solar-position';
      } else if (
        (
          lower.includes('planet') ||
          lower.includes('mercury') ||
          lower.includes('venus') ||
          lower.includes('mars') ||
          lower.includes('jupiter') ||
          lower.includes('saturn') ||
          lower.includes('uranus') ||
          lower.includes('neptune')
        ) &&
        (
          lower.includes('right now') ||
          lower.includes('currently') ||
          lower.includes('tonight') ||
          lower.includes('visible') ||
          lower.includes('position') ||
          lower.includes('where is') ||
          lower.includes('which planets')
        )
      ) {
        directAr00Type = 'planets';
      } else if (
        (
          lower.includes('meteor') ||
          lower.includes('meteor shower')
        ) &&
        (
          lower.includes('active') ||
          lower.includes('currently') ||
          lower.includes('tonight') ||
          lower.includes('visible') ||
          lower.includes('now')
        )
      ) {
        directAr00Type = 'meteor-showers';
      } else if (
        (
          lower.includes('constellation') ||
          lower.includes('constellations')
        ) &&
        (
          lower.includes('visible') ||
          lower.includes('tonight') ||
          lower.includes('currently') ||
          lower.includes('now') ||
          lower.includes('available')
        )
      ) {
        directAr00Type = 'constellations';
      }

      if (directAr00Type) {
        try {
          const result = await getAr00Data(
            directAr00Type,
            new Date()
          );

          if (result.success && result.data) {
            setAr00Context(result);

            const d: any = result.data;

            const num = (value: unknown, digits = 2) =>
              typeof value === 'number' && Number.isFinite(value)
                ? value.toFixed(digits)
                : null;

            const value = (obj: any, keys: string[]) => {
              for (const key of keys) {
                if (
                  obj &&
                  obj[key] !== undefined &&
                  obj[key] !== null &&
                  obj[key] !== ''
                ) {
                  return obj[key];
                }
              }
              return null;
            };

            let responseText = '';

            if (directAr00Type === 'lunar-position') {
        const altitude = value(d, ['altitude', 'alt', 'elevation']);
        const azimuth = value(d, ['azimuth', 'az']);
        const distance = value(d, ['distance', 'distanceKm', 'distance_km']);
        const ra = value(d, ['rightAscension', 'ra']);
        const dec = value(d, ['declination', 'dec']);

        responseText =
          `🌙 **Moon Position**\n\n` +
          (altitude !== null ? `• Altitude: **${num(Number(altitude))}°**\n` : '') +
          (azimuth !== null ? `• Azimuth: **${num(Number(azimuth))}°**\n` : '') +
          (distance !== null ? `• Distance: **${num(Number(distance), 0)} km**\n` : '') +
          (ra !== null ? `• Right Ascension: **${ra}**\n` : '') +
          (dec !== null ? `• Declination: **${dec}**\n` : '');

        if (responseText === `🌙 **Moon Position**\n\n`) {
          responseText += `AR00.space returned Moon-position data, but the requested position fields are unavailable.`;
        }
      } else if (directAr00Type === 'solar-position') {
        const altitude = value(d, ['altitude', 'alt', 'elevation']);
        const azimuth = value(d, ['azimuth', 'az']);

        const rightAscension =
          d?.rightAscension && typeof d.rightAscension === 'object'
            ? d.rightAscension
            : null;

        const declination =
          d?.declination && typeof d.declination === 'object'
            ? d.declination
            : null;

        const eclipticLongitude =
          d?.eclipticLongitude && typeof d.eclipticLongitude === 'object'
            ? d.eclipticLongitude
            : null;

        const meanAnomaly =
          d?.meanAnomaly && typeof d.meanAnomaly === 'object'
            ? d.meanAnomaly
            : null;

        const obliquity =
          d?.obliquity && typeof d.obliquity === 'object'
            ? d.obliquity
            : null;

        responseText =
          `☀️ **Sun Position**\n\n` +

          (altitude !== null
            ? `• Altitude: **${num(Number(altitude))}°**\n`
            : '') +

          (azimuth !== null
            ? `• Azimuth: **${num(Number(azimuth))}°**\n`
            : '') +

          (typeof rightAscension?.degrees === 'number'
            ? `• Right Ascension: **${rightAscension.degrees.toFixed(4)}°**` +
              (typeof rightAscension.hours === 'number'
                ? ` (**${rightAscension.hours.toFixed(4)}h**)`
                : '') +
              `\n`
            : '') +

          (typeof declination?.degrees === 'number'
            ? `• Declination: **${declination.degrees.toFixed(4)}°**\n`
            : '') +

          (typeof eclipticLongitude?.degrees === 'number'
            ? `• Ecliptic longitude: **${eclipticLongitude.degrees.toFixed(4)}°**\n`
            : '') +

          (typeof d?.equationOfTimeMinutes === 'number'
            ? `• Equation of time: **${d.equationOfTimeMinutes.toFixed(2)} min**\n`
            : '') +

          (typeof meanAnomaly?.degrees === 'number'
            ? `• Mean anomaly: **${meanAnomaly.degrees.toFixed(4)}°**\n`
            : '') +

          (typeof obliquity?.degrees === 'number'
            ? `• Obliquity: **${obliquity.degrees.toFixed(4)}°**\n`
            : '');

        if (responseText === `☀️ **Sun Position**\n\n`) {
          responseText += `AR00.space returned solar-position data, but the requested position fields are unavailable.`;
        }
      } else if (directAr00Type === 'planets') {
        const ar00Planets = Array.isArray(d)
          ? d
          : value(d, ['planets', 'objects', 'data']);

        if (Array.isArray(ar00Planets)) {
          const requestedPlanetMatch = lower.match(
            /\b(mercury|venus|mars|jupiter|saturn|uranus|neptune)\b/
          );

          const selectedPlanets = requestedPlanetMatch
            ? ar00Planets.filter(
                (planet: any) =>
                  String(planet?.name ?? '').toLowerCase() ===
                  requestedPlanetMatch[1].toLowerCase()
              )
            : ar00Planets;

          const list = selectedPlanets.length > 0 ? selectedPlanets : ar00Planets;

          responseText =
            `🪐 **Current Planet Data**\n\n` +
            list
              .map((planet: any) => {
                const name = planet?.name ?? 'Unknown';
                const position = planet?.position ?? {};

                const eclipticLongitude = position?.eclipticLongitude;
                const eclipticLatitude = position?.eclipticLatitude;
                const heliocentricDistanceAU = planet?.heliocentricDistanceAU;
                const geocentricDistanceAU = planet?.geocentricDistanceAU;
                const magnitude = planet?.magnitude;
                const elongation = planet?.elongation;

                const localPlanet = Array.isArray(planets)
                  ? planets.find(
                      (p: any) =>
                        String(p?.name ?? '').toLowerCase() ===
                        String(name).toLowerCase()
                    )
                  : null;

                return (
                  `### ${name}\n` +
                  (typeof localPlanet?.altitude === 'number'
                    ? `• Altitude: **${localPlanet.altitude.toFixed(1)}°**\n`
                    : '') +
                  (typeof localPlanet?.azimuth === 'number'
                    ? `• Azimuth: **${localPlanet.azimuth.toFixed(1)}°**\n`
                    : '') +
                  (localPlanet?.constellation
                    ? `• Constellation: **${localPlanet.constellation}**\n`
                    : '') +
                  (localPlanet?.visibility
                    ? `• Visibility: **${localPlanet.visibility}**\n`
                    : '') +
                  (typeof eclipticLongitude === 'number'
                    ? `• Ecliptic longitude: **${eclipticLongitude.toFixed(2)}°**\n`
                    : '') +
                  (typeof eclipticLatitude === 'number'
                    ? `• Ecliptic latitude: **${eclipticLatitude.toFixed(2)}°**\n`
                    : '') +
                  (typeof heliocentricDistanceAU === 'number'
                    ? `• Distance from Sun: **${heliocentricDistanceAU.toFixed(3)} AU**\n`
                    : '') +
                  (typeof geocentricDistanceAU === 'number'
                    ? `• Distance from Earth: **${geocentricDistanceAU.toFixed(3)} AU**\n`
                    : '') +
                  (typeof magnitude === 'number'
                    ? `• Apparent magnitude: **${magnitude.toFixed(2)}**\n`
                    : '') +
                  (typeof elongation === 'number'
                    ? `• Elongation: **${elongation.toFixed(2)}°**`
                    : '')
                );
              })
              .join('\n\n');
        } else {
          responseText =
            `🪐 **Planets**\n\n` +
            `Planetary data is currently unavailable.`;
        }
            } else if (directAr00Type === 'meteor-showers') {
        const showers = Array.isArray(d)
          ? d
          : value(d, ['showers', 'meteorShowers', 'data']);

        if (Array.isArray(showers)) {
          responseText =
            `☄️ **Meteor Showers**\n\n` +
            showers
              .map((shower: any) => {
                const name = value(shower, ['name', 'shower']) ?? 'Unknown';
                const peak = value(shower, ['peak', 'peakDate', 'maximum']);
                const rate = value(shower, ['zhr', 'peakRate', 'rate']);

                return (
                  `**${name}**` +
                  (peak !== null ? ` — Peak: ${peak}` : '') +
                  (rate !== null ? ` — ZHR: ${rate}` : '')
                );
              })
              .join('\n');
        } else {
          responseText =
            `☄️ **Meteor Showers**\n\n` +
            `AR00.space returned meteor-shower data, but detailed shower fields are unavailable.`;
        }
      } else if (directAr00Type === 'constellations') {
        const observerLocation = location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              altitude: location.elevation,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
              cityName: 'Current observer location',
              source: 'gps' as const,
            }
          : null;

        if (observerLocation) {
          const visibleConstellations = getVisibleConstellations(
            observerLocation,
            new Date(),
            5
          );

          if (visibleConstellations.length > 0) {
            responseText =
              `⭐ **Visible Constellations Tonight**\n\n` +
              `**${visibleConstellations.length}** constellations have a representative bright star above 5° altitude.\n\n` +
              visibleConstellations
                .slice(0, 20)
                .map((c) =>
                  `**${c.name}** — ${c.representativeStar}\n` +
                  `• Altitude: **${c.altitude.toFixed(1)}°**\n` +
                  `• Azimuth: **${c.azimuth.toFixed(1)}°**`
                )
                .join('\n\n') +
              `\n\n*Visibility is calculated locally from the observer location, date and time. A representative bright star is used as the constellation visibility indicator.*`;
          } else {
            responseText =
              `⭐ **Visible Constellations Tonight**\n\n` +
              `No representative constellation stars are currently above the 5° altitude threshold.`;
          }
        } else {
          responseText =
            `⭐ **Constellations**\n\n` +
            `Observer location is unavailable, so location-based constellation visibility cannot be calculated.`;
        }
      }


            const aiResponse: Message = {
              id: (Date.now() + 1).toString(),
              text: responseText,
              sender: 'ai',
              timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
            return;
          }

        console.warn(
          `AR00 ${directAr00Type} unavailable:`,
          result.error
        );
      } catch (ar00Error) {
        console.warn(
          `AR00 ${directAr00Type} request failed:`,
          ar00Error
        );
      }
    }

      // ------------------------------------------------------------
      // 3. CONTEXT AR00 ROUTES
      // Location-dependent calculations require actual user
      // coordinates. Never substitute an inferred location.
      // ------------------------------------------------------------

      let relevantAr00: Ar00Response | null = null;

      const hasLocation =
        Number.isFinite(location?.latitude) &&
        Number.isFinite(location?.longitude);

      if (
        lower.includes('sunrise') ||
        lower.includes('sunset') ||
        lower.includes('twilight')
      ) {
        if (hasLocation) {
          relevantAr00 = await getAr00Data(
            'sunrise-sunset',
            new Date(),
            locationData
          );
        }
      } else if (
        lower.includes('tonight') ||
        lower.includes('observe tonight') ||
        lower.includes('what can i see')
      ) {
        if (hasLocation) {
          relevantAr00 = await getAr00Data(
            'tonight',
            new Date(),
            locationData
          );
        }
      }

      setAr00Context(relevantAr00);

      const { data, error } = await supabase.functions.invoke('vyom-ai', {
        body: {
          message: messageText,
          messages: [...messages, userMessage].map(message => ({
            role: message.sender === 'user' ? 'user' : 'assistant',
            content: message.text
          })),
          astronomy: {
            location,
            lastUpdated,
            sun,
            moon,
            planets,
            events,

            ar00: {
              lunarPhase: ar00LunarPhase,
              relevantData: relevantAr00,
            },

            nasa: {
              apod: nasaApod,
              nearEarthObjects: nasaNeo,
              spaceWeather: {
                solarFlares,
                cmes,
                geomagneticStorms: storms,
              },
            },
          }
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.message || 'VYOM AI did not return a response.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('VYOM AI request failed:', error);

      let errorText = error instanceof Error ? error.message : String(error);

      try {
        const context = (error as { context?: Response })?.context;

        if (context) {
          const body = await context.clone().json();
          errorText = body?.details || body?.message || body?.error || errorText;
        }
      } catch {
        // Keep the original error message.
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `VYOM AI error: ${errorText}`,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <CosmicBackground variant="nebula">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-white hover:text-violet-300 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">VYOM AI</h1>
              <p className="text-sm text-gray-300">Cosmic Assistant</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="h-[calc(100vh-200px)] flex flex-col" intensity="medium">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-violet-500 to-cyan-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <GlassCard 
                      className={`p-3 ${
                        message.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' 
                          : 'bg-white/10'
                      }`}
                      glow={message.sender === 'ai'}
                    >
                      <div className="text-white text-sm leading-relaxed prose prose-invert max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <div className="mb-5 mt-1 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-violet-500/15 via-cyan-500/10 to-transparent px-4 py-3">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {children}
          </h1>
        </div>
      ),

      h2: ({ children }) => (
        <div className="flex items-center gap-2 mt-5 mb-3 pb-2 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-semibold text-cyan-300 tracking-wide">
            {children}
          </h2>
        </div>
      ),

      h3: ({ children }) => (
        <h3 className="text-base font-semibold text-violet-300 mt-4 mb-2">
          {children}
        </h3>
      ),

      p: ({ children }) => (
        <p className="mb-3 last:mb-0 text-white/90 leading-7">
          {children}
        </p>
      ),

      ul: ({ children }) => (
        <ul className="my-3 ml-1 space-y-2 list-none">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="my-3 ml-1 space-y-3 list-none counter-reset-recommendation">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="relative rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-white/90 leading-6">
          {children}
        </li>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-white">
          {children}
        </strong>
      ),

      em: ({ children }) => (
        <em className="text-cyan-200/90">
          {children}
        </em>
      ),

      blockquote: ({ children }) => (
        <blockquote className="my-3 border-l-2 border-cyan-400/60 bg-cyan-400/5 rounded-r-xl px-4 py-3 text-white/80">
          {children}
        </blockquote>
      ),

      hr: () => (
        <hr className="my-5 border-white/10" />
      ),

      table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20">
          <table className="w-full min-w-[620px] text-left border-collapse">
            {children}
          </table>
        </div>
      ),

      thead: ({ children }) => (
        <thead className="bg-gradient-to-r from-violet-500/20 to-cyan-500/15">
          {children}
        </thead>
      ),

      th: ({ children }) => (
        <th className="border-b border-white/15 px-3 py-2.5 text-xs sm:text-sm font-semibold text-cyan-200 whitespace-nowrap">
          {children}
        </th>
      ),

      tbody: ({ children }) => (
        <tbody className="divide-y divide-white/10">
          {children}
        </tbody>
      ),

      tr: ({ children }) => (
        <tr className="transition-colors hover:bg-white/[0.05]">
          {children}
        </tr>
      ),

      td: ({ children }) => (
        <td className="px-3 py-2.5 text-xs sm:text-sm text-white/85 whitespace-nowrap">
          {children}
        </td>
      ),

      code: ({ children }) => (
        <code className="rounded-md bg-black/30 px-1.5 py-0.5 text-cyan-200 text-xs">
          {children}
        </code>
      ),
    }}
  >
    {message.text}
  </ReactMarkdown>
</div>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </GlassCard>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-full text-sm text-white hover:bg-white/20 transition-all flex-shrink-0"
                  >
                    <suggestion.icon className="w-4 h-4" />
                    {suggestion.text}
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about the cosmos..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:from-violet-600 hover:to-cyan-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}
