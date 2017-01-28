$(document).ready(function() {
    createStars();
    createStarEventHandlers();
});

function createStars() {
    var idInd = 0;
    $('.star-rate').append(function() {
        var html = '';
        var i;
        for (i = 0; i < 5; i++) {
            html += '<button type="submit" id="star-index-' + idInd + '" class="btn-star fa fa-star-o"></button>';
            idInd++;
        }
        return html;
    }).css({color: 'red'});   
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
            groupInd = parseInt(idInd.toString().substr(idInd.length - 1), 10);
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
        groupIndClicked = parseInt(idInd.toString().substr(idInd.length - 1), 10);
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
