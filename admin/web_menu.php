<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
include("head/menu_admin.php");
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
			var col101 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Menu ID", coldesc:"Menu's ID"});
		   	var col103 = new WLIU.COL({key:0, table:"p", 	coltype:"bool", 		name:"status", 		colname:"Status", 	tooltip:"tool_tip"});
		   	var col104 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"menu_key", 	colname:"Menu Key",	coldesc:"Menu Key", 			unique:1,	notnull:1, tooltip:"tool_tip"});
		   	var col105 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"title", 	trans:1,	colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col106 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"detail", 	trans:1, 	colname:"Desc(EN)",	coldesc:"Description English",	tooltip:"tool_tip"});
		   	var col107 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title(CN)",coldesc:"Title Chinese",		notnull:1, tooltip:"tool_tip"});
		   	var col108 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"detail_cn", 	colname:"Desc(CN)",	coldesc:"Description Chinese", 	tooltip:"tool_tip"});
		   	var col109 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"template", 	colname:"Template",	coldesc:"Template",				css:"input-medium",			tooltip:"tool_tip"});
		   	var col110 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"url",			colname:"URL",		coldesc:"URL",					tooltip:"tool_tip"});
		   	var col111 = new WLIU.COL({key:0, table:"p", 	coltype:"textbox", 		name:"orderno", 	colname:"Sort", 	css:"input-tiny text-md-center", 	datatype:"NUMBER",  notnull:1, tooltip:"tool_tip"});

			var col201 = new WLIU.COL({key:1, table:"s",	coltype:"hidden", 		name:"id", 			colname:"Menu ID"});
		   	var col202 = new WLIU.COL({key:0, table:"s", 	coltype:"hidden", 		name:"parent_id",	colname:"Menu Parent ID"});
		   	var col203 = new WLIU.COL({key:0, table:"s", 	coltype:"bool", 		name:"status", 		colname:"Status", 	tooltip:"tool_tip"});
		   	var col204 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"menu_key", 	colname:"Menu Key",	coldesc:"Menu Key", 			unique:1,	notnull:1, tooltip:"tool_tip"});
		   	var col205 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"title", 		trans:1, colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col206 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"detail", 		trans:1, colname:"Desc(EN)",	coldesc:"Description English",	tooltip:"tool_tip"});
		   	var col207 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"title_cn", 	colname:"Title(CN)",coldesc:"Title Chinese",		notnull:1, tooltip:"tool_tip"});
		   	var col208 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"detail_cn", 	colname:"Desc(CN)",	coldesc:"Description Chinese", 	tooltip:"tool_tip"});
		   	var col209 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"template", 	colname:"Template",	coldesc:"Template",				css:"input-medium",	tooltip:"tool_tip"});
		   	var col210 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"url",			colname:"URL",		coldesc:"URL",					tooltip:"tool_tip"});
		   	var col211 = new WLIU.COL({key:0, table:"s", 	coltype:"textbox", 		name:"orderno", 	colname:"Sort", 	css:"input-tiny text-md-center", 	datatype:"NUMBER",  notnull:1, tooltip:"tool_tip"});


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
			
		    var tree = new WLIU.TREE({
				lang:		GLang,
				scope: 		"mytab",
				treeid:     "lemon",
				rootid: 	0,
				refid:      0,
				title: 		"Menus",
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
<body ng-app="myApp" ng-controller="myForm">
<!-- container -->
<div class="container">
			<br>
			Website Admin Menu<br>
			<table.tree table="menu_tree"></table.tree>
</div>
<!-- container -->
<br>

<div id="tool_tip" wliu-popup></div>
<div wliu-autotip></div>
<div wliu-wait></div>


<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>
