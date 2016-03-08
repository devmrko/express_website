var express = require('express');
var router = express.Router();
var perPage = 2;
var url = require('url');

/* GET home page. */
router.get('/list', function (req, res, next) {
    res.send('for list test, you should put the \'/list\' more');
});

function getParam(req, paramNm) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var paramVal = eval('query.' + paramNm);
    if (paramVal == undefined || paramVal == '') {
        paramVal = 1;
    }
    return paramVal;
}

router.get('/', function (req, res, next) {
    var db = req.db;
    var test_cols = db.get('memo');
    // var pageNo = getParam(req, 'PageNo');
    var pageNo = 1;
    var searchText = '';

    doSearch(req, res, searchText, pageNo);
});

router.post('/', function (req, res, next) {

    var pageNo = req.body['pageNo'] == undefined ? 1 : req.body['pageNo'];
    var searchText = req.body['searchText'] == undefined ? '' : req.body['searchText'];
    doJsonSearch(req, res, searchText, pageNo);
    /*
        var db = req.db;
        var test_cols = db.get('memo');
        test_cols.find({}, { skip: (pageNo - 1) * perPage, limit: perPage }, function (err, test_cols) {
            return res.render('gridTest', {
                "title": 'Grid Test',
                'test_cols': test_cols,
                'pageNo': pageNo
            });
        });
    */
});

router.get('/search', function (req, res, next) {
    res.send('search get request called');
});

function doSearch(req, res, searchText, pageNo) {
    var db = req.db;
    var test_cols = db.get('memo');

    test_cols.find({ "contents": { "$regex": searchText } }, { skip: (pageNo - 1) * perPage, limit: perPage },
        function (err, test_cols) {
            res.render('gridTestWithAngular', {
                "title": 'AngularJS Grid Test',
                "test_cols": test_cols,
                'pageNo': pageNo,
                'searchText': searchText
            });
        });
}

function doJsonSearch(req, res, searchText, pageNo) {
    var db = req.db;
    var test_cols = db.get('memo');

    test_cols.find({ "contents": { "$regex": searchText } }, { skip: (pageNo - 1) * perPage, limit: perPage },
        function (err, test_cols) {
            res.render('gridTestWithAngular', {
                "title": 'AngularJS Grid Test',
                "test_cols": test_cols,
                'pageNo': pageNo,
                'searchText': searchText
            }, function(err, html) {
                res.send(html);
            });
            
            /*
            res.jsonp({
                "title": 'Grid Test',
                "test_cols": test_cols,
                'pageNo': pageNo,
                'searchText': searchText
            });
            */            
        });
}

/*
router.post('/next', function (req, res, next) {
    // var url = '/gridTest?pageNo=' + (req.body.page_no * 1 + 1);
    // res.location(url);
    // res.redirect(url);
    var pageNo = (req.body.page_no * 1 + 1);
    doPostSearch(req, res, searchText, pageNo);
});
*/

router.post('/search', function (req, res, next) {

    // var pageNo = req.body.page_no;
    // if (pageNo == undefined || pageNo == '') {
    //     pageNo = 1;
    // }
    var pageNo = 1;
    
    // get form values
    var searchText = req.body.id_searchText;
    
    // // foam validation
    // req.checkBody('id_searchText', 'Search field is required').notEmpty();
    // // Check Errors
    // var errors = req.validationErrors();
    // if (errors) {
    //     // some error handling codes
    // } else {
    doSearch(req, res, searchText, pageNo);
    // }
});


router.post('/save', function (req, res, next) {
    // get form values
    var selContents = req.body.sel_contents;
    var selTags = req.body.sel_tags;
    var selId = req.body.sel_id;

    var db = req.db;
    var test_cols = db.get('memo');

    if (selId == '') {
        test_cols.insert({
            "contents": selContents,
            "tags": selTags
        }, function (err, test_cols) {
            if (err) {
                res.send('There was an issue submitting the post');
            } else {
                req.flash('success', 'Post Submitted');
                res.location('/gridTest');
                res.redirect('/gridTest');
            }
        });
    } else {
        test_cols.update({
            "_id": selId
        },
            {
                $set: {
                    "contents": selContents,
                    "tags": selTags
                }
            },
            function (err, doc) {
                if (err) {
                    throw err;
                } else {
                    req.flash('success', 'Comment Added');
                    // res.location('/posts/show/'+selId);
                    // res.redirect('/posts/show/'+selId);
                    res.location('/gridTest');
                    res.redirect('/gridTest');
                }
            }
            );
    }
});

module.exports = router;