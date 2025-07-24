from fastapi import FastAPI, HTTPException, status
import os
import json
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.responses import FileResponse
import logging
from logging.handlers import TimedRotatingFileHandler
import uvicorn

# --- Constants and Settings ---
GENERATIVE_MODEL_NAME = "gemini-2.5-pro"

# --- Pydantic Models ---

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
    # Load environment variables
    load_dotenv()

@app.get("/")
async def root():
    return {"message": "API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)