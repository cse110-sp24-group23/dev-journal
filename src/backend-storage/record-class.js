export class Record {
    type;
    title;
    hours;
    field1;
    field2;
    created;
    updated;
    id;
    date; //added adte for log because need to access localstorage
    constructor(
        type,
        options = {
            field1: null,
            field2: null,
            hours: null,
            title: null,
            date: null,
            id: null,
        }
    ) {
        const types = ["log", "note"];
        if (!types.includes(type)) {
            throw Error("The parameter type must be 'log' or 'note'.");
        }
        if (type === "note" && options.field2) {
            throw Error("Notes can only have one field.");
        }
        if (type === "log" && !options.date) {
            throw Error("Logs must have date.");
        }
        if (type === "log" && options.id) {
            throw Error("Can't specify ids to create Logs. Access Via dates");
        }
        this.type = type;
        this.hours = options.hours;
        this.field1 = options.field1;
        this.field2 = options.field2;
        const currentDate = new Date();
        this.created = currentDate.toISOString();
        this.updated = currentDate.toISOString();
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
            if (options.id != null) {
                this.id = parseInt(options.id);
            } else {
                this.id = currentDate.getTime();
            }
            // set the title based on what the passes in or "Untitled"
            if (!options.title) {
                this.title = "Untitled";
            } else {
                this.title = options.title;
            }
        }
    }
}
