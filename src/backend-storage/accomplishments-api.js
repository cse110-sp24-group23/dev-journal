/**Class LocalStorageAccomplishmentsApi for creating, reading, updating and deleting accomplishments
 * @class
 */
export default class LocalStorageAccomplishmentsApi {
    /**Gets all accomplishments from LocalStorage
     * @returns {Array} array of accoplishment objects
     */
    static getAllAccomplishmentsObj() {
        try {
            const Accomplishments =
                JSON.parse(localStorage.getItem("Accomplishments")) || [];
            return Accomplishments;
        } catch (error) {
            console.warn(error);
            console.warn("Returning Empty List");
            return [];
        }
    }

    /**Creates a new accomplishments object in LocalStorage
     * @param {accomplishmentsObj} accomplishmentsObj accomplishments object
     * @throws {Error} could not create accomplishments object due to date already existing
     */
    static createAccomplishmentsObj(accomplishmentsObj) {
        const Accomplishments = this.getAllAccomplishmentsObj();
        const existingAccomplishmentsObj = Accomplishments.find(
            (object) => object.id === accomplishmentsObj.id
        );
        if (existingAccomplishmentsObj) {
            throw new Error(
                "Could not create accomplishments object, object with date already exists:",
                accomplishmentsObj.id
            );
        }
        Accomplishments.push(accomplishmentsObj);
        localStorage.setItem(
            "Accomplishments",
            JSON.stringify(Accomplishments)
        );
    }

    /**Updates an accomplishmentsObj in LocalStorage
     * @param {accomplishmentsObj} accomplishmentsObj accomplishments object
     * @throws {Error} could not update accomplishments object due to object date not found
     */
    static updateAccomplishmentsObj(accomplishmentsObj) {
        const Accomplishments = this.getAllAccomplishmentsObj();
        const existingAccomplishmentsObj = Accomplishments.find(
            (object) => object.id === accomplishmentsObj.id
        );
        if (!existingAccomplishmentsObj) {
            throw new Error(
                "Could not update accomplishments object, object for date not found:",
                accomplishmentsObj.id
            );
        }
        existingAccomplishmentsObj.content = accomplishmentsObj.content;
        localStorage.setItem(
            "Accomplishments",
            JSON.stringify(Accomplishments)
        );
    }

    /**Gets an accomplishmentsObj from LocalStorage by date
     * @param {Date} date date ojbect (new Date(Year, Month, Day))
     * @throws {Error} accomplishments object not found for date if it doesn't exist
     * @returns {accomplishmentsObj} accomplishments object
     */
    static getAccomplishmentsObjByDate(date) {
        date = this._handleDateInput(date);
        const Accomplishments = this.getAllAccomplishmentsObj();
        const accomplishmentsObj = Accomplishments.find(
            (object) => object.id === date.getTime()
        );

        if (!accomplishmentsObj) {
            throw new Error(
                "Accomplishments object not found for date",
                date.toLocaleDateString("en-US")
            );
        }
        return accomplishmentsObj;
    }

    /**Checks if an accomplishments object exists in localStorage by date
     * @param {Date} date date object (new Date(Year, Month, Day))
     * @returns {Boolean} true if accomplishments object exists, false if it doesn't exist
     */
    static hasAccomplishmentsObjByDate(date) {
        date = this._handleDateInput(date);
        const Accomplishments = this.getAllAccomplishmentsObj();
        const accomplishmentsObj = Accomplishments.find(
            (object) => object.id === date.getTime()
        );
        if (!accomplishmentsObj) {
            return false;
        }
        return true;
    }

    /**Deletes an accomplishments object from localStorage
     * @param {Date} date date object (new Date(Year, Month, Day))
     * @throws {Error} could not delete accomplishments object due to date not found
     */
    static deleteAccomplishmentsObj(date) {
        date = this._handleDateInput(date);
        const Accomplishments = this.getAllAccomplishmentsObj();
        const notDeletedAccomplishments = Accomplishments.filter(
            (object) => object.id !== date.getTime()
        );
        if (notDeletedAccomplishments.length === Accomplishments.length) {
            throw new Error(
                "Could not delete accomplishments object, object not found for date:",
                date.toLocaleDateString("en-US")
            );
        }
        localStorage.setItem(
            "Accomplishments",
            JSON.stringify(notDeletedAccomplishments)
        );
    }

    /**Turn a date object into a new date object that only contains year, month, date
     * @param {Date} date date object (new Date(Year, Month, Day))
     * @returns {Date} returns a new date object with same Year, Month, Date
     */
    static _handleDateInput(date) {
        // make sure hours, minutes, seconds, miliseconds aren't taken into account
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
}
