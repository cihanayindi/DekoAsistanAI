import logging
from logging.handlers import TimedRotatingFileHandler
import os
from .settings import settings

def setup_logging():
    """
    Logging konfigürasyonunu ayarla
    """
    # Logs klasörünü oluştur
    os.makedirs("logs", exist_ok=True)
    
    # TimedRotatingFileHandler oluştur
    log_handler = TimedRotatingFileHandler(
        settings.LOG_FILE,
        when="midnight",
        interval=1,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding=settings.LOG_ENCODING,
    )
    
    # Logging'i yapılandır
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format=settings.LOG_FORMAT,
        handlers=[
            log_handler,
            logging.StreamHandler()  # Console'a da log
        ]
    )
    
    return logging.getLogger(__name__)

# Logger instance'ı al
logger = setup_logging()