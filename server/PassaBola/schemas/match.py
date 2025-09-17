from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GameOut(BaseModel):
    id: int
    championship_id: int
    round: int = 1
    home_team_name: Optional[str] = None
    away_team_name: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: Optional[str] = None

class GameListResponse(BaseModel):
    items: List[GameOut]
    page: int
    page_size: int
    total: int

class MeGame(BaseModel):
    id: int
    championship_id: int
    date: Optional[datetime] = None
    location: Optional[str] = None
    home_team_name: Optional[str] = None
    away_team_name: Optional[str] = None
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    status: Optional[str] = None

class MyGamesResponse(BaseModel):
    items: List[MeGame]
    page: int
    page_size: int
    total: int

class ScheduleGameIn(BaseModel):
    date: Optional[datetime] = Field(default=None, description="ISO 8601 datetime")
    location: Optional[str] = None

class ScoreGameIn(BaseModel):
    home_score: int = Field(ge=0)
    away_score: int = Field(ge=0)