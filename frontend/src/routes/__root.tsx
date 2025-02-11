import AddNovelDialog from "@/components/add-novel-dialog";
import NavBar from "@/components/nav-bar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-background font-sans antialiased">
        <NavBar />

        <Outlet />
      </div>
      <AddNovelDialog />
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
