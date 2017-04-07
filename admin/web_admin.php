<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<meta charset="utf8" />
		<!-- JQuery3.1.1 -->
		<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery-3.1.1.min.js"></script>
		<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery.cookie.1.4.1.js"></script>
		<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
		<link href='<?php echo $CFG["web_domain"]?>/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css' rel='stylesheet' type='text/css'>
		<!-- //JQuery -->

	    <!-- Font Awesome & BS & MDB -->
		<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css' rel='stylesheet' />
		<link 	href='<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/css/bootstrap.min.css' type='text/css' rel='stylesheet' />
		<link href='<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/css/mdb.css' type='text/css' rel='stylesheet' />
		
		<!-- Bootstrap3.3 -->
		<script src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/tether.min.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/js/bootstrap.min.js" type="text/javascript"></script>    
		<!-- //Bootstrap -->
		
		<!-- AngularJS 1.3.15 -->
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-cookies.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-sanitize.min.js" type="text/javascript"></script>
		<!-- //AngularJS -->

		<!-- wliu components -->
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.common.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.table.common.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.table.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.tree.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.form.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.tree.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.filter.js" type="text/javascript"></script>
	
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.js" type="text/javascript"></script>
		<link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.js" type="text/javascript"></script>
		<link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.js" type="text/javascript"></script>
		<link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.css" type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/tree/wliu.jquery.tree.js" type="text/javascript"></script>
		<link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/tree/wliu.jquery.tree.css" type='text/css' rel='stylesheet' />


		<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.common.css' type='text/css' rel='stylesheet' />
		<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.buttons.css' type='text/css' rel='stylesheet' />
		<!-- //wliu components -->


        <script language="javascript" type="text/javascript">
		   	var col1 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Lang ID",  	coldesc:"Word ID",  defval:0 });
		   	var col2 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"user_name", 	colname:"User Name", 	coldesc:"Login User",    	sort:"ASC", maxlength:64, 			notnull:1, 	unique:1,	tooltip:"tool_tip"});
		   	var col3 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"email",		colname:"Email", 		coldesc:"Email Address",    sort:"ASC", maxlength:256, 			notnull:1, 	unique:1,	datatype:"EMAIL" });
		   	var col4 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"first_name", 	colname:"First Name", 	coldesc:"First Name",		sort:"ASC", maxlength:64, 			notnull:1	});
		   	var col5 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"last_name", 	colname:"Last Name", 	coldesc:"Last Name",		sort:"ASC", maxlength:64, 			notnull:1	});
		   	var col6 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"phone", 	    colname:"Phone", 		coldesc:"Phone", 			sort:"ASC", maxlength:64, notnull:0 });
		   	var col7 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 	    name:"cell", 		colname:"Cell",   	    coldesc:"Cell Phone", 		sort:"ASC", maxlength:64, notnull:0 });
		   	var col8 = new WLIU.COL({key:0, table:"p",	coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", 	defval: 1});
		   	var col9 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"hits",		colname:"Hits",  		coldesc:"Login Count"});
		   	var col10 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"address",		colname:"Address",  	coldesc:"Address", 			maxlength:256});
		   	var col11 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"city",		colname:"City",  		coldesc:"City", 			maxlength:64});
		   	var col12 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"state",		colname:"State",  		coldesc:"State/Province", 	maxlength:64});
		   	var col13 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"country",		colname:"Country",  	coldesc:"Country", 			maxlength:64});
		   	var col14 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"postal",		colname:"Postal",  		coldesc:"Postal", 			maxlength:16});
		   	var col15 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"created_time",colname:"Created Time", coldesc:"Created Time" });
		   	var col16 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"last_updated",colname:"Last Updated", coldesc:"Last Updated" });
		   	var col17 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"last_login",	colname:"Last Login", 	coldesc:"Last Login" });
		   	var col18 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"login_count", colname:"Login Count",  coldesc:"Login Count",  min:0 , max:5, maxlength:1 });

		   	var cols = [];
		   	cols.push(col1);
		   	cols.push(col2);
		   	cols.push(col3);
		   	cols.push(col4);
		   	cols.push(col5);
		   	cols.push(col6);
		   	cols.push(col7);
		   	cols.push(col8);
		   	cols.push(col9);
		   	cols.push(col10);
		   	cols.push(col11);
		   	cols.push(col12);
		   	cols.push(col13);
		   	cols.push(col14);
		   	cols.push(col15);
		   	cols.push(col16);
		   	cols.push(col17);
		   	cols.push(col18);

			var filter1 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"user_name,email,first_name,last_name",  	colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				lang:	 	GLang,
				scope: 		"mytab",
				url:   		"ajax/web_admin_action.php",
				wait:   	"ajax_wait",
				taberror:	"table_error",
				tooltip:	"tool_tip",
				autotip: 	"auto_tips",
				rights: 	{detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
                lists:      {
                            roleLevel: {loaded: 0, keys:{guid:"", name:""}, list:[] }
                },
				navi:   	{pagesize:20, match: 1, orderby:"last_updated", sortby:"DESC"},
				filters: 	filters,
				cols: 		cols
			});







            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "role_table" );

				$scope.row_detail = function(theRow) {
					$("#div_right").show();
					$("#div_role").hide();
				}
		    });

			$(function(){
				table.getRecords();
			});

			function goback() {
				$("#div_right").hide();
				$("#div_role").show();
			}
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm">
<?php include("head/menu_admin.php");?>
<!-- container -->
<div class="container">
		<div id="div_role" class="row">
			<fieldset>
				<legend>Search By</legend>
				<filter.label table="role_table" name="content"></filter.label> : 	<filter.textbox class="input-medium" table="role_table" name="content"></filter.textbox>
				<br>
				<div style="background-color:#ffffff;display:inline-block; margin-top:10px; margin-left:50px;"><table.tablebutton table="role_table" name="search" actname="Search" outline=1></table.tablebutton></div>
			</fieldset>
			<table.navi table="role_table" style="margin-top:20px;"></table.navi>
			<table class="table table-condensed">
				<tr style="background-color:#eeeeee;"> 
					<td width=50 valign="middle">
						<table.hicon table="role_table" name="add" 		actname="Add New" action="row_detail(role_table.getCurrent())"></table.hicon>
						<table.hicon table="role_table" name="save" 	actname="Save"></table.hicon>
						<table.hicon table="role_table" name="cancel" 	actname="Undo"></table.hicon>
					</td>
					<td width=40 align="center" valign="middle">
						<table.head table="role_table" name="SN"></table.head>
					</td>
					<td valign="middle">
						<table.head table="role_table" name="user_name"></table.head>
					</td>
					<td valign="middle">
						<table.head table="role_table" name="email"></table.head>
					</td>
					<td valign="middle">
						<table.head table="role_table"  name="first_name"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="last_name"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="phone"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="cell"></table.head>
					</td>
					<td>
						<table.head table="role_table" name="status"></table.head>
					</td>
					<td>
						<table.head table="role_table" name="hits"></table.head>
					</td>
				</tr>	
				<tr ng-repeat="row in role_table.rows">
					<td style="white-space:nowrap; width:40px;">
						<table.bicon table="role_table" name="detail"  	actname="Edit" 		row="row" action="row_detail(row)"></table.bicon>
						<table.bicon table="role_table" name="save"  	actname="Save" 		row="row"></table.bicon>
						<table.bicon table="role_table" name="cancel"	actname="Cancel" 	row="row"></table.bicon>
						<table.bicon table="role_table" name="delete" 	actname="Delete" 	row="row"></table.bicon>
					</td>
					<td width=30 align="center">
						<table.rowno table="role_table"  row="row"></table.rowno>
					</td>
					<td>
						<table.readonly class="input-small" table="role_table" name="user_name" row="row"></table.readonly>
					</td>
					<td>
						<table.textbox class="input-medium" table="role_table" name="email" row="row"></table.textbox>
					</td>
					<td>
						<table.textbox class="input-medium" table="role_table" name="first_name" row="row"></table.textbox>
					</td>
					<td>
						<table.textbox class="input-medium" table="role_table" name="last_name" row="row"></table.textbox>
					</td>
					<td>
						<table.textbox class="input-small" table="role_table" name="phone" row="row"></table.textbox>
					</td>
					<td>
						<table.textbox class="input-small" table="role_table" name="cell" row="row"></table.textbox>
					</td>
					<td>
						<table.bool table="role_table" name="status" row="row"></table.bool>
					</td>
					<td align="center">
						<table.text class="input-tiny" table="role_table" name="hits" row="row"></table.text>
					</td>
				</tr>
			</table>
		</div>
		
		<div id="div_right" style="display:none;">
			<br>
			<button class="btn btn-outline-info" onclick="goback()">Go Back</button><br>
			<br>
			<form.label table="role_table" name="user_name"></form.label>: <form.readonly table="role_table" name="user_name"></form.readonly><br>
			<form.label table="role_table" name="email"></form.label>: <form.textbox table="role_table" name="email" class="input-large"></form.textbox><br>
			<form.label table="role_table" name="first_name"></form.label>: <form.textbox table="role_table" name="first_name" class="input-small"></form.textbox><br>
			<form.label table="role_table" name="last_name"></form.label>: <form.textbox table="role_table" name="last_name" class="input-small"></form.textbox><br>
			<form.label table="role_table" name="phone"></form.label>: <form.textbox table="role_table" name="phone" class="input-small"></form.textbox><br>
			<form.label table="role_table" name="cell"></form.label>: <form.textbox table="role_table" name="cell" class="input-small"></form.textbox><br>
		</div>
</div>
<!-- container -->
<br>


<div id="table_error" wliu-diag movable maskable></div>
<div id="auto_tips" wliu-tips></div>
<div id="ajax_wait" wliu-load></div>
<div id="tool_tip" wliu-popup></div>



<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>
