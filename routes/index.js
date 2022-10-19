var express = require("express");
var router = express.Router();


const testuser = {
  name: "marwin",
  surname: "eewewewewew",
  rank: "rookie",
  department: "IT Computer",
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", user: testuser });
});

router.get("/pdfviewer", (req, res, next) => {
  res.render("pdfViewer", { title: "PDF Viewer", user: testuser });
});

router.get("/document", (req, res, next) => {
  res.render("document", { title: "Document", user: testuser });
})


module.exports = router;
