class Note extends HTMLElement {
    static get ObservedAttributes() {
        return ["id", "date", "content", "preview"];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.innerHTML = `
        <h4>${this.date}</h4>
        <textarea disabled>${this.preview}</textarea>
        <button>Delete</button>
        `;

        this._id = null;
        this._date = null;
        this._content = null;
        this._preview = null;
    }
    /*
    =======================
        Get functions
    =======================
    */
    get id() {
        return this._id;
    }

    get date() {
        return this._date;
    }

    get content() {
        return this._content;
    }

    get preview() {
        return this._preview;
    }

    /*
    =======================
        Set functions
    =======================
    */
    set id(value) {
        this._id = value;
        this.setAttribute("id", value);
    }

    set date(value) {
        this._date = value;
        this.setAttribute("date", value);
    }

    set content(value) {
        this._content = value;
        this.setAttribute("content", value);
        const previewChars = 100;
        this._preview = this._content.slice(0, previewChars);
    }

    /*
    Change note attributes from oldValue to newValue
    Parameters: name, oldValue, newValue
        - name: attribute name
        - oldValue: old content of attribute
        - newValue: new content of attribute
    return: None
    */
    attributeChangeCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === "id") {
            this.id = newValue;
        }
        // if (name === 'title'){
        //     this.title = newValue;
        // };
        if (name === "date") {
            this.date = newValue;
        }
        if (name === "content") {
            this.content = newValue;
        }
    }
    /*
    Given a date string like 2024-05-27T07:50:04.274Z, return a string in the form May 27, 2024
    Parameters:
        - dateString: String that represents a date
    Return:
        - String of the same date but in a readable form
    */
    _formatDate(dateString) {
        const date = new Date(dateString);
        const settings = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString("en-US", settings);
    }

    /*
    Initialize values when new note is added.
    Parameters: None
    Return: None
    */
    connectedCallback() {
        this._id = this.getAttribute("id");
        this._title = this.getAttribute("title");
        this._date = this.getAttribute("date");
        this._content = this.getAttribute("content");
        // if the content is longer than the preview, add an elipses to the preview
        this.shadow.innerHTML = `
        <p id="date">${this._formatDate(this._date)}</p>
        <p>${this._title}</p>
        <img src="../assets/icons/trash-icon.svg" alt="Delete" class="js-trash">
        <style>
            #date {
                width: max-content;
                margin-right: 0;
                margin-left: auto;
            }
            #icons-container {
                float: right;
            }
            img {
                height: 2em;
                margin-bottom: 0;
                margin-top: auto;
                display: inline-block;
                float: right;
            }
        </style>
        `;
        this.classList.add("note");
    }
}
customElements.define("my-note", Note);
