from pyramid import url

#def  getUserName():
#    event = getEvent()
#    keys = []
#    if event != None:
#        keys.append('uname-{0}'.format( event.id))
#    keys.append('uname-default')
#
#    for k in keys:
#        if k in request.cookies.keys():
#            return request.cookies[k]
#    
#    request.cookies['uname-default'] =  'anonymous'
#    response.set_cookie('uname-default', 'anonymous') 
#    return 'anonymous'
#    
#
#def setUserName(name,setDefault):
#    event = getEvent()
#    ekey = 'uname-{0}'.format( event.id)
#
#    response.set_cookie(ekey,name)
#    if setDefault:
#        response.set_cookie('uname-default',name)
#

def getUser():
    uname  = request.environ.get("REMOTE_USER");

