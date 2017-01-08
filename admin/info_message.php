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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.search.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.table.js"></script>
    	<link type="text/css" 			href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.table.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">

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
                                        { key: "detail", 	title: words["detail"], 	desc: words["detail"] 	},
                                        //{ key: "output", 	title: words["output"], 	desc: words["output"] 	},
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
                                    { col: "", 					type: "rowno", 		title: words["sn"], 	align: "center", css: "" },
                                    { col: "group_id", 			type: "text",       title: words["id"], 	sort: "desc", align: "left", valign: "top" },
                                    { col: "ID: {{from_id}}\n{{from_name}}\n{{from_email}}\n{{from_phone}}", 		
										type: "mtext", 		title: words["message.from"], 	sort: "asc", align: "left", valign: "top", width: 80 },

                                    { col: "ID: {{to_id}}\n{{to_name}}\n{{to_email}}\n{{to_phone}}", 			
										type: "mtext", 		title: words["message.to"], 	sort: "asc", align: "left", valign: "top", width: 80 },

                                    { col: "content_url", 		type: "link",       title: words["url"], 	align: "left", valign: "top" },
                                    { col: "ID: {{content_id}}\n{{subject}}", type: "mtext", 		title: words["subject"],	sort: "asc", align: "left", valign: "top", width: 160 },
                                    { col: "message", 			type: "text", 		title: words["contact.message"],sort: "asc", align: "left", valign: "top", width: 300 },
                                    { col: "created_time", 		type: "intdate", 	title: words["date"], 		sort: "desc", valign: "top" },
                                 
									{ col: "subject", 			type: "hidden" },
									{ col: "from_id", 			type: "hidden" },
                                    { col: "from_name",			type: "hidden" },
									{ col: "from_email", 		type: "hidden" },
                                    { col: "from_phone",		type: "hidden" },

                                    { col: "to_id", 			type: "hidden" },
                                    { col: "to_name", 			type: "hidden" },
                                    { col: "to_email", 			type: "hidden" },
                                    { col: "to_phone",			type: "hidden" },

                                    { col: "content_id", 		type: "hidden" },
                                    { col: "content_url", 		type: "hidden" },
                                    { col: "", 					type: "icon", 		title: words["action"], align: "left", nowrap: 1 }
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
				
                wmliuTableService.setButtonClick("info_message", function (action, valObjs) {
					$("#div_message_reply").wrapBoxShow();	

					$("#mgroup_id").val( valObjs[0].group_id );				
					
					$("#mfrom_id").val(0);				
					$("#mfrom_name").val( words["website manager"]);				
					$("#mfrom_email").val( "" );				
					$("#mfrom_phone").val( "" );				
					
					$("#mto_id").val( valObjs[0].from_id?valObjs[0].from_id:0 );				
					$("#mto_name").val( valObjs[0].from_name );				
					$("#mto_email").val( valObjs[0].from_email );				
					$("#mto_phone").val( valObjs[0].from_phone );				


					var subject = words["reply"] + ": " + valObjs[0].subject;  
					$("#msubject").val( subject );				

					$("#mcontent_id").val( valObjs[0].content_id );				
					$("#mcontent_url").val( valObjs[0].content_url );				


					var fromName = valObjs[0].from_name + ( valObjs[0].email?" [" + valObjs[0].email + "]":"");  
					$("#message_to").html( fromName );				
					$("#message_subject").html( subject );				
	
				}, "detail");

                wmliuTableService.setButtonClick("info_message", function (action, valObjs) {
					console.log(valObjs);
				}, "output");

                wmliuSearchService.setButtonClick("info_message", function () {
                    wmliuTableService.load["info_message"]();
                }, "search");
				
		});
		
		function message_reply_ajax() {
			frm_message_reply.action({action:"add"});
		}



		$(function(){
			$("#div_message_reply").lwhWrapBox();

			frm_message_reply = new LWH.FORM({
						lang:		GLang,
						container: 	"#message_reply",
						sstable:	"",
						url:		"func/info_message_reply.php",
					});
			frm_message_reply.setCallback({
				after: function(req) {
					if(req.errorCode <= 0) {
						frm_message_reply.clearAll();
						$("#div_message_reply").wrapBoxHide();
						tool_tips(words["submit success"]);
					}
				}
			});

		});
		
        </script>
</head>
<body class="mycenter" ng-app="myApp">
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "消息管理", "消息管理"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center" ng-controller="webAdmin">
<!------------------------------------------------ Begin of website content --------------------------------------------->
        <div id="public_form">
            <fieldset>
                <legend><?php echo $words["search criteria"]; ?></legend>
                  <search.form table="table">
                  <table cellpadding="2" cellspacing="2">
                      <tr>
                          <td align="right"><?php echo $words["message.from"];?>: </td>
                          <td>
                                <search.textbox style="width:120px;" table="table" name="sstable" search="from_name" datatype="string" compare="%"></search.textbox>
                          </td>
                          <td align="right"><?php echo $words["message.to"];?>: </td>
                          <td>
                                <search.textbox style="width:120px;" table="table" name="sstable" search="to_name" datatype="string" compare="%"></search.textbox>
                          </td>
                          <td align="right"><?php echo $words["detail"];?>: </td>
                          <td>
                                <search.textbox style="width:120px;" table="table" name="sstable" search="detail" cols="subject,message" datatype="string" compare="%"></search.textbox>
                          </td>
                          <td>
                                <?php echo $words["created_time"];?>: 
                                <search.dateintrange table="table" name="sstable" search="sch_time" cols="created_time" datatype="dateint" compare="in"></search.dateintrange>
                          </td>
                     </tr>
                     <tr>
                     	  <td align="right"><?php echo $words["id"];?>: </td>
                          <td>
                                <search.textbox style="width:120px;" table="table" name="sstable" search="group_id" datatype="number" compare="="></search.textbox>
                          </td>
                     	  <td align="right"><?php echo $words["content.id"];?>: </td>
                          <td>
                                <search.textbox style="width:120px;" table="table" name="sstable" search="content_id" datatype="number" compare="="></search.textbox>
                          </td>
                     </tr>
                     <tr>
                     	  <td></td>
                          <td>
                                <search.button table="table" name="<?php echo $words["search"];?>" action="search" style="width:120px;"></search.button>                      
                          </td>
                     </tr>
                  </table>
                  </search.form>
			</fieldset>
  		</div>
        <div style="width:100%;">
			<wmliu.table name="info_message" table="table" loading="1"></wmliu.table>
        </div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>


<div id="div_message_reply" class="lwhWrapBox" style="width:600px;">
	<div class="lwhWrapBox-content">
    	<div id="message_reply" style="padding:10px;">
	        <center style="font-size:24px; color:blue;"><?php echo $words["message.reply"]?></center>
			<span style="font-size:18px; color:blue;"><?php echo $words["message.to"]?> : </span> 
			<span id="message_to" style="font-size:14px; color:#666666;"></span> 
			<br />
			<span style="font-size:18px; color:blue;"><?php echo $words["subject"]?> : </span> 
			<span id="message_subject" style="font-size:14px; color:#666666;"></span> 
			<br />

	        <span style="font-size:18px; color:blue;"><?php echo $words["reply.content"]?></span><br />
			<textarea name="message" colname="<?php echo $words["reply.content"]?>" maxlength="1204" notnull=1 style="width:100%;height:120px;"></textarea>

            
            <input type="hidden" id="msubject" 		name="subject" 		colname="Subject" 		value="" />
            <input type="hidden" id="mcontent_id"   name="content_id" 	colname="Content ID" 	value="" />
            <input type="hidden" id="mcontent_url"  name="content_url" 	colname="Content URL" 	value="" />

            <input type="hidden" id="mfrom_id"   	name="from_id" 		colname="From ID" 		value="" />
            <input type="hidden" id="mfrom_name" 	name="from_name" 	colname="From Name" 	value="" />
            <input type="hidden" id="mfrom_email" 	name="from_email" 	colname="From Email" 	value="" />
            <input type="hidden" id="mfrom_phone" 	name="from_phone" 	colname="From Phone" 	value="" />

            <input type="hidden" id="mto_id"   		name="to_id" 		colname="To ID" 		value="" />
            <input type="hidden" id="mto_name" 		name="to_name" 		colname="To Name" 		value="" />
            <input type="hidden" id="mto_email" 	name="to_email" 	colname="To Email" 		value="" />
            <input type="hidden" id="mto_phone" 	name="to_phone" 	colname="To Phone" 		value="" />
            <input type="hidden" id="mgroup_id" 	name="group_id" 	colname="Group ID" 		value="" />
            
            <br />
            <center><input type="button" onclick="message_reply_ajax()" value="<?php echo $words["send message"]?>" /></center>
        </div>
    </div>
</div>


<?php include_once("website_a_common.php");?>
</body>
</html>
