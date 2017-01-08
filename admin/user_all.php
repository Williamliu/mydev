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

        <script language="javascript" type="text/javascript">
			$(function(){
	  			$(".lwhTab9").lwhTab9();

				iupload = new LWH.AjaxImage({
									name:		"imageupload", 
									filter:		"public_user",
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
											filter:		"public_user", 
											mode:		"medium", 
											view:		"thumb", 
											noimg:		1, 
											container:	"#amdin_imgshow",
											edit:		true, 
											ww:			500, 
											hh:			500,
											cropww: 	50, 
											crophh:		50, 
											orient:		"v"
											});
			});
			
			
			var app = angular.module("myApp", ["wmliuList", "wmliuForm"])
            app.controller("webAdmin", function ($scope, $q, wmliuListService, wmliuFormService) {
                $scope.userList = {
                    schema: {
                        table: {
                            pptable: { name: "public_user", col: "id", val: "" }
                        },
                        cols: [
                                { col: "", type: "rowno" },
                                { col: "locked", type: "imgvalue", css: "locked" },
                                { col: " ", type: "seperator" },
                                { col: "full_name", type: "text" },
                                { col: " [", type: "seperatoron", on:"anonym"},
                                { col: "anonym", type: "text" },
                                { col: "]", type: "seperatoron", on:"anonym"},
                                { col: " - ", type: "seperatoron", on:"user_name"},
                                { col: "user_name", type: "text" },
                                { col: "id", type: "hidden" },
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
                                    { key: "anonym asc", title: words["anonym"] + " ▲" },
                                    { key: "anonym desc", title: words["anonym"] + " ▼" },
                                    { key: "locked asc", title: words["account.locked"] + " ▲" },
                                    { key: "locked desc", title: words["account.locked"] + " ▼" }
                                 ],

                        desc: 	words["id"] + ": {{id}}\n" + 
								words["full_name"] + ": {{full_name}}\n" + 
								words["anonym"]+ ": {{anonym}}\n" +
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
                            pageSize: 20,
                            totalNo: 0
                        }
                    },
                    rows: []
                };

                wmliuListService.setListClick("user_list", function (row) {
                     wmliuFormService.load["user_form"]({ sid: $scope.userList.schema.idvals.pid });
               
					 iupload.deletes();
					 iupload.refid(row.sid);
					 ipic.refid(row.sid);
			    });

                $scope.userForm = {
                    buttons: {
                        button: [{ key: "save", title: words["save"] }, { key: "cancel", title: words["cancel"] }, { key: "add", title: words["add"] }, { key: "delete", title: words["delete"] }, { key: "excel", title: words["output"] }, { key: "print", title: words["print"] }],
                        rights: GUserRight,
                    },
                    schema: {
                        table: {
                            sstable: { name: "public_user", col: "id"}
                        },
                        checklist: {
							group_id: 	{ stable: "user_group", scol:"id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) },
							country: 	{ stable: "website_country", scol:"id", stitle: langCol("country", GLang), sdesc: "" },
						},
                        idvals: { sid: "" }
                    },
					listTables : {
						checklist: {
							contact_type: [
								{key:"FaceBook", title:"FaceBook"},
								{key:"Twitter", title:"Twitter"},
								{key:"WhatsApp", title:"WhatsApp"}
							]
						}
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
							group_id:	{ type: "radio", 	title: words["user.type"],	required: 1 },
							country:	{ type: "select",	title: words["country"],	required: 1 },
                            qq: 		{ type: "textbox", 	title: words["qq"],			required: 0, maxlength: 64 },
                            wechat: 	{ type: "textbox", 	title: words["wechat"],		required: 0, maxlength: 64 },
                            contact_type: { type: "select", title: words["contact_type"],required: 0, maxlength: 64 },
                            contact_id: { type: "textbox", 	title: words["contact_id"],	required: 0, maxlength: 64 },

                            locked: 	{ type: "bool", 	title: words["account.locked"] },
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

                wmliuFormService.setButtonClick("user_form", function (action, vobj) {
                    //vobj.detail.vals.status = true;
                    wmliuListService.select["user_list"]();
					
					iupload.deletes();
					iupload.refid(-1);
					ipic.clear();
                }, "add");

				
                var evt_callback = {
                    success: function (action, obj) {
                        switch (action) {
                            case "new":
                                wmliuListService.load["user_list"]({ pid: obj.schema.idvals.sid });

								iupload.refid(obj.schema.idvals.sid);
								iupload.ajaxUpload();
								ipic.refid(obj.schema.idvals.sid);
							    break;
                            case "update":
                                wmliuListService.load["user_list"]();
                                break;
                            case "delete":
                                wmliuListService.load["user_list"]();
                                break;
                        }
                    }
                }
                wmliuFormService.setCallBack("user_form", evt_callback, "save");
			


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
        <wmliu.form form="userForm" name="user_form" loading="0">
		<table>
        	<tr>
            	<td valign="top">
                        <div id="user_list" class="lwhTab9 lwhTab9-mint" style="display:block; width:260px;">
                            <ul>
                                <li><?php echo $words["all users"] ?></li>
                            </ul>
                            <div>
                                <br />
                                <wmliu.list name="user_list" list="userList" loading="1"></wmliu.list>
                            </div>
                        </div>
                </td>
            	<td valign="top" style="padding-left:20px;">
                     <div class="lwhTab9 lwhTab9-sea" style="min-width:600px;">
                     	<ul>
                        	<li><?php echo $words["admin.detail"] ?></li>
	                        <li><?php echo $words["upload photo"]?></li>
                        </ul>
                    	<div>
                                <table>
                                    <tr>
                                        <td valign="top">
                                            <table>
                                                <tr>
                                                    <td><form.label form="userForm" col="email"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="email" ></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="user_name"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="user_name"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td valign="top"><form.label form="userForm" col="password"></form.label>: </td>
                                                    <td><form.password form="userForm" col="password" ></form.password></td>
                                                </tr>
                                                <tr><td colspan="2"><br /></td></tr>
                                                <tr>
                                                    <td valign="top"><form.label form="userForm" col="full_name"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="full_name"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="phone"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="phone" ></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="cell"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="cell"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="address"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="address"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="city"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="city"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="state"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="state"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="country"></form.label>: </td>
                                                    <td><form.select form="userForm" col="country"></form.select></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="postal"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="postal"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="status"></form.label>: </td>
                                                    <td><form.bool form="userForm" col="status"></form.bool></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="locked"></form.label>: </td>
                                                    <td><form.bool form="userForm" col="locked"></form.bool></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <br />
                                                        <form.button form="userForm"></form.button>
                                                        <form.error form="userForm" ww="40%" hh="40%" minww="300px" minhh="200px"></form.error>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td valign="top">
                                            <table>
                                                <tr>
                                                    <td valign="top"><form.label form="userForm" col="group_id"></form.label>: </td>
                                                    <td><form.radio form="userForm" col="group_id" colnum="1"></form.radio></td>
                                                </tr>
                                                <tr><td colspan="2"><br /></td></tr>
                                                <tr>
                                                    <td colspan="2" align="center"><b> - <?php echo $words["social media contact"]?> - </b></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="qq"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="qq"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="wechat"></form.label>: </td>
                                                    <td><form.textbox form="userForm" col="wechat"></form.textbox></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="contact_type"></form.label>: </td>
                                                    <td>
                                                    	<form.select form="userForm" col="contact_type"></form.select>
                                                    	<form.label form="userForm" col="contact_id"></form.label>:
                                                    	<form.textbox form="userForm" col="contact_id"></form.textbox>
                                                    </td>
                                                </tr>
                                                <tr><td colspan="2"><br /></td></tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="created_time"></form.label>: </td>
                                                    <td><form.intdate form="userForm" col="created_time" format=""></form.intdate></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="last_updated"></form.label>: </td>
                                                    <td><form.intdate form="userForm" col="last_updated" format=""></form.intdate></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="last_login"></form.label>: </td>
                                                    <td><form.intdate form="userForm" col="last_login" format=""></form.intdate></td>
                                                </tr>
                                                <tr>
                                                    <td><form.label form="userForm" col="hits"></form.label>: </td>
                                                    <td><form.text form="userForm" col="hits"></form.text></td>
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
