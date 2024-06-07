import "dotenv/config";
import puppeteer from "puppeteer";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/calendar/calendar.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}
// Define the text to be entered in the "Done Today" textarea, hours and reflection
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

    afterAll(async () => {
        // Navigate back to the original URL after all tests are done
        await page.goto(url);
    });
    test("Navigate to Today page", async () => {
        await page.click(".nav-list li:nth-child(2) a");

        page.waitForNavigation();
        // Assert if the URL matches the Today page URL
        expect(page.url()).toContain("/dailyLog");
    }, 40000);

    test("Create New Daily Log", async () => {
        // Wait for the #done-today element to be available in the DOM
        await page.waitForSelector("#done-today");

        // Query the #done-today element

        // Use evaluate to set the value of the #done-today element
        await page.evaluate(
            (selector, value) => {
                const element = document.querySelector(selector);
                element.value = value;
            },
            "#done-today",
            doneToday
        );

        // If you need to set other values, ensure you wait for those elements as well
        await page.waitForSelector("#hours");
        await page.evaluate(
            (selector, value) => {
                const element = document.querySelector(selector);
                element.value = value;
            },
            "#hours",
            hours
        );

        await page.waitForSelector("#reflection");
        await page.evaluate(
            (selector, value) => {
                const element = document.querySelector(selector);
                element.value = value;
            },
            "#reflection",
            reflection
        );

        // Further interactions or assertions can go here
        const updateDoneToday = await page.$("#done-today");
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );

        const updatehours = await page.$("#hours");
        const addedHours = await page.evaluate((el) => el.value, updatehours);

        const updateReflection = await page.$("#reflection");
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );

        // check that the textareas and input updated
        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    }, 40000);

    // Test for checking update after saving log
    test("Check update after saving log", async () => {
        await page.waitForSelector(".js-save-button");
        const saveButton = await page.$(".js-save-button");
        await saveButton.click();

        await page.waitForSelector(".current-date");
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();
        await page.waitForNavigation();
        expect(page.url()).toContain(`dailyLog`);

        const updateDoneToday = await page.$("#done-today");
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );

        const updatehours = await page.$("#hours");
        const addedHours = await page.evaluate((el) => el.value, updatehours);

        const updateReflection = await page.$("#reflection");
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );

        // check that the textareas and input updated
        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    }, 50000);
});
