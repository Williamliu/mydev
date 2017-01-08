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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.form.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.list.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.list.css" rel="stylesheet" />

        <script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.search.js"></script>
        <script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.table.js"></script>
    	<link type="text/css"			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.table.css" rel="stylesheet" />

        <script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/plugin/ckeditor_full/ckeditor.js"></script>
		<style>
		td input.long {
			width: 300px;
		}
        </style>

        <script language="javascript" type="text/javascript">
            var htmlObj = null;
            var sc = null;
            var html_loading = false;
            $(function () {
                htmlObj = CKEDITOR.replace('content_area',{});
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj.on('change', function (evt) {
                    //get data: console.log(evt.editor.getData());
                    if (html_loading) {
                        html_loading = false;
                    } else {
                        if (sc.adminContentForm.detail.head.state == "view") { sc.adminContentForm.detail.head.state = "update"; sc.$apply(); }
                        if (sc.adminContentForm.detail.head.state == "add") { sc.adminContentForm.detail.head.state = "new"; sc.$apply(); }
                    }
                });
            });

            var app = angular.module("myApp", ["wmliuForm", "wmliuTable", "wmliuList", "wmliuSearch"])
            app.controller("admin_content", function ($scope, wmliuFormService, wmliuSearchService, wmliuListService, wmliuTableService) {
                //app.controller("adminContentForm", function ($scope, $http, wmliuFormService) {
                $scope.categoryList = {
                    schema: {
                        table: {
                            pptable: { name: "website_content", col: "id" }
                        },
                        cols: [
                                { col: "id", 		type: "hidden" },
                                { col: "", 			type: "rowno" },
                                { col: "status", type: "imgvalue", css: "status" },
                                { col: "keyword", 	type: "text" },
                                { col: " - ", 		type: "seperator", on: "subject" },
                                { col: "subject", 	type: "text" }
                              ],
						orderBy : [
							{ key:"created_time desc", 	title: words["date"] + " ▼" },
							{ key:"created_time asc",  	title: words["date"] + " ▲" },
							{ key:"keyword desc",  		title: words["keyword"] + " ▼" },
							{ key:"keyword asc",  		title: words["keyword"] + " ▲" },
							{ key:"template desc",  	title: words["template"] + " ▼" },
							{ key:"template asc",  		title: words["template"] + " ▲" },
							{ key:"subject asc", 		title: words["subject"] + " ▲" },
							{ key:"subject desc", 		title: words["subject"] + " ▼" }
						],
                        desc: words["id"] + ": {{id}}\n" + words["subject"] + ": {{subject}}\n" + words["keyword"] + ": {{keyword}}"
                    },
                    navi: {
                        head: {
                            lang: "cn",
                            action: "view",
                            wait: 0,
                            loading: 0,

                            orderBy: "created_time desc",
                            pageNo: 0,
                            pageSize: 30,
                            totalNo: 0
                        }
                    },
                    rows: []
                };

                wmliuListService.setListClick("adminContentList", function (item) {
                    wmliuFormService.load["adminContentForm"]({ sid: item["pid"] });
                });

                $scope.adminContentForm = {
                    buttons: {
                        button: [{ key: "save", title: words["save"] }, { key: "cancel", title: words["cancel"] }, { key: "add", title: words["add"] }, { key: "delete", title: words["delete"] }],
                        rights: GUserRight
                    },
                    schema:
                    {
                        table: {
                            sstable: { name: "website_content", col: "id" }
                        }
                    },
                    detail: {
                        head: {
                            lang: 			GLang,
                            wait: 			1,
                            loading: 		0,

                            state: 			"none",
                            action: 		"none",

                            error: 			0,
                            errorMessage: 	""
                        },
                        cols: {
                            keyword:	{ type: "textbox", 	title: words["keyword"], 	required: 1, 	maxlength: 64 },
                            template: 	{ type: "textbox", 	title: words["template"], 	required: 1,	maxlength: 64 },
                            subject: 	{ type: "textbox", 	title: words["subject"], 	required: 1, 	maxlength: 256 },
                            content:	{ type: "textarea", title: words["content"], 	required: 0, 	nosync: 1 },
							status: 	{ type: "bool", 	title: words["active"] }
                        },
                        vals: {}
                    }
                };

                wmliuFormService.setCallBack("adminContentForm",
                    {
                        before: function (act, obj) {
	                        html_loading = true;
    	                    CKEDITOR.instances["content_area"].setData("");
                        },
                        success: function (act, obj) {
                            html_loading = true;
                            CKEDITOR.instances["content_area"].setData(obj.detail.vals.content);
                        }
                    }
                  ,["load","fresh"]);



				// update, new, delete;
                var fevt = {
                    before: function (action, obj) {
                        obj.detail.vals.content = CKEDITOR.instances["content_area"].getData();
                    },
                    success: function(action, obj) {
						switch(action) {
							case "new":
		                        wmliuListService.load["adminContentList"]({pid: obj.schema.idvals.sid});
								break;
							case "update":
		                        wmliuListService.load["adminContentList"]();
								break;
							case "delete":
								html_loading = true;
								CKEDITOR.instances["content_area"].setData("");
								wmliuListService.load["adminContentList"]();
								break;
						}
                    }
                }
                wmliuFormService.setCallBack("adminContentForm", fevt , "save");


                wmliuFormService.setButtonClick("adminContentForm", function (action, formObj) {
                    switch (action) {
                        case "add":
                            $scope.adminContentForm.detail.vals.detail = "";
							$scope.adminContentForm.detail.vals.status = true;
							
                            html_loading = true;
                            CKEDITOR.instances["content_area"].setData("");
	                        wmliuListService.select["adminContentList"]();
                            break;
                        case "cancel":
                            // change twice , so after need to set to true
                            html_loading = true;
                            CKEDITOR.instances["content_area"].setData($scope.adminContentForm.detail.vals.content);
                            html_loading = true;  // important : prevent change twice
                            break;
                    }  // switch
                }, ["cancel", "add"]); // button click

				
				sc = $scope;
           });
    </script>
</head>
<body ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "网站内容", "网站内容"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
    <div ng-controller="admin_content" style="display:block; width: 1000px; margin: auto;">
		<h1><?php echo $words["website content"]?></h1>
        <table>
            <tr>
                <td valign="top" width="250">
                    <div style="width: 250px; padding-right: 20px;">
                        <wmliu.list name="adminContentList" list="categoryList" loading="1"></wmliu.list>
                    </div>
                </td>
               <td valign="top">
                            <div style="font-size:14px;">
                            <wmliu.form form="adminContentForm" name="adminContentForm"  loading="0">
                                <table>
                                    <tr>
                                        <td align="right" width="40"><form.label form="adminContentForm" col="keyword"></form.label>: </td>
                                        <td>
                                            <form.textbox class="long" form="adminContentForm"  col="keyword"></form.textbox>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" width="40"><form.label form="adminContentForm" col="template"></form.label>: </td>
                                        <td>
                                            <form.textbox class="long" form="adminContentForm"  col="template"></form.textbox>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" width="40"><form.label form="adminContentForm" col="subject"></form.label>: </td>
                                        <td>
                                            <form.textbox class="long" form="adminContentForm"  col="subject"></form.textbox>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" width="40"><form.label form="adminContentForm" col="status"></form.label>: </td>
                                        <td><form.bool form="adminContentForm" col="status"></form.bool></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" valign="top">
                                            <form.label form="adminContentForm" col="content"></form.label><br />
                                            <textarea id="content_area" style="width:100%; height:500px;"></textarea>
                                       </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <form.button form="adminContentForm"></form.button>
                                            <form.error form="adminContentForm" ww="40%" hh="40%" minww="300px" minhh="200px"></form.error>
                                        </td>
                                    </tr>
                                </table>
                            </wmliu.form>
                    </div>
                </td>
            </tr>
        </table>
        <br />
	</div>
    <br />
 
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>


