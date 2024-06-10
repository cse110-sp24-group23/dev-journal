/**
 * Represents an accomplishment object.
 * @class
 */
export class AccomplishmentsObj {
    /**
     * Creates an instance of AccomplishmentsObj.
     * @constructor
     * @param {string[]} content - The content of the accomplishment(s).
     * @param {Date} date - The date of the accomplishment. (Day Month Year Only)
     */
    constructor(content, date) {
        /**
         * The content of the accomplishment.
         * @type {string[]}
         */
        this.content = content;

        /**
         * The date of the accomplishment with Year, Month, Day Set (no time)
         * @type {Date}
         */
        this.date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        /**
         * The unique identifier of the accomplishment based on the time of the date.
         * @type {number}
         */
        this.id = this.date.getTime();
    }
}
