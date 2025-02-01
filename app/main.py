from contextlib import asynccontextmanager

import uvicorn
from api.v1.routers import health, novel
from core.config import settings
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from core.spa import SPAStaticFiles

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from lncrawl.core.sources import load_sources

    print("loading sources")
    load_sources()
    yield
    print("exit")


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.setup

app.include_router(router=health.router, prefix=settings.API_V1_STR, tags=["health"])

app.include_router(router=novel.router, prefix=settings.API_V1_STR, tags=["novel"])


# @app.get(path="/", include_in_schema=False)
# def redirect_to_docs() -> RedirectResponse:
#     return RedirectResponse(url="/docs")

app.mount("/", SPAStaticFiles(directory="./frontend/dist", html=True), name="static")


# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_level="debug")
