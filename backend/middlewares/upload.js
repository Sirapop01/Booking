const multer = require('multer');
const { storage } = require('../config/multerCloudinaryConfig');
const upload = multer({ storage });

module.exports = upload;
