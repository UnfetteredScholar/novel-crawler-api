import os
from logging import getLogger

from lncrawl.core.app import App


class NovelDownloader:
    def __init__(self, user_input: str):
        "Initializes the NovelDownloader object"
        self.app = App()
        self.app.user_input = user_input

        self._get_novel_info()

    def _get_novel_info(self):
        """Gets the novel's info"""
        self.app.prepare_search()

        if not self.app.crawler:
            raise Exception("Novel not found")

        self.app.get_novel_info()

    def download_novel(
        self, output_path: str, start_chapter: int, end_chapter: int
    ) -> list[str]:
        """Downloads the novel to the specified path"""
        logger = getLogger(__name__ + ".download_novel")
        start_chapter -= 1
        # end_chapter += 1
        if not os.path.isdir(output_path):
            raise Exception("Output folder not found")
        self.app.output_path = output_path
        self.app.pack_by_volume = False
        self.app.chapters = self.app.crawler.chapters[
            start_chapter:end_chapter
        ]

        self.app.output_formats = {"epub": True}

        logger.info(
            "**%s**" % self.app.crawler.novel_title,
            "Downloading %d chapters..." % len(self.app.chapters),
        )

        self.app.start_download()

        self.app.bind_books()

        logger.info("Compressing output folder...")
        self.app.compress_books()

        assert isinstance(self.app.archived_outputs, list)
        return self.app.archived_outputs
