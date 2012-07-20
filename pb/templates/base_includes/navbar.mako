
<!-- Sitewide navbar -->
<div class="navbar navbar-fluid-top">
  <div class="navbar-inner">
    <div class="container">

      <a class="brand" href="#">${sessionInfo['eventInfo']['name']}</a>


      <ul class="nav">
        <li class="active">
          <a href="/gallery/${(bestKey)|n}">Event Home</a>
        </li>
        <li>
          <a href="/sharelinks/${(bestKey)|n}">Share</a>
        </li>
        %if sessionInfo['permissions']['administer']:
        <li>
          <a href="/administer/${(bestKey)|n}">Administer</a>
        </li>
        %endif 
      </ul>



      <!-- The drop down menu -->
      <ul class="nav pull-right">
        <li>
          <a href="#" id="dl_button">
            <i class="icon-download-alt icon-white"></i>
            Download Pictures
          </a>
        </li>

        <li class="divider-vertical"></li>


<!--        <li><a href="/users/sign_up">Sign Up</a></li>-->
        <li class="drop down">
        	<a class="dropdown-toggle" href="#" data-toggle="dropdown">
            Account <strong class="caret"></strong>
          </a>
          <%include file="/base_includes/navbar_signin.mako"/>
        </li>
      </ul>


    </div>
  </div>
</div>


<script>
  $(function() {
    // Setup drop down menu
    $('.dropdown-toggle').dropdown();


    // Fix input element click problem
    $('.dropdown-login').click(function(e) {
      e.stopPropagation();
    });
  });


  function downloadAlbum(ev){
    $.ajax({
           type: "get",
           url: "/export/downloadEvent/${bestKey | n}",
           /*data: JSON.stringify({}),*/
           dataType: "json",
           success: function(data, textStatus) {

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

  $(function() {
    $("#dl_button").click(downloadAlbum);
  });
</script>


<!-- End of Sitewide navbar-->