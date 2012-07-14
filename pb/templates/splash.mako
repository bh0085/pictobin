<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Pictobin for Galapagos Adventures</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Pictobin page for Galapagos Adventures">
    <meta name="author" content="Ben">

    <script type="text/javascript">
      sessionInfo={};
    </script>

    <!-- Le styles -->
    <script type="text/javascript" src="/js/deps/jquery-1.7.2.min.js"></script>
    <%include file="/base_includes/scripts.mako"/>
    <%include file="/base_includes/stylesCSS.mako"/>
    <%include file="/base_includes/fileUploadCSS.mako"/>
    <body>

    <div class="navbar navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="brand" href="/">Pictobin</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="splash"><a href="#">Splash</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
    

    <div class="row-fluid">
      <h1>Welcome to Pictobin Alpha</h1>     
      <h2>Private sharing for photos from happy times.</h2>
    </div>	 
    <br/>
    <br/>
    <div class="hero-unit">



      <form class="form-horizontal" name="create"  method="get" action="/makeevent">


	<fieldset>
	  <legend>Enter required info</legend>
	  <div class="control-group">
	    <label class="control-label" for="input01">Event name</label>
	    <div class="controls">
              <input type="text" class="input-xlarge" id="input01" name="name">
	    </div>
	    <br/>
	    <label class="control-label" for="input015">Your Name</label>
	    <div class="controls">
              <input type="text" class="input-xlarge" id="input05" name="creator_name">
	    </div>
	  </div>
	</fieldset>
	<fieldset>
	  <legend>And any optional info you desire</legend>
	  <div class="control-group">
	    <label class="control-label" for="input02">Event description</label>
	    <div class="controls">
              <input type="text" class="input-xlarge" id="input02" name="description">
	    </div>
	    <br/>
	    <label class="control-label" for="input03">Event location</label>
	    <div class="controls">
              <input type="text" class="input-xlarge" id="input03" name="location">
	    </div>
	    <br/>
	    <label class="control-label" for="input04">Event date</label>
	    <div class="controls">
              <input type="text" class="input-xlarge" id="input04" name="date">
	    </div>
	  </div>

	</fieldset>
        <div class="form-actions" style="background:none;">
          <button type="submit" class="btn btn-primary">Create Event</button>
          <button class="btn">Clear</button>
        </div>    
	
      </form>
      
    </div> <!-- /container -->

</body>
</html>
