import { useDexieQuery } from "./use-dexie-query";

export const useNovelTable = () => {
  return useDexieQuery((_) => _.novels.toArray());
};
