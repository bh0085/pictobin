var picNewName = null;
var isModal = false;
var renamerQueue = [];


$(function () {

      
      /*Refresh the gallery when upload is complete*/
      $('#fileupload')
		  .bind('fileuploaddone', function (e, data) {

		  	_.map(data.result, function(result) {
		  		var picinfo = result.picInfo;
		  		cache.add(new Pic(picinfo))
		  	});
	  });

});

function requestIdentification(){

   
     var dialog,startName;
    if (isModal){
	return;
    }
    isModal = true;

    var form = $('<form>',{'class':'form-horizontal'})
	.append($('<fieldset>')
		.append($('<legend>').text("Right now you're anonymous... choose a Signature?"))
		.append($('<div>',{'class':'control-group'})
			.append($('<label>',{'class':'control-label',
     'placeholder':'username',

					     'name':'name'}).text('Signature'))
			.append($('<div>',{'class':'controls'})
				.append($('<input>',
				       {'type':'text',
					'class':"input-xlarge",
					'id':'modalInp1',
					     'for':'modalInp1',

					'name':'nameInput'})
					))
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
    modal.remove();
    $.get('/identity/identifyAs/'+sessionInfo.bestKey,
	 {
	     name:nameValue,
	     setDefault:setDefault  
	 });

    isModal = false;
    
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
