package server.model;

public class Note {

    private int id;
    private String title;
    private String text;
    private int categoryId;
    private boolean checked;
    private String creationDate;
    private String finishDate;

    public Note() {
    }

    public Note(String title, String text, int categoryId, boolean checked, String creationDate, String finishDate) {
        this.title = title;
        this.text = text;
        this.categoryId = categoryId;
        this.checked = checked;
        this.creationDate = creationDate;
        this.finishDate = finishDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }

    public String getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(String finishDate) {
        this.finishDate = finishDate;
    }

    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", text='" + text + '\'' +
                ", categoryId=" + categoryId +
                ", checked=" + checked +
                ", creationDate='" + creationDate + '\'' +
                ", finishDate='" + finishDate + '\'' +
                '}';
    }
}
