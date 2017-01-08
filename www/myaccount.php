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
		$(function(){
			iForm = new LWH.FORM({
							filter: {
								id : "<?php echo $public_user["id"]?>"
							},
							head: {
								lang:		GLang,
								scope: 		"lwh",
								base:		"public_user"
								//url:		"func/public_contactus_save.php",
							},
							func: {
								after: function( req ) {
								},
								cancel: function( cols ) {
								}
							}
					});

			iForm.view();
		});
        </script>
</head>
<body class="mycenter">
<?php 
	require("public_a_center_header.php");
	require("public_a_cetner_menu.php");
	LANG::hit("Public", "个人信息", "个人信息"." :".$public_user["user_name"]);
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
                                        <td valign="top"><span class="required">*</span> <?php echo $words["anonym"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="anonym" class="short" colname="<?php echo $words["anonym"]?>" maxlength="64" notnull=1 value="" /></td>
                                    </tr>
                                    <tr>
                                        <td valign="top"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="full_name" class="medium" colname="<?php echo $words["full_name"]?>" maxlength="256" notnull=1 value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["phone"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="phone" class="medium" colname="<?php echo $words["phone"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["cell"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="cell" class="medium" colname="<?php echo $words["cell"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["address"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="address" class="medium" colname="<?php echo $words["address"]?>" maxlength="256" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["city"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="city" class="medium" colname="<?php echo $words["city"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["state"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="state" class="medium" colname="<?php echo $words["state"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><span class="required">*</span> <?php echo $words["country"]?>: </td>
                                        <td>
											<?php 
                                                
                                                $colObj = array();
                                                $colObj["scope"] 	= "lwh";
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
                                        <td><input type="text" scope="lwh" coltype="textbox" name="postal" class="short" colname="<?php echo $words["postal"]?>" maxlength="16" value="" /></td>
                                    </tr>
                                    
                                    <tr>
                                        <td colspan="2"><br /></td>
                                    </tr>
 
                                    <tr>
                                        <td colspan="2" align="center"><b> - <?php echo $words["social media contact"]?> - </b></td>
                                    </tr>

                                    <tr>
                                        <td><?php echo $words["qq"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="qq" class="medium" colname="<?php echo $words["qq"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["wechat"]?>: </td>
                                        <td><input type="text" scope="lwh" coltype="textbox" name="wechat" class="medium" colname="<?php echo $words["wechat"]?>" maxlength="64" value="" /></td>
                                    </tr>
                                    <tr>
                                        <td><?php echo $words["contact_type"]?>: </td>
                                        <td>
                                        	<select scope="lwh" coltype="select" name="contact_type" colname="<?php echo $words["contact_type"]?>">
												<option value=""></option>
												<option value="FaceBook">FaceBook</option>
												<option value="Twitter">Twitter</option>
												<option value="WhatsApp">What's App</option>
                                            </select>
											<?php echo $words["contact_id"]?>: 
                                        	<input type="text" scope="lwh" coltype="textbox" name="contact_id" class="medium" colname="<?php echo $words["contact_id"]?>" maxlength="64" style="width:160px;" value="" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <br />
                                            <input type="button" scope="lwh" coltype="save" class="lwhButton" id="btn_save" 	 	value="<?php echo $words["save"]?>" />
                                            <input type="button" scope="lwh" coltype="cancel" class="lwhButton" id="btn_cancel" 	value="<?php echo $words["cancel"]?>" />
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
                                  	<!--
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td valign="top"><?php echo $words["user.type"]?>: </td>
                                        <td>
                                        	<span name="group_id" coltype="readselect" stable="user_group" scol="id" stitle="<?php echo LANG::langCol("title", $GLang);?>" style="color:blue;"></span>
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
                                    -->
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
