import { useAddNovelDialog } from "@/store/use-add-novel-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { useCallback, useMemo } from "react";
import { useAction } from "@/hooks/use-action";
import { db } from "@/lib/dexie";
import { NovelDownloadOptions } from "@/types/request-types";
import { StartNovelDownload } from "@/types/response-types";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { VList } from "virtua";
import useValues from "./use-values";

export default function AddNovelDialog() {
  const [, action, pending] = useAction(
    async (params: NovelDownloadOptions) => {
      try {
        const res = await fetch(`/api/v1/novel/downloads`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(params),
        });

        if (!res.ok) {
          const error = (await res.json()) as { detail: string };
          throw new Error(error.detail);
        }

        const data = (await res.json()) as StartNovelDownload;
        db.novels.add({
          id: data.download_id,
          url: params.url,
          title: params.title,
          chapters: params.chapters,
          progress: 0,
          createdAt: new Date(),
        });
        setOpen(false);
      } catch (error) {
        if (!(error instanceof Error)) return;
        toast.error(error.message);
      }
    },
  );
  const [open, setOpen] = useAddNovelDialog();
  const {
    startChapter,
    setEndChapter,
    endChapter,
    setStartChapter,
    hasChapters,
    isSelectable,
    endOptions,
    startOptions,
    intervalChapters,
    isValidSelection,
  } = useValues(open);

  const selectComponents = useMemo(() => {
    if (!hasChapters) {
      return (
        <p className="text-sm text-destructive">
          No chapters available. Cannot proceed.
        </p>
      );
    }

    if (!isSelectable) {
      return (
        <p className="text-sm text-muted-foreground">
          Not enough chapters to select a range. Proceeding without chapter
          selection.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
        {/* Select start chapter */}
        <p className="font-medium">First Chapter:</p>
        <div className="">
          <Select
            value={startChapter?.toString() || ""}
            onValueChange={(value: string) => setStartChapter(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              {startChapter ? `Chapter ${startChapter}` : "Start"}
            </SelectTrigger>
            <SelectContent>
              <VList style={{ height: 300 }} className="">
                {startOptions.map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    Chapter {chapter}
                  </SelectItem>
                ))}
              </VList>
            </SelectContent>
          </Select>
        </div>

        {/* Select end chapter */}
        <p className="font-medium">Last Chapter:</p>
        <div className="">
          <Select
            value={endChapter?.toString() || ""}
            onValueChange={(value: string) => setEndChapter(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              {endChapter ? `Chapter ${endChapter}` : "End"}
            </SelectTrigger>
            <SelectContent>
              <VList style={{ height: 300 }} className="">
                {endOptions.map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()}>
                    Chapter {chapter}
                  </SelectItem>
                ))}
              </VList>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }, [
    endChapter,
    endOptions,
    hasChapters,
    isSelectable,
    setEndChapter,
    setStartChapter,
    startChapter,
    startOptions,
  ]);

  const chapterList = useMemo(
    () =>
      isSelectable && (
        <div className="mt-4 h-[30vh] overflow-y-auto">
          <ul className="list-disc pl-5">
            {intervalChapters.map((chapter) => (
              <li key={chapter}>Chapter {chapter}</li>
            ))}
          </ul>
        </div>
      ),
    [intervalChapters, isSelectable],
  );

  const handleSubmit = useCallback(async () => {
    if (!open) return;
    action({
      url: open.url,
      start_chapter: startChapter,
      end_chapter: endChapter,
      title: open.title,
      chapters: isSelectable ? intervalChapters.length : open.chapters,
    });
  }, [
    action,
    endChapter,
    intervalChapters.length,
    isSelectable,
    open,
    startChapter,
  ]);

  return (
    <Dialog
      open={!!open}
      onOpenChange={(openVal) => {
        if (openVal === false) {
          setOpen(openVal);
          setStartChapter(null);
          setEndChapter(null);
        }
      }}
    >
      {!!open && (
        <DialogContent className="max-h-[95vh] w-11/12 overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Novel</DialogTitle>
            <DialogDescription>Add novel to start processing</DialogDescription>
            <div className="flex flex-col gap-y-2">
              <p>
                <span className="font-medium">Title:</span> {open.title}
              </p>
              <p>
                <span className="font-medium">Chapters:</span> {open.chapters}
              </p>

              {selectComponents}
            </div>
          </DialogHeader>

          {chapterList}

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!isValidSelection || pending}
            >
              {pending && (
                <span className="animate-spin">
                  <LoaderCircle size={16} />
                </span>
              )}{" "}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
