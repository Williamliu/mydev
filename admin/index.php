<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");
$sess_db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$sess_id = $sess_db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] );
$sess_db->query("UPDATE website_admin_session SET deleted = 1, last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id  . "';");

$_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] = "";
$_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_secure"] = "";
//session_destroy();
//session_start();
include_once("website_a_secure.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="copyright" content="Copyright Bodhi Meditation, All Rights Reserved." />
		<meta name="description" content="Bodhi Meditation Vancouver Site" />
		<meta name="keywords" content="Bodhi Meditation Vancouver" />
		<meta name="rating" content="general" />
		<meta name="language" content="english" />
		<meta name="robots" content="index" />
		<meta name="robots" content="follow" />
		<meta name="revisit-after" content="1 days" />
		<meta name="classification" content="" />
		<link rel="icon" type="image/gif" href="bodhi.gif" />
		<title>Website Language</title>
        <?php require("website_a_include.php");?>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
		var register = null;
		var sign = null;
		$(function(){
			$("#my").lwhTab9({height:240, border:false, expand:true});
			
			$("#lwhDivBox-myaccount").lwhDivBox();
	
			sign = new LWH.FORM({
						head: {
							lang:		GLang,
							scope: 		"sign",
							url:		"func/website_login.php"
						},
						func: {
							after: function(req) {
								if( req.errorCode <= 0 ) {
									$("form[name=adminsite_postform]").attr("action", "<?php echo $CFG["admin_welcome_webpage"]?>");
									$("#adminsite_session").val( req.data.sess_id );
									adminsite_postform.submit();
									tool_tips(req.errorMessage);
								}
							}
						}
					});
			
			
			
			register = new LWH.FORM({
						head: {
							lang:		GLang,
							scope: 		"register",
							url:		"func/website_myaccount_apply.php"
						},
						func: {
							after: function(req) {
								if(req.errorCode <= 0) {
									tool_tips(words["account.register.ok"]);
									register.clear();
			
									$("form[name=adminsite_postform]").attr("action", "<?php echo $CFG["admin_welcome_webpage"]?>");
									$("#adminsite_session").val( req.data.sess_id );
									adminsite_postform.submit();
									tool_tips(req.errorMessage);
								}
							}
						}
					});

			$("#btn-register-user").bind("click", function(ev) {
				$("#div_login").hide();
				$("#div_register").show();
			});
		
		});
		
		function cancel_ajax() {
			$("#div_login").show();
			$("#div_register").hide();
		}
        </script>
</head>
<body>
<?php 
	require("website_a_header.php");
	LANG::hit("Admin", "用户登录", "用户登录"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
<center>	
			<div id="div_login">
                    <div class="lwhTab9 lwhTab9-mint" style="display:inline-block;">
                        <ul >
                            <li class="selected"><?php echo $words["exist.account.login"]; ?><s></s></li>
                        </ul>   
                        <div class="lwhTab9-border" style="display:block; padding:30px 120px 30px 100px;">
                                        <table id="admin_login">
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                                <td><input type="text" scope="sign" coltype="textbox" name="user_name" colname="<?php echo $words["name.email.phone"]?>" class="short" need="1" notnull="1" placeholder="<?php echo $words["name.email.phone"] ?>" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["password"]?>: </td>
                                                <td><input type="password" scope="sign" coltype="textbox" name="password" class="short" colname="<?php echo $words["password.confirm"]?>" need="1" notnull=1 value="" /></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" align="center"><input type="button" scope="sign" coltype="save" value="<?php echo $words["login"]?>" /></td>
                                            </tr>
                                        </table>
                                        <br />
                                        <a class="label-text" id="btn-register-user" style="cursor:pointer; font-size:14px; color:blue; text-decoration:underline;"><?php echo $words["register.new.user"] ?> </a><br /><br />
                                        <a class="label-text" style="cursor:pointer; font-size:14px; color:blue; text-decoration:underline;"><?php echo $words["forget password"] ?> </a>
                        </div>
                    </div>
             </div>

			<div id="div_register" style="display:none;">
                    <div class="lwhTab9 lwhTab9-fuzzy" style="display:inline-block;">
                        <ul >
                            <li class="selected"><?php echo $words["account.register"]; ?><s></s></li>
                        </ul> 
                        <div class="lwhTab9-border" style="display:block; padding:30px 120px 30px 100px;">
                                        <table id="admin_form">
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="email" datatype="email" colname="<?php echo $words["email"]?>" class="medium" maxlength="256" notnull=1  value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="user_name" colname="<?php echo $words["user_name"]?>" class="medium" maxlength="64" notnull=1  value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["password"]?>: </td>
                                                <td>
                                                    <input type="password" scope="register" coltype="password" name="password" colname="<?php echo $words["password"]?>" class="short" minlength=6 maxlength="16" notnull=1 value="" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["password.confirm"]?>: </td>
                                                <td>
                                                    <input type="password" scope="register" coltype="password_confirm" name="password_confirm" colname="<?php echo $words["password.confirm"]?>" class="short" minlength=6 maxlength="16" notnull=1 value="" />
                                                </td>
                                            </tr>
                                            
                                            <tr><td colspan="2"><br /></td></tr>
                                            <tr>
                                                <td valign="top"  align="right"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="full_name" colname="<?php echo $words["full_name"]?>" class="medium" maxlength="256" notnull=1 value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["phone"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="phone" colname="<?php echo $words["phone"]?>" class="medium" maxlength="64" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["cell"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="cell" colname="<?php echo $words["cell"]?>" class="medium" maxlength="64" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["address"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="address" colname="<?php echo $words["address"]?>" class="medium" maxlength="256" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["city"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="city" colname="<?php echo $words["city"]?>" class="medium" maxlength="64" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["state"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="state" colname="<?php echo $words["state"]?>" class="medium" maxlength="64" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["country"]?>: </td>
                                                <td>
                                                    <?php 
                                                        
                                                        $colObj = array();
                                                        $colObj["scope"] 	= "register";
                                                        $colObj["name"] 	= "country";
                                                        $colObj["colname"] 	= $words["country"];
                                                        $colObj["coltype"] 	= "select";
                                                        
                                                        $colObj["stable"] 	= "website_country";
                                                        $colObj["scol"] 	= "id";
                                                        $colObj["stitle"] 	= LANG::langCol("country", $GLang);
                                                        $colObj["sdesc"] 	= "";
                                                        
                                                        $colObj["sn"] 		= 0;
                                                        $colObj["notnull"] 	= 0;
                                                        $colObj["width"] 	= "120px;";
                                                        
                                                        echo HTML::select($db, $GLang, $colObj);
                                                        
                                                    ?>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="right"><?php echo $words["postal"]?>: </td>
                                                <td><input type="text" scope="register" coltype="textbox" name="postal" colname="<?php echo $words["postal"]?>" class="short" maxlength="16" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" align="center">
                                                    <br />
                                                    <input type="button" scope="register" coltype="add" 	value="<?php echo $words["save"]?>" />
                                                    <input type="button" scope="register" coltype="cancel" 	onclick="cancel_ajax()" value="<?php echo $words["cancel"]?>" />
                                                </td>
                                            </tr>
                                        </table>
                        </div>
                    </div>                          
			</div>                          
</center>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php include_once("website_a_common.php");?>
</body>
</html>
