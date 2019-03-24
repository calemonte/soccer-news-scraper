"use strict";

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Setup our various pieces of middleware.
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/soccer-news-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Import routes.
const routes = require("./controllers/scrape_controller.js");
app.use(routes);

app.listen(PORT, () => console.log(`App running on port ${PORT}!`));