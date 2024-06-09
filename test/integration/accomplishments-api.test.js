import LocalStorageAccomplishmentsApi from "../../src/backend-storage/accomplishments-api";
import { AccomplishmentsObj } from "../../src/backend-storage/accomplishments-class";
import LocalStorageMock from "../../tools/localStorage-mock";

global.localStorage = new LocalStorageMock();

describe("LocalStorageRecordsApi", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("Create accomplishments objects, check hasAccomplishmentObjByDate", () => {
        it("Create Accomplishments objects, check them by date", () => {
            let accomplishmentsObjArr = [];
            // Get date of current day in log format and notes format
            const date1 = new Date(2024, 3, 22);
            const date2 = new Date(2024, 5, 12);
            const date3 = new Date(2024, 7, 30);
            let dates = [date1, date2, date3];
            // Get accomplishments
            const accompContent1 = [
                "Finished project",
                "wrote tests",
                "wrote docs",
            ];
            const accompContent2 = ["updated cicd"];
            const accompContent3 = ["closed issues"];
            let accomplishments = [
                accompContent1,
                accompContent2,
                accompContent3,
            ];
            // Create accomplishments objects
            for (let i = 0; i < dates.length; i++) {
                let content = accomplishments[i];
                let date = dates[i];
                let accomplishmentsObj = new AccomplishmentsObj(content, date);
                accomplishmentsObjArr.push(accomplishmentsObj);
            }
            // Add accomplishments objects to the accomplishments local storage
            localStorage.setItem(
                "Accomplishments",
                JSON.stringify(accomplishmentsObjArr)
            );
            // Get accomplishments from local storage, expect the length to be the number we created
            const retrievedAccomplishments =
                LocalStorageAccomplishmentsApi.getAllAccomplishmentsObj();
            expect(retrievedAccomplishments.length).toBe(dates.length);

            // check hasAccomplishmentsObjByDate returns true on dates it has
            for (let i = 0; i < retrievedAccomplishments.length; i++) {
                let hasAccompByDate =
                    LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(
                        dates[i]
                    );
                expect(hasAccompByDate).toBe(true);
            }

            // Check deleting an accomplishmentsObj makes its date false
            LocalStorageAccomplishmentsApi.deleteAccomplishmentsObj(dates[0]);
            let hasAccompByDate =
                LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(
                    dates[0]
                );
            expect(hasAccompByDate).toBe(false);

            // Check that size of accomplishments decremented after deleting one
            let reretrievedAccomplishments =
                LocalStorageAccomplishmentsApi.getAllAccomplishmentsObj();
            expect(reretrievedAccomplishments.length).toBe(dates.length - 1);
            expect(true).toBe(true);
        });

        it("Check hasAccomplishmentsObjByDate on false dates", () => {
            // Check hasAccomplishmentsObjByDate returns false on dates it doesn't have
            const falseDate1 = new Date(2023, 2, 11);
            const falseDate2 = new Date(2022, 1, 23);
            const falseDate3 = new Date(2026, 5, 12);
            const falseDates = [falseDate1, falseDate2, falseDate3];
            // Check false dates
            for (let i = 0; i < falseDates.length; i++) {
                let hasAccompByDate =
                    LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(
                        falseDates[i]
                    );
                expect(hasAccompByDate).toBe(false);
            }
        });
        it("Update Accomplishments Object", () => {
            // Check updateAccomplishmentsObj is successful
            // Create a new accomplishments object
            const content = ["accomplishment 1", "Another accomplishment."];
            const date = new Date(2019, 5, 12);
            const accomplishmentsObj = new AccomplishmentsObj(content, date);
            LocalStorageAccomplishmentsApi.createAccomplishmentsObj(
                accomplishmentsObj
            );
            // Update that accomplishments object
            const newContent = [
                "accomplishment 1",
                "a different accomplishment",
                "A new accomplishment",
            ];
            let storedAccomplishmentsObj =
                LocalStorageAccomplishmentsApi.getAccomplishmentsObjByDate(
                    date
                );
            storedAccomplishmentsObj.content = newContent;
            LocalStorageAccomplishmentsApi.updateAccomplishmentsObj(
                storedAccomplishmentsObj
            );
            // Check that accomplishments got updated
            let retrieved =
                LocalStorageAccomplishmentsApi.getAccomplishmentsObjByDate(
                    date
                );
            // compare each accomplishment in accomplishmentsObj.content
            for (let i = 0; i < retrieved.content.length; i++) {
                expect(retrieved.content[i]).toBe(newContent[i]);
            }
        });
    });
});
