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
		   	var col2 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"country_en",	colname:"Country.EN",   	sort:"ASC", maxlength:64, 	notnull:1 });
		   	var col3 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"country_cn", 	colname:"Country.CN", 		sort:"ASC", maxlength:64, 	notnull:1 });
		   	var col4 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"currency_en", colname:"Currency.EN", 		sort:"ASC", maxlength:16, 	notnull:1 });
		   	var col5 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"currency_cn", colname:"Currency.CN", 		sort:"ASC", maxlength:16, 	notnull:1 });
		   	var col6 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"symbol", 		colname:"Currency.Symbol", 	sort:"ASC", maxlength:16, 	notnull:1 });
		   	var col7 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"orderno", 	colname:"Sort", 			sort:"ASC", maxlength:3, 	notnull:1, datatype:"NUMBER" });
		   	var col8 = new WLIU.COL({key:0, table:"p",	coltype:"bool", 		name:"status",		colname:"Active?",  		defval: 1});
		   	var col9 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"last_updated",colname:"Last Updated", sort:"DESC"});

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

			var filter1 = new WLIU.FILTER({name:"country", 		coltype:"textbox", 		cols:"country_en,country_cn", 	colname:"Country", 		coldesc:"Search by Project"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				scope: 		"mytab",
				url:   		"ajax/web_country_action.php",
				tooltip:	"tool_tip",
				navi:   	{pagesize:20, match: 0, orderby:"last_updated", sortby:"DESC"},
				filters: 	filters,
				cols: 		cols
			});

            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "country_table" );
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
				<filter.label table="country_table" name="country"></filter.label> : 	<filter.textbox class="input-medium" table="country_table" name="country"></filter.textbox>
				<br>
				<table.tablebutton table="country_table" name="search" actname="Search" outline=1 style="margin-top:10px; margin-left:60px;"></table.tablebutton>
			</fieldset>
			<div style="margin-top:20px;">
				<table.navi table="country_table"></table.navi>
				<table class="table table-condensed">
					<tr style="background-color:#eeeeee;"> 
						<td width=50>
							<table.hicon table="country_table" name="add" 		actname="Add New"></table.hicon>
							<table.hicon table="country_table" name="save" 	actname="Save"></table.hicon>
							<table.hicon table="country_table" name="cancel" 	actname="Undo"></table.hicon>
						</td>
						<td width=40 align="center">
							<table.head table="country_table" name="SN"></table.head>
						</td>
						<td>
							<table.head table="country_table" name="country_en"></table.head>
						</td>
						<td>
							<table.head table="country_table" name="country_cn"></table.head>
						</td>
						<td>
							<table.head table="country_table"  name="currency_en"></table.head>
						</td>
						<td>
							<table.head table="country_table"  name="currency_cn"></table.head>
						</td>
						<td>
							<table.head table="country_table"  name="symbol"></table.head>
						</td>
						<td>
							<table.head table="country_table"  name="orderno"></table.head>
						</td>
						<td>
							<table.head table="country_table"  name="status"></table.head>
						</td>
						<td>
							<table.head table="country_table" name="last_updated"></table.head>
						</td>
					</tr>	
					<tr ng-repeat="row in country_table.rows">
						<td style="white-space:nowrap; width:40px;">
							<table.bicon table="country_table" name="save"  	actname="Save" 		row="row"></table.bicon>
							<table.bicon table="country_table" name="cancel"	actname="Cancel" 	row="row"></table.bicon>
							<table.bicon table="country_table" name="delete" 	actname="Delete" 	row="row"></table.bicon>
						</td>
						<td width=30 align="center">
							<table.rowno table="country_table"  row="row"></table.rowno>
						</td>
						<td width="120px">
							<table.textbox class="input-medium" table="country_table" name="country_en" row="row"></table.textbox>
						</td>
						<td width="80px">
							<table.textbox class="input-medium" table="country_table" name="country_cn" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="country_table" name="currency_en" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="country_table" name="currency_cn" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-small" table="country_table" name="symbol" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-small" table="country_table" name="orderno" row="row"></table.textbox>
						</td>
						<td>
							<table.bool table="country_table" name="status" row="row"></table.bool>
						</td>
						<td>
							<table.intdate table="country_table" name="last_updated" row="row"></table.intdate>
						</td>
					</tr>
				</table>
			</div>
	</div>
<?php include("include/menu_foot_html.php");?>

<table.popup table="country_table"></table.popup>
<div wliu-autotip></div>
<div wliu-wait></div>
<div id="tool_tip" wliu-popup></div>

</body>
</html>
