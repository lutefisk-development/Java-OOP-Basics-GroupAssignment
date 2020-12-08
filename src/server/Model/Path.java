package server.model;

public class Path {

    private int id;
    private String path;
    private String fileType;
    private int noteId;

    public Path() {
    }

    public Path(String path, String fileType, int noteId) {
        this.path = path;
        this.fileType = fileType;
        this.noteId = noteId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public int getNoteId() {
        return noteId;
    }

    public void setNoteId(int noteId) {
        this.noteId = noteId;
    }

    @Override
    public String toString() {
        return "Path{" +
                "id=" + id +
                ", path='" + path + '\'' +
                ", fileType='" + fileType + '\'' +
                ", noteId=" + noteId +
                '}';
    }
}
