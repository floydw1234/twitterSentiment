<!DOCTYPE html>

<html>
<head>

<!-- testing   the def of style shall be included in head -->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<style type="text/css">

body {
     /*   background:radial-gradient(circle, #4DFFFF, #005757) ;  */
	background-image: url(./"test_background.jpg");
	background-repeat: no-repeat;
    	background-position: right top;
    	background-attachment: fixed;

      /*  background-color: #D3D3D3;   thats grey*/
     }

v1{
        text-align:center;
	text-indent:50;
	color : aqua;
	/* margin-right:30 px;*/
        }

</style>

<!-- testing-->

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

</head>


<body>


<style></style>
<center><h1>Welcome to the SmartMON ! </h1></center>
<center><h3>A Device Usage & Tracking System for Ed-Tech Admins</h3></center>
<v1><p><h3>Presented by Team Voltron</h3></p></v1>

<div id="pieChart_div1" style="width: 700px; height: 400px" ng-app="myApp" ng-controller="myCtrl">
</div>

<div id="avgChart_div1" style="width: 700px; height: 400px" ng-app="myApp" ng-controller="myCtrl">
</div>

<div id="avgChart_div2" style="width: 700px; height: 400px" ng-app="myApp" ng-controller="myCtrl">
</div>

<div id="avgChart_div3" style="width: 700px; height: 400px" ng-app="myApp" ng-controller="myCtrl">
</div>

<div id="avgChart_div4" style="width: 700px; height: 400px" ng-app="myApp" ng-controller="myCtrl">
</div>

<div id="avgChart_div5" style="width: 700px; height: 400px" ng-app="myApp" ng-controller="myCtrl">
</div>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript">
function makeAvgChart(database, name, units, id) {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var fullName;
		if (units == '') {
			fullName = name;
		}
		else {
			fullName = name + ' (' + units + ')';
		}

		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Hours Ago');
		data.addColumn('number', name);
		for (var i = 0; i < database.length; i++) {
			data.addRow(database[i]);
		}

		var options = {
			title: 'Average ' + fullName + ' by Hour',
			hAxis: { direction: -1,
				 ticks: [0,1,2,3,4,5,6,7,8,9,10,11],
				 title: 'Hours Ago' },
			vAxis: { title: fullName },
			legend: { position: 'none' }
		};

		var chart = new google.visualization.LineChart(document.getElementById(id));
		chart.draw(data, options);
	}
}

function makePieChart(database, id) {
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'On/Off');
		data.addColumn('number', "seconds");
		var labels = ["Time On", "Time Off"];
		for (var i = 0; i < database.length; i++) {
			data.addRow([labels[i], database[i]]);
		}

		var options = {};

		var chart = new google.visualization.PieChart(document.getElementById(id));
		chart.draw(data, options);
	}
}
</script>
<script>
var myApp = angular.module('myApp', []);
</script>
<script>
myApp.controller('myCtrl', function($scope, $http) {
	$scope.formData = {};
	$http.get('/api/averages')
	.then(function(response) {
		var avgCurrentSummationDelivered = [];
		var avgInstantaneousDemand = [];
		var avgRmsCurrent = [];
		var avgVoltage = [];
		var avgPowerFactor = [];
		for (var i = 0; i < 12; i++) {
			avgCurrentSummationDelivered[i] = [response.data[i].hoursAgo, response.data[i].currentSummationDelivered];
			avgInstantaneousDemand[i] = [response.data[i].hoursAgo, response.data[i].instantaneousDemand];
			avgRmsCurrent[i] = [response.data[i].hoursAgo, response.data[i].rmsCurrent];
			avgVoltage[i] = [response.data[i].hoursAgo, response.data[i].voltage];
			avgPowerFactor[i] = [response.data[i].hoursAgo, response.data[i].powerFactor];
		}

		makeAvgChart(avgCurrentSummationDelivered, 'CurrentSummationDelivered', 'kWh', 'avgChart_div1');
		makeAvgChart(avgInstantaneousDemand, 'InstantaneousDemand', 'W', 'avgChart_div2');
		makeAvgChart(avgRmsCurrent, 'RmsCurrent', 'A', 'avgChart_div3');
		makeAvgChart(avgVoltage, 'Voltage', 'V', 'avgChart_div4');
		makeAvgChart(avgPowerFactor, 'PowerFactor', '', 'avgChart_div5');
	});
	$http.get('/api/totalTime')
	.then(function(response) {
		var timeOnOff = [];
		timeOnOff[0] = response.data[0].timeOn;
		timeOnOff[1] = response.data[0].timeOff;

		makePieChart(timeOnOff, "pieChart_div1");
	});
});
</script>

</body>
</html>
