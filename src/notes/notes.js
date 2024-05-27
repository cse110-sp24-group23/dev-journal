import { Record } from "../backend-storage/record-class.js";
import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";

function loadFromStorage() {
    const addNotes = document.querySelector(".add-notes");
    const notesList = RecordsStorage.getAllRecords("note");
    for (const note of notesList) {
        let newNote = document.createElement("my-note");
        newNote.id = note.id;
        // newNote.title = note.title;
        newNote.date = note.date;
        newNote.content = note.field1;
        addNotes.appendChild(newNote);
    }
}

// submit to local storage
function submitToStorage() {
    // the title of the note
    const noteTitle = document.getElementById("note-heading");
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

// TODO: delete from local storage
function deleteFromStorage(noteId) {
    RecordsStorage.deleteRecord(noteId);
}

function _addNoteTextbox() {
    const notesDisplay = document.querySelector(".notes-display");
    const note = document.createElement("div");
    const noteTitle = document.createElement("h3");
    const noteContent = document.createElement("textarea");
    const noteSaveBtn = document.createElement("button");
    note.className = "note";
    noteTitle.id = "note-heading";
    // noteTextBox.type = "text";
    noteSaveBtn.innerText = "Save";
    noteTitle.setAttribute("contenteditable", "true");
    noteContent.id = "note-content";
    notesDisplay.appendChild(noteTitle);
    notesDisplay.appendChild(noteContent);
    notesDisplay.appendChild(noteSaveBtn);
    noteSaveBtn.addEventListener("click", (event) => {
        submitToStorage();
        note.style.display = "none";
        loadFromStorage();
    });
    // notes.appendChild(noteTextBox).appendChild(noteHeading).appendChild(note);
    // document.getElementById('add-note-textbox').style.display = 'block';
}

window.onload = function () {
    const notes = document.querySelector(".notes");
    const addNoteBtn = document.getElementById("addNoteBtn");
    addNoteBtn.addEventListener("click", _addNoteTextbox);

    window.addEventListener("DOMContentLoaded", loadFromStorage);
};
