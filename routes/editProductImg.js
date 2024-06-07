const router = require('express').Router();
const dotenv = require('dotenv');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const {s3} = require("../aws")
const multer = require('multer');
const { authSeller } = require('../authSeller');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
dotenv.config()
const bucketName = process.env.bucketName

router.put('/',authSeller, upload.single('file'),async(req,res) =>{
    const imgId = req.query.imgId
    const params = {
        Bucket: bucketName,
        Key: imgId,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        
         
    }
    const command = new PutObjectCommand(params)
    await s3.send(command)
    res.sendStatus(201)

})





module.exports = router;