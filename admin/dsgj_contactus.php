<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
include_once($CFG["include_path"] . "/wliu/auth/auth_admin_client.php");
include_once($CFG["include_path"] . "/wliu/secure/secure_client.php");
include("include/menu_admin.php");
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<?php include("include/html_head_include.php"); ?>
        <script language="javascript" type="text/javascript">
		   	var col1 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Lang ID",  	defval:0 });
		   	var col2 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"full_name",	colname:"Name",   		sort:"ASC", maxlength:256, 	notnull:1 });
		   	var col3 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"email", 		colname:"Email", 		sort:"ASC", maxlength:256, 	notnull:1 });
		   	var col4 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"phone",		colname:"phone", 		sort:"ASC", maxlength:16, 	notnull:1 });
		   	var col5 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"detail", 		colname:"Detail", 		sort:"ASC", maxlength:4096, notnull:1 });
		   	var col6 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"created_time",colname:"Date", 		sort:"DESC"});

		   	var cols = [];
		   	cols.push(col1);
		   	cols.push(col2);
		   	cols.push(col3);
		   	cols.push(col4);
		   	cols.push(col5);
		   	cols.push(col6);

			var filter1 = new WLIU.FILTER({name:"content", 		coltype:"textbox", 		cols:"full_name,email,phone,detail", 	colname:"Content", 		coldesc:"Search by Content"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				scope: 		"mytab",
				url:   		"ajax/dsgj_contactus_action.php",
				tooltip:	"tool_tip",
				navi:   	{pagesize:20, match: 0, orderby:"created_time", sortby:"DESC"},
				filters: 	filters,
				cols: 		cols
			});

            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "contactus_table" );
		    });

			$(function(){
				table.getRecords();
			});
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm" class="fixed-sn mdb-skin">

<?php include("include/menu_head_html.php");?>
	<div class="wliuCommon-page-height">
			<fieldset>
				<legend><?php echo $words["search by"];?></legend>
				<filter.label table="contactus_table" name="content"></filter.label> : 	<filter.textbox class="input-medium" table="contactus_table" name="content"></filter.textbox>
				<br>
				<table.tablebutton table="contactus_table" name="search" actname="Search" outline=1 style="margin-top:10px; margin-left:60px;"></table.tablebutton>
			</fieldset>
			<div style="margin-top:20px;">
				<table.navi table="contactus_table"></table.navi>
				<table class="table table-condensed">
					<tr style="background-color:#eeeeee;"> 
						<td width=50>
							<table.hicon table="contactus_table" name="save" 	actname="Save"></table.hicon>
							<table.hicon table="contactus_table" name="cancel" 	actname="Undo"></table.hicon>
						</td>
						<td width=40 align="center">
							<table.head table="contactus_table" name="SN"></table.head>
						</td>
						<td>
							<table.head table="contactus_table" name="full_name"></table.head>
						</td>
						<td>
							<table.head table="contactus_table" name="email"></table.head>
						</td>
						<td>
							<table.head table="contactus_table"  name="phone"></table.head>
						</td>
						<td>
							<table.head table="contactus_table"  name="detail"></table.head>
						</td>
						<td>
							<table.head table="contactus_table" name="created_time"></table.head>
						</td>
					</tr>	
					<tr ng-repeat="row in contactus_table.rows">
						<td style="white-space:nowrap; width:40px;">
							<table.bicon table="contactus_table" name="save"  	actname="Save" 		row="row"></table.bicon>
							<table.bicon table="contactus_table" name="cancel"	actname="Cancel" 	row="row"></table.bicon>
							<table.bicon table="contactus_table" name="delete" 	actname="Delete" 	row="row"></table.bicon>
						</td>
						<td width=30 align="center">
							<table.rowno table="contactus_table"  row="row"></table.rowno>
						</td>
						<td>
							<table.text class="input-medium" table="contactus_table" name="full_name" row="row"></table.text>
						</td>
						<td>
							<table.text class="input-medium" table="contactus_table" name="email" row="row"></table.text>
						</td>
						<td>
							<table.text class="input-medium" table="contactus_table" name="phone" row="row"></table.text>
						</td>
						<td>
							<table.text class="input-long" table="contactus_table" name="detail" row="row"></table.text>
						</td>
						<td>
							<table.intdate table="contactus_table" name="created_time" row="row"></table.intdate>
						</td>
					</tr>
				</table>
			</div>
	</div>
<?php include("include/menu_foot_html.php");?>

<table.popup table="contactus_table"></table.popup>
<div wliu-autotip></div>
<div wliu-wait></div>
<div id="tool_tip" wliu-popup></div>

</body>
</html>
