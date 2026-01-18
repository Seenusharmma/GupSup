import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="flex items-center gap-3 px-4 py-2 rounded-lg wa-transition w-full"
      onClick={toggleTheme}
      style={{
        color: 'var(--wa-text-primary)',
      }}
    >
      {theme === "light" ? (
        <>
          <Moon className="size-4" />
          <span className="text-sm font-medium">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="size-4" />
          <span className="text-sm font-medium">Light Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeSelector;
