import { Calendar } from "./calendar-class.js";
import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";

/*
    Uses Calendar class from ./calendar-class.js to populate the month view and show the next
    or previous month when you click the `<` or `>` buttons on the calendar page.
    Also highlights the current day and grays out the rollover dates from the prev/next month.
    Parameters: None
    Returns: None
*/
function calendarFunctionality(calendar) {
    const prevMonthButton = document.getElementsByClassName("js-prev-month")[0];
    const nextMonthButton = document.getElementsByClassName("js-next-month")[0];

    // populate table upon page load with defaults (current month and year)
    calendar.populateMonthView();
    // go to prev month when prev button is clicked
    prevMonthButton.addEventListener("click", (event) => {
        calendar.prevMonthView();
    });
    // go to next month when next button is clicked
    nextMonthButton.addEventListener("click", (event) => {
        calendar.nextMonthView();
    });
}

/*
    addClickToDays(): Adds event listeners to each date. 
    Parameters: None
    Returns: None
*/
function addClickToDays(calendar) {
    const calendarDays = document.querySelectorAll(".js-calendar-day");
    for (let day of calendarDays) {
        //day.innerHTML = "<a href= '../dailyLog/index.html'>helloo</a>";
        day.addEventListener("click", () => {
            let record;
            const dateObject = calendar.getDateOfDayCell(day);
            if (LocalStorageRecordsApi.hasRecordByDate(dateObject)) {
                record = LocalStorageRecordsApi.getRecordByDate(dateObject);
            } else {
                record = new Record("log", { date: dateObject });
            }

            sessionStorage.setItem("current record", JSON.stringify(record));

            window.location.href = "../dailyLog/index.html";
        });
    }
}

window.onload = function () {
    // select relevant calendar elements
    const calendarHeading = document.querySelector("h1");
    const calendarDayCells = document.getElementsByClassName("js-calendar-day");
    // instantiate Calendar class, passing in Heading and day cells since they will be edited
    const calendar = new Calendar(calendarHeading, calendarDayCells);
    calendarFunctionality(calendar);
    addClickToDays(calendar);
};
