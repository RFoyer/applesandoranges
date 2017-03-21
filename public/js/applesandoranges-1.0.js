var globalVars = {
    'deviceType': "desktop",
    'isGuest': false,
    'skipRatingCount': 0,
    'skipReviewCount': 0,
    'detachedRatingsRows': [],
    'detachedRatingsRowsIndex': 0,    
    'noMoreRows': false,
    'ratingsIndex': 0,
    'reviewsIndex': 0,
    'detachedMoreBtn': '',
    'detachedSpinner': '',
    'gradId': 0,
    'borderTopColor': 'orange',
    'avgStarColor': 'orange',
    'avgStarFadedColor': '#FED8B1'
};

$(document).ready(function() {
    readyPage();
    fillTables();
});

function fillTables() {
    var path = location.pathname;
    if (path === '/') {
        fillMasterTable();                
    }
    else if (path === '/proposed') {
        fillProposedTable();
    }
    else if (path === '/search') {
        fillSearchTable();
    }
    else if (path.slice(0, 5) === '/user') {
        fillUserTables();
    }
    else if (path === '/contributors') {
        fillContributorsTable();
    }
    else if (!$('#error').length) {
        fillRatableTables();        
    }
}

function fillMasterTable() {
    readyMasterTable();    
    createRows('master');   
}

function fillProposedTable() {
    readyProposedTable();
    createRows('proposed');
}

function fillSearchTable() {
    createTable1Events();
    appendSearchSpinner();
    createRows('autocomplete');
}

function fillUserTables() {
    appendUserSpinners();
    $.getJSON('/table/user?id=' + location.pathname.slice(6), function(json) {
        $('#user-data tbody .tr-spinner').remove();
        if (json['username']) {
            $('#user-data tbody').prepend('<tr><td>'+ json['username'] + '</td></tr>');
            createUserDataRows(json)
       }
       else {
            $('#user-data tbody').append('<tr><td>Sorry, this user does not seem to exist!</td></tr>');
       }
    });
}

function fillContributorsTable() {
    $('#contributors-data').after('<div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>');
    $('#contributors-data th').css({'padding-left': '4px', 'padding-right': '4px', 'text-align': 'center'});
    $.getJSON('/table/contributors', function(json) {
        $('.spinner').remove();
        json.forEach(function(data) {
            $('#contributors-data tbody').append('<tr>' +
                '<td class="td-user"><a href="/user/' + data.id.toString() + '">' + data.name + '</a></td>' +
                '<td>' + data.numberOfRatings.toString() + '</td>' +
                '<td>' + data.numberOfReviews.toString() + '</td>' +
                '<td>' + data.numberOfProposedRatables.toString() + '</td>' +
                '<td>' + data.numberOfApprovedRatables.toString() + '</td>' +
                //'<td>' + data.numberOfPendingRatables.toString() + '</td>' +
                //'<td>' + data.numberOfRejectedRatables.toString() + '</td>' +                    
            '</tr>');
        });
        $('#contributors-data tr').not('.td-user').css({'text-align': 'center'});
        $('#contributors-data .td-user').css({'text-align': 'left'});
    });
}

function fillRatableTables() {
    if ($('#tr-review-form').length) {
        $('#tr-review-form').hide();
    }
    createTable1Events();
    $('#reviews-data').after('<div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
    $.getJSON('/table/home?name=' + path.slice(1), function(json) {
        createRatableTable1Rows(json);
        createRatableReviewsRows(json['name']);
    });
}

function readyMasterTable() {
    $('#table-1').prepend('<caption>THINGS TO RATE</caption>');
    appendSpinnerWithMoreBtn('orange');    
    createTable1Events();
    createBtnEvents();
}

function readyProposedTable() {
    $('#table-1').prepend('<caption>PROPOSED RATABLES (APPROVAL PENDING)</caption>');
    appendSpinnerWithMoreBtn('green');
    createTable1Events();
    createBtnEvents();
    setProposedTableColors();
}

function appendSpinnerWithMoreBtn(color) {
    $('#table-1-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="6"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div><div><button id="add-rows-btn">More</button></div></td></tr>');
    $('#add-rows-btn').button({disabled: true}).css({'border-color': color, 'color': color});
    $('.spinner').css({'color': color});
}

function setProposedTableColors() {
    globalVars.borderTopColor = 'green';
    globalVars.avgStarColor = 'green';
    globalVars.avgStarFadedColor = '#90EE90';
}

function appendSearchSpinner() {
    $('#table-1-body').append('<tr id="tr-add-rows"><td id="td-add-rows" colspan="5"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div></td></tr>');
}

function appendUserSpinners() {
    globalVars.detachedSpinner = '<tr class="tr-spinner"><td colspan="2"><div class="spinner"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div></td></tr>';
    $('#user-data tbody').append(globalVars.detachedSpinner);
    $('#ratings-data tbody').append(globalVars.detachedSpinner);
    $('#reviews-data tbody').append(globalVars.detachedSpinner);
}

function readyPage() {
    setDeviceType();
    makePaddingForFooter();    
    setIsGuest();
    createAutocomplete();
    createSearchEvents();    
    createNavbarEvents();
}

function setDeviceType() {
    if (window.innerWidth <= 800) {
        globalVars.deviceType = "mobile";
        $('#body').add('#nav').add('#nav-container').add('#div-mid').css({'width': '100%'});
        $('.ad-space').css({'width': $('#body').width()});
        $('.navbar-header').add('.navbar-collapse').css({'margin': '0px'});        
    }
    else {
        $('#search-box').focus();
        $('.input-group').css({'width': '250px'});
    }
}

function makePaddingForFooter() {
    $('#main-body-container').css({'padding-bottom': $('#footer').outerHeight()});
}

function setIsGuest() {
    if ($('#table-1').hasClass("guest") || $('#ratings-data').hasClass('guest')) {
        globalVars.isGuest = true;
    }    
}

function createAutocomplete() {
    $('#search-box').autocomplete({
        source: 'autocomplete'        
    }).autocomplete('instance')._renderItem = function(ul, item) {
        return $("<li>").append('<div><img class="search-img" width="60" src="' + item.img + '"/>' + item.value + '</div>').appendTo(ul);
    };
}

function createSearchEvents() {
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

function createNavbarEvents() {
    var detachedSearch;
    $('.nav-a').css({'height': '56px', 'display': 'table-cell', 'vertical-align': 'middle'});
    if (globalVars.deviceType === "desktop") {
        $('.navbar-collapse').css({'background-color':'#32a232'});
        $('.dropdown-menu').css({'padding': '0px', 'min-width': '0px'});
        $('.dropdown').mouseenter(function() {
            $(this).addClass('open');
            $(this).find('a').first().attr('aria-expanded', false);
            $(this).find('a').first().css({'background-color': 'white', 'color': '#32a232'});
            if (!globalVars.isGuest) {
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
    else {
        detachedSearch = $('#div-form-search').detach();
        $('.logo').after(detachedSearch);
        $('.logo').css({'padding': 'auto', 'height': 'auto', 'float': 'left', 'vertical-align': 'middle', 'background-color': 'white'});
        $('#logo').css({'height': 'auto', 'padding': 'auto'});
        $('#logo').not('#and').css({'font-size': '14px'});
        $('#div-form-search').css({'float': 'left', 'padding': '8px', 'margin': 'auto', 'height': 'auto', 'width': 'auto'});
        $('#search-box').css({'height': 'auto', 'padding': '5px', 'margin': 'auto', 'width': '108px'});
        $('#btn-search').css({'padding-top': '5px', 'padding-bottom': '5px'});
        $('.navbar-header .input-group').add('.navbar-header .input-group-btn').css({'height': 'auto', 'padding': 'auto', 'margin': 'auto'});
        $('.nav-a').css({'background-color': '#32a232', 'color': 'white'});
        $('.navbar-collapse').css({'padding': '4px', 'background-color': '#32a232'});
        $('.navbar-nav').css({'margin': '0px'});
        $('.navbar-header button').css({'border-color': '#32a232', 'background-color': 'white'});
        $('.dropdown-menu').css({'background-color': '#32a232', 'padding': '0px'});
        $('.nav-a').last().css({'padding': 'auto'});
        $('.navbar-header').css({'background-color': '#32a232'});
        $('.input-group').css({'width': '150px'});
        $('.caret').attr('class', 'fa fa-caret-right');
    }
}

function createTable1Events() {
    createTable1StarEvents();
    makeTable1StarFormsAsync();
    createTable1IconEvents();
}

function createTable1StarEvents() {
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

function makeTable1StarFormsAsync() {
    $('#table-1').on('submit', '.star-btn-form', function(){
        if (!globalVars.isGuest) {
            $.post("rating", $(this).serialize(), function(res) {
            console.log(res);
            });
        }
        return false;
    });
}

function createTable1IconEvents() {
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
    $('#table-1').on('click', '.fa-eraser', function() {
       if (!globalVars.isGuest) {
            $(this).siblings('.eraser-form').trigger('submit');            
       }
       return false;       
    });
    $('#table-1').on('click', '.fa-user-secret', function() {
       var isAnonymous = false;
       $(this).toggleClass('secret-empty');
       if (!globalVars.isGuest) {
            if (!$(this).hasClass('secret-empty')) {
                isAnonymous = true;
            }
            $(this).siblings('.anon-form').find('input[name="anonymous"]').val(isAnonymous.toString());
            $(this).closest('tr').find('.star-btn-form input[name="anonymous"]').val(isAnonymous.toString());
            $(this).siblings('.anon-form').trigger('submit');            
       }
       return false;       
    });
    
    /*$('#table-1').on('click', '.fa-map-marker', function() {
       //open map in new window 
    });*/
}

function createRatableTable1Rows(json) {
    var pleaseLoginTooltip = '';
    var imgTd = '';
    var approvalPending = '';
    var anonymousIcon = '';
    var secretEmpty = '';
    var anonymousTooltip = '';
    var mapMarker = '';
    var mapMarkerTooltip = '';
    var eraserIcon = '';
    var eraserTooltip = '';
    if (globalVars.isGuest) {
            pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
    }
    if (globalVars.deviceType === 'desktop') {
        imgTd = '<td><img class="img-max-width" src="' + json['img_src'] + '"></td>';
        mapMarkerTooltip = ' data-html="true" data-toggle="tooltip" data-placement="top" title="located in ' + json['region'] + '<br>(map feature coming soon)"';
        eraserTooltip = ' data-toggle="tooltip" data-placement="top" title="clear your rating"';
        anonymousTooltip = ' data-toggle="tooltip" data-placement="top" title="rate this anonymously"';
    }
    if (json['region'].length) {
        mapMarker = '<div style="float:left;padding-left:4px;"><i class="fa fa-map-marker fa-lg"' + mapMarkerTooltip + '></i></div>';
    }                
    if (!json['isAnonymous']) {
        secretEmpty = ' secret-empty';
    }
    if (!globalVars.isGuest) {
        eraserIcon = '<div style="float:left;padding-left:4px;"><form class="eraser-form" name="eraser-form" method="post">' +
                        '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                        '<input type="hidden" name="id" value="' + json['id'] + '"/>' +                                
                     '</form>' +
                     '<i style="color:pink;" class="fa fa-eraser fa-lg"' + eraserTooltip + '></i>' +
                     '</div>';
    }
    anonymousIcon = '<div style="float:left;padding-left:4px;"><form class="anon-form" name="anon-form" method="post">' +
                        '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                        '<input type="hidden" name="id" value="' + json['id'] + '"/>' +
                        '<input type="hidden" name="anonymous" value="' + json['isAnonymous'] + '" />' +                        
                    '</form>' +
                    '<i class="fa fa-user-secret fa-lg' + secretEmpty + '"' + anonymousTooltip + '></i></div>';
    if (!json['isApproved']) {
        approvalPending = '<strong><em>*approval is pending on this ratable</em></strong>';
        globalVars.avgStarColor = 'green';
        globalVars.avgStarFadedColor = '#90EE90';
    }
    $('#table-1 tbody').append('<tr>' + imgTd +
                                    '<td style="overflow:hidden;">' +
                                        '<div><h3>' + json['name'] + '</h3></div>' +
                                        '<div style="float:left;width:100%;">' + approvalPending + '</div>' +
                                        '<div class="td-star" style="float:left;"' + pleaseLoginTooltip + '>' + createFiveStars(json) + '</div>' +
                                        '<div><div style="float:left;width:100%"><div style="float:left;">' + json['rating'] + '/5 - ' + json['numberOfRatings'] + '</div>' + anonymousIcon + mapMarker + eraserIcon + '</div></div>' +
                                        '<div><div style="float:left;width:100%;">' + json['desc'] + '</div></div>' +
                                    '</td></tr>'
    );
    $('[data-toggle="tooltip"]').tooltip({container: 'body'});
    $('[data-toggle="tooltip"]').tooltip();       
}

function createRatableReviewsRows(ratableName) {
    var i;
    readyRatableTable2(ratableName);
    for (i = 0; i < 10; i++) {
        createRatableTable3Rows(ratableName);
        globalVars.skipReviewCount++;
    }    
}

function readyRatableTable2(ratableName) {
    $('#table-2').prepend('<caption>Reviews:</caption>');
    $('.review-form input[name="ratable"]').val(ratableName);
    if (!globalVars.isGuest) {
        $('#tr-review-form').hide();
        $.getJSON('review', {'ratable': ratableName, 'userId': "useAuthId", 'skip': 0 }, function(json) {
            if (!json['review']) {
                $('#tr-review-form').show();
                createRatableTable2CreateReviewEvents();
            }
            else {
                $('#table-2 tbody').append('<tr class="user-review"><td><button class="btn btn-default">your review</button></td></tr>')
                createRatableTable2EditReviewEvents(json);
            }
        });
    }
    $('#table-2').on('focus', 'textarea', function() {
       $(this).attr('rows', '10');       
    });
}

function createRatableTable2CreateReviewEvents() {
    $('#table-2').on('submit', '.review-form', function() {
        if (!globalVars.isGuest) {
            $.post("review", $(this).serialize(), function(res) {
                console.log(res);
            });
        }
        $('#tr-review-form').hide();
        $('#table-2 tbody').append('<tr><td style="color:green;"><i class="fa fa-check"></i> Your review has been submitted!</td></tr>');
        return false;
    });
    $('#table-2').on('click', '.fa-user-secret', function() {
        var isAnonymous = false;
        $(this).toggleClass('secret-empty');
        if (!globalVars.isGuest) {
             if (!$(this).hasClass('secret-empty')) {
                 isAnonymous = true;
             }
             $('.review-form').find('input[name="anonymous"]').val(isAnonymous);            
        }
        return false;       
    });
}

function createRatableTable2EditReviewEvents(json) {
    $('#table-2').on('click', '.user-review', function() {
        var pencilSquareTooltip = '';
        var eraserTooltip = '';
        $(this).remove();
        if (globalVars.deviceType === "desktop") {
            pencilSquareTooltip = ' data-toggle="tooltip" data-placement="top" title="edit your review"';
            eraserTooltip = ' data-toggle="tooltip" data-placement="top" title="clear your review">';
        }
        $('#table-2 tbody').append('<tr><td>' +
                '<div style="display:table;margin-bottom:-6px">' + 
                    createSmallReadOnlyStars(json['rating']) + 
                    ' <strong style="vertical-align:middle;display:table-cell;padding-bottom:5px;padding-left:2px"> ' + json['headline'] + '</strong>' +
                    '<table><tr>' +
                        '<td style="padding:0px;padding-left:8px;">' +
                            '<i class="fa fa-pencil-square-o fa-lg" style="color:blue;padding:4px;"' + pencilSquareTooltip + '></i>' +
                        '</td>' +
                        '<td style="padding:0px;">' +
                            '<form class="eraser-form" name="eraser-form" method="post">' +
                                '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                                '<input type="hidden" name="ratable" value="' + ratableName + '"/>' +                                
                             '</form>' +
                            '<i class="fa fa-eraser fa-lg" style="color:pink;padding:4px;"' + eraserTooltip + '</i>' +
                        '</td></tr>' +
                    '</table>' +
                '</div>' +
                '<div style="padding-left:4px;">By <a href="user/' + json['userId'] +'">' + json['user'] + '</a> on ' + json['date'] + '</div>' +
                '<div style="padding-left:8px;padding-top:4px;">' + json['review'] + '</div>' +                            
            '</td></tr>'
        );
        if ($('#table-2').width() > $('#reviews-data').width()) {
            $('#table-2').css({'width': '100%', 'table-layout': 'fixed', 'overflow': 'hidden'});
            $('#table-2 td').css({'width': '100%'});
        }
        $('#table-2 svg').css({'padding': '2px'});                    
        if (globalVars.deviceType === "desktop") {
            $('#table-2 i').tooltip({container: 'body'});
            $('#table-2 i').tooltip();                    
        }
        $('#table-2').on('click', '.fa-pencil-square-o', function() {
            $('#table-2 i').tooltip('hide');
            $('#tr-review-form').next().remove();
            $('#tr-review-form').show();
            $('#table-2 textarea').val(json['review']);
            $('#table-2 input[name="headline"]').val(json['headline']);
            $('#table-2 input[name="anonymous"]').val(json['anonymous']);
            if (json['anonymous']) {
                $('#table-2 .fa-user-secret').removeClass('secret-empty');
            }
            else {
                $('#table-2 .fa-user-secret').addClass('secret-empty');
            }
            if (globalVars.deviceType === 'mobile') {
                $('#table-2 .fa-user-secret').removeAttr('data-toggle');
                $('#table-2 .fa-user-secret').removeAttr('data-placement');
                $('#table-2 .fa-user-secret').removeAttr('title');
                $('#table-2 .fa-user-secret').removeAttr('data-original-title');
                $('#table-2 .fa-user-secret').removeAttr('aria-describedby');
            }
            else {
                $('#table-2 .fa-user-secret').tooltip({container: 'body'});
                $('#table-2 .fa-user-secret').tooltip(); 
            }
            $('#table-2').on('submit', '.review-form', function() {
                if (!globalVars.isGuest) {
                    $.post("review", $(this).serialize(), function(res) {
                        console.log(res);
                    });
                }
                $('#table-2 tbody').append('<tr><td>Your review has been submitted!</td></tr>');
                $('#tr-review-form').hide();                            
                return false;
            });
            $('#table-2').on('click', '.fa-user-secret', function() {
                var isAnonymous = false;
                $(this).toggleClass('secret-empty');
                if (!globalVars.isGuest) {
                     if (!$(this).hasClass('secret-empty')) {
                         isAnonymous = true;
                     }
                     $('.review-form').find('input[name="anonymous"]').val(isAnonymous.toString());            
                }
                return false;       
             });
        });
        $('#table-2').on('click', '.fa-eraser', function() {
            $('#table-2 i').tooltip('hide');
            $('#table-2').on('submit', '.eraser-form', function() {
                var id = $('#star-table').find('input[name="id"]').first().val().toString();
                $.ajax('review/destroy/' + id, {data: $(this).serialize(), method: "DELETE"}); 
                return false;
            });
            $('#table-2 .eraser-form').trigger('submit');
            $('#tr-review-form').hide();                        
            $('#table-2 tbody').append('<tr><td style="color:red;"><i class="fa fa-check"></i> Your review has been removed. <button class="btn btn-default undo">undo</button></td></tr>');
            $('#table-2').on('click', '.undo', function() {
                $('#tr-review-form').next().remove();
                $('#table-2 .review-form').find('textarea').first().html(json['review']);
                $('#table-2 .review-form input[name="headline"]').val(json['headline']);
                $('#table-2 .review-form input[name="anonymous"]').val(json['anonymous']);
                $('#table-2 .review-form input[name="ratable"]').val(ratableName);
                $('.review-form').on('submit', function() {
                    $.post('review', $(this).serialize(), function(res) {
                        console.log(res);
                    });
                    return false;
                });
                $('.review-form').trigger('submit');
                $('#table-2 tbody').append('<tr><td style="color:green;"><i class="fa fa-check"></i> Your review has been restored.</td></tr>');
            })
        });
    });
}

function createRatableTable3Rows(ratableName) {
    var jsonCount = 0;
    $.getJSON('review?userId=useSkip&ratable=' + ratableName + '&skip=' + globalVars.skipReviewCount, function(json) {
        var anonymousTooltip = '';
        if (json['review']) {
            if (!json['user']) {
                if (globalVars.deviceType === 'desktop') {
                    anonymousTooltip = ' data-toggle="tooltip" data-placement="top" title="anonymous review"';
                }
                json['user'] = '<i class="fa fa-user-secret"' + anonymousTooltip +'></i>';
            }
            else {
                json['user'] = '<a href="user/' + json['userId'] + '">' + json['user'] + '</a>';
            }
            $('#table-3 tbody').append('<tr><td>' +
                        '<div style="display:table;margin-bottom:-6px">' + 
                            createSmallReadOnlyStars(json['rating']) + 
                            ' <strong style="vertical-align:middle;display:table-cell;padding-bottom:5px;padding-left:2px"> ' + json['headline'] + '</strong>\n\
                        </div>' +
                        '<div style="padding-left:4px;">By ' + json['user'] + ' on ' + json['date'] + '</div>' +
                        '<div style="padding-left:8px;padding-top:4px;overflow:hidden;">' + json['review'] + '</div>' +
                        '<div>Was this review helpful? <button class="btn btn-default">Yes</button><button class="btn btn-default" style="margin-left:4px;">No</button></div>' +
                    '</td></tr>'
            );
            if (globalVars.deviceType === 'desktop') {
                $('#table-3 .fa-user-secret').tooltip({container: 'body'});
                $('#table-3 .fa-user-secret').tooltip();
            }
        }
        if ($('#table-3').width() > $('#reviews-data').width()) {
            $('#table-3').css({'width': '100%', 'table-layout': 'fixed', 'overflow': 'hidden'});
            $('#table-3 td').css({'width': '100%'});
        }
        $('#table-3 tbody tr').css({'border-top-style': 'solid', 'border-top-width': 'thin', 'border-top-color': 'orange', 'border-bottom-style': 'solid', 'border-bottom-width': 'thin', 'border-bottom-color': 'orange'});
        $('#table-3 svg').css({'padding': '2px'});
        jsonCount++;
        if (jsonCount === 10) {
            globalVars.detachedSpinner = $('.spinner').detach();
        }
    });
}

function createUserDataRows(json) {
    createUserBtnEvents(json);
    createUserRatingsRows(json, 'none');
    createUserReviewsRows(json, 'none');
}

function createUserBtnEvents(json) {
    $('#ratings-data tbody').on('click', '.add-rows-btn', function() {
        $('#ratings-data tbody').append(globalVars.detachedSpinner);
        createUserRatingsRows(json, 'add');
    });
    $('#reviews-data tbody').on('click', '.add-rows-btn', function() {
       $('#reviews-data tbody').append(globalVars.detachedSpinner);
       createUserReviewsRows(json, 'add');
    });
    $('#ratings-data tbody').on('click', '.prev-rows-btn', function() {
        $('#ratings-data tbody').append(globalVars.detachedSpinner);
        createUserRatingsRows(json, 'prev');
    });
    $('#reviews-data tbody').on('click', '.prev-rows-btn', function() {
        $('#reviews-data tbody').append(globalVars.detachedSpinner);
        createUserReviewsRows(json, 'prev');
    });
}

function createUserRatingsRows(json, btnAction) {
    var i;
    var anonymousTooltip = '';
    var anonymousIcon = '';
    var length = 10;
    $('#ratings-data tbody tr').not('#ratings-data .tr-spinner').remove();    
    if (json.ratings.length) {
        if (btnAction === 'add') {
            globalVars.ratingsIndex += 10;
        }
        else if (btnAction === 'prev') {
            globalVars.ratingsIndex -= 10;
        }
        else if ((btnAction === 'none') && (json.ratings.length < 10)) {
            length = json.ratings.length;
        }
        if ((btnAction !== 'none') && ((json.ratings.length - globalVars.ratingsIndex) < 10)) {
            length = json.ratings.length - globalVars.ratingsIndex;
        }
        for (i = 0; i < length; i++) {
            if (!json.ratings[i + globalVars.ratingsIndex]['anonymous']) {
                anonymousIcon = '';
            }
            else {
                if (globalVars.deviceType === "desktop") {
                    anonymousTooltip = ' data-toggle="tooltip" data-placement="top" title="anonymous rating"';
                }
                anonymousIcon = '<i class="fa fa-user-secret"' + anonymousTooltip + ' style="padding-left:4px;padding-bottom:4px;vertical-align:middle;display:table-cell;"></i>';
            }
            $('#ratings-data .tr-spinner').before('<tr>' +
                    '<td>' + createSmallReadOnlyStars(json.ratings[i + globalVars.ratingsIndex]['rating']) + '</td>' +
                    '<td>' +
                        '<span><a style="vertical-align:top;display:table-cell;padding-bottom:5px;padding-left:2px" href="/' + json.ratings[i + globalVars.ratingsIndex]['ratable'] + '">' + json.ratings[i + globalVars.ratingsIndex]['ratable'] + '</a>' + anonymousIcon + '</span>' +
                    '</td></tr>');
        }
    }
    $('#ratings-data svg').css({'padding': '2px'});
    $('.fa-user-secret').tooltip({container:'body'});
    $('.fa-user-secret').tooltip();
    if (globalVars.ratingsIndex >= 10) {
        $('#ratings-data tbody').prepend('<tr><td style="text-align:center;" colspan="2"><div><button class="prev-rows-btn">Previous</button></div></td></tr>');
        $('#ratings-data tbody .prev-rows-btn').button({disabled: false}).css({'border-color': 'orange', 'color': 'orange'});
    }
    if (json.ratings.length > (globalVars.ratingsIndex + 10)) {
        $('#ratings-data .tr-spinner').before('<tr><td style="text-align:center;" colspan="2"><div><button class="add-rows-btn">More</button></div></td></tr>');
        $('#ratings-data tbody .add-rows-btn').button({disabled: false}).css({'border-color': 'orange', 'color': 'orange'});
    }
    $('#ratings-data .tr-spinner').remove();
}

function createUserReviewsRows(json, btnAction) {
    var i;
    var length = 10;
    var anonymousIcon = '';
    var anonymousTooltip = '';
    $('#reviews-data tbody tr').not('#reviews-data .tr-spinner').remove();    
    if (json.reviews.length) {
        if (btnAction === 'add') {
            globalVars.reviewsIndex += 10;
        }
        else if (btnAction === 'prev') {
            globalVars.reviewsIndex -= 10;
        }
        else if ((btnAction === 'none') && (json.reviews.length < 10)) {
            length = json.reviews.length;
        }
        if ((btnAction !== 'none') && ((json.reviews.length - globalVars.reviewsIndex) < 10)) {
            length = json.reviews.length - globalVars.reviewsIndex;
        }
        for (i = 0; i < length; i++) {
            if (!json.reviews[i + globalVars.reviewsIndex]['anonymous']) {
                anonymousIcon = '';
            }
            else {
                if (globalVars.deviceType === "desktop") {
                    anonymousTooltip = ' data-toggle="tooltip" data-placement="top" title="anonymous review"';
                }
                anonymousIcon = '<i class="fa fa-user-secret"' + anonymousTooltip +'></i>';
            }
            $('#reviews-data .tr-spinner').before('<tr><td>' + anonymousIcon + ' <a href="/' + json.reviews[i + globalVars.reviewsIndex]['ratable'] + '">' + json.reviews[i + globalVars.reviewsIndex]['ratable'] + '</a>: ' + json.reviews[i + globalVars.reviewsIndex]['date'] + ' - ' + json.reviews[i + globalVars.reviewsIndex]['headline'] + ' - ' + 
                    '<div>' + json.reviews[i + globalVars.reviewsIndex]['review'] + '</div></td><tr>');
        }
    }
    if ($('#reviews-data').width() > $('.panel-body').last().width()) {
        $('#reviews-data').css({'width': '100%', 'table-layout': 'fixed', 'overflow': 'hidden'});
        $('#reviews-data td').css({'width': '100%'});
    }
    $('.fa-user-secret').tooltip({container:'body'});
    $('.fa-user-secret').tooltip();
    if (globalVars.reviewsIndex >= 10) {
        $('#reviews-data tbody').prepend('<tr><td style="text-align:center;" colspan="2"><div><button class="prev-rows-btn">Previous</button></div></td></tr>');
        $('#reviews-data tbody .prev-rows-btn').button({disabled: false}).css({'border-color': 'orange', 'color': 'orange'});
    }
    if (json.reviews.length > (globalVars.reviewsIndex + 10)) {
        $('#reviews-data .tr-spinner').before('<tr><td style="text-align:center;" colspan="2"><div><button class="add-rows-btn">More</button></div></td></tr>');
        $('#reviews-data tbody button').button({disabled: false}).css({'border-color': 'orange', 'color': 'orange'});
    }
    $('#reviews-data .tr-spinner').remove();
}

function createSmallReadOnlyStars(rating) {
    var html = '';
    var i;
    var starFill;
    var stroke;
    for (i = 0; i < 5; i++) {
        if (rating > i) {
            starFill = 'red';
            stroke = 'red';
        }
        else {
            starFill = 'white';
            stroke = 'red';
        }
        html += '<span>' +
                    '<svg width="22" height="22" viewBox="0 0 262 250" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                           '<polygon class="polygon-' + i + '" fill="' + starFill + '" stroke="' + stroke + '" stroke-width="20"'  +
                            'points="123,4 152,90 242,90 170,144 196,230 123,179 50,230 76,144 4,90 94,90" />' +
                        '</svg>' + 
                '</span>';
    }
    return html;
}

function createRows(table) {
    var i;
    var k = 0;
    if (table !== 'autocomplete') {
        for (i = 0; i < 10; i++) {
            $.getJSON('/table/' + table + '?skip=' + globalVars.skipRatingCount.toString(), function(json) {
                k++;
                if (json['name']) {
                    createTr(json);                    
                }
                else {
                    $('#table-1-body').append('<tr class="ratable-tr"></tr>');
                    if (!globalVars.noMoreRows) {
                        globalVars.noMoreRows = true;
                        globalVars.detachedRatingsRows.push($('.ratable-tr').clone());
                    }                   
                }
                if (k === 10) {
                    if ((globalVars.detachedRatingsRowsIndex === globalVars.detachedRatingsRows.length) && !globalVars.noMoreRows) {
                        globalVars.detachedRatingsRows.push($('.ratable-tr').clone());
                    }                    
                    globalVars.detachedSpinner = $('.spinner').detach();
                    if (globalVars.noMoreRows) {
                        globalVars.detachedMoreBtn = $('#add-rows-btn').detach();
                    }
                    else {
                        $('#add-rows-btn').button({disabled: false});
                    }
                    if ($('#prev-rows-btn').length) {
                        $('#prev-rows-btn').button({disabled: false});
                    }                        
                }
            });
            globalVars.skipRatingCount++;
        }
    }
    else {
        $.getJSON('autocomplete?term=' + $('#table-1 > thead').attr('id'), function(searchJson) {
            var i;
            if (searchJson.length) {
                for (i = 0; i < searchJson.length; i++) {
                    $.getJSON('/table/search?id=' + searchJson[i].id.toString(), function(resultJson) {
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
    if (globalVars.deviceType === "desktop") {
        var pleaseLoginTooltip = '';
        var anonymousIcon = '';
        var secretEmpty = '';
        var mapMarker = '';
        var anchor = '<a data-toggle="tooltip" data-placement="bottom" title="' + json['desc'] + '" href="' + json['name'] + '">' + json['name'] + '</a>';
        if (globalVars.isGuest) {
            pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
        }
        if (!json['isAnonymous']) {
            secretEmpty = ' secret-empty';
        }
        anonymousIcon = '<div style="float:left;padding:8px;padding-top:0px;"><form class="anon-form" name="anon-form" method="post">' +
                            '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                            '<input type="hidden" name="id" value="' + json['id'] + '"/>' +
                            '<input type="hidden" name="anonymous" value="' + json['isAnonymous'] + '" />' +                        
                        '</form>' +
                        '<i class="fa fa-user-secret fa-lg' + secretEmpty + '" data-toggle="tooltip" data-placement="top" title="rate this anonymously"></i></div>';
        if (json['region'].length) {
            mapMarker = '<div style="float:left;"><i class="fa fa-map-marker fa-lg" data-html="true" data-toggle="tooltip" data-placement="top" title="located in ' + json['region'] + '<br>(map feature coming soon)"></i></div>';
        }
        $('#table-1-body').append(
            '<tr class="ratable-tr border-top-' + globalVars.borderTopColor + '">' +
                '<td><img src="' + json['img_src'] + '" style="width:100px;"></td>' +  
                '<td><div>' + anchor + '</div></td>' + 
                '<td>' +    
                    '<div class="td-star" style="float:left"' + pleaseLoginTooltip + '>' + createFiveStars(json) + '</div>' + 
                '</td>' +
                '<td style="padding-top:12px;">' +
                    '<div style="float:left;"><div style="float:left;"> ' + json['rating'] + '/5 - ' + json['numberOfRatings'] + '</div>' + 
                    anonymousIcon + mapMarker + 
                '</td>' +
            '</tr>'
        );
        $('#tr-add-rows').appendTo('#table-1-body');
        $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true})
        $('[data-toggle="tooltip"]').tooltip();        
    }
    else {
        var pleaseLoginTooltip = '';
        var anonymousIcon = '';
        var secretEmpty = '';
        var mapMarker = '';
        var anchor = '<a href="' + json['name'] + '">' + json['name'] + '</a>';
        if (globalVars.isGuest) {
            pleaseLoginTooltip = 'data-toggle="tooltip" data-placement="top" title="Please login to rate items."';
        }
        if (!json['isAnonymous']) {
            secretEmpty = ' secret-empty';
        }
        anonymousIcon = '<form style="float:left;" class="anon-form" name="anon-form" method="post">' +
                            '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                            '<input type="hidden" name="id" value="' + json['id'] + '"/>' +
                            '<input type="hidden" name="anonymous" value="' + json['isAnonymous'] + '" />' +                        
                        '</form>' +
                        '<i style="padding-left:4px;" class="fa fa-user-secret fa-lg' + secretEmpty + '"></i>';
        if (json['region'].length) {
            mapMarker = '<i style="padding-left:4px;vertical-align:top;padding-top:4px;" class="fa fa-map-marker fa-lg"></i>';
        }
        $('#table-1-body').append(
            '<tr class="ratable-tr border-top-' + globalVars.borderTopColor + '">' +
                '<td><img src="' + json['img_src'] + '" style="width:100px;"></td>' +  
                '<td><div>' + anchor + '</div>' +
                    '<div class="td-star" style="overflow:hidden;"><div class="btn-star-group "' + pleaseLoginTooltip + '>' + createFiveStars(json) + '</div></div>' + 
                    '<div style="overflow:hidden;width:100%;"><div style="float:left;" >' + json['rating'] + '/5 - ' + json['numberOfRatings'] + '</div><div style="float:left;vertical-align:middle;">' + anonymousIcon + mapMarker + '</div></div>' +
                '</td>' +
            '</tr>'
        );
        $('#tr-add-rows').appendTo('#table-1-body');        
        $('[data-toggle="tooltip"]').tooltip({container: 'body'})
        $('[data-toggle="tooltip"]').tooltip();
        }
}

function createFiveStars(json) {
    var html = '';
    var i;
    var starFill = '';
    var stroke = '';
    var offset = '50%';
    var fraction = parseFloat(parseFloat(json['rating'].substring(json['rating'].length - 2)).toFixed(1));
    var ratingFloor = Math.floor(parseFloat(json['rating']));
    var svgMeasure = '40';
    if (globalVars.deviceType === "mobile") {
        svgMeasure = '25';
    }
    for (i = 0; i < 5; i++) {
        if ((i < json['userRating']) && (i < ratingFloor)) {
            stroke = globalVars.avgStarColor;
            starFill = 'red';
        }
        else if (i < ratingFloor) {
            stroke = globalVars.avgStarColor;
            starFill = globalVars.avgStarColor;
        }
        else if ((i < json['userRating']) && (!fraction)) {
            stroke = globalVars.avgStarFadedColor;
            starFill = 'red';
        }
        else if ((i < json['userRating']) && fraction && (i === ratingFloor)) {
            offset = json['rating'].substring(json['rating'].length - 1) + '0%';
            stroke = "url(#stroke-grad-" + globalVars.gradId.toString() + ")";
            starFill = "red";
        }
        else if ((i === ratingFloor) && fraction) {
            offset = json['rating'].substring(json['rating'].length - 1) + '0%';
            stroke = "url(#stroke-grad-" + globalVars.gradId.toString() + ")";
            starFill = "url(#fill-grad-" + globalVars.gradId.toString() + ")";            
        }
        else {
            stroke = globalVars.avgStarFadedColor;
            starFill = 'white';
        }
        html += '<form class="star-btn-form" name="star-form" method="post">' +
                    '<input type="hidden" name="_token" id="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" />' +
                    '<input type="hidden" name="ratable" value="' + json['name'] + '"/>' +
                    '<input type="hidden" name="rating" value="' + i + '"/>' +
                    '<input type="hidden" name="anonymous" value="' + json['isAnonymous'].toString() + '"/>' +
                    '<button class="poly-star-btn">' +
                        '<svg width="' + svgMeasure + '" height="' + svgMeasure + '" viewBox="0 0 262 250" xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                            '<defs>' +
                                '<linearGradient id="fill-grad-' + globalVars.gradId.toString() + '" class="fill">' +
                                    '<stop offset="0%" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="' + globalVars.avgStarColor + '" />' +
                                    '<stop offset="' + offset + '" stop-color="white" />' +
                                    '<stop offset="100%" stop-color="white" />' +
                                '</linearGradient>' +
                                '<linearGradient id="stroke-grad-' + globalVars.gradId.toString() + '" class="stroke">' +
                                    '<stop offset="0%" stop-color="orange" />' +
                                    '<stop offset="' + offset + '" stop-color="' + globalVars.avgStarColor + '" />' +
                                    '<stop offset="' + offset + '" stop-color="' + globalVars.avgStarFadedColor + '" />' +
                                    '<stop offset="100%" stop-color="#FED8B1" />' +
                                '</linearGradient>' +
                            '</defs>' +
                            '<polygon class="polygon-' + i + '" fill="' + starFill + '" stroke="' + stroke + '" stroke-width="20"'  +
                            'points="123,4 152,90 242,90 170,144 196,230 123,179 50,230 76,144 4,90 94,90" />' +
                        '</svg>' + 
                    '</button>' +
                '</form>';
        globalVars.gradId++;
    }
    return html;
}

function createBtnEvents() {
    $('#table-1').on('click', '#add-rows-btn', function(){
        window.scrollTo(0, 0);
        $('#add-rows-btn').button({disabled: true});
        globalVars.detachedRatingsRowsIndex++;
        $('.ratable-tr').remove();
        if (!$('#prev-rows-btn').length) {
            $('#table-1-body').prepend('<tr id="tr-prev-rows"><td id="td-prev-rows" colspan="6"><button id="prev-rows-btn">Previous</button></tr></td>');
        }
        $('#prev-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        if ((globalVars.detachedRatingsRowsIndex === globalVars.detachedRatingsRows.length) && !globalVars.noMoreRows) {
            $('#td-add-rows').prepend(globalVars.detachedSpinner);                
            createRows('master');
        }
        else {
            $('#tr-add-rows').before(globalVars.detachedRatingsRows[globalVars.detachedRatingsRowsIndex]);
            if ((globalVars.detachedRatingsRowsIndex < globalVars.detachedRatingsRows.length) && !((globalVars.detachedRatingsRowsIndex === (globalVars.detachedRatingsRows.length - 1)) && globalVars.noMoreRows)) {
                $('#add-rows-btn').button({disabled: false});            
            }
            else {
                $('#add-rows-btn').remove();
            }
            $('#prev-rows-btn').button({disabled: false});
        }            
    });
    
    $('#table-1').on('click', '#prev-rows-btn', function() {
        window.scrollTo(0, 0);
        $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        globalVars.detachedRatingsRowsIndex--;
        if (globalVars.detachedRatingsRowsIndex === 0) {
            $('#tr-prev-rows').remove();
        }
        $('.ratable-tr').remove();
        if (!$('#add-rows-btn').length) {
            $('#td-add-rows').append('<div><button id="add-rows-btn">More</button></div>');
            $('#add-rows-btn').button({disabled: true}).css({'border-color': 'orange', 'color': 'orange'});
        }
        $('#tr-add-rows').before(globalVars.detachedRatingsRows[globalVars.detachedRatingsRowsIndex]);
        $('#add-rows-btn').button({disabled: false}).css({'border-color': 'orange', 'color': 'orange'});
    });
}