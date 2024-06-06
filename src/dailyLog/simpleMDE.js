/*global SimpleMDE*/
// ^^ show SimpleMDE is a global function to not aggravate linter
import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";
// Wait until page loads
window.addEventListener("DOMContentLoaded", init);

/**Create two SimpleMDE objects to apply to textareas
 */
function init() {
    const simplemde_done_today = new SimpleMDE({
        element: document.getElementById("done-today"),
        forceSync: true,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true,
        },
        promptURLs: true,
        tabSize: 4,
    });
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
    simplemde_done_today.value(record.field1);

    const simplemde_reflection = new SimpleMDE({
        element: document.getElementById("reflection"),
        forceSync: true,
        parsingConfig: {
            allowAtxHeaderWithoutSpace: true,
        },
        promptURLs: true,
        tabSize: 4,
    });
    simplemde_reflection.value(record.field2);
}
