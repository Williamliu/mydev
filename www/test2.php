<html>
<head>
<script src="https://code.angularjs.org/1.6.0/angular.js"></script>
<script src="https://code.angularjs.org/1.6.0/angular-route.js"></script>

<script>
    var myfunc = function() {
        this.count = 0;
        console.log("myfunc init count: " + this.count);
    }
    myfunc.prototype = {
        show: function() {
            this.count++;
            alert("myfunc count: " + this.count);
        }
    };

    angular.module("LWHTable", [])
    .service("myservice", function(){
        this.count = 0;
        this.show = function() {
            this.count++;
            alert("Service Count: " + this.count);
        }
        console.log("myservice init count: " + this.count);
        return this;
    }).factory("myfact", function(myservice){
        var fact = {};
        fact.count = 0;
    
        fact.hello = function() {
            this.count++;
            myservice.count++;
            alert("Factory Count: " + this.count + " Service Count:" + myservice.count);
        }
        myservice.count++;
        console.log("myfact init count: " + myservice.count);
        return fact;
    }).directive("mytext", function (myservice) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                },
                template: [
                            '<span>Count = {{getCount()}}</span>'
                        ].join(''),
                controller: function ($scope, myservice) {
                    myservice.count++;
                    console.log("directive controller count: " + myservice.count);
                    $scope.getCount = function() {
                        return myservice.count;
                    }
                },
                link: function (sc, el, attr) {
                }
            }        
    })
    .service("scalar", function() {
        return 5000;
    });

    angular.module("LWHPhone",["LWHTable"])
    .factory("hisFact", function(myservice){
        return new Date();
    });
</script>
<script>
    var app = angular.module("myApp", ["LWHTable", "ngRoute", "LWHPhone"]);
    
    app.controller("ct11", function ($scope, myservice, myfact, hisFact, scalar) {
        $scope.serviceme1 = function() {
            myservice.show();
        }

        $scope.serviceCount1 = function() {
            return myservice.count;
        }

        $scope.factme1 = function() {
            myfact.hello();
        }
        $scope.factCount1 = function() {
            return myfact.count;
        }

        $scope.phoneme1 = function() {
            alert("his:" + scalar);
            console.log(scalar);
        }
    });
   
    app.controller("ct22", function($scope, myservice, myfact) {
        $scope.serviceme2 = function() {
            myservice.show();
        }

        $scope.serviceCount2 = function() {
            return myservice.count;
        }

        $scope.factme2 = function() {
            myfact.hello();
        }
        $scope.factCount2 = function() {
            return myfact.count;
        }
    });
</script>
</head>
<body ng-app="myApp">
<div ng-controller="ct11">
    Controller 11: 
    <button ng-click="serviceme1()">Service Show</button> 
    <button ng-click="factme1()">Factory Show</button>
    <button ng-click="phoneme1()">Phone Show</button>
    <br>
    Service Count: {{ serviceCount1() }}
    <br>
    Factory Count: {{ factCount1() }}
    <br>
    Directive Count: <mytext></mytext>
</div>
<br>
<div ng-controller="ct22">
    Controller 22: 
    <button ng-click="serviceme2()">Service Show</button>
    <button ng-click="factme2()">Factory Show</button>
    <br>
    Count: {{ serviceCount2() }}
    <br>
    Factory Count: {{ factCount2() }}
    <br>
    Directive Count: <mytext></mytext>
</div>
</body>
</html>