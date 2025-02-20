"use client";

import {motion} from "framer-motion";
import {cn} from "@/lib/utils";

type MinimalShapeProps = {
    className?: string;
    delay?: number;
    size?: number;
};

export const MinimalShape: React.FC<MinimalShapeProps> = ({
                                                              className,
                                                              delay = 0,
                                                              size = 100,
                                                          }) => {
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{
                duration: 1.5,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 10, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width: size,
                    height: size,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0",
                        "bg-gradient-to-br from-gray-200 to-gray-100",
                        "shadow-md",
                        "after:absolute after:inset-0",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
};
