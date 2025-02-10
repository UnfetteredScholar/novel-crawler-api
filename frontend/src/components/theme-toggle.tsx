import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useCallback } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    }
  }, [setTheme, theme]);

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger asChild>
  //       <Button variant="outline" size="icon">
  //         <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  //         <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  //         <span className="sr-only">Toggle theme</span>
  //       </Button>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent align="end">
  //       <DropdownMenuItem onClick={() => setTheme("light")}>
  //         Light
  //       </DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme("dark")}>
  //         Dark
  //       </DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme("system")}>
  //         System
  //       </DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // );
}
