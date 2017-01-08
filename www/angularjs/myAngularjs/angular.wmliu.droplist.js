var wmliu_droplist = angular.module("wmliuDroplist",  []);
wmliu_droplist.directive("wmliu.droplist", function (wmliuDroplistService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            list:   "=",
            name:   "@",
            color:  "@"
        },
        template: [

    '<div class="wmliu-droplist wmliu-droplist-{{color}}">',
        '<ul class="main">',
            '<li title="{{getText().desc}}">{{ getText().title }}&nbsp;<a class="wmliu-droplist-down"></a>',
                '<ul class="item">',
                    '<li    class="{{rdObj.key==list.lang?\'selected\':\'\'}}" title="{{rdObj.desc}}" ',
                            'ng-repeat="rdObj in list.droplist" ng-click="changeState(rdObj);">',
                    '{{ rdObj.title?rdObj.title:rdObj.key.uword() }}',
                    '</li>',
                '</ul>',
            '</li>',
		'</ul>',
    '</div>'

				  ].join(""),
        controller: function ($scope) {
            $scope.list.name = $scope.name;
            var evtObj = wmliuDroplistService.getChange($scope.list.name);

            $scope.getText = function () {
                var robj = {};
                var curObj = $.grep($scope.list.droplist, function (nobj, idx) {
                    return (nobj.key == $scope.list.lang);
                });
                if (curObj && curObj.length > 0) robj = curObj[0];
                return robj;
            }

            $scope.changeState = function (sObj) {
                if ($scope.list.lang != sObj.key) {
                    $scope.list.lang = sObj.key;
                    if (evtObj) if( angular.isFunction(evtObj) ) evtObj(sObj);
                }
            }
        }
    }
});




/******************************************************************************************
/*** Service ***/
wmliu_droplist.service("wmliuDroplistService", function () {
    var self = this;
    self.changeEvent = [];

    self.setChange = function (eid, changeEvent) {
        self.changeEvent[eid] = self.changeEvent[eid] || {};
        if ( angular.isFunction(changeEvent) ) {
                self.changeEvent[eid] = changeEvent;
        }
    }

    self.getChange = function (eid) {
        var tmp = self.changeEvent[eid] || null;
        return tmp;
    }
});

/******************************************************************************************
/*** Javascript ***/
