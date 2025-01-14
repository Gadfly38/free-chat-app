from fastapi import HTTPException
from datetime import datetime
from uuid import UUID
from google.auth.transport import requests
from google.oauth2 import id_token
import httpx
from jose import jwt 

from app.config.database import supabase
from app.models.user_model import UserSignUpModel, UserSignInModel, TokenModel
from app.config.utils import create_refresh_token, create_access_token, decode_token, hash_password, verify_password

GOOGLE_CLIENT_ID = "302085187214-9scjmt2cbrdqf5uuj6q62ivpr5m0u9no.apps.googleusercontent.com"

async def google_sign_in(token: TokenModel):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://oauth2.googleapis.com/tokeninfo?access_token={token.token}"
            )
            if response.status_code != 200:
                return {
                    "status": "error",
                    "message": "Invalid access token"
                }
            token_info = response.json()
            if token_info.get('aud') != GOOGLE_CLIENT_ID:
                return {
                    "status": "error",
                    "message": "Invalid token audience"
                }
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token.token}"}
            )
            
            if user_info_response.status_code != 200:
                return {
                    "status": "error",
                    "message": "Could not fetch user information"
                }
            user_info = user_info_response.json()
            email = user_info.get('email')
            access_token = create_access_token(data={"sub": email})
            
            return {
                "status": "success",
                "user": {
                    "email": email,
                    "name": user_info.get('name'),
                    "picture": user_info.get('picture')
                },
                "token": access_token
            }
    
    except Exception as e:
        print(f"Google Sign-In Error: {str(e)}")
        return {
            "status": "error",
            "message": "Authentication failed"
        }
    try:
        token_str = token.token
        id_info = id_token.verify_oauth2_token(
            token_str, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        if id_info["aud"] != GOOGLE_CLIENT_ID:
            return {
                "status": "error",
                "message": "Invalid Audience"
            }

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
        return {
            "status": "error",
            "message": "Authentication Failed"
        }

async def sign_up(user:UserSignUpModel):
    try:
        existing_user = supabase.table('users').select("*").eq('email', user.email).execute()
        
        if existing_user.data:
            return {
                "status" : "error",
                "message" : "Email already exists or invalid input."
            }
        
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
            return {
                "status" : "error",
                "message" : "Oh! Registration failed."
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def sign_in(user:UserSignInModel):
    try:
        existing_user = supabase.table('users').select("*").eq('email', user.email).execute()
        
        if not existing_user.data:
            return {
                "status" : "error",
                "message" : "Email not found"
            }

        if existing_user.data[0]["password"] != user.password:
            return {
                "status" : "error",
                "message" : "Incorrect Password"
            }

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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))