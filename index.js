var express = require('express');
const verifyToken = require('../middleware/authMiddleware');
var router = express.Router();

/* GET home page. */
router.get('/', verifyToken, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).json({message: 'protect route'});
});

module.exports = router;
