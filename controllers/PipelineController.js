
var config = require('config');
var https = require('https');

module.exports = {

  getFields: function(req, res, next) {

    if(typeof req.session.token === 'undefined' || typeof req.session.token['access_token'] === 'undefined' ){
      console.log('not logged in');
      return res.json('Please log in');
    }

    var options ={
      host: 'api.elliemae.com',
      path: '/encompass/v1/loanPipeline/fieldDefinitions',
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + req.session.token['access_token']
      }
    }
    //console.log(req.session);
    //console.log(req.session.token);
    //console.log(req.session.token['access_token']);

    var data = "";

    var httpsReq = https.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        //console.log('BODY: ' + chunk);
        data += chunk;
      });
      response.on('end', function(){
        //res.json(JSON.parse(data));
        return res.render('pipeline/fields', {data: JSON.parse(data) } );
      });
    });
    httpsReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    //httpsReq.write(data);
    httpsReq.end();

  },

}
