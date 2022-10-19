var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");

const testuser = {
    name: "marwin",
    surname: "eewewewewew",
    rank: "rookie",
    department: "IT Computer",
  };
  

//setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, new Date() + file.originalname);
  },
});


const upload = multer({ storage: storage });

router.get("/", (req, res, next) => {
  res.render("upload", { title: "Upload", user: testuser });
});

router.post("/", upload.single("file"), (req, res, next) => {
  res.send("Upload success");
});


module.exports = router;

