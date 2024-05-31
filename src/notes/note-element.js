class Note extends HTMLElement {
    static get ObservedAttributes() {
        return ["id", "date", "title", "content", "preview"];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this._id = null;
        this._date = null;
        this._title = null;
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

    get title() {
        return this._title;
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

    set title(value) {
        this._title = value;
        this.setAttribute("title", value);
    }

    set date(value) {
        this._date = value;
        this.setAttribute("date", value);
    }

    set content(value) {
        // set content
        this._content = value;
        this.setAttribute("content", value);
        // set preview
        // define a max length for the preview
        const maxPreviewLength = 50;
        const previewBody = this._content.slice(0, maxPreviewLength);
        // suffix for preview is default empty, but an elipses if it's truncated from content
        let suffix = "";
        if (previewBody != this._content) {
            suffix = "...";
        }
        // define preview to be the main body with a potential elipses
        this._preview = previewBody + suffix;
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
    // git commit -m "#18 added elipses back to custom note element previews"
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
        this.shadow.innerHTML = `
        <p id="date">${this._formatDate(this._date)}</p>
        <p>${this._title}</p>
        <p class="preview">${this._preview}</p>
        <img src="../assets/icons/trash-icon.svg" alt="Delete" class="hidden js-trash" id="js-trash">
        <style>
            .preview {
                color: gray;
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
    }
}
customElements.define("my-note", Note);
