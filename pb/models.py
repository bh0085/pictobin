from sqlalchemy import (
    Column,
    Integer,
    Text,
    MetaData
    )

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    scoped_session,
    sessionmaker,
    relation,
    )

from zope.sqlalchemy import ZopeTransactionExtension

Session = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
import model
from model.meta import metadata
from model.event import Event
from model.picture import Picture, PictureMeta
from model.favorite import Favorite
from model.comment import Comment
from model.user import User, UserEvent, UserEmail, UserPref, UserEventPref

Picture.event = relation(Event, backref='pictures')
PictureMeta.picture = relation(Picture, backref ='metadata')
