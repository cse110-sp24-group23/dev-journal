/**
 * Represents a custom HTML element for a note.
 * @extends HTMLElement
 */
class Note extends HTMLElement {
    /**
     * Returns an array of all attributes that can be observed for a note element.
     * @returns {string[]} Array of attribute names
     */
    static get ObservedAttributes() {
        return ["id", "date", "title", "content", "preview"];
    }

    /**
     * Initializes the note element.
     */
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this._id = null;
        this._date = null;
        this._title = null;
        this._content = null;
        this._preview = null;
    }

    /**
     * Gets the value of the `id` attribute.
     * @returns {string} The value of the `id` attribute
     */
    get id() {
        return this._id;
    }

    /**
     * Gets the value of the `date` attribute.
     * @returns {string} The value of the `date` attribute
     */
    get date() {
        return this._date;
    }

    /**
     * Gets the value of the `title` attribute.
     * @returns {string} The value of the `title` attribute
     */
    get title() {
        return this._title;
    }

    /**
     * Gets the value of the `content` attribute.
     * @returns {string} The value of the `content` attribute
     */
    get content() {
        return this._content;
    }

    /**
     * Gets the value of the `preview` attribute.
     * @returns {string} The value of the `preview` attribute
     */
    get preview() {
        return this._preview;
    }

    /**
     * Sets the value of the `id` attribute.
     * @param {string} value - The new value for the `id` attribute
     */
    set id(value) {
        this._id = value;
        this.setAttribute("id", value);
    }

    /**
     * Sets the value of the `title` attribute.
     * @param {string} value - The new value for the `title` attribute
     */
    set title(value) {
        this._title = value;
        this.setAttribute("title", value);
    }

    /**
     * Sets the value of the `date` attribute.
     * @param {string} value - The new value for the `date` attribute
     */
    set date(value) {
        this._date = value;
        this.setAttribute("date", value);
    }

    /**
     * Sets the value of the `content` attribute.
     * @param {string} value - The new value for the `content` attribute
     */
    set content(value) {
        this._content = value;
        this.setAttribute("content", value);
        const maxPreviewLength = 50;
        const previewBody = this._content.slice(0, maxPreviewLength);
        let suffix = "";
        if (previewBody != this._content) {
            suffix = "...";
        }
        this._preview = previewBody + suffix;
    }

    /**
     * Handles attribute changes for the note element.
     * @param {string} name - The name of the attribute that changed
     * @param {string} oldValue - The old value of the attribute
     * @param {string} newValue - The new value of the attribute
     */
    attributeChangeCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === "id") {
            this.id = newValue;
        }
        if (name === "date") {
            this.date = newValue;
        }
        if (name === "title") {
            this.title = newValue;
        }
        if (name === "content") {
            this.content = newValue;
        }
        if (name === "preview") {
            this.preview = newValue;
        }
    }

    /**
     * Formats a date string into a readable form.
     * @param {string} dateString - The date string to format
     * @returns {string} The formatted date string
     */
    _formatDate(dateString) {
        const date = new Date(dateString);
        const settings = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", settings);
    }

    /**
     * Initializes the note element when it is added to the DOM.
     */
    connectedCallback() {
        this._id = this.getAttribute("id");
        this._title = this.getAttribute("title");
        this._date = this.getAttribute("date");
        this._content = this.getAttribute("content");
        this.shadow.innerHTML = `
        <p id="date">${this._formatDate(this._date)}</p>
        <p id="title">${this._title}</p>
        <p id="preview">${this._preview}</p>
        <img tabindex=0 src="../assets/icons/trash-icon.svg" alt="Delete" class="hidden js-trash" id="js-trash">
        <style>
            #preview {
                color: gray;
                overflow-wrap: break-word;
            }
            #title {
                overflow-wrap: break-word;
            }
            img {
                height: 2em;
                margin-bottom: 0;
                margin-top: auto;
                float: right;
            }
            .hidden{
                display: none;
            }
            #date {
                width: max-content;
                margin-right: 0;
                margin-left: auto;
            }
            #icons-container {
                float: right;
            }
        </style>
        `;
        this.classList.add("note");
        this.tabIndex = 0;
    }
}
customElements.define("note-element", Note);
