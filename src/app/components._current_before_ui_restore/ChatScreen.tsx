import { supabase } from "../../lib/supabase";
import { useAstronomy } from '../hooks/useAstronomy';
import { useAstronomicalEvents } from '../hooks/useAstronomicalEvents';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { CosmicIconButton } from './CosmicIconButton';
import { Input } from './ui/input';
import { GlassCard } from './GlassCard';
import { CosmicBackground } from './CosmicBackground';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User, 
  Sparkles,
  Globe,
  Telescope,
  Rocket
} from 'lucide-react';

interface ChatScreenProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatScreen({ onNavigate }: ChatScreenProps) {
  const { planets, sun, moon, location, lastUpdated } = useAstronomy();
  const { events } = useAstronomicalEvents();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm VYOM AI, your cosmic exploration assistant. I can help you learn about space, planets, stars, and the universe. What would you like to explore today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');

  const suggestions = [
    { text: 'Explore Planets', icon: Globe },
    { text: 'Learn Astronomy', icon: Telescope },
    { text: 'Space-Time Travel', icon: Rocket },
  ];

  const handleSendMessage = async () => {
    const messageText = inputText.trim();

    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const { data, error } = await supabase.functions.invoke('vyom-ai', {
        body: {
          message: messageText,
          messages: [...messages, userMessage].map(message => ({
            role: message.sender === 'user' ? 'user' : 'assistant',
            content: message.text
          })),
          astronomy: {
            location,
            lastUpdated,
            sun,
            moon,
            planets,
            events
          }
        }
      });

      if (error) {
        throw error;
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data?.message || 'VYOM AI did not return a response.',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('VYOM AI request failed:', error);

      let errorText = error instanceof Error ? error.message : String(error);

      try {
        const context = (error as { context?: Response })?.context;

        if (context) {
          const body = await context.clone().json();
          errorText = body?.details || body?.error || errorText;
        }
      } catch {
        // Keep the original error message if the response body is not JSON.
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `VYOM AI error: ${errorText}`,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <CosmicBackground variant="nebula">
      <div className="min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <CosmicIconButton
            onClick={() => onNavigate('home')}
            size="md"
            glow="violet"
            label="Back to home"
            className="mr-3"
          >
            <ArrowLeft />
          </CosmicIconButton>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-400/20 blur-lg" />
              <div className="relative flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-violet-500/30 via-slate-900/80 to-cyan-400/20 shadow-[0_0_30px_rgba(139,92,246,0.18)] backdrop-blur-xl">
                <Bot className="size-5 text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]" />
                <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="bg-gradient-to-r from-white via-violet-100 to-cyan-200 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  VYOM AI
                </h1>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cosmic intelligence · Explore the universe
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-400 backdrop-blur-xl sm:flex">
            <Sparkles className="size-3 text-violet-300" />
            AI Explorer
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard
            className="relative h-[calc(100vh-200px)] min-h-[520px] overflow-hidden rounded-3xl border-white/[0.14] bg-slate-950/45 shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_50px_rgba(139,92,246,0.08)]"
            intensity="strong"
          >
            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 sm:p-5">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-violet-500 to-cyan-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <GlassCard 
                      className={`relative rounded-2xl p-3.5 ${
                        message.sender === 'user'
                          ? 'border-blue-300/15 bg-gradient-to-br from-blue-500/15 via-violet-500/10 to-transparent'
                          : 'border-cyan-300/10 bg-white/[0.055]'
                      }`}
                      glow={message.sender === 'ai'}
                    >
                      <div className="text-white text-sm leading-relaxed prose prose-invert max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <div className="mb-5 mt-1 rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-violet-500/15 via-cyan-500/10 to-transparent px-4 py-3">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {children}
          </h1>
        </div>
      ),

      h2: ({ children }) => (
        <div className="flex items-center gap-2 mt-5 mb-3 pb-2 border-b border-white/10">
          <h2 className="text-base sm:text-lg font-semibold text-cyan-300 tracking-wide">
            {children}
          </h2>
        </div>
      ),

      h3: ({ children }) => (
        <h3 className="text-base font-semibold text-violet-300 mt-4 mb-2">
          {children}
        </h3>
      ),

      p: ({ children }) => (
        <p className="mb-3 last:mb-0 text-white/90 leading-7">
          {children}
        </p>
      ),

      ul: ({ children }) => (
        <ul className="my-3 ml-1 space-y-2 list-none">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="my-3 ml-1 space-y-3 list-none counter-reset-recommendation">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="relative rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-white/90 leading-6">
          {children}
        </li>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-white">
          {children}
        </strong>
      ),

      em: ({ children }) => (
        <em className="text-cyan-200/90">
          {children}
        </em>
      ),

      blockquote: ({ children }) => (
        <blockquote className="my-3 border-l-2 border-cyan-400/60 bg-cyan-400/5 rounded-r-xl px-4 py-3 text-white/80">
          {children}
        </blockquote>
      ),

      hr: () => (
        <hr className="my-5 border-white/10" />
      ),

      table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20">
          <table className="w-full min-w-[620px] text-left border-collapse">
            {children}
          </table>
        </div>
      ),

      thead: ({ children }) => (
        <thead className="bg-gradient-to-r from-violet-500/20 to-cyan-500/15">
          {children}
        </thead>
      ),

      th: ({ children }) => (
        <th className="border-b border-white/15 px-3 py-2.5 text-xs sm:text-sm font-semibold text-cyan-200 whitespace-nowrap">
          {children}
        </th>
      ),

      tbody: ({ children }) => (
        <tbody className="divide-y divide-white/10">
          {children}
        </tbody>
      ),

      tr: ({ children }) => (
        <tr className="transition-colors hover:bg-white/[0.05]">
          {children}
        </tr>
      ),

      td: ({ children }) => (
        <td className="px-3 py-2.5 text-xs sm:text-sm text-white/85 whitespace-nowrap">
          {children}
        </td>
      ),

      code: ({ children }) => (
        <code className="rounded-md bg-black/30 px-1.5 py-0.5 text-cyan-200 text-xs">
          {children}
        </code>
      ),
    }}
  >
    {message.text}
  </ReactMarkdown>
</div>
                      <p className={`mt-1 px-1 text-[10px] tracking-wide ${
                        message.sender === 'user' ? 'text-right text-slate-500' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </GlassCard>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="border-t border-white/[0.08] bg-slate-950/25 p-4 backdrop-blur-xl sm:p-5">
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.text}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="group flex items-center gap-2 rounded-full border border-white/[0.11] bg-white/[0.045] px-3.5 py-2 text-xs font-medium text-slate-300 shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-300/[0.08] hover:text-white hover:shadow-[0_8px_24px_rgba(139,92,246,0.12)] flex-shrink-0"
                  >
                    <suggestion.icon className="w-3.5 h-3.5 text-cyan-300 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-200" />
                    {suggestion.text}
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about the cosmos..."
                  className="h-11 flex-1 rounded-2xl border-white/[0.14] bg-white/[0.045] px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_6px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl placeholder:text-slate-500 transition-all duration-300 hover:border-white/[0.20] hover:bg-white/[0.06] focus-visible:border-cyan-300/35 focus-visible:ring-2 focus-visible:ring-cyan-300/10"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    aria-label="Send message"
                    title="Send message"
                    className="size-11 rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-violet-500 via-violet-500 to-cyan-400 text-white shadow-[0_8px_28px_rgba(139,92,246,0.22),0_0_22px_rgba(34,211,238,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-400 hover:to-cyan-300 hover:shadow-[0_12px_34px_rgba(139,92,246,0.30)] active:translate-y-0 active:scale-95"
                  >
                    <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}