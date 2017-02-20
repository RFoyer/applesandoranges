var isGuest = false;
var starInd = 0;
var groupInd = 0;
var rowInd = 1;
var d;

$(document).ready(function() {
    if ($('#table-1').hasClass("guest")) {
        isGuest = true;
    }
    $('#search-box').autocomplete({
        source: 'autocomplete'        
    }).autocomplete('instance')._renderItem = function(ul, item) {
            return $("<li>").append('<div><img class="search-img" width="60" src="' + item.img + '"/>' + item.value + '</div>').appendTo(ul);
    };
    createStarEventHandlers();
    getAsyncFormSubmits();
    $('#things-to-rate-body').append('<tr id="tr-add-rows"><td class="td-add-rows" colspan="4"><div><button class="add-rows-btn">More</button></div></td></tr>');
    $('.add-rows-btn').button();
    createRows();
    $('.add-rows-btn').click(function(){
        d = $('.ratable-tr').detach();
        createRows();
    });   
});

function createRows() {
    var i;
    var path = location.pathname;
    if (path === '/') {
        for (i = 0; i < 10; i++) {
            $.getJSON('table?id=' + rowInd.toString(), function(json) {
                if (json['name']) {
                    createTableRow(json);
                }
                else {
                    i = 10;
                    $('.add-rows-btn').detach();
                    $('.td-add-rows').html('Nothing more to rate at this time. Thank you for trying Apples and Oranges!').css({color: 'red'});
                }
            });
            rowInd++;                    
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
    var tdAttr = '';
    var html = '';
    if (isGuest) {
        tdAttr = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
    }
    if (json['userRating']) {
        html = '<i class="fa fa-check" data-toggle="tooltip" data-placement="right" title="You have rated this item!"></i>';
    }
    else {
        html = '<i class="fa fa-check-square" data-toggle="tooltip" data-placement="right" title="You have not yet rated this item."></i>';
    }
    $('#things-to-rate-body').append(
        '<tr class="ratable-tr"><td class="td-img"><img src="' + json['img_src'] + '" width="100"></td>' +  
        '<td><a id="ratable-name-' + groupInd.toString() + '" data-toggle="tooltip" data-placement="bottom" title="' + json['desc'] + '" href="' + json['name'] + '">' + json['name'] + '</a><br></td>' + 
        '<td class="td-star"><div class="btn-star-group" id="star-group-' + groupInd.toString() + '" ' + tdAttr + '>' + createFiveStarBtns(json['name'], json['userRating']) + '</div></td>' + 
        '<td> ' + json['rating'] + '/5 - ' + json['numberOfRatings'] + ' </td>' + 
        '<td class="td-check">' + html + '</td></tr>'
    );
    $('[data-toggle="tooltip"]').tooltip();
    groupInd++;
    $('#tr-add-rows').appendTo('#things-to-rate-body');
    $('.fa-star-o').css({color: 'red'});
    $('.fa-star').css({color: 'red'});
    $('.fa-2x').css({color: 'orange'});
}

function createFiveStarBtns(ratableName, userRating) {
    var html = '';
    var i;
    var faStarFill;
    for (i = 0; i < 5; i++) {
        if (i < userRating) {
            faStarFill = '';
        }
        else {
            faStarFill = '-o';
        }
        html += '<span class="star-span"><i class="fa fa-star fa-2x"></i><form class="star-btn-form" name="star-form" method="post"><input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" /><input name="ratable" value="' + ratableName + '"/><input name="rating" value="' + i + '" />' + 
        '<button type="submit" id="star-index-' + starInd + '" class="btn-star fa fa-star' + faStarFill + '"></button></form></span>';
        starInd++;        
    }
    return html;    
}

function createStarEventHandlers() {
    var idInd;
    var groupInd;
    var groupIndClicked = null;
    var skipMouseLeave = false;
    $('#table-1').on('mouseenter', ".btn-star", function() {
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
                    }).css({color: 'red'});
                }
            }            
        }
        else {
            skipMouseLeave = true;
        }
    });
    $('#table-1').on('click', ".btn-star", function() {
        idInd = parseInt($(this).attr('id').substr(11), 10);
        groupIndClicked = parseInt(idInd.toString().substr(idInd.toString().length - 1), 10);
        if (groupIndClicked > 4) {
            groupIndClicked -= 5;
        }
        skipMouseLeave = false;
        if(!isGuest) {
            //$('.td-check').html('<i class="fa fa-check"></i>');
        }
    });
    $('#table-1').on('mouseleave', ".btn-star", function() {
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
                    }).css({color: 'red'});
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
    $('#table-1').on('submit', 'form[name=star-form]', function(){
        if (!isGuest) {
            $.post("/", $(this).serialize(), function(res) {
            console.log(res);
            });
        }
        return false;
    });
}