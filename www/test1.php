<!DOCTYPE html>
<html>
<head>

<script src="https://code.angularjs.org/1.6.0/angular.js" type="text/javascript"></script>
<script src="https://code.angularjs.org/1.6.0/angular-route.js"></script>

<script>
    var app = angular.module("myApp", ["ngRoute"]);
    
    app.config(function($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.when("/a", {
            templateUrl: 'a.html',
            controller: 'aController'
        })
        .when("/b", {
            template: '<span>BBB Path: {{bval}}</span>',
            controller: 'bController'
        })
        .otherwise('');
    });
    
    app.controller("aController", function($scope, $location){
        $scope.aval = " APath: " + $location.path();
        console.log($location.search());
        $scope.def = " defPath: " + $location.path();
    });
    app.controller("bController", function($scope, $location){
        $scope.bval = " BPath: " + $location.path();
    });
</script>
</head>
<body ng-app="myApp">
<br>
<ul>
    <li><a href="#/a">Go to A page</a></li>
    <li><a href="#/b">Go to B page</a></li>
</ul>

Path: {{ aval }} - {{ def }} 
<br>
<div ng-view></div>

</body>
</html>