from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey
from ..models import metadata
Base = declarative_base(metadata = metadata)
class Favorite(Base):
    __tablename__ = 'favorite'
    id = Column(Integer, primary_key = True)
    eventid = Column(Integer, ForeignKey('event.id'), nullable = False, index = True)
    userid = Column(Integer, ForeignKey('user.id'), nullable = False)
    pictureid = Column(Integer, ForeignKey('picture.id'), nullable = False)
    added = Column(DateTime, nullable = False)
    def __init__(self, **kwargs):
        for k,v in kwargs.iteritems():
            self.__setattr__(k,v)
    def toGalleryDict(self):
        return {
            'id':self.id,
            'added':self.added.ctime(),
            'userid':self.userid,
            'eventid':self.eventid,
            'pictureid':self.pictureid
            }
    
