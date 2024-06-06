import "dotenv/config";

let url = "http://127.0.0.1:5500/index.html";

if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

describe("Daily Log E2E tests", () => {
    beforeAll(async () => {
        await page.goto(url); // Add page link
    });
    it("Adding note", async () => {
        // Your test logic goes here
        expect(true).toBe(true);
    });
});
