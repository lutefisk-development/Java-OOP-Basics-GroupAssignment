package server.database;

import java.sql.Connection;

public class CategoriesConnection {

    private Connection dbConnection;

    public CategoriesConnection(Connection dbConnection) {
        this.dbConnection = dbConnection;
    }
}
