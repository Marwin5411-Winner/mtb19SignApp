const multer = require("multer");
const path = require("path");

const getDataFromjwt = require("../utility/getDataFromjwt");

//setup multer
const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
    
      console.log(file);
      
      cb(null,  '/' +  + file.originalname + '-' + user.name);
    },
  });




module.exports = filestorage;