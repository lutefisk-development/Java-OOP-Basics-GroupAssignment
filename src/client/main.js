

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