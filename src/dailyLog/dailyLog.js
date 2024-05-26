function populateDefaultLog(record) {
    const updateH1 = document.querySelector("h1");
    updateH1.innerHTML = record.title;
    const updateField1 = document.querySelector("#done-today");
    updateField1.value = record.field1;
    const updateField2 = document.querySelector("#reflection");
    updateField2.value = record.field2;
    const updateHours = document.querySelector("#hours");
    updateHours.value = record.hours;
}
