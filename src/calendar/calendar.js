import { Calendar } from "./calendar-class.js";
//import { populateDefaultLog } from "../dailyLog/dailyLog.js";
//import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";
//import { Record } from "../backend-storage/record-class.js";

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
    TODO: change this to use localStorage once localStorage functionality is complete
        - This whole function will likely be rewritten.
    dateLink(): Opens a new Daily Log page for the day that was clicked 
    Parameters: None
    Returns: None
*/
/*async function dateLink(calendar) {
    //Link to daily log page for the specific day that was clicked
    //First time clicking a date: creates a new Daily Log page for it
    try {
        //path to the html boiler plate, please update if changed
        const dailyLogPath = "../dailyLog/index.html";
        // hello
        const response = await fetch(dailyLogPath);
        const htmlDailyLog = await response.text(); //get the html out of the response, if successful
        const newDailyLog = document.createElement("link-for-date"); //creating a new element for daily log,
        //later when the storage is up, we have to go through all of them and maybe match id or date?

        // !! add classname when months are done to assist saving.
        newDailyLog.innerHTML = htmlDailyLog;
        const main = document.querySelector("main"); //reference to main element
        main.append(newDailyLog); //add daily log to main
        for (let i = 0; i < main.children.length - 1; i++) {
            main.children[i].style.display = "none"; //hide other elements, only works when the current addedlog is the last one
            //would not work for saved dates
        }
    } catch (error) {
        console.error("Error fetching daily log:", error);
    
}}*/

/*
    addClickToDays(): Adds event listeners to each date. 
    Parameters: None
    Returns: None
*/
/*function addClickToDays(calendar) {
    const calendarDays = document.querySelectorAll(".js-calendar-day");
    for (let day of calendarDays) {
        //day.innerHTML = "<a href= '../dailyLog/index.html'>helloo</a>";
        day.addEventListener("click", () => {
            window.location.href = "../dailyLog/index.html";
            alert("first");
            let record;
            const dateObject = calendar.getDateOfDayCell(day);
            if (RecordsStorage.hasRecord(dateObject)) {
                record = RecordsStorage.getRecordByDate(dateObject);
            } else {
                record = new Record("log", { date: dateObject });
            }

            populateDefaultLog(record);
            alert("second");
        });

        //day.innerText = "helloo";
    }
}*/

window.onload = function () {
    // select relevant calendar elements
    const calendarHeading = document.querySelector("h1");
    const calendarDayCells = document.getElementsByClassName("js-calendar-day");
    // instantiate Calendar class, passing in Heading and day cells since they will be edited
    const calendar = new Calendar(calendarHeading, calendarDayCells);
    calendarFunctionality(calendar);
    //addClickToDays(calendar);
};
