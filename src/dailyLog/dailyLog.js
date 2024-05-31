import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";

/*
populates the daily log with the information from the record object
Parameters:
    - Record record containg the record either from the local storage or new record
Returns:
    - NONE
*/
function populateDefaultLog(record) {
    const updateH1 = document.querySelector("h1");
    updateH1.innerHTML = record.title;
    const updateField1 = document.querySelector("#done-today");
    if (record.field1) {
        updateField1.value = record.field1;
    }
    const updateField2 = document.querySelector("#reflection");
    if (record.field2) {
        updateField2.value = record.field2;
    }
    const updateHours = document.querySelector("#hours");
    if (record.hours) {
        updateHours.value = record.hours;
    }
}

function submitButtonClick(record) {
    const date = new Date(record.date);
    if (!LocalStorageRecordsApi.hasRecordByDate(date)) {
        LocalStorageRecordsApi.createRecord(record);
    }
    const updateField1 = document.querySelector("#done-today");
    if (updateField1.value) {
        record.field1 = updateField1.value;
    }
    const updateField2 = document.querySelector("#reflection");
    if (updateField2.value) {
        record.field2 = updateField2.value;
    }
    const updateHours = document.querySelector("#hours");
    if (updateHours.value) {
        record.hours = updateHours.value;
    }
    LocalStorageRecordsApi.updateRecord(record);
    window.location.href = "../calendar/calendar.html";
}

function deleteButtonClick(record) {
    const date = new Date(record.date);
    if (LocalStorageRecordsApi.hasRecordByDate(date)) {
        if (window.confirm("Are you sure you want to delete this record?")) {
            LocalStorageRecordsApi.deleteRecord(record.id);
            window.location.href = "../calendar/calendar.html";
        }
    }
}

/*
populates the daily log with the information from the record object
Parameters:
    - Record record containg the record either from the local storage or new record
Returns:
    - NONE
*/
function logFunctionality(record) {
    const submitButton = document.querySelector("#save-button");
    const deleteButton = document.querySelector("#delete-button");
    populateDefaultLog(record);
    submitButton.addEventListener("click", () => {
        submitButtonClick(record);
    });
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
