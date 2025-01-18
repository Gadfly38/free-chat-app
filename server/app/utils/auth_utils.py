import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException

SECRET_KEY = "leon0713"
ALGORITHM = "HS256"  
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, isLifeTimeLong: bool):
    """Generate a JWT access token."""
    to_encode = data.copy()
    if not isLifeTimeLong:
        expire = datetime.utcnow() + timedelta(minutes=0.3)
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # if 'exp' in payload:
        #     expiration = datetime.fromtimestamp(payload['exp'])
        #     if datetime.utcnow() > expiration:
        #         raise HTTPException(
        #             status_code = 401,
        #             detail={
        #                 "message":"Token has expired"
        #             }
        #         )
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code = 401,
            detail={
                "message":"Token has expired"
            }
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code = 401,
            detail={
                "message":"Invalid token"
            }
        )

def hash_password(password: str) -> str:
    """Hash a password for storage."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against a provided one."""
    return pwd_context.verify(plain_password, hashed_password)
