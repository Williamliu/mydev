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
        <script language="javascript" type="text/javascript">
		var lwh = null;
		var pass = null;
		$(function(){
			$("#lwhWrapBox-password").lwhWrapBox();

			lwh = new LWH.FORM({
							filter: {
								id : "<?php echo $public_user["id"]?>"
							},
							head: {
								lang:		GLang,
								scope: 		"lwh",
								url:		"func/public_myaccount_secure.php",
							},
							func: {
								after: function( req ) {
								},
								cancel: function( cols ) {
								}
							}
					});
			lwh.view();
		});
        </script>
</head>
<body class="mycenter"s>
<?php 
	require("public_a_center_header.php");
	require("public_a_cetner_menu.php");
	LANG::hit("Public", "安全设置", "安全设置"." :".$public_user["user_name"]);
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
                                        <td><?php echo $words["user_name"]?>: </td>
                                        <td><span scope="lwh" coltype="text" name="user_name" style="font-size:18px;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["email"]?><span class="required">*</span>: </td>
                                        <td>
                                        	<input type="text" 		scope="lwh" coltype="textbox" 	name="email" class="medium" datatype="email" colname="<?php echo $words["email"]?>" maxlength="256" need=1 notnull=1  value="" />
                                        </td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>

                                    <tr>
                                        <td><?php echo $words["password"]?>: </td>
                                        <td><input type="password" scope="lwh" coltype="password" 			name="password" colname="<?php echo $words["password"]?>" need=1 notnull=1 value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["password.confirm"]?>: </td>
                                        <td><input type="password" scope="lwh" coltype="password_confirm"   name="password_confirm" colname="<?php echo $words["password.confirm"]?>" need=1 notnull=1 value="" /></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="button"	scope="lwh" coltype="save" 		value="<?php echo $words["save"]?>" />
                                            <input type="button" 	scope="lwh" coltype="cancel" 	value="<?php echo $words["cancel"]?>" />
                                        </td>
                                    </tr>
                                </table>
                </td>
            	<td valign="top" align="right" style="padding-left:20px;">
                                <table>
                                    <tr>
                                        <td colspan="2" align="left">
											<?php include_once("tpl_user_profile.php")?>
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
