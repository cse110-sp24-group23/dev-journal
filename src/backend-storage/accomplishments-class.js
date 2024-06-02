export class AccomplishmentsObj {
    content;
    date;
    id;
    constructor(content, date) {
        this.content = content;
        // make sure hours, minutes, seconds, milliseconds are all 0
        this.date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        this.id = this.date.getTime();
    }
}