import { Record } from "../backend-storage/record-class.js";
import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";

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
    console.log(note.id, "|", note.title, "|", note.field1);
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
    const noteTitle = document.getElementById("note-editor-title");
    // the textbox to enter notes in
    const noteTextContent = document.getElementById("note-content");
    const noteContent = noteTextContent.value;
    const noteTitleContent = noteTitle.innerText;
    const noteRecord = new Record("note", {
        field1: noteContent,
        title: noteTitleContent,
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

function _addNoteTextbox() {
    const notesContainer = document.querySelector(".js-notes-container");
    const note = document.createElement("div");
    const noteTitle = document.createElement("input");
    const noteContent = document.createElement("textarea");
    const noteSaveBtn = document.createElement("button");
    // add ways to access elements
    note.className = "note-editor";
    noteTitle.id = "note-editor-title";
    // add format/styles
    // title
    noteTitle.type = "text";
    noteTitle.style = "display:block;";
    noteTitle.placeholder = "Title";
    // save button
    noteSaveBtn.innerText = "Save";
    // content
    noteContent.id = "note-content";
    noteContent.placeholder = "Notes";
    noteContent.style = "display:block;";
    // create note editor
    note.appendChild(noteTitle);
    note.appendChild(noteContent);
    note.appendChild(noteSaveBtn);
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
    // notes.appendChild(noteTextBox).appendChild(noteHeading).appendChild(note);
    // document.getElementById('add-note-textbox').style.display = 'block';
}

window.onload = function () {
    loadFromStorage();
    const addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener("click", _addNoteTextbox);
};
