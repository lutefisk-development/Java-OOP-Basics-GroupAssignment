package server.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;
import server.model.Category;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class CategoriesConnection {

    private Connection dbConnection;

    public CategoriesConnection(Connection dbConnection) {
        this.dbConnection = dbConnection;
    }

    public List<Category> getCategories(){

        List<Category> categories = null;
        String query = "SELECT * FROM categories";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            Category [] categoriesResultset = (Category[]) Utils.readResultSetToObject(resultSet,Category[].class);
            categories = List.of(categoriesResultset);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return categories;
    }
}
