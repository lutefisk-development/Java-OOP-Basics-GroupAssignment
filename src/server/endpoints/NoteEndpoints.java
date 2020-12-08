package server.endpoints;

import express.Express;
import server.database.Database;

public class NoteEndpoints {

    public NoteEndpoints(Database dbConnection, Express app) {

        noteEndpoints(dbConnection, app);

    }

    private void noteEndpoints(Database dbConnection, Express app){

        // Ex. app.get() methods


    }
}
