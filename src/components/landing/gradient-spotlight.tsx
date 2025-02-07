"use client"

import {motion} from "framer-motion"
import type {FC} from "react"
import {cn} from "@/lib/utils"

type GradientSpotlightProps = {
    className?: string
    delay?: number
    size?: number
}

export const GradientSpotlight: FC<GradientSpotlightProps> = ({
                                                                  className,
                                                                  delay = 0,
                                                                  size = 200,
                                                              }) => {
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity: 1, scale: 1}}
            transition={{
                duration: 2,
                delay,
                ease: [0, 0.71, 0.2, 1.01],
            }}
            className={cn("absolute rounded-full blur-[100px] animate-pulse", className)}
            style={{
                width: size,
                height: size,
            }}
        />
    )
}