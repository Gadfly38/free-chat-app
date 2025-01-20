from app.utils.auth_utils import verify_jwt_token
from fastapi import HTTPException, Request

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
    
    payload = verify_jwt_token(token)
    return {
        "isVerified": True
    }