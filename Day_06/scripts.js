$(document).ready(function(){
   $(".btn-calc-open").click(function(){
       $(".container").removeClass("cont-closed");
       $(".closed").hide();
       $(".opened").show();
   });
});