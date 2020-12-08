package server.endpoints;

import express.Express;
import express.middleware.Middleware;
import server.database.Database;

import java.nio.file.Paths;

public class Endpoints {

    private NoteEndpoints noteEndpoints;
    private PathEndpoints pathEndpoints;
    private CategoryEndpoints categoryEndpoints;

    public Endpoints(Database dbConnection) {
        listen(dbConnection);
    }

    private void listen(Database dbConnection){

        Express app = new Express();

        noteEndpoints = new NoteEndpoints(dbConnection, app);
        pathEndpoints = new PathEndpoints(dbConnection, app);
        categoryEndpoints = new CategoryEndpoints(dbConnection,app);

        // Adding middleware to get correct path to src folder
        try {
            app.use(Middleware.statics(Paths.get("src/client").toString()));
        } catch (Exception e) {
            e.printStackTrace();
        }

        app.listen(1000);
        System.out.println("Server is running on port 1000");
    }

}
