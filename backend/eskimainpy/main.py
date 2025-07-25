from fastapi import FastAPI, HTTPException, status, UploadFile, File, Form
import os
import json
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel, Field
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.responses import FileResponse
import logging
from logging.handlers import TimedRotatingFileHandler
import uvicorn
from typing import Optional

# --- Create logs directory if it doesn't exist ---
os.makedirs("logs", exist_ok=True)

log_handler = TimedRotatingFileHandler(
    "logs/deko_assistant.log",
    when="midnight",
    interval=1,
    backupCount=7,
    encoding='utf-8',
)

logging.basicConfig(
    level=logging.INFO,
    format="\n%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        log_handler,
        logging.StreamHandler()  # Log to console as well
    ]
)

logger = logging.getLogger(__name__)


# --- Constants and Settings ---
GENERATIVE_MODEL_NAME = "gemini-2.5-pro"

# --- Pydantic Models ---
class DesignRequestModel(BaseModel):
    oda_tipi: str = Field(..., example="Salon")
    tasarim_stili: str = Field(..., example="Modern")
    notlar: str = Field(..., example="Geniş bir kitaplık ve rahat bir okuma koltuğu istiyorum...")
    
app = FastAPI(
    title="Deko Assistant AI API",
    description="Deko Assistant AI API is an AI-powered application where users can get decoration suggestions.",
    version="1.0.0",
)

# --- CORS Middleware ---
origins = [
    "http://localhost:3000", # For React frontend
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """
    When the application starts, this function will be called.
    """
    logger.info("Starting Deko Assistant AI API...")
    load_dotenv()

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/test")
async def test_endpoint(
    oda_tipi: str = Form(...),
    tasarim_stili: str = Form(...),
    notlar: str = Form(...),
    oda_fotografi: Optional[UploadFile] = File(None)
):
    
    logger.info("Test endpoint'e istek alındı:")
    logger.info(f"Oda Tipi: {oda_tipi}")
    logger.info(f"Tasarım Stili: {tasarim_stili}")
    logger.info(f"Notlar: {notlar}")
    logger.info(f"Yüklenen Fotoğraf: {oda_fotografi.filename if oda_fotografi else 'Yok'}")
    
    return {
        "oda_tipi": oda_tipi,
        "tasarim_stili": tasarim_stili,
        "notlar": notlar,
        "foto_yuklendi": oda_fotografi.filename if oda_fotografi else None
    }
