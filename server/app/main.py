from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import user_routes

app = FastAPI()

origins = [
    "http://localhost:3000",  # React (or any frontend) running locally
    "http://127.0.0.1:3000",
    "https://your-frontend-domain.com",  # Production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies or authorization headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all custom headers
)

app.include_router(user_routes.router)

@app.get("/test")
def root():
    return {"message": "Welcome to FastAPI"}