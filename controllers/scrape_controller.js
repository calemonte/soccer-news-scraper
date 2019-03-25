"use strict";

const express = require("express");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// Display the scraped, not-saved articles from the database when visiting the homepage.
router.get("/", (req, res) => {
  db.Article.find({
    saved: false
  })
    .then(article => {
      res.render("index", {
        article: article
      });
    })
    .catch(error => res.json(error));
});

// Display the saved articles from the database when visiting the /saved page.
router.get("/saved", (req, res) => {
  db.Article.find({
    saved: true
  })
    .populate("note")
    .then(article => {
      res.render("saved", {
        article: article,
      });
    })
    .catch(error => res.json(error));
});

// Display the individual article populated with it's notes when hit.
router.get("/saved/:id", (req, res) => {
    const id = req.params.id;

    db.Article.find({
      _id: id
    })
      .populate("note")
      .then(article => {
        // console.log("Does this inlude our notes?" + article[1].note);
        res.json(article);
      })
      .catch(error => res.json(error));
  });

// Scrape fresh articles when we hit the /scrape route.
router.get("/api/scrape", (req, res) => {
  axios.get("https://www.theguardian.com/football").then(response => {
    const $ = cheerio.load(response.data);

    $(".fc-item__container").each(function(i, element) {
      let result = {};
      const textContent = $(element).find(".fc-item__content");
      const mediaContent = $(element).find(".fc-item__media-wrapper");

      result.title = $(textContent)
        .find(".fc-item__title")
        .text();

      result.link = $(textContent)
        .find("a")
        .attr("href");

      result.image = $(mediaContent)
        .find("img")
        .attr("src");

      result.saved = false;

      // Only save articles to the database if they don't exist already.
      db.Article.findOne(
        {
          link: result.link
        },
        (err, doc) => {
          if (err) console.log(err);
          if (!doc) {
            db.Article.create(result)
              .then(dbArticle => {
                console.log(dbArticle);
              })
              .catch(err => console.log(err));
          } else {
            console.log("Article already exists in the database.");
          }
        }
      );
    });

    res.send(200, `Scrape complete!`);
  });
});

// Update an article to save.
router.put("/api/article/:id", (req, res) => {
  const id = req.params.id;

  db.Article.updateOne(
    {
      _id: id
    },
    {
      $set: {
        saved: true
      }
    }
  )
    .then(doc => res.send(doc))
    .catch(err => console.log(err));
});

// Delete a saved article.
router.delete("/api/article/:id", (req, res) => {
  const id = req.params.id;

  db.Article.deleteOne({
    _id: id
  })
    .then(deletedDoc => res.send(deletedDoc))
    .catch(err => console.log(err));
});

// Clear the database of all "unsaved" articles when we hit the /api/clear route.
router.get("/api/clear", (req, res) => {
  db.Article.deleteMany({
    saved: false
  })
    .then(response => res.send(response))
    .catch(err => console.log(err));
});

// Route for creating a new note.
router.post("/api/notes", (req, res) => {
  const { articleId, title, body } = req.body;

  db.Note.create({
    title: title,
    body: body
  })
    .then(newNote => {
      return db.Article.findOneAndUpdate(
        {
          _id: articleId
        },
        {
          $push: {
              note: newNote._id 
            }
        },
        {
          new: true
        }
      );
    })
    .then(updatedArticle => res.json(updatedArticle))
    .catch(err => res.json(err));
});

module.exports = router;
