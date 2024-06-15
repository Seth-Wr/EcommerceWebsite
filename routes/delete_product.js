const router = require('express').Router();
const dotenv = require('dotenv');
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const {pool} = require("../db")
const {s3} = require("../aws")
const {authSeller} = require("../authSeller")
dotenv.config()
const bucketName = process.env.bucketName
router.delete('/',authSeller, async(req, res) =>{
    //delete products from 
    const imgIds = [req.query.imgId, req.query.img2Id, req.query.img3Id, req.query.img4Id]
        const query = new Promise((resolve, reject) => {
            let insertQuery = `delete from products where imgid = '${imgIds[0]}'`
            pool.query(insertQuery, async (err, response) =>{
                if(!err){
                    resolve(response)
                    console.log("deleted from db")
                    for(i=0; i<imgIds.length; i++){
                        const deleteObjectParams = 
                        {  Bucket: bucketName,
                          Key: imgIds[i], 
                      }
                      const command = new DeleteObjectCommand(deleteObjectParams)
                      await s3.send(command)
                    }
                   
                    res.sendStatus(201)
                    console.log("status sent")
                }
                else{
                    reject(err)
                    console.log(err.message)
                    res.sendStatus(400)
                }
        })
        } )  
})
module.exports = router;