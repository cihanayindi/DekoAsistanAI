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
    
    # Server ayarları - development vs production
    ENVIRONMENT: str = "development"  # development, production
    DEV_HOST: str = "127.0.0.1"      # Development için localhost
    DEV_PORT: int = 8000
    DEV_RELOAD: bool = True           # Auto-reload development'da
    
    PROD_HOST: str = "0.0.0.0"       # Production için tüm interface'ler
    PROD_PORT: int = 8000
    PROD_RELOAD: bool = False        # Production'da reload kapalı

    # AI API ayarları
    GEMINI_API_KEY: str
    GENERATIVE_MODEL_NAME: str = "gemini-2.5-pro"
    
    @property
    def host(self) -> str:
        """Environment'a göre host döndür."""
        return self.DEV_HOST if self.ENVIRONMENT == "development" else self.PROD_HOST
    
    @property
    def port(self) -> int:
        """Environment'a göre port döndür."""
        return self.DEV_PORT if self.ENVIRONMENT == "development" else self.PROD_PORT
    
    @property
    def reload(self) -> bool:
        """Environment'a göre reload döndür."""
        return self.DEV_RELOAD if self.ENVIRONMENT == "development" else self.PROD_RELOAD
    
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