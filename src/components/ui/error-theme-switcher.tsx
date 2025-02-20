import {Theme} from "@/types/theme";

interface ErrorThemeSwitcherProps {
    currentTheme: Theme;
    onSwitchTheme: (theme: Theme) => void;
}

export const ErrorThemeSwitcher: React.FC<ErrorThemeSwitcherProps> = ({
                                                                          currentTheme,
                                                                          onSwitchTheme,
                                                                      }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
            <button
                onClick={() => onSwitchTheme("geometric")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                    currentTheme === "geometric"
                        ? "bg-[#64ffda] text-[#0a192f]"
                        : "bg-zinc-800 text-zinc-300"
                }`}
            >
                Geometric
            </button>
            <button
                onClick={() => onSwitchTheme("minimal")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                    currentTheme === "minimal"
                        ? "bg-black text-white"
                        : "bg-zinc-800 text-zinc-300"
                }`}
            >
                Minimal
            </button>
            <button
                onClick={() => onSwitchTheme("artistic")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                    currentTheme === "artistic"
                        ? "bg-[#7928ca] text-white"
                        : "bg-zinc-800 text-zinc-300"
                }`}
            >
                Artistic
            </button>
        </div>
    );
};
