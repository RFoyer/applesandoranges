$(document).ready(function() {
    createStars();
    createStarHoverHandlers();
    //createStarClickHandlers();
});

function createStars() {
    var i;
    for (i = 0; i < 5; i++) {
        $('.star-rate').append('<button type=submit id="star-fill-' + i + '" class="btn-star fa fa-star-o"></button>');        
    }    
}

function createStarHoverHandlers() {
    $('.btn-star').mouseenter(function() {
            var i;
            var btnInd = parseInt($(this).attr('id').split('')[10], 10);
            for (i = 0; i < btnInd + 1; i++) {
                $('#star-fill-' + i).attr({
                    class: "btn-star fa fa-star" 
                });
            }            
        }).mouseleave(function() {
           var i;
           var btnInd = parseInt($(this).attr('id').split('')[10], 10);            
            for (i = 0; i < btnInd + 1; i++) {
                $('#star-fill-' + i).attr({
                    class: "btn-star fa fa-star-o" 
                });
        }            
    });
}

function createStarClickHandlers() {
    var i;
    for (i = 0; i < 5; i++) {
        $('#star-fill-' + i).click(function() {
            
        });
    }
}