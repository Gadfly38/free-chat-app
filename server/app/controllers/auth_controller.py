from fastapi import HTTPException, Request, File, UploadFile, HTTPException
from datetime import datetime
from uuid import UUID
from google.auth.transport import requests
from google.oauth2 import id_token
import os
from dotenv import load_dotenv
import PyPDF2
from io import BytesIO

from app.db.supabase import supabase
from app.models.auth_model import UserSignUpModel, UserSignInModel, TokenModel
from app.utils.auth_utils import create_access_token, verify_jwt_token, hash_password, verify_password

load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

async def get_chat_history():
    return{
        "chatHistory" : "Hi"
    }

async def google_sign_in(token:TokenModel):
    try:
        token_str = token.token
        
        id_info = id_token.verify_oauth2_token(
            token_str, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        if id_info["aud"] != GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=400, detail={
                "message": "Invalid Audience"
            })

        email = id_info.get("email")
        access_token = create_access_token(data={"sub": email}, isLifeTimeLong = False)

        return {
            "status": "success",
            "user": {
                "email": email,
            },
            "token": access_token
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail={
            "message": "Authentication Failed"
        })

async def sign_up(user:UserSignUpModel):
    try:
        existing_user = supabase.table('users').select("*").eq('email', user.email).execute()
        
        if existing_user.data:
            raise HTTPException(status_code=400, detail={
                "message" : "Email already exists or invalid input."
            })
        
        new_user = {
            "email": user.email,
            "password": user.password
        }
        
        result = supabase.table('users').insert(new_user).execute()

        if result.data:
            return {
                "status": "success",
                "message": "User registered successfully.",
                "user": {
                    "id": result.data[0]["id"],
                    "email": result.data[0]["email"]
                }
            }
        else:
            raise HTTPException(status_code=400, detail={
                "message" : "Oh! Registration failed."
            })
            
    except HTTPException as he:
        raise he

    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "message" : str(e)
        })

async def sign_in(user:UserSignInModel):
    try:
        existing_user = supabase.table('users').select("*").eq('email', user.email).execute()
        
        if not existing_user.data:
            raise HTTPException(status_code=400, detail={
                "message" : "Email not found"
            })

        if existing_user.data[0]["password"] != user.password:
            raise HTTPException(status_code=400, detail={
                "message" : "Incorrect Password"
            })

        access_token = create_access_token(data={"sub": existing_user.data[0]['email']}, isLifeTimeLong = user.rememberMe)
        response = {
            "status": "success",
            "message": "Login successfully",
            "user": {
                "id": existing_user.data[0]["id"],
                "email": existing_user.data[0]["email"]
            },
            "accessToken": access_token,
        }
        return response

    except HTTPException as he:
        raise he

    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "message" : str(e)
        })

async def handle_pdf(file: UploadFile = File(...)):
    try:
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        contents = await file.read()
        pdf_file = BytesIO(contents)

        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text_content = []
        for page in pdf_reader.pages:
            text_content.append(page.extract_text())

        response = {
            "filename": file.filename,
            "pages": len(pdf_reader.pages),
            "content": text_content
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the file: {str(e)}")
    
    finally:
        await file.close()
        pdf_file.close()