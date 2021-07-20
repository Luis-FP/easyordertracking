import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import config  from '../config';
import fileDownload from 'js-file-download';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// router.post('/', upload.single('image'), (req, res) => {
//     res.send('/'+ req.file.path);
// });



aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'arn:aws:s3:us-east-1:319475440169:accesspoint/acceso-bucket-ingenieria',
  acl: 'private',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb('', file.originalname);
  },
});

const uploadS3 = multer({ storage: storageS3 });
router.post('/s3', uploadS3.single('image'), (req, res) => {
  console.log("infoS3",req.file)
  res.send(req.file.location);
});





export default router;