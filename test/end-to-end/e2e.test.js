import "dotenv/config";

if (process.env.TEST_ENV === "LOCAL") {
    const url = "'http://127.0.0.1:5500/index.html'"
}
else {
    const url = process.env.DEPLOYMENT_URL;
}


test("This is an example E2E Test", () => {
    console.log(url)
});
