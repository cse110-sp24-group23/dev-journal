export class Record {
    type;
    title;
    hours;
    field1;
    field2;
    created;
    updated;
    id;
    constructor(
        type,
        field1 = null,
        field2 = null,
        hours = null,
        title = null,
        date = null
    ) {
        const types = ["log", "note"];
        if (!types.includes(type)) {
            throw Error("The parameter type must be 'log' or 'note'.");
        }
        if (type === "note" && field2) {
            throw Error("Notes can only have one field.");
        }
        if (type === "log" && !date) {
            throw Error("Logs must have date.");
        }
        this.type = type;
        this.hours = hours;
        this.field1 = field1;
        this.field2 = field2;
        const currentDate = new Date();
        this.created = currentDate.toISOString();
        this.updated = currentDate.toISOString();
        if (type === "log") {
            // logDate should only contain year, month and date (hours, seconds, milliseconds = 0)
            const logDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            this.id = logDate.getTime();
            // set the title to the date regardless of what the user passes in
            this.title = logDate.toDateString();
        } else if (type === "note") {
            this.id = currentDate.getTime();
            // set the title based on what the passes in or "Untitled"
            if (!title) {
                this.title = "Untitled";
            } else {
                this.title = title;
            }
        }
    }
}
