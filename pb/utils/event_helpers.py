'''
event_helpers.py

Helps out with event permissions and translation of URL keys.
'''

from ..models import Session, Event

class EventPermissions(object):
    def __init__(self, eventId, view = True, modify = True, administer = False):
        self.view = view
        self.modify = modify
        self.administer = administer
    def JSON(self):
        return {
            'view':self.view,
            'modify':self.modify,
            'administer':self.administer
            }

def eventAndPermissionsForAccessKey(key):
    if key[:3] == 'adm':
        event = Session.query(Event).filter(Event.admin_key==key).one()
        permissions = EventPermissions(event.id, administer = True)
    else:
        event = Session.query(Event).filter(Event.key==key).one()
        permissions = EventPermissions(event.id)
    return event, permissions;
    
