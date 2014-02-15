var rootController = require('../controllers/root')
    , api = require('../controllers/api');


module.exports = function(app) {
    app.get('/', rootController.home);


    //add new winner
    app.post('/api/score/add', api.score.add);

}