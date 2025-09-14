from sqlalchemy import Session
from models.match import Match
from models.user_match import UserMatch
from schemas.match import CreateMatch

def create_match(db:Session, data:CreateMatch):
    match = Match(championship_id=data.championship_id, scheduled_at=data.scheduled_at,location=data.location)
    db.add(match)
    db.commit()
    db.refresh(match)
    return match

def list_matches_championships(db:Session, championship_id:int):
    return db.query(Match).filter(Match.championship_id == championship_id).all()

def list_future_matches(db:Session, championship_id:int):
    return db.query(Match).filter(Match.championship_id == championship_id).filter(Match.status == 'scheduled').all()