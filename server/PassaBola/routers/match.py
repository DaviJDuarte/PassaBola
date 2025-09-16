from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.match import CreateMatch, MatchOut
from crud import match

from schemas.championship import ChampionshipOut

router = APIRouter(prefix="/match", tags=["match"])

@router.post("/", response_model=MatchOut)
def add_match(data: CreateMatch, db: Session = Depends(get_db)):
    return match.create_match(db, data)

@router.get("/championship/{champion_id}", response_model=list[MatchOut])
def list_matches_championship(champion_id: int, db: Session = Depends(get_db)):
    return match.list_matches_championship(db)


