var express = require('express');
var router = express.Router();

let LoginController = require('../controllers/LoginController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', LoginController.loginPage);
router.get('/token', LoginController.getToken);


router.get('/session', function(req, res, next) {
  res.send(req.session);
});


module.exports = router;
