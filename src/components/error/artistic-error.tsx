"use client";

import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { AbstractShape } from "../landing/abstract-shape";
import { ErrorComponentProps } from "@/types/theme";
import { ErrorThemeSwitcher } from "../ui/error-theme-switcher";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
});

export const ArtisticError: React.FC<ErrorComponentProps> = ({
  message,
  onRetry,
  onSwitchTheme,
  currentTheme,
}) => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1a0b2e]">
      <ErrorThemeSwitcher
        currentTheme={currentTheme}
        onSwitchTheme={onSwitchTheme}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b]/[0.15] via-transparent to-[#4ecdc4]/[0.15] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <AbstractShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#ff6b6b]/[0.3]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <AbstractShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#4ecdc4]/[0.3]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <AbstractShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#f7b733]/[0.3]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b6b]/[0.2] border border-[#ff6b6b]/[0.3] mb-8 md:mb-12"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff6b6b] animate-pulse" />
            <span className="text-sm text-[#ff6b6b] tracking-wide font-serif">
              Error
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b6b] via-[#feca57] to-[#4ecdc4]",
                  playfairDisplay.className
                )}
              >
                Something went wrong
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-[#f7f1e3]/70 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {message}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-transparent border-2 border-[#ff6b6b] text-[#ff6b6b] rounded-md hover:bg-[#ff6b6b]/10 transition-colors duration-300 font-serif inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-[#1a0b2e]/80 pointer-events-none" />
    </div>
  );
};
