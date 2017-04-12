<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
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
    <!-- //wliu components -->
    <script>
    $(function(){
        $('.mdb-select').material_select();
    });
    </script>
</head>
<body>
<!-- container -->
<div class="container">
    <br>
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
            <div class="card-up" style="height:100px;">
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
                        <input type="text" id="form2" class="form-control">
                        <label for="form2">Your Email or User Name</label>
                    </div>

                    <div class="md-form  text-left">
                        <i class="fa fa-lock prefix"></i>
                        <input type="password" id="form4" class="form-control">
                        <label for="form4">Your password</label>
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
                </div>
                <!--Body-->
                <div class="row">
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="text" id="login_name" class="form-control">
                            <label for="login_name">Login Name</label>
                        </div>
                    </div>
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="text" id="first_name" class="form-control">
                            <label for="first_name">First Name</label>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="text" id="email" class="form-control">
                            <label for="email">Your Email</label>
                        </div>
                    </div>
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="text" id="last_name" class="form-control">
                            <label for="last_name">Last Name</label>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="password" id="password" class="form-control">
                            <label for="password">Your password</label>
                        </div>
                    </div>
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="text" id="phone" class="form-control">
                            <label for="phone">Phone</label>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 col-xs-6">
                        <div class="md-form">
                            <input type="password" id="form4" class="form-control">
                            <label for="form4">Confirm password</label>
                        </div>
                    </div>
                    <div class="col-md-6 col-xs-6 text-left">
                            <div style="margin-top:5px;">
                                <select class="mdb-select">
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

<!-- MD Bootstrap 4.0 js -- must place at the end of body -->
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/theme/mdb4.3.1/js/mdb.min.js"></script>
<!-- <script type="text/javascript" src="theme/mdb_pro/js/woocommerce.min.js"></script> -->
<!-- //MD Bootstrap 4.0 js -->
</body>
</html>