package server.endpoints;

import express.Express;
import server.database.Database;
import server.model.Category;

import java.util.List;

public class CategoryEndpoints {

    public CategoryEndpoints(Database dbConnection, Express app) {

        categoryEndpoints(dbConnection, app);
    }

    private void categoryEndpoints(Database dbConnection, Express app){

        // all categories
        app.get("/rest/categories", (((request, response) -> {

            List<Category> categories = dbConnection.getCategoriesConnection().getCategories();
            response.json(categories);
        })));

        // category by id
        app.get("/rest/categories/:id", (req, res) -> {

            try {
                int id = Integer.parseInt(req.getParam("id"));
                Category category = dbConnection.getCategoriesConnection().getCategoryById(id);

                res.json(category);

            } catch (NumberFormatException exception) {
                exception.printStackTrace();
            }

        });

    }
}
