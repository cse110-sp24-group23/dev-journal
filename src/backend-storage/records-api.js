// A Record object should have the following properties:
// - id: a unique identifier for the record
//     - For Notes, it will be Date.GetTime(); (very atomic)
//     - For Daily Logs, it will be Date(Year, Month, Day).getTime(); (By Day since we will only have 1 log per day)
// - title: a string field for the title of the record
//      - For Notes, it will be the title of the note
//      - For Daily Logs, it will be the date of the log, via Date().toDateString() eg "Wed May 22 2024"
// - hours: a number field for the logging hours
// - field1: a string field for the Markdown 1st field
// - field2: a string field for the Markdown 2nd field
// - created: the date and time the record was created in ISO
// - updated: the date and time the record was last updated in ISO

export class RecordsApi {
    constructor() {
        if (this.constructor === RecordsApi) {
            throw new Error("Cannot instantiate an abstract class");
        }
    }
    static getAllRecords() {
        throw new Error("getAllRecords not implemented");
    }
    static createRecord(recordToCreate) {
        throw new Error("createRecord not implemented");
    }

    static updateRecord(recordToUpdate) {
        throw new Error("updateRecord not implemented");
    }

    static getRecordById(id) {
        throw new Error("getRecordById not implemented");
    }

    static getRecordByDate(date) {
        throw new Error("getRecordByDate not implemented");
    }

    static deleteRecord(id) {
        throw new Error("deleteRecord not implemented");
    }
}

export default class LocalStorageRecordsApi extends RecordsApi {
    /*
    Clear any 'none' records in the localStorage if some error accidentally added one.
    This stops any errors from compounding and breaking the functionality
    Parameters: None
    Returns: None
    */
    static cleanse_records() {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const filteredRecords = Records.filter((record) => record != null);
        // if there were no records to remove, don't do anything
        if (filteredRecords.length === Records.length) {
            return;
        }
        // if there were error records, update localStorage with only the filtered records
        localStorage.setItem("Records", JSON.stringify(filteredRecords));
    }
    /*
    getAllRecords(): Gets all Records from LocalStorage
    Parameters: 
        - type: null, 'log', or 'note' - specifies which type of record to filter by.
            - if type is null, it returns all records regardless of type
    Returns: 
    - Array of Records
    */
    static getAllRecords(type = null) {
        const types = ["log", "note", null];
        if (!types.includes(type)) {
            throw Error('type must be "log", "note", or null.');
        }
        try {
            // get all records from storage
            const Records = JSON.parse(localStorage.getItem("Records")) || [];
            // if no type passed in, don't filter the records
            if (!type) {
                return Records;
            }
            // otherwise, filter the records by type
            const filteredRecords = Records.filter(
                (record) => record.type == type
            );
            return filteredRecords;
        } catch (error) {
            console.warn(error);
            console.warn("Returning Empty List");
            return [];
        }
    }

    /*
    createRecord(): Creates a new record in LocalStorage
    Parameters: 
    - recordObject: Record object
    Returns: None
    */

    static createRecord(recordObject) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const existingRecord = Records.find(
            (record) => record.id === recordObject.id
        );
        if (existingRecord) {
            throw new Error(
                "Could not create record, record with id already exists:",
                recordObject.id
            );
        }
        Records.push(recordObject);
        localStorage.setItem("Records", JSON.stringify(Records));
    }

    /*
    updateRecord(): Updates a record in LocalStorage
    Parameters:
    - recordObject: Record object
    Returns: None
    */

    static updateRecord(recordObject) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const existingRecord = Records.find(
            (record) => record.id === recordObject.id
        );
        if (!existingRecord) {
            throw new Error(
                "Could not update record, record not found:",
                recordObject.id
            );
        }
        existingRecord.title = recordObject.title;
        existingRecord.hours = recordObject.hours;
        existingRecord.field1 = recordObject.field1;
        existingRecord.field2 = recordObject.field2;
        existingRecord.hasAccomplishment = recordObject.hasAccomplishment;
        existingRecord.updated = new Date().toISOString();
        localStorage.setItem("Records", JSON.stringify(Records));
    }

    /*
    getRecord(): Gets a record from LocalStorage
    Parameters: 
    - id: Number
    Returns: 
    - Record object
    */

    static getRecordById(id) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        // get the record after parsing user input to make sure it's a number
        const record = Records.find((record) => record.id === parseInt(id));
        if (!record) {
            throw new Error("Record not found", id);
        }
        return record;
    }
    /*
    getRecordByDate(): Gets a record from LocalStorage by date
    Parameters:
    - date: date Object (new Date(Year, Month Day))
    Returns:
    - Record object
    */
    // For use in Daily Log
    //TODO: add optional type for log - parse date by year, month, day
    static getRecordByDate(date) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const record = Records.find((record) => record.id === date.getTime());
        if (!record) {
            throw new Error("Record not found", date.getTime());
        }
        return record;
    }
    /*
    hasRecordByDate(): Checks if a record exists in LocalStorage by date
    Parameters:
    - date: date Object (new Date(Year, Month Day))
    Returns:
    - Boolean
    */
    //TODO: add optional type for log - parse date by year, month, day
    static hasRecordByDate(date) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const record = Records.find((record) => record.id === date.getTime());
        if (!record) {
            return false;
        }
        return true;
    }

    /*
    hasRecordById(): Checks if a record exists in LocalStorage by id
    Parameters:
    - id: Number (although does accept strings) - id of a record
    Returns:
    - Boolean
    */
    static hasRecordById(id) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const record = Records.find((record) => record.id === parseInt(id));
        if (!record) {
            return false;
        }
        return true;
    }

    /*
    deleteRecord(): Deletes a record from LocalStorage
    Parameters: 
    - id: Number
    Returns: None
    */
    static deleteRecord(id) {
        const Records = LocalStorageRecordsApi.getAllRecords();
        const newRecords = Records.filter((record) => record.id !== id);
        if (newRecords.length === Records.length) {
            throw new Error("Could not delete record, record not found:", id);
        }
        localStorage.setItem("Records", JSON.stringify(newRecords));
    }
}
