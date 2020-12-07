package server.database;

import java.sql.Connection;

public class NotesConnection {

    private Connection dbConnection;

    public NotesConnection(Connection dbConnection) {
        this.dbConnection = dbConnection;
    }


}
