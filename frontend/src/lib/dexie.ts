import Dexie, { type EntityTable } from "dexie";

type NovelTable = {
  id: string;
  title: string;
  url: string;
  chapters: number;
  progress: number;
  createdAt: Date;
  download_url?: string;
  status?: string;
};

// dexie instance
const db = new Dexie("NovelsDatabase") as Dexie & {
  novels: EntityTable<NovelTable, "id">;
};

// Schema declaration:
db.version(1).stores({
  novels: "id",
});

export type { NovelTable };
export { db };
