import expect from "expect";
import { Calendar } from "../../src/calendar/calendar-class.js";

describe("Calendar Class Unit Tests", () => {
    // create a new instance of the Calendar class, with elements to edit being
    // null (or empty array of the same length as calendarDayCells) and asyncUpdate being false.
    // This is because we don't test it's UI updates (that's for E2E testing)
    // and we don't want it to keep running after tests are complete (while it checks for midnight)
    const calendar = new Calendar(null, Array(42), false);

    /*
    test constructor: given an html element for the header, one for a list of elements of calendar Day cells, and an optional asyncUpdate parameter for updating dates (set to false here), 
    initialize private member variables on current and displayed dates
    */
    test("test constructor refreshes date", () => {
        // Get the current dates to check against constructor
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();
        // check current dates got initialized
        expect(calendar._currentYear).toBe(currentYear);
        expect(calendar._currentMonth).toBe(currentMonth);
        expect(calendar._currentDate).toBe(currentDate);
        // check displayed dates got initialized
        expect(calendar._displayedYear).toBe(currentYear);
        expect(calendar._displayedMonth).toBe(currentMonth);
    });

    // test _handleMonthInput: takes in int, returns int between 0, 11 inclusive
    test("Test _handleMonthInput", () => {
        // It shouldn't modify ints between 0 and 11 inclusive since they are proper months
        for (let normalMonth = 0; normalMonth < 12; normalMonth++) {
            expect(calendar._handleMonthInput(normalMonth)).toBe(normalMonth);
        }
        // it should modify any int above 11 to be the int % 12
        for (let i = 12; i < 144; i++) {
            expect(calendar._handleMonthInput(i)).toBe(i % 12);
        }
        // for any negative above -12, it should be 12 + negative number (aka 12 - positive)
        for (let negNum = -1; negNum > -12; negNum--) {
            // Ex: -1 is 1 month before Jan (0) --> should be Dec (11)
            expect(calendar._handleMonthInput(negNum)).toBe(12 + negNum);
        }
        // for negatives below -12, it should be 12 + (negative % 12)  (aka 12 - positive % 12)
        for (let negNum = -12; negNum > -144; negNum--) {
            // Ex: -13 is 13 months before Jan (0) --> should be Dec (11)
            expect(calendar._handleMonthInput(negNum)).toBe(12 + (negNum % 12));
        }
    });

    // test _refreshCurrentDate: updates member variables _currentYear, _currentMonth, _currentDate
    test("test _refreshCurrentDate refreshes date", () => {
        // set calendar's private member variables to a different year, month, date (01/01/2023)
        calendar._currentYear = 2023;
        calendar._currentMonth = 1;
        calendar._currentDate = 1;
        // check that after refresh, member variables have updated to current year, month, date
        calendar._refreshCurrentDate();
        const now = new Date();
        expect(calendar._currentYear).toBe(now.getFullYear());
        expect(calendar._currentMonth).toBe(now.getMonth());
        expect(calendar._currentDate).toBe(now.getDate());
    });

    // test _getMonthLastDay: given a YearInt and monthInt, returns a day (0->6) inclusive
    test("test _getMonthLastDay gets correct day", () => {
        // test various hardcoded years/months
        // August (7) 2022 -  should have a last day of Wednesday (3)
        expect(calendar._getMonthLastDay(2022, 7)).toBe(3);
        // January (0) 2023 - should have a last day of Tuesday (2)
        expect(calendar._getMonthLastDay(2023, 0)).toBe(2);
        // February (1) 2024 - should have a last day of Thursday (4)
        expect(calendar._getMonthLastDay(2024, 1)).toBe(4);
        // November (10) 2025 - should have a last day of Sunday (0)
        expect(calendar._getMonthLastDay(2025, 10)).toBe(0);
        // December (11) 2026 - should have a last day of Thursday (4)
        expect(calendar._getMonthLastDay(2026, 11)).toBe(4);
    });

    // test _getMonthLastDate: given a YearInt and monthInt, returns a date (0->31) inclusive
    test("test _getMonthLastDate gets correct date", () => {
        // test various hardcoded years/months
        //February (1) 2024 - should have a last date of 29
        expect(calendar._getMonthLastDate(2024, 1)).toBe(29);
        //June (5) 2022 - should have a last date of 30
        expect(calendar._getMonthLastDate(2022, 5)).toBe(30);
        //April (3) 2024 - should have a last date of 30
        expect(calendar._getMonthLastDate(2024, 3)).toBe(30);
        //May (11) 2025 - should have a last date of 31
        expect(calendar._getMonthLastDate(2025, 4)).toBe(31);
        //February (1) 2023 - should have a last date of 28
        expect(calendar._getMonthLastDate(2023, 1)).toBe(28);
    });

    // returns true if it matches, false otherwise
    function compareDateLists(expectedDates, returnedDates) {
        // check that dates arrays are the same length
        if (!(returnedDates.length === expectedDates.length)) {
            return false;
        }
        // check that each element in the arrays match
        for (let i = 0; i < returnedDates.length; i++) {
            if (returnedDates[i] != expectedDates[i]) {
                return false;
            }
        }
        // if all goes well, it passes
        return true;
    }
    //test _getPrevMonthRollOverDates: given a year and a month, return all of the dates from the previous month that will roll over to the current month's calendar.
    test("_getPrevMonthRollOverDates, February 2023", () => {
        // set up test
        const february = 1;
        const testMonth = february;
        const testYear = 2023;
        const expectedDates = [29, 30, 31];
        const returnedDates = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        // check returned vs expected
        const allDatesCorrect = compareDateLists(expectedDates, returnedDates);
        expect(allDatesCorrect).toBe(true);
    });

    //test _getPrevMonthRollOverDates: given a year and a month, return all of the dates from the previous month that will roll over to the current month's calendar.
    test("_getPrevMonthRollOverDates, June 2024", () => {
        // set up test
        const june = 5;
        const testMonth = june;
        const testYear = 2024;
        const expectedDates = [26, 27, 28, 29, 30, 31];
        const returnedDates = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        // check returned vs expected
        const allDatesCorrect = compareDateLists(expectedDates, returnedDates);
        expect(allDatesCorrect).toBe(true);
    });
    //test _getCurrMonthRollOverDates: given a year and a month, return all of the dates of the current month.
    test("_getCurrMonthRollOverDates, November 2025", () => {
        // set up test
        const november = 10;
        const testMonth = november;
        const testYear = 2025;
        const exptectedDates = [];
        for (let i = 1; i <= 30; i++) {
            exptectedDates.push(i);
        }
        const returnedDates = calendar._getCurrMonthDates(testYear, testMonth);
        // check returned vs expected
        const allDatesCorrect = compareDateLists(exptectedDates, returnedDates);
        expect(allDatesCorrect).toBe(true);
    });
    //test _getCurrMonthRollOverDates: given a year and a month, return all of the dates of the current month.
    test("_getCurrMonthDates, February 2024", () => {
        // set up test
        const february = 1;
        const testMonth = february;
        const testYear = 2024;
        const expectedDates = [];
        for (let i = 1; i <= 29; i++) {
            expectedDates.push(i);
        }
        const returnedDates = calendar._getCurrMonthDates(testYear, testMonth);
        // check returned vs expected
        const allDatesCorrect = compareDateLists(expectedDates, returnedDates);
        expect(allDatesCorrect).toBe(true);
    });
    //test _getNextMonthRollOverDates: given a year and a month, return all of the dates of the next month that will roll over on the current month's calendar
    test("_getNextMonthRollOverDates, September 2023", () => {
        // set up test
        const september = 8;
        const testMonth = september;
        const testYear = 2023;
        // nextMonthRollOverDates needs how many dates were generated from the previous months
        const prevRollOver = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        const currDates = calendar._getCurrMonthDates(testYear, testMonth);
        const numDatesGenerated = prevRollOver.length + currDates.length;
        const expectedDates = [1, 2, 3, 4, 5, 6, 7];
        const returnedDates =
            calendar._getNextMonthRolloverDates(numDatesGenerated);
        // check returned vs expected
        const allDatesCorrect = compareDateLists(expectedDates, returnedDates);
        expect(allDatesCorrect).toBe(true);
    });
    //test _getNextMonthRollOverDates: given a year and a month, return all of the dates of the next month that will roll over on the current month's calendar
    test("_getNextMonthRollOverDates, January 2024", () => {
        // set up test
        const january = 0;
        const testMonth = january;
        const testYear = 2024;
        // nextMonthRollOverDates needs how many dates were generated from the previous months
        const prevRollOver = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        const currDates = calendar._getCurrMonthDates(testYear, testMonth);
        const numDatesGenerated = prevRollOver.length + currDates.length;
        const expectedDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const returnedDates =
            calendar._getNextMonthRolloverDates(numDatesGenerated);
        // check returned vs expected
        const allDatesCorrect = compareDateLists(expectedDates, returnedDates);
        expect(allDatesCorrect).toBe(true);
    });
    //test _getMonthStrFromInt: given an int, return the corresponding string of the month eg. 1 -> February
    test("_getMonthStrFromInt", () => {
        //set up test
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
        //test that each int from 0-11 returns the correct corresponding string of the month 
        for (let i = 0; i < 12; i++){
            expect(calendar._getMonthStrFromInt(i)).toBe(months[i])
        }
    })
});
