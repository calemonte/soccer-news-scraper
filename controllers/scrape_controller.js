"use strict";

const express = require("express");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", req);
});

router.get("/scrape", (req, res) => {
  axios.get("https://www.theguardian.com/football").then(response => {
    const $ = cheerio.load(response.data);

    let result = {};
    $(".fc-item__content").each(function(i, element) {
      result.title = $(element)
        .find(".fc-item__title")
        .text();
      result.link = $(element)
        .find("a")
        .attr("href");

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
