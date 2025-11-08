import enum

from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from db.database import Base

class MatchStatus(enum.Enum):
    scheduled = 'scheduled'
    in_progress = 'in_progress'
    finished = 'finished'
    canceled = 'canceled'

class Match(Base):
    __tablename__ = 'matches'

    id = Column(Integer, primary_key=True, index=True)
    championship_id = Column(Integer, ForeignKey('championships.id'), nullable=False)

    scheduled_at = Column(DateTime, nullable=True)
    location = Column(String)
    status = Column(Enum(MatchStatus), default=MatchStatus.scheduled, nullable=False)

    score_home = Column(Integer)
    score_away = Column(Integer)

    championship = relationship('Championship', back_populates='matches', lazy='joined')

    participants = relationship(
        'UserMatch',
        back_populates='match',
        cascade='all, delete-orphan',
        lazy='selectin'
    )

    users = association_proxy('participants', 'user')
