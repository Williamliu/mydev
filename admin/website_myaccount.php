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
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   	href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.diagbox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.diagbox.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageajax.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageajax.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imagebox.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imagebox.css" rel="stylesheet" />


        <script language="javascript" type="text/javascript">
		var lwh = null;
		var pass = null;
		$(function(){
			$("#lwhWrapBox-myaccount").lwhWrapBox({
			});

			lwh = new LWH.FORM({
						filter: {
							id : "<?php echo $admin_user["id"]?>"
						},
						head : {
							lang: 	GLang,
							scope:	"admin_form",
							url:	"func/website_myaccount_save.php"
						},
						func: {
								after: function( req ) {
								},
								cancel: function( cols ) {
								}
						}
					});

			lwh.view();

			pass = new LWH.FORM({
						filter: {
							id : "<?php echo $admin_user["id"]?>"
						},
						head : {
							lang:		GLang,
							scope:		"admin_pass",
							url:		"func/website_myaccount_password.php"
						},
						func: {
							before: function(nform) {
							},
							after: function(req) {
								if(req.errorCode == 0 ) {
									$("#lwhWrapBox-myaccount").wrapBoxHide();
									tool_tips(words["password.reset"]);
									pass.clearCols();
								}
							}
						}
					});
					
			pass.clearCols();
		
			iupload = new LWH.AjaxImage({
								lang:		GLang,
								name:		"imageupload", 
								filter:		"website_admin",
								trigger:	"#upload_photo",
								mode:		"medium",
								view:		"thumb",
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
								name:"productImage", 
								lang: GLang,
								filter:"website_admin", 
								mode:"medium", 
								view:"thumb", 
								noimg:0, 
								container:"#amdin_imgshow",
								edit:true, 
								ww:		120, 
								hh:		160, 
								imgww:	360, 
								imghh:	480, 
								cropww: 36, 
								crophh:	48, 
								orient:"v"
					});
					
			
			 iupload.refid(<?php echo $admin_user["id"]?>);
			 ipic.refid(<?php echo $admin_user["id"]?>);
		});
		

		function reset_pass() {
			pass.clearCols();
			$("#lwhWrapBox-myaccount").wrapBoxShow();
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
	LANG::hit("Admin", "我的帐号", "我的帐号"." :".$admin_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
        <div id="admin_form" style="display:inline-block;">
         <div class="lwhTab9 lwhTab9-sea">
            <ul>
                <li class="selected"><?php echo $admin_user["uhere"] ?><s></s></li>
            </ul>
         </div>
         <br />
		<table>
        	<tr>
            	<td valign="top">
                                <table>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["email"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="email" datatype="email"  class="medium" colname="<?php echo $words["email"]?>" maxlength="256" notnull=1  value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="user_name" class="medium" colname="<?php echo $words["user_name"]?>" maxlength="64" notnull=1  value="" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="center"><input type="button" id="btn_reset" onclick="reset_pass()" value="<?php echo $words["reset password"]?>" /></td>
                                    </tr>
                                    
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td valign="top"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="full_name" class="medium" colname="<?php echo $words["full_name"]?>" maxlength="256" notnull=1 value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["phone"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="phone" class="medium" colname="<?php echo $words["phone"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["cell"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="cell" class="medium" colname="<?php echo $words["cell"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["address"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="address" class="medium" colname="<?php echo $words["address"]?>" maxlength="256" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["city"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="city" class="medium" colname="<?php echo $words["city"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["state"]?>: </td>
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="state" class="medium" colname="<?php echo $words["state"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["country"]?>: </td>
                                        <td>
											<?php 
                                                
                                                $colObj = array();
                                                $colObj["scope"] 	= "admin_form";
                                                $colObj["name"] 	= "country";
                                                $colObj["colname"] 	= $words["country"];
                                                
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
                                        <td><input type="text" scope="admin_form" coltype="textbox" name="postal" class="short" colname="<?php echo $words["postal"]?>" maxlength="16" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <br />
                                            <input type="button" scope="admin_form" coltype="save" 		value="<?php echo $words["save"]?>" />
                                            <input type="button" scope="admin_form" coltype="cancel" 	value="<?php echo $words["cancel"]?>" />
                                        </td>
                                    </tr>
                                </table>
                </td>
            	<td valign="top" style="padding-left:20px;">
                                <table>
                                    <tr>
                                        <td colspan="2" align="left">
                                        	<a id="upload_photo" style="font-size:18px; color:blue; cursor:pointer; text-decoration:underline;"><?php echo $words["upload photo"]?></a>
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
                                        	<span name="group_id" scope="admin_form" coltype="checktext" rtable="website_admin_group" rcol="admin_id"  stable="website_group" scol="id" stitle="<?php echo LANG::langCol("title", $GLang);?>" style="color:blue;"></span>
										</td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td><?php echo $words["created_time"]?>: </td>
                                        <td><span name="created_time" scope="admin_form" coltype="intdatetime" style="color:blue;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["last_updated"]?>: </td>
                                        <td><span name="last_updated" scope="admin_form" coltype="intdatetime" style="color:blue;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["last_login"]?>: </td>
                                        <td><span name="last_login" scope="admin_form" coltype="intdatetime" style="color:blue;"></span></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["admin.hits"]?>: </td>
                                        <td><span name="hits"  scope="admin_form" coltype="text" style="color:blue;"></span>
                                    </tr>
								</table>                     
                </td>
        	</tr>
      	</table>        

   		</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>


<div id="lwhWrapBox-myaccount" class="lwhWrapBox">
	<div class="lwhWrapBox-content" id="admin_password" style="border:1px solid #cccccc; padding:10px;">
    <center>
	<table>
        <tr>
            <td><?php echo $words["password.old"]?>: </td>
            <td><input type="password" scope="admin_pass" coltype="textbox" name="password_old" colname="<?php echo $words["password.old"]?>" minlength=6 need=1 notnull=1 value="" /></td>
        </tr>
        <tr>
            <td><?php echo $words["password"]?>: </td>
            <td><input type="password" scope="admin_pass" coltype="password" name="password" colname="<?php echo $words["password"]?>"  minlength=6 need=1 notnull=1 value="" /></td>
        </tr>
        <tr>
            <td><?php echo $words["password.confirm"]?>: </td>
            <td><input type="password" scope="admin_pass" coltype="password_confirm" name="password_confirm" colname="<?php echo $words["password.confirm"]?>" minlength=6 need=1 notnull=1 value="" /></td>
        </tr>
        <tr>
            <td></td>
            <td><input type="button" scope="admin_pass" coltype="save" value="<?php echo $words["reset password"]?>" /></td>
        </tr>
    </table>
    </center>	
    </div>
</div>
<?php include_once("website_a_common.php");?>
</body>
</html>
