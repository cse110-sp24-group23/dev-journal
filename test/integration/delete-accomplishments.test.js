import LocalStorageAccomplishmentsApi from "../../src/backend-storage/accomplishments-api.js";
import { AccomplishmentsObj } from "../../src/backend-storage/accomplishments-class.js";
import LocalStorageMock from "../../tools/localStorage-mock.js";

global.localStorage = new LocalStorageMock();

describe("Delete AccomplishmentsObj", () => {
    beforeAll(() => {
        localStorage.clear();
    });
    it("Delete exsisting AccomplishmentsObj", () => {
        const date = new Date();
        const accomplishmentsObj = new AccomplishmentsObj(["test"], date);
        LocalStorageAccomplishmentsApi.createAccomplishmentsObj(
            accomplishmentsObj
        );
        LocalStorageAccomplishmentsApi.deleteAccomplishmentsObj(date);

        expect(
            LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)
        ).toBe(false);

        const accomplishments =
            LocalStorageAccomplishmentsApi.getAllAccomplishmentsObj();
        expect(accomplishments.length).toBe(0);
    });

    it("AccomplishmentsObj not found", () => {
        const date = new Date();
        const errorMessage = `Could not delete accomplishments object, object not found for date:`;
        expect(() => {
            LocalStorageAccomplishmentsApi.deleteAccomplishmentsObj(date);
        }).toThrow(errorMessage);

        expect(
            LocalStorageAccomplishmentsApi.hasAccomplishmentsObjByDate(date)
        ).toBe(false);
    });
});
