from fastapi import APIRouter, Request

from app.controllers.user_controller import sign_up, sign_in
from app.models.user_model import UserSignUpModel, UserSignInModel

router = APIRouter()

@router.post("/api/auth/signup")
async def create_user(user:UserSignUpModel):
    return await sign_up(user)

@router.post("/api/auth/signin")
async def insert_user(user:UserSignInModel):
    return await sign_in(user)