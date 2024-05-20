export class NotesApi {
    // A Note object should have the following properties:
    // - id: a unique identifier for the note (generated)
    // - title: the title of the note
    // - body: the body of the note which will be in Markdown Format
    // - created: the date and time the note was created in ISO
    // - updated: the date and time the note was last updated in ISO

    constructor() {
        if (this.constructor === NotesApi) {
            throw new Error("Cannot instantiate an abstract class");
        }
    }
    static getAllNotes() {
        throw new Error("getAllNotes not implemented");
    }

    static saveNote(noteToSave) {
        throw new Error("saveNote not implemented");
    }

    static deleteNote(id) {
        throw new Error("deleteNote not implemented");
    }
}

export default class LocalStorageNotesApi extends NotesApi {
    /*
    getAllNotes(): Gets all notes from LocalStorage
    Parameters: None
    Returns: Array of notes
    */

    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        return notes;
    }

    /*
    saveNote(): Saves a note to LocalStorage
    Parameters: noteToSave: Note object (As given above)
    Returns: None
    */
    // Note in the case that the note does not exist, it will create a new note with a random id
    static saveNote(noteToSave) {
        const notes = LocalStorageNotesApi.getAllNotes();
        const existingNote = notes.find((note) => note.id === noteToSave.id);

        if (existingNote) {
            existingNote.title = noteToSave.title;
            existingNote.body = noteToSave.body;
            existingNote.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            const currentDate = new Date().toISOString();
            noteToSave.updated = currentDate;
            noteToSave.created = currentDate;
        }

        notes.push(noteToSave);
        localStorage.setItem("notes", JSON.stringify(notes));
    }
    /*
    deleteNote(): Deletes a note from LocalStorage
    Parameters: id: Number
    Returns: None
    */
    static deleteNote(id) {
        const notes = JSON.parse(localStorage.getItem("notes")) || [];
        const newNotes = notes.filter((note) => note.id !== id);
        localStorage.setItem("notes", JSON.stringify(newNotes));
    }
}
