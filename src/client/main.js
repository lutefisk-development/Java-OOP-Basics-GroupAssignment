

// Scoping jquery:
(function($) {

  // ALL JAVASCRIPT CODE HERE

  // opening and closing navbar:
  $("#open-navbar").click(function() {
    $("#side-navbar").css("width", "500px");
    $(".navbar-wrapper").addClass("open");
  });

  $("#close-navbar").click(function() {
    $("#side-navbar").css("width", "0");
    $(".navbar-wrapper").removeClass("open");
  });












  

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




})(jQuery);


// la till en get all notes function för att spara i en array for att delete ska funka, kan ha fel!
let notes = [];

async function getAllNotes(){
  let result = await fetch("/rest/notes");
  notes = await result.json();
}

async function deleteNoteById(note){
  let result = await fetch("/rest/notes/id", {
    method: "DELETE",
    BODY: JSON.stringify(note)
  });
}