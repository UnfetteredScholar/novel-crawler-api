import os
import shutil
from datetime import datetime, timedelta
from logging import getLogger
from typing import Dict, Literal
from uuid import uuid4

from apscheduler.triggers.date import DateTrigger
from core.config import scheduler, settings
from core.novel_downloader import NovelDownloader
from fastapi import APIRouter, HTTPException
from fastapi.background import BackgroundTasks
from fastapi.responses import FileResponse
from schemas.novel import DownloadParameters, DownloadProgress, NovelInfo

router = APIRouter()


DOWNLOADS = {}


def delete_download(id: str):
    logger = getLogger(__name__ + ".delete_download")
    output_folder = os.path.join(settings.DOWNLOAD_FOLDER, id)
    if os.path.exists(output_folder):
        logger.info(f"Removing {output_folder}")
        shutil.rmtree(path=output_folder)
        logger.info(f"Removed {output_folder}")
    if id in DOWNLOADS:
        logger.info("Removing from downloads")
        del DOWNLOADS[id]


def start_download(
    downloader: NovelDownloader,
    id: str,
    start_chapter: int,
    end_chapter: int,
) -> None:
    """Starts the novel download"""
    logger = getLogger(__name__ + ".start_download")
    try:
        os.makedirs(settings.DOWNLOAD_FOLDER, exist_ok=True)
        output_path = os.path.join(settings.DOWNLOAD_FOLDER, id)
        os.makedirs(output_path, exist_ok=True)
        downloader.download_novel(
            output_path=output_path,
            start_chapter=start_chapter,
            end_chapter=end_chapter,
        )
        run_time = datetime.now() + timedelta(
            days=settings.DOWNLOAD_EXPIRE_DAYS
        )
        kwargs = {"id": id}
        scheduler.add_job(
            func=delete_download,
            trigger=DateTrigger(run_date=run_time),
            kwargs=kwargs,
        )
    except Exception as ex:
        logger.error(ex, stack_info=True)
        if id in DOWNLOADS:
            del DOWNLOADS[id]
        raise ex


@router.get(path="/novel/info", response_model=NovelInfo)
def get_novel_info(url: str):  # -> NovelInfo:
    """Gets the novel's information"""
    logger = getLogger(__name__ + ".get_novel_info")
    try:
        downloader = NovelDownloader(user_input=url)

        # info = {
        #     "title": downloader.app.crawler.novel_title,
        #     "author": downloader.app.crawler.novel_author,
        #     "synopsis": downloader.app.crawler.novel_synopsis,
        #     "tags": downloader.app.crawler.novel_tags,
        #     "url": downloader.app.crawler.novel_url,
        #     "volumes": len(downloader.app.crawler.volumes),
        #     "chapters": len(downloader.app.crawler.chapters),
        # }

        info = NovelInfo(
            title=downloader.app.crawler.novel_title,
            author=downloader.app.crawler.novel_author,
            synopsis=downloader.app.crawler.novel_synopsis,
            tags=downloader.app.crawler.novel_tags,
            url=downloader.app.crawler.novel_url,
            volumes=len(downloader.app.crawler.volumes),
            chapters=len(downloader.app.crawler.chapters),
        )

        return info

    except Exception as ex:
        logger.error(ex, stack_info=True)
        raise HTTPException(
            status_code=500, detail="Unable to fetch novel info"
        )


@router.post(
    path="/novel/downloads",
    response_model=Dict[Literal["download_id", "message"], str],
)
def start_novel_download(
    params: DownloadParameters, background_tasks: BackgroundTasks
) -> NovelInfo:
    """Starts a novel download in the background"""
    logger = getLogger(__name__ + ".start_novel_download")
    try:
        downloader = NovelDownloader(user_input=params.url)

        if params.start_chapter is None or params.end_chapter is None:
            params.start_chapter = 1
            params.end_chapter = len(downloader.app.crawler.chapters)
        id = str(uuid4())

        DOWNLOADS[id] = downloader

        background_tasks.add_task(
            start_download,
            downloader=downloader,
            id=id,
            start_chapter=params.start_chapter,
            end_chapter=params.end_chapter,
        )

        return {
            "download_id": id,
            "message": "Novel download started. Check status using the id",
        }

    except Exception as ex:
        logger.error(ex, stack_info=True)
        raise HTTPException(
            status_code=500, detail="Unable to start novel download"
        )


@router.get(
    path="/novel/downloads/{download_id}", response_model=DownloadProgress
)
def check_progress(download_id: str) -> DownloadProgress:
    """Gets the download progress of a novel"""
    logger = getLogger(__name__ + ".check_progress")
    try:
        downloader: NovelDownloader = DOWNLOADS.get(download_id)
        if downloader is None:
            raise HTTPException(status_code=404, detail="Download not found")

        info = DownloadProgress(
            title=downloader.app.crawler.novel_title,
            author=downloader.app.crawler.novel_author,
            url=downloader.app.crawler.novel_url,
            chapters=len(downloader.app.crawler.chapters),
            progress=downloader.app.progress,
        )

        if info.progress == info.chapters:
            info.download_url = f"/novel/{download_id}"

        return info
    except HTTPException as ex:
        logger.error(ex)
        raise ex
    except Exception as ex:
        logger.error(ex, stack_info=True)
        raise HTTPException(
            status_code=500, detail="Unable to fetch novel info"
        )


@router.get(path="/novel/{download_id}")
def download_novel_file(download_id: str) -> FileResponse:
    """Gets the download progress of a novel"""
    logger = getLogger(__name__ + ".check_progress")
    try:

        output_folder = os.path.join(
            settings.DOWNLOAD_FOLDER, download_id, "epub"
        )

        if not os.path.exists(output_folder):
            raise HTTPException(status_code=404, detail="File not found")

        files = os.listdir(output_folder)

        if len(files) == 0:
            raise HTTPException(status_code=404, detail="File not found")

        output_file = os.path.join(output_folder, files[0])

        return FileResponse(
            path=output_file,
            filename=files[0],
            media_type="application/epub+zip",
        )
    except HTTPException as ex:
        logger.error(ex)
        raise ex
    except Exception as ex:
        logger.error(ex, stack_info=True)
        raise HTTPException(
            status_code=500, detail="Unable to fetch novel info"
        )
