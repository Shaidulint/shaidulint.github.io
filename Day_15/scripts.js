$(document).ready(function(){
   $('.btn-menu').click(function(){
      $('.btn-menu').toggleClass('actived');
      $('aside.menu').toggleClass('actived');
   });
});