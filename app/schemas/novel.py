# from enum import Enum
from typing import List, Optional

from pydantic import BaseModel

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


class NovelInfo(BaseModel):
    title: str
    author: str
    synopsis: str
    tags: List[str]
    url: str
    chapters: int
    volumes: int


class DownloadParameters(BaseModel):
    url: str
    start_chapter: Optional[int] = None
    end_chapter: Optional[int] = None
    # formats: List[OutputFormat]


class DownloadProgress(BaseModel):
    title: str
    author: str
    url: str
    progress: int
    chapters: int
    download_url: Optional[str] = None
