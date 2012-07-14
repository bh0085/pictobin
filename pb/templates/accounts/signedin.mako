<%inherit file="/base.mako"/>

<%def name="title()">Signed In</%def>
<%def name="head_tags()"><h1>Signed In</h1></%def>

<p>You are signed in as ${request.environ['REMOTE_USER']}.
<a href="${h.url(controller='account', action='signout')}">Sign out</a></p>
