function AddListener(Element, EventType, Handler, Index) {
    Element.addEventListener(EventType, function(evt) { Handler(evt, Index); });
}

function STRImageSlider(DomID, Images, SlideShowTimer) {
    //  public
    
    //  private
    var self = this;
    self.domID = DomID;
    self.images = Images;
    self.container = document.getElementById(self.domID);
    self.image = null;
    self.currentImageIndex = -1;
    self.togglerContainer = null;
    self.slideShowTimer = (SlideShowTimer != undefined) ? SlideShowTimer : 0;
    
    function initialize() {
        createDomStructure();
    }
    
    function createDomStructure() {
        self.container.className = 'imgsld-container';
        
        //  Создаем контейнер для изображения
        var imageContainer = document.createElement('div');
        imageContainer.className = 'imgsld-imagecontainer';
        //  Добавляем само изображение
        var image = document.createElement('img');
        image.className = 'imgsld-image';
        imageContainer.appendChild(image);
        self.image = image;
        
        self.container.appendChild(imageContainer);
        
        var togglerContainer = document.createElement('div');
        togglerContainer.className = 'imgsld-togglercontainer';
        for (var i = 0; i < self.images.length; i++) {
            var togglerBtn = document.createElement('div');
            togglerBtn.className = 'imgsld-togglerbutton';
            AddListener(togglerBtn, 'click', togglerBtnOnClick, i);
            togglerContainer.appendChild(togglerBtn);
        }
        self.togglerContainer = togglerContainer;
        self.container.appendChild(togglerContainer); 
    }
    
    function togglerBtnOnClick(evt, index) {
        setImage(index);
    }
    
    function setImage(imageIndex) {
        if (self.currentImageIndex >= 0) {
             self.togglerContainer.childNodes[self.currentImageIndex].className = 'imgsld-togglerbutton';
        }
        self.currentImageIndex = imageIndex;
        self.togglerContainer.childNodes[imageIndex].className = 'imgsld-togglerbutton active';
        
        self.image.setAttribute('src', self.images[imageIndex]);
    }
    
    initialize();
    setImage(0);
    if (self.slideShowTimer > 0) {
        setInterval(function(params) {
            var index = (self.currentImageIndex === self.images.length - 1) ? 0 : self.currentImageIndex + 1;
            setImage(index);
        }, self.slideShowTimer * 1000);
    }
}








document.addEventListener('DOMContentLoaded', ready);
function ready(){
    var imgSlider = STRImageSlider('imageSlider', [
        "../Images/landscape_01.jpg",
        "../Images/landscape_02.jpg",
        "../Images/landscape_03.jpg",
        "../Images/landscape_04.jpg",
        "../Images/landscape_05.jpg"
    ], 3);
}