var isGuest = false;
var rowInd = 1;
var detach;
var gradId = 0;

$(document).ready(function() {
    if ($('#table-1').hasClass("guest")) {
        isGuest = true;
    }
    $('#search-box').autocomplete({
        source: 'autocomplete'        
    }).autocomplete('instance')._renderItem = function(ul, item) {
            return $("<li>").append('<div><img class="search-img" width="60" src="' + item.img + '"/>' + item.value + '</div>').appendTo(ul);
    };
    createStarEvents();
    getAsyncFormSubmits();
    $('#things-to-rate-body').append('<tr id="tr-add-rows"><td class="td-add-rows" colspan="4"><div><button class="add-rows-btn">More</button></div></td></tr>');
    $('.add-rows-btn').button();
    createRows();
    $('.add-rows-btn').click(function(){
        detach = $('.ratable-tr').detach();
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
                    createTr(json);
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

function createTr(json) {
    var pleaseLoginTooltip = '';
    var ratingTooltip = '';
    if (isGuest) {
        pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
    }
    if (json['userRating']) {
        ratingTooltip = '<i class="fa fa-check" data-toggle="tooltip" data-placement="right" title="You have rated this item!"></i>';
    }
    else {
        ratingTooltip = '<i class="fa fa-check-square" data-toggle="tooltip" data-placement="right" title="You have not yet rated this item."></i>';
    }
    $('#things-to-rate-body').append(
        '<tr class="ratable-tr"><td class="td-img"><img src="' + json['img_src'] + '" width="100"></td>' +  
        '<td><a data-toggle="tooltip" data-placement="bottom" title="' + json['desc'] + '" href="' + json['name'] + '">' + json['name'] + '</a><br></td>' + 
        '<td class="td-star"><div class="btn-star-group "' + pleaseLoginTooltip + '>' + createFiveStars(json) + '</div></td>' + 
        '<td> ' + json['rating'] + '/5 - ' + json['numberOfRatings'] + ' </td>' + 
        '<td class="td-check">' + ratingTooltip + '</td></tr>'
    );
    $('[data-toggle="tooltip"]').tooltip();
    $('#tr-add-rows').appendTo('#things-to-rate-body');
}

function createFiveStars(json) {
    var html = '';
    var i;
    var starFill = '';
    var stroke = '';
    var offset = '50%';
    var fraction = parseFloat(parseFloat(json['rating'].substring(json['rating'].length - 2)).toFixed(1));
    var ratingFloor = Math.floor(parseFloat(json['rating']));
    for (i = 0; i < 5; i++) {
        if (i < json['userRating'] && i < json['rating']) {
            stroke = 'orange';
            starFill = 'red';
        }
        else if (i < json['userRating']) {
            stroke = '#FED8B1';
            starFill = 'red';
        }
        else if (i < ratingFloor) {
            stroke = 'orange';
            starFill = 'orange';
        }
        else if ((i === ratingFloor) && fraction) {
            offset = json['rating'].substring(json['rating'].length - 1) + '0%';
            stroke = "url(#stroke-grad-" + gradId.toString() + ")";
            starFill = "url(#fill-grad-" + gradId.toString() + ")";            
        }
        else {
            stroke = '#FED8B1';
            starFill = 'white';
        }
        html += '<form class="star-btn-form" name="star-form" method="post">' +
                    '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                    '<input name="ratable" value="' + json['name'] + '"/><input name="rating" value="' + i + '" />' +
                    '<button class="poly-star-btn">' +
                        '<svg width="40" height="40" viewBox="0 0 262 250" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                            '<defs>' +
                                '<linearGradient id="fill-grad-' + gradId.toString() + '" class="fill">' +
                                    '<stop offset="0%" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="white" />' +
                                    '<stop offset="100%" stop-color="white" />' +
                                '</linearGradient>' +
                                '<linearGradient id="stroke-grad-' + gradId.toString() + '" class="stroke">' +
                                    '<stop offset="0%" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="#FED8B1" />' +
                                    '<stop offset="100%" stop-color="#FED8B1" />' +
                                '</linearGradient>' +
                            '</defs>' +
                            '<polygon class="polygon-' + i + '" fill="' + starFill + '" stroke="' + stroke + '" stroke-width="20"'  +
                            'points="123,4 152,90 242,90 170,144 196,230 123,179 50,230 76,144 4,90 94,90" />' +
                        '</svg>' + 
                    '</button>' +
                '</form>';
        gradId++;
    }
    return html;
}

function createStarEvents() {
    var startFill = [];
    var clicked = false;
    $('#table-1').on('mouseenter', '.poly-star-btn', function() {
        startFill = [];
        var stroke = '';
        var i;
        var length = parseInt($(this).parent().find('input[name="rating"]').val(), 10) + 1;
        for (i = 0; i < length; i++) {
            startFill[i] = $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill');
            $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill', 'red');
        }
        for (i = length; i < 5; i++) {
            startFill[i] = $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill');
            if (startFill[i] === 'red') {
                stroke = $(this).parent().parent().find('.polygon-' + i.toString()).attr('stroke');
                if (stroke === 'orange') {
                    $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill', 'orange');
                }
                else if (stroke.slice(0, 1) === 'u') {
                    $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill', "url(#" + $(this).parent().parent().find('.polygon-' + i.toString()).parent().find('.fill').attr('id') + ")");
                }
                else {
                    $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill', 'white');
                }                
            }            
        }
    });
    $('#table-1').on('click', '.poly-star-btn', function() {
        clicked = true;
    });
    $('#table-1').on('mouseleave', '.poly-star-btn', function() {
        var i;
        var length;
        var stroke = '';
        var restoreFill = '';
        if (!clicked) {
            for (i = 0; i < 5; i++) {
                $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill', startFill[i]);
            }
        }
        else {
            clicked = false;
            length = parseInt($(this).parent().find('input[name="rating"]').val(), 10) + 1;
            for (i = length; i < 5; i++) {
                stroke = $(this).parent().parent().find('.polygon-' + i.toString()).attr('stroke');
                if (stroke === 'orange') {
                    restoreFill = 'orange';
                }
                else if (stroke.slice(0, 1) === 'u') {
                    restoreFill = "url(#" + $(this).parent().parent().find('.polygon-' + i.toString()).parent().find('.fill').attr('id') + ")";
                }
                else {
                    restoreFill = 'white';
                }                
                $(this).parent().parent().find('.polygon-' + i.toString()).attr('fill', restoreFill);
            }
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