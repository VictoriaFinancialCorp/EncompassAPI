
var config = require('config');
var https = require('https');
var numeral = require('numeral');

module.exports = {

  getFundedFiles: function(req, res, next) {

    //check if logged in
    if(typeof req.session.token === 'undefined' || typeof req.session.token['access_token'] === 'undefined' ){
      console.log('not logged in');
      return res.json('Please log in');
    }

    var options ={
      host: 'api.elliemae.com',
      path: '/encompass/v1/loanPipeline?limit=100',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + req.session.token['access_token'],
        'Content-Type':'application/json'
      }
    };

    let body = {
      "filter": {
        "operator": "or",
        "terms": [
          {
            "value":"2017-10-24",
            "canonicalName":"Fields.Log.MS.Date.Funding",
            "matchType":"equals",
            "precision":"day"
          } ]
      },
      "fields": [
        "Fields.VEND.X263", //investor name
        "Fields.352", //investor #
        "Fields.364", //loan number
        "Loan.BorrowerName",
        "Loan.LoanAmount",
        "Fields.3", //loan rate
        "Fields.4", //loan term
        "Fields.362", //loan processor
        "Fields.317" //loan officer
      ]
    }

    var data = "";

    var httpsReq = https.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        //console.log('BODY: ' + chunk);
        data += chunk;
      });
      response.on('end', function(){
        //console.log("response: " + data);
        //return res.json(JSON.parse(data));
        //return res.render('reports/fundedFiles', {data: JSON.parse(data) } );
        return res.render('reports/tableReport', {
          title: "Funded Files",
          header: ["Inestor", "Investor Number", "Loan Number", "Borrower Name", "Loan Amount", "Interest Rate", "Loan Term", "Processor", "Loan Officer"],
          rows: parseData(JSON.parse(data), body['fields'])
        } );
      });
    });
    httpsReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    httpsReq.write(JSON.stringify(body));
    httpsReq.end();

    function parseData(data, fields){
      let outputArray = [];
      data.forEach(function(row){
        row = row.fields;
        let rowArray = [
          row["Fields.VEND.X263"], //investor name
          row["Fields.352"], //investor #
          row["Fields.364"], //loan number
          row["Loan.BorrowerName"],
          numeral(row["Loan.LoanAmount"]).format('$0,0'),
          numeral(row["Fields.3"]).format('0.000'), //loan rate
          numeral(row["Fields.4"]).format('000'), //loan term
          row["Fields.362"], //loan processor
          row["Fields.317"]
        ];
        // fields.forEach(function(col){
        //   rowArray.push(row[col]);
        // });
        outputArray.push(rowArray);
      });
      //console.log(outputArray);
      return outputArray;

    }

  },

}
