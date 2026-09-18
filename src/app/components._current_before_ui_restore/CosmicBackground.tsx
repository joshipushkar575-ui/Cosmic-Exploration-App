import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CosmicBackgroundProps {
  children?: React.ReactNode;
  variant?: 'galaxy' | 'nebula' | 'deep-space' | 'kids' | 'teen' | 'adult' | 'senior';
}

export function CosmicBackground({ children, variant = 'galaxy' }: CosmicBackgroundProps) {
  const backgroundImages = {
    galaxy: "https://images.unsplash.com/photo-1677357623576-7c8aab08da22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBnYWxheHklMjBzdGFycyUyMG5lYnVsYXxlbnwxfHx8fDE3NTg4MDE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    nebula: "https://images.unsplash.com/photo-1615392030676-6c532fe0c302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBuZWJ1bGElMjBwdXJwbGUlMjBibHVlfGVufDF8fHx8MTc1ODgwMTY0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    'deep-space': "https://images.unsplash.com/photo-1657063756791-4376708a4554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHN5c3RlbSUyMHBsYW5ldHMlMjBzcGFjZXxlbnwxfHx8fDE3NTg4MDE2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    kids: "https://images.unsplash.com/photo-1633465974823-5a43265d2126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNwYWNlJTIwbmVidWxhJTIwa2lkcyUyMGZyaWVuZGx5fGVufDF8fHx8MTc1ODgwMzU5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    teen: "https://images.unsplash.com/photo-1677357623576-7c8aab08da22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBnYWxheHklMjBzdGFycyUyMG5lYnVsYXxlbnwxfHx8fDE3NTg4MDE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    adult: "https://images.unsplash.com/photo-1677357623576-7c8aab08da22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBnYWxheHklMjBzdGFycyUyMG5lYnVsYXxlbnwxfHx8fDE3NTg4MDE2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    senior: "https://images.unsplash.com/photo-1657063756791-4376708a4554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHN5c3RlbSUyMHBsYW5ldHMlMjBzcGFjZXxlbnwxfHx8fDE3NTg4MDE2NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImages[variant]})` }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}