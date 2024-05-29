import { Record } from "../backend-storage/record-class.js";
import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";

/*
TODO:
    - edit notes brings up popup
        - Daniel
    - abilitiy to close/cancel popup (cancel or X button in top right?)
        - Daniel - done
    - debug untitled/not displayed notes
        - Ravi
    - hide trash icons until delete Note button is pressed
        - when it is pressed change text on it to say something like stop deleting
        - icons go back to display:none;
        - Ravi
*/

// TODO: make it so newest added notes are on top - sort by most recently created
function loadFromStorage() {
    const notesDisplay = document.querySelector(".notes-display");
    const notesList = RecordsStorage.getAllRecords("note");
    for (const note of notesList) {
        let newNote = document.createElement("my-note");
        newNote.id = note.id;
        newNote.title = note.title;
        newNote.date = note.created;
        newNote.content = note.field1;
        notesDisplay.prepend(newNote);
        _addDeleteButtonListener(newNote);
        _addEditListener(newNote);
    }
}



// load the newest note from local storage
function _loadNewestNoteFromStorage() {
    const notesDisplay = document.querySelector(".notes-display");
    const notesList = RecordsStorage.getAllRecords("note");
    const note = notesList[notesList.length - 1];
    let newNote = document.createElement("my-note");
    newNote.id = note.id;
    newNote.title = note.title;
    newNote.date = note.created;
    newNote.content = note.field1;
    notesDisplay.prepend(newNote);
    _addDeleteButtonListener(newNote);
}

// given a note, add a delete button listener to it that will delete it when clicked
function _addDeleteButtonListener(note) {
    const deleteButton = note.shadowRoot.querySelector(".js-trash");
    deleteButton.addEventListener("click", () => {
        const noteId = note.id;
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

function _addNoteTextbox(prevNote = null) {
    const notesContainer = document.querySelector(".js-notes-container");
    const note = document.createElement("div");
    const noteTitle = document.createElement("input");
    const noteContent = document.createElement("textarea");
    const noteSaveBtn = document.createElement("button");
    const noteCancelBtn = document.createElement("button");
    // add ways to access elements
    note.className = "note-editor";
    noteTitle.id = "note-editor-title";
    // add format/styles
    // title
    noteTitle.type = "text";
    noteTitle.maxLength = "50"; // define a max amount of characters users can input
    noteTitle.style = "display:block;";
    noteTitle.placeholder = "Title";
    // save button
    noteSaveBtn.innerText = "Save";
    // cancel button
    noteCancelBtn.innerText = "Cancel";
    // content
    noteContent.id = "note-editor-content";
    noteContent.placeholder = "Notes";
    noteContent.style = "display:block;";
    // create note editor
    note.appendChild(noteTitle);
    note.appendChild(noteContent);
    note.appendChild(noteSaveBtn);
    note.appendChild(noteCancelBtn);

    // display note editor
    notesContainer.prepend(note);
    noteSaveBtn.addEventListener("click", (event) => {
        // put note in storage
        submitToStorage();
        // get rid of the note editor display
        note.style.display = "none";
        // show the newly created note
        _loadNewestNoteFromStorage();
    });
    noteCancelBtn.addEventListener("click", (event) => {
        note.style.display = "none";
    });
    // notes.appendChild(noteTextBox).appendChild(noteHeading).appendChild(note);
    // document.getElementById('add-note-textbox').style.display = 'block';
}

window.onload = function () {
    loadFromStorage();
    const addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener("click", _addNoteTextbox());
};
