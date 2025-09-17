# Dependência para usar nas rotas protegidas
from typing import Optional

from fastapi.params import Depends
from jose import JWTError
from sqlalchemy.orm import Session

from db.database import get_db
from fastapi import Depends, HTTPException, status
from models.user import User
from core.security import decode_access_token
from fastapi import Request

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    # Tenta extrair o token do header Authorization
    auth = request.headers.get("Authorization")
    token: Optional[str] = None
    if auth and auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1].strip()
    # Fallback: token definido pelo middleware em request.state
    if not token:
        token = getattr(request.state, "access_token", None)

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não autenticado")

    try:
        payload = decode_access_token(token)
        sub = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Inválido")

    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Payload de token inválido")

    user = db.query(User).filter(User.email == sub).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não encontrado")

    return user

# Dependência para usar nas rotas protegidas em que apenas admins podem acessar
def admin_required(current_user: User = Depends(get_current_user)):
    if not current_user.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user