from fastapi import APIRouter,Request, Depends
from datetime import datetime, timedelta

from app.controllers.auth_controller import sign_up, sign_in, google_sign_in
from app.models.auth_model import UserSignUpModel, UserSignInModel, TokenModel
from app.middleware.verify_token_middleware import check_jwt_token

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