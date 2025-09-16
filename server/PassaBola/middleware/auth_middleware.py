from typing import Callable, Iterable, Optional

from fastapi import Request, Response
from jose import JWTError

from core.security import decode_access_token

class AuthMiddleware:
    def __init__(self, app, protected_prefixes: Optional[Iterable[str]] = None):
        self.app = app
        self.protected_prefixes = tuple(protected_prefixes or ())

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope, receive=receive)
        token = self._extract_bearer(request)
        user_email = None

        if token:
            try:
                payload = decode_access_token(token)
                user_email = payload.get("sub")
                request.state.access_token = token
                request.state.user_email = user_email
            except JWTError:
                # Se a rota for protegida, retornar um erro 401
                if self._is_protected(request.url.path):
                    await self._unauthorized(send, "Token inválido")
                    return

        if self._is_protected(request.url.path) and not user_email:
            await self._unauthorized(send, "Não autenticado")
            return

        await self.app(scope, receive, send)

    def _extract_bearer(self, request: Request) -> Optional[str]:
        auth = request.headers.get("Authorization")
        if not auth:
            return None
        if auth.lower().startswith("bearer "):
            return auth.split(" ", 1)[1].strip()
        return None

    async def _unauthorized(self, send: Callable, message: str):
        response = Response(
            content='{"detail": "' + message + '"}',
            status_code=401,
            media_type="application/json",
        )
        await response(send)

    def _is_protected(self, path: str) -> bool:
        return any(path.startswith(prefix) for prefix in self.protected_prefixes)