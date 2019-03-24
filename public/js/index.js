$(document).ready(function() {
  $("#scrape-articles").on("click", scrapeArticles);
  $("#clear-articles").on("click", clearArticles);
  $(".save-article").on("click", saveArticle);

  // Function for hitting the API and scraping new articles.
  function scrapeArticles() {
    $.get("/api/scrape")
      .then(result => {
        location.reload();
      })
      .catch(err => console.log(err));
  }

  // Function that clears the database.
  function clearArticles() {
    $.get("/api/clear")
      .then(result => {
        location.reload();
      })
      .catch(err => console.log(err));
  }

  // Function that saves an article.
  function saveArticle() {
    const id = $(this).data("id");
    const thisCard = $(this).parents(".card");
    thisCard.remove();

    $.ajax({
      type: "PUT",
      url: `/api/article/${id}`,
      data: JSON.stringify(id),
      success: () => {
        showModal("Article Saved!", "Your article was successfully saved. To add notes to the article, visit the Saved Articles page in the navigation bar.");
      }
    });
  }

  function showModal(title, text) {
    $(".modal-title").text(title);
    $("#modal-text").text(text);

    // Show the modal. Clear it 500mils after it's been dismissed.
    $(".modal").modal("show");
    $("button[data-dismiss='modal']").on("click", function() {
      setTimeout(function() {
        $("#modal-text").text("");
        $(".modal-title").text("");
      }, 500);
    });
  }
});
