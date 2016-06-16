function ready(){
    //  BLOCK: IMPACT
    var graph_impact = Snap("#impact-graph");

    var g1 = GraphDonut(80, 100, 75, graph_impact, 100, '#51B5F1', '#3D97CC', 'content/icon_twitter.png', '+23%');
    var g2 = GraphDonut(265, 100, 75, graph_impact, 60, '#1E5CE5', '#1A4DC0', 'content/icon_facebook.png', '+6%');
    var g3 = GraphDonut(450, 100, 75, graph_impact, 26, '#10E39C', '#05BF80', 'content/icon_instagram.png', '+2%');
    var g4 = GraphDonut(635, 100, 75, graph_impact, 71, '#FE6700', '#D74E00', 'content/icon_pinterest.png', '+17%');
    var g5 = GraphDonut(820, 100, 75, graph_impact, 80, '#D11013', '#AD0101', 'content/icon_youtube.png', '+11%');
    
    //  BLOCK: TRENDLINE
    var graph_trendline = Snap('#trendline-graph');

    var g_trend = GraphTrendline( graph_trendline,
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
}


document.addEventListener('DOMContentLoaded', ready);