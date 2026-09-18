import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Target, 
  Brain, 
  Rocket, 
  Medal,
  Zap,
  Clock,
  Star,
  Award,
  Camera,
  Telescope,
  Globe,
  TrendingUp
} from 'lucide-react';
import { CosmicBackground } from './CosmicBackground';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeenagerSectionProps {
  onNavigate: (screen: string) => void;
}

export function TeenagerSection({ onNavigate }: TeenagerSectionProps) {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [userRank, setUserRank] = useState(42);
  const [points, setPoints] = useState(1847);
  const [level, setLevel] = useState(8);

  const competitions = [
    {
      id: 'astrophoto-challenge',
      title: 'Astrophotography Challenge',
      description: 'Capture stunning images of celestial objects and compete with peers worldwide!',
      icon: Camera,
      difficulty: 'Advanced',
      participants: 2847,
      timeLeft: '5 days',
      prize: '1000 pts + Digital Camera',
      status: 'active',
      color: 'bg-blue-600'
    },
    {
      id: 'mars-mission-design',
      title: 'Mars Mission Design',
      description: 'Design a comprehensive mission plan for human settlement on Mars',
      icon: Rocket,
      difficulty: 'Expert',
      participants: 1523,
      timeLeft: '12 days',
      prize: '2500 pts + NASA Internship',
      status: 'upcoming',
      color: 'bg-red-600'
    },
    {
      id: 'exoplanet-discovery',
      title: 'Exoplanet Data Analysis',
      description: 'Analyze real Kepler telescope data to discover new exoplanets',
      icon: Globe,
      difficulty: 'Advanced',
      participants: 983,
      timeLeft: '8 days',
      prize: '1500 pts + Research Paper Co-author',
      status: 'active',
      color: 'bg-green-600'
    }
  ];

  const challenges = [
    {
      id: 'weekly-quiz',
      title: 'Weekly Astronomy Quiz',
      description: 'Test your knowledge with advanced astronomy questions',
      icon: Brain,
      points: 200,
      difficulty: 'Medium',
      timeLeft: '2 days',
      completed: false
    },
    {
      id: 'constellation-hunt',
      title: 'Constellation Photography Hunt',
      description: 'Photograph 10 different constellations this month',
      icon: Star,
      points: 500,
      difficulty: 'Hard',
      timeLeft: '18 days',
      completed: false
    },
    {
      id: 'space-news-analysis',
      title: 'Space News Analysis',
      description: 'Write detailed analysis of recent space discoveries',
      icon: TrendingUp,
      points: 300,
      difficulty: 'Medium',
      timeLeft: '7 days',
      completed: true
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', points: 15847, badge: 'Cosmic Master', country: 'USA' },
    { rank: 2, name: 'Maya Patel', points: 14923, badge: 'Star Navigator', country: 'India' },
    { rank: 3, name: 'Erik Johnson', points: 13756, badge: 'Galaxy Explorer', country: 'Sweden' },
    { rank: 4, name: 'Sofia Rodriguez', points: 12891, badge: 'Nebula Hunter', country: 'Spain' },
    { rank: 5, name: 'Kai Tanaka', points: 11647, badge: 'Meteor Chaser', country: 'Japan' },
    { rank: 42, name: 'You', points: 1847, badge: 'Rising Star', country: 'Local' }
  ];

  const achievements = [
    { 
      name: 'Quiz Champion', 
      icon: Brain, 
      earned: true, 
      rarity: 'rare',
      description: 'Scored 95%+ on 10 consecutive quizzes',
      date: '2024-09-15'
    },
    { 
      name: 'Astrophotographer', 
      icon: Camera, 
      earned: true, 
      rarity: 'epic',
      description: 'Captured award-winning deep-sky images',
      date: '2024-09-10'
    },
    { 
      name: 'Mission Planner', 
      icon: Rocket, 
      earned: false, 
      rarity: 'legendary',
      description: 'Design a feasible Mars colonization plan',
      date: null
    },
    { 
      name: 'Research Contributor', 
      icon: Telescope, 
      earned: false, 
      rarity: 'legendary',
      description: 'Contribute to published astronomical research',
      date: null
    }
  ];

  const quizQuestions = [
    {
      question: "What is the escape velocity of Earth?",
      options: ["9.8 m/s", "11.2 km/s", "299,792,458 m/s", "42 km/s"],
      correct: "11.2 km/s",
      explanation: "Earth's escape velocity is 11.2 km/s - the minimum speed needed for an object to escape Earth's gravitational field."
    },
    {
      question: "Which telescope discovered the accelerating expansion of the universe?",
      options: ["Hubble Space Telescope", "Kepler Space Telescope", "Spitzer Space Telescope", "James Webb Space Telescope"],
      correct: "Hubble Space Telescope",
      explanation: "The Hubble Space Telescope's observations of distant supernovae led to the discovery that the universe's expansion is accelerating."
    },
    {
      question: "What is the main component of Jupiter's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Methane"],
      correct: "Hydrogen",
      explanation: "Jupiter's atmosphere is about 89% hydrogen and 10% helium, making it similar to the Sun's composition."
    }
  ];

  const QuizInterface = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    const handleAnswer = (answer: string) => {
      setSelectedAnswer(answer);
      setShowExplanation(true);
      
      if (answer === quizQuestions[currentQuestion].correct) {
        setQuizScore(quizScore + 1);
      }
      
      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowExplanation(false);
        } else {
          const earnedPoints = quizScore * 50;
          setPoints(points + earnedPoints);
          setActiveChallenge(null);
        }
      }, 3000);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-2">Advanced Astronomy Quiz</h3>
          <p className="text-slate-400 text-sm">Question {currentQuestion + 1} of {quizQuestions.length}</p>
          <Progress value={(currentQuestion / quizQuestions.length) * 100} className="mt-2" />
        </div>

        <GlassCard className="rounded-3xl border-white/[0.14] bg-slate-950/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_35px_rgba(139,92,246,0.08)] backdrop-blur-2xl">
          <h4 className="text-xl font-semibold tracking-tight text-white mb-5">{quizQuestions[currentQuestion].question}</h4>
          
          <div className="space-y-3">
            {quizQuestions[currentQuestion].options.map((option) => (
              <Button
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`group relative w-full justify-start rounded-2xl border p-4 h-auto text-left transition-all duration-300 ${
                  showExplanation
                    ? option === quizQuestions[currentQuestion].correct
                      ? 'border-emerald-300/40 bg-emerald-400/[0.12] text-white shadow-[0_0_25px_rgba(16,185,129,0.10)]'
                      : option === selectedAnswer && option !== quizQuestions[currentQuestion].correct
                        ? 'border-rose-300/40 bg-rose-400/[0.12] text-white shadow-[0_0_25px_rgba(244,63,94,0.10)]'
                        : 'border-white/[0.08] bg-white/[0.025] text-slate-500'
                    : 'border-white/[0.12] bg-white/[0.04] text-white hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)] hover:-translate-y-0.5'
                }`}
                onClick={() => !showExplanation && handleAnswer(option)}
                disabled={showExplanation}
              >
                {option}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-white/[0.10] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
            >
              <p className="text-white font-medium mb-2">
                {selectedAnswer === quizQuestions[currentQuestion].correct ? "✅ Correct!" : "❌ Incorrect"}
              </p>
              <p className="text-gray-300 text-sm">
                {quizQuestions[currentQuestion].explanation}
              </p>
            </motion.div>
          )}
        </GlassCard>
      </div>
    );
  };

  if (activeChallenge === 'weekly-quiz') {
    return (
      <CosmicBackground variant="galaxy">
        <div className="min-h-screen p-4">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setActiveChallenge(null)}
              className="mb-5 rounded-xl border-white/[0.14] bg-white/[0.045] text-slate-200 backdrop-blur-xl hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] hover:text-white"
            >
              ← Back to Challenges
            </Button>
            <QuizInterface />
          </div>
        </div>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground variant="galaxy">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-2">Space Academy</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Challenge yourself. Compete globally. Reach for the stars.</p>
          
          <div className="flex flex-wrap justify-center gap-2.5 mt-5">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.045] px-4 py-2 text-sm backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.15)]">
              <Trophy className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.45)]" />
              <span className="text-white">Rank #{userRank}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.045] px-4 py-2 text-sm backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.15)]">
              <Zap className="w-4 h-4 text-violet-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.45)]" />
              <span className="text-white">{points} Points</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.045] px-4 py-2 text-sm backdrop-blur-xl shadow-[0_6px_24px_rgba(0,0,0,0.15)]">
              <Star className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]" />
              <span className="text-white">Level {level}</span>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="competitions" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 rounded-2xl border border-white/[0.10] bg-slate-950/45 p-1.5 mb-7 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            <TabsTrigger value="competitions" className="rounded-xl text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_rgba(139,92,246,0.12)]">Competitions</TabsTrigger>
            <TabsTrigger value="challenges" className="rounded-xl text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_rgba(139,92,246,0.12)]">Daily Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard" className="rounded-xl text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_rgba(139,92,246,0.12)]">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-xl text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_0_24px_rgba(139,92,246,0.12)]">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="competitions">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-5">Global Competitions</h2>
              {competitions.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="group rounded-3xl border-white/[0.12] bg-slate-950/45 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl hover:border-violet-300/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_35px_rgba(139,92,246,0.08)]">
                    <div className="flex items-start gap-4">
                      <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br from-violet-500/30 via-slate-900/70 to-cyan-400/20 shadow-[0_8px_30px_rgba(139,92,246,0.15)]`}>
                        <comp.icon className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-cyan-100">{comp.title}</h3>
                          <Badge 
                            variant={comp.status === 'active' ? 'default' : 'secondary'}
                            className={comp.status === 'active'
      ? 'border border-emerald-300/20 bg-emerald-400/[0.12] text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.10)]'
      : 'border border-violet-300/20 bg-violet-400/[0.10] text-violet-200'}
                          >
                            {comp.status}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-4">{comp.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Difficulty:</span>
                            <p className="text-slate-100 font-medium">{comp.difficulty}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Participants:</span>
                            <p className="text-slate-100 font-medium">{comp.participants.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Time Left:</span>
                            <p className="text-slate-100 font-medium">{comp.timeLeft}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Prize:</span>
                            <p className="text-amber-300 font-medium">{comp.prize}</p>
                          </div>
                        </div>
                        <Button className="mt-5 rounded-xl border border-cyan-300/20 bg-gradient-to-r from-violet-500/80 to-cyan-400/70 px-5 shadow-[0_8px_28px_rgba(34,211,238,0.12)] hover:from-violet-400 hover:to-cyan-300 hover:text-slate-950" disabled={comp.status !== 'active'}>
                          {comp.status === 'active' ? 'Join Competition' : 'Coming Soon'}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-5">Daily & Weekly Challenges</h2>
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className={`p-4 ${challenge.completed ? 'bg-green-500/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <challenge.icon className={`w-8 h-8 ${challenge.completed ? 'text-emerald-300' : 'text-cyan-200'} drop-shadow-[0_0_10px_rgba(34,211,238,0.20)]`} />
                        <div>
                          <h3 className="text-white font-bold">{challenge.title}</h3>
                          <p className="text-gray-300 text-sm">{challenge.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="border-white/[0.12] bg-white/[0.035] text-slate-300">{challenge.difficulty}</Badge>
                            <span className="text-amber-300 text-sm font-medium">+{challenge.points} pts</span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {challenge.timeLeft}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={challenge.completed ? "outline" : "default"}
                        disabled={challenge.completed}
                        className={challenge.completed
                          ? "rounded-xl border-white/[0.12] bg-white/[0.035] text-slate-500"
                          : "rounded-xl border border-cyan-300/20 bg-gradient-to-r from-violet-500/80 to-cyan-400/70 text-white shadow-[0_8px_28px_rgba(34,211,238,0.10)] hover:from-violet-400 hover:to-cyan-300 hover:text-slate-950"}
                        onClick={() => challenge.id === 'weekly-quiz' && setActiveChallenge(challenge.id)}
                      >
                        {challenge.completed ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-5">Global Leaderboard</h2>
              <GlassCard className="rounded-3xl border-white/[0.12] bg-slate-950/45 p-5 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`group flex items-center justify-between rounded-2xl border p-3 transition-all duration-300 ${
                        user.name === 'You'
                          ? 'border-amber-300/20 bg-amber-300/[0.08] shadow-[0_0_25px_rgba(251,191,36,0.08)]'
                          : 'border-white/[0.06] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-[0_6px_20px_rgba(0,0,0,0.20)] ${
                          user.rank <= 3
                            ? 'border-amber-200/30 bg-gradient-to-br from-amber-300 to-orange-500'
                            : 'border-white/[0.10] bg-white/[0.07]'
                        }`}>
                          <span className="text-white text-xs font-bold">#{user.rank}</span>
                        </div>
                        <div>
                          <h3 className={`font-bold ${user.name === 'You' ? 'text-amber-300' : 'text-white'}`}>
                            {user.name}
                          </h3>
                          <p className="text-gray-400 text-sm">{user.badge} • {user.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{user.points.toLocaleString()}</p>
                        <p className="text-gray-400 text-sm">points</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-5">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <GlassCard className={`group rounded-3xl border p-6 shadow-[0_16px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 ${
                      achievement.earned
                        ? 'border-amber-300/20 bg-gradient-to-br from-amber-400/[0.10] to-violet-400/[0.08] hover:border-amber-300/30'
                        : 'border-white/[0.08] bg-slate-950/45 hover:border-white/[0.15]'
                    }`}>
                      <div className="text-center">
                        <achievement.icon className={`w-12 h-12 mx-auto mb-3 ${
                          achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                        }`} />
                        <h3 className="text-white font-bold mb-2">{achievement.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                        <Badge 
                          className={`${
                            achievement.rarity === 'legendary'
                              ? 'border border-violet-300/20 bg-violet-400/[0.12] text-violet-200'
                              : achievement.rarity === 'epic'
                                ? 'border border-cyan-300/20 bg-cyan-400/[0.10] text-cyan-200'
                                : 'border border-emerald-300/20 bg-emerald-400/[0.10] text-emerald-200'
                          }`}
                        >
                          {achievement.rarity}
                        </Badge>
                        {achievement.earned && (
                          <p className="text-gray-400 text-xs mt-2">Earned: {achievement.date}</p>
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-4 right-4"
        >
          <Button
            onClick={() => onNavigate('home')}
            className="rounded-xl border border-white/[0.14] bg-slate-950/65 px-5 text-white shadow-[0_10px_35px_rgba(0,0,0,0.30),0_0_24px_rgba(139,92,246,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-violet-400/[0.10]"
          >
            ← Back Home
          </Button>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}