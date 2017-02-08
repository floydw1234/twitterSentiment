var myApp = angular.module('myApp', []);
myApp.controller('myCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: 'https://0e02ede9-86ba-497d-b352-8217aec97af2-bluemix:34e3a2252a0d72dcd419543f27bf939f94f3fce2a6c7257f918153a853626a79@0e02ede9-86ba-497d-b352-8217aec97af2-bluemix.cloudant.com/fleeter_avg/f45a219e1a7b548ed9ce7e21e261cf0a'
    }).then(function successCallback(response) {

        FusionCharts.ready(function() {

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
                        "xAxisName": "Tweet Sentiment Score ",
                        "yAxisName": "Pressure(kPA) ",
                        "theme": "fint"
                    },
                    "data": [{
                            "label": "less than -2 sentiment (very negative)",
                            "value": 5 //response.avgPressln5
                        },
                        {
                            "label": "-2 to 0 sentiment (negative)",
                            "value": 6 //response.avgPressb50
                        },
                        {
                            "label": " 0 sentiment (neutral)",
                            "value": 6 //response.avgPress0
                        },
                        {
                            "label": "0 to 2 sentiment (fairly positive)",
                            "value": 3 //response.avgpressb05
                        },
                        {
                            "label": "greater than 2 sentiment (exptremely positive)",
                            "value": 2 //response.avgpressg5
                        }
                    ]
                }
            });

            revenueChart.render();
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    })
});
