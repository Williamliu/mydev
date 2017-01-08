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
        <link 	type="text/css" 	  	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

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
                                        { key: "add", title: "Add", desc: "Add Word" },
                                        { key: "save", title: "Save", desc: "Save All Changes" },
                                        { key: "cancel", title: "Cancel", desc: "Cancel All Change" }
                                        ]
                        },
                        row: {
                            wait: 1,
                            icon: [
                                        { key: "save", title: "Save", desc: "Save Language" },
                                        { key: "cancel", title: "Cancel", desc: "Cancel Change" },
                                        { key: "delete", title: "Delete", desc: "Delete Word" }
                                        ]
                        }
                    },
                    schema: {
                        table: {
                            sstable: { name: "website_upload", col: "id", val: "" }
                        },
                        cols:
                            [
                                    { col: "", type: "rowno", title: words["sn"], align: "center", css: "" },
                                    //{ col: "linkupload", 	type: "linkupload", title: words["upload photo"], 	css: "", align: "left", valign: "middle" },
                                    //{ col: "imgthumb", 		type: "thumb", 		title: words["project"], 		css: "", align: "left", valign: "middle" },
                                    { col: "filter", 		type: "textbox", 	title: words["image.filter"], 	sort: "asc", align: "left", valign: "top", width: 80, required: 1, maxlength: 64 },
                                    { col: "root_dir", 		type: "textbox", 	title: words["root dir"], 		sort: "asc", align: "left", valign: "top", width: 120, required: 0, maxlength: 1024 },
                                    { col: "relative_dir", 	type: "textbox", 	title: words["relative dir"], 	sort: "asc", align: "left", valign: "top", width: 120, required: 0, maxlength: 1024 },
                                    { col: "maxno", 		type: "textbox", 	title: words["image.maxno"], 	sort: "asc", align: "left", valign: "top", width: 50, required: 1, maxlength: 16 },
                                    { col: "large", 		type: "textbox", 	title: words["large size"], 	sort: "asc", align: "left", valign: "top", width: 80, required: 1, maxlength: 16 },
                                    { col: "medium", 		type: "textbox", 	title: words["medium size"], 	sort: "asc", align: "left", valign: "top", width: 80, required: 1, maxlength: 16 },
                                    { col: "small", 		type: "textbox", 	title: words["small size"], 	sort: "asc", align: "left", valign: "top", width: 80, required: 1, maxlength: 16 },
                                    { col: "tiny", 			type: "textbox", 	title: words["tiny size"], 		sort: "asc", align: "left", valign: "top", width: 80, required: 1, maxlength: 16 },
                                    { col: "thumb", 		type: "textbox", 	title: words["thumb size"], 	sort: "asc", align: "left", valign: "top", width: 80, required: 1, maxlength: 16 },
                                    { col: "", type: "icon", title: words["action"], align: "left", nowrap: 1 }
                            ]
                    },
                    navi: {
                        head: {
                            lang: 		GLang,
                            action: 	"view",
                            loading: 	0,
							imgsettings: {
								filter: "admin photo",
								mode:	"medium",
								view:	"tiny",
								single:	false,
								edit:	true,
								tips:	true,
								cropww:	100,
								crophh: 100
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
	LANG::hit("Admin", "图片存储", "图片存储"." :".$admin_user["user_name"]);
?>

<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="webAdmin" >
    <fieldset>
    	<legend><?php echo $words["search criteria"]; ?></legend>
              <search.form table="table">
              <table cellpadding="2" cellspacing="2">
                  <tr>
                      <td align="right"><?php echo $words["keyword"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="keyword" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["content"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="content" cols="en,cn" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["project"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="project" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["filter"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="filter" datatype="string" compare="%"></search.textbox></td>
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
</div></div>
<?php include_once("website_a_common.php");?>
</body>
</html>
