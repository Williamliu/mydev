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
			var col101 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Menu ID", coldesc:"Menu's ID"});
		   	var col103 = new WLIU.COL({key:0, table:"p", 	coltype:"bool", 		name:"status", 		colname:"Status", 	tooltip:"tool_tip"});
		   	var col104 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"menu_key", 	colname:"Menu Key",	coldesc:"Menu Key", 		unique:1,	notnull:1, tooltip:"tool_tip"});
		   	var col105 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"title_en", 	colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col106 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"detail_en", 	colname:"Desc(EN)",	coldesc:"Description English",	tooltip:"tool_tip"});
		   	var col107 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title(CN)",coldesc:"Title Chinese",		notnull:1, tooltip:"tool_tip"});
		   	var col108 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"detail_cn", 	colname:"Desc(CN)",	coldesc:"Description Chinese", 	tooltip:"tool_tip"});
		   	var col109 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"template", 	colname:"Template",	coldesc:"Template",				css:"input-medium",			tooltip:"tool_tip"});
		   	var col110 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"url",			colname:"URL",		coldesc:"URL",					tooltip:"tool_tip"});
		   	var col111 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"icon", 		colname:"Icon",		coldesc:"Icon", 				tooltip:"tool_tip"});
		   	var col112 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"orderno", 	colname:"Sort", 	css:"input-tiny text-md-center", 	datatype:"NUMBER",  notnull:1, tooltip:"tool_tip"});

			var col201 = new WLIU.COL({key:1, table:"s",	coltype:"hidden", 		name:"id", 			colname:"Menu ID"});
		   	var col202 = new WLIU.COL({key:0, table:"s", 	coltype:"hidden", 		name:"parent_id",	colname:"Menu Parent ID"});
		   	var col203 = new WLIU.COL({key:0, table:"s", 	coltype:"bool", 		name:"status", 		colname:"Status", 	tooltip:"tool_tip"});
		   	var col204 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"menu_key", 	colname:"Menu Key",	coldesc:"Menu Key", 	unique:1,	notnull:1, tooltip:"tool_tip"});
		   	var col205 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"title_en",    colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col206 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"detail_en",   colname:"Desc(EN)",	coldesc:"Description English",	tooltip:"tool_tip"});
		   	var col207 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title(CN)",coldesc:"Title Chinese",		notnull:1, tooltip:"tool_tip"});
		   	var col208 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"detail_cn", 	colname:"Desc(CN)",	coldesc:"Description Chinese", 	tooltip:"tool_tip"});
		   	var col209 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"template", 	colname:"Template",	coldesc:"Template",				css:"input-medium",	tooltip:"tool_tip"});
		   	var col210 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"url",			colname:"URL",		coldesc:"URL",					tooltip:"tool_tip"});
		   	var col211 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"icon", 		colname:"Icon",		coldesc:"Icon", 				tooltip:"tool_tip"});
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
				lang:		GLang,
				scope: 		"mytab",
				treeid:     "lemon",
				rootid: 	0,
				refid:      0,
				title: 		gwords("website.menu.root"),
				url:   		"ajax/web_menu_action.php",
				//rights: {detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
				//filters:filters,
				cols: 	 tree_cols,

				rootadd: 1,
				pbutton: ["add", "save", "cancel", "delete"],
				sbutton: ["save", "cancel", "delete"],
				mbutton: ["save", "cancel", "delete"],
			});



            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				tree.setScope( $scope, "menu_tree" );
		    });

			$(function(){
				tree.getRecords();
			});
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm" class="fixed-sn mdb-skin">

<?php include("include/menu_head_html.php");?>
	<div class="wliuCommon-page-height">
		<?php echo gwords("website.admin.menu")?><br>
		<table.tree table="menu_tree"></table.tree>
	</div>
<?php include("include/menu_foot_html.php");?>

<br>
<div id="tool_tip" wliu-popup></div>
<div wliu-autotip></div>
<div wliu-wait></div>

</body>
</html>
