package server.endpoints;

import express.Express;
import server.database.Database;

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

        app.listen(1000);
        System.out.println("Server is running on port 1000");
    }

}
