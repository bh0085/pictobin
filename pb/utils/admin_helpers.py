'''
admin_helpers.py

Manages administration, permissions, access and a bit of templating context.
'''
import event_helpers as eh


def addEventContext(key,c):
    '''Adds a few keys describign the current session to the context'''
    event, permissions = eh.eventAndPermissionsForAccessKey(key)
    c['sessionInfo'] = {
            'galleryId':event.id,
            'eventInfo':event.toGalleryDict(),
            'permissions':permissions.JSON()
            }
    c['links'] = {
        'administrators':'/gallery/{0}'.format(event.admin_key),
        'users':'/gallery/{0}'.format(event.key)
        }
    c['bestKey'] = event.admin_key if permissions.administer else event.key
