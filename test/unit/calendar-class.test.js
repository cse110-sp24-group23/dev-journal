import expect from "expect";
import { Calendar } from "../../src/calendar/calendar-class.js";

describe("Calendar Class Unit Tests", () => {
    // create a new instance of the Calendar class, with elements to edit being
    // null (or empty array of the same length as calendarDayCells) and asyncUpdate being false.
    // This is because we don't test it's UI updates (that's for E2E testing)
    // and we don't want it to keep running after tests are complete (while checking for midnight)
    const calendar = new Calendar(null, Array(42), false);

    /*
    test constructor: given an html element for the header, one for a list of elements of calendar Day cells, and an optional asyncUpdate parameter for updating dates (set to false here), 
    initialize private member variables on current and displayed dates
    */
    test("test constructor refreshes date", () => {
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
        // January 2023
        // March 2024
        // September 2025
    });

    // test _getMonthLastDay: given a YearInt and monthInt, returns a day (0->6) inclusive
    test("test _getMonthLastDay gets correct day", () => {
        // test various hardcoded years/months
    });

    // // returns true if it matches, false otherwise
    // function testGetDateList(yearInt, monthInt, expectedDates, func) {
    //     if (!["prev", "curr", "next"].contains(func)) {
    //         throw Error("func must be in ['prev', 'curr', 'next'] ");
    //     }

    //     // initialize returnedDates based on which function to use
    //     let returnedDates;
    //     if (func == "prev") {
    //         returnedDates = calendar._getPrevMonthRolloverDates(
    //             yearInt,
    //             monthInt
    //         );
    //     } else if (func == "curr") {
    //         returnedDates = calendar._getCurrMonthDates(yearInt, monthInt);
    //     } else {
    //         returnedDates =
    //             calendar._getNextMonthRolloverDates(numDatesGenerated);
    //     }

    //     if (!(returnedDates.length === expectedDates.length)) {
    //         console.log("date lengths don't match");
    //         return false;
    //     }
    //     for (let i = 0; i < returnedDates.length; i++) {
    //         if (returnedDates[i] != expectedDates[i]) {
    //             return false;
    //         }
    //     }
    //     // if all goes well, it passes
    //     return true;
    // }

    // test("_getPrevMonthRollOverDates, February 2023", () => {
    //     const february = 1;
    //     const testMonth = february;
    //     const testYear = 2023;
    //     const exptectedPrevRollOver = [29, 30, 31];
    //     allDatesCorrect = testGetDateList(
    //         testYear,
    //         testMonth,
    //         exptectedPrevRollOver
    //     );
    // });

    test("_getPrevMonthRollOverDates, June 2024", () => {
        const june = 5;
        const testMonth = june;
        const testYear = 2024;
        const expectedPrevRollOver = [26, 27, 28, 29, 30, 31];
        const returned = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        var allDatesCorrect = true;
        expect(returned.length).toBe(expectedPrevRollOver.length);
        for (let i = 0; i < returned.length; i++) {
            if (returned[i] != expectedPrevRollOver[i]) {
                allDatesCorrect = false;
            }
        }
        expect(allDatesCorrect).toBe(true);
    });

    test("_getCurrMonthRollOverDates, November 2025", () => {
        const november = 10;
        const testMonth = november;
        const testYear = 2025;
        const exptectedCurrDates = [];
        for (let i = 1; i <= 30; i++) {
            exptectedCurrDates.push(i);
        }
        const returned = calendar._getCurrMonthDates(testYear, testMonth);
        var allDatesCorrect = true;
        expect(returned.length).toBe(exptectedCurrDates.length);
        for (let i = 0; i < returned.length; i++) {
            if (returned[i] != exptectedCurrDates[i]) {
                allDatesCorrect = false;
            }
        }
        expect(allDatesCorrect).toBe(true);
    });

    test("_getCurrMonthDates, February 2024", () => {
        const february = 1;
        const testMonth = february;
        const testYear = 2024;
        const expectedCurrDates = [];
        for (let i = 1; i <= 29; i++) {
            expectedCurrDates.push(i);
        }
        const returned = calendar._getCurrMonthDates(testYear, testMonth);
        var allDatesCorrect = true;
        expect(returned.length).toBe(expectedCurrDates.length);
        for (let i = 0; i < returned.length; i++) {
            if (returned[i] != expectedCurrDates[i]) {
                allDatesCorrect = false;
            }
        }
        expect(allDatesCorrect).toBe(true);
    });

    test("_getNextMonthRollOverDates, September 2023", () => {
        const september = 8;
        const testMonth = september;
        const testYear = 2023;
        const prevRollOver = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        const currDates = calendar._getCurrMonthDates(testYear, testMonth);
        const numDatesGenerated = prevRollOver.length + currDates.length;
        const expectedNextRollOver = [1, 2, 3, 4, 5, 6, 7];
        var allDatesCorrect = true;
        const returned = calendar._getNextMonthRolloverDates(numDatesGenerated);
        expect(returned.length).toBe(expectedNextRollOver.length);
        for (let i = 0; i < returned.length; i++) {
            if (returned[i] != expectedNextRollOver[i]) {
                allDatesCorrect = false;
            }
        }
        expect(allDatesCorrect).toBe(true);
    });

    test("_getNextMonthRollOverDates, January 2024", () => {
        const january = 0;
        const testMonth = january;
        const testYear = 2024;
        const prevRollOver = calendar._getPrevMonthRolloverDates(
            testYear,
            testMonth
        );
        const currDates = calendar._getCurrMonthDates(testYear, testMonth);
        const numDatesGenerated = prevRollOver.length + currDates.length;
        const expectedNextRollOver = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var allDatesCorrect = true;
        const returned = calendar._getNextMonthRolloverDates(numDatesGenerated);
        expect(returned.length).toBe(expectedNextRollOver.length);
        for (let i = 0; i < returned.length; i++) {
            if (returned[i] != expectedNextRollOver[i]) {
                allDatesCorrect = false;
            }
        }
        expect(allDatesCorrect).toBe(true);
    });
});
