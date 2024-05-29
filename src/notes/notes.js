import { Record } from "../backend-storage/record-class.js";
import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";

/*
TODO:
    - abilitiy to close/cancel popup (cancel or X button in top right?)
        - Daniel - done
    - hide trash icons until delete Note button is pressed
        - when it is pressed change text on it to say something like stop deleting
        - icons go back to display:none;
        - Ravi
    - stop mutliple popups from appearing
        - Ravi
*/

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
Given a note element the note editor and populate it with values of a note element if one is given
Parameters:
    - note (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _addListeners(noteElem) {
    _addDeleteButtonListener(noteElem);
    noteElem.addEventListener("click", _displayNoteEditor(noteElem));
}

// given the id of a note, load it from storage. If no id is given, it will load the most recently added note
function _loadNotefromStorage(id = null) {
    const notesDisplay = document.querySelector(".notes-display");
    let note;
    if (id) {
        note = RecordsStorage.getRecordById(id);
    } else {
        const notesList = RecordsStorage.getAllRecords("note");
        note = notesList[notesList.length - 1];
    }
    let newNote = document.createElement("my-note");
    newNote.id = note.id;
    newNote.title = note.title;
    newNote.date = note.created;
    newNote.content = note.field1;
    notesDisplay.prepend(newNote);
    _addListeners(newNote);
}

// given a note, add a delete button listener to it that will delete it when clicked
function _addDeleteButtonListener(noteElem) {
    const deleteButton = noteElem.shadowRoot.querySelector(".js-trash");
    deleteButton.addEventListener("click", () => {
        const noteId = noteElem.id;
        deleteFromStorage(noteId);
    });
}

// submit to local storage
function submitToStorage() {
    // the title of the note
    const noteTitleElem = document.getElementById("note-editor-title");
    const noteTitle = noteTitleElem.value;
    // the textbox to enter notes in
    const noteContentElem = document.getElementById("note-editor-content");
    const noteContent = noteContentElem.value;
    // create a new record to store the note
    const noteRecord = new Record("note", {
        field1: noteContent,
        title: noteTitle,
    });
    RecordsStorage.createRecord(noteRecord);
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
    // if the note Editor has already been created, update it, otherwise, create it
    if (editorCreated) {
        _updateNoteEditor(noteElem);
        noteEditor.removeClassList("hidden");
    } else {
        _createNoteEditor(noteElem);
    }
    // get buttons for the note editor
    const noteSaveBtn = document.getElementById("save-btn");
    const noteCancelBtn = document.getElementById("cancel-btn");
    // when the save is clicked, save to storage, update display
    noteSaveBtn.addEventListener("click", (event) => {
        // put note in storage
        submitToStorage();
        // hide the note editor display
        noteEditor.appendClassList("hidden");
        // if we are editing a note
        if (noteElem) {
            // display the updated note
            _loadNotefromStorage(noteElem.id);
            // remove the old note from view
            noteElem.remove();
        }
        // otherwise
        else {
            // show new note by loading in the most recently created note from storage
            _loadNotefromStorage();
        }
    });
    noteCancelBtn.addEventListener("click", (event) => {
        noteEditor.appendClassList("hidden");
    });
}

/*
Create the note editor and populate it with values of a note element if one is given
Parameters:
    - noteElem (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _createNoteEditor(noteElem = null) {
    const notesContainer = document.querySelector(".js-notes-container");
    // Elements for the note editor
    const noteEditor = document.createElement("div");
    const noteTitle = document.createElement("input");
    const noteContent = document.createElement("textarea");
    const saveBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");
    // add ways selectors to elements
    noteEditor.id = "note-editor";
    noteTitle.id = "note-editor-title";
    noteContent.id = "note-editor-content";
    saveBtn.id = "save-btn";
    cancelBtn.id = "cancel-btn";
    // add formats/attributes to elements
    noteTitle.type = "text";
    noteTitle.maxLength = "50"; // define a max amount of characters users can input
    noteTitle.placeholder = "Title"; // make it a text input
    noteContent.placeholder = "Notes";
    // update button texts
    saveBtn.innerText = "Save";
    cancelBtn.innerText = "Cancel";
    // if there was a note passed in, populate values
    if (noteElem) {
        noteTitle.value = noteElem.title;
        noteContent.value = noteElem.content;
    }
    // Populate note editor
    noteEditor.appendChild(noteTitle);
    noteEditor.appendChild(noteContent);
    noteEditor.appendChild(saveBtn);
    noteEditor.appendChild(cancelBtn);
    // Put note editor in the main notes container to be displayed
    notesContainer.prepend(noteEditor);
}

/*
update the note editor with values of a note element if one is given, otherwise clear the values
Parameters:
    - noteElem (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _updateNoteEditor(noteElem = null) {
    const noteTitle = document.getElementById("note-editor-title");
    const noteContent = document.getElementById("note-editor-content");
    // if there was a note passed in, populate values
    if (noteElem) {
        noteTitle.value = noteElem.title;
        noteContent.value = noteElem.content;
    } else {
        noteTitle.value = "";
        noteContent.value = "";
    }
}

window.onload = function () {
    loadFromStorage();
    const addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener("click", _displayNoteEditor);
};
