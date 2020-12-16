package server.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;
import org.apache.commons.fileupload.FileItem;
import server.model.Path;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class PathsConnection {

    private Connection dbConnection;

    public PathsConnection(Connection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public String uploadFile(FileItem file) {
        // uploads folder in client directory is accessible from localhost
        // because the entire client folder gets served through middleware.

        // get filename
        String url = File.separator + "uploads" + File.separator + file.getName();

        // open outputstream with path to uploads folder in client directory
        try (var os = new FileOutputStream(Paths.get("src"+ File.separator +"client" + url).toString())) {

            // get required byte[] array to save to a file with file.get()
            os.write(file.get());
        } catch(Exception e) {
            e.printStackTrace();

            // if file is not saved, return null
            return null;
        }

        return url;
    }

    public List<Path> getPaths(){

        List<Path> paths = null;
        String query = "SELECT * FROM paths";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            Path [] pathsResultset = (Path[]) Utils.readResultSetToObject(resultSet,Path[].class);
            paths = List.of(pathsResultset);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return paths;
    }

    public int createPath(Path path){
        int newPathId = 0;
        String query = "INSERT INTO paths (path, fileType, noteId) VALUES(?,?,?)";

        try {
            PreparedStatement statement = dbConnection.prepareStatement(query);
            statement.setString(1, path.getPath());
            statement.setString(2, path.getFileType());
            statement.setInt(3,path.getNoteId());
            statement.executeUpdate();

            ResultSet res = statement.getGeneratedKeys();
            while(res.next()) {
                newPathId = res.getInt(1);
            }

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        return newPathId;
    }

    public boolean deletePath(Path path){

        if(!pathIdExists(path)){
            System.out.println("A path with this id doesn't exist in the db.");
            return false;
        }

        String query = "DELETE FROM paths WHERE id = ?";

        try {
            PreparedStatement statement = dbConnection.prepareStatement(query);
            statement.setInt(1,path.getId());
            statement.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }

        return true;
    }

    // Needed this method before delete a path, to se if it exists in db
    public Path getPathById(int id){

        Path path = null;
        String query = "SELECT * FROM paths WHERE id = ?";

        try {
            PreparedStatement statement = dbConnection.prepareStatement(query);
            statement.setInt(1,id);
            ResultSet resultSet = statement.executeQuery();

            Path [] resultSetArray = (Path[]) Utils.readResultSetToObject(resultSet, Path[].class);
            path = resultSetArray[0];

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return path;
    }

    // gets a path by passing in a id for a note
    public List<Path> getPathByNoteId(int id) {
        List<Path> paths = null;
        String query = "SELECT paths.* FROM paths, notes WHERE notes.id = paths.noteId AND paths.noteId = ?";

        try {
            PreparedStatement statement = dbConnection.prepareStatement(query);
            statement.setInt(1,id);
            ResultSet resultSet = statement.executeQuery();

            Path [] resultSetArray = (Path[]) Utils.readResultSetToObject(resultSet, Path[].class);
            paths = List.of(resultSetArray);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return paths;
    }

    public boolean pathIdExists(Path path){
        return getPathById(path.getId()) != null;
    }

}
