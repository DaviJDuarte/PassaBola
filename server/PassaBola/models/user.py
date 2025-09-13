import enum

from sqlalchemy import Integer, Column, String, Date, Boolean, Enum
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship

from db.database import Base

class PositionEnum(enum.Enum):
    goalkeeper = "goalkeeper"
    defender = "defender"
    midfielder = "midfielder"
    forward = "forward"


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True)
    document = Column(String)
    password_hash = Column(String)
    birth_date = Column(Date)
    admin = Column(Boolean)

    position = Column(Enum(PositionEnum, name="position_enum"), nullable=True)

    user_championship_links = relationship(
        'UserChampionship',
        back_populates='user',
        cascade='all, delete-orphan',
        lazy='selectin'
    )

    championships = association_proxy(
        'user_championship_links',
        'championship'
    )

    match_links = relationship('UserMatch', back_populates='user', cascade='all, delete-orphan', lazy='selectin')
    matches = association_proxy('match_links', 'match')
