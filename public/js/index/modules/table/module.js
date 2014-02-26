define([
    'backbone',
    './views/TableView',
    './models/table'
], function(Backbone, TableView, TableModel){

    var Controller = {
        renderTable: function(){
            var model = new TableModel();
            var tableView = new TableView({model: model});
            $('.leaderboard-wrapper').append(tableView.$el);
        }
    }

    return {
        renderTable: function(){
            Controller.renderTable();
        }
    }

})