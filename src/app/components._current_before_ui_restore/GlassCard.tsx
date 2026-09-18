import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  intensity?: 'light' | 'medium' | 'strong';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = '',
  glow = false,
  intensity = 'medium',
  onClick,
}: GlassCardProps) {
  const intensityClasses = {
    light: [
      'bg-white/[0.045]',
      'backdrop-blur-md',
      'border-white/[0.10]',
    ].join(' '),

    medium: [
      'bg-white/[0.065]',
      'backdrop-blur-xl',
      'border-white/[0.14]',
    ].join(' '),

    strong: [
      'bg-white/[0.09]',
      'backdrop-blur-2xl',
      'border-white/[0.20]',
    ].join(' '),
  };

  const glowClass = glow
    ? [
        'border-violet-400/30',
        'shadow-[0_0_35px_rgba(139,92,246,0.14)]',
      ].join(' ')
    : '';

  return (
    <div
      onClick={onClick}
      className={[
        'group relative overflow-hidden',
        'border rounded-2xl',
        'transition-all duration-300 ease-out',
        'shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
        'before:pointer-events-none before:absolute before:inset-0',
        'before:bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.10),transparent_32%)]',
        'before:opacity-60',
        'after:pointer-events-none after:absolute after:inset-0',
        'after:rounded-[inherit]',
        'after:border after:border-white/[0.04]',
        'hover:border-white/[0.20]',
        'hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)]',
        onClick ? 'cursor-pointer hover:-translate-y-[1px] active:translate-y-0' : '',
        intensityClasses[intensity],
        glowClass,
        className,
      ].join(' ')}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
