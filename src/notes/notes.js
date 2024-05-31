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
// HACK: (ish) JS doesn't have a good way to remove event listeners that take in parameters
// This variable stores a function that is called with the addition/removal of event listeners
// for the funcitionality that clicking on a noteElem displays the note editor popup.
// This is initialized after the event listener is added that calls this function
// let EDIT_CURRENT_NOTE_FUNCTION = null;

function loadFromStorage() {
    const notesDisplay = document.querySelector(".notes-display");
    const notesList = RecordsStorage.getAllRecords("note");
    for (const noteRecord of notesList) {
        let noteElem = document.createElement("note-element");
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
    // when this note is clicked, update the global CURRENT_NOTE_ID variable to be this note's id
    noteElem.addEventListener("click", () => {
        CURRENT_NOTE_ID = noteElem.id;
    });
    // when a note is clicked, open the editor for it
    noteElem.addEventListener("click", _editCurrentNote);
}

// delete the current note - to be used with add/remove event listeners
function _deleteCurrentNote() {
    // HACK (ish) - seems to be the cleanest way to do this in vanilla JS
    // wait 0.01s for the CURRENT_NOTE_ID to be updated by the noteElem event listener that updates CURRENT_NOTE_ID
    // this allows us to have _deleteCurrentNote be a function that doesn't take in any parameters
    // so that we can use it with addEventListener and deleteEventListener to add/remove it.
    setTimeout(() => {
        deleteFromStorage(CURRENT_NOTE_ID);
    }, 10);
}

// edit the current note (displays note editor popup) - to be used with add/remove event listeners
function _editCurrentNote() {
    // HACK (ish) - seems to be the cleanest way to do this in vanilla JS
    // wait 0.01s for the CURRENT_NOTE_ID to be updated by the noteElem event listener that updates CURRENT_NOTE_ID
    // this allows us to have _editCurrentNote be a function that doesn't take in any parameters
    // so that we can use it with addEventListener and deleteEventListener to add/remove it.
    setTimeout(() => {
        // get the note element that was clicked on
        const notesDisplay = document.querySelector(".notes-display");
        const noteElem = notesDisplay.querySelector(
            `note-element[id="${CURRENT_NOTE_ID}"]`
        );
        _displayNoteEditor(noteElem);
    }, 10);
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
// given a note, add a delete button listener to it that will delete it when clicked
function _addTrashButtonListener(noteElem) {
    if (noteElem.target.tagName == "IMG") {
        const noteId = noteElem.id;
        deleteFromStorage(noteId);
    }
}
*/

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
    const noteElem = notesDisplay.querySelector(`note-element[id="${noteId}"]`);
    noteElem.remove();
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

function _initNoteEditorValues(noteElem, noteTitle = null, noteContent = null) {
    // if either of note title or note content aren't given, define them
    if (!noteTitle || !noteContent) {
        noteTitle = document.getElementById("note-editor-title");
        noteContent = document.getElementById("note-editor-content");
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
/*
function _displayTrashBtn(display = true) {
    // const trashBtn = noteElem.shadowRoot.querySelectorAll(".js-trash");
    const delBtn = document.getElementById("delete-note-btn");
    const doneBtn = document.getElementById("done-deleting-note-btn");
    if (display) {
        const noteElems = document.getElementsByClassName(".note");
        for (const noteElem of noteElems) {
            const trashBtn = noteElem.shadowRoot.getElementById(".js-trash");
            // when the delete icon of a note is clicked, delete the note
            const deleteButton = noteElem.shadowRoot.querySelector(".js-trash");
            deleteButton.addEventListener("click", _deleteCurrentNote);
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
*/

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
    // get delete note and done delete note buttons
    const deleteNoteBtn = document.getElementById("delete-note-btn");
    const doneDelNoteBtn = document.getElementById("done-deleting-note-btn");
    // allow for deleting when delete button is clicked - display trash icons, edit event listeners
    deleteNoteBtn.addEventListener("click", () => {
        // hide 'delete note' button and show 'done deleting' button
        deleteNoteBtn.classList.add("hidden");
        doneDelNoteBtn.classList.remove("hidden");
        // loop through note elements, adding trash listeners and removing note edit listeners
        const noteElems = document.getElementsByClassName("note");
        for (const noteElem of noteElems) {
            // get note's trash button (icon)
            const trashBtn = noteElem.shadowRoot.getElementById("js-trash");
            // display trash button and add event listener that deletes its note when clicked
            trashBtn.classList.remove("hidden");
            trashBtn.addEventListener("click", _deleteCurrentNote);
            // remove edit popup listener while in delete mode
            // - makes sure edit popup doesn't display when trash icons are clicked
            noteElem.removeEventListener("click", _editCurrentNote);
        }
    });
    // block deleting when 'done deleting' button clicked - hide trash icons, edit event listeners
    doneDelNoteBtn.addEventListener("click", () => {
        // hide 'done deleting' button, show 'delete notes' button
        deleteNoteBtn.classList.remove("hidden");
        doneDelNoteBtn.classList.add("hidden");
        // loop through note elements, removing trash listeners and adding note edit listeners
        const noteElems = document.getElementsByClassName("note");
        for (const noteElem of noteElems) {
            // get note's trash button (icon)
            const trashBtn = noteElem.shadowRoot.getElementById("js-trash");
            // hide trash button and remove event listener that deletes its note when clicked
            trashBtn.classList.add("hidden");
            trashBtn.removeEventListener("click", _deleteCurrentNote);
            // add edit popup listener back - assures editor popup can display when note is clicked
            noteElem.addEventListener("click", _editCurrentNote);
        }
    });
};
