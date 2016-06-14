/** Возвращает {x,y} на определенном расстоянии и под углом */
function LenDir(Length, Direction) {
    var point = {};
    point.x = Math.cos(Direction * Math.PI / 180) * Length;
    point.y = Math.sin(Direction * Math.PI / 180) * Length;
    return point;
}
/** Вовзвращает строку для Path SVG арки */
function GetStringDonut(X, Y, Radius, Thickness, AngleStart, AngleFinish) {
    AngleStart -= 90;
    var lendirPoint1Start = LenDir(Radius, AngleStart);
    var lendirPoint2Start = LenDir(Radius - Thickness, AngleStart);

    AngleFinish -= 90;
    var big = (AngleFinish - AngleStart > 180) ? 1 : 0;

    var lendirPoint1Finish = LenDir(Radius, AngleFinish);
    var lendirPoint2Finish = LenDir(Radius - Thickness, AngleFinish);

    var p1 = {x: X + lendirPoint1Start.x, y: Y + lendirPoint1Start.y};
    var p2 = {x: X + lendirPoint1Finish.x, y: Y + lendirPoint1Finish.y };
    var p3 = {x: X + lendirPoint2Finish.x, y: Y + lendirPoint2Finish.y };
    var p4 = {x: X + lendirPoint2Start.x, y: Y + lendirPoint2Start.y };
    var strPath = "M" + p1.x + "," + p1.y +
        " A" + Radius + " " + Radius + ", 0, " + big + ", 1, " + p2.x + " " + p2.y +
        " L" + p3.x + "," + p3.y + 
        " A" + (Radius - Thickness) + " " + (Radius - Thickness) + ", 0, " + big + ", 0, " + p4.x + ", " + p4.y + " Z";
    return strPath;
}

function GetStringLine(X1, Y1, X2, Y2) {
    return 'M' + X1 + ',' + Y1 + 'L' + X2 + ',' + Y2;
}

function GetStringMultiline(Points) {
    var path = 'M' + Points[0].x + ',' + Points[0].y;
    for(var i = 1; i < Points.length; i++ ) {
        path += 'L' + Points[i].x + ',' + Points[i].y;
    }
    return path;
}


/** Центрирует Element SVG в точке */
function Centerized(Element, X, Y) {
    var position = Element.getBBox();
    Element.attr({
        x: X - position.width / 2,
        y: Y - position.height / 2
    });
}

/** Рисует круглый граф */
function GraphDonut(X, Y, R, Paper, Percent, OuterColor, InnerColor, ImageUrl, SecondText) {
    var thicknessOuter = 10;
    var thicknessInner = 4;
    if (Percent < 100) {
        //Рисуем фоновые круги
        var backgroundOuterCircle = Paper.circle(X, Y, R - thicknessOuter/2).attr({
            fill: 'transparent',
            stroke: '#DFDFDD',
            strokeWidth: thicknessOuter
        });
        var backgroundInnerCircle = Paper.circle(X, Y, R - thicknessOuter - thicknessInner/2 + 1).attr({
            fill: 'transparent',
            stroke: '#D3D3D1',
            strokeWidth: thicknessInner
        });
        //Рисуем дуги
        if (Percent > 0) {
            var outerArcPath = GetStringDonut(X, Y, R, thicknessOuter, 0, Percent * 3.6);
            var outerArc = Paper.path(outerArcPath).attr({
                fill: OuterColor
            });
            var innerArcPath = GetStringDonut(X, Y, R - thicknessOuter + 1, thicknessInner, 0, Percent * 3.6);
            var innerArc = Paper.path(innerArcPath).attr({
                fill: InnerColor
            });
        }
    } else {
        var outerCircle = Paper.circle(X, Y, R - thicknessOuter/2).attr({
            fill: 'transparent',
            stroke: OuterColor,
            strokeWidth: thicknessOuter
        });
        var innerCircle = Paper.circle(X, Y, R - thicknessOuter - thicknessInner/2 + 1).attr({
            fill: 'transparent',
            stroke: InnerColor,
            strokeWidth: thicknessInner
        });
    }
    // Рисуем иконку
    var icon = Paper.image(ImageUrl, X, Y, 26, 26);
    Centerized(icon, X, Y - 30);
    // Основной и дополнительный тексты
    var summaryText = Paper.text(X, Y, [Percent, 'M']);
    summaryText.attr({
        style: "font-size: 40px; font-weight: 500;"
    });
    var st_unit = Paper.selectAll("tspan:nth-child(2)");
    st_unit.attr({
        style: "font-size: 20px;"
    });
    Centerized(summaryText, X, Y + 45);

    var secondText = Paper.text(X, Y, SecondText);
    secondText.attr({
        style: "font-size: 16px;",
        fill: "#73746E"
    });
    Centerized(secondText, X, Y + 50);
}

function GraphTrendline(Paper, XAxisTitle, XAxisPoints, YAxisPoints, Lines) {
    var paperRect = Paper.node.getBoundingClientRect();
    var padding = 10;
    var graphBox = {
        left: padding + 40,
        right: paperRect.width - padding,
        top: padding + 10,
        bottom: paperRect.height - padding - 30
    };
    //  Нижняя ось
    var XAxisLine = Paper.path(GetStringLine(padding, graphBox.bottom, graphBox.right, graphBox.bottom)).attr({
        strokeWidth: 1,
        stroke: '#797976'
    });

    var vLinesOffset = (graphBox.bottom - graphBox.top) / (YAxisPoints.length - 1);
    var hLinesOffset = ((graphBox.right - 20) - (graphBox.left + 20)) / (XAxisPoints.length - 1);
    var transformPosition = function(X, Y) {
        var result = {x: 0, y: 0 };
        result.x = graphBox.left + 20 + X * hLinesOffset;
        result.y = graphBox.bottom - ((graphBox.bottom - graphBox.top) / (YAxisPoints[YAxisPoints.length - 1] - YAxisPoints[0]) * Y);
        return result;
    }

    //  Горизонтальные фоновые линии и подписи слева
    var horizontalLines = Paper.g();
    var horizontalCaptions = Paper.g();
    for(var i = 0; i < YAxisPoints.length - 1; i++) {
        var l = Paper.path(GetStringLine(graphBox.left, graphBox.top + i * vLinesOffset, graphBox.right, graphBox.top + i * vLinesOffset));
        horizontalLines.add(l);
        var t = Paper.text(graphBox.left / 2, graphBox.top + i * vLinesOffset, YAxisPoints[YAxisPoints.length - 1 - i]);
        Centerized(t, graphBox.left - 15, graphBox.top + i * vLinesOffset + 15);
        horizontalCaptions.add(t);
    }
    horizontalLines.attr({
        strokeWidth: 0.4,
        stroke: '#797976',
        'stroke-dasharray': "4,2"
    });
    horizontalCaptions.attr({
        fill: '#797976',
        'font-size': '14px'
    });
    //  Подписи снизу
    var XAxisCaption = Paper.text(graphBox.left - 15, graphBox.bottom + 24, XAxisTitle).attr({
        fill: '#383836',
        'font-size': '14px'
    });
    Centerized(XAxisCaption, graphBox.left - 15, graphBox.bottom + 24);
    var verticalCaptions = Paper.g();
    for (var i = 0; i < XAxisPoints.length; i++) {
        var t = Paper.text(graphBox.left + 20 + i * hLinesOffset, graphBox.bottom + 25, XAxisPoints[i]);
        Centerized(t, graphBox.left + 20 + i * hLinesOffset, graphBox.bottom + 25);
        verticalCaptions.add(t);
    }
    verticalCaptions.attr({
        fill: '#383836',
        'font-size': '14px'
    });
    // Отрисовка линий
    var graphLines = Paper.g();
    for(var i = 0; i < Lines.length; i++) {
        var line = Lines[i];
        var points = [];
        for ( var p = 0; p < line.points.length; p++)
            points.push(transformPosition(p, line.points[p]));
        var l = Paper.path(GetStringMultiline(points));
        l.attr(line.lineAttributes);
        graphLines.add(l);
        for ( var p = 0; p < points.length; p++) {
            Paper.circle(points[p].x, points[p].y, 4).attr(line.pointsAttributes);
        }
    }
}

function GraphMap(Paper) {
    Snap.load("worldmap.svg", function (f) {
        Paper.append(f);
    });
}