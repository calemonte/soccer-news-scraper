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
    .then(article => {
      res.render("saved", {
        article: article
      });
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
  console.log(id);
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

// Clear the database of all "unsaved" articles when we hit the /api/clear route.
router.get("/api/clear", (req, res) => {
  db.Article.deleteMany({
    saved: false
  })
    .then(response => res.send(response))
    .catch(err => console.log(err));
});

module.exports = router;
