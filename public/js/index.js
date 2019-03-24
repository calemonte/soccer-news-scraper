$(document).ready(function() {

    $("#scrape-articles").on("click", scrapeArticles);
    $("#clear-articles").on("click", clearArticles);
    
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
});