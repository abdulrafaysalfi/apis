const router = require("express").Router();
const path = require("path");
const upload = require("../utils/upload");
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("Uploaded");
});

// exporting routes
module.exports = router;
