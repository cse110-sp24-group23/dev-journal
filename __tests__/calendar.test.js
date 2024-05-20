import { Calendar } from "../src/calendar/calendar-class.js";

describe("Calendar Class Unit Tests", () => {
    const calendar = new Calendar(null, null, false);

    test("Test _handleMonthInput", () => {
        expect(calendar._handleMonthInput(12)).toBe(0);
    });
    test("test constructor refreshes date", () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();
        expect(calendar._currentYear).toBe(currentYear);
        expect(calendar._currentMonth).toBe(currentMonth);
        expect(calendar._currentDate).toBe(currentDate);
    });
});
