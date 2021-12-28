const today1 = new Date();
const today2 = new Date();

let locale = 'pl-PL';

const languageSelectWrapper = document.querySelector('section.language-select');
const languageSelect = document.getElementById('language-select');

const currentDate1 = document.getElementById('current-date-1');
const currentDate2 = document.getElementById('current-date-2');

const today = document.getElementById('today');
const clock = document.getElementById('clock');

const calendarSectionWrapper = document.querySelector('section.calendar-section-wrapper');

const previousDaysSelect = document.getElementById('previous-days');
const upcomingDaysSelect = document.getElementById('upcoming-days');

const previousDaysInputWrapper = document.getElementById('previous-days-input-wrapper');
const upcomingDaysInputWrapper = document.getElementById('upcoming-days-input-wrapper');

const previousDaysInput = document.getElementById('previous-days-input');
const upcomingDaysInput = document.getElementById('upcoming-days-input');

const previousDayslabel = document.getElementById('previous-days-label');
const upcomiongDaysLabel = document.getElementById('upcoming-days-label');

const refreshBtn = document.querySelector('button.refresh');

const previousDaysDefault = 7;
const upcomingDaysDefault = 7;

let calendar;

let calendarClockTimerID;

init();

function init() {
    initLanguageSelect();
    setCurrentDate1();
    setCurrentDate2();
    setToday();
    setTime(clock);
    scheduleClockUpdate(clock);
    initCalendar();
}

function initLanguageSelect() {
    languageSelectWrapper.addEventListener('click', expandLanguageSelect);
    languageSelect.addEventListener('click', expandLanguageSelect);

    languageSelect.addEventListener('change', setLanguage);

    languageSelect.value = locale;
}

function setLanguage() {
    expandLanguageSelect();
    locale = this.value;
    setToday();
    updateCalendarSelect();
}

function expandLanguageSelect() {
    languageSelectWrapper.classList.toggle('expanded');
}

function initCalendar() {
    previousDaysSelect.value = previousDaysDefault;
    upcomingDaysSelect.value = upcomingDaysDefault;
    calendar = generateCalendar(previousDaysDefault, upcomingDaysDefault);

    previousDaysSelect.addEventListener('change', updateCalendarSelect);
    upcomingDaysSelect.addEventListener('change', updateCalendarSelect)

    previousDaysInput.addEventListener('focusout', updateCalendarInput);
    upcomingDaysInput.addEventListener('focusout', updateCalendarInput);

    previousDaysInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            updateCalendarInput();
        }
    });
    upcomingDaysInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            updateCalendarInput();
        }
    });
}

function setCurrentDate1() {
    currentDate1.innerText = today1.getDate().toString() + "/" + (today1.getMonth() + 1) + "/" + today1.getFullYear();
}

function previousWeek1() {
    today1.setDate(today1.getDate() + 7);
    setCurrentDate1();
}

function nextMonth1() {
    today1.setMonth(today1.getMonth() - 1);
    setCurrentDate1();
}

function setCurrentDate2() {
    currentDate2.innerText = today2.toString();
}

function previousWeek2() {
    today2.setDate(today2.getDate() + 7);
    setCurrentDate2();
}

function nextMonth2() {
    today2.setMonth(today2.getMonth() - 1);
    setCurrentDate2();
}

function setToday() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = now.toLocaleDateString(locale, options);
    today.innerText = date.slice(0, 1).toUpperCase() + date.slice(1) + " roku";
}

function setTime(element) {
    const now = new Date();
    element.innerText = now.toLocaleTimeString();
}

function scheduleClockUpdate(element) {
    return setInterval(() => {
       setTime(element);
   }, 1000);
}

function generateCalendar(previousDays, upcomingDays) {
    function createCalendarPage(day, date, month, year, isCurrent){
        const calendarPage = document.createElement('div');
        calendarPage.innerHTML =
            `<p>${day}</p>` +
            `<p>${date}</p>` +
            `<p>${month}</p>` +
            `<p>${year}</p>`;

        if (isCurrent) {
            calendarPage.innerHTML += `<p id='calendar-clock'></p>`
        }

        calendarPage.classList.add('calendar-page')
        if (isCurrent) calendarPage.classList.add('current')

        return calendarPage;
    }

    const fragment = new DocumentFragment();

    const calendar = document.createElement('div')
    calendar.classList.add("calendar-pages-container");

    fragment.appendChild(calendar);


    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = currentDay - previousDays;
    const lastDay = currentDay + upcomingDays;

    for (let i = firstDay; i <= lastDay; i++) {
        const currentDate = new Date();
        currentDate.setDate(i);

        const year = currentDate.getFullYear();

        let day = currentDate.toLocaleDateString(locale, { weekday: 'long' });
        day = day.slice(0, 1).toUpperCase() + day.slice(1);

        const date = currentDate.getDate();

        const month = currentDate.toLocaleDateString(locale, {month: 'long'});

        const isCurrent = date === currentDay &&
            currentDate.getMonth() === currentMonth &&
            year === currentYear;

        const calendarPage = createCalendarPage(
            day,
            date,
            month,
            year,
            isCurrent);
        calendar.appendChild(calendarPage);
    }

    calendarSectionWrapper.appendChild(fragment);

    const calendarClock = document.getElementById('calendar-clock');
    setTime(calendarClock);
    calendarClockTimerID = scheduleClockUpdate(calendarClock);

    return calendar;
}

function destroyClock() {
    clearInterval(calendarClockTimerID)
}

function destroyCalendar() {
    destroyClock();
    calendar.remove();
}

function refreshCalendar(previousDays, upcomingDays) {
    destroyCalendar();
    calendar = generateCalendar(previousDays, upcomingDays);
}

function updateCalendarSelect() {
    const previousDaysRaw = previousDaysSelect.value;
    const upcomingDaysRaw = upcomingDaysSelect.value;

    let previousDays = parseInt(previousDaysRaw);
    let upcomingDays = parseInt(upcomingDaysRaw);

    if (isNaN(upcomingDays) || isNaN(previousDays)) {
        refreshBtn.classList.add('show');
    } else {
        refreshBtn.classList.remove('show');
    }

    if (isNaN(previousDays)) {
        previousDaysInputWrapper.classList.add('show');

        switch (previousDaysRaw) {
            case 'weeks': {
                previousDayslabel.innerText = 'Liczba tygodni: ';
                previousDaysInput.placeholder = '1';
                previousDays = 7;
                break;
            }

            case 'days': {
                previousDayslabel.innerText = 'Liczba dni: ';
                previousDaysInput.placeholder = '1';
                previousDays = 1;
                break;
            }

            case 'months': {
                previousDayslabel.innerText = 'Liczba miesięcy: ';
                previousDaysInput.placeholder = '1';
                previousDays = 31;
                break;
            }

            case 'years': {
                previousDayslabel.innerText = 'Liczba lat: ';
                previousDaysInput.placeholder = '1';
                previousDays = 365;
                break;
            }
        }
    } else {
        previousDaysInputWrapper.classList.remove('show');
        previousDaysInput.value = null;
    }

    if (isNaN(upcomingDays)) {
        upcomingDaysInputWrapper.classList.add('show');

        switch (upcomingDaysRaw) {
            case 'weeks': {
                upcomiongDaysLabel.innerText = 'Liczba tygodni: ';
                upcomingDaysInput.placeholder = '1';
                upcomingDays = 7;
                break;
            }

            case 'days': {
                upcomiongDaysLabel.innerText = 'Liczba dni: ';
                upcomingDaysInput.placeholder = '1';
                upcomingDays = 1;
                break;
            }

            case 'months': {
                upcomiongDaysLabel.innerText = 'Liczba miesięcy: ';
                upcomingDaysInput.placeholder = '1';
                upcomingDays = 31;
                break;
            }

            case 'years': {
                upcomiongDaysLabel.innerText = 'Liczba lat: ';
                upcomingDaysInput.placeholder = '1';
                upcomingDays = 365;
                break;
            }
        }
    } else {
        upcomingDaysInputWrapper.classList.remove('show');
        upcomingDaysInput.value = null;
    }

    refreshCalendar(previousDays, upcomingDays);
}

function updateCalendarInput() {
    const previousDaysRaw = previousDaysSelect.value;
    const upcomingDaysRaw = upcomingDaysSelect.value;

    let previousDays = parseInt(previousDaysRaw);
    let upcomingDays = parseInt(upcomingDaysRaw);

    let inputPreviousDays = parseInt(previousDaysInput.value);
    let inputUpcomingDays = parseInt(upcomingDaysInput.value);

    if (isNaN(previousDays)) {
        if (isNaN(inputPreviousDays)) {
            inputPreviousDays = 1;
        }

        if (inputPreviousDays < 0) {
            inputPreviousDays = 0;
        }

        switch (previousDaysRaw) {
            case 'weeks': {
                previousDays = 7 * inputPreviousDays;
                break;
            }

            case 'days': {
                previousDays = inputPreviousDays;
                break;
            }

            case 'months': {
                previousDays = 31 * inputPreviousDays;
                break;
            }

            case 'years': {
                previousDays = 365 * inputPreviousDays;
                break;
            }
        }
    }

    if (isNaN(upcomingDays)) {
        if (isNaN(inputUpcomingDays)) {
            inputUpcomingDays = 1;
        }

        if (inputUpcomingDays < 0) {
            inputUpcomingDays = 0;
        }

        switch (upcomingDaysRaw) {
            case 'weeks': {
                upcomingDays = 7 * inputUpcomingDays;
                break;
            }

            case 'days': {
                upcomingDays = inputUpcomingDays;
                break;
            }

            case 'months': {
                upcomingDays = 31 * inputUpcomingDays;
                break;
            }

            case 'years': {
                upcomingDays = 365 * inputUpcomingDays;
                break;
            }
        }
    }

    refreshCalendar(previousDays, upcomingDays);
}
