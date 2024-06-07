import RecordsStorage from "../backend-storage/records-api.js";
import AccomplishmentsStorage from "../backend-storage/accomplishments-api.js";

class Calendar {
    // Current date
    _currentYear;
    _currentMonth;
    _currentDate;
    // Displayed date
    _displayedMonth;
    _displayedYear;
    // Array that holds all dates in the current displayed month view (including rollovers)
    _calendarDatesList;
    // Public member variables initialized in constructor
    calendarHeading; // Header tag that has month and year text
    calendarCellElements; // list of calendar day cells that this class edits

    /*
    ================================================
                    PUBLIC METHODS
    ================================================
    */

    /**
    Sets current date, display date, and montiors current date (updates every midnight)
     * @param {HTMLElement} calendarHeading
     * @param {HTMLElement[]} calendarCellElements elements that hold dates in calendar
     * @param {boolean} asyncUpdate turns on/off ability for dates to refresh after midnight
     */
    constructor(calendarHeading, calendarCellElements, asyncUpdate = true) {
        this.calendarHeading = calendarHeading;
        // Make sure calendarCellELements is an array, rather than an array-like of HTML elements
        if (!Array.isArray(calendarCellElements)) {
            calendarCellElements = Array.from(calendarCellElements);
        }
        // Initialize member variables
        this.calendarCellElements = calendarCellElements;
        this._calendarDatesList = [];
        this._refreshCurrentDate();
        this._initDisplayDate();
        // Asynchronous portion of the code - every midnight updates curent date member variables
        if (asyncUpdate) {
            this._monitorCurrDate();
        }
    }

    /**
     * Display the dates of a given year & month in the calendar
     * @param {Number} yearInt Int representation of year (ex: 2024). Default is current year
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     */
    populateMonthView(
        yearInt = this._currentYear,
        monthInt = this._currentMonth
    ) {
        // Handle input for month - year doesn't need it since there is no cyclic nature like months
        monthInt = this._handleMonthInput(monthInt);
        // Update displayed date member variables to match passed in arguments
        this._displayedYear = yearInt;
        this._displayedMonth = monthInt;
        // Create array of dates in calendar table (42 when full - 6 rows, 7 columns)
        let datesList = [];
        // Get final days from previous month and update datesList
        const prevRollover = this._getPrevMonthRolloverDates(yearInt, monthInt);
        datesList = datesList.concat(prevRollover);
        // Get all days for current month and update partialDatesList
        const currDates = this._getCurrMonthDates(yearInt, monthInt);
        datesList = datesList.concat(currDates);
        // Get first days of next month and update partialDatesList
        // DatesList is passed in to calculate how mnay days left to generate
        const nextRollover = this._getNextMonthRolloverDates(datesList.length);
        datesList = datesList.concat(nextRollover);

        // Update this.calendarDatesList with newly calculated datesist
        this._calendarDatesList = datesList;

        // Update the calendar heading text
        const monthStr = this._getMonthStrFromInt(monthInt);
        const calenderHeadingText = monthStr + " " + String(yearInt);
        this.calendarHeading.innerText = calenderHeadingText;

        // Update month view in the UI - set dates (gray & black), highlight current day
        this._populateCalendarMonth(datesList);
    }

    /**
     * Display the dates of the next month to be displayed in the calendar
     */
    nextMonthView() {
        // If the currently displayed month is December,
        if (this._displayedMonth === 11) {
            // Increment the year for the next month and set displayed month = 0 (Jan)
            this._displayedYear = this._displayedYear + 1;
            this._displayedMonth = 0;
        } else {
            // Otherwise, increment displayed month normally
            this._displayedMonth = this._displayedMonth + 1;
        }
        // Display the newly updated next month in the calendar
        this.populateMonthView(this._displayedYear, this._displayedMonth);
    }

    /**
     * Display the dates of the previous month to be displayed in the calendar
     */
    prevMonthView() {
        // If the currently displayed month is January,
        if (this._displayedMonth === 0) {
            // Decrement the year for the next month and set displayed month = 11 (Dec)
            this._displayedYear = this._displayedYear - 1;
            this._displayedMonth = 11;
        } else {
            // Otherwise, Decrement displayed month normally
            this._displayedMonth = this._displayedMonth - 1;
        }
        // Display the newly updated previous month in the calendar
        this.populateMonthView(this._displayedYear, this._displayedMonth);
    }

    /**
     * Get the date of a given calendar cell element
     * @param {HTMLElement} calendarCellElem cell for a date in calendar
     * @throws {Error} if the given cell doesn't exist or if the calendar is not fully populated
     * @returns {Date} date object for cell passed in
     */
    getDateOfDayCell(calendarCellElem) {
        // cellIdx correspond to the cell's index in calendarCellElements, which also corresponds
        // to this._calendarDatesList, since they have a one-to-one correspondance
        const cellIdx = this.calendarCellElements.indexOf(calendarCellElem);
        // Handle if cell not in initialized cells
        if (cellIdx == -1) {
            throw Error(
                "calendarCellElem not in list of calendar cells. Make sure you are passing in the correct calendar cell element"
            );
        }
        // Handle if getDateOfDayCell is called before month view is populated
        const numCalendarDates = this._calendarDatesList.length;
        const EXPECTED_DATESLIST_LENGTH = 42;
        if (numCalendarDates !== EXPECTED_DATESLIST_LENGTH) {
            let errorMsg = `this._calendarDatesList should be ${EXPECTED_DATESLIST_LENGTH} but was ${numCalendarDates}.`;
            if (numCalendarDates < EXPECTED_DATESLIST_LENGTH) {
                errorMsg +=
                    "this is most likely because getDateOfDayCell was called before populateMonthView. Make sure the dates are populated before retrieving them.";
            }
            throw Error(errorMsg);
        }
        // There are exactly 2 `1`s in calendarDateList: start of curr month & start of next month
        // Use them later to figure out which month the calendarCellElem belongs to
        const currMonthStartIdx = this._calendarDatesList.indexOf(1);
        const nextMonthStartIdx = this._calendarDatesList.lastIndexOf(1);
        // Find the full date of the cell to return it
        let cellMonth;
        const cellYear = this._displayedYear;
        const cellDate = calendarCellElem.innerText;
        // Initialize cellMonth. It will either be the current displayed month or 1 up/down from it
        if (cellIdx < currMonthStartIdx) {
            // Cell month is previous month (in rollover)
            cellMonth = this._displayedMonth - 1;
            cellMonth = this._handleMonthInput(cellMonth);
        } else if (cellIdx < nextMonthStartIdx) {
            // Cell month is current month - no need to handle input
            cellMonth = this._displayedMonth;
        } else {
            // Cell month is next month (in rollover)
            cellMonth = this._displayedMonth + 1;
            cellMonth = this._handleMonthInput(cellMonth);
        }
        // Return the date that the calendarCellElem corresponds to
        return new Date(cellYear, cellMonth, cellDate);
    }
    /*
    ================================================
                    PRIVATE METHODS
    ================================================
    */

    /**
     * Resets current date member vars: this._currentYear, this._currentMonth, this._currentDay.
     * Is used to initialize dates for today and reset them after midnight.
     */
    _refreshCurrentDate() {
        const now = new Date();
        this._currentYear = now.getFullYear();
        this._currentMonth = now.getMonth();
        this._currentDate = now.getDate();
    }

    /**
     * Initializes display date member variables to be based on current date.
     * Is used for setting up calendar display
     */
    _initDisplayDate() {
        this._displayedYear = this._currentYear;
        this._displayedMonth = this._currentMonth;
    }

    /**
     * Given a Number that represents a month, make sure it's between 0 and 11. This is meant to
     * handle operations on months, so if you have a monthInt-1 to get the previous month, you can
     * pass it through this function so it doesn't break when the monthInt is 0 (Jan).
     * In that case, it would be 0-1 = -1, but this would take it and return 11 (Dec) as expected
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     * @throws {Error} if input is not a Number
     * @returns {Number} int between 0 and 11 to represent a month between Jan and Dec
     */
    _handleMonthInput(monthInt) {
        if (!Number.isInteger(monthInt)) {
            throw new Error("monthInt must be an integer");
        }
        // Take absolute value to make positive, then mod by 12 to get between 0 and 11
        // If input is negative, mod it by 12 and add to 12 to put between 0 and 11
        if (monthInt < 0) {
            return 12 + (monthInt % 12);
        }
        // Otherwise, it's a whole number, so just mod by 12
        return monthInt % 12;
    }

    /**
     * Given a month and year, both as integers, return an array of the rollover dates from the
     * previous month to be put in the calendar display.
     * Ex: if the first of the currently displayed month is Tuesday, Sun and Mon will be the last 2
     * dates of the previous month. Sun (30), Mon (31), Tue (1), ... It would thus return [30, 31]
     * @param {Number} yearInt Int representation of year (ex: 2024). Default is current year
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     * @returns {Number[]} array of dates (ints) to be added to a calendarDateList
     */
    _getPrevMonthRolloverDates(yearInt, monthInt) {
        // Get the last date of the previous month (usually 30 or 31 - except Feb)
        // monthInt input is handled inside getMonthLastDate -> monthInt = 0-1 is fine to pass in
        let prevMonthLastDate = this._getMonthLastDate(yearInt, monthInt - 1);
        // Get the day of the 1st of the current month (e.g. Wednesday)
        let currMonthfirstDay = new Date(yearInt, monthInt, 1).getDay();
        // Get the date of the first sunday in the month view (first cell in calendar table)
        let firstSundayDate = prevMonthLastDate - currMonthfirstDay + 1;
        // Get array of last days from the previous month to put before the 1st of the current month
        let partialDateList = [];
        for (
            let prevMonthDay = 0;
            prevMonthDay < currMonthfirstDay;
            prevMonthDay++
        ) {
            // Get date of rollover day from prev month
            let rolloverDate = firstSundayDate + prevMonthDay;
            partialDateList.push(rolloverDate);
        }
        return partialDateList;
    }

    /**
     * Given a month and year, both as integers, return an array of the dates of the given month.
    Ex: for march, it would return [1, 2, ..., 31]
     * @param {Number} yearInt Int representation of year (ex: 2024). Default is current year
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     * @returns {Number[]} array of dates (ints) to be added to a calendarDateList
     */
    _getCurrMonthDates(yearInt, monthInt) {
        // Get the last date of the current displayed month
        const currMonthLastDate = this._getMonthLastDate(yearInt, monthInt);
        // Fill array with dates from 1 til final date of the month
        let partialDateList = [];
        for (let i = 0; i < currMonthLastDate; i++) {
            // Get date in month, append to partialDateList
            let currMonthDate = i + 1;
            partialDateList.push(currMonthDate);
        }
        return partialDateList;
    }

    /**
     * Given a number of dates generated so far for calendar display, return an array of rollover
     * dates from the next month to be put in the calendar display. Ex: if current displayed month
     * ends on Wed, then it will have 1 for Thu, 2 for Fri, 3 for Sat, so it returns [1, 2, 3]
     * @param {Number} numDatesGenerated length of the partialDatesList which contains dates from previous month rollover and current month
     * @returns {Number[]} array of dates (ints) to be added to a calendarDateList
     */
    _getNextMonthRolloverDates(numDatesGenerated) {
        // Fill array with rollover days from start of next month to be displayed in calendar
        let partialDateList = [];
        // Number of days to fill is total calendar cells - number of currently generated dates
        let daysToFill = this.calendarCellElements.length - numDatesGenerated;
        for (let i = 0; i < daysToFill; i++) {
            // Get rollover date (e.g. 1, 2, 3, etc.) and add it to partialDateList
            let rolloverDate = i + 1;
            partialDateList.push(rolloverDate);
        }
        return partialDateList;
    }

    /**
     * Given a month and year, both as integers, return an integer representation of the last day
     * of the month. Ex: if the last day is Wed, returns 3
     * @param {Number} yearInt Int representation of year (ex: 2024). Default is current year
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     * @returns {Number} day of week as an integer (0 through 6), where Sun = 0, Sat = 6
     */
    _getMonthLastDay(yearInt, monthInt) {
        monthInt = this._handleMonthInput(monthInt);
        // Get the last day of prevMonth
        // Date handles overflow of monthInt+1 automatically (e.g. Dec=11, so we pass in 12 for Jan)
        const prevMonthLastDay = new Date(yearInt, monthInt + 1, 0).getDay();
        return prevMonthLastDay;
    }

    /**
     * Given a month and year, both as integers, return the last date of the month. Ex: 31
     * @param {Number} yearInt Int representation of year (ex: 2024). Default is current year
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     * @returns
     */
    _getMonthLastDate(yearInt, monthInt) {
        monthInt = this._handleMonthInput(monthInt);
        // Get the last day of prevMonth
        // Date handles overflow of monthInt+1 automatically (e.g. Dec=11, so we pass in 12 for Jan)
        const prevMonthLastDate = new Date(yearInt, monthInt + 1, 0).getDate();
        return prevMonthLastDate;
    }

    /**
     * Given an int that represents a month, return a string of the month it represents
     * @param {Number} monthInt month index from 0 to 11 (Jan to Dec). Default is current month
     * @throws {Error} if input is not an int between 0 and 11
     * @returns
     */
    _getMonthStrFromInt(monthInt) {
        // Keep days_of_week in this order - matches how Date library works
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let return_month;
        // If invalid input, throw error
        try {
            return_month = months[monthInt];
        } catch {
            throw new Error("Invalid input - must be an int between 0 and 11.");
        }
        // Otherwise, return the correct month
        return return_month;
    }

    /**
     * Updates the privately stored current date every day change.
     * This is in case a user keeps the calendar page open without refreshing between days.
     */
    _monitorCurrDate() {
        const delay = this._milisecondsUntilMidnight();
        setTimeout(this._refreshCurrentDate, delay);
        setInterval(this._refreshCurrentDate, 1000 * 60 * 60 * 24);
    }

    /**
     * Calculates the number of miliseconds until midnight
     * Is used to find the first time to refresh the current date in _monitorCurrDate()
     * @returns {Number} number of milliseconds until midnight
     */
    _milisecondsUntilMidnight() {
        // define midnight
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        // return the seconds between now and midnight
        return midnight.getTime() - new Date().getTime();
    }

    /**
     * Given a calendar date list (from populateMonthView), put all of the dates into the calendar
     * in the HTML, make the rollover dates gray, and highlight the current day
     * @param {Number[]} calendarDateList an array (of length 6*7 = 42) dates of previous ending month, current display month dates, and start of next month dates.
     * - Ex: [30, 31, 1, 2, ..., 30, 1, 2, 3] <-- length = 42
     */
    _populateCalendarMonth(calendarDateList) {
        // Class that grays out the text of a date
        const rolloverDateClass = "rollover-date";
        // There are exactly 2 `1`s in calendarDateList: start of curr month & start of next month
        // Use them later to gray out rollover dates (dates not in current month)
        const currMonthStartIdx = calendarDateList.indexOf(1);
        const nextMonthStartIdx = calendarDateList.lastIndexOf(1);
        // Get list of all day cells in calendar table
        for (let i = 0; i < this.calendarCellElements.length; i++) {
            // Get the calendar day cell to edit (html element: td)
            const calendarDayCell = this.calendarCellElements[i];
            // Get the date (e.g. 14) and put it into the cell
            const cellDate = calendarDateList[i];
            calendarDayCell.innerText = cellDate;
            // Make sure cell is accessible via keyboard
            calendarDayCell.tabIndex = "0";
            // Cell month will either be the displayed month or +/- 1 from that for rollover dates
            let cellMonth;
            // By default cellYear is the currently displayed year. Gets edited if it isn't correct
            let cellYear = this._displayedYear;
            // Date is in prev month's rollover
            if (i < currMonthStartIdx) {
                // Gray out rollover dates for prev and next month that are displayed
                calendarDayCell.classList.add(rolloverDateClass);
                // Get cellMonth and cellYear
                cellMonth = this._handleMonthInput(this._displayedMonth - 1);
                // If after going back a month, we're in december, we went back a year too
                if (cellMonth == 11) {
                    cellYear = this._displayedYear - 1;
                }
            }
            // Date is in next month's rollover
            else if (i >= nextMonthStartIdx) {
                // Gray out rollover dates for prev and next month that are displayed
                calendarDayCell.classList.add(rolloverDateClass);
                // Get cellMonth and cellYear
                cellMonth = this._handleMonthInput(this._displayedMonth + 1);
                // If after going forward a month, we're in january, we went forward a year too
                if (cellMonth == 0) {
                    cellYear = this._displayedYear + 1;
                }
            }
            // Date is in current month
            else {
                // Highlight the cell if it matches the current date
                this._highlightIfCurrDate(calendarDayCell, cellDate);
                // Don't gray date - not rollover. Note: removing a nonexistent class does nothing
                calendarDayCell.classList.remove(rolloverDateClass);
                cellMonth = this._displayedMonth;
            }
            // Create a Date object for the cell
            const cellDateObj = new Date(cellYear, cellMonth, cellDate);
            this._markLogCompleteIfExists(calendarDayCell, cellDateObj);
            this._markAccomplishmentIfExists(calendarDayCell, cellDateObj);
        }
    }

    /**
     * Given a calendar day cell and its cell date (e.g. 16) to be displayed in the calendar table,
     * if it matches the current date, add "current-date" class to it to highlight it in css
     * Note: not supported for Internet Explorer 9 or Lower
     * @param {HTMLElement} calendarDayCell
     * @param {Number | string} cellDate
     */
    _highlightIfCurrDate(calendarDayCell, cellDate) {
        // Class that styles the current calednar day cell
        const todayClass = "current-date";
        // Check if the displayed cell's date matches the current date (date, month, year)
        if (
            cellDate === this._currentDate &&
            this._displayedMonth == this._currentMonth &&
            this._displayedYear == this._currentYear
        ) {
            // Note: classlist isn't supported on Internet Explorer 9 or lower */
            calendarDayCell.classList.add(todayClass);
        } else {
            // If class not in classlist, remove does nothing
            calendarDayCell.classList.remove(todayClass);
        }
    }

    /**
     * Given a calendarDayCell and a date object, if there is an accomplishment for that date,
     * add an icon and text in the cell in the month view to show there is an accomplishment
     * @param {HTMLElement} calendarDayCell html td element of a date
     * @param {Date} cellDateObj date of the calendarDayCell, based only on year, month, & date
     */
    _markAccomplishmentIfExists(calendarDayCell, cellDateObj) {
        const accomplishmentClass = "has-accomplishment";
        // If there are accomplishment(s) for the given date, update the calendarDayCell
        if (AccomplishmentsStorage.hasAccomplishmentsObjByDate(cellDateObj)) {
            // Create elements and update attributes
            // Container to hold icon and text
            const accomplishmentsMarker = document.createElement("div");
            // Text to show it's an accomplishment
            const accomplishmentText = document.createElement("span");
            // AccomplishmentText.innerHTML = "Accomplishment";
            accomplishmentText.style.fontSize = "17px";
            // Icon for the accomplishment
            const accomplishmentIcon = document.createElement("img");
            accomplishmentIcon.classList.add("accomplishment-icon");
            accomplishmentIcon.src = "../assets/icons/accomplishments-icon.svg";
            // Add elements to container and add container to page
            accomplishmentsMarker.appendChild(accomplishmentIcon);
            accomplishmentsMarker.appendChild(accomplishmentText);
            calendarDayCell.appendChild(accomplishmentsMarker);
            // Add class to style the accomplishments
            calendarDayCell.classList.add(accomplishmentClass);
        } else {
            calendarDayCell.classList.remove(accomplishmentClass);
        }
    }

    /**
     * Given a calendarDayCell and a date object, if there is a log for that date,
     * add a green checkmark icon to show there is a log for that date
     * @param {HTMLElement} calendarDayCell html td element of a date
     * @param {Date} cellDateObj
     */
    _markLogCompleteIfExists(calendarDayCell, cellDateObj) {
        const loggedIcon = document.createElement("img");
        loggedIcon.src = "../assets/icons/check-icon.svg";
        loggedIcon.classList.add("logged-icon");
        const checkmarkClass = "has-log";
        // If there is a log for the given date, update the calendarDayCell
        if (RecordsStorage.hasRecordByDate(cellDateObj)) {
            calendarDayCell.classList.add(checkmarkClass);
            calendarDayCell.appendChild(loggedIcon);
        } else {
            // Remove the class, and make sure there isn't any checkmark icon
            calendarDayCell.classList.remove(checkmarkClass);
        }
    }
}
// Export Calendar class for instantiation/use in other files
export { Calendar as Calendar };
