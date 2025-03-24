"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type ArtisticShapeProps = {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
};

export const ArtisticShape: React.FC<ArtisticShapeProps> = ({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipPathValue = "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";
  
  // Enhanced repaint strategy
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial force repaint immediately
    containerRef.current.classList.add("force-repaint");
    
    // Create frequent repaints during animation phase
    const animationDuration = 2400; // 2.4 seconds in ms
    const repaintFrequency = 50; // repaint every 50ms during critical animation
    const repaints = [];
    
    // Generate more frequent repaints at the start (critical period)
    for (let i = 0; i <= 500; i += 25) {
      repaints.push(
        setTimeout(() => {
          if (containerRef.current) {
            // Force redraw
            containerRef.current.style.display = 'none';
            containerRef.current.offsetHeight;
            containerRef.current.style.display = '';
          }
        }, i)
      );
    }
    
    // Generate regular repaints for the rest of the animation
    for (let i = 500; i <= animationDuration; i += repaintFrequency) {
      repaints.push(
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
            containerRef.current.offsetHeight;
            containerRef.current.style.display = '';
          }
        }, i)
      );
    }
    
    // Add a few more repaints after animation completes
    [2500, 3000, 3500].forEach(time => {
      repaints.push(
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
            containerRef.current.offsetHeight;
            containerRef.current.style.display = '';
          }
        }, time)
      );
    });
    
    return () => {
      repaints.forEach(clearTimeout);
    };
  }, []);

  // Specific selector for higher CSS specificity
  const clipPathStyle = `
    /* Preload the clip-path to ensure it's ready before animations */
    @keyframes preloadClipPath {
      0% { clip-path: ${clipPathValue}; }
      100% { clip-path: ${clipPathValue}; }
    }
    
    /* Main persistent animation */
    @keyframes persistClipPath {
      0%, 100% { clip-path: ${clipPathValue}; }
    }
    
    /* Apply to our specific class with high specificity */
    div.artistic-shape-container.artistic-pentagon {
      clip-path: ${clipPathValue};
      animation: preloadClipPath 0.1ms 1, persistClipPath 1s infinite;
    }
    
    .force-repaint {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
      -webkit-backface-visibility: hidden;
      -webkit-perspective: 1000;
    }
  `;

  return (
    <>
      <style jsx global>{clipPathStyle}</style>
      
      {/* Outer positioning container */}
      <div 
        className={cn("absolute", className)}
        style={{ width, height }}
      >
        {/* Middle container with clip-path and rotation animation */}
        <motion.div
          ref={containerRef}
          className={cn(
            "absolute inset-0 artistic-shape-container artistic-pentagon"
          )}
          style={{
            clipPath: clipPathValue,
            zIndex: 10,
          }}
          // Continuous rotation animation
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {/* Styled content */}
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-r to-transparent",
              gradient,
              "backdrop-blur-[2px] border-4 border-white/[0.15]",
              "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
              "after:absolute after:inset-0",
              "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
              "will-change-[transform,opacity]"
            )}
          />
        </motion.div>
        
        {/* Initial animations (opacity, scale) */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
            rotate: rotate - 15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: rotate,
          }}
          transition={{
            duration: 2.4,
            delay,
            ease: [0.23, 0.86, 0.39, 0.96],
            opacity: { duration: 1.2 },
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>
    </>
  );
};
