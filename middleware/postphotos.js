const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const config = require('config');
const db = config.get('mongoURI')

const storage = new GridFsStorage({
  url: db,
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