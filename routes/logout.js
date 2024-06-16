const router = require('express').Router();




router.get('/', function(req, res, next) {
  try {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  } catch (error) {
    console.error(error)
  }

  });




module.exports = router;