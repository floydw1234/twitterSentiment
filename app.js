/**
 * Module dependencies.
 */
 /*jslint node:true*/
 var port = (3000);
 var request = require('request');
 var express = require("express");
 var sentiment = require('sentiment');
 var twitter = require('ntwitter');
 var http = require('http'),
    path = require('path'),
    fs = require('fs');

 // make Stream globally visible so we can clean up better
 var stream;
var db;
 var cloudant;

var dbCredentials = {
    dbName: 'fleeter'
};

 var DEFAULT_TOPIC = "Type nothing";

 // defensiveness against errors parsing request bodies...
 process.on('uncaughtException', function (err) {
     console.error('Caught exception: ' + err.stack);
 });
 process.on("exit", function(code) {
     console.log("exiting with code: " + code);
 });

 var app = express();
 // Configure the app web container
 app.configure(function() {
 	app.use(express.bodyParser());
     app.use(express.static(__dirname + '/public'));
 });


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


 // Sample keys for demo and article - you must get your own keys if you clone this application!
 // Create your own app at: https://dev.twitter.com/apps
 // See instructions HERE:  https://hub.jazz.net/project/srich/Sentiment%20Analysis%20App/overview
 // Look for "To get your own Twitter Application Keys" in the readme.md document
 var tweeter = new twitter({
     consumer_key: '1toV6tPYZZfdER17iLlgCeKkS',
     consumer_secret: 'YrqDP671zFMv3J5qvOAlgsOxEG8S3H6mWNxStPnk8K13GyfVD7',
     access_token_key: '540555484-1UzFM7FtLwrkIWVkMFSGHBaGtliwhfT3rU1997M3',
     access_token_secret: 'vbCk74LbFVqT06qWmEFtfUJyMwcF6SRBQ3Erl71C54nrZ'
 });

 app.get('/twitterCheck', function (req, res) {
     tweeter.verifyCredentials(function (error, data) {
         res.send("Hello, " + data.name + ".  I am in your twitters.");
     });
 });

 var tweetCount = 0;
 var tweetTotalSentiment = 0;
 var monitoringPhrase;

 app.get('/sentiment', function (req, res) {
     res.json({monitoring: (monitoringPhrase != null),
     	monitoringPhrase: monitoringPhrase,
     	tweetCount: tweetCount,
     	tweetTotalSentiment: tweetTotalSentiment,
     	sentimentImageURL: sentimentImage()});
 });

 app.post('/sentiment', function (req, res) {
 	try {
 		if (req.body.phrase) {
 	    	beginMonitoring(req.body.phrase);
 			res.send(200);
 		} else {
 			res.status(400).send('Invalid request: send {"phrase": "bieber"}');
 		}
 	} catch (exception) {
 		res.status(400).send('Invalid request: send {"phrase": "bieber"}');
 	}
 });

 function resetMonitoring() {
 	if (stream) {
 		var tempStream = stream;
 	    stream = null;  // signal to event handlers to ignore end/destroy
 		tempStream.destroySilent();
 	}
     monitoringPhrase = "";
 }

 function weatherAPI(path, qs, done) {
    var url = 'https://8e25b93f-ff96-495b-a1fe-8ed6e2f5f054:0PQs084IUd@twcservice.mybluemix.net' + path;
    console.log(url, qs);
    request({
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        },
        qs: qs
    }, function(err, req, data) {
        if (err) {
            done(err);
        } else {
            if (req.statusCode >= 200 && req.statusCode < 400) {
                try {
                    done(null, JSON.parse(data));
                } catch(e) {
                    console.log(e);
                    done(e);
                }
            } else {
                console.log(err);
                done({ message: req.statusCode, data: data });
            }
        }
    });
}

app.get('/api/observations', function(req, res) {
    var geocode = (req.query.geocode || "45.43,-75.68").split(",");
    weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/observatoins.json", {
        units: req.query.units || "m",
        language: req.query.language || "en"
    }, function(err, result) {
        if (err) {
        	console.log(err);
            res.send(err).status(400);
        } else {
        	console.log("current conditions");
            res.json(result);
        }
    });
});
function insertToDb(db, result1, geo) {
             db.insert({
                 weather: geo,
                 score: result1.score
             }, 69, function(err, doc) {
                 if (err) {
                     console.log(err);
                 } else
                     console.log("successfullly stored document")
             });



}
 function beginMonitoring(phrase) {
     // cleanup if we're re-setting the monitoring
     if (monitoringPhrase) {
         resetMonitoring();
     }
     tweeter.verifyCredentials(function (error, data) {
         if (error) {
         	resetMonitoring();
             console.error("Error connecting to Twitter: " + error);
             if (error.statusCode === 401)  {
 	            console.error("Authorization failure.  Check your API keys.");
             }
         } else {
           //-X POST -d 'locations=-123.044,36.846,-121.591,38.352'\

             tweeter.stream('statuses/sample', {
                 'track': ""
             }, function (inStream) {
             	// remember the stream so we can destroy it when we create a new one.
             	// if we leak streams, we end up hitting the Twitter API limit.
             	stream = inStream;
                 console.log("Monitoring Twitter for tweets with Cooridinates");
                 stream.on('data', function (data) {
                     // only evaluate the sentiment of English-language tweets
                     if (data.lang === 'en') {
                          setTimeout(function(){sentiment(data.text, function (err, result) {
                            if (data.geo != null){
                              var path = '/api/weather/v1/geocode/'
                              + data.geo.coordinates[0].toString()
                              + '/'
                              + data.geo.coordinates[1].toString()
                              + '/observations.json?units=m&language=en-US';
                              insertToDb(db,result,data.geo);
                            }

                         })
                       }
                         ,500);
                     }
                 });
                 stream.on('error', function (error, code) {
 	                console.error("Error received from tweet stream: " + code);
 		            if (code === 420)  {
 	    		        console.error("API limit hit, are you using your own keys?");
             		}
 	                resetMonitoring();
                 });
 				stream.on('end', function (response) {
 					if (stream) { // if we're not in the middle of a reset already
 					    // Handle a disconnection
 		                console.error("Stream ended unexpectedly, resetting monitoring.");
 		                resetMonitoring();
 	                }
 				});
 				stream.on('destroy', function (response) {
 				    // Handle a 'silent' disconnection from Twitter, no end/error event fired
 	                console.error("Stream destroyed unexpectedly, resetting monitoring.");
 	                resetMonitoring();
 				});
             });
             return stream;
         }
     });
 }

 function sentimentImage() {
     var avg = tweetTotalSentiment / tweetCount;
     if (avg > 0.5) { // happy
         return "/images/excited.jpg";
     }
     if (avg < -0.5) { // angry
         return "/images/angry.jpg";
     }
     // neutral
     return "/images/content.jpg";
 }

 app.get('/',
     function (req, res) {
         var welcomeResponse = "<HEAD>" +
             "<title>Twitter Sentiment Analysis</title>\n" +
             "</HEAD>\n" +
             "<BODY>\n" +
             "<P>\n" +
             "Welcome to the Twitter Sentiment Analysis app.<br>\n" +
             "What would you like to monitor?\n" +
             "</P>\n" +
             "<FORM action=\"/monitor\" method=\"get\">\n" +
             "<P>\n" +
             "<INPUT type=\"text\" name=\"phrase\" value=\"" + DEFAULT_TOPIC + "\"><br><br>\n" +
             "<INPUT type=\"submit\" value=\"Go\">\n" +
             "</P>\n" + "</FORM>\n" + "</BODY>";
         if (!monitoringPhrase) {
             res.send(welcomeResponse);
         } else {
             var monitoringResponse = "<HEAD>" +
                 "<META http-equiv=\"refresh\" content=\"5; URL=http://" +
                 req.headers.host +
                 "/\">\n" +
                 "<title>Twitter Sentiment Analysis</title>\n" +
                 "</HEAD>\n" +
                 "<BODY>\n" +
                 "<P>\n" +
                 "The Twittersphere is feeling<br>\n" +
                 "<IMG align=\"middle\" src=\"" + sentimentImage() + "\"/><br>\n" +
                 "about " + monitoringPhrase + ".<br><br>" +
                 "Analyzed " + tweetCount + " tweets...<br>" +
                 "</P>\n" +
                 "<A href=\"/reset\">Monitor another phrase</A>\n" +
                 "</BODY>";
             res.send(monitoringResponse);
         }
     });

 app.get('/testSentiment',
     function (req, res) {
         var response = "<HEAD>" +
             "<title>Twitter Sentiment Analysis</title>\n" +
             "</HEAD>\n" +
             "<BODY>\n" +
             "<P>\n" +
             "Welcome to the Twitter Sentiment Analysis app.  What phrase would you like to analzye?\n" +
             "</P>\n" +
             "<FORM action=\"/testSentiment\" method=\"get\">\n" +
             "<P>\n" +
             "Enter a phrase to evaluate: <INPUT type=\"text\" name=\"phrase\"><BR>\n" +
             "<INPUT type=\"submit\" value=\"Send\">\n" +
             "</P>\n" +
             "</FORM>\n" +
             "</BODY>";
         var phrase = req.query.phrase;
         if (!phrase) {
             res.send(response);
         } else {
             sentiment(phrase, function (err, result) {
                 response = 'sentiment(' + phrase + ') === ' + result.score;
                 res.send(response);
             });
         }
     });

 app.get('/monitor', function (req, res) {
     beginMonitoring(req.query.phrase);
     res.redirect(302, '/');
 });

 app.get('/reset', function (req, res) {
     resetMonitoring();
     res.redirect(302, '/');
 });

 app.get('/hello', function (req, res) {
     res.send("Hello world.");
 });

 app.get('/watchTwitter', function (req, res) {
     var stream;
     var testTweetCount = 0;
     var phrase = 'Trump';
     // var phrase = 'ice cream';
     tweeter.verifyCredentials(function (error, data) {
         if (error) {
             res.send("Error connecting to Twitter: " + error);
         }
         stream = tweeter.stream('statuses/filter', {
             'track': phrase
         }, function (stream) {
             res.send("Monitoring Twitter for \'" + phrase + "\'...  Logging Twitter traffic.");
             stream.on('data', function (data) {
                 testTweetCount++;
                 // Update the console every 50 analyzed tweets
                 if (testTweetCount % 50 === 0) {
                     console.log("Tweet #" + testTweetCount + ":  " + data.text);
                 }
             });
         });
     });
 });

 app.listen(port);
 console.log("Server listening on port " + port);
