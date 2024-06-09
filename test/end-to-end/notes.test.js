import "dotenv/config";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let filepath = "/notes/notes.html";
let url = "http://127.0.0.1:5501/src" + filepath;
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL + filepath;
}

describe("Testing Notes Page functionality", () => {
    beforeAll(async () => {
        await page.goto(url);
    });

    test("Add a new note", async () => {
        // Click "Add Note" button
        await page.waitForSelector("#add-note-btn");
        await page.click("#add-note-btn");
        // Wait for the note editor to appear
        await page.waitForSelector("#note-editor");

        // Type in the title and content
        await page.type("#note-editor-title", "Test Note");
        await page.type("#note-editor-content", "This is a test note");

        // Click the "Save" button
        await page.click("#editor-save-btn");

        // Check that the new note appears in the list
        await page.waitForSelector("note-element");
        const noteTitle = await page.$eval("note-element", (el) =>
            el.getAttribute("title")
        );
        const noteContent = await page.$eval("note-element", (el) =>
            el.getAttribute("content")
        );

        expect(noteTitle).toBe("Test Note");
        expect(noteContent).toBe("This is a test note");
    }, 10000); // Set timeout for 10 seconds

    /*
    TODO: Test viewing and updating of created notes
    TODO: Test deletion of created notes
    TODO: Test that notes are correctly populated after adding multiple
     
    COMMENTS: These tests were set aside due to the constraint of time, as well as not to hurt the existing automated testing framework
    so close to deadline. All three tests deal with the manipulation of created notes, in which it was difficult for Puppeteer to correctly
    access local storage on the hosted site where GitHub Actions were run. 
    */
});
