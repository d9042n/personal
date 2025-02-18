"use client";

import { motion } from "framer-motion";
import { Playfair_Display, Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { ArtisticShape } from "./artistic-shape";
import {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  FileCode2, // for LeetCode
  Code2, // for HackerRank
  BookOpen, // for Medium
  MessageSquare, // for Stack Overflow
  Globe, // for Portfolio
  PenTool, // for Dev.to
} from "lucide-react";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

type ArtisticSectionProps = {
  badge?: string;
  name?: string;
  title?: string;
  description?: string;
  isAvailable?: boolean;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    leetcode?: string;
    hackerrank?: string;
    medium?: string;
    stackoverflow?: string;
    portfolio?: string;
    youtube?: string;
    devto?: string;
  };
};

export const ArtisticSection: React.FC<ArtisticSectionProps> = ({
  badge = "",
  name = "",
  title = "",
  description = "",
  isAvailable = false,
  socialLinks = {},
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
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#1a0b2e]",
        montserrat.variable
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#7928ca]/[0.15] via-transparent to-[#ff0080]/[0.15] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ArtisticShape
          delay={0.3}
          width={300}
          height={300}
          rotate={12}
          gradient="from-[#7928ca]/[0.3]"
          className="left-[-5%] md:left-[5%] top-[15%] md:top-[20%]"
        />
        <ArtisticShape
          delay={0.5}
          width={250}
          height={250}
          rotate={-15}
          gradient="from-[#ff0080]/[0.3]"
          className="right-[-5%] md:right-[5%] top-[60%] md:top-[65%]"
        />
        <ArtisticShape
          delay={0.4}
          width={200}
          height={200}
          rotate={-8}
          gradient="from-[#00d4ff]/[0.3]"
          className="left-[10%] md:left-[15%] bottom-[10%] md:bottom-[15%]"
        />
        <ArtisticShape
          delay={0.6}
          width={150}
          height={150}
          rotate={20}
          gradient="from-[#ff4d4d]/[0.3]"
          className="right-[20%] md:right-[25%] top-[5%] md:top-[10%]"
        />
        <ArtisticShape
          delay={0.7}
          width={100}
          height={100}
          rotate={-25}
          gradient="from-[#f9cb28]/[0.3]"
          className="left-[25%] md:left-[30%] top-[10%] md:top-[15%]"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8 md:mb-12"
            >
              <span className="text-sm text-[#f9cb28] tracking-wide font-semibold">
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
            <h1
              className={cn(
                "text-5xl sm:text-7xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight",
                playfairDisplay.variable,
                playfairDisplay.className
              )}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {name}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7928ca] via-[#ff0080] to-[#ff4d4d]">
                {title}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/60 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 flex flex-wrap gap-6 justify-center"
          >
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {socialLinks.leetcode && (
              <a
                href={socialLinks.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="LeetCode"
              >
                <FileCode2 className="w-6 h-6" />
              </a>
            )}
            {socialLinks.hackerrank && (
              <a
                href={socialLinks.hackerrank}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="HackerRank"
              >
                <Code2 className="w-6 h-6" />
              </a>
            )}
            {socialLinks.medium && (
              <a
                href={socialLinks.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="Medium"
              >
                <BookOpen className="w-6 h-6" />
              </a>
            )}
            {socialLinks.stackoverflow && (
              <a
                href={socialLinks.stackoverflow}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="Stack Overflow"
              >
                <MessageSquare className="w-6 h-6" />
              </a>
            )}
            {socialLinks.portfolio && (
              <a
                href={socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="Portfolio"
              >
                <Globe className="w-6 h-6" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            )}
            {socialLinks.devto && (
              <a
                href={socialLinks.devto}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff6b6b] transition-colors duration-300"
                title="Dev.to"
              >
                <PenTool className="w-6 h-6" />
              </a>
            )}
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-[#1a0b2e]/80 pointer-events-none" />
    </div>
  );
};
