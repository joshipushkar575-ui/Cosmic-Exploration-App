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
    <GlassCard className="p-6 hover:bg-white/10 transition-colors cursor-pointer">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={discussion.authorAvatar} />
          <AvatarFallback>{discussion.author.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-bold text-lg">{discussion.title}</h3>
            <Badge variant={discussion.category === 'Research' ? 'default' : 'secondary'}>
              {discussion.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-300">{discussion.author}</span>
            {discussion.isExpert && (
              <Badge className="bg-blue-600 text-xs">Expert</Badge>
            )}
            <span className="text-gray-400 text-sm">• {discussion.timeAgo}</span>
          </div>
          
          <p className="text-gray-300 mb-3">{discussion.excerpt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {discussion.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-gray-400">
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>{discussion.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>{discussion.replies}</span>
              </button>
              <button className="hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="hover:text-white transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <CosmicBackground variant="galaxy">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Space Research Hub</h1>
          <p className="text-gray-300">Collaborate, Discover, Innovate - Advancing Space Science Together</p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="research">Research Projects</TabsTrigger>
              <TabsTrigger value="tools">Professional Tools</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions">
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="flex gap-4">
                  <div className="flex-grow relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Start Discussion
                  </Button>
                </div>

                {/* Featured Discussions */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
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
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Active Research Projects</h2>
                  <Button className="bg-green-600 hover:bg-green-700">
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
                      <GlassCard className="p-6 h-full">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white">{project.title}</h3>
                          <Badge 
                            variant={project.status === 'Active' ? 'default' : 'secondary'}
                            className={project.status === 'Active' ? 'bg-green-600' : ''}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 mb-4">{project.description}</p>
                        
                        <div className="space-y-3 mb-4">
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
                          <p className="text-gray-400 text-sm mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Button className="w-full" variant={project.status === 'Active' ? 'default' : 'outline'}>
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
                <h2 className="text-2xl font-bold text-white">Professional Tools & Resources</h2>
                
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
                      <GlassCard className="p-6 text-center h-full">
                        <tool.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-white font-bold mb-2">{tool.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{tool.description}</p>
                        <Badge variant="outline" className="mb-2">
                          {tool.category}
                        </Badge>
                        <p className="text-gray-400 text-xs">{tool.usage} active</p>
                        <Button className="w-full mt-4" variant="outline">
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
                <h2 className="text-2xl font-bold text-white">Professional Achievements</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <GlassCard className={`p-6 ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
                          : 'bg-gray-500/20'
                      }`}>
                        <div className="flex items-start gap-4">
                          <achievement.icon className={`w-12 h-12 ${
                            achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                          }`} />
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