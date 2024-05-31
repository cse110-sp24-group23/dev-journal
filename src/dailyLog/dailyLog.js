import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";

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
    // update record in the lcoal storage
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
            // links to the calendar page
            window.location.href = "../calendar/calendar.html";
        }
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
