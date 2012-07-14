from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Unicode, DateTime, ForeignKey, Index
from event import Event
from ..models import metadata

Base = declarative_base(metadata = metadata)
class Picture(Base):
    __tablename__ = 'picture'

    id = Column(Integer, primary_key=True)
    name = Column(Unicode, nullable=False)
    creator_name = Column(Unicode, nullable = True)
    
    creatorid = Column(Integer, ForeignKey('user.id'), nullable = True, index = True)
    added = Column(DateTime, nullable=False)
    gallery_id = Column(Integer, ForeignKey('event.id'), index = True)
    filename = Column(Unicode, nullable = True)
    def __init__(self,**kwargs):
        for k,v in kwargs.iteritems():
            self.__setattr__(k,v)
    def toGalleryDict(self):
        metas = dict([(m.key,m.value) for m in self.metadata])
        if metas.has_key('DateTimeOriginal'):
            import json
            import datetime, dateutil.parser
            val = json.loads(metas['DateTimeOriginal'])
            parsed = dateutil.parser.parse(val)
            td = (parsed - datetime.datetime(1986,4,22) )
            age = td.days * 60*60*24 + td.seconds
        else:
            age = 0
            
        from ..utils import file_helpers as fh
        return {
       
            'id':self.id,
            'name':self.name,
            'creator_name':self.creator_name,
            'added':self.added.ctime(),
            'gallery_id':self.gallery_id,
            'file_address':fh.getFileAddressByPictureId(self.id),
            'file_name':fh.getFileNameByPictureId(self.id),
            'small_thumbnail_address':\
                fh.getThumbnailAddressByPictureId(self.id,'small'),
            'big_thumbnail_address':\
                fh.getThumbnailAddressByPictureId(self.id,'big'),
            'meta':metas,
            'age':age
            
            }
    def takenDateString(self):
        metas = dict([(m.key,m.value) for m in self.metadata])
        if metas.has_key('DateTimeOriginal'):
            import json
            import datetime, dateutil.parser
            val = json.loads(metas['DateTimeOriginal'])
            return val
        else:
            return "Unknown date";

    def addedString(self):
        return self.added.ctime()

Base = declarative_base(metadata = metadata)
class PictureMeta(Base):
    __tablename__ = 'picturemeta'
    id = Column(Integer, primary_key = True)
    key = Column(Unicode, nullable = False, index = True)
    value = Column(Unicode, nullable = False)
    source = Column(Unicode, nullable = True)
    picture_id = Column(Integer, ForeignKey('picture.id'),  nullable = False,index = True)
    def __init__(self,**kwargs):
        for k,v in kwargs.iteritems():
            self.__setattr__(k,v)
    def __repr__(self):
        return '{0}: {1}'.format(self.key,self.value)
