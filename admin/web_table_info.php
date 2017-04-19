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
		   	var col1 = new WLIU.COL({key:1, 	table:"p",	coltype:"hidden", 		name:"tid", 		col:"id", 	colname:"Table ID",  	coldesc:"Table ID", defval: 1 });
		   	var col2 = new WLIU.COL({key:0, 	table:"p",	coltype:"textbox", 		name:"title",		trans:1, 	colname:"Table Name", 	coldesc:"Table Name" });
		   	var col3 = new WLIU.COL({key:1, 	table:"s", 	coltype:"hidden", 		name:"bid", 		col:"id", 	colname:"Info ID",  coldesc:"Info ID", 	defval:"" });
		   	var col4 = new WLIU.COL({key:0, 	table:"s", 	coltype:"hidden", 		name:"ref_tid", 	col:"ref_id",   colname:"Ref ID",  	coldesc:"Ref ID", 	defval:"" });
		   	var col5 = new WLIU.COL({key:0, 	table:"s", 	coltype:"textbox", 		name:"title_en", 	colname:"Title.EN", 	coldesc:"Title English",  		sort:"ASC", maxlength:64, 	notnull:1, unique:1	});
		   	var col6 = new WLIU.COL({key:0, 	table:"s", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title.CN", 	coldesc:"Title Chinese",  		sort:"ASC", maxlength:64,  	notnull:1,  });
		   	var col7 = new WLIU.COL({key:0, 	table:"s", 	coltype:"textarea", 	name:"detail_en", 	colname:"Detail.EN",   	coldesc:"Description English",	sort:"ASC", maxlength:256 });
		   	var col8 = new WLIU.COL({key:0, 	table:"s", 	coltype:"textarea", 	name:"detail_cn", 	colname:"Detail.CN",   	coldesc:"Description Chinese",	sort:"ASC", maxlength:256 });
		   	var col9 = new WLIU.COL({key:0, 	table:"s", 	coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", 		defval: true});
		   	var col10 = new WLIU.COL({key:0, 	table:"s", 	coltype:"textbox", 		name:"orderno", 	colname:"Order", 		coldesc:"Order No.",  		sort:"Desc", min:1, max:999, defval:"0", datatype:"NUMBER" });

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

			var filter1 = new WLIU.FILTER({name:"tid", 	        coltype:"bind", 		colname:"Table Name", 	coldesc:"Search by Table Name", list: "tableList"});
			var filter2 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"s.title_en,s.title_cn,s.detail_en,s.detail_cn",  	colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);
			filters.push(filter2);

		    var table = new WLIU.TABLE({
				scope: 		"mytab",
				url:   		"ajax/web_table_info_action.php",
				tooltip:	"tool_tip",
				rights: 	{detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
				navi:   	{pagesize:20, match: 1, orderby:"s.last_updated", sortby:"DESC"},
				filters: 	filters,
				cols: 		cols,
                lists:      {
                    tableList: { loaded: 0 , list:[] }
                }
			});

            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "web_table" );
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
				<legend>Search By</legend>
				<filter.label table="web_table" name="tid"></filter.label> :        <filter.bind class="input-medium" 		table="web_table" name="tid"></filter.bind>
				<filter.label table="web_table" name="content"></filter.label> :    <filter.textbox class="input-medium" 	table="web_table" name="content"></filter.textbox>
				<br>
				<table.tablebutton table="web_table" name="search" actname="Search" outline=1 style="margin-top:10px; margin-left:60px;"></table.tablebutton>
			</fieldset>
			<div style="margin-top:20px;">
				<table.navi table="web_table"></table.navi>
				<table class="table table-condensed">
					<tr style="background-color:#eeeeee;"> 
						<td width=50>
							<table.hicon table="web_table" name="add" 		actname="Add New"  	action=""></table.hicon>
							<table.hicon table="web_table" name="save" 		actname="Save" 		action=""></table.hicon>
							<table.hicon table="web_table" name="cancel"	actname="Undo" 		action=""></table.hicon>
						</td>
						<td width=40 align="center">
							<table.head table="web_table" name="SN"></table.head>
						</td>
						<td>
							<table.head table="web_table" name="title"></table.head>
						</td>
						<td>
							<table.head table="web_table" name="title_en"></table.head>
						</td>
						<td>
							<table.head table="web_table"  name="detail_en"></table.head>
						</td>
						<td>
							<table.head table="web_table"  name="title_cn"></table.head>
						</td>
						<td>
							<table.head table="web_table"  name="detail_cn"></table.head>
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
							<table.bicon table="web_table" name="save"  	actname="Save" 		row="row" 	action=""></table.bicon>
							<table.bicon table="web_table" name="cancel"	actname="Cancel" 	row="row" 	action=""></table.bicon>
							<table.bicon table="web_table" name="delete" 	actname="Delete" 	row="row" 	action=""></table.bicon>
						</td>
						<td width=30 align="center">
							<table.rowno table="web_table"  row="row"></table.rowno>
						</td>
						<td width="100px">
							<table.text class="input-auto" table="web_table" name="title" row="row"></table.text>
						</td>
						<td width="100px">
							<table.textbox class="input-auto" table="web_table" name="title_en" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-large" table="web_table" name="detail_en" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-small" table="web_table" name="title_cn" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-large" table="web_table" name="detail_cn" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-tiny" table="web_table" name="orderno" row="row" style="text-align:center;"></table.textbox>
						</td>
						<td>
							<table.bool table="web_table" name="status" row="row"></table.bool>
						</td>
					</tr>
				</table>
			</div>
	</div>
<?php include("include/menu_foot_html.php");?>

<table.popup table="web_table"></table.popup>
<div wliu-autotip></div>
<div wliu-wait></div>
<div id="tool_tip" wliu-popup></div>

</body>
</html>
