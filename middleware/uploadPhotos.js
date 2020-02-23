const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const config = require('config');
const db = 'mongodb+srv://jfelty:simplepassword@cluster0-wzspy.mongodb.net/files';

const storage = new GridFsStorage({
  url: db,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "photos",
      filename: `${Date.now()}-gifme-${file.originalname}`,
      contentType: "image/png"
    };
  }
});

const uploadFile = multer({ storage }).single('photo');
const uploadPhotos = util.promisify(uploadFile);
module.exports = uploadPhotos;