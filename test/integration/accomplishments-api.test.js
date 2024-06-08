import LocalStorageAccomplishmentsApi from "../../src/backend-storage/accomplishments-api";
import LocalStorageMock from "../../tools/localStorage-mock";

global.localStorage = new LocalStorageMock();

describe("LocalStorageAccomplishmentsApi", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("get all Accomplishments objects", () => {
        it("Empty Accomplishments", () => {
            const accomplishments =
                LocalStorageAccomplishmentsApi.getAllRecords();
            expect(Array.isArray(accomplishments)).toBe(true);
            expect(accomplishments.length).toBe(0);
        });
        /*
        it("Record exists", () => {
            const recordObject = { id: 123, name: "test" };
            localStorage.setItem("Records", JSON.stringify([recordObject]));
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(1);
            expect(records[0]).toEqual(recordObject);
        });

        it("Multiple Records", () => {
            const recordObject1 = { id: 123, name: "test" };
            const recordObject2 = { id: 456, name: "test" };
            localStorage.setItem(
                "Records",
                JSON.stringify([recordObject1, recordObject2])
            );
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(2);
            expect(records[0]).toEqual(recordObject1);
            expect(records[1]).toEqual(recordObject2);
        });

        it("Invalid Records", () => {
            localStorage.setItem("Records", "invalid");
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(0);
        });
    });
    describe("createRecord", () => {
        it("Record created", () => {
            const recordObject = {
                id: 123,
                title: "test",
                field1: "test field 1",
                field2: "test field 2",
            };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(records.length).toBe(1);
            expect(records[0]).toEqual(recordObject);
        });

        it("Record already exists", () => {
            const recordObject = {
                id: 123,
                title: "test",
                field1: "test field 1",
                field2: "test field 2",
            };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            expect(() => {
                LocalStorageAccomplishmentsApi.createRecord(recordObject);
            }).toThrow();
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(records.length).toBe(1);
            expect(records[0]).toEqual(recordObject);
        });

        it("Multiple Records", () => {
            const recordObject1 = {
                id: 123,
                title: "test",
                field1: "test field 1",
                field2: "test field 2",
            };
            const recordObject2 = {
                id: 456,
                title: "test2",
                field1: "test2 field 1",
                field2: "test2 field 2",
            };
            LocalStorageAccomplishmentsApi.createRecord(recordObject1);
            LocalStorageAccomplishmentsApi.createRecord(recordObject2);
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(records.length).toBe(2);
            expect(records[0]).toEqual(recordObject1);
            expect(records[1]).toEqual(recordObject2);
        });
    });

    describe("updateRecord", () => {
        it("Record updated", () => {
            const recordObject = {
                id: 456,
                title: "test",
                field1: "test field 1",
                field2: "test field 2",
            };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            const newRecordObject = {
                id: 456,
                title: "updated title",
                field1: "updated field 1",
                field2: "updated field 2",
            };
            LocalStorageAccomplishmentsApi.updateRecord(newRecordObject);
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(records.length).toBe(1);
            expect(records[0].title).toBe(newRecordObject.title);
            expect(records[0].field1).toBe(newRecordObject.field1);
            expect(records[0].field2).toBe(newRecordObject.field2);
            expect(records[0].updated).not.toBe(records[0].created);
        });

        it("Record not found", () => {
            const recordObject = { id: 18329091823 };
            expect(() => {
                LocalStorageAccomplishmentsApi.updateRecord(recordObject);
            }).toThrow();
        });
    });

    describe("getRecordbyId", () => {
        it("Record found", () => {
            const recordObject = { id: 456, title: "test" };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            const record = LocalStorageAccomplishmentsApi.getRecordById(456);
            expect(record).toEqual(recordObject);
        });

        it("Record not found", () => {
            expect(() => {
                LocalStorageAccomplishmentsApi.getRecord(123);
            }).toThrow();
        });

        it("Record not found 2", () => {
            const recordObject = { id: 456, title: "test" };
            const recordObject2 = { id: 789, title: "test2" };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            LocalStorageAccomplishmentsApi.createRecord(recordObject2);
            expect(() => {
                LocalStorageAccomplishmentsApi.getRecord("456");
            }).toThrow();
        });
    });

    describe("getRecordByDate", () => {
        it("Record found", () => {
            const currTime = new Date().setHours(0, 0, 0, 0);
            const currDate = new Date(currTime);
            const recordObject = { id: currTime, title: "test" };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            const record =
                LocalStorageAccomplishmentsApi.getRecordByDate(currDate);
            expect(record).toEqual(recordObject);
        });

        it("Record not found", () => {
            const currDate = new Date();
            expect(() => {
                LocalStorageAccomplishmentsApi.getRecordByDate(currDate);
            }).toThrow();
        });
    });

    describe("hasRecord", () => {
        it("Record exists", () => {
            const currTime = new Date().setHours(0, 0, 0, 0);
            const currDate = new Date(currTime);
            const recordObject = { id: currTime, title: "test" };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            expect(
                LocalStorageAccomplishmentsApi.hasRecordByDate(currDate)
            ).toBe(true);
        });

        it("Record does not exist", () => {
            expect(
                LocalStorageAccomplishmentsApi.hasRecordByDate(new Date())
            ).toBe(false);
        });
    });

    describe("deleteRecord", () => {
        it("Record deleted", () => {
            const recordObject = { id: 123, title: "test" };
            LocalStorageAccomplishmentsApi.createRecord(recordObject);
            LocalStorageAccomplishmentsApi.deleteRecord(123);
            const records = LocalStorageAccomplishmentsApi.getAllRecords();
            expect(records.length).toBe(0);
        });

        it("Record not found", () => {
            expect(() => {
                LocalStorageAccomplishmentsApi.deleteRecord(123);
            }).toThrow();
        });
        */
    });
});

/*
import { Record } from "../../src/backend-storage/record-class";
import accomplishmentsObj from "../../src/backend-storage/accomplishments-api";
import LocalStorageMock from "../../tools/localStorage-mock";

global.localStorage = new LocalStorageMock();

describe("LocalStorageRecordsApi", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("Create and accomplishments objects, Check hasAccomplishmentObjByDate", () => {
        it("Create Accomplishments objects, check them by date", () => {
            const records = [];
            // Get date of current day in log format and notes format
            const todayLog = new Date();
            todayLog.setHours(0, 0, 0, 0);
            const todayNote = new Date();
            const numRecordsPerType = 5;
            // Create record objects
            for (let i = 0; i < numRecordsPerType; i++) {
                // Get different dates for each month and log (differing from today by i months)
                let logDate = todayLog;
                logDate.setMonth(i);
                let noteDate = new Date(todayNote.getMonth() + i);
                noteDate.setMonth(todayNote.getMonth() + i);
                // Create a new log and note with the updated dates
                let log = new Record("log", { date: logDate });
                let note = new Record("note", { date: noteDate });
                // Save the note and log in records
                records.push(log);
                records.push(note);
            }
            // Add the log and note to the records local storage
            localStorage.setItem("Records", JSON.stringify(records));
            const retrievedRecords = LocalStorageRecordsApi.getAllRecords();
            expect(retrievedRecords.length).toBe(numRecordsPerType * 2);

            // check hasRecordByDate works on dates it has
            for (let i = 0; i < numRecordsPerType; i++) {
                LocalStorageRecordsApi.hasRecordByDate();
            }
        });

        it("Check hasRecordByDate on unstored dates", () => {
            console.log("\n\n\n\n\n\n", records, "\n\n\n\n\n\n");
            localStorage.setItem("Records", "invalid");
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(0);
        });
    });
});
*/
