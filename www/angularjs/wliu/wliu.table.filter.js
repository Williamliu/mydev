/****** Filter  ******/
/** label, textbox, select, bool, datetime, date, time */
wliu_table.directive("filter.label", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<label class="wliuCommon-label" scope="{{ table.scope }}" ',
                        'title="{{table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname?table.filterMeta(name).colname:name}}"',
                    '>',
                    '<span style="vertival-align:middle;">{{ table.filterMeta(name).colname?table.filterMeta(name).colname:name }}</span>',
                    '</label>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.textbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-keypress="keypress($event)" ',
                        'ng-model="table.filterMeta(name).value" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 0, blur:0} }" ',

                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.keypress = function(ev) {
                if(ev.keyCode==13) {
                    $scope.table.allRows();
                } 
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.select", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
			    '<select scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'ng-options="sObj.key as sObj.value for sObj in table.lists[table.filterMeta(name).list].list" ',                        
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}"',
                 '>',
                 '<option value=""></option>',
                 '</select>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.bool", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            label:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="checkbox" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '>',

                            '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}" ',
                                'ng-model="table.filterMeta(name).value" ng-value="1"  ',
                                'ng-disabled="table.filterMeta(name)==undefined" ',
                            '/>',

                            '<label for="filter_{{table.scope}}_{{name}}" title="{{table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname?table.filterMeta(name).colname:name}}">',
                                //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                '{{ label.toLowerCase()=="default"?table.filterMeta(name).colname:label?label:"" }}',
                            '</label>',

                    '</span>',
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.datetime", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span ',
                        //'ng-init="table.filterMeta(name).value=$.isPlainObject(table.filterMeta(name).value)?table.filterMeta(name).value:{}" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}"',                    
                    '>',
                        '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" placeholder="yyyy-mm-dd" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                            'ng-model="table.filterMeta(name).value.date" ',
                            'ng-disabled="table.filterMeta(name)==undefined" ',
                        '/>',
                        '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" placeholder="hh:mm" ',
                            //'ng-init="col=table.colByIndex(rowsn, name)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                            'ng-model="table.filterMeta(name).value.time" ',
                            'ng-disabled="table.filterMeta(name)==undefined" ',
                        '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.filterMeta($scope.name).value = $scope.table.filterMeta($scope.name).value?$scope.table.filterMeta($scope.name).value:{};
       },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $("input.wliuCommon-datepicker", el).pickadate({
                    format: "yyyy-mm-dd",
                    formatSubmit: "yyyy-mm-dd",
                    closeOnSelect: true,
                    //disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 200,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });

                $("input.wliuCommon-timepicker", el).pickatime({
                    twelvehour: false
                });

            });
        }
    }
});

wliu_table.directive("filter.datetimerange", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                    '<span style="vertical-align:middle">From: </span>',
                        '<span ',
                            'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}"',                    
                        '>',
                            '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" placeholder="yyyy-mm-dd" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                                'ng-model="table.filterMeta(name).value.from.date" ',
                                'ng-disabled="table.filterMeta(name)==undefined" ',
                            '/>',
                            '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" placeholder="hh:mm" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                                'ng-model="table.filterMeta(name).value.from.time" ',
                                'ng-disabled="table.filterMeta(name)==undefined" ',
                            '/>',
                        '</span>',
                    '<span style="vertical-align:middle"> To: </span>',
                        '<span ',
                            'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}"',                    
                        '>',
                            '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" placeholder="yyyy-mm-dd" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                                'ng-model="table.filterMeta(name).value.to.date" ',
                                'ng-disabled="table.filterMeta(name)==undefined" ',
                            '/>',
                            '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" placeholder="hh:mm" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                                'ng-model="table.filterMeta(name).value.to.time" ',
                                'ng-disabled="table.filterMeta(name)==undefined" ',
                            '/>',
                        '</span>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.filterMeta($scope.name).value = $scope.table.filterMeta($scope.name).value?$scope.table.filterMeta($scope.name).value:{};
            $scope.table.filterMeta($scope.name).value.from = $scope.table.filterMeta($scope.name).value.from?$scope.table.filterMeta($scope.name).value.from:{};
            $scope.table.filterMeta($scope.name).value.to = $scope.table.filterMeta($scope.name).value.to?$scope.table.filterMeta($scope.name).value.to:{};
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $("input.wliuCommon-datepicker", el).pickadate({
                    format: "yyyy-mm-dd",
                    formatSubmit: "yyyy-mm-dd",
                    closeOnSelect: true,
                    //disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 200,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });

                $("input.wliuCommon-timepicker", el).pickatime({
                    twelvehour: false
                });

            });
        }
    }
});

wliu_table.directive("filter.date", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $(el).pickadate({
                    format: "yyyy-mm-dd",
                    formatSubmit: "yyyy-mm-dd",
                    closeOnSelect: true,
                    //disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 200,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });
            });
        }
    }
});

wliu_table.directive("filter.daterange", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                    '<span style="vertical-align:middle">From: </span>',
                    '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value.from" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>',
                    '<span style="vertical-align:middle"> To: </span>',
                    '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value.to" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.filterMeta($scope.name).value = $scope.table.filterMeta($scope.name).value?$scope.table.filterMeta($scope.name).value:{};
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $(".wliuCommon-datepicker", el).pickadate({
                    format: "yyyy-mm-dd",
                    formatSubmit: "yyyy-mm-dd",
                    closeOnSelect: true,
                    //disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 200,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });
            });
        }
    }
});

wliu_table.directive("filter.time", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $(el).pickatime({
                    twelvehour: false
                });
            });
        }
    }
});

wliu_table.directive("filter.timerange", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                    '<span style="vertical-align:middle">From: </span>',
                    '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value.from" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>',
                    '<span style="vertical-align:middle"> To: </span>',
                    '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-model="table.filterMeta(name).value.to" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.filterMeta($scope.name).value = $scope.table.filterMeta($scope.name).value?$scope.table.filterMeta($scope.name).value:{};
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $(".wliuCommon-timepicker", el).pickatime({
                    twelvehour: false
                });
            });
        }
    }
});

wliu_table.directive("filter.range", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                    '<span style="vertical-align:middle">From: </span>',
                    '<input type="textbox" scope="{{ table.scope }}" ',
                        'style="width:80px;border-top:0px;border-left:0px;border-right:0px;border-radius:0px" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-keypress="keypress($event)" ',
                        'ng-model="table.filterMeta(name).value.from" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 0, blur:0} }" ',

                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>',
                    '<span style="vertical-align:middle"> To: </span>',
                    '<input type="textbox" scope="{{ table.scope }}" ',
                        'style="width:80px;border-top:0px;border-left:0px;border-right:0px;border-radius:0px" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'ng-keypress="keypress($event)" ',
                        'ng-model="table.filterMeta(name).value.to" ',
                        'ng-disabled="table.filterMeta(name)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 0, blur:0} }" ',

                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.filterMeta($scope.name).value = $scope.table.filterMeta($scope.name).value?$scope.table.filterMeta($scope.name).value:{};
            $scope.keypress = function(ev) {
                if(ev.keyCode==13) {
                    $scope.table.allRows();
                } 
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.checkbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",
            tooltip:    "@"
        },
        template: [
                    '<div scope="{{ table.scope }}" style="border:0px solid #cccccc;" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '>',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.filterMeta(name).list].list">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.filterMeta(name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-disabled="table.filterMeta(name)==undefined" ',
                                        '/>',

                                        '<label for="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.checkbox1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(name)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                            'wliu-diag  diag-target="{{targetid}}" diag-toggle="click" ',
                            'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():valueText()?valueText():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:valueText()?valueText():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys || {};
            $scope.change = function(name) {
                $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys.rowsn = -1; // don't need rowsn for filter
                $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                    var text = $.map( $scope.table.lists[$scope.table.filterMeta($scope.name).list].list , function(n) {
                    if( $scope.table.filterMeta( $scope.name )!= undefined ) {
                        if($scope.table.filterMeta( $scope.name ).value[n.key]) 
                            return n.value;
                        else
                            return null;
                    } else {
                        return null;
                    }

               }).join("; ");
               return text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.checkdiag1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" class="wliu-diag" scope="{{ table.scope }}" ',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',

                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.name)" title="check all"  ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.name)" title="remove all"  ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="checkbox">',

                                        '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.filterMeta( table.lists[name].keys.name ).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-disabled="table.filterMeta(table.lists[name].keys.name )==undefined" ',
                                        '/>',

                                        '<label for="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};

            $scope.checkall = function(name) {
                $scope.table.filterMeta(name).value = $scope.table.filterMeta(name ).value || {};
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.filterMeta(name ).value[$scope.table.lists[$scope.name].list[key].key] = true;
                }
            }

            $scope.removeall = function(name) {
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.filterMeta(name).value = {};
                }
            }

            $scope.valueArr = function(name) {
               var valueArr = $.map( $scope.table.lists[$scope.name].list , function(n) {
                   if( $scope.table.filterMeta(name)!= undefined  ) {
                        if( $scope.table.filterMeta(name).value[n.key] ) 
                                return n;
                        else
                                return null;
                   } else {
                       return null;
                   }

               });
               return valueArr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag({ fade:false, movable: true, title: sc.title});
            });
        }
    }
});

wliu_table.directive("filter.checklist1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",
            bar:        "@",
            height:     "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="" scope="{{ table.scope }}" ',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        //'<div class="wliu-underline"></div>',
                        '<div class="wliu-diag-content" style="height:{{height?height:\'auto\'}};min-width:240px;overflow-y:auto;border:1px solid #cccccc;border-radius:5px;overflow-y:auto;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.filterMeta(name).list].list|filter:search">',
                                '<span class="checkbox">',

                                        '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.filterMeta(name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-disabled="table.filterMeta(name)==undefined" ',
                                        '/>',

                                        '<label for="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.checkall = function() {
                $scope.table.filterMeta( $scope.name ).value = $scope.table.filterMeta( $scope.name ).value || {};
                for( var key in $scope.table.lists[$scope.table.filterMeta( $scope.name ).list].list  ) {
                    $scope.table.filterMeta( $scope.name ).value[ $scope.table.lists[$scope.table.filterMeta( $scope.name ).list].list[key].key ] = true;
                }
            }

            $scope.removeall = function() {
                for( var key in $scope.table.lists[$scope.table.filterMeta( $scope.name ).list].list  ) {
                    $scope.table.filterMeta( $scope.name ).value = {};
                }
            }
        },
        link: function (sc, el, attr) {
        }
    }
});


wliu_table.directive("filter.checkbox2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                        '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-checklist" value="{{ valueText() }}" ',
                                'ng-click="change(name)" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',

                                'wliu-diag  diag-target="{{targetid}}" diag-toggle="click" ',
                                'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():valueText()?valueText():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:valueText()?valueText():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys || {};
            $scope.change = function(name) {
                $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys.rowsn = -1;
                $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.lists[$scope.table.filterMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.filterMeta($scope.name).list].list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.filterMeta($scope.name )!=undefined ) {
                            if($scope.table.filterMeta($scope.name ).value[n.key]) 
                                    return n.value;
                            else
                                    return null;
                        } else {
                            return null;
                        }

                    }).join("; ");
                    ret_text += (ret_text && text?"; ":"") + text;
                }
                return ret_text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.checkdiag2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" class="wliu-diag container" scope="{{ table.scope }}" ',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="textbox" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.lists[name].list|filter:search"></span>{{search}}',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.filterMeta(table.lists[name].keys.name).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-disabled="table.filterMeta(table.lists[name].keys.name)==undefined" ',
                                                                    '/>',

                                                                    '<label for="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none;" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};

            $scope.checkall = function(name) {
                $scope.table.filterMeta(name).value = $scope.table.filterMeta(name).value || {};
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    for( var dkey in dList) {
                        $scope.table.filterMeta(name).value[ dList[dkey].key ] = true;
                    }
                }
            }

            $scope.removeall = function(name) {
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.filterMeta(name).value = {};
                }
            }

            $scope.valueArr = function(name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.filterMeta(name)!= undefined  ) {
                                if( $scope.table.filterMeta(name).value[n.key] ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag({ fade:false, movable: true, title: sc.title});
            });
        }
    }
});

wliu_table.directive("filter.checklist2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            height:     "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" scope="{{ table.scope }}" ',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        //'<div class="wliu-underline"></div>',
                        '<div class="wliu-diag-content"  style="height:{{height?height:\'auto\'}}; overflow-y:auto; border:1px solid #cccccc;border-radius:5px;overflow-y:auto;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.lists[table.filterMeta(name).list].list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.filterMeta( name ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-disabled="table.filterMeta( name )==undefined" ',
                                                                    '/>',

                                                                    '<label for="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none;" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {

            $scope.checkall = function() {
                $scope.table.filterMeta( $scope.name ).value = $scope.table.filterMeta( $scope.name ).value || {};
                for( var key in $scope.table.lists[$scope.table.filterMeta($scope.name).list].list  ) {
                    var dList = $scope.table.lists[$scope.table.filterMeta($scope.name).list].list[key].list;
                    for( var dkey in dList) {
                        $scope.table.filterMeta( $scope.name ).value[ dList[dkey].key ] = true;
                    }
                }
            }

            $scope.removeall = function() {
                for( var key in $scope.table.lists[$scope.table.filterMeta($scope.name).list].list  ) {
                    $scope.table.filterMeta( $scope.name ).value = {};
                }
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.checkbox3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(name)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',

                            'wliu-diag  diag-target="{{targetid}}" diag-toggle="click" ',
                            'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():valueText()?valueText():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:valueText()?valueText():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys || {};
            $scope.change = function(name) {
                $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys.rowsn = -1;
                $scope.table.lists[ $scope.table.filterMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key1 in $scope.table.lists[$scope.table.filterMeta($scope.name).list].list) {
                    var list2 = $scope.table.lists[$scope.table.filterMeta($scope.name).list].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var text = $.map( list3 , function(n) {
                            if( $scope.table.filterMeta($scope.name )!= undefined ) {
                                if($scope.table.filterMeta($scope.name ).value[n.key]) 
                                        return n.value;
                                else
                                        return null;
                            } else {
                                return null;
                            }

                        }).join("; ");
                        ret_text += (ret_text && text?"; ":"") + text;
                    }
                }
                return ret_text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.checkdiag3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" class="wliu-diag container" scope="{{ table.scope }}" ',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
                        
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.lists[name].list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.lists[name].list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<span style="white-space:nowrap;font-weight:700;">{{ rdObj.value }}</span>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.filterMeta(table.lists[name].keys.name).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-disabled="table.filterMeta(table.lists[name].keys.name)==undefined" ',
                                                                    '/>',

                                                                    '<label for="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none" ng-repeat-end></span>',
                            '<span style="display:none" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};
            $scope.listFilter = $scope.listFilter || {};
            $scope.change = function(name) {
                // $scope.name is  lists[name],   name is colname
                $scope.table.lists[$scope.name].keys.rowsn = -1;
                $scope.table.lists[$scope.name].keys.name = name;
            }

            $scope.checkall = function(name) {
                $scope.table.filterMeta(name).value = $scope.table.filterMeta(name).value || {};
                for( var key1 in $scope.table.lists[$scope.name].list  ) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for( var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.filterMeta(name).value[ list3[key3].key ] = true;
                        }
                     }
                }
            }

            $scope.removeall = function(name) {
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.filterMeta(name).value = {};
                }
            }

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function(name) {
                var ret_arr = [];
                for(var key1 in $scope.table.lists[$scope.name].list) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
                            if( $scope.table.filterMeta(name)!= undefined  ) {
                                    if( $scope.table.filterMeta(name).value[n.key] ) 
                                            return n;
                                    else
                                            return null;
                            } else {
                                return null;
                            }
                        });
                        $.merge(ret_arr, valueArr);
                    }
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag({ fade:false, movable: true, title: sc.title});
            });
        }
    }
});

wliu_table.directive("filter.checklist3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",
            colnum1:    "@",
            height:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" scope="{{ table.scope }}" ',
                    '>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.lists[table.filterMeta(name).list].list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        //'<div class="wliu-underline"></div>',
                        '<div class="wliu-diag-content" style="height:{{height?height:\'auto\'}}; overflow-y:auto; border:1px solid #cccccc;border-radius:5px;overflow-y:auto;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.lists[table.filterMeta(name).list].list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.filterMeta( name ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-disabled="table.filterMeta( name )==undefined" ',
                                                                    '/>',

                                                                    '<label for="filter_{{table.scope}}_{{name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none" ng-repeat-end></span>',
                            '<span style="display:none" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.search = $scope.search || "";
            $scope.table.lists[$scope.table.filterMeta($scope.name).list].keys = $scope.table.lists[$scope.table.filterMeta($scope.name).list].keys || {};
            $scope.listFilter = $scope.listFilter || {};

            $scope.checkall = function() {
                $scope.table.filterMeta($scope.name).value = $scope.table.filterMeta($scope.name).value || {};
                for( var key1 in $scope.table.lists[$scope.table.filterMeta($scope.name).list].list  ) {
                    var list2 = $scope.table.lists[$scope.table.filterMeta($scope.name).list].list[key1].list;
                    for( var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.filterMeta($scope.name).value[ list3[key3].key ] = true;
                        }
                     }
                }
            }

            $scope.removeall = function() {
                for( var key in $scope.table.lists[$scope.table.filterMeta($scope.name).list].list  ) {
                    $scope.table.filterMeta( $scope.name ).value = {};
                }
            }

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("filter.radio", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            colnum:     "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<div scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.filterMeta(name).errorCode }" ',
                        'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" popup-content="{{table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage.nl2br():table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.filterMeta(name).errorCode?table.filterMeta(name).errorMessage:table.filterMeta(name).coldesc?table.filterMeta(name).coldesc:table.filterMeta(name).colname}}" ',
                    '>',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.filterMeta(name).list].list">',
                                '<span class="radio">',

                                        '<input type="radio"  scope="{{ table.scope }}" id="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.filterMeta(name).value" ng-value="rdObj.key"  ',
                                            'ng-disabled="table.filterMeta(name)==undefined" ',
                                        '/>',

                                        '<label scope="{{ table.scope }}" for="filter_{{table.scope}}_{{name}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});


