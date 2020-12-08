package server.endpoints;

import express.Express;
import server.database.Database;

public class CategoryEndpoints {

    public CategoryEndpoints(Database dbConnection, Express app) {

        categoryEndpoints(dbConnection, app);
    }

    private void categoryEndpoints(Database dbConnection, Express app){

        // Ex. app.get() methods

    }
}
