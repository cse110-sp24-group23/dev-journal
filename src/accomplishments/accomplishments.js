import AccomplishmentsStorage from "../backend-storage/accomplishments-api.js";

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
    // Display message if allAccomplishments is empty
    if (allAccomplishmentsObj.length === 0) {
        const main = document.querySelector("main");
        const noContentMsg = document.createElement("h2");
        noContentMsg.innerText =
            "There are no accomplishments. Add them in daily Logs.";
        main.appendChild(noContentMsg);
    }
}

/**
 * Sort an array of accomplishments objects by oldest or newest given an unsorted or sorted array
 * This allows for quick reversing betweeen newest and oldest rather than fully resorting each time
 * @param {accomplishemntsObj[]} accomplishmentsObjArr array of accomplishments objects
 * @param {Object} options contains byOldest (boolean) and alreadySortedByOldest(boolean)
 * @returns {accomplishemntsObj[]}
 */
function sortAccomplishments(
    accomplishmentsObjArr,
    options = { byOldest: true, alreadySortedByOldest: true }
) {
    // Create shallow copy of accomplishments to not edit the parameter that was passed in
    let allAccomplishments = _copyAccomplishments(accomplishmentsObjArr);
    // If it's already sorted how it's requested, return the shallow copy
    if (options.byOldest && options.alreadySortedByOldest) {
        return allAccomplishments;
    }
    // Sort by oldest by default
    if (!options.alreadySortedByOldest) {
        allAccomplishments.sort(
            (accomplishmentsObjOne, accomplishmentsObjTwo) => {
                const dateOne = _getDate(accomplishmentsObjOne);
                const dateTwo = _getDate(accomplishmentsObjTwo);
                return dateOne.getTime() - dateTwo.getTime();
            }
        );
    }
    // Sort by newest if requested
    if (!options.byOldest) {
        allAccomplishments = allAccomplishments.reverse();
    }
    return allAccomplishments;
}

/**
 * Filters an array of accomplishments objects by current year, current month, or no filtering
 * @param {accomplishemntsObj[]} accomplishmentsObjArr array of accomplishments objects
 * @param {Object} options contains byCurrentMonth (Boolean) and byCurrentYear (Boolean)
 * @throws {Error} if options has incorrect parameter settings
 * @returns {accomplishemntsObj[]}
 */
function filterAccomplishments(
    accomplishmentsObjArr,
    options = { byCurrentMonth: true, byCurrentYear: false }
) {
    if (options.byCurrentMonth && options.byCurrentYear) {
        throw Error("Cannot filter by year and month at the same time.");
    }
    // Create shallow copy of accomplishments to not edit the parameter that was passed in
    let filteredAccomplishments = _copyAccomplishments(accomplishmentsObjArr);
    // Filter by current month if requested
    if (options.byCurrentMonth) {
        const currentMonth = new Date().getMonth();
        filteredAccomplishments = filteredAccomplishments.filter(
            (accomplishmentsObj) =>
                _getDate(accomplishmentsObj).getMonth() === currentMonth
        );
    }
    // Filter by current year if requested
    if (options.byCurrentYear) {
        const currentYear = new Date().getFullYear();
        filteredAccomplishments = filteredAccomplishments.filter(
            (accomplishmentsObj) =>
                _getDate(accomplishmentsObj).getFullYear() === currentYear
        );
    }
    return filteredAccomplishments;
}

/**
 * Populate the accomplishments table given an arry of accomplishments objects.
 * Puts every accomplishment on a new row.
 * @param {accomplishemntsObj[]} accomplishmentsObjArr array of accomplishments objects
 */
function populateTable(accomplishmentsObjArr) {
    _clearTable();
    // Create shallow copy of accomplishments to not edit the parameter that was passed in
    let allAccomplishments = _copyAccomplishments(accomplishmentsObjArr);
    // Get table, add a row to table for each accomplishment in each accomplishments object
    const tableBody = document.getElementById("tableBody");
    for (const accomplishment of allAccomplishments) {
        // Get the date from accomplishment obj
        let dateObj = new Date(accomplishment.date);
        const settings = { year: "numeric", month: "numeric", day: "numeric" };
        let fullDate = dateObj.toLocaleString("en-US", settings);
        // Get the content from accomplishment obj
        let contentOfAccomplishment = accomplishment.content;
        for (let i = 0; i < contentOfAccomplishment.length; i++) {
            // Create row of table
            const row = document.createElement("tr");
            // Date of the accomplishemnt
            const dateElement = document.createElement("td");
            // Content of the accomplishment
            const accomplishmentElement = document.createElement("td");
            accomplishmentElement.classList.add("content-cell");
            // Add the text
            dateElement.innerHTML = fullDate;
            accomplishmentElement.innerHTML = contentOfAccomplishment[i];
            // Add them to the table
            tableBody.append(row);
            row.append(dateElement);
            row.append(accomplishmentElement);
        }
    }
}

/**
 * Get the date of an accomplishments object as a Date object
 * @param {accomplishemntsObj} accomplishmentsObj an accomplishments object - has date and content fields
 * @returns {Date} Date object corresponding to the accomplishments object's date
 */
function _getDate(accomplishmentsObj) {
    return new Date(accomplishmentsObj.date);
}

/**
 * Clears the accomplishments table
 */
function _clearTable() {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
}

/**
 * Return a shallow copy of an array that still points to the accomplishments objects
 * @param {accomplishemntsObj[]} AccomplishmentsObjArr array of accomplishments objects
 * @returns {accomplishemntsObj[]} shallow copy of parameter
 */
function _copyAccomplishments(AccomplishmentsObjArr) {
    let copiedAccomplishmentsObj = [];
    for (const accomplishemntsObj of AccomplishmentsObjArr) {
        copiedAccomplishmentsObj.push(accomplishemntsObj);
    }
    return copiedAccomplishmentsObj;
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
    // Handle incorrect parameters input
    if (options.sortByOldest !== true && options.sortByOldest !== false) {
        throw Error("options.sortByOldest must be true or false");
    }
    if (!["none", "month", "year"].includes(options.filterBy)) {
        throw Error("options.filterByy must be 'none' or 'month' or 'year'");
    }
    // Assign filter settings
    // By default, no filtering
    let byCurrentMonth = false;
    let byCurrentYear = false;
    // Filter by current month
    if (options.filterBy == "month") {
        byCurrentMonth = true;
    }
    // Filter by current year
    else if (options.filterBy == "year") {
        byCurrentYear = true;
    }
    // To get accomplishments to display, first filter original list, then sort it
    const filteredAccomplishments = filterAccomplishments(
        allAccomplishmentsByOldest,
        { byCurrentMonth: byCurrentMonth, byCurrentYear: byCurrentYear }
    );
    // Call sort
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
    // Load in accomplishments and display a message if there are none
    const allAccomplishments = loadAccomplishmentFromStorage();
    displayMsgIfEmpty(allAccomplishments);
    // Sort accomplishments by oldest first
    const allAccomplishmentsByOldest = sortAccomplishments(allAccomplishments, {
        byOldest: true,
        alreadySortedByOldest: false,
    });
    // Populate table with the sorted accomplishments
    populateTable(allAccomplishmentsByOldest);
    // Statuses to determine how to filter and sort accomplishments when user selects options
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
