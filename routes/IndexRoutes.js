const router = require("express").Router();
const path = require("path");
// GET- /
router.get("/", (req, res) => {
  // res.re("../views/index.html");
  // res.sendFile("D:APIapis\viewsindex.html");
  res.send("<h1>Welcome</h1>");
});

// exporting routes
module.exports = router;
