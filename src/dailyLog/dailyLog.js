import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";
import LocalStorageAccomplishmentsApi from "../backend-storage/accomplishments-api.js";
import { AccomplishmentsObj } from "../backend-storage/accomplishments-class.js";

/*
populates the daily log with the information from the record object
Parameters:
    - record containing either from the record from local storage or new a record
Returns:
    - NONE
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

    const date = new Date(record.date);

    if (record.hasAccomplishment) {
        const accomplishmentObj =
            LocalStorageAccomplishmentsApi.getAccomplishmentsObjByDate(date);
        const displayParagraph = document.querySelector(
            ".js-accomplishment-list"
        );
        for (let item of accomplishmentObj.content) {
            const newItem = document.createElement("li");
            newItem.classList.add("accomplishment-text");
            newItem.innerText = item;
            const accomplishmentButtons = document.createElement("div");
            accomplishmentButtons.classList.add("accomlishment-buttons");
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            const doneButton = document.createElement("button");
            editButton.setAttribute("id", "edit");
            doneButton.setAttribute("id", "done");
            doneButton.textContent = "Done";
            doneButton.classList.add("hidden");

            editButton.addEventListener("click", () => {
                editButton.classList.add("hidden");
                doneButton.classList.remove("hidden");
                editAccomplishment(newItem);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("id", "delete");
            deleteButton.addEventListener("click", () =>
                deleteAccomplishment(newItem)
            );

            accomplishmentButtons.appendChild(editButton);
            accomplishmentButtons.appendChild(doneButton);
            accomplishmentButtons.appendChild(deleteButton);

            newItem.appendChild(accomplishmentButtons);
            displayParagraph.append(newItem);
        }
    }
}

/*
Updates the imformation of the record saved in the local storage when the submit button is clicked.
Brings to the calendar page.
Parameters:
    - record containing either from the record from local storage or new a record
Returns:
    - NONE
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
    // check to see if field1 is null and update record if not
    if (updateField2.value) {
        record.field2 = updateField2.value;
    }
    const updateHours = document.querySelector("#hours");
    // check to see if field1 is null and update record if not
    if (updateHours.value) {
        record.hours = updateHours.value;
    }
    const hasAccomplishments = document.querySelector(
        ".js-accomplishment-list"
    );
    // check to see if field1 is null and update record if not

    if (hasAccomplishments.textContent !== "") {
        record.hasAccomplishment = true;
        const content = [];
        const listItems = hasAccomplishments.querySelectorAll("li");
        for (let item of listItems) {
            content.push(item.firstChild.textContent.trim());
        }
        let accomplishmentObj;
        if (LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)) {
            accomplishmentObj =
                LocalStorageAccomplishmentsApi.getAccomplishmentsObjByDate(
                    date
                );
            accomplishmentObj.content = content;
            LocalStorageAccomplishmentsApi.updateAccomplishmentsObj(
                accomplishmentObj
            );
        } else {
            accomplishmentObj = new AccomplishmentsObj(content, date);
            LocalStorageAccomplishmentsApi.createAccomplishmentsObj(
                accomplishmentObj
            );
        }
    } else {
        record.hasAccomplishment = false;
        if (LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)) {
            LocalStorageAccomplishmentsApi.deleteAccomplishmentsObj(date);
        }
    }

    // update record in the local storage
    LocalStorageRecordsApi.updateRecord(record);
    // links to the calendar page
    window.location.href = "../calendar/calendar.html";
}

/*
Delets record from local storage when the delete button is clicked.
Has a confirm message, to ask for confirmation.
Brings to the calendar page.
Parameters:
    - record containing either from the record from local storage or new a record
Returns:
    - NONE
*/
function deleteButtonClick(record) {
    const date = new Date(record.date);
    // If record does exists in local storage, delete it.
    if (LocalStorageRecordsApi.hasRecordByDate(date)) {
        // Confirm to see if user wants to delete
        // if ok, call delete function from local storage
        if (window.confirm("Are you sure you want to delete this record?")) {
            LocalStorageRecordsApi.deleteRecord(record.id);
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

function newAccomplishment() {
    const addNewInput = document.querySelector(".js-accomplishment-input");
    const displayParagraph = document.querySelector(".js-accomplishment-list");

    const inputValue = addNewInput.value.trim();

    if (inputValue) {
        const newItem = document.createElement("li");
        newItem.classList.add("accomplishment-item");
        newItem.innerText = inputValue;
        const accomplishmentButtons = document.createElement("span");
        accomplishmentButtons.classList.add("accomlishment-buttons");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        const doneButton = document.createElement("button");
        doneButton.textContent = "Done";
        editButton.setAttribute("id", "edit");
        doneButton.setAttribute("id", "done");
        doneButton.classList.add("hidden");

        editButton.addEventListener("click", () => {
            editButton.classList.add("hidden");
            doneButton.classList.remove("hidden");
            editAccomplishment(newItem);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("id", "delete");
        deleteButton.addEventListener("click", () =>
            deleteAccomplishment(newItem)
        );

        accomplishmentButtons.appendChild(editButton);
        accomplishmentButtons.appendChild(doneButton);
        accomplishmentButtons.appendChild(deleteButton);

        newItem.appendChild(accomplishmentButtons);
        displayParagraph.prepend(newItem);
        addNewInput.value = ""; // Clear the input field
    }
}

function editAccomplishment(item) {
    // Create an input element that will replace the text for editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.firstChild.textContent.trim(); // Set input value to current text

    // Replace the text node with this input element
    item.firstChild.textContent = ""; // Clear the text node
    item.insertBefore(input, item.childNodes[1]); // Insert input before the buttons

    input.select();
    // Handle pressing Enter to finish editing
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (input.value.trim() !== "") {
                item.firstChild.textContent = input.value.trim() + " ";
            } else {
                item.remove();
            }
            // Remove the input field
            input.remove();
        }
    });

    const editButton = item.querySelector("#edit");
    const doneButton = item.querySelector("#done");
    doneButton.addEventListener("click", () => {
        editButton.classList.remove("hidden");
        doneButton.classList.add("hidden");
        if (input.value.trim() !== "") {
            item.firstChild.textContent = input.value.trim() + " ";
        } else {
            item.remove();
        }
        // Remove the input field
        input.remove();
    });
}

function deleteAccomplishment(item) {
    if (confirm("Are you sure you want to delete this accomplishment?")) {
        item.remove();
    }
}

/*
 * Initializes log functionality by setting up the event listeners for the submit and delete buttons.
Parameters:
    - record containing either from the record from local storage or new a record
Returns:
    - NONE
*/
function logFunctionality(record) {
    const submitButton = document.querySelector("#save-button");
    const deleteButton = document.querySelector("#delete-button");
    populateDefaultLog(record);
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
    addAccomplishmentBtn.addEventListener("click", newAccomplishment);
}

/* 
This function is called when the window is loaded
*/
window.onload = function () {
    const recordString = sessionStorage.getItem("current record");
    let record;
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!recordString) {
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
