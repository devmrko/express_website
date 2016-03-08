var express = require('express');
var router = express.Router();
var perPage = 2;
var url = require('url');

router.get('/', function (req, res, next) {
    res.render('gridTestWithAngular', {
        "title": 'AngularJS Grid Test'
    });
});

function doJsonSearch(req, res, searchText, pageNo) {
    var db = req.db;
    var test_cols = db.get('memo');

    test_cols.find({ "contents": { "$regex": searchText } }, { skip: (pageNo - 1) * perPage, limit: perPage },
        function (err, test_cols) {
            res.jsonp({
                "test_cols": test_cols,
                'pageNo': pageNo,
                'searchText': searchText
            });

        });
}

router.post('/search', function (req, res, next) {
    var searchText = req.body.searchText === undefined ? '' : req.body.searchText;
    var pageNo = req.body.pageNo === undefined ? 1 : req.body.pageNo;
    doJsonSearch(req, res, searchText, pageNo);
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
                res.location('/gridTestWithAngular');
                res.redirect('/gridTestWithAngular');
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
                    res.location('/gridTestWithAngular');
                    res.redirect('/gridTestWithAngular');
                }
            }
            );
    }
});

module.exports = router;