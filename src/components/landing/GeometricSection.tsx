"use client";

import { motion } from "framer-motion";
import { Fira_Code } from "next/font/google";
import { cn } from "@/lib/utils";
import { GeometricSpotlight } from "./geometric-spotlight";
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
import { useRouter } from "next/navigation";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fira-code",
});

type GeometricSectionProps = {
  badge?: string;
  name?: string;
  title?: string;
  description?: string;
  isAvailable?: boolean;
  socialLinks: {
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

export const GeometricSection: React.FC<GeometricSectionProps> = ({
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

  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a192f]">
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

        <GeometricSpotlight
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-[#64ffda]/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <GeometricSpotlight
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#233554]/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <GeometricSpotlight
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-[#8892b0]/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <GeometricSpotlight
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-[#ccd6f6]/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
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
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#112240]/[0.3] border border-[#64ffda]/[0.3] mb-8 md:mb-12"
            >
              <div className="w-2 h-2 rounded-full bg-[#64ffda] animate-pulse" />
              <span className="text-sm text-[#64ffda] tracking-wide font-mono">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#ccd6f6] to-[#8892b0]">
                {name}
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] via-[#ccd6f6] to-[#64ffda]",
                  firaCode.className
                )}
              >
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
            <p className="text-base sm:text-lg md:text-xl text-[#8892b0] mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
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
                className="text-[#8892b0] hover:text-[#64ffda] transition-colors duration-300"
                title="Dev.to"
              >
                <PenTool className="w-6 h-6" />
              </a>
            )}
          </motion.div>

          <motion.button
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            onClick={() => router.push("/login?theme=geometric")}
            className="mt-8 px-6 py-3 bg-transparent border-2 border-[#64ffda] text-[#64ffda] rounded-md hover:bg-[#64ffda]/10 transition-colors duration-300 font-mono"
          >
            Make Your Own
          </motion.button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-[#0a192f]/80 pointer-events-none" />
    </div>
  );
};
