var isGuest = false;
var rowInd = 1;
var detachedRows = [];
var detachedMoreBtn;
var detachedSpinner;
var gradId = 0;

$(document).ready(function() {
    var path = location.pathname;
    setIsGuest();
    createAutocomplete();
    if (path === '/') {
        readyTable1();
        $('#things-to-rate-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="5"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div><div><button id="add-rows-btn">More</button></div></td></tr>');
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        createRows({'length': 10, 'path': 'table'});
        $('#add-rows-btn').click(function(){
            $('#add-rows-btn').button({disabled: true});
            detachedRows.push($('.ratable-tr').detach());
            $('#td-add-rows').prepend(detachedSpinner);
            if ($('#prev-rows-btn').length) {
                $('#prev-rows-btn').button({disabled: true});
            }
            else {
                $('#things-to-rate-body').prepend('<tr id="tr-prev-rows"><td id="td-prev-rows" colspan="5"><button id="prev-rows-btn">Previous</button></tr></td>');
                $('#prev-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
                $('#prev-rows-btn').click(function() {
                    $('.ratable-tr').remove();
                    $('#tr-add-rows').before(detachedRows[detachedRows.length - 1]);
                    detachedRows.pop();
                    if (!detachedRows.length) {
                        $('#prev-rows-btn').remove();
                    }
                });
            }
            createRows({'length': 10, 'path': 'table'});
        });
    }    
    else if (path === '/login' || path === '/register') {
        
    }    
    else if (path === '/search') {
        readyTable1();
        $('#things-to-rate-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="5"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div></td></tr>');
        createRows({'length': 3, 'path': 'autocomplete'});
    }
    else if (path.slice(0, 5) === '/user') {
        $('#user-data').append('<tr id="tr-spinner"><td id="td-spinner" colspan="2"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div></td></tr><tr id="tr-add-rows"><td id="td-add-rows" colspan="2"><div><button id="add-rows-btn">More</button></div></td></tr>');
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        $.getJSON('userdata/' + path.slice(5), function(json) {
           if (json['username']) {
                $('#user-data').before('<table><tr><th>User:</th></tr><tr><td>' + json['username'] + '</td></tr>');
                $('#user-data thead').append('<tr><th>Ratings:</th></tr>');
                createUserDataRows(json)
           }
           else {
                detachedSpinner = $('.spinner').detach();
                $('#user-data').after('<div>Sorry, this user does not seem to exist!</div>');
           }
        });
    }
    else {
        var pleaseLoginTooltip = '';
        if (isGuest) {
            pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
        }    
        $('#ratings-data').append('<div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
        $.getJSON('ratable?name=' + path.slice(1), function(json) {
            var tableWidth;
            if (json['name']) {
                $('#ratings-data').append('<div>' + 
                        '<table id="table-1"><tr class="ratable-home-tr">' +
                            '<td><div><img class="img-max-width" src="' + json['img_src'] + '"></div></td>' +
                            '<td>' + 
                                '<div>' +
                                    '<table id="star-table">' +
                                        '<th><h3>' + json['name'] + '</h3></th>' + 
                                        '<tr>' +
                                            '<td width="205" class="td-star"><div ' + pleaseLoginTooltip +'>' + createFiveStars(json) + '</div></td>' +
                                            '<td>' +
                                                '<div class="font-12px">' +
                                                    '<span class="number-rating">' + json['rating'] + '/5 - </span>' + 
                                                    '<span class="number-of-ratings">' + json['numberOfRatings'] + '</span><br>' +
                                                '</div>' +
                                            '</td>' +
                                        '</tr>' +                                        
                                    '</table>' +                                                                      
                                '</div>' +                                
                            '</td>' +                            
                        '</tr></table>' +                                                
                    '</div>'
                );
                tableWidth = $('#star-table').width();
                $('#star-table').append('<tr><td colspan="2"><div class="align-justify font-12px">' + json['desc'] + '</div></td></tr>');
                $('#star-table').css({'max-width': tableWidth});
                detachedSpinner = $('.spinner').detach();
                if (pleaseLoginTooltip) {
                    $('[data-toggle="tooltip"]').tooltip();
                }
                readyTable1();
                getReviews(json['name']);
            }            
        });        
    }       
});

function createUserDataRows(json) {
    var i;
    var length = 10;
    if (json.ratings.length < 10) {
        length = json.ratings.length;
    }
    for (i = 0; i < length; i++) {
        if (!json['ratings'][i]['anonymous']) {
            $('#tr-spinner').after('<tr><td><a href="/' + json['ratings'][i]['ratable'] + '">' + json['ratings'][i]['ratable'] + '</a></td><td>Stars: ' + json['ratings'][i]['rating'] + '</td></tr>');
        }
    }
    if (json['reviews'].length) {
        if (json.reviews.length < 10) {
            length = json.reviews.length;
        }
        for (i = 0; i < length; i++) {
            $('#user-data').after('<table id="review-data">' +
                '<tr><td>' + json['reviews'] + '</td><tr>' +
            '</table>');
        }
    }
    else {
        $('#user-data').after('<table><tr><th>Reviews:</th></tr><tr><td>none</td></tr></table>');
    }
    detachedSpinner = $('.spinner').detach();
    //enable button
}

function getReviews(ratableName) {
    $('#ratings-data').append(detachedSpinner).after('<br>Reviews:<br>' + '<textarea rows="2" cols="50" placeholder="review ' + ratableName + '...(review feature coming soon)"></textarea>');
    /*$.getJSON('reviews?name=' + ratableName, function(json) {
        
    });*/
    detachedSpinner = $('.spinner').detach();
}

function setIsGuest() {
    if ($('#table-1').hasClass("guest") || $('#ratings-data').hasClass('guest')) {
        isGuest = true;
    }    
}

function createAutocomplete() {
    $('#search-box').autocomplete({
        source: 'autocomplete'        
    }).autocomplete('instance')._renderItem = function(ul, item) {
        return $("<li>").append('<div><img class="search-img" width="60" src="' + item.img + '"/>' + item.value + '</div>').appendTo(ul);
    };
}

function readyTable1() {
    createStarEvents();
    getAsyncFormSubmits();    
}

function createRows(settings) {
    var i;
    var k = 0;
    if (settings.path === 'table') {
        for (i = 0; i < settings.length; i++) {
            $.getJSON('table?id=' + rowInd.toString(), function(json) {
                if (json['name']) {
                    createTr(json);
                    k++;
                    if (k === (settings.length)) {
                        detachedSpinner = $('.spinner').detach();
                        $('#add-rows-btn').button({disabled: false});
                        if ($('#prev-rows-btn').length) {
                            $('#prev-rows-btn').button({disabled: false});
                        }
                    }
                }
                else {
                    i = 10;
                    detachedMoreBtn = $('.add-rows-btn').detach();
                    $('.td-add-rows').html('Nothing more to rate at this time. Thank you for trying Apples and Oranges!').css({color: 'red'});
                }
            });
            rowInd++;
        }
    }
    else if (settings.path === 'autocomplete') {
        $.getJSON('autocomplete?term=' + $('#table-1 > thead').attr('id'), function(searchJson) {
            var i;
            if (searchJson.length) {
                for (i = 0; i < searchJson.length; i++) {
                    $.getJSON('table?id=' + searchJson[i].id, function(resultJson) {
                        createTr(resultJson);
                        k++;
                        if (k === (searchJson.length)) {
                            $('.spinner').remove();
                        }
                    });
                }
            }
            else {
                $('#table-1').after("Sorry, none found...");
            }
        });
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
        if ((i < json['userRating']) && (i < ratingFloor)) {
            stroke = 'orange';
            starFill = 'red';
        }
        else if (i < ratingFloor) {
            stroke = 'orange';
            starFill = 'orange';
        }
        else if ((i < json['userRating']) && (!fraction)) {
            stroke = '#FED8B1';
            starFill = 'red';
        }
        else if ((i < json['userRating']) && fraction && (i === ratingFloor)) {
            offset = json['rating'].substring(json['rating'].length - 1) + '0%';
            stroke = "url(#stroke-grad-" + gradId.toString() + ")";
            starFill = "red";
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
    $('#table-1').on('submit', 'form', function(){
        if (!isGuest) {
            $.post("/", $(this).serialize(), function(res) {
            console.log(res);
            });
        }
        return false;
    });
}