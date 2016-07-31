function animate(duration, stepCallback, timingFunc) {
    var startTime = performance.now();
    var timingFunction = (timingFunc || animate.tLinear);


    var step = function(nowTime){
        var fractionTime = (nowTime - startTime) / duration;
        if (fractionTime > 1)
            fractionTime = 1;
        
        stepCallback(timingFunction(fractionTime));
        if (fractionTime < 1)
            animate.requestFrame(step);
    };

    animate.requestFrame(step);
}
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

animate.tLinear = function(fraction) {
    return fraction;
}
animate.tQuad = function(fraction) {
    return Math.pow(fraction, 2);
}