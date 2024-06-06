import "dotenv/config";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/calendar/calendar.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

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

        // Check if the URL contains 'dailyLog/index.html'
        expect(page.url()).toContain(`dailyLog/index.html`);
    });

    // Test for Today page
    test("Add text to different textareas", async () => {
        // Wait for the textarea element to be visible

        // Query the textarea element in HTML
        const updateDoneToday = await page.$("#done-today");

        // Define the text to be typed
        const doneToday = ` - Checked emails and replied to urgent messages.
        - Worked on the presentation for the client meeting.
        - Worked on the user stories for a new feature.
        - Reviewed code submissions from team members.`;

        // Type the text into the textarea element
        await updateDoneToday.type(doneToday);

        await page.evaluate(
            (updateDoneToday, doneToday) => {
                updateDoneToday.value = doneToday;
            },
            updateDoneToday,
            doneToday
        );

        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updateDoneToday) => updateDoneToday.value,
            updateDoneToday
        );

        expect(addedText).toBe(doneToday);
    });

    // Test for Today page
    test("Add text to different textareas", async () => {
        // Wait for the textarea element to be visible

        // Query the textarea element in HTML
        const updateDoneToday = await page.$("#done-today");

        // Define the text to be typed
        const doneToday = ` - Checked emails and replied to urgent messages.
            - Worked on the presentation for the client meeting.
            - Worked on the user stories for a new feature.
            - Reviewed code submissions from team members.`;

        // Type the text into the textarea element
        await updateDoneToday.type(doneToday);

        await page.evaluate(
            (updateDoneToday, doneToday) => {
                updateDoneToday.value = doneToday;
            },
            updateDoneToday,
            doneToday
        );

        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updateDoneToday) => updateDoneToday.value,
            updateDoneToday
        );

        expect(addedText).toBe(doneToday);
    });
});
