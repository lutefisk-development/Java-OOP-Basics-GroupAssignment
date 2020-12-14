

// Scoping jquery:
(function($) {

  // ALL JAVASCRIPT CODE HERE

  // opening and closing navbar:
  $("#open-navbar").click(function() {
    $("#side-navbar").css("width", "500px");
    $(".container").addClass("blur");
    $(".navbar-wrapper").addClass("open");
  });

  $("#close-navbar").click(function() {
    $("#side-navbar").css("width", "0");
    $(".container").removeClass("blur");
    $(".navbar-wrapper").removeClass("open");
  });

  // event delegation, preventing redirecting to image, just open it in lightbox
  $(document).on('click', '[data-toggle="lightbox"]', function(e) {
    e.preventDefault();
    $(this).ekkoLightbox();
  });

  // testing querystring
  // -------------------
  // function getParameterByName(name, url = window.location.href) {
  //   name = name.replace(/[\[\]]/g, '\\$&');
  //   let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  //       results = regex.exec(url);
  //   if (!results) return null;
  //   if (!results[2]) return '';
  //   return decodeURIComponent(results[2].replace(/\+/g, ' '));
  // }
  // console.log(getParameterByName("note-id"));


  // create note form:
  $("#create-note-form").submit(function(e) {

    // stop form from submitting.
    e.preventDefault();

    // handling the form data
    handleFormSubmit();
  });

  // update note form:
  $("#update-note-form").submit(function(e) {

    // stop form from submitting.
    e.preventDefault();

    // handling the form data
    //handleFormSubmit();
  })

  const handleFormSubmit = async () => {
    // getting file if user has added one
    let fileUrl;
    if($("#note-file").prop('files').length > 0) {
      let $fileArray = $("#note-file").prop('files');
      let formData = new FormData();

      // adding the file to formData
      for(let file of $fileArray) {
        formData.append('files', file, file.name);
      }

      // sending post request to endpoint for storing the file
      let uploadResult = await fetch('/rest/file-upload', {
        method: 'POST',
        body: formData
      });

      // get path
      fileUrl = await uploadResult.text();
    }

    // setting the date for today:
    let today = new Date();
    today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    // creating variables for inserting into db
    let newNote = {
      title: $("#note-title").val(),
      text: $("#note-text").val(),
      categoryId: $("#note-category").val() == 0 ? 1 : $("#note-category").val(),
      checked: false,
      creationDate: today,
      finishDate: $("#note-end").val() == "" ? null : $("#note-end").val(),
    }

    // make a new note
    let noteResult = await fetch("/rest/notes", {
      method: "POST",
      body: JSON.stringify(newNote),
    });

    let newNoteRes = await fetch("/rest/new");
    let newNoteFromDb = await newNoteRes.json();

    console.log(newNoteFromDb);

    let newPath = {
      path: fileUrl ? fileUrl : null,
      noteId: newNote.id,
      fileType: "img"
    }

    console.log(newPath);

    // only make a new path in db if the user actually has inserted a file
    // if(newPath.path != null) {
    //   let pathResult = await fetch("/rest/paths", {
    //     method: "POST",
    //     body: JSON.stringify(newPath),
    //   });
    // }

    window.location.replace("http://localhost:1000/");
  }

  // $("#home-btn").click(function() {

  //   // back to frontpage
  //   window.location.replace("http://localhost:1000/");
  // });

  // Getting and render the notes
  let notes = [];
  getAllNotes();

  async function getAllNotes(){
    let result = await fetch("/rest/notes");
    notes = await result.json();

    console.log(notes)
    renderNotes();
  }

  async function renderNotes(){

    let allNotesElement = $("#all-notes");

    for (let i = 0; i < notes.length; i++) {

      // Check if finishDate is null, then set to an empty string
      if(notes[i].finishDate == null){
        notes[i].finishDate = "";
      }

      let category = getCategoryByIdFromDb(notes[i].categoryId);

      if(notes[i].checked){

        allNotesElement.append(
          '<article class="checktrue">' +
         '<div class="article-header" id="'+notes[i].id+'">' +
            '<p>' + await category + '</p>' +
            '<a href="/update_note.html?note-id=' + notes[i].id + '" class="far fa-edit fa-2x"></a>' +
          '</div>' +
          '<h1>' +
            '<a href="/single_note.html?note-id=' + notes[i].id + '">' +
            notes[i].title +
            '</a>' +
          '</h1>' +
          '<div class="dates">' +
            '<div class="created-date">' +
              '<p>Created:</p>' +
              '<p>' + notes[i].creationDate + '</p>' +
            '</div>' +
            '<div class="end-date">' +
              '<p>Ends:</p>' +
              '<p>' + notes[i].finishDate + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="files-checked">' +
            '<i class="far fa-file-alt fa-2x"></i>' +
            '<i class="far fa-file-image fa-2x"></i>' +
            '<i id="'+notes[i].id+'" class="far fa-check-square fa-2x check-note"></i>' +
         '</div>' +
        '</article>'
        );

      }
      else{

        allNotesElement.append(
          '<article>' +
         '<div class="article-header" id="'+notes[i].id+'">' +
            '<p>' + await category + '</p>' +
            '<a href="/update_note.html?note-id=' + notes[i].id + '" class="far fa-edit fa-2x"></a>' +
          '</div>' +
          '<h1>' +
            '<a href="/single_note.html?note-id=' + notes[i].id + '">' +
            notes[i].title +
            '</a>' +
          '</h1>' +
          '<div class="dates">' +
            '<div class="created-date">' +
              '<p>Created:</p>' +
              '<p>' + notes[i].creationDate + '</p>' +
            '</div>' +
            '<div class="end-date">' +
              '<p>Ends:</p>' +
              '<p>' + notes[i].finishDate + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="files-checked">' +
            '<i class="far fa-file-alt fa-2x"></i>' +
            '<i class="far fa-file-image fa-2x"></i>' +
            '<i id="'+notes[i].id+'" class="far fa-square fa-2x check-note"></i>' +
         '</div>' +
        '</article>'
        );
      }
    }
  }

  // event for checking and unchecking notes
  $(document).ready(function(){
    $(document).on('click', '.check-note', function() {

      // loops through all notes
      notes.forEach(note => {

        // if the note id of the clicked note matches a note in the array of notes
        if(note.id == $(this).attr('id')) {

          // then change the checked value (if true, becomes false)
          note.checked = !note.checked;

          // call method for updating the value in db
          updateCheckedStatus(note);
        }
      });

    });
  });

  const updateCheckedStatus = async note => {
    $("#all-notes").empty();
    let res = await fetch("/rest/notes/" + note.id, {
      method: "PUT",
      body: JSON.stringify(note),
    });

    console.log(res);
    getAllNotes()
  }

  async function getPathsFromDb(){

    let result = await fetch("/rest/paths");
    let paths = await result.json();
    console.log(paths);
  }

  async function createPathInDb(path){

    let result = await fetch("/rest/paths", {
        method: "POST",
        body: JSON.stringify(path)
    });

    console.log(await result.text());
  }

  async function deletePathInDb(path){

    let result = await fetch("/rest/paths/id", {
        method: "DELETE",
        body: JSON.stringify(path)
    });


    console.log(await result.text());

  }

  async function getNote(){
    let result = await fetch("/rest/notes/id");
    notes = await result.json();
  }

  $("#deleteNoteByIdButton").click(function() {
    deleteNoteById();

  });

  async function deleteNoteById(id){
    let result = await fetch("/rest/notes/id", {
      method: "DELETE",
      body: JSON.stringify(id)
    });

  }

  let categories = []
  async function getCategoriesFromDb(){

    let result = await fetch("/rest/categories");
    categories = await result.json();

    // fill dropdown in form with categories when creating a new note
    let $createNoteFormDropdown = $("#create-note-form").find($("#note-category"));
    $createNoteFormDropdown.append('<option value="1">Pick a Category</option>');
    categories.forEach(category => {
      $createNoteFormDropdown.append('<option value="'+category.id+'">'+category.category+'</option>');
    });
  }
  getCategoriesFromDb();


  async function getCategoryByIdFromDb(id){

    let result = await fetch("/rest/categories/" + id);
    let category = await result.json();

    console.log(category);

    return category.category
  }

})(jQuery);
