import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Rocket,
  Sun,
  Moon,
  Satellite,
  Telescope,
  Sparkles,
  RefreshCw,
  Database,
  CheckCircle2,
  ChevronRight,
  Target,
  Microscope,
  Info,
  MessageCircle,
} from "lucide-react";

import { GlassCard } from "./GlassCard";
import {
  getIsroMissions,
  type IsroMission,
} from "../services/api/isroService";

interface ISROScreenProps {
  onNavigate: (screen: string) => void;
}

interface MissionDetail {
  status: string;
  objective: string;
  easyExplanation: string;
  instruments: string[];
  science: string[];
  officialUrl: string;
}

const fallbackMissions: IsroMission[] = [
  {
    name: "Chandrayaan-3",
    category: "Lunar Exploration",
    description:
      "India's lunar landing mission focused on safe landing, rover operations and scientific studies of the Moon.",
    officialPortal: "https://pradan.issdc.gov.in/",
    source: "ISRO / ISSDC / PRADAN",
  },
  {
    name: "Chandrayaan-2",
    category: "Lunar Science",
    description:
      "India's lunar mission whose orbiter continues to provide scientific observations of the Moon.",
    officialPortal: "https://pradan.issdc.gov.in/",
    source: "ISRO / ISSDC / PRADAN",
  },
  {
    name: "Aditya-L1",
    category: "Solar Science",
    description:
      "India's solar observatory studying the Sun from the Sun-Earth L1 region.",
    officialPortal: "https://pradan.issdc.gov.in/",
    source: "ISRO / ISSDC / PRADAN",
  },
  {
    name: "AstroSat",
    category: "Space Astronomy",
    description:
      "India's multi-wavelength space observatory for studying astronomical sources.",
    officialPortal: "https://pradan.issdc.gov.in/",
    source: "ISRO / ISSDC / PRADAN",
  },
  {
    name: "XPoSat",
    category: "X-Ray Astronomy",
    description:
      "India's dedicated X-ray polarimetry mission for studying high-energy astronomical sources.",
    officialPortal: "https://pradan.issdc.gov.in/",
    source: "ISRO / ISSDC / PRADAN",
  },
];

const missionDetails: Record<string, MissionDetail> = {
  "Chandrayaan-3": {
    status: "Not Operational",
    objective:
      "Demonstrate safe and soft landing on the Moon, rover mobility and in-situ scientific experiments.",
    easyExplanation:
      "Chandrayaan-3 was designed to prove that India could safely land a spacecraft on the Moon and operate a rover there while performing scientific measurements directly on the lunar surface.",
    instruments: [
      "ChaSTE — measures thermal properties of the lunar surface",
      "ILSA — measures seismic activity near the landing site",
      "RAMBHA-LP — measures near-surface plasma",
      "LIBS — studies elemental composition of lunar material",
      "APXS — determines elemental composition of lunar soil and rocks",
      "SHAPE — studies reflected light from Earth",
    ],
    science: [
      "Lunar surface temperature and thermal properties",
      "Seismic activity and lunar interior clues",
      "Near-surface plasma environment",
      "Chemical and elemental composition of lunar material",
    ],
    officialUrl: "https://www.isro.gov.in/Chandrayaan3_Details.html",
  },

  "Chandrayaan-2": {
    status: "Operational (Orbiter)",
    objective:
      "Study the Moon through orbital remote sensing and scientific observations.",
    easyExplanation:
      "Although the lander mission did not complete its planned landing, the Chandrayaan-2 orbiter continues to be an important scientific platform for observing the Moon.",
    instruments: [
      "Orbiter scientific instruments",
      "High-resolution lunar imaging",
      "Mineralogical and elemental studies",
      "Lunar surface and exosphere observations",
    ],
    science: [
      "Lunar surface mapping",
      "Mineralogy",
      "Elemental composition",
      "Lunar exosphere studies",
    ],
    officialUrl: "https://www.isro.gov.in/SpacecraftMissions.html",
  },

  "Aditya-L1": {
    status: "Operational",
    objective:
      "Study the Sun's atmosphere, solar activity, solar wind and magnetic environment from the Sun-Earth L1 region.",
    easyExplanation:
      "Aditya-L1 continuously observes the Sun from a special region called L1. This helps scientists study solar eruptions and understand space weather that can affect technology near Earth.",
    instruments: [
      "VELC — studies the solar corona and coronal mass ejections",
      "SUIT — images the photosphere and chromosphere in ultraviolet",
      "SoLEXS — studies solar X-rays",
      "HEL1OS — studies high-energy solar X-rays",
      "ASPEX — studies solar-wind particles",
      "PAPA — analyses solar-wind particles",
      "Magnetometer — measures magnetic fields",
    ],
    science: [
      "Solar corona and chromosphere",
      "Solar flares and CMEs",
      "Solar wind and energetic particles",
      "Magnetic-field behaviour",
      "Drivers of space weather",
    ],
    officialUrl: "https://www.isro.gov.in/Aditya_L1.html",
  },

  AstroSat: {
    status: "Operational",
    objective:
      "Observe astronomical sources simultaneously in ultraviolet, optical and X-ray wavelengths.",
    easyExplanation:
      "AstroSat works like a multi-colour astronomical observatory in space. Different instruments observe the same cosmic objects using different kinds of light, helping scientists build a more complete picture.",
    instruments: [
      "UVIT — ultraviolet and visible imaging",
      "LAXPC — X-ray observations",
      "CZTI — hard X-ray imaging and polarisation",
      "SXT — soft X-ray imaging and spectroscopy",
      "SSM — monitors transient X-ray sources",
    ],
    science: [
      "X-ray sources",
      "Ultraviolet astronomy",
      "Transient astronomical events",
      "High-energy astrophysics",
      "Multi-wavelength observations",
    ],
    officialUrl: "https://www.isro.gov.in/AstroSat.html",
  },

  XPoSat: {
    status: "Operational",
    objective:
      "Study X-ray polarisation and spectroscopy of bright astronomical sources under extreme conditions.",
    easyExplanation:
      "XPoSat studies some of the most energetic objects in the universe. By measuring the direction and properties of X-ray light, scientists can learn more about extreme environments around cosmic objects.",
    instruments: [
      "POLIX — X-ray polarisation measurements",
      "XSPECT — X-ray spectroscopy and timing",
    ],
    science: [
      "X-ray polarisation",
      "High-energy astronomical sources",
      "X-ray spectroscopy",
      "Extreme astrophysical environments",
    ],
    officialUrl: "https://www.isro.gov.in/SpacecraftMissions.html",
  },
};

const missionIcons: Record<string, typeof Moon> = {
  "Chandrayaan-3": Moon,
  "Chandrayaan-2": Moon,
  "Aditya-L1": Sun,
  AstroSat: Telescope,
  XPoSat: Sparkles,
};

const officialLinks = [
  {
    title: "ISRO Science Data",
    description:
      "Official Indian space-science data and mission information.",
    url: "https://www.isro.gov.in/Sciencedata.html",
  },
  {
    title: "PRADAN / ISSDC",
    description:
      "Science-data dissemination portal for released mission datasets.",
    url: "https://pradan.issdc.gov.in/",
  },
  {
    title: "Bhoonidhi",
    description:
      "ISRO/NRSC Earth-observation data platform.",
    url: "https://bhoonidhi.nrsc.gov.in/",
  },
  {
    title: "Bhoonidhi API",
    description:
      "Official programmatic interface information for Bhoonidhi services.",
    url: "https://bhoonidhi.nrsc.gov.in/bhoonidhi-api/",
  },
];

export function ISROScreen({ onNavigate }: ISROScreenProps) {
  const [missions, setMissions] =
    useState<IsroMission[]>(fallbackMissions);

  const [selectedMission, setSelectedMission] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [lastUpdated, setLastUpdated] =
    useState<string | null>(null);

  const loadMissions = async () => {
    setLoading(true);

    const result = await getIsroMissions();

    if (result.success && result.data?.length) {
      setMissions(result.data);
      setLive(true);
      setLastUpdated(
        result.fetchedAt ?? new Date().toISOString(),
      );
    } else {
      setMissions(fallbackMissions);
      setLive(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const selected =
    selectedMission
      ? missionDetails[selectedMission]
      : null;

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        <button
          onClick={() => onNavigate("home")}
          className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to VYOM
        </button>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/15 via-white/5 to-green-500/10 p-6 sm:p-10 mb-8">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl">
                🇮🇳
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-orange-300">
                  Indian Space Research Organisation
                </p>

                <h1 className="text-3xl sm:text-5xl font-bold">
                  ISRO
                </h1>
              </div>
            </div>

            <p className="text-gray-300 max-w-3xl text-base sm:text-lg leading-relaxed">
              Explore India's space missions, scientific
              instruments and discoveries using verified Indian
              space-data sources.
            </p>
          </div>
        </section>

        {/* DATA STATUS */}
        <GlassCard className="p-5 mb-8" intensity="light">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {live ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <Database className="w-5 h-5 text-orange-300" />
              )}

              <div>
                <h2 className="font-semibold">
                  ISRO Data Layer
                </h2>

                <p className="text-sm text-gray-400">
                  {live
                    ? "Mission metadata loaded through VYOM."
                    : "Using verified local fallback metadata."}
                </p>
              </div>
            </div>

            <button
              onClick={loadMissions}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-3">
              Last response:{" "}
              {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </GlassCard>

        {/* MISSION EXPLORER */}
        <div className="flex items-center gap-3 mb-5">
          <Rocket className="w-6 h-6 text-orange-300" />

          <div>
            <h2 className="text-2xl font-bold">
              Mission Explorer
            </h2>

            <p className="text-sm text-gray-400">
              Select a mission to explore its science
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {missions.map((mission) => {
            const Icon =
              missionIcons[mission.name] ?? Rocket;

            const isSelected =
              selectedMission === mission.name;

            return (
              <button
                key={mission.name}
                onClick={() =>
                  setSelectedMission(
                    isSelected ? null : mission.name,
                  )
                }
                className="text-left"
              >
                <GlassCard
                  className={`p-6 h-full transition-all ${
                    isSelected
                      ? "border-orange-400/40 bg-orange-500/10"
                      : "hover:bg-white/5"
                  }`}
                  intensity="light"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs tracking-widest text-gray-400 mb-1">
                        {mission.category}
                      </p>

                      <h3 className="text-xl font-semibold mb-2">
                        {mission.name}
                      </h3>

                      <p className="text-gray-300 text-sm leading-relaxed">
                        {mission.description}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        isSelected
                          ? "rotate-90"
                          : ""
                      }`}
                    />
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {mission.source}
                    </span>

                    <span className="text-xs text-orange-300">
                      {isSelected
                        ? "Close"
                        : "Explore"}
                    </span>
                  </div>
                </GlassCard>
              </button>
            );
          })}
        </div>

        {/* DETAIL PANEL */}
        {selected && selectedMission && (
          <GlassCard
            className="p-6 sm:p-8 mb-8"
            intensity="light"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                  Mission Details
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {selectedMission}
                </h2>
              </div>

              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-400/20 text-green-300 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {selected.status}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* OBJECTIVE */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-orange-300" />
                  <h3 className="font-semibold">
                    Mission Objective
                  </h3>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {selected.objective}
                </p>
              </div>

              {/* EASY EXPLANATION */}
              <div className="rounded-2xl bg-blue-500/5 border border-blue-400/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-300" />
                  <h3 className="font-semibold">
                    Simple Explanation
                  </h3>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {selected.easyExplanation}
                </p>
              </div>

              {/* INSTRUMENTS */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Microscope className="w-5 h-5 text-purple-300" />
                  <h3 className="font-semibold">
                    Scientific Instruments
                  </h3>
                </div>

                <div className="space-y-3">
                  {selected.instruments.map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 text-sm text-gray-300"
                    >
                      <span className="text-orange-300">
                        •
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SCIENCE */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Satellite className="w-5 h-5 text-cyan-300" />
                  <h3 className="font-semibold">
                    What Scientists Study
                  </h3>
                </div>

                <div className="space-y-3">
                  {selected.science.map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 text-sm text-gray-300"
                    >
                      <span className="text-cyan-300">
                        •
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-3">

              <button
                onClick={() => {
                  if (!selectedMission || !selected) return;

                  sessionStorage.setItem(
                    "vyom_isro_ai_context",
                    JSON.stringify({
                      source: "VYOM verified ISRO mission context",
                      mission: selectedMission,
                      status: selected.status,
                      objective: selected.objective,
                      easyExplanation: selected.easyExplanation,
                      instruments: selected.instruments,
                      scienceTopics: selected.science,
                      officialSource: selected.officialUrl,
                    }),
                  );

                  sessionStorage.setItem(
                    "vyom_isro_ai_prompt",
                    `Explain ${selectedMission} to me using the verified ISRO mission information provided by VYOM. Start with a simple explanation and then explain the important scientific details. Do not invent missing facts.`,
                  );

                  onNavigate("chat");
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-400/20 text-orange-200 text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Explain with VYOM AI
              </button>

              <a
                href={selected.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm transition-colors"
              >
                Open Official ISRO Mission Page
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </GlassCard>
        )}

        {/* OFFICIAL DATA */}
        <GlassCard className="p-6 mb-8" intensity="light">
          <div className="flex items-center gap-3 mb-5">
            <Satellite className="w-6 h-6 text-blue-300" />

            <div>
              <h2 className="text-xl font-semibold">
                Indian Space Data
              </h2>

              <p className="text-sm text-gray-400">
                Official data portals used by VYOM
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {officialLinks.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">
                      {link.title}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                      {link.description}
                    </p>
                  </div>

                  <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </GlassCard>

        {/* DATA ARCHITECTURE */}
        <GlassCard className="p-6 mb-10" intensity="light">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-5 h-5 text-orange-300" />

            <h2 className="text-lg font-semibold">
              VYOM ISRO Data Layer
            </h2>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            VYOM keeps official mission information separate from
            AI-generated explanations. Verified mission information
            comes from Indian space sources, while VYOM AI can
            explain scientific concepts in simpler language.
          </p>

          <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-gray-400">
              DATA FLOW
            </p>

            <p className="text-sm text-gray-200 mt-1">
              ISRO / ISSDC / PRADAN → VYOM Secure Layer → Mission
              Explorer → VYOM AI Explanation
            </p>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
