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


app = FastAPI()

@app.get("/")
async def root():
    return {"message": "API çalışıyor"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)