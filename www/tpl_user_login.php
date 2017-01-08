<script language="javascript" type="text/javascript">
    $(function () {
		puser_required_register = new LWH.FORM({
					head: {
						lang:	GLang,
						scope:	"puser_required_form",
						url: 	"func/public_myaccount_apply.php"
					},
					func: {
						after: function(req) {
							if(req.errorCode <= 0) {
								tool_tips(words["submit success"]);
								puser_required_register.clear();
								
								//$("form[name=publicsite_postform]").attr("action", "myaccount.php");
								$("#publicsite_session").val( req.data.sess_id );
								publicsite_postform.submit();
								tool_tips(req.errorMessage);
							}
						}
					}
				});
		
		
		puser_required_login = new LWH.FORM({
					head: {
						lang:	GLang,
						scope:	"puser_required_login",
						url:	"func/public_login.php"
					},
					func: {
						after: function(req) {
							if( req.errorCode <= 0 ) {
								$("#publicsite_session").val( req.data.sess_id );
								publicsite_postform.submit();
								tool_tips(req.errorMessage);
							}
						}
					}
				});
				
		
		$("[name=password]", "#puser_required_login").bind("keydown", function(ev) {
			if (ev.keyCode == 13) {
				puser_required_login.formSave();
			}
		});

		$("[name=user_name]", "#puser_required_login").bind("keydown", function(ev) {
			if (ev.keyCode == 13) {
				$("[name=password]", "#puser_required_login").focus();
			}
		});
		
		$("#btn-register-user").bind("click", function(ev) {
			$("#div_login").hide();
			$("#div_register").show();
		});
    });

	function puser_required_register_cancel_ajax() {
		$("#div_login").show();
		$("#div_register").hide();
	}
</script>

<center>	
			<div id="div_login">
                    <div class="lwhTab9 lwhTab9-mint" style="display:inline-block;">
                        <ul >
                            <li class="selected"><?php echo $words["exist.account.login"]; ?><s></s></li>
                        </ul>   
                        <div class="lwhTab9-border" style="display:block; padding:30px;">
                                        <table id="puser_required_login">
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                                <td><input type="text" scope="puser_required_login" coltype="textbox" name="user_name" class="medium" need="1" notnull="1" colname="<?php echo $words["name.email.phone"]?>" placeholder="<?php echo $words["name.email.phone"] ?>" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td align="right"><span class="required">*</span> <?php echo $words["password"]?>: </td>
                                                <td><input type="password" scope="puser_required_login" coltype="textbox" name="password" class="medium" colname="<?php echo $words["password"]?>" need="1" notnull=1 minlength="6" value="" /></td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" align="center"><input type="button" scope="puser_required_login" coltype="save" value="<?php echo $words["login"]?>" /></td>
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
                        <div class="lwhTab9-border" style="display:block; padding:20px;">
                                <table id="puser_required_form" style="border-collapse:collapse;">
                                    <tr>
                                        <td valign="top" align="right">
                                            
                                            <table>
                                                <tr>
                                                    <td align="right"><span class="required">*</span> <?php echo $words["email"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="email" datatype="email" colname="<?php echo $words["email"]?>" class="medium" maxlength="256" notnull=1  value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><span class="required">*</span> <?php echo $words["user_name"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="user_name" colname="<?php echo $words["user_name"]?>" class="medium" maxlength="64" notnull=1  value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><span class="required">*</span> <?php echo $words["password"]?>: </td>
                                                    <td>
                                                        <input type="password" scope="puser_required_form" coltype="password" name="password" colname="<?php echo $words["password"]?>" class="short" minlength=6 maxlength="16" notnull=1 value="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><span class="required">*</span> <?php echo $words["password.confirm"]?>: </td>
                                                    <td>
                                                        <input type="password" scope="puser_required_form" coltype="password_confirm" name="password_confirm" colname="<?php echo $words["password.confirm"]?>" class="short" minlength=6 maxlength="16" notnull=1 value="" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2"><br /></td>
                                                </tr>
                    
                                                <tr>
                                                    <td valign="top"  align="right"><span class="required">*</span> <?php echo $words["anonym"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="anonym" colname="<?php echo $words["anonym"]?>" class="short" maxlength="64" notnull=1 value="" /></td>
                                                </tr>
                                           
                                               <tr>
                                                    <td valign="top"  align="right"><span class="required">*</span> <?php echo $words["full_name"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="full_name" colname="<?php echo $words["full_name"]?>" class="medium" maxlength="256" notnull=1 value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><span class="required">*</span> <?php echo $words["country"]?>: </td>
                                                    <td>
                                                        <?php 
                                                            
                                                            $colObj = array();
                                                            $colObj["scope"] 	= "puser_required_form";
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
                                                    <td align="right"><?php echo $words["phone"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="phone" colname="<?php echo $words["phone"]?>" class="medium" maxlength="64" value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><?php echo $words["cell"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="cell" colname="<?php echo $words["cell"]?>" class="medium" maxlength="64" value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><?php echo $words["address"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="address" colname="<?php echo $words["address"]?>" class="medium" maxlength="256" value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><?php echo $words["city"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="city" colname="<?php echo $words["city"]?>" class="medium" maxlength="64" value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><?php echo $words["state"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="state" colname="<?php echo $words["state"]?>" class="medium" maxlength="64" value="" /></td>
                                                </tr>
                                                <tr>
                                                    <td align="right"><?php echo $words["postal"]?>: </td>
                                                    <td><input type="text" scope="puser_required_form" coltype="textbox" name="postal" colname="<?php echo $words["postal"]?>" class="short" maxlength="16" value="" /></td>
                                                </tr>
                                            </table>                
                                                        
                                        </td>
                                        <td valign="top" align="left" style="padding-left:20px;">
                                            <table>
                                                <tr>
                                                    <td>
                                                        <span class="required">*</span> <?php echo $words["user.type"]?>: <br />
                                                        <div>
                                                        <?php 
                                                            $query = "SELECT * FROM user_group WHERE deleted <> 1 AND status = 1 ORDER BY orderno DESC, created_time ASC";
                                                            $result_group = $db->query($query);
                                                            $html = '';
                                                            while( $row_group = $db->fetch($result_group) ) {
                                                                $html .= '<label title="' . $row_group[LANG::langCol("desc", $GLang)] . '" style="sfont-size:14px;font-weight:bold;">'.
                                                                            '<input type="radio" class="data-checkbox-el" ' . 
                                                                            'scope="puser_required_form" ' .
                                                                            'name="group_id" ' .
                                                                            'colname="' . $words["user.type"] . '" ' .
                                                                            'coltype="radio" '.
                                                                            'notnull="1" ' .
                                                                            'value="' . $row_group["id"] . '" />';
                                                                $html .= 	'<span class="data-checkbox-el">' . ($sn?$cno . '. ':'') . $row_group[LANG::langCol("title", $GLang)] . '</span>';
                                                                $html .= 	'</label><br>';
                                                                $html .= 	'<div style="display:block; width:200px; color:#333333; font-size:12px; margin-left:20px; padding-bottom:5px;">'. $row_group[LANG::langCol("desc", $GLang)] . '</div>'; 
                                                            }
                                                            echo $html;
                                                        ?>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                     </tr>
                                    <tr>
                                        <td colspan="2" align="center">
                                            <br />
                                            <input type="button" scope="puser_required_form" coltype="add" 		value="<?php echo $words["save"]?>" />
                                            <input type="button" scope="puser_required_form" coltype="cancel" 	onclick="puser_required_register_cancel_ajax()" 	value="<?php echo $words["cancel"]?>" />
                                        </td>
                                    </tr>
                                </table>
                        </div>
                    </div>  
            </div>                        
</center>