var express = require("express");
var router = express.Router();
const passport = require("passport"); /* POST login. */
const multer = require("multer");
const fs = require("fs");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
//Get Utility
const getUserDataJWT = require("../utility/getDataFromjwt");
const removeTextFromStart = require("../utility/removeTextFromStart");
require("dotenv").config();
//Get models
const Document = require("../models/document");
//Save file With Random name
//Get configs
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/docs/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);

//     cb(null, Date.now() + ".pdf");
//   },
// });


let s3Key = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});


// s3.listBuckets((err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });


const upload = multer({
  storage: multerS3({
    s3: s3Key,
    bucket: "mc19th",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

const save = multer({
  storage: multerS3({
    s3: s3Key,
    bucket: 'mc19th',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, file.name);
    }
  })
});


//Get Data to Client
router.get("/", async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);

    const pendingDoc = await Document.find({ status: "pending" }).exec();

    const approvedDoc = await Document.find({ status: "approved" }).exec();

    const rejectedDoc = await Document.find({ status: "rejected" }).exec();

    const CreatorDoc = await Document.find({ authorId: user.id }).exec();

    const yourWork = await Document.find({
      reviewerStatus: user.reviewer,
    }).exec();

    //Merge all the documents into one obj
    const documents = {
      pendingDoc: pendingDoc,
      approvedDoc: approvedDoc,
      rejectedDoc: rejectedDoc,
      CreatorDoc,
      yourWork,
    };
    console.log(documents.yourWork);
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
    console.log(document);
    res.render("document/document", {
      title: "Document",
      user: user,
      documents: document
    });
  } catch (err) {
    res.redirect("/404?type=error&description=" + err);
  }
  //res.render("document", { title: "Document", user: user, document: document});
});

//Get Edit Document
router.get("/edit/:id", async (req, res) => {
  let user = getUserDataJWT(req, res);
  try {
    const document = await Document.findById(req.params.id).exec();
    console.log(document);
    res.render("document/editDocs", {
      title: "Document",
      user: user,
      documents: document,
    });
  } catch (err) {
    res.redirect("/404?type=error&description=" + err);
  }
});

//Delete document
router.get("/delete/:id", async (req, res) => {
  let user = getUserDataJWT(req, res);
  try {
    //delete Document from database
    const document = await Document.findById(req.params.id).exec();
    const doc = await Document.deleteOne({ _id: req.params.id }).exec();
    
  } catch (err) {
    console.error(err);
    res.redirect("/404?type=error&description=" + err);
  }
  res.redirect("/documents");
});

//Todo: Cannot Approve Document
//Priotrity Important
//POST Aprrove document per reviewer if user.reviewer = 1 then set reviewer.reviewer1 = true
router.get("/approve/:id", async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);
    const document = await Document.findById(req.params.id).exec();
    //Todo Create New logic for dynamically updating reviewer document
    console.log(document.reviewer);
    document.reviewer.splice(user.reviewer - 1, 1, 1);
    document.reviewerStatus = user.reviewer + 1;
    await document.save().then((data) => {
      res.redirect("/documents");
      console.log(data);
    });
  } catch (err) {
    res.redirect("/404?type=error&description=" + err);
  }
});

//POST reject document per reviewer if user.reviewer = 1 then set reviewer.reviewer1 = true
router.get("/reject/:id", async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);
    const document = await Document.findById(req.params.id).exec();
    //set document.reviewer to default value
    document.reviewer = [0, 0, 0, 0, 0];
    document.status = "rejected";
    document.notPassby = user.prefix + " " + user.name;
    await document.save();
    res.redirect("/documents");
  } catch (err) {
    res.redirect("/404?type=error&description=" + err);
  }
});

//Upload Document Page
router.get("/upload", async (req, res, next) => {
  let user = getUserDataJWT(req, res);
  res.render("document/upload", { title: "Hello World", user: user });
});

//Upload a document
router.post("/upload", upload.single("file"), (req, res, next) => {
  try {
    const user = getUserDataJWT(req, res);
    //const path = removeTextFromStart(8, req);
    let document = new Document({
      name: req.body.name,
      description: req.body.description,
      author: user.prefix + " " + user.name,
      authorId: user.id,
      status: "pending",
      department: req.body.department,
      file: req.file.url
    });
    console.log("Upload Doc: " +document);
    document.save((err, document) => {
      if (err) {
        // --->  Make Not Callback TT return next(err);
      }
      res.redirect("/documents");
    });
  } catch (err) {
    res.redirect("/documents");
  }
});

//POST Method Save PDF From edit file to replace file with new file
router.post("/save", save.single("file"), async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);
  } catch (err) {
    console.log("Error saving file to file");
    res.redirect("/documents");
  }
});

router.post("/test", async (req, res, next) => {
  console.log("Ok!");
});

module.exports = router;
