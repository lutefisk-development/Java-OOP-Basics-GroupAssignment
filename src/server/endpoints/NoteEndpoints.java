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

    }
}
