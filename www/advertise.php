<?php
session_start();
ini_set("display_errors", 0);
require("public_a_secure.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("public_a_include.php");?>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.option.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.option.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.filter.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.table.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.table.css" rel="stylesheet" />



		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

		<?php
			$cateFilter_pid 	= 2;
			$cateFilter_title 	= $db->getVal("info_filter",LANG::langCol("title",$GLang), $cateFilter_pid);
		?>
        <script language="javascript" type="text/javascript">
			$(function(){
				iFilter = new LWH.FILTER({
					head: {
						lang:		GLang,
						scope: 		"myfilter"
					},
					func: {
						keydown:  	function() {
							iTable.search();
						}
					}
				});

				iOption = new LWH.OPTION({
					func: {
						click: function(obj) {
							iTable.search();
						},
						clear:	function(obj) { 
							iTable.search();
						}
					},
					syncObj: {
						valObj: $("*[scope='myfilter'][coltype='checklist'][name='class_id']")[0],
						textObj: ""
					},
					
					valObj: {
						val: [],
						text: []
					},

					head: {
						lang:		GLang,
						nullable: 	1,
						container: "#category_area",
						header:     1,
						highlight:	1,
						multiple:	1,
						title1:		words["product.category"],
						level2:		4,
						level3: 	3,
						
						btnfind:	0
					},
					
					schema: {
						fftable: {
							name: "info_filter_category",
							fid:  "filter_id",
							vid:  "category_id",
							val:  "2"  
						},
						
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
							mid:"ref_id"
						}
					}
				});
				

				ishow = new LWH.ImageShow({	
											name:	"contentImage", 
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
						view: createViewHTML,
						rows: createRowHTML, 
						imgClick: function( sid ) {
							ishow.refid(sid);
						}
					},
					head: {
						selfObj:	"iTable",
						lang:  		GLang,	
						scope:		"melang",
						container:	"#mytab",
						trigger:	"",
						url:		"",
						
						mode:		"none",
						action: 	"init",
						loading: 	0,
						wait:		1,
						
						orderBY: 	"created_time",
						orderSN: 	"DESC",
						paging:		0,
						pageNo: 	1,
						pageSize: 	20,
						pageTotal:	0,
						totalNo: 	0
					},
					schema: {
						table: {
							id:		"id",
							view: 	"vw_info_content",
							cols: [
								{name: "", 							colname:words["sn"], 			coltype:"rowno"},
								{name: "photo", 					colname:words["photo"], 		coldesc:"",				coltype:"thumb", 	align:"right", valign:"middle", width:60, filter:"info_content", mode:"small", view:"tiny", noimg: 1 },
								{name: langCol("c_title", GLang), 	colname:words["title"], 		coldesc:"",				coltype:"textbox", 	valign:"top", 	sort:"asc",  width:100,	notnull: 1},
								{name: langCol("a_title", GLang), 	colname:words["title"], 		coldesc:"", 			coltype:"textbox",	valign:"top",  	sort:"asc",  width:120, notnull: 1, css:"" },
								{name: langCol("a_desc",  GLang), 	colname:words["description"],	coldesc:"", 			coltype:"textbox",	valign:"top",	width:120, 	sort:"asc",	  notnull: 0},
								{name: "address",					colname:words["address"], 		coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "phone",						colname:words["phone"], 		coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "cell",						colname:words["cell"], 			coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "city",						colname:words["city"], 			coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "publish_by",				colname:words["publish_by"], 	coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "hits",						colname:words["hits"], 			coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "reviews",					colname:words["review"], 		coldesc:"",				coltype:"textbox", 	valign:"top",	width:80,	sort:"asc"},
								{name: "created_time",				colname:words["created_time"], 	coldesc:"",				coltype:"intdatetime", 	valign:"top",	width:80,	sort:"asc"},
								{name: "", 	colname: words["action"], coltype:"icon"}
							]
						},
						checklist: [
						]
					},
					filter: iFilter,
					option: {},
					data: []
				});
				iTable.view();
				
				$("a.lwhTable-cust-item-image").live("click", function(ev){
					ishow.refid($(this).attr("sid"));
				});


			});
			
			function createRowHTML(oHead, oSchema,  rows ) {
				var html = '';
				
				html += '<table border="0" class="lwhTable-cust" width="100%" cellpadding="5">';
				html += '<tr>';
				html += '<td class="lwhTable-cust-header" colspan="2"><?php echo $cateFilter_title;?></td>';
				html += '<td class="lwhTable-cust-header" style="width:120px;">' + words["city"] + '</td>';
				html += '<td class="lwhTable-cust-header" style="width:120px;">' + words["contact person"] + '</td>';
				html += '</tr>';
				
				for(var i = 0; i < rows.length; i++) {
					var row = rows[i];
					html += '<tr class="lwhTable-cust-tr">';
					html += '<td class="lwhTable-cust-td" style="width:100px;" valign="top">';
					if( row.photo.value != "" ) {
						html += '<a class="lwhTable-cust-item lwhTable-cust-item-image" scope="' + oHead.scope + '" sid="' + row.sid + '" title="' + words["click to view image"] + '"><img src="' + row.photo.value + '" width="100" /></a>';					
					}
					html += '</td>';
					html += '<td class="lwhTable-cust-td" valign="top">';
					html += '<a href="advertise_detail.php?sid=' + row.sid + '" target="_blank" class="lwhTable-cust-item  lwhTable-cust-title" scope="' + oHead.scope + '" sid="' + row.sid + '">' + row[ langCol("a_title", GLang)].value + '</a>';
					html += '<br><span class="lwhTable-cust-class">[' + row[langCol("c_title",GLang)].value + ']</span> - <span class="lwhTable-cust-datetime">' + row["created_time"].value.toDateTime() + '</span>';
					html += '<span class="lwhTable-cust-class" style="margin-left:20px;">' + words["hits"] + ': </span> ' + row.hits.value + ' - <span class="lwhTable-cust-class">' + words["review"] + '</span> : ' + row["reviews"].value;
					html += '<br><span class="lwhTable-cust-desc">' + row[langCol("a_desc", GLang)].value + '</span>';
					html += '</td>';
			
					html += '<td class="lwhTable-cust-td" style="width:100px;" valign="top">';
					var address = row["address"].value + (row["address"].value && row["city"].value?"<br>":"") +  row["city"].value; 
					html += address;
					html += '</td>';
			
					html += '<td class="lwhTable-cust-td" style="width:100px;" valign="top">';
					html += row["publish_by"].value;

					var phone = row["cell"].value?row["cell"].value:"";
					phone += (row["phone"].value && phone?"<br>":"") + row["phone"].value;
					if(phone) {
						html += '<br />';
						html += phone;
					}
			
					html += '<br /><br />';
					html += '<span class="lwhTable-cust-datetime">' + row["created_time"].value.toDateTime() + '</span>';
					//html += '<br />';
					//html += '<span class="lwhTable-cust-datetime">' +  cTYPE::ydhms(time() - $row["created_time"]) . LANG::words("ago", $this->schema["navi"]["lang"]) . '</span>';
					html +='</td>';
				
					html += '</tr>';
				}

				html += '</table>';
				return html;
			}
			
			function createViewHTML(oHead, oSchema, rows ) {
			}
			
			function goto() {
				$("form[name=publicsite_postform]").attr("action", "advertise_form.php");
				publicsite_postform.submit();
			}
			function search() {
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
	<div id="category_area"></div>
	<div id="table-filter" style="padding:5px 0px 5px 0px; vertical-align:middle;">
    <input type="hidden" scope="myfilter" coltype="checklist" name="class_id" compare="in"  value="" />
    <a class="lwhButton-search" scope="myfilter"><input type="text" scope="myfilter" coltype="textbox" class="medium" name="scontent" col="a_title_en,a_title_cn,a_desc_en,a_desc_cn,a_detail_en,a_detail_cn,seo_keyword,seo_desc" compare="Like" value="" /></a>

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
