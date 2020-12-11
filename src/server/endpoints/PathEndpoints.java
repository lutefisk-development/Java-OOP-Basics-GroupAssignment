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

        app.post("/rest/paths", (((request, response) -> {
            Path path = (Path)request.getBody(Path.class);
            dbConnection.getPathsConnection().createPath(path);
            response.send("Post went ok.");
        })));

        app.delete("/rest/paths/:id", (((request, response) -> {

            Path path = (Path) request.getBody(Path.class);
            boolean ok = dbConnection.getPathsConnection().deletePath(path);

            if (ok){
                response.send("Delete went ok.");
            }
        })));


    }
}
