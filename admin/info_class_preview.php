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
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.option.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.option.css" rel="stylesheet" />

       	<script language="javascript" type="text/javascript">
		$(function(){
			iOption = new LWH.OPTION({
				func: {
					click: function(obj) { },
					before: function(obj) { },
					after: function(obj) { }
				},
				syncObj: {
					textObj: "#showme"
				},
				
				valObj: {
					val: [],
					text: []
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
					pptable: {
						name:"product_category",
						id: "id",
					},
					*/
					mmtable: {
						name:"info_category",
						id:"id",
						pid:"ref_id",
					},
					
					sstable: {
						name:"info_class",
						id:"id",
						mid:"ref_id",
					}
				}
			});
		});
        </script>
</head>
<body>
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "分类预览", "分类预览"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
<div style="font-size:16px;height:16px;line-height:16px;"> 
	<span id="showme" style="color:#ff4400;">&nbsp;</span>
</div>
<br />
<div id="showarea"></div>
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>
