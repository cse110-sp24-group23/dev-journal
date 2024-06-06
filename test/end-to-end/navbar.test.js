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

    // Visit the Calendar page
    test("Navigate to Calendar page", async () => {
        // Click on Calendar button
        page.click(".nav-list li:nth-child(1) a");

        // Assert if the URL matches the Calendar page URL
        expect(page.url()).toContain(`calendar/calendar.html`);
    });
});
