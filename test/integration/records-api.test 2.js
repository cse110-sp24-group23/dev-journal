import LocalStorageRecordsApi from "../../src/backend-storage/records-api";
import LocalStorageMock from "../../tools/localStorage-mock";

global.localStorage = new LocalStorageMock();

describe("LocalStorageRecordsApi", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("getAllRecords", () => {
        it("Empty Records", () => {
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(0);
        });

        it("Record exists", () => {
            const recordObject = { id: 123, name: "test" };
            localStorage.setItem("Records", JSON.stringify([recordObject]));
            const records = LocalStorageRecordsApi.getAllRecords();
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
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(2);
            expect(records[0]).toEqual(recordObject1);
            expect(records[1]).toEqual(recordObject2);
        });

        it("Invalid Records", () => {
            localStorage.setItem("Records", "invalid");
            const records = LocalStorageRecordsApi.getAllRecords();
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
            LocalStorageRecordsApi.createRecord(recordObject);
            const records = LocalStorageRecordsApi.getAllRecords();
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
            LocalStorageRecordsApi.createRecord(recordObject);
            expect(() => {
                LocalStorageRecordsApi.createRecord(recordObject);
            }).toThrow();
            const records = LocalStorageRecordsApi.getAllRecords();
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
            LocalStorageRecordsApi.createRecord(recordObject1);
            LocalStorageRecordsApi.createRecord(recordObject2);
            const records = LocalStorageRecordsApi.getAllRecords();
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
            LocalStorageRecordsApi.createRecord(recordObject);
            const newRecordObject = {
                id: 456,
                title: "updated title",
                field1: "updated field 1",
                field2: "updated field 2",
            };
            LocalStorageRecordsApi.updateRecord(newRecordObject);
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(records.length).toBe(1);
            expect(records[0].title).toBe(newRecordObject.title);
            expect(records[0].field1).toBe(newRecordObject.field1);
            expect(records[0].field2).toBe(newRecordObject.field2);
            expect(records[0].updated).not.toBe(records[0].created);
        });

        it("Record not found", () => {
            const recordObject = { id: 18329091823 };
            expect(() => {
                LocalStorageRecordsApi.updateRecord(recordObject);
            }).toThrow();
        });
    });

    describe("getRecordbyId", () => {
        it("Record found", () => {
            const recordObject = { id: 456, title: "test" };
            LocalStorageRecordsApi.createRecord(recordObject);
            const record = LocalStorageRecordsApi.getRecordById(456);
            expect(record).toEqual(recordObject);
        });

        it("Record not found", () => {
            expect(() => {
                LocalStorageRecordsApi.getRecord(123);
            }).toThrow();
        });

        it("Record not found 2", () => {
            const recordObject = { id: 456, title: "test" };
            const recordObject2 = { id: 789, title: "test2" };
            LocalStorageRecordsApi.createRecord(recordObject);
            LocalStorageRecordsApi.createRecord(recordObject2);
            expect(() => {
                LocalStorageRecordsApi.getRecord("456");
            }).toThrow();
        });
    });

    describe("getRecordByDate", () => {
        it("Record found", () => {
            const currTime = new Date().setHours(0, 0, 0, 0);
            const currDate = new Date(currTime);
            const recordObject = { id: currTime, title: "test" };
            LocalStorageRecordsApi.createRecord(recordObject);
            const record = LocalStorageRecordsApi.getRecordByDate(currDate);
            expect(record).toEqual(recordObject);
        });

        it("Record not found", () => {
            const currDate = new Date();
            expect(() => {
                LocalStorageRecordsApi.getRecordByDate(currDate);
            }).toThrow();
        });
    });

    describe("hasRecord", () => {
        it("Record exists", () => {
            const currTime = new Date().setHours(0, 0, 0, 0);
            const currDate = new Date(currTime);
            const recordObject = { id: currTime, title: "test" };
            LocalStorageRecordsApi.createRecord(recordObject);
            expect(LocalStorageRecordsApi.hasRecordByDate(currDate)).toBe(true);
        });

        it("Record does not exist", () => {
            expect(LocalStorageRecordsApi.hasRecordByDate(new Date())).toBe(
                false
            );
        });
    });

    describe("deleteRecord", () => {
        it("Record deleted", () => {
            const recordObject = { id: 123, title: "test" };
            LocalStorageRecordsApi.createRecord(recordObject);
            LocalStorageRecordsApi.deleteRecord(123);
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(records.length).toBe(0);
        });

        it("Record not found", () => {
            expect(() => {
                LocalStorageRecordsApi.deleteRecord(123);
            }).toThrow();
        });
    });
});
