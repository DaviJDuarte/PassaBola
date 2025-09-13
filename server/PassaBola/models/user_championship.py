from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base

class UserChampionship(Base):
    __tablename__ = 'user_championship'

    user_id = Column(ForeignKey('users.id'), primary_key=True)
    championship_id = Column(ForeignKey('championships.id'), primary_key=True)

    user = relationship('User', back_populates='user_championship_links')
    championship = relationship('Championship', back_populates='user_championship_links')
