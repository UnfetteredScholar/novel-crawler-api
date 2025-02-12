export type NovelInfo = {
  title: string;
  author: string;
  synopsis: string;
  tags: string[];
  url: string;
  chapters: number;
  volumes: number;
};

export type StartNovelDownload = {
  download_id: string;
  message: string;
};

export type DownloadProgress = {
  title: string;
  author: string;
  url: string;
  progress: number;
  chapters: number;
  download_url: string | null;
};
