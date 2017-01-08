<?php
session_start();
ini_set("display_errors", 0);
require("public_a_secure.php");
$menuKey = "M2";
$backurl = "advertise.php"; 
$filter_id = 2;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("public_a_include.php");?>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.option.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/js/css/light/js.lwh.option.css" rel="stylesheet" />
        <script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/plugin/ckeditor_full/ckeditor.js"></script>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />


        <script language="javascript" type="text/javascript">
			var sc;
			var iupload = null;
			var ipic 	= null;
		
			$(function(){

				iupload = new LWH.AjaxImage({
									lang:		GLang,
									name:		"content_image", 
									filter:		"info_content",
									container:	"#upload_area",
									trigger:	"#upload_photo",
									mode:		"medium",
									view:		"tiny",
									triggerClick: function(obj) {
										//console.log(obj.settings.ref_id);
									},
									before:     function() {
										wait_show();
									},
									after:		function(obj) {
										wait_hide();
										if(obj.errorCode <= 0 ) {
										}
									},
									done:		function(objs) {
										iupload.refid(-1);
										tool_tips(words["save success"]);
										goback();
									}
								});
	
				 iupload.refid(-1);
	

				iForm = new LWH.FORM({
								filter: {
									id : ""
								},
								head: {
									lang:		GLang,
									scope: 		"lwh",
									base:		"info_content"
									//url:		"func/public_contactus_save.php",
								},
								func: {
									after: function( req ) {
										if(req.errorCode <= 0) {
											if( iupload.length() > 0 ) {
												iupload.refid(req.form.filter.id);
												iupload.ajaxUpload();
											} else {
											
											
												iForm.clear();
												iOption.clear();
												iForm.set("filter_id", "<?php echo $filter_id?>");
												iForm.set("user_id", "<?php echo $public_user["id"]?>");
												iForm.set("publish_by", "<?php echo $public_user["anonym"]?>");
												iForm.set("email", "<?php echo $public_user["email"]?>");
												iForm.set("phone", "<?php echo $public_user["phone"]?>");
												iForm.set("cell", "<?php echo $public_user["cell"]?>");
												iForm.set("city", "<?php echo $public_user["city"]?>");
												iForm.set("address", "<?php echo $public_user["address"]?>");
												iForm.set("status", "1");
												
												iupload.refid(-1);
												tool_tips(words["save success"]);
												goback();
												
											}
											
										}
									},
									cancel: function( cols ) {
										iupload.deletes();
										iupload.refid(-1);

										iForm.set("filter_id", "<?php echo $filter_id?>");
										iForm.set("user_id", "<?php echo $public_user["id"]?>");
										iForm.set("publish_by", "<?php echo $public_user["anonym"]?>");
										iForm.set("email", "<?php echo $public_user["email"]?>");
										iForm.set("phone", "<?php echo $public_user["phone"]?>");
										iForm.set("cell", "<?php echo $public_user["cell"]?>");
										iForm.set("city", "<?php echo $public_user["city"]?>");
										iForm.set("address", "<?php echo $public_user["address"]?>");
										iForm.set("status", "1");
									}
								}
						});
						
				iOption = new LWH.OPTION({
					syncObj: {
						valObj: 	$("input[scope='lwh'][name='class_id']")[0],
						textObj: 	$("span.radiotext[scope='lwh']")[0]
					},

					head: {
						lang:		GLang,
						nullable: 	1,
						highlight:	1,
						multiple:	0,
						header:     1,
						autohide:	0,
						
						trigger:	"#content_class",
						container: 	"", //#category-area",
						title1:		"",
						title3:		"",
						level2:		1,
						level3: 	0
					},
					
					schema: {
						/*
						fftable: {
							name: "info_filter_category",
							fid:  "filter_id",
							vid:  "category_id",
							val:  "2"  
						},
						*/
						pptable: {
							name:"",
							id: "",
						},
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

				$("#content_tabber").lwhTab9({border:true});
			});

			function goback() {
				$("form[name=publicsite_postform]").attr( "action", $("#publicsite_backurl").val() );
				publicsite_postform.submit();
			}
			</script>
</head>
<body class="bg1">
<?php 
	require("public_a_header.php");
	require("public_a_menu.php");
	LANG::hit("Public", "主页11", "主页11"." :".$public_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
    <div id="detail_mode" style="display:<?php echo  $public_user["id"]>0?"block":"none";?>">
	 	<input type="button" class="lwhButton lwhButton-h40 lwhButton-navi" onclick="goback()" value="<?php echo $words["go back"]?>" /><br />
        <br />
		<!-- Content Form -->
            <table style="font-size:14px;">
                <tr>
                    <td class="title"><span class="required">*</span> <?php echo $words["publish_by"]?>: </td>
                    <td>
						<input type="hidden" scope="lwh" coltype="hidden" name="filter_id" 	notnull=1  value="<?php echo $filter_id?>" />
						<input type="hidden" scope="lwh" coltype="hidden" name="user_id" 	notnull=0  datatype="number" value="<?php echo $public_user["id"]?>" />
						<input type="text"	 scope="lwh" coltype="textbox" name="publish_by" class="medium" colname="<?php echo $words["publish_by"]?>" maxlength="256" notnull=1  value="<?php echo $public_user["anonym"]?>" />

                    </td>
                    <td class="title space-left"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                    <td>
                        <input type="text" scope="lwh" coltype="textbox" name="email" class="medium"  datatype="email" colname="<?php echo $words["email"]?>" maxlength="1024" notnull=1 need=1  value="<?php echo $public_user["email"]?>" />
                    </td>
                    <td class="title space-left"><?php echo $words["seo_keyword"]?>: </td>
                    <td>
                        <input type="text" scope="lwh" coltype="textbox" name="seo_keyword" class="medium" colname="<?php echo $words["seo_keyword"]?>" maxlength="256" value="" />
                    </td>
                </tr>

                <tr>
                    <td class="title"><?php echo $words["city"]?>: </td>
                    <td>
						<input type="text" scope="lwh" coltype="textbox" name="city" class="medium" colname="<?php echo $words["city"]?>" maxlength="64" value="<?php echo $public_user["city"]?>" />
                    </td>
                    <td class="title space-left"><?php echo $words["phone"]?>: </td>
                    <td>
						<input type="text" scope="lwh" coltype="textbox" name="phone" class="medium" colname="<?php echo $words["phone"]?>" maxlength="64" value="<?php echo $public_user["phone"]?>" />
                    </td>
                    <td class="title space-left"><?php echo $words["seo_desc"]?>: </td>
                    <td>
                        <input type="text" scope="lwh" coltype="textbox" name="seo_desc" class="medium" colname="<?php echo $words["seo_desc"]?>" maxlength="1024" value="" />
                    </td>
	            </tr>
                <tr>
                    <td class="title"><?php echo $words["address"]?>: </td>
                    <td>
						<input type="text" scope="lwh" coltype="textbox" name="address" class="medium" colname="<?php echo $words["address"]?>" maxlength="256" value="<?php echo $public_user["address"]?>" />
                    </td>
                    <td class="title space-left"><?php echo $words["cell"]?>: </td>
                    <td>
						<input type="text" scope="lwh" coltype="textbox" name="cell" class="medium" colname="<?php echo $words["cell"]?>" maxlength="64" value="<?php echo $public_user["cell"]?>" />
                    </td>
                    <td class="title space-left"></td>
                    <td>
                        <input type="hidden" scope="lwh" coltype="hidden" name="status" colname="<?php echo $words["status"]?>" maxlength="1" datatype="number" notnull="1" value="1" />
                    </td>
                </tr>
                <tr>
                    <td class="title"><span class="required">*</span> <?php echo $words["content.class_id"]?>: </td>
                    <td colspan="5">
                    	<input type="button" class="lwhButton lwhButton-h22" id="content_class" value="<?php echo $words["please select"]?>"></a>
						<input type="hidden" scope="lwh" coltype="radiolist" name="class_id" need="1" colname="<?php echo $words["content.class_id"]?>" notnull="1" value="" />
  						<span class="radiotext" scope="lwh" coltype="radiolist" style="font-size:16px; color:blue; vertical-align:middle;"></span>
						<div id="category-area"></div>
                </td>
                </tr>

                <tr><td colspan="6"><br /></td></tr>
                <tr>
                    <td colspan="6">
                        <div id="content_tabber" class="lwhTab9 lwhTab9-mint lwhTab9-border-grey1">
                            <ul >
                                <li><?php echo $words["lang.cn"]?></li>
                                <li><?php echo $words["lang.en"]?></li>
                            </ul>   
                            <div style="padding:5px;">
                                <span class="required">*</span> <?php echo $words["title.cn"]?><br />
								<input type="text" scope="lwh" coltype="textbox" name="title_cn" colname="<?php echo $words["title.cn"]?>" maxlength="256" notnull=1 style="width:98%;" value="" /><br /><br />
                                <?php echo $words["brief.cn"]?><br />
								<textarea scope="lwh" coltype="textbox" name="desc_cn" colname="<?php echo $words["brief.cn"]?>" maxlength="1024" style="width:98%; height: 60px;"></textarea><br /><br />
                                <?php echo $words["detail.cn"]?><br />
                                <textarea scope="lwh" coltype="editor" name="detail_cn" colname="<?php echo $words["detail.cn"]?>" style="width:98%; height:500px;"></textarea>
                            </div> 
                            <div style="padding:5px;">
                                <?php echo $words["title.en"]?><br />
								<input type="text" scope="lwh" coltype="textbox" name="title_en" colname="<?php echo $words["title.en"]?>" maxlength="256" style="width:98%;" value="" /><br /><br />
                                <?php echo $words["brief.en"]?><br />
								<textarea scope="lwh" coltype="textbox" name="desc_en" colname="<?php echo $words["brief.en"]?>" maxlength="1024" style="width:98%; height: 60px;"></textarea><br /><br />
                                <?php echo $words["detail.en"]?><br />
                                <textarea scope="lwh" coltype="editor" name="detail_en" colname="<?php echo $words["detail.en"]?>" style="width:98%; height:500px;"></textarea>
                            </div> 
                        </div>
                    </td>
                </tr>

                <tr><td colspan="6"><br /></td></tr>
                <tr>
                    <td colspan="6">
                        <div id="content_image_upload" class="lwhTab9 lwhTab9-orange">
                            <ul >
                                <li><?php echo $words["upload photo"]?><s></s></li>
                            </ul> 
                        </div>	
                       <!--<a id="upload_photo" class="lwhAjaxImage-btn-upload"><?php echo $words["upload photo"]?></a>-->
                       <div id="upload_area"></div>
                    </td>
				</tr>				

                <tr>
                    <td colspan="6" align="center">
                        <br />
                        <input type="button" scope="lwh" coltype="add" 		class="lwhButton" id="btn_save" 	value="<?php echo $words["save"]?>" />
                        <input type="button" scope="lwh" coltype="cancel" 	class="lwhButton" id="btn_cancel"  	value="<?php echo $words["cancel"]?>" />
                    </td>
                </tr>
            </table>
			<br />
            <center>
      	 	<input type="button" class="lwhButton lwhButton-h40 lwhButton-navi" onclick="goback()" value="<?php echo $words["go back"]?>" />
			</center>
        <!-- end of content form -->        
	</div>
    
<div  style="display:<?php echo  $public_user["id"]<=0?"block":"none";?>">
<?php 
include_once("tpl_user_login.php"); 
?>
</div>
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php require("public_a_common.php");?>
</body>
</html>
