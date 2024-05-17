/*
    dateLink(): Opens a new Daily Log page for the day that was clicked 
    Parameters: None
    Returns: None
*/
async function dateLink() {
    //Link to daily log page for the specific day that was clicked
    //First time clicking a date: creates a new Daily Log page for it
    try {
        const response = await fetch("../dailyLog/index.html"); //path to the html boiler plate, please update if changed
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
    }
}

/*
    addClickToDays(): Adds event listeners to each date. 
    Parameters: None
    Returns: None
*/
function addClickToDays() {
    const calendarDays = document.querySelectorAll(".js-calendar-day");
    for (let day of calendarDays) {
        day.addEventListener("click", dateLink);
    }
}

/*
    todaysDate(): Indicate the current date
    Parameters: None
    Returns: None
*/
function todaysDate() {
    // gets date like "2022/06/17"
    let currentDate = new Date()
        .toLocaleString("en", {
            timeZone: "US/Pacific",
        })
        .slice(2, 4);

    //gets all days of the month from calendar
    const cells = document.querySelectorAll(".js-calendar-table td");

    //checks and styles the current day of the month
    for (let cell of cells) {
        if (cell.textContent === currentDate) {
            cell.classList.add("current-date");
        }
    }
}

window.onload = function () {
    todaysDate();
    addClickToDays();
};
