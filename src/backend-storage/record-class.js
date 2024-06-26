/**
 * Class Record for creating Record objects to store logs or notes
 * @class
 */
export class Record {
    // Type of record being stored
    type;
    title;
    hours;
    // Text fields for record
    field1;
    field2;
    created;
    updated;
    id;
    date;
    hasAccomplishment;

    /*
    ================================================
                    PUBLIC METHODS
    ================================================
    */

    /*
    Given a type of record, text fields, or hours, title, or date, 
    create a Record object.
    */
    constructor(
        type,
        options = {
            field1: null,
            field2: null,
            hours: null,
            title: null,
            date: null,
        }
    ) {
        const types = ["log", "note"];
        // Ensure the information given matches the type of record
        if (!types.includes(type)) {
            throw Error("The parameter type must be 'log' or 'note'.");
        }
        if (type === "note" && options.field2) {
            throw Error("Notes can only have one field.");
        }
        if (type === "note" && options.hours) {
            throw Error("Notes cannot have an hours member variable'.");
        }
        if (type === "log" && !options.date) {
            throw Error("Logs must have date.");
        }
        // Initialize member variables
        this.type = type;
        this.hours = options.hours;
        this.field1 = options.field1;
        this.field2 = options.field2;
        const currentDate = new Date();
        this.created = currentDate.toISOString();
        this.updated = currentDate.toISOString();
        this.hasAccomplishment = false;
        if (type === "log") {
            // logDate should only contain year, month and date (hours, seconds, milliseconds = 0)
            const logDate = new Date(
                options.date.getFullYear(),
                options.date.getMonth(),
                options.date.getDate()
            );
            this.id = logDate.getTime();
            // set the title to the date regardless of what the user passes in
            const dateOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            this.title = logDate.toLocaleString("en-US", dateOptions);
            // set date for log
            this.date = logDate;
        } else if (type === "note") {
            this.id = currentDate.getTime();
            // set the title based on what is passed in or "Untitled"
            if (!options.title) {
                this.title = "Untitled";
            } else {
                this.title = options.title;
            }
        }
    }
}
