var rootController = require('../controllers/root')
    , api = require('../controllers/api');


module.exports = function(app) {
    app.get('/', rootController.home);
    app.get('/slot-machine', rootController.machine);


    //add new winner
    app.post('/api/score/add', api.score.add);
    app.get('/api/score/get', api.score.get);

}