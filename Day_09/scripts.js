$(document).ready(function(){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 400){
            $('header').addClass('fixed');
            $('.intro-image').addClass('fixed');
        } else {
            $('header').removeClass('fixed');
            $('.intro-image').removeClass('fixed');
        }
    });
});