import "dotenv/config";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/index.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

console.log("URL: ", url);

describe("End-to-End Test Example", () => {
    beforeAll(async () => {
        await page.goto(url);
    });

    test("Go to next month", async () => {
        const currentMonthElement = await page.$('.header-container h1');
        const currentMonthText = await page.evaluate(el => el.textContent, currentMonthElement);
        await page.click('.js-next-month');
        // The same as above, but more concise. Leaving for reference.
        const nextMonthText = await page.$eval('.header-container h1', el => el.textContent);

        const getNextMonth = (currentMonth) => {
            const [month,year] = currentMonth.split(" ");
            const date = new Date(`${month} 1, ${year}`)
            date.setMonth(date.getMonth() + 1);
            return date.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
        expect(nextMonthText).toBe(getNextMonth(currentMonthText));
    });

});