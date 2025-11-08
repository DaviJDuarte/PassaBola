from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship
from db.database import Base

class Championship(Base):
    __tablename__ = 'championships'
    number_players = Column(Integer)
    name = Column(String)
    is_closed = Column(Boolean, default=False)

    id = Column(Integer, primary_key=True, index=True)

    user_championship_links = relationship(
        'UserChampionship',
        back_populates='championship',
        cascade='all, delete-orphan',
        lazy='selectin'
    )

    users = association_proxy(
        'user_championship_links',
        'user'
    )

    matches = relationship('Match', back_populates='championship', cascade='all, delete-orphan', lazy='selectin')
