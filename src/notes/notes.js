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
    const noteTextContent = document.getElementById("add-note-textbox");
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
    const addNotes = document.querySelector(".add-notes");
    const submitBtn = document.getElementById("submitNoteBtn");
    const noteTextBox = document.createElement("div");
    const noteHeading = document.createElement("h3");
    const addNote = document.createElement("textarea");
    const note = document.createElement("textarea");
    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    submitBtn.style.display = "block";
    noteTextBox.className = "note";
    noteTextBox.type = "text";
    noteHeading.id = "note-heading";
    noteHeading.setAttribute("contenteditable", "true");
    addNote.id = "add-note-textbox";
    addNotes.appendChild(noteHeading);
    addNotes.appendChild(addNote);
    addNotes.appendChild(saveBtn);
    saveBtn.addEventListener("click", (event) => {
        submitToStorage();
        addNote.style.display = "none";
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
