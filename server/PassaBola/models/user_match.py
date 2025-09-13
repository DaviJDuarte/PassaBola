from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from db.database import Base

class UserMatch(Base):
    __tablename__ = 'user_match'

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    match_id = Column(Integer, ForeignKey('matches.id'), primary_key=True)

    team_side = Column(String)

    user = relationship('User', back_populates='match_links')
    match = relationship('Match', back_populates='participants')
