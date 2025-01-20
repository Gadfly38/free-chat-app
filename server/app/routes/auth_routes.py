from fastapi import APIRouter,Request, Depends, File, UploadFile, Form
from datetime import datetime, timedelta

from app.controllers.auth_controller import sign_up, sign_in, google_sign_in, get_chat_history, handle_pdf
from app.models.auth_model import UserSignUpModel, UserSignInModel, TokenModel
from app.middleware.auth_middleware import check_jwt_token

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

@router.get("/api/chat/get_chat_history", dependencies=[Depends(check_jwt_token)])
async def return_chat_history():
    return await get_chat_history()

@router.post("/api/document/upload_pdf", dependencies=[Depends(check_jwt_token)])
async def upload_pdf(email: str = Form(...), file: UploadFile = File(...)):
    return await handle_pdf(email, file)