import LocalStorageRecordsApi from '../../src/backend-storage/records-api';
import LocalStorageMock from '../../tools/localStorage-mock';

global.localStorage = new LocalStorageMock;

describe('LocalStorageRecordsApi', () => {
    
    describe('getAllRecords', () => {
        it('Empty Records', () => {
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(0);
        });

        it('Record exists', () => {
            const recordObject = { id: '123', name: 'test' };
            localStorage.setItem('Records', JSON.stringify([recordObject]));
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(1);
            expect(records[0]).toEqual(recordObject);
        });

        it('Multiple Records', () => {
            const recordObject1 = { id: '123', name: 'test' };
            const recordObject2 = { id: '456', name: 'test' };
            localStorage.setItem('Records', JSON.stringify([recordObject1, recordObject2]));
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(2);
            expect(records[0]).toEqual(recordObject1);
            expect(records[1]).toEqual(recordObject2);
        });

        it('Invalid Records', () => {
            localStorage.setItem('Records', 'invalid');
            const records = LocalStorageRecordsApi.getAllRecords();
            expect(Array.isArray(records)).toBe(true);
            expect(records.length).toBe(0);
        });

    });
    // describe('createRecord', () => {
    //     it('Record created', () => {
    //         const recordObject = { id: '123', title: "test", field1: "test field 1", field2: "test field 2"};
    //         LocalStorageRecordsApi.createRecord(recordObject);
    //         const records = LocalStorageRecordsApi.getAllRecords();
    //         expect(records.length).toBe(1);
    //         expect(records[0]).toEqual(recordObject);
    //     });
    // });
});

