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

if support image upload please load javascript
jquery.lwh.diagbox.js
jquery.lwh.diagbox.css
jquery.lwh.imageajax.js
jquery.lwh.imageajax.css
jquery.lwh.imageshow.js
jquery.lwh.imageshow.css
/***********************************************************************************************/
var wmliu_table = angular.module("wmliuTable",  ["ngSanitize"]);
wmliu_table.directive("wmliu.table", function (wmliuTableService) {
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
		  	'<a class="{{naviCSS}}-button {{naviCSS}}-button-first" ng-click="naviPage(\'first\');" 	ng-class="{\'wmliu-table-dbnav-button-first-na\':table.navi.head.pageNo<=1 || wmliuTable.pageno.$invalid || wmliuTable.pagesize.$invalid}" 		title="First"></a>',
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
            '<th  ng-repeat="col in table.schema.cols" ng-if="col.type!=\'hidden\' && col.type!=\'seal\'" ng-switch="col.type.toLowerCase()" class="{{tbCSS}}-head-title {{tbCSS}}-{{table.schema.head.headCSS}}" align="{{col.type==\'icon\' || col.type==\'button\' || col.type==\'textbutton\'?col.align:\'center\'}}" valign="middle" width="{{col.width}}" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}">',

            '<span ng-switch-when="refcheck">',
			    '<span ng-if="table.schema.table.mmtable?true:false">',
                '<a class="wmliu-common-icon20 wmliu-common-icon20-search" ng-click="search()" title="Search in All Records"></a>',
                '</span>',
            '</span>',

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
/**********************************************************************/
            '<tr class="wmliu-table-rows" ng-repeat="row in table.rows" ng-init="row.sn=$index;" class="{{tbCSS}}-row {{tbCSS}}-{{table.schema.head.rowCSS}}" ng-class-even="tbCSS+\'-row-even\' + \' \' + tbCSS+\'-\'+table.schema.head.evenCSS"  ng-class-odd="tbCSS+\'-row-odd\' + \' \' + tbCSS+\'-\'+table.schema.head.oddCSS">',

            '<td  ng-repeat="col in table.schema.cols" ng-if="col.type!=\'hidden\' && col.type!=\'seal\'" ng-switch="col.type.toLowerCase()" ',
            'ng-class="{\'wmliu-table-row-nowrap\':col.nowrap}" ng-init="colCSS=tbCSS + \'-col\'"',
            'align="{{col.align}}" valign="{{col.valign}}" width="{{col.width}}" style="min-width:20px; {{col.style}}" title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:col.desc?col.desc:col.title?col.title:col.col.uword()}}">',


			'<span ng-switch-when="refcheck">',
			    '<input type="checkbox" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}" />',
            '</span>',


			'<span ng-switch-when="rowno" ng-init="stateCSS=\'wmliu-common-state18\'">',
        //'<span ng-if="!row.rowstate">{{row.sn + 1}} - {{table.oldrows[row.sn].sn}} - {{table.rows[row.sn].sn}}</span>',
            '<span ng-if="!row.rowstate">{{row.sn + 1}}</span>',
        //'<span ng-if="row.rowstate"><a ng-class="[stateCSS, stateCSS+\'-\'+row.rowstate]"></a></span>',
            '<span ng-if="row.rowstate"><a class="{{stateCSS}} {{stateCSS+\'-\'+row.rowstate}} {{row.error>0?\'wmliu-common-state18 wmliu-common-state18-4\':\'\'}}" title="{{row.error>0?row.errorMessage:\'\'}}"></a></span>',
            '</span>',

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

            '<span ng-switch-when="mtext" class="{{colCSS}}-mtext {{colCSS}}-{{col.inputcss}}" ng-bind-html="col.col.colreplace(row).nl2br()"></span>',

			'<span ng-switch-when="textbox"><input type="text"  	ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
			'<span ng-switch-when="email"><input type="email"   	ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
			'<span ng-switch-when="number"><input type="number" 	ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
        //'<span ng-switch-when="datetime"><input type="datetime" ng-model="row[col.col]" style="width:{{col.width}}px;" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
        //'<span ng-switch-when="date"><input type="date"         ng-model="row[col.col]" style="width:{{col.width}}px;" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
        //'<span ng-switch-when="time"><input type="time"         ng-model="row[col.col]" style="width:{{col.width}}px;" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
			'<span ng-switch-when="search"><input type="search"     ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
			'<span ng-switch-when="url"><input type="url"           ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /></span>',
			'<span ng-switch-when="textarea"><textarea              ng-model="row[col.col]" style="width:{{col.width?col.width+\'px\':\'100%\'}};" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="{{colCSS}}-input {{colCSS}}-{{col.inputcss}} {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea></span>',

        // bool  nowrap used to show  title or not 
			'<span ng-switch-when="bool">',
	            '<label class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-class="{\'wmliu-common-input-checked\':row[col.col]}" title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:col.desc}}">',
			    '<input type="checkbox" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}" /><span ng-if="col.nowrap">{{col.title?col.title:col.col.uword()}}</span>',
                '</label>',
            '</span>',

            '<div ng-switch-when="radio" class="{{ row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\' }}">',
			    '<span ng-repeat="rdObj in table.listTables.checklist[col.col]">',
                    '<label      class="{{ row[col.col]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="radio" ng-model="row[col.col]" ng-value="rdObj.key" ng-change="changeState(col, row, table.oldrows[row.sn]);" />',
                        '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                    '</label>',
                    '<br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                '</span>',

                '<span ng-if="col.other" style="margin-left:10px;">',
                '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="row[col.other]" ',
                        'ng-focus="row[col.col]=\'\'" ',
                        'ng-change="changeState(col, row, table.oldrows[row.sn]);" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',
            '</div>',



            '<div ng-switch-when="radiolist" style="padding:5px;" class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}">',
                '<span ng-repeat="rdObj in table.listTables.clist[col.col]">',
                    '<div style="display:block; margin-top:{{!$first?\'5px\':\'\'}}; font-weight:bold; border-bottom:1px solid #aaaaaa; margin-bottom:5px" title="{{rdObj.desc}}">{{rdObj.title}}</div>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label ',
                                'class="{{row[col.col]==rdObj1.key?\'wmliu-common-input-checked\':\'\'}}" ',
                                'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword()}}">',
                                '<input type="radio" ng-model="row[col.col]" ng-value="rdObj1.key" ng-change="changeState(col, row, table.oldrows[row.sn])" />',
                                '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label><br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                    '</span>',
                '</span>',
            '</div>',


        /************** radiocom  *****************************************/
            '<span ng-switch-when="radiocom">',
                '<a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{name + col.col}}{{row.sn}}" title="Please Select"></a> ',
                '<span class="wmliu-common-input-checked {{ row.errorMessage[col.col] && !table.listTables.vlist[col.col][row[col.col]] && !row[col.other]?\'wmliu-common-error-message\':\'\' }}" style="min-width:60px;">',
                    '{{ row.errorMessage[col.col] && !table.listTables.vlist[col.col][row[col.col]] && !row[col.other]? row.errorMessage[col.col]: ',
                    'table.listTables.vlist[col.col][row[col.col]] + (table.listTables.vlist[col.col][row[col.col]]?row[col.other]?\', \':\'\':\'\') + row[col.other] }}',
                '</span>',

            '<div id="lwhDivBox{{name + col.col}}{{row.sn}}" class="lwhDivBox">',

        //radio below
            '<div class="lwhDivBox-content {{ row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\' }}">',
			'<span ng-repeat="rdObj in table.listTables.checklist[col.col]">',
                '<label      class="{{ row[col.col]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                            'title="{{ row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                    '<input type="radio" ng-model="row[col.col]" ng-value="rdObj.key" ng-change="changeState(col, row, table.oldrows[row.sn]);" />',
                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                '</label>',
                '<br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
            '</span>',

            '<span ng-if="col.other" style="margin-left:10px;">',
            '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                    'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                    'ng-model="row[col.other]" ',
                    'ng-focus="row[col.col]=\'\'" ',
                    'ng-change="changeState(col, row, table.oldrows[row.sn]);" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
            '</span>',

            '</div>',
        // end of radio

            '</div>',
            '</span>',
        /************ end of radiocom **************************************/



        /************** radiodiag  *****************************************/
        '<span ng-switch-when="radiodiag">',
            '<a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{name + col.col}}{{row.sn}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked {{ row.errorMessage[col.col] && !table.listTables.vlist[col.col][row[col.col]]?\'wmliu-common-error-message\':\'\' }}" style="min-width:60px;">',
            '{{ row.errorMessage[col.col] && !table.listTables.vlist[col.col][row[col.col]]?row.errorMessage[col.col]:table.listTables.vlist[col.col][row[col.col]] }}',
            '</span>',

            '<div id="lwhDivBox{{name + col.col}}{{row.sn}}" class="lwhDivBox">',

        //radiolist below
            '<div class="lwhDivBox-content {{ row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\' }}" style="border:0px;"',
                    'ng-init="row[col.col]=row[col.col]?row[col.col]:{}; colnum1=colnum?colnum:col.colnum;" ',
                    'title="{{ row.errorMessage[col.col]?row.errorMessage[col.col]:\'\' }}">',
                '<span ng-repeat="rdObj in table.listTables.clist[col.col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label  class="{{ row[col.col]==rdObj1.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword() }}">',
                            '<input type="radio" ng-model="row[col.col]" ng-value="rdObj1.key"  ng-change="changeState(col, row, table.oldrows[row.sn])" />',
                            '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label>',
                        '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                    '</span>',
                '</div>',
                '<br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                '</span>',
            '</div>',
        // end of radiolist

            '</div>',
        '</span>',
        /************ end of radiodiag **************************************/


			'<div ng-switch-when="checkbox" class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-init="row[col.col]=row[col.col]?row[col.col]:{}">',
			    '<span ng-repeat="rdObj in table.listTables.checklist[col.col]">',
                '<label class="{{ row[col.col][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                '<input type="checkbox" ng-model="row[col.col][rdObj.key]" ng-change="changeState(col, row, table.oldrows[row.sn]);" />',
                '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                '</label><br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                '</span>',

                '<span ng-if="col.other" style="margin-left:10px;">',
                '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="row[col.other]" ',
                        'ng-change="changeState(col, row, table.oldrows[row.sn]);" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',
            '</div>',

            '<div ng-switch-when="checklist" style="padding:5px;" class="{{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-init="row[col.col]=row[col.col]?row[col.col]:{}">',
                '<span ng-repeat="rdObj in table.listTables.clist[col.col]">',
                    '<div style="display:block; margin-top:{{!$first?\'5px\':\'\'}}; font-weight:bold; border-bottom:1px solid #aaaaaa; magin-bottom:5px;">{{rdObj.title}}</div>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label class="{{row[col.col][rdObj1.key]?\'wmliu-common-input-checked\':\'\'}}" ',
                                'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword()}}">',
                                '<input type="checkbox" ng-model="row[col.col][rdObj1.key]" ng-value="rdObj1.key"  ng-change="changeState(col, row, table.oldrows[row.sn])" />',
                                '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label><br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                    '</span>',
                '</span>',
            '</div>',


        /************** checkcom  *****************************************/
            '<span ng-switch-when="checkcom">',
                '<a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{name + col.col}}{{row.sn}}" title="Please Select"></a> ',
                '<span class="wmliu-common-input-checked" style="min-width:60px;" ng-bind-html="getText(row, col)"></span>',
                '<span ng-if="row.errorMessage[col.col] && getText(row, col)==\'\'?true:false" style="color:red;">{{row.errorMessage[col.col]}}</span>',

            '<div id="lwhDivBox{{name + col.col}}{{row.sn}}" class="lwhDivBox">',

        //checkbox below
			'<div ng-init="row[col.col]=row[col.col]?row[col.col]:{}" class="lwhDivBox-content {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}">',
			    '<span ng-repeat="rdObj in table.listTables.checklist[col.col]">',
                '<label     class="{{ row[col.col][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                            'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                    '<input type="checkbox" ng-model="row[col.col][rdObj.key]" ng-change="changeState(col, row, table.oldrows[row.sn]);" />',
                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                '</label><br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                '</span>',

                '<span ng-if="col.other" style="margin-left:10px;">',
                '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{row.errorMessage[col.col]?row.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="row[col.other]" ',
                        'ng-change="changeState(col, row, table.oldrows[row.sn]);" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',

            '</div>',
        // end of checkbox

            '</div>',
            '</span>',
        /************ end of checkcom **************************************/


        /************** checkdiag  *****************************************/
            '<span ng-switch-when="checkdiag">',
            '<a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{name + col.col}}{{row.sn}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked" style="min-width:60px;" ng-bind-html="getText(row, col)"></span>',
            '<span ng-if="row.errorMessage[col.col] && getText(row[col.col], col)==\'\'?true:false" style="color:red;">{{row.errorMessage[col.col]}}</span>',
            '<div id="lwhDivBox{{name + col.col}}{{row.sn}}" class="lwhDivBox">',

        //checklist below
            '<div class="lwhDivBox-content {{ row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\' }}" style="border:0px;"',
                    'ng-init="row[col.col]=row[col.col]?row[col.col]:{}; colnum1=colnum?colnum:col.colnum;" ',
                    'title="{{ row.errorMessage[col.col]?row.errorMessage[col.col]:\'\' }}">',
                '<span ng-repeat="rdObj in table.listTables.clist[col.col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label  class="{{ row[col.col][rdObj1.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword() }}">',
                            '<input type="checkbox" ng-model="row[col.col][rdObj1.key]" ng-value="rdObj1.key"  ng-change="changeState(col, row, table.oldrows[row.sn])" />',
                            '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label>',
                        '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                    '</span>',
                '</div>',
                '<br ng-if="!col.nowrap && (($index+1)%col.colnum==0)" />',
                '</span>',
            '</div>',
        // end of checklist

            '</div>',
            '</span>',
        /************ end of checkdiag **************************************/


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


        /************** datetype  *****************************************/
        '<span ng-switch-when="datetype" ng-init="row[col.col]=row[col.col]||{}">',
            '<a class="lwhDiagBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDiagBox{{name + col.col}}{{row.sn}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked {{ row.errorMessage[col.col]?\'wmliu-common-error-message\':\'\' }}" style="min-width:120px;" ng-bind-html="getDateType(row, col)">',
        //'{{ row.errorMessage[col.col] && !getDateType(row[col.col])?row.errorMessage[col.col]: getDateType(row[col.col]) }}',
            '</span>',

            '<div id="lwhDiagBox{{name + col.col}}{{row.sn}}" ww="480px" hh="220px" minww="480px" minhh="220px" class="lwhDiagBox">',

            //diagBox Content below
            '<div class="wmliu-common-checklist" style="border:0px;"',
                    'title="{{ row.errorMessage[col.col]?row.errorMessage[col.col]:\'\' }}">',

                '<div style="margin-top:10px;">',
                    '{{ trans[table.navi.head.lang].words[\'start_time\'] }}: ',
                    '<input type="text" class="wmliu-common-time {{row.errorMessage[col.start_time]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.start_time]?row.errorMessage[col.start_time]:\'\' }}" ',
                            'ng-model="row[col.start_time]" ng-change="changeDateType(col.start_time, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" />',			        

                    ' <b>~</b> ',
                    '{{ trans[table.navi.head.lang].words[\'end_time\'] }}: ',
                    '<input type="text" class="wmliu-common-time {{row.errorMessage[col.end_time]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.end_time]?row.errorMessage[col.end_time]:\'\' }}" ',
                            'ng-model="row[col.end_time]" ng-change="changeDateType(col.end_time, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" />',			        

                '</div>',

                '<div style="margin-top:10px;" class="{{row.errorMessage[col.date_type]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.date_type]?row.errorMessage[col.date_type]:\'\' }}">',
				    '{{ trans[table.navi.head.lang].words[\'sch_type\'] }}:',
					'<label ng-repeat="rdObj in basic[table.navi.head.lang].dateType" style="margin-left:20px;" class="{{ row[col.date_type]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}">',
                        '<input type="radio" ng-model="row[col.date_type]" ng-value="rdObj.key"  ng-change="changeDateType(col.date_type, row, table.oldrows[row.sn])" />',
                        '{{rdObj.title}}',
                    '</label>',
                '</div>',

                '<div ng-show="row[col.date_type]==\'Once\'" class="wmliu-common-checklist-box1">',
                        '{{ trans[table.navi.head.lang].words[\'date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.once_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.once_date]?row.errorMessage[col.once_date]:\'\' }}" ',
                                'ng-model="row[col.once_date]" ng-change="changeDateType(col.once_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                '</div>',

                '<div ng-show="row[col.date_type]==\'Daily\'" class="wmliu-common-checklist-box1">',
                        '{{ trans[table.navi.head.lang].words[\'start_date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.start_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.start_date]?row.errorMessage[col.start_date]:\'\' }}" ',
                                'ng-model="row[col.start_date]"  ng-change="changeDateType(col.start_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                        ' <b>~</b> ',
                        '{{ trans[table.navi.head.lang].words[\'end_date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.end_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.end_date]?row.errorMessage[col.end_date]:\'\' }}" ',
                                'ng-model="row[col.end_date]" ng-change="changeDateType(col.end_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                '</div>',

                '<div ng-show="row[col.date_type]==\'Weekly\'" class="wmliu-common-checklist-box1">',
                        '{{ trans[table.navi.head.lang].words[\'start_date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.start_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.start_date]?row.errorMessage[col.start_date]:\'\' }}" ',
                                'ng-model="row[col.start_date]"  ng-change="changeDateType(col.start_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                        ' <b>~</b> ',
                        '{{ trans[table.navi.head.lang].words[\'end_date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.end_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.end_date]?row.errorMessage[col.end_date]:\'\' }}" ',
                                'ng-model="row[col.end_date]" ng-change="changeDateType(col.end_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',

                        '<br><br>',
						'<div class="{{row.errorMessage[col.date_sets]?\'wmliu-common-input-invalid\':\'\'}}">',
	                        '<label ng-repeat="rdObj1 in basic[table.navi.head.lang].day_short" ',
		                        'class="{{ row[col.col][\'wdates\'][$index]?\'wmliu-common-input-checked\':\'\' }}" style="margin-right:5px;">',
                                '<input type="checkbox" ng-model="row[col.col][\'wdates\'][$index]"   ng-change="changeDateType(col.col, row, table.oldrows[row.sn])" />',
                                '{{rdObj1}}',
    	                    '</label>',
						'</div>',
                '</div>',

                '<div ng-show="row[col.date_type]==\'Monthly\'" class="wmliu-common-checklist-box1">',
                        '{{ trans[table.navi.head.lang].words[\'start_date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.start_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.start_date]?row.errorMessage[col.start_date]:\'\' }}" ',
                                'ng-model="row[col.start_date]"  ng-change="changeDateType(col.start_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                        ' <b>~</b> ',
                        '{{ trans[table.navi.head.lang].words[\'end_date\'] }}: ',
                        '<input type="text" class="wmliu-common-date {{row.errorMessage[col.end_date]?\'wmliu-common-input-invalid\':\'\'}}" title="{{ row.errorMessage[col.end_date]?row.errorMessage[col.end_date]:\'\' }}" ',
                                'ng-model="row[col.end_date]" ng-change="changeDateType(col.end_date, row, table.oldrows[row.sn]);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',

                        '<br><br>',
						'<div class="{{row.errorMessage[col.date_sets]?\'wmliu-common-input-invalid\':\'\'}}">',
                        	'<span ng-repeat="rdObj1 in basic[table.navi.head.lang].days">',
								'<label class="{{ row[col.col][\'mdates\'][rdObj1]?\'wmliu-common-input-checked\':\'\' }}" style="display:inline-block; width:40px;">',
                            		'<input type="checkbox" ng-model="row[col.col][\'mdates\'][rdObj1]"  ng-change="changeDateType(col.col, row, table.oldrows[row.sn])" />',
                            		'{{rdObj1}}',
                        		'</label>',
								'<br ng-if="($index+1)%10==0" />',
							'</span>',
							'<label class="{{ row[col.col][\'mdates\'][31]?\'wmliu-common-input-checked\':\'\' }}">',
                            	'<input type="checkbox" ng-model="row[col.col][\'mdates\'][31]"  ng-change="changeDateType(col.col, row, table.oldrows[row.sn])" />',
                            	'{{trans[table.navi.head.lang].words[\'last_date\']}}',
                        	'</label>',
						'</div>',
                '</div>',
            '</div>',
            // end of diagBox Content below

            '</div>',
        '</span>',
        /************ end of datetype **************************************/



			'<span ng-switch-when="date"><input type="text" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="wmliu-common-date {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" /></span>',
			'<span ng-switch-when="time"><input type="text" ng-model="row[col.col]" ng-change="changeState(col, row, table.oldrows[row.sn]);" class="wmliu-common-time {{row.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" /></span>',

			'<span ng-switch-when="intdate">{{ row[col.col]?row[col.col]>0?(row[col.col] * 1000 | date : "yyyy-MM-dd H:mm:ss") : "" : ""  }}</span>',

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
			$scope.linkUpload = function(ref_id, singleImage) {
				if(singleImage) {
					wmliuTable_iupload.imgid(ref_id);
					wmliuTable_iupload.show();
				} else { 
					wmliuTable_iupload.refid(ref_id);
					wmliuTable_iupload.show();
				}
			}

			$scope.showImage = function(ref_id, singleImage) {
				if(singleImage) 
					wmliuTable_ishow.imgid(ref_id);
				else 
					wmliuTable_ishow.refid(ref_id);
			}

			
            $scope.getText = function (row, colObj) {
                var str = '';
                var colnum1 = colObj.colnum;
                var cnt = 0;
                for (var key in row[colObj.col]) {
                    if (row[colObj.col][key]) {
                        if ($scope.table.listTables.vlist[colObj.col][key]) {
                            str += (str == '' ? '' : ', ') + $scope.table.listTables.vlist[colObj.col][key];
                            cnt++;
                        }
                    }
                    if (cnt > 0 && (cnt % colnum1 == 0)) {
                        str += "<br>";
                        cnt = 0;
                    }
                }
                if (colObj.other) {
                    if (row[colObj.other]) {
                        str += (str ? row[colObj.other] ? ', ' : '' : '') + row[colObj.other];
                    }
                }
                return str;
            }

            for (var key in $scope.table.rows) {
                $scope.table.rows[key].sn = parseInt(key);
                $scope.table.rows[key].rowstate = 0;
                $scope.table.rows[key].error = 0;
                $scope.table.rows[key].errorMessage = {};
            }
            $scope.table.oldrows = angular.copy($scope.table.rows);

            $scope.table.navi.head.qmode = "";
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
            wmliuTableService.init[$scope.table.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.table.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.table.schema.idvals.sid = idvals.sid;
                    }
                }

                $scope.table.navi.head.action = "init";
                $scope.table.navi.head.qmode = "view";
                $scope.table.navi.head.loading = 1;
                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                wmliuTableService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }


            wmliuTableService.fresh[$scope.table.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.table.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.table.schema.idvals.sid = idvals.sid;
                        $scope.table.navi.head.pageNo = 0;
                    }
                }

                $scope.table.navi.head.action = "fresh";
                $scope.table.navi.head.qmode = "view";
                $scope.table.navi.head.loading = 1;
                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                search_table.rows = [];
                wmliuTableService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }

            wmliuTableService.load[$scope.table.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.table.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.table.schema.idvals.sid = idvals.sid;
                        $scope.table.navi.head.pageNo = 0;
                    }
                }

                $scope.table.navi.head.action = "load";
                $scope.table.navi.head.qmode = "view";
                $scope.table.navi.head.loading = 1;

                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                search_table.rows = [];
                wmliuTableService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }

            // just clear , no ajax call
            wmliuTableService.clear[$scope.table.name] = function () {
                $scope.table.schema.idvals.pid = "";
                $scope.table.schema.idvals.sid = "";

                $scope.table.navi.head.pageNo = 0;
                $scope.table.navi.head.action = "load";
                $scope.table.navi.head.qmode = "view";
                $scope.table.navi.head.loading = 0;
                $scope.table.rows = [];
            }


            $scope.search = function () {
                $scope.table.navi.head.pageNo = 0;
                $scope.table.navi.head.action = "load";
                $scope.table.navi.head.qmode = "search";

                $scope.table.navi.head.loading = 1;

                var search_table = {};
                search_table.schema = $scope.table.schema;
                search_table.navi = $scope.table.navi;
                search_table.rows = [];
                wmliuTableService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
            }

            $scope.getDateType = function (row, col) {
                var str = "";
				if(row.errorMessage) if(row.errorMessage[col.col]) str += '<span style="color:red;">' + row.errorMessage[col.col].replaceAll("\n","<br>") + '</span><br>';
                if (col.date_type) {
                    if (row[col.date_type]) {
                        str += row[col.date_type].vtext($scope.basic[$scope.table.navi.head.lang].dateType);
                        switch (row[col.date_type]) {
                            case "Once":
                                var flag = false;
                                str += ":<br>";
                                str += $scope.trans[$scope.table.navi.head.lang].words["date"];
                                str += ": ";
                                if (row[col.once_date]) {
                                    str += row[col.once_date];
                                }

                                // start_date ~ end_date  start_time ~ end_time
                                var start_time = "";
                                if (row[col.start_time]) start_time = row[col.start_time];
                                if (start_time) {
                                    str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_time"];
                                    str += ": ";
                                    str += start_time;
                                    flag = true;
                                }
                                var end_time = "";
                                if (row[col.end_time]) end_time = row[col.end_time];
                                if (end_time) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_time"];
                                    str += ": ";
                                    str += end_time;
                                }
                                break;
                            case "Daily":
                                var flag = false;
                                str += ":<br>";
                                if (row[col.start_date]) {
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_date"];
                                    str += ": ";
                                    str += row[col.start_date];
                                    flag = true;
                                }
                                if (row[col.end_date]) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_date"];
                                    str += ": ";
                                    str += row[col.end_date];
                                    flag = true;
                                }

                                // start_date ~ end_date  start_time ~ end_time
                                var start_time = "";
                                if (row[col.start_time]) start_time = row[col.start_time];
                                if (start_time) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_time"];
                                    str += ": ";
                                    str += start_time;
                                    flag = true;
                                }
                                var end_time = "";
                                if (row[col.end_time]) end_time = row[col.end_time];
                                if (end_time) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_time"];
                                    str += ": ";
                                    str += end_time;
                                }
                                break;
                            case "Weekly":
                                var flag = false;
                                str += ": ";
                                var tstr = "";
                                if (row[col.col]["wdates"]) {
                                    for (var key in row[col.col]["wdates"]) {
                                        if (row[col.col]["wdates"][key])
                                            tstr += (tstr != "" ? ", " : "") + $scope.basic[$scope.table.navi.head.lang].day_short[key];
                                    }
                                }
                                str += tstr;

                                // start_date ~ end_date  start_time ~ end_time
                                str += "<br>";
                                if (row[col.start_date]) {
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_date"];
                                    str += ": ";
                                    str += row[col.start_date];
                                    flag = true;

                                }
                                if (row[col.end_date]) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_time"];
                                    str += ": ";
                                    str += row[col.end_date];
                                    flag = true;
                                }

                                // start_date ~ end_date  start_time ~ end_time
                                var start_time = "";
                                if (row[col.start_time]) start_time = row[col.start_time];
                                if (start_time) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_time"];
                                    str += ": ";
                                    str += start_time;
                                    flag = true;
                                }
                                var end_time = "";
                                if (row[col.end_time]) end_time = row[col.end_time];
                                if (end_time) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_time"];
                                    str += ": ";
                                    str += end_time;
                                }
                                // end of start_date ~ end_date  time
                                break;
                            case "Monthly":
                                var flag = false;
                                str += ": ";
                                var tstr = "";
                                if (row[col.col]["mdates"]) {
                                    for (var key in row[col.col]["mdates"]) {
                                        if (row[col.col]["mdates"][key])
                                            tstr += (tstr != "" ? ", " : "") + key;
                                    }
                                }
                                str += tstr;

                                // start_date ~ end_date  start_time ~ end_time
                                str += "<br>";
                                if (row[col.start_date]) {
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_date"];
                                    str += ": ";
                                    str += row[col.start_date];
                                    flag = true;
                                }
                                if (row[col.end_date]) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_date"];
                                    str += ": ";
                                    str += row[col.end_date];
                                    flag = true;
                                }

                                // start_date ~ end_date  start_time ~ end_time
                                var start_time = "";
                                if (row[col.start_time]) start_time = row[col.start_time];
                                if (start_time) {
                                    if (flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["start_time"];
                                    str += ": ";
                                    str += start_time;
                                    flag = true;
                                }
                                var end_time = "";
                                if (row[col.end_time]) end_time = row[col.end_time];
                                if (end_time) {
                                    if(flag) str += "<br>";
                                    str += $scope.trans[$scope.table.navi.head.lang].words["end_time"];
                                    str += ": ";
                                    str += end_time;
                                }
                                // end of start_date ~ end_date  time
                                break;
                        }
                    }
                }
                return str;
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

            $scope.changeDateType = function (colName, curRow, oldRow) {
                if (curRow.rowstate < 2) {
                    if (angular.isObject(curRow[colName]) || angular.isArray(curRow[colName])) {
                        for (var key in curRow[colName]) {
                            if (oldRow[colName]) {
                                if (curRow[colName][key] != oldRow[colName][key]) {
                                    curRow.rowstate = 1;
                                    break;
                                }
                            } else {
                                curRow.rowstate = 1;
                            }
                        }
                    } else {
                        if (curRow[colName] != oldRow[colName]) {
                            curRow.rowstate = 1;
                        } else {
                            //curRow.rowstate = 0;
                        }
                    }
                }
            }

            $scope.allState = function (btn_name) {
                var btnActive1 = false;
                var rowState = 0;
                for (var key in $scope.table.rows) {
                    rowState = $scope.table.rows[key].rowstate > rowState ? $scope.table.rows[key].rowstate : rowState;
                }
                btnActive1 = $scope.table.buttons.rights[btn_name] && wmliuTableService.allActive[rowState][btn_name];
                return btnActive1;
            }

            $scope.buttonState = function (rowState, btn_name) {
                //console.log("button state: " + rowState + " : "  + btn_name);
                var btnActive1 = false;
                if (!rowState) rowState = 0;
                btnActive1 = $scope.table.buttons.rights[btn_name] && wmliuTableService.btnActive[rowState][btn_name];
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

                    wmliuTableService.tableAjax(search_table, $scope.table.navi.head.action, $scope, $scope.table.buttons.head.wait);
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

                wmliuTableService.tableAjax(update_table, action, $scope, $scope.buttons.row.wait);
            }



            $scope.buttonClick = function (action, rowsObj) {
                $scope.table.navi.head.action = action;
                if ($scope.table.buttons.rights[action]) {
                    var btnClick = wmliuTableService.getButtonClick($scope.table.name, action);
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

                            wmliuTableService.tableAjax(update_table, action, $scope, $scope.table.buttons.row.wait);

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
                wmliuTableService.fresh[$scope.table.name]();
            } else {
                wmliuTableService.init[$scope.table.name]();
            }

        },
        link: function (sc, attr, ctr) {
            wmliu_table_highlight(sc.name);
            $(".lwhDivBox-Button").live("click.lwhDivBox", function (ev) {
                $("#" + $(this).attr("did")).lwhDivBox();
                $("#" + $(this).attr("did")).divBoxShow();
            });

            $(".lwhDiagBox-Button").live("click.lwhDiagBox", function (ev) {
                $("#" + $(this).attr("did")).lwhDiagBox({ title: sc.trans[sc.table.navi.head.lang].words["sch_set"], maskable: true, movable: true });
                $("#" + $(this).attr("did")).diagBoxShow();
            });


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

			

            /*
            $(function () {
            $(".wmliu-common-date").datepicker({
            dateFormat: 'yy-mm-dd',
            showOn: "button",
            buttonImage: "theme/light/image/icon/calendar.png",
            buttonImageOnly: true
            });
            });
            */
        }
    }
});


/**********************************************************************************************/
/*** Service ***/
wmliu_table.service("wmliuTableService", function ($filter) {
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
				
                table: 		ctable
                // do not need to send rows
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (wait == "1") wait_hide();
                sc.table.navi.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, ctable);
                //tool_tips("Error (wmliu_table_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
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
            url: "ajax/wmliu_table_data.php"
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
function wmliu_table_highlight(eid) {
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

