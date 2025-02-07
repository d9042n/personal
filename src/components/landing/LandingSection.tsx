"use client"

import {motion} from "framer-motion"
import {Space_Grotesk} from "next/font/google"
import type {FC} from "react"
import {cn} from "@/lib/utils"
import {ArrowRight, Github, Linkedin, Twitter} from "lucide-react"
import {GradientSpotlight} from "./gradient-spotlight"

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
})
type LandingSectionProps = {
    name?: string
    title?: string
    description?: string
    socialLinks?: {
        github?: string
        linkedin?: string
        twitter?: string
    }
}

export const LandingSection: FC<LandingSectionProps> = ({
                                                            name = "Name",
                                                            title = "Title",
                                                            description = "Description",
                                                            socialLinks = {
                                                                github: "#",
                                                                linkedin: "#",
                                                                twitter: "#",
                                                            },
                                                        }) => {
    return (
        <section
            className={cn(
                "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black",
                spaceGrotesk.variable,
            )}
        >
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black"/>

            <GradientSpotlight className="top-20 -left-20 bg-purple-500/30" size={300} delay={0.2}/>
            <GradientSpotlight className="bottom-20 -right-20 bg-cyan-500/30" size={300} delay={0.4}/>
            <GradientSpotlight
                className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-500/30"
                size={500}
                delay={0.6}
            />

            <div className="relative z-10 container mx-auto px-4 py-16 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.h1
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.4}}
                        className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight font-sans"
                    >
                        <span
                            className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500">
                            {name}
                        </span>
                    </motion.h1>

                    <motion.h2
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.6}}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-zinc-300"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 0.8}}
                        className="text-lg sm:text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl"
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 1}}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2 group">
                            View Projects
                            <ArrowRight
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"/>
                        </button>
                        <button
                            className="px-8 py-4 bg-zinc-800/50 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:bg-zinc-800 transition-colors duration-300 backdrop-blur-sm">
                            Contact Me
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8, delay: 1.2}}
                        className="mt-12 flex gap-6"
                    >
                        <a href={socialLinks.github}
                           className="text-zinc-400 hover:text-white transition-colors duration-300">
                            <Github className="w-6 h-6"/>
                        </a>
                        <a href={socialLinks.linkedin}
                           className="text-zinc-400 hover:text-white transition-colors duration-300">
                            <Linkedin className="w-6 h-6"/>
                        </a>
                        <a href={socialLinks.twitter}
                           className="text-zinc-400 hover:text-white transition-colors duration-300">
                            <Twitter className="w-6 h-6"/>
                        </a>
                    </motion.div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"/>
        </section>
    )
}