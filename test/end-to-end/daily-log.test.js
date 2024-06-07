import "dotenv/config";
import puppeteer from "puppeteer";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/calendar/calendar.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

let doneToday = ` - Checked emails and replied to urgent messages.
- Worked on the presentation for the client meeting.
- Worked on the user stories for a new feature.
- Reviewed code submissions from team members.`;

let hours = `7`;

let reflection = ` - Completed all planned tasks.
- Prepare presentation for group meeting tomorrow.`;

describe("Daily Log End-to-End Tests", () => {
    beforeAll(async () => {
        await page.goto(url); // Add page link
    });

    test("Create New Daily Log", async () => {
        // Query calendar link in HTML
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();

        // Wait for navigation to the new page
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
    });

    // Test for Today page
    test("Add text to done-today textarea", async () => {
        // Query the textarea element in HTML
        const updateDoneToday = await page.$("#done-today");
        // Define the text to be typed
        await page.evaluate(
            (updateDoneToday, doneToday) => {
                updateDoneToday.value = doneToday;
            },
            updateDoneToday,
            doneToday
        );
        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updateDoneToday) => updateDoneToday.value,
            updateDoneToday
        );

        expect(addedText).toBe(doneToday);
    });

    test("Add text to hours", async () => {
        // Query the input element in HTML
        const updatehours = await page.$("#hours");

        // Type the text into the input element
        await page.evaluate(
            (updatehours, hours) => {
                updatehours.value = hours;
            },
            updatehours,
            hours
        );
        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updatehours) => updatehours.value,
            updatehours
        );

        expect(addedText).toBe(hours);
    });

    test("Add text to reflection", async () => {
        // Query the textarea element in HTML
        const updateReflection = await page.$("#reflection");

        // Define the text to be typed

        await page.evaluate(
            (updateReflection, reflection) => {
                updateReflection.value = reflection;
            },
            updateReflection,
            reflection
        );
        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updateReflection) => updateReflection.value,
            updateReflection
        );

        expect(addedText).toBe(reflection);
    });

    test("Save Log button", async () => {
        // Type the text into the textarea element
        const saveButton = await page.$(".js-save-button");

        await saveButton.click();
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);
    });

    test("Navigate to the page and populate record", async () => {
        // Type the text into the textarea element
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();

        // Wait for navigation to the new page
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
        const updateDoneToday = await page.$("#done-today");
        // Define the text to be typed
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );
        // Query the textarea element in HTML
        const updatehours = await page.$("#hours");
        // Retrieve the value from the textarea element
        const addedHours = await page.evaluate((el) => el.value, updatehours);
        // Query the textarea element in HTML
        const updateReflection = await page.$("#reflection");
        // Retrieve the value from the textarea element
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );

        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    });

    test("update daily log", async () => {
        // Query the textarea element in HTML
        const updateReflection = await page.$("#reflection");

        // Define the text to be typed
        reflection = ` - Completed all planned tasks.
- Prepare presentation for group meeting tomorrow.
- Work on fixing bug.`;

        await page.evaluate(
            (updateReflection, reflection) => {
                updateReflection.value = reflection;
            },
            updateReflection,
            reflection
        );
        // Retrieve the value from the textarea element
        const addedText = await page.evaluate(
            (updateReflection) => updateReflection.value,
            updateReflection
        );

        expect(addedText).toBe(reflection);
    });

    test("Save Log button", async () => {
        // Type the text into the textarea element
        const saveButton = await page.$(".js-save-button");

        await saveButton.click();
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);
    });

    test("test 1", async () => {
        // Type the text into the textarea element
        const todaySelector = ".nav-list li:nth-child(2) a";
        await page.waitForSelector(todaySelector);

        const todayLink = await page.$(todaySelector); // Select the element
        await todayLink.click();
        await page.waitForNavigation();
        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain("dailyLog");

        const updateDoneToday = await page.$("#done-today");
        const updatehours = await page.$("#hours");
        const updateReflection = await page.$("#reflection");
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );
        const addedHours = await page.evaluate((el) => el.value, updatehours);
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );
        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    }, 40000);

    test("test 2", async () => {
        const accomplishmentInput = await page.$(".js-accomplishment-input");
        const accomplishment = `Finished making user stories!`;
        await page.evaluate(
            (accomplishmentInput, accomplishment) => {
                accomplishmentInput.value = accomplishment;
            },
            accomplishmentInput,
            accomplishment
        );

        const addAccomplishment = await page.$(".js-add-accomplishment");

        await addAccomplishment.click();
        const emptyInput = await page.evaluate(
            (accomplishmentInput) => accomplishmentInput.value,
            accomplishmentInput
        );

        expect(emptyInput).toBe("");

        // Ensure the accomplishment item is correctly added
        const accomplishmentItem = await page.waitForSelector(
            ".accomplishment-text"
        );

        // Ensure the accomplishment item is correctly added
        const accomplishmentText = await page.evaluate((accomplishmentItem) => {
            // Get only the text content of the accomplishment, ignoring the button texts
            return accomplishmentItem.childNodes[0].textContent;
        }, accomplishmentItem);

        expect(accomplishmentText).toBe(accomplishment);

        const editButton = await page.$("#edit");
        const doneButton = await page.$("#done");
        const deleteButton = await page.$("#delete");

        // Check that the buttons exist
        expect(editButton).not.toBeNull();
        expect(doneButton).not.toBeNull();
        expect(deleteButton).not.toBeNull();
    }, 40000);

    test("test 3", async () => {
        const editButton = await page.$("#edit");
        const doneButton = await page.$("#done");

        await editButton.click();

        // Wait for the input field to appear
        const updateAccomplishment = await page.waitForSelector(
            ".accomplishment-text input[type='text']"
        );

        await page.evaluate((updateAccomplishment) => {
            updateAccomplishment.value =
                "Finished making user stories and issues!";
        }, updateAccomplishment);
        await doneButton.click();
        const accomplishmentItem = await page.waitForSelector(
            ".accomplishment-text"
        );

        const accomplishmentText = await page.evaluate((accomplishmentItem) => {
            // Get only the text content of the accomplishment, ignoring the button texts
            return accomplishmentItem.childNodes[0].textContent;
        }, accomplishmentItem);

        expect(accomplishmentText.trim()).toBe(
            "Finished making user stories and issues!"
        );
    }, 40000);

    test("Save Log button", async () => {
        // Type the text into the textarea element
        const saveButton = await page.$(".js-save-button");

        await saveButton.click();
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);
        // Type the text into the textarea element
        // Type the text into the textarea element
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();

        // Wait for navigation to the new page
        await page.waitForNavigation();

        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
        const accomplishmentItem = await page.waitForSelector(
            ".accomplishment-text"
        );

        const accomplishmentText = await page.evaluate((accomplishmentItem) => {
            // Get only the text content of the accomplishment, ignoring the button texts
            return accomplishmentItem.childNodes[0].textContent;
        }, accomplishmentItem);

        expect(accomplishmentText.trim()).toBe(
            "Finished making user stories and issues!"
        );
    }, 40000);

    test("test3", async () => {
        // Check if the URL contains 'dailyLog'
        page.on("dialog", async (dialog) => {
            await dialog.accept();
        });

        // Click on the delete button using its ID
        const deleteButton = await page.$("#delete");
        await deleteButton.click();

        // Ensure that the list item has been removed from the DOM
        const listItemAfterDeletion = await page.$(".accomplishment-text");
        expect(listItemAfterDeletion).toBeNull();
    }, 40000);
});
