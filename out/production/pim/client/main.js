

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


  // Getting and displaying the notes
  let notes = [];
  populateNotesList();

  function populateNotesList(){
    getAllNotes();
  }

  async function getAllNotes(){
    let result = await fetch("/rest/notes");
    notes = await result.json();

    console.log(notes)
    renderNotes();
  }

  function renderNotes(){

    console.log(notes.length)

    let allNotesElement = $("#all-notes");

    for (let i = 0; i < notes.length; i++) {

      
      
      // allNotesElement.append(
        
      //   '<p>' + notes[i].title + '</p>'
      //   // '<p>test</p>'



      // );


 
      if(note[i].checked){

        allNotesElement.append(

          
          '<article class = checktrue>' +
         '<div class="article-header">' +
            '<p>' + note[i].category + '</p>' +
            '<a href="/update_note.html?note-id=' + note[i].id + '" class="far fa-edit fa-2x"></a>' +
          '</div>' +
          '<h1>' +
            '<a href="/single_note.html?note-id=' + note[i].id + '">' +
            note[i].title +
            '</a>' +
          '</h1>' +
          '<div class="dates">' +
            '<div class="created-date">' +
              '<p>Created:</p>' +
              '<p>' + note[i].creationDate + '</p>' +
            '</div>' +
            '<div class="end-date">' +
              '<p>Ends:</p>' +
              '<p>' + note[i].finishDate + '</p>' +
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
            '<p>' + note[i].category + '</p>' +
            '<a href="/update_note.html?note-id=' + note[i].id + '" class="far fa-edit fa-2x"></a>' +
          '</div>' +
          '<h1>' +
            '<a href="/single_note.html?note-id=' + note[i].id + '">' +
            note[i].title +
            '</a>' +
          '</h1>' +
          '<div class="dates">' +
            '<div class="created-date">' +
              '<p>Created:</p>' +
              '<p>' + note[i].creationDate + '</p>' +
            '</div>' +
            '<div class="end-date">' +
              '<p>Ends:</p>' +
              '<p>' + note[i].finishDate + '</p>' +
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



      
      // if(note[i].checked){

      //   allNotesElement.append(

      //     '<p>test</p>'

      //     `
      //     <article class = check${note[i].checked}>
      //     <div class="article-header">
      //       <p>${note[i].category}</p>
      //       <a href="/update_note.html?note-id=${note[i].id}" class="far fa-edit fa-2x"></a>
      //     </div>
      //     <h1>
      //       <a href="/single_note.html?note-id=${note[i].id}">
      //       ${note[i].title}
      //       </a>
      //     </h1>
      //     <div class="dates">
      //       <div class="created-date">
      //         <p>Created:</p>
      //         <p>${note[i].creationDate}</p>
      //       </div>
      //       <div class="end-date">
      //         <p>Ends:</p>
      //         <p>${note[i].finishDate}</p>
      //       </div>
      //     </div>
      //     <div class="files-checked">
      //       <i class="far fa-file-alt fa-2x"></i>
      //       <i class="far fa-file-image fa-2x"></i>
      //       <i class="far fa-check-square fa-2x"></i> 
      //     </div>
      //   </article>
          
      //     `
      //   );
        
      // }
      // else{

      //   allNotesElement.append(

      //     `
      //     <article class = check${note[i].checked}>
      //     <div class="article-header">
      //       <p>${note[i].category}</p>
      //       <a href="/update_note.html?note-id=${note[i].id}" class="far fa-edit fa-2x"></a>
      //     </div>
      //     <h1>
      //       <a href="/single_note.html?note-id=${note[i].id}">
      //       ${note[i].title}
      //       </a>
      //     </h1>
      //     <div class="dates">
      //       <div class="created-date">
      //         <p>Created:</p>
      //         <p>${note[i].creationDate}</p>
      //       </div>
      //       <div class="end-date">
      //         <p>Ends:</p>
      //         <p>${note[i].finishDate}</p>
      //       </div>
      //     </div>
      //     <div class="files-checked">
      //       <i class="far fa-file-alt fa-2x"></i>
      //       <i class="far fa-file-image fa-2x"></i>
      //       <i class="far fa-square fa-2x"></i>
      //     </div>
      //   </article>
          
      //   `
      //   );
      // }






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




  async function deleteNoteById(note){
    let result = await fetch("/rest/notes/id", {
      method: "DELETE",
      BODY: JSON.stringify(note)
    });
  }

})(jQuery);
