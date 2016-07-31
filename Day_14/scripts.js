/// <summary>Возвращает массив чисел в случайном порядке</summary>
function GenerateRandomArray(){
    var arr = [];
    for(var i = 0; i < 100; i++)
        arr[i] = i;
    var temp = 0;
    for(var i = 0; i < 100; i++){
        var y = Math.floor(Math.random() * 100);
        temp = arr[i];
        arr[i] = arr[y];
        arr[y] = temp;
    }
    return arr;
}

function CreateAction(First, Second){
    return { first: First, second: Second, change: false };
}

/// <summary>В массиве меняет местами значения</summary>
function Swap(Arr, FirstIndex, SecondIndex){
    var temp = Arr[FirstIndex];
    Arr[FirstIndex] = Arr[SecondIndex];
    Arr[SecondIndex] = temp;
}

/// <summary>Сортирует массив, возвращает массив действия. Тупая сортировка</summary>
function SortArrayGetSteps(SortingArray){
    var actions = [];
    for(var x = 0; x < SortingArray.length; x++){
        for(var y = x + 1; y < SortingArray.length; y++){
            var action = CreateAction(x, y);
            actions.push(action);
            if (SortingArray[x] > SortingArray[y]) {
                Swap(SortingArray, x, y);
                action.change = true;
            }
        }
    }
    return actions;
}

/// <summary>Сортировка пузырьком</summary>
function SortBubblesGetSteps(SortingArray){
    var actions = [];
    for(var i = 0; i < SortingArray.length - 1; i++){
        var swapped = false;
        for( var j = 0; j < SortingArray.length - i - 1; j++) {
            var action = CreateAction(j, j + 1);
            actions.push(action);
            if (SortingArray[j] > SortingArray[j+1]) {
                Swap(SortingArray, j, j+1);
                swapped = true;
                action.change = true;
            }
        }
        if (!swapped)
            break;
    }
    return actions;
}

/// <summary>Быстрая сортировка</summary>
function SortQuickGetSteps(SortingArray){
    var actions = [];
    
    var qsfunc = function(l, r){
        var i = l,
            j = r,
            x = SortingArray[l + r >> 1],
            x_index = l + r >> 1;
        while(i <= j){
            while(SortingArray[i] < x) {
                var action = CreateAction(i, x_index);
                actions.push(action);
                i++;
            }
            while(SortingArray[j] > x) {
                var action = CreateAction(j, x_index);
                actions.push(action);
                j--;
            }
            var action = CreateAction(i, j);
            actions.push(action);
            if (i <= j){
                action.change = true;
                Swap(SortingArray, i, j);
                i++;
                j--;
            }
        }
        if (l < j){
            qsfunc(l, j);
        }
        if (i < r){
            qsfunc(i, r);
        }
    }
    
    qsfunc(0, SortingArray.length - 1);
    
    return actions;
}
/// <summary>Блочная сортировка</summary>
function SortInsertsGetSteps(SortingArray){
    var actions = [];
    for(var i = 1; i < SortingArray.length; i++){
        var cur = SortingArray[i];
        var j = i;
        while(j > 0 && cur < SortingArray[j - 1]){
            var action = CreateAction(j, j-1);
            actions.push(action);
            action.change = true;
            SortingArray[j] = SortingArray[j - 1];
            j--;
        }
        var action = CreateAction(j, i);
        actions.push(action);
        action.change = true;
        SortingArray[j] = cur;
    }
    return actions;
}

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
/// <summary>Сортирует массив, возвращает массив действия</summary>
function GetColorForNumber(Number){ 
    var r = color.r + Number * color_diff.r;
    var g = color.g + Number * color_diff.g;
    var b = color.b + Number * color_diff.b;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
/// <summary>Выделяет прямоугольник желтой обводкой</summary>
function RectangleSelectFirst(Rectangle){
    Rectangle.attr({strokeWidth:2, stroke: 'yellow'});
}
/// <summary>Выделяет прямоугольник зеленой обводкой</summary>
function RectangleSelectSecond(Rectangle){
    Rectangle.attr({strokeWidth:2, stroke: 'green'});
}
/// <summary>Убирает выделение прямоугольника обводкой</summary>
function RectangleDeselect(Rectangle){
    Rectangle.attr({strokeWidth: 0 });
}
/// <summary> Инициализация отображаемого массива </summary>
function FirstDrawArray(Paper, Arr, Y){
    var rects = [];
    for(var i = 0; i < 100; i++) {
        var r = Paper.rect(50 + i * 9, Y, 9, 20, 0, 0);
        var c = GetColorForNumber(Arr[i]);
        r.attr({
            fill: c
        })
        
        rects.push({
            value: Arr[i],
            rect: r
        });
    }
    return rects;
}
/// <summary> Ставит и Убирает выделение с прямоугольников, меняет их местами </summary>
function VisualizeStep(Steps, StepNumber, Rects){
    //  Убираем пред. выделение
    if (StepNumber > 0) {
        RectangleDeselect(Rects[Steps[StepNumber - 1].first].rect);
        RectangleDeselect(Rects[Steps[StepNumber - 1].second].rect);
    }
    var step = Steps[StepNumber];
    RectangleSelectFirst(Rects[step.first].rect);
    RectangleSelectSecond(Rects[step.second].rect);
    if (step.change){
        var temp = Rects[step.first];
        Rects[step.first] = Rects[step.second];
        Rects[step.second] = temp;
        
        Rects[step.first].rect.attr({
            x: 50 + step.first * 9
        })
        Rects[step.second].rect.attr({
            x: 50 + step.second * 9
        })
    }
}
/// <summary> Анимация сортировки, с шагом в 10 мсек </summary>
function AnimationSorting(Rects, Steps) {
    var stepNumber = 0;
    var timer = setInterval(function(){
        VisualizeStep(Steps, stepNumber, Rects);
        stepNumber++;
        if (stepNumber == Steps.length){
            clearInterval(timer);
            RectangleDeselect(Rects[Steps[Steps.length - 1].first].rect);
            RectangleDeselect(Rects[Steps[Steps.length - 1].second].rect);
        }
    }, 10);
}
/// <summary> Отрисовка заголовка и кол-во сравнений </summary>
function DrawTitleAndCountSteps(Paper, Y, Title, CountSteps){
    var t = Paper.text(60, Y - 15, Title);
    t.attr({
        "font-size": "20px",
        "font-family": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    });
    var c = Paper.text(750, Y - 15, "Кол-во сравнений: " + CountSteps);
    c.attr({
        "font-size": "16px",
        "font-family": "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    });
}

window.onload = function(){
    var arr = GenerateRandomArray();
    
    var stepsFirst = SortArrayGetSteps(arr.slice());  
    var stepsSecond = SortBubblesGetSteps(arr.slice());
    var stepsThree = SortQuickGetSteps(arr.slice());

    var paper = Snap('#cvs');
    
    var rectsFirst = FirstDrawArray(paper, arr, 100);
    var rectsSecond = FirstDrawArray(paper, arr, 200);
    var rectsThree = FirstDrawArray(paper, arr, 300);
    
    DrawTitleAndCountSteps(paper, 100, "Простая сортировка", stepsFirst.length);
    DrawTitleAndCountSteps(paper, 200, "Cортировка пузырьком", stepsSecond.length);
    DrawTitleAndCountSteps(paper, 300, "Быстрая сортировка", stepsThree.length);
    
    AnimationSorting(rectsFirst, stepsFirst);
    AnimationSorting(rectsSecond, stepsSecond);
    AnimationSorting(rectsThree, stepsThree);
}