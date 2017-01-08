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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.search.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.table.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.table.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
		$(function(){
		});
		
		var app = angular.module("myApp", ["wmliuTable", "wmliuSearch"]);
		app.controller("webAdmin", function ($scope, wmliuSearchService, wmliuTableService) {
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
                                        { key: "save", 		title: words["save"], 		desc: words["save"] 	},
                                        { key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	},
                                        { key: "delete", 	title: words["delete"], 	desc: words["delete"] 	}
                                  ]
                        }
                    },
                    schema: {
                        table: {
                            sstable: { name: "info_message", col: "id", val: "" }
                        },
                        cols:
                            [
                                    { col: "", 					type: "rowno", 		title: words["sn"], 			align: "center", css: "" },
                                    { 	col: "{{to_name}}\n{{to_email}}\n{{to_phone}}", 			
										type: "mtext", 		title: words["message.to"], 	sort: "asc", 	align: "left", valign: "top", width: 80 },
                                    { col: "content_url", 		type: "link", 		title: words["url"], 			align: "left", 	valign: "top" },
                                    { col: "subject", 			type: "text", 		title: words["subject"], 		sort: "asc", 	align: "left", valign: "top", width: 160 },
                                    { col: "message", 			type: "text", 		title: words["contact.message"], sort: "asc", 	align: "left", valign: "top", width: 300 },
                                    { col: "created_time", 		type: "intdate", 	title: words["date"], 			sort: "desc", 	valign: "top" },
                                    { col: "content_url", 		type: "hidden" },

                                    { col: "to_id", 			type: "hidden" },
                                    { col: "to_name", 			type: "hidden" },
                                    { col: "to_email", 			type: "hidden" },
                                    { col: "to_phone",			type: "hidden" },
                                   
								    { col: "", 					type: "icon", 		title: words["action"], 		align: "left", 	nowrap: 1 }
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
				

                wmliuSearchService.setButtonClick("info_message", function () {
                    wmliuTableService.load["info_message"]();
                }, "search");
				
		});
		
		
        </script>
</head>
<body class="mycenter" ng-app="myApp">
<?php 
	require("public_a_center_header.php");
	require("public_a_cetner_menu.php");
	LANG::hit("Public", "个人信息", "个人信息"." :".$public_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
        <div id="public_form" ng-controller="webAdmin">
		<table width="100%">
        	<tr>
            	<td valign="top" width="200px" style="width:200px;">
					<?php include_once("tpl_user_menu_single.php")?>
                    <br />
                    <?php include_once("tpl_user_profile.php")?>
                </td>
            	<td valign="top" style="padding-left:20px;">
                      <h1 style="margin:0px; padding:0px;"><?php echo $words["my message outbox"];?></h1>
                      <search.form table="table">
                      <table cellpadding="2" cellspacing="0">
                          <tr>
                              <td>
							  		<?php echo $words["detail"];?>:
                              		<search.textbox style="width:120px;" table="table" name="sstable" search="detail" cols="full_name,email,phone,subject,message" datatype="string" compare="%"></search.textbox>
                              </td>
                              <td>
							  		<?php echo $words["created_time"];?>: 
	                                <search.dateintrange table="table" name="sstable" search="sch_time" cols="created_time" datatype="dateint" compare="in"></search.dateintrange>
                                    <search.button table="table" name="<?php echo $words["search"];?>" action="search" style="margin-left:50px; width:120px;"></search.button>                      
                              </td>
                              <td>
                                    <search.hidden table="table" name="sstable" search="from_id"	datatype="number" compare="=" datavalue="<?php echo $public_user["id"];?>"></search.hidden>
                              </td>
                         </tr>
                      </table>
                      </search.form>
	                
                    
                    
                     <div style="width:100%;">
                      	<wmliu.table name="info_message" table="table" loading="1"></wmliu.table>
                	</div>
                </td>
            	<td valign="top" style="padding-left:10px;">
                </td>
        	</tr>
      	</table>        
  		</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("public_a_common.php");?>
</body>
</html>
