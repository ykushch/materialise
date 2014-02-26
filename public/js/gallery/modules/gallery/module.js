define([
    'backbone',
    './views/GalleryView'
], function(Backbone, GalleryView){

    var Controller = {
        renderTable: function(){
            var tableView = new GalleryView();
            $('.leaderboard-wrapper').append(tableView.$el);
        }
    }

    return {
        renderTable: function(){
            Controller.renderTable();
        }
    }

})