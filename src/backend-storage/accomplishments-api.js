export default class LocalStorageAccomplishmentsApi {
    /*
    Gets all accomplishments from LocalStorage
    Parameters: None
    Returns: 
    - Array of accomplishment objects
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

    /*
    Creates a new accomplishments object in LocalStorage
    Parameters: 
    - accomplishmentsObj: Acoomplishments object
    Returns: None
    */
    static createAccomplishmentsObj(accomplishmentsObj) {
        const Accomplishments = this.getAllAccomplishmentsObj();
        const existingAccomplishmentsObj = Accomplishments.find(
            (object) => object.date === accomplishmentsObj.date
        );
        if (existingAccomplishmentsObj) {
            throw new Error(
                "Could not create accomplishments object, object with date already exists:",
                object.date
            );
        }
        Accomplishments.push(accomplishmentsObj);
        localStorage.setItem(
            "Accomplishments",
            JSON.stringify(Accomplishments)
        );
    }

    /*
    Updates an accomplishmentsObj in LocalStorage
    Parameters:
    - accomplishmentsObj: accomplishments object
    Returns: None
    */
    static updateAccomplishmentsObj(accomplishmentsObj) {
        const Accomplishments = this.getAllAccomplishmentsObj();
        const existingAccomplishmentsObj = Accomplishments.find(
            (object) => object.date === accomplishmentsObj.date
        );
        if (!existingAccomplishmentsObj) {
            throw new Error(
                "Could not update accomplishments object, object for date not found:",
                accomplishmentsObj.date
            );
        }
        existingAccomplishmentsObj.content = accomplishmentsObj.content;
        localStorage.setItem(
            "Accomplishments",
            JSON.stringify(Accomplishments)
        );
    }

    /*
    Gets an accomplishmentsObj from LocalStorage by date
    Parameters:
    - date: date Object (new Date(Year, Month, Day))
    Returns:
    - accomplishmentsObject
    */
    // For use in Daily Log
    static getAccomplishmentsObjByDate(date) {
        date = this._handleDateInput(date);
        const Accomplishments = this.getAllAccomplishmentsObj();
        const accomplishmentsObj = Accomplishments.find((object) => {
            object.date.getTime() === date.getTime();
        });
        // make sure accomplishments object exists
        if (!accomplishmentsObj) {
            throw new Error("Accomplishments object not found for date", date);
        }
        return accomplishmentsObj;
    }
    /*
    Checks if an accomplishments object exists in LocalStorage by date
    Parameters:
    - date: date Object (new Date(Year, Month Day))
    Returns:
    - Boolean
    */
    static hasAccomplishmentsObjByDate(date) {
        date = this._handleDateInput(date);
        const Accomplishments = this.getAllAccomplishmentsObj();
        const accomplishmentsObj = Accomplishments.find((object) => {
            object.date.getTime() === date.getTime();
        });
        // make sure accomplishments object exists
        if (!accomplishmentsObj) {
            return false;
        }
        return true;
    }

    /*
    Deletes an accomplishments object from LocalStorage
    Parameters: 
    - date: Date object
    Returns: None
    */
    static deleteAccomplishmentsObj(date) {
        date = this._handleDateInput(date);
        if (!this.hasAccomplishmentsObjByDate(date)) {
            throw new Error(
                "Could not delete accomplishments object, object not found for date:",
                date.toLocaleDateString("en-US")
            );
        }
        const Accomplishments = this.getAllAccomplishmentsObj();
        const notDeletedAccomplishments = Accomplishments.filter((object) => {
            object.date.getTime() !== date.getTime();
        });
        localStorage.setItem(
            "Accomplishments",
            JSON.stringify(notDeletedAccomplishments)
        );
    }

    // given a date object, return a new date object that only has year, month, date
    static _handleDateInput(date) {
        // make sure hours, minutes, seconds, miliseconds aren't taken into account
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
}
