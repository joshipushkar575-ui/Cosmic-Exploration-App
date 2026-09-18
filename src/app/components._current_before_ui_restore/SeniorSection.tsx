import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Book, 
  Award, 
  Users,
  Brain,
  Microscope,
  BookOpen,
  FileText,
  GraduationCap,
  Star,
  Crown,
  Lightbulb,
  History,
  Quote,
  MessageCircle,
  ThumbsUp,
  Eye,
  Calendar,
  Clock,
  Medal
} from 'lucide-react';
import { CosmicBackground } from './CosmicBackground';
import { GlassCard } from './GlassCard';
import { Button } from './ui/button';
import { CosmicIconButton } from './CosmicIconButton';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SeniorSectionProps {
  onNavigate: (screen: string) => void;
}

export function SeniorSection({ onNavigate }: SeniorSectionProps) {
  const [activeTab, setActiveTab] = useState('knowledge');

  const knowledgeContributions = [
    {
      id: 1,
      title: "The Evolution of Space Telescope Technology: From Hubble to JWST",
      author: "Prof. Dr. Margaret Thompson",
      authorTitle: "Former NASA Astrophysicist, 40 years experience",
      views: 15420,
      likes: 892,
      comments: 67,
      timeAgo: "3 days ago",
      category: "Historical Perspective",
      excerpt: "Having worked on both Hubble and early JWST planning, I share insights into the technological evolution and challenges overcome...",
      tags: ["Space Telescopes", "History", "Technology"],
      readTime: "12 min read",
      expertise: "Expert"
    },
    {
      id: 2,
      title: "Lessons from Apollo: Project Management in Space Exploration",
      author: "Dr. Robert Chen",
      authorTitle: "Retired Space Program Director",
      views: 8934,
      likes: 534,
      comments: 45,
      timeAgo: "1 week ago",
      category: "Leadership",
      excerpt: "Drawing from my experience during the Apollo era, here are timeless principles for managing complex space missions...",
      tags: ["Apollo", "Management", "Leadership"],
      readTime: "8 min read",
      expertise: "Expert"
    },
    {
      id: 3,
      title: "The Physics Behind Gravitational Lensing: A Deep Dive",
      author: "Prof. Elena Rodriguez",
      authorTitle: "Theoretical Physicist, Stanford University",
      views: 12567,
      likes: 723,
      comments: 89,
      timeAgo: "2 weeks ago",
      category: "Scientific Knowledge",
      excerpt: "A comprehensive explanation of how massive objects bend spacetime and what this means for our observations of distant galaxies...",
      tags: ["General Relativity", "Astrophysics", "Theory"],
      readTime: "15 min read",
      expertise: "Expert"
    }
  ];

  const achievements = [
    {
      name: "Knowledge Master",
      description: "Shared 100+ high-quality educational posts",
      icon: Brain,
      level: "Platinum",
      earned: true,
      date: "2024-06-15",
      points: 5000
    },
    {
      name: "Mentor Extraordinaire",
      description: "Guided 500+ junior researchers and students",
      icon: GraduationCap,
      level: "Diamond",
      earned: true,
      date: "2024-08-22",
      points: 10000
    },
    {
      name: "Historical Archivist",
      description: "Documented 50+ historical space program insights",
      icon: History,
      level: "Gold",
      earned: true,
      date: "2024-05-10",
      points: 3000
    },
    {
      name: "Wisdom Keeper",
      description: "Provided expert insights on 1000+ questions",
      icon: Lightbulb,
      level: "Platinum",
      earned: true,
      date: "2024-09-01",
      points: 7500
    },
    {
      name: "Community Elder",
      description: "Respected member for 5+ years",
      icon: Crown,
      level: "Legendary",
      earned: false,
      date: null,
      points: 15000
    },
    {
      name: "Nobel Contributor",
      description: "Contributed to Nobel Prize-winning research",
      icon: Medal,
      level: "Legendary",
      earned: false,
      date: null,
      points: 25000
    }
  ];

  const mentorshipOpportunities = [
    {
      id: 1,
      title: "Guide Young Astronomers Program",
      description: "Mentor high school students interested in astronomy careers",
      participants: 34,
      duration: "6 months",
      commitment: "2 hours/week",
      category: "Education",
      ageGroup: "15-18 years",
      status: "Active"
    },
    {
      id: 2,
      title: "Graduate Research Mentorship",
      description: "Advise graduate students on astrophysics research projects",
      participants: 12,
      duration: "1 year",
      commitment: "3 hours/week",
      category: "Research",
      ageGroup: "22-28 years",
      status: "Recruiting"
    },
    {
      id: 3,
      title: "Career Transition Guidance",
      description: "Help mid-career professionals transition into space industry",
      participants: 18,
      duration: "3 months",
      commitment: "1 hour/week",
      category: "Career",
      ageGroup: "30-45 years",
      status: "Active"
    }
  ];

  const wisdomSharing = [
    {
      question: "What's the biggest misconception about working in space science?",
      answer: "Many believe it's all theoretical. In reality, 80% is practical engineering, problem-solving, and collaboration.",
      author: "Dr. James Wilson",
      title: "Former Mission Director",
      likes: 234,
      replies: 45,
      category: "Career Advice"
    },
    {
      question: "How has space exploration changed since the 1960s?",
      answer: "We've moved from government-only programs to commercial partnerships. The democratization of space access is unprecedented.",
      author: "Prof. Sarah Martinez",
      title: "Space Policy Historian",
      likes: 189,
      replies: 67,
      category: "Historical Perspective"
    },
    {
      question: "What should the next generation of space scientists focus on?",
      answer: "Interdisciplinary collaboration. The future belongs to those who can bridge astronomy, biology, engineering, and computer science.",
      author: "Dr. Michael Chang",
      title: "Research Institute Director",
      likes: 156,
      replies: 23,
      category: "Future Insights"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Prof. Dr. Margaret Thompson", points: 45620, contributions: 234, title: "Knowledge Sage" },
    { rank: 2, name: "Dr. Robert Chen", points: 38940, contributions: 189, title: "Wisdom Keeper" },
    { rank: 3, name: "Prof. Elena Rodriguez", points: 34567, contributions: 167, title: "Master Mentor" },
    { rank: 4, name: "Dr. James Wilson", points: 31245, contributions: 145, title: "Expert Guide" },
    { rank: 5, name: "Prof. Sarah Martinez", points: 28890, contributions: 134, title: "Elder Scholar" }
  ];

  const KnowledgeArticleCard = ({ article }: { article: any }) => (
    <GlassCard className="group cursor-pointer rounded-2xl border-white/[0.12] bg-white/[0.045] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.07] hover:shadow-[0_16px_45px_rgba(0,0,0,0.24),0_0_30px_rgba(34,211,238,0.06)] sm:p-6">
      <div className="flex justify-between items-start mb-3">
        <Badge variant={article.category === 'Historical Perspective' ? 'default' : 'secondary'}>
          {article.category}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
          <Clock className="w-4 h-4" />
          <span>{article.readTime}</span>
        </div>
      </div>
      
      <h3 className="mb-2 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-cyan-100 sm:text-xl">{article.title}</h3>
      
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="size-10 border border-white/15 bg-white/[0.06] shadow-[0_0_18px_rgba(139,92,246,0.10)]">
          <AvatarFallback>{article.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-medium">{article.author}</p>
          <p className="text-gray-400 text-sm">{article.authorTitle}</p>
        </div>
        <Badge className="bg-yellow-600 ml-auto">{article.expertise}</Badge>
      </div>
      
      <p className="mb-4 text-sm leading-6 text-slate-300 sm:text-base">{article.excerpt}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {article.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-slate-500 sm:gap-4 sm:text-sm">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{article.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{article.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{article.comments}</span>
          </div>
          <span>{article.timeAgo}</span>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <CosmicBackground variant="deep-space">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="hidden h-px w-12 bg-gradient-to-r from-transparent to-violet-400/50 sm:block" />
            <Crown className="size-7 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]" />
            <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              Wisdom Council
            </h1>
            <Crown className="size-7 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.45)]" />
            <div className="hidden h-px w-12 bg-gradient-to-l from-transparent to-cyan-400/50 sm:block" />
          </div>
          <p className="text-sm text-slate-400 sm:text-base">
            Share Knowledge <span className="text-violet-400">•</span> Mentor Others <span className="text-cyan-400">•</span> Leave a Legacy
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="knowledge" className="w-full">
            <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border border-white/[0.10] bg-slate-950/55 p-1.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:grid-cols-5">
              <TabsTrigger value="knowledge" className="rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/25 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(139,92,246,0.14)] sm:text-sm">Knowledge Sharing</TabsTrigger>
              <TabsTrigger value="mentorship" className="rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/25 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(139,92,246,0.14)] sm:text-sm">Mentorship</TabsTrigger>
              <TabsTrigger value="wisdom" className="rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/25 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(139,92,246,0.14)] sm:text-sm">Wisdom Q&A</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/25 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(139,92,246,0.14)] sm:text-sm">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard" className="rounded-xl px-3 py-2.5 text-xs text-slate-400 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/25 data-[state=active]:to-cyan-400/15 data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(139,92,246,0.14)] sm:text-sm">Honor Roll</TabsTrigger>
            </TabsList>

            <TabsContent value="knowledge">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    <Book className="size-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.45)] sm:size-6" />
                    Featured Knowledge Articles
                  </h2>
                  <Button className="rounded-xl border border-cyan-300/20 bg-gradient-to-r from-violet-500/80 to-cyan-500/80 px-4 text-white shadow-[0_8px_28px_rgba(34,211,238,0.12)] hover:from-violet-400 hover:to-cyan-400">
                    Share Knowledge
                  </Button>
                </div>

                <div className="space-y-4">
                  {knowledgeContributions.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <KnowledgeArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mentorship">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    <GraduationCap className="size-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.45)] sm:size-6" />
                    Mentorship Opportunities
                  </h2>
                  <Button className="rounded-xl border border-cyan-300/20 bg-gradient-to-r from-violet-500/80 to-cyan-500/80 px-4 text-white shadow-[0_8px_28px_rgba(34,211,238,0.12)] hover:from-violet-400 hover:to-cyan-400">
                    Create Program
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mentorshipOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <GlassCard className="group h-full rounded-2xl border-white/[0.12] bg-white/[0.045] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/20 hover:bg-white/[0.07] hover:shadow-[0_16px_45px_rgba(0,0,0,0.24),0_0_30px_rgba(139,92,246,0.06)] sm:p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-base font-bold tracking-tight text-white transition-colors group-hover:text-cyan-100 sm:text-lg">{opportunity.title}</h3>
                          <Badge 
                            variant={opportunity.status === 'Active' ? 'default' : 'secondary'}
                            className={opportunity.status === 'Active' ? 'bg-green-600' : ''}
                          >
                            {opportunity.status}
                          </Badge>
                        </div>
                        
                        <p className="mb-4 text-sm leading-6 text-slate-300 sm:text-base">{opportunity.description}</p>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Age Group:</span>
                            <span className="text-white">{opportunity.ageGroup}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{opportunity.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Commitment:</span>
                            <span className="text-white">{opportunity.commitment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Participants:</span>
                            <span className="text-white">{opportunity.participants}</span>
                          </div>
                        </div>
                        
                        <Badge variant="outline" className="mb-4">
                          {opportunity.category}
                        </Badge>
                        
                        <Button className="w-full rounded-xl" variant={opportunity.status === 'Active' ? 'default' : 'outline'}>
                          {opportunity.status === 'Active' ? 'Join as Mentor' : 'Express Interest'}
                        </Button>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wisdom">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    <Quote className="size-5 text-violet-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.45)] sm:size-6" />
                    Wisdom Exchange
                  </h2>
                  <Button className="rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-500/80 to-cyan-500/80 px-4 text-white shadow-[0_8px_28px_rgba(139,92,246,0.16)] hover:from-violet-400 hover:to-cyan-400">
                    Answer Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {wisdomSharing.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <GlassCard className="rounded-2xl border-white/[0.12] bg-white/[0.045] p-5 sm:p-6">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        
                        <h3 className="text-white font-bold text-lg mb-3">{item.question}</h3>
                        
                        <div className="mb-4 rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-400/[0.06] via-violet-500/[0.04] to-transparent p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                          <p className="text-gray-300 italic">"{item.answer}"</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 border border-white/15 bg-white/[0.06]">
                              <AvatarFallback>{item.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium text-sm">{item.author}</p>
                              <p className="text-gray-400 text-xs">{item.title}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-400">
                            <button className="group flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-slate-400 transition-all duration-300 hover:border-violet-300/20 hover:bg-violet-300/[0.07] hover:text-white">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{item.likes}</span>
                            </button>
                            <button className="group flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-slate-400 transition-all duration-300 hover:border-violet-300/20 hover:bg-violet-300/[0.07] hover:text-white">
                              <MessageCircle className="w-4 h-4" />
                              <span>{item.replies}</span>
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="space-y-6">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  <Award className="size-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)] sm:size-6" />
                  Lifetime Achievements
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <GlassCard className={`group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 ${
                        achievement.earned
                          ? 'border-amber-300/20 bg-gradient-to-br from-amber-500/[0.12] via-violet-500/[0.06] to-transparent shadow-[0_12px_35px_rgba(251,191,36,0.06)]'
                          : 'border-white/[0.08] bg-white/[0.025] opacity-75 hover:opacity-100'
                      }`}>
                        <achievement.icon className={`mx-auto mb-4 size-14 transition-transform duration-300 group-hover:scale-110 ${
                          achievement.earned
                            ? 'text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.35)]'
                            : 'text-slate-500'
                        }`} />
                        <h3 className="text-white font-bold text-lg mb-2">{achievement.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                        
                        <Badge 
                          className={`mb-3 ${
                            achievement.level === 'Legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            achievement.level === 'Diamond' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                            achievement.level === 'Platinum' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            'bg-gradient-to-r from-yellow-500 to-orange-500'
                          }`}
                        >
                          {achievement.level}
                        </Badge>
                        
                        <div className="text-center">
                          <p className="text-yellow-400 font-bold">{achievement.points.toLocaleString()} pts</p>
                          {achievement.earned ? (
                            <p className="text-gray-400 text-xs mt-1">Earned: {achievement.date}</p>
                          ) : (
                            <p className="text-gray-500 text-xs mt-1">Not yet earned</p>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard">
              <div className="space-y-6">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  <Trophy className="size-5 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)] sm:size-6" />
                  Wisdom Council Honor Roll
                </h2>
                
                <GlassCard className="rounded-2xl border-white/[0.12] bg-white/[0.045] p-5 sm:p-6">
                  <div className="space-y-4">
                    {leaderboard.map((member, index) => (
                      <motion.div
                        key={member.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5 transition-all duration-300 hover:border-violet-300/15 hover:bg-white/[0.065] sm:p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.18)] ${
                            member.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            member.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            member.rank === 3 ? 'bg-gradient-to-r from-orange-600 to-yellow-600' :
                            'bg-gray-600'
                          }`}>
                            <span className="text-white font-bold">#{member.rank}</span>
                          </div>
                          
                          <div>
                            <h3 className="text-white font-bold">{member.name}</h3>
                            <p className="text-gray-400 text-sm">{member.title}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white font-bold">{member.points.toLocaleString()} points</p>
                          <p className="text-gray-400 text-sm">{member.contributions} contributions</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-4 right-4 z-30"
        >
          <Button
            onClick={() => onNavigate('home')}
            className="rounded-2xl border border-white/15 bg-slate-950/70 px-5 text-white shadow-[0_10px_35px_rgba(0,0,0,0.35),0_0_24px_rgba(139,92,246,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-violet-500/15"
          >
            ← Back Home
          </Button>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}