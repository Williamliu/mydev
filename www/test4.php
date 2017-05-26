<html>
<head>
<script type="text/javascript" src="jquery/min/jquery-3.1.1.min.js"></script>
<script src="https://code.angularjs.org/1.6.0/angular.js"></script>
<script src="https://code.angularjs.org/1.6.0/angular-route.js"></script>

<script> 
    angular.module("MYRoute", ["ngRoute"])
    .config(function($routeProvider, $provide, $locationProvider){
        $provide.provider("SQL", function(){
            var title = "";
            this.set = function(a) {
                title = a;
            }
            this.$get = function() {
                return new function(a) {
                    this.title = a;
                    this.call = function() {
                        alert("Hello: " + a);
                    }
                }(title)
            }
        });

        $locationProvider.hashPrefix('');
        $routeProvider
        .when( "", 
                { 
                    template: "<span> Default </span>"
                } 
        )
        .when(  "/home", 
                {
                    template:   "<span> Home Page </span>",
                    controller: "ct11"
                }
        )
        .when(  "/about/:uu",
                {
                    template:  "<span> Resole Return:  {{ rrr }} </span>",
                    controller: "ct22",
                    resolve: {
            respData: function($q, $route, $http) {
                var ddd = $q.defer();
                $.ajax({
                    data: {},
                    dataType: "json",  
                    error: function(xhr, tStatus, errorTh ) {
                        ddd.resolve({error:1});
                    },
                    success: function(req, tStatus) {
                        console.log("Ajax Done");
                        console.log(req);
                        ddd.resolve(req);
                    },
                    type: "GET",
                    url: "test4_data.php"
                });
                return ddd.promise;

                /*                
                 $http({
                        method: "GET",
                        url: "test4_data.php"
                    })
                    .then( 
                        function(rdata){ 
                            console.log("http then"); 
                            console.log(rdata); 
                            return rdata.data;  
                        },
                        function(rdata){}
                    )                                
                    .then(
                        function(rdata) { 
                            console.log("http then11"); 
                            rdata.data.data += 7500; 
                            rdata.data.date += " 21:00pm"; 
                            throw rdata; 
                        },
                        function(rdata) { }
                    );
                    */
                    
            },
                        respData1: function($route, $q, $timeout) {
                            var dd1 = $q.defer();
                            $timeout( function(){ console.log("dd1 callback"); dd1.resolve({well: $route.current.params.name}); }, 1500);
                            return dd1.promise;
                        }
                    }
                }
        )
        .otherwise("");

        console.log("Module MYRoute Init");
    })
</script>
<script>
    var app = angular.module("myApp", ["ngRoute", "MYRoute"]);
    app.config( function($provide,$routeProvider, $locationProvider){
        $locationProvider.hashPrefix('');
    
        $routeProvider
        //.when("/home", { template: "<span>myApp Home Page</span>" })
        .when("/miss", { template: "<span>Mission here</span>" });

    });

    app.controller("ct11", function ($scope) {
    });
   
    app.controller("ct22", function($scope, $location, $route, respData, respData1, $sce, $routeParams) {
        
       $scope.rrr = angular.toJson(respData) + " : " + angular.toJson(respData1);
        //console.log( $routeParams );
        
        $scope.myss = $sce.trustAsHtml(
                        '<br>ReadOnly: <br>' 
                      + "absUrl: " +  $location.absUrl() + '<br>'
                      + 'host: ' + $location.host("www.sohu.com") + '<br>' 
                      + 'protocol: ' + $location.protocol("https") + '<br>'
                      + 'port: ' + $location.port(443) + '<br>'
                      + '<br>Read and Write<br>'
                      + 'routeParams: ' + angular.toJson($routeParams) + '<br>'
                      + 'url: ' + $location.url() + '<br>'
                      + 'path: ' + $location.path() + '<br>'
                      + 'search: ' + angular.toJson($location.search()) + '<br>'
                      + 'hash: ' + $location.hash() + '<br>'
                );

        $scope.getSS = function($sce) {
            return $sce.trustAsHtml($scope.myss);
        }
 
        //$routeParams.uu = 'newChart';
        //$location.search("age", 22).search("zzz", 201800).search("age", 99).search("XXX","World").search("PPP", "Peter");

        //console.log( $location.search().age  + " : " + $location.search()["age"]);
        //$location.hash("OKKK");


        $scope.changeURL = function(){
            $location.search({}).search("HHHH", 8999);
            $route.updateParams({uu: 1668});
        }
        $scope.refreshURL = function() {
            $route.reload();
        }
    });
</script>
<style>
    .red {
        border: 2px solid red;
    }
</style>
</head>
<body ng-app="myApp">
<ul>
    <li><a href="#/miss">Miss</a></li>
    <li><a href="#/home">HOME</a></li>
    <li><a href="#/about/lwh/william/home?id=200&name=Tomspton#EBUY88">More</a></li>
    <li><a href="#/about/2008?id=200&name=Willtom#EBUY88">About</a></li>
    <li><a href="#/">Default</a></li>
</ul>
<br>
Here is View:<br>
<div id="hhh" class="red" ng-view></div>
<br>
Footer
</body>
</html>