from enum import Enum
from typing import Annotated, Any, List, Optional

from pydantic import BaseModel, BeforeValidator, Field

# class OutputFormat(str, Enum):
#     json = "json"
#     epub = "epub"
#     text = "text"
#     web = "web"
# docx = "docx"
# mobi = "mobi"
# pdf = "pdf"
# rtf = "rtf"
# txt = "txt"
# azw3 = "azw3"
# fb2 = "fb2"
# lit = "lit"
# lrf = "lrf"
# oeb = "oeb"
# pdb = "pdb"
# rb = "rb"
# snb = "snb"
# tcr = "tcr"


def verify_tags(val: Any) -> List[str]:
    if type(val) is str:
        if val == "":
            val = []
        else:
            val = val.split(",")

    return val


class NovelInfo(BaseModel):
    title: str
    author: str
    synopsis: str
    tags: Annotated[List[str], BeforeValidator(verify_tags)]
    url: str
    chapters: int
    chapter_titles: List[str] = []
    volumes: int


class DownloadParameters(BaseModel):
    url: str
    start_chapter: Optional[int] = Field(default=None, ge=1)
    end_chapter: Optional[int] = Field(default=None, ge=1)
    # formats: List[OutputFormat]


class DownloadStatus(str, Enum):
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class DownloadProgress(BaseModel):
    title: str
    author: str
    url: str
    status: DownloadStatus
    progress: int
    chapters: int
    download_url: Optional[str] = None
