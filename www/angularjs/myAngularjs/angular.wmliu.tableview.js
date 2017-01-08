/***********************************************************************************************/
/* AngularJS  Table                                                                            */
/* Required:  angular3.15.js ; angular.wmliu.table.js                                          */
/* Required:  angular.wmliu.table.css                                                          */
/* Author:    William Liu                                                                      */
/* Date:      2015-05-31                                                                       */
/* column type:  rowno, hidden, text, textbox, email, number, datetime, date, time,            */
/*               search, url, textarea, bool, radio, checkbox, select, imgvalue, image,        */
/*               link, icon, button,   
require rights:  icon, button
require string list: ["save", "delete", "print","detail", "add"] -  icon, button   current support the list of action
require rights json: {"save":true, "delete":false, "print":false, "detail":true, "add":true}  like this
require json list: [{key:1, title:"", desc:""}, ...]  radio, checkbox, select

rowstate: 0 - normal,  1 - changed,  2 - added,  3 - deleted   

To Support:  Add, Save, Delete, Cancel icon state,  table.rows  add additional columns:  sn,  rowstate 
/***********************************************************************************************/
var wmliu_tableview = angular.module("wmliuTableview",  ["ngSanitize"]);
wmliu_tableview.directive("wmliu.tableview", function (wmliuTableviewService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            name: "@",
            table: "=",
            loading: "="
        },
        template: [
            '<span>',
		  	'<div class="{{naviCSS}} {{naviCSS}}-background" ng-init="naviCSS=\'wmliu-table-dbnav\'"><ng-form name="wmliuTable">',
		  	'<span style="float:left;">',
		  	'<span class="{{naviCSS}}-label">{{ trans[table.navi.head.lang].words[\'page\'] }}:</span>',

		  	'<input name="pageno" type="textbox" ng-keydown="naviKeydown($event)" class="{{naviCSS}}-pageSize" min="0" max="{{pageTotal()}}" ng-model="table.navi.head.pageNo"  />',

		  	'<span class="{{naviCSS}}-pineline">/</span><span class="{{naviCSS}}-value">{{pageTotal()}}</span>',

		  	'<span class="{{naviCSS}}-pineline">|</span>',
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-first" ng-click="naviPage(\'first\');" 	ng-class="{\'wmliu-table-dbnav-button-first-na\':table.navi.head.pageNo<=1 || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}" 			title="First"></a>',
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-prev"  ng-click="naviPage(\'prev\');" 	    ng-class="{\'wmliu-table-dbnav-button-prev-na\':table.navi.head.pageNo<=1 || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"			title="Previous"></a>',
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-next"  ng-click="naviPage(\'next\');"	    ng-class="{\'wmliu-table-dbnav-button-next-na\':table.navi.head.pageNo>=pageTotal() || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"	title="Next"></a>',
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-last"  ng-click="naviPage(\'last\');"	    ng-class="{\'wmliu-table-dbnav-button-last-na\':table.navi.head.pageNo>=pageTotal() || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}"	title="Last"></a>',
		  	'<span class="{{naviCSS}}-pineline">|</span>',

		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-loading" ng-if="table.navi.head.loading" title="LOADING..."></a>',
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-refresh" ng-if="!table.navi.head.loading" ng-click="naviPage(\'refresh\');" title="Refresh Table"></a>',
		  	'<span class="{{naviCSS}}-label">{{ trans[table.navi.head.lang].words[\'total\'] }}:</span><span class="{{naviCSS}}-value">{{table.navi.head.totalNo}}</span>',
		  	'</span>',
		  	'<span class="{{naviCSS}}-label" style="float:right; margin-right:10px;">{{ trans[table.navi.head.lang].words[\'page size\'] }}: ',
		  	'<input type="textbox" ng-keydown="naviKeydown($event)" class="{{naviCSS}}-pageSize" required min="1" max="200" maxlength="3" ng-model="table.navi.head.pageSize"  />',
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-go" ng-click="naviPage()" title="Go"></a></span>',
		  	'</ng-form></div>',

            '<table id="{{name}}" class="{{tbCSS}}" border="1" cellpadding="1" cellspacing="0" ng-init="tbCSS=\'wmliu-table\'">',

            '<tr class="wmliu-table-header">',
            '<th  ng-repeat="col in table.schema.cols" ng-if="col.type!=\'hidden\'" ng-switch="col.type.toLowerCase()" class="{{tbCSS}}-head-title {{tbCSS}}-{{table.schema.head.headCSS}}" align="{{col.type==\'icon\' || col.type==\'button\' || col.type==\'textbutton\'?col.align:\'center\'}}" valign="middle" width="{{col.width}}" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}">',

            '<span ng-switch-when="icon"  ng-init="iconCSS=\'wmliu-common-icon18\'">',
			    '<span ng-repeat="rdObj in table.buttons.head[col.type]" ng-if="allState(rdObj.key)">',
                '<a ng-click="buttonClick(rdObj.key, table.rows);" class="{{iconCSS}} {{iconCSS}}-{{rdObj.key}}" ng-class="allState(rdObj.key)?\'\':iconCSS+rdObj.key+\'-na\'" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}"></a>',
                '</span>',
            '</span>',

			'<span ng-switch-when="linkbutton" ng-init="lbtnCSS=\'wmliu-table-linkbutton\'">',
			    '<a ng-click="linkButtonClick(\'linkbutton\', table.rows)" class="{{lbtnCSS}}" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}">{{col.title?col.title:col.col.uword()}}</a>',
            '</span>',

            '<span ng-switch-when="textbutton"  ng-init="tbtnCSS=\'wmliu-table-textbutton\'">',
			    '<span ng-repeat="rdObj in table.buttons.head[col.type]" ng-if="allState(rdObj.key)">',
                '<a ng-click="buttonClick(rdObj.key, table.rows);" class="{{tbtnCSS}}" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">{{rdObj.title?rdObj.title:rdObj.key.uword()}}</a>',
                '</span>',
            '</span>',

			'<span ng-switch-when="button" ng-init="btnCSS=\'wmliu-table-button\'">',
			    '<span ng-repeat="rdObj in table.buttons.head[col.type]" ng-if="allState(rdObj.key)">',
                '<input type="button" ng-click="buttonClick(rdObj.key, table.rows);" class="{{btnCSS}}" ng-disabled="!allState(rdObj.key)" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}" value="{{rdObj.title?rdObj.title:rdObj.key.uword()}}" />',
                '</span>',
            '</span>',

            '<span ng-switch-default>{{col.title?col.title:col.col.uword()}}</span> ',
            '<a ng-if="col.sort" ng-click="resort(col);" ng-class="{\'wmliu-table-sort\':col.sort, \'wmliu-table-sort-asc\':(col.col==table.navi.head.orderBY && table.navi.head.orderSN.toUpperCase()==\'ASC\'), \'wmliu-table-sort-desc\':(col.col==table.navi.head.orderBY && table.navi.head.orderSN.toUpperCase()==\'DESC\')}"></a>',
            '</th>',
            '</tr>',

            '<tr class="wmliu-table-rows" ng-repeat="row in table.rows" ng-init="row.sn=$index;" rid="{{$index}}" class="{{tbCSS}}-row {{tbCSS}}-{{table.schema.head.rowCSS}}" ng-class-even="tbCSS+\'-row-even\' + \' \' + tbCSS+\'-\'+table.schema.head.evenCSS"  ng-class-odd="tbCSS+\'-row-odd\' + \' \' + tbCSS+\'-\'+table.schema.head.oddCSS">',

            '<td  ng-repeat="col in table.schema.cols" ng-if="col.type!=\'hidden\'" ng-switch="col.type.toLowerCase()" ',
            'ng-class="{\'wmliu-table-row-nowrap\':col.nowrap}" ng-init="colCSS=tbCSS + \'-col\'"',
            'align="{{col.align}}" valign="{{col.valign}}" width="{{col.width}}" style="min-width:20px;" title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:col.desc?col.desc:col.title?col.title:col.col.uword()}}">',

			'<span ng-switch-when="rowno" ng-init="stateCSS=\'wmliu-common-state18\'">',
            '<span ng-if="!row.rowstate">{{ row.sn + 1 }}</span>',
            '<span ng-if="row.rowstate"><a class="{{stateCSS}} {{stateCSS+\'-\'+row.rowstate}} {{row.error>0?\'wmliu-common-state18 wmliu-common-state18-4\':\'\'}}" title="{{row.error>0?row.errorMessage:\'\'}}"></a></span>',
            '</span>',

			//'<span ng-switch-when="text" class="{{colCSS}}-{{col.inputcss}}">{{row[col.col] && row[col.col]!="null"?row[col.col]:""}}</span>',
			'<span ng-switch-when="text" ng-if="!col.nl2br" class="{{colCSS}}-{{col.inputcss}}">{{row[col.col] && row[col.col]!="null"?row[col.col]:""}}</span>',
			'<span ng-switch-when="text" ng-if="col.nl2br" class="{{colCSS}}-{{col.inputcss}}" ng-bind-html="(\'\' + row[col.col]).nl2br()"></span>',

            '<span ng-switch-when="vtext" class="wmliu-common-input-checked {{colCSS}}-vtext {{colCSS}}-{{col.inputcss}}">',
                '<span style="{{row.errorMessage[col.col]?\'color:red;\':\'\'}}">',
                    '{{ row.errorMessage[col.col]?row.errorMessage[col.col]: table.listTables.vlist[col.col][row[col.col]] }}',
                    '<span ng-if="col.other">{{ (row[col.other] && table.listTables.vlist[col.col][row[col.col]]?\', \':\'\') + row[col.other] }}</span>',
                '</span>',
             '</span>',

            '<span ng-switch-when="ptext" class="{{colCSS}}-vtext {{colCSS}}-{{col.inputcss}}">',
            '<span style="{{row.errorMessage[col.col]?\'color:red;\':\'\'}}">',
            '{{ row.errorMessage[col.col]?row.errorMessage[col.col]: table.schema.idvals[col.col] }}',
            '</span></span>',

            '<span ng-switch-when="cktext" class="wmliu-common-input-checked {{colCSS}}-cktext {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}">',
            '<span ng-repeat="ckitem in row[col.col]">{{ table.listTables.vlist[col.col][ckitem]?table.listTables.vlist[col.col][ckitem]:\'\' }}<span ng-if="!$last">,</span> <br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" /></span>',
            '<span ng-if="col.other">{{ (row[col.other] && row[col.col].length>0?\', \':\'\') + row[col.other] }}</span>',
            '</span>',

            '<span ng-switch-when="mtext" class="{{colCSS}}-mtext {{colCSS}}-{{col.inputcss}}">',
            '{{ col.col.colreplace(row) }}',
            '</span>',

			'<span ng-switch-when="textbox"><input type="textbox"  ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
			'<span ng-switch-when="textarea"><textarea             ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea></span>',

        // bool  nowrap used to show  title or not 
			'<span ng-switch-when="bool">',
	            '<label class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-class="{\'wmliu-common-input-checked\':row[col.col]}" title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:col.desc}}">',
			    '<input type="checkbox" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}" /><span ng-if="col.nowrap">{{col.title?col.title:col.col.uword()}}</span>',
                '</label>',
            '</span>',


			'<span ng-switch-when="select">',
			    '<select class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ',
                         'ng-model="row[col.col]" ',
                         'ng-options="sObj.key as (sObj.title?sObj.title:sObj.key.uword()) for sObj in table.listTables.checklist[col.col]" ',
                         'ng-change="changeState(col, row, table.oldrows[row.sn]);">',
			        '<option value=""></option>',
                '</select>',
            '</span>',

        // imgvalue   css is important to identify 
			'<span ng-switch-when="imgvalue" ng-init="imgValCSS=\'wmliu-table-imgvalue\'">',
    			'<a ng-class="[imgValCSS, imgValCSS+\'-\'+col.css, imgValCSS+\'-\'+col.css+ \'-\'+ row[col.col] ]" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}} : {{row[col.col]}}" /></a>',
            '</span>',

			'<span ng-switch-when="image" ng-if="row[col.col]">',
			'<img src="{{row[col.col]}}" width="{{col.width}}"  title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}" />',
			'</span>',

			'<span ng-switch-when="thumb" ng-if="row[col.col]">',
			'<img src="{{row[col.col]}}" width="{{col.width>0?col.width:50}}" class="table-image-thumb" imgid="{{row.sid}}" ng-click="showImage(row.sid, table.navi.head.imgsettings.singleImage)" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}" />',
			//'<img src="{{row[col.col]}}" width="{{col.width>0?col.width:50}}"  ng-click="showImage(row.sid)" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}" />',
			'</span>',

			'<span ng-switch-when="linkupload" ng-init="lbtnCSS=\'wmliu-table-linkbutton\'" ng-if="row.rowstate==0">',
			    '<a ng-click="linkUpload(row.sid, table.navi.head.imgsettings.singleImage)" class="{{lbtnCSS}}" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}">{{col.title?col.title:col.col.uword()}}</a>',
            '</span>',

			'<span ng-switch-when="linkbutton" ng-init="lbtnCSS=\'wmliu-table-linkbutton\'">',
			    '<a ng-click="linkButtonClick(\'linkbutton\', row)" class="{{lbtnCSS}}" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}">{{col.title?col.title:col.col.uword()}}</a>',
            '</span>',

			'<span ng-switch-when="link" ng-if="row[col.col]!=\'\' && row[col.col]">',
			    '<a href="{{row[col.col]}}" class="wmliu-table-linkbutton" target="_blank" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}">{{col.title?col.title:col.col.uword()}}</a>',
            '</span>',


			'<span ng-switch-when="date"><input type="text" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="wmliu-common-date {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" /></span>',
			'<span ng-switch-when="time"><input type="text" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="wmliu-common-time {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" /></span>',

			'<span ng-switch-when="intdate">{{ row[col.col]?row[col.col]>0?(row[col.col] * 1000 | date : "yyyy-MM-dd hh:mm:ss") : "" : ""  }}</span>',

            '<span ng-switch-when="ymdtext">{{ row[col.col]?row[col.col]:"" }}</span>',
			'<span ng-switch-when="hitext">{{ row[col.col]?row[col.col]:"" }}</span>',
			'<span ng-switch-when="ymdhitext">{{ row[col.col]?row[col.col]:"" }}</span>',
			'<span ng-switch-when="datetimetext">{{ row[col.col]?row[col.col]:"" }}</span>',


			'<span ng-switch-when="icon" ng-init="iconCSS=\'wmliu-common-icon18\'">',
			    '<span ng-repeat="rdObj in table.buttons.row[col.type]" ng-if="buttonState(row.rowstate, rdObj.key)">',
                '<a ng-click="buttonClick(rdObj.key, row);" class="{{iconCSS}} {{iconCSS}}-{{rdObj.key}}" ng-class="buttonState(row.rowstate, rdObj.key)?\'\':iconCSS+\'-\'+rdObj.key+\'-na\'" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}"></a>',
                '</span>',
            '</span>',

			'<span ng-switch-when="textbutton" ng-init="tbtnCSS=\'wmliu-table-textbutton\'">',
			    '<span ng-repeat="rdObj in table.buttons.row[col.type]" ng-if="buttonState(row.rowstate, rdObj.key)">',
                '<a ng-click="buttonClick(rdObj.key, row);" ng-class="tbtnCSS" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">{{rdObj.title?rdObj.title:rdObj.key.uword()}}</a>',
                '</span>',
            '</span>',

			'<span ng-switch-when="button" ng-init="btnCSS=\'wmliu-table-button\'">',
			    '<span ng-repeat="rdObj in table.buttons.row[col.type]" ng-if="buttonState(row.rowstate, rdObj.key)">',
                '<input type="button"  ng-click="buttonClick(rdObj.key, row);" class="{{btnCSS}}" ng-disabled="!buttonState(row.rowstate, rdObj.key)" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}" value="{{rdObj.title?rdObj.title:rdObj.key.uword()}}" />',
                '</span>',
            '</span>',

            '</td>',
			'<tr>',
            '</table>',
            '</span>'
        ].join(""),
        transclude: false,
        controller: function ($scope) {
            //initial table object,  add missing required object
            $scope.table.name 	= $scope.name;
            $scope.basic 		= gcommon.basic;
			$scope.trans		= gcommon.trans;
			
			// image show 			
			$scope.showImage = function(ref_id) {
				ishow.refid(ref_id);
			}

            for (var key in $scope.table.rows) {
                $scope.table.rows[key].sn = parseInt(key);
                $scope.table.rows[key].rowstate = 0;
                $scope.table.rows[key].error = 0;
                $scope.table.rows[key].errorMessage = {};
            }
            $scope.table.oldrows = angular.copy($scope.table.rows);

            $scope.table.schema.idvals = $scope.table.schema.idvals ? $scope.table.schema.idvals : {};
            $scope.table.listTables = $scope.table.listTables || {};
            $scope.table.listTables.checklist = $scope.table.listTables.checklist || {};
            $scope.table.listTables.vlist = $scope.table.listTables.vlist || {};
            $scope.table.listTables.listItems = $scope.table.listTables.listItems || {};

            // $scope.table.navi.filterVals - created by search.form
            // $scope.table.schema.table.xxtable.filterCols  created by search.component
            // $scope.table.schema.table.xxtable.filterCols.xxx  created by search.component

            // load data function for external call
            /*** method *********************/
            wmliuTableviewService.init[$scope.table.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.table.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.table.schema.idvals.sid = idvals.sid;
                    }
                }

                $scope.table.navi.head.action = "init";
                $scope.table.navi.head.loading = 1;
                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                wmliuTableviewService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }


            wmliuTableviewService.fresh[$scope.table.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.table.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.table.schema.idvals.sid = idvals.sid;
                        $scope.table.navi.head.pageNo = 0;
                    }
                }

                $scope.table.navi.head.action = "fresh";
                $scope.table.navi.head.loading = 1;
                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                search_table.rows = [];
                wmliuTableviewService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }

            wmliuTableviewService.load[$scope.table.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.table.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.table.schema.idvals.sid = idvals.sid;
                        $scope.table.navi.head.pageNo = 0;
                    }
                }

                $scope.table.navi.head.action = "load";
                $scope.table.navi.head.loading = 1;

                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                search_table.rows = [];
                wmliuTableviewService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }

            // just clear , no ajax call
            wmliuTableviewService.clear[$scope.table.name] = function () {
                $scope.table.schema.idvals.pid = "";
                $scope.table.schema.idvals.sid = "";

                $scope.table.navi.head.pageNo = 0;
                $scope.table.navi.head.action = "load";
                $scope.table.navi.head.loading = 0;
                $scope.table.rows = [];
            }


            $scope.search = function () {
                $scope.table.navi.head.pageNo = 0;
                $scope.table.navi.head.action = "load";

                $scope.table.navi.head.loading = 1;

                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                search_table.rows = [];
                wmliuTableviewService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }

            $scope.getErrMsg = function (msgs) {
                var ret_msg = "";
                for (var key in msgs) {
                    ret_msg += msgs[key] + "\n";
                }
                return ret_msg;
            }

            $scope.pageTotal = function () {
                return Math.ceil($scope.table.navi.head.totalNo / $scope.table.navi.head.pageSize);
            }

            $scope.changeState = function (colObj, curRow, oldRow) {
                if (curRow.rowstate < 2) {
                    if (angular.isObject(curRow[colObj.col]) || angular.isArray(curRow[colObj.col])) {
                        for (var key in curRow[colObj.col]) {
                            if (oldRow[colObj.col]) {
                                if (curRow[colObj.col][key] != oldRow[colObj.col][key]) {
                                    curRow.rowstate = 1;
                                    break;
                                }
                            } else {
                                curRow.rowstate = 1;
                            }
                        }
                    } else {
                        if (curRow[colObj.col] != oldRow[colObj.col]) {
                            curRow.rowstate = 1;
                        } else {
                            //curRow.rowstate = 0;
                        }
                    }

                    if (colObj.other) {
                        if (curRow[colObj.other] != oldRow[colObj.other]) curRow.rowstate = 1;
                    }
                }
            }

            $scope.allState = function (btn_name) {
                var btnActive1 = false;
                var rowState = 0;
                for (var key in $scope.table.rows) {
                    rowState = $scope.table.rows[key].rowstate > rowState ? $scope.table.rows[key].rowstate : rowState;
                }
                btnActive1 = $scope.table.buttons.rights[btn_name] && wmliuTableviewService.allActive[rowState][btn_name];
                return btnActive1;
            }

            $scope.buttonState = function (rowState, btn_name) {
                //console.log("button state: " + rowState + " : "  + btn_name);
                var btnActive1 = false;
                if (!rowState) rowState = 0;
                btnActive1 = $scope.table.buttons.rights[btn_name] && wmliuTableviewService.btnActive[rowState][btn_name];
                return btnActive1;
            }

            $scope.resort = function (col) {
                if (col.col == $scope.table.navi.head.orderBY) {
                    if (angular.uppercase($scope.table.navi.head.orderSN) == "ASC")
                        $scope.table.navi.head.orderSN = "DESC";
                    else
                        $scope.table.navi.head.orderSN = "ASC";
                } else {
                    $scope.table.navi.head.orderBY = col.col;
                    if (col.sort)
                        $scope.table.navi.head.orderSN = angular.uppercase(col.sort);
                    else
                        $scope.table.navi.head.orderSN = "ASC";
                    //console.log("change : " + col.col + "  sort:" + col.sort);
                }
                $scope.naviPage();
            }

            $scope.naviPage = function (btn_name) {
                var msg = "";
                var flag_ok = true;
                if ($scope.table.navi.head.totalNo <= 0) {
                    $scope.table.navi.head.pageNo = 0;
                    msg += "No record has been found !n\n";
                    flag_ok = false;
                } else if ($scope.table.navi.head.pageNo <= 0) {
                    $scope.table.navi.head.pageNo = 0;
                }

                if (isNaN($scope.table.navi.head.pageNo)) {
                    $scope.table.navi.head.pageNo = 1;
                    msg += "Page number is invalid or out of range!\n\n";
                    flag_ok = false;
                }
                if (isNaN($scope.table.navi.head.pageSize)) {
                    $scope.table.navi.head.pageSize = 20;
                    msg += "Page size is invalid or out of range ( 1~1000 ) !\n\n";
                    flag_ok = false;
                }

                if (!flag_ok) {
                    //alert(msg);
                    //return false;
                }

                switch (btn_name) {
                    case "first":
                        if ($scope.table.navi.head.pageNo <= 0) {
                            $scope.table.navi.head.pageNo = 0;
                            $scope.table.navi.head.loading = 0;
                        } else {
                            if ($scope.table.navi.head.pageNo > 1) {
                                $scope.table.navi.head.pageNo = 1;
                                $scope.table.navi.head.loading = 1;
                            }
                        }
                        $scope.table.navi.head.action = "load";
                        break;
                    case "prev":
                        if ($scope.table.navi.head.pageNo <= 0) {
                            $scope.table.navi.head.pageNo = 0;
                            $scope.table.navi.head.loading = 0;
                        } else {
                            if ($scope.table.navi.head.pageNo > 1) {
                                $scope.table.navi.head.pageNo--;
                                $scope.table.navi.head.loading = 1;
                            }
                        }
                        $scope.table.navi.head.action = "load";
                        break;
                    case "next":
                        if ($scope.table.navi.head.pageNo >= $scope.pageTotal()) {
                            $scope.table.navi.head.pageNo = $scope.pageTotal();
                            $scope.table.navi.head.loading = 0;
                        } else {
                            $scope.table.navi.head.pageNo++;
                            // do something
                            $scope.table.navi.head.loading = 1;
                        }
                        $scope.table.navi.head.action = "load";
                        break;
                    case "last":
                        if ($scope.table.navi.head.pageNo >= $scope.pageTotal()) {
                            $scope.table.navi.head.pageNo = $scope.pageTotal();
                            $scope.table.navi.head.loading = 0;
                        } else {
                            $scope.table.navi.head.pageNo = $scope.pageTotal();
                            // do something
                            $scope.table.navi.head.loading = 1;
                        }
                        $scope.table.navi.head.action = "load";
                        break;
                    case "go":
                        $scope.table.navi.head.pageNo = 1;
                        // do something
                        $scope.table.navi.head.loading = 1;

                        $scope.table.navi.head.action = "load";
                        break;
                    case "refresh":
                        $scope.table.navi.head.loading = 1;
                        $scope.table.navi.head.action = "fresh";  // refresh checklist, vlist, listTables
                        break;
                    default:
                        // do something
                        $scope.table.navi.head.action = "load";
                        $scope.table.navi.head.loading = 1;
                        break;
                }

                if ($scope.table.navi.head.loading) {  // if request the same page, don't need to reload
                    // depend on action 
                    var search_table = {};
                    search_table.schema = $scope.table.schema;
                    search_table.navi = $scope.table.navi;
                    search_table.rows = [];

                    wmliuTableviewService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
                }
                //console.log($scope.table.navi.head.pageNo);
            }

            $scope.naviKeydown = function (ev) {
                if (ev.keyCode == 13) {
                    $scope.naviPage();
                }
            }

            $scope.linkButtonClick = function (action, rowsObj) {
                var paramObj = [];
                if (angular.isArray(rowsObj))
                    paramObj = rowsObj;
                else
                    paramObj.push(rowsObj);

                var update_table = {};
                update_table.schema = $scope.table.schema;
                update_table.navi = $scope.table.navi;
                update_table.rows = paramObj;

                wmliuTableviewService.tableAjax(update_table, action, $scope, $scope.buttons.row.wait);
            }



            $scope.buttonClick = function (action, rowsObj) {
                $scope.table.navi.head.action = action;
                if ($scope.table.buttons.rights[action]) {
                    var btnClick = wmliuTableviewService.getButtonClick($scope.table.name, action);
                    var paramObj = [];
                    switch (action) {
                        case "detail":
                            if (angular.isArray(rowsObj)) {
                                paramObj = rowsObj;
                            } else {
                                paramObj.push(rowsObj);
                            }
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, paramObj);
                            break;
                        case "output":
                        case "print":
                            if (angular.isArray(rowsObj)) {
                                paramObj = rowsObj;
                            } else {
                                paramObj.push(rowsObj);
                            }
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, paramObj);
                            break;
                        case "cancel":
                            if (angular.isArray(rowsObj)) {
                                //  rowObj is rowObj Array
                                paramObj = rowsObj;
                                for (var key = rowsObj.length - 1; key >= 0; key--) {
                                    switch (rowsObj[key].rowstate) {
                                        case 0:
                                            break;
                                        case 2:
                                            var del_idx = $scope.table.rows.indexOf(rowsObj[key]);
                                            $scope.table.rows.splice(del_idx, 1);
                                            $scope.table.oldrows.splice(del_idx, 1);

                                            for (var i = 0; i < $scope.table.rows.length; i++) {
                                                $scope.table.rows[i]["sn"] = $scope.table.rows[i]["sn"] > del_idx ? $scope.table.rows[i]["sn"] - 1 : $scope.table.rows[i]["sn"];
                                            }

                                            for (var i = 0; i < $scope.table.oldrows.length; i++) {
                                                $scope.table.oldrows[i]["sn"] = $scope.table.oldrows[i]["sn"] > del_idx ? $scope.table.oldrows[i]["sn"] - 1 : $scope.table.oldrows[i]["sn"];
                                            }
                                            break;
                                        case 1:
                                        case 3:
                                            for (var col in $scope.table.rows[rowsObj[key].sn]) {
                                                $scope.table.rows[rowsObj[key].sn][col] = angular.copy($scope.table.oldrows[rowsObj[key].sn][col]);
                                            }
                                            break;

                                    }

                                }

                            } else {
                                // single row , rowObj
                                paramObj.push(rowsObj);
                                switch (rowsObj.rowstate) {
                                    case 0:
                                        break;
                                    case 2:
                                        var del_idx = $scope.table.rows.indexOf(rowsObj);
                                        $scope.table.rows.splice(del_idx, 1);
                                        $scope.table.oldrows.splice(del_idx, 1);

                                        for (var i = 0; i < $scope.table.rows.length; i++) {
                                            $scope.table.rows[i]["sn"] = $scope.table.rows[i]["sn"] > del_idx ? $scope.table.rows[i]["sn"] - 1 : $scope.table.rows[i]["sn"];
                                        }

                                        for (var i = 0; i < $scope.table.oldrows.length; i++) {
                                            $scope.table.oldrows[i]["sn"] = $scope.table.oldrows[i]["sn"] > del_idx ? $scope.table.oldrows[i]["sn"] - 1 : $scope.table.oldrows[i]["sn"];
                                        }
                                        break;
                                    case 1:
                                    case 3:
                                        for (var col in $scope.table.rows[rowsObj.sn]) {
                                            $scope.table.rows[rowsObj.sn][col] = angular.copy($scope.table.oldrows[rowsObj.sn][col]);
                                        }
                                        break;

                                }
                            }
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, rowsObj);
                            break;
                        case "delete":
                            // only support single row delete,  so rowObj is object
                            rowsObj.rowstate = 3;
                            paramObj.push(rowsObj);
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, paramObj);
                            break;
                        case "save":
                            // only send editable cols,  so we need to filter readonly col out of post
                            if (btnClick) if (angular.isFunction(btnClick)) { btnClick(action, rowsObj); }

                            if (angular.isArray(rowsObj)) {
                                for (var key in rowsObj) {
                                    if (rowsObj[key].rowstate > 0) paramObj.push(rowsObj[key]);
                                }
                            } else {
                                paramObj.push(rowsObj);
                            }

                            var update_table = {};
                            update_table.schema = $scope.table.schema;
                            update_table.navi = $scope.table.navi;
                            update_table.rows = paramObj;

                            wmliuTableviewService.tableAjax(update_table, action, $scope, $scope.table.buttons.row.wait);

                            //console.log(paramObj);
                            break;
                        case "add":  // only add one row once
                            //$scope.table.rows.push({ sn: $scope.table.rows.length, rowstate: 2 });
                            //paramObj.push($scope.table.rows[$scope.table.rows.length - 1]);
                            for (var i = 0; i < $scope.table.rows.length; i++) {
                                $scope.table.rows[i]["sn"] = $scope.table.rows[i]["sn"] + 1;
                            }
                            for (var i = 0; i < $scope.table.oldrows.length; i++) {
                                $scope.table.oldrows[i]["sn"] = $scope.table.oldrows[i]["sn"] + 1;
                            }

                            var newRow = { sn: 0, rowstate: 2, refcheck: true };

                            if (btnClick) if (angular.isFunction(btnClick)) { btnClick(action, newRow); }

                            $scope.table.rows.unshift(angular.copy(newRow));
                            $scope.table.oldrows.unshift(angular.copy(newRow));

                            paramObj.push($scope.table.rows[0]);

                            break;
                    }
                }
                else {
                    //console.log("You don't have right");
                }
            }
            /********************************/

            if ($scope.loading == "1") {
                wmliuTableviewService.fresh[$scope.table.name]();
            } else {
                wmliuTableviewService.init[$scope.table.name]();
            }

        }, // end of controller
    	
        link: function (sc, attr, ctr) {
            $(function () { 
				if( sc.table.navi.head.imgsettings ) {
					wmliuTable_iupload = new LWH.AjaxImage({
										lang:		sc.table.navi.head.lang,
										name:		sc.table.name + "_upload", 
										filter:		sc.table.navi.head.imgsettings.filter,
										singleImage:sc.table.navi.head.imgsettings.singleImage,
										trigger:	"",
										mode:		sc.table.navi.head.imgsettings.mode,
										view:		sc.table.navi.head.imgsettings.view,
										thuww:		sc.table.navi.head.imgsettings.ww?sc.table.navi.head.imgsettings.ww:120, 
										thuhh:		sc.table.navi.head.imgsettings.hh?sc.table.navi.head.imgsettings.hh:100, 
										
										triggerClick: function(obj) {
										},
										after:		function(obj) {
											if(obj.errorCode <= 0 ) {
												var imgObj = obj.data.imgObj;
												if(	$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src") == "" )
													$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw["thumb"]);
											}
										}
									});
					wmliuTable_ishow = new LWH.ImageShow({	
												lang:	sc.table.navi.head.lang, 
												name:	sc.table.name + "_thumb", 
												filter: sc.table.navi.head.imgsettings.filter,
												mode:	sc.table.navi.head.imgsettings.mode,
												view:	sc.table.navi.head.imgsettings.view,
												
	
												tips:	sc.table.navi.head.imgsettings.tips, 
												edit:	sc.table.navi.head.imgsettings.edit,
												single:	sc.table.navi.head.imgsettings.single,  
												singleImage:	sc.table.navi.head.imgsettings.singleImage,  
												
												ww:		sc.table.navi.head.imgsettings.ww?sc.table.navi.head.imgsettings.ww:0, 
												hh:		sc.table.navi.head.imgsettings.hh?sc.table.navi.head.imgsettings.hh:0, 
												imgww:	sc.table.navi.head.imgsettings.imgww?sc.table.navi.head.imgsettings.imgww:640,
												imghh:	sc.table.navi.head.imgsettings.imghh?sc.table.navi.head.imgsettings.imghh:480, 
												cropww: sc.table.navi.head.imgsettings.cropww?sc.table.navi.head.imgsettings.cropww:100, 
												crophh:	sc.table.navi.head.imgsettings.crophh?sc.table.navi.head.imgsettings.crophh:0, 
												orient:	sc.table.navi.head.imgsettings.orient?sc.table.navi.head.imgsettings.orient:"hv",
												cropCall: function(imgObj) {
													if(imgObj.id) {
														if(wmliuTable_ishow.settings.single) {
															if(wmliuTable_ishow.settings.singleImage)
																$("img.table-image-thumb[imgid='" + imgObj.id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw[sc.table.navi.head.imgsettings.view]);
															else 
																$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw[sc.table.navi.head.imgsettings.view]);
														} else {
															if( wmliuTable_ishow.imgList.length > 0 ) {
																imgObj = wmliuTable_ishow.imgList[0];
																$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw[sc.table.navi.head.imgsettings.view]);
															} else {
																$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", "");
															}
														}
													} else {
														$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", "");
													}
												},
												viewClick: function(imgObj) {
													if(imgObj.id) {
														if(wmliuTable_ishow.settings.single) {
															if(wmliuTable_ishow.settings.singleImage)
																$("img.table-image-thumb[imgid='" + imgObj.id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw[sc.table.navi.head.imgsettings.view]);
															else 
																$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw[sc.table.navi.head.imgsettings.view]);
															
														} else {
															if( wmliuTable_ishow.imgList.length > 0 ) {
																imgObj = wmliuTable_ishow.imgList[0];
																$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", imgObj.raw[sc.table.navi.head.imgsettings.view]);
															} else {
																$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", "");
															}
														}
													} else {
														$("img.table-image-thumb[imgid='" + imgObj.ref_id + "']", $("#" + sc.table.name)).attr("src", "");
													}
												}
								});
				} // end of imgsettings

			});
		}
	
	}
});


/**********************************************************************************************/
/*** Service ***/
wmliu_tableview.service("wmliuTableviewService", function ($filter) {
    var self = this;
    self.callBack = []; //angular.noop;
    self.buttonClick = []; //angular.noop;
    self.listClick = []; //angular.noop;

    self.init   = [];
    self.fresh  = [];
    self.load = [];
    self.view = [];
    self.clear = [];
	
	self.basic = {
	}

    self.editable = ["hidden", "textbox", "email", "number", "datetime", "date", "time", "search", "url", "textarea", "bool", "radio", "checkbox", "select"];
    self.btnActive = {
        0: { "detail": 1, "save": 0, "add": 1, "delete": 1, "cancel": 0, "print": 1, "output": 1 },
        1: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        2: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        3: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 }
    };

    self.allActive = {
        0: { "detail": 1, "save": 0, "add": 1, "delete": 0, "cancel": 0, "print": 1, "output": 1 },
        1: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        2: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        3: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 }
    };


    this.tableAjax = function (ctable, action, sc, wait) {
        if (wait == "1") wait_show();

        var evtObj = self.getCallBack(sc.table.name, action);
        if (evtObj) if (evtObj.before) if (angular.isFunction(evtObj.before)) evtObj.before(action, ctable);

        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                table: ctable
                // do not need to send rows
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (wait == "1") wait_hide();
                sc.table.navi.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, ctable);
                //tool_tips("Error (wmliu_tableview_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (wait == "1") wait_hide();
				
				errorHandler(req);
                sc.table.navi.head.loading = 0;
				sc.$apply();
				
				if( req.errorCode < 900 ) {
					if (action == "save") {
						self.updateRow(req.table, sc);
						var ok = 0;
						for (var key in req.table.rows) {
							ok = ok || req.table.rows[key].error;
						}
						if (ok < 1) tool_tips(gcommon.trans[sc.table.navi.head.lang].words["save success"]);
					} else {
						self.updateData(req.table, sc);
					}
				}

                if (evtObj) if (evtObj.success) if (angular.isFunction(evtObj.success)) evtObj.success(action, sc.table);
            },
            type: "post",
            url: "ajax/wmliu_tableview_data.php"
        });
    }

    self.updateData = updateTableData;

    self.updateRow = udpateTableRow;


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


    self.setButtonClick = function (eid, clickEvent, action) {
        self.buttonClick[eid] = self.buttonClick[eid] || {};
        if (action) {
            if (angular.isArray(action)) {
                for(var key in action) {
                    self.buttonClick[eid][action[key]] = clickEvent;
                }
            } else {
                self.buttonClick[eid][action] = clickEvent;
            }
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

    this.efilter = function (cols, vObj) {
        var nObj = {};

        var colsObj = {};
        for (var key in cols) {
            if (cols[key].col != "") {
                colsObj[cols[key].col] = cols[key].type;
            }
        }
        //console.log(colsObj);

        nObj["sn"] = vObj["sn"];
        nObj["rowstate"] = vObj["rowstate"];
        for (var key in vObj) {
            if (self.editable.indexOf(colsObj[key]) >= 0) {
                nObj[key] = vObj[key];
            }
        }
        //console.log(nObj);
        return nObj;
    }

    this.merge = function (obj2, obj1) { // Our merge function
        var result = {}; // return result
        for (var i in obj1) {      // for every property in obj1 
            if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                result[i] = this.merge(obj2[i], obj1[i]); // if it's an object, merge   
            } else {
                result[i] = obj1[i]; // add it to result
            }
        }
        for (i in obj2) { // add the remaining properties from object 2
            if (i in result) { //conflict
                continue;
            }
            result[i] = obj2[i];
        }
        return result;
    }

});



/*** Javascript Function ***/
function wmliu_tableview_highlight(eid) {
	if(eid) {
		$("tr.wmliu-table-rows", "table#" + eid).die("mouseover").live("mouseover", function() { 
			//$("tr.wmliu-table-rows", "table#" + eid).removeClass("tr-highlight");
			$(this).addClass("wmliu-table-row-highlight");
		}).die("mouseout").live("mouseout", function(){
			$(this).removeClass("wmliu-table-row-highlight");
		});
	} else {
		$("tr.wmliu-table-rows", "table.wmliu-table").die("mouseover").live("mouseover", function() { 
			//$("tr.wmliu-table-rows", "table.wmliu-table").removeClass("tr-highlight");
			$(this).addClass("wmliu-table-row-highlight");
		}).die("mouseout").live("mouseout", function(){
			$(this).removeClass("wmliu-table-row-highlight");
		});
	}
}

function updateTableData(rtable, sc) {
    sc.table.navi.head.loading = 0;
    if (rtable) {
        sc.table.navi.head.totalNo = parseInt(rtable.navi.head.totalNo);
        sc.table.navi.head.pageNo  = parseInt(rtable.navi.head.pageNo);
        sc.table.navi.head.pageSize= parseInt(rtable.navi.head.pageSize)>0?parseInt(rtable.navi.head.pageSize):20;
        sc.table.navi.head.orderSN = rtable.navi.head.orderSN;

        if (rtable.schema.idvals) sc.table.schema.idvals = rtable.schema.idvals;

        //after update, set action to view,  prepare for load data
        if (rtable.listTables) sc.table.listTables = angular.copy(rtable.listTables);


        if (rtable.rows) {
            for (var key in rtable.rows) {
                rtable.rows[key].rowstate = 0;
                rtable.rows[key].sn = parseInt(key);
            }

            sc.table.rows = angular.copy(rtable.rows);
            sc.table.oldrows = angular.copy(rtable.rows);
        }
    }
    sc.$apply();
	
	$(".wmliu-common-date", "*[name='" + sc.table.name + "']").datepicker({
		dateFormat: 'yy-mm-dd',
		showOn: "button",
		buttonImage: "theme/light/image/icon/calendar.png",
		buttonImageOnly: true
	});
  
}

function udpateTableRow(rtable, sc) {
    sc.table.navi.head.loading = 0;
    sc.table.navi.head.totalNo  = rtable.navi.head.totalNo;
    //sc.table.navi.head.pageNo   = rtable.navi.head.pageNo;

    for (var rowIdx = rtable.rows.length - 1; rowIdx >= 0; rowIdx--) {
        rtable.rows[rowIdx].sn = parseInt(rtable.rows[rowIdx].sn);
        var rowsn = rtable.rows[rowIdx].sn;

        switch (sc.table.rows[rowsn].rowstate) {
            case 1:
            case 2:
                if (rtable.rows[rowIdx].rowstate == 0) {
                    sc.table.rows[rowsn] = angular.copy(rtable.rows[rowIdx]);
                    sc.table.oldrows[rowsn] = angular.copy(rtable.rows[rowIdx]);
                } else {
                    sc.table.rows[rowsn]["error"] = rtable.rows[rowIdx]["error"];
                    sc.table.rows[rowsn]["errorMessage"] = rtable.rows[rowIdx]["errorMessage"];
                }
                break;
            case 3:

                if (rtable.rows[rowIdx].rowstate == 0) {
                    // important :   splice one element from array,  all index will be move up to previous poisition, so we need to re-order the element.
                    sc.table.rows.splice(rowsn, 1);
                    sc.table.oldrows.splice(rowsn, 1);

                    for (var i = 0; i < rtable.rows.length; i++) {
                        rtable.rows[i]["sn"] = rtable.rows[i]["sn"] > rowsn ? rtable.rows[i]["sn"] - 1 : rtable.rows[i]["sn"];
                    }

                    for (var i = rowsn; i < sc.table.rows.length; i++) {
                        sc.table.rows[i]["sn"] = sc.table.rows[i]["sn"] > rowsn ? sc.table.rows[i]["sn"] - 1 : sc.table.rows[i]["sn"];
                    }


                    for (var i = rowsn; i < sc.table.oldrows.length; i++) {
                        sc.table.oldrows[i]["sn"] = sc.table.oldrows[i]["sn"] > rowsn ? sc.table.oldrows[i]["sn"] - 1 : sc.table.oldrows[i]["sn"];
                    }

                } else {
                    sc.table.rows[rowsn]["error"]           = rtable.rows[rowIdx]["error"];
                    sc.table.rows[rowsn]["errorMessage"]    = rtable.rows[rowIdx]["errorMessage"];
                }
                break;
        }

    }
    sc.$apply();
}

