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
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.list.js" type="text/javascript"></script>
		<script	src="<?php echo $CFG["web_domain"]?>/angularjs/wliu/wliu.table.filter.js" type="text/javascript"></script>
	
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.js" type="text/javascript"></script>
		<link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.js" type="text/javascript"></script>
		<link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.css' type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.js" type="text/javascript"></script>
		<link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.css" type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/tree/wliu.jquery.tree.js" type="text/javascript"></script>
		<link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/tree/wliu.jquery.tree.css" type='text/css' rel='stylesheet' />
		<script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/tab/wliu.jquery.tab.js" type="text/javascript"></script>
		<link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/tab/wliu.jquery.tab.css" type='text/css' rel='stylesheet' />


		<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.common.css' type='text/css' rel='stylesheet' />
		<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.buttons.css' type='text/css' rel='stylesheet' />
		<!-- //wliu components -->


        <script language="javascript" type="text/javascript">
		   	var col1 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Lang ID",  	coldesc:"Word ID",  defval:0 });
		   	var col2 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"title_en", 	colname:"Role(EN)", 	coldesc:"Role Name English",    sort:"ASC", maxlength:64, 	notnull:1,	tooltip:"tool_tip"});
		   	var col3 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"title_cn",	colname:"Role(CN)", 	coldesc:"Role Name Chinese",    sort:"ASC", maxlength:64, 	notnull:1	});
		   	var col4 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"detail_en",  	colname:"Detail(EN)", 	coldesc:"Description English",	sort:"ASC", maxlength:256, 	notnull:0	});
		   	var col5 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"detail_cn", 	colname:"Detail(CN)", 	coldesc:"Description Chinese",	sort:"ASC", maxlength:256, 	notnull:0	});
		   	var col6 = new WLIU.COL({key:0, table:"p",	coltype:"select", 		name:"level", 	    colname:"Class", 		coldesc:"Permission Level",  	sort:"ASC", list:"roleLevel", notnull:1 });
		   	var col7 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 	    name:"orderno", 	colname:"Sort",   	    coldesc:"Sort Number", 	sort:"ASC", notnull:1,  defval:0, datatype:"NUMBER" });
		   	var col8 = new WLIU.COL({key:0, table:"p",	coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", defval: true});
		   	var col9 = new WLIU.COL({key:0, table:"p",	coltype:"custom", 		name:"listddd",		colname:"<a class='wliu-btn16 wliu-btn16-status-{status}'></a> "});
		   	var col10 = new WLIU.COL({key:0, table:"p",	coltype:"custom", 		name:"listccc",		colname:"{title_en} - {title_cn}"});
		   	var col11 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"created_time",colname:"Created",  	coldesc:"Created on"});

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

			var filter1 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"title_en,title_cn,detail_en,detail_cn",  	colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				lang:	 	GLang,
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
		   	var col102 = new WLIU.COL({key:0, table:"p", 	coltype:"text", 		name:"title", 		trans:1,	colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col103 = new WLIU.COL({key:0, table:"p", 	coltype:"custom", 		name:"aaa", 		colname:"&nbsp;&nbsp;&nbsp;"});
		   	var col104 = new WLIU.COL({key:0, table:"p", 	coltype:"checkbox1", 	name:"right", 		colname:"Right",    css:"input-medium", list:"rightCategory",  targetid:"rightDiag1",	notnull:0});

			var col201 = new WLIU.COL({key:1, table:"s",	coltype:"hidden", 		name:"id", 			colname:"Menu ID"});
		   	var col202 = new WLIU.COL({key:0, table:"s", 	coltype:"hidden", 		name:"parent_id",	colname:"Menu Parent ID"});
		   	var col203 = new WLIU.COL({key:0, table:"s", 	coltype:"text", 		name:"title", 		trans:1, colname:"Title(EN)",coldesc:"Title English",		notnull:1, tooltip:"tool_tip"});
		   	var col204 = new WLIU.COL({key:0, table:"s", 	coltype:"custom", 		name:"ccc", 		colname:"&nbsp;&nbsp;&nbsp;"});
		   	var col205 = new WLIU.COL({key:0, table:"s", 	coltype:"checkbox1", 	name:"right", 		colname:"Right",    css:"input-medium", list:"rightCategory",  targetid:"rightDiag1",	notnull:0});


		   	var tree_cols = {};
		   	tree_cols.p = [];
			tree_cols.p.push(col101);
			tree_cols.p.push(col102);
			tree_cols.p.push(col103);
			tree_cols.p.push(col104);
		   	
			tree_cols.s = [];
			tree_cols.s.push(col201);
		   	tree_cols.s.push(col202);
		   	tree_cols.s.push(col203);
		   	tree_cols.s.push(col204);
		   	tree_cols.s.push(col205);
			
		    var tree = new WLIU.TREE({
				lang:		GLang,
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
				//rights: {detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
				//filters:filters,
				cols: 	 tree_cols,
				rootadd: 0,
				pbutton: ["save", "cancel"],
				sbutton: ["save", "cancel"],
				mbutton: ["save", "cancel"],
				lists: 	{
							rightCategory: 		{ loaded: 0, keys:{guid:"", name:""}, list:[] }
				}
			});



            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				tree.setScope( $scope, "menu_tree" );
				table.setScope( $scope, "role_table" );
				$scope.itemClick = function() {
					tree.getRecords({refid: table.getCurrentKeys().id});
				}
				$scope.$watch("role_table.getCurrentKeys().id", $scope.itemClick);
		    });

			$(function(){
				table.getRecords();
				tree.getRecords();
			});
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm">
<!-- container -->
<div class="container">
	<br>
	<div class="row">
			<div class="col-md-4">
				<table.list table="role_table" title="Website Roles" searchcol="title_en,title_cn" displaycol="title_en,detail_en,title_cn,detail_cn,level,status,created_time"></table.list>
			</div>
			<div class="col-md-8">

			<ul wliu-tab9 color-purple>
				<li><span>Role Detail</span><s></s></li>
			</ul>
			<div wliu-tab9-body>
				<div class="selected" style="padding:15px;">
					<div class="row">
						<div class="col-md-2 text-nowrap">
							<form.label table="role_table" name="title_en"></form.label>
						</div>
						<div class="col-md-4">
							<form.textbox table="role_table" name="title_en" class="input-auto"></form.textbox>
						</div>
						<div class="col-md-2 text-nowrap">
							<form.label table="role_table" name="title_cn"></form.label>
						</div>
						<div class="col-md-4">
							<form.textbox table="role_table" name="title_cn" class="input-auto"></form.textbox>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2 text-nowrap">
							<form.label table="role_table" name="detail_en"></form.label>
						</div>
						<div class="col-md-4">
							<form.textarea table="role_table" name="detail_en" class="input-auto"></form.textarea>
						</div>
						<div class="col-md-2 text-nowrap">
							<form.label table="role_table" name="detail_cn"></form.label>
						</div>
						<div class="col-md-4">
							<form.textarea table="role_table" name="detail_cn" class="input-auto"></form.textarea>
						</div>
					</div>
					<div class="row">
						<div class="col-md-2 text-nowrap">
							<form.label table="role_table" name="level"></form.label>
						</div>
						<div class="col-md-4">
							<form.select table="role_table" name="level" class="input-auto"></form.select>
						</div>
						<div class="col-md-1 text-nowrap">
							<form.label table="role_table" name="status"></form.label>
						</div>
						<div class="col-md-2">
							<form.bool table="role_table" name="status"></form.bool>
						</div>
						<div class="col-md-1 text-nowrap">
							<form.label table="role_table" name="orderno"></form.label>
						</div>
						<div class="col-md-2">
							<form.textbox table="role_table" name="orderno" class="input-tiny"></form.textbox>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4 text-center">
							<form.button table="role_table" name="add" 	outline=1 	actname="Add"></form.button>	
						</div>
						<div class="col-md-8">
							<form.button table="role_table" name="save"		outline=1 	actname="Save"></form.button>		
							<form.button table="role_table" name="cancel" 	outline=1 	actname="Cancel"></form.button>
							<form.button table="role_table" name="delete" 	outline=1 	actname="Delete"></form.button>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<form.message table="role_table"></form.message>
						</div>
					</div>
				</div>
			</div>

			<ul wliu-tab9 color-purple>
				<li><span>Role Menu Rights</span><s></s></li>
			</ul>
			<div wliu-tab9-body>
				<div class="selected" style="padding:15px;">
					<div class="row">
						<div class="col-md-12">
							Menu Rights:<br>
							<table.tree table="menu_tree"></table.tree>
						</div>
					</div>
				</div>
			</div>
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
