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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.search.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.table.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.table.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
            var app = angular.module("myApp", ["wmliuTable", "wmliuSearch"])
            app.controller("webAdmin", function ($scope, wmliuTableService, wmliuSearchService) {
                $scope.table = {
                    buttons: {
                        rights: 	GUserRight,
                        head: {
                            wait: 1,
                            icon: [
                                        { key: "add", 		title: words["add"], 		desc: words["add"] 		},
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	}
                                  ]
                        },
                        row: {
                            wait: 1,
                            icon: [
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	},
                                        { key: "delete", 	title: words["delete"], 	desc: words["delete"] 	}
                                  ]
                        }
                    },
                    schema: {
                        table: {
                            sstable: { name: "website_files", col: "id", val: "" }
                        },
                        cols:
                            [
                                    { col: "", 				type: "rowno", 		title: words["sn"], align: "center", css: "" },
                                    { col: "imgthumb", 		type: "thumb", 		title: words["project"], 		width: 50,  css: "", align: "left", valign: "middle" },
                                    { col: "filter", 		type: "textbox", 		title: words["image.filter"], 	sort: "asc", align: "left", valign: "top", width: 80,  required: 1, maxlength: 64 },
                                    { col: "ref_id", 		type: "textbox", 		title: words["ref_id"], 		sort: "asc", align: "center", valign: "top", width:60 },
                                    { col: "id", 			type: "text", 		title: words["id"], 			sort: "asc", align: "center", valign: "top" },
                                    { col: "orderno", 		type: "textbox", 	title: words["orderno"], 		sort: "asc", align: "center", valign: "top", width: 40, required: 1, pattern:"number" },
                                    { col: "file_name", 	type: "textbox", 	title: words["file.name"], 		sort: "asc", align: "left", valign: "top", width: 120, required: 0, maxlength: 256 },
                                    { col: "file_type", 	type: "text", 		title: words["file.type"], 		sort: "asc", align: "left", valign: "top" },
                                    { col: "file_size", 	type: "text", 		title: words["file.size"], 		sort: "asc", align: "left", valign: "top" },
                                    { col: "file_ww", 		type: "text", 		title: words["file.width"],		sort: "asc", align: "left", valign: "top" },
                                    { col: "file_hh", 		type: "text", 		title: words["file.height"],	sort: "asc", align: "left", valign: "top" },
                                    { col: "url", 			type: "textbox", 	title: words["file.url"], 		sort: "asc", align: "left", valign: "top", width: 120, 	required: 0, maxlength: 1024 },
                                    { col: "title_en", 		type: "textbox", 	title: words["title.en"], 		sort: "asc", align: "left", valign: "top", width: 80,   required: 0, maxlength: 256 },
                                    { col: "detail_en", 	type: "textbox", 	title: words["desc.en"], 		sort: "asc", align: "left", valign: "top", width: 120, 	required: 0, maxlength: 1024 },
                                    { col: "title_cn", 		type: "textbox", 	title: words["title.cn"], 		sort: "asc", align: "left", valign: "top", width: 80,   required: 0, maxlength: 256 },
                                    { col: "detail_cn", 	type: "textbox", 	title: words["desc.cn"], 		sort: "asc", align: "left", valign: "top", width: 120, 	required: 0, maxlength: 1024 },
                                    { col: "status", 		type: "bool", 		title: words["active"], 		sort: "asc", align: "left", valign: "top" },
                                    { col: "", 				type: "icon", title: words["action"], align: "left", nowrap: 1 }
                            ]
                    },
                    navi: {
                        head: {
                            lang: 		GLang,
                            action: 	"view",
                            loading: 	0,
							imgsettings: {
								filter: 		"admin photo",
								mode:			"medium",
								view:			"tiny",
								single:			true,
								singleImage:	1,     // simgleImage = 1 : sid is imgid ;  singleImage = 0 : sid is refid
								edit:			true,
								tips:			true,
								cropww:			200,
								crophh: 		0
							},
							
                            orderBY: 	"created_time",
                            orderSN: 	"DESC",
                            pageNo: 	1,
                            pageSize: 	20,
                            totalNo: 	0
                        }
                    },
                    rows: []
                }


                wmliuSearchService.setButtonClick("lwh", function () {
                    wmliuTableService.load["lwh"]();
                }, "search");
            });

        </script>
</head>
<body ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "信息管理", "信息管理"." :".$admin_user["user_name"]);
?>
<!--
<div class="main-content"><div class="frame-center">
-->
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="webAdmin" style="padding:20px;">
    <fieldset>
    	<legend><?php echo $words["search criteria"]; ?></legend>
              <search.form table="table">
              <table cellpadding="2" cellspacing="2">
                  <tr>
                      <td align="right"><?php echo $words["filter"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="filter" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["ref_id"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="ref_id" datatype="number" compare="="></search.textbox></td>
                      <td align="right"><?php echo $words["id"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="id" cols="id" datatype="number" compare="="></search.textbox></td>
                 </tr>
                 <tr>
                      <td align="right"><?php echo $words["file.name"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="file_name" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["title"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="title" cols="title_en,title_cn" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["description"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="desc" cols="detail_en,detail_cn" datatype="string" compare="%"></search.textbox></td>
                  </tr>
                  <tr>
                      <td align="right">
                            <search.button table="table" name="<?php echo $words["search"];?>" action="search"></search.button>                      
                      </td>
                      <td>
                      </td>
                  </tr>
              </table>
              </search.form>
    </fieldset>
    <wmliu.table name="lwh" table="table" loading="1"></wmliu.table>
	</div>

<!------------------------------------------------ End of website content --------------------------------------------->
<!--
</div></div>
-->
<?php include_once("website_a_common.php");?>
</body>
</html>
