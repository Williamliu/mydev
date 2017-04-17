<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
include_once($CFG["include_path"] . "/wliu/auth/auth_admin_client.php");
include_once($CFG["include_path"] . "/wliu/secure/secure_client.php");
include("include/menu_admin_stay.php");
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
		   	var col2 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"user_name", 	colname:"User Name", 	coldesc:"Login User",    	sort:"ASC", maxlength:64, 			notnull:1, 	unique:1,	tooltip:"tool_tip"});
		   	var col3 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"email",		colname:"Email", 		coldesc:"Email Address",    sort:"ASC", maxlength:256, 			notnull:1, 	unique:1,	datatype:"EMAIL" });
		   	var col4 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"first_name", 	colname:"First Name", 	coldesc:"First Name",		sort:"ASC", maxlength:64, 			notnull:1	});
		   	var col5 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"last_name", 	colname:"Last Name", 	coldesc:"Last Name",		sort:"ASC", maxlength:64, 			notnull:1	});
		   	var col6 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"phone", 	    colname:"Phone", 		coldesc:"Phone", 			sort:"ASC", maxlength:64, notnull:0 });
		   	var col7 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 	    name:"cell", 		colname:"Cell",   	    coldesc:"Cell Phone", 		sort:"ASC", maxlength:64, notnull:0 });
		   	var col8 = new WLIU.COL({key:0, table:"p",	coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status", 	defval:1 });
		   	var col9 = new WLIU.COL({key:0, table:"p",	coltype:"text", 		name:"hits",		colname:"Logins",  		coldesc:"Login Count"});
		   	var col10 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"address",		colname:"Address",  	coldesc:"Address", 			maxlength:256});
		   	var col11 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"city",		colname:"City",  		coldesc:"City", 			maxlength:64});
		   	var col12 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"state",		colname:"State",  		coldesc:"State/Province", 	maxlength:64});
		   	var col13 = new WLIU.COL({key:0, table:"p",	coltype:"select", 		name:"country",		colname:"Country",  	coldesc:"Country", 			list:"countryList"});
		   	var col14 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"postal",		colname:"Postal",  		coldesc:"Postal", 			maxlength:16});
		   	var col15 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"created_time",colname:"Created Time", coldesc:"Created Time" });
		   	var col16 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"last_updated",colname:"Last Updated", coldesc:"Last Updated" });
		   	var col17 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"last_login",	colname:"Last Login", 	coldesc:"Last Login" });
		   	var col18 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"login_count", colname:"Login Count",  coldesc:"Login Count",  min:0 , max:5, maxlength:1 });
		   	var col19 = new WLIU.COL({key:0, table:"p",	coltype:"checkbox", 	name:"role_id", 	colname:"Role",  		coldesc:"Admin Role", 	list:"roleList" });
		   	var col20 = new WLIU.COL({key:0, table:"p",	coltype:"passpair", 	name:"password", 	colname:"Password",  	coldesc:"Login Password", minlength:6, maxlength:16, need:1, notnull:1 });
		   	var col21 = new WLIU.COL({key:0, table:"p",	coltype:"custom", 		name:"listflag",		colname:"<a class='wliu-btn16 wliu-btn16-status-{status}'></a> "});
		   	var col22 = new WLIU.COL({key:0, table:"p",	coltype:"custom", 		name:"listinfo",		colname:"{first_name} {last_name} - {user_name}"});
			
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
		   	cols.push(col19);
		   	cols.push(col20);
		   	cols.push(col21);
		   	cols.push(col22);

		    var table = new WLIU.TABLE({
				lang:	 	GLang,
				scope: 		"mytab",
				url:   		"ajax/web_myaccount_action.php",
				firstone: 	1,   // very important to set current to first row
                lists:      {
                            countryList: 	{loaded: 0, keys:{guid:"", name:""}, list:[] },
                            roleList: 		{loaded: 0, keys:{guid:"", name:""}, list:[] }
                },
				cols: 		cols
			});

            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "myaccount" );
		    });

			$(function(){
				table.formGet();
			});
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm" class="fixed-sn mdb-skin">

	<?php include("include/menu_head_html.php");?>
	<div style="min-height:720px;">
			<!---Admin Detail -->
			<ul wliu-tab9 color-purple>
				<li><span><?php echo gwords("my.account")?></span><s></s></li>
			</ul>
			<div wliu-tab9-body>
				<div class="selected" style="padding:15px;">
					<div class="row">
						<div class="col-md-4" style="height:auto;">
								<!-- login information -->
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="myaccount" name="user_name"></form.label>
									</div>
									<div class="col-md-8">
										<form.readonly table="myaccount" name="user_name" class="input-auto"></form.readonly>			
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="myaccount" name="email"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="myaccount" name="email" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="myaccount" name="password"></form.label>
									</div>
									<div class="col-md-8">
										<form.passpair table="myaccount" name="password" class="input-auto"></form.passpair>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="myaccount" name="role_id"></form.label>
									</div>
									<div class="col-md-8">
										<form.checktext1 table="myaccount" name="role_id" colnum=1></form.checktext1>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="myaccount" name="status"></form.label>
									</div>
									<div class="col-md-8">
										<form.booltext table="myaccount" name="status" no="Locked"></form.booltext>		
									</div>
								</div>
								<!-- //login information -->
						</div>
						<div class="col-md-4">
							<!-- Admin information -->
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="first_name"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="first_name" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="last_name"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="last_name" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="phone"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="phone" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="cell"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="cell" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="address"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="address" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="city"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="city" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="state"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="state" class="input-auto"></form.textbox>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="country"></form.label>
								</div>
								<div class="col-md-8">
									<form.select table="myaccount" name="country" class="input-auto"></form.select>	
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="postal"></form.label>
								</div>
								<div class="col-md-8">
									<form.textbox table="myaccount" name="postal" class="input-auto"></form.textbox>		
								</div>
							</div>
							<!-- \\Admin information -->
						</div>
						<div class="col-md-4">
							<!-- other information -->
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="created_time"></form.label>
								</div>
								<div class="col-md-8">
									<form.intdate table="myaccount" name="created_time"></form.intdate>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="last_updated"></form.label>
								</div>
								<div class="col-md-8">
									<form.intdate table="myaccount" name="last_updated"></form.intdate>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="last_login"></form.label>
								</div>
								<div class="col-md-8">
									<form.intdate table="myaccount" name="last_login"></form.intdate>		
								</div>
							</div>
							<div class="row">
								<div class="col-md-4 text-nowrap">
									<form.label table="myaccount" name="hits"></form.label>
								</div>
								<div class="col-md-8">
									<form.text table="myaccount" name="hits"></form.text>		
								</div>
							</div>
							<!-- \\other information -->
						</div>
					</div>
					<div class="row">
						<div class="col-md-12 text-center">
							<form.button table="myaccount" name="save"		outline=1 	actname="Save"></form.button>		
							<form.button table="myaccount" name="cancel" 	outline=1 	actname="Cancel"></form.button>
						</div>
					</div>
				</div>
			</div>
			<!-- \\Admin Detail -->
	</div>
	<?php include("include/menu_foot_html.php");?>
	
	<table.popup table="myaccount"></table.popup>
	<div wliu-autotip></div>
	<div wliu-wait></div>

<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>
