package server.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private NotesConnection notesConnection;
    private PathsConnection pathsConnection;
    private CategoriesConnection categoriesConnection;

    public Database() {

        Connection dbConnection = null;

        try {
            dbConnection = DriverManager.getConnection("jdbc:sqlite:mvpNote.db");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        connectToDb(dbConnection);
    }

    private void connectToDb(Connection dbConnection){
        notesConnection = new NotesConnection(dbConnection);
        pathsConnection = new PathsConnection(dbConnection);
        categoriesConnection = new CategoriesConnection(dbConnection);
    }

    public NotesConnection getNotesConnection() {
        return notesConnection;
    }

    public PathsConnection getPathsConnection() {
        return pathsConnection;
    }

    public CategoriesConnection getCategoriesConnection() {
        return categoriesConnection;
    }
}
