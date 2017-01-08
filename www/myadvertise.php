<?php
session_start();
ini_set("display_errors", 0);
include_once("public_a_secure.php");
include_once("public_a_center_auth.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("public_a_center_include.php")?>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.search.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.table.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.table.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.form.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.category.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.category.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

        <script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/plugin/ckeditor_full/ckeditor.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imagevshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imagevshow.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
			var htmlObj_cn = null;
			var htmlObj_en = null;
			var html_loading = false;
			var sc;
			var iupload = null;
			var ipic 	= null;
			$(function(){
				$("#search_category").lwhCategory({ 
					single: 	false,
					highlight:	true,
					click:	function(obj) { 
						if(obj.val) 
							sc.table.schema.filterVals.sstable.class_id = obj.val;
						else 
							sc.table.schema.filterVals.sstable.class_id = $("#class_id_range").val();
					}
					
				});

				$("#content_category").lwhCategory({ 
					single: 	true,
					highlight:	true,
					autohide:	true,
					click:	function(obj) { 
						$("#category_text").html(obj.text);
						sc.contentForm.detail.vals.class_id = obj.val;
                        if (sc.contentForm.detail.head.state == "view") { sc.contentForm.detail.head.state = "update"; sc.$apply(); }
                        if (sc.contentForm.detail.head.state == "add") { sc.contentForm.detail.head.state = "new"; sc.$apply(); }
					}
				});
				
				$("#content_tabber").lwhTab9({border:false});

				
                htmlObj_cn = CKEDITOR.replace('content_area_cn',{});
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj_cn.on('change', function (evt) {
                    //get data: console.log(evt.editor.getData());
                    if (html_loading) {
                        html_loading = false;
                    } else {
                        if (sc.contentForm.detail.head.state == "view") { sc.contentForm.detail.head.state = "update"; sc.$apply(); }
                        if (sc.contentForm.detail.head.state == "add") { sc.contentForm.detail.head.state = "new"; sc.$apply(); }
                    }
                });


                htmlObj_en = CKEDITOR.replace('content_area_en',{});
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj_en.on('change', function (evt) {
                    //get data: console.log(evt.editor.getData());
                    if (html_loading) {
                        html_loading = false;
                    } else {
                        if (sc.contentForm.detail.head.state == "view") { sc.contentForm.detail.head.state = "update"; sc.$apply(); }
                        if (sc.contentForm.detail.head.state == "add") { sc.contentForm.detail.head.state = "new"; sc.$apply(); }
                    }
                });
				
				ipic = new LWH.ImageVShow({
								name:		"content_image_show", 
								filter:		"info_content", 
								mode:		"medium", 
								view:		"tiny", 
								noimg:		0, 
								container:	"#public_imgshow",
								edit:		true, 
								ww:			800, 
								hh:			600, 
								cropww: 	50, 
								crophh:		50, 
								orient:		"hv"
				});
	
	
				iupload = new LWH.AjaxImage({
									lang:		GLang,
									name:		"content_image", 
									filter:		"info_content",
									trigger:	"#upload_photo",
									mode:		"medium",
									view:		"tiny",
									triggerClick: function(obj) {
										//console.log(obj.settings.ref_id);
									},
									after:		function(obj) {
										if(obj.errorCode <= 0 ) {
											ipic.append(obj.data.imgObj);
										}
									}
								});
	
				 iupload.refid(-1);
				 ipic.refid(-1);
				
			});

            var app = angular.module("myApp", ["wmliuTable", "wmliuSearch", "wmliuForm"])
            app.controller("webAdmin", function ($scope, wmliuTableService, wmliuSearchService, wmliuFormService) {
			    /*** table define ***/
				$scope.table = {
                    buttons: {
                        rights: 	GUserRight,
                        head: {
                            wait: 1,
                            icon: [
                                        //{ key: "add", 		title: words["add"], 		desc: words["add"] 		},
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	}
                                  ]
                        },
                        row: {
                            wait: 1,
                            icon: [
                                        { key: "detail", 	title: words["detail"], 	desc: words["detail"] 	},
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	},
                                        { key: "delete", 	title: words["delete"], 	desc: words["delete"] 	}
                                  ]
                        }
                    },
                    schema: {
                        table: {
                            sstable: { name: "info_content", col: "id", val: "" }
                        },
                        checklist: { 
						   class_id: {stable: "info_class", scol:"id", stitle:langCol("title", GLang), sdesc:langCol("desc", GLang) }  
						},
                        cols:
                            [
                                    { col: "", 				type: "rowno", 		title: words["sn"], align: "center", css: "" },
                                    { col: "imgthumb", 		type: "thumb", 		title: words["photo.thumb"], 		width: 50,  css: "", align: "left", valign: "top" },
                                    { col: "class_id", 		type: "vtext", 		title: words["content.class_id"], 	sort: "asc", align: "left", valign: "top", width: 80,   required: 0, maxlength: 256 },
                                    //{ col: "publish_by", 	type: "textbox", 	title: words["publish_by"], 		sort: "asc", align: "left", valign: "top", width: 80,   required: 0, maxlength: 256 },
                                    { col: "title_cn", 		type: "text", 	title: words["title.cn"], 			sort: "asc", align: "left", valign: "top", width: 150,   required: 0, maxlength: 256 },
                                    { col: "title_en", 		type: "text", 	title: words["title.en"], 			sort: "asc", align: "left", valign: "top", width: 150,   required: 0, maxlength: 256 },
                                    //{ col: "desc_en", 		type: "textarea", 	title: words["desc.en"], 		sort: "asc", align: "left", valign: "top", width: 140, 	required: 0, maxlength: 1024 },
                                    //{ col: "desc_cn", 		type: "textarea", 	title: words["desc.cn"], 		sort: "asc", align: "left", valign: "top", width: 140, 	required: 0, maxlength: 1024 },
                                    //{ col: "city", 			type: "textbox", 	title: words["city"], 				sort: "asc", align: "left", valign: "top", width: 80,	required: 0, maxlength: 64 },
                                    { col: "status", 		type: "bool", 		title: words["content.status"], 	sort: "asc", align: "left", valign: "top" },
                                    { col: "created_time", 	type: "intdate", 	title: words["created_time"], 		sort: "desc", valign: "top" },
                                    { col: "", 				type: "icon", 		title: words["action"], align: "left", nowrap: 1 }
                            ]
                    },
                    navi: {
                        head: {
                            lang: 		GLang,
                            action: 	"view",
                            loading: 	0,
							imgsettings: {
								filter: 		"info_content",
								mode:			"medium",
								view:			"tiny",
								single:			false,
								singleImage:	0,     // simgleImage = 1 : sid is imgid ;  singleImage = 0 : sid is refid
								edit:			true,
								tips:			true,
								cropww:			50,
								crophh: 		50
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


                wmliuSearchService.setButtonClick("info_content", function () {
                    wmliuTableService.load["info_content"]();
                }, "search");


                wmliuTableService.setButtonClick("info_content", function (action, valObjs) {
                	$("#table_mode").hide();
					$("#detail_mode").show();
					wmliuFormService.load["content_form"]({ sid: valObjs[0].sid });
					
					ipic.refid(valObjs[0].sid);
				    iupload.refid(valObjs[0].sid);
					
				}, "detail");
				

				/*** FORM Define ***/
                $scope.contentForm = {
                    buttons: {
                        button: [{ key: "save", desc: "Save Record" }, { key: "cancel", desc: "Cancel" }],
                        rights: { "save": 1, "cancel": 1 }
                    },
                    schema:
                    {
                        table: {
                            sstable: { name: "info_content", col: "id" }
                        },
                        checklist: { 
						}
                    },
                    detail: {
                        head: {
                            lang: "cn",
                            wait: 1,
                            loading: 0,

                            state: "none",
                            action: "none",

                            error: 0,
                            errorMessage: ""
                        },
                        cols: {
                            title_en:		{ type: "textbox", 	title: words["title.en"], 		required: 0, 	maxlength: 256 	},
                            desc_en:		{ type: "textarea", title: words["brief.en"], 		required: 0, 	maxlength: 1024 },
                            detail_en:		{ type: "textarea", title: words["detail.en"], 		required: 0, 	nosync: 1 },
                            title_cn:		{ type: "textbox", 	title: words["title.cn"], 		required: 0, 	maxlength: 256 	},
                            desc_cn:		{ type: "textarea", title: words["brief.cn"], 		required: 0, 	maxlength: 1024 },
                            detail_cn:		{ type: "textarea", title: words["detail.cn"], 		required: 0, 	nosync: 1 },
                            
							publish_by: 	{ type: "textbox", 	title: words["publish_by"], 	required: 1,	maxlength: 256 },
							publish_time: 	{ type: "textbox", 	title: words["publish_time"], 	required: 0,	maxlength: 256 },
                            email: 			{ type: "textbox", 	title: words["email"], 			required: 0, 	maxlength: 1024, pattern: "email"},
                            phone: 			{ type: "textbox", 	title: words["phone"], 			required: 0, 	maxlength: 64 },
                            cell: 			{ type: "textbox", 	title: words["cell"], 			required: 0, 	maxlength: 64 },
                            fax: 			{ type: "textbox", 	title: words["fax"], 			required: 0, 	maxlength: 64 },
                            address: 		{ type: "textbox", 	title: words["address"], 		maxlength: 256 },
                            city: 			{ type: "textbox", 	title: words["city"], 			maxlength: 64 },
                            seo_keyword:	{ type: "textbox", 	title: words["seo_keyword"], 	maxlength: 256 },
                            seo_desc: 		{ type: "textarea", title: words["seo_desc"], 		maxlength: 1024 },
                            class_id: 		{ type: "radio",	title: words["content.class_id"], required: 1 },
							status: 		{ type: "bool", 	title: words["content.status"] },
                            orderno: 		{ type: "textbox", 	title: words["orderno"], required: 0, pattern: "number" }
                        },
                        vals: {}
                    }
                };

				// update, new, delete;
                var fevt = {
                    before: function (action, obj) {
                        obj.detail.vals.detail_cn = CKEDITOR.instances["content_area_cn"].getData();
                        obj.detail.vals.detail_en = CKEDITOR.instances["content_area_en"].getData();
                    },
                    success: function(action, obj) {
						switch(action) {
							case "new":
								wmliuTableService.fresh["info_content"]();
								break;
							case "update":
								wmliuTableService.fresh["info_content"]();
								break;
							case "delete":
								html_loading = true;
								CKEDITOR.instances["content_area_cn"].setData("");
								CKEDITOR.instances["content_area_en"].setData("");
								wmliuTableService.fresh["info_content"]();
								break;
						}
						$("#table_mode").show();
						$("#detail_mode").hide();
                    }
                }
                wmliuFormService.setCallBack("content_form", fevt , "save");
				
                wmliuFormService.setCallBack("content_form",
                    {
                        before: function (act, obj) {
	                        html_loading = true;
    	                    CKEDITOR.instances["content_area_cn"].setData("");
    	                    CKEDITOR.instances["content_area_en"].setData("");
                        },
                        success: function (act, obj) {
                            html_loading = true;
                            CKEDITOR.instances["content_area_cn"].setData(obj.detail.vals.detail_cn);
                            CKEDITOR.instances["content_area_en"].setData(obj.detail.vals.detail_en);
							
							$("#content_category").lwhCategory_set(obj.detail.vals.class_id);
                        }
                    }
                  ,["load","fresh"]);
				

                wmliuFormService.setButtonClick("content_form", function (action, formObj) {
                    switch (action) {
                        case "add":
                            $scope.contentForm.detail.vals.detail_cn = "";
							$scope.contentForm.detail.vals.status = true;
							
                            html_loading = true;
                            CKEDITOR.instances["content_area_cn"].setData("");
                            CKEDITOR.instances["content_area_en"].setData("");
                            break;
                        case "cancel":
                            // change twice , so after need to set to true
                            html_loading = true;
                            CKEDITOR.instances["content_area_cn"].setData($scope.contentForm.detail.vals.detail_cn);
                            CKEDITOR.instances["content_area_en"].setData($scope.contentForm.detail.vals.detail_en);
                            html_loading = true;  // important : prevent change twice

							$("#table_mode").show();
							$("#detail_mode").hide();
                            break;
                    }  // switch
                
				}, ["cancel", "add"]); // button click


				sc = $scope;
            });

			function exit() {
                	$("#table_mode").show();
					$("#detail_mode").hide();
			}
        </script>
</head>
<body class="mycenter" ng-app="myApp"  ng-controller="webAdmin">
<?php 
	require("public_a_center_header.php");
	require("public_a_cetner_menu.php");
	LANG::hit("Public", "我的广告", "我的广告"." :".$public_user["user_name"]);
?>

<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

    <div id="table_mode">
		<table width="100%">
        	<tr>
            	<td valign="top" width="200px" style="width:200px;">
					<?php include_once("tpl_user_menu_single.php")?>
                    <br />
                    <?php include_once("tpl_user_profile.php")?>
                </td>

            	<td valign="top" style="padding-left:20px;">
                      <search.form table="table">
                      <table cellpadding="2" cellspacing="0">
                          <tr>
                              <td colspan="8">
                                <?php
                                    /*** Category *********************************************************/
                                    $cateFilter_pid 	= 2;
                                    $cateFilter_title 	= $db->getVal("info_filter",LANG::langCol("title",$GLang), $cateFilter_pid);
                                
                                    $cateFilter = array();
                                    $cateFilter["table"]["pptable"]["name"] = "info_filter";  
                                    $cateFilter["table"]["pptable"]["col"] 	= "id";  
                                    $cateFilter["table"]["sstable"]["name"] = "info_filter_category";  
                                    $cateFilter["table"]["sstable"]["col"] 	= "category_id";  
                                    $cateFilter["table"]["sstable"]["pref"] = "filter_id"; 
                                    $cateFilter["idvals"]["pid"] 			= $cateFilter_pid;
                                    $catePidObj								= new FILTERCHECK($db, $cateFilter);
                                    //important to get pid sets
                                    $catePids 								= $catePidObj->result;
                                    $cateSchema 			= array();
                                    $cateSchema["lang"] 	= $GLang;
                                    $cateSchema["id"] 		= "search_category";
                                    $cateSchema["colnum"] 	= 3;
                                    $cateSchema["rownum"] 	= 0;
                                    $cateSchema["table"]["pptable"]["name"] 	= "info_category";
                                    $cateSchema["table"]["pptable"]["col"]		= "id";
                                    $cateSchema["table"]["sstable"]["name"]		= "info_class";
                                    $cateSchema["table"]["sstable"]["col"]		= "id";
                                    $cateSchema["table"]["sstable"]["pref"]		= "ref_id";
                                    $cateSchema["idvals"]["pid"]				= $catePids;
                                    $cateSchema["idvals"]["sid"]				= "";
                                    $cateSchema["highlight"]					= true;
                                    $cateSchema["trigger"]						= "";
        
                                    $cateObj = new CATEGORY2($db, $cateSchema);
                                    /*********************************************************************/
                                    
        
                                    $tabFilter 			= array();
                                    $tabFilter["table"]["pptable"]["name"] 	= "info_category";  
                                    $tabFilter["table"]["pptable"]["col"] 	= "id";  
                            
                                    $tabFilter["table"]["sstable"]["name"] 	= "info_class";  
                                    $tabFilter["table"]["sstable"]["col"] 	= "id";  
                                    $tabFilter["table"]["sstable"]["pref"] 	= "ref_id"; 
                                    $tabFilter["idvals"]["pid"] 			= $catePids;
                                    $tabPidObj								= new FILTER($db, $tabFilter);
                                    //important to get pid sets
                                    $tabPids 								= $tabPidObj->result;
        
                                ?>
                              </td>
                          </tr>  
                          <tr>
                              <td>
							  		<?php echo $words["detail"];?>:
                              		<search.textbox style="width:120px;" table="table" name="sstable" search="detail" cols="title_en,title_cn,desc_en,desc_cn,detail_en,detail_cn" datatype="string" compare="%"></search.textbox>
                              </td>
                              <td>
							  		<?php echo $words["created_time"];?>: 
	                                <search.dateintrange table="table" name="sstable" search="sch_time" cols="created_time" datatype="dateint" compare="in"></search.dateintrange>
                                    <search.button table="table" name="<?php echo $words["search"];?>" action="search" style="margin-left:50px; width:120px;"></search.button>                      
                              </td>
                              <td>
                                    <search.hidden table="table" name="sstable" search="user_id"	datatype="number" compare="=" datavalue="<?php echo $public_user["id"];?>"></search.hidden>
                                    <input type="hidden" id="class_id_range" value="<?php echo $tabPids;?>" />
                                    <search.hidden table="table" name="sstable" search="class_id" datatype="number" compare="in" datavalue="<?php echo $tabPids;?>"></search.hidden>
                              </td>
                         </tr>
                      </table>
                      </search.form>
                      <wmliu.table name="info_content" table="table" loading="1"></wmliu.table>
                </td>
			</tr>
    </table>	
    
    </div>

    <div id="detail_mode" style="display:none;">
    	<input type="button" class="lwhButton lwhButton-navi" onclick="exit()" value="<?php echo $words["go back"]?>" /><br />
        <br />
		<!-- Content Form -->
        <wmliu.form form="contentForm" name="content_form"  loading="0">
            <table width="100%">
                <tr>
                    <td><form.label form="contentForm" col="publish_by"></form.label></td>
                    <td>
                        <form.textbox form="contentForm"  col="publish_by" class="medium"></form.textbox>
                    </td>
                    <td style="padding-left:20px"><form.label form="contentForm" col="email"></form.label></td>
                    <td>
                        <form.textbox form="contentForm" col="email" class="medium"></form.textbox>
                    </td>
                    <td style="padding-left:20px"><form.label form="contentForm" col="seo_keyword"></form.label></td>
                    <td>
                        <form.textbox form="contentForm" col="seo_keyword"  class="medium"></form.textbox>
                    </td>
                </tr>

                <tr>
                    <td><form.label form="contentForm" col="city"></form.label></td>
                    <td>
                        <form.textbox form="contentForm"  col="city" class="medium"></form.textbox>
                    </td>
                    <td style="padding-left:20px"><form.label form="contentForm" col="phone"></form.label></td>
                    <td>
                        <form.textbox form="contentForm"  col="phone" class="medium"></form.textbox>
                    </td>
                    <td style="padding-left:20px"><form.label form="contentForm" col="seo_desc"></form.label></td>
                    <td>
                        <form.textbox form="contentForm" col="seo_desc"  class="medium"></form.textbox>
                    </td>
	            </tr>
                <tr>
                    <td><form.label form="contentForm" col="address"></form.label></td>
                    <td>
                        <form.textbox form="contentForm"  col="address" class="medium"></form.textbox>
                    </td>
                    <td style="padding-left:20px"><form.label form="contentForm" col="cell"></form.label></td>
                    <td>
                        <form.textbox form="contentForm" col="cell" class="medium"></form.textbox>
                    </td>
                    <td style="padding-left:20px"><form.label form="contentForm" col="status"></form.label></td>
                    <td><form.bool form="contentForm" col="status"></form.bool></td>
                </tr>
                <tr>
                    <td><form.label form="contentForm" col="class_id"></form.label></td>
                    <td colspan="5">
                    	<a id="content_class" class="wmliu-common-icon20 wmliu-common-icon20-search"></a>
  						<span id="category_text" style="font-size:16px; color:blue;"></span>
						<?php
							$cateSchema 			= array();
							$cateSchema["lang"] 	= $GLang;
							$cateSchema["id"] 		= "content_category";
							$cateSchema["colnum"] 	= 3;
							$cateSchema["rownum"] 	= 0;
							$cateSchema["table"]["pptable"]["name"] 	= "info_category";
							$cateSchema["table"]["pptable"]["col"]		= "id";
							$cateSchema["table"]["sstable"]["name"]		= "info_class";
							$cateSchema["table"]["sstable"]["col"]		= "id";
							$cateSchema["table"]["sstable"]["pref"]		= "ref_id";
							$cateSchema["idvals"]["pid"]				= $catePids;
							$cateSchema["idvals"]["sid"]				= "";
							$cateSchema["highlight"]					= true;
							$cateSchema["trigger"]						= "#content_class";
					        $cateObj = new CATEGORY2($db, $cateSchema);
                        ?>
						
					</td>
                </tr>
                <tr>
                    <td colspan="6">
	                    <br />
                        <div id="content_tabber" class="lwhTab9 lwhTab9-salmon">
                            <ul >
                                <li><?php echo $words["lang.cn"]?></li>
                                <li><?php echo $words["lang.en"]?></li>
                                <li><?php echo $words["upload photo"]?></li>
                            </ul>   
                            <div>
                                <form.label form="contentForm" col="title_cn"></form.label><br />
                                <form.textbox form="contentForm"  col="title_cn" style="width:98%;"></form.textbox><br /><br />
                                <form.label form="contentForm" col="desc_cn"></form.label><br />
                                <form.textarea form="contentForm" col="desc_cn" style="width:98%; height: 60px;"></form.textarea><br /><br />
                                <form.label form="contentForm" col="detail_cn"></form.label><br />
                                <textarea id="content_area_cn" style="width:98%; height:500px;"></textarea>
                            </div> 
                            <div>
                                <form.label form="contentForm" col="title_en"></form.label><br />
                                <form.textbox form="contentForm"  col="title_en" style="width:98%;"></form.textbox><br /><br />
                                <form.label form="contentForm" col="desc_en"></form.label><br />
                                <form.textarea form="contentForm" col="desc_en" style="width:98%; height: 60px;"></form.textarea><br /><br />
                                <form.label form="contentForm" col="detail_en"></form.label><br />
                                <textarea id="content_area_en" style="width:98%; height:500px;"></textarea>
                            </div> 
                            <div>
                                <table width="100%">
                                    <tr>
                                        <td align="left">
                                            <a id="upload_photo" class="lwhAjaxImage-btn-upload"><?php echo $words["upload photo"]?></a>
                                            <br />
                                            <span style="font-size:12px; color:#333333;"><?php echo $words["user.photo.upload.tips"]?></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">
                                            <div id="public_imgshow"></div>
                                        </td>
                                    </tr>
                                </table>                     
                            </div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td colspan="6" align="center">
                        <form.button form="contentForm"></form.button>
                        <form.error form="contentForm" ww="40%" hh="40%" minww="300px" minhh="200px"></form.error>
                    </td>
                </tr>
            </table>
        </wmliu.form>
        <br />
        <center>
        	<input type="button" class="lwhButton lwhButton-navi" onclick="exit()" value="<?php echo $words["go back"]?>" />
		</center>
		<!-- end of content form -->        
	</div>
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("public_a_common.php");?>
</body>
</html>
