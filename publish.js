const ghPages = require("gh-pages");

ghPages.publish("_book", function (err) {
  console.log(err, "errr");
});
