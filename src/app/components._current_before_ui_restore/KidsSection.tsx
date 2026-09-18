import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Gamepad2, 
  Trophy, 
  Brain, 
  Rocket, 
  Globe,
  Sparkles,
  Heart,
  Zap,
  Gift
} from 'lucide-react';
import { CosmicBackground } from './CosmicBackground';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface KidsSectionProps {
  onNavigate: (screen: string) => void;
}

export function KidsSection({ onNavigate }: KidsSectionProps) {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(12);

  const games = [
    {
      id: 'planet-match',
      title: 'Planet Match',
      description: 'Match planets with their fun facts!',
      icon: Globe,
      color: 'bg-blue-500',
      difficulty: 'Easy',
      points: 10
    },
    {
      id: 'space-quiz',
      title: 'Space Quiz',
      description: 'Answer fun questions about space!',
      icon: Brain,
      color: 'bg-purple-500',
      difficulty: 'Medium',
      points: 15
    },
    {
      id: 'rocket-builder',
      title: 'Rocket Builder',
      description: 'Build your own rocket ship!',
      icon: Rocket,
      color: 'bg-orange-500',
      difficulty: 'Easy',
      points: 20
    }
  ];

  const achievements = [
    { name: 'Space Explorer', icon: Rocket, earned: true, description: 'Completed first mission!' },
    { name: 'Planet Expert', icon: Globe, earned: true, description: 'Learned about all planets!' },
    { name: 'Quiz Master', icon: Brain, earned: false, description: 'Score 100 points in quiz!' },
    { name: 'Rocket Scientist', icon: Star, earned: false, description: 'Build 5 rockets!' }
  ];

  const funFacts = [
    "The Sun is so big that over 1 million Earths could fit inside it! 🌞",
    "Saturn's rings are made of ice and rocks! ✨",
    "Jupiter has a storm bigger than Earth called the Great Red Spot! 🌪️",
    "Mars is called the Red Planet because it's covered in rusty dust! 🔴"
  ];

  const SpaceQuizGame = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [gameScore, setGameScore] = useState(0);

    const questions = [
      {
        question: "Which planet is closest to the Sun?",
        options: ["Mercury", "Venus", "Earth", "Mars"],
        correct: "Mercury",
        fun: "Mercury is super fast! It zooms around the Sun!"
      },
      {
        question: "What color is Mars?",
        options: ["Blue", "Green", "Red", "Yellow"],
        correct: "Red",
        fun: "Mars looks red because of rusty iron on its surface!"
      },
      {
        question: "How many planets are in our Solar System?",
        options: ["7", "8", "9", "10"],
        correct: "8",
        fun: "There are 8 amazing planets in our cosmic neighborhood!"
      }
    ];

    const handleAnswer = (answer: string) => {
      setSelectedAnswer(answer);
      setShowResult(true);
      
      if (answer === questions[currentQuestion].correct) {
        setGameScore(gameScore + 10);
        setScore(score + 10);
      }
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          setCurrentGame(null);
          if (gameScore >= 20) setStars(stars + 1);
        }
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.055] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-200 backdrop-blur-xl shadow-[0_6px_24px_rgba(139,92,246,0.10)]">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Cosmic Quiz
          </div>
          <h3 className="mt-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-bold text-transparent">
            Space Quiz! 🚀
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div className="mx-auto mt-4 max-w-md">
            <Progress
              value={((currentQuestion + 1) / questions.length) * 100}
              className="h-2 bg-white/[0.07]"
            />
          </div>
        </div>

        <GlassCard className="p-6">
          <h4 className="text-xl text-white mb-4">{questions[currentQuestion].question}</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {questions[currentQuestion].options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className={`h-auto min-h-14 rounded-2xl border px-4 py-4 text-left font-medium transition-all duration-300 ${
                  showResult
                    ? option === questions[currentQuestion].correct
                      ? 'border-emerald-300/40 bg-emerald-400/[0.14] text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.12)]'
                      : option === selectedAnswer
                        ? 'border-rose-300/40 bg-rose-400/[0.12] text-rose-100'
                        : 'border-white/[0.08] bg-white/[0.025] text-slate-500'
                    : 'border-white/[0.12] bg-white/[0.04] text-slate-200 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-violet-300/[0.08] hover:text-white hover:shadow-[0_8px_28px_rgba(139,92,246,0.10)]'
                }`}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-white/[0.10] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <p className="text-center text-base font-semibold text-white">
                {selectedAnswer === questions[currentQuestion].correct ? "🎉 Correct!" : "😊 Good try!"}
              </p>
              <p className="mt-2 text-center text-sm leading-relaxed text-slate-400">
                {questions[currentQuestion].fun}
              </p>
            </motion.div>
          )}
        </GlassCard>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/[0.06] px-4 py-2 text-sm font-semibold text-yellow-200 shadow-[0_0_24px_rgba(250,204,21,0.08)]">
            <Star className="h-4 w-4 fill-current" />
            Score: {gameScore} points
          </div>
        </div>
      </div>
    );
  };

  if (currentGame === 'space-quiz') {
    return (
      <CosmicBackground variant="nebula">
        <div className="min-h-screen p-4">
          <div className="max-w-2xl mx-auto">
            <CosmicIconButton
              onClick={() => setCurrentGame(null)}
              size="md"
              glow="violet"
              label="Back to games"
              className="mb-5"
            >
              <span className="text-base">←</span>
            </CosmicIconButton>
            <SpaceQuizGame />
          </div>
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground variant="kids">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-300/50" />
            <Sparkles className="h-5 w-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-200">
              VYOM Kids
            </span>
            <Sparkles className="h-5 w-5 text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.55)]" />
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-violet-300/50" />
          </div>
          <h1 className="bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Space Explorers
          </h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Let's explore the amazing universe together!
          </p>
          
          <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.045] px-3 py-3 backdrop-blur-xl shadow-[0_8px_28px_rgba(250,204,21,0.06)]">
              <Star className="mx-auto mb-1 h-5 w-5 text-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]" />
              <p className="text-sm font-semibold text-white">{stars}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Stars</p>
            </div>
            <div className="rounded-2xl border border-orange-300/15 bg-orange-300/[0.045] px-3 py-3 backdrop-blur-xl shadow-[0_8px_28px_rgba(251,146,60,0.06)]">
              <Trophy className="mx-auto mb-1 h-5 w-5 text-orange-300 drop-shadow-[0_0_10px_rgba(251,146,60,0.45)]" />
              <p className="text-sm font-semibold text-white">{level}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Level</p>
            </div>
            <div className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.045] px-3 py-3 backdrop-blur-xl shadow-[0_8px_28px_rgba(139,92,246,0.07)]">
              <Zap className="mx-auto mb-1 h-5 w-5 text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.45)]" />
              <p className="text-sm font-semibold text-white">{score}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Points</p>
            </div>
          </div>
        </motion.div>

        {/* Fun Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] shadow-[0_0_22px_rgba(52,211,153,0.10)]">
              <Gamepad2 className="h-5 w-5 text-emerald-300" />
            </span>
            <span>
              Fun Space Games
              <span className="mt-0.5 block text-xs font-normal uppercase tracking-[0.18em] text-slate-500">
                Play • Learn • Explore
              </span>
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlassCard
                  glow
                  className="group h-full cursor-pointer rounded-3xl border-white/[0.12] bg-slate-950/35 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.24)] hover:-translate-y-1.5 hover:border-violet-300/25"
                  onClick={() => setCurrentGame(game.id)}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-br from-violet-400/[0.18] to-cyan-300/[0.08] shadow-[0_0_28px_rgba(139,92,246,0.14)]">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
                      <game.icon className="relative z-10 h-6 w-6 text-cyan-100 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    </div>
                    <span className="rounded-full border border-yellow-300/15 bg-yellow-300/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-yellow-200">
                      +{game.points} XP
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white transition-colors group-hover:text-cyan-100">
                    {game.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-400">{game.description}</p>
                  <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <Badge
                      variant="secondary"
                      className="rounded-full border border-white/[0.10] bg-white/[0.05] px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-300"
                    >
                      {game.difficulty}
                    </Badge>
                    <span className="text-xs font-medium text-cyan-300 opacity-70 transition-opacity group-hover:opacity-100">
                      Play →
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-300/20 bg-yellow-300/[0.07] shadow-[0_0_22px_rgba(250,204,21,0.10)]">
              <Trophy className="h-5 w-5 text-yellow-300" />
            </span>
            <span>
              My Achievements
              <span className="mt-0.5 block text-xs font-normal uppercase tracking-[0.18em] text-slate-500">
                Your cosmic milestones
              </span>
            </span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard
                  className={`group rounded-3xl p-4 text-center transition-all duration-300 ${
                    achievement.earned
                      ? 'border-yellow-300/20 bg-yellow-300/[0.045] shadow-[0_0_28px_rgba(250,204,21,0.07)] hover:-translate-y-1'
                      : 'border-white/[0.08] bg-white/[0.025] opacity-75'
                  }`}
                >
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    achievement.earned
                      ? 'border-yellow-300/20 bg-yellow-300/[0.08] shadow-[0_0_22px_rgba(250,204,21,0.12)]'
                      : 'border-white/[0.08] bg-white/[0.03]'
                  }`}>
                    <achievement.icon className={`h-6 w-6 ${
                      achievement.earned ? 'text-yellow-300' : 'text-slate-600'
                    }`} />
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-white">{achievement.name}</h4>
                  <p className="text-xs leading-relaxed text-slate-500">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge className="mt-3 rounded-full border border-yellow-300/20 bg-yellow-300/[0.10] px-2.5 py-1 text-[10px] uppercase tracking-wider text-yellow-200">
                      ✓ Earned
                    </Badge>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-5 flex items-center gap-3 text-2xl font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/[0.07] shadow-[0_0_22px_rgba(139,92,246,0.10)]">
              <Brain className="h-5 w-5 text-violet-300" />
            </span>
            <span>
              Cool Space Facts!
              <span className="mt-0.5 block text-xs font-normal uppercase tracking-[0.18em] text-slate-500">
                Tiny facts, huge universe
              </span>
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {funFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassCard className="p-4">
                  <p className="text-center text-base font-semibold text-white">{fact}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-4 right-4"
        >
          <Button
            onClick={() => onNavigate('home')}
            className="rounded-full border border-violet-300/25 bg-gradient-to-r from-violet-500/90 to-cyan-500/90 px-5 py-2.5 font-semibold text-white shadow-[0_10px_35px_rgba(139,92,246,0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_42px_rgba(34,211,238,0.20)]"
          >
            <Heart className="mr-2 h-4 w-4" />
            Back Home
          </Button>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}