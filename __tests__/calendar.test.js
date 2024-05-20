import { Calendar } from "../src/calendar/calendar-class.js";

describe("Calendar Class Unit Tests", () => {
    const calendar = new Calendar(null, null, false);

    test("Test _handleMonthInput", () => {
        expect(calendar._handleMonthInput(12)).toBe(0);
    });
});
