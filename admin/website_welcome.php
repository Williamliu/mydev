<?php
session_start();
ini_set("display_errors", 0);
include_once("website_a_secure.php");

/***  if user has token without access right ***/ 
/***  if user token has expiry,  goto login page ***/
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");
if( $_REQUEST["adminsite_session"] != "" ) $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] 	= $_REQUEST["adminsite_session"];

if( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] == "" ) {
	header("Location: " . $CFG["admin_login_webpage"]);
} else {
	$sess_db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
	$sess_id = $sess_db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] );
	$sess_db->query("UPDATE website_admin_session SET deleted = 1 WHERE deleted <> 1 AND last_updated < '" . (time() - $CFG["admin_session_timeout"]) . "'");
	$result_sess = $sess_db->query("SELECT admin_id, session_id FROM website_admin_session WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");
	if( $sess_db->row_nums($result_sess) > 0 )  {
		$row_sess = $sess_db->fetch($result_sess);
		$sess_db->query("UPDATE website_admin_session SET last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");
		$admin_id = $row_sess["admin_id"];
		
		$result_user = $sess_db->query("SELECT * FROM website_admin WHERE deleted <> 1 AND status = 1 AND id = '" . $admin_id . "'");
		if( $sess_db->row_nums($result_user) <= 0 )  {
			header("Location: " . $CFG["admin_login_webpage"]);
		}
	} else {
		header("Location: " . $CFG["admin_login_webpage"]);
	}
}
/******************************************************/

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("website_a_include.php")?>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imagebox.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imagebox.css" rel="stylesheet" />
      
        <script language="javascript" type="text/javascript">
		var lwh = null;
		var pass = null;
		$(function(){
			$("#lwhDivBox-myaccount").lwhDivBox();

			lwh = new LWH.FORM({
						lang:		GLang,
						container: 	"#admin_form",
						sstable:	"website_admin",
						url:		"func/website_welcome_save.php",
						sid:		"<?php echo $admin_user["id"]?>"
					});
			lwh.setCallback({
				after: function(req) {
					if(req.errorCode == 0 && req.formData.schema.action=="save" ) {
						$("[name='password']").val("").removeClass("data-invalid");
						$("[name='password_confirm']").val("").removeClass("data-invalid");
						tool_tips(words["save success"]);
					}
				}
			});

			pass = new LWH.FORM({
						lang:		GLang,
						container: 	"#admin_password",
						sstable:	"",
						url:		"func/website_welcome_password.php",
						sid:		"<?php echo $admin_user["id"]?>"
					});
			pass.setCallback({
				after: function(req) {
					if(req.errorCode == 0 ) {
						$("#lwhDivBox-myaccount").divBoxHide();
						tool_tips(words["password.reset"]);
					}
				}
			});
		
			iupload = new LWH.AjaxImage({
								lang:		GLang,
								name:		"imageupload", 
								filter:		"website_admin",
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

			ipic = new LWH.ImageBox({
								lang:		GLang,
								name:		"productImage", 
								filter:		"website_admin", 
								mode:		"medium", 
								view:		"tiny", 
								noimg:		0, 
								container:	"#amdin_imgshow",
								edit:true, 
								ww:			120, 
								hh:			160, 
								imgww:		360, 
								imghh:		480, 
								cropww: 	36, 
								crophh:		48,
								orient:		"hv"
					});
					
			
			 iupload.refid(<?php echo $admin_user["id"]?>);
			 ipic.refid(<?php echo $admin_user["id"]?>);
		
		
			lwh.action({action:"load"});


		});
		
		function save_ajax() {
			lwh.action({action:"save"});
		}
		function cancel_ajax() {
			lwh.action({action:"load"});
		}
		function reset_pass() {
			$("[name='password']").val("").removeClass("data-invalid");
			$("[name='password_confirm']").val("").removeClass("data-invalid");
			$("#lwhDivBox-myaccount").divBoxShow();
		}
		
		function save_pass() {
			pass.action({action:"save"});
		}
		</script>
</head>
<body>
<?php 
	require("website_a_header.php");
	require("website_a_menu.php");
	LANG::hit("Admin", "欢迎页面", "欢迎页面"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
		<h1><?php echo $words["my account"]?></h1>
        <span style="color:red;font-size:16px;">
        <?php echo $words["account.access.deny"];?>
        </span>
        <br />
        <div id="admin_form">
		<table>
        	<tr>
            	<td valign="top">
                                <table>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["email"]?>: </td>
                                        <td><input class="medium" type="text" name="email" datatype="email" colname="<?php echo $words["email"]?>" maxlength="256" notnull=1  value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                        <td><input class="medium" type="text" name="user_name" colname="<?php echo $words["user_name"]?>" maxlength="64" notnull=1  value="" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center"><input type="button" id="btn_reset" onclick="reset_pass()" value="<?php echo $words["reset password"]?>" /></td>
                                    </tr>
                                    
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td valign="top"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                                        <td><input class="medium" type="text" name="full_name" colname="<?php echo $words["full_name"]?>" maxlength="256" notnull=1 value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["phone"]?>: </td>
                                        <td><input class="medium" type="text" name="phone" colname="<?php echo $words["phone"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["cell"]?>: </td>
                                        <td><input class="medium" type="text" name="cell" colname="<?php echo $words["cell"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["address"]?>: </td>
                                        <td><input class="medium" type="text" name="address" colname="<?php echo $words["address"]?>" maxlength="256" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["city"]?>: </td>
                                        <td><input class="medium" type="text" name="city" colname="<?php echo $words["city"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["state"]?>: </td>
                                        <td><input class="medium" type="text" name="state" colname="<?php echo $words["state"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["country"]?>: </td>
                                        <td>
											<?php 
                                                
                                                $colObj = array();
                                                $colObj["name"] 	= "country";
                                                $colObj["col"]  	= "country";
                                                $colObj["colname"] 	= $words["country"];
                                                $colObj["table"] 	= "sstable";
                                                
                                                $colObj["stable"] 	= "website_country";
                                                $colObj["scol"] 	= "id";
                                                $colObj["stitle"] 	= LANG::langCol("country", $GLang);
                                                $colObj["sdesc"] 	= "";
                                                
                                                $colObj["sn"] 		= 0;
                                                $colObj["notnull"] 	= 1;
                                                $colObj["width"] 	= "120px;";
                                                
                                                echo HTML::select($db, $GLang, $colObj);
                                                
                                            ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["postal"]?>: </td>
                                        <td><input class="short" type="text" name="postal" colname="<?php echo $words["postal"]?>" maxlength="16" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <br />
                                            <input type="button" id="btn_save" onclick="save_ajax()" value="<?php echo $words["save"]?>" />
                                            <input type="button" id="btn_cancel" onclick="cancel_ajax()" value="<?php echo $words["cancel"]?>" />
                                        </td>
                                    </tr>
                                </table>
                </td>
            	<td valign="top" style="padding-left:20px;">
                                <table>
                                    <tr>
                                        <td colspan="2" align="left">
                                        	<a id="upload_photo" style="font-size:18px; color:blue; text-decoration:underline;"><?php echo $words["upload photo"]?></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="left">
                                        	<div id="amdin_imgshow" style="min-height:120px;"></div>
                                        </td>
	                                </tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td valign="top"><?php echo $words["right.group"]?>: </td>
                                        <td>
                                        	<span name="group_id" coltype="readcheck" rtable="website_admin_group" rcol="admin_id"  stable="website_group" colnum=1	scol="id" stitle="<?php echo LANG::langCol("title", $GLang);?>" style="color:blue;"></span>
										</td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td><?php echo $words["created_time"]?>: </td>
                                        <td><span name="created_time" coltype="readonly" format="datetime" style="color:blue;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["last_updated"]?>: </td>
                                        <td><span name="last_updated" coltype="readonly" format="datetime" style="color:blue;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["last_login"]?>: </td>
                                        <td><span name="last_login" coltype="readonly" format="datetime" style="color:blue;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["admin.hits"]?>: </td>
                                        <td><span name="hits" coltype="readonly" format="" style="color:blue;"></span>
                                    </tr>
								</table>                     
                </td>
        	</tr>
      	</table>        

   		</div>


<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>


<div id="lwhDivBox-myaccount" class="lwhDivBox" ww="220px" hh="120px">
	<div class="lwhDivBox-content" id="admin_password">
    <center><br />
	<table>
        <tr>
            <td><?php echo $words["password"]?>: </td>
            <td><input type="password" name="password" colname="<?php echo $words["password"]?>" notnull=1 value="" /></td>
        </tr>
        <tr>
            <td><?php echo $words["password.confirm"]?>: </td>
            <td><input type="password" name="password_confirm" colname="<?php echo $words["password.confirm"]?>" notnull=1 value="" /></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="button" id="btn_save" onclick="save_pass()" value="<?php echo $words["reset password"]?>" /></td>
        </tr>
    </table>
    </center>	
    </div>
</div>

<?php include_once("website_a_common.php");?>
</body>
</html>
