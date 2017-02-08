function PromiseCtrl($scope, $http) {
    $scope.example1 = $http.get('/echo/json');

    $http.get('/echo/json').then(function(value) {
        $scope.example2 = value.status;
    });

    $http.get('/echo/json/error').then(null, function(value) {
        $scope.example3 = value.status;
    });

    $http.get('/echo/json').success(function(data, status, headers, config) {
        $scope.example4 = status;
    });

    $http.get('/echo/json/error').error(function(data, status, headers, config) {
        $scope.example5 = status;
    });

    $http.get('/echo/json/error').catch(function(value) {
        $scope.example6 = value.status;
    });

    $http.get('/echo/json').then(function(value) {
        $scope.example7 = value.status;
    }).finally(function() {
        $scope.example7 += " (Finally called)";
    });

    $http.get('/echo/json/error').then(null, function(value) {
        $scope.example8 = value.status;
    }).finally(function() {
        $scope.example8 += " (Finally called)";
    });
}
