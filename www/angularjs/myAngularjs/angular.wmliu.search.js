/***********************************************************************************************/
var wmliu_search = angular.module("wmliuSearch",  []);
/************************************************************************************************/
/***  Search Directive ***/
wmliu_search.directive("search.form", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            table: "="
            //buttonclick: "&" - can not pass parameter because it is in isolated scope
        },
        template: [
                    '<form ng-transclude novalidate></form>'
                   ].join(""),
        transclude: true,
        controller: function ($scope) {
            $scope.table.schema.filterVals = $scope.table.schema.filterVals || {};
        }
    }
});


wmliu_search.directive("search.textbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
            '<input type="textbox" ng-model="table.schema.filterVals[name][search]" style="border:1px solid #cccccc;" ng-change="valuechange();" />'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.datavalue ? $scope.datavalue : "";

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "textbox";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;

        }
    }
});


wmliu_search.directive("search.date", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
            '<input class="search-date-{{search}}" type="textbox" style="width:120px;border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search]" ng-change="valuechange();" />'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.datavalue ? $scope.datavalue : "";

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "date";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        },
		link: function (sc, attr, el) {
			$(function(){
				$(".search-date-" + sc.search).datepicker({
					dateFormat: 'yy-mm-dd',
					showOn: "button",
					buttonImage: "theme/light/icon/calendar.png",
					buttonImageOnly: true
				});
			});
		}
    }
});


wmliu_search.directive("search.daterange", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
            '<span>',
			'{{ trans[GLang].words[\'from\'] }}: 	<input class="search-date-from-{{search}}" 	type="textbox" style="width:80px;border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search].from" 	ng-change="valuechange();" /> ',
			'{{ trans[GLang].words[\'to\']   }}: 	<input class="search-date-to-{{search}}" 	type="textbox" style="width:80px;border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search].to" 	ng-change="valuechange();" />',
			'</span>'
        ].join(""),
        controller: function ($scope) {
			$scope.trans		= gcommon.trans;
			$scope.GLang		= GLang;

            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.datavalue ? $scope.datavalue : "";

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "daterange";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        },
		link: function (sc, attr, el) {
			$(function(){
				$(".search-date-from-" + sc.search).datepicker({
					dateFormat: 'yy-mm-dd',
					showOn: "button",
					buttonImage: "theme/light/icon/calendar.png",
					buttonImageOnly: true
				});
				$(".search-date-to-" + sc.search).datepicker({
					dateFormat: 'yy-mm-dd',
					showOn: "button",
					buttonImage: "theme/light/icon/calendar.png",
					buttonImageOnly: true
				});
			});
		}
    }
});


wmliu_search.directive("search.dateint", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
            '<input class="search-date-{{search}}" type="textbox" style="width:120px; border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search]" ng-change="valuechange();" />'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.datavalue ? $scope.datavalue : "";

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "dateint";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        },
		link: function (sc, attr, el) {
			$(function(){
				$(".search-date-" + sc.search).datepicker({
					dateFormat: 'yy-mm-dd',
					showOn: "button",
					buttonImage: "theme/light/icon/calendar.png",
					buttonImageOnly: true
				});
			});
		}
    }
});


wmliu_search.directive("search.dateintrange", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
            '<span>',
			'{{ trans[GLang].words[\'from\'] }}: 	<input class="search-date-from-{{search}}" 	type="textbox" style="width:80px; border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search].from" 	ng-change="valuechange();" /> ',
			'{{ trans[GLang].words[\'to\']   }}: 	<input class="search-date-to-{{search}}" 	type="textbox" style="width:80px; border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search].to" 	ng-change="valuechange();" />',
			'</span>'
        ].join(""),
        controller: function ($scope) {
			$scope.trans		= gcommon.trans;
			$scope.GLang		= GLang;

            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.datavalue ? $scope.datavalue : "";
            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "dateintrange";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        },
		link: function (sc, attr, el) {
			$(function(){
				$(".search-date-from-" + sc.search).datepicker({
					dateFormat: 'yy-mm-dd',
					showOn: "button",
					buttonImage: "theme/light/icon/calendar.png",
					buttonImageOnly: true
				});
				$(".search-date-to-" + sc.search).datepicker({
					dateFormat: 'yy-mm-dd',
					showOn: "button",
					buttonImage: "theme/light/icon/calendar.png",
					buttonImageOnly: true
				});
			});
		}
    }
});



//<search.hidden style="width:120px;" table="table" search="id" format="hidden" compare="=" />
wmliu_search.directive("search.hidden", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
            '<input type="hidden" ng-model="table.schema.filterVals[name][search]" ng-change="valuechange();" />'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.datavalue ? $scope.datavalue : "";

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "hidden";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
            
         }
    }
});

//<search.checkbox table="table" search="prof_id" format="checkbox" colnum="4" />
wmliu_search.directive("search.checkbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            search:     "@",
            datatype:   "@",
            compare:    "@",
            cols:       "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            colnum:     "@",
            datavalue:  "@",
            valuechange:"&"
        },
        template: [
			'<span style="white-space:nowrap;">',
                '<span ng-repeat="rdObj in table.listTables.checklist[search]">',
                    '<label class="{{table.schema.filterVals[name][search][rdObj.key]?\'wmliu-table-col-input-checked\':\'\'}}" title="{{rdObj.desc}}">',
                    '<input type="checkbox" ng-model="table.schema.filterVals[name][search][rdObj.key]" ng-change="valuechange();" />{{rdObj.title}}',
                    '</label><br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                '</span>',
            '</span>'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || {};

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["rtable"] = $scope.table.schema.checklist[$scope.search].rtable;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["rcol"] = $scope.table.schema.checklist[$scope.search].rcol;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "checkbox";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        }
    }
});


//<search.bool table="table" search="deleted" format="bool" cols="" compare="=" />
wmliu_search.directive("search.bool", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: 		"=",
            name:       "@",
            search: 	"@",
            datatype: 	"@",
            compare: 	"@",  
			cols:		"@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue:  "@",
            valuechange: "&"
        },
        template: [
			'<span style="white-space:nowrap;">',
                    '<label ng-class="{\'wmliu-table-col-input-checked\':table.schema.filterVals[search]}" title="">',
                    '<input type="checkbox" ng-model="table.schema.filterVals[name][search]" ng-change="valuechange();" />',
                    '</label>',
            '</span>'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = parseInt($scope.datavalue)==1?true:false;


            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "bool";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        }
    }
});

//<search.radio table="table" search="gender" format="number" cols="" compare="=" />
wmliu_search.directive("search.radio", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: 		"=",
            name:       "@",
            search: 	"@",
            datatype: 	"@",
            compare: 	"@",  
			cols:		"@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            colnum:     "@",
            datavalue:  "@",
            valuechange: "&"
        },
        template: [
            '<span style="white-space:nowrap;">',
                '<span ng-repeat="rdObj in table.listTables.checklist[search]">',
                    '<label ng-class="{\'wmliu-table-col-input-checked\':table.schema.filterVals[name][search]==rdObj.key}" title="{{rdObj.desc}}">',
                    '<input type="radio" ng-model="table.schema.filterVals[name][search]" ng-value="rdObj.key" ng-change="valuechange();" />{{rdObj.title}}',
                    '</label><br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                '</span>',
            '</span>'
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = isNaN($scope.datavalue)?$scope.datavalue:parseInt($scope.datavalue);

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "radio";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        }
    }
});

//<search.select style="width:120px;" table="table" valuechange="search();" search="status" format="bool"  compare="" />
wmliu_search.directive("search.select", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name:  "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
			'<select  style="border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search]" ng-change="valuechange();" ng-options="sObj.key as sObj.title for sObj in table.listTables.checklist[search]">',
			'<option value=""></option>',
            '</select>',
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = isNaN($scope.datavalue) ? $scope.datavalue : parseInt($scope.datavalue);

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "select";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        }
    }
});


wmliu_search.directive("search.choose", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name:  "@",
            search: "@",
            datatype: "@",
            compare: "@",
            cols: "@",   // [first_name, last_name]  = (first_name = '' or last_name = '')
            datavalue: "@",
            valuechange: "&"
        },
        template: [
			'<select style="border:1px solid #cccccc;" ng-model="table.schema.filterVals[name][search]" ng-change="valuechange();" ng-options="sObj.key as sObj.title for sObj in table.listTables.checklist[search]">',
			'<option value="-1"></option>',
            '</select>',
        ].join(""),
        controller: function ($scope) {
            $scope.table.schema.filterVals[$scope.name] = $scope.table.schema.filterVals[$scope.name] || {};
            $scope.table.schema.filterVals[$scope.name][$scope.search] = $scope.table.schema.filterVals[$scope.name][$scope.search] || "";
            $scope.table.schema.filterVals[$scope.name][$scope.search] = isNaN($scope.datavalue) ? $scope.datavalue : parseInt($scope.datavalue);

            $scope.table.schema.table[$scope.name].filterCols = $scope.table.schema.table[$scope.name].filterCols || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search] = $scope.table.schema.table[$scope.name].filterCols[$scope.search] || {};
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["table"] = $scope.table.schema.table[$scope.name].name;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["type"] = "select";
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["cols"] = $scope.cols;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datatype"] = $scope.datatype;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["datavalue"] = $scope.datavalue;
            $scope.table.schema.table[$scope.name].filterCols[$scope.search]["compare"] = $scope.compare;
        }
    }
});



wmliu_search.directive("search.search", function (wmliuSearchService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:  "=",
            action: "@",  // action for callBack Event name,  for ajax call action is view;
            name:   "@"   //name for button name
        },
        template: [
			'<button ng-click="searchClick()">{{name}}</button>'
        ].join(""),
        controller: function ($scope) {
            $scope.searchClick = function () {
                /*
                $scope.table.navi.head.pageNo = 1;
                $scope.table.navi.head.action = "view";
                var search_table = {};
                search_table.schema     = $scope.table.schema;
                search_table.navi       = $scope.table.navi;
                search_table.rows = [];
                
                wmliuSearchService.tableAjax(search_table, $scope.action, $scope, $scope.table.buttons.head.wait);
                */
            }
        }
    }
});

wmliu_search.directive("search.button", function (wmliuSearchService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "=",
            name: "@",
            action: "@"
        },
        template: [
			'<button ng-click="buttonClick()">{{name}}</button>'
        ].join(""),
        controller: function ($scope) {
            $scope.buttonClick = function () {
                var btnClick = wmliuSearchService.getButtonClick($scope.table.name, $scope.action);
                if (btnClick) if(angular.isFunction(btnClick)) btnClick($scope.action, $scope.table);
            }
        }
    }
});
/**********************************************************************************************/

wmliu_search.service("wmliuSearchService", function () {
    var self = this;
    self.buttonClick = []; //angular.noop;

    self.setButtonClick = function (eid, clickEvent, action) {
        self.buttonClick[eid] = self.buttonClick[eid] || {};
        if (action && action != "") {
            self.buttonClick[eid][action] = clickEvent;
        } else {
            self.buttonClick[eid] = clickEvent || {};
        }
    }

    self.getButtonClick = function (eid, action) {
        var tmp = self.buttonClick[eid] || {};
        if (action && action != "") {
            if (tmp[action]) return tmp[action];
        }
        return tmp;
    }
});

