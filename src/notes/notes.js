import { Record } from "../backend-storage/record-class.js";
import RecordsStorage from "../backend-storage/records-api.js";
import { initMDE } from "./simpleMDE-notes.js";

// id of the most recently accessed (clicked, edited, etc.) note element
let CURRENT_NOTE_ID = null;
// ids of JS created elements in the note editor form
const EDITOR_FORM_ID = "note-editor";
const EDITOR_TITLE_ID = "note-editor-title";
const EDITOR_CONTENT_ID = "note-editor-content";
const EDITOR_SAVE_ID = "editor-save-btn";
const EDITOR_CANCEL_ID = "editor-cancel-btn";

/*
Loads note records from storage and creates note-elements to display them in notes.html
Parameters: None
Returns: None
*/
function loadAllNotesFromStorage() {
    // get container where notes are displayed
    const notesDisplay = document.querySelector(".notes-display");
    // retrieve notes from local storage
    const notesList = RecordsStorage.getAllRecords("note");
    // loop through retrieved notes, creating a note element for each one
    for (const noteRecord of notesList) {
        // create and initialize new note element
        let noteElem = document.createElement("note-element");
        noteElem.id = noteRecord.id;
        noteElem.title = noteRecord.title;
        noteElem.date = noteRecord.created;
        noteElem.content = noteRecord.field1;
        // add note element to html page
        notesDisplay.prepend(noteElem);
        // add listeners to note element that check if it is clicked to update it
        _addListeners(noteElem);
    }
}

// submit to local storage
function submitToStorage() {
    // the title of the note
    const noteTitle = document.getElementById(EDITOR_TITLE_ID);
    const noteTitleVal = noteTitle.value;
    // the textbox to enter notes in
    const noteContent = document.getElementById(EDITOR_CONTENT_ID);
    const noteContentVal = noteContent.value;
    // in local storage, update note record if it exists, otherwise create a new one
    let noteRecord;
    if (
        CURRENT_NOTE_ID != null &&
        RecordsStorage.hasRecordById(CURRENT_NOTE_ID)
    ) {
        // retrieve the record from storage
        noteRecord = RecordsStorage.getRecordById(CURRENT_NOTE_ID);
        // update the record's information, then update it in storage.
        noteRecord.field1 = noteContentVal;
        noteRecord.title = noteTitleVal;
        RecordsStorage.updateRecord(noteRecord);
    } else {
        // create a new record to store the note
        noteRecord = new Record("note", {
            field1: noteContentVal,
            title: noteTitleVal,
        });
        // create the new record in storage
        RecordsStorage.createRecord(noteRecord);
    }
}

/*
Given a note id, delete the note from local storage and remove it from the html page
Parameters:
    - noteId: string or int of a note's id
Returns: None
*/
function deleteFromStorage(noteId) {
    // Comes in as string, so we convert to a Number
    RecordsStorage.deleteRecord(parseInt(noteId));
    const notesDisplay = document.querySelector(".notes-display");
    const noteElem = notesDisplay.querySelector(`note-element[id="${noteId}"]`);
    noteElem.remove();
}

/*
Given a note element, display the note editor and populate it with values of a note element if one is given
Parameters:
    - note (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _addListeners(noteElem) {
    // when this note is clicked, update the global CURRENT_NOTE_ID variable to be this note's id
    noteElem.addEventListener("click", () => {
        CURRENT_NOTE_ID = noteElem.id;
    });
    // when note is selected with Enter, update global CURRENT_NOTE_ID variable to be note's id
    noteElem.addEventListener("keypress", (event) => {
        // only add listener if the enter key was pressed, not some random key
        if (event.key != "Enter") {
            return;
        }
        CURRENT_NOTE_ID = noteElem.id;
    });
    // when a note is clicked, open the editor for it
    noteElem.addEventListener("click", _editCurrentNote);
    noteElem.addEventListener("keypress", _editCurrentNote);
}

// delete the current note - to be used with add/remove event listeners
function _deleteCurrentNote(event) {
    // Only add listeners if the event was a click or Enter. If it was a random keypress, return.
    const listenerConditions =
        event.type === "click" ||
        (event.type === "keypress" && event.key === "Enter");
    if (!listenerConditions) {
        return;
    }
    // HACK (ish) - seems to be the cleanest way to do this in vanilla JS
    // wait 0.01s for the CURRENT_NOTE_ID to be updated by the noteElem event listener that updates CURRENT_NOTE_ID
    // this allows us to have _deleteCurrentNote be a function that doesn't take in any parameters
    // so that we can use it with addEventListener and deleteEventListener to add/remove it.
    setTimeout(() => {
        deleteFromStorage(CURRENT_NOTE_ID);
    }, 10);
}

// edit the current note (displays note editor popup) - to be used with add/remove event listeners
function _editCurrentNote(event) {
    // Only add listeners if the event was a click or Enter. If it was a random keypress, return.
    const listenerConditions =
        event.type === "click" ||
        (event.type === "keypress" && event.key === "Enter");
    if (!listenerConditions) {
        return;
    }
    // HACK (ish) - seems to be the cleanest way to do this in vanilla JS
    // wait 0.1s for the CURRENT_NOTE_ID to be updated by the noteElem event listener that updates CURRENT_NOTE_ID
    // this allows us to have _editCurrentNote be a function that doesn't take in any parameters
    // so that we can use it with addEventListener and deleteEventListener to add/remove it.
    setTimeout(() => {
        // get the note element that was clicked on
        const notesDisplay = document.querySelector(".notes-display");
        const noteElem = notesDisplay.querySelector(
            `note-element[id="${CURRENT_NOTE_ID}"]`
        );
        // display the note editor of the newly retrieved current note
        _displayNoteEditor(noteElem);
    }, 100);
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
    let noteElem = document.createElement("note-element");
    noteElem.id = noteRecord.id;
    noteElem.title = noteRecord.title;
    noteElem.date = noteRecord.created;
    noteElem.content = noteRecord.field1;
    // add note element to page and add its event listeners
    notesDisplay.prepend(noteElem);
    _addListeners(noteElem);
}

/*
Display the note editor and populate it with values of a note element if one is given
Parameters:
    - noteElem (optional): custom note element - reference to the note that is being edited
Returns: None
*/
function _displayNoteEditor(noteElem = null) {
    // set editorCreated as a boolean of if there is a noteEditor created yet
    // if the note editor exists, it won't be null
    const editorCreated = document.getElementById(EDITOR_FORM_ID) != null;
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
    const noteEditor = document.createElement("form");
    const noteTitle = document.createElement("input");
    const noteContent = document.createElement("textarea");
    const saveBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");
    // add selectors to elements
    noteEditor.id = EDITOR_FORM_ID;
    noteTitle.id = EDITOR_TITLE_ID;
    noteContent.id = EDITOR_CONTENT_ID;
    saveBtn.id = EDITOR_SAVE_ID;
    cancelBtn.id = EDITOR_CANCEL_ID;
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
    // make the note editor's content be a markdown editor
    initMDE(noteContent);
    // don't reload the page when the form is submitted - minimize unnecessary loads from storage
    noteEditor.addEventListener("submit", (event) => {
        // prevent form from refreshing page upon submit
        event.preventDefault();
    });
    // Put note editor in the main notes container to be displayed
    const notesContainer = document.querySelector(".js-notes-container");
    notesContainer.prepend(noteEditor);
}

/*
Add event listeners for the note editor display's save and cancel buttons
Parameters: None
Returns: None
*/
function _addNoteEditorListeners() {
    const noteEditor = document.getElementById(EDITOR_FORM_ID);
    const saveBtn = document.getElementById(EDITOR_SAVE_ID);
    const cancelBtn = document.getElementById(EDITOR_CANCEL_ID);
    // when the save is clicked, save to storage, update display
    saveBtn.addEventListener("click", () => {
        // put note in storage and hide the form
        submitToStorage();
        noteEditor.classList.add("hidden");
        // if we are editing a note
        if (CURRENT_NOTE_ID != null) {
            const noteElem = document.querySelector(
                `note-element[id="${CURRENT_NOTE_ID}"]`
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

/*
Given a note element, note title input (optional) and note content textarea (optional)
initialize the title and content displays of the popup note editor to be the title
and content of the noteELem or empty if the noteElem is null.
Parameters:
    - noteElem: the note-element that is being edited. If null, forms will be empty
    - noteTitle: (optional) a reference to the element in the note editor popup for title input
    - noteContent: (optional) a reference to the element in the note editor popup for title content
Returns: None
*/
function _initNoteEditorValues(noteElem, noteTitle = null, noteContent = null) {
    // if either of note title or note content aren't given, define them
    if (!noteTitle || !noteContent) {
        noteTitle = document.getElementById(EDITOR_TITLE_ID);
        noteContent = document.getElementById(EDITOR_CONTENT_ID);
    }
    // if noteElem isn't null update the title and content of the note editor popup
    if (noteElem !== null) {
        noteTitle.value = noteElem.title;
        noteContent.value = noteElem.content;
    } else {
        // if noteELem is null, clear the title and content of the note editor popup
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
    console.log("updating note editor");
    // get note editor
    const noteEditor = document.getElementById(EDITOR_FORM_ID);
    // if it's hidden, show it
    noteEditor.classList.remove("hidden");

    // if there was a note passed in, populate values
    _initNoteEditorValues(noteElem);
}

window.onload = function () {
    // make sure there aren't any faulty records in storage, then load records in as note elements
    RecordsStorage.cleanse_records();
    loadAllNotesFromStorage();
    // display note editor when "Add Note" button clicked
    const addNoteBtn = document.getElementById("add-note-btn");
    addNoteBtn.addEventListener("click", () => {
        CURRENT_NOTE_ID = null;
        _displayNoteEditor();
    });
    // get delete note and done delete note buttons
    const deleteNoteBtn = document.getElementById("delete-note-btn");
    const doneDelNoteBtn = document.getElementById("done-deleting-note-btn");
    // allow for deleting when delete button is clicked - display trash icons, edit event listeners
    deleteNoteBtn.addEventListener("click", () => {
        // hide 'delete note', 'add note' buttons and show 'done deleting' button
        deleteNoteBtn.classList.add("hidden");
        addNoteBtn.classList.add("hidden");
        doneDelNoteBtn.classList.remove("hidden");
        // loop through note elements, adding trash listeners and removing note edit listeners
        const noteElems = document.getElementsByClassName("note");
        for (const noteElem of noteElems) {
            // get note's trash button (icon)
            const trashBtn = noteElem.shadowRoot.getElementById("js-trash");
            // display trash button and add event listener that deletes its note when clicked
            trashBtn.classList.remove("hidden");
            trashBtn.addEventListener("click", _deleteCurrentNote);
            trashBtn.addEventListener("keypress", _deleteCurrentNote);
            // remove edit popup listener while in delete mode
            // - makes sure edit popup doesn't display when trash icons are clicked
            noteElem.removeEventListener("click", _editCurrentNote);
            noteElem.removeEventListener("keypress", _editCurrentNote);
        }
    });
    // block deleting when 'done deleting' button clicked - hide trash icons, edit event listeners
    doneDelNoteBtn.addEventListener("click", () => {
        // hide 'done deleting' button, show 'delete notes' 'add note' buttons
        deleteNoteBtn.classList.remove("hidden");
        addNoteBtn.classList.remove("hidden");
        doneDelNoteBtn.classList.add("hidden");
        // loop through note elements, removing trash listeners and adding note edit listeners
        const noteElems = document.getElementsByClassName("note");
        for (const noteElem of noteElems) {
            // get note's trash button (icon)
            const trashBtn = noteElem.shadowRoot.getElementById("js-trash");
            // hide trash button and remove event listener that deletes its note when clicked
            trashBtn.classList.add("hidden");
            trashBtn.removeEventListener("click", _deleteCurrentNote);
            trashBtn.removeEventListener("keypress", _deleteCurrentNote);
            // add edit popup listener back - assures editor popup can display when note is clicked
            noteElem.addEventListener("click", _editCurrentNote);
            noteElem.addEventListener("keypress", _editCurrentNote);
        }
    });
};
