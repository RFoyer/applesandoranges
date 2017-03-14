var isGuest = false;
var rowInd = 0; // change to skipAmount
var detachedRows = [];
var detachedRowsIndex = 0;
var noMoreRows = false;
var detachedMoreBtn;
var detachedSpinner;
var gradId = 0;
var isFirstRow = true;
var borderTopColor = 'orange';
var avgStarColor = 'orange';
var avgStarFadedColor = '#FED8B1';

$(document).ready(function() {
    var path = location.pathname;
    setIsGuest();
    createAutocomplete();
    createSearchEventHandlers();    
    createNavbarEventHandlers();    
    if (path === '/') {
        readyTable1();
        $('#things-to-rate-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="6"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div><div><button id="add-rows-btn">More</button></div></td></tr>');
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        createRows({'length': 10, 'path': 'master'});
        createBtnEvents();
        $('#table-1').prepend('<caption>THINGS TO RATE</caption>');
    }
    else if (path === '/proposed') {
        readyTable1();
        $('#things-to-rate-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="6"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div><div><button id="add-rows-btn">More</button></div></td></tr>');
        $('.spinner').css({'color': 'green'});
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'green', 'color': 'green'});
        borderTopColor = 'green';
        avgStarColor = 'green';
        avgStarFadedColor = '#90EE90';
        createRows({'length': 10, 'path': 'proposed'});
        createBtnEvents();
        $('#table-1').prepend('<caption>PROPOSED RATABLES (APPROVAL PENDING)</caption>');
        //css
    }
    else if (path === '/login' || path === '/register') {
        
    }    
    else if (path === '/search') {
        readyTable1();
        $('#things-to-rate-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="5"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div></td></tr>');
        createRows({'length': 3, 'path': 'autocomplete'});
    }
    else if (path.slice(0, 5) === '/user') {
        $('#user-data').append('<tr id="tr-spinner"><td id="td-spinner" colspan="2"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div></td></tr><tr id="tr-add-rows"><td id="td-add-rows" colspan="2"><div><button id="add-rows-btn">More</button></div></td></tr>');
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        $.getJSON('userdata/' + path.slice(6), function(json) {
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
    else if (path === '/contributors') {
        $('#contributors-data').after('<div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>');
        $.getJSON('contributors/retrieve/0', function(json) {
            $('.spinner').remove();
            $('#contributors-data thead').append('<tr>' +
                '<th>Name</th>' +
                '<th>Ratings</th>' +
                '<th>Reviews</th>' +
                '<th>Ratables Proposed</th>' +
                '<th>Ratables Approved</th>' +
                //<th>Ratables Pending</th>
                //<th>Ratables Rejected</th>
            '</tr>');
            $('#contributors-data th').css({'padding': '4px'});
            json.forEach(function(data) {
                $('#contributors-data tbody').append('<tr><td><a href="/user/' + data.id.toString() + '">' + data.name + '</a></td>' +
                    '<td>' + data.numberOfRatings.toString() + '</td>' +
                    '<td>' + data.numberOfReviews.toString() + '</td>' +
                    '<td>' + data.numberOfProposedRatables.toString() + '</td>' +
                    '<td>' + data.numberOfApprovedRatables.toString() + '</td>' +
                    //'<td>' + data.numberOfPendingRatables.toString() + '</td>' +
                    //'<td>' + data.numberOfRejectedRatables.toString() + '</td>' +                    
                '</tr>');
                $('#contributors-data tr').last().find('td').slice(1).css({'text-align': 'center'});
            });            
        });
    }
    else if (path === '/ratable/create' || path === '/ratable/create/post') {
        
    }
    else {
        readyTable1();
        var pleaseLoginTooltip = '';
        if (isGuest) {
            pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
        }    
        $('#ratings-data').append('<div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
        $.getJSON('ratable/home/0?name=' + path.slice(1), function(json) {
            var approvalPending = '';
            var anonymousIcon = '';
            var secretEmpty = '';
            var mapMarkerTd = '<td id="td-map-marker" style="vertical-align:top;padding-left:2px;padding-right:2px;padding-top:14px;text-align:center;width:34px;"><i class="fa fa-map-marker" data-html="true" data-toggle="tooltip" data-placement="top" title="(feature coming soon)<br>(located in ' + json['region'] + ')"></i></td>';
            var eraserIcon = '';
            if (!json['isAnonymous']) {
                secretEmpty = ' secret-empty';
            }
            if (!isGuest) {
                eraserIcon = '<form class="eraser-form" name="eraser-form" method="post">' +
                                '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                                '<input type="hidden" name="id" value="' + json['id'] + '"/>' +                                
                             '</form>' +
                             '<i style="color:pink;" class="fa fa-eraser" data-toggle="tooltip" data-placement="top" title="delete your rating"></i>';
            }
            anonymousIcon = '<form class="anon-form" name="anon-form" method="post">' +
                                '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                                '<input type="hidden" name="id" value="' + json['id'] + '"/>' +
                                '<input type="hidden" name="anonymous" value="' + json['isAnonymous'] + '" />' +                        
                            '</form>' +
                            '<i class="fa fa-user-secret' + secretEmpty + '"></i>';
            if (!json['isApproved']) {
                approvalPending = '<strong><em>*approval is pending on this ratable</em></strong>';
                avgStarColor = 'green';
                avgStarFadedColor = '#90EE90';
            }
            if (json['name']) {
                $('#table-1 tbody').append('<tr class="ratable-home-tr">' +
                                                '<td><div><img class="img-max-width" src="' + json['img_src'] + '"></div></td>' +
                                                '<td>' + 
                                                    '<div>' +
                                                        '<table id="star-table">' +
                                                            '<thead>' +
                                                                '<tr><th colspan="5" style="padding-left:4px;"><h3>' + json['name'] + '</h3></th></tr>' +
                                                                '<tr><th colspan="5">' + approvalPending + '</th></tr>' +
                                                            '</thead>' +
                                                            '<tbody>' +
                                                                '<tr>' +
                                                                    '<td class="td-star"><div style="width:205px;" ' + pleaseLoginTooltip +'>' + createFiveStars(json) + '</div></td>' +
                                                                    '<td>' +
                                                                        '<div class="font-12px">' +
                                                                            '<span class="number-rating">' + json['rating'] + '/5 - </span>' + 
                                                                            '<span class="number-of-ratings">' + json['numberOfRatings'] + '</span><br>' +
                                                                        '</div>' +
                                                                    '</td>' +
                                                                    '<td style="vertical-align:top;padding-right:2px;padding-top:15px;text-align:center;width:34px;">' + anonymousIcon + '</td>' +
                                                                    mapMarkerTd +
                                                                    '<td style="vertical-align:top;padding-left:2px;padding-right:2px;padding-top:14px;text-align:center;width:34px;">' + eraserIcon + '</td>' +
                                                                '</tr>' +
                                                            '</tbody>' +
                                                        '</table>' +                                                                      
                                                    '</div>' +                                
                                                '</td>' +                            
                                            '</tr>'
                );
                $('#star-table thead').prepend('<tr><th width="205"></th><th></th><th></th><th></th><th></th></tr>');
                $('#star-table tbody tr').first().find('td').each(function(i) {
                    var width = $(this).outerWidth();
                    $(this).innerWidth(width);
                    $('#star-table thead tr').first().find('th').slice(i, i + 1).innerWidth(width);            
                });
                if (!json['region'].length) {
                    $('#td-map-marker').remove();
                }
                $('#star-table').width($('#star-table').width());        
                $('#star-table').css({'table-layout': 'fixed'});
                                
                $('#star-table').append('<tr><td><div class="align-justify font-12px">' + json['desc'] + '</div></td></tr>');
                detachedSpinner = $('.spinner').detach();
                if (pleaseLoginTooltip) {
                    $('[data-toggle="tooltip"]').tooltip();
                }
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
    createIconEvents();
}

function createRows(settings) {
    var i;
    var k = 0;
    if (settings.path !== 'autocomplete') {
        for (i = 0; i < settings.length; i++) {
            $.getJSON('ratable/' + settings.path + '/' + rowInd.toString(), function(json) {
                k++;
                if (json['name']) {
                    createTr(json);                    
                }
                else {
                    $('#things-to-rate-body').append('<tr class="ratable-tr"></tr>');
                    if (!noMoreRows) {
                        noMoreRows = true;
                        detachedRows.push($('.ratable-tr').clone());
                    }                   
                }
                if (k === settings.length) {
                    if ((detachedRowsIndex === detachedRows.length) && !noMoreRows) {
                        detachedRows.push($('.ratable-tr').clone());
                    }                    
                    detachedSpinner = $('.spinner').detach();
                    if (noMoreRows) {
                        detachedMoreBtn = $('#add-rows-btn').detach();
                    }
                    else {
                        $('#add-rows-btn').button({disabled: false});
                    }
                    if ($('#prev-rows-btn').length) {
                        $('#prev-rows-btn').button({disabled: false});
                    }                        
                }
            });
            rowInd++;
        }
    }
    else {
        $.getJSON('autocomplete?term=' + $('#table-1 > thead').attr('id'), function(searchJson) {
            var i;
            if (searchJson.length) {
                for (i = 0; i < searchJson.length; i++) {
                    $.getJSON('ratable/search/0?id=' + searchJson[i].id.toString(), function(resultJson) {
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
    var anonymousIcon = '';
    var secretEmpty = '';
    var mapMarker = '';
    var contents = '<a data-toggle="tooltip" data-placement="bottom" title="' + json['desc'] + '" href="' + json['name'] + '">' + json['name'] + '</a>';
    if (isGuest) {
        pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
    }
    if (!json['isAnonymous']) {
        secretEmpty = ' secret-empty';
    }
    anonymousIcon = '<form class="anon-form" name="anon-form" method="post">' +
                        '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                        '<input type="hidden" name="id" value="' + json['id'] + '"/>' +
                        '<input type="hidden" name="anonymous" value="' + json['isAnonymous'] + '" />' +                        
                    '</form>' +
                    '<i class="fa fa-user-secret' + secretEmpty + '"></i>';
    if (json['region'].length) {
        mapMarker = '<i class="fa fa-map-marker" data-html="true" data-toggle="tooltip" data-placement="top" title="(feature coming soon)<br>(located in ' + json['region'] + ')"></i>';
    }
    if (isFirstRow) {
        contents = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    }
    $('#things-to-rate-body').append(
        '<tr class="ratable-tr border-top-' + borderTopColor + '">' +
            '<td class="td-img"><img src="' + json['img_src'] + '" style="width:100px;"></td>' +  
            '<td>' + contents + '</td>' + 
            '<td class="td-star"><div style="width:205px;" class="btn-star-group "' + pleaseLoginTooltip + '>' + createFiveStars(json) + '</div></td>' + 
            '<td style="padding-top:10px;"> ' + json['rating'] + '/5 - ' + json['numberOfRatings'] + ' </td>' + 
            '<td style="padding-right:2px;padding-top:10px;text-align:center;width:34px;">' + anonymousIcon + '</td>' +
            '<td style="padding-left:2px;padding-right:2px;padding-top:9px;text-align:center;width:34px;">' + mapMarker + '</td>' +
        '</tr>'
    );
    $('#tr-add-rows').appendTo('#things-to-rate-body');
    if (isFirstRow) {
        isFirstRow = false;
        $('#table-1 thead').prepend('<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>');
        if (!mapMarker.length) {
            $('#table-1 .ratable-tr td').last().append('<i class="fa fa-map-marker" data-html="true" data-toggle="tooltip" data-placement="top" title="(feature coming soon)<br>see on map<br>(located in ' + json['region'] + ')"></i>');
        }
        $('#table-1 .ratable-tr td').each(function(i) {
            var width = $(this).outerWidth();
            $(this).innerWidth(width);
            $('#table-1 th').slice(i, i + 1).innerWidth(width);            
        });
        $('#table-1').width($('#table-1').width());        
        $('#table-1').css({'table-layout': 'fixed'});
        if (!mapMarker.length) {
            $('#table-1 .ratable-tr td').last().empty();
        }        
        $('#table-1 .ratable-tr td').first().next().html('<a data-toggle="tooltip" data-placement="bottom" title="' + json['desc'] + '" href="' + json['name'] + '">' + json['name'] + '</a>');
        $('#table-1 th').css({'padding-bottom': '10px'});
    }    
    $('[data-toggle="tooltip"]').tooltip({containter: 'body', html: true})
    $('[data-toggle="tooltip"]').tooltip();    
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
            stroke = avgStarColor;
            starFill = 'red';
        }
        else if (i < ratingFloor) {
            stroke = avgStarColor;
            starFill = avgStarColor;
        }
        else if ((i < json['userRating']) && (!fraction)) {
            stroke = avgStarFadedColor;
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
            stroke = avgStarFadedColor;
            starFill = 'white';
        }
        html += '<form class="star-btn-form" name="star-form" method="post">' +
                    '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                    '<input type="hidden" name="ratable" value="' + json['name'] + '"/>' +
                    '<input type="hidden" name="rating" value="' + i + '"/>' +
                    '<input type="hidden" name="anonymous" value="' + json['isAnonymous'].toString() + '"/>' +
                    '<button class="poly-star-btn">' +
                        '<svg width="40" height="40" viewBox="0 0 262 250" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                            '<defs>' +
                                '<linearGradient id="fill-grad-' + gradId.toString() + '" class="fill">' +
                                    '<stop offset="0%" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="' + avgStarColor + '" />' +
                                    '<stop offset="' + offset + '" stop-color="white" />' +
                                    '<stop offset="100%" stop-color="white" />' +
                                '</linearGradient>' +
                                '<linearGradient id="stroke-grad-' + gradId.toString() + '" class="stroke">' +
                                    '<stop offset="0%" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="' + avgStarColor + '" />' +
                                    '<stop offset="' + offset + '" stop-color="' + avgStarFadedColor + '" />' +
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
    $('#table-1').on('submit', '.star-btn-form', function(){
        if (!isGuest) {
            $.post("/", $(this).serialize(), function(res) {
            console.log(res);
            });
        }
        return false;
    });
}

function createIconEvents() {
    $('#table-1').on('submit', '.anon-form', function() {
        if ($(this).closest('tr').find('.star-btn-form').first().find('polygon').attr('fill') === "red") {
            var id = $(this).find('input[name="id"]').val().toString();
            $.post('rating/' + id, $(this).serialize(), function(res) {
                console.log(res);
            });
        }
        return false;
    });
    $('#table-1').on('submit', '.eraser-form', function() {
        if ($(this).closest('tr').find('.star-btn-form').first().find('polygon').attr('fill') === "red") {
            $(this).closest('tr').find('.star-btn-form').find('polygon').attr('fill', 'white');
            var id = $(this).find('input[name="id"]').val().toString();
            $.ajax('rating/destroy/' + id, {data: $(this).serialize(), method: "DELETE"}); 
        }
        return false;
    });
    $('#table-1').on('mouseenter', '.fa-eraser', function() {
       $(this).addClass('fa-2x');
       $(this).parent().css({'position': 'relative', 'overflow': 'hidden'});
       $(this).css({'position': 'absolute', 'left': 0, 'right': 0});
       $(this).tooltip({container: 'body'});
       $(this).tooltip('show');
       $(this).mouseleave(function() {
          $(this).removeClass('fa-2x');
          $(this).parent().css({'position': 'initial', 'overflow': 'initial'});
          $(this).css({'position': 'initial', 'left': 'initial', 'right': 'initial'});
       }); 
    });
    $('#table-1').on('click', '.fa-eraser', function() {
       if (!isGuest) {
            $(this).siblings('.eraser-form').trigger('submit');            
       }
       return false;       
    });
    $('#table-1').on('mouseenter', '.fa-user-secret', function() {
       $(this).addClass('fa-2x');
       $(this).parent().css({'position': 'relative', 'overflow': 'hidden'});
       $(this).css({'position': 'absolute', 'left': 0, 'right': 0});
       if (!$(this).attr('data-toggle')) {
           $(this).attr({'data-toggle': "tooltip", 'data-placement': "top", 'data-html': true, 'title': "rate this anonymously"});
       }
       $(this).tooltip({container: 'body'});
       $(this).tooltip('show');
       $(this).mouseleave(function() {
          $(this).removeClass('fa-2x');
          $(this).parent().css({'position': 'initial', 'overflow': 'initial'});
          $(this).css({'position': 'initial', 'left': 'initial', 'right': 'initial'});
       }); 
    });
    $('#table-1').on('click', '.fa-user-secret', function() {
       var isAnonymous = false;
       $(this).toggleClass('secret-empty');
       if (!isGuest) {
            if (!$(this).hasClass('secret-empty')) {
                isAnonymous = true;
            }
            $(this).siblings('.anon-form').find('input[name="anonymous"]').val(isAnonymous.toString());
            $(this).closest('tr').find('.star-btn-form input[name="anonymous"]').val(isAnonymous.toString());
            $(this).siblings('.anon-form').trigger('submit');            
       }
       return false;       
    });
    $('#table-1').on('mouseenter', '.fa-map-marker', function() {
       $(this).addClass('fa-2x');
       $(this).tooltip('show');
       $(this).mouseleave(function() {
          $(this).removeClass('fa-2x'); 
       }); 
    });
    $('#table-1').on('click', '.fa-map-marker', function() {
       //open map in new window 
    });
}

function createBtnEvents() {
    $('#table-1').on('click', '#add-rows-btn', function(){
        $('#add-rows-btn').button({disabled: true});
        detachedRowsIndex++;
        $('.ratable-tr').remove();
        if (!$('#prev-rows-btn').length) {
            $('#things-to-rate-body').prepend('<tr id="tr-prev-rows"><td id="td-prev-rows" colspan="6"><button id="prev-rows-btn">Previous</button></tr></td>');
        }
        $('#prev-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        if ((detachedRowsIndex === detachedRows.length) && !noMoreRows) {
            $('#td-add-rows').prepend(detachedSpinner);                
            createRows({'length': 10, 'path': 'master'});
        }
        else {
            $('#tr-add-rows').before(detachedRows[detachedRowsIndex]);
            if ((detachedRowsIndex < detachedRows.length) && !((detachedRowsIndex === (detachedRows.length - 1)) && noMoreRows)) {
                $('#add-rows-btn').button({disabled: false});            
            }
            else {
                $('#add-rows-btn').remove();
            }
            $('#prev-rows-btn').button({disabled: false});
        }            
    });
    
    $('#table-1').on('click', '#prev-rows-btn', function() {
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        detachedRowsIndex--;
        if (detachedRowsIndex === 0) {
            $('#tr-prev-rows').remove();
        }
        $('.ratable-tr').remove();
        if (!$('#add-rows-btn').length) {
            $('#td-add-rows').append('<div><button id="add-rows-btn">More</button></div>');
            $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        }
        $('#tr-add-rows').before(detachedRows[detachedRowsIndex]);
        $('#add-rows-btn').button({disabled: false}).css({'border-color': 'orange', 'color': 'orange'});
    });
}

function createSearchEventHandlers() {
    $('#div-form-search form').submit(function() {
       if (!$(this).find('#search-box').val().length) {
            /*$(this).find('#search-box').attr({ 'data-toggle': "tooltip", 'data-placement': "bottom", 'title': "Please fill out first."});
            $(this).find('#search-box').tooltip({container: 'body', trigger: 'manual'});
            $(this).find('#search-box').tooltip('show');*/
            //go here to fix arrow background: https://www.w3schools.com/bootstrap/bootstrap_ref_js_tooltip.asp
            //events that get rid of tooltip: keydown, click
            //also add timeout
            return false;
       }
    });
    $('#btn-search').mouseenter(function() {
       $(this).css({'background-color': 'white'});
    });
}

function createNavbarEventHandlers() {
    $('.nav-a').css({'height': '56px', 'display': 'table-cell', 'vertical-align': 'middle'});
    $('.dropdown').mouseenter(function() {
        $(this).addClass('open');
        $(this).find('a').first().attr('aria-expanded', false);
        $(this).find('a').first().css({'background-color': 'white', 'color': '#32a232'});
        if (!isGuest) {
            $('#ul-logout').width($('#ul-logout').parent().width());
        }
        $(this).find('ul').find('a').mouseenter(function() {
           $(this).css({'background-color': '#32a232', 'color': 'white'});
           $(this).parent().css({'background-color': '#32a232'});
           $(this).mouseleave(function() {
               $(this).css({'background-color': 'white', 'color': '#32a232'});
               $(this).parent().css({'background-color': 'white'});
           });
        });
        $(this).mouseleave(function() {
            $(this).removeClass('open');
            $(this).find('a').first().attr('aria-expanded', true);
            $(this).find('a').css({'background-color': 'white', 'color': '#32a232'});
            $(this).find('a').first().css({'background-color': '#32a232', 'color': 'white'});
        });
    });
}