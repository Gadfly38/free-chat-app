from fastapi import APIRouter,Request
from app.controllers.auth_controller import sign_up, sign_in, google_sign_in, check_jwt_token
from app.models.auth_model import UserSignUpModel, UserSignInModel, TokenModel
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/api/auth/signup")
async def create_user(user:UserSignUpModel):
    return await sign_up(user)

@router.post("/api/auth/signin")
async def insert_user(user:UserSignInModel):
    return await sign_in(user)

@router.post("/api/auth/google")
async def check_token(token:TokenModel):
    return await google_sign_in(token)

@router.get("/api/auth/verify_token")
async def verify_token(request: Request):
    return await check_jwt_token(request)