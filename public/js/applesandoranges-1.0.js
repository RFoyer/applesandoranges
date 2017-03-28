var globals = {
    'deviceType': "desktop",
    'isGuest': false,
    'skipRatingCount': 0,    
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
    'avgStarFadedColor': '#FED8B1',
    'csrfInput': ''
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
    else if ((path === '/login') || 
            (path === '/register') || 
            (path === '/password/reset') || 
            (path === '/password/email') || 
            (path === '/ratable/create') || 
            (path === '/ratable/create/success')) {
        //
    }
    else if (!$('#error').length) {
        fillRatableTables();        
    }
}

function fillMasterTable() {
    readyMasterTable();    
    createTable1Rows('master');   
}

function fillProposedTable() {
    readyProposedTable();
    createTable1Rows('proposed');
}

function fillSearchTable() {
    createTable1Events();
    appendSearchSpinner();
    createTable1Rows('autocomplete');
}

function fillUserTables() {
    appendUserSpinners();
    $.getJSON('/table/user?id=' + location.pathname.slice(6), function(json) {
        $('#user-data tbody .tr-spinner').remove();
        if (json.username) {
            $('#user-data tbody').prepend('<tr>' +
                    '<td>'+ json.username + '</td></tr>');
            createUserDataRows(json);
       }
       else {
            $('#user-data tbody').append('<tr>' +
                    '<td>Sorry, this user does not seem to exist!</td></tr>');
       }
    });
}

function fillContributorsTable() {
    $('#contributors-data').after('<div class="spinner">' +
            '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>');
    $('#contributors-data th').css({'padding-left': '4px',
        'padding-right': '4px', 'text-align': 'center'});
    $.getJSON('/table/contributors', function(json) {
        $('.spinner').remove();
        createContributorsRows(json);
        $('#contributors-data tr').not('.td-user').css({'text-align': 'center'});
        $('#contributors-data .td-user').css({'text-align': 'left'});
    });
}

function createContributorsRows(json) {
    json.forEach(function(data) {
        $('#contributors-data tbody').append('<tr>' +
            '<td class="td-user">' +
                '<a href="/user/' + data.id.toString() + '">' + data.name + 
                '</a>' +
            '</td>' +
            '<td>' + data.numberOfRatings.toString() + '</td>' +
            '<td>' + data.numberOfReviews.toString() + '</td>' +
            '<td>' + data.numberOfProposedRatables.toString() + '</td>' +
            '<td>' + data.numberOfApprovedRatables.toString() + '</td>' +
            //'<td>' + data.numberOfPendingRatables.toString() + '</td>' +
            //'<td>' + data.numberOfRejectedRatables.toString() + '</td>' +                    
        '</tr>');
    });
}

function fillRatableTables() {
    if ($('#tr-review-form').length) {
        $('#tr-review-form').hide();
    }
    createTable1Events();
    globals.detachedSpinner = '<div class="spinner">' +
            '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>';
    $('#ratings-data').after(globals.detachedSpinner);
    $('#reviews-data').after(globals.detachedSpinner);
    $.getJSON('/table/home?name=' + location.pathname.slice(1), function(json) {
        createRatableTable1Rows(json);
        createRatableReviewsRows(json.name);
    });
}

function readyMasterTable() {
    $('#table-1').prepend('<caption>THINGS TO RATE</caption>');
    appendSpinnerWithMoreBtn('orange');    
    createTable1Events();
    createTable1BtnEvents();
}

function readyProposedTable() {
    $('#table-1')
            .prepend('<caption>USER-PROPOSED RATABLES (APPROVAL PENDING)</caption>');
    appendSpinnerWithMoreBtn('green');
    createTable1Events();
    createTable1BtnEvents();
    setProposedTableColors();
}

function appendSpinnerWithMoreBtn(color) {
    $('#table-1-body').append('<tr id="tr-add-rows">' +
            '<td id="td-add-rows" colspan="6">' +
                '<div class="spinner">' +
                    '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>' +
                '</div>' +
                '<div><button id="add-rows-btn">More</button></div>' +
            '</td></tr>');
    $('#add-rows-btn').button({disabled: true}).css({'border-color': color,
        'color': color});
    $('.spinner').css({'color': color});
}

function setProposedTableColors() {
    globals.borderTopColor = 'green';
    globals.avgStarColor = 'green';
    globals.avgStarFadedColor = '#90EE90';
}

function appendSearchSpinner() {
    $('#table-1-body').append('<tr><td colspan="5"><div class="spinner">' +
            '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div></td></tr>');
}

function appendUserSpinners() {
    globals.detachedSpinner = '<tr class="tr-spinner"><td colspan="2"><div class="spinner">' +
            '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div></td></tr>';
    $('#user-data tbody').append(globals.detachedSpinner);
    $('#ratings-data tbody').append(globals.detachedSpinner);
    $('#reviews-data tbody').append(globals.detachedSpinner);
}

function readyPage() {
    globals.csrfInput = '<input type="hidden" name="_token" class="csrf-token" value="' + $('meta[name="csrf-token"]').attr('content') + '" >';
    setDeviceType();
    makePaddingForFooter();    
    setIsGuest();
    createAutocomplete();
    createSearchEvents();    
    createNavbarEvents();
}

function setDeviceType() {
    if (window.innerWidth <= 800) {
        globals.deviceType = "mobile";
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
        globals.isGuest = true;
    }    
}

function createAutocomplete() {
    $('#search-box').autocomplete({
        source: '/autocomplete'        
    }).autocomplete('instance')._renderItem = function(ul, item) {
        return $("<li>").append('<div>' +
                '<img class="search-img" width="60" src="' + item.img + '">' + 
                item.value + '</div>').appendTo(ul);
    };
}

function createSearchEvents() {
    $('#body').on('submit', 'div-form-search form', function() {
        if (!$(this).find('#search-box').val().length) {
            return false;
        }
    });
    $('#body').on('mouseenter', '#btn-search', function() {
        $(this).css({'background-color': 'white'});
    });
}

function createNavbarEvents() {
    var detachedSearch;
    $('.nav-a').css({'height': '56px', 'display': 'table-cell', 'vertical-align': 'middle'});
    if (globals.deviceType === "desktop") {
        $('.navbar-collapse').css({'background-color':'#32a232'});
        $('.dropdown-menu').css({'padding': '0px', 'min-width': '0px'});
        createDropdownEvents();        
    }
    else {
        detachedSearch = $('#div-form-search').detach();
        $('#logo-div').after(detachedSearch);
        createAutocomplete();
        setMobileNavbarCss();        
    }
}

function createDropdownEvents() {
    $('.dropdown').mouseenter(function() {
        $(this).addClass('open');
        $(this).find('a').first().attr('aria-expanded', false);
        $(this).find('a').first().css({'background-color': 'white',
            'color': '#32a232'});
        if (!globals.isGuest) {
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
            $(this).find('a').css({'background-color': 'white',
                'color': '#32a232'});
            $(this).find('a').first().css({'background-color': '#32a232',
                'color': 'white'});
        });
    });
}

function setMobileNavbarCss() {
    $('#logo-div').css({'padding': 'auto', 'height': 'auto', 'float': 'left',
        'vertical-align': 'middle', 'background-color': 'white'});
    $('#logo').css({'height': 'auto', 'padding': 'auto'});
    $('#logo').not('#and').css({'font-size': '14px'});
    $('#div-form-search').css({'float': 'left', 'padding': '8px',
        'margin': 'auto', 'height': 'auto', 'width': 'auto'});
    $('#search-box').css({'height': 'auto', 'padding': '5px', 'margin': 'auto',
        'width': '108px'});
    $('#btn-search').css({'padding-top': '5px', 'padding-bottom': '5px'});
    $('.navbar-header .input-group').add('.navbar-header .input-group-btn')
            .css({'height': 'auto', 'padding': 'auto', 'margin': 'auto'});
    $('.nav-a').css({'background-color': '#32a232', 'color': 'white'});
    $('.navbar-collapse').css({'padding': '4px', 'background-color': '#32a232'});
    $('.navbar-nav').css({'margin': '0px'});
    $('.navbar-header button').css({'border-color': '#32a232',
        'background-color': 'white'});
    $('.dropdown-menu').css({'background-color': '#32a232', 'padding': '0px'});
    $('.nav-a').last().css({'padding': 'auto'});
    $('.navbar-header').css({'background-color': '#32a232'});
    $('.input-group').css({'width': '150px'});
    $('.caret').attr('class', 'fa fa-caret-right');
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
        var length = parseInt($(this).parent().find('input[name="rating"]')
                .val(), 10) + 1;
        for (i = 0; i < length; i++) {
            startFill[i] = $(this).parent().parent()
                    .find('.polygon-' + i.toString()).attr('fill');
            $(this).parent().parent().find('.polygon-' + i.toString())
                    .attr('fill', 'red');
        }
        for (i = length; i < 5; i++) {
            startFill[i] = $(this).parent().parent()
                    .find('.polygon-' + i.toString()).attr('fill');
            if (startFill[i] === 'red') {
                stroke = $(this).parent().parent()
                        .find('.polygon-' + i.toString()).attr('stroke');
                if (stroke === 'orange') {
                    $(this).parent().parent().find('.polygon-' + i.toString())
                            .attr('fill', 'orange');
                }
                else if (stroke.slice(0, 1) === 'u') {
                    $(this).parent().parent().find('.polygon-' + i.toString())
                            .attr('fill', "url(#" + $(this).parent().parent()
                                .find('.polygon-' + i.toString()).parent()
                                .find('.fill').attr('id') + ")");
                }
                else {
                    $(this).parent().parent().find('.polygon-' + i.toString())
                            .attr('fill', 'white');
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
                $(this).parent().parent().find('.polygon-' + i.toString())
                        .attr('fill', startFill[i]);
            }
        }
        else {
            clicked = false;
            length = parseInt($(this).parent().find('input[name="rating"]')
                    .val(), 10) + 1;
            for (i = length; i < 5; i++) {
                stroke = $(this).parent().parent()
                        .find('.polygon-' + i.toString()).attr('stroke');
                if (stroke === 'orange') {
                    restoreFill = 'orange';
                }
                else if (stroke.slice(0, 1) === 'u') {
                    restoreFill = "url(#" + $(this).parent().parent()
                            .find('.polygon-' + i.toString()).parent()
                            .find('.fill').attr('id') + ")";
                }
                else {
                    restoreFill = 'white';
                }                
                $(this).parent().parent().find('.polygon-' + i.toString())
                        .attr('fill', restoreFill);
            }
        }
    });
}

function makeTable1StarFormsAsync() {
    $('#table-1').on('submit', '.star-btn-form', function(){
        if (!globals.isGuest) {
            $.post("rating", $(this).serialize(), function(res) {
            console.log(res);
            });
        }
        return false;
    });
}

function createTable1IconEvents() {
    $('#table-1').on('submit', '.anon-form', function() {
        if ($(this).closest('tr').find('.star-btn-form').first().find('polygon')
                .attr('fill') === "red") {
            var id = $(this).find('input[name="id"]').val().toString();
            $.post('rating/' + id, $(this).serialize(), function(res) {
                console.log(res);
            });
        }
        return false;
    });
    $('#table-1').on('submit', '.eraser-form', function() {
        if ($(this).closest('tr').find('.star-btn-form').first().find('polygon')
                .attr('fill') === "red") {
            $(this).closest('tr').find('.star-btn-form').find('polygon')
                    .attr('fill', 'white');
            var id = $(this).find('input[name="id"]').val().toString();
            $.ajax('rating/' + id, {data: $(this).serialize(), method: "DELETE"}); 
        }
        return false;
    });
    $('#table-1').on('click', '.fa-eraser', function() {
       if (!globals.isGuest) {
            $(this).siblings('.eraser-form').trigger('submit');            
       }
       return false;       
    });
    $('#table-1').on('click', '.fa-user-secret', function() {
       var isAnonymous = false;
       $(this).toggleClass('secret-empty');
       if (!globals.isGuest) {
            if (!$(this).hasClass('secret-empty')) {
                isAnonymous = true;
            }
            $(this).siblings('.anon-form').find('input[name="anonymous"]')
                    .val(isAnonymous.toString());
            $(this).closest('tr').find('.star-btn-form input[name="anonymous"]')
                    .val(isAnonymous.toString());
            $(this).siblings('.anon-form').trigger('submit');            
       }
       return false;       
    });
}

function createRatableTable1Rows(json) {
    var loginTooltip = '';
    var imgTd = '';
    var approvalPending = '';
    var anonymousIcon = '';
    var secretEmpty = '';
    var anonymousTooltip = '';
    var mapMarker = '';
    var mapMarkerTooltip = '';
    var eraserIcon = '';
    var eraserTooltip = '';
    var nameWithStyle = json.name;
    if (json.style.length) {
        nameWithStyle = getNameWithStyle(json);
    }
    if (globals.isGuest) {
            loginTooltip = 'data-toggle="tooltip" data-placement="top" ' +
                    'title="Please login to rate items."';
    }
    if (globals.deviceType === 'desktop') {
        imgTd = '<td><img id="ratable-home-img" src="' + json.img_src + '"></td>';
        mapMarkerTooltip = ' data-html="true" data-toggle="tooltip" ' +
                'data-placement="top" title="located in ' + json.region + 
                '<br>(map feature coming soon)"';
        eraserTooltip = ' data-toggle="tooltip" data-placement="top" ' +
                'title="clear your rating"';
        anonymousTooltip = ' data-toggle="tooltip" data-placement="top" ' +
                'title="rate this anonymously"';
    }
    if (json.region.length) {
        mapMarker = '<div class="icon-div"><i class="fa fa-map-marker fa-lg"' +
               mapMarkerTooltip + '></i></div>';
    }                
    if (!json.isAnonymous) {
        secretEmpty = ' secret-empty';
    }
    if (!globals.isGuest) {
        eraserIcon = '<div class="icon-div">' +
                '<form class="eraser-form" name="eraser-form" method="post">' +
                    globals.csrfInput +
                    '<input type="hidden" name="id" value="' + json.id + '">' +                                
                '</form>' +
                '<i class="fa fa-eraser fa-lg"' + eraserTooltip + '></i>' +
            '</div>';
    }
    anonymousIcon = '<div class="icon-div">' +
            '<form class="anon-form" method="post">' +
                globals.csrfInput +
                '<input type="hidden" name="id" value="' + json.id + '">' +
                '<input type="hidden" name="anonymous" ' +
                    'value="' + json.isAnonymous + '" >' +                        
            '</form>' +
            '<i class="fa fa-user-secret fa-lg' + secretEmpty + '"' + 
                anonymousTooltip + '></i></div>';
    if (!json.isApproved) {
        approvalPending = '<strong><em>*approval is pending on this ratable' +
                '</em></strong>';
        globals.avgStarColor = 'green';
        globals.avgStarFadedColor = '#90EE90';
    }
    $('#table-1 tbody').append('<tr>' +
            imgTd +
            '<td style="overflow:hidden;vertical-align:top;">' +
                '<div><h3>' + nameWithStyle + '</h3></div>' +
                '<div style="float:left;width:100%;">' + 
                    approvalPending + 
                '</div>' +
                '<div style="float:left;"' + loginTooltip + '>' + 
                    createFiveStars(json) + 
                '</div>' +
                '<div><div style="float:left;width:100%">' +
                    '<div style="float:left;padding-right:4px;">' +
                        json.rating + '/5 - ' + json.numberOfRatings + 
                    '</div>' + 
                    anonymousIcon + mapMarker + eraserIcon +
                '</div></div>' +
                '<div><div style="float:left;width:100%;">' +
                    json.desc +
                '</div></div>' +
            '</td></tr>'
    );
    $('[data-toggle="tooltip"]').tooltip({container: 'body'});
    $('[data-toggle="tooltip"]').tooltip();
    $('.spinner').first().remove();
}

function getNameWithStyle(json) {
    var i;
    var style = JSON.parse(json.style.replace(/\\\"/g, '"'))
    var keys = Object.keys(style);
    var nameWithStyleArr = json.name.split('');
    var addToInd = 0;
    for (i = 0; i < keys.length; i++){
        if (keys[i] <= json.name.length) {
            nameWithStyleArr = nameWithStyleArr.slice(0, parseInt(keys[i], 10) + addToInd).concat(style[keys[i]].split('')).concat(nameWithStyleArr.slice(parseInt(keys[i], 10) + addToInd));
            addToInd += style[keys[i]].length;
        }        
    }
    return nameWithStyleArr.join('');
}

function createRatableReviewsRows(ratableName) {
    readyRatableTable2(ratableName);
    $.getJSON('review?userId=all&ratable=' + ratableName, function(json) {
        createRatableTable3BtnEvents(json);
        createRatableTable3Rows(json, 'none');
    });
}

function readyRatableTable2(ratableName) {
    var data;
    $('#table-2').prepend('<caption>Reviews:</caption>');
    $('.review-form input[name="ratable"]').val(ratableName);
    if (!globals.isGuest) {
        $('#tr-review-form').hide();
        data = {'ratable': ratableName, 'userId': "useAuthId", 'skip': 0};
        $.getJSON('review', data, function(json) {
            if (!json.review) {
                $('#tr-review-form').show();
                createNewReviewEvents();
            }
            else {
                $('#table-2 tbody').append('<tr class="user-review">' +
                        '<td><button class="btn btn-default">your review</button>' +
                        '</td></tr>');
                createEditReviewBtnEvent(json, ratableName);
            }
        });
    }
    $('#table-2').on('focus', 'textarea', function() {
       $(this).attr('rows', '10');       
    });
}

function createRatableTable3BtnEvents(json) {
    $('#table-3 tbody').on('click', '.add-rows-btn', function() {
       $('#reviews-data').after(globals.detachedSpinner);
       createRatableTable3Rows(json, 'add');
    });
    $('#table-3 tbody').on('click', '.prev-rows-btn', function() {
        $('#reviews-data').after(globals.detachedSpinner);
        createRatableTable3Rows(json, 'prev');
    });    
}

function createNewReviewEvents() {
    createNewReviewFormEvent();
    createNewReviewIconEvent();    
}

function createNewReviewFormEvent() {
    $('#table-2').on('submit', '.review-form', function() {
        if (!globals.isGuest) {
            $.post("review", $(this).serialize(), function(res) {
                console.log(res);
            });
        }
        $('#tr-review-form').hide();
        $('#table-2 tbody').append('<tr><td style="color:green;">' +
                '<i class="fa fa-check"></i> Your review has been submitted!' +
                '</td></tr>');
        return false;
    });
}

function createNewReviewIconEvent() {
    $('#table-2').on('click', '.fa-user-secret', function() {
        var isAnonymous = false;
        $(this).toggleClass('secret-empty');
        if (!globals.isGuest) {
             if (!$(this).hasClass('secret-empty')) {
                 isAnonymous = true;
             }
             $('.review-form').find('input[name="anonymous"]').val(isAnonymous);            
        }
        return false;       
    });
}

function createEditReviewBtnEvent(json, ratableName) {
    $('#table-2').on('click', '.user-review', function() {
        $(this).remove();
        appendEditReviewRow(json, ratableName);
        setEditReviewRowCss();
        createEditReviewIconEvents(json, ratableName);
    });
}

function appendEditReviewRow(json, ratableName) {
    var pencilSquareTooltip = '';
    var eraserTooltip = '';
    if (globals.deviceType === "desktop") {
        pencilSquareTooltip = 'data-toggle="tooltip" data-placement="top" ' +
                'title="edit your review"';
        eraserTooltip = 'data-toggle="tooltip" data-placement="top" ' +
                'title="clear your review"';
    }
    $('#table-2 tbody').append('<tr><td>' +
            '<div style="margin-bottom:-6px">' + 
                createSmallReadOnlyStars(json.rating) + 
                '<span><strong class="headline"> ' + json.headline + 
                    '</strong></span>' +
                '<span><i class="fa fa-pencil-square-o fa-lg review-icon" ' + 
                    pencilSquareTooltip + '></i></span>' +
                '<span>' +
                    '<form class="eraser-form" name="eraser-form" method="post">' +
                        globals.csrfInput +
                        '<input type="hidden" name="ratable" value="' + 
                            ratableName + '">' +                                
                     '</form>' +
                    '<i class="fa fa-eraser fa-lg review-icon" ' + 
                        eraserTooltip + '></i>' +
                '</span>' +                    
            '</div>' +
            '<div style="padding-left:4px;">' +
                'By <a href="user/' + json.userId +'">' + json.user + 
                '</a> on ' + json.date + 
            '</div>' +
            '<div style="padding-left:8px;padding-top:4px;">' + json.review +
            '</div>' +                            
        '</td></tr>'
    );
}

function setEditReviewRowCss() {
    if ($('#table-2').width() > $('#reviews-data').width()) {
        $('#table-2').css({'width': '100%', 'table-layout': 'fixed',
            'overflow': 'hidden'});
        $('#table-2 td').css({'width': '100%'});
    }
    $('#table-2 svg').css({'padding': '2px'});                    
    if (globals.deviceType === "desktop") {
        $('#table-2 i').tooltip({container: 'body'});
        $('#table-2 i').tooltip();                    
    }
}

function createEditReviewIconEvents(json, ratableName) {
    $('#table-2').on('click', '.fa-pencil-square-o', function() {
        showEditReviewForm(json);
        setEditReviewAnonymousIcon(json);
        createEditReviewAnonymousIconEvent();
        createEditReviewFormEvent();        
    });
    $('#table-2').on('click', '.fa-eraser', function() {
        $('#table-2 i').tooltip('hide');
        eraseReview();
        $('#tr-review-form').next().remove();
        $('#tr-review-form').hide();                        
        $('#table-2 tbody').append('<tr><td style="color:red;">' +
                '<i class="fa fa-check"></i> Your review has been removed. ' +
                '<button class="btn btn-default undo">undo</button></td></tr>');
        createUndoEraseReviewEvent(json, ratableName);        
    });
}
function showEditReviewForm(json) {
    $('#table-2 i').tooltip('hide');
    $('#tr-review-form').next().remove();
    $('#tr-review-form').show();
    $('#table-2 textarea').val(json.review);
    $('#table-2 input[name="headline"]').val(json.headline);
    $('#table-2 input[name="anonymous"]').val(json.anonymous);
}

function setEditReviewAnonymousIcon(json) {
    $('#table-2 .fa-user-secret').toggleClass('secret-empty', !json.anonymous);
    if (globals.deviceType === 'mobile') {
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
}

function createEditReviewAnonymousIconEvent() {
    $('#table-2').on('click', '.fa-user-secret', function() {
        var isAnonymous = false;
        $(this).toggleClass('secret-empty');
        if (!globals.isGuest) {
             if (!$(this).hasClass('secret-empty')) {
                 isAnonymous = true;
             }
             $('.review-form').find('input[name="anonymous"]')
                     .val(isAnonymous.toString());            
        }
        return false;       
    });
}

function createEditReviewFormEvent() {
    $('#table-2').on('submit', '.review-form', function() {
        if (!globals.isGuest) {
            $.post("review", $(this).serialize(), function(res) {
                console.log(res);
            });
        }
        $('#table-2 tbody').append('<tr><td style="color:green;">' +
                '<i class="fa fa-check"></i> Your review has been submitted!' +
                '</td></tr>');
        $('#tr-review-form').hide();                            
        return false;
    });
}

function eraseReview() {
    $('#table-2').on('submit', '.eraser-form', function() {
        var id = $('#table-1 .anon-form input[name="id"]').first().val().toString();
        $.ajax('review/' + id, {data: $(this).serialize(), method: "DELETE"}); 
        return false;
    });
    $('#table-2 .eraser-form').trigger('submit');
}

function createUndoEraseReviewEvent(json, ratableName) {
    $('#table-2').on('click', '.undo', function() {
        $('#tr-review-form').next().remove();
        $('#table-2 .review-form').find('textarea').first().html(json.review);
        $('#table-2 .review-form input[name="headline"]').val(json.headline);
        $('#table-2 .review-form input[name="anonymous"]').val(json.anonymous);
        $('#table-2 .review-form input[name="ratable"]').val(ratableName);
        undoEraseReview();
        $('#table-2 tbody').append('<tr><td style="color:green;">' +
                '<i class="fa fa-check"></i> Your review has been restored.' +
                '</td></tr>');
    });
}

function undoEraseReview() {
    $('.review-form').on('submit', function() {
        $.post('review', $(this).serialize(), function(res) {
            console.log(res);
        });
        return false;
    });
    $('.review-form').trigger('submit');
}

function createRatableTable3Rows(json, btnAction) {
    var i;
    var length = 10;
    var anonymousTooltip = '';
    var userAnchor = '';
    $('#table-3 tbody tr').remove();    
    if (json.reviews.length) {
        if (btnAction === 'add') {
            globals.reviewsIndex += 10;
        }
        else if (btnAction === 'prev') {
            globals.reviewsIndex -= 10;
        }
        else if ((btnAction === 'none') && (json.reviews.length < 10)) {
            length = json.reviews.length;
        }
        if ((btnAction !== 'none') &&
                ((json.reviews.length - globals.reviewsIndex) < 10)) {
            length = json.reviews.length - globals.reviewsIndex;
        }
        for (i = 0; i < length; i++) {
            if (!json.reviews[i + globals.reviewsIndex].user) {
                if (globals.deviceType === 'desktop') {
                    anonymousTooltip = ' data-toggle="tooltip" ' +
                            'data-placement="top" title="anonymous review"';
                }
                userAnchor = '<i class="fa fa-user-secret"' + anonymousTooltip +
                        '></i>';
            }
            else {
                userAnchor = '<a href="user/' + 
                        json.reviews[i + globals.reviewsIndex].userId + '">' + 
                        json.reviews[i + globals.reviewsIndex].user + '</a>';
            }
            $('#table-3 tbody').append('<tr><td>' +
                    '<div style="display:table;margin-bottom:-6px">' + 
                createSmallReadOnlyStars(json.reviews[i + globals.reviewsIndex].rating) + 
                        '<span><strong class="headline"> ' + 
                        json.reviews[i + globals.reviewsIndex].headline + 
                        '</strong></span>' +
                    '</div>' +
                    '<div style="padding-left:4px;">By ' + userAnchor + ' on ' + 
                        json.reviews[i + globals.reviewsIndex].date + '</div>' +
                    '<div style="padding-left:8px;padding-top:4px;overflow:hidden;">' + 
                        json.reviews[i + globals.reviewsIndex].review + '</div>' +
                    '<div>Was this review helpful? ' +
                        '<button class="btn btn-default">Yes</button>' +
                        '<button class="btn btn-default" style="margin-left:4px;">' +
                            'No</button></div>' +
                '</td></tr>'
            );
            if (globals.deviceType === 'desktop') {
                $('#table-3 .fa-user-secret').tooltip({container: 'body'});
                $('#table-3 .fa-user-secret').tooltip();
            }
            if ($('#table-3').width() > $('#reviews-data').width()) {
                $('#table-3').css({'width': '100%', 'table-layout': 'fixed',
                    'overflow': 'hidden'});
                $('#table-3 td').css({'width': '100%'});
            }
            $('#table-3 tbody tr').css({'border-top-style': 'solid',
                'border-top-width': 'thin', 'border-top-color': 'orange',
                'border-bottom-style': 'solid', 'border-bottom-width': 'thin',
                'border-bottom-color': 'orange'});
            $('#table-3 svg').css({'padding': '2px'});            
        }
    }
    if (globals.reviewsIndex >= 10) {
        $('#table-3 tbody').prepend('<tr><td style="text-align:center;">' +
                '<div><button class="prev-rows-btn">Previous</button>' +
                '</div></td></tr>');
        $('#table-3 tbody .prev-rows-btn').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
    }
    if (json.reviews.length > (globals.reviewsIndex + 10)) {
        $('#table-3 tbody').append('<tr><td style="text-align:center;">' +
                '<div><button class="add-rows-btn">More</button></div></td></tr>');
        $('#table-3 tbody .add-rows-btn').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
    }
    $('.spinner').last().remove();
}

function createUserDataRows(json) {
    createUserBtnEvents(json);
    createUserRatingsRows(json, 'none');
    createUserReviewsRows(json, 'none');
}

function createUserBtnEvents(json) {
    $('#ratings-data tbody').on('click', '.add-rows-btn', function() {
        $('#ratings-data tbody').append(globals.detachedSpinner);
        createUserRatingsRows(json, 'add');
    });
    $('#reviews-data tbody').on('click', '.add-rows-btn', function() {
       $('#reviews-data tbody').append(globals.detachedSpinner);
       createUserReviewsRows(json, 'add');
    });
    $('#ratings-data tbody').on('click', '.prev-rows-btn', function() {
        $('#ratings-data tbody').append(globals.detachedSpinner);
        createUserRatingsRows(json, 'prev');
    });
    $('#reviews-data tbody').on('click', '.prev-rows-btn', function() {
        $('#reviews-data tbody').append(globals.detachedSpinner);
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
            globals.ratingsIndex += 10;
        }
        else if (btnAction === 'prev') {
            globals.ratingsIndex -= 10;
        }
        else if ((btnAction === 'none') && (json.ratings.length < 10)) {
            length = json.ratings.length;
        }
        if ((btnAction !== 'none') &&
                ((json.ratings.length - globals.ratingsIndex) < 10)) {
            length = json.ratings.length - globals.ratingsIndex;
        }
        for (i = 0; i < length; i++) {
            if (!json.ratings[i + globals.ratingsIndex].anonymous) {
                anonymousIcon = '';
            }
            else {
                if (globals.deviceType === "desktop") {
                    anonymousTooltip = ' data-toggle="tooltip" ' +
                            'data-placement="top" title="anonymous rating"';
                }
                anonymousIcon = '<i class="user-page-anon fa fa-user-secret"' +
                        anonymousTooltip + '></i>';
            }
            $('#ratings-data .tr-spinner').before('<tr>' +
                '<td>' +
                createSmallReadOnlyStars(json.ratings[i + globals.ratingsIndex].rating) +
                '</td>' +
                '<td><span><a class="ratings-data-a" ' +
                    'href="' + encodeURI(json.ratings[i + globals.ratingsIndex].ratable) + '">' +
                    json.ratings[i + globals.ratingsIndex].ratable + '</a>' +
                    anonymousIcon + '</span>' +
                '</td></tr>');
        }
    }
    $('#ratings-data svg').css({'padding': '2px'});
    $('.fa-user-secret').tooltip({container:'body'});
    $('.fa-user-secret').tooltip();
    if (globals.ratingsIndex >= 10) {
        $('#ratings-data tbody').prepend('<tr>' +
            '<td style="text-align:center;" colspan="2"><div>' +
            '<button class="prev-rows-btn">Previous</button></div></td></tr>');
        $('#ratings-data tbody .prev-rows-btn').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
    }
    if (json.ratings.length > (globals.ratingsIndex + 10)) {
        $('#ratings-data .tr-spinner').before('<tr>' +
            '<td style="text-align:center;" colspan="2"><div>' +
            '<button class="add-rows-btn">More</button></div></td></tr>');
        $('#ratings-data tbody .add-rows-btn').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
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
            globals.reviewsIndex += 10;
        }
        else if (btnAction === 'prev') {
            globals.reviewsIndex -= 10;
        }
        else if ((btnAction === 'none') && (json.reviews.length < 10)) {
            length = json.reviews.length;
        }
        if ((btnAction !== 'none') &&
                ((json.reviews.length - globals.reviewsIndex) < 10)) {
            length = json.reviews.length - globals.reviewsIndex;
        }
        for (i = 0; i < length; i++) {
            if (!json.reviews[i + globals.reviewsIndex].anonymous) {
                anonymousIcon = '';
            }
            else {
                if (globals.deviceType === "desktop") {
                    anonymousTooltip = ' data-toggle="tooltip" ' +
                            'data-placement="top" title="anonymous review"';
                }
                anonymousIcon = '<i class="fa fa-user-secret"' +
                        anonymousTooltip +'></i>';
            }
            $('#reviews-data .tr-spinner').before('<tr><td>' + anonymousIcon +
                ' <a href="' + encodeURI(json.reviews[i + globals.reviewsIndex].ratable) + '">' +
                    json.reviews[i + globals.reviewsIndex].ratable + '</a>: ' +
                json.reviews[i + globals.reviewsIndex].date + ' - ' +
                json.reviews[i + globals.reviewsIndex].headline + ' - ' + 
                '<div>' + json.reviews[i + globals.reviewsIndex].review +
                '</div></td><tr>');
        }
    }
    if ($('#reviews-data').width() > $('.panel-body').last().width()) {
        $('#reviews-data').css({'width': '100%', 'table-layout': 'fixed',
            'overflow': 'hidden'});
        $('#reviews-data td').css({'width': '100%'});
    }
    $('.fa-user-secret').tooltip({container:'body'});
    $('.fa-user-secret').tooltip();
    if (globals.reviewsIndex >= 10) {
        $('#reviews-data tbody').prepend('<tr>' +
            '<td style="text-align:center;" colspan="2"><div>' +
            '<button class="prev-rows-btn">Previous</button></div></td></tr>');
        $('#reviews-data tbody .prev-rows-btn').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
    }
    if (json.reviews.length > (globals.reviewsIndex + 10)) {
        $('#reviews-data .tr-spinner').before('<tr>' +
            '<td style="text-align:center;" colspan="2"><div>' +
            '<button class="add-rows-btn">More</button></div></td></tr>');
        $('#reviews-data tbody button').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
    }
    $('#reviews-data .tr-spinner').remove();
}

function createSmallReadOnlyStars(rating) {
    var html = '';
    var i;
    var starFill;
    var stroke;
    var svgAttr = 'width="22" height="22" viewBox="0 0 262 250" ' +
            'xmlns="http://www.w3.org/2000/svg" version="1.1"';
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
                    '<svg ' + svgAttr + '>' +
                        '<polygon class="polygon-' + i + '" ' +
                            'fill="' + starFill + '" ' +
                            'stroke="' + stroke + '" stroke-width="20"' +
                            'points="123,4 152,90 242,90 170,144 196,230 ' +
                                '123,179 50,230 76,144 4,90 94,90"' +
                         '/>' +
                    '</svg>' + 
                '</span>';
    }
    return html;
}

function createTable1Rows(table) {
    var i;
    var k = 0;
    var url = '';
    if (table !== 'autocomplete') {
        url = '/table/' + table + '?skip=';
        for (i = 0; i < 10; i++) {
            $.getJSON(url + globals.skipRatingCount.toString(), function(json) {
                k++;
                if (json.name) {
                    createTable1Tr(json);                    
                }
                else {
                    $('#table-1-body').append('<tr class="ratable-tr"></tr>');
                    if (!globals.noMoreRows) {
                        globals.noMoreRows = true;
                        globals.detachedRatingsRows.push($('.ratable-tr').clone());
                    }                   
                }
                if (k === 10) {
                    if ((globals.detachedRatingsRowsIndex ===
                            globals.detachedRatingsRows.length) &&
                            !globals.noMoreRows) {
                        globals.detachedRatingsRows.push($('.ratable-tr').clone());
                    }                    
                    globals.detachedSpinner = $('.spinner').detach();
                    if (globals.noMoreRows) {
                        globals.detachedMoreBtn = $('#add-rows-btn').detach();
                    }
                    else {
                        $('#add-rows-btn').button({disabled: false});
                    }
                    if ($('#prev-rows-btn').length) {
                        $('#prev-rows-btn').button({disabled: false});
                    }                        
                }
            });
            globals.skipRatingCount++;
        }
    }
    else {
        url = 'autocomplete?term=' + $('#table-1 > thead').attr('id');
        $.getJSON(url, function(searchJson) {
            var i;
            var url = '/table/search?id=';
            if (searchJson.length) {
                for (i = 0; i < searchJson.length; i++) {
                    $.getJSON(url + searchJson[i].id.toString(), function(resultJson) {
                        createTable1Tr(resultJson);
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

function createTable1Tr(json) {
    if (globals.deviceType === "desktop") {
        var loginTooltip = '';
        var anonymousIcon = '';
        var secretEmpty = '';
        var mapMarker = '';
        var nameWithStyle = json.name;
        if (json.style.length) {
            nameWithStyle = getNameWithStyle(json);
        }
        var anchor = '<a data-toggle="tooltip" data-placement="bottom" title="' +
                json.desc + '" href="' + encodeURI(json.name) + '">' + nameWithStyle + '</a>';
        if (globals.isGuest) {
            loginTooltip = 'data-toggle="tooltip" data-placement="top" ' +
                    'title="Please login to rate items."';
        }
        if (!json.isAnonymous) {
            secretEmpty = ' secret-empty';
        }
        anonymousIcon = '<div class="master-page-anon">' +
            '<form class="anon-form" method="post">' +
                globals.csrfInput +
                '<input type="hidden" name="id" value="' + json.id + '">' +
                '<input type="hidden" name="anonymous" value="' +
                    json.isAnonymous + '" >' +                        
            '</form>' +
            '<i class="fa fa-user-secret fa-lg' + secretEmpty + '" ' +
                'data-toggle="tooltip" data-placement="top" ' +
                'title="rate this anonymously"></i></div>';
        if (json.region.length) {
            mapMarker = '<div style="float:left;">' +
                    '<i class="fa fa-map-marker fa-lg" data-html="true" ' +
                        'data-toggle="tooltip" data-placement="top" ' +
                        'title="located in ' + json.region +
                        '<br>(map feature coming soon)"></i></div>';
        }
        $('#table-1-body').append(
            '<tr class="ratable-tr border-top-' + globals.borderTopColor + '">' +
                '<td><img src="' + json.img_src + '" style="width:100px;"></td>' +  
                '<td><div>' + anchor + '</div></td>' + 
                '<td>' +    
                    '<div style="float:left"' + loginTooltip + '>' +
                        createFiveStars(json) + '</div>' + 
                '</td>' +
                '<td style="padding-top:12px;">' +
                    '<div style="float:left;"><div style="float:left;"> ' +
                        json.rating + '/5 - ' + json.numberOfRatings + '</div>' + 
                        anonymousIcon + mapMarker + '</div>' +
                '</td>' +
            '</tr>'
        );
        $('#tr-add-rows').appendTo('#table-1-body');
        $('[data-toggle="tooltip"]').tooltip({container: 'body', html: true});
        $('[data-toggle="tooltip"]').tooltip();        
    }
    else {
        var loginTooltip = '';
        var anonymousIcon = '';
        var secretEmpty = '';
        var mapMarker = '';
        var nameWithStyle = json.name;
        if (json.style.length) {
            nameWithStyle = getNameWithStyle(json);
        }
        var anchor = '<a href="' + encodeURI(json.name) + '">' + nameWithStyle + '</a>';
        if (globals.isGuest) {
            loginTooltip = 'data-toggle="tooltip" data-placement="top" ' +
                    'title="Please login to rate items."';
        }
        if (!json.isAnonymous) {
            secretEmpty = ' secret-empty';
        }
        anonymousIcon = '<form class="anon-form" method="post">' +
                            globals.csrfInput +
                            '<input type="hidden" name="id" value="' +
                                json.id + '">' +
                            '<input type="hidden" name="anonymous" value="' +
                                json.isAnonymous + '" >' +                        
                        '</form>' +
                        '<i style="padding-left:4px;" ' +
                            'class="fa fa-user-secret fa-lg' + secretEmpty + 
                            '"></i>';
        if (json.region.length) {
            mapMarker = '<i class="mobile-map fa fa-map-marker fa-lg"></i>';
        }
        $('#table-1-body').append(
            '<tr class="ratable-tr border-top-' + globals.borderTopColor + '">' +
                '<td><img src="' + json.img_src + '" style="width:100px;"></td>' +  
                '<td><div>' + anchor + '</div>' +
                    '<div><div style="float:left;" class="btn-star-group "' +
                    loginTooltip + '>' + createFiveStars(json) + '</div></div>' + 
                    '<div style="overflow:hidden;width:100%;">' +
                        '<div style="float:left;" >' + json.rating + '/5 - ' +
                        json.numberOfRatings + '</div><div class="mobile-icons">' +
                        anonymousIcon + mapMarker + '</div>' +
                    '</div>' +
                '</td>' +
            '</tr>'
        );
        $('#tr-add-rows').appendTo('#table-1-body');        
        $('[data-toggle="tooltip"]').tooltip({container: 'body'});
        $('[data-toggle="tooltip"]').tooltip();
    }
}

function createFiveStars(json) {
    var html = '';
    var i;
    var starFill = '';
    var stroke = '';
    var offset = '50%';
    var fraction = parseFloat(parseFloat(json.rating.substring(json.rating.length - 2))
            .toFixed(1));
    var ratingFloor = Math.floor(parseFloat(json.rating));
    var svgMeasure = '40';
    if (globals.deviceType === "mobile") {
        svgMeasure = '25';
    }
    for (i = 0; i < 5; i++) {
        if ((i < json.userRating) && (i < ratingFloor)) {
            stroke = globals.avgStarColor;
            starFill = 'red';
        }
        else if (i < ratingFloor) {
            stroke = globals.avgStarColor;
            starFill = globals.avgStarColor;
        }
        else if ((i < json.userRating) && (!fraction)) {
            stroke = globals.avgStarFadedColor;
            starFill = 'red';
        }
        else if ((i < json.userRating) && fraction && (i === ratingFloor)) {
            offset = json.rating.substring(json.rating.length - 1) + '0%';
            stroke = "url(#stroke-grad-" + globals.gradId.toString() + ")";
            starFill = "red";
        }
        else if ((i === ratingFloor) && fraction) {
            offset = json.rating.substring(json.rating.length - 1) + '0%';
            stroke = "url(#stroke-grad-" + globals.gradId.toString() + ")";
            starFill = "url(#fill-grad-" + globals.gradId.toString() + ")";            
        }
        else {
            stroke = globals.avgStarFadedColor;
            starFill = 'white';
        }
        html += '<form class="star-btn-form" method="post">' +
                globals.csrfInput +
                '<input type="hidden" name="ratable" value="' + json.name + '">' +
                '<input type="hidden" name="rating" value="' + i + '">' +
                '<input type="hidden" name="anonymous" value="' +
                    json.isAnonymous.toString() + '">' +
                '<button class="poly-star-btn">' +
                    '<svg width="' + svgMeasure + '" height="' + svgMeasure + '" ' +
                        'viewBox="0 0 262 250" xmlns="http://www.w3.org/2000/svg" ' +
                        'version="1.1">' +
                        '<defs>' +
                            '<linearGradient id="fill-grad-' +
                                globals.gradId.toString() + '" class="fill">' +
                                '<stop offset="0%" stop-color="orange" />' +
                                '<stop offset="' + offset + '" stop-color="' +
                                    globals.avgStarColor + '" />' +
                                '<stop offset="' + offset + '" stop-color="white" />' +
                                '<stop offset="100%" stop-color="white" />' +
                            '</linearGradient>' +
                            '<linearGradient id="stroke-grad-' +
                                globals.gradId.toString() + '" class="stroke">' +
                                '<stop offset="0%" stop-color="orange" />' +
                                '<stop offset="' + offset + '" stop-color="' +
                                    globals.avgStarColor + '" />' +
                                '<stop offset="' + offset + '" stop-color="' +
                                    globals.avgStarFadedColor + '" />' +
                                '<stop offset="100%" stop-color="#FED8B1" />' +
                            '</linearGradient>' +
                        '</defs>' +
                        '<polygon class="polygon-' + i + '" fill="' + starFill + '" ' +
                            'stroke="' + stroke + '" stroke-width="20"' +
                            'points="123,4 152,90 242,90 170,144 196,230 ' +
                                '123,179 50,230 76,144 4,90 94,90" />' +
                    '</svg>' + 
                '</button>' +
            '</form>';
        globals.gradId++;
    }
    return html;
}

function createTable1BtnEvents() {
    $('#table-1').on('click', '#add-rows-btn', function(){
        window.scrollTo(0, 0);
        $('#add-rows-btn').button({disabled: true});
        globals.detachedRatingsRowsIndex++;
        $('.ratable-tr').remove();
        if (!$('#prev-rows-btn').length) {
            $('#table-1-body').prepend('<tr id="tr-prev-rows">' +
                    '<td id="td-prev-rows" colspan="6">' +
                    '<button id="prev-rows-btn">Previous</button></tr></td>');
        }
        $('#prev-rows-btn').button({disabled: true})
                .css({'border-color': 'orange', 'color': 'orange'});
        if ((globals.detachedRatingsRowsIndex ===
                globals.detachedRatingsRows.length) && !globals.noMoreRows) {
            $('#td-add-rows').prepend(globals.detachedSpinner);                
            createTable1Rows('master');
        }
        else {
            $('#tr-add-rows')
                .before(globals.detachedRatingsRows[globals.detachedRatingsRowsIndex]);
            if ((globals.detachedRatingsRowsIndex < globals.detachedRatingsRows.length)
                    && !((globals.detachedRatingsRowsIndex ===
                                (globals.detachedRatingsRows.length - 1))
                            && globals.noMoreRows)) {
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
        $('#add-rows-btn').button({disabled: true})
                .css({'border-color': 'orange', 'color': 'orange'});
        globals.detachedRatingsRowsIndex--;
        if (globals.detachedRatingsRowsIndex === 0) {
            $('#tr-prev-rows').remove();
        }
        $('.ratable-tr').remove();
        if (!$('#add-rows-btn').length) {
            $('#td-add-rows')
                .append('<div><button id="add-rows-btn">More</button></div>');
            $('#add-rows-btn').button({disabled: true})
                    .css({'border-color': 'orange', 'color': 'orange'});
        }
        $('#tr-add-rows')
            .before(globals.detachedRatingsRows[globals.detachedRatingsRowsIndex]);
        $('#add-rows-btn').button({disabled: false})
                .css({'border-color': 'orange', 'color': 'orange'});
    });
}