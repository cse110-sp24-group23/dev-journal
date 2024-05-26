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

export { populateDefaultLog };
