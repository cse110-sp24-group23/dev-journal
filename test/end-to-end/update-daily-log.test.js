import "dotenv/config";
import puppeteer from "puppeteer";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/calendar/calendar.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

let doneToday = ` - Checked emails and replied to urgent messages.
- Worked on the presentation for the client meeting.
- Worked on the user stories for a new feature.
- Reviewed code submissions from team members.`;

let hours = `7`;

let reflection = ` - Completed all planned tasks.
- Prepare presentation for group meeting tomorrow.`;

describe("Daily Log End-to-End Tests", () => {
    beforeAll(async () => {
        await page.goto(url); // Add page link
    });

    test("Create New Daily Log", async () => {
        // Query calendar link in HTML
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();

        // Wait for navigation to the new page
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
        const updateDoneToday = await page.$("#done-today");
        // Define the text to be typed
        await page.evaluate(
            (updateDoneToday, doneToday) => {
                updateDoneToday.value = doneToday;
            },
            updateDoneToday,
            doneToday
        );

        const updatehours = await page.$("#hours");

        // Type the text into the input element
        await page.evaluate(
            (updatehours, hours) => {
                updatehours.value = hours;
            },
            updatehours,
            hours
        );

        const updateReflection = await page.$("#reflection");

        // Define the text to be typed

        await page.evaluate(
            (updateReflection, reflection) => {
                updateReflection.value = reflection;
            },
            updateReflection,
            reflection
        );
        const saveButton = await page.$(".js-save-button");

        await saveButton.click();
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);
    }, 40000);

    test("test 1", async () => {
        const todaySelector = ".nav-list li:nth-child(2) a";
        await page.waitForSelector(todaySelector);
        // Click on Today link in nav bar
        await page.click(todaySelector);
        expect(page.url()).toContain("/dailyLog");
    }, 40000);

    test("test 1", async () => {
        const updateDoneToday = await page.$("#done-today");
        const updatehours = await page.$("#hours");
        const updateReflection = await page.$("#reflection");
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );
        const addedHours = await page.evaluate((el) => el.value, updatehours);
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );
        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    }, 40000);

    test("update daily log", async () => {
        // Query the textarea element in HTML
        const updateReflection = await page.$("#reflection");

        // Define the text to be typed
        reflection = ` - Completed all planned tasks.
    - Prepare presentation for group meeting tomorrow.
    - Work on fixing bug.`;

        await page.evaluate(
            (updateReflection, reflection) => {
                updateReflection.value = reflection;
            },
            updateReflection,
            reflection
        );
        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updateReflection) => updateReflection.value,
            updateReflection
        );

        expect(addedText).toBe(reflection);
    }, 40000);

    test("Save Log button", async () => {
        // Type the text into the textarea element
        const saveButton = await page.$(".js-save-button");

        await saveButton.click();
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);
    }, 40000);
});
