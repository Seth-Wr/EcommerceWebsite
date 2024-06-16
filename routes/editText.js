const router = require('express').Router();
const { authSeller } = require('../authSeller');
const {pool} = require("../db")

router.put('/',authSeller, async(req,res) =>{
  try {
    const column = req.query.column
    const imgId = req.query.imgId
    let insertQuery = `update products set ${column} = '${req.body.edit}' where imgid = '${imgId}'`
    pool.query(insertQuery, (err, response) =>{
            if(!err){
              res.sendStatus(201)

            }
            else{
                console.log(err.message)
            }
    })  
  } catch (error) {
    console.error(error)
  }

})




module.exports = router;