var obj_NgApp = angular.module('app_gridTest', []);

obj_NgApp.controller('ctr_gridTest', function ($scope, $http, $document, $window) {

    var baseUrl = '/gridTestWithAngular';

    $scope.testVal = "test value";

    $scope.curPage = 1;
    $scope.completeBool = true;

    $scope.editViewBool = false;

    $document.ready(function () {
        $scope.searchClick();
    });

    $scope.searchClick = function (searchTag) {
        $scope.cancleClick();
        if(searchTag == undefined) {
            $scope.searchTag = 'All';
        } else {
            $scope.searchTag = searchTag;
        }
        $scope.curPage = 1;
        searchHanlder();
    }
    
    $scope.completeClick = function () {
        var ctrUrl = baseUrl + '/complete';

        var dataObj = {};
        addDataObj(jQuery, dataObj, "sel_id", $scope.sel_id);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
                        
        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });
        
    }
    
    $scope.cancelCompletionClick = function () {
        var ctrUrl = baseUrl + '/cancelComplete';

        var dataObj = {};
        addDataObj(jQuery, dataObj, "sel_id", $scope.sel_id);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
                        
        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });
        
    }

    function searchHanlder() {
        var ctrUrl = baseUrl + '/search';

        var dataObj = {};
        addDataObj(jQuery, dataObj, "searchText", $scope.searchText);
        if($scope.searchTag != 'All') {
            addDataObj(jQuery, dataObj, "searchTags", $scope.searchTag);
        }
        addDataObj(jQuery, dataObj, "completeYn", $scope.completeBool == true ? 'n' : 'y');
        addDataObj(jQuery, dataObj, "pageNo", $scope.curPage);

        $http.post(ctrUrl, dataObj).success(function (returnData) {
            $scope.test_cols = returnData.test_cols;
            $scope.keywords = returnData.keywords;
            
        }).error(function (data, status, headers, config) {
            alert('error: ' + status);
        });
    }

    $scope.nextClick = function () {
        $scope.cancleClick();
        if ($scope.test_cols.length == 0) {
            alert('There is no more page.')
        } else {
            $scope.curPage = $scope.curPage + 1;
            searchHanlder();
        }
    }

    $scope.newPostClick = function () {
        $scope.editViewBool = true;
        $scope.sel_contents = '';
        $scope.sel_tags = '';
        $scope.sel_id = '';
    }

    $scope.rowClick = function (idx) {
        if ($scope.editViewBool == true && $scope.selInx == idx) {
            $scope.editViewBool = false;
        } else {
            $scope.editViewBool = true;
            $scope.selInx = idx;
            $scope.sel_contents = $scope.test_cols[idx].contents;
            $scope.sel_tags = $scope.test_cols[idx].tags;
            $scope.sel_id = $scope.test_cols[idx]._id;
            if($scope.test_cols[idx].complete == 'y') {
                $scope.completeButtonBool = false;
            } else {
                $scope.completeButtonBool = true;
            }
        }
    }

    $scope.cancleClick = function () {
        $scope.editViewBool = false;
    }

    function addDataObj(jQuery, dataObj, keyNm, keyVal) {
        eval("jQuery.extend(dataObj, {" + keyNm + " : keyVal})");
    }

});