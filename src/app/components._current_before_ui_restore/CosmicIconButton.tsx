import * as React from 'react';
import { cn } from './ui/utils';

interface CosmicIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  glow?: 'cyan' | 'violet' | 'none';
  label: string;
}

export function CosmicIconButton({
  children,
  size = 'md',
  glow = 'cyan',
  label,
  className,
  type = 'button',
  ...props
}: CosmicIconButtonProps) {
  const sizeClasses = {
    sm: 'size-8 rounded-lg [&_svg]:size-3.5',
    md: 'size-10 rounded-xl [&_svg]:size-4',
    lg: 'size-12 rounded-2xl [&_svg]:size-5',
  };

  const glowClasses = {
    cyan: [
      'hover:border-cyan-300/35',
      'hover:bg-cyan-300/[0.08]',
      'hover:shadow-[0_0_24px_rgba(34,211,238,0.16)]',
    ].join(' '),

    violet: [
      'hover:border-violet-300/35',
      'hover:bg-violet-300/[0.08]',
      'hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]',
    ].join(' '),

    none: [
      'hover:border-white/20',
      'hover:bg-white/[0.08]',
    ].join(' '),
  };

  return (
    <button
      {...props}
      type={type}
      aria-label={label}
      title={props.title ?? label}
      className={cn(
        'group relative inline-flex shrink-0 items-center justify-center',
        'border border-white/[0.12]',
        'bg-white/[0.045]',
        'backdrop-blur-xl',
        'text-white/70',
        'shadow-[0_6px_24px_rgba(0,0,0,0.16)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5 hover:text-white',
        'active:translate-y-0 active:scale-95',
        'focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-cyan-300/35',
        'disabled:pointer-events-none disabled:opacity-40',
        'before:pointer-events-none before:absolute before:inset-[1px]',
        'before:rounded-[inherit]',
        'before:bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.14),transparent_45%)]',
        'before:opacity-70',
        'before:transition-opacity',
        'hover:before:opacity-100',
        sizeClasses[size],
        glowClasses[glow],
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {children}
      </span>
    </button>
  );
}
