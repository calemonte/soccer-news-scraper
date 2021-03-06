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
  $(document).on("click", ".note-delete-button", deleteNote);

  // Delete an article from the database and the DOM when clicked.
  function deleteArticle() {
    const id = $(this).data("id");
    const thisCard = $(this).parents(".card");
    thisCard.remove();

    $.ajax({
      type: "DELETE",
      url: `/api/article/${id}`
    }).catch(err => console.log(err));
  }

  // Delete a note from the database and the DOM when clicked.
  function deleteNote() {
    const id = $(this).data("id");
    const thisNote = $(this).parents(".note-div");
    thisNote.remove();

    $.ajax({
      type: "DELETE",
      url: `/api/notes/${id}`
    }).catch(err => console.log(err));
  }

  // Show the add note modal, which contains our notes, when we click on the add note button.
  function showAddNoteModal() {
    // Locally set our article id.
    thisArticle.setId($(this).data("id"));

    // Get our notes and append them to the existing modal.
    $.get(`/saved/${thisArticle.getId()}`)
      .then(result => {
        // Empty the modal to get started.
        const article = result[0];
        const $modalNoteTarget = $("#modal-note-target");
        $modalNoteTarget.empty();

        // Append each note if there are notes to append.
        if (article.note.length > 0) {
          const notes = article.note;

          notes.forEach(note => {
            const noteDiv = $(
              `<div class="border border rounded p-2 text-center mb-2 note-div">`
            );
            const noteHeader = $(`<h5 class="note-display-title">`);
            const noteBody = $(`<p class="note-display-body">`);
            const noteDelete = $(
              `<button type="button" class="btn btn-danger btn-sm note-delete-button" data-id="">Delete Note</button>`
            );

            noteHeader.text(note.title);
            noteBody.text(note.body);
            noteDelete.attr("data-id", note._id);
            noteDiv.append(noteHeader, noteBody, noteDelete);
            $modalNoteTarget.append(noteDiv);
          });

          // Otherwise display a generic alert to create some notes.
        } else {
          const noteDiv = $(
            `<div class="border border rounded p-2 text-center mb-2">`
          );
          const noteBody = $(`<p class="note-display-body">`);

          noteBody.text(`There aren't any notes yet for this article.`);
          noteDiv.append(noteBody);
          $modalNoteTarget.append(noteDiv);
        }

        $(".modal").modal("show");
      })
      .catch(err => console.log(err));
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

    if (!title || !body) {
      alert("Make sure that you have a title and a body for your note!");
    } else {
      const data = {
        articleId: id,
        title: title,
        body: body
      };

      // Send our data to the notes POST route.
      $.post("/api/notes/", data).catch(err => console.log(err));

      // Clear the note modal inputs.
      $("#note-title").val("");
      $("#note-text").val("");
      $(".modal").modal("hide");
    }
  }
});
