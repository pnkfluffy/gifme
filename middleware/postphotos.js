const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const dotenv = require('dotenv');

dotenv.config();
const jwtSecret = process.env.jwtSecret;

const storage = new GridFsStorage({
  url: jwtSecret,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "photos",
      filename: `${Date.now()}-gifme-${file.originalname}`,
      contentType: "image/jpeg"
    };
  }
});

const uploadFile = multer({ storage }).single('photo');
const postphotos = util.promisify(uploadFile);
module.exports = postphotos;