var pathRect = new PathRectangle(10, 16, 25);

var svgrect = null;


window.onload = function(){

    function SvgDraw(){
        var paper = Snap("#boxSvg");

        var shadow = paper.filter(Snap.filter.shadow(0, 2, 3));

        svgrect = paper.path(pathRect.strPathNormal);
        svgrect.attr({
            fill: "#232D39",
            stroke: "#27D3BD",
            strokeWidth: 2,
            filter: shadow
        });
    }
    
    SvgDraw();
    
    var dragController = new DragController();
    var box = new Draggable('box', dragController);
    
    box.OnStartMotion = function(evt){
        
    }
    box.OnFinishMotion = function(evt){
        svgrect.animate({
            d: pathRect.strPathNormal
        }, 1000, mina.elastic);
    }
    box.OnMotion = function(evt){
        svgrect.animate({
            d: pathRect.GetPathStringElastic(box.Speed.x, box.Speed.y)
        }, 1000, mina.elastic);
    }
    


}

function DragController(){
    var self = this;
    
    //  private
    var selectedElement = null;
    //  public methods
    self.GetSelectedElement = function(){
        return selectedElement;
    }
    self.SetSelectedElement = function(Element){
        if (selectedElement != null){
            selectedElement.Unselect();
        }
        selectedElement = Element;
    }
    self.ClearSelectedElement = function(){
        if (selectedElement != null)
            selectedElement.Unselect();
        selectedElement = null;
    }
    //  document event connect
    document.onmouseup = function(evt){
        self.ClearSelectedElement();
    }
    document.onmousemove = function(evt){
        if (selectedElement != null){
            selectedElement.Move(evt);
        }
    }
}

function Draggable(DomID, Controller){
    
    var self = this;
    //  public
    self.DomID = DomID;
    self.Element = document.getElementById(self.DomID);
    self._mouseOffset = { x: 0, y: 0 };
    self._mousePosition = { x: 0, y: 0 };
    self.Speed = { x: 0, y: 0 };
    self.Controller = Controller;
    
    //  public methods
    self.OnStartMotion = function(evt) { };
    self.OnMotion = function(evt) { };
    self.OnFinishMotion = function(evt) { };
    
    self.Element.onmousedown = function(evt){
        self._mouseOffset.x = evt.x - self.Element.offsetLeft;
        self._mouseOffset.y = evt.y - self.Element.offsetTop;
        self._mousePosition.x = evt.x;
        self._mousePosition.y = evt.y;
        self.Controller.SetSelectedElement(self);
        self.OnStartMotion(evt);
    }
    
    self.Move = function(evt){
        self.Speed.x = evt.x - self._mousePosition.x;
        self.Speed.y = evt.y - self._mousePosition.y;

        self._mousePosition.x = evt.x;
        self._mousePosition.y = evt.y;
        self.Element.style.left = ( evt.x - self._mouseOffset.x ) + "px";
        self.Element.style.top = ( evt.y - self._mouseOffset.y ) + "px";
        //console.log('Move: Speed:( ' + self.Speed.x + ", " + self.Speed.y + " )");
        self.OnMotion(evt);
    }
    
    self.Unselect = function(){
        self.OnFinishMotion();
    }
    
}

function PathRectangle(CountH, CountV, Interval){
    var self = this;
    //  public
    self.strPathNormal = "";
    //  private
    var points = [];
    //  public methods
    self.GetPathStringElastic = function(SpeedX, SpeedY){
        var pointsOnMotion = [];
        for(var i = 0; i < points.length; i++){
            if (points[i].ElasticRate > 0){
                pointsOnMotion[i] = { x: 0, y: 0 };
                pointsOnMotion[i].x = points[i].x + SpeedX * -1 * points[i].ElasticRate;
                pointsOnMotion[i].y = points[i].y + SpeedY * -1 * points[i].ElasticRate;
            } else {
                pointsOnMotion[i] = {x: points[i].x, y: points[i].y };
            }
        }
        return getPathString(pointsOnMotion);
    }
    //  private methods
    var getPointsArray = function(CountH, CountV, Interval){
        var arr = [];
        for(var i = 0; i < CountH; i++)
            arr.push(getPoint(i, 0, Interval, i, CountH));
        for(var i = 0; i < CountV; i++)
            arr.push(getPoint(CountH, i, Interval, i, CountV));
        for(var i = CountH; i >= 0; i--)
            arr.push(getPoint(i, CountV, Interval, i, CountH));
        for(var i = CountV - 1; i > 0; i--)
            arr.push(getPoint(0, i, Interval, i, CountV));
        return arr;
    }   
    var getPoint = function(x, y, Inteval, NumberOnSide, Length){
        var point = {
            x: x * Interval,
            y: y * Interval,
            ElasticRate: getElasticRate(Math.min(NumberOnSide, Length - NumberOnSide))
        }
        return point;
    }
    var getElasticRate = function(MinIndexOnCorner){
        switch(MinIndexOnCorner){
            case 0: return 1.8;
            case 1: return 1.25;
            case 2: return 0.85;
            case 3: return 0.45;
            case 4: return 0.15;
            default: return 0;
        }
    }
    var getPathString = function(Points){
        var str = "";
        str += "M" + Points[0].x + "," + Points[0].y + " ";
        for(var i = 1; i < Points.length; i++){
            str += "L" + Points[i].x + "," + Points[i].y + " ";
        }
        str += "Z";
        return str;
    }
    
    //  init
    points = getPointsArray(CountH, CountV, Interval);
    self.strPathNormal = getPathString(points);
}