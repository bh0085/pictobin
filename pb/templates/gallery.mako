<%inherit file="/base.mako" />
<%def name="body_contents()">

<style type="text/css">
  .sidebar-nav {
  padding: 9px 0;
  }
</style>


<div class="container-fluid">
  <div class="row-fluid" style="z-index:100; position:relative;">
    <div class="aggregateGalleryContainer" name='highlights'>
      <div class="span12">
	<h3>Event Highlights</h3>
      </div>
      <br/>
      <br/>
      <div class="galleryRow">
      </div>
    </div>
  </div>
  <br/>

  <div class="row-fluid">
    <div class="span2">
      <div class="well sidebar-nav">
	<ul class="nav nav-list">
	  <li class="nav-header nav-sort">Sort</li>
          <li class="nav-item nav-sort" ngroup="sort">
	    <a href="#" name="time">Date</a></li>
          <li class="nav-item nav-sort" ngroup="sort">
	    <a href="#" name="favorites">Favorites</a></li>
          <li class="nav-item nav-sort" ngroup="sort">
	    <a href="#" name="name">Name</a></li>
          <li class="nav-item nav-sort" ngroup="sort">
	    <a href="#" name="comments">Comments</a></li>
          <li class="nav-header nav-group">Group</li>
          <li class="nav-item nav-group" ngroup="group">
	    <a href="#" name="single">One</a></li>
          <li class="nav-item nav-group" ngroup="group">
	    <a href="#" name="creator">Creator</a></li>
          <li class="nav-item nav-group" ngroup="group">
	    <a href="#" name="day">Day</a></li>
          <li class="nav-header nav-filter">Filter</li>
          <li class="nav-item nav-filter" ngroup="filter">
	    <a href="#" name="mine">Mine</a></li>
	</ul>
      </div><!--/.well -->
      <div class="sidebar-nav" style="position:relative;">

	<div class="row-fluid">
	  <div class="span12">
	    <span class="btn btn-primary btn-large sidebar-clicker download-button" onClick="downloadAlbum()">
	      <script>
		function downloadAlbum(ev){
		var keyCode="${bestKey | n}"
                $.ajax({
                       type: "get",
                       url: "/export/downloadEvent/"+keyCode,
                       /*data: JSON.stringify({}),*/
                       dataType: "json",
                       success: function(data, textStatus) {
		console.log("SUCCESS")
                           if (data.redirect) {
                               // data.redirect contains the string URL to redirect to
                               window.location.href = data.redirect;
                           }
                           else {
                               // data.form contains the HTML for the replacement form
                               $("#myform").replaceWith(data.form);
                           }
                       }
                   });
		}
	      </script>
	      <i class="icon-download-alt icon-white"></i>
	    </span>
	  </div>
	</div>
	<%include file="/gallery_includes/fileUploadTemplatesAndGallery.mako"/>
      </div>
    </div><!--/span-->
    <div class="span10">
      <div class="container-fluid galleriesContainer">
      </div>
      <div class="row-fluid">
	<div class="span12">
	  <p style="text-align:center;">
	    <i>${sessionInfo['eventInfo']['name']}</i> 
	    was created by ${sessionInfo['eventInfo']['creator_name']} 
	    on ${sessionInfo['eventInfo']['added']}.
	  </p>
	</div>
      </div>


    </div> <!--closes span9 -->
  </div> <!--closes row-fluid-->
</div> <!--closes container-fluid-->


<div class="big-hint">
  <h3>Drag JPEGs onto your browser and lets get moving!</h3>
</div>

</%def>
