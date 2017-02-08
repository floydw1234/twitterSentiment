function makeCharts(response,options, renderAt){
        FusionCharts.ready(function() {

            var revenueChart = new FusionCharts({
                "type": "column3d",
                "renderAt": renderAt,
                "width": "1000",
                "height": "500",
                "dataFormat": "json",
                "dataSource": {
                    "chart": options,
                    "data": [{
                            "label": "less than -2 sentiment (very negative)",
                            "value": response.data.ln5
                        },
                        {
                            "label": "-2 to 0 sentiment (negative)",
                            "value": response.data.b50
                        },
                        {
                            "label": " 0 sentiment (neutral)",
                            "value": response.data.e0
                        },
                        {
                            "label": "0 to 2 sentiment (fairly positive)",
                            "value": response.data.b05
                        },
                        {
                            "label": "greater than 2 sentiment (exptremely positive)",
                            "value": response.data.g5
                        }
                    ]
                }
            });
            revenueChart.render();

        })
    }

    /*
    {
        "caption": "Tweet Sentiment vs Air Pressure",
        "subCaption": "IBM Bluemix Demo",
        "xAxisName": "Tweet Sentiment Score ",
        "yAxisName": "Pressure(kPA) ",
        "theme": "fint"
    }
    */
