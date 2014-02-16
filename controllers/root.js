exports.home = function(req, res, next) {
    res.render('index', {});
}


exports.machine = function(req, res, next) {
    res.render('slot-machine', {});
}