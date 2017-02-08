FusionCharts.ready(function(){


/*
var output = []
  $http({
    method: 'GET',
    url: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com/fleeter/_all_docs'
  }).then(function successCallback(response) {
      response.forEach(function(thing){
        $http({
                method: 'GET',
                url: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com/fleeter/'
                + 'thing.id'
              }).then(function successCallback(response) {
                  output.push({JSON.parse(response).TweetScore , })
                }, function errorCallback(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });

      });
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
*/
 var revenueChart = new FusionCharts({
   "type": "column3d",
   "renderAt": "chartContainerPressure",
   "width": "1000",
   "height": "500",
   "dataFormat": "json",
   "dataSource": {
     "chart": {
         "caption": "Tweet Sentiment vs Air Pressure",
         "subCaption": "IBM Bluemix Demo",
         "xAxisName": "Tweet Sentiment ",
         "yAxisName": "Pressure(kPA) ",
         "theme": "fint"
      },
      "data": [
          {
             "label": "less than -8 (very negative)",
             "value": "100"
          },
          {
             "label": "-8 to -0 (negative)",
             "value": "213"
          },
          {
             "label": " 0 (neutral)",
             "value": "58"
          },
          {
             "label": "0 to 8 (fairly positive)",
             "value": "55"
          },
          {
             "label": "greater than 8(exptremely positive)",
             "value": "90"
          }
       ]
    }
 });

 revenueChart.render();
 })
