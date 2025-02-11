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
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function AddNovelDialog() {
  const [open, setOpen] = useAddNovelDialog();
  const [startChapter, setStartChapter] = useState<number | null>(null);
  const [endChapter, setEndChapter] = useState<number | null>(null);

  const chapters = useMemo(
    () => (open ? Array.from({ length: open.chapters }, (_, i) => i + 1) : []),
    [open],
  );

  const hasChapters = chapters.length > 0;

  const isSelectable = chapters.length >= 2;

  useEffect(() => {
    if (isSelectable) {
      setStartChapter(chapters[0]);
      setEndChapter(chapters.at(-1)!);
    }
  }, [chapters, isSelectable]);

  const startOptions = useMemo(
    () =>
      isSelectable
        ? chapters.filter((chapter) =>
            endChapter ? chapter < endChapter : true,
          )
        : [],
    [chapters, endChapter, isSelectable],
  );

  const endOptions = useMemo(
    () =>
      isSelectable
        ? chapters.filter((chapter) =>
            startChapter ? chapter > startChapter : true,
          )
        : [],
    [chapters, isSelectable, startChapter],
  );

  const intervalChapters = useMemo(
    () =>
      isSelectable && startChapter && endChapter
        ? chapters.filter(
            (chapter) => chapter >= startChapter && chapter <= endChapter,
          )
        : [],
    [chapters, endChapter, isSelectable, startChapter],
  );

  const isValidSelection =
    hasChapters &&
    (!isSelectable ||
      (startChapter !== null &&
        endChapter !== null &&
        startChapter < endChapter));

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
              <SelectValue placeholder="Start" />
            </SelectTrigger>
            <SelectContent>
              {startOptions.map((chapter) => (
                <SelectItem key={chapter} value={chapter.toString()}>
                  Chapter {chapter}
                </SelectItem>
              ))}
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
              <SelectValue placeholder="End" />
            </SelectTrigger>
            <SelectContent>
              {endOptions.map((chapter) => (
                <SelectItem key={chapter} value={chapter.toString()}>
                  Chapter {chapter}
                </SelectItem>
              ))}
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
    console.log({
      url: open.url,
      start_chapter: startChapter,
      end_chapter: endChapter,
    });
  }, [endChapter, open, startChapter]);
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
            <Button onClick={handleSubmit} disabled={!isValidSelection}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
