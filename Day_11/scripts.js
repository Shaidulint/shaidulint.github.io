window.onload = function(){
    
    var paper = Snap('#cvs');

    var color = {
        r: 251,
        g: 72,
        b: 86
    }
    var color_diff = {
        r: -2.08,
        g: 0.59,
        b: 1.69
    }
    var arr = [];
    
    for(var i = 0; i < 100; i++) {
        var r = paper.rect(50 + i * 9, 100, 9, 20, 0, 0);
        var c = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        r.attr({
            fill: c
        })
        color.r = color.r + color_diff.r;
        color.g = color.g + color_diff.g;
        color.b = color.b + color_diff.b;
        
        arr.push({
            value: i,
            rect: r
        })
    }
    
    var temp = 0;
    for(var i = 0; i < 100; i++) {
        var y = Math.floor(Math.random() * 100);
        temp = arr[i];
        arr[i] = arr[y];
        arr[y] = temp;
    }
    
    for(var i = 0; i < 100; i++){
        arr[i].rect.attr({
            x: 50 + i * 9
        })
    }
    
    var steps = [];
    for(var x = 0; x < arr.length; x++){
        for(var y = x + 1; y < arr.length; y++){
            if (x != y)
                steps.push({x: x, y: y});
        }
    }
    
    
    var s = 0;
    var timer = setInterval(function(){
        
        var x = steps[s].x;
        var y = steps[s].y;
        var tempItem = null;
        // arr[x].rect.attr({strokeWidth:2, stroke: 'yellow'});
        // arr[y].rect.attr({strokeWidth:2, stroke: 'green'});
        if (arr[x].value < arr[y].value){
            tempItem = arr[x];
            arr[x] = arr[y];
            arr[y] = tempItem;
            arr[x].rect.attr({
                x: 50 + x * 9
            });
            arr[y].rect.attr({
                x: 50 + y * 9
            })
        }
        arr[y].rect.attr({strokeWidth: 0 });
        arr[x].rect.attr({strokeWidth: 0 });
        s++;
        if (s < steps.length) {
            arr[steps[s].x].rect.attr({strokeWidth:2, stroke: 'yellow'});
            arr[steps[s].y].rect.attr({strokeWidth:2, stroke: 'green'});
        } else {
            clearInterval(timer);
        }

    }, 1);
    
}