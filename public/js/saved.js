$(document).ready(function() {
  const thisArticle = {
    id: null,
    setId: function(id) {
      this.id = id;
    },
    getId: function() {
      return this.id;
    }
  };

  $(".delete-article").on("click", deleteArticle);
  $(".add-note").on("click", showAddNoteModal);
  $("#submit-note").on("click", submitNote);

  // Delete an article from the database and the DOM when clicked.
  function deleteArticle() {
    const id = $(this).data("id");
    const thisCard = $(this).parents(".card");
    thisCard.remove();

    $.ajax({
      type: "DELETE",
      url: `/api/article/${id}`
    }).then(data => console.log(data));
  }

  //   Show the modal when click on the save article button.
  function showAddNoteModal(e) {
    $(".modal").modal("show");
    thisArticle.setId($(this).data("id"));
  }

  function submitNote(e) {
    e.preventDefault();

    const title = $("#note-title")
      .val()
      .trim();
    const body = $("#note-text")
      .val()
      .trim();
    const id = thisArticle.getId();

    const data = {
      articleId: id,
      title: title,
      body: body
    };

    // Send our data to the notes POST route.
    $.post("/api/notes/", data, (data, status) =>
      console.log(`Status: ${status}. Data: ${data}`)
    );

    // Clear the note modal inputs.
    $("#note-title").val("");
    $("#note-text").val("");
    $(".modal").modal("hide");
  }
});
