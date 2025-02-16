"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { MinimalShape } from "./minimal-shape";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

type MinimalSectionProps = {
  badge?: string;
  name?: string;
  title?: string;
  description?: string;
  isAvailable?: boolean;
};

export const MinimalSection: React.FC<MinimalSectionProps> = ({
  badge = "",
  name = "",
  title = "",
  description = "",
  isAvailable = false,
}) => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white",
        inter.className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <MinimalShape delay={0.2} size={200} className="left-[10%] top-[20%]" />
        <MinimalShape
          delay={0.4}
          size={150}
          className="right-[15%] top-[15%]"
        />
        <MinimalShape
          delay={0.3}
          size={180}
          className="left-[20%] bottom-[15%]"
        />
        <MinimalShape
          delay={0.5}
          size={120}
          className="right-[25%] bottom-[20%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {isAvailable && (
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 mb-8 md:mb-12"
            >
              <span className="text-sm text-gray-600 tracking-wide font-medium">
                {badge}
              </span>
            </motion.div>
          )}

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="text-gray-900">{name}</span>
              <br />
              <span className="text-gray-700">{title}</span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {description}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center mx-auto">
              Explore My Work
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
