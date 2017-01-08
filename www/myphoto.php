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

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imagevshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imagevshow.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
		$(function(){
			iupload = new LWH.AjaxImage({
								lang:		GLang,
								name:		"imageupload", 
								filter:		"public_user",
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

				ipic = new LWH.ImageVShow({
								name:		"userImage", 
								filter:		"public_user", 
								mode:		"medium", 
								view:		"tiny", 
								noimg:		0, 
								container:	"#public_imgshow",
								edit:		true, 
								ww:			720, 
								hh:			500, 
								cropww: 	50, 
								crophh:		50, 
								orient:		"hv"
				});
			 iupload.refid(<?php echo $public_user["id"]?>);
			 ipic.refid(<?php echo $public_user["id"]?>);
		});
        </script>
</head>
<body class="mycenter"s>
<?php 
	require("public_a_center_header.php");
	require("public_a_cetner_menu.php");
	LANG::hit("Public", "个人照片", "个人照片"." :".$public_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
        <div id="public_form">
		<table width="100%">
        	<tr>
            	<td valign="top" width="200px" style="width:200px;">
                		<?php include_once("tpl_user_menu_center.php")?>
                </td>
            	<td valign="top" style="padding-left:20px;">
                        <table>
                            <tr>
                                <td>
                                    <span style="font-size:12px; color:#333333;"><?php echo $words["user.photo.upload.tips"]?></span>
									<br /><br />
                                    <a id="upload_photo" class="lwhAjaxImage-btn-upload"><?php echo $words["upload photo"]?></a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div id="public_imgshow" style="min-height:120px;"></div>
                                </td>
                            </tr>
                        </table>                     
                </td>
        	</tr>
      	</table>        

   		</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<br />
<?php include_once("public_a_common.php");?>
</body>
</html>
