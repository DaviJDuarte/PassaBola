from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from db.database import create_tables
from middleware.auth_middleware import AuthMiddleware
from routers.auth_router import router as auth_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Garantir que as tabelas foram criadas antes de iniciar a aplicação
    from models import user as _user  # noqa: F401
    from models import championship as _championship  # noqa: F401
    from models import user_championship as _user_championship  # noqa: F401
    from models import match as _match # noqa: F401
    from models import user_match as _user_match # noqa: F401

    create_tables()
    yield

from routers import championship, match
app = FastAPI(
    title="Passa Bola",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

@app.get("/health")
def health():
    from datetime import datetime, timezone
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(championship.router)
app.include_router(match.router)

app.add_middleware(AuthMiddleware, protected_prefixes=["/"], exclude_prefixes=["/auth"])

app.include_router(auth_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)