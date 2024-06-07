import "dotenv/config";

let url = "http://127.0.0.1:5500/index.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}


test("This is an example E2E Test", () => {
    console.log(url)
});
