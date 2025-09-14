import enum

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MatchStatus(enum.Enum):
    scheduled = 'scheduled'
    in_progress = 'in_progress'
    finished = 'finished'
    canceled = 'canceled'

class CreateMatch(BaseModel):
    championship_id: int
    scheduled_at: datetime
    location: str

class MatchOut(BaseModel):
    id: int
    championship_id: int
    scheduled_at: datetime
    location: str
    status: MatchStatus
    class Config:
        from_attributes = True