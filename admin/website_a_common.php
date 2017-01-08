<!---------- website common part ------------------------------>
<br />
<div id="wait" class="lwhLoading"></div>
<br />
<div class="lwhTooltip lwhTooltip-green" id="tooltips">
    <div class="lwhTooltip_message" style="font-size:16px; font-weight:bold; padding-top:5px;"></div>
</div>
<br>

<div id="lwhDivBox-adminWebsite-errorMessage" class="lwhDivBox" ww="480px" hh="300px" minww="300px" minhh="200px">
	<div class="lwhDivBox-content">
        <div><a class="wmliu-common-state-stop"></a>
            <span class="wmliu-common-state-error"><?php echo $words["input.error.message"]?>: </span>
        </div>
        <div class="wmliu-common-checklist-box">
            <span class="wmliu-common-error-text"></span>
        </div>
	</div>
</div>

<div id="adminWebsite_register" class="lwhWrapBox">
	<div class="lwhWrapBox-content">
    	<div id="adminWebsite_adminform" style="padding:10px 20px 20px 20px; border:1px solid #cccccc; border-radius:10px;">
          	<center><span style="font-size:16px;font-weight:bold;"><?php echo $words["account.register"]; ?></span></center>
			<br />
            <table>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="email" datatype="email" colname="<?php echo $words["email"]?>" maxlength="256" notnull=1  value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="user_name" colname="<?php echo $words["user_name"]?>" maxlength="64" notnull=1  value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["password"]?>: </td>
                    <td>
                        <input class="short" type="password" scope="adminRegister" coltype="textbox" name="password" colname="<?php echo $words["password"]?>" minlength=6 maxlength="16" notnull=1 value="" />
                    </td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["password.confirm"]?>: </td>
                    <td>
                        <input class="short" type="password" scope="adminRegister" coltype="textbox" name="password_confirm" colname="<?php echo $words["password.confirm"]?>" minlength=6 maxlength="16" notnull=1 value="" />
                    </td>
                </tr>
                
                <tr><td colspan="2"><br /></td></tr>
                <tr>
                    <td valign="top"  align="right"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="full_name" colname="<?php echo $words["full_name"]?>" maxlength="256" notnull=1 value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["phone"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="phone" colname="<?php echo $words["phone"]?>" maxlength="64" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["cell"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="cell" colname="<?php echo $words["cell"]?>" maxlength="64" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["address"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="address" colname="<?php echo $words["address"]?>" maxlength="256" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["city"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="city" colname="<?php echo $words["city"]?>" maxlength="64" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["state"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="state" colname="<?php echo $words["state"]?>" maxlength="64" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["country"]?>: </td>
                    <td>
                        <?php 
							$colObj = array();
							$colObj["scope"] 	= "adminRegister";
							$colObj["name"] 	= "country";
							$colObj["col"]  	= "country";
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
                    <td align="right"><?php echo $words["postal"]?>: </td>
                    <td><input class="medium" type="text" scope="adminRegister" coltype="textbox" name="postal" colname="<?php echo $words["postal"]?>" maxlength="16" value="" /></td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <br />
                        <input type="button" id="btn_save" 	 scope="adminRegister" coltype="add"	value="<?php echo $words["save"]?>" />
                        <input type="button" id="btn_cancel" scope="adminRegister" coltype="cancel"	value="<?php echo $words["cancel"]?>" />
                    </td>
                </tr>
            </table>
    	</div>
	</div>
</div>


<div id="adminWebsite_contact" class="lwhWrapBox">
	<div class="lwhWrapBox-content">
    	<div id="adminWebsite_contactus" style="padding:10px;">
	        <span style="font-size:24px; color:#666666;"><?php echo $words["our contact"]?></span><br />
			<a class="contact_phone"></a><span class="contact_text">604-888-9999</span><br />
			<a class="contact_email"></a><span class="contact_text">service@vanchild.com</span><br />
			<a class="contact_webchat"></a><span class="contact_text">vanchild.vancouver</span><br />
			<a class="contact_qq"></a><span class="contact_text">18348343433</span><br />
			<br />
	        <span style="font-size:24px; color:#666666;"><?php echo $words["contact us"]?></span><br /><br />
            <table style="margin-left:20px; font-size:14px;">
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                    <td><input class="medium" type="text" scope="adminContactus" coltype="textbox" name="full_name" colname="<?php echo $words["full_name"]?>" maxlength="256" notnull=1 value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                    <td><input class="medium" type="text" scope="adminContactus" coltype="textbox" name="email" datatype="email" colname="<?php echo $words["email"]?>" maxlength="256" notnull=1  value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["phone"]?>: </td>
                    <td><input class="medium" type="text" scope="adminContactus" coltype="textbox" name="phone" colname="<?php echo $words["phone"]?>" maxlength="64" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["subject"]?>: </td>
                    <td><input class="long" type="text" scope="adminContactus" coltype="textbox" name="subject" colname="<?php echo $words["subject"]?>" maxlength="256" notnull=1 value="" /></td>
                </tr>
                <tr>
                    <td align="right" valign="top"><span class="required">*</span> <?php echo $words["detail"]?>: </td>
                    <td><textarea class="long" name="detail" scope="adminContactus" coltype="textbox" colname="<?php echo $words["detail"]?>" maxlength="1204" notnull=1 style="height:80px;"></textarea></td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="button" scope="adminContactus" coltype="add"	value="<?php echo $words["submit"]?>" />
                        <input type="button" scope="adminContactus" coltype="cancel" value="<?php echo $words["cancel"]?>" />
                    </td>
                </tr>
			</table>
        </div>
    </div>
</div>

<script language="javascript" type="text/javascript">
    $(function () {
        $("#tooltips").lwhTooltip();
        $("#wait").lwhLoading({ loadMsg: "WAITING..." });
		
		$("#adminWebsite_contact").lwhWrapBox();
		$("#adminWebsite_register").lwhWrapBox();
		
		errMsg = $("#lwhDivBox-adminWebsite-errorMessage").get(0);
		$(errMsg).lwhDivBox();
        errMsg.show = function(msg) {
			$("span.wmliu-common-error-text", $(errMsg)).html(msg);
			$(errMsg).divBoxShow();
		};



		adminRegisterFrom = new LWH.FORM({
					head: {
						lang:		GLang,
						scope: 		"adminRegister",
						url:		"func/website_myaccount_apply.php"
					},
					func: {
						after: function(req) {
							if(req.errorCode <= 0) {
								tool_tips(words["submit success"]);
								adminRegisterFrom.clear();
								$(adminRegister).wrapBoxHide();
			
								$("form[name=adminsite_postform]").attr("action", "<?php echo $CFG["admin_welcome_webpage"]?>");
								$("#adminsite_session").val( req.data.sess_id );
								adminsite_postform.submit();
								tool_tips(req.errorMessage);
							}
						},
						cancel: function(cols) {
							$("#adminWebsite_register").wrapBoxHide();	
						}
					}
				});

        $("#btn-AdminRegister").bind("click", function(ev){
			$("#adminWebsite_register").wrapBoxShow();
		});
		
	
		adminContactForm = new LWH.FORM({
					head: {
						lang:		GLang,
						scope: 		"adminContactus",
						url:		"func/website_contactus_save.php"
					},
					func: {
						after: function(req) {
							if(req.errorCode <= 0) {
								tool_tips(words["submit success"]);
								adminContactForm.clear();
								$("#adminWebsite_contact").wrapBoxHide();
							}
						},
						cancel: function(cols) {
							adminContactForm.clear();
							$("#adminWebsite_contact").wrapBoxHide();
						}
					}
				});
		
		$("#btn-adminContactus").bind("click", function(ev){
			$("#adminWebsite_contact").wrapBoxShow();
		});
		
    });
</script>

