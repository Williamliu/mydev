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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.tree.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.tree.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
            var app = angular.module("myApp", ["wmliuTree"])
            app.controller("webAdmin", function ($scope, $http, $cookieStore, wmliuTreeService) {

                $scope.tree = {
                    general: {
                        title: words["info.category"],
                        desc: ""
                    },
                    schema: {
                        buttons: {
                            rights: 	GUserRight, 
                            pptable: {
                                icon: [	{ key: "save", desc: words["save"] }, 
										{ key: "cancel", desc: words["cancel"] }, 
										//{ key: "folder", desc: words["folder"] },
										{ key: "add", desc: words["add"] }, 
										//{ key: "excel", desc: words["output"] }, 
										{ key: "delete", desc: words["delete"]}
									  ]
                            },
                            tttable: {
                                icon: [	{ key: "save", desc: words["save"] }, 
										{ key: "cancel", desc: words["cancel"] }, 
										{ key: "add", 	desc: words["add"] }, 
										//{ key: "excel", desc: words["output"] }, 
										{ key: "delete", desc: words["delete"]}
									  ]
                            },
                            sstable: {
                                icon: [	{ key: "save", desc: words["save"] }, 
										{ key: "cancel", desc: words["cancel"] }, 
										//{ key: "excel", 	desc: words["output"] }, 
										{ key: "delete", desc: words["delete"]}
									  ]
                            }
                        },
                        head: {
                            lang: GLang,
                            wait: 1,
                            loading: 0,
                            action: "none"
                        },
                        table: {
                            pptable: { 
										name: "product_category", 
										col: "id", 
										pref: "parent_id",   // required
										title: "", 
										desc: "", 
										selectmode: ""
      			                     },
                            tttable: { 
										name: "product_class", 
										col: "id", 
										pref: "ref_id",   // required
										title: "", 
										desc: "", 
										selectmode: ""
      			                     },
                            sstable: { 
										name: "product_label", 
										col: "id", tref: "ref_id", 
										title: "", 
										desc: "", 
										selectmode: ""
                            }
                        },
                        cols: {
                            pptable: [
                                { col: "title_cn", 	type: "textbox", 	title: 	words["title.cn"],  required: 1 },
                                { col: "desc_cn", 	type: "textbox", 	title: 	words["desc.cn"], 	style:"width:150px;" },
                                { col: "title_en", 	type: "textbox", 	title: 	words["title.en"], 	required: 1 },
                                { col: "desc_en", 	type: "textbox", 	title: 	words["desc.en"], 	style:"width:150px;" },
                                { col: "orderno", 	type: "textbox", 	title: 	words["sn"],  pattern: "number", style:"width:30px;",	css: "" },
                                { col: "status", 	type: "bool", 		title: 	words["tree.status"], 	css: "" },
                                { col: "", type: "icon" }
                           ],
                            tttable: [
                                { col: "title_cn", 	type: "textbox", 	title: words["title.cn"], 	required: 1 },
                                { col: "desc_cn", 	type: "textbox", 	title: words["desc.cn"], 	style:"width:150px;" },
                                { col: "title_en", 	type: "textbox", 	title: words["title.en"], 	required: 1 },
                                { col: "desc_en", 	type: "textbox", 	title: words["desc.en"], 	style:"width:150px;" },
                                { col: "orderno", 			type: "textbox", 	title: 	words["sn"],  pattern: "number",  style:"width:30px;",	css: "" },
                                { col: "status", 			type: "bool", 		title: 	words["tree.status"], 	css: "" },
                                { col: "", type: "icon" }
                           ],
                            sstable: [
                                { col: "title_cn", 	type: "textbox", 	title: words["title.cn"], 	required: 1 },
                                { col: "desc_cn", 	type: "textbox", 	title: words["desc.cn"], 	style:"width:150px;" },
                                { col: "title_en", 	type: "textbox", 	title: words["title.en"], 	required: 1 },
                                { col: "desc_en", 	type: "textbox", 	title: words["desc.en"], 	style:"width:150px;" },
                                { col: "orderno", 			type: "textbox", 	title: 	words["sn"],  pattern: "number",  style:"width:30px;",	css: "" },
                                { col: "status", 			type: "bool", 		title: 	words["tree.status"], 	css: "" },
                                { col: "", type: "icon" }
                           ]
                        },
                        selectvals: {
                            pptable: {},
							sstable: {}
                        },
                        idvals: { rootid: "0", pid: "", tid: "", sid: "" },

                        checklist: {
                        },
                        listTables: {
                        }
                    },
                    //snodes: { "pptable.0.2": true, "tttable.2.2":true },
                    nodes: []
                }

            });
        </script>
</head>
<body ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "用户菜单", "用户菜单"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="webAdmin" >
            <wmliu.treetitle tree="tree"></wmliu.treetitle>
            <wmliu.tree name="productCategory" 
                        single="0" 
                        expandnodes=""
                        selectnodes=""
                        parentid="0" 
                        showall="1s" 
                        loading="1"
                        tree="tree" 
                        nodes="tree.nodes" 
                        selectmode="">
            </wmliu.tree>
	</div>
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>
