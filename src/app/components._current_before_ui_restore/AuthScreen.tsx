import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { GlassCard } from './GlassCard';
import { CosmicBackground } from './CosmicBackground';
import { Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const age = Number(metadata.age);

        localStorage.setItem('userData', JSON.stringify({
          name: metadata.name || formData.email.split('@')[0],
          email: data.user.email || formData.email,
          age: Number.isFinite(age) ? age : 18
        }));

        onAuthComplete();
      }
    } else {
      const age = parseInt(formData.age, 10);

      if (!formData.name || !formData.email || !formData.password || !age) {
        alert('Please fill all fields.');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            age: age
          }
        }
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user && data.session) {
        localStorage.setItem('userData', JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: age
        }));

        onAuthComplete();
      } else {
        alert('Account created! Please check your email and verify your account before logging in.');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <CosmicBackground variant="nebula">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <GlassCard className="relative overflow-hidden rounded-3xl border-white/[0.16] bg-slate-950/55 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_50px_rgba(139,92,246,0.10)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_38%)]" glow intensity="strong">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="group relative mb-4 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-cyan-200/30 bg-[radial-gradient(circle_at_35%_25%,rgba(34,211,238,0.32),transparent_35%),linear-gradient(135deg,rgba(139,92,246,0.38),rgba(15,23,42,0.82),rgba(34,211,238,0.22))] shadow-[0_0_34px_rgba(56,189,248,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-cyan-200/50 hover:shadow-[0_0_48px_rgba(139,92,246,0.28)] before:pointer-events-none before:absolute before:inset-1 before:rounded-xl before:border before:border-white/15 after:pointer-events-none after:absolute after:-inset-6 after:rounded-full after:bg-cyan-300/10 after:blur-2xl after:transition-opacity after:duration-500 group-hover:after:opacity-80"
              >
                <Sparkles className="relative z-10 h-8 w-8 text-cyan-100 drop-shadow-[0_0_12px_rgba(103,232,249,0.75)] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              </motion.div>
              <h1 className="mb-2 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-3xl font-bold tracking-[0.18em] text-transparent drop-shadow-[0_0_18px_rgba(139,92,246,0.20)]">VYOM</h1>
              <p className="text-sm tracking-wide text-slate-300/80">Your window to the universe</p>
            </div>

            {/* Auth Toggle */}
            <div className="mb-6 flex rounded-2xl border border-white/[0.12] bg-black/20 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.20)] backdrop-blur-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-300 border ${
                  isLogin 
                    ? 'bg-gradient-to-r from-violet-500/30 via-blue-500/20 to-cyan-400/25 text-white border-violet-300/30 shadow-[0_0_22px_rgba(139,92,246,0.12)]' 
                    : 'border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-300 border ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-violet-500/30 via-blue-500/20 to-cyan-400/25 text-white border-violet-300/30 shadow-[0_0_22px_rgba(139,92,246,0.12)]' 
                    : 'border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label className="text-xs font-medium uppercase tracking-[0.08em] text-slate-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-cyan-300/65 drop-shadow-[0_0_8px_rgba(34,211,238,0.35)] transition-all duration-300" />
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-11 pl-10 rounded-xl border border-white/[0.14] bg-white/[0.045] text-white placeholder:text-gray-500 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:border-white/[0.20] hover:bg-white/[0.055] focus:border-cyan-300/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-300/10 focus:shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-[0.08em] text-slate-300">Age</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-violet-300/70 drop-shadow-[0_0_8px_rgba(139,92,246,0.35)] transition-all duration-300" />
                      <Select 
                        value={formData.age} 
                        onValueChange={(value) => handleInputChange('age', value)}
                        required={!isLogin}
                      >
                        <SelectTrigger className="h-11 pl-10 rounded-xl border border-white/[0.14] bg-white/[0.045] text-white backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.2] focus:border-cyan-300/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-300/10 focus:shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                          <SelectValue placeholder="Select your age" />
                        </SelectTrigger>
                        <SelectContent className="overflow-hidden rounded-xl border border-white/[0.14] bg-slate-950/90 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_30px_rgba(139,92,246,0.10)] backdrop-blur-2xl">
                          {Array.from({ length: 80 }, (_, i) => i + 1).map((age) => (
                            <SelectItem key={age} value={age.toString()} className="cursor-pointer rounded-lg text-white/80 transition-all duration-200 hover:bg-violet-400/[0.12] hover:text-white focus:bg-cyan-400/[0.12] focus:text-white data-[state=checked]:bg-violet-400/[0.16] data-[state=checked]:text-white">
                              {age} years old
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-[0.08em] text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-cyan-300/65 drop-shadow-[0_0_8px_rgba(34,211,238,0.35)] transition-all duration-300" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="h-11 pl-10 rounded-xl border border-white/[0.14] bg-white/[0.045] text-white placeholder:text-gray-500 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:border-white/[0.20] hover:bg-white/[0.055] focus:border-cyan-300/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-300/10 focus:shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-[0.08em] text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-cyan-300/65 drop-shadow-[0_0_8px_rgba(34,211,238,0.35)] transition-all duration-300" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-11 pl-10 pr-11 rounded-xl border border-white/[0.14] bg-white/[0.045] text-white placeholder:text-gray-500 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:border-white/[0.20] hover:bg-white/[0.055] focus:border-cyan-300/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-cyan-300/10 focus:shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="group absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/[0.06] text-slate-400 transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[0.07] hover:text-cyan-200 hover:shadow-[0_0_16px_rgba(34,211,238,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/25"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="group relative h-12 w-full overflow-hidden rounded-xl border border-cyan-200/25 bg-gradient-to-r from-violet-500/85 via-blue-500/75 to-cyan-400/85 px-5 text-white shadow-[0_0_28px_rgba(56,189,248,0.16),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-100/45 hover:from-violet-500/90 hover:via-blue-500/80 hover:to-cyan-400/90 hover:shadow-[0_0_38px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.22)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/30 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:group-hover:translate-x-1"
                >
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400/90">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 rounded-md px-1.5 py-0.5 text-violet-300 transition-all duration-300 hover:bg-violet-300/[0.07] hover:text-cyan-200 hover:shadow-[0_0_16px_rgba(139,92,246,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/25"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </CosmicBackground>
  );
}