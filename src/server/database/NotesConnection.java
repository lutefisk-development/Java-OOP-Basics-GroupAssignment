package server.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;
import server.model.Note;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class NotesConnection {

    private Connection dbConnection;

    public NotesConnection(Connection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public List<Note> getNotes(){

        List<Note> notes = null;
        String query = "SELECT * FROM notes";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            Note [] notesResultset = (Note[]) Utils.readResultSetToObject(resultSet,Note[].class);
            notes = List.of(notesResultset);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return notes;
    }

}
