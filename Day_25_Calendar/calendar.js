(function($) {

    /**
     * Возвращает день недели первого числа, 0 - воскресенье
     */
    var calcDayOfWeekForDate = function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }

    /**
     * Возвращает кол-во дней в месяце
     */
    var calcDaysInMonth = function(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    /**
     * Создает строку для календаря
     * @param {element} container Элемент-контейнер для строки
     * @param {boolean} isHeader Если истина, добавит классы для заголовка таблицы
     */
    var createRow = function(container, isHeader) {
        var rowClass = (isHeader) ? 'calendar__row calendar__row--header' : 'calendar__row';
        var row = $('<div>', {
            'class': rowClass
        });
        var rowContent = $('<div>', {
            'class': 'calendar__row-content clearfix'
        });
        row.append(rowContent).appendTo(container);
        return rowContent;
    }

    /**
     * Создает ячейки для заголовка календаря (7 шт)
     * @param {element} rowContentEl Элемент-контейнер (строка) для ячеек
     */
    var createHeaderCells = function(rowContentEl) {
        var dayOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС' ];
        for(var i = 0, count = dayOfWeek.length; i < count; i++) {
            var cellClass = (i < 5) ? 'calendar__cell calendar__cell--header' : 'calendar__cell calendar__cell--header calendar__cell--weekend';
            rowContentEl.append($('<div>', {
                'class': cellClass,
                'text': dayOfWeek[i]
            }));
        }
    }

    /**
     * Создает ячейки для тела календаря (7 шт)
     * @param {element} rowContentEl Элемент-контейнер (строка) для ячеек
     */
    var createBodyCells = function(rowContentEl) {
        var cells = [];
        for(var i = 0, count = 7; i < count; i++) {
            var cellClass = (i < 5) ? 'calendar__cell calendar__cell--body' : 'calendar__cell calendar__cell--body calendar__cell--weekend';
            var cell = $('<div>', {
                'class': cellClass
            }).appendTo(rowContentEl);
            $('<span>', {
                'class': 'calendar__day-of-month',
            }).appendTo(cell);
            $('<span>', {
                'class': 'calendar__icons-line'
            }).appendTo(cell);
            $('<span>', {
                'class': 'calendar__day-info'
            }).appendTo(cell);
            cells.push(cell);
        }
        return cells;
    }

    /**
     * Создание все элементов календаря
     * @param {element} container Элемент-контейнер для календаря
     */
    var createElements = function(container) {

        var elements = {};
        elements.container = $(container);
        elements.headerRow = null;
        elements.rows = [];
        elements.cells = [];

        container.classList.add('calendar');

        var headerRow = createRow(container, true);
        createHeaderCells(headerRow);
        elements.headerRow = headerRow;

        for(var i = 0, count = 6; i < count; i++) {
            var row = createRow(container, false);
            elements.rows.push(row);
            var cells = createBodyCells(row);
            elements.cells = elements.cells.concat(cells);
        }
        
        return elements;
    }

    /**
     * Парсит входные данные, разбивая их по годам, месяцам и дням
     */
    var parseCalendarData = function(data) {
        var result = {};

        for(var i in data) {
            var item = data[i];
            var currentItemDate = new Date(item.date);



            var itemResult = {
                original: item,
                date: currentItemDate,
                type: item.type,
                text: item.text,
                time: (currentItemDate + "").match(/\d{2}:\d{2}/ig)[0]
            }

            var year = itemResult.date.getFullYear();
            var month = itemResult.date.getMonth();
            var day = itemResult.date.getDate();

            if (!result[year])
                result[year] = {};
            if (!result[year][month])
                result[year][month] = {};
            if (!result[year][month][day])
                result[year][month][day] = [];
            result[year][month][day].push(itemResult);
        }
        return result;
    }

    var createPopup = function() {
        var popupContainer = $('<div>', {
            'class': 'calendar-popup',
            'style': 'display:none;'
        })
        var title = $('<span>', {
            'class': 'calendar-popup__title',
            'text': 'События'
        }).appendTo(popupContainer);

        var verticalLine = $('<span>', {
            'class': 'calendar-popup__line'
        }).appendTo(popupContainer);

        var contentBlock = $('<div>', {
            'class': 'calendar-popup__content'
        }).appendTo(popupContainer);

        $(document.body).append(popupContainer);

        return {
            container: popupContainer,
            title: title,
            content: contentBlock
        }
    }



    var calendar = function(container, data) {

        var elements = createElements(container);
        var calendarData = parseCalendarData(data);
        var popupElements = createPopup();


        var selectedCell = null;
        var datesCellArray = [];
        
        var onCellClick = function(evt) {
            if (selectedCell !== null)
                selectedCell.removeClass('calendar__cell--selected');
            if ((selectedCell !== null) && (selectedCell[0] === this)) {
                selectedCell = null;
                return;
            }

            selectedCell = $(this);
            selectedCell.addClass('calendar__cell--selected');
            $(document).on('mouseup', onDocumentClick);

            var offset = selectedCell.offset();

            var calendarWidth = elements.container.width();
            var cellCenterX = offset.left + selectedCell.width();
            var popupLeft = 0;
            if (cellCenterX < calendarWidth/2)
                popupLeft = offset.left + selectedCell.width() + 50;
            else 
                popupLeft = offset.left - 400 - 50;

            popupElements.container.css('display', '');
            popupElements.container.css('left', (popupLeft) + "px");
            popupElements.container.css('top', (offset.top - 50) + "px");

            var cellIndex = selectedCell.index() + (selectedCell.parent().parent().index() - 1) * 7;
            var cellDateInfo = datesCellArray[cellIndex];
            popupElements.content.empty();
            if ((calendarData[cellDateInfo.year]) && (calendarData[cellDateInfo.year][cellDateInfo.month]) && (calendarData[cellDateInfo.year][cellDateInfo.month][cellDateInfo.day])) {
                var dayEvents = calendarData[cellDateInfo.year][cellDateInfo.month][cellDateInfo.day];
                for(var i in dayEvents) {
                    var eventContainer = $('<div class="calendar-popup__event-container">');
                    if (dayEvents[i].type === 0) {
                        eventContainer.addClass('calendar-popup__event-container--scheduler');
                    } else if (dayEvents[i].type === 1) {
                        eventContainer.addClass('calendar-popup__event-container--task');
                    }


                    var eventBlock = $('<div class="calendar-popup__event">').appendTo(eventContainer);
                    var eventTime = $('<span>', {
                        'class': 'calendar-popup__event-time',
                        'text': dayEvents[i].time
                    }).appendTo(eventBlock);
                    var eventMessage = $('<p>', {
                        'class': 'calendar-popup__event-message',
                        'text': dayEvents[i].text
                    }).appendTo(eventBlock);
                    popupElements.content.append(eventContainer);
                }
            } else {
                var noEvents = $('<div>', {
                    'class': 'calendar-popup__no-event',
                    'text': 'Нет событий'
                }).appendTo(popupElements.content);
            }
            
        }
        elements.container.find('.calendar__cell.calendar__cell--body').click(onCellClick);

        var onDocumentClick = function(evt) {
            var popupContainer = popupElements.container[0];
            if (!$.contains(popupContainer, evt.target) && !popupElements.container.is(evt.target)) {
                $(this).off('mouseup', onDocumentClick);
                popupElements.container.css('display', 'none');
            }
        }

        var updateMonth = function(date) {
            datesCellArray = [];

            date.setDate(1);
            var countDaysInMonth = calcDaysInMonth(date);
            var firstDayCode = calcDayOfWeekForDate(date);
            var firstDayIndex = (firstDayCode > 0) ? firstDayCode - 1: 6;
            var firstDayInCalendar = new Date(date);
            firstDayInCalendar.setDate(firstDayInCalendar.getDate() - firstDayIndex);
            var countDaysInCalendar = ((countDaysInMonth + firstDayIndex) < 36) ? 35 : 42;

            var cells = elements.cells;
            for(var i = 0; i < countDaysInCalendar; i++ ) {
                var cellDay = new Date(firstDayInCalendar);
                cellDay.setDate(cellDay.getDate() + i);

                var cell = cells[i];

                if ((i < firstDayIndex) || (i >= firstDayIndex + countDaysInMonth))
                    cell.addClass('calendar__cell--other-month');

                cell.children('.calendar__day-of-month').text(cellDay.getDate());

                var year = cellDay.getFullYear();
                var month = cellDay.getMonth();
                var day = cellDay.getDate();
                datesCellArray.push({
                    day: day,
                    month: month,
                    year: year
                });
                if ((calendarData[year]) && (calendarData[year][month]) && (calendarData[year][month][day])) {
                    var dayEvents = calendarData[year][month][day];
                    var taskCount = 0;
                    var schedulerCount = 0;
                    dayEvents.forEach(function(item, i, arr) {
                        if (item.type === 0) {
                            cell.children('.calendar__icons-line').append($('<span class="calendar__icon calendar__icon--scheduler"></span>'));
                            taskCount++;
                        }
                        else if (item.type === 1) {
                            cell.children('.calendar__icons-line').append($('<span class="calendar__icon calendar__icon--task"></span>'));
                            schedulerCount++;
                        }
                    });
                    var descTextArr = [];
                    if (taskCount > 0)
                        descTextArr.push((taskCount === 1) ? "1 задача" : taskCount + " задач");
                    if (schedulerCount > 0)
                        descTextArr.push((schedulerCount === 1) ? "1 расписание" : schedulerCount + " расписаний");
                    if (descTextArr.length > 0)
                        cell.children('.calendar__day-info').text(descTextArr.join(' и '));
                }
            }

            if (countDaysInCalendar === 35)
                elements.rows[5].parent().hide();
            else
                elements.row[5].parent().show();

        }

        updateMonth(new Date(2016, 11, 14));

        return {

        }
    }



    $.widget('custom.strCalendar', {
        options: {
            data: []
        },
        _create: function() {
            var c = calendar(this.element[0], this.options.data);
        },
        destroy: function() {
            debugger;
        }
    });

})(jQuery);