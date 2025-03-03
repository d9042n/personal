"use client";

import {motion} from "framer-motion";
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {ArrowLeft} from "lucide-react";
import {MinimalShape} from "../landing/minimal-shape";
import {ErrorComponentProps} from "@/types/theme";
import {ErrorThemeSwitcher} from "../ui/error-theme-switcher";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const MinimalError: React.FC<ErrorComponentProps> = ({
                                                                message,
                                                                onRetry,
                                                                onSwitchTheme,
                                                                currentTheme,
                                                            }) => {
    return (
        <div
            className={cn(
                "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white",
                inter.className
            )}
        >
            <ErrorThemeSwitcher
                currentTheme={currentTheme}
                onSwitchTheme={onSwitchTheme}
            />

            <div className="absolute inset-0 overflow-hidden">
                <MinimalShape delay={0.2} size={200} className="left-[10%] top-[20%]"/>
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
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.2}}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 mb-8 md:mb-12"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                        <span className="text-sm text-gray-600 tracking-wide font-medium">
              Error
            </span>
                    </motion.div>

                    <motion.h1
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.4}}
                        className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight text-gray-900"
                    >
                        Something went wrong
                    </motion.h1>

                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.6}}
                        className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto"
                    >
                        {message}
                    </motion.p>

                    <motion.button
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.8}}
                        onClick={onRetry}
                        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300 inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                        Try Again
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
