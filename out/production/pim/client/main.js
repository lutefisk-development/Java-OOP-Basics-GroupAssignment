

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

    // getting back the new note
    let newNoteRes = await fetch("/rest/new");
    let newNoteFromDb = await newNoteRes.json();

    // setting path variable
    let newPath = {
      path: fileUrl ? fileUrl : null,
      noteId: newNoteFromDb.id,
      fileType: "img"
    }

    //only make a new path in db if the user actually has inserted a file
    if(newPath.path != null) {
      let pathResult = await fetch("/rest/paths", {
        method: "POST",
        body: JSON.stringify(newPath),
      });
    }

    // back to frontpage
    window.location.replace("http://localhost:1000/");
  }

  // Getting and render the notes
  console.log("Början på koden");

  let notes = [];
  getAllNotes();

  let currentUrl = window.location.href;
  console.log(currentUrl);

  async function getAllNotes(){

    console.log("Innan await");
    let result = await fetch("/rest/notes");
    notes = await result.json();
    console.log("Efter await");


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

      let category = await getCategoryByIdFromDb(notes[i].categoryId);

      if(notes[i].checked){

        allNotesElement.append(
          '<article class="checktrue">' +
         '<div class="article-header" id="'+notes[i].id+'">' +
            '<p>' + await category.category.toUpperCase() + '</p>' +
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
            '<p>' + await category.category.toUpperCase() + '</p>' +
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

      if(currentUrl.includes("note-id=")){
        updateSingleNote();
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


  async function updateSingleNote(){

    let id = currentUrl.split("note-id=")[1];
    let note = await getNoteById(id);

    let category = await getCategoryByIdFromDb(await note.categoryId);
    let categories = await getCategoriesFromDb();

    $("#note-title").val(await note.title);
    $("#note-text").val(await note.text);
    $("#note-end").val(await note.finishDate);
    document.getElementById("note-category").selectedIndex = (await category.id - 1).toString();

    let categoryList = document.querySelector("#note-category");
    categoryList.innerHTML = "";


    for (let i = 0; i < categories.length; i++) {

      cat = '<option value =' + '"' + categories[i].id + '"' + '>' + categories[i].category + '</option>' ;
      categoryList.innerHTML += cat;
    }



    $("#update-button").click(async function(){

      let id = currentUrl.split("note-id=")[1];
      let note = await getNoteById(id);

      let updatedNote = {

        id: await note.id,
        title: $("#note-title").val(),
        text: $("#note-text").val(),
        categoryId: document.getElementById("note-category").selectedIndex + 1,
        checked: await note.checked,
        creationDate: await note.creationDate,
        finishDate: $("#note-end").val()
      }

      updateNoteInDb(updatedNote);
      window.location.replace("http://localhost:1000/");
    });

  }

  function filter(){

    // categories

    $("#open-navbar").click(async function() {

      let categories = await getCategoriesFromDb();
      let cateElement = $("#filter-categories");
  
  
      for (let i = 0; i < categories.length; i++) {
  
          cateElement.append(
  
            '<li>' + await categories[i].category + '</li>'
          );
      }






    });







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

  async function getNoteById(id){
    let result = await fetch("/rest/notes/" + id);
    note = await result.json();

    console.log(note);
    return note;
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


  async function getCategoriesFromDb(){

    let result = await fetch("/rest/categories");
    let categories = await result.json();

    // fill dropdown in form with categories when creating a new note
    let $createNoteFormDropdown = $("#create-note-form").find($("#note-category"));
    $createNoteFormDropdown.append('<option value="1">Pick a Category</option>');
    categories.forEach(category => {
      $createNoteFormDropdown.append('<option value="'+category.id+'">'+category.category+'</option>');
    });

    return categories
  }
  let categories = getCategoriesFromDb();


  async function getCategoryByIdFromDb(id){

    let result = await fetch("/rest/categories/" + id);
    let category = await result.json();

    console.log(category);

    return category;
  }

  async function updateNoteInDb(note){

    let result = await fetch("/rest/notes/id", {
      method: "PUT",
      body: JSON.stringify(note)
    })

    console.log(await result.text());
  }



  console.log("Slutet på koden");

})(jQuery);
