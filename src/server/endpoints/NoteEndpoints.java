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

        app.delete("/rest/notes/:id", (req, res) -> {

            Note note = (Note) req.getBody(Note.class);
            dbConnection.getNotesConnection().deleteNoteById(note.getId());

        });

    }
}
