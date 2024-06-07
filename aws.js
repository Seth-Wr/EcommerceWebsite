const dotenv = require('dotenv');
const {S3Client}= require("@aws-sdk/client-s3");

dotenv.config()


// aws 
const bucketRegion = process.env.bucketRegion;

const accessKey = process.env.AWS_OPEN_KEY;
const secretKey = process.env.AWS_PRIVATE_KEY;



const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
    },
 region: bucketRegion
});


module.exports = {s3}