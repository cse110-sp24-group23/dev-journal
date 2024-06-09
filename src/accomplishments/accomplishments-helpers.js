// By moving these helper functions into another file, it declutters the accomplishments.js file
// and allows for unit testing of the exported functions without problems from window.onload

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
    let allAccomplishments = copyAccomplishments(accomplishmentsObjArr);
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
    options = { byCurrentMonth: false, byCurrentYear: false }
) {
    if (options.byCurrentMonth && options.byCurrentYear) {
        throw Error("Cannot filter by year and month at the same time.");
    }
    // Create shallow copy of accomplishments to not edit the parameter that was passed in
    let filteredAccomplishments = copyAccomplishments(accomplishmentsObjArr);
    // Filter by current month if requested
    if (options.byCurrentMonth) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filteredAccomplishments = filteredAccomplishments.filter(
            (accomplishmentsObj) =>
                _getDate(accomplishmentsObj).getMonth() === currentMonth &&
                _getDate(accomplishmentsObj).getFullYear() === currentYear
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
 * return a shallow copy of an array that still points to the accomplishments objects
 * @param {accomplishemntsObj[]} AccomplishmentsObjArr array of accomplishments objects
 * @returns {accomplishemntsObj[]} shallow copy of parameter
 */
function copyAccomplishments(AccomplishmentsObjArr) {
    let copiedAccomplishmentsObj = [];
    for (const accomplishemntsObj of AccomplishmentsObjArr) {
        copiedAccomplishmentsObj.push(accomplishemntsObj);
    }
    return copiedAccomplishmentsObj;
}

/**
 * Get the date of an accomplishments object as a Date object
 * @param {accomplishemntsObj} accomplishmentsObj an accomplishments object - has date and content fields
 * @returns {Date} Date object corresponding to the accomplishments object's date
 */
function _getDate(accomplishmentsObj) {
    return new Date(accomplishmentsObj.date);
}

// Export functions to be used by accomplishments.js and for unit testing
export { filterAccomplishments, sortAccomplishments, copyAccomplishments };
