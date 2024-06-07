/*global SimpleMDE*/
// ^^ show SimpleMDE is a global function to not aggravate linter
import LocalStorageRecordsApi from "../backend-storage/records-api.js";
import { Record } from "../backend-storage/record-class.js";
import { getStatusMDE } from "../backend-storage/mde-mode-api.js";
// Wait until page loads
window.addEventListener("DOMContentLoaded", init);

/* 
Create two SimpleMDE objects to apply to text areas
Parameters: N/A
Returns: N/A
 */
function init() {
    // get the status of markdown editing as a boolean by comparing it to the string "true"
    const statusMDE = getStatusMDE() === "true";
    if (statusMDE) {
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
}
