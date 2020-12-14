

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
    // getting file
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
    let fileUrl = await uploadResult.text();

    console.log(fileUrl);

    // getting values from form:
    console.log($("#note-title").val());
    console.log($("#note-text").val());
    console.log($("#note-end").val());
    console.log($("#note-category").val());

    // return back to frontpage
    window.location.replace("http://localhost:1000/");
  }

  // GETTING ALL CATEGORIES:
  let categories = [];
  const getAllcategories = async () => {

<<<<<<< HEAD
    let res = await fetch("/rest/categories")
    categories = await res.json();

    categories.forEach(cat => console.log(cat));
  }
  getAllcategories();


=======
>>>>>>> dev
  // Getting and render the notes
  let notes = [];
  let categories = [];

  // getCategoriesFromDb();
  populateNotesList();

  async function getCategoriesFromDb(){
  
    let result = await fetch("/rest/categories");
    categories = await result.json();

    console.log(categories);

    // populateNotesList();
    
  } 


  function populateNotesList(){
    getAllNotes();
  }

  async function getAllNotes(){
    let result = await fetch("/rest/notes");
    notes = await result.json();

    console.log(notes)
    renderNotes();
  }

<<<<<<< HEAD
  function renderNotes(){
=======
  async function renderNotes(){
>>>>>>> dev

    let allNotesElement = $("#all-notes");
    let category = "";

    for (let i = 0; i < notes.length; i++) {

      // Check if finishDate is null, then set to an empty string
      if(notes[i].finishDate == null){
        notes[i].finishDate = "";
      }
<<<<<<< HEAD

      if(notes[i].checked){

        allNotesElement.append(
          '<article class = checktrue>' +
         '<div class="article-header" id="'+ notes[i].id +'">' +
            '<p>' + notes[i].categoryId + '</p>' +
            '<a href="#" class="far fa-edit fa-2x update-single-noteId"></a>' +
          '</div>' +
          '<h1>' +
          '<a href="#" class="get-single-noteId">' +
=======
      
      // for (let j = 0; j < categories.length; j++) {
        
      //   if(notes[i].categoryId == categories[j].id){

      //     category = categories[j].category;
      //     console.log(category);
      //   }

      // }

      // console.log(notes[i].categoryId);
      category = getCategoryByIdFromDb(notes[i].categoryId);
      console.log(category);



      if(notes[i].checked){

        // let category = getCategoryByIdFromDb(notes[i])
        // let categoryName = category.category;
        // console.log(categoryName);

          


        allNotesElement.append(
          '<article class = checktrue>' +
         '<div class="article-header">' +
            '<p>' + await category + '</p>' +
            '<a href="/update_note.html?note-id=' + notes[i].id + '" class="far fa-edit fa-2x"></a>' +
          '</div>' +
          '<h1>' +
            '<a href="/single_note.html?note-id=' + notes[i].id + '">' +
>>>>>>> dev
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
<<<<<<< HEAD
         '<div class="article-header" id="'+ notes[i].id +'">' +
            '<p>' + notes[i].categoryId + '</p>' +
            '<a href="#" class="far fa-edit fa-2x update-single-noteId"></a>' +
          '</div>' +
          '<h1 class="get-single-noteId">' +
          notes[i].title +
=======
         '<div class="article-header">' +
            '<p>' + await category + '</p>' +
            '<a href="/update_note.html?note-id=' + notes[i].id + '" class="far fa-edit fa-2x"></a>' +
          '</div>' +
          '<h1>' +
            '<a href="/single_note.html?note-id=' + notes[i].id + '">' +
            notes[i].title +
            '</a>' +
>>>>>>> dev
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
    }
  }



  // Async functions for PathEndpoints

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
<<<<<<< HEAD

  }
=======
    
  }


  async function getCategoryByIdFromDb(id){

    let result = await fetch("/rest/categories/" + id);
    let category = await result.json();

    console.log(category);
    
    return category.category
  }




>>>>>>> dev
})(jQuery);
