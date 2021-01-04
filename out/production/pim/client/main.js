// Scoping jquery:
(function($) {

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

  // create note form:
  $("#create-note-form").submit(function(e) {

    // stop form from submitting.
    e.preventDefault();

    // handling the form data
    handleFormSubmit();
  });

  const handleFormSubmit = async () => {
    // getting file if user has added one
    let fileUrl;
    let fileType = "";
    if($("#note-file").prop('files').length > 0) {
      let $fileArray = $("#note-file").prop('files');

      let formData = new FormData();

      // adding the file to formData
      for(let file of $fileArray) {

        // if it's a png or jpeg file, set variable to "img"
        if(file.type.split("/")[1] == "png" || file.type.split("/")[1] == "jpeg") {
          fileType = "img"
        }

        // if it's pdf or txt file, set variable to "file"
        if(file.type.split("/")[1] == "pdf" || file.type.split("/")[1] == "plain") {
          fileType = "file"
        }
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
      finishDate: $("#note-end").val() == "" ? "No date is set" : $("#note-end").val(),
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
      fileType: fileType
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
  let notes = [];
  prepareFrontPage();

  let currentUrl = window.location.href;

  function prepareFrontPage(){

    getAllNotes();
    filter();
    sort();
  }

  async function getAllNotes(){

    let result = await fetch("/rest/notes");
    notes = await result.json();

    renderNotes();
  }

  async function renderNotes(){

    let allNotesElement = $("#all-notes");

    for (let i = 0; i < notes.length; i++) {

      let category = await getCategoryByIdFromDb(notes[i].categoryId);
      let paths = await getPathsFromDb(notes[i].id);

      if(notes[i].checked){

        if(paths.length >0){

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
              '<i class="fas fa-paperclip fa-2x"></i>' +
              '<i id="'+notes[i].id+'" class="far fa-check-square fa-2x check-note"></i>' +
           '</div>' +
          '</article>'
          );

        } else {

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
              '<i id="'+notes[i].id+'" class="far fa-check-square fa-2x check-note"></i>' +
           '</div>' +
          '</article>'
          );

        }
      }
      else{

        if(paths.length >0){

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
              '<i class="fas fa-paperclip fa-2x"></i>' +
              '<i id="'+notes[i].id+'" class="far fa-square fa-2x check-note"></i>' +
           '</div>' +
          '</article>'
          );

        }else{

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
              '<i id="'+notes[i].id+'" class="far fa-square fa-2x check-note"></i>' +
           '</div>' +
          '</article>'
          );

        }


      }

      if(currentUrl.includes("/update_note.html?note-id=")){
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

    console.log(await res.text());

    getAllNotes();
  }

  async function updateSingleNote(){

    let id = currentUrl.split("note-id=")[1];
    let note = await getNoteById(id);

    let category = await getCategoryByIdFromDb(await note.categoryId);
    let categories = await getCategoriesFromDb();

    $("#note-title").val(await note.title);
    $("#note-text").val(await note.text);
    $("#note-end").val(await note.finishDate);

    let categoryList = document.querySelector("#note-category");
    categoryList.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {

      cat = '<option value =' + '"' + categories[i].id + '"' + '>' + categories[i].category + '</option>' ;
      categoryList.innerHTML += cat;
    }

    $("#note-category").prop("selectedIndex",category.id - 1 );
  }

  $(document).ready(function() {
    $(document).on('submit', '#update-note-form', async function(e) {

      e.preventDefault();
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

      await updateNoteInDb(updatedNote);
      await addFileToNote(id);
      window.location.replace("http://localhost:1000/");
    });
  });

  const addFileToNote = async id => {
    // getting file if user has added one
    let fileUrl;
    let fileType = "";
    if($("#note-file").prop('files').length > 0) {
      let $fileArray = $("#note-file").prop('files');

      let formData = new FormData();

      // adding the file to formData
      for(let file of $fileArray) {

        // if it's a png or jpeg file, set variable to "img"
        if(file.type.split("/")[1] == "png" || file.type.split("/")[1] == "jpeg") {
          fileType = "img"
        }

        // if it's pdf or txt file, set variable to "file"
        if(file.type.split("/")[1] == "pdf" || file.type.split("/")[1] == "plain") {
          fileType = "file"
        }
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

     // setting path variable
     let newPath = {
      path: fileUrl ? fileUrl : null,
      noteId: id,
      fileType: fileType
    }

    //only make a new path in db if the user actually has inserted a file
    if(newPath.path != null) {
      let pathResult = await fetch("/rest/paths", {
        method: "POST",
        body: JSON.stringify(newPath),
      });
    }
  }

  function filter(){

    showSideNavBarCategories();
    filterAllNotes();
    filterChecked();
  }

  function showSideNavBarCategories(){

    $("#open-navbar").click(async function() {

      let categories = await getCategoriesFromDb();
      let catList = document.querySelector("#filter-categories");
      catList.innerHTML = "";

      for (let i = 0; i < categories.length; i++) {

        category =  '<li class = "navbar-category">' + categories[i].category + '</li>';
        catList.innerHTML += category;
      }

      filterCategory();

    });
  }

  function filterAllNotes(){

    $("#allnotes-sidebar").click(async function() {

      notes = [];
      exitSideNavBar();

      let result = await fetch("/rest/notes");
      notes = await result.json();

      $("#all-notes").empty();
      renderNotes();
    });
  }

  function filterChecked(){

    $("#checked-sidebar").click(async function() {

     let notesTemp = [];

      for (let i = 0; i < notes.length; i++) {

        if(notes[i].checked == false){

          notesTemp.push(notes[i]);
        }
      }

      if(notesTemp != []){

        notes = [];
        notes = Array.from(notesTemp);
        notesTemp = [];
      }

      exitSideNavBar();
      $("#all-notes").empty();
      renderNotes();
    });

  }


  async function filterCategory(){

    // Refill notes[] again after a filter for category,
    // so alla notes ares available for a new filter of category
    let result = await fetch("/rest/notes");
    notes = await result.json();

    let notesTemp = [];
    let catList = $(".navbar-category");

    for (let i = 0; i < catList.length; i++) {

      $(catList[i]).click(async function() {

        for (let j = 0; j < notes.length; j++) {

          let catId = notes[j].categoryId;
          let category = await getCategoryByIdFromDb(catId);

          if(await category.category == $(catList[i]).text()){
            notesTemp.push(notes[j]);
          }
        }

        if(notesTemp != []){
          notes = [];
          notes = Array.from(notesTemp);
          notesTemp = [];
        }

        exitSideNavBar();
        $("#all-notes").empty();
        renderNotes();

      });
    }
  }

  function exitSideNavBar(){

    $("#side-navbar").css("width", "0");
    $(".container").removeClass("blur");
    $(".navbar-wrapper").removeClass("open");
  }

  function sort(){

    sortByTitle();
    sortByCreatedDate();
    sortByEndDate();

  }

  async function sortByTitle(){

    // Empty and fill, if any filters have been done before
    notes = [];
    let result = await fetch("/rest/notes");
    notes = await result.json();

    $("#sortlist-title").click(function(){

      // Sorts first by title, second by creationDate
      notes.sort((a,b) => (a.title.toUpperCase() > b.title.toUpperCase()) ? 1 : (a.title.toUpperCase()   === b.title.toUpperCase()) ? ((a.creationDate > b.creationDate) ? 1: -1) : -1);

      exitSideNavBar();
      $("#all-notes").empty();
      renderNotes();
    });

  }

  async function sortByCreatedDate(){

    // Empty and fill, if any filters have been done before
    notes = [];
    let result = await fetch("/rest/notes");
    notes = await result.json();

    $("#sortlist-created").click(function(){

      // Sorts first by creationDate, second by endDate (finsihDate)
      notes.sort((a,b) => (a.creationDate > b.creationDate) ? 1 : (a.creationDate  === b.creationDate) ? ((a.finishDate > b.finishDate) ? 1: -1) : -1);

      exitSideNavBar();
      $("#all-notes").empty();
      renderNotes();
    });

  }

  async function sortByEndDate(){

    // Empty and fill, if any filters have been done before
    notes = [];
    let result = await fetch("/rest/notes");
    notes = await result.json();

    $("#sortlist-end").click(function(){

      // Sorts first by endDate (finsihDate), second by creationDate
      notes.sort((a,b) => (a.finishDate > b.finishDate) ? 1 : (a.finishDate  === b.finishDate) ? ((a.creationDate > b.creationDate) ? 1: -1) : -1);

      exitSideNavBar();
      $("#all-notes").empty();
      renderNotes();
    });
  }


  // show single note by id
  if(currentUrl.includes("/single_note.html?note-id=")) {
    let id = currentUrl.split("=")[1];
    showSingleNoteById(id);
  };

  async function showSingleNoteById(id) {

    let note = await getNoteById(id);
    let paths = await getPathsFromDb(id);


    let imgs = [];
    let files = [];

    // loops through paths and divids up files and images into other arrays
    for(let i = 0; i < paths.length; i++) {

      if(paths[i].fileType == "img") {
        imgs.push(paths[i]);
      } else {
        files.push(paths[i]);
      };
    };

    if(imgs.length > 0) {

      $("#single-note").append(
        '<div class="section-header">' +
          '<div class="dates">' +
            '<div class="created-date">' +
              '<p>Created:</p>' +
              '<p>'+ note.creationDate +'</p>' +
            '</div>' +
            '<div class="end-date">' +
              '<p>Ends:</p>' +
              '<p>'+ note.finishDate +'</p>' +
            '</div>' +
          '</div>'+
          '<div class="edit-delete">' +
            '<a href="/update_note.html?note-id='+ note.id +'" class="far fa-edit fa-2x"></a>' +
            '<i id="deleteNoteByIdButton" class="far fa-trash-alt fa-2x"></i>' +
          '</div>' +
        '</div>'+
        '<div class="section-body">' +
          '<h2>'+ note.title +'</h2>' +
          '<p>'+ note.text +'</p>' +
        '</div>' +
        '<div class="section-images"></div>' +
        '<div class="section-files"></div>'
      );

    } else {

      $("#single-note").append(
        '<div class="section-header">' +
          '<div class="dates">' +
            '<div class="created-date">' +
              '<p>Created:</p>' +
              '<p>'+ note.creationDate +'</p>' +
            '</div>' +
            '<div class="end-date">' +
              '<p>Ends:</p>' +
              '<p>'+ note.finishDate +'</p>' +
            '</div>' +
          '</div>'+
          '<div class="edit-delete">' +
            '<a href="/update_note.html?note-id='+ note.id +'" class="far fa-edit fa-2x"></a>' +
            '<i id="deleteNoteByIdButton" class="far fa-trash-alt fa-2x"></i>' +
          '</div>' +
        '</div>'+
        '<div class="section-body">' +
          '<h2>'+ note.title +'</h2>' +
          '<p>'+ note.text +'</p>' +
        '</div>' +
        '<div class="section-files"></div>'
      );
    };

    // append imgages to .section-images
    if(imgs.length > 0) {

      for(let i = 0; i < imgs.length; i++) {

        $(".section-images").append(
          '<figure class="img-wrapper" id="img-'+ imgs[i].id +'">' +
          '<i id="confirmDeleteSingleImg" class="far fa-trash-alt fa-1x"></i>' +
            '<a href="'+ imgs[i].path +'" data-toggle="lightbox">' +
            '<img src="'+ imgs[i].path +'" alt="">' +
            '</a>' +
            '</figure>'
        );
      };
    };

    // append files to .section-files
    if(files.length > 0) {

      for(let i = 0; i < files.length; i++) {

        if(files[i].path.split("/")[2] == undefined) {

          $(".section-files").append(
            '<div1 class="file-container" id="file-'+ files[i].id +'">' +
            '<i id="confirmDeleteSingleFile" class="far fa-trash-alt fa-1x"></i>' +
            '<i class="far fa-file-alt fa-3x"></i>' +
            '<a href="'+ files[i].path +'">'+ files[i].path.split("\\")[2] +'</a>' +
            '</div>'
            );
          } else {

            $(".section-files").append(
              '<div1 class="file-container" id="file-'+ files[i].id +'">'+
              '<i id="confirmDeleteSingleFile" class="far fa-trash-alt fa-1x"></i>' +
                '<i class="far fa-file-alt fa-3x"></i>' +
                '<a href="'+ files[i].path +'">'+ files[i].path.split("/")[2] +'</a>' +
              '</div>'
            );
          }
        };
      };
    };


  async function getPathsFromDb(id){

    let result = await fetch("/rest/paths/" +id);
    let paths = await result.json();

    return paths;
  }

  async function deletePathInDb(id){

    let result = await fetch("/rest/paths/" + id, {
        method: "DELETE",
    });


    console.log(await result.text());

  }

  async function getNoteById(id){

    let result = await fetch("/rest/notes/" + id);
    note = await result.json();

    return note;
  }

  $(document).ready(function() {

    $(document).on('click', '#deleteNoteByIdButton', async function() {

      let result = confirm("Are you sure you want to delete this note?")
      
      if(result){

        
        let currentNoteId = currentUrl.split("=")[1];
        
        await deletePathInDb(currentNoteId);
        await deleteNoteById(currentNoteId);
        
        window.location.replace("http://localhost:1000/");
      }
    });
  });

  async function deleteNoteById(id){
    let result = await fetch("/rest/notes/" + id, {
      method: "DELETE",
    });

    console.log(await result.text());
  };

  $(document).ready(function() {

    $(document).on('click', '#confirmDeleteSingleImg', async function() {

      let result = confirm("Are you sure you want to delete this image?")
      
      if(result){

        imgId = $("figure").attr("id").split("-")[1]

        await deleteSinglePathInDb(imgId);
        
        window.location.reload();
      }
    });
  });

  $(document).ready(function() {

    $(document).on('click', '#confirmDeleteSingleFile', async function() {

      let result = confirm("Are you sure you want to delete this file?")
      
      if(result){

        fileId = $("div1").attr("id").split("-")[1]
        
        console.log(fileId)

        await deleteSinglePathInDb(fileId);
        
        window.location.reload();
      }
    });
  });

  async function deleteSinglePathInDb(id){

    let result = await fetch("/rest/paths/" + id, {
        method: "PUT",
    });


    console.log(await result.text());

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

    return category;
  }

  async function updateNoteInDb(note){

    let result = await fetch("/rest/notes/id", {
      method: "PUT",
      body: JSON.stringify(note)
    })

    console.log(await result.text());
  }

})(jQuery);
