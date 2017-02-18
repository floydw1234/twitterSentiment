
var myApp = angular.module('myApp', []);
myApp.controller('pressContr', function($scope, $http) {

  var optionsPress =     {
          "caption": "Tweet Sentiment vs Avg Air Pressure",
          "subCaption": "IBM Bluemix Demo",
          "xAxisName": "Tweet Sentiment Score ",
          "yAxisName": "Avg Pressure(kPA) ",
          "theme": "fint"
      };
      var optionsTemp ={
          "caption": "Tweet Sentiment vs Avg Temperature",
          "subCaption": "IMB Bluemix Demo",
          "xAxisName": "Tweet Sentiment",
          "yAxisName": "Avg Temperature(Celcius)",
          "theme": "fint"
       };
       var optionsWspd= {
           "caption": "Tweet's Sentiment vs Avg Wind Speed",
           "subCaption": "IBM Bluemix Demo",
           "xAxisName": "Tweet Sentiment",
           "yAxisName": "Avg WindSpeed(km/hour)",
           "theme": "fint"
        };
        var optionsHourly_Prec =  {
            "caption": "Tweet Sentiment vs Avg Hourly Precipitation",
            "subCaption": "IBM Bluemix Demo",
            "xAxisName": "Tweet Sentiment",
            "yAxisName": "Avg Hourly Precipitation(inches/hr)",
            "theme": "fint"
         };



//'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com/fleeter_avg/d6a56cca6876bcb3883ac81ef3324afb'
  //makeCharts("das", options, "chartContainerPressure");
  //url3 = "http://www.w3schools.com/angular/customers.php";
  //url2 = 'http://localhost:3000/twitterCheck';
  //url = "https://0e02ede9-86ba-497d-b352-8217aec97af2.cloudant.com/fleeter/_all_docs";
  $http.get('/api/getAvgPress')
    .then(function successCallback(response) {
        $scope.response = response;
        $scope.parJson = function (json) {
            return angular.fromJson(json);
        }
        makeCharts($scope.response, optionsPress,"chartContainerPressure");

    }, function errorCallback(response) {
        $scope.error = response;
    });
    $http.get('/api/getAvgTemp')
      .then(function successCallback(response) {
          $scope.response = response;
          $scope.parJson = function (json) {
              return angular.fromJson(json);
          }
          makeCharts($scope.response, optionsTemp,"chartContainerTemp");

      }, function errorCallback(response) {
          $scope.error = response;
      });
      $http.get('/api/getAvgHrlyPrec')
        .then(function successCallback(response) {
            $scope.response = response;
            $scope.parJson = function (json) {
                return angular.fromJson(json);
            }
            makeCharts($scope.response, optionsHourly_Prec,"chartContainerHourly_prec");

        }, function errorCallback(response) {
            $scope.error = response;
        });
        $http.get('/api/getAvgwspd')
          .then(function successCallback(response) {
              $scope.response = response;
              $scope.parJson = function (json) {
                  return angular.fromJson(json);
              }
              makeCharts($scope.response, optionsWspd,"chartContainerWspd");

          }, function errorCallback(response) {
              $scope.error = response;
          });

});
