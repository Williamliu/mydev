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

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.list.js"></script>
    	<link type="text/css" 			href="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.list.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo 	$CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.form.js"></script>
       
	   <script language="javascript" type="text/javascript">
            var app = angular.module("myApp", ["wmliuTree", "wmliuList", "wmliuForm",])
            app.controller("webAdmin", function ($scope, $http, $cookieStore, wmliuTreeService, wmliuListService, wmliuFormService) {

                $scope.tree = {
                    general: {
                        title: words["info.category"],
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
										name: "product_category", 
										col: "id", 
										pref: "parent_id",   // required
										title: "", 
										desc: "", 
										selectmode: "multiple"
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
                                { 	col: langCol("title", GLang), 	type: "text", 	title: 	words["title"] },
								{	col: " {", 						type: "custom" },
								{	col: "",						type: "nodecount" },
								{	col: "}", 						type: "custom" }
                           ],
                            tttable: [
                                { 	col: langCol("title", GLang), 	type: "text", 	title: 	words["title"] },
								{	col: " {", 						type: "custom" },
								{	col: "",						type: "nodecount" },
								{	col: "}", 						type: "custom" }
                           ],
                            sstable: [
                                { col: langCol("title", GLang), type: "text", 	title: 	words["title"] }
                           ]
                        },
                        selectvals: {
                            pptable: {},
							tttable: {},
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
                };
				
                $scope.cateFilterForm = {
                    buttons: {
                        button: [{ key: "save", title: words["save"] }, { key: "cancel", title: words["cancel"] }, { key: "add", title: words["add"] }, { key: "delete", title: words["delete"] }, { key: "excel", title: words["output"] }, { key: "print", title: words["print"] }],
                        rights: GUserRight,
                    },
                    schema: {
                        table: {
                            sstable: { name: "product_filter", col: "id"}
                        },
                        checklist: {
							category_id: { rtable: "product_filter_category", rcol: "filter_id" }
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
                            filter: 		{ type: "textbox", 	title: words["filter"], 	required: 1, maxlength: 64 },
                            title_en: 		{ type: "textbox", 	title: words["title.en"], 	required: 1, maxlength: 64 },
                            desc_en: 		{ type: "textarea", title: words["desc.en"], 	required: 0, maxlength: 256 },
                            title_cn: 		{ type: "textbox", 	title: words["title.cn"], 	required: 1, maxlength: 64 },
                            desc_cn: 		{ type: "textarea", title: words["desc.cn"], 	required: 0, maxlength: 256 },
                            plist: 			{ type: "textbox",	title: words["public.list"],required: 0, maxlength: 256 },
                            pview: 			{ type: "textbox",	title: words["public.view"],required: 0, maxlength: 256 },
                            pedit: 			{ type: "textbox",	title: words["public.edit"],required: 0, maxlength: 256 },
                            ulist: 			{ type: "textbox",	title: words["user.list"],	required: 0, maxlength: 256 },
                            uview: 			{ type: "textbox",	title: words["user.view"],	required: 0, maxlength: 256 },
                            uedit: 			{ type: "textbox",	title: words["user.edit"],	required: 0, maxlength: 256 },
                            orderno: 		{ type: "textbox", 	title: words["orderno"], 	required: 0, pattern:"number", maxlength: 11 },
                            status: 		{ type: "bool", 	title: words["status"] },
							category_id:	{ type: "treemulti",title: words["category"],  	required: 1 },
                            created_time: 	{ type: "intdate",	title: words["created_time"] },
                            last_updated: 	{ type: "intdate",	title: words["last_updated"] }
                        },
                        vals: {
                        }
                    }
                }; // end form

                wmliuFormService.setButtonClick("cateFilter_form", function (action, vobj) {
                    wmliuListService.select["categroy_list"]();
                }, "add");
		
                var evt_callback = {
                    success: function (action, obj) {
                        switch (action) {
                            case "new":
                                wmliuListService.load["categroy_list"]({ pid: obj.schema.idvals.sid });
							    break;
                            case "update":
                                wmliuListService.load["categroy_list"]();
                                break;
                            case "delete":
                                wmliuListService.load["categroy_list"]();
                                break;
                        }
                    }
                }
                wmliuFormService.setCallBack("cateFilter_form", evt_callback, "save");
		
				
                $scope.cateFilterList = {
                    schema: {
                        table: {
                            pptable: { name: "product_filter", col: "id", val: "" }
                        },
                        cols: [
                                { col: "", 			type: "rowno" },
                                { col: "filter", 	type: "text" },
                                { col: " - ", type: "seperator", on: langCol("title",GLang) },
                                { col: langCol("title",GLang), type: "text" },
                                { col: " ", type: "seperator" },
                                { col: "status", type: "imgvalue", css: "status" },
								{ col: "id", type: "hidden" }
                              ],
                        orderBy: [
                                    { key: "created_time asc", title: words["created_time"] + " ▲" },
                                    { key: "created_time desc", title: words["created_time"] + " ▼" },
                                    { key: "filter asc", 	title: words["filter"] + " ▲" },
                                    { key: "filter desc", 	title: words["filter"] + " ▼" },
                                    { key: langCol("title",GLang) + " asc", 	title: words["title"] + " ▲" },
                                    { key: langCol("title",GLang) + " desc", 	title: words["title"] + " ▼" }
                                 ],

                        desc: 	words["id"] + ": {{id}}\n" + 
								words["filter"]+ ": {{filter}}\n" +
								words["title"]+ ": {{" + langCol("title", GLang) + "}}\n" +
								words["description"]+ ": {{" + langCol("desc", GLang) + "}}\n" ,
								
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
                            pageSize: 10,
                            totalNo: 0
                        }
                    },
                    rows: []
                };

                wmliuListService.setListClick("categroy_list", function (row) {
                    wmliuFormService.load["cateFilter_form"]({ sid: $scope.cateFilterList.schema.idvals.pid });
			    });
				

            });
        </script>
</head>
<body ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "分类组合", "分类组合"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

	<div ng-controller="webAdmin" style="position:relative;">
        <wmliu.form form="cateFilterForm" name="cateFilter_form" loading="0">
		<table style="width:100%">
        	<tr>
            	<td valign="top">
                        <div class="lwhTab9 lwhTab9-mint" style="display:block; width:260px;">
                            <ul>
                                <li class="selected"><?php echo $words["info.category.combine"] ?><s></s></li>
                            </ul>
                            <div style="display:block;">
                                <br />
                                <wmliu.list name="categroy_list" list="cateFilterList" loading="1"></wmliu.list>
                            </div>
                        </div>
                </td>
            	<td valign="top" style="padding-left:20px;" width="100%">
                     <div class="lwhTab9 lwhTab9-sea  lwhTab9-border">
                     	<ul>
                        	<li class="selected"><?php echo $words["settings"] ?><s></s></li>
                        </ul>
                    	<div style="display:block;">
                                    <br />
                                    <table>
                                        <tr>
                                            <td valign="top">
                                                <table>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="filter"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="filter" ></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="title_en"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="title_en"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="desc_en"></form.label>: </td>
                                                        <td><form.textarea 	form="cateFilterForm" col="desc_en"></form.textarea></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="title_cn"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="title_cn"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="desc_cn"></form.label>: </td>
                                                        <td><form.textarea 	form="cateFilterForm" col="desc_cn"></form.textarea></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="plist"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="plist"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="pview"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="pview"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="pedit"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="pedit"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="ulist"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="ulist"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="uview"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="uview"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="uedit"></form.label>: </td>
                                                        <td><form.textbox 	form="cateFilterForm" col="uedit"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="orderno"></form.label></td>
                                                        <td><form.textbox 	form="cateFilterForm" col="orderno" style="width:40px;"></form.textbox></td>
                                                    </tr>
                                                    <tr>
                                                        <td><form.label 	form="cateFilterForm" col="status"></form.label>: </td>
                                                        <td><form.bool 		form="cateFilterForm" col="status"></form.bool></td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <br />
                                                            <form.button 	form="cateFilterForm"></form.button>
                                                            <form.error 	form="cateFilterForm" ww="40%" hh="40%" minww="300px" minhh="200px"></form.error>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td valign="top">
                                                <table>
                                                    <tr>
                                                        <td colspan="2">
                                                            <wmliu.treeviewtitle tree="tree" linkform="cateFilterForm" linkcol="category_id"></wmliu.treeviewtitle>
                                                            <wmliu.treeview name="infoCategory" 
                                                                        single="0" 
                                                                        expandnodes=""
                                                                        selectnodes=""
                                                                        linkform="cateFilterForm" 
                                                                        linkselect ="category_id"
                                                                        parentid="0" 
                                                                        showall="0" 
                                                                        loading="1"
                                                                        tree="tree" 
                                                                        nodes="tree.nodes" 
                                                                        selectmode="">
                                                            </wmliu.treeview>
                                                        </td>
                                                    </tr>
                                                    <tr><td colspan="2"><br /></td></tr>
                                                    <tr>
                                                        <td style="padding-left:20px;"><form.label form="cateFilterForm" col="created_time"></form.label>: </td>
                                                        <td><form.intdate form="cateFilterForm" col="created_time" format=""></form.intdate></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding-left:20px;"><form.label form="cateFilterForm" col="last_updated"></form.label>: </td>
                                                        <td><form.intdate form="cateFilterForm" col="last_updated" format=""></form.intdate></td>
                                                    </tr>
                                                </table>                     
                                            </td>
                                        </tr>
                                    </table>               
                        </div>
                     </div>
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
