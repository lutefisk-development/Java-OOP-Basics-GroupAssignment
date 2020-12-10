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

    public Note getNoteById(int id){
        Note note = null;
        String query = "SELECT * FROM notes WHERE id = ?";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            preparedStatement.setInt(1, id);

            ResultSet resultSet = preparedStatement.executeQuery();

            Note[] noteFromRS = (Note[]) Utils.readResultSetToObject(resultSet, Note[].class);

            note = noteFromRS[0];


        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return note;
    }

    public void deleteNoteById(int id){
        String query = "DELETE FROM notes WHERE id = ?";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            preparedStatement.setInt(1, id);

            preparedStatement.executeUpdate();

        } catch (SQLException throwables) {
            throwables.printStackTrace();

        }

    }

    public void updateNote(Note note) {

            String query = "UPDATE notes SET title = ?, text = ?, categoryId = ?, checked = ?, creationDate = ?, finishDate = ? WHERE id = ?";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            preparedStatement.setString(1, note.getTitle());
            preparedStatement.setString(2, note.getText());
            preparedStatement.setInt(3, note.getCategoryId());
            preparedStatement.setBoolean(4, note.isChecked());
            preparedStatement.setString(5, note.getCreationDate());
            preparedStatement.setString(6, note.getFinishDate());
            preparedStatement.setInt(7, note.getId());

            preparedStatement.executeUpdate();

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
