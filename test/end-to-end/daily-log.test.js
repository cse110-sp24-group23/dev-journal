import "dotenv/config";

let url = "http://127.0.0.1:5500/index.html";

if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}
describe("Daily Log E2E tests", () => {
    // First, visit the lab 8 website
    beforeAll(async () => {
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
        await page.goto(url);
    });

    it("Adding note", async () => {
        true.expect(true);
    });
});
