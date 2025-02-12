import { useNovelTable } from "@/hooks/use-novel-table";
import { LoaderCircle } from "lucide-react";

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
        <div key={novel.id} className="rounded border p-4">
          <p className="">{novel.title}</p>
          <p className="">
            {novel.createdAt.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
