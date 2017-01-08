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
            app.controller("admin_site", function ($scope, wmliuTableService, wmliuSearchService) {
                $scope.table = {
                    //static - no information updated
                    buttons: {
                        rights: GUserRight,
                        head: {
                            wait: 1,
                            icon: [
                                        { key: "add", 		title: words["add"], desc: words["add"] },
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
                    //static
                    schema: {
                        table: {
                            sstable: { name: "website_country", col: "id", val: "" }
                        },
                        cols:
                        [
								{ col: "", 				type: "rowno", 		title: words["sn"], 		align: "center", css: "" },
								{ col: "country_en",	type: "textbox", 	title: words["country.en"], sort: "asc", 	align: "left", 	valign: "top", width: 120, maxlength: 64 },
								{ col: "country_cn",	type: "textbox", 	title: words["country.cn"], sort: "asc", 	align: "left", 	valign: "top", width: 120, maxlength: 64 },
								{ col: "currency_en", 	type: "textbox", 	title: words["currency.en"],sort: "asc",  	align: "left", 	valign: "top", width: 60, required: 1, maxlength: 16 },
								{ col: "currency_cn", 	type: "textbox", 	title: words["currency.cn"],sort: "asc",  	align: "left", 	valign: "top", width: 60, required: 1, maxlength: 16 },
								{ col: "symbol", 		type: "textbox", 	title: words["currency.symbol"], sort: "asc", 	align: "left", 	valign: "top", width: 60, required: 1, 	maxlength: 16 },
                                { col: "status", 		type: "bool", 		title: words["active"], 	sort: "asc", 	align: "center",valign: "top", width: 40 },
                                { col: "orderno",		type: "textbox",	title: words["orderno"], 	sort: "desc", 	align: "left", 	valign: "top", width: 40, pattern:"number" },
								{ col: "", type: "icon", title: words["action"], align: "left", nowrap: 1 }
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
	LANG::hit("Admin", "分类属性", "分类属性"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div ng-controller="admin_site" >
    <br />
    <fieldset>
    	<legend><?php echo $words["search criteria"]?></legend>
              <search.form table="table">
              <table cellpadding="2" cellspacing="2">
                  <tr>
                      <td align="right"><?php echo $words["country"]?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="country"  cols="country_en,country_cn"  datatype="string" compare="%" /></td>
                      <td align="right"><?php echo $words["currency"]?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="currency" cols="currency_en,currency_cn" datatype="string" compare="%" /></td>
                      <td align="right"><?php echo $words["currency.symbol"]?>: </td>
                      <td><search.textbox style="width:120px;" table="table" name="sstable" search="symbol" datatype="string" compare="%" /></td>
                      <td align="right"><?php echo $words["active"]?>: </td>
                      <td><search.bool table="table"    name="sstable" search="status" datatype="bool"  compare="="></search.bool></td>
                  </tr>
                  <tr>
                      <td align="right"></td>
                      <td>
                         <search.button table="table"  name="<?php echo $words["search"]?>" action="search"></search.button>
                      </td>
                  </tr>
              </table>
              </search.form>
    </fieldset>
    <wmliu.table name="lwh" table="table" loading="1"></wmliu.table>
	<br />
    </div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>
