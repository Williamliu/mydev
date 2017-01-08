<?php
session_start();
ini_set("display_errors", 0);
require("public_a_secure.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("public_a_include.php");?>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.filter.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.table.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.table.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.option.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.option.css" rel="stylesheet" />
        <script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/plugin/ckeditor_full/ckeditor.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.category.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.category.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
			var iFilter;
			$(function(){
				iFilter = new LWH.FILTER({
					lang:	GLang,
					scope: 	"myfilter",
					keydown:  function() {
						iTable.search();
					}
				});
				
				iOption = new LWH.OPTION({
					
					func: {
						click: function(obj) { console.log("click"); console.log(obj); },
						before: function(obj) { console.log("before"); console.log(obj); },
						after: function(obj) { console.log("after"); console.log(obj); }
					},
					syncObj: {
						valObj: $("#me1")[0],
						textObj: $("#me2")[0]
					},
					
					valObj: {
						val: [1,3,5,7],
						text: ["aaa", "bbbb", "cccc", "dddd"]
					},

					head: {
						lang:		GLang,
						nullable: 	1,
						container: "#showarea",
						header:     1,
						highlight:	1,
						multiple:	1,
						title1:		words["product.category"],
						level2:		4,
						level3: 	1
					},
					
					schema: {
						/*						
						fftable: {
							name: "product_filter_category",
							fid:  "filter_id",
							vid:  "category_id",
							val:  "2"  
						},
						*/
							
						pptable: {
							name:"product_category",
							id: "id",
						},
					
						mmtable: {
							name:"product_class",
							id:"id",
							pid:"ref_id",
						},
						
						sstable: {
							name:"product_label",
							id:"id",
							mid:"ref_id",
						}
					}
				});

				iOption1 = new LWH.OPTION({
					
					func: {
						click: function(obj) { console.log("click"); console.log(obj); },
						before: function(obj) { console.log("before"); console.log(obj); },
						after: function(obj) { console.log("after"); console.log(obj); }
					},
					syncObj: {
						valObj: $("#me1")[0],
						textObj: $("#me2")[0]
					},
					
					valObj: {
						val: [1,3,5,7],
						text: ["aaa", "bbbb", "cccc", "dddd"]
					},

					head: {
						lang:		GLang,
						nullable: 	1,
						container: "",
						header:     1,
						highlight:	1,
						multiple:	1,
						title1:		words["product.category"],
						level2:		4,
						level3: 	1
					},
					
					schema: {
						/*						
						fftable: {
							name: "product_filter_category",
							fid:  "filter_id",
							vid:  "category_id",
							val:  "2"  
						},
						*/
						/*
						pptable: {
							name:"product_category",
							id: "id",
						},
						*/
						mmtable: {
							name:"info_category",
							id:"id",
							pid:"",
						},
						
						sstable: {
							name:"info_class",
							id:"id",
							mid:"ref_id",
						}
					}
				});
				
				ishow = new LWH.ImageShow({	
											name:	"productImage", 
											lang:	GLang, 
											filter:	"info_content", 
											mode:	"medium", 
											view:	"tiny", 
											single:	false, 
											tips:	true, 
											noimg:	0, 
											edit:	false,  
											ww:		100, 
											hh:		100, 
											imgww:	600,	
											imghh:	400, 
											crop:	false,
											cropww: 100, 
											crophh:0, 
											orient:"hv", 
											callBack: function(imgObj) {
											}
										});
				



				iTable = new LWH.TABLE({
					option: {
						category_id: 	iOption1,
						desc_cn: 		iOption1
					},
					buttons: {
						rights:	GUserRight,
                        head: {
                            icon: [
                                        { key: "add", 		title: words["add"], 		desc: words["add"] 		},
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	}
                                  ]
                        },
                        row: {
                            icon: [
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	},
                                        { key: "delete", 	title: words["delete"], 	desc: words["delete"] 	}
                                  ]
                        }
					},
					html: {
						view: function( sch, rows) {
							var html = '';
							for(var i = 0; i < rows.length; i++) {
								html += '<div>' + i + ": sid:" + rows[i].sid + "<br>title:" + rows[i].title_cn.value + '</div>';
							}
							return html;
						},
						imgClick: function( sid ) {
							ishow.refid(sid);
						}
					},
					schema: {
						selfObj:	"iTable",
						container:  "#mytab",
						gid:		"melang",
						lang:  		GLang,	
						table: {
							id:		"id",
							view: 	"info_filter",
							base:   ""
						},
						checklist: [
							{col:	"status", 		rtable:"info_filter_category", rcol:"filter_id", stable: "info_class", scol: "id", stitle:langCol("title",GLang), sdesc:langCol("desc", GLang) },
							{col: 	"desc_cn", 		rtable:"info_filter_category", rcol:"filter_id", stable: "info_class", scol: "id", stitle:langCol("title",GLang), sdesc:langCol("desc", GLang) },
							{col:	"category_id",	rtable:"info_filter_category", rcol:"filter_id", stable: "info_class", scol: "id", stitle:langCol("title",GLang), sdesc:langCol("desc", GLang) }
						],
						cols: [
							{name: "", 			colname:words["sn"], 		coltype:"rowno"},
							{name: "photo", 	colname:words["photo"], 	coldesc:"",					coltype:"thumb", 	align:"right", valign:"middle", width:60, filter:"info_content", mode:"small", view:"tiny", noimg: 0 },
							{name: "filter", 	colname:words["filter"], 	coldesc:"Your Phone",		coltype:"textbox", 	defval:"hello world",  valign:"top", 	sort:"asc",  width:100,	notnull: 1},
							{name: "title_en", 	colname:words["title.en"], 	coldesc:"", 				coltype:"textarea",	defval:"good morning",	valign:"top",  	sort:"asc",  width:120, notnull: 1, css:"", nowrap:0, nl2br:1 },
							{name: "title_cn", 	colname:words["title.cn"],	coldesc:"", 				coltype:"textbox",	valign:"top",	width:200, sort:"desc",	   	datatype:"char", 	notnull: 0},
							{name: "category_id",colname: words["category"], coldesc: words["status"],	coltype:"checklist", defval:"",  width:80,	colnum: 1, colsn: 1,valign:"top", 	datatype:"number", 	notnull: 1},
							{name: "desc_cn",	colname: words["category"], coldesc: words["status"],	coltype:"radio",defval: 0,  width:80,	colnum: 1, colsn: 1,valign:"top", 		datatype:"number", 	notnull: 1},
							{name: "status",	colname: words["status"], 	coldesc: words["status"],	coltype:"bool",  	hide:1, 	colnum:1, colsn:1},
							{name: "plist",		colname: words["fax"], 		coldesc: words["fax"],		coltype:"datetime", sort:"desc", valign:"top", notnull: 1},
							{name: "birth",		colname: words["birth"], 	coldesc: words["birth"], 	coltype:"ymd",  	datatype:"date", nowrap:1, valign:"top", notnull: 1},
							//{name: "birth_time",colname: words["birth"],	 coldesc: words["birth"], 	coltype:"text",  	datatype:"time", nowrap:1, valign:"top", notnull: 1},
							{name: "", 			colname: words["action"], coltype:"icon"}
						]
					},
					navi: {
						mode:		"none",
						action: 	"init",
						loading: 	0,
						orderBY: 	"created_time",
						orderSN: 	"DESC",
						pageNo: 	1,
						pageSize: 	20,
						pageTotal:	0,
						totalNo: 	0
					},
					filter: iFilter,
					data: [
						{general: {sid: 2, state: 1, error: 0, errorMessage:""} , first: {state:0, error:0, errorMessage:"", value:100}, last:{state:1, value:200 } }
					]
				});
				
				iTable.view();


				console.log(GUserRight);
			});
			function showObj(obj, obj1) {
				console.log("showObj");
				console.log(obj);
				console.log(obj1);
			}
			
			function goto() {
				$("form[name=publicsite_postform]").attr("action", "advertise_form.php");
				publicsite_postform.submit();
			}
			function search() {
				//iTable.defval("category_id", "2,4");
				//iTable.defval("desc_cn", "3");
				//iTable.defval("status", "1");
				//iTable.defval("filter", "William Liu");
				iTable.search();
			}
			function searchall() {
				iFilter.clear();
				iTable.search();
			}
			</script>
</head>
<body class="bg1">
<?php 
	require("public_a_header.php");
	require("public_a_menu.php");
	LANG::hit("Public", "广告列表", "广告列表"." :".$public_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
    <div id="showarea"></div>
    <br />
	<div id="table-filter" style="padding:5px 0px 5px 0px; vertical-align:middle;">
    <input type="hidden" scope="myfilter" coltype="checklist"   name="category_id" col="id" rtable="info_filter_category" rcol="filter_id" need="0" value="" />
    <a class="lwhButton-search"><input type="text" scope="myfilter" coltype="textbox" name="scontent" colname="<?php echo $words["search"]?>" datatype="email" col="title_en,title_cn,desc_en,desc_cn" class="medium" need="0" value="" /></a>
    
	<input type="button" class="lwhButton lwhButton-h40 lwhButton-navi" onclick="search()" value="<?php echo $words["search"]?>" />
	<input type="button" class="lwhButton lwhButton-h40 lwhButton-navi" onclick="searchall()" style="margin-left:50px;" value="<?php echo $words["advertise.all"]?>" />
	<input type="button" class="lwhButton lwhButton-h40 lwhButton-blue" onclick="goto();" style="float:right;" value="<?php echo $words["publish.free.advert"]?>" />
    </div>
	<div id="mytab"></div>
    <br />
	
	
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php require("public_a_common.php");?>
</body>
</html>
