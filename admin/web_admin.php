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
		   	var col21 = new WLIU.COL({key:0, table:"p",	coltype:"custom", 		name:"listflag",	colname:"<a class='wliu-btn16 wliu-btn16-status-{status}'></a> "});
		   	var col22 = new WLIU.COL({key:0, table:"p",	coltype:"custom", 		name:"listinfo",	colname:"{first_name} {last_name} - {user_name}"});
		   	var col23 = new WLIU.COL({key:0, table:"p",	coltype:"bool", 		name:"locked",		colname:"Locked?",  	coldesc:"Account locked" });
			
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
		   	cols.push(col23);

			var filter1 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"user_name,email,first_name,last_name",  	colname:"Content",  	coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				lang:	 	GLang,
				scope: 		"mytab",
				url:   		"ajax/web_admin_action.php",
				tooltip:	"tool_tip",
				//rights: 	{detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
                lists:      {
                            countryList: 	{loaded: 0, keys:{guid:"", name:""}, list:[] },
                            roleList: 		{loaded: 0, keys:{guid:"", name:""}, list:[] }
                },
				navi:   	{pagesize:20, match: 1, orderby:"p.first_name", sortby:"ASC"},
				filters: 	filters,
				cols: 		cols
			});

            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "role_table" );
		    });

			$(function(){
				table.getRecords();
			});
		</script>
</head>
<body ng-app="myApp" ng-controller="myForm" class="fixed-sn mdb-skin">

<?php include("include/menu_head_html.php");?>
	<div class="wliuCommon-page-height">
		<div class="row">
			<div class="col-md-4">
				<table.list table="role_table" title="<?php echo gwords("website.admin")?>" searchcol="user_name,first_name,last_name,email,phone,cell" displaycol="user_name,email,first_name,last_name,phone,cell,role_id,last_login,hits,status,locked"></table.list>
			</div>
			<div class="col-md-8">
				<!---Admin Detail -->
				<div class="row">
					<div class="col-md-12 text-center">
						<form.button table="role_table" name="add" 		outline=1 	actname="Add"></form.button>	
						<form.button table="role_table" name="delete" 	outline=1 	actname="Delete"></form.button>
					</div>
				</div>
				
				<ul wliu-tab9 color-purple>
					<li><span><?php echo gwords("admin.detail")?></span><s></s></li>
				</ul>
				<div wliu-tab9-body>
					<div class="selected" style="padding:15px;">
						<div class="row">
							<div class="col-md-6" style="height:auto;">
									<!-- login information -->
									<div class="row">
										<div class="col-md-4 text-nowrap">
											<form.label table="role_table" name="user_name"></form.label>
										</div>
										<div class="col-md-8">
											<form.readonly table="role_table" name="user_name" class="input-auto"></form.readonly>			
										</div>
									</div>
									<div class="row">
										<div class="col-md-4 text-nowrap">
											<form.label table="role_table" name="email"></form.label>
										</div>
										<div class="col-md-8">
											<form.textbox table="role_table" name="email" class="input-auto"></form.textbox>		
										</div>
									</div>
									<div class="row">
										<div class="col-md-4 text-nowrap">
											<form.label table="role_table" name="password"></form.label>
										</div>
										<div class="col-md-8">
											<form.passpair table="role_table" name="password" class="input-auto"></form.passpair>		
										</div>
									</div>
									<div class="row">
										<div class="col-md-4 text-nowrap">
											<form.label table="role_table" name="role_id"></form.label>
										</div>
										<div class="col-md-8">
											<form.checkbox table="role_table" name="role_id" colnum=1></form.checkbox>		
										</div>
									</div>
									<br>
									<span class="wliuCommon-page-title"><?php echo gwords("account.status")?></span>									
									<hr class="wliuCommon-line" />
									<div class="row">
										<div class="col-md-4 text-nowrap">
											<form.label table="role_table" name="status"></form.label>
										</div>
										<div class="col-md-8">
											<form.bool table="role_table" name="status"></form.bool>		
										</div>
									</div>
									<div class="row">
										<div class="col-md-4 text-nowrap">
											<form.label table="role_table" name="locked"></form.label>
										</div>
										<div class="col-md-8">
											<form.bool table="role_table" name="locked"></form.bool>		
										</div>
									</div>
									<!-- //login information -->
							</div>
							<div class="col-md-6">
								<!-- Admin information -->
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="first_name"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="first_name" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="last_name"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="last_name" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="phone"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="phone" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="cell"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="cell" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="address"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="address" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="city"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="city" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="state"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="state" class="input-auto"></form.textbox>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="country"></form.label>
									</div>
									<div class="col-md-8">
										<form.select table="role_table" name="country" class="input-auto"></form.select>	
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="postal"></form.label>
									</div>
									<div class="col-md-8">
										<form.textbox table="role_table" name="postal" class="input-auto"></form.textbox>		
									</div>
								</div>
								<!-- \\Admin information -->
								<!-- other information -->
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="created_time"></form.label>
									</div>
									<div class="col-md-8">
										<form.intdate table="role_table" name="created_time"></form.intdate>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="last_updated"></form.label>
									</div>
									<div class="col-md-8">
										<form.intdate table="role_table" name="last_updated"></form.intdate>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="last_login"></form.label>
									</div>
									<div class="col-md-8">
										<form.intdate table="role_table" name="last_login"></form.intdate>		
									</div>
								</div>
								<div class="row">
									<div class="col-md-4 text-nowrap">
										<form.label table="role_table" name="hits"></form.label>
									</div>
									<div class="col-md-8">
										<form.text table="role_table" name="hits"></form.text>		
									</div>
								</div>
								<!-- \\other information -->
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 text-center">
								<form.button table="role_table" name="save"		outline=1 	actname="Save"></form.button>		
								<form.button table="role_table" name="cancel" 	outline=1 	actname="Cancel"></form.button>
							</div>
						</div>
						<div class="row">
							<div class="col-md-12">
								<table.message table="role_table"></table.message>
							</div>
						</div>
					</div>
				</div>
				<!-- \\Admin Detail -->
			</div>
		</div>
	</div>
<?php include("include/menu_foot_html.php");?>

<table.popup table="role_table"></table.popup>
<div wliu-autotip></div>
<div wliu-wait></div>
<div id="tool_tip" wliu-popup></div>

</body>
</html>
