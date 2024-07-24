const { Router } = require('express');
const {
  uploadFile,
  readFile,
  readAllFilesFromUser,
} = require('../controllers/filesController');
const upload = require('../middleware/multer');

const router = Router();
router
  .route('/:userId')
  .get(readAllFilesFromUser)
  .post(upload.single('file'), uploadFile);

module.exports = router;
