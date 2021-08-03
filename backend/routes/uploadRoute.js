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
  console.log("infoS3",req)
  // console.log("infoS3",req.file)
  res.send(req.file.location);
});

// const storageS3Get = multerS3({
//   s3,
//   bucket: 'arn:aws:s3:us-east-1:319475440169:accesspoint/acceso-bucket-ingenieria',
//   acl: 'private',
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   // key: 'INGENIERIA SITIO 405081 LOS ALGARROBOS-45m.pdf',
//   key(req, res) {
//     cb('', res);
//   },
// });

// const downloadS3 = multer({ storage: storageS3Get });
// router.get('/s3download', downloadS3.single('image'), (req, res) => {
//   console.log("infoS3",req)
//   res.send(req.data);
// });

router.post('/s3download', (req , res) => {
  console.log("req.body s3 download",req.body)
  const keyBreak = req.body.key.split(".")
  const tipo = keyBreak[1].toLowerCase();
  let contentType="";
  console.log("tipo",tipo)
  switch (tipo) {
    case "pdf":
      contentType= 'application/pdf' 
    break;
    case "docx":
      contentType= 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    break;
    case "doc":
      contentType= 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    break;
    case "dwg":
      contentType= 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    break;
      
    default:
      break;
  }
  // image/jpeg
 //dwg  application/x-ms-application
  const params = {
    Bucket: 'arn:aws:s3:us-east-1:319475440169:accesspoint/acceso-bucket-ingenieria', /* required */
    Key: req.body.key, /* required */

    // ExpectedBucketOwner: 'STRING_VALUE',
    // RequestPayer: requester,
    // VersionId: 'STRING_VALUE'
  };

  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    res.send({ error: true, errorInfo: err.stack})
    }
    else{     
     const dataAjustada = {
      AcceptRanges: data.AcceptRanges,
      LastModified: data.LastModified,
      ContentLength: data.ContentLength,
      ETag: data.ETag,
      ContentType: contentType,
      Metadata: data.Metadata,
      Body: data.Body
    }
    res.send({ error: false, data: dataAjustada, nombre:req.body})
    console.log("data:",dataAjustada);           // successful response
  }
  });
  // const file = await s3.getObjectAcl({ 
  //   Bucket: 'arn:aws:s3:us-east-1:319475440169:accesspoint/acceso-bucket-ingenieria',
  //   // Acl: 'private',

  //   Key: req.body,
  //  }).promise()
  // return {
  //  data: file.Body,
  //  mimetype: file.ContentType
  // }
 });

export default router;