function GetGlobalLeft(Element){
    var currentElement = Element;
    var left = 0;
    while(currentElement.offsetParent){
        left += currentElement.offsetLeft;
        currentElement = currentElement.offsetParent;
    }
    return left;
}

function ready(){
    var submenu = document.getElementById('submenu');
    
    var pins = document.getElementsByClassName('pin');
    for(var i = 0; i < pins.length; i++){
        var pin = pins[i];
        pin.addEventListener('click', function(evt){
            var clickedPin = evt.target;
            var isActive = clickedPin.classList.contains('active');
            if (isActive){
                clickedPin.className = 'pin';
                submenu.style.display = 'none';

            } else {
                for(var i = 0; i < pins.length; i++){
                    if (pins[i] != clickedPin){
                        pins[i].className = 'pin';
                    }
                }
                clickedPin.className = 'pin active';
                submenu.style.display = 'block';
                var pinLeft = clickedPin.offsetLeft - 8;
                submenu.style.left = pinLeft + "px";
                var pinTop = clickedPin.offsetTop - 8;
                submenu.style.top = pinTop + "px";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", ready)