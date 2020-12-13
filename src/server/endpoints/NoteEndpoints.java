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
            int id = Integer.parseInt(req.getParam("id"));
            dbConnection.getNotesConnection().deleteNoteById(id);

        });

        app.put("/rest/notes/:id", (req, res) -> {

//            // from user
//            Note note = (Note) req.getBody(Note.class);
//
//            // create a note to be updated
//            int id = Integer.parseInt(req.getParam("id"));
//            Note updateNote =  dbConnection.getNotesConnection().getNoteById(id);
//
//
//            // field from body and update fields
//            updateNote.setText(note.getText());
//            updateNote.setTitle(note.getTitle());
//            updateNote.setChecked(note.isChecked());
//            updateNote.setFinishDate(note.getFinishDate());
//            updateNote.setCategoryId(note.getCategoryId());
//
//            // update database with connection form user
//            dbConnection.getNotesConnection().updateNote(note);
//
//            System.out.println(updateNote.toString());
//
//            res.send("Update note with id:" + updateNote.getId());

            // New code version
            Note note = (Note)req.getBody(Note.class);
            dbConnection.getNotesConnection().updateNote(note);
            res.send("Note was updated");
        });

    }
}
