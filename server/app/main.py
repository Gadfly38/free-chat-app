from fastapi import FastAPI
from app.routes import user_routes

app = FastAPI()
app.include_router(user_routes.router)

@app.get("/test")
def root():
    return {"message": "Welcome to FastAPI"}