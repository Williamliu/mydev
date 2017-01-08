var wmliu_list = angular.module("wmliuList",  []);
wmliu_list.directive("wmliu.list", function (wmliuListService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            list: "=",
            name: "@",
            loading: "="
        },
        template: ['<ul class="wmliu-list-ul">',

                    '<li    class="wmliu-list-navi-bg-top">',
                    '<span class="wmliu-list-navi-search">',
        //'<a class="search" ng-click="naviPage();"></a>',
                    '<input type="text" ng-model="list.navi.filterVals.search" placeholder="{{ trans[list.navi.head.lang].words[\'search\'] }}" ng-keydown="naviKeydown($event)" />',
        //'{{list.schema.orderBy}}',
			        '<select ng-model="list.navi.head.orderBy" ng-options="sObj.key as sObj.title for sObj in list.schema.orderBy" style="border: 0px; border-left:1px solid #cccccc; text-align:right; font-size:12px; width:auto; height:100%; padding-left:10px; padding-right:10px; line-height:100%; float:right;" ',
                            'title="please select the list order." ',
				            'ng-change="changeOrder()">',
                    '</select>',
                    '</span>',



                    '</li>',

                    '<li    class="wmliu-list-navi-bg-bottom">',
                    '<span>',
                    '<a     class="wmliu-list-navi wmliu-list-navi-first"  ng-click="naviPage(\'first\');"  ng-class="{\'wmliu-list-navi-first-na\':list.navi.head.pageNo<=1 || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"  title="Fisrt Page"></a>',
                    '<a     class="wmliu-list-navi wmliu-list-navi-prev"   ng-click="naviPage(\'prev\');"   ng-class="{\'wmliu-list-navi-prev-na\':list.navi.head.pageNo<=1 || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"  title="Previous Page"></a>',
                    '<a     class="wmliu-list-navi wmliu-list-navi-next"   ng-click="naviPage(\'next\');"	ng-class="{\'wmliu-list-navi-next-na\':list.navi.head.pageNo>=pageTotal() || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"  title="Next Page"></a>',
                    '<a     class="wmliu-list-navi wmliu-list-navi-last"   ng-click="naviPage(\'last\');"   ng-class="{\'wmliu-list-navi-last-na\':list.navi.head.pageNo>=pageTotal() || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"  title="Last Page"></a>',
                    '</span>',
        		  	'<span class="wmliu-list-navi-pineline">|</span>',

		  	        '<a class="wmliu-list-navi wmliu-list-navi-loading" ng-if="list.navi.head.loading" title="LOADING..."></a>',
		  	        '<a class="wmliu-list-navi wmliu-list-navi-refresh" ng-if="!list.navi.head.loading" ng-click="naviPage(\'refresh\');" title="Refresh Table"></a>',


                    '<span class="wmliu-list-navi-label" style="margin-left:5px;">',
                    '{{ trans[list.navi.head.lang].words[\'page\'] }}: ',
        		  	'<input name="pageno" type="text" ng-keydown="naviKeydown($event)" class="wmliu-list-navi-pageSize" style="border:0px; border-bottom:1px solid #cccccc;" min="0" max="{{pageTotal()}}" ng-model="list.navi.head.pageNo"  />',
        		  	'<span class="wmliu-list-navi-pineline">/</span>{{pageTotal()}}',
        		  	'<input name="pagesize" type="text" ng-keydown="naviKeydown($event)" class="wmliu-list-navi-pageSize" style="margin-left:20px; border:0px; border-bottom:1px solid #cccccc;" min="10" max="200" maxlength="3" ng-model="list.navi.head.pageSize"  />',
                    '</span>',
                    '</li>',

                    '<li ng-repeat="row in list.rows" ng-init="rowsn = $index + 1;" class="item {{list.schema.idvals.pid==row[\'pid\']?\'item-selected\':\'\'}}" ng-click="selectItem(row);" ',
                    'title="{{ getDesc(row) }}">',
                    '<span ng-repeat="col in list.schema.cols" ng-if="col.type!=\'hidden\'" ng-switch="col.type.toLowerCase()">',

			        '<span ng-switch-when="rowno" style="display:inline-block;width:20px;text-align:left;">{{rowsn}}.</span>',
			        '<span ng-switch-when="text">{{row[col.col]}}</span>',
			        '<span ng-switch-when="seperator" ng-bind-html="col.col"></span>',
			        '<span ng-switch-when="seperatoron" ng-if="!col.on || (row[col.on]!=\'\' && row[col.on])?true:false" ng-bind-html="col.col"></span>',
			        '<span ng-switch-when="imgvalue"><a class="wmliu-list-imgvalue wmliu-list-imgvalue-{{col.css}} wmliu-list-imgvalue-{{col.css}}-{{row[col.col]}}"></a></span>',

					'</span>',
					'</li>',
					'</ul>'
				  ].join(""),
        controller: function ($scope) {
            $scope.list.name 	= $scope.name;
			$scope.trans		= gcommon.trans;

            $scope.list.navi.head.loading = $scope.loading;
            $scope.list.navi.filterVals = $scope.list.navi.filterVals || {};
            $scope.list.schema.idvals = $scope.list.schema.idvals || {};
            $scope.list.rows = $scope.list.rows || [];

            $scope.pageTotal = function () {
                return Math.ceil($scope.list.navi.head.totalNo / $scope.list.navi.head.pageSize) == Infinity ? 0 : Math.ceil($scope.list.navi.head.totalNo / $scope.list.navi.head.pageSize);
            }

            wmliuListService.select[$scope.list.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid)
                            $scope.list.schema.idvals.pid = idvals.pid;
                        else
                            $scope.list.schema.idvals.pid = "";
                    } else {
                        $scope.list.schema.idvals.pid = "";
                    }
                } else {
                    $scope.list.schema.idvals.pid = "";
                }
            }

            wmliuListService.load[$scope.list.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.list.schema.idvals.pid = idvals.pid;
                        $scope.list.navi.head.pageNo = 1;
                    }
                }

                $scope.list.navi.head.action = "load";
                $scope.list.navi.head.loading = 1;

                var list_table = {};
                list_table.schema = $scope.list.schema;
                list_table.navi = $scope.list.navi;
                list_table.rows = [];
                wmliuListService.listAjax(list_table, $scope.list.navi.head.action, $scope);
            }

            wmliuListService.clear[$scope.list.name] = function () {
                $scope.list.schema.idvals.pid = "";
                $scope.list.navi.head.action = "load";
                $scope.list.navi.head.loading = 0;
                $scope.list.navi.head.pageNo = 0;
                $scope.list.navi.head.totalNo = 0;
                $scope.list.navi.filterVals.search = "";
                $scope.list.rows = [];
            }

            /*
            $scope.getTitle = function (item) {
            return $scope.list.list.title.colreplace(item);
            }
            */

            $scope.getDesc = function (row) {
                return $scope.list.schema.desc.colreplace(row);
            }

            $scope.selectItem = function (row) {
                if ($scope.list.schema.idvals.pid != row["pid"]) {
                    $scope.list.schema.idvals.pid = row["pid"];


                    // trigger event 
                    var listClick = wmliuListService.getListClick($scope.list.name);
                    if (angular.isFunction(listClick)) {
                        listClick(row);
                    }
                }
            }

            $scope.changeOrder = function () {
                wmliuListService.load[$scope.list.name]({pid: $scope.list.schema.idvals.pid});
            }

            $scope.naviKeydown = function (ev) {
                if (ev.keyCode == 13) {
                    $scope.naviPage();
                }
            }

            $scope.naviPage = function (btn_name) {
                var msg = "";
                var flag_ok = true;
                if ($scope.list.navi.head.totalNo <= 0) {
                    $scope.list.navi.head.pageNo = 0;
                    msg += "No record has been found !n\n";
                    flag_ok = false;
                } else if ($scope.list.navi.head.pageNo <= 0) {
                    $scope.list.navi.head.pageNo = 0;
                }

                if (isNaN($scope.list.navi.head.pageNo)) {
                    $scope.list.navi.head.pageNo = 1;
                    msg += "Page number is invalid or out of range!\n\n";
                    flag_ok = false;
                }
                if (isNaN($scope.list.navi.head.pageSize)) {
                    $scope.list.navi.head.pageSize = 20;
                    msg += "Page size is invalid or out of range ( 1~1000 ) !\n\n";
                    flag_ok = false;
                }

                if (!flag_ok) {
                    //alert(msg);
                    //return false;
                }

                switch (btn_name) {
                    case "first":
                        if ($scope.list.navi.head.pageNo <= 0) {
                            $scope.list.navi.head.pageNo = 0;
                            $scope.list.navi.head.loading = 0;
                        } else {
                            if ($scope.list.navi.head.pageNo > 1) {
                                $scope.list.navi.head.pageNo = 1;
                                $scope.list.navi.head.loading = 1;
                            }
                        }
                        $scope.list.navi.head.action = "load";
                        break;
                    case "prev":
                        if ($scope.list.navi.head.pageNo <= 0) {
                            $scope.list.navi.head.pageNo = 0;
                            $scope.list.navi.head.loading = 0;
                        } else {
                            if ($scope.list.navi.head.pageNo > 1) {
                                $scope.list.navi.head.pageNo--;
                                $scope.list.navi.head.loading = 1;
                            }
                        }
                        $scope.list.navi.head.action = "load";
                        break;
                    case "next":
                        if ($scope.list.navi.head.pageNo >= $scope.pageTotal()) {
                            $scope.list.navi.head.pageNo = $scope.pageTotal();
                            $scope.list.navi.head.loading = 0;
                        } else {
                            $scope.list.navi.head.pageNo++;
                            // do something
                            $scope.list.navi.head.loading = 1;
                        }
                        $scope.list.navi.head.action = "load";
                        break;
                    case "last":
                        if ($scope.list.navi.head.pageNo >= $scope.pageTotal()) {
                            $scope.list.navi.head.pageNo = $scope.pageTotal();
                            $scope.list.navi.head.loading = 0;
                        } else {
                            $scope.list.navi.head.pageNo = $scope.pageTotal();
                            // do something
                            $scope.list.navi.head.loading = 1;
                        }
                        $scope.list.navi.head.action = "load";
                        break;
                    case "go":
                        $scope.list.navi.head.pageNo = 1;
                        // do something
                        $scope.list.navi.head.loading = 1;
                        $scope.list.navi.head.action = "load";
                        break;
                    case "refresh":
                        $scope.list.navi.head.loading = 1;
                        $scope.list.navi.head.action = "load";  // refresh checklist, vlist, listlists
                        break;
                    default:
                        // do something
                        $scope.list.navi.head.loading = 1;
                        break;
                }

                if ($scope.list.navi.head.loading) {  // if request the same page, don't need to reload
                    // depend on action 

                    var search_list = {};
                    search_list.schema = $scope.list.schema;
                    search_list.navi = $scope.list.navi;
                    search_list.rows = [];

                    wmliuListService.listAjax(search_list, $scope.list.navi.head.action, $scope, $scope.list.navi.head.wait);
                }
                //console.log($scope.list.navi.head.pageNo);
            }


            // init list 

            if ($scope.loading == "1") {
                wmliuListService.load[$scope.list.name]();
            }


        }
    }
});




/******************************************************************************************
/*** Service ***/
wmliu_list.service("wmliuListService", function () {
    var self = this;
    self.select         = [];
    self.load           = [];
    self.clear          = [];
    self.callBack       = []; //angular.noop;
    self.listClick      = []; //angular.noop;

    this.listAjax = function (clist, action, sc) {
        if (sc.list.navi.head.wait == "1") wait_show();

        var evtObj = self.getCallBack(sc.list.name, action);
        if (evtObj) if (evtObj.before) if (angular.isFunction(evtObj.before)) evtObj.before(action, clist);

        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,

				list: clist
                // rows is not the same as list.rows, it will filter readonly field and no change rows
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (sc.list.navi.head.wait == "1") wait_hide();
                sc.list.navi.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, clist);
                //tool_tips("Error (wmliu_list_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.list.navi.head.wait == "1") wait_hide();
				errorHandler(req);
				if( req.errorCode < 900 ) {
	                self.updateListData(req.list, sc.list, sc);
				}
	            sc.list.navi.head.loading = 0;
				sc.$apply();
                if (evtObj) if (evtObj.success) if (angular.isFunction(evtObj.success)) evtObj.success(action, sc.list);
            },
            type: "post",
            url: "ajax/wmliu_list_data.php"
        });
    }

    self.updateListData = updateListData;

    self.setCallBack = function (eid, callbackFunc, action) {
        self.callBack[eid] = self.callBack[eid] || {};
        if (action) {
            if (angular.isArray(action)) {
                for (var key in action) {
                    self.callBack[eid][action[key]] = callbackFunc;
                }
            } else {
                self.callBack[eid][action] = callbackFunc;
            }
        } else {
            self.callBack[eid] = callbackFunc || {};
        }
    }

    self.getCallBack = function (eid, action) {
        var tmp = self.callBack[eid] || {};
        if (action && action != "") {
            if (tmp[action]) return tmp[action];
        }
        return tmp;
    }

    self.setListClick = function (eid, clickEvent) {
        self.listClick[eid] = self.listClick[eid] || {};
        self.listClick[eid] = clickEvent;
    }

    self.getListClick = function (eid) {
        var tmp = self.listClick[eid] || {};
        return tmp;
    }

});

/******************************************************************************************
/*** Javascript ***/

function updateListData (rlist, olist, sc) {
        olist.navi.head.loading = 0;
        if (rlist.navi.head) olist.navi.head = angular.copy(rlist.navi.head);
        if (rlist.rows) olist.rows = angular.copy(rlist.rows);
        sc.$apply();
}
