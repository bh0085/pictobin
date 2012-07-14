'''
sync_helpers.py

Functions mapping data from ajax requests to DB entities.
'''

from ..models import Picture, Session

picSyncedFields = [
    'creator_name', 'name'
    ]
def updatePicture(d):
    picId = d['id']
    ent = Session.query(Picture).filter(Picture.id==picId).one()
    for f in picSyncedFields:
        setattr(ent,f,d[f])
    Session.flush()
    return ent
