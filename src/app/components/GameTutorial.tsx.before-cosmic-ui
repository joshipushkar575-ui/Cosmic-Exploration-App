import { useState } from 'react';
import { ArrowRight, ArrowLeft, X, Rocket, Gem, Target, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <GlassCard className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-6">
              {currentStepData.icon}
            </div>

            <h2 className="text-2xl text-white mb-4">{currentStepData.title}</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Tips */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg text-cyan-400 mb-3">💡 Tips:</h3>
              <ul className="text-left space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentStep === 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg transition-all"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Start Playing!' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-6">
            <button
              onClick={onSkip}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Skip tutorial and start playing
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}