import { assert } from "console";
import { Calendar } from "../src/calendar/calendar-class.js";

describe("Calendar Class Unit Tests", () => {
    const calendar = new Calendar(null, Array(42), false);

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

    test("_getPrevMonthRollOverDates, February 2023", () => {
        const february = 1;
        const testMonth = february;
        const testYear = 2023;
        const exptectedPrevRollOver = [29, 30, 31];
        const returned = calendar._getPrevMonthRolloverDates(testYear, testMonth)
        var allDatesCorrect = true
        expect(returned.length).toBe(exptectedPrevRollOver.length)
        for(let i = 0; i < returned.length; i++){
            if(returned[i] != exptectedPrevRollOver[i]){
                allDatesCorrect = false
            }
        }
        expect(allDatesCorrect).toBe(true)
    });
    test("_getPrevMonthRollOverDates, June 2024", () => {
        const june = 5;
        const testMonth = june;
        const testYear = 2024;
        const expectedPrevRollOver = [26, 27, 28, 29, 30, 31];
        const returned = calendar._getPrevMonthRolloverDates(testYear, testMonth)
        var allDatesCorrect = true
        expect(returned.length).toBe(expectedPrevRollOver.length)
        for(let i = 0; i < returned.length; i++){
            if(returned[i] != expectedPrevRollOver[i]){
                allDatesCorrect = false
            }
        }
        expect(allDatesCorrect).toBe(true)
    });
    test("_getCurrMonthRollOverDates, November 2025", () => {
        const november = 10;
        const testMonth = november;
        const testYear = 2025;
        const exptectedCurrDates = []
        for(let i = 1; i <= 30; i++){
            exptectedCurrDates.push(i)
        }
        const returned = calendar._getCurrMonthDates(testYear, testMonth)
        var allDatesCorrect = true
        expect(returned.length).toBe(exptectedCurrDates.length)
        for(let i = 0; i < returned.length; i++){
            if(returned[i] != exptectedCurrDates[i]){
                allDatesCorrect = false
            }
        }
        expect(allDatesCorrect).toBe(true)
    });
    test("_getCurrMonthRollOverDates, February 2024", () => {
        const february = 1;
        const testMonth = february;
        const testYear = 2024;
        const expectedCurrDates = []
        for(let i = 1; i <= 29; i++){
            expectedCurrDates.push(i)
        }
        const returned = calendar._getCurrMonthDates(testYear, testMonth)
        var allDatesCorrect = true
        expect(returned.length).toBe(expectedCurrDates.length)
        for(let i = 0; i < returned.length; i++){
            if(returned[i] != expectedCurrDates[i]){
                allDatesCorrect = false
            }
        }
        expect(allDatesCorrect).toBe(true)
    });
    test("_getNextMonthRollOverDates, September 2023", () => {
        const september = 8;
        const testMonth = september;
        const testYear = 2023;
        const prevRollOver = calendar._getPrevMonthRolloverDates(testYear, testMonth)
        const currDates = calendar._getCurrMonthDates(testYear, testMonth)
        const numDatesGenerated = prevRollOver.length + currDates.length
        const expectedNextRollOver = [1,2,3,4,5,6,7]
        var allDatesCorrect = true
        const returned = calendar._getNextMonthRolloverDates(numDatesGenerated)
        expect(returned.length).toBe(expectedNextRollOver.length)
        for(let i = 0; i < returned.length; i++){
            if(returned[i] != expectedNextRollOver[i]){
                allDatesCorrect = false
            }
        }
        expect(allDatesCorrect).toBe(true)
    });
    test("_getNextMonthRollOverDates, January 2024", () => {
        const january = 0;
        const testMonth = january;
        const testYear = 2024;
        const prevRollOver = calendar._getPrevMonthRolloverDates(testYear, testMonth)
        const currDates = calendar._getCurrMonthDates(testYear, testMonth)
        const numDatesGenerated = prevRollOver.length + currDates.length
        const expectedNextRollOver = [1,2,3,4,5,6,7,8,9,10]
        var allDatesCorrect = true
        const returned = calendar._getNextMonthRolloverDates(numDatesGenerated)
        expect(returned.length).toBe(expectedNextRollOver.length)
        for(let i = 0; i < returned.length; i++){
            if(returned[i] != expectedNextRollOver[i]){
                allDatesCorrect = false
            }
        }
        expect(allDatesCorrect).toBe(true)
    });
});
