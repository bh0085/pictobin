<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <script src="/js/deps/MochiKit.js"></script>
    <script type="text/javascript" src="/js/deps/jquery-1.7.2.min.js"></script>

    <!-- Set up session variables from the templating context -->
    <!-- 
    base.mako should only be inherited by templates based on a single
    event. Any controller rendering the base.mako must include:
	 bestKey
	 sessionInfo = {
	    eventInfo:{
               name
               creatorName
	       }
	     }
    -->
	    
    <script type="text/javascript">
      <% import json %>
      sessionInfo=${json.dumps(sessionInfo) | n}
      sessionInfo.bestKey = ${json.dumps(bestKey) | n}
    </script>
    <title>Pictobin for ${sessionInfo['eventInfo']['name']}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Pictobin page for Event.">
    <meta name="author" content=${sessionInfo['eventInfo']['creator_name']}>

    <!-- My base script imports  -->
    <%include file="/base_includes/stylesCSS.mako"/>
    <%include file="/base_includes/fileUploadCSS.mako"/>
    <!--
    <%include file="/base_includes/undoManagerHead.mako"/>
    -->
  </head>

  <body>
    <!-- Sitewide navbar -->
    <div class="navbar navbar-fluid-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="brand" href="#">${sessionInfo['eventInfo']['name']}</a>
            <ul class="nav">
              <li class="active"><a href="/gallery/${(bestKey)|n}">Event Home</a></li>
              <li><a href="/sharelinks/${(bestKey)|n}">Share</a></li>
	      %if sessionInfo['permissions']['administer']:
	      <li><a href="/administer/${(bestKey)|n}">Administer</a></li>
              %endif 
            </ul>
	    <!-- The drop down menu -->
            <ul class="nav pull-right">
              <li><a href="/users/sign_up">Sign Up</a></li>
              <li class="divider-vertical"></li>
              <li class="drop down">
		<a class="dropdown-toggle" href="#" data-toggle="dropdown">Sign In <strong class="caret"></strong></a>
		<div class="dropdown-login dropdown-menu"  style="padding: 15px; padding-bottom: 0px;">
		  <form action="[YOUR ACTION]" method="post" accept-charset="UTF-8">
		    <input id="user_username" style="margin-bottom: 15px;" type="text" name="user[username]" size="30"  placeholder="username"/>
		    <input id="user_password" style="margin-bottom: 15px;" type="password" name="user[password]" size="30"  placeholder="password" />
		    <input class="btn btn-primary" style="clear: left; width: 100%; height: 32px; font-size: 13px;" type="submit" name="commit" value="Sign In" />
		  </form>
		</div>
          </li>
        </ul>
        </div>
      </div>
    </div>
    <script>
      $(function() {
      // Setup drop down menu
      $('.dropdown-toggle').dropdown();
      console.log('dropping')
 
      // Fix input element click problem
      $('.dropdown-login').click(function(e) {
      console.log('e')
      e.stopPropagation();
      
      });
      });
    </script>
    <!-- End of Sitewide navbar-->
    ${self.body_contents()}

    <!--
    <%include file="/base_includes/undoManagerDemo.mako"/>
    -->
    <%include file="/base_includes/scripts.mako"/>
    <%include file="/base_includes/fancyBoxImports.mako"/>
    <%include file="/base_includes/fileUploadScripts.mako"/>

 
  </body>
</html>
