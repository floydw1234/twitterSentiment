var request = require('request-promise');
var express = require("express");
var sentiment = require('sentiment');
var twitter = require('ntwitter');
var sleep = require('system-sleep');
var Promise = require('bluebird');

 var db;
  var cloudant;
  var data = [];

 var dbCredentials = {
     dbName: 'fleeter'
 };
 dbCredentials.url = "https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com";
 db = cloudant.use(dbCredentials.dbName);
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
