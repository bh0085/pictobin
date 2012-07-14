from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey
from ..models import metadata
import math, random

Base = declarative_base(metadata = metadata)
class Event(Base):
    __tablename__ = 'event'

    id = Column(Integer, primary_key=True)
    name = Column(Unicode, nullable=False)
    creator_name = Column(Unicode, nullable = True)
    creatorid = Column(Integer, ForeignKey('user.id'), nullable =True, index = True)
    description = Column(Unicode)
    location = Column(Unicode)
    added = Column(DateTime, nullable=False)
    admin_key = Column(Unicode, nullable=False, unique=True, index =True)
    key=Column(Unicode,nullable=False, unique=True, index = True)

    def __init__(self,**kwargs):
        for k,v in kwargs.iteritems():
            self.__setattr__(k,v)
            
        from ..models import Session
        while 1:
            admin_key = 'adm{0}'.format(int(math.floor(random.random() * 1e10)))
            if(Session.query(Event).filter(Event.admin_key==admin_key).count()==0):
                break
        while 1:
            key = '{0}'.format(int(math.floor(random.random() * 1e10)))
            if(Session.query(Event).filter(Event.key==key).count()==0):
                break
        self.key = key
        self.admin_key = admin_key

    def toGalleryDict(self):
        return {
            'id':self.id,
            'name':self.name,
            'creator_name':self.creator_name,
            'added':self.added.ctime(),
            'location':self.location,
            'description':self.description
            }
