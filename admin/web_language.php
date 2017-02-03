<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<meta charset="utf8" />
		<!-- JQuery3.1.1 -->
		<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
		<link href='<?php echo $CFG["web_domain"]?>/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css' rel='stylesheet' type='text/css'>
		<!-- //JQuery -->
		
		<!-- Bootstrap3.3 -->
		<link 	href='<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/css/bootstrap.min.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/theme/mdb4.0/js/tether.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/js/bootstrap.min.js" type="text/javascript"></script>    
		<!-- //Bootstrap -->
		
		<!-- MD Bootstrap 4.0 -->
		<link href='<?php echo $CFG["web_domain"]?>/theme/mdb4.0/css/mdb.wliu.css' type='text/css' rel='stylesheet' />
		<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css' rel='stylesheet' />


		<!--
		<link href='theme/font-awesome-4.6.3/css/font-awesome.min.css' type='text/css' rel='stylesheet' />
		<link href='theme/mdb_pro/css/woocommerce.css' rel='stylesheet' type='text/css'>
		<link href='theme/mdb_pro/css/woocommerce-layout.css' rel='stylesheet' type='text/css'>
		<link href='theme/mdb_pro/css/woocommerce-smallscreen.css' rel='stylesheet' type='text/css'>
		-->
		<!-- //MD Bootstrap -->

		<!-- 3rd Party Component -->
        <!-- <script src="jquery/plugin/ckeditor_full/ckeditor.js" type="text/javascript"></script> -->
		<!-- //3rd Party Component -->


		<!-- AngularJS 1.3.15 -->
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-cookies.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-sanitize.min.js" type="text/javascript"></script>
		<!-- //AngularJS -->

		<!-- wliu components -->
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.common.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.table.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.table.common.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.filter.js" type="text/javascript"></script>
	
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.js" type="text/javascript"></script>
		<link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.js" type="text/javascript"></script>
		<link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.js" type="text/javascript"></script>
		<link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.css" type='text/css' rel='stylesheet' />


		<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.common.css' type='text/css' rel='stylesheet' />
		<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.buttons.css' type='text/css' rel='stylesheet' />
		<!-- //wliu components -->


        <script language="javascript" type="text/javascript">
		   	var col1 = new WLIU.COL({key:1, coltype:"hidden", 		name:"id", 			colname:"Lang ID",  	coldesc:"Word ID", defval:0 });
		   	var col2 = new WLIU.COL({key:0, coltype:"textbox", 		name:"project",		colname:"Project", 		coldesc:"Project Name", sort:"ASC", defval:"website", 	maxlength:64, 	notnull:1	});
		   	var col3 = new WLIU.COL({key:0, coltype:"textbox", 		name:"filter", 		colname:"Category", 	coldesc:"Category",  	sort:"ASC", defval:"field", 	maxlength:64, 	notnull:1	});
		   	var col4 = new WLIU.COL({key:0, coltype:"textbox", 		name:"keyword", 	colname:"Keyword", 		coldesc:"Keyword",  	sort:"ASC", notnull:1, unique:1,  maxlength:128 });
		   	var col5 = new WLIU.COL({key:0, coltype:"textarea", 	name:"en", 			colname:"English",   	coldesc:"English", 		sort:"ASC", notnull:1,  maxlength:2048 });
		   	var col6 = new WLIU.COL({key:0, coltype:"textarea", 	name:"cn", 			colname:"Chinese",   	coldesc:"Chinese", 		sort:"ASC", notnull:1,  maxlength:2048 });
		   	var col7 = new WLIU.COL({key:0, coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", defval: true});
		   	var col8 = new WLIU.COL({key:0, coltype:"text", 		name:"last_updated",colname:"Last Updated", coldesc:"Last Updated", sort:"DESC"});

		   	var cols = [];
		   	cols.push(col1);
		   	cols.push(col2);
		   	cols.push(col3);
		   	cols.push(col4);
		   	cols.push(col5);
		   	cols.push(col6);
		   	cols.push(col7);
		   	cols.push(col8);

			var filter1 = new WLIU.FILTER({name:"project", 		coltype:"textbox", 		cols:"project", 	colname:"Project", 		coldesc:"Search by Project"});
			var filter2 = new WLIU.FILTER({name:"filter", 		coltype:"textbox",		cols:"filter",  	colname:"Filter", 		coldesc:"Search by Filter"});
			var filter3 = new WLIU.FILTER({name:"keyword", 		coltype:"textbox",		cols:"keyword", 	colname:"Keyword", 		coldesc:"search by Keyword"});
			var filter4 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"cn,en",  		colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);
			filters.push(filter2);
			filters.push(filter3);
			filters.push(filter4);

		    var table = new WLIU.TABLE({
				scope: 		"mytab",
				url:   		"ajax/web_language_action.php",
				wait:   	"#ajax_wait",
				taberror:	"#table_error",
				tooltip:	"#tool_tip",
				autotip: 	"#auto_tips",
				rights: 	{detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
				navi:   	{pagesize:20, match: 1, orderby:"last_updated", sortby:"DESC"},
				filters: 	filters,
				cols: 		cols
			});

            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "lang_table" );
				table.getRecords();
		    });

			$(function(){
			});
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm" style="padding-top:80px;position:relative;">
<!-- container -->
<div class="container">
		<div class="row">
			<fieldset>
				<legend>Search By</legend>
				<filter.label table="lang_table" name="content"></filter.label> : 	<filter.textbox class="input-medium" table="lang_table" name="content"></filter.textbox>
				<filter.label table="lang_table" name="keyword"></filter.label> : 	<filter.textbox class="input-medium" table="lang_table" name="keyword"></filter.textbox>
				<filter.label table="lang_table" name="filter"></filter.label> : 	<filter.textbox class="input-medium" table="lang_table" name="filter"></filter.textbox>
				<filter.label table="lang_table" name="project"></filter.label> : 	<filter.textbox class="input-medium" table="lang_table" name="project"></filter.textbox>
			</feildset>
			<div style="margin-top:20px;">
			<table.tablebutton table="lang_table" name="search" actname="Search" outline=1></table.tablebutton>
			</div>
			<br>
			<table.navi table="lang_table"></table.navi>
			<table class="table table-condensed">
				<tr style="background-color:#eeeeee;"> 
					<td width=50>
						<table.hicon table="lang_table" name="add" 		actname="Add New"  	action="" 		tooltip="#tool_tip"></table.hicon>
						<table.hicon table="lang_table" name="save" 	actname="Save" 	action="" 	tooltip="#tool_tip"></table.hicon>
						<table.hicon table="lang_table" name="cancel" 	actname="Undo" 	action="" 		tooltip="#tool_tip"></table.hicon>
					</td>
					<td width=40 align="center">
						<table.head table="lang_table" name="SN"></table.head>
					</td>
					<td>
						<table.head table="lang_table" name="project"></table.head>
					</td>
					<td>
						<table.head table="lang_table" name="filter"></table.head>
					</td>
					<td>
						<table.head table="lang_table"  name="keyword"></table.head>
					</td>
					<td>
						<table.head table="lang_table"  name="en"></table.head>
					</td>
					<td>
						<table.head table="lang_table"  name="cn"></table.head>
					</td>
					<td>
						<table.head table="lang_table"  name="status"></table.head>
					</td>
					<td>
						<table.head table="lang_table" name="last_updated"></table.head>
					</td>
				</tr>	
				<tr ng-repeat="row in lang_table.rows">
					<td style="white-space:nowrap; width:40px;">
						<table.bicon table="lang_table" name="save"  	actname="Save" 		rowsn="{{$index}}" 	action="" tooltip="#tool_tip"></table.bicon>
						<table.bicon table="lang_table" name="cancel"	actname="Cancel" 	rowsn="{{$index}}" 	action="" tooltip="#tool_tip"></table.bicon>
						<table.bicon table="lang_table" name="delete" 	actname="Delete" 	rowsn="{{$index}}" 	action="" tooltip="#tool_tip"></table.bicon>
					</td>
					<td width=30 align="center">
						<table.rowno table="lang_table"  rowsn="{{$index}}"></table.rowno>
					</td>
					<td width="120px">
						<table.textbox class="input-auto" table="lang_table" name="project" rowsn="{{$index}}"></table.textbox>
					</td>
					<td width="80px">
						<table.textbox class="input-auto" table="lang_table" name="filter" rowsn="{{$index}}"></table.textbox>
					</td>
					<td>
						<table.textbox class="input-small" table="lang_table" name="keyword" rowsn="{{$index}}"></table.textbox>
					</td>
					<td>
						<table.textarea class="input-large" table="lang_table" name="en" rowsn="{{$index}}"></table.textarea>
					</td>
					<td>
						<table.textarea class="input-large" table="lang_table" name="cn" rowsn="{{$index}}"></table.textarea>
					</td>
					<td>
						<table.bool table="lang_table" name="status" rowsn="{{$index}}"></table.bool>
					</td>
					<td>
						<table.intdate table="lang_table" name="last_updated" rowsn="{{$index}}"></table.intdate>
					</td>
				</tr>
			</table>
		</div>
</div>
<!-- container -->

<div id="table_error" wliu-diag movable maskable></div>
<div id="auto_tips" wliu-tips></div>
<div id="ajax_wait" wliu-load></div>
<div id="tool_tip" wliu-popup></div>


<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="theme/mdb4.0/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>