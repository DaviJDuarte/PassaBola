from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class createChampionship(BaseModel):
    name: str
    number_players: int

class ChampionshipOut(BaseModel):
    id: int
    name: str
    number_players: int
    is_closed: bool

    class Config:
        from_attributes = True