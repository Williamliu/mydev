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
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.treeview.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.treeview.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.form.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.list.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.list.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
			var app = angular.module("myApp", ["wmliuList", "wmliuForm", "wmliuTree"])
            app.controller("webAdmin", function ($scope, $http, $cookieStore, wmliuListService, wmliuFormService, wmliuTreeService) {
                $scope.tree = {
                    general: {
                        title: words["website.menu.definition"],
                        desc: ""
                    },
                    schema: {
                         head: {
                            lang: GLang,
                            wait: 1,
                            loading: 0,
                            action: "none"
                        },
                        table: {
                            pptable: { 
										name: "user_menu", 
										col: "id", 
										pref: "parent_id", 
										title: '{{' + langCol("title", GLang) + '}}', 
										desc: '{{' + langCol("title", GLang) + '}}\n' + '{{' + langCol("desc", GLang) + '}}', 
										selectmode: ""
      			                     },
                            sstable: { 
										name: "user_template", 
										col: "id", pref: "ref_id", 
										title: '{{' + langCol("title", GLang) + '}}',  
										desc: '{{' + langCol("title", GLang) + '}}\n' + '{{' + langCol("desc", GLang) + '}}', 
										selectmode: ""
                            }
                        },
                        cols: {
                            pptable: [
                                { col: "title_cn", 	type: "hidden", 	title: 	words["title.cn"], 	css: "", required: 1, style: "" },
                                { col: "desc_cn", 	type: "hidden", 	title: 	words["desc.cn"], 	css: "", style: "" },
                                { col: "title_en", 	type: "hidden", 	title: 	words["title.en"], 	css: "", required: 1, style: "" },
                                { col: "desc_en", 	type: "hidden", 	title: 	words["desc.en"], 	css: "" },
                                { col: "url", 		type: "hidden", 	title: 	words["url"], 		css: "" },
                                { col: "template", 	type: "hidden", 	title: 	words["template"], 	css: "" },
                                { col: "menu_right_id", type: "actbox", 	other: "", title: words["right"], show: 1 },
                                { col: "", type: "icon" }
                           ],
                            sstable: [
                                { col: "title_cn", 	type: "hidden", title: words["title.cn"], 	css: "", required: 1, style: "" },
                                { col: "desc_cn", 	type: "hidden", title: words["desc.cn"], 	css: "", style: "" },
                                { col: "title_en", 	type: "hidden", title: words["title.en"], 	css: "", required: 1, style: "" },
                                { col: "desc_en", 	type: "hidden", title: words["desc.en"], 	css: ""},
                                { col: "url", 		type: "hidden", 	title: words["url"], 		css: "" },
                                { col: "template", 	type: "hidden", 	title: words["template"], 	css: "" },
                                { col: "temp_right_id", type: "actbox", other: "", title: words["right"], show:1 },
                                { col: "", type: "icon" }
                           ]
                        },
                        selectvals: {
                            pptable: {},
							sstable: {}
                        },
                        idvals: { rootid: "0", pid: "", tid: "", sid: "" },

                        checklist: {
                            menu_right_id: 	{ atable: "user_menu_right", 		acol:"menu_id", stable: "website_right", scol: "id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) },
                            temp_right_id: 	{ atable: "user_template_right", 	acol:"temp_id", stable: "website_right", scol: "id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) }
                        },
                        listTables: {
                        }
                    },
                    //snodes: { "pptable.0.2": true, "tttable.2.2":true },
                    nodes: []
                };
				

                $scope.groupList = {
                    schema: {
                        table: {
                            pptable: { name: "user_group", col: "id", val: "" }
                        },
                        cols: [
                                { col: "", type: "rowno" },
                                { col: langCol("title", GLang), type: "text" },
                                { col: " ", type: "seperator" },
                                { col: "status", type: "imgvalue", css: "status" }
                              ],
                        orderBy: [
                                    { key: "created_time asc", title: words["created_time"] + " ▲" },
                                    { key: "created_time desc", title: words["created_time"] + " ▼" },
                                    { key: "orderno asc", title: words["orderno"] + " ▲" },
                                    { key: "orderno desc", title: words["orderno"] + " ▼" },
                                    { key: langCol("title", GLang) + " asc", title: words["title"] + " ▲" },
                                    { key: langCol("title", GLang) + " desc", title: words["title"] + " ▼" }
                                 ],

                        desc: "{{" + langCol("title", GLang) + "}}\n{{"+ langCol("desc", GLang) +"}}",
                        idvals: { pid: "" }
                    },
                    navi: {
                        head: {
                            lang: GLang,
                            action: "view",
                            wait: 1,
                            loading: 0,
                            match: 0,

                            orderBy: "orderno desc",
                            pageNo: 0,
                            pageSize: 10,
                            totalNo: 0
                        }
                    },
                    rows: []
                };

                wmliuListService.setListClick("group_list", function (row) {
                    wmliuFormService.load["group_form"]({ sid: $scope.groupList.schema.idvals.pid });
                });

                $scope.groupForm = {
                    buttons: {
                        button: [{ key: "save", title: words["save"] }, { key: "cancel", title: words["cancel"] }, { key: "add", title: words["add"] }, { key: "delete", title: words["delete"] }, { key: "excel", title: words["output"] }, { key: "print", title: words["print"] }],
                        rights: GUserRight
                    },
                    schema: {
                        table: {
                            sstable: { name: "user_group", col: "id"}
                        },
                        checklist: {
							level: { stable: "website_right_level", scol:"id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) }
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
                            title_cn: 	{ type: "textbox", 	title: words["title.cn"], 	required: 1, maxlength: 64 },
                            desc_cn: 	{ type: "textbox", 	title: words["desc.cn"], 	required: 0, maxlength: 256 },
                            title_en: 	{ type: "textbox", 	title: words["title.en"], 	required: 1, maxlength: 64 },
                            desc_en: 	{ type: "textbox", 	title: words["desc.en"], 	required: 0, maxlength: 256 },
                            level: 		{ type: "select", 	title: words["right.level"],required: 1 },
                            orderno:    { type: "textbox",  title: words["orderno"], pattern: "number" },
                            created_time: { type: "intdate",  title: words["created_time"] },
                            last_updated: { type: "intdate",  title: words["last_updated"] },
                            orderno:    { type: "textbox",  title: words["orderno"], pattern: "number" },
							group_id:	{ type: "treecheck", 
												tree: {
													menu_right_id: { table: "user_group_menu", 		col: "menu_id", 	val: "right_id" },
													temp_right_id: { table: "user_group_template", 	col: "temp_id", 	val: "right_id" }
												}
										},
                            status: 	{ type: "bool", 	title: words["tree.status"] }
							
                        },
                        vals: {
                        }
                    }
                }; // end form

                wmliuFormService.setButtonClick("group_form", function (action, vobj) {
                    //vobj.detail.vals.status = true;
                    wmliuListService.select["group_list"]();
                }, "add");

				
                var evt_callback = {
                    success: function (action, obj) {
                        switch (action) {
                            case "new":
                                wmliuListService.load["group_list"]({ pid: obj.schema.idvals.sid });
                                break;
                            case "update":
                                wmliuListService.load["group_list"]();
                                break;
                            case "delete":
                                wmliuListService.load["group_list"]();
                                break;
                        }
                    }
                }
                wmliuFormService.setCallBack("group_form", evt_callback, "save");
				
				
				
            });
        </script>
</head>
<body ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "权限分组", "权限分组"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="webAdmin" >
		<table>
        	<tr>
            	<td valign="top">
                     <div class="lwhTab9 lwhTab9-awesome">
                        <ul>
                            <li class="selected"><?php echo $admin_user["uhere"] ?><s></s></li>
                        </ul>
                     </div>
                     <br />
		              <wmliu.list name="group_list" list="groupList" loading="1"></wmliu.list>
                </td>
            	<td valign="top" style="padding-left:20px;">
                             <div class="lwhTab9 lwhTab9-green">
                                <ul>
                                    <li class="selected"><?php echo $words["group.detail"] ?><s></s></li>
                                </ul>
                             </div>
                             <br />
                            <wmliu.form form="groupForm" name="group_form" loading="0">
                                <table>
                                    <tr>
                                        <td><form.label form="groupForm" col="title_cn"></form.label></td>
                                        <td><form.textbox form="groupForm" col="title_cn" ></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td valign="top"><form.label form="groupForm" col="desc_cn"></form.label></td>
                                        <td><form.textarea form="groupForm" col="desc_cn"></form.textarea></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="groupForm" col="title_en"></form.label></td>
                                        <td><form.textbox form="groupForm" col="title_en" ></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td valign="top"><form.label form="groupForm" col="desc_en"></form.label></td>
                                        <td><form.textarea form="groupForm" col="desc_en"></form.textarea></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="groupForm" col="level"></form.label></td>
                                        <td><form.select form="groupForm" col="level" ></form.select></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="groupForm" col="orderno"></form.label></td>
                                        <td><form.textbox form="groupForm" col="orderno" style="width:40px;"></form.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="groupForm" col="status"></form.label></td>
                                        <td><form.bool form="groupForm" col="status"></form.bool></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="groupForm" col="created_time"></form.label></td>
                                        <td><form.intdate form="groupForm" col="created_time" format=""></form.intdate></td>
                                    </tr>
                                    <tr>
                                        <td><form.label form="groupForm" col="last_updated"></form.label></td>
                                        <td><form.intdate form="groupForm" col="last_updated" format=""></form.intdate></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <br />
                                            <form.button form="groupForm"></form.button>
                                            <form.error form="groupForm" ww="40%" hh="40%" minww="300px" minhh="200px"></form.error>
                                        </td>
                                    </tr>
                                </table>
                            </wmliu.form>
              
                </td>
            	<td valign="top" style="padding-left:20px;">
                     <div class="lwhTab9 lwhTab9-purple">
                        <ul>
                            <li class="selected"><?php echo $words["website.menu.definition"] ?><s></s></li>
                        </ul>
                     </div>
                     <br />
                    <wmliu.treeviewtitle tree="tree"></wmliu.treeviewtitle>
                    <wmliu.treeview name="lwh" 
                                single="0" 
                                linkform="groupForm"
                                linkcol="group_id" 
                                linkselect="" 
                                expandnodes=""
                                selectnodes=""
                                parentid="0" 
                                showall="1s" 
                                loading="1"
                                tree="tree" 
                                nodes="tree.nodes" 
                                selectmode="">
                    </wmliu.treeview>
                </td>
        	</tr>
      	</table>      
	</div>


<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php include_once("website_a_common.php");?>
</body>
</html>
