var request = require('request-promise');
var express = require("express");
var sentiment = require('sentiment');
var twitter = require('ntwitter');
var sleep = require('system-sleep');
var Promise = require('bluebird');

var db;
 var cloudant;

var dbCredentials = {
    dbName: 'fleeter'
};

function initDBConnection() {
    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for (var vcapService in vcapServices) {
            if (vcapService.match(/cloudant/i)) {
                dbCredentials.url = vcapServices[vcapService][0].credentials.url;
            }
        }
    } else { //When running locally, the VCAP_SERVICES will not be set

        // When running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
        dbCredentials.url = "https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com";
    }

    cloudant = require('cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    db = cloudant.use(dbCredentials.dbName);
}


initDBConnection();

var optionList = [];
var part1 = function(){
    return new Promise(function(resolve, reject){

          db.list( function (err, data) {
            for(i=0 ; i < 50 ; i ++){
                var options = {
                  method: 'GET',
                  uri: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
                  + '/fleeter/' + data.rows[i].id
                }
                optionList.push(options);
              }
              resolve(optionList);
            });
  });
}
var part2 = function(options){
      return new Promise(function(resolve, reject){
          for(i = 0; i < 20 ; i ++){
                request(options[i])
                    .then(function(response) {
                      console.log(response)
                    })
                    .catch(function(err) {
                        console.log("waiting for db time limit");
                    })
                }
          resolve(options);
          });
}
var part3 = function(options){
      sleep(2000);
      return new Promise(function(resolve, reject){
          for(i = 20; i < 40 ; i ++){
                request(options[i])
                    .then(function(response) {
                      console.log(response)
                    })
                    .catch(function(err) {
                        console.log("waiting for db time limit");
                    })
                }
          });
}
part1().then(function(data){
    console.log(data);
    part2(data).then(function(data){
    part3(data);
});
});



/*

var url = 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com';
const options = {
    method: 'GET',
    uri: url
}
request(options)
    .then(function(response) {
      console.log(response)
    })
    .catch(function(err) {
        console.log(err);
    })

*/
