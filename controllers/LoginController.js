
var config = require('config');

module.exports = {

  loginPage: function(req, res, next) {
    let url = 'https://idp.elliemae.com/authorize';
    let client_id = config.get("EncompassAPI.api_client_id");
    let response_type = 'code';
    let redirect_uri = 'https://localhost:3000/token';
    let state = '123';
    let scope = 'lp';
    res.redirect(`${url}?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}%scope=${scope}`);
  },

  getToken: function(req, res, next){
    var https = require('https');
    var fs = require('fs');
    var key = fs.readFileSync('./config/key.pem');
    var cert = fs.readFileSync('./config/cert.pem');
    var https_options = {
      key: key,
      cert: cert
    }

    let access_token = null;

    var querystring = require('querystring');
    var data = querystring.stringify({
        'grant_type':'authorization_code',
        'redirect_uri':'https://localhost:3000/token',
        'code':req.query.code
      });

    var options ={
      host: 'api.elliemae.com',
      path: '/oauth2/v1/token',
      //port: 80,
      method: 'POST',
      auth:config.get('EncompassAPI.api_client_id')+':'+config.get('EncompassAPI.api_client_secret'),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
      }
    }

    var httpsReq = https.request(options, function(response) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        access_token = chunk;
      });
      response.on('end', function(){
        //token saved in browser session
        req.session.token = JSON.parse(access_token);
        //res.send(access_token  + "<a href='https://localhost:3000'>home</a>");
        res.render('login/loggedIn', JSON.parse(access_token) );


      })
    });

    httpsReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    httpsReq.write(data);
    httpsReq.end();
  },


}
