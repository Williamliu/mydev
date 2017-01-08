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
                        title: words["website.menu.definition"],
                        desc: ""
                    },
                    schema: {
                        buttons: {
                            rights: 	GUserRight,
                            pptable: {
                                icon: [	{ key: "save", desc: words["save"] }, 
										{ key: "cancel", desc: words["cancel"] }, 
										{ key: "folder", desc: words["folder"] }, 
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
										name: "website_menu", 
										col: "id", 
										pref: "parent_id", 
										title: "", 
										desc: "", 
										selectmode: ""
      			                     },
                            sstable: { 
										name: "website_template", 
										col: "id", pref: "ref_id", 
										title: "", 
										desc: "", 
										selectmode: ""
                            }
                        },
                        cols: {
                            pptable: [
                                { col: "menu_key", 				type: "text", 	title: 	words["menu.key"], 	required: 0 },
                                { col: langCol("title",GLang), 	type: "text", 	title: 	words["title"], 	required: 0 },
                                { col: "seo_title", 	type: "textbox", 	title: words["seo.title"], 		style:"width:200px;", required: 1 },
                                { col: "seo_keyword", 	type: "textbox", 	title: words["seo.keyword"], 	style:"width:200px;"},
                                { col: "seo_description",type: "textbox", 	title: words["seo.desc"], 		style:"width:250px;"},
                                { col: "seo_class",		type: "textbox", 	title: words["seo.class"], 		style:"width:200px;"},
                                { col: "", type: "icon" }
                           ],
                            sstable: [
                                { col: "menu_key", 				type: "text", 	title: 	words["menu.key"], 	required: 0 },
                                { col: langCol("title",GLang), 	type: "text", 	title: 	words["title"], 	required: 0 },
                                { col: "seo_title", 	type: "textbox", 	title: words["seo.title"], 		style:"width:200px;", required: 1 },
                                { col: "seo_keyword", 	type: "textbox", 	title: words["seo.keyword"], 	style:"width:200px;"},
                                { col: "seo_description",type: "textbox", 	title: words["seo.desc"], 		style:"width:250px;"},
                                { col: "seo_class",		type: "textbox", 	title: words["seo.class"], 		style:"width:200px;"},
                                { col: "", type: "icon" }
                           ]
                        },
                        selectvals: {
                            pptable: {},
							sstable: {}
                        },
                        idvals: { rootid: "0", pid: "", tid: "", sid: "" },

                        checklist: {
                            menu_right_id: 	{ rtable: "website_menu_right", 		rcol: "menu_id", ltable: "", stable: "website_right", scol: "id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) },
                            temp_right_id: 	{ rtable: "website_template_right", 	rcol: "temp_id", ltable: "", stable: "website_right", scol: "id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) }
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
	LANG::hit("Admin", "搜索优化", "搜索优化"." :".$admin_user["user_name"]);
?>

    <div ng-controller="webAdmin" >
            <wmliu.treetitle tree="tree"></wmliu.treetitle>
            <wmliu.tree name="lwh" 
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

<?php include_once("website_a_common.php");?>
</body>
</html>
