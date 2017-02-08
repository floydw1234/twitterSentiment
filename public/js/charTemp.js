FusionCharts.ready(function(){
 var revenueChart = new FusionCharts({
   "type": "column3d",
   "renderAt": "chartContainerTemp",
   "width": "1000",
   "height": "500",
   "dataFormat": "json",
   "dataSource": {
     "chart": {
         "caption": "Tweet Sentiment vs Temperature",
         "subCaption": "IMB Bluemix Demo",
         "xAxisName": "Tweet Sentiment",
         "yAxisName": "Temperature(Celcius)",
         "theme": "fint"
      },
     "data": [
         {
            "label": "Jan",
            "value": "4200"
         },
         {
            "label": "Feb",
            "value": "810000"
         },
         {
            "label": "Mar",
            "value": "720000"
         },
         {
            "label": "Apr",
            "value": "550000"
         },
         {
            "label": "May",
            "value": "910000"
         },
         {
            "label": "Jun",
            "value": "510000"
         },
         {
            "label": "Jul",
            "value": "680000"
         },
         {
            "label": "Aug",
            "value": "620000"
         },
         {
            "label": "Sep",
            "value": "610000"
         },
         {
            "label": "Oct",
            "value": "490000"
         },
         {
            "label": "Nov",
            "value": "900000"
         },
         {
            "label": "Dec",
            "value": "730000"
         }
      ]
   }
});

revenueChart.render();
})
