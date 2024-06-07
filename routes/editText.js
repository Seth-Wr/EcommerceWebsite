const router = require('express').Router();
const { authSeller } = require('../authSeller');
const {pool} = require("../db")

router.put('/',authSeller, async(req,res) =>{
    const column = req.query.column
    const imgId = req.query.imgId
    console.log(imgId)
    console.log(column)
    console.log(req.body.edit)
    let insertQuery = `update products set ${column} = '${req.body.edit}' where imgid = '${imgId}'`
    pool.query(insertQuery, (err, response) =>{
            if(!err){
              console.log("success")
              res.sendStatus(201)

            }
            else{
                console.log(err.message)
            }
    })  
})




module.exports = router;