from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from db.database import get_db
from models.match import Match
from models.user_match import UserMatch
from models.user import User
from core.dependencies import get_current_user, admin_required

router = APIRouter(tags=["games"])

@router.get("/games/{game_id}", dependencies=[Depends(get_current_user)])
def get_game(game_id: int, db: Session = Depends(get_db)):
    m = db.query(Match).filter(Match.id == game_id).first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    return {
        "id": m.id,
        "championship_id": m.championship_id,
        "round": 1,
        "home_team_name": None,
        "away_team_name": None,
        "date": getattr(m, "scheduled_at", None),
        "location": getattr(m, "location", None),
        "home_score": None,
        "away_score": None,
        "status": getattr(m, "status", None),
    }

@router.patch("/games/{game_id}/schedule", dependencies=[Depends(admin_required)])
def schedule_game(
    game_id: int,
    payload: dict,
    db: Session = Depends(get_db),
):
    m = db.query(Match).filter(Match.id == game_id).first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")

    date = payload.get("date")
    location = payload.get("location")

    if date:
        try:
            parsed = datetime.fromisoformat(str(date).replace("Z", "+00:00"))
            if hasattr(m, "scheduled_at"):
                m.scheduled_at = parsed
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format (use ISO 8601)")
    if location and hasattr(m, "location"):
        m.location = location

    if hasattr(m, "status"):
        m.status = "scheduled"

    db.commit()
    db.refresh(m)
    return {
        "id": m.id,
        "championship_id": m.championship_id,
        "round": 1,
        "home_team_name": None,
        "away_team_name": None,
        "date": getattr(m, "scheduled_at", None),
        "location": getattr(m, "location", None),
        "home_score": None,
        "away_score": None,
        "status": getattr(m, "status", None),
    }

@router.patch("/games/{game_id}/score", dependencies=[Depends(admin_required)])
def set_score(
    game_id: int,
    payload: dict,
    db: Session = Depends(get_db),
):

    m = db.query(Match).filter(Match.id == game_id).first()
    if not m:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")

    if getattr(m, "status", None) == "finished":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Game already completed")

    # TODO Criar colunas de pontuação

    _home_score = payload.get("home_score")
    _away_score = payload.get("away_score")
    if not isinstance(_home_score, (int, float)) or not isinstance(_away_score, (int, float)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid score values")

    if hasattr(m, "status"):
        m.status = "finished"

    db.commit()
    db.refresh(m)
    return {
        "game": {
            "id": m.id,
            "championship_id": m.championship_id,
            "round": 1,
            "home_team_name": None,
            "away_team_name": None,
            "date": getattr(m, "scheduled_at", None),
            "location": getattr(m, "location", None),
            "home_score": _home_score,
            "away_score": _away_score,
            "status": getattr(m, "status", None),
        },
        "advanced": False,
        "championship_completed": False,
    }

@router.get("/me/games", dependencies=[Depends(get_current_user)])
def my_games(
    status: str = Query(..., pattern="^(upcoming|completed)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statuses = ["scheduled"] if status == "upcoming" else ["finished"]

    base = (
        db.query(Match)
        .join(UserMatch, UserMatch.match_id == Match.id)
        .filter(UserMatch.user_id == current_user.id)
        .filter(Match.status.in_(statuses))
    )

    total = base.count()
    items = base.order_by(Match.scheduled_at.asc()).offset((page - 1) * page_size).limit(page_size).all()

    def to_me_game(m: Match) -> dict:
        return {
            "id": m.id,
            "championship_id": m.championship_id,
            "date": getattr(m, "scheduled_at", None),
            "location": getattr(m, "location", None),
            "home_team_name": None,
            "away_team_name": None,
            "home_score": None,
            "away_score": None,
            "status": getattr(m, "status", None),
        }

    return {
        "items": [to_me_game(m) for m in items],
        "page": page,
        "page_size": page_size,
        "total": total,
    }