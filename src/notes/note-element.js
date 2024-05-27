
class Note extends HTMLElement{
    static get ObservedAttributes(){
        return ['id', 'date', 'content', 'preview'];
    }
    
    constructor(){
        super();
        this.classList.add('note');
        this.shadow = this.attachShadow({mode: "closed"});
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
        this.setAttribute('id', value);
    }
    
    set date(value) {
        this._date = value;
        this.setAttribute('date', value);
    }
    
    set content(value) {
        this._content = value;
        this.setAttribute('content', value);
        const previewChars = 50;
        this._preview = this._content.slice(0, previewChars);
    }
    
    /*
    Description: Change note attributes from oldValue to newValue
    Parameters: name, oldValue, newValue
        - name: attribute name
        - oldValue: old content of attribute
        - newValue: new content of attribute
    return: None
    */
    attributeChangeCallback(name, oldValue, newValue){
        if (oldValue === newValue){
            return;
        };
        if (name === 'id'){
            this.id = newValue;
        };
        // if (name === 'title'){
        //     this.title = newValue;
        // };
        if (name === 'date'){
            this.date = newValue;
        };
        if (name === 'content'){
            this.content = newValue;
        };
    };
    /*
    Description: Initialize values when new note is added.
    Parameters: None
    Return: None
    */
    connectedCallback(){
        this.id = this.getAttribute('id');
        // this.title = this.getAttribute('title');
        this.date = this.getAttribute('date');
        this.content = this.getAttribute('content');
    };
};
customElements.define("my-note", Note);