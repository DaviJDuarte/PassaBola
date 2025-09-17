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

class ChampionshipWithCount(BaseModel):
    id: int
    name: str
    number_players: int
    is_closed: bool
    participants_count: int

    class Config:
        from_attributes = True

class ChampionshipListResponse(BaseModel):
    items: list[ChampionshipWithCount]
    page: int
    page_size: int
    total: int