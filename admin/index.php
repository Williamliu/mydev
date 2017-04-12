<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
include_once($CFG["include_path"] . "/wliu/secure/secure_client.php");
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
        var col1 = new WLIU.COL({coltype:"hidden", 		name:"id", 			colname:"Lang ID",  	coldesc:"Word ID",          defval: 100});
        var col2 = new WLIU.COL({coltype:"textbox", 	name:"user_name", 	colname:"User Name", 	coldesc:"Login User",       maxlength:64,   notnull:1, defval:"Wmliu"});
        var col3 = new WLIU.COL({coltype:"textbox", 	name:"email",		colname:"Email", 		coldesc:"Email Address",    maxlength:256,  notnull:1, datatype:"EMAIL" });
        var col4 = new WLIU.COL({coltype:"textbox", 	name:"first_name", 	colname:"First Name", 	coldesc:"First Name",		maxlength:64, 	notnull:1,  defval: "William"});
        var col5 = new WLIU.COL({coltype:"textbox", 	name:"last_name", 	colname:"Last Name", 	coldesc:"Last Name",		maxlength:64, 	notnull:1, defval: "Liu"	});
        var col6 = new WLIU.COL({coltype:"textbox", 	name:"phone", 	    colname:"Phone", 		coldesc:"Phone", 			maxlength:64,   notnull:0 });
        var col7 = new WLIU.COL({coltype:"bool", 		name:"status",		colname:"Active?",  	coldesc:"Active Status",    defval: 1});
        var col8 = new WLIU.COL({coltype:"select", 	    name:"country",		colname:"Country",  	coldesc:"Country",          defval: 2});
        var col9 = new WLIU.COL({coltype:"passpair", 	name:"password",    colname:"Password", defval:111111});

        var cols = [];
        cols.push(col1);
        cols.push(col2);
        cols.push(col3);
        cols.push(col4);
        cols.push(col5);
        cols.push(col6);
        cols.push(col7);
        cols.push(col8);
        cols.push(col9);

        var form = new WLIU.FORM({
            lang:	 	GLang,
            scope: 		"register",
            url:   		"ajax/index_ajax.php",
            wait:   	"ajax_wait",
    		autotip: 	"auto_tips",
            cols: 		cols
        });

        console.log(form);
    $(function(){
        $('.mdb-select').material_select();
        form.initData();
    });

    function getddd() {
        form.postData();
    }
    </script>
</head>
<body>
<!-- container -->
<div class="container">
    <br>
    <button onclick="getddd()">Get Data</button><br>
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
                                        <h3><i class="fa fa-lock"></i> Login:</h3>
                                        <hr class="mt-2 mb-2">
                                    </div>

                                    <!--Body-->
                                    <div class="md-form text-left">
                                        <i class="fa fa-envelope prefix"></i>
                                        <input type="text" scope="login" name="login_user" id="login_user" class="form-control">
                                        <label for="login_user">Your Email or User Name</label>
                                    </div>

                                    <div class="md-form  text-left">
                                        <i class="fa fa-lock prefix"></i>
                                        <input type="password" scope="login" name="login_password" id="login_password" class="form-control">
                                        <label for="login_password">Your password</label>
                                    </div>

                                    <div class="text-center">
                                        <button class="btn btn-deep-purple">Login</button>
                                    </div>

                                <!--Triggering button-->
                                <a class="rotate-btn" data-card="card-1"><i class="fa fa-repeat"></i> Not a member? <span style="color:#0275d8;">Sign Up</span></a>
                                <p>Forgot <a href="#">Password?</a></p>

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
                                    <h3><i class="fa fa-user"></i> Register:</h3>
                                    <input type="hidden" scope="register" name="id" value="" />
                                </div>
                                <!--Body-->
                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="user_name" id="user_name" class="form-control">
                                            <label for="user_name">Login Name</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="first_name" id="first_name" class="form-control">
                                            <label for="first_name">First Name</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="email" id="email" class="form-control">
                                            <label for="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="last_name" id="last_name" class="form-control">
                                            <label for="last_name">Last Name</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="password" scope="register" name="password" id="password" class="form-control">
                                            <label for="password">Your password</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="text" scope="register" name="phone" id="phone" class="form-control">
                                            <label for="phone">Phone</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 col-xs-6">
                                        <div class="md-form">
                                            <input type="password" scope="register" name="confirm_password" id="confirm_password" class="form-control">
                                            <label for="confirm_password">Confirm password</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-xs-6 text-left">
                                            <div style="margin-top:5px;">
                                                <select class="mdb-select" scope="register" name="country">
                                                    <option value="" selected>Choose your live in country</option>
                                                    <option value="1">United State</option>
                                                    <option value="2">China</option>
                                                    <option value="3">Canada</option>
                                                </select>
                                            </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-indigo">Sign up</button>
                                </div>

                                <a class="rotate-btn" data-card="card-1"><i class="fa fa-undo"></i> Click here back to <span style="color:#0275d8;">login</span></a>
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


<div id="table_error" wliu-diag movable maskable></div>
<div id="auto_tips" wliu-tips></div>



<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>