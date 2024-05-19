/*
TODO: 
    - add dateLink function from calendar.js as a public method
    - rename this to calendarClass.js or something along those lines
    - keep track that we don't have highlighted days for Internet Explorer 9 or Lower
*/
class Calendar {
    // current date
    _currentYear;
    _currentMonth;
    _currentDate;
    // displayed date
    _displayedMonth;
    _displayedYear;
    // public member variables initialized in constructor
    calendarHeading; // Header tag that has month and year text
    calendarCellElements; // list of calendar day cells that this class edits

    /*
    ================================================
                    PUBLIC METHODS
    ================================================
    */

    /*
    Given a list of calendar day cells (most likely td elements of classname js-calendar-day)
    Sets current date, display date, and montiors current date (updates every midnight)
    */
    constructor(calendarHeading, calendarCellElements) {
        this.calendarHeading = calendarHeading;
        this.calendarCellElements = calendarCellElements;
        this._refreshCurrentDate();
        this._initDisplayDate();
        this._monitorCurrDate();
    }

    /*
    Display the dates of a given year & month in the calendar
    Parameters:
        - yearInt: Int representation of year (ex: 2024). Default is current year
        - monthInt: Int representation of month from 0 (Jan) to 11 (Dec). Default is current month
    Returns:
        - None, but does edit calendar display on website
    */
    populateMonthView(
        yearInt = this._currentYear,
        monthInt = this._currentMonth
    ) {
        // handle input for month - year doesn't need it since there is no cyclic nature like months
        monthInt = this._handleMonthInput(monthInt);
        // create array of dates in calendar table (42 when full - 6 rows, 7 columns)
        let datesList = [];
        // get final days from previous month and update datesList
        const prevRollover = this._getPrevMonthRolloverDates(yearInt, monthInt);
        datesList = datesList.concat(prevRollover);
        // get all days for current month and update partialDatesList
        const currDates = this._getCurrMonthDates(yearInt, monthInt);
        datesList = datesList.concat(currDates);
        // get first days of next month and update partialDatesList
        // datesList is passed in to calculate how mnay days left to generate
        const nextRollover = this._getNextMonthRolloverDates(datesList.length);
        datesList = datesList.concat(nextRollover);

        // update the calendar heading text
        const monthStr = this._getMonthStrFromInt(monthInt);
        const calenderHeadingText = monthStr + " " + String(yearInt);
        this.calendarHeading.innerText = calenderHeadingText;

        // update month view in the UI - set dates (gray & black), highlight current day
        this._populateCalendarMonth(datesList);
    }

    /*
    Display the dates of the next month to be displayed in the calendar
    Parameters:
        - None, but uses this._displayedYear & this._displayedMonth to find next month to display
    Returns:
        - None, but does edit calendar display on website
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

    /*
    Display the dates of the previous month to be displayed in the calendar
    Parameters:
        - None, but uses this._displayedYear & this._displayedMonth to find previous month to display
    Returns:
        - None, but does edit calendar display on website
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

    /*
    ================================================
                    PRIVATE METHODS
    ================================================
    */

    /*
    Resets current date member variables: this._currentYear, this._currentMonth, this._currentDay.
    Is used to initialize dates for today and reset them after midnight.
    */
    _refreshCurrentDate() {
        const now = new Date();
        this._currentYear = now.getFullYear();
        this._currentMonth = now.getMonth();
        this._currentDate = now.getDate();
    }

    /*
    Initializes display date member variables to be based on current date.
    Is used for setting up calendar display
    */
    _initDisplayDate() {
        this._displayedYear = this._currentYear;
        this._displayedMonth = this._currentMonth;
    }

    /*
    Given a month as an integer, monthInt, if monthInt is between 0 and 11, return monthInt.
    Otherwise make it positive and mod by 12 to handle any month operations like month+1.
    Ex: 
    let currMonth = 11;  // december (11)
    nextMonth = currMonth + 1;  // should be jan (0) but is 12 instead
    nextMonth = _handleMonthInput(nextMonth)  // is now 0 (jan) as expected
    */
    _handleMonthInput(monthInt) {
        if (!Number.isInteger(monthInt)) {
            throw new Error("monthInt must be an integer");
        }
        // take absolute value to make positive, then mod by 12 to get between 0 and 11
        return Math.abs(monthInt) % 12;
    }

    /*
    Given a month and year, both as integers, return an array of the rollover dates from the 
    previous month to be put in the calendar display.
    Ex: if the first of the currently displayed month is Tuesday, Sun and Mon will be the last 2 
    dates of the previous month. Sun (30), Mon (31), Tue (1), ... It would therefore return [30, 31]
    Parameters:
        - yearInt: Integer representing year. Ex: 2024
        - monthInt: Integer between 0 and 11 representing month. Ex: 11 (December)
    Returns:
        - array of dates (ints) to be added to a calendarDateList
    */
    _getPrevMonthRolloverDates(yearInt, monthInt) {
        // Get the last date of the previous month (usually 30 or 31 - except Feb)
        // monthInt input is handled inside getMonthLastDate -> monthInt = 0-1 is fine to pass in
        let prevMonthLastDate = this._getMonthLastDate(yearInt, monthInt - 1);
        // Get the day of the 1st of the current month (e.g. Wednesday)
        let currMonthfirstDay = new Date(yearInt, monthInt, 1).getDay();
        // Get the date of the first sunday in the month view (first cell in calendar table)
        let firstSundayDate = prevMonthLastDate - currMonthfirstDay + 1;
        // get array of last days from the previous month to put before the 1st of the current month
        let partialDateList = [];
        for (
            let prevMonthDay = 0;
            prevMonthDay < currMonthfirstDay;
            prevMonthDay++
        ) {
            // get date of rollover day from prev month
            let rolloverDate = firstSundayDate + prevMonthDay;
            partialDateList.push(rolloverDate);
        }
        return partialDateList;
    }

    /*
    Given a month and year, both as integers, return an array of the dates of the given month.
    Ex: for march, it would return [1, 2, ..., 31]
    Parameters:
        - yearInt: Integer representing year. Ex: 2024
        - monthInt: Integer between 0 and 11 representing month. Ex: 11 (December)
    Returns:
        - array of dates (ints) to be added to a calendarDateList
    */
    _getCurrMonthDates(yearInt, monthInt) {
        // get the last date of the current displayed month
        const currMonthLastDate = this._getMonthLastDate(yearInt, monthInt);
        // fill array with dates from 1 til final date of the month
        let partialDateList = [];
        for (let i = 0; i < currMonthLastDate; i++) {
            // get date in month, append to partialDateList
            let currMonthDate = i + 1;
            partialDateList.push(currMonthDate);
        }
        return partialDateList;
    }

    /*
    Given a number of dates generated so far for the calendar display, return an array of rollover 
    dates from the next month to be put in the calendar display. Ex: if the current displayed month 
    ends on Wed, then it will have 1 for Thu, 2 for Fri, 3 for Sat, so it returns [1, 2, 3]
    Parameters:
        - numDatesFilled: Integer - length of the partialDatesList which contains dates from previous month rollover and current month
    Returns:
        - array of dates (ints) to be added to a calendarDateList
    */
    _getNextMonthRolloverDates(numDatesGenerated) {
        // fill array with rollover days from start of next month to be displayed in calendar
        let partialDateList = [];
        // number of days to fill is total calendar cells - number of currently generated dates
        let daysToFill = this.calendarCellElements.length - numDatesGenerated;
        for (let i = 0; i < daysToFill; i++) {
            // get rollover date (e.g. 1, 2, 3, etc.) and add it to partialDateList
            let rolloverDate = i + 1;
            partialDateList.push(rolloverDate);
        }
        return partialDateList;
    }

    /*
    Given a month and year, both as integers, return an integer representation of the last day of 
    the month. Ex: if the last day is Wed, returns 3
    Parameters:
        - yearInt: Integer representing year. Ex: 2024
        - monthInt: Integer between 0 and 11 representing month. Ex: 11 (December)
    Returns:
        - Day of week as an integer (0 through 6), where Sun = 0, Sat = 6
    */
    _getMonthLastDay(yearInt, monthInt) {
        monthInt = this._handleMonthInput(monthInt);
        // get the last day of prevMonth
        const prevMonthLastDay = new Date(yearInt, monthInt + 1, 0).getDay(); //Date handles overflow of monthInt+1 automatically (e.g. Dec=11, so we pass in 12 for Jan)
        return prevMonthLastDay;
    }

    /*
    Given a month and year, both as integers, return the last date of the month. Ex: 31
    Parameters:
        - yearInt: Integer representing year. Ex: 2024
        - monthInt: Integer between 0 and 11 representing month. Ex: 11 (December)
    Returns:
        - Last date of month (integer) - should be 28, 29, 30, or 31 depending on the month
    */
    _getMonthLastDate(yearInt, monthInt) {
        monthInt = this._handleMonthInput(monthInt);
        // get the last day of prevMonth
        const prevMonthLastDate = new Date(yearInt, monthInt + 1, 0).getDate(); //Date handles overflow of monthInt+1 automatically (e.g. Dec=11, so we pass in 12 for Jan)
        return prevMonthLastDate;
    }

    /*
    Given an int that represents a month, return a string of the month it represents
    Ex: 0 returns January, 10 returns November
    Parameters:
        - monthInt: integer representing a month between 0 (Jan) and 11 (Dec)
    Returns:
        - a string of the month the number represents (January through December)
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
        // otherwise, return the correct month
        return return_month;
    }

    /*
    Updates the privately stored current date every day change.
    This is in case a user keeps the calendar page open without refreshing between days.
    Returns:
        - None, but calls this._refreshCurrentDate every 24 hours
    */
    _monitorCurrDate() {
        const delay = this._milisecondsUntilMidnight();
        setTimeout(this._refreshCurrentDate, delay);
        setInterval(this._refreshCurrentDate, 1000 * 60 * 60 * 24);
    }

    /*
    Returns the miliseconds until midnight
    is used to find the first time to refresh the current date in _monitorCurrDate()
    */
    _milisecondsUntilMidnight() {
        // define midnight
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        // return the seconds between now and midnight
        return midnight.getTime() - new Date().getTime();
    }

    /*
    Given a calendar date list (from populateMonthView), put all of the dates into the calendar 
    in the HTML, make the rollover dates gray, and highlight the current day
    Parameters:
        - calendarDateList: an array (of length 6*7 = 42) dates of previous ending month, 
        current display month dates, and start of next month dates. 
            - Ex: [30, 31, 1, 2, ..., 30, 1, 2, 3] <-- length = 42
    Returns:
        - None, but does modify the calendar table HTML
     */
    _populateCalendarMonth(calendarDateList) {
        // class that grays out the text of a date
        const rolloverDateClass = "rollover-date";
        // There are exactly 2 `1`s in calendarDateList: start of curr month & start of next month
        // Use them later to gray out rollover dates (dates not in current month)
        const currMonthStartIdx = calendarDateList.indexOf(1);
        const nextMonthStartIdx = calendarDateList.lastIndexOf(1);
        // get list of all day cells in calendar table
        for (let i = 0; i < this.calendarCellElements.length; i++) {
            // get the calendar day cell to edit (html element: td)
            const calendarDayCell = this.calendarCellElements[i];
            // get the date (e.g. 14) and put it into the cell
            const cellDate = calendarDateList[i];
            calendarDayCell.innerText = cellDate;
            // highlight the cell if it matches the current date
            this._highlightIfCurrDate(calendarDayCell, cellDate);
            // if it isn't the current month, gray it out
            if (i < currMonthStartIdx || i >= nextMonthStartIdx) {
                // gray out rollover dates for prev and next month that are displayed
                calendarDayCell.classList.add(rolloverDateClass);
            } else {
                // otherwise, don't gray it. Note: removing a class that isn't there does nothing
                calendarDayCell.classList.remove(rolloverDateClass);
            }
        }
    }

    /*
    Given a calendar day cell and its cell date (e.g. 16) to be displayed in the calendar table,
    if it matches the current date, add "current-date" class to it to highlight it in css
    Parameters:
        - calendarDayCell: html td element of current date
        - cellDate: the date of the calendar day cell (it's innerText)
    Returns:
        - None, but does potentially add a class to highlight the cell in css
    */
    _highlightIfCurrDate(calendarDayCell, cellDate) {
        // class that styles the current calednar day cell
        const todayClass = "current-date";
        // check if the displayed cell's date matches the current date (date, month, year)
        if (
            cellDate === this._currentDate &&
            this._displayedMonth == this._currentMonth &&
            this._displayedYear == this._currentYear
        ) {
            // note: classlist isn't supported on Internet Explorer 9 or lower */
            calendarDayCell.classList.add(todayClass);
        } else if (calendarDayCell.classList.contains(todayClass)) {
            calendarDayCell.classList.remove(todayClass);
        }
    }
}
// export Calendar class for instantiation/use in other files
export { Calendar as Calendar };
