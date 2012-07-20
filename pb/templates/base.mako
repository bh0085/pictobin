<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">

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

    <script src="/js/deps/MochiKit.js"></script>
    <script type="text/javascript" src="/js/deps/jquery-1.7.2.min.js"></script>	    
    <script type="text/javascript">
      <% import json %>
      sessionInfo=${json.dumps(sessionInfo) | n}
      sessionInfo.bestKey = ${json.dumps(bestKey) | n}
      initial_pictures = ${json.dumps(pictures) | n}
    </script>

    <title>Pictobin for ${sessionInfo['eventInfo']['name']}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Pictobin page for Event.">
    <meta name="author" content=${sessionInfo['eventInfo']['creator_name']}>

    <!-- My base script imports  -->
    <%include file="/base_includes/stylesCSS.mako"/>
    <%include file="/base_includes/fileUploadCSS.mako"/>
  </head>

  <body>

    <%include file="/base_includes/navbar.mako"/>


    ${self.body_contents()}

    <%include file="/base_includes/scripts.mako"/>
    <%include file="/base_includes/fancyBoxImports.mako"/>
    <%include file="/base_includes/fileUploadScripts.mako"/>
 
  </body>


</html>
