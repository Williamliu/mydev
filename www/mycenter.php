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
		$(function(){
		});
        </script>
</head>
<body class="mycenter">
<?php 
	require("public_a_center_header.php");
	require("public_a_cetner_menu.php");
	LANG::hit("Public", "管理中心", "管理中心"." :".$public_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

<div id="public_form">
<table width="100%">
    <tr>
        <td valign="top" width="200">
			<?php include_once("tpl_user_menu_center.php")?>
			<br />
			<?php include_once("tpl_user_profile.php")?>
        </td>
        <td valign="top" style="padding-left:20px;">
        </td>
    </tr>
</table>        
</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("public_a_common.php");?>
</body>
</html>
