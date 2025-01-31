import logging
import logging.config
import os
from logging.handlers import TimedRotatingFileHandler

from pydantic_settings import BaseSettings


def configure_logging():
    os.makedirs("./logs", exist_ok=True)
    # Create a TimedRotatingFileHandler
    handler = TimedRotatingFileHandler(
        "./logs/novel-crawler-api.log",  # Log file path
        when="midnight",  # Rotate at midnight
        interval=1,  # Every 1 day
        backupCount=7,  # Keep last 7 days of logs
    )

    # Create a formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s  - %(message)s"
    )
    handler.setFormatter(formatter)
    handler.setLevel(logging.INFO)

    # Get the root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)  # Set the logging level globally
    root_logger.addHandler(handler)

    # Optional: Adding console logging
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.INFO)
    root_logger.addHandler(console_handler)

    # detailed logs
    detailed_handler = TimedRotatingFileHandler(
        "./logs/detailed.novel-crawler-api.log",  # Log file path
        when="midnight",  # Rotate at midnight
        interval=1,  # Every 1 day
        backupCount=7,  # Keep last 7 days of logs
    )
    detailed_handler.setFormatter(formatter)
    detailed_handler.setLevel(logging.DEBUG)
    root_logger.addHandler(detailed_handler)


configure_logging()


class Settings(BaseSettings):
    VERSION: str = "1.0"
    RELEASE_ID: str = "0.1"
    API_V1_STR: str = "/api/v1"
    ALLOWED_ORIGINS: str = "*"
    APP_NAME: str = "Novel Crawler API"
    DOWNLOAD_FOLDER: str = "downloads"


settings = Settings()
