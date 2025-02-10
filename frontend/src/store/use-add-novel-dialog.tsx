import { NovelInfo } from "@/types/response-types";
import { atom, useAtom } from "jotai";

const dialogAtom = atom<NovelInfo | false>(false);

export function useAddNovelDialog() {
  return useAtom(dialogAtom);
}
