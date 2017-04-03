<?php
session_start();
ini_set("display_errors", 1);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");

$words = cLANG::getWords("en");

print_r($words);

$save = cLANG::replace($words["save"], array("good"=>"Hello", "bad"=>"World"));
echo "save: $save";
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

	    <!-- Font Awesome & BS & MDB -->
		<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css' rel='stylesheet' />
		<link 	href='<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/css/bootstrap.min.css' type='text/css' rel='stylesheet' />
		<link href='<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/css/mdb.css' type='text/css' rel='stylesheet' />
		
		<!-- Bootstrap3.3 -->
		<script src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/tether.min.js" type="text/javascript"></script>
		<script src="<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/js/bootstrap.min.js" type="text/javascript"></script>    
		<!-- //Bootstrap -->
		
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
			var words = <?php echo json_encode($words); ?>;
			//alert( words["save"].replace("{{good}}", " Hello ").replace("{{bad}}", " World ")  );
		    console.log(words);

		   	var col1 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Lang ID",  	coldesc:"Word ID",  defval:0 });
		   	var col2 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"title_en",	colname:"Role(EN)", 	coldesc:"Role Name English",    sort:"ASC", maxlength:64, 	notnull:1,	tooltip:"tool_tip"});
		   	var col3 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"title_cn",	colname:"Role(CN)", 	coldesc:"Role Name Chinese",    sort:"ASC", maxlength:64, 	notnull:1	});
		   	var col4 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"desc_en", 	colname:"Detail(EN)", 	coldesc:"Description English",	sort:"ASC", maxlength:256, 	notnull:0	});
		   	var col5 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"desc_cn", 	colname:"Detail(CN)", 	coldesc:"Description Chinese",	sort:"ASC", maxlength:256, 	notnull:0	});
		   	var col6 = new WLIU.COL({key:0, table:"p",	coltype:"select", 		name:"level", 	    colname:"Class", 		coldesc:"Permission Level",  	sort:"ASC", list:"roleLevel", notnull:1 });
		   	var col7 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 	    name:"orderno", 	colname:"Sort",   	    coldesc:"Sort Number", 	sort:"ASC", notnull:1,  defval:0, datatype:"NUMBER" });
		   	var col8 = new WLIU.COL({key:0, table:"p",	coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", defval: true});

		   	var cols = [];
		   	cols.push(col1);
		   	cols.push(col2);
		   	cols.push(col3);
		   	cols.push(col4);
		   	cols.push(col5);
		   	cols.push(col6);
		   	cols.push(col7);
		   	cols.push(col8);

			var filter1 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"title_en,title_cn,desc_en,desc_cn",  	colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				scope: 		"mytab",
				url:   		"ajax/web_role_action.php",
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



			var col101 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Menu ID", coldesc:"Menu's ID"});
		   	var col103 = new WLIU.COL({key:0, table:"p", 	coltype:"bool", 		name:"status", 		colname:"Status", 	tooltip:"tool_tip"});
		   	var col104 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"menu_key", 	colname:"Menu Key",	coldesc:"Menu Key", 			unique:1,	notnull:1, tooltip:"tool_tip"});
		   	var col105 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"title_en", 	colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col106 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"desc_en", 	colname:"Desc(EN)",	coldesc:"Description English",	tooltip:"tool_tip"});
		   	var col107 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title(CN)",coldesc:"Title Chinese",		notnull:1, tooltip:"tool_tip"});
		   	var col108 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"desc_cn", 	colname:"Desc(CN)",	coldesc:"Description Chinese", 	tooltip:"tool_tip"});
		   	var col109 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"template", 	colname:"Template",	coldesc:"Template",				css:"input-medium",			tooltip:"tool_tip"});
		   	var col110 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"url",			colname:"URL",		coldesc:"URL",					tooltip:"tool_tip"});
		   	var col111 = new WLIU.COL({key:0, table:"p", 	coltype:"checkbox1", 	name:"right", 		colname:"Right",    css:"input-medium", list:"rightCategory",  targetid:"rightDiag1",	notnull:1});
		   	var col112 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"orderno", 	colname:"Sort", 	css:"input-tiny text-md-center", 	datatype:"NUMBER",  notnull:1, tooltip:"tool_tip"});

			var col201 = new WLIU.COL({key:1, table:"s",	coltype:"hidden", 		name:"id", 			colname:"Menu ID"});
		   	var col202 = new WLIU.COL({key:0, table:"s", 	coltype:"hidden", 		name:"ref_id",		colname:"Menu Parent ID"});
		   	var col203 = new WLIU.COL({key:0, table:"s", 	coltype:"bool", 		name:"status", 		colname:"Status", 	tooltip:"tool_tip"});
		   	var col204 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"menu_key", 	colname:"Menu Key",	coldesc:"Menu Key", 			unique:1,	notnull:1, tooltip:"tool_tip"});
		   	var col205 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"title_en", 	colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col206 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"desc_en", 	colname:"Desc(EN)",	coldesc:"Description English",	tooltip:"tool_tip"});
		   	var col207 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title(CN)",coldesc:"Title Chinese",		notnull:1, tooltip:"tool_tip"});
		   	var col208 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"desc_cn", 	colname:"Desc(CN)",	coldesc:"Description Chinese", 	tooltip:"tool_tip"});
		   	var col209 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"template", 	colname:"Template",	coldesc:"Template",				css:"input-medium",	tooltip:"tool_tip"});
		   	var col210 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"url",			colname:"URL",		coldesc:"URL",					tooltip:"tool_tip"});
		   	var col211 = new WLIU.COL({key:0, table:"s", 	coltype:"checkbox1", 	name:"right", 		colname:"Right",    css:"input-medium", list:"rightCategory",  targetid:"rightDiag1",	notnull:1});
		   	var col212 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"orderno", 	colname:"Sort", 	css:"input-tiny text-md-center", 	datatype:"NUMBER",  notnull:1, tooltip:"tool_tip"});


		   	var tree_cols = {};
		   	tree_cols.p = [];
			tree_cols.p.push(col101);
			tree_cols.p.push(col103);
			tree_cols.p.push(col104);
			tree_cols.p.push(col105);
			tree_cols.p.push(col106);
			tree_cols.p.push(col107);
			tree_cols.p.push(col108);
			tree_cols.p.push(col109);
			tree_cols.p.push(col110);
			tree_cols.p.push(col111);
			tree_cols.p.push(col112);
		   	
			tree_cols.s = [];
			tree_cols.s.push(col201);
		   	tree_cols.s.push(col202);
		   	tree_cols.s.push(col203);
		   	tree_cols.s.push(col204);
		   	tree_cols.s.push(col205);
		   	tree_cols.s.push(col206);
		   	tree_cols.s.push(col207);
		   	tree_cols.s.push(col208);
		   	tree_cols.s.push(col209);
		   	tree_cols.s.push(col210);
		   	tree_cols.s.push(col211);
		   	tree_cols.s.push(col212);
			
		    var tree = new WLIU.TREE({
				scope: 		"mytab",
				treeid:     "lemon",
				rootid: 	0,
				refid:      0,
				title: 		"Menus",
				url:   		"ajax/web_role_right_action.php",
				wait:   	"ajax_wait",
				autotip: 	"myauto",
				taberror:	"taberror",
				tooltip: 	"",
				rights: {detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
				//filters:filters,
				cols: 	 tree_cols,
				pbutton: ["add", "save", "cancel", "delete"],
				sbutton: ["save", "cancel", "delete"],
				mbutton: ["save", "cancel", "delete"],
				lists: 	{
							rightCategory: 		{ loaded: 0, keys:{guid:"", name:""}, list:[] }
				}
			});



            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				tree.setScope( $scope, "menu_tree" );
				table.setScope( $scope, "role_table" );

				$scope.row_detail = function(theRow) {
					tree.getRecords({refid: table.getRowKeys(theRow).id});
					$("#div_right").show();
					$("#div_role").hide();
				}
		    });

			$(function(){
				table.getRecords();
				//tree.getRecords({refid: table.getCurrentKeys().id});

				$('.min-chart#chart-sales').easyPieChart({
					barColor: "orange",
					onStep: function (from, to, percent) {
						$(this.el).find('.percent').text(Math.round(percent));
					}
				});				
			});

			function goback() {
				$("#div_right").hide();
				$("#div_role").show();
			}
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm">
<!-- container -->
<div class="container">
		<span class="min-chart" id="chart-sales" style="margin:0px;" data-percent="80"><span class="percent"></span></span>

		<div id="div_role" class="row">
			<fieldset>
				<legend>Search By</legend>
				<filter.label table="role_table" name="content"></filter.label> : 	<filter.textbox class="input-medium" table="role_table" name="content"></filter.textbox>
			</feildset>
			<div style="margin-top:20px;">
			<table.tablebutton table="role_table" name="search" actname="Search" outline=1></table.tablebutton>
			</div>
			<br>
			<table.navi table="role_table"></table.navi>
			<table class="table table-condensed">
				<tr style="background-color:#eeeeee;"> 
					<td width=50>
						<table.hicon table="role_table" name="add" 		actname="Add New"></table.hicon>
						<table.hicon table="role_table" name="save" 	actname="Save"></table.hicon>
						<table.hicon table="role_table" name="cancel" 	actname="Undo"></table.hicon>
					</td>
					<td width=40 align="center">
						<table.head table="role_table" name="SN"></table.head>
					</td>
					<td>
						<table.head table="role_table" name="title_en" class="input-medium"></table.head>
					</td>
					<td>
						<table.head table="role_table" name="desc_en"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="title_cn" class="input-medium"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="desc_cn"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="level"></table.head>
					</td>
					<td>
						<table.head table="role_table"  name="orderno"></table.head>
					</td>
					<td>
						<table.head table="role_table" name="status"></table.head>
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
						<table.textbox class="input-medium" table="role_table" name="title_en" row="row"></table.textbox>
					</td>
					<td>
						<table.textarea class="input-auto" table="role_table" name="desc_en" row="row"></table.textarea>
					</td>
					<td>
						<table.textbox class="input-medium" table="role_table" name="title_cn" row="row"></table.textbox>
					</td>
					<td>
						<table.textarea class="input-auto" table="role_table" name="desc_cn" row="row"></table.textarea>
					</td>
					<td>
						<table.select class="input-small" table="role_table" name="level" row="row"></table.select>
					</td>
					<td>
						<table.textbox class="input-tiny" table="role_table" name="orderno" row="row"></table.textbox>
					</td>
					<td>
						<table.bool table="role_table" name="status" row="row"></table.bool>
					</td>
				</tr>
			</table>
		</div>
		
		<div id="div_right" style="display:none;">
			<br>
			<button class="btn btn-outline-info" onclick="goback()">Go Back</button><br>
			<br>
			Role Name: 		<form.text table="role_table" name="title_en"></form.text><br>
			Role Detail: 	<form.text table="role_table" name="desc_en"></form.text><br>
			<table.tree table="menu_tree"></table.tree>
		</div>
</div>
<!-- container -->
<br>

<tree.checkdiag1 table="menu_tree" targetid="rightDiag1" name="rightCategory" colnum="0" colnum1="0" bar="1" title="Please Select"></tree.checkdiag1>

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
