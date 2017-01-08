<?php
session_start();
ini_set("display_errors", 0);
require("public_a_secure.php");
$menuKey="M2";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("public_a_include.php");?>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.table.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.table.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageroll.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageroll.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.category.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.category.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript">
			$(function(){
				ishow = new LWH.ImageShow({name:"photoshow", lang: GLang, filter:"info_content", mode:"medium", view:"small", 	imgww:600, imghh:450, tips:true, edit:false, single:true });

				ipic = new LWH.ImageRoll({name:"productImage", lang: GLang, filter:"info_content", mode:"medium", view:"small", container:"#imglist", tips:false, imgww:160, imghh:120, orient:"h",
											click: function(imgObj) {
												ishow.imgobj(imgObj);
											}
										});
				ipic.refid("<?php echo $_REQUEST["sid"]?>");
			
			
				advertise_message = new LWH.FORM({
							lang:		GLang,
							container: 	"#advertise-contact",
							sstable:	"",
							url:		"func/advertise_detail_save.php",
						});
				advertise_message.setCallback({
					after: function(req) {
						if(req.errorCode <= 0) {
							advertise_message.clearData("message");
							tool_tips(words["submit success"]);
						}
					}
				});
			
			});
			function goto() {
				$("form[name=publicsite_postform]").attr("action", "advertise_form.php");
				publicsite_postform.submit();
			}
			function search() {
				$("#table-content").lwhTable_search();			
			}
			function searchall() {
				$("#category_search").lwhCategory_clear();
				$("#table-content").lwhTable_searchAll();			
			}
			
			function advertise_message_save_ajax() {
				advertise_message.action({action:"add"});
			}
			
			function closeme() {
				close();
			}
			</script>
</head>
<body class="bg1">
<?php 
	require("public_a_header.php");
	require("public_a_menu.php");
	LANG::hit("Public", "广告内容", "广告内容"." :".$public_user["user_name"]);
	
	$db->query("UPDATE info_content SET hits = hits + 1 WHERE deleted <> 1 AND status = 1 AND id = '" . $_REQUEST["sid"] . "'");
	
	$result = $db->query("SELECT * FROM vw_info_content WHERE deleted <> 1 AND status = 1 AND id = '" . $_REQUEST["sid"] . "'");
	$row 	= $db->fetch($result);
	$ptitle = $db->getVal("info_class", LANG::langCol("title", $GLang), $row["class_id"]);
	$title  = $row[LANG::langCol("a_title", 	$GLang)];
	$desc   = $row[LANG::langCol("a_desc", 	$GLang)];
	$detail = $row[LANG::langCol("a_detail", 	$GLang)];
	$owner  = $row["user_id"];
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
<input type="button" class="lwhButton lwhButton-h36 lwhButton-navi" onclick="closeme()" value="<?php echo $words["button.close"]?>" />
<div class="advertise" style="margin-top:5px;">
    <div class="advertise-header" title="<?php echo $title?>\n<?php echo $words["publish_time"]?>: <?php echo cTYPE::inttodate($row["created_time"],"Y-m-d H:i")?>">
		<span style="line-height:36px;">
        <?php echo $title?>
		</span>
		<br />
		<span style="float:left;">
        <span class="lwhTable-class">[<?php echo $ptitle;?>]</span>  
        <span class="lwhTable-datetime" style="font-size:14px;line-height:14px;"><?php echo $words["publish_time"]?>: <?php echo cTYPE::inttodate($row["created_time"],"Y-m-d H:i")?></span>
		</span>
		<span style="float:right; margin-right:10px;">
            <span class="lwhTable-class" style="margin-left:20px;"><?php echo $words["hits"]?>: </span>
            <span class="lwhTable-datetime" style="font-size:14px;line-height:14px;"><?php echo $row["hits"]?></span>
             - <span class="lwhTable-class"><?php echo $words["review"]?></span> : 
             <span class="lwhTable-datetime" style="font-size:14px;line-height:14px;"><?php echo $row["reviews"]?></span>
    	</span>
    </div>
    <div id="advertise-contact" class="advertise-contact">
    <table width="100%">
        <tr>
            <td valign="top" width="40%">
                    <table cellpadding="2">
                        <tr>
                            <td class="advertise-label"><?php echo $words["advertise.publish_by"]?> : </td>
                            <td><?php echo $row["publish_by"]?></td>
                        </tr>
                        <tr>
                            <td class="advertise-label"><?php echo $words["phone"]?> :</td>
                            <td><?php echo $row["phone"]?></td>
                        </tr>
                        <tr>
                            <td class="advertise-label"><?php echo $words["cell"]?> : </td>
                            <td><?php echo $row["cell"]?></td>
                        </tr>
                        <tr>
                            <td class="advertise-label"><?php echo $words["advertise.email"]?> : </td>
                            <td><?php echo $row["email"]?></td>
                        </tr>
                        <tr>
                            <td class="advertise-label"><?php echo $words["address"]?> : </td>
                            <td><?php echo $row["address"] . ($row["address"] && $row["city"]?", ":"") . $row["city"]?></td>
                        </tr>
                    </table>
            </td>
            <td valign="top" width="60%">
            		<?php if( $public_user["id"]!=$owner ) { ?>
                    <table cellpadding="2">
                                    <tr>
                                        <td colspan="2" align="left"><?php echo $words["contact.publish_by"]?></td>
										<td>
                                        	<span class="required">*</span> <?php echo $words["contact.message"]?>
                                        	<input type="hidden" name="from_id" 	colname="From ID"		value="<?php echo $public_user["id"]?>"	datatype="number" />
                                        	<input type="hidden" name="to_id" 		colname="To ID"			value="<?php echo $owner?>" />
                                        	<input type="hidden" name="content_id" 	colname="Content ID" 	value="<?php echo $_REQUEST["sid"]?>" datatype="number" />
                                        	<input type="hidden" name="content_url" colname="Content URL" 	value="<?php echo $_SERVER['REQUEST_URI']?>" />
                                        	<input type="hidden" name="subject" 	colname="Subject" 		value="<?php echo $words["about"] . ": ". $title?>" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" style="white-space:nowrap;"><span class="required">*</span><?php echo $words["your.name"]?>: </td>
                                        <td><input type="text" class="medium" name="from_name" colname="<?php echo $words["your.name"]?>" maxlength="256" notnull=1 value="<?php echo $public_user["full_name"]?>" /></td>
                                        <td rowspan="3">
                                       		<textarea name="message" colname="<?php echo $words["contact.message"]?>" maxlength="1204" notnull=1 style="width:250px;height:80px;"></textarea>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="right" style="white-space:nowrap;"><span class="required">*</span><?php echo $words["your.email"]?>: </td>
                                        <td><input type="text" class="medium" name="from_email" colname="<?php echo $words["your.email"]?>" datatype="email" maxlength="256" notnull=1 value="<?php echo $public_user["email"]?>" /></td>
                                    </tr>
                                    <tr>
                                        <td align="right" style="white-space:nowrap;"><?php echo $words["your.phone"]?>: </td>
                                        <td><input type="text" class="medium" name="from_phone" colname="<?php echo $words["your.phone"]?>" maxlength="64" notnull=0  value="<?php echo $public_user["phone"]?>" /></td>
	                                </tr>
                                    <tr>
                                        <td colspan="3" align="center"><input type="button" onclick="advertise_message_save_ajax()" value="<?php echo $words["send message"]?>" /></td>
	                                </tr>
                    </table>
            		<?php } ?>
            </td>
        </tr>
    </table>
    </div>

    <br />
    <div class="advertise-brief">
    	<fieldset style="border:1px solid #cccccc; border-radius:5px;min-height:40px;">
        <legend><?php echo $words["advertise.brief"]?></legend>
        	<?php echo $desc;?>
   		</fieldset>
    </div>
    <br />
 	<div id="imglist"></div>
    <div class="advertise-content">
    	<fieldset style="border:1px solid #cccccc; border-radius:5px;min-height:40px;">
        <legend><?php echo $words["advertise.detail"]?></legend>
        <?php echo $detail;?>
   		</fieldset>
    </div>
    <br />
    <div class="advertise-footer">
        <span class="lwhTable-class">[<?php echo $ptitle;?>]</span>  
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="lwhTable-datetime" style="font-size:14px;line-height:14px;"><?php echo $words["advertise.publish_by"]?>: <?php echo $row["publish_by"]?></span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="lwhTable-datetime" style="font-size:14px;line-height:14px;"><?php echo $words["publish_time"]?>: <?php echo cTYPE::inttodate($row["created_time"],"Y-m-d H:i")?></span>
    </div>
</div>
<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php require("public_a_common.php");?>
</body>
</html>
