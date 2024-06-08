import Storage from "../../src/backend-storage/accomplishments-api.js";
import { AccomplishmentsObj } from "../../src/backend-storage/accomplishments-class.js";
import LocalStorageMock from "../../tools/localStorage-mock.js";

global.localStorage = new LocalStorageMock();

describe("Create AccomplishmentsObj", () => {
    it("Create new AccomplishmentsObj", () => {
        const date = new Date();
        const accomplishmentsObj = new AccomplishmentsObj(["test"], date);
        Storage.createAccomplishmentsObj(accomplishmentsObj);
        expect(Storage.hasAccomplishmentsObjByDate(date)).toBe(true);
    });
    it("Create existing AccomplishmentsObj", () => {
        const date = new Date();
        const accomplishmentsObj = new AccomplishmentsObj(["test"], date);
        const errorMessage = `Could not create accomplishments object, object with date already exists:`;

        expect(() => {
            Storage.createAccomplishmentsObj(accomplishmentsObj);
        }).toThrow(errorMessage);
        expect(Storage.hasAccomplishmentsObjByDate(date)).toBe(true);
    });
});
