package server.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;
import server.model.Path;

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
}
