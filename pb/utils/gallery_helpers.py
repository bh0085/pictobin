import json
import event_helpers as eh
from ..models import *

def pics(key, **kwargs):
    '''gallery pics list, JSON formatted'''
    event, permissions = eh.eventAndPermissionsForAccessKey(key)
    if not permissions.view:
        raise Exception("Inadequate access perms")

    query = Session.query(Picture).filter(Picture.event == event)

    if kwargs.get('maxid', None) is not None:
        query = query.filter(Picture.id > kwargs['maxid'])


    query = query.order_by('id')
    if 'offset' in kwargs:
        query = query.offset(kwargs['offset'])
    if 'limit' in kwargs:
        query = query.limit(kwargs['limit'])


    
    pic_dicts =[ p.toGalleryDict() for p in query.all() ]
    return pic_dicts
