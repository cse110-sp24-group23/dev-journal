import { Record } from "../backend-storage/record-class.js";
import RecordsStorage from "../backend-storage/records-api.js";

/*
TODO:
    - hide trash icons until delete Note button is pressed
        - when it is pressed change text on it to say something like stop deleting
        - icons go back to display:none;
        - Ravi
*/
let CURRENT_NOTE_ID = null;

function loadFromStorage() {
    const notesDisplay = document.querySelector(".notes-display");
    const notesList = RecordsStorage.getAllRecords("note");
    for (const noteRecord of notesList) {
        let noteElem = document.createElement("my-note");
        noteElem.id = noteRecord.id;
        noteElem.title = noteRecord.title;
        noteElem.date = noteRecord.created;
        noteElem.content = noteRecord.field1;
        notesDisplay.prepend(noteElem);
        _addListeners(noteElem);
    }
}

/*
Given a note element, display the note editor and populate it with values of a note element if one is given
Parameters:
    - note (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _addListeners(noteElem) {
    // when a note is clicked, open the editor for it
    noteElem.addEventListener("click", () => {
        CURRENT_NOTE_ID = noteElem.id;
        _displayNoteEditor(noteElem);
    });

    noteElem.addEventListener("click", function (e) {
        if (e.target.tagName === "IMG") {
            // const noteId = noteElem.id;
            deleteFromStorage(CURRENT_NOTE_ID);
        }
    });

    // _addTrashButtonListener(noteElem);
}

// given the id of a note, load it from storage. If no id is given, it will load the most recently added note
function _loadNotefromStorage(id = null) {
    const notesDisplay = document.querySelector(".notes-display");
    let noteRecord;
    // get the note record from storage
    if (id !== null) {
        // if an id is passed in, get the note record by id
        noteRecord = RecordsStorage.getRecordById(parseInt(id));
    } else {
        // if id is null, get the most recently added note record
        const notesList = RecordsStorage.getAllRecords("note");
        noteRecord = notesList[notesList.length - 1];
    }
    // create a note element to display the noteRecord's info
    let noteElem = document.createElement("my-note");
    noteElem.id = noteRecord.id;
    noteElem.title = noteRecord.title;
    noteElem.date = noteRecord.created;
    noteElem.content = noteRecord.field1;
    // add note element to page
    notesDisplay.prepend(noteElem);
    _addListeners(noteElem);
}

// given a note, add a delete button listener to it that will delete it when clicked
function _addTrashButtonListener(noteElem) {
    if (noteElem.target.tagName == "IMG") {
        const noteId = noteElem.id;
        deleteFromStorage(noteId);
    }
    // deleteButton.addEventListener("click", () => {
    //     const noteId = noteElem.id;
    //     deleteFromStorage(noteId);
    // });
}

// submit to local storage
function submitToStorage() {
    // the title of the note
    const noteTitle = document.getElementById("note-editor-title");
    const noteTitleVal = noteTitle.value;
    // the textbox to enter notes in
    const noteContent = document.getElementById("note-editor-content");
    const noteContentVal = noteContent.value;
    // create a new record to store the note
    const noteRecord = new Record("note", {
        field1: noteContentVal,
        title: noteTitleVal,
        id: CURRENT_NOTE_ID, // will be null if creating one, or a value if updating
    });
    if (CURRENT_NOTE_ID) {
        RecordsStorage.updateRecord(noteRecord);
    } else {
        RecordsStorage.createRecord(noteRecord);
    }
}

function deleteFromStorage(noteId) {
    // Comes in as string, so we convert to a Number
    RecordsStorage.deleteRecord(Number(noteId));
    const notesDisplay = document.querySelector(".notes-display");
    const note = notesDisplay.querySelector(`my-note[id="${noteId}"]`);
    note.remove();
}

/*
Display the note editor and populate it with values of a note element if one is given
Parameters:
    - noteElem (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _displayNoteEditor(noteElem = null) {
    // set editorCreated as a boolean of if there is a noteEditor created yet
    // if it exists, it won't be null
    const editorCreated = document.getElementById("note-editor") != null;
    // if the note Editor has already been created, update it, otherwise, create it
    if (editorCreated) {
        _updateNoteEditor(noteElem);
    } else {
        _createNoteEditor(noteElem);
        _addNoteEditorListeners();
    }
}

/*
Create the note editor and populate it with values of a note element if one is given
Parameters:
    - noteElem (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _createNoteEditor(noteElem = null) {
    // Elements for the note editor
    const noteEditor = document.createElement("div"); //TODO: MAKE THIS A FORM
    const noteTitle = document.createElement("input");
    const noteContent = document.createElement("textarea");
    const saveBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");
    // add selectors to elements
    noteEditor.id = "note-editor";
    noteTitle.id = "note-editor-title";
    noteContent.id = "note-editor-content";
    saveBtn.id = "editor-save-btn";
    cancelBtn.id = "editor-cancel-btn";
    // add formats/attributes to elements
    noteTitle.type = "text";
    noteTitle.maxLength = "50"; // define a max amount of characters users can input
    noteTitle.placeholder = "Title"; // make it a text input
    noteContent.placeholder = "Notes";
    // update button texts
    saveBtn.innerText = "Save";
    cancelBtn.innerText = "Cancel";
    // if there was a note passed in, populate values
    _initNoteEditorValues(noteElem, noteTitle, noteContent);
    // Populate note editor
    noteEditor.appendChild(noteTitle);
    noteEditor.appendChild(noteContent);
    noteEditor.appendChild(saveBtn);
    noteEditor.appendChild(cancelBtn);
    // Put note editor in the main notes container to be displayed
    const notesContainer = document.querySelector(".js-notes-container");
    notesContainer.prepend(noteEditor);
}

function _addNoteEditorListeners() {
    const noteEditor = document.getElementById("note-editor");
    const saveBtn = document.getElementById("editor-save-btn");
    const cancelBtn = document.getElementById("editor-cancel-btn");
    // when the save is clicked, save to storage, update display
    saveBtn.addEventListener("click", () => {
        // put note in storage and hide the form
        submitToStorage();
        noteEditor.classList.add("hidden");
        // if we are editing a note
        if (CURRENT_NOTE_ID != null) {
            const noteElem = document.querySelector(
                `my-note[id="${CURRENT_NOTE_ID}"]`
            );
            // display the updated note and remove the old note from view
            _loadNotefromStorage(CURRENT_NOTE_ID);
            noteElem.remove();
        } else {
            // otherwise, show new note by loading in the most recently created note from storage
            _loadNotefromStorage();
        }
    });
    // when the cancel button is clicked, clear the form and hide it.
    cancelBtn.addEventListener("click", () => {
        // clear note editor form values
        _initNoteEditorValues(null);
        noteEditor.classList.add("hidden");
    });
}

function _initNoteEditorValues(noteElem, noteTitle = null, noteContent = null) {
    // if note title or note content aren't given, define them
    if (!noteTitle || !noteContent) {
        noteTitle = document.getElementById("note-editor-title");
        noteContent = document.getElementById("note-editor-content");
    }
    if (noteElem !== null) {
        noteTitle.value = noteElem.title;
        noteContent.value = noteElem.content;
    } else {
        noteTitle.value = "";
        noteContent.value = "";
    }
}

/*
update the note editor with values of a note element if one is given, otherwise clear the values
Parameters:
    - noteElem (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _updateNoteEditor(noteElem = null) {
    // get note editor
    const noteEditor = document.getElementById("note-editor");
    // if it's hidden, show it
    noteEditor.classList.remove("hidden");
    // if there was a note passed in, populate values
    _initNoteEditorValues(noteElem);
}

/*
Display trash can buttons when delete button is clicked, hide
trash can buttons when done button is clicked.
Parameters: 
    - display: Boolean (true by default) for whether to display the trash icons and done deleting
Returns: none
*/
function _displayTrashBtn(display = true) {
    // const trashBtn = noteElem.shadowRoot.querySelectorAll(".js-trash");
    const delBtn = document.getElementById("delete-note-btn");
    const doneBtn = document.getElementById("done-deleting-note-btn");
    if (display) {
        const noteElems = document.getElementsByClassName(".note");
        for (const noteElem of noteElems) {
            const trashBtn = noteElem.shadowRoot.getElementById(".js-trash");
            // trashBtn.classList.remove("hidden");
            trashBtn.style.display = "block";
            _addTrashButtonListener(noteElem);
        }
    } else {
        const noteElems = document.getElementsByClassName(".note");
        for (const noteElem of noteElems) {
            const trashBtn = noteElem.shadowRoot.getElementById(".js-trash");
            trashBtn.style.display = "none";
            // trashBtn.classList.add("hidden");
        }
    }
}

window.onload = function () {
    // make sure there aren't any error records in storage, then load records
    RecordsStorage.cleanse_records();
    loadFromStorage();
    // display note editor when "Add Note" button clicked
    const addNoteBtn = document.getElementById("add-note-btn");
    addNoteBtn.addEventListener("click", () => {
        CURRENT_NOTE_ID = null;
        _displayNoteEditor();
    });
    // display trash icons when "Delete Notes" button clicked
    const deleteNoteBtn = document.getElementById("delete-note-btn");
    const doneDelNoteBtn = document.getElementById("done-deleting-note-btn");
    deleteNoteBtn.addEventListener("click", () => {
        doneDelNoteBtn.classList.remove("hidden");
        const noteElems = document.getElementsByClassName("note");
        for (const noteElem of noteElems) {
            const trashBtn = noteElem.shadowRoot.getElementById("js-trash");
            // trashBtn.classList.remove("hidden");
            trashBtn.classList.remove("hidden");
            // _addTrashButtonListener(noteElem);
        }
    });
    doneDelNoteBtn.addEventListener("click", () => {
        doneDelNoteBtn.classList.add("hidden");
        const noteElems = document.getElementsByClassName("note");
        for (const noteElem of noteElems) {
            const trashBtn = noteElem.shadowRoot.getElementById("js-trash");
            trashBtn.classList.add("hidden");
        }
    });
};
