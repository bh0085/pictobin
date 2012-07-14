from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey, Boolean, UniqueConstraint
from ..models import metadata

Base = declarative_base(metadata = metadata)
class User(Base):
    __tablename__='user'
    id = Column(Integer, primary_key = True)
    name = Column(Unicode, nullable = True)
    added = Column(DateTime, nullable = False)
    confirmed = Column(Boolean, nullable = False)
    def __init__(self, **kwargs):
        for k,v in kwargs.iteritems():
            self.__setattr__(k,v)            

    def toGalleryDict(self):
        return {
            'id':self.id,
            'name':self.name if self.confirmed else 'anonymous',
            'added':self.added.ctime(),
            'confirmed':self.confirmed
            }

    def displayText(self):
        return self.name if self.confirmed else 'anonymous'

Base = declarative_base(metadata = metadata)
class UserEvent(Base):
    __tablename__='userevent'
    id = Column(Integer,primary_key = True)
    userid = Column(Integer, ForeignKey('user.id'), nullable = False, index=True)
    eventid = Column(Integer, ForeignKey('event.id'), nullable = False)
    UniqueConstraint('eventid', 'userid')
    def __init__(self, **kwargs):
        for k,v in kwargs.iteritems():
            self.__setattr__(k,v)
    
Base = declarative_base(metadata = metadata)
class UserEmail(Base):
    __tablename__='useremail'
    id = Column(Integer, primary_key = True)
    userid = Column(Integer, ForeignKey('user.id'), nullable = False)
    email = Column(Unicode, nullable = False)
    def __init__(self, **kwargs):
        for k,v in kargs.iteritems():
            self.__setattr__(k,v)
    
Base = declarative_base(metadata = metadata)
class UserEventPref(Base):
    __tablename__='usereventpref'
    id = Column(Integer, primary_key = True)
    eventid = Column(Integer,ForeignKey('event.id'), nullable = False)
    userid = Column(Integer, ForeignKey('user.id'), nullable = False,index = True)
    key = Column(Unicode, nullable = False, index = True)
    value = Column(Unicode, nullable = False)
    UniqueConstraint('key', 'eventid', 'userid')
    def __init__(self, **kwargs):
        for k,v in kargs.iteritems():
            self.__setattr__(k,v)
        
Base = declarative_base(metadata = metadata)
class UserPref(Base):
    __tablename__='userpref'
    id =  Column(Integer, primary_key = True)
    userid = Column(Integer, ForeignKey('user.id'), nullable = False, index = True)
    key = Column(Unicode, nullable = False, index = True)
    value = Column(Unicode, nullable = False)
    UniqueConstraint('key', 'userid')
    def __init__(self, **kwargs):
        for k,v in kargs.iteritems():
            self.__setattr__(k,v)    
