<!---------- website common part ------------------------------>
<br />
<div id="wait" class="lwhLoading"></div>
<br />
<div class="lwhTooltip lwhTooltip-green" id="tooltips">
    <div class="lwhTooltip_message" style="font-size:16px; font-weight:bold; padding-top:5px;"></div>
</div>
<br>

<div id="lwhDivBox-publicWebsite-errorMessage" class="lwhDivBox" ww="480px" hh="300px" minww="300px" minhh="200px">
	<div class="lwhDivBox-content">
        <div><a class="wmliu-common-state-stop"></a>
            <span class="wmliu-common-state-error"><?php echo $words["input.error.message"]?>: </span>
        </div>
        <div class="wmliu-common-checklist-box">
            <span class="wmliu-common-error-text"></span>
        </div>
	</div>
</div>

<div id="publicWebsite_register" class="lwhWrapBox" style="max-width:640px; max-height:480px;">
	<div class="lwhWrapBox-content">
    	<div id="publicWebsite_publicform" style="padding:10px 20px 20px 20px; border:1px solid #cccccc; border-radius:10px;">
          	<center><span style="font-size:16px;font-weight:bold;"><?php echo $words["account.register"]; ?></span></center>
			<br />
			<table style="border-collapse:collapse;">
            	<tr>
                	<td valign="top" align="right">
            			
                        <table>
                            <tr>
                                <td align="right"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="email" class="medium" datatype="email" colname="<?php echo $words["email"]?>" maxlength="256" notnull=1  value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="user_name" class="medium" colname="<?php echo $words["user_name"]?>" maxlength="64" notnull=1  value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><span class="required">*</span> <?php echo $words["password"]?>: </td>
                                <td>
                                    <input type="password" scope="register" coltype="password" name="password" class="short" colname="<?php echo $words["password"]?>" minlength=6 maxlength="16" notnull=1 value="" />
                                </td>
                            </tr>
                            <tr>
                                <td align="right"><span class="required">*</span> <?php echo $words["password.confirm"]?>: </td>
                                <td>
                                    <input type="password" scope="register" coltype="password_confirm" name="password_confirm" class="short" colname="<?php echo $words["password.confirm"]?>" minlength=6 maxlength="16" notnull=1 value="" />
                                </td>
                            </tr>
                        	<tr>
                            	<td colspan="2"><br /></td>
                            </tr>

                            <tr>
                                <td valign="top"  align="right"><span class="required">*</span> <?php echo $words["anonym"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="anonym" class="short" colname="<?php echo $words["anonym"]?>" maxlength="64" notnull=1 value="" /></td>
                            </tr>
                       
                           <tr>
                                <td valign="top"  align="right"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="full_name" class="medium" colname="<?php echo $words["full_name"]?>" maxlength="256" notnull=1 value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><span class="required">*</span> <?php echo $words["country"]?>: </td>
                                <td>
									<?php 
										
                                        $colObj = array();
                                        $colObj["scope"] 	= "register";
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
                                <td align="right"><?php echo $words["phone"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="phone" class="medium" colname="<?php echo $words["phone"]?>" maxlength="64" value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo $words["cell"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="cell" class="medium" colname="<?php echo $words["cell"]?>" maxlength="64" value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo $words["address"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="address" class="medium" colname="<?php echo $words["address"]?>" maxlength="256" value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo $words["city"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="city" class="medium" colname="<?php echo $words["city"]?>" maxlength="64" value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo $words["state"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="state" class="medium" colname="<?php echo $words["state"]?>" maxlength="64" value="" /></td>
                            </tr>
                            <tr>
                                <td align="right"><?php echo $words["postal"]?>: </td>
                                <td><input type="text" scope="register" coltype="textbox" name="postal" class="short" colname="<?php echo $words["postal"]?>" maxlength="16" value="" /></td>
                            </tr>
                        </table>                
    				                
                    </td>
                   	<td valign="top" align="left" style="padding-left:20px;">
             			<table>
                            <tr>
                                <td>
									<span class="required">*</span> <?php echo $words["user.type"]?>: <br />
									<?php 
                                        $query = "SELECT * FROM user_group WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, created_time ASC";
										$result_group = $db->query($query);
										$html = '';
										while( $row_group = $db->fetch($result_group) ) {
											$html .= '<label title="' . $row_group[LANG::langCol("desc", $GLang)] . '" scope="register" name="group_id" style="sfont-size:14px;font-weight:bold;">'.
														'<input type="radio" class="lwhCommon-checkbox" ' . 
														'scope="register" ' .
														'name="group_id" ' .
														'col="group_id" ' .
														'colname="' . $words["user.type"] . '" ' .
														'coltype="radio" '.
														'need="1" ' .
														'notnull="1" ' .
														'datatype="number" ' .
														'value="' . $row_group["id"] . '" />';
											$html .= 	'<span class="lwhCommon-checkbox">' . ($sn?$cno . '. ':'') . $row_group[LANG::langCol("title", $GLang)] . '</span>';
											$html .= 	'</label><br>';
											$html .= 	'<div style="display:block; width:200px; color:#333333; font-size:12px; margin-left:20px; padding-bottom:5px;">'. $row_group[LANG::langCol("desc", $GLang)] . '</div>'; 
										}
										echo $html;
                                    ?>
                                </td>
                            </tr>
               			</table>
                    </td>
                 </tr>
                <tr>
                    <td colspan="2" align="center">
                        <br />
                        <input type="button" scope="register" coltype="add" 	id="btn_save" 		value="<?php echo $words["save"]?>" />
                        <input type="button" scope="register" coltype="cancel" 	id="btn_cancel" 	value="<?php echo $words["cancel"]?>" />
                    </td>
                </tr>
            </table>
    	</div>
	</div>
</div>


<div id="publicWebsite_contact" class="lwhWrapBox">
	<div class="lwhWrapBox-content">
    	<div id="publicWebsite_contactus" style="padding:10px;">
	        <span style="font-size:24px; color:#666666;"><?php echo $words["our contact"]?></span><br />
			<a class="contact_phone"></a><span class="contact_text">604-888-9999</span><br />
			<a class="contact_email"></a><span class="contact_text">service@vanchild.com</span><br />
			<a class="contact_webchat"></a><span class="contact_text">vanchild.vancouver</span><br />
			<a class="contact_qq"></a><span class="contact_text">18348343433</span><br />
			<br />
	        <span style="font-size:24px; color:#666666;"><?php echo $words["contact us"]?></span><br />
            <table style="margin-left:20px; font-size:14px;">
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                    <td><input type="text" scope="contactus" coltype="textbox" name="full_name" colname="<?php echo $words["full_name"]?>" class="medium" maxlength="256" notnull=1 value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                    <td><input type="text" scope="contactus" coltype="textbox" name="email" datatype="email" colname="<?php echo $words["email"]?>" class="medium" maxlength="256" notnull=1  value="" /></td>
                </tr>
                <tr>
                    <td align="right"><?php echo $words["phone"]?>: </td>
                    <td><input type="text" scope="contactus" coltype="textbox" name="phone" colname="<?php echo $words["phone"]?>" class="medium" maxlength="64" value="" /></td>
                </tr>
                <tr>
                    <td align="right"><span class="required">*</span> <?php echo $words["subject"]?>: </td>
                    <td><input type="text" scope="contactus" coltype="textbox" name="subject" colname="<?php echo $words["subject"]?>" class="long" maxlength="256" notnull=1 value="" /></td>
                </tr>
                <tr>
                    <td align="right" valign="top"><span class="required">*</span> <?php echo $words["detail"]?>: </td>
                    <td><textarea scope="contactus" coltype="textbox" name="detail" colname="<?php echo $words["detail"]?>" class="long" maxlength="1204" notnull=1 style="height:80px;"></textarea></td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <input type="button" scope="contactus" coltype="add" 		id="btn_save" 		value="<?php echo $words["save"]?>" />
                        <input type="button" scope="contactus" coltype="cancel" 	id="btn_cancel" 	value="<?php echo $words["cancel"]?>" />
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
		$("#publicWebsite_register").lwhWrapBox();
		$("#publicWebsite_contact").lwhWrapBox();		
		
		errMsg = $("#lwhDivBox-publicWebsite-errorMessage").get(0);
		$(errMsg).lwhDivBox();
        errMsg.show = function(msg) {
			$("span.wmliu-common-error-text", $(errMsg)).html(msg);
			$(errMsg).divBoxShow();
		};


		$("#btn-publicRegister").bind("click", function(ev) {
			$("#publicWebsite_register").wrapBoxShow();
		});

		$("#btn-publicContactus").bind("click", function(ev) {
			$("#publicWebsite_contact").wrapBoxShow();
		});
		
		publicRegisterForm = new LWH.FORM({
			head: {
				lang: 	GLang,
				scope: 	"register",
				url:	"func/public_myaccount_apply.php"
			},
			func: {
				after: function(req) {
					if(req.errorCode <= 0) {
						tool_tips(words["submit success"]);
						publicRegisterForm.clear();
						$("#publicWebsite_register").wrapBoxHide();
						
						$("form[name=publicsite_postform]").attr("action", "myaccount.php");
						$("#publicsite_session").val( req.data.sess_id );
						publicsite_postform.submit();
						tool_tips(req.errorMessage);
					}
				},
				cancel: function(cols) {
					$("#publicWebsite_register").wrapBoxHide();
				}
			}
		});
		

		publicContactusFrom = new LWH.FORM({
					head: {
						lang:		GLang,
						scope: 		"contactus",
						url:		"func/public_contactus_save.php",
					},
					func: {
						after: function(req) {
							if(req.errorCode <= 0) {
								tool_tips(words["submit success"]);
								publicContactusFrom.clear();
								$("#publicWebsite_contact").wrapBoxHide();
							}
						},
						cancel: function(cols) {
							$("#publicWebsite_contact").wrapBoxHide();
						}
					}
				});
				
    });
</script>

