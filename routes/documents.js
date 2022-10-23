var express = require("express");
var router = express.Router();
const passport = require("passport"); /* POST login. */
const getUserDataJWT = require('../utility/getDataFromjwt');
const multer = require('multer');


//Get configs
const storage = require('../configs/multer');

const upload = multer({ storage: storage});

//Get models
const Document = require("../models/document");


router.get('/', async (req, res, next) => {
  try {
    let user = getUserDataJWT(req, res);
  
    const pendingDoc = await Document.find({ status: 'pending' }).exec();
  
    const approvedDoc = await Document.find({ status: 'approved' }).exec();
  
    const rejectedDoc = await Document.find({ status: 'rejected' }).exec();
  
    //Merge all the documents into one obj
    const documents = {
      pendingDoc: pendingDoc,
      approvedDoc: approvedDoc,
      rejectedDoc: rejectedDoc
    };
    console.log(documents);
    res.render("documents", { title: "documents", user: user, documents: documents});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
  });


/*Document route Zone*/

//get document by id
router.get('/document/:id', async (req, res, next) => {
    let user = getUserDataJWT(req, res);
    try {
    const document = await Document.findById(req.params.id).exec();
    if (document) {
      res.render("document", { title: "Document", user: user, documents: document});
    }
    else {
        res.send("Document not found");
    }
    } catch (err) {
        res.send("Document not found");
    }
    //res.render("document", { title: "Document", user: user, document: document});
});

//POST Aprrove document per reviewer if user.reviewer = 1 then set reviewer.reviewer1 = true
router.post('/document/:id/approve', async (req, res, next) => {
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
        res.status(404).send('You are not a reviewer');
    }
    document.save();
    res.redirect('/documents');
});

    


  


  //Upload a document
router.post('/upload', upload.single('file'), (req, res, next) => {
    let user = getUserDataJWT(req, res);
    let document = new Document({
      name: req.body.name,
      description: req.body.description,
      status: 'pending',
      user: user._id,
      filePath: req.file.path
    });
    document.save((err, document) => {
      if(err) {
        return next(err);
      }
      res.redirect('/documents');
    });
  });
  
module.exports = router;