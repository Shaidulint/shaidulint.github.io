window.onload = function(){
    
    var points = [
        [100,300],
        [150,275],
        [175,285],
        [200,200],
        [250,240],
        [300,260],
        [350,210],
        [400,180],
        [450,150],
        [500,220],
    ];
    
    var strPoints = points[0][0] + "," + points[0][1]
    for(var i = 0; i < points.length - 1; i++) {
        var x1 = points[i][0];
        var y1 = points[i][1];
        var x2 = points[i+1][0];
        var y2 = points[i+1][1];
        var diff = (x2-x1)/2.5;
        
        strPoints += " C" + (x1+diff) + "," + y1 + " " + (x2-diff) + "," + y2 + " " + x2 + "," + y2;
    }
    var strLine = "M" + strPoints;
    var strPolygon = "M100,400 L" + strPoints + "L500,400 Z";
    
    var img = Snap("#image");

    var g = img.gradient("l(0, 0, 0, 1)rgba(78, 202, 237, 0.8)-rgba(66, 101, 239, 0.0)");
    
    var p = img.path(strPolygon);
    p.attr({
        fill: g,
    });
    
    var l = img.path(strLine);
    l.attr({
        fill: "transparent",
        stroke:"#FFE02B",
        strokeWidth: 2
    });
    console.info(strLine);
};