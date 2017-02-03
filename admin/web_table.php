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
		   	var col1 = new WLIU.COL({key:1, coltype:"hidden", 		name:"id", 			colname:"Table ID",  	coldesc:"Table ID", 				defval:0 });
		   	var col2 = new WLIU.COL({key:0, coltype:"textbox", 		name:"table_name",	colname:"Table Name", 	coldesc:"Table Name", 			sort:"ASC", maxlength:64,	notnull:1,	unique:1});
		   	var col3 = new WLIU.COL({key:0, coltype:"textbox", 		name:"title_en", 	colname:"Title.EN", 	coldesc:"Title English",  		sort:"ASC", maxlength:64, 	notnull:1	});
		   	var col4 = new WLIU.COL({key:0, coltype:"textbox", 		name:"title_cn", 	colname:"Title.CN", 	coldesc:"Title Chinese",  		sort:"ASC", maxlength:64,  	notnull:1,  });
		   	var col5 = new WLIU.COL({key:0, coltype:"textarea", 	name:"desc_en", 	colname:"Detail.EN",   	coldesc:"Description English",	sort:"ASC", maxlength:256 });
		   	var col6 = new WLIU.COL({key:0, coltype:"textarea", 	name:"desc_cn", 	colname:"Detail.CN",   	coldesc:"Description Chinese",	sort:"ASC", maxlength:256 });
		   	var col7 = new WLIU.COL({key:0, coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", 		defval: true});
		   	var col8 = new WLIU.COL({key:0, coltype:"textbox", 		name:"orderno", 	colname:"Order", 		coldesc:"Order No.",  			sort:"Desc", min:0, max:999, defval:0, datatype:"NUMBER" });

		   	var cols = [];
		   	cols.push(col1);
		   	cols.push(col2);
		   	cols.push(col3);
		   	cols.push(col4);
		   	cols.push(col5);
		   	cols.push(col6);
		   	cols.push(col7);
		   	cols.push(col8);

			var filter1 = new WLIU.FILTER({name:"table_name", 	coltype:"textbox", 		cols:"table_name", 	colname:"Table Name", 	coldesc:"Search by Table Name"});
			var filter2 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"title_en,title_cn,desc_en,desc_cn",  	colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);
			filters.push(filter2);

		    var table = new WLIU.TABLE({
				scope: 		"mytab",
				url:   		"ajax/web_table_action.php",
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
				table.setScope( $scope, "web_table" );
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
				<filter.label table="web_table" name="table_name"></filter.label> : 	<filter.textbox class="input-medium" table="web_table" name="table_name"></filter.textbox>
				<filter.label table="web_table" name="content"></filter.label> : 	<filter.textbox class="input-medium" table="web_table" name="content"></filter.textbox>
			</feildset>
			<div style="margin-top:20px;">
			<table.tablebutton table="web_table" name="search" actname="Search" outline=1></table.tablebutton>
			</div>
			<br>
			<table.navi table="web_table"></table.navi>
			<table class="table table-condensed">
				<tr style="background-color:#eeeeee;"> 
					<td width=50>
						<table.hicon table="web_table" name="add" 		actname="Add New"  	action="" 		tooltip="#tool_tip"></table.hicon>
						<table.hicon table="web_table" name="save" 	actname="Save" 	action="" 	tooltip="#tool_tip"></table.hicon>
						<table.hicon table="web_table" name="cancel" 	actname="Undo" 	action="" 		tooltip="#tool_tip"></table.hicon>
					</td>
					<td width=40 align="center">
						<table.head table="web_table" name="SN"></table.head>
					</td>
					<td>
						<table.head table="web_table" name="table_name"></table.head>
					</td>
					<td>
						<table.head table="web_table" name="title_en"></table.head>
					</td>
					<td>
						<table.head table="web_table"  name="title_cn"></table.head>
					</td>
					<td>
						<table.head table="web_table"  name="desc_en"></table.head>
					</td>
					<td>
						<table.head table="web_table"  name="desc_cn"></table.head>
					</td>
					<td>
						<table.head table="web_table"  name="orderno"></table.head>
					</td>
					<td>
						<table.head table="web_table"  name="status"></table.head>
					</td>
				</tr>	
				<tr ng-repeat="row in web_table.rows">
					<td style="white-space:nowrap; width:40px;">
						<table.bicon table="web_table" name="save"  	actname="Save" 		rowsn="{{$index}}" 	action="" tooltip="#tool_tip"></table.bicon>
						<table.bicon table="web_table" name="cancel"	actname="Cancel" 	rowsn="{{$index}}" 	action="" tooltip="#tool_tip"></table.bicon>
						<table.bicon table="web_table" name="delete" 	actname="Delete" 	rowsn="{{$index}}" 	action="" tooltip="#tool_tip"></table.bicon>
					</td>
					<td width=30 align="center">
						<table.rowno table="web_table"  rowsn="{{$index}}"></table.rowno>
					</td>
					<td width="100px">
						<table.textbox class="input-auto" table="web_table" name="table_name" rowsn="{{$index}}"></table.textbox>
					</td>
					<td width="100px">
						<table.textbox class="input-auto" table="web_table" name="title_en" rowsn="{{$index}}"></table.textbox>
					</td>
					<td>
						<table.textbox class="input-small" table="web_table" name="title_cn" rowsn="{{$index}}"></table.textbox>
					</td>
					<td>
						<table.textarea class="input-large" table="web_table" name="desc_en" rowsn="{{$index}}"></table.textarea>
					</td>
					<td>
						<table.textarea class="input-large" table="web_table" name="desc_cn" rowsn="{{$index}}"></table.textarea>
					</td>
					<td>
						<table.textbox class="input-tiny" table="web_table" name="orderno" rowsn="{{$index}}" style="text-align:center;"></table.textbox>
					</td>
					<td>
						<table.bool table="web_table" name="status" rowsn="{{$index}}"></table.bool>
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
