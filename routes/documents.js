var express = require("express");
var router = express.Router();
const passport = require("passport"); /* POST login. */
const multer = require("multer");

//Get Utility
const getUserDataJWT = require("../utility/getDataFromjwt");
const removeTextFromStart = require("../utility/removeTextFromStart");

//Get configs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/docs/");
  },
  filename: (req, file, cb) => {
    console.log(file);

    cb(null, req.body.department + '-' + req.body.name + "-" + req.body.date + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Get models
const Document = require("../models/document");



//Get Data to Client
router.get("/", async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);

    const pendingDoc = await Document.find({ status: "pending" }).exec();

    const approvedDoc = await Document.find({ status: "approved" }).exec();

    const rejectedDoc = await Document.find({ status: "rejected" }).exec();

    //Merge all the documents into one obj
    const documents = {
      pendingDoc: pendingDoc,
      approvedDoc: approvedDoc,
      rejectedDoc: rejectedDoc,
    };
    console.log(documents);
    res.render("document/documents", {
      title: "documents",
      user: user,
      documents: documents,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

/*Document route Zone*/

//get document by id
router.get("/view/:id", async (req, res, next) => {
  let user = getUserDataJWT(req, res);
  try {
    const document = await Document.findById(req.params.id).exec();
    if (document) {
      res.render("document/document", {
        title: "Document",
        user: user,
        documents: document,
      });
    } else {
      res.send("Document not found");
    }
  } catch (err) {
    res.send("Document not found");
  }
  //res.render("document", { title: "Document", user: user, document: document});
});

//POST Aprrove document per reviewer if user.reviewer = 1 then set reviewer.reviewer1 = true
router.post("/approve/:id", async (req, res, next) => {
  let user = getUserDataJWT(req, res);
  const document = await Document.findById(req.params.id).exec();
  if (user.reviewer == 1) {
    document.reviewer.reviewer1 = true;
  } else if (user.reviewer == 2) {
    document.reviewer.reviewer2 = true;
  } else if (user.reviewer == 3) {
    document.reviewer.reviewer3 = true;
  } else if (user.reviewer == 4) {
    document.reviewer.reviewer4 = true;
  } else if (user.reviewer == 5) {
    document.reviewer.bigboss = true;
  } else {
    res.status(404).send("You are not a reviewer");
  }
  document.save();
  res.redirect("/documents");
});

//POST reject document per reviewer if user.reviewer = 1 then set reviewer.reviewer1 = true
router.post("/reject/:id", async (req, res, next) => {
  let user = getUserDataJWT(req, res);
  const document = await Document.findById(req.params.id).exec();
  //set document.reviewer to default value
  document.reviewer = {
    reviewer1: false,
    reviewer2: false,
    reviewer3: false,
    reviewer4: false,
    bigboss: false,
  };
  document.status = "rejected";
  document.notPassby = user.prefix + user.name;
  await document.save();
  res.redirect("/documents");
});

//Upload Document Page 
router.get("/upload", async (req, res, next) => {
  let user = getUserDataJWT(req, res);
  res.render("document/upload", { title: 'Hello World', user: user });
});

//Upload a document
router.post("/upload", upload.single("file"), (req, res, next) => {
  const user = getUserDataJWT(req, res);
  const path = removeTextFromStart(8, req);
  let document = new Document({
    name: req.body.name,
    description: req.body.description,
    author: user.rank + ' ' + user.name,
    authorId: user._id,
    status: "pending",
    department: req.body.department,
    file: path
  });
  console.log(document);
  document.save((err, document) => {
    if (err) {
      return next(err);
    }
    res.redirect("/documents");
  });
});

//POST Method Save PDF From edit file to replace file with new file
router.post("/save", upload.single("file"), async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);
    console.log("Save");
  } catch (err) {
    console.log("Error saving file to file");
    res.redirect("/documents");
  }
});

router.post("/test", async (req, res, next) => {
  console.log("Ok!");
});

module.exports = router;
