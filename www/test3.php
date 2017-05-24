<html>
<head>
<script src="https://code.angularjs.org/1.6.0/angular.js"></script>
<script src="https://code.angularjs.org/1.6.0/angular-route.js"></script>

<script> 
    angular.module("MYWAY", [])
    .value("PORT", 2000)
    .service("EXECUTE", function(){ this.batch = "SQLBatch"; });

    angular.module("MYProvider", ["MYWAY"])
    .constant("CONSTR", "192.168.1.200")
    .config( function($provide, CONSTR){
        $provide.provider("SQL", function(){
            var title = CONSTR;
            this.set = function(tt) {
                title += ":" + tt;
            }
            this.$get = function($http, PORT, EXECUTE){
                    return new function(a) {
                        this.connect = "SQL Connection: " + PORT  + " => " + EXECUTE.batch + " -> " + a,
                        this.call = function() { alert( this.connect ) }
                    }(title);
            } 
        })
    });
    /*
    .provider("SQL", 
                    function(CONSTR){
                        var title = CONSTR;
                        this.set = function(tt) {
                            title += ":" + tt;
                        }
                        this.$get = function($http, PORT, EXECUTE){
                                return new function(a) {
                                    this.connect = "SQL Connection: " + PORT  + " => " + EXECUTE.batch + " -> " + a,
                                    this.call = function() { alert( this.connect ) }
                                }(title);
                        } 
                    }
    );
    */
</script>
<script>
    var app = angular.module("myApp", ["ngRoute", "MYProvider"]);
    app.config( function($provide, SQLProvider){
        /*
        $provide.decorator("SQL", function($delegate){
            $delegate = 8000;
            return $delegate;
        });
        */
        SQLProvider.set("Change to Config");
        console.log("App Config Init");
        console.log( SQLProvider );
    });
    app.decorator("SQL", function($delegate){
        $delegate = {  
                        call : function() { alert("Overwrite"); }   
                    }
        return $delegate;
    });

    app.controller("ct11", function ($scope, SQL) {
        console.log("Controller init");
        console.log(SQL);
        $scope.call1 = function() {
            SQL.call();
            //var tt = new SQL(" from HELLO");
            //tt.call();
            //SQL.call();
            //SQL.call();
        }
        
    });
   
    app.controller("ct22", function($scope, SQL) {
        
        $scope.call2 = function() {
            SQL.call();
        }
        
    });
</script>
</head>
<body ng-app="myApp">
<div ng-controller="ct11">
    Controller 11: 
    <button ng-click="call1()">Service Show</button> 
    <br>
    Service Count: {{ serviceCount1() }}
    <BR>
</div>
<br>
<div ng-controller="ct22">
    Controller 22: 
    <button ng-click="call2()">Service Show</button>
    <br>
    Count: {{ serviceCount2() }}
    <br>
</div>
</body>
</html>