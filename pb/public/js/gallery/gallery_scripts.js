
$(function(){
      var confLinks;
      confLinks = $('.nav-list').find("a");
      confLinks.click(
	  function(){
	      $(this).parent().siblings()
		  .filter('.nav-'+$(this).parent().attr('ngroup'))
		  .removeClass('active');
	      $(this).parent().addClass('active');
	      justRefresh();
	  }
	  
      );
  })


/** state globals */
var currentGroupingStrategyName = null;
var activeGroups = null;

grpStrategies = {
    "creator":{
	keyFun:function(info){
	
	    return info.creator_name;
	},
	displayFun:function(key){
	    return key+"'s photos";
	}
    },
    "single":{
	keyFun:function(info){
	    return "All pictures";
	}
    },
    "day":{
	keyFun:function(info){
	    return Math.ceil(info.age / 60/60/24);
	},
	displayFun:function(key){
	    return "Pics from day "+key;
	}
    }
}
sortStrategies = {
    "time":{
	keyFun:function(info){
	    return info.age;
	},
	displayFun:function(){
	    return "Date taken";
	}
    },
    "favorites":{
	keyFun:function(info){
	    return -1 *info.favorites;
	},
	displayFun:function(){
	    return "Number of Favorites.";
	}
    },
    "name":{
	keyFun:function(info){
	    return info.name;
	}
    },
    "comments":{
	keyFun:function(info){
	    return info.comments.length;	    
	}
    }
}

function getGroupSchema(){
    selectedGroups = $('.nav-group.nav-item').filter('.active');
    if (selectedGroups.length == 0)
    {
	grpsName = 'single';
    } else{
	grpsName = selectedGroups.children('a').attr('name');
    }
    strat = grpStrategies[grpsName];
    if (strat === undefined){
	throw 'unrecognized grouping: ' + grpsName;
    }
    return {name:grpsName,
	    strategy:strat};
    
    
}
function getSortSchema(){
    selectedSorts = $('.nav-sort.nav-item').filter('.active');
    if (selectedSorts.length == 0)
    {
	grpsName = 'time';
    } else{
	grpsName = selectedSorts.children('a').attr('name');
    }
    strat = sortStrategies[grpsName];
    if (strat === undefined){
	throw 'unrecognized grouping: ' + grpsName;
    }
    return {name:grpsName,
	    strategy:strat};
    
       
}
function gatherPictures(){
    var galleryRows, picContainers;
    galleryRows = $('.gallery');
    picContainers = galleryRows.find('.item-container');
    return picContainers;
}

/** 
 * Groups all of the pictures have been added to
 * (non aggregative) galleries on the page.
 */
function groupPictures(schema, picContainers){
    var info, galleryRows, infos, groups, k, g, galleryContainer, header, row,
    i, j, e, currentGroups;

    if (picContainers === null || picContainers === undefined){
	picContainers = gatherPictures();
    }

    infos = $.map(picContainers,
		  function(e,i){
		      info = {elt:e};
		      $.extend(info,$(e).data().info);
		      return info;
		  });

    groups = groupby_as_array(
	sorted(infos,function(x,y){
		   return( compare(schema.strategy.keyFun(x),
				   schema.strategy.keyFun(y)))
			 }),
	schema.strategy.keyFun
    );
    
    for ( i = 0 ; i < groups.length ; i++){
	k = groups[i][0];
	g = groups[i][1];
	galleryContainer=makeGalleryContainer(schema,k);

	row = galleryContainer.find('.gallery');
	for ( j = 0 ; j < g.length ; j++){
	    e = g[j].elt;
	    $(e).appendTo(row);	    
	}
	
    }
    currentGroups =$('.galleryContainer');
    for (i = 0 ; i < currentGroups.length; i++){
	g =$(currentGroups[i]);
	if(g.find('.item').length == 0){
	    g.remove();
	}
    }

    activeGroups = {};
    currentGroups =$('.galleryContainer');
    for(i = 0; i <  currentGroups.length ; i++){
	activeGroups[$(currentGroups[i]).attr('keyVal')] = currentGroups[i];	
    }
    currentGroupingStrategyName = schema.name;
    console.log("GROUPED!")

}
/**
 * Makes a new gallery container for a group that does
 * not yet exist in the DOM.
 */
function makeGalleryContainer(grpSchema,keyVal){
    galleryContainer = $('<div>',{'class':'galleryContainer expanded'})
	.attr('keyVal',keyVal);
    header = $('<div>', {'class':'row-fluid'})
	.append($('<div>', {'class':'span12'})
		.append($('<h3>')
			.append($('<span>',{'class':'galleryHeaderText'})
				.text(keyVal)
				.data({'defaultName':
				       grpSchema.strategy.hasOwnProperty('displayFun')?
				       grpSchema.strategy.displayFun(keyVal):
				       keyVal
				      }))
			.append($('<span>',{'class':'gallery-expansion-toggle'})
				.append($('<span>',{'class':'expanded'})
					.text('Collapse'))
				.append($('<span>',{'class':'collapsed'})
					.text('Expand'))
			       )))
	.appendTo(galleryContainer);
    
    row = $('<div>',{'class':'hero-unit galleryRow'})
	.append($('<div>',{'class':'row-fluid'})
		.append($('<div>',{'class':'gallery span12'})))
	.appendTo(galleryContainer);
    galleryContainer.appendTo($('.galleriesContainer'));
    
    galleryContainer.find('.gallery-expansion-toggle')
	.click(function(e){
		   console.log(this);
		   $($(this).parentsUntil('.galleryContainer').slice(-1)[0]).parent().toggleClass('expanded');
	       });
    return galleryContainer;
}

/* Scripts that add, remove and alter pictures in galleries.*/
/**
 * Updates pics or adds to the DOM.
 */
function updateGallery(pics){
    var i, picItems, picsDict, needs_add, pid;
    picItems = $('.gallery').find('.item-container');
    picsDict = {    };
    for(i = 0 ; i < picItems.length ; i++){
	picsDict[$(picItems[i]).data().info.id] = picItems[i];
    }

    needs_add = [];
    for (i = 0 ; i < pics.length ; i++){
	pid = pics[i].id;
	if (picsDict.hasOwnProperty(pid)){
	    updatePic(picsDict[pid],pics[i]);
	} else {
	    needs_add.push(pics[i]);
	}
    }

    addPictures(needs_add);
}
/**
 * Updates pics, adds or removes from the DOM.
 */
function updateGalleryFullyFromServer(data){
    var elt, i, pic, newIds, oldIds, deleteList, updateList, link,
    link_container, grpSchema, currentGroupingStrategyName;
        
    newIds = $.map(data, function(e){
		       return e.id;
		   });
    oldIds = $.map(gatherPictures(),
		  function(e){
		      return $(e).data().info.id;
		  });
    
    /* Delete list contains elements in the DOM tree*/
    deleteList = $.map(oldIds, function(e,i){
			   return newIds.indexOf(e) === -1
			       ? elt.children()[i] : null;
		       });
   for (i = 0 ; i < deleteList.length; i++){
	deleteList[i].remove();
   }


    /* Add list contains pict info objects */
    updateList = $.map(newIds, function(e,i){
			   return oldIds.indexOf(e) === -1 
			       ? data[i] : null;
		       }); 
    addPictures(updateList);

}

function updatePic(elt, info){
    $(elt).find('.fancybox-label.above')
	.text(info.name);
    $(elt).find('.fancybox-label.below')
	.text(info.creator_name);
    $(elt).find('.fancybox-label.float')
	.find('.favs-indicator')
	.find('btn')
	.text(String(Math.floor(Math.random()*10)));
}


function addPictures(pics){
    var pic, link_container, link, i, groupKey, galleryRow, grpSchema,
    j;

    grpSchema = getGroupSchema();
    for(i = 0 ; i < pics.length; i++){
	pic =pics[i];

	/*
	 Mock server variables.
	 */
	pic.favorites = Math.floor(Math.random() * 5);
	pic.comments = [];
	for (j = 0 ; j <Math.floor(Math.random()) * 5; j++){
	    pic.comments.push('This is a big fat comment!');  
	}

	link_container = $('<div>',
			   {style:'display:inline-block;position:relative;'})
	    .addClass('fancybox-container item-container')
	    .hover(function(){
		       $(this).addClass('hover');
		   },
		   function(){
		       $(this).removeClass('hover');
		   });
	
	link = $('<a>',
		     {'class':'fancybox item',
		      'rel':'group',
		      'href':pic.file_address
		     }).data({})
		   .append($('<img>',
			     {'src':pic.big_thumbnail_address,
			      'alt':""}));
	
	link_container.data().info = pic;
	link_container.append($("<div>").addClass('fancybox-invisible-frame'));
	link_container.append($('<div>').addClass('fancybox-frame'));
	link_container.append(
	    $('<div>',
	      { "class":"fancybox-label float" }).
		append($("<span>",{"class":"favs-indicator"})
		       .append($('<span>',{"class":"btn btn-primary btn-small"})
			       .text(String(pic.favorites))
			       .append($('<i>',{"class":"icon-flag icon-white"})))));
	
	link_container.append(highlightClickLabel(pic));
	link_container.append(link);
	link_container.append($('<div>',
				 {"class":"fancybox-label below"})
			      .text(pic.creator_name));
	
	
	groupKey = grpSchema.strategy.keyFun(pic);
	if (! activeGroups.hasOwnProperty(groupKey)){
	    activeGroups[groupKey] = makeGalleryContainer(grpSchema,groupKey);
	}
	galleryRow = $(activeGroups[groupKey]).find('.gallery'); 
	galleryRow.append(link_container);


    }
}

/**
 * When new data is received from the server, refreshes
 * any stale pictures and recomputes grouping/sort as
 * needed.
 */
function serverUpdateCallback(data){
    refreshGrouping();
    updateGalleryFullyFromServer(data);
    refreshSorting();
    refreshAggregates();
}
/**
 *  refreshAll()
 */
function justRefresh(){
    refreshGrouping();
    refreshSorting();
    refreshAggregates();
}
/**
 * Recompute groups. Delete empty ones and switch group 
 * strats as needed.
 */
function refreshGrouping(){
    var grpSchema;
    grpSchema = getGroupSchema();
    if ((grpSchema.name != currentGroupingStrategyName ) || activeGroups==null){
	groupPictures(grpSchema);
    }
    currentGroupingStrategyName = grpSchema.name;
}
/**
 * Re-Sort all pictures in individual groups.
 */
function refreshSorting(){
    var srtSchema, ics, infos, info, e, j, fltLabel,srtKeyDiv,srtInfos,currentGroups;
    srtSchema = getSortSchema();
    currentGroups =$('.galleryContainer');
    for(var i = 0; i < currentGroups.length ;i++){
	gc = currentGroups[i];
	ics = $(gc).find('.item-container');
	infos = $.map(ics,
		      function(e,i){
			  info = {elt:e};
			  $.extend(info,$(e).data().info);
			  return info;
		      });
	srtInfos = sorted(infos,function(x,y){
			    return compare(srtSchema.strategy.keyFun(x)
					   ,srtSchema.strategy.keyFun(y));
			});

	e = $.each(srtInfos,function(){$(this.elt).prependTo($(this.elt).parent())});
	htext = $(gc).find('.galleryHeaderText');
	htext.text(htext.data().defaultName + " - Sorted by "+
		   (srtSchema.strategy.hasOwnProperty('displayFun')
		    ?srtSchema.strategy.displayFun()
		    :srtSchema.name)
		   +".");
    }
}
function refreshAggregates(){
    var aggregateContainers, i;
    aggregateContainers = $('.aggregateGalleryContainer');
    for ( i = 0; i <  aggregateContainers.length ; i++){

	ac = aggregateContainers[i];
	gallery = $(ac).find('.galleryRow')
	if($(ac).attr('name') == 'highlights'){
	    $(gallery).empty();
	    keyFun = function(e){
		return e.favorites;
	    }
	    pics = $('.item-container').sort(
			  function(x,y){
			      return compare(keyFun($(x).data().info),
					     keyFun($(y).data().info));
			  }).slice(0,3);
	    for(j = 0; j < Math.min(3,pics.length); j++){
		pic = pics[j];
		$(gallery).prepend(
		    $('<span>',{
			  'class':'highlight-image collapsed item-container'})
			.data({'info':$(pic).data().info})
		    
			.append(
			    $('<div>',
			      {'class':'highlight-image-container'})
				.append( 
				    $('<a>',
				      {'class':'fancybox item nofancy',
				       'rel':'group',
				       'href':$(pic).data().info.file_address
				      })
					.append(
					    $('<img>',
					      {'src':
					       $(pic).data().info.file_address,
					       'width':'100%',
					       'alt':""}))))
			.hover(function(){
				   $(this).addClass('expanded');
			       },function(){
				   $(this).removeClass('expanded');
			       })
			.append(highlightClickLabel($(pic).data().info)));
		    ;
	    

	    }
	}

    }
}
function highlightClickLabel(info){
    label = $('<div>',{'class':'fancybox-label above'})
	.append($('<span>',{'class':'labelNode'})
		.text(info.name));
    label.click(
	function(){
	    $(this)
		.append($('<input>')
			.val($(this).text())
			.blur(function(){
				  info = 
				      $(this)
					.parentsUntil('.item-container')
					.last()
					.parent()
					.data().info;
				  info.name = $(this).val();
				  $.getJSON(
				      '/sync/pictures/'+sessionInfo.bestKey,
				      {picsListJSON:
				       JSON.stringify(
					   [
					       info
					   ])}, updateGallery
				  );
				  $(this).siblings('.labelNode')
				      .css('visibility', 'visible')
				      .css('display','block')
				      .text($(this).val());
				  $(this).parent().css('color', 'red');
				  $(this).remove();
			      }
			     ));
	    var inp = $(this).find('input');
	    inp.select();
	    console.log('hiding');
	    $(this).children('.labelNode').css('display','none');
	    
	});
    return label;
    
}

function requestServerUpdate(){
    $.getJSON('/pics/getPicsJSON/'+sessionInfo.bestKey,
	      {},
	      serverUpdateCallback);
}

function startup(){
    requestServerUpdate();
}
$(startup);
