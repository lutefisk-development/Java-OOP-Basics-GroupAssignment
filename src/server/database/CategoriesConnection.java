package server.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import express.utils.Utils;
import server.model.Category;

import javax.xml.transform.Result;
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

    // all categories
    public List<Category> getCategories() {

        List<Category> categories = null;
        String query = "SELECT * FROM categories";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            Category[] categoriesResultset = (Category[]) Utils.readResultSetToObject(resultSet, Category[].class);
            categories = List.of(categoriesResultset);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return categories;
    }

    // category by id
    public Category getCategoryById(int id) {

        Category category = null;
        String query = "SELECT * FROM categories WHERE id = ?";

        try {
            PreparedStatement preparedStatement = dbConnection.prepareStatement(query);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();

            Category[] categoryFromRS = (Category[]) Utils.readResultSetToObject(resultSet, Category[].class);
            category = categoryFromRS[0];

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return category;
    }
}
