from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """
    Application settings - sadece main.py'daki mevcut özellikler için.
    """
    
    # FastAPI App ayarları
    APP_TITLE: str = "Deko Assistant AI API"
    APP_DESCRIPTION: str = "Deko Assistant AI API is an AI-powered application where users can get decoration suggestions."
    APP_VERSION: str = "1.0.0"

    # CORS ayarları
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # AI API ayarları
    GEMINI_API_KEY: str
    GENERATIVE_MODEL_NAME: str = "gemini-2.5-pro"
    
    # Logging ayarları (logging_config.py tarafından kullanılacak)
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "\n%(asctime)s - %(levelname)s - %(message)s"
    LOG_FILE: str = "logs/deko_assistant.log"
    LOG_BACKUP_COUNT: int = 7
    LOG_ENCODING: str = "utf-8"
    
    class Config:
        env_file = ".env"


# Global settings instance
settings = Settings()