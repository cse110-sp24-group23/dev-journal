import "dotenv/config";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/notes/notes.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
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
    test("Update and view a note", async () => {
        // Click "Add Note" button
        await page.click("#add-note-btn");
        // Wait for the note editor to appear
        await page.waitForSelector("#note-editor");

        // Type in the title and content
        await page.type("#note-editor-title", "");
        await page.type("#note-editor-content", "");

        // Click the "Save" button
        await page.click("#editor-save-btn");

        await page.waitForSelector("#note-element");
        console.log("found note-element");

        const noteElement = await page.$("note-element");
        expect(noteElement).not.toBeNull();

        await noteElement.click();
        await page.waitForSelector("#note-editor");

        // Check that the editor shows the correct title and content
        const noteTitle = await page.$eval(
            "#note-editor-title",
            (el) => el.value
        );
        const noteContent = await page.$eval(
            "#note-editor-content",
            (el) => el.value
        );

        expect(noteTitle).toBe("");
        expect(noteContent).toBe("");

        // Update the title and content
        await page.type("#note-editor-title", "Updated test note");
        await page.type("#note-editor-content", "This is an updated test note");

        // Click the "Save" button
        await page.click("#editor-save-btn");

        // Check that the note title and content has been updated
        const updatedNoteTitle = await page.$eval("note-element", (el) =>
            el.getAttribute("title")
        );
        const updatedNoteContent = await page.$eval("note-element", (el) =>
            el.getAttribute("content")
        );
        expect(updatedNoteTitle).toBe("Updated test note");
        expect(updatedNoteContent).toBe("This is an updated test note");
    }, 100000);
    */
});
