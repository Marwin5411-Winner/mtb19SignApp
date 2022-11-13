var express = require("express");
var router = express.Router();
const passport = require("passport"); /* POST login. */
const getUserDataJWT = require('../utility/getDataFromjwt');


/* GET home page. */
router.get("/", passport.authenticate('jwt', {session: false, failureRedirect: '/login'}), function (req, res, next) {
  let user = getUserDataJWT(req, res);
  res.render("index", { title: "Express", user: user});
});

router.get("/pdfviewer", (req, res, next) => {
  res.render("pdfViewer", { title: "PDF Viewer"});
});

router.get("/document", (req, res, next) => {
  res.render("document", { title: "Document"});
})

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login"});
});

router.get("/404", (req, res, next)  => {
  const type = req.query.type || "ไม่ทราบชนิด";
  const description = req.query.description || "ไม่ทราบเหคุผล";
  res.render("404", { content: {
    type: type,
    description: description
  }});
});

//paper work routes for the user to check documents


router.get('/test', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.send(req.user);
})

module.exports = router;
