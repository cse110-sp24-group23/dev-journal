import { Calendar } from "./calendar-class.js";
import RecordsStorage from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";

/**
 * Uses Calendar class from ./calendar-class.js to populate the month view and show the next
 * or previous month when you click the '<' or '>' buttons on the calendar page.
 * Also highlights the current day and grays out the rollover dates from the prev/next month.
 *
 * @param {Calendar} calendar - The calendar object to be used for functionality.
 * @returns {void}
 */
function calendarFunctionality(calendar) {
    const prevMonthButton = document.getElementsByClassName("js-prev-month")[0];
    const nextMonthButton = document.getElementsByClassName("js-next-month")[0];

    // Default Populate with current month
    calendar.populateMonthView();

    prevMonthButton.addEventListener("click", () => {
        calendar.prevMonthView();
    });

    nextMonthButton.addEventListener("click", () => {
        calendar.nextMonthView();
    });
}

/**
 * Adds event listeners to each date and stores the record created in session storage.
 * Redirects to the "daily log" page for the date clicked.
 *
 * @param {Calendar} calendar - The calendar object initialized when the window is loaded.
 * @returns {void}
 */
function addClickToDays(calendar) {
    const calendarDays = document.querySelectorAll(".js-calendar-day");
    for (let day of calendarDays) {
        // Listen for click
        day.addEventListener("click", () => {
            let record;
            // Date of the Clicked Cell
            const dateObject = calendar.getDateOfDayCell(day);

            // Get Record Object corresponding to date (if it exists),
            // Else make a new record object.
            if (RecordsStorage.hasRecordByDate(dateObject)) {
                record = RecordsStorage.getRecordByDate(dateObject);
            } else {
                record = new Record("log", { date: dateObject });
            }
            // Stores current record from the cell date into session storage
            sessionStorage.setItem("current record", JSON.stringify(record));
            // Redirects to daily log page for clicked date
            window.location.href = "../daily-log/daily-log.html";
        });
        // Listen for Enter key for keyboards
        day.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                let record;
                // Date of the Clicked Cell
                const dateObject = calendar.getDateOfDayCell(day);

                // Get Record Object corresponding to date (if it exists),
                // Else make a new record object.
                if (RecordsStorage.hasRecordByDate(dateObject)) {
                    record = RecordsStorage.getRecordByDate(dateObject);
                } else {
                    record = new Record("log", { date: dateObject });
                }
                // Stores current record from the cell date into session storage
                sessionStorage.setItem(
                    "current record",
                    JSON.stringify(record)
                );
                // Redirects to daily log page for clicked date
                window.location.href = "../daily-log/daily-log.html";
            }
        });
    }
}

/* 
actions that are done when the window is loaded 
*/
window.onload = function () {
    // Select relevant calendar elements
    const calendarHeading = document.querySelector("h1");
    const calendarDayCells = document.getElementsByClassName("js-calendar-day");
    // Instantiate Calendar class, passing in Heading and day cells since they will be edited
    const calendar = new Calendar(calendarHeading, calendarDayCells);
    calendarFunctionality(calendar);
    addClickToDays(calendar);
};
