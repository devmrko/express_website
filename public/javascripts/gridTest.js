var editBool = false;
var compArry = ['id_editComp'];
visibleHandler(compArry, editBool);

$("#id_newPost").click(function () {
    editBool = true;
    visibleHandler(compArry, editBool);
    $("#id_sel_contents").val('');
    $("#id_sel_tags").val('');
    $("#id_sel_id").val('');
});

function addDataObj(jQuery, dataObj, keyNm, keyVal) {
    eval("jQuery.extend(dataObj, {" + keyNm + " : keyVal})");
}

$("#next").click(function () {

    var ctrUrl = '/gridTest';
    var paramDataObj = {};
    var dataObj = {};
    // addDataObj(jQuery, paramDataObj, "pageNo", ($("#id_page_no").val() * 1 + 1));
    // addDataObj(jQuery, dataObj, "paramDataObj", paramDataObj);
    addDataObj(jQuery, dataObj, "pageNo", ($("#id_page_no").val() * 1 + 1));
    addDataObj(jQuery, dataObj, "searchText", $("#id_searchText").val());
    /*
        $.post(ctrUrl, dataObj).success(function (result) {
            console.dir('success!!!');
        }).error(function (jqXHR, textStatus, errorThrown) {
            alert('error: ' + textStatus);
        });
    */
    var jqxhr = $.post(
        ctrUrl,
        dataObj,
        'json'
        )
        .done(function (data) {
            console.log("second success");
            $("#id_page_no").val($("#id_page_no").val() * 1 + 1);
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("finished");
        });
});

$("#cancel").click(function () {
    editBool = false;
    visibleHandler(compArry, editBool);
});

function itemClick(index, id) {
    if (editBool && id == $("#id_sel_id").val()) {
        editBool = false;
        visibleHandler(compArry, editBool);
    } else {
        editBool = true;
        visibleHandler(compArry, editBool);

        var contents = $("#col_contents_" + index).text();
        var tags = $("#col_tags_" + index).text();

        $("#id_sel_contents").val(contents);
        $("#id_sel_tags").val(tags);
        $("#id_sel_id").val(id);
    }
}

function visibleHandler(compArry, bool) {
    if (bool) {
        for (var i = 0; i < compArry.length; i++) {
            $("#" + compArry[i]).show();
        }
    } else {
        for (var i = 0; i < compArry.length; i++) {
            $("#" + compArry[i]).hide();
        }

    }
}