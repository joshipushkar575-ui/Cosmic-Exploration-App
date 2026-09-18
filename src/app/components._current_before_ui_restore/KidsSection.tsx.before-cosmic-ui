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
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Space Quiz! 🚀</h3>
          <p className="text-gray-300">Question {currentQuestion + 1} of {questions.length}</p>
          <Progress value={(currentQuestion / questions.length) * 100} className="mt-2" />
        </div>

        <GlassCard className="p-6">
          <h4 className="text-xl text-white mb-4">{questions[currentQuestion].question}</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {questions[currentQuestion].options.map((option) => (
              <Button
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`p-4 h-auto text-left ${
                  showResult 
                    ? option === questions[currentQuestion].correct 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : option === selectedAnswer && option !== questions[currentQuestion].correct
                        ? 'bg-red-500 hover:bg-red-600'
                        : ''
                    : ''
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
              className="mt-4 p-4 bg-white/10 rounded-lg"
            >
              <p className="text-white text-center">
                {selectedAnswer === questions[currentQuestion].correct ? "🎉 Correct!" : "😊 Good try!"}
              </p>
              <p className="text-gray-300 text-sm text-center mt-2">
                {questions[currentQuestion].fun}
              </p>
            </motion.div>
          )}
        </GlassCard>

        <div className="text-center">
          <p className="text-yellow-400">Score: {gameScore} points</p>
        </div>
      </div>
    );
  };

  if (currentGame === 'space-quiz') {
    return (
      <CosmicBackground variant="nebula">
        <div className="min-h-screen p-4">
          <div className="max-w-2xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setCurrentGame(null)}
              className="mb-4"
            >
              ← Back to Games
            </Button>
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Space Explorers
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-gray-300">Let's explore the amazing universe together!</p>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white">{stars} Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="text-white">Level {level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-white">{score} Points</span>
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
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-green-400" />
            Fun Space Games
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
                <GlassCard className="p-6 cursor-pointer h-full" onClick={() => setCurrentGame(game.id)}>
                  <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center mb-4`}>
                    <game.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{game.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-xs">
                      {game.difficulty}
                    </Badge>
                    <span className="text-yellow-400 text-sm">+{game.points} pts</span>
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
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            My Achievements
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className={`p-4 text-center ${achievement.earned ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                  <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.earned ? 'text-yellow-400' : 'text-gray-400'}`} />
                  <h4 className="text-white text-sm font-medium mb-1">{achievement.name}</h4>
                  <p className="text-gray-400 text-xs">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-yellow-500 text-black">Earned!</Badge>
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
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Cool Space Facts!
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
                  <p className="text-white text-center">{fact}</p>
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
          <Button onClick={() => onNavigate('home')} className="bg-purple-600 hover:bg-purple-700">
            <Heart className="w-4 h-4 mr-2" />
            Back Home
          </Button>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}