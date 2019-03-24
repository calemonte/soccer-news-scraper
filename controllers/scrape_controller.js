"use strict";

const express = require("express");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", req);
});

module.exports = router;