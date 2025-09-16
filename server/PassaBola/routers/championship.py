from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.championship import createChampionship, ChampionshipOut
from crud import championship

router = APIRouter(prefix="/championship", tags=["championship"])

@router.post("/", response_model=ChampionshipOut)
def create_championship(data: createChampionship, db: Session = Depends(get_db)):
    return championship.create_championship(db, data)

@router.get("/admin", response_model=List[ChampionshipOut])
def list_championships_admin(db: Session =  Depends(get_db)):
    return championship.list_championships(db)

@router.get("/user/{user_id}", response_model=list[ChampionshipOut])
def list_championships_user(user_id: int, db: Session = Depends(get_db)):
    return championship.list_user_championships(db, user_id)
