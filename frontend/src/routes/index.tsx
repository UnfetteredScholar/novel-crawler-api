import { NovelInput } from "@/components/novel-input";
import NovelList from "@/components/novel-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="max-width-container flex flex-col gap-6 py-8">
      <NovelInput />

      <hr className="w-11/12 self-center" />

      <NovelList />
    </div>
  );
}
