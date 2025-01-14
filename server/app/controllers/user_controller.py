from fastapi import HTTPException
from datetime import datetime
from uuid import UUID

from app.config.database import supabase
from app.models.user_model import UserSignUpModel, UserSignInModel

async def sign_up(user:UserSignUpModel):
    try:
        existing_user = supabase.table('users').select("*").eq('email', user.email).execute()
        
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        new_user = {
            "email": user.email,
            "password": user.password
        }
        
        result = supabase.table('users').insert(new_user).execute()
        
        if result.data:
            return {"message": "User registered successfully", "user": result.data[0]}
        else:
            raise HTTPException(status_code=400, detail="Registration failed")
    except HTTPException as he:
        raise he
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def sign_in(user:UserSignInModel):
    try:
        existing_user = supabase.table('users').select("*").eq('email', user.email).execute()
        
        if not existing_user.data:
            raise HTTPException(status_code=400, detail="Email not found")

        if existing_user.data[0]["password"] != user.password:
            raise HTTPException(status_code=400, detail="Incorrect Password")

        return {"message": "SignIn successfully", "user": existing_user.data[0]}

    except HTTPException as he:
        raise he

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))