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
<script>
</script>
<style>
 @media screen {
    ul[wliu-nav] {
        display:block;
        border: 1px solid red;
        padding: 0px;
        margin:  0px;
    }
    ul[wliu-nav][left] {
        float:left;
    }
    ul[wliu-nav][right] {
        float:right;
    }

    ul[wliu-nav] li {
       display:block;
       float:left;
       margin:5px; 
    }

    div[head] {
        display:block;
        float: left;
        vertical-align: middle;
        line-height:100%;
        border: 1px solid orange;
        box-sizing: border-box;
    }
    div[head] a[logo] {
        display:block;
        float: left;
        border: 1px solid yellow;
        vertical-align: middle;
    }

    div[menu] {
        display:block;
        float; none;
        border: 1px solid blue;
        vertical-align: middle;
    }
   div[head] i[button] {
        display: none;
        float: right;
        margin: 8px 0px;
        border: 1px solid red;
    }
}


 @media screen and (max-width: 600px) {
    div[head] {
        display:block;
        float: none;
        height: 50px;
        line-height:50px;
        border: 1px solid orange;
    }
     div[head] a[logo] {
        display:block;
        float: left;
        border: 1px solid yellow;
        vertical-align: middle;
    }
   div[head] i[button] {
        display: block;
    }

    div[menu] {
        display: none;
    }

    ul[wliu-nav][left] {
        float:none;
    }
    ul[wliu-nav][right] {
        float:none;
    }

    ul[wliu-nav] li {
       float:none;
    }

}
    
</style>
</head>
<body>

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

<div style="display:block;background-color:#cccccc; margin-top:200px;">
    <div class="container" style="margin-top:100px;border:1px solid green;">
        <div head>
            <i button class="fa fa-camera-retro fa-2x"></i>
            <a logo>HELLO WORLD</a>
        </div>
        <div menu>
            <ul wliu-nav left>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
            </ul>
            <ul wliu-nav right>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
                <li>11111111</li>
            </ul>
        </div>
    </div>
</div>
</body>
</html>