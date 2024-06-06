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

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
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
    test("Add text to done-today textarea", async () => {
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

    test("Add text to hours", async () => {
        // Query the textarea element in HTML
        const updatehours = await page.$("#hours");

        // Define the text to be typed
        const hours = `7`;

        // Type the text into the textarea element
        await updatehours.type(hours);

        await page.evaluate(
            (updatehours, hours) => {
                updatehours.value = hours;
            },
            updatehours,
            hours
        );
        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updatehours) => updatehours.value,
            updatehours
        );

        expect(addedText).toBe(hours);
    });

    test("Add text to reflection", async () => {
        // Query the textarea element in HTML
        const updateReflection = await page.$("#reflection");

        // Define the text to be typed
        const reflection = ` - Completed all planned tasks.
        - Prepare presentation for group meeting tomorrow.`;

        // Type the text into the textarea element
        await updateReflection.type(reflection);

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
    });

    test("Add text to reflection", async () => {});
});
