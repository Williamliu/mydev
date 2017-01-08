<?php
session_start();
ini_set("display_errors", 0);
include_once("website_a_secure.php");
include_once("website_a_auth.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("website_a_include.php")?>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.wrapbox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.wrapbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imagebox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imagebox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.form.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.list.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.list.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.accord.js"></script>
        <link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.accord.css" rel="stylesheet" />

	    <script type="text/javascript" 			src="<?php echo $CFG["web_domain"]?>/jquery/plugin/jslider/jslider_class.js"></script>
		<link rel="stylesheet" type="text/css" 	href="<?php echo $CFG["web_domain"]?>/jquery/plugin/jslider/css/jslider_style.css" />

        <script language="javascript" type="text/javascript">
           	var iupload = null
			$(function(){
	  			$(".lwhTab3").lwhTab3();

				iupload = new LWH.AjaxImage({
									name:		"imageupload", 
									filter:		"product",
									trigger:	"#upload",
									mode:		"medium",
									view:		"tiny",
									triggerClick: function(obj) {
										//console.log(obj.settings.ref_id);
									},
									after:		function(obj) {
										if(obj.errorCode <= 0 ) {
											ipic.append(obj.data.imgObj);
										}
									}
								});

				ipic = new LWH.ImageBox({name:"productImage", filter:"product", mode:"medium", view:"tiny", noimg:0, container:"#imgshow",edit:true, ww:220, hh:160, imgww:600,imghh:300, cropww: 100, crophh:0, orient:"v"});
				
			});

			var app = angular.module("myApp", ["wmliuList", "wmliuForm", "wmliuAccord"])
            app.controller("webAdmin", function ($scope, $q, wmliuListService, wmliuFormService, wmliuAccordService) {
                $scope.adminList = {
                    schema: {
                        table: {
                            pptable: { name: "website_admin", col: "id", val: "" }
                        },
                        cols: [
                                { col: "", type: "rowno" },
                                { col: "full_name", type: "text" },
                                { col: " - ", type: "seperator", on:"user_name"},
                                { col: "user_name", type: "text" },
                                { col: " ", type: "seperator" },
                                { col: "status", type: "imgvalue", css: "status" },
                                { col: "email", type: "hidden" },
                                { col: "phone", type: "hidden" },
                                { col: "cell", type: "hidden" }
                              ],
                        orderBy: [
                                    { key: "created_time asc", title: words["created_time"] + " ▲" },
                                    { key: "created_time desc", title: words["created_time"] + " ▼" },
                                    { key: "full_name asc", title: words["full_name"] + " ▲" },
                                    { key: "full_name desc", title: words["full_name"] + " ▼" },
                                    { key: "user_name asc", title: words["user_name"] + " ▲" },
                                    { key: "user_name desc", title: words["user_name"] + " ▼" },
                                    { key: "email asc", title: words["email"] + " ▲" },
                                    { key: "email desc", title: words["email"] + " ▼" }
                                 ],

                        desc: 	words["full_name"] + ": {{full_name}}\n" + 
								words["user_name"]+ ": {{user_name}}\n" +
								words["email"]+ ": {{email}}\n" +
								words["phone"]+ ": {{phone}}\n" +
								words["cell"]+ ": {{cell}}",
                        idvals: { pid: "" }
                    },
                    navi: {
                        head: {
                            lang: GLang,
                            action: "view",
                            wait: 1,
                            loading: 0,
                            match: 0,

                            orderBy: "created_time desc",
                            pageNo: 0,
                            pageSize: 10,
                            totalNo: 0
                        }
                    },
                    rows: []
                };

                wmliuListService.setListClick("admin_list", function (row) {
					wmliuAccordService.select["admin_accord"]({sid: row.sid});
                    wmliuFormService.load["admin_form"]({ sid: $scope.adminList.schema.idvals.pid });
					 iupload.deletes();
					 iupload.refid(row.sid);
					 
					 ipic.refid(row.sid);
                });

                $scope.adminForm = {
                    buttons: {
                        button: [{ key: "save", title: words["save"] }, { key: "cancel", title: words["cancel"] }, { key: "add", title: words["add"] }, { key: "delete", title: words["delete"] }, { key: "excel", title: words["output"] }, { key: "print", title: words["print"] }],
                        rights: GUserRight
                    },
                    schema: {
                        table: {
                            sstable: { name: "website_admin", col: "id"}
                        },
                        checklist: {
							group_id: 	{ rtable: "website_admin_group", rcol: "admin_id", stable: "website_group", scol:"id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) },
                        	weight:		{ stable: "website_weight_unit", scol: "id", stitle: langCol("title", GLang) }
						},
						tablelist: {
							country_id: { 
								stable: "website_country", 
								scol:   "id",
								rtable: "website_admin_country", 
								rcol: "admin_id",
								cols:  [
									{col: "", 							type:"iselect", align:"center"	},
									{col: "", 							type:"rowno", 	align:"center", title: words["sn"], required: 1, maxlength: 64 },
									{col: langCol("country", GLang), 	type:"textbox", title: words["country"],  width: 40, 	required: 1, maxlength: 64 },
									{col: langCol("currency", GLang), 	type:"textbox", title: words["currency"], width:40,		required: 1, maxlength: 16 },
									{col: "symbol", 					type:"textbox",	title: words["currency.symbol"], width:30, align:"center", required: 1, maxlength: 16 },
									{col: "price", 						type:"textbox", title: words["price"], required: 1, maxlength: 16, pattern: "NUMBER", table:"rtable" },
									{col: "weight", 					type:"select", title: words["weight"], required: 1, table:"rtable" }
								]			
							}
						},
                        idvals: { sid: "" }
                    },
                    detail: {
                        head: {
                            lang: GLang,
                            wait: 1,
                            loading: 0,

                            state: 		"none",
                            action: 	"none",
                            timezone: 	getTimezone(),
                            error: 		0,
                            errorMessage: ""
                        },
                        cols: {
                            user_name: 	{ type: "textbox", 	title: words["user_name"], 	required: 0, maxlength: 64 },
                            email: 		{ type: "textbox", 	title: words["email"], 		required: 1, maxlength: 256 },
                            password: 	{ type: "password", title: words["password"], 	required: 1, minlength: 6, maxlength: 16 },
                            full_name: 	{ type: "textbox", 	title: words["full_name"], 	required: 1, maxlength: 256 },
                            phone: 		{ type: "textbox", 	title: words["phone"],		required: 0, maxlength: 64 },
                            cell: 		{ type: "textbox", 	title: words["cell"],		required: 0, maxlength: 64 },
                            address: 	{ type: "textbox", 	title: words["address"],	required: 0, maxlength: 256 },
                            city: 		{ type: "textbox", 	title: words["city"],		required: 0, maxlength: 64 },
                            state: 		{ type: "textbox", 	title: words["state"],		required: 0, maxlength: 64 },
                            country: 	{ type: "textbox", 	title: words["country"],	required: 0, maxlength: 64 },
                            postal: 	{ type: "textbox", 	title: words["postal"],		required: 0, maxlength: 16 },
							group_id:	{ type: "checkbox", title: words["right.group"],required: 0 },
							country_id:	{ type: "tablelist",title: words["country"] },
                            status: 	{ type: "bool", 	title: words["status"] },
                            created_time: { type: "intdate",title: words["created_time"] },
                            last_updated: { type: "intdate",title: words["last_updated"] },
                            last_login: { type: "intdate",  title: words["last_login"] },
							hits:		{ type: "text", 	title: words["admin.hits"] }
                        },
                        vals: {
                        }
                    }
                }; // end form

                wmliuFormService.setButtonClick("admin_form", function (action, vobj) {
                    //vobj.detail.vals.status = true;
                    wmliuListService.select["admin_list"]();
					wmliuAccordService.select["admin_accord"]();
					iupload.deletes();
					iupload.refid(-1);
					ipic.clear();
                }, "add");

				
                var evt_callback = {
                    success: function (action, obj) {
                        switch (action) {
                            case "new":
                                wmliuListService.load["admin_list"]({ pid: obj.schema.idvals.sid });
								wmliuAccordService.load["admin_accord"]({ sid: obj.schema.idvals.sid });
								iupload.refid(obj.schema.idvals.sid);
								iupload.ajaxUpload();
								ipic.refid(obj.schema.idvals.sid);
                                break;
                            case "update":
                                wmliuListService.load["admin_list"]();
								wmliuAccordService.load["admin_accord"]();
                                break;
                            case "delete":
                                wmliuListService.load["admin_list"]();
								wmliuAccordService.load["admin_accord"]();
                                break;
                        }
                    }
                }
                wmliuFormService.setCallBack("admin_form", evt_callback, "save");
			
			


				$scope.adminAccord = {
					schema: {
						table: {
							pptable: 	{ name: "website_group", col: "id",
											title: "{{" + langCol("title", GLang) + "}} {[length]}", 
											desc: "{{" + langCol("desc", GLang) + "}}"
										},
							mmtable: 	{ name: "website_admin_group", pref: "group_id", sref: "admin_id" },
							sstable: 	{ 	name: "website_admin", col: "id",
											title: "{{full_name}} {{user_name}}", 
											desc: words["full_name"] + ": {{full_name}}\n" +
												  words["user_name"] + ": {{user_name}}\n" + 
												  words["email"] + ": {{email}}\n" + 
												  words["phone"] + ": {{phone}}\n" + 
												  words["cell"] + ": {{cell}}"
										}
						},
						cols: {
							pptable: {
								title_en: 	{ type: "hidden" },
								title_cn: 	{ type: "hidden" },
								desc_en: 	{ type: "hidden" },
								desc_cn: 	{ type: "hidden" }
							},
							sstable: {
								full_name: 	{ type: "hidden" },
								user_name: 	{ type: "hidden" },
								email: 		{ type: "hidden" },
								phone: 		{ type: "hidden" },
								cell: 		{ type: "hidden" }
							}
						},
						idvals: { pid: "", sid: "" }
					},
					list: {
						head: {
							error: 0,
							errorMessage: "",
							single: 	0,
							showall: 	1,
							empty:  	0,
							action: 	"none",
							state: 		"none",
							lang: 		GLang,
							wait: 		1,
							title: 		"",
							desc: 		""
						},
						nodes: []
					}
				};

				wmliuAccordService.setChange("admin_accord", function (Obj) {
					 wmliuListService.select["admin_list"]({pid: Obj.sid});
                     wmliuFormService.load["admin_form"]({ sid: Obj.sid });
					 iupload.deletes();
					 iupload.refid(Obj.sid);

					 ipic.refid(Obj.sid);
				});
            });
        </script>
</head>
<body ng-app="myApp">
<?php require("website_a_header.php")?>
<?php require("website_a_menu.php")?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="webAdmin" >
        <wmliu.form form="adminForm" name="admin_form" loading="0">
		<table>
        	<tr>
            	<td valign="top">
                        <div class="lwhTab3" style="display:block; width:260px;">
                            <ul>
                                <li>所有用户</li><li>权限分组</li>
                            </ul>
                            <div>
                                <wmliu.list name="admin_list" list="adminList" loading="1"></wmliu.list>
                            </div>
                            <div>
                                <wmliu.accord1 name="admin_accord" list="adminAccord"></wmliu.accord1>
                            </div>
                        </div>
                </td>
            	<td valign="top" style="padding-left:20px;">
                                <table>
                                    <tr>
                                        <td><form.label form="adminForm" col="email"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="email" ></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="user_name"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="user_name"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td valign="top"><form.label form="adminForm" col="password"></form.label>: </td>
                                        <td><form.password form="adminForm" col="password" ></form.password></td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td valign="top"><form.label form="adminForm" col="full_name"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="full_name"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="phone"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="phone" ></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="cell"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="cell"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="address"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="address"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="city"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="city"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="state"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="state"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="country"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="country"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="postal"></form.label>: </td>
                                        <td><form.textbox form="adminForm" col="postal"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="status"></form.label>: </td>
                                        <td><form.bool form="adminForm" col="status"></form.bool></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <br />
                                            <form.button form="adminForm"></form.button>
                                            <form.error form="adminForm" ww="40%" hh="40%" minww="300px" minhh="200px"></form.error>
                                        </td>
                                    </tr>
                                </table>
                </td>
            	<td valign="top" width="800">
                                <table>
                                    <tr>
                                        <td valign="top"><form.label form="adminForm" col="group_id"></form.label>: </td>
                                        <td><form.checkbox form="adminForm" col="group_id" colnum="1"></form.checkbox></td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>

                                    <tr>
                                        <td valign="top"><form.label form="adminForm" col="country_id"></form.label>: </td>
                                        <td><form.tablelist form="adminForm" col="country_id"></form.tablelist></td>
                                    </tr>
                                    
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="created_time"></form.label>: </td>
                                        <td><form.intdate form="adminForm" col="created_time" format=""></form.intdate></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="last_updated"></form.label>: </td>
                                        <td><form.intdate form="adminForm" col="last_updated" format=""></form.intdate></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="adminForm" col="hits"></form.label>: </td>
                                        <td><form.text form="adminForm" col="hits"></form.text></td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td>
                                        	<a id="upload" style="font-size:18px; color:blue; text-decoration:underline;">Upload Image</a>
                                        	<div id="imgshow" style="width:500px;"></div>
                                        </td>
                                    </tr>
								</table>                     
                </td>
        	</tr>
      	</table>        
    </wmliu.form>
	</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>
