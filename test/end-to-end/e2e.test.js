import "dotenv/config";
// require("dotenv").config();
console.log(process.env);

let url = process.env.DEPLOYMENT_URL;
// console.log(secret);

test("this is an integration test", () => {
    expect(url).toBe("1234")
});
