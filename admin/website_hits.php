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

        <script language="javascript" type="text/javascript">
            var app = angular.module("myApp", ["wmliuTable", "wmliuSearch"])
            app.controller("webAdmin", function ($scope, wmliuTableService, wmliuSearchService) {
                $scope.table = {
                    buttons: {
                        rights: 	GUserRight,
                        head: {
                            wait: 1,
                            icon: [
                                        //{ key: "add", 		title: words["add"], desc: words["add"] },
                                        { key: "save", 		title: words["save"], desc: words["save"] },
                                        { key: "cancel", 	title: words["cancel"], desc: words["cancel"] }
                                  ]
                        },
                        row: {
                            wait: 1,
                            icon: [
                                        { key: "save", title: words["save"], desc: words["save"] },
                                        { key: "cancel", title: words["cancel"], desc: words["cancel"] },
                                        { key: "delete", title: words["delete"], desc: words["delete"] }
                                  ]
                        }
                    },
                    schema: {
                        table: {
                            sstable: { name: "website_hits", col: "id", val: "" }
                        },
                        cols:
                            [
								{ col: "", type: "rowno", title: words["sn"], align: "center", css: "" },
								//{ col: "thumb", type: "thumb", title: words["project"], sort: "asc", css: "", align: "left", valign: "middle" },
								{ col: "filter", 		type: "text", title: words["filter"], 		sort: "asc", align: "left", valign: "top"},
								{ col: "webpage", 		type: "text", title: words["webpage"], 		sort: "asc", align: "left", valign: "top"},
								{ col: "info", 			type: "text", title: words["detail"], 		sort: "asc", align: "left", valign: "top" },
								{ col: "template", 		type: "text", title: words["template"], 	sort: "asc", align: "left", valign: "top" },
								{ col: "url",			type: "text", title: words["url"], 			sort: "asc", align: "left", valign: "top" },
								{ col: "platform",		type: "text", title: words["platform"],		sort: "asc", align: "left", valign: "top" },
								{ col: "browser",		type: "text", title: words["browser"], 		sort: "asc", align: "left", valign: "top" },
								{ col: "version",		type: "text", title: words["version"], 		sort: "asc", align: "left", valign: "top" },
								{ col: "ip_address",	type: "text", title: words["ip address"], 	sort: "asc", align: "left", valign: "top" },
								{ col: "created_time",	type: "intdate", title: words["created_time"], sort: "desc", align: "left", valign: "top" },
								{ col: "", 				type: "icon", title: words["action"], align: "left", nowrap: 1 }
                            ]
                    },
                    navi: {
                        head: {
                            lang: 		GLang,
                            action: 	"view",
                            loading: 	0,
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
	LANG::hit("Admin", "点击率", "点击率" ." :".$admin_user["user_name"]);
?>
<div class="main-content">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="webAdmin" >
    <fieldset>
    	<legend><?php echo $words["search criteria"]; ?></legend>
              <search.form table="table">
              <table cellpadding="2" cellspacing="2">
                  <tr>
                      <td align="right"><?php echo $words["template"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="url" cols="template,url" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["webpage"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="webpage" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["detail"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="info" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["ip address"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="ip_address" datatype="string" compare="%"></search.textbox></td>
                  </tr>
                  <tr>
                      <td align="right"><?php echo $words["filter"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="filter" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["platform"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="platform" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["browser"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="browser" datatype="string" compare="%"></search.textbox></td>
                      <td align="right"><?php echo $words["version"];?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="version" datatype="string" compare="%"></search.textbox></td>
                  </tr>
                  <tr>
                      <td align="right"><?php echo $words["created_time"];?>: </td>
                      <td colspan="4"><search.dateintrange table="table" name="sstable" search="created_time" datatype="date" compare="in"></search.dateintrange></td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>
                            <search.button table="table" name="<?php echo $words["search"];?>" action="search"></search.button>                      
                      </td>
                  </tr>
              </table>
              </search.form>
    </fieldset>
    <wmliu.table name="lwh" table="table" loading="1" width="900"></wmliu.table>
	</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div>
<?php include_once("website_a_common.php");?>
</body>
</html>
