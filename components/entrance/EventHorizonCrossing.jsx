// Event Horizon Crossing — Scroll/tap triggers inward fall transition
// Creates the sensation of falling inward, not clicking forward

import { useState, useEffect, useCallback, useRef } from 'react';

export function useEventHorizonCrossing({ onCross, enabled = true }) {
  const [crossingProgress, setCrossingProgress] = useState(0);
  const [isCrossing, setIsCrossing] = useState(false);
  const scrollAccumulator = useRef(0);
  const touchStartY = useRef(null);

  const initiateCrossing = useCallback(() => {
    if (!enabled || isCrossing) return;
    
    setIsCrossing(true);
    
    // Animate crossing over 2.5 seconds
    const duration = 2500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: slow start, accelerate (like falling into gravity well)
      const eased = progress * progress * (3 - 2 * progress);
      setCrossingProgress(eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Crossing complete
        setTimeout(() => {
          onCross?.();
        }, 300);
      }
    };
    
    requestAnimationFrame(animate);
  }, [enabled, isCrossing, onCross]);

  useEffect(() => {
    if (!enabled) return;

    // Scroll detection (accumulate scroll to trigger)
    const handleWheel = (e) => {
      if (isCrossing) return;
      
      scrollAccumulator.current += Math.abs(e.deltaY);
      
      // Trigger after 300px of accumulated scroll
      if (scrollAccumulator.current > 300) {
        initiateCrossing();
      }
      
      // Reset accumulator after 1 second of no scrolling
      setTimeout(() => {
        scrollAccumulator.current = 0;
      }, 1000);
    };

    // Touch swipe detection
    const handleTouchStart = (e) => {
      if (isCrossing) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (isCrossing || touchStartY.current === null) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      
      // Trigger on significant swipe up (150px)
      if (Math.abs(deltaY) > 150) {
        initiateCrossing();
        touchStartY.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    // Keyboard shortcut (Space or Enter)
    const handleKeyDown = (e) => {
      if (isCrossing) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        initiateCrossing();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, isCrossing, initiateCrossing]);

  return {
    crossingProgress,
    isCrossing,
    initiateCrossing,
  };
}

// Visual component that renders the crossing effect
export function EventHorizonCrossingOverlay({ progress }) {
  if (progress === 0) return null;

  // Rings expand outward and fade
  const ringScale = 1 + progress * 2;
  const ringOpacity = 1 - progress;

  // Center darkens (event horizon deepens)
  const centerDarkness = progress * 0.95;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Center darkness (event horizon) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vmax',
          height: '100vmax',
          background: `radial-gradient(circle at center, 
            rgba(0,0,0,${centerDarkness}) 0%, 
            rgba(0,0,0,${centerDarkness * 0.8}) 30%, 
            transparent 70%)`,
        }}
      />

      {/* Expanding ring effect */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          width: '80vmin',
          height: '80vmin',
          border: `2px solid rgba(255, 210, 140, ${ringOpacity * 0.3})`,
          borderRadius: '50%',
          opacity: ringOpacity,
        }}
      />

      {/* Secondary expanding ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${ringScale * 1.2})`,
          width: '80vmin',
          height: '80vmin',
          border: `1px solid rgba(255, 210, 140, ${ringOpacity * 0.15})`,
          borderRadius: '50%',
          opacity: ringOpacity * 0.6,
        }}
      />
    </div>
  );
}
