import LocalStorageAccomplishmentsApi from "../backend-storage/accomplishments-api.js";

function _getDate(accomplishmentsObj) {
    return new Date(accomplishmentsObj.date);
}

function loadAccomplishmentFromStorage() {
    let allAccomplishmentsObj =
        LocalStorageAccomplishmentsApi.getAllAccomplishmentsObj();
    return allAccomplishmentsObj;
}

function sortAccomplishments(
    allAccomplishmentsObj, // list of all accomplishments objects
    options = { byOldest: true, alreadySortedByOldest: true }
) {
    let allAccomplishments = _copyAccomplishments(allAccomplishmentsObj);
    if (options.byOldest && options.alreadySortedByOldest) {
        return allAccomplishments;
    }
    // sort by oldest by default
    if (!options.alreadySortedByOldest) {
        allAccomplishments.sort(
            (accomplishmentsObjOne, accomplishmentsObjTwo) => {
                const dateOne = _getDate(accomplishmentsObjOne);
                const dateTwo = _getDate(accomplishmentsObjTwo);
                return dateOne.getTime() - dateTwo.getTime();
            }
        );
    }
    // sort by newest if requested
    if (!options.byOldest) {
        allAccomplishments = allAccomplishments.reverse();
    }
    return allAccomplishments;
}

function filterAccomplishments(
    allAccomplishmentsObj,
    options = { byCurrentMonth: true, byCurrentYear: false }
) {
    if (options.byCurrentMonth && options.byCurrentYear) {
        throw Error("Cannot filter by year and month at the same time.");
    }
    let filteredAccomplishments = _copyAccomplishments(allAccomplishmentsObj);
    // filter by current month if requested
    if (options.byCurrentMonth) {
        const currentMonth = new Date().getMonth();
        filteredAccomplishments = filteredAccomplishments.filter(
            (accomplishmentsObj) =>
                _getDate(accomplishmentsObj).getMonth() === currentMonth
        );
    }
    // filter by current year if requested
    if (options.byCurrentYear) {
        const currentYear = new Date().getFullYear();
        filteredAccomplishments = filteredAccomplishments.filter(
            (accomplishmentsObj) =>
                _getDate(accomplishmentsObj).getFullYear() === currentYear
        );
    }
    return filteredAccomplishments;
}

function clearTable() {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
}

function populateTable(allAccomplishmentsObj) {
    clearTable();
    // get accomplishments object list as an editable list
    let allAccomplishments = _copyAccomplishments(allAccomplishmentsObj);
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

function _copyAccomplishments(allAccomplishmentsObj) {
    let copiedAccomplishmentsObj = [];
    for (const accomplishemntsObj of allAccomplishmentsObj) {
        copiedAccomplishmentsObj.push(accomplishemntsObj);
    }
    return copiedAccomplishmentsObj;
}

function _getAccomplishmentsToDisplay(
    allAccomplishmentsByOldest,
    options = { sortByOldest: true, filterBy: "none" }
) {
    // handle user input
    if (options.sortByOldest !== true && options.sortByOldest !== false) {
        throw Error("options.sortByOldest must be true or false");
    }
    if (
        options.filterBy != "none" &&
        options.filterBy != "month" &&
        options.filterBy != "year"
    ) {
        throw Error("options.filterByy must be 'none' or 'month' or 'year'");
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

window.onload = function () {
    const allAccomplishments = loadAccomplishmentFromStorage();
    const allAccomplishmentsByOldest = sortAccomplishments(allAccomplishments, {
        byOldest: true,
        alreadySortedByOldest: false,
    });
    populateTable(allAccomplishmentsByOldest);
    let shouldSortByOldest = true;
    let filterStatus = "none";

    // get select for filtering
    const filterSelect = document.querySelector(".js-filter-options");
    filterSelect.addEventListener("change", (event) => {
        // set filter status
        if (event.target.value == "none") {
            filterStatus = "none";
        } else if (event.target.value == "month") {
            filterStatus = "month";
        } else if (event.target.value == "year") {
            filterStatus = "year";
        }
        // display accomplishments
        const accomplishmentsToDisplay = _getAccomplishmentsToDisplay(
            allAccomplishmentsByOldest,
            { sortByOldest: shouldSortByOldest, filterBy: filterStatus }
        );
        populateTable(accomplishmentsToDisplay);
    });
    // get select for how to sort
    const sortSelect = document.querySelector(".js-sort-options");
    // define how to sort based on user input
    sortSelect.addEventListener("change", (event) => {
        // set sort status
        if (event.target.value == "oldest") {
            shouldSortByOldest = true;
        } else {
            shouldSortByOldest = false;
        }
        // display accomplishments
        const accomplishmentsToDisplay = _getAccomplishmentsToDisplay(
            allAccomplishmentsByOldest,
            { sortByOldest: shouldSortByOldest, filterBy: filterStatus }
        );
        populateTable(accomplishmentsToDisplay);
    });
};
