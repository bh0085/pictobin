from pyramid.response import Response
from pyramid.renderers import render_to_response

from pyramid.view import view_config
from sqlalchemy.exc import DBAPIError
from pyramid.httpexceptions import HTTPFound

import datetime ,json, os
from utils import (
    event_helpers as eh, 
    admin_helpers as ah,
    gallery_helpers as gh,
    file_helpers as fh,
    session_helpers as sh,
    image_helpers as ih,
    sync_helpers as yh,
    )
from models import (
    Event,
    Session,
    Picture
    )

default_cache=0

@view_config(route_name="splash",renderer='splash.mako',http_cache=default_cache)
def page_splash(request):
    return {}

@view_config(route_name="gallery",renderer='gallery.mako',http_cache=default_cache)
def page_gallery(request):
    key = request.matchdict['key']
    c= {}
    ah.addEventContext(key,c)
    return c

@view_config(route_name="administer",renderer='administer.mako',http_cache=default_cache)
def page_administer(request):
    output = {}
    key = request.matchdict['key']
    ah.addEventContext(key, output)
    return output

@view_config(route_name="make_event",http_cache=default_cache)
def make_event(request):
    creator_name = request.params['creator_name'] 
    name = request.params['name']
    description = request.params['description']
    location = request.params['location']
    
    e = Event(creator_name = creator_name,
              name = name,
              added = datetime.datetime.now(),
              description = description,
              location = location)
    
    Session.add(e)
    import transaction
    adminKey = e.admin_key
    transaction.commit()
    return HTTPFound(location="/sharelinks/{0}".format(adminKey))

@view_config(route_name="share_links",http_cache=default_cache)
def share_links(request):
    '''links offered up on creation or "share"'''
    c = {}
    key = request.matchdict['key']
    ah.addEventContext(key, c)
    event,permissions = eh.eventAndPermissionsForAccessKey(key)
    if permissions.administer:
        return render_to_response('share_admin.mako',
                                  c,
                                  request=request)
    else:
        return render_to_response('share.mako',
                                  c,
                                  request=request)

@view_config(route_name="get_pics_json",http_cache=default_cache,renderer='json')
def getPicsJSON(request):
    key=request.matchdict['key']
    return gh.pics(key)

@view_config(route_name="uploads_posted",http_cache=default_cache,renderer='json')
def uploads_posted(request):
        eventKey = request.matchdict['key']
        event,permissions = eh.eventAndPermissionsForAccessKey(eventKey)
        storage_dir = '/data/pictobin/uploads'
        values =  request.POST.values()
        if len(values) == 0:
            return json.dumps([])
 
        outs = []
        for v in values:
            picInfo = request.params.get('picInfo', 
                                         {'name':'untitled',
                                          'creator_name':'anonymous'                                          })
        
            fdata = v.file.read()
            newPicture = Picture(creator_name = picInfo['creator_name'],
                                 event = event,
                                 name = picInfo['name'],
                                 added = datetime.datetime.now(), 
                                 )
            Session.add(newPicture);
            Session.flush();
            rowId = newPicture.id
            fpath_raw =  fh.getFilePathByPictureId(rowId, 'raw')
            with open(fpath_raw,'w') as f: f.write(fdata)
            from models import PictureMeta
            from PIL import Image
            from PIL.ExifTags import TAGS

            def get_exif(fn):
                ret = {}
                i = Image.open(fn)
                info = i._getexif()
                for tag, value in info.items():
                    decoded = TAGS.get(tag, tag)
                    ret[decoded] = value
                return ret
            filetags = get_exif(fpath_raw)
            for k,v in filetags.iteritems():
                try:
                    m = PictureMeta(key = k, value = json.dumps(v),source='exif',
                                    picture = newPicture)
                    Session.add(m)
                except UnicodeDecodeError:
                    continue
                    
            fpath_800 = ih.makeC800(rowId)
            ih.updateThumbs(rowId)
            newPicture.filename = fpath_800
            outs.append( { 
                    "picInfo":newPicture.toGalleryDict(),
                    "name":picInfo['name'],
                    "filename":fpath_800,
                    "size":len(fdata),
                    "url":fh.getFileAddressByPictureId(rowId),
                    "thumbnail_url":fh.getThumbnailAddressByPictureId(rowId,'small'),
                    "delete_url":"/uploads/deleteOne?id={0}".format(rowId),
                    "delete_type":"DELETE"
                    })

        import transaction
        transaction.commit();
        return outs

@view_config(route_name="sync_pictures",http_cache=default_cache,renderer='json')
def sync_pictures(request):
    key = request.matchdict['key']
    allpics =json.loads( request.params['picsListJSON'])
    pictures = []
    for a in allpics:
        ent = yh.updatePicture(a)
        pictures.append(ent)
    out = [e.toGalleryDict() for e in pictures]
    import transaction
    transaction.commit()
    return out
