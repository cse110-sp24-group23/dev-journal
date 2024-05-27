import { Record } from "../backend-storage/record-class.js";
import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";
console.log("message");
// const now = new Date();
// const recordObject = new Record('note', {
//     field1: "gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg", 
//     date: now,
//     title: "mynote"});
// RecordsStorage.createRecord(recordObject);

console.log(RecordsStorage.getAllRecords('note'));
