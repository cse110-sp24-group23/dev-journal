import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";
import LocalStorageAccomplishmentsApi from "../backend-storage/accomplishments-api.js";
import { AccomplishmentsObj } from "../backend-storage/accomplishments-class.js";

/**
 * Populates the daily log with the information from the record object
 * @param {Record} record - The record containing either from the record from local storage or new a record
 */
function populateDefaultLog(record) {
    const updateH1 = document.querySelector("h1");
    // no check because title should be there
    updateH1.innerHTML = record.title;
    const updateField1 = document.querySelector("#done-today");

    // check to see if field1 is null
    if (record.field1) {
        updateField1.value = record.field1;
    }
    const updateField2 = document.querySelector("#reflection");
    // check to see if field2 is null
    if (record.field2) {
        updateField2.value = record.field2;
    }
    const updateHours = document.querySelector("#hours");
    // check to see if hours is null
    if (record.hours) {
        updateHours.value = record.hours;
    }

    // if accomplishments exists, populate them on the page
    if (record.hasAccomplishment) {
        // date to search the accomplishment
        const date = new Date(record.date);
        const accomplishmentObj =
            LocalStorageAccomplishmentsApi.getAccomplishmentsObjByDate(date);
        // get the parargraph where the accomplishments would be polated as a list
        const displayParagraph = document.querySelector(
            ".js-accomplishment-list"
        );
        // loop over all content in the accomplishment object, and make each accomplishment list element with buttons
        for (const item of accomplishmentObj.content) {
            let newItem = document.createElement("li");
            //adds the content and buttons to the list element
            newItem = updateContentButtons(newItem, item);
            //append the list object into the paragraph
            displayParagraph.append(newItem);
        }
    }
}

/**
 * Updates the imformation of the record saved in the local storage when the submit button is clicked
 * Jumps to the calendar page
 * @param {Record} record - The record containing either from the record from local storage or new a record
 */
function submitButtonClick(record) {
    // date from record object
    const date = new Date(record.date);
    // If record does not exists in local storage, make a new one.
    if (!LocalStorageRecordsApi.hasRecordByDate(date)) {
        LocalStorageRecordsApi.createRecord(record);
    }
    const updateField1 = document.querySelector("#done-today");
    // check to see if field1 is null and update record if not
    if (updateField1.value) {
        record.field1 = updateField1.value;
    }
    const updateField2 = document.querySelector("#reflection");
    // check to see if field2 is null and update record if not
    if (updateField2.value) {
        record.field2 = updateField2.value;
    }
    const updateHours = document.querySelector("#hours");
    // check to see if hours is null and update record if not
    if (updateHours.value) {
        record.hours = updateHours.value;
    }
    // get the paragraph tag with accomplishments listes in it
    const hasAccomplishments = document.querySelector(
        ".js-accomplishment-list"
    );

    // if accomplishments paragraph is not empty, update the hasAccomplishment variable in the record
    // and store accomplishments in the local storage
    if (hasAccomplishments.textContent !== "") {
        record.hasAccomplishment = true;
        // content array to hold all the accomplishments
        const content = [];
        // gets all the list items from the accomplishment paragraph
        const listItems = hasAccomplishments.querySelectorAll("li");
        // loop over the list items and append the text content of the firstChild into the content array
        for (const item of listItems) {
            content.push(item.firstChild.textContent.trim());
        }
        let accomplishmentObj;
        // if accomplishment exists in local storage, update it; else, make an accomplishment
        if (LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)) {
            // get the accomplishment object from local storage
            accomplishmentObj =
                LocalStorageAccomplishmentsApi.getAccomplishmentsObjByDate(
                    date
                );
            // assign the content array to the content of the accomplishment object
            accomplishmentObj.content = content;
            // update the accomplishment object in local storage
            LocalStorageAccomplishmentsApi.updateAccomplishmentsObj(
                accomplishmentObj
            );
        } else {
            // create a new accomplishment object
            accomplishmentObj = new AccomplishmentsObj(content, date);
            // store the acomplishemnt object in the local storage
            LocalStorageAccomplishmentsApi.createAccomplishmentsObj(
                accomplishmentObj
            );
        }
    } else {
        record.hasAccomplishment = false;
        // delete the accomplishment object from local storage
        // as all accomplishment very deleted or none were added
        if (LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)) {
            LocalStorageAccomplishmentsApi.deleteAccomplishmentsObj(date);
        }
    }
    // update record in the local storage
    LocalStorageRecordsApi.updateRecord(record);
    // links to the calendar page
    window.location.href = "../calendar/calendar.html";
}

/**
 * Delets record from local storage when the delete button is clicked
 * Has a confirm message, to ask for confirmation
 * Brings to the calendar page
 * @param {Record} record - The record containing either from the record from local storage or new a record
 */
function deleteButtonClick(record) {
    const date = new Date(record.date);
    // if record does exists in local storage, delete it.
    if (LocalStorageRecordsApi.hasRecordByDate(date)) {
        // confirm to see if user wants to delete
        // if ok, call delete function from local storage
        if (window.confirm("Are you sure you want to delete this record?")) {
            LocalStorageRecordsApi.deleteRecord(record.id);
            // if accomplishments for the date exist in the local stoarge, delete them
            if (
                LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)
            ) {
                LocalStorageAccomplishmentsApi.deleteAccomplishmentsObj(date);
            }
            // links to the calendar page
            window.location.href = "../calendar/calendar.html";
        }
    }
}

/**
 * Adds a new list item into the accomplishment paragraph
 * Clears the input value for accomplishment input, so that new input can be taken in
 */
function addAccomplishment() {
    // get the input element with new accomplishemnt text
    const newInput = document.querySelector(".js-accomplishment-input");
    // get the accomplishment paragarph
    const displayParagraph = document.querySelector(".js-accomplishment-list");
    // get the text from the input
    const inputValue = newInput.value.trim();
    // if input value not empty, create list element to store new accomplishment
    if (inputValue) {
        let newItem = document.createElement("li");
        // update content and add buttons to the list element
        newItem = updateContentButtons(newItem, inputValue);
        displayParagraph.prepend(newItem);
        // clear the input
        newInput.value = "";
    }
}

/**
 * Updates the content of a specific accomplishment by
 * Creates an input box to get updated accomplishment
 * @param {HTMLLIElement} item - The list element with the content and buttons in it
 */
function editAccomplishment(item) {
    // create an input element that will replace the text for editing
    const input = document.createElement("input");
    input.type = "text";
    // set input value to current text
    input.value = item.firstChild.textContent.trim();
    //allow to tab through
    input.select();

    // Clear the text
    item.firstChild.textContent = "";
    // add input element before the edit/done and delete buttons
    item.insertBefore(input, item.childNodes[1]);

    // get the edit and done buttons to change their classList after done editing
    const editButton = item.querySelector("#edit");
    const doneButton = item.querySelector("#done");
    // with done is clicked, the content is changed and the classList are updated
    doneButton.addEventListener("click", () => {
        editButton.classList.remove("hidden");
        doneButton.classList.add("hidden");
        // if input is not empty, update the text inside list; else delete the list element
        if (input.value.trim() !== "") {
            item.firstChild.textContent = input.value.trim() + " ";
        } else {
            // delete accopmlishment if empty input
            deleteAccomplishment(item);
        }
        // Remove the input field
        input.remove();
    });
}

/**
 * Delete the list element
 * Confirms if the element is to be deleted
 * @param {HTMLLIElement} newItem - The list element with the updated content and buttons
 */
function deleteAccomplishment(item) {
    if (
        confirm(
            "Are you sure you want to remove this accomplishment? This action cannot be undone."
        )
    ) {
        item.remove();
    }
}

/**
 * Updates an accomplishment list element by adding text
 * and buttons for edit, done, and delete actions
 * @param {HTMLLIElement} newItem - The list element
 * @param {string} text - The content to be added to the list item
 * @returns {HTMLLIElement} The list element with the updated content and buttons
 */
function updateContentButtons(newItem, text) {
    // add a class to style the new accomplishment item
    newItem.classList.add("accomplishment-text");
    // set the text content of the new accomplishment list item
    newItem.innerText = text;

    // create a container for the accomplishment buttons
    const accomplishmentButtons = document.createElement("div");
    accomplishmentButtons.classList.add("accomlishment-buttons");
    // create the Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.setAttribute("id", "edit");
    // create the Done button and hide it initially
    const doneButton = document.createElement("button");
    doneButton.setAttribute("id", "done");
    doneButton.textContent = "Done";
    doneButton.classList.add("hidden");
    // event listener to the Edit button to change to Done button and update accomplishment
    editButton.addEventListener("click", () => {
        editButton.classList.add("hidden");
        doneButton.classList.remove("hidden");
        editAccomplishment(newItem);
    });
    // create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("id", "delete");
    // event listener to the delete accomplishment
    deleteButton.addEventListener("click", () => deleteAccomplishment(newItem));
    // append the buttons to the accomplishment buttons container
    accomplishmentButtons.appendChild(editButton);
    accomplishmentButtons.appendChild(doneButton);
    accomplishmentButtons.appendChild(deleteButton);
    // append the buttons container to the new accomplishment list item
    newItem.appendChild(accomplishmentButtons);
    //returns updated accomplishment
    return newItem;
}

/**
 * Initializes log functionality by setting up the event listeners for the submit and delete buttons
 * @param {string} text - The content to be added to the list item
 */
function logFunctionality(record) {
    //update content of the page
    populateDefaultLog(record);
    const submitButton = document.querySelector("#save-button");
    const deleteButton = document.querySelector("#delete-button");

    // Event listner for submit button
    submitButton.addEventListener("click", () => {
        submitButtonClick(record);
    });
    // Event listner for delete button
    deleteButton.addEventListener("click", () => {
        deleteButtonClick(record);
    });

    const addAccomplishmentBtn = document.querySelector(
        ".js-add-accomplishment"
    );
    // Event listner for add accomplishment button
    addAccomplishmentBtn.addEventListener("click", addAccomplishment);
}

/**
 * This function is called when the window is loaded.
 * Calls the logFunctionality function with the retrieved or created record.
 * @function
 * @name window.onload
 */
window.onload = function () {
    /**
     * The stringified record retrieved from sessionStorage.
     * @type {string|null}
     */
    const recordString = sessionStorage.getItem("current record");
    /**
     * The record object to be used.
     * @type {Record}
     */
    let record;
    /**
     * A new date object
     * @type {Date}
     */
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!recordString) {
        // if no record is found in sessionStorage, it checks local storage for a record by today's date.
        // if no record is found in local storage, it creates a new Record object.
        if (!LocalStorageRecordsApi.hasRecordByDate(today)) {
            record = new Record("log", { date: today });
        } else {
            record = LocalStorageRecordsApi.getRecordByDate(today);
        }
    } else {
        record = JSON.parse(recordString);
    }
    logFunctionality(record);
};
