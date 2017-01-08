<?php
?>
<script type="text/javascript" language="javascript">
	login = null;
	$(function(){
		$("a.adminsite-lang", "div.top-header-language").bind("click", function(ev) {
			$("#adminsite_lang").val( $(this).attr("lang") );
			adminsite_postform.submit();
		});
		

		login = new LWH.FORM({
					head: {
						lang:		GLang,
						scope: 		"login",
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
	});
	
</script>
<div class="main-header">
	<div class="top-header">
    	<div class="frame-center">
            <div class="top-header-navi">
            	<a class="home" 	href="index.php" title="<?php echo $words["navi.home"];?>"></a>
				<a class="contact"  id="btn-adminContactus"	href="javascript:void(0);" title="<?php echo $words["navi.contact"];?>"></a>
                <a class="back" 	href="<?php echo $_SERVER['HTTP_REFERER'];?>" title="<?php echo $words["navi.back"];?>"></a>
            </div>
            <div class="top-header-language" style="margin-left:10px;">
                <a class="adminsite-lang label-text <?php echo $GLang=="cn"?"lang-selected":"" ?>" lang="cn">简体版</a>
                <span class="seperator">|</span>
                <a class="adminsite-lang label-text <?php echo $GLang=="tw"?"lang-selected":"" ?>" lang="tw">繁体版</a>
                <span class="seperator">|</span>
                <a class="adminsite-lang label-text <?php echo $GLang=="en"?"lang-selected":"" ?>" lang="en">English</a>
            </div>
            <div class="top-header-login">
                <?php if( $admin_user["user_name"] ) { ?>
					<?php echo $words["welcome"] . ": "; ?>	
					<a class="username" href="website_myaccount.php">
					[<?php echo $admin_user["full_name"]?$admin_user["full_name"]:$admin_user["user_name"]; ?>]	
					</a>

					<a class="signout" href="index.php">
					[<?php echo $words["sign out"]?>]	
					</a>

                    <s style="margin-left:10px;"></s>
					<?php echo $words["login.time"] . ": "; ?>	
                    <?php echo $admin_user["last_login"]>0?cTYPE::inttodate($admin_user["last_login"]):""; ?>	
                    <s style="margin-left:10px;"></s>
					<?php echo $words["login.hits"] . ": "; ?>	
					<?php echo $admin_user["hits"]; ?>	
                <?php } else { ?>
                    <span class="label-text"><?php echo $words["user_name"] ?>: </span>
                    <input class="short" type="text" scope="login" name="user_name" coltype="textbox" notnull="1" need="1" style="width:110px; font-size:12px;" colname="<?php echo $words["name.email.phone"]?>" placeholder="<?php echo $words["name.email.phone"] ?>" value="" />
                    <span class="label-text" style="margin-left:10px;"><?php echo $words["password"] ?>: </span>
                    <input class="short" type="password" scope="login" name="password" coltype="textbox"	notnull="1" need="1" minlength="6" colname="<?php echo $words["password"]?>" style="width:70px; font-size:12px;" placeholder="" value="" />
        
                    <input class="button btn-signin"    scope="login"	coltype="save" type="button" value="<?php echo $words["login"] ?>" />
                    <input class="button btn-register"  id="btn-AdminRegister" 	type="button" value="<?php echo $words["register"] ?>" />
        
                    <a class="label-text" style="cursor:pointer; font-size:14px;">[<?php echo $words["forget password"] ?>]</a>
				<?php } ?>
            </div>
        </div>
    </div>
    <div class="frame-center">
    </div>
</div>
<form name="adminsite_postform" action="<?php echo $_SERVER["REQUEST_URI"];?>" method="post">
	<input type="hidden" name="lang" id="adminsite_lang" value="<?php echo $admin_user["lang"];?>" />
	<input type="hidden" name="adminsite_session" id="adminsite_session" value="<?php echo $admin_user["sessid"];?>" />
</form>
