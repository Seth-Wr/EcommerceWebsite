const router = require('express').Router();
const bcrypt = require('bcrypt')
const {pool} = require("../db")
router.post('/',async (req, res) =>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10)
let insertQuery = `insert into test(names1, emails, passwords, numbers, tacs, notifications, sellers) values('${req.body.name1}', '${req.body.email}', '${hashedPassword}', '${req.body.number}', '${req.body.tac}','${req.body.notification}','${req.body.seller}')`
pool.query(insertQuery, (err, response) =>{
    if(!err){
        pool.query(`insert into usercart (userid) select member_id from test where emails = $1`, [req.body.email], (error,results) =>{
            if(!error){
                res.sendStatus(201)
            }else(
                console.log(error.messages)
            )

        })
        
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