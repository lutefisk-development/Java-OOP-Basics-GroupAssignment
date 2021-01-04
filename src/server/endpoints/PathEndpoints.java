package server.endpoints;

import express.Express;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import server.database.Database;
import server.model.Path;

import java.io.IOException;
import java.util.List;

public class PathEndpoints {

    public PathEndpoints(Database dbConnection, Express app) {

        pathEndpoints(dbConnection, app);
    }

    private void pathEndpoints(Database dbConnection, Express app){

        // Endpoint for creating a path based on the file in request
        app.post("/rest/file-upload", (req,res) -> {

            String url = null;

            // get file from formData
            try {
                List<FileItem> files = req.getFormData("files");
                url = dbConnection.getPathsConnection().uploadFile(files.get(0));
            } catch (IOException e) {
                e.printStackTrace();
            } catch (FileUploadException e) {
                e.printStackTrace();
            }
            
            // return "/uploads/filename.something"
            res.send(url);
        });

        app.get("/rest/paths/:id", (request, response) -> {

            int id = Integer.parseInt(request.getParam("id"));
            List<Path> paths = dbConnection.getPathsConnection().getPathByNoteId(id);
            response.json(paths);
        });

        app.post("/rest/paths", (request, response) -> {

            Path newPath = (Path)request.getBody(Path.class);
            int id = dbConnection.getPathsConnection().createPath(newPath);

            if(id != 0) {
                newPath.setId(id);

                Path path = dbConnection.getPathsConnection().getPathById(id);

                if(path == null) {
                    System.out.println("There is no record of this path");
                } else {
                    System.out.println(path.toString());
                    response.send("Successfully created a new path with id: " + id);
                }
            } else {
                System.out.println("Something went wrong");
            }
        });

        app.delete("/rest/paths/:id", (((request, response) -> {

            int id = Integer.parseInt(request.getParam("id"));
            List<Path> paths = dbConnection.getPathsConnection().getPathByNoteId(id);

            for(int i = 0; i < paths.size(); i++) {
                dbConnection.getPathsConnection().deletePath(paths.get(i).getId());
            }

            response.send("All paths belonging to note with id: " + id + " is removed from the database");
        })));

        app.put("/rest/paths/:id", (((request, response) -> {

            int id = Integer.parseInt(request.getParam("id"));
            dbConnection.getPathsConnection().deleteSinglePath(id);


            response.send("Path deleted");

        })));



    }
}
