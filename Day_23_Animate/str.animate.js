var animate = {},
    canvas = null,
    context2d = null;

animate.requestFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })().bind(window);


document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('canvas');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    context2d = canvas.getContext('2d');

    var bigPixel = context2d.createImageData(2, 2);
    for(var i = 0, count = bigPixel.data.length; i < count; i += 4) {
        bigPixel.data[i] = 0;
        bigPixel.data[i + 1] = 0;
        bigPixel.data[i + 2] = 0;
        bigPixel.data[i + 3] = 255;
    }

    var x = 5.5;
    var y = 50.5;
    var draw = function() {
        context2d.putImageData(bigPixel, x, y);
        x += 2;
        y += 2;
        animate.requestFrame(draw);
    }

    animate.requestFrame(draw);
});