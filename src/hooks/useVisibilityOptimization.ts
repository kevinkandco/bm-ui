import { useEffect, useState, useCallback } from 'react';

export const useVisibilityOptimization = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const shouldAnimate = isVisible && !reduceMotion;

  return { 
    isVisible, 
    reduceMotion, 
    shouldAnimate 
  };
};