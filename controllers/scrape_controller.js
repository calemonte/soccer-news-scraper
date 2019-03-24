"use strict";

const express = require("express");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// Display the scraped articles from the database when visiting the homepage.
router.get("/", (req, res) => {
  db.Article.find({})
    .then(article => {
      res.render("index", {
        article: article
      });
    })
    .catch(error => res.json(error));
});

// Scrape fresh articles when we hit the /scrap route.
router.get("/scrape", (req, res) => {
  axios.get("https://www.theguardian.com/football").then(response => {
    const $ = cheerio.load(response.data);

    let result = {};

    $(".fc-item__container").each(function(i, element) {

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

      db.Article.create(result)
        .then(dbArticle => {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(err => console.log(err));
    });

    res.send(`Scrape complete!`);
  });
});

module.exports = router;
