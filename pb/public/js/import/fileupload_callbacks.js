var picNewName = null;
var isModal = false;
var renamerQueue = [];

$(function(){
      
      /*Refresh the gallery when upload is complete*/
      $('#fileupload')
	  .bind('fileuploaddone', function (e, data) {
		    var pi, creatorName;
		    pi = data.result[0].picInfo;
		    creatorName = pi.creator_name;
		    if(creatorName == 'anonymous'){
			if (!isModal &&( picNewName == null)){
			    renamerQueue.push(pi);
			    requestIdentification();	
			} else  if(picNewName == null){
			    renamerQueue.push(pi);
			} else {
			    pi.name = picNewName;
			    $.getJSON(
				'/sync/pictures/'+sessionInfo.bestKey,
				[pi],
				updateGallery);
			}
		    }
		    updateGallery($.map(data.result,
					function(e){
					    return e.picInfo;
					}));
		}); 
  }
 );

function requestIdentification(){
    var dialog,startName;
    isModal = true;
    startName = renamerQueue[0].creator_name;

    /*
      <form class="form-horizontal" name="create"  method="get" action="/makeevent/create">

    

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
	</form>

     */
    var form = $('<form>',{'class':'form-horizontal'})
	.append($('<fieldset>')
		.append($('<legend>').text("Right now you're anonymous... choose a Signature?"))
		.append($('<div>',{'class':'control-group'})
			.append($('<label>',{'class':'control-label',
					     'for':'modalInp1',
					     'name':'name'}).text('Signature'))
			.append($('<div>',{'class':'controls'})
				.append($('<input>',
				       {'type':'text',
					'class':"input-xlarge",
					'id':'modalInp1',
					'name':'nameInput'})
					.val(startName)))
		       )
		.append($('<div>',{'class':'control-group'})
			.append($('<label>',{'class':'control-label',
					     'for':'modalInp1',
					     'name':'default'}).text('Default for other Events'))
			.append($('<div>',{'class':'controls'})
				.append($('<input>',
				       {'type':'checkbox',
					'class':"input-xlarge",
					'id':'modalInp1',
					'name':'defaultInput'})))
		       )
	       );


    dialog = $('<div>', {"class": "modal hide fade",
			 "id":"idModal"})
	.append($('<div>',{'class':'modal-header'})
		.append($('<button>',{
			  'type':'button',
			  'class':'close',
			  'data-dismiss':'modal'}).text('x'))
		.append($('<h3>').text('Hey, wait a second!')))
	.append($('<div>',{"class":"modal-body"})
	       .append(form))
	.append($('<div>',{'class':'modal-footer'})
	       .append($('<a>',{'class':'btn',
				'data-dismiss':'modal'})
		       .text('Cancel')
		       .click($.proxy(function(){
					  $('#idModal')
					      .find('[name="nameInput"]')
					      .val(this.startName);
				      },{'startName':startName})))
		.append($('<a>',{'class':'btn btn-primary',
				 'data-dismiss':'modal'}).text('Accept')))
	.appendTo('body');

    dialog.modal();
    dialog.find('[name="nameInput"]')
	.val(startName);
    
    $('[name="nameInput"]').select();
    $('[name="nameInput"]')
	.css('cursor','pointer')
	.click(function(){
		   $(this).select()});
    $(dialog).on('hidden',identificationSettled);
}

function identificationSettled(){
    var modal, nameValue,pi,popped, setDefault;    
    modal =$('#idModal');
    nameValue = modal.find('input').filter('[name="nameInput"]').val();
    setDefault = modal.find('input').filter('[name="defaultInput"]').prop('checked');
    modal.remove();
    popped = [];
    while(renamerQueue.length > 0){
	pi = renamerQueue.pop();
	pi.creator_name = nameValue;
	popped.push(pi);
    }
  
    $.get('/identity/identifyAs/'+sessionInfo.bestKey,
	 {
	     name:nameValue,
	     setDefault:setDefault
	     
	 });
    $.getJSON(
	'/sync/pictures/'+sessionInfo.bestKey,
	{picsListJSON:JSON.stringify(popped)},
	updateGallery);
    isModal = false;
    picNewName = nameValue;
    
}

/*
 $('#fileupload').fileupload({
       dropZone: $('#dropzone')
       });

       $(document).bind('dragover', function (e) {
       var dropZone = $('#dropzone'),
       timeout = window.dropZoneTimeout;
       if (!timeout) {
       dropZone.addClass('in');
       } else {
       clearTimeout(timeout);
       }
       if (e.target === dropZone[0]) {
       dropZone.addClass('hover');
       } else {
       dropZone.removeClass('hover');
       }
       window.dropZoneTimeout = setTimeout(function () {
       window.dropZoneTimeout = null;
       dropZone.removeClass('in hover');
       }, 100);
       });
       */
