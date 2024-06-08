import "dotenv/config";

//This should point to your local liveserver
//Note that liveserver will be running at the root level, so requires /src/, while the hosted will be at the src/ level already.
let url = "http://127.0.0.1:5501/src/calendar/calendar.html";
if (process.env.DEPLOYMENT_URL) {
    url = process.env.DEPLOYMENT_URL;
}

// Define the text to be entered in the "Done Today" textarea, hours and reflection
let doneToday = ` - Checked emails and replied to urgent messages.
- Worked on the presentation for the client meeting.
- Worked on the user stories for a new feature.
- Reviewed code submissions from team members.`;
let hours = `7`;
let reflection = ` - Completed all planned tasks.
- Prepare presentation for group meeting tomorrow.`;

describe("Daily Log End-to-End Tests", () => {
    beforeAll(async () => {
        await page.goto(url);
    });

    // Test for Navigation to Daily Log page
    test("Create New Daily Log", async () => {
        // Query calendar link in HTML to select current date
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();
        await page.waitForNavigation();

        // Check if the url contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
    });

    // Test to see is today textarea is updated
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

    // Test to see is hours is updated
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

    // Test to see is reflection textarea is updated
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

    // Test save button to to update local storage
    test("Save Log button", async () => {
        // Type the text into the textarea element
        const saveButton = await page.$(".js-save-button");
        await saveButton.click();
        await page.waitForNavigation();
        // Check if the url contains 'calendar'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);
    });

    // Test to navigate to the daily log
    test("Navigate to the page", async () => {
        // Type the text into the textarea element
        const dateSelector = await page.$(".current-date");
        await dateSelector.click();
        await page.waitForNavigation();

        // Check if the url contains 'dailyLog'
        expect(page.url()).toContain(`dailyLog`);
    });

    // Test to populate exsisting log
    test("Populate already exsisting Log", async () => {
        const updateDoneToday = await page.$("#done-today");
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );

        const updatehours = await page.$("#hours");
        const addedHours = await page.evaluate((el) => el.value, updatehours);

        const updateReflection = await page.$("#reflection");
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );

        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    });

    // Test to add accomplishment
    test("Add accomplishment", async () => {
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

        // input should change to ""
        expect(emptyInput).toBe("");
        const accomplishmentItem = await page.waitForSelector(
            ".accomplishment-text"
        );
        const accomplishmentText = await page.evaluate((accomplishmentItem) => {
            // Get only the text of the accomplishment, ignoring the buttons
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

    // Test for editing accomplishment and updating daily Log
    test("Update daily Log (including accomplishments)", async () => {
        const editButton = await page.$("#edit");
        const doneButton = await page.$("#done");
        await editButton.click();
        const updateAccomplishment = await page.waitForSelector(
            ".accomplishment-text input[type='text']"
        );
        // input updated accomplishment
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

        // check if accopmlishments were updated
        expect(accomplishmentText.trim()).toBe(
            "Finished making user stories and issues!"
        );

        const updateReflection = await page.$("#reflection");
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
        //update value
        const addedText = await page.evaluate(
            (updateReflection) => updateReflection.value,
            updateReflection
        );

        expect(addedText).toBe(reflection);
    }, 40000);

    // Test for checking update after saving log
    test("Check update after saving log", async () => {
        const saveButton = await page.$(".js-save-button");
        await saveButton.click();
        await page.waitForNavigation();
        // Check if the url contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });

        expect(localStorageLength).toBe(1);

        const dateSelector = await page.$(".current-date");
        await dateSelector.click();
        await page.waitForNavigation();
        expect(page.url()).toContain(`dailyLog`);

        const accomplishmentItem = await page.waitForSelector(
            ".accomplishment-text"
        );
        const accomplishmentText = await page.evaluate((accomplishmentItem) => {
            // Get only the text content of the accomplishment, ignoring the button texts
            return accomplishmentItem.childNodes[0].textContent;
        }, accomplishmentItem);
        // check that accomplishments updated
        expect(accomplishmentText).toBe(
            "Finished making user stories and issues!"
        );

        const updateDoneToday = await page.$("#done-today");
        const addedText = await page.evaluate(
            (el) => el.value,
            updateDoneToday
        );

        const updatehours = await page.$("#hours");
        const addedHours = await page.evaluate((el) => el.value, updatehours);

        const updateReflection = await page.$("#reflection");
        const addedReflection = await page.evaluate(
            (el) => el.value,
            updateReflection
        );

        // check that the textareas and input updated
        expect(addedText).toBe(doneToday);
        expect(addedHours).toBe(hours);
        expect(addedReflection).toBe(reflection);
    }, 40000);

    //test to delete accomplishment
    test("Delete accomplishment", async () => {
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

    //test to delete log
    test("Delete Log", async () => {
        // Click on the delete button using its ID
        const deleteLogButton = await page.$(".js-delete-button");
        await deleteLogButton.click();

        await page.waitForNavigation();
        // Check if the URL contains 'dailyLog'
        expect(page.url()).toContain(`calendar`);
        const localStorageLength = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem("Records")).length;
        });
        expect(localStorageLength).toBe(0);
    }, 40000);
});
