<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
include_once($CFG["include_path"] . "/wliu/secure/secure_client.php");
$sess_name = $_SERVER['HTTP_HOST'] . ".user.session";
$_SESSION[$sess_name] = "";

$a = "/dkdkd.php?id=39343";
$b = substr($a, 0, strpos($a, "?"));
echo "b= $b <br>";

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf8" />
    <!-- JQuery3.1.1 -->
    <script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery.cookie.1.4.1.js"></script>
    <script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
    <link href='<?php echo $CFG["web_domain"]?>/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css' rel='stylesheet' type='text/css'>
    <!-- //JQuery -->

    <!-- Font Awesome & BS & MDB -->
    <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css' rel='stylesheet' />
    <link 	href='<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/css/bootstrap.min.css' type='text/css' rel='stylesheet' />
    <link href='<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/css/mdb.css' type='text/css' rel='stylesheet' />
    
    <!-- Bootstrap3.3 -->
    <script src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/tether.min.js" type="text/javascript"></script>
    <script src="<?php echo $CFG["web_domain"]?>/theme/bootstrap4.0/js/bootstrap.min.js" type="text/javascript"></script>    
    <!-- //Bootstrap -->

    <!--
    <link href='theme/mdb_pro/css/woocommerce.css' rel='stylesheet' type='text/css'>
    <link href='theme/mdb_pro/css/woocommerce-layout.css' rel='stylesheet' type='text/css'>
    <link href='theme/mdb_pro/css/woocommerce-smallscreen.css' rel='stylesheet' type='text/css'>
    -->
    <!-- //MD Bootstrap -->

    <!-- AngularJS 1.3.15 -->
    <script	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular.js" type="text/javascript"></script>
    <script	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-cookies.js" type="text/javascript"></script>
    <script src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-sanitize.min.js" type="text/javascript"></script>
    <!-- //AngularJS -->


    <!-- wliu components -->
    <script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.common.js" type="text/javascript"></script>
    <script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.table.common.js" type="text/javascript"></script>
    <script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.form.js" type="text/javascript"></script>
  

    <script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.js" type="text/javascript"></script>
    <link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/diag/wliu.jquery.diag.css' type='text/css' rel='stylesheet' />
    <script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.js" type="text/javascript"></script>
    <link 	href='<?php echo $CFG["web_domain"]?>/jquery/wliu/popup/wliu.jquery.popup.css' type='text/css' rel='stylesheet' />
    <script src="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.js" type="text/javascript"></script>
    <link 	href="<?php echo $CFG["web_domain"]?>/jquery/wliu/load/wliu.jquery.load.css" type='text/css' rel='stylesheet' />

    <!-- wliu components -->
    <script src="<?php echo $CFG["web_domain"]?>/js/wliu/wliu.common.js" type="text/javascript"></script>
	<link href='<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.buttons.css' type='text/css' rel='stylesheet' />
    <!-- //wliu components -->
    <script>
        var col101 = new WLIU.COL({key:1, coltype:"hidden", 	name:"id", 			colname:"User ID",  	coldesc:"User ID"});
        var col102 = new WLIU.COL({key:0, coltype:"textbox", 	name:"user_name", 	colname:"User Name", 	coldesc:"Login User",       maxlength:64,   notnull:1, unique:1, defval:""});
        var col103 = new WLIU.COL({key:0, coltype:"textbox", 	name:"email",		colname:"Email", 		coldesc:"Email Address",    maxlength:256,  notnull:1, unique:1, datatype:"EMAIL" });
        var col104 = new WLIU.COL({key:0, coltype:"textbox", 	name:"first_name", 	colname:"First Name", 	coldesc:"First Name",		maxlength:64, 	notnull:1,  defval: ""});
        var col105 = new WLIU.COL({key:0, coltype:"textbox", 	name:"last_name", 	colname:"Last Name", 	coldesc:"Last Name",		maxlength:64, 	notnull:1, defval: ""	});
        var col106 = new WLIU.COL({key:0, coltype:"textbox", 	name:"phone", 	    colname:"Phone", 		coldesc:"Phone", 			maxlength:64,   notnull:0 });
        var col107 = new WLIU.COL({key:0, coltype:"select", 	name:"country",		colname:"Country",  	coldesc:"Country"});
        var col108 = new WLIU.COL({key:0, coltype:"passpair",   name:"password",    colname:"Password"});

        var cols1 = [];
        cols1.push(col101);
        cols1.push(col102);
        cols1.push(col103);
        cols1.push(col104);
        cols1.push(col105);
        cols1.push(col106);
        cols1.push(col107);
        cols1.push(col108);

        var registerForm = new WLIU.FORM({
            lang:	 	GLang,
            scope: 		"register",
            url:   		"ajax/admin_register_action.php",
            cols: 		cols1
        });

        var col201 = new WLIU.COL({key:0, coltype:"textbox", 	name:"login_user", 	    colname:"Login User",  	    maxlength:64,   notnull:1, defval: ""});
        var col202 = new WLIU.COL({key:0, coltype:"textbox", 	name:"login_password", 	colname:"Login Password", 	maxlength:16,   notnull:1, defval:""});
        var col203 = new WLIU.COL({key:0, coltype:"hidden", 	name:"url", 	        colname:"Return URL"});
        var cols2  = [];
        cols2.push(col201);
        cols2.push(col202);
        cols2.push(col203);
        
        var loginForm = new WLIU.FORM({
            lang:	 	GLang,
            scope: 		"login",
            url:   		"ajax/admin_login_action.php",
            cols: 		cols2
        });        

        console.log(registerForm);
    $(function(){
        $('.mdb-select').material_select();
        registerForm.resetData();
        loginForm.resetData();
    });
    function login() {
        loginForm.addData();
    }
    function addData() {
        registerForm.addData();
    }
    </script>
</head>
<body>
<!-- container -->
<div class="container">
    <!--<div wliu-form-message></div>-->
    <!--Form without header-->
    <div class="row">
        <div class="col-md-2 col-xs-0">
        </div>
        <div class="col-md-8 col-xs-12">
                <!--Rotating card-->
                <div class="card-wrapper">
                    <div id="card-1" class="card-rotating effect__click">

                        <!--Front Side-->
                        <div class="face front" style="height:720px;">

                            <!-- Image-->
                            <div class="card-up" style="height:100px;padding:15px;">
                                <img src="<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.background/wliu-cloud-1.jpg" class="img-fluid">
                            </div>
                            <!--Avatar-->
                            <div class="avatar"><img src="<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.common/login-user.png" class="rounded-circle img-responsive">
                            </div>
                            <!--Content-->
                            <div class="card-block">
                                    <!--Header-->
                                    <div class="text-center">
                                        <h3><i class="fa fa-lock"></i> <?php echo gwords("login")?></h3>
                                        <hr class="mt-2 mb-2">
                                    </div>

                                    <!--Body-->
                                    <div class="md-form text-left">
                                        <i class="fa fa-envelope prefix"></i>
                                        <input type="hidden"    scope="login"   name="url" value="<?php echo $_REQUEST["url"];?>">
                                        <input type="text"      scope="login"   name="login_user" id="login_user" class="form-control">
                                        <label for="login_user">
                                            Your Email or User Name
                                            <a wliu-form-col-error scope="login" name="login_user"></a>
                                        </label>
                                    </div>

                                    <div class="md-form  text-left">
                                        <i class="fa fa-lock prefix"></i>
                                        <input type="password" scope="login" name="login_password" id="login_password" class="form-control">
                                        <label for="login_password">
                                            Your password
                                            <a wliu-form-col-error scope="login" name="login_password"></a>
                                        </label>
                                    </div>

                                    <div class="text-center">
                                        <button class="btn btn-deep-purple" onclick="login()">Login</button>
                                    </div>

                                <!--Triggering button-->
                                <a class="rotate-btn" data-card="card-1"><i class="fa fa-repeat"></i>&nbsp;&nbsp;<?php echo gwords("not.a.member")?> ? <span style="color:#0275d8;"><?php echo gwords("register")?></span></a>
                                <p><?php echo gwords("forget")?> <a href="#"><?php echo gwords("password")?> ?</a></p>

                            </div>
                        </div>
                        <!--/.Front Side-->

                        <!--Back Side-->
                        <div class="face back" style="height:720px;">

                            <!-- Image-->
                            <div class="card-up" style="height:100px;">
                                <img src="<?php echo $CFG["web_domain"]?>/theme/wliu/wliu.background/wliu-flower-1.jpg" class="img-fluid">
                            </div>

                            <div class="card-block">
                                <!--Header-->
                                <div class="text-center">
                                    <h3><i class="fa fa-user"></i> <?php echo gwords("register")?></h3>
                                    <input type="hidden" scope="register" name="id" value="" />
                                </div>
                                <!--Body-->
                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="user_name" id="user_name" class="form-control" value="">
                                            <label for="user_name">
                                                Login Name
                                                <a wliu-form-col-error scope="register" name="user_name"></a>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="first_name" id="first_name" class="form-control">
                                            <label for="first_name">
                                                First Name
                                                <a wliu-form-col-error scope="register" name="first_name"></a>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="email" id="email" class="form-control">
                                            <label for="email">
                                                Your Email
                                                <a wliu-form-col-error scope="register" name="email"></a>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="last_name" id="last_name" class="form-control">
                                            <label for="last_name">
                                                Last Name
                                                <a wliu-form-col-error scope="register" name="last_name"></a>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="password" scope="register" name="password" id="password" class="form-control">
                                            <label for="password">
                                                Your password
                                                <a wliu-form-col-error scope="register" name="password"></a>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="phone" id="phone" class="form-control">
                                            <label for="phone">
                                                Phone
                                                <a wliu-form-col-error scope="register" name="phone"></a>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="password" scope="register" name="confirm_password" id="confirm_password" class="form-control">
                                            <label for="confirm_password">
                                                Confirm password
                                                <a wliu-form-col-error scope="register" name="confirm_password"></a>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6 text-left">
                                            <div style="margin-top:5px;">
                                                <select class="mdb-select" scope="register" name="country">
                                                    <option value="">Choose your live in country</option>
                                                    <option value="1">United State</option>
                                                    <option value="2">China</option>
                                                    <option value="3">Canada</option>
                                                </select>
                                            </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-indigo" onclick="addData()">Sign up</button>
                                </div>

                                <a class="rotate-btn" data-card="card-1"><i class="fa fa-undo"></i>&nbsp;&nbsp;<?php echo gwords("click.here.back.to")?> <span style="color:#0275d8;"><?php echo gwords("login")?></span></a>
                            </div>
                        </div>
                        <!--/.Back Side-->

                    </div>
                </div>
                <!--/.Rotating card-->               
        </div>
    </div>
    <!--/Form without header-->
</div>

<div 

<div wliu-form-popup></div>
<div wliu-autotip></div>
<div wliu-wait></div>



<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>