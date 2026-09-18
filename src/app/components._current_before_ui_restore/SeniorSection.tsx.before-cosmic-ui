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
    <GlassCard className="p-6 hover:bg-white/10 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <Badge variant={article.category === 'Historical Perspective' ? 'default' : 'secondary'}>
          {article.category}
        </Badge>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{article.readTime}</span>
        </div>
      </div>
      
      <h3 className="text-white font-bold text-xl mb-2">{article.title}</h3>
      
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback>{article.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-medium">{article.author}</p>
          <p className="text-gray-400 text-sm">{article.authorTitle}</p>
        </div>
        <Badge className="bg-yellow-600 ml-auto">{article.expertise}</Badge>
      </div>
      
      <p className="text-gray-300 mb-4">{article.excerpt}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {article.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-4 text-gray-400 text-sm">
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            Wisdom Council
            <Crown className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-gray-300">Share Knowledge • Mentor Others • Leave a Legacy</p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="knowledge" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="knowledge">Knowledge Sharing</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="wisdom">Wisdom Q&A</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard">Honor Roll</TabsTrigger>
            </TabsList>

            <TabsContent value="knowledge">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Book className="w-6 h-6 text-blue-400" />
                    Featured Knowledge Articles
                  </h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">
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
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-green-400" />
                    Mentorship Opportunities
                  </h2>
                  <Button className="bg-green-600 hover:bg-green-700">
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
                      <GlassCard className="p-6 h-full">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-white font-bold text-lg">{opportunity.title}</h3>
                          <Badge 
                            variant={opportunity.status === 'Active' ? 'default' : 'secondary'}
                            className={opportunity.status === 'Active' ? 'bg-green-600' : ''}
                          >
                            {opportunity.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{opportunity.description}</p>
                        
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
                        
                        <Button className="w-full" variant={opportunity.status === 'Active' ? 'default' : 'outline'}>
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
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Quote className="w-6 h-6 text-purple-400" />
                    Wisdom Exchange
                  </h2>
                  <Button className="bg-purple-600 hover:bg-purple-700">
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
                      <GlassCard className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        
                        <h3 className="text-white font-bold text-lg mb-3">{item.question}</h3>
                        
                        <div className="bg-white/5 p-4 rounded-lg mb-4">
                          <p className="text-gray-300 italic">"{item.answer}"</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{item.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium text-sm">{item.author}</p>
                              <p className="text-gray-400 text-xs">{item.title}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-400">
                            <button className="flex items-center gap-1 hover:text-white transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{item.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-white transition-colors">
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
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
                      <GlassCard className={`p-6 text-center ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                          : 'bg-gray-500/20'
                      }`}>
                        <achievement.icon className={`w-16 h-16 mx-auto mb-4 ${
                          achievement.earned ? 'text-yellow-400' : 'text-gray-400'
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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Wisdom Council Honor Roll
                </h2>
                
                <GlassCard className="p-6">
                  <div className="space-y-4">
                    {leaderboard.map((member, index) => (
                      <motion.div
                        key={member.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
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
          className="fixed bottom-4 right-4"
        >
          <Button onClick={() => onNavigate('home')} className="bg-purple-600 hover:bg-purple-700">
            ← Back Home
          </Button>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}