

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

    // getting values from form:
    console.log($("#note-title").val());
    console.log($("#note-text").val());
    console.log($("#note-end").val());
    console.log($("#note-category").val());

  })

  // update note form:
  $("#update-note-form").submit(function(e) {

    // stop form from submitting.
    e.preventDefault();

    // getting values from form:
    console.log($("#note-title").val());
    console.log($("#note-text").val());
    console.log($("#note-end").val());
    console.log($("#note-category").val());

  })


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
          '<article class = checktrue>' +
         '<div class="article-header">' +
            '<p>' + await category.category + '</p>' +
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
            '<i class="far fa-check-square fa-2x"></i>' + 
         '</div>' +
        '</article>'
        );
        
      }
      else{

        allNotesElement.append(
          '<article class = checkfalse>' +
         '<div class="article-header">' +
            '<p>' + await category.category + '</p>' +
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
            '<i class="far fa-square fa-2x"></i>' + 
         '</div>' +
        '</article>'
        );
      }

      if(currentUrl.includes("note-id=")){
        fillSingleNote();
      }

    }
  }


  async function fillSingleNote(){

    let id = currentUrl.split("note-id=")[1];
    let note = await getNoteById(id);

    let category = await getCategoryByIdFromDb(await note.categoryId);
    let categories = await getCategoriesFromDb();

    $("#note-title").val(await note.title);
    $("#note-text").val(await note.text);

    let categoryList = $("#note-category");

    for (let i = 0; i < categories.length; i++) {
      
      categoryList.append(

        '<option value =' + '"' + categories[i].id + '"' + '>' + categories[i].category + '</option>' 
      );
    }

    $("#note-end").val(await note.finishDate);
    document.getElementById("note-category").selectedIndex = (await category.id - 1).toString();
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

  // async function getNote(){
  //   let result = await fetch("/rest/notes/id");
  //   notes = await result.json();
  // }

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

    console.log(categories);

    return categories
  } 

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
