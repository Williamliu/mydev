<html>
<head>
<script src="https://code.angularjs.org/1.6.0/angular.js"></script>
<script src="https://code.angularjs.org/1.6.0/angular-route.js"></script>

<script>
    angular.module("MYProvider", ["LWHTable"])
    /*
    .config(function($provide){
        $provide.provider(
            "SQL", function(myservice){
                        this.$get = new function(){
                            this.connect = "SQL Connection: " + myservice.count;
                            this.call = function() {myservice.show()};
                        }()
                    }
             );
    })
    */
    .provider("SQL", 
        function(){
            this.$get = new function(){
                    this.connect = "SQL Connection: " + 100;
                    this.call = function() { alert( this.connect); };
            }();
        }
    );

    var myfunc = function() {
        this.count = 0;
        this.count++;
        console.log("myfunc init count: " + this.count);
    }
    myfunc.prototype = {
        show: function() {
            this.count++;
            alert("myfunc count: " + this.count);
        },
        hello: function() {
            this.count++;
            alert("myfunc hello count: "+ this.count);
        }
    };

    angular.module("LWHTable", [])
    .value("UU", 1001)
    .constant("Rate", 6.6)
    .directive("mytext", function (myservice) {
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
    })
    .config( function($provide){
        $provide.service("myservice", function(){
            this.count = 0;
            this.show = function() {
                this.count++;
                console.log("config myservice count: " + this.count);
            }
        });

        $provide.factory("myfact", function(){
            var fact = new myfunc();
            fact.count += 300;
            return fact;
        });
    });

    angular.module("LWHPhone",["LWHTable"])
    .factory("hisFact", function(myservice){
        return { 
                    count: myservice.count++,
                    getCount: function() {
                        return ++myservice.count;
                    }
               };
    });
</script>
<script>
    var app = angular.module("myApp", ["LWHTable", "ngRoute", "LWHPhone", "MYProvider"]);
    app.config( function($provide, Rate){
        //UU = 2002;
        MYPPProvider.a = "good morning!";
        //MYPPProvider.setA("GOOD HELLO WORLD!");
        $provide.value("UU", 4999);
        //$provide.constant("Rate", 5.2);
        $provide.value("PI", Rate * 10);

        $provide.decorator("myservice", function($delegate){
            console.log("decorator:");
            console.log($delegate);
            $delegate.count = 50000;
            $delegate.show  = function() {
                this.count +=1000;
                console.log("delete count: " + this.count);
            }
            
            $delegate.age = 30;
            $delegate.saygood = function() {
                this.age += 5;
                alert("decorator say good age:" + this.age);
            }
            
            return $delegate;
        });
        console.log("config done");
    });
    app.provider("MYPP", function(){
        console.log("Provider MYPPP START");
        this.a = '';
        
        var func = function(){};
        this.setA = function( value ) {
            a = value;
        }
        this.$get = function() {
            console.log("Provider MYPPP GET");
            return {
                aa: this.a,
                ff: function() { alert("mypp: " + this.aa); }
            };
            /*
            return {
                aa : "You are good",
                ff: function(){ alert("MYPP :" + this.aa);}
            }
            */

        }
    });

    app.decorator("TAX", function($delegate){
        $delegate.money = 60000;
        $delegate.good = 90000;
        return $delegate;
    });
    app.value("TAX", {money: 5.20, good:900});

    app.controller("ct11", function ($scope, myservice,  myfact, hisFact, scalar, SQL, MYPP, PI, UU, TAX) {
        console.log("controller ctr1");
        PI += 20000;
        console.log(MYPP);
        myservice.saygood = function( ) {
            console.log("Say Good");
        }
        
        $scope.serviceme1 = function() {
            alert(SQL.connect);
            SQL.call();
        }

        $scope.serviceCount1 = function() {
            return myservice.count;
        }

        $scope.factme1 = function() {
            myfact.hello();
        }
        $scope.factCount1 = function() {
            return TAX;
        }

        $scope.phoneme1 = function() {
            alert(hisFact.getCount());
        }

        $scope.getPI = function() {
            return PI;
        }
        $scope.setPI = function() {
            PI += 2;
        }
    });
   
    app.controller("ct22", function($scope, myservice, myfact, PI, UU) {

        UU = 3000;
        $scope.serviceme2 = function() {
            myservice.saygood();
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

        $scope.setPI2 = function() {
            PI += 100;
        }
        $scope.getPI2 = function() {
            return PI;
        }

    });
</script>
</head>
<body ng-app="myApp">
<div ng-controller="ct11">
    Controller 11: 
    <button ng-click="serviceme1()">Service Show</button> 
    <button ng-click="factme1()">Factory Show</button>
    <button ng-click="setPI()">Set PI</button>
    <br>
    Service Count: {{ serviceCount1() }}
    <br>
    Factory Count: {{ factCount1() }}
    <br>
    Directive Count: <mytext></mytext>
    <br>
    PI:  {{getPI()}}
</div>
<br>
<div ng-controller="ct22">
    Controller 22: 
    <button ng-click="serviceme2()">Service Show</button>
    <button ng-click="factme2()">Factory Show</button>
    <button ng-click="setPI2()">Set PI</button>
    <br>
    Count: {{ serviceCount2() }}
    <br>
    Factory Count: {{ factCount2() }}
    <br>
    Directive Count: <mytext></mytext>
    <BR>
    PI: {{ getPI2() }}
</div>
</body>
</html>