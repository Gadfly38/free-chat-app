from fastapi import HTTPException, Request
from datetime import datetime
from uuid import UUID
from google.auth.transport import requests
from google.oauth2 import id_token
import os
from dotenv import load_dotenv

from app.config.database import supabase
from app.models.user_model import UserSignUpModel, UserSignInModel, TokenModel
from app.config.utils import create_refresh_token, create_access_token, verify_token, hash_password, verify_password

load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

async def check_jwt_token(request:Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(
            status_code= 401,
            detail={
                "message":"Authorization header missing"
            }
        )
    
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
    
    payload = verify_token(token)
    
    return {
        "isVerified": True
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
        access_token = create_access_token(data={"sub": email})

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

        access_token = create_access_token(data={"sub": existing_user.data[0]['email']})
        response = {
            "status": "success",
            "message": "Login successfully",
            "user": {
                "id": existing_user.data[0]["id"],
                "email": existing_user.data[0]["email"]
            },
            "accessToken": access_token,
            "expiresIn": 3600
        }

        if user.rememberMe:
            response["refreshToken"] = create_refresh_token(data={
                "sub": existing_user.data[0]['password']
            })

        return response

    except HTTPException as he:
        raise he

    except Exception as e:
        raise HTTPException(status_code=500, detail={
            "message" : str(e)
        })