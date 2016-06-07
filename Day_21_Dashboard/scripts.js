function ready(){
    var graph_impact = Snap("#impact-graph");
    var g1 = new ArcGraph(80, 100, 70, graph_impact, '#3D97CC', '#51B5F1');
    g1.SetPercent(100);
    var g2 = new ArcGraph(265, 100, 70, graph_impact, '#1A4DC0', '#1E5CE5');
    g2.SetPercent(60);
    var g3 = new ArcGraph(450, 100, 70, graph_impact, '#05BF80', '#10E39C');
    g3.SetPercent(34);
    var g4 = new ArcGraph(635, 100, 70, graph_impact, '#D74E00', '#FE6700');
    g4.SetPercent(71);
    var g5 = new ArcGraph(820, 100, 70, graph_impact, '#AD0101', '#D11013');
    g5.SetPercent(80);

    var i1 = new ArcInfo(80, graph_impact, 'content/icon_twitter.png', 100, '+23%');
    var i2 = new ArcInfo(265, graph_impact, 'content/icon_facebook.png', 60, '+6%');
    var i3 = new ArcInfo(450, graph_impact, 'content/icon_instagram.png', 34, '+2%');
    var i4 = new ArcInfo(635, graph_impact, 'content/icon_pinterest.png', 71, '+17%');
    var i5 = new ArcInfo(820, graph_impact, 'content/icon_youtube.png', 80, '+11%');
    // graph_impact.image('content/icon_twitter.png', 80 - 13, 60, 26, 26);
    //graph_impact.image('content/icon_facebook.png', 265 - 13, 60, 26, 26);
    //graph_impact.image('content/icon_instagram.png', 450 - 13, 60, 26, 26);
    //graph_impact.image('content/icon_pinterest.png', 635 - 13, 60, 26, 26);
    //graph_impact.image('content/icon_youtube.png', 820 - 13, 60, 26, 26);

    // var t1 = graph_impact.text(40, 120, ['100', 'M']);
    // t1.attr({
    //     style: "font-size: 40px; font-weight: 500;"
    // });

    // var t1_unit = graph_impact.selectAll("tspan:nth-child(2)");
    // t1_unit.attr({
    //     style: "font-size: 20px;"
    // });

    // var t1_delta = graph_impact.text(60, 140, '+23%');
    // t1_delta.attr({
    //     style: "font-size: 16px;",
    //     fill: "#73746E"
    // });
}

function ArcGraph(X, Y, R, Paper, Color1, Color2) {
  
    var maskInnerCircleBackground = Paper.circle(X, Y, R);
    maskInnerCircleBackground.attr({
        stroke: "white",
        strokeWidth: 20
    });
    
    var background_donut = Paper.circle(X, Y, R);
    background_donut.attr({
        fill: '#D3D3D1',
        stroke: '#DFDFDD',
        strokeWidth: 10,
        mask: maskInnerCircleBackground
    });
    
    var maskInnerCircle = Paper.circle(X, Y, R);
    maskInnerCircle.attr({
        stroke: "white",
        strokeWidth: 20
    });
    
    this.donut = Paper.circle(X, Y, R);
    this.donut.attr({
       fill: Color1,
       stroke: Color2,
       strokeWidth: 10 
    });

    this.donut.attr({
       mask: maskInnerCircle 
    });
    
    this.SetPercent = function(Percent){
        var percent = Percent - 25;
        var xl = X + (R + 40) * Math.cos((percent * Math.PI / 180) * 3.6);
        var yl = Y + (R + 40) * Math.sin((percent * Math.PI / 180) * 3.6);
        var stringPath = 'M' + X + ',' + Y + 'L' + xl + ',' + yl;
        if (Percent >= 75)
            stringPath += ' L' + (X - R - 40) + ',' + Y + ' L' + (X - R - 40) + ',' + (Y + R + 40);
        if (Percent >= 50)
            stringPath += ' L' + X + ',' + (Y + R + 40) + ' L' + (X + R + 40) + ',' + (Y + R + 40);
        if (Percent >= 25)
            stringPath += ' L' + (X + R + 40) + ',' + Y + ' L' + (X + R + 40) + ',' + (Y - R - 40);
        stringPath += ' L' + X + ',' + (Y - R - 40) + 'Z';
       
        var path = Paper.path(stringPath);
        path.attr({
            fill: 'white'
        });
        
        maskInnerCircle.attr({
            mask: path
        });
    }
}

function ArcInfo(X, Paper, ImageURL, NumberSummary, DeltaPercent) {
    var logo = Paper.image(ImageURL, X - 13, 60, 26, 26);
    var summaryText = Paper.text(X - 40, 120, [NumberSummary, 'M']);
    summaryText.attr({
        style: "font-size: 40px; font-weight: 500;"
    });

    var st_unit = Paper.selectAll("tspan:nth-child(2)");
    st_unit.attr({
        style: "font-size: 20px;"
    });

    var deltaText = Paper.text(X - 20, 140, DeltaPercent);
    deltaText.attr({
        style: "font-size: 16px;",
        fill: "#73746E"
    });
}

document.addEventListener('DOMContentLoaded', ready);