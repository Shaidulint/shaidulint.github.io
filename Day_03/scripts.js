$(document).ready(function(){
    $(".panel-item").click(function(){
       //alert($(this).index());
       var tabs = $('.tabs-container').children();
       tabs.hide();
       $(tabs[$(this).index() + 1]).show();
    });
});