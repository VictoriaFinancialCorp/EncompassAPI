var express = require('express');
var router = express.Router();
var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login/login', { title: 'Login' , clientID: config.get('EncompassAPI.api_client_id')});
});

router.get('/login0', function(req, res, next) {
  res.render('login/login0', { title: 'Login' });
});

module.exports = router;
