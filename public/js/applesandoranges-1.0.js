$(document).ready(function() {
    if ($('#table-1').hasClass("guest")) {
        isGuest = true;
    }
    $('#search-box').autocomplete({
        source: 'autocomplete'        
    }).autocomplete('instance')._renderItem = function(ul, item) {
            return $("<li>").append('<div><img class="search-img" width="60" src="' + item.img + '"/>' + item.value + '</div>').appendTo(ul);
    };
    createTables();        
});

var isGuest = false;

function createTables() {
    var i;
    var k = 1;
    var path = location.pathname;
    if (path === '/') {
        $.getJSON('table?id=' + k.toString(), function(json) {
            createTableRow(json);
            createStarEventHandlers();
            getAsyncFormSubmits();
            $('a').tooltip();
            if ($('.td-star').attr('data-toggle') === "tooltip") {
                $('.td-star').tooltip();
            }
        });
        for (i = 0; i < 9; i++) {
            k++;        
            $.getJSON('table?id=' + k.toString(), function(json) {
                createTableRow(json);                
            });
        }        
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

function createTableRow(json) {    
    var i;
    var tdAttr = '';
    if (isGuest) {
        tdAttr = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
    }
    $('#things-to-rate-body').append(
        '<tr><td class="td-img"><img src="' + json['img_src'] + '" width="100"></td>' +  
        '<td class="ratable-name"><a data-toggle="tooltip" data-placement="bottom" title="' + json['desc'] + '" href="' + json['name'] + '">' + json['name'] + '</a><br></td>' + 
        '<td class="td-star"' + tdAttr + '>' + createFiveStarBtns(json['name'], json['prevRating']) + '</td></tr>'
    );            
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