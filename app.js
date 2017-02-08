/**
 * Module dependencies.
 */
 var request = require('request-promise');
 var sentiment = require('sentiment');
 var twitter = require('ntwitter');
 var Promise = require('bluebird');
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

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
var tweeter = new twitter({
    consumer_key: '1toV6tPYZZfdER17iLlgCeKkS',
    consumer_secret: 'YrqDP671zFMv3J5qvOAlgsOxEG8S3H6mWNxStPnk8K13GyfVD7',
    access_token_key: '540555484-1UzFM7FtLwrkIWVkMFSGHBaGtliwhfT3rU1997M3',
    access_token_secret: 'vbCk74LbFVqT06qWmEFtfUJyMwcF6SRBQ3Erl71C54nrZ'
});

app.get('/',
    function (req, res) {
           res.send('public/index.html');
  });
  app.get('/monitor', function (req, res) {
      beginMonitoring(req.query.phrase);
      res.redirect(302, '/findTweets');
  });

  app.get('/reset', function (req, res) {
      resetMonitoring();
      res.redirect(302, '/findTweets');
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
  app.get('/api/getAvgPress', function (req, res) {
    var id = '54f03d18ea8fac388be6bd624ad9f9c1';
    var options = {
      method: 'GET',
      uri: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
      + '/fleeter_avg/' + id
     }
     request(options)
         .then(function(response) {
           res.send(JSON.parse(response));
         }).catch(function(err) {
             console.log("check log for error");
         });
  });
  app.get('/api/getAvgTemp', function (req, res) {
    var id = 'd85d559d97d13cf381d690526a0ee412';
    var options = {
      method: 'GET',
      uri: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
      + '/fleeter_avg/' + id
     }
     request(options)
         .then(function(response) {
           res.send(JSON.parse(response));
         }).catch(function(err) {
             console.log("check log for error");
         });
  });
  app.get('/api/getAvgHrlyPrec', function (req, res) {
    var id = '8c4b86e3b066c8e740b38f2d81f92aaa';
    var options = {
      method: 'GET',
      uri: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
      + '/fleeter_avg/' + id
     }
     request(options)
         .then(function(response) {
           res.send(JSON.parse(response));
         }).catch(function(err) {
             console.log("check log for error");
         });
  });
  app.get('/api/getAvgwspd', function (req, res) {
    var id = '6c345dbb535a62b78fa37ccad5964a0c';
    var options = {
      method: 'GET',
      uri: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com'
      + '/fleeter_avg/' + id
     }
     request(options)
         .then(function(response) {
           res.send(JSON.parse(response));
         }).catch(function(err) {
             console.log("check log for error");
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


   function insertToDb(db, result1, geo, path) {
       var weather = "";
       var url = 'https://8e25b93f-ff96-495b-a1fe-8ed6e2f5f054:0PQs084IUd@twcservice.mybluemix.net:443' + path
       const options = {
           method: 'GET',
           uri: url
       }
       request(options)
           .then(function(response) {
             db.insert({
                 TweetScore: result1.score,
                 heat_index: JSON.parse(response).observation.heat_index,
                 wspd: JSON.parse(response).observation.wspd,
                 feels_like: JSON.parse(response).observation.feels_like,
                 precip_hrly:JSON.parse(response).observation.precip_hrly,
                 pressure: JSON.parse(response).observation.pressure,
                 temp: JSON.parse(response).observation.temp,
                 wx_phrase: JSON.parse(response).observation.wx_phrase,
                 clds: JSON.parse(response).observation.clds,
                 wdir_cardinal: JSON.parse(response).observation.wdir_cardinal
             }, 69, function(err, doc) {
                 if (err) {
                     console.log(err);
                 } else
                     console.log("successfullly stored document")
             });
           })
           .catch(function(err) {
               console.log(err);
           })

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
                              //console.log(data.geo);
                              if (data.geo != null){
                                var path = '/api/weather/v1/geocode/'
                                + data.geo.coordinates[0].toString()
                                + '/'
                                + data.geo.coordinates[1].toString()
                                + '/observations.json?units=m&language=en-US';
                                insertToDb(db,result,data.geo, path);

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

   app.get('/findTweets',
       function (req, res) {
           var welcomeResponse = "<HEAD>" +
               "<title>Twitter Sentiment Analysis</title>\n" +
               "</HEAD>\n" +
               "<BODY>\n" +
               "<P>\n" +
               "Welcome to the Twitter Sentiment Analysis app.<br>\n" +
               "press go to start monitoring Tweets based on weather!\n" +
               "</P>\n" +
               "<FORM action=\"/monitor\" method=\"get\">\n" +
               "<P>\n" +
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






http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
