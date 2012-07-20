
<%inherit file="base.mako"/>


<%def name="body_contents()">


<!--file upload (hidden) form -->
<div class="container-fluid">


  <div class="row-fluid">

    <div class="span12">


      <ul class="nav nav-pills">
        <li class="active">
          <a href="#" onclick='render_norm()'>List</a>
        </li>      
        <li>
          <a href="#" onclick='render_group()'>Groups</a>
        </li>
        <li class="button">
          <a href="#" onclick='cache.fetch({data:{offset:cache.models.length, limit:5}, add:true})'>Get more data</a>
        </li>
        <li class="button">
          <a href="#" onclick='cache.fetch({add:false})'>Get all data</a>
        </li>    
<!--        <li class="right" style="float:right;">
          <a href="#" onclick='$(".pic-info").hide()'>Hide Labels</a>
        </li>    -->
        <li style="float:right;">
          <a href="#" onclick='curview.changeSize("mid")'>Preview Mode</a>
        </li>
        <li style="float:right;">
          <a href="#" onclick='curview.changeSize("big")'>Full Mode</a>
        </li>
      </ul>


      <%include file="/gallery_includes/fileUploadTemplatesAndGallery.mako"/>


      <div class="container-fluid galleriesContainer">
      </div>


      <!-- footer -->
      <div class="row-fluid">
      	<div class="span12">
      	  <p style="text-align:center;">
      	    <i>${sessionInfo['eventInfo']['name']}</i> 
      	    was created by ${sessionInfo['eventInfo']['creator_name']} 
      	    on ${sessionInfo['eventInfo']['added']}.
      	  </p>
      	</div>
      </div>


    </div> <!--closes span12 -->
  </div> <!--closes row-fluid-->
</div> <!--closes container-fluid-->


<div class="big-hint">
  <h3>Drag JPEGs onto your browser and lets get moving!</h3>
</div>


<div style="display:none;">

<div id='picview-template'>
  <div class="big-view">

    <div class="pic-info">
      <span class="name">{{name}}</span> by
      <span class="creator">{{creator_name}}</span>
    </div>

    <div class="pic-container" >
      <a  href="{{file_address}}" 
          class="fancybox nofancy" rel="group" 
          title="{{name}} by {{creator_name}} at {{created}}">
        <img class="big-thumbnail" src="{{big_thumbnail_address}}"/>
        <img class="mid-thumbnail" src="{{mid_thumbnail_address}}"/>      
        <img class="small-thumbnail" src="{{small_thumbnail_address}}"/>
      </a>
      <div style="clear:both"></div>      
    </div>

  </div>
</div>


<div id='gallery-template'>
  <h3>{{title}}</h3>
  <div class="row-fluid">
      <div class='gallery-container thumbnails span12'></div>
      <div class='span7 pic-preview' style="display:none;">
        <div class='preview-container' style="min-height: 300px"></div>
        <div style="clear:both"></div>
      </div>
  </div>
  <div style="text-align:center">
    <h2><a class="link button">Get More</a></h2>
  </div>
</div>


<div id='group-gallery-template'>
</div> 

</%def>

