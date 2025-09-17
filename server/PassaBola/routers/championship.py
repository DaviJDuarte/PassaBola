from typing import List, Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from db.database import get_db
from schemas.championship import createChampionship, ChampionshipOut, ChampionshipWithCount, ChampionshipListResponse
from crud import championship as championship_crud
from models.championship import Championship
from models.user_championship import UserChampionship
from models.user import User
from models.match import Match
from core.dependencies import get_current_user, admin_required

router = APIRouter(tags=["championships"])

@router.post("/championships", response_model=ChampionshipOut, status_code=status.HTTP_201_CREATED, dependencies=[Depends(admin_required)])
def create_championship_endpoint(data: createChampionship, db: Session = Depends(get_db)):
    return championship_crud.create_championship(db, data)

@router.get("/championships", response_model=ChampionshipListResponse, dependencies=[Depends(get_current_user)])
def list_championships(
    db: Session = Depends(get_db),
    status: Optional[str] = Query(None, pattern="^(open|closed|ongoing|completed)$"),
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    query = db.query(Championship)

    if q:
        query = query.filter(Championship.name.ilike(f"%{q}%"))

    if status:
        if status == "open":
            if hasattr(Championship, "is_closed"):
                query = query.filter(Championship.is_closed == False)  # noqa: E712
        else:
            if hasattr(Championship, "is_closed"):
                query = query.filter(Championship.is_closed == True)  # noqa: E712

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    out: list[ChampionshipWithCount] = []
    for c in items:
        participants_count = db.query(UserChampionship).filter(UserChampionship.championship_id == c.id).count()
        out.append(ChampionshipWithCount(
            id=c.id,
            name=getattr(c, "name", ""),
            number_players=getattr(c, "number_players", 0),
            is_closed=bool(getattr(c, "is_closed", False)),
            participants_count=participants_count,
        ))

    return ChampionshipListResponse(items=out, page=page, page_size=page_size, total=total)

@router.get("/championships/{championship_id}", response_model=ChampionshipWithCount, dependencies=[Depends(get_current_user)])
def get_championship(championship_id: int, db: Session = Depends(get_db)):
    c = db.query(Championship).filter(Championship.id == championship_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Championship not found")
    participants_count = db.query(UserChampionship).filter(UserChampionship.championship_id == c.id).count()
    return ChampionshipWithCount(
        id=c.id,
        name=getattr(c, "name", ""),
        number_players=getattr(c, "number_players", 0),
        is_closed=bool(getattr(c, "is_closed", False)),
        participants_count=participants_count,
    )

@router.post("/championships/{championship_id}/join", dependencies=[Depends(get_current_user)])
def join_championship(
    championship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = db.query(Championship).filter(Championship.id == championship_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Championship not found")

    if bool(getattr(c, "is_closed", False)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Championship is not open for signup")

    exists = db.query(UserChampionship).filter(
        UserChampionship.user_id == current_user.id,
        UserChampionship.championship_id == championship_id
    ).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Already joined")

    db.add(UserChampionship(user_id=current_user.id, championship_id=championship_id))
    db.commit()
    count = db.query(UserChampionship).filter(UserChampionship.championship_id == championship_id).count()
    return {"joined": True, "championship_id": championship_id, "participants_count": count}

@router.post("/championships/{championship_id}/close_signups", dependencies=[Depends(admin_required)])
def close_signups(
    championship_id: int,
    db: Session = Depends(get_db),
):
    c = db.query(Championship).filter(Championship.id == championship_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Championship not found")

    if getattr(c, "is_closed", False):
        created_games: list[dict] = []
        games = db.query(Match).filter(Match.championship_id == championship_id).all()
        for g in games:
            created_games.append({
                "id": g.id,
                "championship_id": g.championship_id,
                "round": 1,
                "home_team_name": None,
                "away_team_name": None,
                "date": getattr(g, "scheduled_at", None),
                "location": getattr(g, "location", None),
                "home_score": None,
                "away_score": None,
                "status": getattr(g, "status", None),
            })
        return {
            "championship": {
                "id": c.id,
                "name": getattr(c, "name", ""),
                "number_players": getattr(c, "number_players", 0),
                "is_closed": True,
            },
            "created_games": created_games,
        }

    if hasattr(c, "is_closed"):
        c.is_closed = True

    participants = db.query(UserChampionship).filter(UserChampionship.championship_id == championship_id).all()
    base_date = datetime.utcnow() + timedelta(days=3)
    created = []
    for i in range(0, max(0, len(participants) // 2)):
        m = Match(championship_id=championship_id)
        if hasattr(m, "scheduled_at"):
            m.scheduled_at = base_date + timedelta(days=i)
        if hasattr(m, "location"):
            m.location = f"Stadium {chr(65 + (i % 5))}"
        if hasattr(m, "status"):
            m.status = "scheduled"
        db.add(m)
        created.append(m)

    db.commit()
    for m in created:
        db.refresh(m)

    return {
        "championship": {
            "id": c.id,
            "name": getattr(c, "name", ""),
            "number_players": getattr(c, "number_players", 0),
            "is_closed": True,
        },
        "created_games": [
            {
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
            for m in created
        ],
    }

@router.get("/championships/{championship_id}/games", dependencies=[Depends(get_current_user)])
def list_championship_games(
    championship_id: int,
    db: Session = Depends(get_db),
    round: Optional[int] = Query(None, ge=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    q = db.query(Match).filter(Match.championship_id == championship_id)
    total = q.count()
    items = q.order_by(Match.scheduled_at.asc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "items": [
            {
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
            } for m in items
        ],
        "page": page,
        "page_size": page_size,
        "total": total,
    }