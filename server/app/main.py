from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth_routes
from app.routes import chat_routes

app = FastAPI(
    title="Free Chat App",
    description="Upload the PDF and chat with chatbot based on uploaded PDF",
    version="1.0.0"
)

# Routes
app.include_router(auth_routes.router) # Auth-Routes
app.include_router(chat_routes.router) # Chat-Routes

# Handle CORS Error
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test Route
@app.get("/test")
def root():
    return {"message": "Welcome to FastAPI"}