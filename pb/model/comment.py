from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey
from ..models import metadata
Base = declarative_base(metadata = metadata)
class Comment(Base):
    __tablename__ = 'comment'
    id = Column(Integer, primary_key = True)
    eventid = Column(Integer, ForeignKey('event.id'),nullable = False)
    userid = Column(Integer, ForeignKey('user.id'), nullable = False)
    #comments need not be attached to pictures
    pictureid = Column(Integer, ForeignKey('picture.id'), nullable = True)
    added = Column(DateTime, nullable = False)
    content = Column(Unicode, nullable = False)
    #comments need not reply to others
    repliesto = Column(Integer, ForeignKey('comment.id'), nullable = True)
    
    def __init__(self, **kwargs):
        for k,v in kawrgs.iteritems():
            self.__setattr__(k,v)
    def toGalleryDict(self):
        return {
            'id':self.id,
            'eventid': self.eventid,
            'userid':self.userid,
            'pictureid':self.pictureid,
            'added':self.added.ctime(),
            'content':self.content,
            'repliesto':self.repliesto
            }
