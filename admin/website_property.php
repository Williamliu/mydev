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
                    schema: {
                        table: {
                            pptable: { name: "website_basic_table", ptext: langCol("title", GLang), col: "id" },
                            sstable: { name: "website_basic_info", 	col: "id", pref: "ref_id" }
                        },
                        cols:
                        [
                                { col: "refcheck", 		type: "refcheck", 	title: "", 					align: "center", valign: "top" },
								{ col: "", 				type: "rowno", 		title: words["sn"], 		align: "center", css: "" },
                                { col: "pp1", 			type: "ptext", 		pcol: langCol("title", GLang), title: words["table.name"] },

								{ col: "title_en", 		type: "textbox", 	title: words["title.en"], 	sort: "asc",  	align: "left", 	valign: "top", width: 120, required: 1, maxlength: 256 },
								{ col: "desc_en", 		type: "textbox", 	title: words["desc.en"], 	sort: "asc", 	align: "left", 	valign: "top", width: 120, required: 0, maxlength: 1024 },
								{ col: "title_cn", 		type: "textbox", 	title: words["title.cn"], 	sort: "asc",  	align: "left", 	valign: "top", width: 120, required: 1, maxlength: 256 },
								{ col: "desc_cn", 		type: "textbox", 	title: words["desc.cn"], 	sort: "asc", 	align: "left", 	valign: "top", width: 120, required: 0, maxlength: 1024 },
                                { col: "status", 		type: "bool", 		title: words["active"], 	sort: "asc", 	align: "center",valign: "top", width: 40 },
                                { col: "orderno",		type: "textbox",	title: words["orderno"], 	sort: "desc", 	align: "left", 	valign: "top", width: 40, pattern:"number" },
								{ col: "", type: "icon", title: words["action"], align: "left", nowrap: 1 }
                        ],
                        checklist: {
                            ref_id:     {   stable: "website_basic_table", scol: "id", stitle: langCol("title", GLang), sdesc: langCol("title", GLang) }
                        }
                    },
                    navi: {
                        head: {
                            lang: 		GLang,
                            action: 	"view",
                            loading: 	0,
                            orderBY: 	"website_basic_info.created_time",
                            orderSN: 	"DESC",
                            pageNo: 	1,
                            pageSize: 	20,
                            totalNo: 	0
                        }
                    },
                    rows: []
                }

                $scope.search = function () {
                    wmliuTableService.load["lwh"]({ pid: $scope.table.schema.filterVals.sstable.ref_id });
                }

            });

        </script>

</head>
<body ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "属性分类", "属性分类"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

<div ng-controller="admin_site" >
    <br />
    <fieldset>
    	<legend><?php echo $words["search criteria"]?></legend>
              <table cellpadding="2" cellspacing="2">
                  <tr>
                      <td align="right"><?php echo $words["table.name"]?>: </td>
                      <td>
                          <search.form table="table">
                            <search.choose table="table" name="sstable" search="ref_id" datatype="number" valuechange="search()" compare="="></search.choose>
                          </search.form>
                      </td>
                  </tr>
              </table>
    </fieldset>
    <wmliu.table name="lwh" table="table" loading="1"></wmliu.table>
</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>

