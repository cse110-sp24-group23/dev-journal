import { Record } from "../backend-storage/record-class.js";
import { LocalStorageRecordsApi as RecordsStorage } from "../backend-storage/records-api.js";


document.addEventListener("DOMContentLoaded", _editStorage);


function _editStorage() {
    // the textbox to enter notes in
    const noteTextContent = document.getElementById("add-note-textbox");
    // the title of the note
    const noteTitle = document.getElementById("note-heading");
    // submit button
    const noteSubmitBtn = document.getElementById("noteSubmitBtn");
    // delete button
    const noteDeleteBtn = document.getElementById("noteDeleteBtn");
    // thinking of creating a function where it generate an id for every note based on time note was created.
      

    // submit to local storage
    function submitToStorage() {
        
        const noteContent = noteTextContent.value;
        const noteTitleContent = noteTitle.value;
        const noteRecord = new Record('note', {field1: noteContent, title: noteTitleContent});
        RecordsStorage.createRecord(noteRecord);
        
    }

    function loadFromStorage() {
        
        const notesList = RecordsStorage.getAllRecords('note');
        for (const note of notesList){
            let newNote = document.createElement('my-note');
            newNote.id = note.id;
            // newNote.title = note.title;
            newNote.date = note.date;
            newNote.content = note.field1;
        }
        
    }

    // TODO: delete from local storage
    function deleteFromStorage() {
        localStorage.removeItem(noteId);
    }

    // load content autimatically
    loadFromStorage();
    // submit note content on click
    // noteSubmitBtn.addEventListener("click", submitToStorage);
    // delete note content on click
    // noteDeleteBtn.addEventListener("click", deleteFromStorage);
}

window.onload = function () {
    const notes = document.querySelector('.notes');
    const addNotes = document.querySelector('.add-notes');
    document.getElementById('addNoteBtn').addEventListener('click', _addNoteTextbox);
    window.addEventListener("DOMContentLoaded", _editStorage);

    function _addNoteTextbox(){
        let submitBtn = document.getElementById('submitNoteBtn');
        let noteTextBox = document.createElement('div');
        let noteHeading = document.createElement('h3');
        let addNote = document.createElement('textarea');
        let note = document.createElement('textarea');
        submitBtn.style.display = 'block';
        noteTextBox.className = 'note';
        noteTextBox.type = 'text';
        noteHeading.id = 'note-heading';
        noteHeading.setAttribute('contenteditable', 'true');
        addNote.id = 'add-note-textbox';
        addNotes.appendChild(noteHeading);
        addNotes.appendChild(addNote);
        // notes.appendChild(noteTextBox).appendChild(noteHeading).appendChild(note);
        
        // document.getElementById('add-note-textbox').style.display = 'block';
    };
};
