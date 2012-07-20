var cache = null;
var curview = null;

_.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
};


var Pic = Backbone.Model.extend({

    defaults : function() {
        return {
            added: '',
            age: 0,
            big_thumbnail_address: '',
            creator_name: '',
            file_address: '',
            file_name: '',
            gallery_id: null,
            id: null,
            meta: {},
            name: '',
            small_thumbnail_address: ''};
    },

    initialize: function(data) {
    },

    clear: function() {
        this.destroy();
    },

    day: function() {
        var date = Date.today();
        try {
            var dt = this.get('meta')['DateTime'];
            var datestr = dt.match(/.*\s/)[0];
            datestr = datestr.replace(/:/g, '-');
            datestr = datestr.replace(/"/g, '');
            date = Date.parse(datestr);
        } catch (e) {
            date = Date.today();
        }
        return date;
    },

    datetime: function() {
        var time = Date.now();
        try {
            var dt = this.get('meta')['DateTime'];
            dt = dt.replace(/"/g, '');            
            var datestr = dt.match(/.*\s/)[0];
            datestr = datestr.replace(/:/g, '-');
            timestr = dt.match(/\s.*/)[0]
            time = Date.parse(datestr + timestr);
        } catch (e) {
            time = Date.now();
        }
        return time;

    }

    

});

var PicCache = Backbone.Collection.extend({
    
    model: Pic,
    
    url: '/pics/',

    gb_name: null,

    gb_key: null,

    comparator: function(pic) {
        return pic.datetime();
    },

    initialize: function(models, opts) {
        if (opts.url) this.url = opts.url;
        if (opts.gb_key) this.gb_key = opts.gb_key;
        this.opts = opts;

    },

    getMore: function() {
        var maxid = _.max(this.models, function(p) {
            return p.get('id');
        }, this).get('id');

        this.fetch({
            data: { gb_key: this.gb_key, 
                    maxid: maxid, 
                    limit: 5},
            add: true
        });
    }



});


// on file upload callback, call piccache.create with results
// on page load, call piccache.reset(LIST OF JSON PICTURES)
//
//




var PicView = Backbone.View.extend({

    tagName: 'div',

    className: 'pic-view',

    template: _.template($('#picview-template').html()),

    allowHover: false,

    container: null,

    events: {
        'click .button'   : 'btnClick',
        'mouseover img' : 'imgHover'
    },

    initialize: function(args){
        this.container = args.container;

        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        this.render();


    },

    btnClick: function() {
        cache.fetch();
    },

    render: function() {
        console.log(['picview', this.size]);
        this.$el.html(this.template(this.model.toJSON()));
        this.changeSize(this.size);
        return this;
    },

    imgHover: function() {
        if (this.allowHover) {
            var preview = this.container.$('.pic-preview');
            preview.empty().append(this.$('.big-thumbnail').clone());
        }
    },

    changeSize: function() {
        var size = this.container.size;
        this.$el.children().attr('class', size+'-view');        
        this.allowHover = (size != 'big');
    },

    clear: function() {
        this.model.clear();
    }

})


var GalleryView = Backbone.View.extend({


    tagName: 'div',

    className: 'hero-unit galleryRow gallery-view',

    template: _.template($('#gallery-template').html()),

    title: "All Pictures",

    size: 'big',

    events: {
        'click .button' : 'getMore'
    },

    initialize: function(args) {
        this.pictures = args.collection;
        if (args.size) this.size = args.size;
        if (args.title) this.title = args.title;
        
        this.picviews = [];
        
        this.pictures.bind('add', this.addOne, this);
        this.pictures.bind('reset', this.render, this); 
        this.pictures.bind('remove', this.removeOne, this);
    },

    addOne: function(pic) {
        var view = new PicView({
            model: pic, 
            size: this.size,
            container: this
        });
        this.picviews.push(view);
        this.$('.gallery-container').append(view.el);
    },

    addAll: function() {
        this.pictures.each(this.addOne, this);
    },

    removeOne: function(model) {
        model.clear()
    },

    getMore: function() {
        console.log(this);
        this.pictures.getMore()
    },

    // size should be "small", or "big"
    changeSize: function(size) {
        this.size = size;

        _.each(this.picviews, function(view) {
            view.changeSize();
        }, this);


        var cont = this.$('.gallery-container');
        var preview = this.$('.pic-preview');
        if (size != 'big') {
            cont.removeClass('span12').addClass('span4');
            preview.show();
        } else {    
            cont.removeClass('span4').addClass('span12');
            preview.hide();
        }

    },

    render: function() {
        console.log("galleryrender");
        var html = this.template({title: this.title});
        this.$el.html(html);
        this.pictures.each(this.addOne, this);
        this.changeSize(this.size);
        return this;
    }


})


var GroupView = GalleryView.extend({

    className: '',

    template: _.template($('#group-gallery-template').html()),

    size: 'big',

    /*
        Computes a group by and constructs gallery views for each group

    */
    initialize: function(args) {
        this.pictures = args.collection;
        this.gb_func = args.gb_func || function(p) {return ''+p.attributes['id']%3;};
        this.gb_name = args.gb_name
        if (args.size) this.size = args.size;


        // compute the group-by and call galleryFromPics to
        // create the per-group view
        var groups = this.pictures.groupBy(this.gb_func);
        this.groups = {};
        group_views = _.map(groups, function(group,k) {
            var group_view = this.galleryFromPics(k, group);
            this.groups[k] = group_view;
            return null;

        }, this);

        this.pictures.bind('add', this.addOne, this);
        this.pictures.bind('reset', this.addAll, this); 
    },
 

    /*
        Constructs a new gallery view if one doesn't exist
        then adds picture to the appropriate view
    */
    addOne: function(pic) {
        var key = this.gb_func(pic);

        if (this.groups[key] == null) {
            var newview = this.galleryFromPics(key, [pic]);

            this.groups[key] = newview;
            this.$el.append(newview.render().el)
            newview.$('.fancybox').attr("rel", key);
        }

        this.groups[key].collection.add(pic);
    },

   render: function() {
       this.$el.html(this.template());
          
       _.each(this.groups, function(v,key) { 
               this.$el.append(v.render().el) 
               v.$('.fancybox').attr("rel", key);
               }, this)

       return this;
    },

    changeSize: function(size) {
        this.size = size;
        _.each(this.groups, function(view, gb_key) {
            view.changeSize(size);
        })
    },

    galleryFromPics: function(gb_key, pics) {
        var opts = _.clone(this.pictures.opts);
        _.extend(opts, {
            gb_key: gb_key,
            gb_name: this.gb_name
        });

        var newcache = new PicCache(pics, opts);
        newcache.on('add', this.pictures.addOne);

        var group_view = new GalleryView({
            collection: newcache,
            title: this.gb_name + " = " + gb_key,
            size: this.size
        });
        return group_view;
    }

});




function render_group(opts) {
    opts = opts || {};
    _.extend(opts, {
        collection: cache,
        gb_func: function(pic) {return pic.get('day')},
        gb_name: 'day'
    });
    var gallery = new GroupView(opts)
    var el = gallery.render().el;
    $(".galleriesContainer").empty().append(el);
    curview = gallery;
}

function render_norm() {
    var opts = {collection: cache};
    var gallery = new GalleryView(opts);
    var el = gallery.render().el;
    $(".galleriesContainer").empty().append(el);
    curview = gallery;
    console.log('rendernorm done')
}




$(function() {
    var piccache = new PicCache([], {
        url: '/pics/' + sessionInfo.bestKey
    });
    piccache.reset(initial_pictures)

    cache = piccache;
    render_norm();
});



