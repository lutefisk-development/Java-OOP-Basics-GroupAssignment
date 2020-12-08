package server.database;

import java.sql.Connection;

public class PathsConnection {

    private Connection dbConnection;

    public PathsConnection(Connection dbConnection) {
        this.dbConnection = dbConnection;
    }
}
