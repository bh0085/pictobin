<%inherit file="/base.mako" />
<%def name="body_contents()">
<h3> Thanks! 
<br/>
Your event's <i>Bin</i> has been created and you're all set to add photos to it!</h3>

<div class = "hero-unit">
<h2>Grab a link and share.</h2>
<p><h3>Link for gallery users:</h3></p>
<h4><a href=${links['users']}>Group Member link to: <b>${sessionInfo['eventInfo']['name']}.</b></a></h4>
<br/><br/>

<p><h3>Link for gallery administrators:</h3></p>
<h4><a href=${links['administrators']}>Admin link to: <b>${sessionInfo['eventInfo']['name']}.</b></a></h4>
<p>(Since we haven't gotten your email address, you'll want to make sure that you hold onto the admin link.)</p>
<br/><br/>

<p style="color:maroon">Users with links to this event- "${sessionInfo['eventInfo']['name']}", will have permisson to add, modify, and download all photos binned here. Please share it with any and all folks that were there!</p>



<p>To get back to this page, simply click "share" in the navbar.</p>


</div>
</%def>
