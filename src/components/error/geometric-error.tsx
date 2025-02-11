"use client";

import { motion } from "framer-motion";
import { Fira_Code } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { GeometricSpotlight } from "../landing/geometric-spotlight";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fira-code",
});

type GeometricErrorProps = {
  message: string;
  onRetry: () => void;
  onSwitchTheme: () => void;
};

export const GeometricError: React.FC<GeometricErrorProps> = ({
  message,
  onRetry,
  onSwitchTheme,
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a192f]">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={onSwitchTheme}
          className="px-4 py-2 rounded-lg transition-colors bg-zinc-800 text-zinc-300"
        >
          Gradient
        </button>
        <button className="px-4 py-2 rounded-lg transition-colors bg-[#64ffda] text-[#0a192f]">
          Geometric
        </button>
        <button
          onClick={onSwitchTheme}
          className="px-4 py-2 rounded-lg transition-colors bg-zinc-800 text-zinc-300"
        >
          Minimal
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#112240]/[0.05] via-transparent to-[#64ffda]/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <GeometricSpotlight
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-[#112240]/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112240]/[0.3] border border-[#64ffda]/[0.3] mb-8 md:mb-12"
          >
            <div className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
            <span className="text-sm text-[#64ffda] tracking-wide font-mono">
              Error
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] via-[#ccd6f6] to-[#64ffda]",
              firaCode.className
            )}
          >
            Something went wrong
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl text-[#8892b0] mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4"
          >
            {message}
          </motion.p>

          <motion.button
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            onClick={onRetry}
            className="px-6 py-3 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda]/10 transition-colors duration-300 font-mono inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try Again
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-[#0a192f]/80 pointer-events-none" />
    </div>
  );
};
