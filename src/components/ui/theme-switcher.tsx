import { Theme } from "@/types/theme";

type ThemeSwitcherProps = {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
};

const themeStyles = {
  gradient: {
    active: "bg-purple-500 text-white",
    inactive: "bg-zinc-800 text-zinc-300",
  },
  geometric: {
    active: "bg-[#64ffda] text-[#0a192f]",
    inactive: "bg-zinc-800 text-zinc-300",
  },
  minimal: {
    active: "bg-black text-white",
    inactive: "bg-zinc-800 text-zinc-300",
  },
  artistic: {
    active: "bg-[#7928ca] text-white",
    inactive: "bg-zinc-800 text-zinc-300",
  },
} as const;

const ThemeButton: React.FC<{
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}> = ({ theme, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${
      isActive ? themeStyles[theme].active : themeStyles[theme].inactive
    }`}
  >
    {theme.charAt(0).toUpperCase() + theme.slice(1)}
  </button>
);

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: Theme[] = ["gradient", "geometric", "minimal", "artistic"];

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {themes.map((theme) => (
        <ThemeButton
          key={theme}
          theme={theme}
          isActive={currentTheme === theme}
          onClick={() => onThemeChange(theme)}
        />
      ))}
    </div>
  );
};
