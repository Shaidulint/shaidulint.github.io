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
function GraphOneDonut(X, Y, R, Paper, Percent, OuterColor, InnerColor, ImageUrl, SecondText) {
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

    this.Replace = function(X, Y, Radius) {
        if (Percent < 100) {
            backgroundOuterCircle.attr({
                cx: X,
                cy: Y,
                r: Radius - thicknessOuter/2
            });
            backgroundInnerCircle.attr({
                cx: X,
                cy: Y,
                r: Radius - thicknessOuter - thicknessInner/2 + 1
            });
            if (Percent > 0) {
                var outerArcPath = GetStringDonut(X, Y, Radius, thicknessOuter, 0, Percent * 3.6);
                outerArc.attr({
                    d: outerArcPath
                })
                var innerArcPath = GetStringDonut(X, Y, Radius - thicknessOuter + 1, thicknessInner, 0, Percent * 3.6);
                innerArc.attr({
                    d: innerArcPath
                });
            }

        } else {
            outerCircle.attr({
                cx: X,
                cy: Y,
                r: Radius - thicknessOuter/2
            });
            innerCircle.attr({
                cx: X,
                cy: Y,
                r: Radius - thicknessOuter - thicknessInner/2 + 1
            });
        }
        if (Radius > 60) {
            Centerized(icon, X, Y - 30);
            summaryText.attr({
                style: "font-size: 40px; font-weight: 500;"
            });
            st_unit.attr({
                style: "font-size: 20px;"
            });
            Centerized(summaryText, X, Y + 45);
            secondText.attr({
                style: "font-size: 16px;"
            });
            Centerized(secondText, X, Y + 50);
        } else {
            Centerized(icon, X, Y - 15);
            summaryText.attr({
                style: "font-size: 20px; font-weight: 500;"
            });
            st_unit.attr({
                style: "font-size: 16px;"
            });
            Centerized(summaryText, X, Y + 30);
            secondText.attr({
                style: "font-size: 16px;"
            });
            Centerized(secondText, X, Y + 40);
        }
    }
}

function GraphFiveDonuts(Paper, Donuts) {
    var paperRect = Paper.node.getBoundingClientRect();
    var circleDistance = paperRect.width / Donuts.length;
    var circleRadius = Math.min(paperRect.height/2, circleDistance/2) - 10;
    var donuts = [];
    for(var i = 0, count = Donuts.length; i < count; i++) {
        var source = Donuts[i];
        var donut = new GraphOneDonut(circleDistance/2 + circleDistance * i, paperRect.height / 2, circleRadius, Paper, source.Percentage, source.OuterColor, source.InnerColor, source.ImageUrl, source.SecondText);
        donuts.push(donut);
    }
    this.Resize = function() {
        var paperRect = Paper.node.getBoundingClientRect();
        var circleDistance = paperRect.width / donuts.length;
        var circleRadius = Math.min(paperRect.height/2, circleDistance/2) - 10;
        for(var i = 0, count = donuts.length; i < count; i++) {
            donuts[i].Replace(circleDistance/2 + circleDistance * i, paperRect.height / 2, circleRadius);
        }
    };
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
    var graphPoints = Paper.g();
    for(var i = 0; i < Lines.length; i++) {
        var line = Lines[i];
        var points = [];
        for ( var p = 0; p < line.points.length; p++)
            points.push(transformPosition(p, line.points[p]));
        var l = Paper.path(GetStringMultiline(points));
        l.attr(line.lineAttributes);
        graphLines.add(l);
        for ( var p = 0; p < points.length; p++) {
            var pg = Paper.circle(points[p].x, points[p].y, 4).attr(line.pointsAttributes);
            graphPoints.add(pg);
        }
    }

    this.Resize = function() {
        var paperRect = Paper.node.getBoundingClientRect();
        var graphBox = {
            left: padding + 40,
            right: paperRect.width - padding,
            top: padding + 10,
            bottom: paperRect.height - padding - 30
        };
        //  Нижняя ось
        XAxisLine.attr({ d: GetStringLine(padding, graphBox.bottom, graphBox.right, graphBox.bottom) });

        vLinesOffset = (graphBox.bottom - graphBox.top) / (YAxisPoints.length - 1);
        hLinesOffset = ((graphBox.right - 20) - (graphBox.left + 20)) / (XAxisPoints.length - 1);
        //  Горизонтальные линии и подписи к ним слева
        for (var i = 0, count =  YAxisPoints.length - 1; i < count; i++) {
            horizontalLines[i].attr({
                d: GetStringLine(graphBox.left, graphBox.top + i * vLinesOffset, graphBox.right, graphBox.top + i * vLinesOffset)
            });
            Centerized(horizontalCaptions[i], graphBox.left - 15, graphBox.top + i * vLinesOffset + 15);
        }
        //  Подпись снизу слева
        Centerized(XAxisCaption, graphBox.left - 15, graphBox.bottom + 24); 

        //  Подписи снизу
        for(var i = 0, count = verticalCaptions.node.childNodes.length; i < count; i++) {
            Centerized(verticalCaptions[i], graphBox.left + 20 + i * hLinesOffset, graphBox.bottom + 25);
        }

        transformPosition = function(X, Y) {
            var result = {x: 0, y: 0 };
            result.x = graphBox.left + 20 + X * hLinesOffset;
            result.y = graphBox.bottom - ((graphBox.bottom - graphBox.top) / (YAxisPoints[YAxisPoints.length - 1] - YAxisPoints[0]) * Y);
            return result;
        }
        //  Сами линии графика
        graphPoints.clear();
        for (var i = 0, count = graphLines.node.childNodes.length; i < count; i++) {
            var line = Lines[i];
            var points = [];
            for ( var p = 0; p < line.points.length; p++)
                points.push(transformPosition(p, line.points[p]));
            graphLines[i].attr({d: GetStringMultiline(points)});
            for ( var p = 0; p < points.length; p++) {
                var pg = Paper.circle(points[p].x, points[p].y, 4).attr(line.pointsAttributes);
                graphPoints.add(pg);
            }
        }

    }
}

function GetRandomPointOnWorld() {
    if (GetRandomPointOnWorld.Points == undefined) {
        GetRandomPointOnWorld.Points = [{ x:253, y:353, target: "US" },{ x:243, y:358, target: "US" },{ x:242, y:368, target: "US" },{ x:248, y:379, target: "US" },{ x:250, y:384, target: "US" },{ x:247, y:379, target: "US" },{ x:240, y:374, target: "US" },{ x:247, y:366, target: "US" },{ x:253, y:359, target: "US" },{ x:259, y:349, target: "US" },{ x:253, y:344, target: "US" },{ x:137, y:350, target: "US" },{ x:148, y:359, target: "US" },{ x:154, y:362, target: "US" },{ x:161, y:370, target: "US" },{ x:180, y:392, target: "MX" },{ x:154, y:367, target: "US" },{ x:153, y:372, target: "MX" },{ x:155, y:384, target: "MX" },{ x:158, y:384, target: "MX" },{ x:155, y:366, target: "US" },{ x:162, y:358, target: "US" },{ x:163, y:366, target: "US" },{ x:141, y:304, target: "CA" },{ x:141, y:310, target: "US" },{ x:124, y:300, target: "CA" },{ x:131, y:316, target: "US" },{ x:133, y:298, target: "CA" },{ x:140, y:308, target: "US" },{ x:145, y:302, target: "CA" },{ x:149, y:310, target: "US" },{ x:214, y:303, target: "CA" },{ x:210, y:295, target: "CA" },{ x:213, y:285, target: "CA" },{ x:217, y:293, target: "CA" },{ x:223, y:289, target: "CA" },{ x:221, y:304, target: "CA" },{ x:456, y:331, target: "ES" },{ x:467, y:332, target: "ES" },{ x:475, y:329, target: "FR" },{ x:476, y:319, target: "FR" },{ x:476, y:308, target: "FR" },{ x:485, y:302, target: "FR" },{ x:489, y:298, target: "BE" },{ x:492, y:306, target: "FR" },{ x:485, y:311, target: "FR" },{ x:481, y:319, target: "FR" },{ x:493, y:317, target: "FR" },{ x:495, y:304, target: "DE" },{ x:495, y:298, target: "DE" },{ x:472, y:290, target: "GB" },{ x:471, y:287, target: "GB" },{ x:468, y:283, target: "GB" },{ x:465, y:279, target: "GB" },{ x:465, y:273, target: "GB" },{ x:461, y:270, target: "GB" },{ x:458, y:283, target: "GB" },{ x:452, y:285, target: "IE" },{ x:454, y:289, target: "IE" },{ x:467, y:293, target: "GB" },{ x:471, y:294, target: "GB" },{ x:472, y:294, target: "GB" },{ x:475, y:293, target: "GB" },{ x:473, y:290, target: "GB" },{ x:472, y:287, target: "GB" },{ x:494, y:298, target: "DE" },{ x:494, y:306, target: "FR" },{ x:503, y:314, target: "AT" },{ x:501, y:294, target: "DE" },{ x:506, y:290, target: "DE" },{ x:512, y:298, target: "DE" },{ x:512, y:311, target: "AT" },{ x:511, y:327, target: "IT" },{ x:514, y:334, target: "IT" },{ x:519, y:342, target: "IT" },{ x:531, y:332, target: "" },{ x:523, y:321, target: "HR" },{ x:522, y:306, target: "CZ" },{ x:516, y:295, target: "DE" },{ x:523, y:290, target: "PL" },{ x:523, y:307, target: "CZ" },{ x:535, y:316, target: "HU" },{ x:535, y:304, target: "PL" },{ x:532, y:290, target: "PL" },{ x:540, y:282, target: "LT" },{ x:558, y:252, target: "RU" },{ x:558, y:248, target: "RU" },{ x:563, y:248, target: "RU" },{ x:563, y:251, target: "RU" },{ x:563, y:257, target: "RU" },{ x:558, y:260, target: "RU" },{ x:609, y:274, target: "RU" },{ x:592, y:282, target: "RU" },{ x:605, y:289, target: "RU" },{ x:607, y:278, target: "RU" },{ x:594, y:272, target: "RU" },{ x:600, y:266, target: "RU" },{ x:613, y:272, target: "RU" },{ x:616, y:279, target: "RU" },{ x:643, y:239, target: "RU" },{ x:665, y:268, target: "RU" },{ x:667, y:213, target: "RU" },{ x:696, y:213, target: "RU" },{ x:703, y:274, target: "RU" },{ x:730, y:235, target: "RU" },{ x:922, y:283, target: "RU" },{ x:850, y:359, target: "JP" },{ x:856, y:359, target: "JP" },{ x:860, y:357, target: "JP" },{ x:871, y:338, target: "JP" },{ x:870, y:332, target: "JP" },{ x:871, y:329, target: "JP" },{ x:872, y:329, target: "JP" },{ x:868, y:341, target: "JP" },{ x:921, y:277, target: "RU" },{ x:927, y:265, target: "RU" },{ x:930, y:260, target: "RU" },{ x:938, y:247, target: "RU" },{ x:948, y:244, target: "RU" },{ x:316, y:452, target: "SR" },{ x:311, y:447, target: "GY" },{ x:303, y:451, target: "VE" },{ x:306, y:452, target: "BR" },{ x:307, y:461, target: "BR" },{ x:327, y:464, target: "BR" },{ x:318, y:476, target: "BR" },{ x:305, y:473, target: "BR" },{ x:301, y:459, target: "BR" },{ x:295, y:447, target: "VE" },{ x:302, y:446, target: "VE" },{ x:320, y:457, target: "BR" },{ x:280, y:506, target: "" },{ x:286, y:514, target: "BO" },{ x:289, y:535, target: "AR" },{ x:289, y:535, target: "AR" },{ x:353, y:497, target: "BR" },{ x:345, y:494, target: "BR" },{ x:345, y:486, target: "BR" },{ x:350, y:480, target: "BR" },{ x:354, y:480, target: "BR" },{ x:359, y:487, target: "BR" },{ x:359, y:491, target: "BR" },{ x:358, y:499, target: "BR" },{ x:565, y:383, target: "EG" },{ x:560, y:378, target: "EG" },{ x:553, y:376, target: "EG" },{ x:544, y:380, target: "LY" },{ x:544, y:383, target: "LY" },{ x:544, y:388, target: "LY" },{ x:548, y:389, target: "" },{ x:556, y:392, target: "EG" },{ x:558, y:392, target: "EG" },{ x:510, y:316, target: "IT" },{ x:518, y:314, target: "AT" },{ x:527, y:323, target: "" },{ x:537, y:327, target: "RS" },{ x:506, y:293, target: "DE" },{ x:503, y:304, target: "DE" },{ x:557, y:380, target: "EG" },{ x:533, y:557, target: "ZA" },{ x:529, y:545, target: "NA" },{ x:537, y:555, target: "ZA" },{ x:546, y:552, target: "ZA" },{ x:553, y:548, target: "" },{ x:550, y:544, target: "ZA" },{ x:523, y:537, target: "NA" },{ x:550, y:552, target: "ZA" },{ x:556, y:541, target: "ZA" },{ x:595, y:392, target: "SA" },{ x:595, y:392, target: "SA" },{ x:600, y:385, target: "SA" },{ x:607, y:387, target: "SA" },{ x:609, y:396, target: "SA" },{ x:596, y:402, target: "SA" },{ x:739, y:242, target: "RU" },{ x:744, y:228, target: "RU" },{ x:748, y:223, target: "RU" },{ x:762, y:242, target: "RU" },{ x:730, y:238, target: "RU" },{ x:730, y:226, target: "RU" }];
    }
    var randomIndex = Math.floor(Math.random() * GetRandomPointOnWorld.Points.length);
    return GetRandomPointOnWorld.Points[randomIndex];
}

function GraphMap(Paper) {
    //  public
    this.Points = [];
    //  private
    var selfM = this;
    var scaleCount = 1;
    var translateX = 0;
    var translateY = 0;

    Snap.load("http://shaidulint.github.io/Day_21_Dashboard/content/worldmap.svg", function (f) {
        var g = f.select('g');
        Paper.append(g);
        var scaleCountX =  Paper.node.getBoundingClientRect().width / g.getBBox().width;
        var scaleCountY =  Paper.node.getBoundingClientRect().height / g.getBBox().height;
        scaleCount = Math.min(scaleCountX, scaleCountY);
        translateX = (Paper.node.getBoundingClientRect().width / 2) - (g.getBBox().width / 2) * scaleCount;
        translateY = (Paper.node.getBoundingClientRect().height / 2) - (g.getBBox().height / 2) * scaleCount;
        g.transform('scale(' + scaleCount + ') translate(' + translateX + ', ' + translateY + ')');
        //var selfA = this;
        this.dotsUpdateTimer = setInterval((function() {
            if (this.Points.length > 0) {
                var dot = this.Points.splice(0, 1)[0];
                dot.remove();
                if (this.Points.length > 1) {
                    this.Points[1].animate({ r: 0 }, 500);
                }
            }
            this.DrawRandomPoint();
        }).bind(this), 1000);
        
        for(var i = 0; i < 70; i++)
            this.DrawRandomPoint();
    }, selfM);

    this.DrawRandomPoint = function() {
            var randomPoint = GetRandomPointOnWorld();
            var p = {};
            p.x = (randomPoint.x + translateX) * scaleCount;
            p.y = (randomPoint.y + translateY) * scaleCount;
            var dot  = Paper.circle(p.x, p.y, 0).attr({
                fill: '#51B5F1'
            });
            var maxRadius = Math.random();
            if (maxRadius < 0.4)
                maxRadius = 1;
            else if (maxRadius < 0.7)
                maxRadius = 2;
            else if (maxRadius < 0.85)
                maxRadius = 3;
            else if (maxRadius < 0.95)
                maxRadius = 4;
            else
                maxRadius = 5;
            dot.animate({r: maxRadius}, 500);
            this.Points.push(dot);
    }
}