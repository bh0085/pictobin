import json
import event_helpers as eh

def  pics(key):
        '''gallery pics list, JSON formatted'''
        event, permissions = eh.eventAndPermissionsForAccessKey(key)
        if not permissions.view:
            raise Exception("Inadequate access perms")
        pic_dicts =[ p.toGalleryDict() 
                     for p in event.pictures ]
        return pic_dicts
