<?php
?>
<script type="text/javascript" language="javascript">
	//var login = null;
	$(function(){
		$("a.publicsite-lang", "div.top-header-language").bind("click", function(ev) {
			$("#publicsite_lang").val( $(this).attr("lang") );
			publicsite_postform.submit();
		});
		
		
		var login = new LWH.FORM({
					lang:		GLang,
					container: ".top-header-login",
					url:		"func/public_login.php"
				});
				
		login.setCallback({
			before: function(data) {
			},
			after: function(req) {
				if( req.errorCode <= 0 ) {
					//$("form[name=publicsite_postform]").attr("action", "<?php echo $CFG["public_welcome_webpage"]?>");
					$("#publicsite_session").val( req.data.sess_id );
					publicsite_postform.submit();
					tool_tips(req.errorMessage);
				}
			}
		})
		
		$(".btn-signin", ".top-header-login").bind("click", function(ev) {
			login.action({action:"save"});
		});


		$("a.signout", ".top-header-login").bind("click", function(ev) {
			$.ajax({
				data: {
					secc:		GSecc,
					lang:		GLang,
					sess:		GSess,
					temp:		GTemp
				},
				dataType: "json",  
				error: function(xhr, tStatus, errorTh ) {
				},
				success: function(req, tStatus) {
					$("form[name=publicsite_postform]").attr("action", "<?php echo $CFG["public_login_webpage"]?>");
					$("#publicsite_session").val("");
					publicsite_postform.submit();
					tool_tips(req.errorMessage);
				},
				type: "post",
				url: "func/public_logout.php"
			});

		});

		$("[name=password]", ".top-header-login").bind("keydown", function(ev) {
			if (ev.keyCode == 13) {
				login.action({action:"save"});
			}
		});
	});
	
</script>
<div class="main-header main-header-mycenter">
	<div class="top-header">
    	<div class="frame-center">
            <div class="top-header-navi">
            	<a class="home" 	href="index.php" title="<?php echo $words["navi.home"];?>"></a>
				<a class="contact" 	href="javascript:void(0);" onclick="publicContact.show()" title="<?php echo $words["navi.contact"];?>"></a>
                <a class="back" 	href="<?php echo $_SERVER['HTTP_REFERER'];?>" title="<?php echo $words["navi.back"];?>"></a>
            </div>
            <div class="top-header-language" style="margin-left:10px;">
                <a class="publicsite-lang label-text <?php echo $GLang=="cn"?"lang-selected":"" ?>" lang="cn">简体版</a>
                <span class="seperator">|</span>
                <a class="publicsite-lang label-text <?php echo $GLang=="tw"?"lang-selected":"" ?>" lang="tw">繁体版</a>
                <span class="seperator">|</span>
                <a class="publicsite-lang label-text <?php echo $GLang=="en"?"lang-selected":"" ?>" lang="en">English</a>
            </div>
            <div class="top-header-login">
                <?php if( $public_user["user_name"] ) { ?>
					<?php echo $words["welcome"] . ": "; ?>	
					<a class="username" href="myaccount.php">
					[ <?php echo $public_user["full_name"]?$public_user["full_name"]:$public_user["user_name"]; ?> ]	
					</a>

					<a class="mycenter" href="mycenter.php">
					[ <?php echo $words["my center"]?> ]	
					</a>

					<a class="signout">
					[ <?php echo $words["sign out"]?> ]	
					</a>

					<!--
                    <s style="margin-left:10px;"></s>
					<?php echo $words["login.time"] . ": "; ?>	
                    <?php echo $public_user["last_login"]>0?cTYPE::inttodate($public_user["last_login"]):""; ?>	
                    <s style="margin-left:10px;"></s>
					<?php echo $words["login.hits"] . ": "; ?>	
					<?php echo $public_user["hits"]; ?>	
             		-->
             
                <?php } else { ?>
                    <span class="label-text"><?php echo $words["user_name"] ?>: </span>
                    <input type="text" name="user_name" 	notnull="1" style="width:110px; font-size:12px;" colname="<?php echo $words["name.email.phone"]?>" placeholder="<?php echo $words["name.email.phone"] ?>" value="" />
                    <span class="label-text" style="margin-left:10px;"><?php echo $words["password"] ?>: </span>
                    <input type="password" name="password" 	notnull="1" minlength="6" colname="<?php echo $words["password"]?>" style="width:70px; font-size:12px;" placeholder="" value="" />
        
                    <input class="button btn-signin" 	type="button" value="<?php echo $words["login"] ?>" />
                    <input class="button btn-register" 	type="button" onclick="publicRegister.show()" value="<?php echo $words["register"] ?>" />
        
                    <a class="label-text" style="cursor:pointer; font-size:14px;">[<?php echo $words["forget password"] ?>]</a>
				<?php } ?>
            </div>
        </div>
    </div>
    <div class="frame-center">
    </div>
</div>
<form name="publicsite_postform" action="<?php echo $_SERVER["REQUEST_URI"];?>" method="post">
	<input type="hidden" name="lang" id="publicsite_lang" value="<?php echo $public_user["lang"];?>" />
	<input type="hidden" name="publicsite_session" id="publicsite_session" value="<?php echo $public_user["sessid"];?>" />
	<input type="hidden" name="publicsite_backurl" id="publicsite_backurl" value="<?php echo $backurl?$backurl:($_SERVER['HTTP_REFERER']?$_SERVER['HTTP_REFERER']:$_SERVER["REQUEST_URI"]);?>" />
</form>
