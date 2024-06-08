import {
    filterAccomplishments,
    sortAccomplishments,
} from "../../src/accomplishments/accomplishments";

/*
Takes in options (object containing byYear and byMonth)
Returns an accomplishments object array that is filtered by none, current year, or current month
*/
function getAccomplishmentsObjArr(
    options = { byCurrentYear: false, byCurrentMonth: false }
) {
    // Get current year and month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let differentMonth;
    // Get a different month in the same year
    if (currentMonth == 11) {
        differentMonth = currentMonth - 1; // If it's december, go back a month
    } else {
        differentMonth = currentMonth + 1; // Otherwise get the next month
    }
    // Create mock Accomplishments Objects
    // Dates
    // Current month
    const date1 = new Date(currentYear, currentMonth, 22);
    const date2 = new Date(currentYear, currentMonth, 7);
    const date3 = new Date(currentYear, currentMonth, 5);
    // Current year
    const date4 = new Date(currentYear, differentMonth, 20);
    // Neither
    const date5 = new Date(2023, 5, 12);

    // Contents
    const content1 = ["Made a new accomplishment", "pushed code."];
    const content2 = ["Wrote E2E tests"];
    const content3 = [
        "Finished the month's accomplishments",
        "Added another one",
    ];
    const content4 = ["Wrote unit tests"];
    const content5 = ["Wrote integration tests"];

    // Filter objects by month, year, or none
    let dates;
    let contents;
    if (options.byCurrentMonth) {
        // Filtered by current month
        dates = [date1, date2, date3];
        contents = [content1, content2, content3];
    } else if (options.byCurrentYear) {
        // Filtered by current year
        dates = [date1, date2, date3, date4];
        contents = [content1, content2, content3, content4];
    } else {
        // Not filtered
        dates = [date1, date2, date3, date4, date5];
        contents = [content1, content2, content3, content4, content5];
    }
    // Create a mock Accomplishments Object array
    const accomplishmentsObjArr = [];
    for (let i = 0; i < dates.length; i++) {
        let accomplishemntObj = {
            content: contents[i],
            date: dates[i],
            id: dates[i].getTime(),
        };
        accomplishmentsObjArr.push(accomplishemntObj);
    }
    return accomplishmentsObjArr;
}

/*
Takes in 2 accomplishments object arrays
Returns true if they are the same, false otherwise
*/
function compareAccomplishmentsObjArrs(expectedArr, resultArr) {
    // Check the lengths match
    if (expectedArr.length !== resultArr.length) {
        console.log("Lengths don't match");
        return false;
    }
    // Check accomplishments objects match
    for (let i = 0; i < expectedArr; i++) {
        let expectedObj = expectedArr[i];
        let resultObj = resultArr[i];
        // Check the dates match
        if (expectedObj.date.getTime() !== resultObj.date.getTime()) {
            console.log("Dates don't match");
            return false;
        }
        // Check the contents match
        let expectedContent = expectedObj.content;
        let resultContent = resultObj.content;
        if (expectedContent.length !== resultContent.length) {
            console.log("Content lengths don't match");
            return false;
        }
        // Loop through contents to make sure
        for (let j = 0; j < expectedContent.length; j++) {
            if (expectedContent[j] !== resultContent[j]) {
                console.log("Contents don't match");
                return false;
            }
        }
    }
    // If nothing fails, return true
    return true;
}

describe("Accomplishments Unit Tests", () => {
    test("Test filterAccomplishments", () => {
        // create filter settings
        const filterByNone = {
            byCurrentYear: false,
            byCurrentMonth: false,
        };
        const filterByMonth = {
            byCurrentYear: false,
            byCurrentMonth: true,
        };
        const filterByYear = {
            byCurrentYear: true,
            byCurrentMonth: false,
        };
        // Get expected accomplishments object arrays
        const unfilteredExpected = getAccomplishmentsObjArr(filterByNone);
        const monthFilteredExpected = getAccomplishmentsObjArr(filterByMonth);
        const yearFilteredExpected = getAccomplishmentsObjArr(filterByYear);
        // Get returned accomplishments object arrays
        const unfilteredResult = filterAccomplishments(
            unfilteredExpected,
            filterByNone
        );
        const monthFilteredResult = filterAccomplishments(
            unfilteredExpected,
            filterByMonth
        );
        const yearFilteredResult = filterAccomplishments(
            unfilteredExpected,
            filterByYear
        );
        // Check that each returned accomplishments object array matches the expected value
        const unfilteredMatches = compareAccomplishmentsObjArrs(
            unfilteredExpected,
            unfilteredResult
        );
        const monthFilteredMatches = compareAccomplishmentsObjArrs(
            monthFilteredExpected,
            monthFilteredResult
        );
        const yearFilteredMatches = compareAccomplishmentsObjArrs(
            yearFilteredExpected,
            yearFilteredResult
        );
        expect(unfilteredMatches).toBe(true);
        console.log(monthFilteredExpected, monthFilteredResult);
        expect(monthFilteredMatches).toBe(true);
        expect(yearFilteredMatches).toBe(true);
    });
});
