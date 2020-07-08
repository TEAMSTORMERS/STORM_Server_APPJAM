const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../dbconfig/s3.json');

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'sopt-26-server/images', // 버킷 이름
        acl: 'public-read', // 클라이언트에서 자유롭게
        key: function(req, file, cb){
            cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    }),
    //limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

module.exports = upload;