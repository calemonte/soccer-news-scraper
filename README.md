# Soccer News Scraper

This full stack application allows users to easily scrape headlines from [The Guardian's soccer website](https://www.theguardian.com/football), save favorite articles, and then add comments to those saved articles. This website was created for an assignment as part of the Penn LPS Coding Bootcamp's section on MongoDB and Mongoose.js.

To scrape new articles from The Guardian, click *Scrape Articles*. To delete the scraped articles, click *Clear Articles*. To save an article -- and preserve it from being cleared -- click *Save Article* on the card for an individual article. To add a comment to a saved article, simply click the *Notes* button on article card for any of the saved articles. Both articles and their comments can be deleted from the Saved Articles page. 

Deployed site: https://soccer-news-scraper.herokuapp.com/ 

## Develop

Clone the repository and then `npm install` the dependencies.

```
git clone git@github.com:calemonte/soccer-news-scraper.git
cd /soccer-news-scraper
npm install
```
To develop this project locally, you will need to have MongoDB installed and the [server running](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/#start-mongod-processes).

## Technologies Used

- JavaScript
- Node.js
- Express
- MongoDB
- Mongoose.js
- Heroku + mLab MongoDB (for deployment)
- Axios
- Cheerio
- Handlebars
- HTML/CSS

## Contribute

This was built by Kenny Whitebloom (https://github.com/calemonte) as part of a coding class, but if you are interested in contributing, feel free to open a pull request from a new branch.
