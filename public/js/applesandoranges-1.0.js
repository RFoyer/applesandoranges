$(document).ready(function() {
    if ($('#table-1').hasClass("guest")) {
        isGuest = true;
    }
    createTables();        
});

var isGuest = false;

function createTables() {
    
    var path = location.pathname;
    if (path === '/') {
        $.getJSON('json?page=home', function( json ) {
        var tableIDsArr = ['things-to-rate'];
        getTableData(tableIDsArr, json);
        createStarEventHandlers();
        getAsyncFormSubmits();
        $('a').tooltip();
        if ($('.td-star').attr('data-toggle') === "tooltip") {
            $('.td-star').tooltip();
        }
        });
    }
    
    else if (path === '/login' || path === '/register') {
        
    }
    
    else if (path === '/search') {
        
    }
    else if (path === '/user') {
        
    }
    else {
        
    }        
}

function getTableData(tableIDsArr, json) {    
    var i;
    var k;
    var tableID;
    var tr;
    var tdAttr = '';
    if (isGuest) {
        tdAttr = 'data-toggle="tooltip" title="Please login to rate items."';
    }
    for (i = 0; i < tableIDsArr.length; i++) {
        tableID = tableIDsArr[i]
        for (k = 0; k < json[tableID].length; k++) {
            tr = json[tableID][k];
            $('#' + tableID + '-body').append(
                '<tr><td><img src="' + tr['img_src'] + '" width="100"></td>' +  
                '<td class="ratable-name"><a data-toggle="tooltip" data-placement="bottom" title="' + tr['desc'] + '" href="' + tr['name'] + '">' + tr['name'] + '</a><br></td>' + 
                '<td class="td-star"' + tdAttr + '>' + createFiveStarBtns(tr['name'], tr['prevRating']) + '</td></tr>'
                );
        }
    }
    $('.fa-star-o').css({color: 'red'});
    $('.fa-star').css({color: 'orange'});
}

var starIdInd = 0;

function createFiveStarBtns(ratableName, prevRating) {
    var html = '';
    var i;
    var faStarFill;
    prevRating;
    for (i = 0; i < 5; i++) {
        if (i < prevRating) {
            faStarFill = '';
        }
        else {
            faStarFill = '-o';
        }
        html += '<form name="star-form" method="post"><input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" /><input name="ratable" value="' + ratableName + '"/><input name="rating" value="' + i + '" />' + 
        '<button type="submit" id="star-index-' + starIdInd + '" class="btn-star fa fa-star' + faStarFill + '"></button></form>';
        starIdInd++;
        }
    return html;
    /*$('.star-rate').append(function() {
        
    }).css({color: 'red'});*/
}

function createStarEventHandlers() {
    var idInd;
    var groupInd;
    var groupIndClicked = null;
    var skipMouseLeave = false;
    $('.btn-star').mouseenter(function() {
        if ($(this).attr('class') === 'btn-star fa fa-star-o') {
            var i;
            idInd = parseInt($(this).attr('id').substr(11), 10);
            groupInd = parseInt(idInd.toString().substr(idInd.toString().length - 1), 10);
            if (groupInd > 4) {
                groupInd -= 5;
            }
            for (i = 0; i < groupInd + 1; i++) {
                if ($('#star-index-' + (idInd - i)).attr('class') === 'btn-star fa fa-star') {
                    groupInd = i - 1;
                    break;
                }
                else {
                    $('#star-index-' + (idInd - i)).attr({
                        class: "btn-star fa fa-star" 
                    }).css({color: 'orange'});
                }
            }            
        }
        else {
            skipMouseLeave = true;
        }
    }).click(function() {
        idInd = parseInt($(this).attr('id').substr(11), 10);
        groupIndClicked = parseInt(idInd.toString().substr(idInd.toString().length - 1), 10);
        if (groupIndClicked > 4) {
            groupIndClicked -= 5;
        }
        skipMouseLeave = false;
    }).mouseleave(function() {
        if (!skipMouseLeave) {
            if (groupIndClicked === null) {
                var i;
                for (i = 0; i < groupInd + 1; i++) {
                    $('#star-index-' + (idInd - i)).attr({
                        class: "btn-star fa fa-star-o" 
                    }).css({color: 'red'});
                }
            }
            else {
                for (i = 0; i < groupIndClicked; i++) {
                    $('#star-index-' + (idInd - i)).attr({
                        class: 'btn-star fa fa-star'
                    }).css({color: 'orange'});
                }
                for (i = 0; i < 4 - groupIndClicked; i++) {
                    $('#star-index-' + (idInd + i + 1)).attr({
                        class: "btn-star fa fa-star-o" 
                    }).css({color: 'red'});
                }
                groupIndClicked = null;
            }
        }
        else {
            skipMouseLeave = false;
        }                        
    });
}

function getAsyncFormSubmits() {
    $('form[name=star-form').submit(function(){
        if (!isGuest) {
            $.post("/", $(this).serialize(), function(res) {
            console.log(res);
            });
        }
        return false;
    });
}