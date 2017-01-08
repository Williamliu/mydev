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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.list.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.list.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.datepicker.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.datepicker.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.accord.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.accord.css" rel="stylesheet" />
       	<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery-cookie.js"></script>	

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.option.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.option.css" rel="stylesheet" />
       	<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/plugin/ckeditor_full/ckeditor.js"></script>	



		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.print.js"></script>

        <script language="javascript" type="text/javascript">
			var iFilter;
			$(function(){
				iCal = new LWH.DATEPICKER({
							head: {
								lang:		GLang,
								scope:		"mycal",
								container: "#mycal",
								//trigger:	"#btn_print",
								//multiple:	0,
								showTime:	1,
								width:		300,
								format:		"M d, Y"
								//curYY: 		2014,
								//curMM:		5
							},
							syncObj: {
								valObj: "#mycalendar",
								textObj: "#caltext",
								timeHH: "select[scope='myscope'][col='youtt.hh']",
								timeMM: "select[scope='myscope'][col='youtt.mm']"
							},
							func: {
								before: function(valObj) {
									iCal.set( $("#mycalendar").val() );
								}
							}
						});
				
				iPrint = new LWH.PRINT({
					before: function( io ) {
					},
					after: function(iobj) {
					}
				});
				
				iFilter = new LWH.FILTER({
					head:	{
						lang:	GLang,
						scope: 	"myfilter"
					},
					func:	{
						keydown:  function() {
							//iFilter.set("user_id", "");
							iTable.search();
						}
					}
				});
				
				iOption = new LWH.OPTION({
					
					func: {
						click: function(obj) { console.log("click"); console.log(obj); },
						before: function(obj) { console.log("before"); console.log(obj); },
						after: function(obj) { console.log("after"); console.log(obj); }
					},
					syncObj: {
						valObj: $("*[scope='myfilter'][name='category_id']")[0],
						textObj: ""
					},
					
					valObj: {
						val: [],
						text: ["aaa", "bbbb", "cccc", "dddd"]
					},

					head: {
						lang:		GLang,
						container:  "#showarea",
						trigger:	"",
						url:		"",
						match:		0,
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


				cOption = new LWH.OPTION({
					
					func: {
						click: function(obj) { console.log("click"); console.log(obj); },
						before: function(obj) { console.log("before"); console.log(obj); },
						after: function(obj) { console.log("after"); console.log(obj); }
					},
					syncObj: {
						valObj: 	"",
						textObj: 	""
					},
					
					valObj: {
					},

					head: {
						lang:		GLang,
						header:     1,
						highlight:	1,
						multiple:	1,
						autohide:   0,
						title3:		words["country"],
						level2:		4,
						level3: 	1,
						btnfind:	1
					},
					
					schema: {
						sstable: {
							name:"website_country",
							id:"id",
							title: langCol("country", GLang)
						}
					}
				});
				
				ishow = new LWH.ImageShow({	
											name:	"productImage", 
											lang:	GLang, 
											filter:	"public_user", 
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
				


				iList = new LWH.LIST({
					func: {
						click: function(obj) {
							iAcc.set(obj);
						}
					},
					head: {
						lang:  		DLang,	
						scope:		"mylist",
						container:	"#mylist",
						trigger:	"", //#btn_print",
			
						header:		1,
						btnall: 	1,
						btnfind:	1,	
						multiple:	1,
						
						action: 	"view",
						loading: 	0,
						wait:		1,
						orderBY: 	"title_en",
						orderSN: 	"ASC"
					},
					schema: {
						table: {
							id:			"id",
							view: 		"product_label",
							pid:		"",
							pval:		"",
							filter:		{ status: 1},
							cols: [
								{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
								{name: "id", 		colname:words["id"], 		coltype:"hidden",		coldesc: 1 },
								{name: "title_en", 	colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	sort:1, search:1, nl2br:1 },
								{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"user_name" },
								{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		sort:1, search:1	},
								{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,				sort:1, search:1 },
								{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1,		sort:1	}
							]
						}
					},
					data: []
				});

				iList.view();



				iAcc = new LWH.ACCORD({
					func: {
						click: function(obj) {
							iList.set(obj);
						}
					},
					head: {
						lang:  		DLang,	
						scope:		"myAcc",
						container:	"#myacc",
						trigger:	"", //#btn_print",
			
						match:		0,
						header:		1,
						btnall: 	1,
						btnfind:	1,	
						multiple:	1,  // checkbox or radio
						single:		0,  // single open node  or multiple open node
						
						action: 	"view",
						loading: 	0,
						wait:		1,
						level:		0 // 1 - pptable;  2 - mmtable
					},
					schema: {
						table: {
							pptable: {
								id:			"id",
								view: 		"product_category",
								cols:		[
									{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
									{name: "title_en",  colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	search:1, nl2br:1 },
									{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"title_en" },
									{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		search:1	},
									{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,		search:1 },
									{name: "", 			colname:" {", 				coltype:"seperator" },
									{name: "", 			colname:words["length"],	coltype:"length",		coldesc: 1 },
									{name: "", 			colname:"人}", 				coltype:"seperator" },
									{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1 }
								],
								orderBY: 	"product_category.title_en ASC",
								filter:	{
									status: 1
								}

							},
							mmtable: {
								id:			"id",
								view: 		"product_class",
								pref:		"ref_id",
								cols:		[
									{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
									{name: "title_en",  colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	search:1, nl2br:1 },
									{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"title_en" },
									{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		search:1	},
									{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,		search:1 },
									{name: "", 			colname:" {", 				coltype:"seperator" },
									{name: "", 			colname:words["length"],	coltype:"length",		coldesc: 1 },
									{name: "", 			colname:"}", 				coltype:"seperator" },
									{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1 }
								],
								orderBY: 	""
							},
							sstable: {
								id:			"id",
								view: 		"product_label",
								mref:		"ref_id",
								fval:		"",
								cols:		[
									{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
									{name: "title_en",  colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	search:1, nl2br:1 },
									{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"title_en" },
									{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		search:1	},
									{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,		search:1 },
									{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1 }
								],
								orderBY: 	"product_label.title_en ASC"
							}
						}
					},
					data: []
				});

				iAcc.view();



				iTable = new LWH.TABLE({
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
						view: function(oHead, oSchema, rows) {
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
					head: {
						selfObj:	"iTable",
						lang:  		GLang,	
						scope:		"mytab",
						container:	"#mytab",
						trigger:	"",
						
						mode:		"none",
						action: 	"init",
						loading: 	0,
						wait:		1,
						
						orderBY: 	"public_user.created_time",
						orderSN: 	"DESC",
						paging:		1,
						pageNo: 	1,
						pageSize: 	20,
						pageTotal:	0,
						totalNo: 	0
					},
					schema: {
						table: {
							mode:		"all",  // all,  match
							id:			"id",
							view: 		"",
							base:   	"public_user",
							reftable:	"public_user_test",
							rid:		"user_id",
							refcols:	["comment", "single", "country_id"],
							pid:		"event_id",
							pval:		"2",

							cols: [
								{name: "", 			colname:words["sn"], 		coltype:"rowno"},
								{name: "", 			colname:words["choose"], 	coldesc:"", 				coltype:"ridbutton",	align:"center",valign:"middle",  width:60, hide:1, notnull: 0, css:"", nowrap:0, nl2br:1 },
								{name: "photo", 	colname:words["photo"], 	coldesc:"",					coltype:"thumb",		align:"right", valign:"middle", width:60, filter:"public_user", mode:"small", view:"tiny", noimg: 0 },
								{name: "user_name", colname:words["user_name"], coldesc:"", 				coltype:"textbox",		defval:"good morning",	valign:"top",  	sort:"asc",  width:120, notnull: 0, css:"", nowrap:0, nl2br:1 },
								{name: "email", 	colname:words["email"],		coldesc:"", 				coltype:"textbox",		valign:"top",	width:200, sort:"desc",	   	datatype:"email", need:1,	notnull: 1},
								{name: "comment", 	colname:words["comment"],	coldesc:"", 				coltype:"textbox",		valign:"top",	width:200, sort:"desc",	   	datatype:"char", need:1,	notnull: 1},
								{name: "single", 	colname:words["status"],	coldesc:"", 				coltype:"checkbutton",	align:"center", valign:"middle",	width:32, sort:"desc",	   	datatype:"char", need:1,	notnull: 0},
								{name: "country_id",colname:words["country"],	coldesc:"", 				coltype:"checklist",	valign:"top",	width:60, sort:"desc",	   	datatype:"char", need:1,	notnull: 1,  colnum:1},
								{name: "", 			colname: words["action"], 	coltype:"icon", 			width:20}
							]
						},
						checklist: [
							{ col: "country_id", rtable:"public_user_country", rcol:"user_id", stable:"website_country", scol:"id", stitle: langCol("country", GLang) }
						]
					},
					filter: iFilter,
					option: {
						country_id: cOption
					},
					data: []
				});
				
				iTable.view();

				$("a.lwhCommon-checkButton").unbind("click").bind("click", function(ev) {
					if( $(this).hasClass("lwhCommon-checkButton-checked") ) {
						$(this).removeClass("lwhCommon-checkButton-checked");
						$("input", this).val(0);
					} else {
						$(this).addClass("lwhCommon-checkButton-checked");
						$("input", this).val(1);
					}
					console.log("checked: " + $("input", this).val() );
				});

				$("select[scope='myscope'][name='youtt']").bind("change",function(){
					$(this).trigger("datepickerEvent");
				});

			});
			function showObj(obj, obj1) {
				console.log("showObj");
				console.log(obj);
				console.log(obj1);
			}
			
			function mylist() {
				iTable.find();
			}
			function search() {
				//iPrint.show();
				//iTable.defval("category_id", "2,4");
				//iTable.defval("desc_cn", "3");
				//iTable.defval("status", "1");
				//iTable.defval("filter", "William Liu");
				iTable.pval(5);
				iTable.search();
			}
			function searchall() {
				iTable.pval(2);
				iFilter.clear();
				iTable.search();
			}
			
			function setdata() {
				//iList.set( {val:[2,4,6,8,13], text:[] });
				var html = [
'<div style="display:block; position:relative; border:0px solid blue; width:200px; height:315px; text-align:center;"><img src="https://www.putihome.ca/ptmis/ajax/logo/id_card_1.jpg" style="border:1px solid #eeeeee; left:0px; position:absolute; top:0px; width:200px" />',
'<table border="0" style="left:5px; position:absolute; top:130px">',
'<tbody>',
'<tr>',
'<td><img src="https://www.putihome.ca/ptmis/ajax/lwhUpload_image.php?ts=34934389342&amp;size=large&amp;img_id=11590" style="border:1px solid #cccccc; width:90px" /></td>',
'<td>',
'<div style="display:block; color:#ffffff; width:100px; font-size:32px; text-align:center; font-weight:bold; font-family:隶书; serif;">&nbsp;</div>',
'</td>',
'</tr>',
'</tbody>',
'</table>',

'<div style="display:block; position:relative; top:0px; left:0px; z-index:9;">',
'<div style="display:block; position:absolute; color:#ffffff; top:256px; height:20px; line-height:20px; font-size:20px; text-align:center; font-weight:bold; width:200px; font-family:隶书;">游晓玲</div>',
'</div>',

'<div style="display:block; position:absolute; color: #ffffff; top:290px; right:10px; font-size:14px; font-weight:bold; font-family:隶书;">11590</div>',
'</div>'
].join('');

				//iPrint.print(html);
			}
			function getdata() {
				//iCal.clear();
				//iCal.set(["2016-5-8", "2016-05-20"]);
				iCal.setMin("2016-5-15");
				iCal.setMax("2016-5-23");
				//alert(iPrint.get());
			}
			
			function retdata() {
				//iCal.clear();
				//iCal.set(["2016-5-8", "2016-05-20"]);
				iCal.setMin("2934");
				iCal.setMax("2016-5-23");
				//alert(iPrint.get());
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
  	<input type="text" id="mycalendar" value="2016-ad-27,2016-05-29" /> <span id="caltext"></span>
 	<?php echo HTML::time($db, $GLang, array("scope"=>"myscope", "name"=>"youtt"), "8:30"); ?>
    <input type="text" id="ttime" value="5:35" />
   <div id="mycal" style="width:400px;"></div>
   <input id="btn_print" type="button" onclick="setdata()" value="PRINT"  />
   <input type="button" onclick="getdata()" value="GET"  />
   <input type="button" onclick="retdata()" value="RESET"  />
    <a class="lwhCommon-checkButton lwhCommon-checkButton-checked">
    	<input type="hidden" value="" />
    </a>
 	<table>
    	<tr>
        	<td valign="top"><div id="mylist"></div></td>
        	<td valign="top"><div id="myacc"></div></td>
		</tr>
   	</table>            
    <div id="showarea"></div>
    <br />
	<div id="table-filter" style="padding:5px 0px 5px 0px; vertical-align:middle;">
    <input type="hidden" scope="myfilter" coltype="checklist"  name="category_id" rtable="info_filter_category" rcol="filter_id" col="id"  need="0"  value="" />
   	<a class="lwhButton-search" scope="myfilter">
    	<input type="text" scope="myfilter" coltype="textbox" name="scontent" colname="<?php echo $words["search"]?>" col="comment,user_name" class="medium" need="0" value="" /><span class="lwhButton-remove" scope="myfilter"></span>
    </a>
    
	<input type="button" class="lwhButton lwhButton-h40 lwhButton-navi" onclick="search()" value="<?php echo $words["search"]?>" />
	<input type="button" class="lwhButton lwhButton-h40 lwhButton-navi" onclick="searchall()" style="margin-left:50px;" value="<?php echo $words["advertise.all"]?>" />
	<input type="button" class="lwhButton lwhButton-h40 lwhButton-blue" onclick="mylist();" style="float:right;" value="<?php echo $words["publish.free.advert"]?>" />
    </div>
	<div id="mytab"></div>
    <br />
	
	
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php require("public_a_common.php");?>
</body>
</html>
