$(document).ready(function(){
   $("#slider_one").slider({
       value: 72,
       range: "min",
       slide: function(event, ui){
           $("#info_data_one").text(ui.value);
       }
   });
   $("#info_data_one").text($("#slider_one").slider("value"));
   
    $("#slider_two").slider({
       value: 68,
       range: "min",
       slide: function(event, ui){
           $("#info_data_two").text(ui.value);
       }
   });
   $("#info_data_two").text($("#slider_two").slider("value"));
   
    $("#slider_three").slider({
       value:81,
       range: "min",
       slide: function(event, ui){
           $("#info_data_three").text(ui.value);
       }
   });
   $("#info_data_three").text($("#slider_three").slider("value"));
});