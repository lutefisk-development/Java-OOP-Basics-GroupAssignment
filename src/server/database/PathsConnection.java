package server.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;
import org.apache.commons.fileupload.FileItem;
import server.model.Path;

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

    public String uploadImage(FileItem image) {
        // uploads folder in client directory is accessible from localhost
        // because the entire client folder gets served through middleware.

        // get filename
        String imgUrl = "/uploads/" + image.getName();

        // open outputstream with path to uploads folder in client directory
        try (var os = new FileOutputStream(Paths.get("src/client" + imgUrl).toString())) {

            // get required byte[] array to save to a file with file.get()
            os.write(image.get());
        } catch(Exception e) {
            e.printStackTrace();

            // if file is not saved, return null
            return null;
        }

        return imgUrl;
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

    public void createPath(Path path){

        String query = "INSERT INTO paths (path, fileType, noteId) VALUES(?,?,?)";

        try {
            PreparedStatement statement = dbConnection.prepareStatement(query);
            statement.setString(1, path.getPath());
            statement.setString(2, path.getFileType());
            statement.setInt(3,path.getNoteId());
            statement.executeUpdate();

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
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

    public boolean pathIdExists(Path path){
        return getPathById(path.getId()) != null;
    }

}
