import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedBlockProps {
  children: React.ReactNode;
  className?: string;
  animationType?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'rotate';
  delay?: number;
}

export function AnimatedBlock({ 
  children, 
  className = '', 
  animationType = 'fade-up',
  delay = 0 
}: AnimatedBlockProps) {
  const { elementRef } = useScrollAnimation();

  const getAnimationClass = () => {
    switch (animationType) {
      case 'fade-left':
        return 'animate-on-scroll-fade-left';
      case 'fade-right':
        return 'animate-on-scroll-fade-right';
      case 'scale':
        return 'animate-on-scroll-scale';
      case 'rotate':
        return 'animate-on-scroll-rotate';
      default:
        return 'animate-on-scroll';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
} 