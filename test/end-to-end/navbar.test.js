import "dotenv/config";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/index.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

// Testing functionality of navbar to navigate through all pages
describe("Basic user flow for Navbar", () => {
    beforeAll(async () => {
        await page.goto(url); // Add page link
    });

    // Test for Calendar page
    test("Navigate to Calendar page", async () => {
        // Query calendar link in HTML
        const calendarSelector = ".nav-list li:nth-child(1) a";
        await page.waitForSelector(calendarSelector);

        // Click on Calendar link in nav bar
        await page.click(calendarSelector);

        // Assert if the URL matches the Calendar page URL
        expect(page.url()).toContain(`/calendar/calendar`);
    });

    // Test for Today page
    test("Navigate to Today page", async () => {
        // Query today link in HTML
        const todaySelector = ".nav-list li:nth-child(2) a";
        await page.waitForSelector(todaySelector);

        // Click on Today link in nav bar
        await page.click(todaySelector);

        // Assert if the URL matches the Today page URL
        expect(page.url()).toContain("/dailyLog");
    });

    // Test for Notes page
    test("Navigate to Notes page", async () => {
        // Query notes link in HTML
        const notesSelector = ".nav-list li:nth-child(3) a";
        await page.waitForSelector(notesSelector);

        // Click on Notes link in nav bar
        await page.click(notesSelector);

        // Assert if the URL matches the Notes page URL
        expect(page.url()).toContain("/notes/notes");
    });

    // Test for Accomplishments page
    test("Navigate to Accomplishments page", async () => {
        // Query accomplishments link in HTML
        const accomplishmentsSelector = ".nav-list li:nth-child(4) a";
        await page.waitForSelector(accomplishmentsSelector);

        // Click on Accomplishments link in nav bar
        await page.click(accomplishmentsSelector);

        // Assert if the URL matches the Accomplishments page URL
        expect(page.url()).toContain("/accomplishments/accomplishments");
    });

    // Test for Settings page
    test("Navigate to Settings page", async () => {
        // Query settings link in HTML
        const settingsSelector = ".nav-list li:nth-child(5) a";
        await page.waitForSelector(settingsSelector);

        // Click on Settings link in nav bar
        await page.click(settingsSelector);

        // Assert if the URL matches the Settings page URL
        expect(page.url()).toContain("/settings/settings");
    });
});
