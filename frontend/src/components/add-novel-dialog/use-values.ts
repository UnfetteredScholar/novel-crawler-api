import { NovelInfo } from "@/types/response-types";
import { useEffect, useMemo, useState } from "react";

export default function useValues(open: NovelInfo | false) {
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

  const isValidSelection = useMemo(
    () =>
      hasChapters &&
      (!isSelectable ||
        (startChapter !== null &&
          endChapter !== null &&
          startChapter < endChapter)),
    [endChapter, hasChapters, isSelectable, startChapter],
  );

  return {
    chapters,
    hasChapters,
    isSelectable,
    startOptions,
    endOptions,
    intervalChapters,
    isValidSelection,
    startChapter,
    endChapter,
    setStartChapter,
    setEndChapter,
  };
}
