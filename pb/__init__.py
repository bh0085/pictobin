from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from .models import Session

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    Session.configure(bind=engine)
    config = Configurator(settings=settings)
    
    #primary destinations
    config.add_route('splash', '/splash')
    config.add_route('gallery', '/gallery/{key}')

    #secondary destinations
    config.add_route('administer', '/administer/{key}')
    config.add_route('make_event', '/makeevent')
    config.add_route('share_links','/sharelinks/{key}')

    #json return routes for posting, refreshing, and syncing pictures
    config.add_route('get_pics_json','/pics/getPicsJSON/{key}')
    config.add_route('uploads_posted','/uploads/posted/{key}')
    config.add_route('sync_pictures','/sync/pictures/{key}')

    #static routing
    config.add_static_view('/', 'public', cache_max_age=1)
    config.scan()
    
    return config.make_wsgi_app()

