var wmliu_calendar = angular.module("wmliuCalendar",  []);
wmliu_calendar.directive("wmliu.calendar", function (wmliuCalendarService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            calendar: "=",
            name: "@",
            curyy: "@",
            curmm: "@"
        },
        template: [

    '<table class="wmliu-calendar">',
        '<tr>',
            '<td colspan="7" class="subject">',
                '<div>',
                    '<a class="wmliu-calendar-button wmliu-calendar-button-nav-prev"    ng-click="prevMonth();"     title="{{trans[calendar.list.head.lang].words[\'previous month\']}}"></a>',
                    '<a class="wmliu-calendar-button wmliu-calendar-button-nav-today"   ng-click="todayMonth();"    title="{{trans[calendar.list.head.lang].words[\'today\']}}"></a>',
                    '<a class="wmliu-calendar-button wmliu-calendar-button-nav-add"     ng-click="addToCalendar();"    title="{{trans[calendar.list.head.lang].words[\'add calendar\']}}"></a>',

                    '<select class="wmliu-calendar-select-month" ',
                        'ng-model="calendar.schema.current.M" ng-options="basic[calendar.list.head.lang].month_desc.indexOf(sObj) as sObj for sObj in basic[calendar.list.head.lang].month_desc" ',
                        'title="{{ sObj }}" ',
				        'ng-change="changeYearMonth();">',
                    '</select>',
                    ' <b>,</b> ',
                    '<input class="wmliu-calendar-select-year" type="text" placeholder="Year" ',
                            'ng-model="calendar.schema.current.Y" ng-keydown="yearKeydown($event);" />',
                    '<a class="wmliu-calendar-button wmliu-calendar-button-nav-next"  ng-click="nextMonth();" title="{{trans[calendar.list.head.lang].words[\'next month\']}}"></a>',
                '</div>',
            '</td>',
        '</tr>',

        '<tr>',
        '<td colspan="7" style="background-color:#003c54; height:2px;"></td>',
        '</tr>',

        '<tr>',
            '<td class="head {{$index==0 || $index==6?\'head-weekend\':\'\'}}" ng-repeat="dayHead in basic[calendar.list.head.lang].day_desc">',
            '{{dayHead}}',
            '</td>',
        '</tr>',

        '<tr ng-repeat="wkObj in calendar.list.weeks">',
            '<td valign="top" class="date {{dayObj.Y==calendar.schema.today.Y && dayObj.M==calendar.schema.today.M && dayObj.D==calendar.schema.today.D?\'date-today\':\'\'}}" ng-repeat="dayObj in wkObj">',
                '<div>',
                    '<span class="date-digi {{dayObj.M!=calendar.schema.current.M?\'date-digi-na\':\'\'}}">{{basic[calendar.list.head.lang].month_short[dayObj.M]}}-{{dayObj.dd}}</span><br>',
                    '<ul>',
                        '<li ng-repeat="timeObj in calendar.list.vals[dayObj.ymd]|orderBy:calendar.schema.views.schtype.start_time" ng-click="dateClick(timeObj);" title="{{getDesc(timeObj)}}">',
                            '<span class="time-time" ng-bind="timeObj.time_range"></span> ',
                            '<span class="time-title">{{getTitle(timeObj)}}</span>',
                        '</li>',
                    '</ul>',
                '</div>',
            '</td>',
        '</tr>',


        '<tr>',
        '<td colspan="7" style="background-color:#003c54; height:2px;"></td>',
        '</tr>',
    '</table>'

				  ].join(""),
        controller: function ($scope) {
            $scope.calendar.name = $scope.name;
            $scope.basic = gcommon.basic;
            $scope.trans = gcommon.trans;

            $scope.calendar.schema.today = {};
            $scope.calendar.schema.today.date = new Date();
            $scope.calendar.schema.today.Y = $scope.calendar.schema.today.date.getFullYear();
            $scope.calendar.schema.today.M = $scope.calendar.schema.today.date.getMonth();
            $scope.calendar.schema.today.D = $scope.calendar.schema.today.date.getDate();
            $scope.calendar.schema.today.W = $scope.calendar.schema.today.date.getDay();

            $scope.calendar.schema.today.yy = $scope.calendar.schema.today.date.format("Y");
            $scope.calendar.schema.today.mm = $scope.calendar.schema.today.date.format("n");
            $scope.calendar.schema.today.dd = $scope.calendar.schema.today.date.format("j");

            $scope.calendar.schema.current = $scope.calendar.schema.current || {};
            // initialize current yy & mm
            if ($scope.curyy)
                $scope.calendar.schema.current.yy = $scope.curyy;
            else
                if (!$scope.calendar.schema.current.yy) $scope.calendar.schema.current.yy = $scope.calendar.schema.today.yy;

            if ($scope.curmm)
                $scope.calendar.schema.current.mm = $scope.curmm;
            else
                if (!$scope.calendar.schema.current.mm) $scope.calendar.schema.current.mm = $scope.calendar.schema.today.mm;

            if ($scope.calendar.schema.current.minyy == "") $scope.calendar.schema.current.minyy = 1970;
            if ($scope.calendar.schema.current.maxyy == "") $scope.calendar.schema.current.maxyy = 2099;
            // end of yy & mm

            $scope.calendar.schema.current.Y = parseInt($scope.calendar.schema.current.yy);
            $scope.calendar.schema.current.M = parseInt($scope.calendar.schema.current.mm) - 1;

            $scope.getTitle = function (tt) {
                var ret_str = $scope.calendar.schema.views.title.conreplace(tt);
                //ret_str = ret_str.conreplace(tt);
                return ret_str;
            }

            $scope.getDesc = function (tt) {
                return $scope.calendar.schema.views.desc.colreplace(tt);
            }

            wmliuCalendarService.load[$scope.calendar.name] = function () {
                $scope.calendar.list.head.action = "load";
                $scope.calendar.list.head.state = "load";
                $scope.calendar.list.head.loading = 1;
                var load_cal = {};
                load_cal.schema = $scope.calendar.schema;
                load_cal.list = $scope.calendar.list;
                wmliuCalendarService.listAjax(load_cal, $scope.calendar.list.head.action, $scope, $scope.calendar.list.head.wait);
            }

            $scope.addToCalendar = function () {
                // trigger event 
                var addClick = wmliuCalendarService.getAddClick($scope.calendar.name);
                if (angular.isFunction(addClick)) {
                    addClick($scope.calendar.schema.idvals);
                }
            }

            $scope.dateClick = function (timeObj) {
                // trigger event 
                var dateClick = wmliuCalendarService.getDateClick($scope.calendar.name);
                if (angular.isFunction(dateClick)) {
                    dateClick(timeObj);
                }
            }

            $scope.changeYearMonth = function () {
                if (parseInt($scope.calendar.schema.current.Y) < parseInt($scope.calendar.schema.current.minyy) || parseInt($scope.calendar.schema.current.Y) > parseInt($scope.calendar.schema.current.maxyy))
                    $scope.calendar.schema.current.Y = $scope.calendar.schema.today.Y;

                //$scope.calendar.schema.current.M = ($scope.calendar.schema.current.M < 0 || $scope.calendar.schema.current.M > 11) ? $scope.calendar.schema.today.M : $scope.calendar.schema.current.M;

                $scope.calendar.schema.current.date = new Date($scope.calendar.schema.current.Y, $scope.calendar.schema.current.M, 1);

                $scope.calendar.schema.current.Y = $scope.calendar.schema.current.date.getFullYear();
                $scope.calendar.schema.current.M = $scope.calendar.schema.current.date.getMonth();
                $scope.calendar.schema.current.yy = $scope.calendar.schema.current.date.format("Y");
                $scope.calendar.schema.current.mm = $scope.calendar.schema.current.date.format("n");

                $scope.calendar.list.weeks = wmliuCalendarService.getMonthWeeks($scope.calendar.schema.current.Y, $scope.calendar.schema.current.M);

                wmliuCalendarService.load[$scope.calendar.name]();
            }

            $scope.yearKeydown = function (ev) {
                if (ev.keyCode == 13) {
                    $scope.changeYearMonth();
                }
            }

            $scope.prevMonth = function () {
                $scope.calendar.schema.current.M--;
                $scope.changeYearMonth();
            }

            $scope.nextMonth = function () {
                $scope.calendar.schema.current.M++;
                $scope.changeYearMonth();
            }

            $scope.todayMonth = function () {
                $scope.calendar.schema.current.Y = $scope.calendar.schema.today.Y;
                $scope.calendar.schema.current.M = $scope.calendar.schema.today.M;
                $scope.changeYearMonth();
            }

            $scope.changeYearMonth();

        }

    }
});




/******************************************************************************************
/*** Service ***/
wmliu_calendar.service("wmliuCalendarService", function () {
    var self = this;
	self.load = [];
    self.dateClick = []; //angular.noop;
    self.addClick = []; //angular.noop;

    self.setAddClick = function (eid, clickEvent) {
        self.addClick[eid] = self.addClick[eid] || {};
        self.addClick[eid] = clickEvent;
    }

    self.getAddClick = function (eid) {
        var tmp = self.addClick[eid] || {};
        return tmp;
    }


    self.setDateClick = function (eid, clickEvent) {
        self.dateClick[eid] = self.dateClick[eid] || {};
        self.dateClick[eid] = clickEvent;
    }

    self.getDateClick = function (eid) {
        var tmp = self.dateClick[eid] || {};
        return tmp;
    }

    self.changeEvent = [];

    self.setChange = function (eid, changeEvent) {
        self.changeEvent[eid] = self.changeEvent[eid] || {};
        if (angular.isFunction(changeEvent)) {
            self.changeEvent[eid] = changeEvent;
        }
    }

    self.getChange = function (eid) {
        var tmp = self.changeEvent[eid] || null;
        return tmp;
    }

    self.getMonthWeeks = function (theYear, theMonth) {
        var weeks = [];
        var ff_date = new Date(theYear, theMonth, 1);
        var ll_date = new Date(theYear, theMonth + 1, 0);

        var ff_dd = ff_date.getDate();
        var ll_dd = ll_date.getDate();

        var ff_wd = ff_date.getDay();
        var ll_wd = ll_date.getDay();

        var wk_cnt = -1;
        var weeks = [];

        var ss_date = new Date(theYear, theMonth, 0 - ff_wd);
        for (var dd = (ff_dd - ff_wd); dd <= (ll_dd + 6 - ll_wd); dd++) {
            ss_date.setDate(ss_date.getDate() + 1);
            if (ss_date.getDay() == 0) wk_cnt++;
            weeks[wk_cnt] = weeks[wk_cnt] || [];
            weeks[wk_cnt][ss_date.getDay()] = weeks[wk_cnt][ss_date.getDay()] || {};

            weeks[wk_cnt][ss_date.getDay()].date = ss_date;
            weeks[wk_cnt][ss_date.getDay()].Y = ss_date.getFullYear();
            weeks[wk_cnt][ss_date.getDay()].M = ss_date.getMonth();
            weeks[wk_cnt][ss_date.getDay()].D = ss_date.getDate();
            weeks[wk_cnt][ss_date.getDay()].W = ss_date.getDay();

            weeks[wk_cnt][ss_date.getDay()].yy = ss_date.format("Y");
            weeks[wk_cnt][ss_date.getDay()].mm = ss_date.format("n");
            weeks[wk_cnt][ss_date.getDay()].dd = ss_date.format("j");
            weeks[wk_cnt][ss_date.getDay()].ymd = ss_date.format("Y-m-d");
        }

        return weeks;
    }
	
    this.listAjax = function (cal, action, sc, wait) {
        if (wait == "1") wait_show();
        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                calendar: cal
                // do not need to send rows
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (wait == "1") wait_hide();
                sc.calendar.list.head.loading = 0;
                //tool_tips("Error (website_calendar_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (wait == "1") wait_hide();
				errorHandler(req);
				if( req.errorCode < 900 ) {
	                self.updateData(req.calendar, sc);
				}
	        },
            type: "post",
            url: "ajax/website_calendar_data.php"
        });
    }

    self.updateData = updateListData;
	

});

/******************************************************************************************
/*** Javascript ***/
function updateListData(rcal, sc) {
    sc.calendar.list.head.loading = 0;
    if (rcal) {
        sc.calendar.list.head = angular.copy(rcal.list.head);
        sc.calendar.list.vals = angular.copy(rcal.list.vals);
    }
    sc.$apply();
}
