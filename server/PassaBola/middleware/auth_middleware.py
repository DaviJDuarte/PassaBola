from typing import Optional, Callable, Iterable

from jose import JWTError
from starlette.requests import Request
from starlette.responses import Response

from core.security import decode_access_token


class AuthMiddleware:
    def __init__(self, app, protected_prefixes: Optional[Iterable[str]] = None, exclude_prefixes: Optional[Iterable[str]] = None):
        self.app = app
        self.protected_prefixes = tuple(protected_prefixes or ())
        self.exclude_prefixes = tuple(exclude_prefixes or ("/auth",))

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope, receive=receive)

        # If path matches any exclude prefix, let it pass (endpoints themselves can still require auth)
        if self._is_excluded(request.url.path):
            await self.app(scope, receive, send)
            return

        token = self._extract_bearer(request)
        user_email = None

        if token:
            try:
                payload = decode_access_token(token)
                user_email = payload.get("sub")
                request.state.access_token = token
                request.state.user_email = user_email
            except JWTError:
                if self._is_protected(request.url.path):
                    await self._unauthorized(scope, receive, send, "Token inválido")
                    return

        if self._is_protected(request.url.path) and not user_email:
            await self._unauthorized(scope, receive, send, "Não autenticado")
            return

        await self.app(scope, receive, send)

    def _extract_bearer(self, request: Request) -> Optional[str]:
        auth = request.headers.get("Authorization")
        if not auth:
            return None
        if auth.lower().startswith("bearer "):
            return auth.split(" ", 1)[1].strip()
        return None

    async def _unauthorized(self, scope, receive, send, message: str):
        response = Response(
            content='{"detail": "' + message + '"}',
            status_code=401,
            media_type="application/json",
        )
        await response(scope, receive, send)

    def _is_protected(self, path: str) -> bool:
        return any(path.startswith(prefix) for prefix in self.protected_prefixes)

    def _is_excluded(self, path: str) -> bool:
        return any(path.startswith(prefix) for prefix in self.exclude_prefixes)