require([
    'index/modules/table/module',
    "cslider"
], function(TableModule){

    TableModule.renderTable();

    $(function () {
        $('#da-slider').cslider();
    });
})