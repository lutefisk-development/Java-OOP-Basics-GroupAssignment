package server.endpoints;

import express.Express;
import server.database.Database;

public class PathEndpoints {

    public PathEndpoints(Database dbConnection, Express app) {

        pathEndpoints(dbConnection, app);
    }

    private void pathEndpoints(Database dbConnection, Express app){

        // Ex. app.get() methods

    }
}
