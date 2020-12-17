package server.endpoints;

import express.Express;
import server.database.Database;
import server.model.Note;

import java.util.List;

public class NoteEndpoints {

    public NoteEndpoints(Database dbConnection, Express app) {

        noteEndpoints(dbConnection, app);

    }

    private void noteEndpoints(Database dbConnection, Express app){

        app.get("/rest/notes", ((request, response) -> {

            List<Note> notes = dbConnection.getNotesConnection().getNotes();
            response.json(notes);
        }));

        app.get("/rest/notes/:id", (req, res) -> {

            try {
                int id = Integer.parseInt(req.getParam("id"));
                Note note = dbConnection.getNotesConnection().getNoteById(id);
                res.json(note);

            } catch (NumberFormatException exception) {
                exception.printStackTrace();
            }
        });

        app.get("/rest/new", (req,res) -> {

            try {
                Note note = dbConnection.getNotesConnection().getLastNoteInserted();
                res.json(note);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        app.post("/rest/notes", (req,res) -> {

            Note newNote = (Note) req.getBody(Note.class);
            int id = dbConnection.getNotesConnection().createNote(newNote);

            if(id != 0) {
                newNote.setId(id);
                Note note = dbConnection.getNotesConnection().getNoteById(id);

                if(note == null) {
                    System.out.println("No record of this note");
                } else {
                    System.out.println( note.toString());
                    res.send("Successfully created a new note");
                }
            } else {
                System.out.println("Something went wrong");
            }

        });

        app.delete("/rest/notes/:id", (req, res) -> {

            int id = Integer.parseInt(req.getParam("id"));
            dbConnection.getNotesConnection().deleteNoteById(id);
            res.send("Note deleted");
        });

        app.put("/rest/notes/:id", (req, res) -> {

            Note note = (Note)req.getBody(Note.class);
            dbConnection.getNotesConnection().updateNote(note);
            res.send("Note was updated");
        });

    }
}
