<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
include_once($CFG["include_path"] . "/wliu/secure/secure_client.php");
?>
<!DOCTYPE html>
<html>
<head>
<?php include("public_head_test.php"); ?>

</head>
<body>


<div wliu-nav-bg>
    <div class="container">
        <div wliu-nav>
            <div head>
                <a logo><img src='theme/wliu/company/readings-logo.png' ></a>
                <a text>Administration</a>
                <a menu-button><i class="wliu-btn24 wliu-btn24-menubar"></i></a>
            </div>
            <div menu>
                <ul left>
                    <li style="width:20px;"></li>
                    <li><a href="http://www.dev.com/test.php?id=10">网站主页</a></li>
                    <li><a>DEALS</a></li>
                    <li>

                        <div wliu-dropdown>MY PROFILE <i class="fa fa-caret-down" aria-hidden="true"></i>
                            <ul>
                                <li id="item">AAAAAAAA</li>
                                <li id="item">BBBBBBBB BBB</li>
                                <li><a href="http://www.investx.com">CCCCCCCC</a></li>
                                <li>DDDDDDDD</li>
                            </ul>
                        </div>


                    </li>
                    <li><a>Blob</a></li>
                    <li><a>Contact US</a></li>
                </ul>
                <ul right>
                    <li><a>About</a></li>
                    <li><a>Blog</a></li>
                    <li>
                        <div wliu-dropdown id="my menu">My Profile <i class="fa fa-caret-down" aria-hidden="true"></i>
                            <ul>
                                <li id="item">AAAAAAAA</li>
                                <li>BBBBBBBB BBB</li>
                                <li><a href="http://www.investx.com/index.php">CCCCCCCC</a></li>
                                <li>DDDDDDDD</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>


<div style="display:block; height:2000px; border:1px solid #green;"></div>

<!--
<div class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Sitename</a>
        </div>
        <div class="navbar-collapse collapse" id="navbar-main">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Link</a>
                </li>
                <li><a href="#">Link</a>
                </li>
                <li><a href="#">Link</a>
                </li>
                <li><a href="#">Link</a>
                </li>
                <li><a href="#">Link</a>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown</a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Action</a>
                        </li>
                        <li><a href="#">Another action</a>
                        </li>
                        <li><a href="#">Something else here</a>
                        </li>
                        <li class="divider"></li>
                        <li><a href="#">Separated link</a>
                        </li>
                        <li class="divider"></li>
                        <li><a href="#">One more separated link</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <form class="navbar-form navbar-right" role="search">
                <div class="form-group">
                    <input type="text" class="form-control" name="username" placeholder="Username">
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" name="password" placeholder="Password">
                </div>
                <button type="submit" class="btn btn-default">Sign In</button>
            </form>
        </div>
    </div>
</div>
-->

</body>
</html>