from sqlalchemy.orm import Session
from models.championship import Championship
from models.user_championship import UserChampionship
from schemas.championship import createChampionship

from models import user_championship


def create_championship(db: Session, data: createChampionship):
    championship = Championship(number_players=data.number_players, name=data.name)
    db.add(championship)
    db.commit()
    db.refresh(championship)
    return championship

def list_championships(db: Session):
    return db.query(Championship).all()

def list_user_championships(db: Session, user_id: int):
    return db.query(Championship).join(user_championship).filter(UserChampionship.user_id == user_id).all()
