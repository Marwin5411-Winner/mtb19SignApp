var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = require('../configs/multer');


const upload = multer({ storage: storage });



router.post("/", upload.single("file"), (req, res, next) => {
  res.send("Upload success");
});


module.exports = router;

