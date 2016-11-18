var carousel = function(elIdCtrls, elIdScroller, ItemWidth) {
    var elControlsContainer = document.getElementById(elIdCtrls),
        elScroller = document.getElementById(elIdScroller),
        currentActive = 0,
        canChange = true,
        skipAutoplay = false,
        itemWidth = ItemWidth || 800;
    
    /// Изменение активного элемента
    var changeActive = function(nextActive) {
        if (!canChange)
            return;

        canChange = false;

        elControlsContainer.children[currentActive].classList.remove('active');
        elControlsContainer.children[nextActive].classList.add('active');

        elScroller.style.marginLeft = ( -1 * itemWidth * nextActive ) + "px";
        
        var min = Math.min(currentActive, nextActive);
        var max = (min === currentActive) ? nextActive : currentActive;
        for(var i = min; i <= max; i++) {
            effect.show(elScroller.children[i]);
        }

        var finishChange = function() {
            currentActive = nextActive;
            if (min === nextActive)
                min++;
            else
                max--;
            for(var i = min; i <= max; i++) {
                effect.hide(elScroller.children[i]);
            }
            canChange = true;
        }

        setTimeout(finishChange, 500);
    }

    /// Привязка событий нажатий
    var controlsAttachEvents = function() {
        for( var i = 0, count = elControlsContainer.children.length; i < count; i++) {
            (function(number) {
                var control = elControlsContainer.children[i];
                control.addEventListener('click', function(evt) {
                    evt.stopPropagation();
                    skipAutoplay = true;
                    changeActive(number);
                });
            })(i);
        }
    };

    /// Действия автоматического слайд-шоу
    var slideShowStep = function() {
        if (skipAutoplay) {
            skipAutoplay = false;
            return;
        }

        var next = currentActive + 1;
        if (next >= elScroller.children.length)
            next = 0;
        changeActive(next);
    }

    controlsAttachEvents();

    return {
        setSlideShow: function(timerMs) {
            setInterval(slideShowStep, timerMs);
        }
    }
}

var photoViewer = function(elIdViewer, photoUrlArray) {
    var elContainer = document.getElementById(elIdViewer),
        elImage = elContainer.getElementsByClassName('photo-viewer__image')[0],
        elPreviousBtn = elContainer.getElementsByClassName('photo-viewer__btn--previous')[0],
        elNextBtn = elContainer.getElementsByClassName('photo-viewer__btn--next')[0],
        elMessageBox = elContainer.getElementsByClassName('photo-viewer_message')[0],
        currentPhotoNumber = 0,
        maxWidth = 800,
        maxHeight = 600,
        isViewerShowed = false,
        photoUrls = photoUrlArray;

    elContainer.addEventListener('click', function(evt) {
        if (evt.target === evt.currentTarget) {
            hide();
            evt.stopPropagation();
        }
    });

    elPreviousBtn.addEventListener('click', function(evt) {
        previousPhoto();
    });

    elNextBtn.addEventListener('click', function(evt) {
        nextPhoto();
    });

    document.body.addEventListener('keydown', function(evt) {
        if (isViewerShowed) {
            if (evt.keyCode === 37)
                previousPhoto();
            else if (evt.keyCode === 39)
                nextPhoto();
        }
    });

    var hide = function() {
        elContainer.style.display = "none";
        isViewerShowed = false;
    };

    var show = function() {
        elContainer.style.display = "block";
        isViewerShowed = true;
    };

    var previousPhoto = function() {
        currentPhotoNumber--;
        if (currentPhotoNumber < 0)
            currentPhotoNumber = photoUrls.length - 1;
        photoLoad(photoUrls[currentPhotoNumber]);
    }

    var nextPhoto = function() {
        currentPhotoNumber++;
        if (currentPhotoNumber >= photoUrls.length)
            currentPhotoNumber = 0;
        photoLoad(photoUrls[currentPhotoNumber]);
    }

    var calculateWidthHeight = function(imgWidth, imgHeight) {
        var resultWidth = imgWidth;
        var resultHeight = imgHeight;

        var isWidthGreater = (imgWidth > imgHeight);
        if (isWidthGreater) {
            if (imgWidth > maxWidth) {
                resultWidth = maxWidth;
                resultHeight = resultWidth * (imgHeight / imgWidth);
            }
        } else {
            if (imgHeight > maxHeight) {
                resultHeight = maxHeight;
                resultWidth = resultHeight * (imgWidth / imgHeight);
            }
        }
        return { w: resultWidth, h: resultHeight };
    }

    var clear = function() {
        elImage.style.backgroundSize = "";
        elImage.style.backgroundImage = "";
        elMessageBox.style.display = "";
    }

    var showMessage = function(text) {
        elMessageBox.style.display = "block";
        elMessageBox.textContent = text;
    }

    var photoLoad = function(url) {
        clear();
        var img = new Image();

        img.onload = function() {
            var size = calculateWidthHeight(img.width, img.height);

            elImage.style.width = size.w + 'px';
            elImage.style.height = size.h + 'px';
            elImage.style.backgroundImage = 'url(' + url + ')';
            elImage.style.backgroundSize = "100%";
        }

        img.onerror = function() {
            showMessage("Не удалось загрузить изображение: " + url);
        }

        img.src = url;
    }

    return {
        show: function(imageNumber) {
            if (typeof imageNumber !== "number")
                imageNumber = 0;
            if (imageNumber < 0)
                imageNumber = 0;
            if (imageNumber >= photoUrls.length)
                imageNumber = photoUrls.length - 1;
            currentPhotoNumber = imageNumber;
            show();
            photoLoad(photoUrls[imageNumber]);
        }
    };
}

var blocksToggler = function(radioboxes, blocksContainer) {
    Array.prototype.forEach.call(radioboxes, function(radiobox) {
        radiobox.addEventListener('change', function(evt) {
            for(var i = 0, count = blocksContainer.children.length; i < count; i++) {
                if (i === this.value - 0) {
                    //blocksContainer.children[i].classList.remove('hidden');
                    effect.show(blocksContainer.children[i]);
                } else {
                    //blocksContainer.children[i].classList.add('hidden');
                    effect.hide(blocksContainer.children[i]);
                }
            }
        });
    });
}

var effect = {
    hide: function(element) {
        element.classList.add('hidden');
        setTimeout(function(){
            element.classList.add('content-hidden');
        }, 500);
    },
    show: function(element) {
        element.classList.remove('content-hidden');
        element.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', function(evt) {

    //  Форма Find Driving Courses

    var carTypeSelect = document.getElementById('car-type-input');
    var carTypeDecorationBlocks = document.getElementsByClassName('find-courses__car-type');
    carTypeSelect.addEventListener('change', function (evt) {
        var selectedValue = carTypeSelect.value;
        for(var i = 0, count = carTypeDecorationBlocks.length; i < count; i++) {
            if (i != selectedValue) {
                carTypeDecorationBlocks[i].classList.remove('find-courses__car-type--active');
            } else {
                carTypeDecorationBlocks[i].classList.add('find-courses__car-type--active');
            }
        }
    });

    //  Сектор Reviews

    carousel('reviews__users', 'reviews__boxes-scroller').setSlideShow(5000);

    //  Сектор Gallery

    carousel('gallery__buttons', 'gallery__boxes-scroller', 1000);

    //  Сектор Gallery

    var photos = [
        "content/gallery/auto_1.jpg",
        "content/gallery/auto_2.jpg",
        "content/gallery/auto_3.jpg",
        "content/gallery/auto_4.jpg",
        "content/gallery/auto_5.jpg",
        "content/gallery/auto_6.jpg",
        "content/gallery/auto_7.jpg",
        "content/gallery/auto_8.jpg",
        "content/gallery/autodrom_1.jpg",
        "content/gallery/autodrom_2.jpg",
        "content/gallery/autodrom_3.jpg",
        "content/gallery/autodrom_4.jpg",
        "content/gallery/autodrom_5.jpg",
        "content/gallery/autodrom_6.jpg",
        "content/gallery/autodrom_7.jpeg",
        "content/gallery/autodrom_8.jpg",
        "content/gallery/classroom_1.jpg",
        "content/gallery/classroom_2.jpg",
        "content/gallery/classroom_3.jpg",
        "content/gallery/classroom_4.jpg",
        "content/gallery/classroom_5.jpg",
        "content/gallery/classroom_6.jpg",
        "content/gallery/classroom_7.jpg",
        "content/gallery/classroom_8.jpg"
    ]

    var pViewer = photoViewer('photo-viewer', photos);

    var galleryPreviewImages = document.getElementsByClassName('gallery__preview');
    [].forEach.call(galleryPreviewImages, function(prevImg, index) {
        prevImg.addEventListener('click', function(evt) {
            pViewer.show(index);
        });
    });

    // Секция Video

    var videoCap = document.getElementById('video__cap');
    videoCap.addEventListener('click', function(evt) {
        var video = document.getElementById('video');
        videoCap.style.display = "none";
        video.style.display = "block";
        video.src += "?autoplay=1";
        evt.stopPropagation();
    });

    //  Секция Instructors

    carousel('instructors__buttons', 'instructors__boxes-scroller', 1000);


    var instructorsTheory = document.getElementsByClassName('instructors__people--theory')[0];
    var rbInstructorsTheory = document.querySelectorAll('input[name="instructors-theory"]');

    blocksToggler(rbInstructorsTheory, instructorsTheory);

    var instructorsPractice = document.getElementsByClassName('instructors__people--practice')[0];
    var rbInstructorsPractice = document.querySelectorAll('input[name="instructors-practice"]');

    blocksToggler(rbInstructorsPractice, instructorsPractice);

    //  Секция Map

    var map;

    DG.then(function(){
        map = DG.map('map', {
            center: [59.9955, 30.336],
            zoom: 16,
            fullscreenControl: false,
            zoomControl: false
        });

        DG.marker([59.9958, 30.3302]).addTo(map).bindPopup('Мы находимся здесь!<br\>Большой Сампсониевский пр-т, 108');
    });
})