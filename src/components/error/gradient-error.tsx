"use client";

import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { GradientSpotlight } from "../landing/gradient-spotlight";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

type GradientErrorProps = {
  message: string;
  onRetry: () => void;
  onSwitchTheme: () => void;
};

export const GradientError: React.FC<GradientErrorProps> = ({
  message,
  onRetry,
  onSwitchTheme,
}) => {
  return (
    <section
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black",
        spaceGrotesk.variable
      )}
    >
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg transition-colors bg-purple-500 text-white`}
        >
          Gradient
        </button>
        <button
          onClick={() => onSwitchTheme()}
          className={`px-4 py-2 rounded-lg transition-colors bg-zinc-800 text-zinc-300`}
        >
          Geometric
        </button>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black" />

      <GradientSpotlight
        className="top-20 -left-20 bg-purple-500/30"
        size={300}
        delay={0.2}
      />
      <GradientSpotlight
        className="bottom-20 -right-20 bg-cyan-500/30"
        size={300}
        delay={0.4}
      />
      <GradientSpotlight
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/30"
        size={500}
        delay={0.6}
      />

      <div className="relative z-10 container mx-auto px-4 py-16 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-zinc-400 font-mono">Error</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500"
          >
            Something went wrong
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            {message}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={onRetry}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Try Again
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
    </section>
  );
};
