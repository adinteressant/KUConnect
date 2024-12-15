import { useState, useEffect } from 'react';

export function useAnimation(duration = 300) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration]);

  const triggerAnimation = () => setIsAnimating(true);

  return [isAnimating, triggerAnimation];
}

