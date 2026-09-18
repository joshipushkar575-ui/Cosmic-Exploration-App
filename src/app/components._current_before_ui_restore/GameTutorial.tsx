import { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Rocket, Gem, Target, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { motion } from 'motion/react';

interface GameTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  tips: string[];
}

export function GameTutorial({ onComplete, onSkip }: GameTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to Cosmic Explorer!",
      description: "Embark on an epic journey through our solar system. Explore planets, collect resources, and unlock achievements as you discover the wonders of space!",
      icon: <Rocket className="w-12 h-12 text-cyan-400" />,
      tips: [
        "Choose from 8 different planets to explore",
        "Each planet has unique challenges and rewards",
        "Progress through levels to unlock new worlds"
      ]
    },
    {
      title: "Planet Selection",
      description: "Start your adventure by choosing a planet. Each planet has different difficulty levels and special resources to discover.",
      icon: <Target className="w-12 h-12 text-purple-400" />,
      tips: [
        "Begin with Mercury, Venus, or Earth (unlocked by default)",
        "Higher difficulty planets offer better rewards",
        "Check requirements before attempting new planets"
      ]
    },
    {
      title: "Exploration Gameplay",
      description: "Navigate the alien terrain using arrow keys or WASD. Your goal is to collect resources while managing your energy efficiently.",
      icon: <Gem className="w-12 h-12 text-green-400" />,
      tips: [
        "Use arrow keys or WASD to move around",
        "Collect crystals 💎, minerals ⚡, and artifacts 🏺",
        "Avoid obstacles like craters and storms",
        "Collect 5 resources to complete each level"
      ]
    },
    {
      title: "Energy Management",
      description: "Moving costs energy, so plan your path wisely! Collecting resources restores some energy, while obstacles drain extra energy.",
      icon: <Zap className="w-12 h-12 text-yellow-400" />,
      tips: [
        "Each move costs 2 energy points",
        "Obstacles cost double energy (4 points)",
        "Collecting resources gives you +5 energy",
        "Game ends if you run out of energy"
      ]
    },
    {
      title: "Scoring & Progression",
      description: "Earn points by collecting resources and completing levels quickly. Use your scores to unlock new planets and compete on leaderboards!",
      icon: <Target className="w-12 h-12 text-orange-400" />,
      tips: [
        "Resources give 50 points each",
        "Time bonus: 2 points per second remaining",
        "Unlock achievements for special rewards",
        "Compare scores with other explorers"
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 p-4 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <GlassCard className="overflow-hidden rounded-3xl border-white/[0.12] bg-slate-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/60">
                  VYOM • TRAINING MODULE
                </div>
                <span className="mt-1 block text-sm text-slate-400">
                  Step {currentStep + 1} <span className="text-slate-600">/</span> {tutorialSteps.length}
                </span>
              </div>
            </div>
            <CosmicIconButton
              onClick={onSkip}
              size="sm"
              glow="violet"
              label="Close tutorial"
            >
              <X />
            </CosmicIconButton>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 h-2 w-full overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.06]">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 shadow-[0_0_18px_rgba(34,211,238,0.30)] transition-all duration-500"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex size-24 items-center justify-center rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/[0.10] via-white/[0.03] to-violet-500/[0.10] shadow-[0_0_45px_rgba(34,211,238,0.12)]">
                {currentStepData.icon}
              </div>
            </div>

            <h2 className="mb-4 text-2xl font-semibold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent sm:text-3xl">
              {currentStepData.title}
            </h2>
            <p className="mb-6 leading-relaxed text-sm text-slate-300 sm:text-base">
              {currentStepData.description}
            </p>

            {/* Tips */}
            <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-left shadow-inner sm:p-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200">
                💡 Mission Tips
              </h3>
              <ul className="text-left space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ${
                currentStep === 0
                  ? 'cursor-not-allowed border-white/[0.05] bg-white/[0.02] text-slate-600'
                  : 'border-white/[0.10] bg-white/[0.045] text-slate-300 shadow-[0_6px_24px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Previous
            </button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-7 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.55)]'
                      : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(34,211,238,0.25)] active:translate-y-0"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Start Playing!' : 'Next'}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Skip Option */}
          <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
            <button
              onClick={onSkip}
              className="text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              Skip tutorial and start playing
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}