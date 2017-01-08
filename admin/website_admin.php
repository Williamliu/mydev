<?php
session_start();
ini_set("display_errors", 0);
include_once("website_a_secure.php");
include_once("website_a_auth.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("website_a_include.php");?>
		
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   href="<?php echo 	$CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imagevshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo 	$CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imagevshow.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.form.js"></script>

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.list.js"></script>
    	<link type="text/css" 			href="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.list.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.accord.js"></script>
        <link type="text/css" 			href="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.accord.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
			$(function(){
	  			$(".lwhTab9").lwhTab9();

				iupload = new LWH.AjaxImage({
									name:		"imageupload", 
									filter:		"website_admin",
									trigger:	"#upload_photo",
									mode:		"medium",
									view:		"thumb",
									triggerClick: function(obj) {
										//console.log(obj.settings.ref_id);
									},
									after:		function(obj) {
										if(obj.errorCode <= 0 ) {
											ipic.append(obj.data.imgObj);
										}
									}
								});
				ipic = new LWH.ImageVShow({	
											name:		"adminPhoto", 
											filter:		"website_admin", 
											mode:		"medium", 
											view:		"thumb", 
											noimg:		1, 
											container:	"#amdin_imgshow",
											edit:		true, 
											ww:			400, 
											hh:			533,
											cropww: 	60, 
											crophh:		80, 
											orient:		"v"
											});
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
                        rights: GUserRight,
                    },
                    schema: {
                        table: {
                            sstable: { name: "website_admin", col: "id"}
                        },
                        checklist: {
							group_id: 	{ rtable: "website_admin_group", rcol: "admin_id", stable: "website_group", scol:"id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) },
                        	weight:		{ stable: "website_weight_unit", scol: "id", stitle: langCol("title", GLang) },
							country:    { stable: "website_country", scol: "id", stitle: langCol("country", GLang) }
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
									{col: langCol("country", 	GLang), type:"textbox", title: words["country"],  width: 40, 	required: 1, maxlength: 64 },
									{col: langCol("currency", 	GLang), type:"textbox", title: words["currency"], width:40,		required: 1, maxlength: 16 },
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
                            email: 		{ type: "textbox", 	title: words["email"], 		pattern: "EMAIL", required: 1, maxlength: 256 },
                            password: 	{ type: "password", title: words["password"], 	required: 1, minlength: 6, maxlength: 16 },
                            full_name: 	{ type: "textbox", 	title: words["full_name"], 	required: 1, maxlength: 256 },
                            phone: 		{ type: "textbox", 	title: words["phone"],		required: 0, maxlength: 64 },
                            cell: 		{ type: "textbox", 	title: words["cell"],		required: 0, maxlength: 64 },
                            address: 	{ type: "textbox", 	title: words["address"],	required: 0, maxlength: 256 },
                            city: 		{ type: "textbox", 	title: words["city"],		required: 0, maxlength: 64 },
                            state: 		{ type: "textbox", 	title: words["state"],		required: 0, maxlength: 64 },
                            country: 	{ type: "select", 	title: words["country"],	required: 0 },
                            postal: 	{ type: "textbox", 	title: words["postal"],		required: 0, maxlength: 16 },
							group_id:	{ type: "checkbox", title: words["right.group"],required: 0 },
							country_id:	{ type: "tablelist",title: words["country"] },
                            status: 	{ type: "bool", 	title: words["status"] },
                            created_time: { type: "intdate",	title: words["created_time"] },
                            last_updated: { type: "intdate",	title: words["last_updated"] },
                            last_login:   { type: "intdate",  	title: words["last_login"] },
							hits:		  { type: "text", 		title: words["admin.hits"] }
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
							empty:  	1,
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
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "所有帐号", "所有帐号"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
	
	<div ng-controller="webAdmin" style="position:relative;">
        <wmliu.form form="adminForm" name="admin_form" loading="0">
		<table>
        	<tr>
            	<td valign="top">
                        <div id="admin_list" class="lwhTab9 lwhTab9-mint" style="display:block; width:260px;">
                            <ul>
                                <li><?php echo $words["all users"] ?></li><li><?php echo $words["right.group"] ?></li>
                            </ul>
                            <div>
                                <br />
                                <wmliu.list name="admin_list" list="adminList" loading="1"></wmliu.list>
                            </div>
                            <div>
                                <br />
                                <wmliu.accord1 name="admin_accord" list="adminAccord"></wmliu.accord1>
                            </div>
                        </div>
                </td>
            	<td valign="top" style="padding-left:20px;">
                     <div class="lwhTab9 lwhTab9-sea">
                     	<ul>
                        	<li class="selected"><?php echo $words["admin.detail"] ?><s></s></li>
	                        <li><?php echo $words["upload photo"]?></li>
                        </ul>
                    	<div>
                                <table>
                                    <tr>
                                        <td valign="top">
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
                                                    <td><form.select form="adminForm" col="country"></form.select></td>
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
                                        <td valign="top">
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
                                                    <td><form.label form="adminForm" col="last_login"></form.label>: </td>
                                                    <td><form.intdate form="adminForm" col="last_login" format=""></form.intdate></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="adminForm" col="hits"></form.label>: </td>
                                                    <td><form.text form="adminForm" col="hits"></form.text></td>
                                                </tr>
                                            </table>                     
                                        </td>
                                    </tr>
                                </table>               
                        </div>
                        <div>
                                <table width="100%">
                                    <tr>
                                        <td align="left">
                                            <a id="upload_photo" class="lwhAjaxImage-btn-upload"><?php echo $words["upload photo"]?></a>
                                            <br />
                                            <span style="font-size:12px; color:#333333;"><?php echo $words["user.photo.upload.tips"]?></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">
                                            <div id="amdin_imgshow" style="width:900px;"></div>
                                        </td>
                                    </tr>
                                </table>                     
                        </div>
                     </div>
                	 <br />
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
