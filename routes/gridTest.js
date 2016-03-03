var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/list', function (req, res, next) {
    res.send('for list test, you should put the \'/list\' more');
});

router.get('/', function (req, res, next) {
    var db = req.db;
    var test_cols = db.get('memo');
    
    test_cols.find({}, {}, function(err, test_cols) {
        res.render('gridTest', { 
            "title": 'Grid Test',
             "test_cols": test_cols
        });        
    });

});

module.exports = router;
