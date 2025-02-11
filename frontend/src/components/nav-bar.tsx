import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

export default function NavBar() {
  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-30 h-16 w-full",
        "bg-background text-foreground shadow-[0_0_1px_0_rgba(0,0,0,0.25)] transition-all dark:shadow-[0_0_1px_0_rgba(255,255,255,0.5)]",
      )}
    >
      <nav className="max-width-container relative flex h-16 max-w-none items-center justify-between gap-x-4">
        {/* logo */}
        <Link to="/" className="text-2xl font-semibold">
          LNCrwlr
        </Link>

        {/* Desktop */}
        <div className="items-center gap-6 md:flex">
          <ThemeToggle />

          {/* <Link
            to="/about"
            className={buttonVariants()}
            activeProps={{
              className: "cursor-default",
            }}
          >
            About
          </Link> */}
        </div>

        {/* Mobile */}
        {/* <MobileNav /> */}
      </nav>
    </header>
  );
}
