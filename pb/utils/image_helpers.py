'''
utils/image_helpers.py

Image utilities that may be reused. Mostly, generates thumbnails!
'''

import subprocess as spc, os;

size_lookup = {
    'big':100,
    'small':32
}

def updateThumbs(rowId, sizes = ['big', 'small']):
    import file_helpers as fh
    filePath = fh.getFilePathByPictureId(rowId)
    for s in sizes:
        newPath = fh.getThumbnailPathByPictureId(rowId,s)
        if not os.path.isdir(os.path.dirname(newPath)):
            os.makedirs(os.path.dirname(newPath))

        cmd = "convert {0} -resize {1} {2}"\
            .format(filePath, size_lookup[s], newPath)
        prc = spc.Popen(cmd, shell = True, stdout = spc.PIPE)
        print "Beginning thumbnail conversion for {0} to {1}".format(rowId, s)
        result = prc.communicate()
        print "Finished conversion".format(rowId)
    print "Finished all conversions for {0}".format(rowId)        
    
def makeC800(rowId):
    import file_helpers as fh
    fpath_raw =  fh.getFilePathByPictureId(rowId, 'raw')
    fpath_800 =  fh.getFilePathByPictureId(rowId, 'compressed800')
    cmd = "convert {0} -resize {1} {2}"\
            .format(fpath_raw, 800, fpath_800)
    print "Beginning c800 conversion for {0} to {1}".format(rowId, 800)
    prc = spc.Popen(cmd, shell = True, stdout = spc.PIPE)
    result = prc.communicate()
    print "Finished c800 conversion for {0}".format(rowId)
    return fpath_800
