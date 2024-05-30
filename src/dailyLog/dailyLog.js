import LocalStorageRecordsApi from "../backend-storage/records-api.js";

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

function notesFunctionality(record) {
    populateDefaultLog(record);
    const submitButton = document.querySelector("#save-button");
    const deleteButton = document.querySelector("#delete-button");
    const date = new Date(record.date);
    submitButton.addEventListener("click", () => {
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
    });

    deleteButton.addEventListener("click", () => {
        if (LocalStorageRecordsApi.hasRecordByDate(date)) {
            if (
                window.confirm("Are you sure you want to delete this record?")
            ) {
                LocalStorageRecordsApi.deleteRecord(record.id);
                window.location.href = "../calendar/calendar.html";
            }
        }
    });
}

window.onload = function () {
    const recordString = sessionStorage.getItem("current record");
    const record = JSON.parse(recordString);
    notesFunctionality(record);
};
