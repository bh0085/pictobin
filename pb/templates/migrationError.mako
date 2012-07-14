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
          <a class="brand" href="#">Pictobin</a>
          <div class="nav-collapse">
            <ul class="nav">
              <li class="splash"><a href="#">Splash</a></li>
            </ul>
          </div><!--/.nav-collapse -->
        </div>
      </div>
    </div>
    

    <br/>
    <br/>
    <div class="hero-unit">
      <h2>...I've made a huge mistake.</h2>     
      <br/>
      <p><h3>Your request has returned an Error${code}.</h3></p>
      <p>This could be your fault but lets be honest: its probably not. (Unless this is Oren, in which case, here's your custom <a href="/oren404">error page</a>) </p>
      <br/><br/>
      <p>Our development team has been wrestling with a database migraton and we've had remove all events that were created before July 13 2012.</p> 
<br/>
<p>Fear not, we've saved your event and its photos in a convenient zip format. They're alive and well; you can download them below. The thing is that you'll have to recreate the album - we've made a new user login/emailing system and don't want to bring the old events back without attaching all of your new data.</p>
<br/>
<p>
So please grab your missing album here:
</p>
<br/>
${files_html|n}
<br/>
<br/>

<p>and then head over to our <a href="/">Main Page</a> where you can quickly restore it by adding the contents of the zip. 
</p>
<br/>

<h2> We appreciate it! This won't happen again</h2>



    </div>
</body>
</html>
