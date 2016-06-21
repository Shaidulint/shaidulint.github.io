function ready(){
    //  BLOCK: IMPACT
    var graph_impact = Snap("#impact-graph");


    var donuts = new GraphFiveDonuts(graph_impact, [
        {
            Percentage: 100,
            OuterColor: '#51B5F1',
            InnerColor: '#3D97CC',
            ImageUrl: 'content/icon_twitter.png',
            SecondText: '+23%'
        },
        {
            Percentage: 60,
            OuterColor: '#1E5CE5',
            InnerColor: '#1A4DC0',
            ImageUrl: 'content/icon_facebook.png',
            SecondText: '+6%'
        },
        {
            Percentage: 26,
            OuterColor: '#10E39C',
            InnerColor: '#05BF80',
            ImageUrl: 'content/icon_instagram.png',
            SecondText: '+2%'
        },
        {
            Percentage: 71,
            OuterColor: '#FE6700',
            InnerColor: '#D74E00',
            ImageUrl: 'content/icon_pinterest.png',
            SecondText: '+17%'
        },
        {
            Percentage: 80,
            OuterColor: '#D11013',
            InnerColor: '#AD0101',
            ImageUrl: 'content/icon_youtube.png',
            SecondText: '+11%'
        }
    ]);
    //var g1 = new GraphOneDonut(80, 100, 75, graph_impact, 100, '#51B5F1', '#3D97CC', 'content/icon_twitter.png', '+23%');
    //var g2 = new GraphOneDonut(265, 100, 75, graph_impact, 60, '#1E5CE5', '#1A4DC0', 'content/icon_facebook.png', '+6%');
    //var g3 = new GraphOneDonut(450, 100, 75, graph_impact, 26, '#10E39C', '#05BF80', 'content/icon_instagram.png', '+2%');
    //var g4 = new GraphOneDonut(635, 100, 75, graph_impact, 71, '#FE6700', '#D74E00', 'content/icon_pinterest.png', '+17%');
    //var g5 = new GraphOneDonut(820, 100, 75, graph_impact, 80, '#D11013', '#AD0101', 'content/icon_youtube.png', '+11%');
    
    //  BLOCK: TRENDLINE
    var graph_trendline = Snap('#trendline-graph');

    var g_trend = new GraphTrendline( graph_trendline,
        'June',
        ['05', '06', '07', '08', '09', '10', '11'],
        [0, 200, 400, 600],
        [{
            points: [250, 235, 205, 430, 550, 420, 460],
            lineAttributes: {
                stroke: "#51B5F1",
                strokeWidth: 2,
                fill: "transparent"
            },
            pointsAttributes: {
                stroke: "#51B5F1",
                strokeWidth: 2,
                fill: "#ECEDE8"
            }
        }, {
            points: [60, 200, 300, 310, 450, 360, 380],
            lineAttributes: {
                stroke: "#95958E",
                strokeWidth: 2,
                fill: "transparent",
                'stroke-dasharray': "2,2"
            },
            pointsAttributes: {
                stroke: "#95958E",
                strokeWidth: 2,
                fill: "#ECEDE8"
            }
        }]
    );

    var graph_map = Snap('#map-graph');
    var g_map = new GraphMap(graph_map);

    setInterval(function(){
        var queue = document.getElementsByClassName('footer__queue');
        if (queue.length > 0) {
            queue = queue[0];
            var firstHashtag = queue.children[0];
            //if (firstHashtag.className.indexOf('anim-drop') > 0) {
            if (firstHashtag.style.marginLeft.indexOf('px') > 0) { //className.indexOf('anim-drop') > 0) {
                queue.appendChild(firstHashtag);
                //firstHashtag.className = 'footer__hashtag';
                firstHashtag.style.marginLeft = '';
            }
            //queue.children[0].className += ' anim-drop';
            var width = queue.children[0].offsetWidth;
            queue.children[0].style="margin-left: -" + width + "px;";
        }
    }, 5000);

    window.addEventListener('resize', (function(args, evt){
        args[0].Resize();
        args[1].Resize();
        var i = 15 + 15;
    }).bind(this, [donuts, g_trend]));
}


document.addEventListener('DOMContentLoaded', ready);