import { useNovelTable } from "@/hooks/use-novel-table";
import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function NovelList() {
  const { data, loading } = useNovelTable();

  if (loading)
    return (
      <div className="flex justify-center py-5">
        <LoaderCircle className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {data?.map((novel) => (
        <div
          key={novel.id}
          className="flex flex-col gap-y-2 rounded border p-4"
        >
          <div className="grid grid-cols-[1fr_auto] justify-center gap-6">
            <p className="text-lg font-medium">{novel.title}</p>
            <p className="text-xs text-muted-foreground">
              {novel.createdAt.toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="flex flex-col gap-4 pl-1 text-sm sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-[auto_1fr] gap-1">
              <p className="">Chapters:</p>
              <p className="">{novel.chapters}</p>

              <p className="">Progress:</p>
              <p className="">10/10</p>
            </div>

            <Button>Download</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
