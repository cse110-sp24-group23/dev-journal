import AccomplishmentsStorage from "../backend-storage/accomplishments-api.js";
import {
    sortAccomplishments,
    filterAccomplishments,
    copyAccomplishments,
} from "./accomplishments-helpers.js";
/**
 * Get all accomplishment Objects from storage
 * @returns {accomplishemntsObj[]} array of accomplishments objects retrieved from storage
 */
function loadAccomplishmentFromStorage() {
    let allAccomplishmentsObj =
        AccomplishmentsStorage.getAllAccomplishmentsObj();
    return allAccomplishmentsObj;
}

/**
 * Display a message on the page if there are no accomplishments
 * @param {accomplishemntsObj[]} allAccomplishmentsObj array of all accomplishments objects from storage
 */
function displayMsgIfEmpty(allAccomplishmentsObj) {
    // display message if allAccomplishments is empty
    if (allAccomplishmentsObj.length === 0) {
        const main = document.querySelector("main");
        const noContentMsg = document.createElement("h2");
        noContentMsg.innerText =
            "There are no accomplishments. Add them in daily Logs.";
        main.appendChild(noContentMsg);
    }
}

/**
 * Populate the accomplishments table given an arry of accomplishments objects.
 * Puts every accomplishment on a new row.
 * @param {accomplishemntsObj[]} accomplishmentsObjArr array of accomplishments objects
 */
function populateTable(accomplishmentsObjArr) {
    _clearTable();
    // create shallow copy of accomplishments to not edit the parameter that was passed in
    let allAccomplishments = copyAccomplishments(accomplishmentsObjArr);
    // get table, add a row to table for each accomplishment in each accomplishments object
    const tableBody = document.getElementById("tableBody");
    for (const accomplishment of allAccomplishments) {
        // get the date from accomplishment obj
        let dateObj = new Date(accomplishment.date);
        const settings = { year: "numeric", month: "numeric", day: "numeric" };
        let fullDate = dateObj.toLocaleString("en-US", settings);
        // get the content from accomplishment obj
        let contentOfAccomplishment = accomplishment.content;
        for (let i = 0; i < contentOfAccomplishment.length; i++) {
            // create row of table
            const row = document.createElement("tr");
            // date of the accomplishemnt
            const dateElement = document.createElement("td");
            // content of the accomplishment
            const accomplishmentElement = document.createElement("td");
            accomplishmentElement.classList.add("content-cell");
            // add the text
            dateElement.innerHTML = fullDate;
            accomplishmentElement.innerHTML = contentOfAccomplishment[i];
            // add them to the table
            tableBody.append(row);
            row.append(dateElement);
            row.append(accomplishmentElement);
        }
    }
}

/**
 * Clears the accomplishments table
 */
function _clearTable() {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
}

/**
 * Filter and sort (reverse or not) array of all accomplishments objects already sorted by oldest
 * @param {accomplishemntsObj[]} allAccomplishmentsByOldest accomplishment objects sorted by oldest
 * @param {Object} options has sortByOldest (boolean) & filterBy (String: "none", "month", "year")
 * @throws {Error} if options has incorrect parameter settings
 * @returns {accomplishemntsObj[]} filtered and sorted list of accomplishment objects
 */
function _getAccomplishmentsToDisplay(
    allAccomplishmentsByOldest,
    options = { sortByOldest: true, filterBy: "none" }
) {
    // handle incorrect parameters input
    if (options.sortByOldest !== true && options.sortByOldest !== false) {
        throw Error("options.sortByOldest must be true or false");
    }
    if (!["none", "month", "year"].includes(options.filterBy)) {
        throw Error("options.filterBy must be 'none' or 'month' or 'year'");
    }
    // assign filter settings
    // by default, no filtering
    let byCurrentMonth = false;
    let byCurrentYear = false;
    // filter by current month
    if (options.filterBy == "month") {
        byCurrentMonth = true;
    }
    // filter by current year
    else if (options.filterBy == "year") {
        byCurrentYear = true;
    }
    // to get accomplishments to display, first filter original list, then sort it
    const filteredAccomplishments = filterAccomplishments(
        allAccomplishmentsByOldest,
        { byCurrentMonth: byCurrentMonth, byCurrentYear: byCurrentYear }
    );
    // call sort
    const accomplishmentsToDisplay = sortAccomplishments(
        filteredAccomplishments,
        {
            byOldest: options.sortByOldest,
            alreadySortedByOldest: true,
        }
    );
    return accomplishmentsToDisplay;
}

/**
 * This function is called when the window is loaded.
 * @function
 * @name window.onload
 */
window.onload = function () {
    // load in accomplishments and display a message if there are none
    const allAccomplishments = loadAccomplishmentFromStorage();
    displayMsgIfEmpty(allAccomplishments);
    // Sort accomplishments by oldest first
    const allAccomplishmentsByOldest = sortAccomplishments(allAccomplishments, {
        byOldest: true,
        alreadySortedByOldest: false,
    });
    // populate table with the sorted accomplishments
    populateTable(allAccomplishmentsByOldest);
    // statuses to determine how to filter and sort accomplishments when user selects options
    let shouldSortByOldest = true;
    let filterStatus = "none";

    // Get select for filtering
    const filterSelect = document.querySelector(".js-filter-options");
    // Whenever the select option is changed, update the display
    filterSelect.addEventListener("change", (event) => {
        // Set filter status
        if (event.target.value == "none") {
            filterStatus = "none";
        } else if (event.target.value == "month") {
            filterStatus = "month";
        } else if (event.target.value == "year") {
            filterStatus = "year";
        }
        // Get the accomplishments filtered and sorted
        const accomplishmentsToDisplay = _getAccomplishmentsToDisplay(
            allAccomplishmentsByOldest,
            { sortByOldest: shouldSortByOldest, filterBy: filterStatus }
        );
        // Display accomplishments in the table
        populateTable(accomplishmentsToDisplay);
    });
    // Get select for how to sort
    const sortSelect = document.querySelector(".js-sort-options");
    // Define how to sort based on user input
    sortSelect.addEventListener("change", (event) => {
        // Set sort status
        if (event.target.value == "oldest") {
            shouldSortByOldest = true;
        } else {
            shouldSortByOldest = false;
        }
        // Get the accomplishments filtered and sorted
        const accomplishmentsToDisplay = _getAccomplishmentsToDisplay(
            allAccomplishmentsByOldest,
            { sortByOldest: shouldSortByOldest, filterBy: filterStatus }
        );
        // Display accomplishments in the table
        populateTable(accomplishmentsToDisplay);
    });
};
