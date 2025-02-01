import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const onClick = async () => {
    await fetch("/api/v1/health");
  };

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <div className="mt-6">
        <Button onClick={onClick}>Health</Button>
      </div>
    </div>
  );
}
