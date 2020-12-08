package server.endpoints;

import express.Express;
import server.database.Database;
import server.model.Path;

import java.util.List;

public class PathEndpoints {

    public PathEndpoints(Database dbConnection, Express app) {

        pathEndpoints(dbConnection, app);
    }

    private void pathEndpoints(Database dbConnection, Express app){

        app.get("/rest/paths",(((request, response) -> {

            List<Path> paths = dbConnection.getPathsConnection().getPaths();
            response.json(paths);
        })));

    }
}
