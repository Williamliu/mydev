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
		   	var col101 = new WLIU.COL({key:1, table:"p",	coltype:"hidden", 		name:"id", 			colname:"Student ID",  	defval:0 });
		   	var col102 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"stu_fname", 	colname:"Stu.F.Name", 	sort:"ASC", maxlength:64, 			notnull:1 });
		   	var col103 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"stu_lname", 	colname:"Stu.L.Name", 	sort:"ASC", maxlength:64, 			notnull:1  });
		   	var col104 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"stu_email",	colname:"Stu.Email", 	sort:"ASC", maxlength:256, 		notnull:1, datatype:"EMAIL" });
		   	var col105 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"stu_phone",	colname:"Stu.Phone", 	sort:"ASC", maxlength:256, 		notnull:1, datatype:"EMAIL" });
		   	var col106 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"passport", 	colname:"Passport.No", 	sort:"ASC", maxlength:32, 			notnull:1  });
		   	var col107 = new WLIU.COL({key:0, table:"p",	coltype:"textbox", 		name:"school_name", colname:"School Name", 	sort:"ASC", maxlength:128, 			notnull:0 });
		   	var col108 = new WLIU.COL({key:0, table:"p",	coltype:"intdate", 		name:"created_time",colname:"Created Time", coldesc:"Date" });

		   	var cols = [];
		   	cols.push(col101);
		   	cols.push(col102);
		   	cols.push(col103);
		   	cols.push(col104);
		   	cols.push(col105);
		   	cols.push(col106);
		   	cols.push(col107);
		   	cols.push(col108);

			var filter1 = new WLIU.FILTER({name:"content", 		coltype:"textbox",		cols:"stu_fname,stu_lname,stu_email,stu_phone,passport,school_name", colname:"Content",  coldesc:"search by Content"});
			var filters = [];
			filters.push(filter1);

		    var table = new WLIU.TABLE({
				lang:	 	GLang,
				scope: 		"mytab",
				url:   		"ajax/dsgj_studentform_action.php",
				wait:   	"ajax_wait",
				tooltip:	"tool_tip",
				navi:   	{pagesize:20, match: 1, orderby:"created_time", sortby:"DESC"},
				filters: 	filters,
				cols: 		cols
			});


			var col0 = new WLIU.COL({key:1, coltype:"hidden", 		name:"id", 				colname:"ID" });
			var col1 = new WLIU.COL({key:0, coltype:"textbox", 		name:"school_name", 	maxlength:128,	colname:"Name of School 学校名称 (英文)", need: 1 });
			var col2 = new WLIU.COL({key:0, coltype:"textbox", 		name:"school_address", 	maxlength:128,	colname:"Address of School 学校地址 (英文)" });
			var col3 = new WLIU.COL({key:0, coltype:"checkbox", 	name:"ck_service", 		colname:"Please check off services you require 请在以下所需项目上钩选", list: "mservice" });
			var col4 = new WLIU.COL({key:0, coltype:"radio", 		name:"rd_service", 		colname:"4. Dedicated Student Support Package for School, Homestay and Career 家长放心服务包", list: "sservice" });
			var col5 = new WLIU.COL({key:0, coltype:"textbox", 		name:"stu_fname",		maxlength:64,	colname:"First Name 名", need:1,  notnull:1});
			var col6 = new WLIU.COL({key:0, coltype:"textbox", 		name:"stu_lname",		maxlength:64,	colname:"Last Name 姓",	need:1,  notnull:1});
			var col7 = new WLIU.COL({key:0, coltype:"textbox", 		name:"stu_oname", 		maxlength:64,	colname:"Other Name 其他名字" });
			var col8 = new WLIU.COL({key:0, coltype:"textbox", 		name:"passport", 		maxlength:32,	colname:"Passport No. 护照号", need:1,  notnull:1});
			var col9 = new WLIU.COL({key:0, coltype:"textbox", 		name:"en_score", 		maxlength:128,	colname:"英语成绩"});
			var col10 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_address",		maxlength:128,	colname:"Home Address 家庭住址"});
			var col11 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_state", 		maxlength:128,	colname:"Province/Territory 省"});
			var col12 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_city", 		maxlength:128,	colname:"City/Town 城市"});
			var col13 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_postal", 		maxlength:16,	colname:"Postal Code 邮编"});
			var col14 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_email", 		maxlength:128,	colname:"E-mail 电子邮件", need:1, notnull:1, datatype:"email"});
			var col15 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_phone", 		maxlength:32,	colname:"Phone 电话", need: 1 });
			var col16 = new WLIU.COL({key:0, coltype:"textbox", 	name:"stu_wechat", 		maxlength:32,	colname:"WeChat 微信"});
			var col17 = new WLIU.COL({key:0, coltype:"textbox", 	name:"dad_fname",		maxlength:64,	colname:"Father's Name 父亲姓名", need:1,  notnull:1});
			var col18 = new WLIU.COL({key:0, coltype:"textbox", 	name:"dad_email", 		maxlength:128,	colname:"E-mail 父亲邮件", need:0, notnull:0, datatype:"email"});
			var col19 = new WLIU.COL({key:0, coltype:"textbox", 	name:"dad_phone", 		maxlength:32,	colname:"Phone 父亲电话"});
			var col20 = new WLIU.COL({key:0, coltype:"textbox", 	name:"dad_wechat", 		maxlength:32,	colname:"WeChat 父亲微信"});
			var col21 = new WLIU.COL({key:0, coltype:"date", 		name:"dad_birth", 		colname:"BirthDate 父亲生日", need:0, notnull:0});

			var col22 = new WLIU.COL({key:0, coltype:"textbox", 	name:"mom_fname",		maxlength:64,	colname:"Mother's Name 母亲姓名", need:1,  notnull:1});
			var col23 = new WLIU.COL({key:0, coltype:"textbox", 	name:"mom_email", 		maxlength:128,	colname:"E-mail 母亲邮件", need:0, notnull:0, datatype:"email"});
			var col24 = new WLIU.COL({key:0, coltype:"textbox", 	name:"mom_phone", 		maxlength:32,	colname:"Phone 母亲电话"});
			var col25 = new WLIU.COL({key:0, coltype:"textbox", 	name:"mom_wechat", 		maxlength:32,	colname:"WeChat 母亲微信"});
			var col26 = new WLIU.COL({key:0, coltype:"date", 		name:"mom_birth", 		colname:"BirthDate 母亲生日", need:0, notnull:0});

			var col27 = new WLIU.COL({key:0, coltype:"textbox", 	name:"par_address",		maxlength:128,	colname:"Home Address 父母住址", need:0,  notnull:0});
			var col28 = new WLIU.COL({key:0, coltype:"textbox", 	name:"par_state", 		maxlength:128,	colname:"Province/Territory 省"});
			var col29 = new WLIU.COL({key:0, coltype:"textbox", 	name:"par_city", 		maxlength:128,	colname:"City/Town 城市"});
			var col30 = new WLIU.COL({key:0, coltype:"textbox", 	name:"par_postal", 		maxlength:16,	colname:"Postal Code 邮编"});
			var col31 = new WLIU.COL({key:0, coltype:"textbox", 	name:"airline", 		maxlength:32,	colname:"Airline 航空公司"});
			var col32 = new WLIU.COL({key:0, coltype:"textbox", 	name:"flight", 			maxlength:32,	colname:"Flight No. 航班"});
			var col33 = new WLIU.COL({key:0, coltype:"datetime", 	name:"pickup_datetime", colname:"Arrival Time 抵达时间"});
			var col34 = new WLIU.COL({key:0, coltype:"textbox", 	name:"destination", 	maxlength:128,	colname:"Please provide destination address if known. 如果已知目的地，请填写地址"});
			var col35 = new WLIU.COL({key:0, coltype:"date", 		name:"homestay_start", 	colname:"Starting Date 开始居住日期"});
			var col36 = new WLIU.COL({key:0, coltype:"date", 		name:"homestay_end", 	colname:"Ending of Date 结束居住日期"});
			var col37 = new WLIU.COL({key:0, coltype:"textbox", 	name:"health_medicine", maxlength:256,	colname:"请填写任何被诊断出而且需长期服药的疾病，包括但不限于干涉到生理，心理，精神问题。请填写长期服用的有关药名和服用量。如有过敏史，包括食物，药品，粉尘等，请务必说明"});
			var col38 = new WLIU.COL({key:0, coltype:"textbox", 	name:"health_horby", 	maxlength:256,	colname:"请填写任何学习和社交障碍以及生活习惯，行举异常的状况，这包括但不限于睡眠，吸烟，饮酒等"});
			var col39 = new WLIU.COL({key:0, coltype:"textbox", 	name:"per_character", 	maxlength:256,	colname:"简单描述你的性格，如外向，乐观，安静等"});
			var col40 = new WLIU.COL({key:0, coltype:"textbox", 	name:"per_horby", 		maxlength:256,	colname:"你的兴趣爱好"});
			var col41 = new WLIU.COL({key:0, coltype:"textbox", 	name:"per_sport", 		maxlength:256,	colname:"喜欢的运动"});
			var col42 = new WLIU.COL({key:0, coltype:"textbox", 	name:"per_music", 		maxlength:256,	colname:"擅长演奏的乐器"});
			var col43 = new WLIU.COL({key:0, coltype:"textbox", 	name:"per_food", 		maxlength:256,	colname:"喜欢的食物"});
			var col44 = new WLIU.COL({key:0, coltype:"bool", 		name:"per_vegit", 		maxlength:256,	colname:"是否吃素"});
			var col45 = new WLIU.COL({key:0, coltype:"checkbox", 	name:"homestay_child", 	colname:"寄宿家庭成员", list:"homestay_child"});
			var col46 = new WLIU.COL({key:0, coltype:"radio", 		name:"homestay_envir", 	colname:"寄宿家庭环境", list:"homestay_envir"});
			var col47 = new WLIU.COL({key:0, coltype:"textbox", 	name:"homestay_other", 	maxlength:256,	colname:"其它特别要求"});
			var col48 = new WLIU.COL({key:0, coltype:"textarea", 	name:"homestay_letter", maxlength:1024,	colname:"(简单的介绍自己， 以及为什么选择到加拿大留学，需用英文写)"});
			var col49 = new WLIU.COL({key:0, coltype:"textarea", 	name:"homestay_concern",maxlength:1024,	colname:"Parental Concerns 学生家长关心的问题 (请家长填写)"});
			var col50 = new WLIU.COL({key:0, coltype:"upload", 		name:"passport_copy",   colname:"请提供护照信息页影印件", view:"large" });
			var col51 = new WLIU.COL({key:0, coltype:"upload", 		name:"school_copy",   	colname:"请提供录取函影印件", view:"large" });
			var col52 = new WLIU.COL({key:0, coltype:"upload", 		name:"visa_copy",   	colname:"请提供签证影印件", view:"large" });

			var cols = [];
			cols.push(col0);
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
			cols.push(col24);
			cols.push(col25);
			cols.push(col26);
			cols.push(col27);
			cols.push(col28);
			cols.push(col29);
			cols.push(col30);
			cols.push(col31);
			cols.push(col32);
			cols.push(col33);
			cols.push(col34);
			cols.push(col35);
			cols.push(col36);
			cols.push(col37);
			cols.push(col38);
			cols.push(col39);
			cols.push(col40);
			cols.push(col41);
			cols.push(col42);
			cols.push(col43);
			cols.push(col44);
			cols.push(col45);
			cols.push(col46);
			cols.push(col47);
			cols.push(col48);
			cols.push(col49);
			cols.push(col50);
			cols.push(col51);
			cols.push(col52);
			
			var tablists = {
				mservice: {	loaded: 2, 
							keys: {rowsn:-1, name:""}, 
							list: [
								{ key: 200, 	value: "1. Airport Pick-up 接机 ($200加元)", desc: "" },
								{ key: 400, 	value: "2. Homestay Placement Fee 寄宿家庭安置费 ($400加元)", desc: "" },
								{ key: 1400, 	value: "3. Custodian 法律监护服务 ($1200加元/学年 + $200加元 (律师公证费))", desc: "" }
							]
						},
				sservice: {	loaded: 2,
							keys: { rowsn:-1, name:""},
							list: [
								{ key: 3000, 	value: "4.1 暖心服务 ($3000加元/学年)", desc: "" },
								{ key: 6000, 	value: "4.2 贴心服务 ($6000加元/学年)", desc: "" },
								{ key: 9000, 	value: "4.3 亲子服务 ($9000加元/学年)", desc: "" }
							]
						},
				homestay_child : { 	loaded: 2,  
									keys: {rowsn:-1, name:""},
									list: [
										{ key: 1, 	value: "低龄小孩", desc: "" },
										{ key: 2, 	value: "青春期孩子", desc: "" },
										{ key: 3, 	value: "只有成人", desc: "" }
									]
				},
				homestay_envir : { 	loaded: 2,  
									keys: {rowsn:-1, name:""},
									list: [
										{ key: 1, 	value: "安静", desc: "" },
										{ key: 2, 	value: "活跃", desc: "" }
									]
				}
				
			};


			var student_table = new WLIU.TABLE({
				scope: 	"student_form",
				lang:	GLang,
				firstone: 1,  // very important for form get first row as current.
				url:   	"ajax/dsgj_studentform_detail_action.php",
				tooltip:"tool_tip",
				navi:   {pagesize:20, match: 1, orderby:"", sortby:""},
				cols: 	cols,
				lists: 	tablists
			});


            var app = angular.module("myApp", ["wliuTable"]);
            app.controller("myForm", function ($scope) {
				table.setScope( $scope, "student_table" );

				$scope.row_detail = function(theRow) {
					$("#div_right").show();
					$("#div_role").hide();
					student_table.formGet({id: table.getRowKeys(theRow).id});
				}

				$scope.row_add = function(theRow) {
					$("#div_right").show();
					$("#div_role").hide();
					student_table.formReset();
				}

				student_table.setScope( $scope, "student_form" );
				//student_table.getRecord({id:4});

				$scope.totalAmt = function() {
					var total = 0;
					if( $scope.student_form.getColCurrent("ck_service") ) {
						for(var key in $scope.student_form.getColCurrent("ck_service").value) {
							if($scope.student_form.getColCurrent("ck_service").value[key]) {
								total += (key - 0);
							} 
						}
						total += ( $scope.student_form.getColCurrent("rd_service").value - 0 );
					}
					return total?total:"";
				}
		    });

			$(function(){
				table.getRecords();
				student_table.formInit();
			});

			function goback() {
				$("#div_right").hide();
				$("#div_role").show();
			}
		</script>

		<script language="javascript" type="text/javascript">
			app.controller("DSGJ_STUDENT", function ($scope) {
			});
		</script>
		
</head>
<body ng-app="myApp" class="fixed-sn mdb-skin" ng-controller="myForm">
<?php include("include/menu_head_html.php");?>
	<div class="wliuCommon-page-height">
		<div id="div_role">
			<fieldset>
				<legend><?php echo gwords("search by")?></legend>
				<filter.label table="student_table" name="content"></filter.label> : 	<filter.textbox class="input-medium" table="student_table" name="content"></filter.textbox>
				<br>
				<table.tablebutton table="student_table" name="search" actname="Search" outline=1 style="margin-top:10px; margin-left:60px;"></table.tablebutton>
			</fieldset>

			<div style="margin-top:20px;">
				<table.navi table="student_table"></table.navi>
				<table class="table table-condensed">
					<tr style="background-color:#eeeeee;"> 
						<td width=50 valign="middle">
							<table.hicon table="student_table" name="add" 		actname="Add New" action="row_add(student_table.getCurrent())"></table.hicon>
							<table.hicon table="student_table" name="save" 		actname="Save"></table.hicon>
							<table.hicon table="student_table" name="cancel" 	actname="Undo"></table.hicon>
						</td>
						<td width=40 align="center" valign="middle">
							<table.head table="student_table" name="SN"></table.head>
						</td>
						<td valign="middle">
							<table.head table="student_table" name="stu_fname"></table.head>
						</td>
						<td valign="middle">
							<table.head table="student_table" name="stu_lname"></table.head>
						</td>
						<td valign="middle">
							<table.head table="student_table"  name="stu_email"></table.head>
						</td>
						<td>
							<table.head table="student_table"  name="stu_phone"></table.head>
						</td>
						<td>
							<table.head table="student_table"  name="passport"></table.head>
						</td>
						<td>
							<table.head table="student_table" name="school_name"></table.head>
						</td>
						<td>
							<table.head table="student_table" name="created_time"></table.head>
						</td>
					</tr>	
					<tr ng-repeat="row in student_table.rows">
						<td style="white-space:nowrap; width:40px;">
							<table.bicon table="student_table" name="detail"  	actname="Edit" 		row="row" action="row_detail(row)"></table.bicon>
							<table.bicon table="student_table" name="save"  	actname="Save" 		row="row"></table.bicon>
							<table.bicon table="student_table" name="cancel"	actname="Cancel" 	row="row"></table.bicon>
							<table.bicon table="student_table" name="delete" 	actname="Delete" 	row="row"></table.bicon>
						</td>
						<td width=30 align="center">
							<table.rowno table="student_table"  row="row"></table.rowno>
						</td>
						<td>
							<table.textbox class="input-small" table="student_table" name="stu_fname" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="student_table" name="stu_lname" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="student_table" name="stu_email" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="student_table" name="stu_phone" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="student_table" name="passport" row="row"></table.textbox>
						</td>
						<td>
							<table.textbox class="input-medium" table="student_table" name="school_name" row="row"></table.textbox>
						</td>
						<td>
							<table.intdate table="student_table" name="created_time" row="row"></table.intdate>
						</td>
					</tr>
				</table>
			</div>
		</div>
		
		<div id="div_right" style="display:none;">
			<br>
			<button class="btn btn-outline-info" onclick="goback()"><?php echo gwords("go.back")?></button>
			<form.button table="student_form" name="save"	outline=1	actname="<?php echo gwords("button.submit.form")?>"></form.button>		
			<form.button table="student_form" name="reset" outline=1	actname="<?php echo gwords("button.cancel.form")?>"></form.button>	
			<form.rowstatus table="student_table"></form.rowstatus>
			<br>
<!-- Place student form here -->
<div style="border:0px solid red;">
	<div class="panel panel-default">
		<div class="panel-body" style="background-color:#eeeeee;">
			<center>
			<span style="font-size:24px; color:#666666;">
			Study Abroad Service Application Forms<br>
			</span>
			<span style="font-size:32px; color:#666666;">
			加拿大留学精品境外服务申请表
			</span>
			</center>
		</div>
	</div>

	<span style="float:right">
	点击这里：<a href="dsgj_registration.pdf" target="_blank">下载精品境外服务表格</a>
	</span>
	<br>

	<ul wliu-tab9 color-awesome>
		<li>选择精品境外服务</li>
	</ul>
	<br>
	<div class="row">
		<div class="col-md-9">
			<div class="row">
				<div class="col-md-12">
					<span style="font-size:16px; border-bottom:2px solid #FE2354;">School Information 录取学校信息</span>
				</div>
			</div>
			<div class="row">
				<div class="col-md-5 text-md-right text-nowrap">
						<form.label table="student_form" name="school_name"></form.label>
				</div>
				<div class="col-md-7">
						<form.textbox table="student_form" name="school_name" style="width:100%"  tooltip="wmtips"></form.textbox>
				</div>
			</div>
			<div class="row">
				<div class="col-md-5 text-md-right text-nowrap">
						<form.label table="student_form" name="school_address"></form.label>
				</div>
				<div class="col-md-7">
						<form.textbox table="student_form" name="school_address" style="width:100%" tooltip="wmtips"></form.textbox>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="row">
				<div class="col-md-12">
					<form.imgupload table="student_form" name="school_copy" view="medium" actname="请提供录取函影印件，点击图标上传图片" ww=160 hh=120></form.imgupload>
				</div>
			</div>
		</div>		
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<form.label table="student_form" name="ck_service" style="font-size:16px; border-bottom:2px solid #FE2354;"></form.label>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
				<form.checkbox table="student_form" name="ck_service" colnum="1" tooltip="wmtips"></form.checkbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.label style="font-size:16px;" table="student_form" name="rd_service"></form.label>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div style="padding-left:30px;">
				关于: <a href="http://www.dushuguoji.com/nxservice.php#nx" target="_blank">暖心服务</a> | <a href="http://www.dushuguoji.com/nxservice.php#tx" target="_blank">贴心服务</a> | <a href="http://www.dushuguoji.com/nxservice.php#qz" target="_blank">亲子服务</a> 
				<br>
				<form.radio table="student_form" name="rd_service" colnum="1"></form.radio>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			合计金额 ：<span style="display:inline-block; padding:5px; border-bottom:1px solid #cccccc; min-width:80px; text-align:center;">&nbsp;{{ totalAmt() }}&nbsp;</span>（加元）
		</div>
	</div>
	<br>

	<ul wliu-tab9 color-mint>
		<li>A. Personal Profile 个人资料</li>
	</ul>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #41B48A;">Legal Information 个人信息</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div class="row">
					<div class="col-md-6 text-md-right text-nowrap">
						<form.label table="student_form" name="stu_fname"></form.label>
					</div>
					<div class="col-md-6 text-md-left">
						<form.textbox table="student_form" name="stu_fname" style="width:100%" tooltip="wmtips"></form.textbox>
					</div>
			</div>
			<div class="row">
					<div class="col-md-6 text-md-right text-nowrap">
						<form.label table="student_form" name="stu_lname"></form.label>
					</div>
					<div class="col-md-6 text-md-left">
						<form.textbox table="student_form" name="stu_lname" style="width:100%" tooltip="wmtips"></form.textbox>
					</div>
			</div>
			<div class="row">
					<div class="col-md-6 text-md-right text-nowrap">
						<form.label table="student_form" name="stu_oname"></form.label>
					</div>
					<div class="col-md-6 text-md-left">
						<form.textbox table="student_form" name="stu_oname" style="width:100%" tooltip="wmtips"></form.textbox>
					</div>
			</div>
			<div class="row">
					<div class="col-md-6 text-md-right text-nowrap">
						<form.label table="student_form" name="passport"></form.label>
					</div>
					<div class="col-md-6 text-md-left">
						<form.textbox table="student_form" name="passport" style="width:100%" tooltip="wmtips"></form.textbox>
					</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="row">
				<div class="col-md-12 text-md-left">
					<form.imgupload table="student_form" name="passport_copy" view="medium" actname="请提供护照信息页影印件" ww=200 hh=160></form.imgupload>
				</div>
			</div>
		</div>
		<div class="col-md-3">
			<div class="row">
				<div class="col-md-12 text-md-left">
					<form.imgupload table="student_form" name="visa_copy" view="medium" actname="请提供签证影印件" ww=200 hh=160></form.imgupload>
				</div>
			</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-12">
			English Proficiency via Standardized Tests, IELTS, TOEFL 英文成绩TOEFL或雅思 (如果有)
			<form.textbox class="input-large" table="student_form" name="en_score" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #41B48A;">Student Contact Information 学生联络信息</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_address"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_address" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_state"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_state" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_city"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_city" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_postal"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_postal" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_phone"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_phone" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_email"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_email" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="stu_wechat"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="stu_wechat" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #41B48A;">Parent Contact Information 家长联络信息</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="par_address"></form.label>
		</div>
		<div class="col-md-10 text-md-left">
			<form.textbox table="student_form" name="par_address" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="par_state"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="par_state" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="par_city"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="par_city" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="par_postal"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="par_postal" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="dad_fname"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="dad_fname" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="dad_birth"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.date table="student_form" name="dad_birth" tooltip="wmtips"></form.date>
		</div>
		<div class="col-md-4 text-md-left">
			<span class="wliuCommon-tips">如果选择法律监护服务，请提供父亲和母亲的生日</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="dad_phone"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="dad_phone" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="dad_email"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="dad_email" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="dad_wechat"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="dad_wechat" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="mom_fname"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="mom_fname" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="mom_birth"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.date table="student_form" name="mom_birth" tooltip="wmtips"></form.date>
		</div>
		<div class="col-md-4 text-md-left">
			<span class="wliuCommon-tips">如果选择法律监护服务，请提供父亲和母亲的生日</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="mom_phone"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="mom_phone" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="mom_email"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="mom_email" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="mom_wechat"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="mom_wechat" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>

	<ul wliu-tab9 color-orange>
		<li>B. Airport Pick-up 接机服务</li>
	</ul>
	<br>

	<div class="row">
		<div class="col-md-12">
			<span class="wliuCommon-tips">如果选择了接机服务，请填写本表</span><br>
			<span class="wliuCommon-tips">按机场距目的地的距离不同，可能发生额外费用</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="airline"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="airline" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="flight"></form.label>
		</div>
		<div class="col-md-1 text-md-left">
			<form.textbox table="student_form" name="flight" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="pickup_datetime"></form.label>
		</div>
		<div class="col-md-3 text-md-left">
			<form.datetime table="student_form" name="pickup_datetime" tooltip="wmtips"></form.datetime>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.label table="student_form" name="destination"></form.label>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.textbox table="student_form" name="destination" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>

	<ul wliu-tab9 color-purple>
		<li>C. Homestay 申请寄宿家庭</li>
	</ul>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span class="wliuCommon-tips">如果选择了寄宿家庭服务，请填写本表</span><br>
			<span class="wliuCommon-tips">我们会为你安排最接近符合你的要求的寄宿家庭，但有时不能完全满足你的要求</span><br>
			<span class="wliuCommon-tips">请准确填写以下内容。这些信息非常重要，能够帮助我们在紧急情况下快速的协助医生诊断，同时帮助我们为你安排适当的寄宿家庭</span>
		</div>
	</div>

	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #8C30E2;">我们安排的寄宿家庭将符合以下标准</span><br>
			<span style="font-size:14px;margin-left:20px;">1. 学生将有自己单独的卧室，带全部家具，包括床和被褥枕头，衣橱，书桌椅</span><br>
			<span style="font-size:14px;margin-left:20px;">2. 房间有暖气，通风和良好的采光</span><br>
			<span style="font-size:14px;margin-left:20px;">3. 卫生间含淋浴</span><br>
			<span style="font-size:14px;margin-left:20px;">4. 洗衣机和干衣机</span><br>
			<span style="font-size:14px;margin-left:20px;">5. 寄宿家长为学生提供一日三餐和必要的零食</span><br>
			
			<div class="row">
				<div class="col-md-6">
					<form.label table="student_form" name="homestay_start"></form.label>
					<form.date table="student_form" name="homestay_start" tooltip="wmtips"></form.date>
				</div>
				<div class="col-md-6">
					<form.label table="student_form" name="homestay_end"></form.label>
					<form.date table="student_form" name="homestay_end" tooltip="wmtips"></form.date>
				</div>
			</div>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #8C30E2;">Personal Health 个人健康</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.label table="student_form" name="health_medicine"></form.label>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.textbox table="student_form" name="health_medicine" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.label table="student_form" name="health_horby"></form.label> 
			<span class="wliuCommon-tips">请注意，加拿大法律禁止未成年人吸烟和饮酒</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.textbox table="student_form" name="health_horby" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #8C30E2;">Describe yourself 个人性格</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-4 text-md-right text-nowrap">
			<form.label table="student_form" name="per_character"></form.label>
		</div>
		<div class="col-md-8 text-md-left">
			<form.textbox table="student_form" name="per_character" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="per_horby"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="per_horby" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="per_sport"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="per_sport" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="per_music"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="per_music" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="per_food"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.textbox table="student_form" name="per_food" style="width:100%" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="per_vegit"></form.label>
		</div>
		<div class="col-md-2 text-md-left">
			<form.bool table="student_form" name="per_vegit" tooltip="wmtips"></form.bool>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:16px; border-bottom:2px solid #8C30E2;">Your requirement for homestay 对寄宿家庭的期望</span>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="homestay_child"></form.label>
		</div>
		<div class="col-md-10 text-md-left">
			<form.checkbox table="student_form" name="homestay_child" colnum="0" tooltip="wmtips"></form.checkbox>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="homestay_envir"></form.label>
		</div>
		<div class="col-md-10 text-md-left">
			<form.radio table="student_form" name="homestay_envir" colnum="0" tooltip="wmtips"></form.radio>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2 text-md-right text-nowrap">
			<form.label table="student_form" name="homestay_other"></form.label>
		</div>
		<div class="col-md-6 text-md-left">
			<form.textbox table="student_form" name="homestay_other" style="width:100%;" tooltip="wmtips"></form.textbox>
		</div>
		<div class="col-md-4 text-md-left">
			<span class="wliuCommon-tips">加拿大家庭通常都有宠物，大部分是狗和猫</span>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			Letter of Introduction to Host Parents 学生给寄宿家长的信
			<form.label table="student_form" name="homestay_letter"></form.label>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.textarea table="student_form" name="homestay_letter" style="width:100%;height:120px;" tooltip="wmtips"></form.textarea>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.label table="student_form" name="homestay_concern"></form.label>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<form.textarea table="student_form" name="homestay_concern" style="width:100%;height:120px;" tooltip="wmtips"></form.textarea>
		</div>
	</div>
	<br>

	<ul wliu-tab9 color-green>
		<li>D. Refund Policy 退款政策</li>
	</ul>
	<br>
	<div class="row">
		<div class="col-md-12">
			<span style="font-size:14px;margin-left:20px;">1. 须书面提出</span><br>
			<span style="font-size:14px;margin-left:20px;">2. 须提供使馆拒签信</span><br>
			<span style="font-size:14px;margin-left:20px;">3. 寄宿家庭安置费和法律监护律师公证费不退</span><br>
			<span style="font-size:14px;margin-left:20px;">4. 接机费全额退；法律监护费全额退；寄宿费全额退</span><br>
			<span style="font-size:14px;margin-left:20px;">5. 家长放心服务包，扣除10%管理费，余额全退</span><br>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col-md-12">
			<center>
				<form.button table="student_form" name="save"	outline=1	actname="<?php echo gwords("button.submit.form")?>"></form.button>		
				<form.button table="student_form" name="reset"  outline=1	actname="<?php echo gwords("button.cancel.form")?>"></form.button>	
			</center>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<table.message table="student_form"></table.message>
		</div>
	</div>
</div>
<!-- **********************  -->
		</div>

	</div>
<?php include("include/menu_foot_html.php");?>

<table.popup table="student_table"></table.popup>
<table.popup table="student_form"></table.popup>
<div wliu-autotip></div>
<div wliu-wait></div>
<div id="tool_tip" wliu-popup></div>



<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>
