import expect from "expect";
import { Calendar } from "../src/calendar/calendar-class.js";

describe("Calendar Class Unit Tests", () => {
    // create a new instance of the Calendar class, with elements to edit being
    // null (or empty array of the same length as calendarDayCells) and asyncUpdate being false.
    // This is because we don't test it's UI updates (that's for E2E testing)
    // and we don't want it to keep running after tests are complete (while checking for midnight)
    const calendar = new Calendar(null, Array(42), false);

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
    });

    // test _getMonthLastDay: given a YearInt and monthInt, returns a day (0->6) inclusive
    test("test _getMonthLastDay gets correct day", () => {
        // test various hardcoded years/months
    });

    test("test constructor refreshes date", () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();
        expect(calendar._currentYear).toBe(currentYear);
        expect(calendar._currentMonth).toBe(currentMonth);
        expect(calendar._currentDate).toBe(currentDate);
        // check displayed dates got initialized too
        expect(calendar._displayedYear).toBe(currentYear);
        expect(calendar._displayedMonth).toBe(currentMonth);
    });
});
