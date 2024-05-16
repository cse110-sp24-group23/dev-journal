/*
Opens a new Daily Log page for the day that was clicked 
Parameters:
- link: receives a link of the page of the Daily Log associated with it 
Returns:
- None
*/
async function dateLink(link) {
    //alert("You clicked on " + link.textContent)

    //Link to daily log page for the specific day that was clicked

    //First time clicking a date: creates a new Daily Log page for it
    try {
        let response = await fetch("../dailyLog/index.html"); //path to the html boiler plate, please update it changed
        let htmlDailyLog = await response.text(); //get the html out of the response, if successful
        let newDailyLog = document.createElement("link-for-date"); //creating a new element,
        //later when the storage is up we have to go through all of them and maybe match id or date?
        newDailyLog.innerHTML = htmlDailyLog;
        let main = document.querySelector("main"); //reference to main element
        main.append(newDailyLog); //add daily log to main
        for (let i = 0; i < main.children.length - 1; i++) {
            main.children[i].style.display = "none"; //hide other elements, only works when the current addedlog is the last one
            //would not work for saved dates
        }
    } catch (error) {
        console.error("Error fetching daily log:", error);
    }
}

function todaysDate() {
    let currentDate = new Date()
        .toLocaleString("en", {
            timeZone: "US/Pacific",
        })
        .slice(2, 4); // gets date like "2022-06-17"

    let cells = document.querySelectorAll(".js-calendar-table td");

    console.log(currentDate);
    for (let cell of cells) {
        if (cell.textContent === currentDate) {
            cell.style.backgroundColor = "lightBlue";
        }
    }
}

window.onload = function () {
    todaysDate();
};
