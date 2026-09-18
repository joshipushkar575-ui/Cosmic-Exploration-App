import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Brain, 
  Rocket, 
  Award,
  BookOpen,
  Microscope,
  Satellite,
  Calculator,
  Monitor,
  FileText,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';
import { CosmicBackground } from './CosmicBackground';
import { GlassCard } from './GlassCard';
import { CosmicIconButton } from './CosmicIconButton';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdultSectionProps {
  onNavigate: (screen: string) => void;
}

export function AdultSection({ onNavigate }: AdultSectionProps) {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: "Analysis of JWST's Latest Deep Field Images",
      author: "Dr. Sarah Chen",
      authorAvatar: "/api/placeholder/40/40",
      replies: 47,
      likes: 234,
      tags: ["JWST", "Deep Field", "Galaxy Formation"],
      timeAgo: "2 hours ago",
      excerpt: "The recent images from JWST reveal unprecedented details about early galaxy formation. I've analyzed the spectral data and found some fascinating patterns...",
      isExpert: true,
      category: "Research"
    },
    {
      id: 2,
      title: "Artemis III Mission Planning: Technical Challenges",
      author: "Michael Rodriguez",
      authorAvatar: "/api/placeholder/40/40",
      replies: 89,
      likes: 567,
      tags: ["Artemis", "Moon Landing", "Engineering"],
      timeAgo: "5 hours ago",
      excerpt: "As we approach the Artemis III mission, there are several technical hurdles that need addressing. Let's discuss the propulsion challenges and potential solutions...",
      isExpert: false,
      category: "Engineering"
    },
    {
      id: 3,
      title: "Breakthrough in Exoplanet Atmospheric Analysis",
      author: "Prof. Elena Vasquez",
      authorAvatar: "/api/placeholder/40/40",
      replies: 23,
      likes: 156,
      tags: ["Exoplanets", "Spectroscopy", "Atmospheres"],
      timeAgo: "1 day ago",
      excerpt: "New machine learning algorithms have improved our ability to detect water vapor in exoplanet atmospheres by 300%. Here's how it works...",
      isExpert: true,
      category: "Discovery"
    }
  ];

  const researchProjects = [
    {
      id: 1,
      title: "Gravitational Wave Detection Optimization",
      description: "Collaborate on improving LIGO's sensitivity using advanced signal processing",
      participants: 156,
      difficulty: "Advanced",
      deadline: "3 months",
      skills: ["Signal Processing", "Physics", "Python"],
      organization: "MIT",
      status: "Active"
    },
    {
      id: 2,
      title: "Mars Soil Composition Database",
      description: "Create comprehensive database of Martian soil samples from Perseverance rover",
      participants: 89,
      difficulty: "Intermediate",
      deadline: "6 months",
      skills: ["Data Analysis", "Chemistry", "Database Design"],
      organization: "NASA JPL",
      status: "Recruiting"
    },
    {
      id: 3,
      title: "Asteroid Trajectory Prediction Model",
      description: "Develop ML models for predicting near-Earth asteroid trajectories",
      participants: 67,
      difficulty: "Expert",
      deadline: "1 year",
      skills: ["Machine Learning", "Orbital Mechanics", "Python"],
      organization: "ESA",
      status: "Active"
    }
  ];

  const achievements = [
    {
      name: "Research Contributor",
      description: "Contributed to 5 published research papers",
      icon: FileText,
      rarity: "Epic",
      earned: true,
      date: "2024-08-15"
    },
    {
      name: "Community Leader",
      description: "Moderated discussions with 1000+ participants",
      icon: Users,
      rarity: "Rare",
      earned: true,
      date: "2024-07-22"
    },
    {
      name: "Innovation Pioneer",
      description: "Proposed solution adopted by space agency",
      icon: Rocket,
      rarity: "Legendary",
      earned: false,
      date: null
    },
    {
      name: "Peer Reviewer",
      description: "Reviewed 50+ research submissions",
      icon: BookOpen,
      rarity: "Epic",
      earned: false,
      date: null
    }
  ];

  const tools = [
    {
      name: "Orbital Calculator",
      description: "Advanced orbital mechanics calculations",
      icon: Calculator,
      usage: "2.3k users",
      category: "Physics"
    },
    {
      name: "Spectrum Analyzer",
      description: "Analyze astronomical spectra data",
      icon: Monitor,
      usage: "1.8k users",
      category: "Analysis"
    },
    {
      name: "Mission Planner",
      description: "Plan space missions with real constraints",
      icon: Satellite,
      usage: "967 users",
      category: "Engineering"
    },
    {
      name: "Research Collaborator",
      description: "Find and join research projects",
      icon: Microscope,
      usage: "3.4k users",
      category: "Collaboration"
    }
  ];

  const DiscussionCard = ({ discussion }: { discussion: any }) => (
    <GlassCard className="group cursor-pointer rounded-3xl border-white/[0.09] bg-white/[0.045] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.065] hover:shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar className="size-11 shrink-0 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] shadow-[0_0_20px_rgba(34,211,238,0.08)] sm:size-12">
          <AvatarImage src={discussion.authorAvatar} />
          <AvatarFallback>{discussion.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-cyan-100 sm:text-lg">
              {discussion.title}
            </h3>
            <Badge variant={discussion.category === 'Research' ? 'default' : 'secondary'}>
              {discussion.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-300">{discussion.author}</span>
            {discussion.isExpert && (
              <Badge className="border border-cyan-300/20 bg-cyan-300/[0.10] text-xs text-cyan-200">Expert</Badge>
            )}
            <span className="text-gray-400 text-sm">• {discussion.timeAgo}</span>
          </div>
          
          <p className="mb-4 text-sm leading-relaxed text-slate-400">{discussion.excerpt}</p>
          
          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {discussion.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                aria-label={`Like discussion by ${discussion.author}`}
                className="group inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[0.07] hover:text-cyan-200 hover:shadow-[0_8px_24px_rgba(34,211,238,0.10)] active:translate-y-0 active:scale-95"
              >
                <ThumbsUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>{discussion.likes}</span>
              </button>
              <button
                type="button"
                aria-label={`View replies to discussion by ${discussion.author}`}
                className="group inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/20 hover:bg-violet-300/[0.07] hover:text-violet-200 hover:shadow-[0_8px_24px_rgba(139,92,246,0.10)] active:translate-y-0 active:scale-95"
              >
                <MessageSquare className="size-4 transition-transform duration-300 group-hover:scale-110" />
                <span>{discussion.replies}</span>
              </button>
              <button
                type="button"
                aria-label={`Share discussion by ${discussion.author}`}
                className="group inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] p-2 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.07] hover:text-emerald-200 hover:shadow-[0_8px_24px_rgba(52,211,153,0.10)] active:translate-y-0 active:scale-95"
              >
                <Share2 className="size-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
              <button
                type="button"
                aria-label={`Bookmark discussion by ${discussion.author}`}
                className="group inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] p-2 text-slate-400 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/20 hover:bg-amber-300/[0.07] hover:text-amber-200 hover:shadow-[0_8px_24px_rgba(245,158,11,0.10)] active:translate-y-0 active:scale-95"
              >
                <Bookmark className="size-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <CosmicBackground variant="galaxy">
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-300/60">
            VYOM • PROFESSIONAL MODE
          </div>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent sm:text-4xl">
            Space Research Hub
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Collaborate, Discover, Innovate — Advancing Space Science Together
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1.5 backdrop-blur-xl sm:grid-cols-4">
              <TabsTrigger
              value="discussions"
              className="rounded-xl py-2.5 text-xs text-slate-400 transition-all data-[state=active]:bg-cyan-300/[0.10] data-[state=active]:text-cyan-200 data-[state=active]:shadow-[0_0_20px_rgba(34,211,238,0.10)] sm:text-sm"
            >
              Discussions
            </TabsTrigger>
              <TabsTrigger
              value="research"
              className="rounded-xl py-2.5 text-xs text-slate-400 transition-all data-[state=active]:bg-violet-300/[0.10] data-[state=active]:text-violet-200 data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.10)] sm:text-sm"
            >
              Research Projects
            </TabsTrigger>
              <TabsTrigger
              value="tools"
              className="rounded-xl py-2.5 text-xs text-slate-400 transition-all data-[state=active]:bg-cyan-300/[0.10] data-[state=active]:text-cyan-200 data-[state=active]:shadow-[0_0_20px_rgba(34,211,238,0.10)] sm:text-sm"
            >
              Professional Tools
            </TabsTrigger>
              <TabsTrigger
              value="achievements"
              className="rounded-xl py-2.5 text-xs text-slate-400 transition-all data-[state=active]:bg-violet-300/[0.10] data-[state=active]:text-violet-200 data-[state=active]:shadow-[0_0_20px_rgba(139,92,246,0.10)] sm:text-sm"
            >
              Achievements
            </TabsTrigger>
            </TabsList>

            <TabsContent value="discussions">
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-grow relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300/60" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 rounded-xl border-white/[0.10] bg-white/[0.045] pl-10 text-white placeholder:text-slate-600 backdrop-blur-xl transition-all focus:border-cyan-300/30 focus:bg-white/[0.07] focus:ring-cyan-300/10"
                    />
                  </div>
                  <Button variant="outline" className="h-11 rounded-xl border-white/[0.10] bg-white/[0.045] px-4 text-slate-300 hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-200">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button className="h-11 rounded-xl border border-cyan-300/20 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 font-semibold text-white shadow-[0_10px_28px_rgba(34,211,238,0.15)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.22)]">
                    Start Discussion
                  </Button>
                </div>

                {/* Featured Discussions */}
                <div>
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    <TrendingUp className="h-5 w-5 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.35)]" />
                    Featured Discussions
                  </h2>
                  <div className="space-y-4">
                    {discussions.map((discussion, index) => (
                      <motion.div
                        key={discussion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <DiscussionCard discussion={discussion} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="research">
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Active Research Projects</h2>
                  <Button className="rounded-xl border border-emerald-300/20 bg-gradient-to-r from-emerald-400/90 to-cyan-500/90 px-5 font-semibold text-white shadow-[0_10px_28px_rgba(16,185,129,0.14)] hover:-translate-y-0.5">
                    Propose Project
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {researchProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <GlassCard className="group h-full rounded-3xl border-white/[0.09] bg-white/[0.045] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300/15 hover:bg-white/[0.065] sm:p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white">{project.title}</h3>
                          <Badge 
                            variant={project.status === 'Active' ? 'default' : 'secondary'}
                            className={project.status === 'Active' ? 'bg-green-600' : ''}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        
                        <p className="mb-5 text-sm leading-relaxed text-slate-400">{project.description}</p>
                        
                        <div className="mb-5 space-y-2 rounded-2xl border border-white/[0.06] bg-black/10 p-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Organization:</span>
                            <span className="text-white font-medium">{project.organization}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Participants:</span>
                            <span className="text-white font-medium">{project.participants}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Deadline:</span>
                            <span className="text-white font-medium">{project.deadline}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Difficulty:</span>
                            <Badge variant="outline" className="text-xs">
                              {project.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button className="w-full rounded-xl" variant={project.status === 'Active' ? 'default' : 'outline'}>
                          {project.status === 'Active' ? 'Join Project' : 'Express Interest'}
                        </Button>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Professional Tools & Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tools.map((tool, index) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                    >
                      <GlassCard className="group h-full rounded-3xl border-white/[0.09] bg-white/[0.045] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.065] sm:p-6">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] shadow-[0_0_24px_rgba(34,211,238,0.10)]">
                          <tool.icon className="size-7 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]" />
                        </div>
                        <h3 className="text-white font-bold mb-2">{tool.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{tool.description}</p>
                        <Badge variant="outline" className="mb-2">
                          {tool.category}
                        </Badge>
                        <p className="text-gray-400 text-xs">{tool.usage} active</p>
                        <Button className="mt-4 w-full rounded-xl" variant="outline">
                          Launch Tool
                        </Button>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Professional Achievements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <GlassCard className={`rounded-3xl border-white/[0.09] p-5 transition-all duration-300 sm:p-6 ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-400/[0.10] via-orange-400/[0.06] to-transparent'
                          : 'bg-white/[0.025]'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                            <achievement.icon className={`size-7 ${
                            achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                          }`} />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-white font-bold text-lg mb-2">{achievement.name}</h3>
                            <p className="text-gray-300 mb-3">{achievement.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge 
                                className={`${
                                  achievement.rarity === 'Legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                  achievement.rarity === 'Epic' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                                  'bg-gradient-to-r from-green-500 to-blue-500'
                                }`}
                              >
                                {achievement.rarity}
                              </Badge>
                              {achievement.earned && (
                                <span className="text-gray-400 text-sm">
                                  Earned: {achievement.date}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-4 right-4 z-40"
        >
          <CosmicIconButton
            onClick={() => onNavigate('home')}
            size="lg"
            glow="violet"
            label="Back Home"
          >
            <span className="text-lg">⌂</span>
          </CosmicIconButton>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}