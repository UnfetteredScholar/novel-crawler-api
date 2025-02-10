import { NovelInput } from "@/components/novel-input";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="max-width-container py-8">
      <NovelInput />
    </div>
  );
}
