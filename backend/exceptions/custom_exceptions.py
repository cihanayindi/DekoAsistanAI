from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

logger = logging.getLogger(__name__)


class DekoAssistantException(Exception):
    """
    Deko Assistant için özel exception sınıfı.
    """
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AIServiceException(DekoAssistantException):
    """
    AI servisleri (Gemini, Imagen) için exception.
    """
    def __init__(self, message: str = "AI servisinde hata oluştu"):
        super().__init__(message, status_code=503)


class FileUploadException(DekoAssistantException):
    """
    Dosya yükleme hataları için exception.
    """
    def __init__(self, message: str = "Dosya yükleme hatası"):
        super().__init__(message, status_code=400)


def setup_exception_handlers(app: FastAPI):
    """
    FastAPI uygulaması için exception handler'ları ayarla.
    """
    
    @app.exception_handler(DekoAssistantException)
    async def deko_assistant_exception_handler(request: Request, exc: DekoAssistantException):
        logger.error(f"Deko Assistant Exception: {exc.message}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "Deko Assistant Hatası",
                "message": exc.message,
                "status_code": exc.status_code
            }
        )
    
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "HTTP Hatası",
                "message": exc.detail,
                "status_code": exc.status_code
            }
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"Validation Error: {exc.errors()}")
        return JSONResponse(
            status_code=422,
            content={
                "error": "Veri Doğrulama Hatası",
                "message": "Gönderilen veriler geçersiz",
                "details": exc.errors(),
                "status_code": 422
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Genel Hata: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": "Sunucu Hatası",
                "message": "Beklenmeyen bir hata oluştu",
                "status_code": 500
            }
        )
