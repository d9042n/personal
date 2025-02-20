"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
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
import { MinimalShape } from "./minimal-shape";
import { useRouter } from "next/navigation";

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

export const MinimalSection: React.FC<MinimalSectionProps> = ({
  badge = "",
  name = "",
  title = "",
  description = "",
  isAvailable = false,
  socialLinks = {},
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

  const router = useRouter();

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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
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
                className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                title="Dev.to"
              >
                <PenTool className="w-6 h-6" />
              </a>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            onClick={() => router.push("/login")}
            className="mt-8 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
          >
            Make Your Own
          </motion.button>
        </div>
      </div>
    </div>
  );
};
