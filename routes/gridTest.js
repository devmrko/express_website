var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/list', function (req, res, next) {
    res.send('for list test, you should put the \'/list\' more');
});

var customRenderer = function (res, titleStr, dataObjNm, dataObj) {
    return res.render('gridTest', {
        "title": titleStr,
        dataObjNm: dataObj
    });
}

router.get('/', function (req, res, next) {
    var db = req.db;
    var test_cols = db.get('memo');

    test_cols.find({}, {}, function (err, test_cols) {
        // return customRenderer(res, 'Grid Test', 'test_cols', test_cols);
        return res.render('gridTest', {
            "title": 'Grid Test',
            'test_cols': test_cols
        });
    });

});

router.get('/search', function (req, res, next) {
    res.send('search get request called');
});

router.post('/search', function (req, res, next) {
    // get form values
    var searchText = req.body.id_searchText;
    
    // // foam validation
    // req.checkBody('id_searchText', 'Search field is required').notEmpty();
    // // Check Errors
    // var errors = req.validationErrors();
    // if (errors) {
    //     // some error handling codes
    // } else {
        var db = req.db;
        var test_cols = db.get('memo');

        test_cols.find({ "contents": { "$regex": searchText } }, {}, function (err, test_cols) {
            res.render('gridTest', {
                "title": 'Grid Test',
                "test_cols": test_cols
            });
        });
    // }
});


router.post('/save', function (req, res, next) {
    // get form values
    var selContents = req.body.sel_contents;
    var selTags = req.body.sel_tags;
    var selId = req.body.sel_id;
    
    // // foam validation
    // req.checkBody('id_searchText', 'Search field is required').notEmpty();
    // // Check Errors
    // var errors = req.validationErrors();
    // if (errors) {
    //     // some error handling codes
    // } else {
        var db = req.db;
        var test_cols = db.get('memo');
        
        if(selId == '') {
            test_cols.insert({
                "contents": selContents,
                "tags": selTags
            }, function(err, test_cols){
                if(err){
                    res.send('There was an issue submitting the post');
                } else {
                    req.flash('success','Post Submitted');
                    res.location('/gridTest');
                    res.redirect('/gridTest');
                }
            });
        } else {
            test_cols.update({
                    "_id": selId
                },
                {
                    $set:{
                        "contents": selContents,
                        "tags": selTags
                    }
                },
                function(err, doc){
                    if(err){
                        throw err;
                    } else {
                        req.flash('success','Comment Added');
                        // res.location('/posts/show/'+selId);
                        // res.redirect('/posts/show/'+selId);
                        res.location('/gridTest');
                        res.redirect('/gridTest');
                    }
                }
            );
        }
    // }
});


module.exports = router;
