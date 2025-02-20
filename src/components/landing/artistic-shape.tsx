"use client";

import {motion} from "framer-motion";
import {cn} from "@/lib/utils";

type ArtisticShapeProps = {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
};

export const ArtisticShape: React.FC<ArtisticShapeProps> = ({
                                                                className,
                                                                delay = 0,
                                                                width = 400,
                                                                height = 100,
                                                                rotate = 0,
                                                                gradient = "from-white/[0.08]",
                                                            }) => {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.8,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: {duration: 1.2},
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-4 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                    style={{
                        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                    }}
                />
            </motion.div>
        </motion.div>
    );
};
