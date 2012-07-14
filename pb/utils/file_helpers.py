'''
utils/file_helpers.py

Defines default locations for file storage including 
addresses for the rescources on the server. 
'''

import os

#PICTURES

def getFileNameByPictureId(rowId, size='compressed800'):
    '''Picture file name from an id.'''
    fname ='{0}_{1}.jpg'.format(rowId,size)
    return fname

def getFilePathByPictureId(rowId,size = 'compressed800'):
    '''Picture file path from an id.'''
    storage_dir = '/data/pictobin/uploads'
    fname =getFileNameByPictureId(rowId, size=size)
    fpath =  os.path.join(storage_dir,fname)
    return fpath

def getFileAddressByPictureId(rowId, size = 'compressed800'):
    '''Picture file address on the server from an id.'''
    fname =getFileNameByPictureId(rowId,size=size)
    return os.path.join("/uploaded/","{0}".format(fname))

#THUMBNAILS

def getThumbnailPathByPictureId(rowId,size):
    '''Picture thumbnail file path by id and size.'''
    storage_dir = '/data/pictobin/uploads/{0}_thumbs'.format(size)
    fname =getFileNameByPictureId(rowId)
    fpath =  os.path.join(storage_dir,fname)
    return fpath

def getThumbnailAddressByPictureId(rowId, size):
    '''Picture thumbnail file path by id and size.'''
    fname =getFileNameByPictureId(rowId)
    return os.path.join("/uploaded/{1}_thumbs/{0}".format(fname,size))


def getTempDir():
    temp_dir = '/data/pictobin/temp'
    if not os.path.isdir(temp_dir): os.mkdir(temp_dir)
    count = len(os.listdir(temp_dir))
    foldername = '{0}'.format(count)
    dirname= os.path.join(temp_dir, foldername)
    os.makedirs(dirname)
    return dirname

from pyramid import config
def linkTempFile(fullpath):
    raise Exception('replace pylons.paths')
    staticTempDir = os.path.join(config['pylons.paths']['static_files'],'temp/')
    staticTempAddress = os.path.relpath(fullpath, '/data/pictobin/temp/')
    link_location =  os.path.join(staticTempDir,staticTempAddress)
    os.makedirs(os.path.dirname(link_location))
    os.symlink(fullpath, link_location)
    browserAddress = os.path.relpath(fullpath, '/data/pictobin/')
    return '/' + browserAddress;
    
