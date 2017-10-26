var express = require('express');
var router = express.Router();


let LoginController = require('../controllers/LoginController');
let PipelineController = require('../controllers/PipelineController');
let ReportController = require('../controllers/ReportController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', LoginController.loginPage);
router.get('/logout', LoginController.logout);

router.get('/token', LoginController.getToken);

router.get('/session', function(req, res, next) {
  res.send(req.session);
});

//check if logged in
router.get('/*', function(req, res, next){
  if(typeof req.session.token === 'undefined' || typeof req.session.token['access_token'] === 'undefined' ){
    console.log('not logged in');
    return res.redirect('/login');
  }else{
    next();
  }
});



router.get('/getFields', PipelineController.getFields);

router.get('/getFundedFiles/', ReportController.getFundedFiles);
router.get('/getFundedFiles/:date', ReportController.getFundedFiles);

router.get('/getLoansNotPurchased/', ReportController.getLoansNotPurchased);

module.exports = router;
