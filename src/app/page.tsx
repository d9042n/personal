"use client";

import type {NextPage} from "next";
import {useState} from "react";
import {GeometricSection, GradientSection} from "@/components/landing";

const badge = "Available for hire";
const name = "Le Anh Doan";
const title = "Software Developer";
const description = `Crafting cutting-edge digital experiences with a passion for clean code and innovative
solutions. Let's turn your ideas into reality.`;
const socialLinks = {
    github: "https://github.com/d9042n",
    linkedin: "https://www.linkedin.com/in/leanhdoan/",
    twitter: "https://twitter.com",
};
const isAvailable = false;

const HomePage: NextPage = () => {
    const [design, setDesign] = useState<"gradient" | "geometric">("gradient");

    return (
        <main>
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setDesign("gradient")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        design === "gradient"
                            ? "bg-purple-500 text-white"
                            : "bg-zinc-800 text-zinc-300"
                    }`}
                >
                    Gradient
                </button>
                <button
                    onClick={() => setDesign("geometric")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        design === "geometric"
                            ? "bg-[#64ffda] text-[#0a192f]"
                            : "bg-zinc-800 text-zinc-300"
                    }`}
                >
                    Geometric
                </button>
            </div>

            {design === "gradient" ? (
                <GradientSection
                    name={name}
                    title={title}
                    description={description}
                    socialLinks={socialLinks}
                    badge={badge}
                    isAvailable={isAvailable}
                />
            ) : (
                <GeometricSection
                    name={name}
                    title={title}
                    description={description}
                    badge={badge}
                    isAvailable={isAvailable}
                />
            )}
        </main>
    );
};

export default HomePage;
