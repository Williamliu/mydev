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
    div[wliu-nav-bg] {
        display:            block;
        border-bottom:      0px solid #cccccc; 
        background-color:   #ffffff;
        box-shadow:         0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }
    div[wliu-nav-bg][fixed] {
        width:              100%;
        position:           fixed;
    } 
    div[wliu-nav] {
        display:        block;
        height:         60px;
        box-sizing:     border-box;
        padding:        0px;
        margin:         0px;   
    }

    div[wliu-nav] > div[head] {
        display:        block;
        float:          left;
        height:         100%;
        /*
        border:         1px solid green;
        */
    }
    
    div[wliu-nav] > div[head] > a:before {
        display:        inline-block;
        content:        " ";
        width:          0px;
        height:         100%;
        vertical-align: middle;
    }
    div[wliu-nav] > div[head] > a[logo] {
        display:        block;
        float:          left;
        font-size:      24px;
        font-weight:    bold;
        /*
        border:         1px solid yellow;
        */
        vertical-align: middle;
    }
    div[wliu-nav] > div[head] > a[menu-button] {
        display:        none;
        float:          right;
        /*
        border:         1px solid red;
        */
        vertical-align: middle;
    }

    div[wliu-nav] > div[menu] {
        display:            block;
        float:              none;
        /*
        border:             1px solid blue;
        */
        background-color:   #ffffff;
        vertical-align:     middle;
        box-shadow:         0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        z-index:            999;
        
    }

    div[wliu-nav] > div[menu][active] {
        display:                    block;

        animation-name:             example;
        animation-duration:         0.6s;
        animation-timing-function:  cubic-bezier(0.735, 0.275, 0.220, 1);
    }    

    div[wliu-nav] > div[menu] > ul {
        display:        block;
        padding:        0px;
        margin:         0px;
        margin-top:     14px;
        vertical-align: middle;
        /*
        border:         1px solid red;
        */
    }

    div[wliu-nav] > div[menu] > ul[left] {
        float:          left;
    }
    div[wliu-nav] > div[menu] > ul[right] {
        float:          right;
    }
    div[wliu-nav] > div[menu] > ul > li {
       display:         block;
       float:           left;
       margin:          4px 8px; 
       vertical-align:  middle;
       /*
       border:          1px solid red;
       */
    }

    div[wliu-nav] > div[menu] > ul > li > * {
       font-size:       16px;
       font-weight:     600;
       color:           #666666;
       cursor:          pointer;
       /*
       border:          1px solid green;
       */
    }

    div[wliu-nav] > div[menu] > ul > li > *:hover {
       color:           #000000;
    }
    
}


@media screen and (max-width: 600px) {
    div[wliu-nav] > div[head] {
        display:        block;
        float:          none;
        /*
        border:         1px solid orange;
        */
    }
 
    div[wliu-nav] > div[head] > a[menu-button] {
        display:        block;
    }
    div[wliu-nav] > div[menu] {
        display:        none;
    }
    div[wliu-nav] > div[menu] > ul {
        margin:         0px;
    }
    div[wliu-nav] > div[menu] > ul[left] {
        float:          none;
        margin:         0px;
    }
    div[wliu-nav] > div[menu] > ul[right] {
        float:          none;
    }
    div[wliu-nav] > div[menu] > ul > li {
       float:           none;
    }

}

div[wliu-dropdown] {
    display:                    inline-block;
    position:                   relative;
}

div[wliu-dropdown] > ul {
    display:                    none;
    position:                   absolute;
    padding:                    5px;
    margin:                     0px;
    margin-top:                 5px;
    background-color:           #ffffff;
    list-style-type:            none;
    box-shadow:                 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    z-index:                    999;

    animation-name:             example;
    animation-duration:         0.6s;
    animation-timing-function:  cubic-bezier(0.735, 0.275, 0.220, 1);
}

div[wliu-dropdown] > ul > li {
    display:            block;
    position:           relative;
    padding:            0px;
    margin:             4px;
    background-color:   #ffffff;
    list-style-type:    none;
    white-space:        nowrap;
    color:              #666666;
    font-size:          14px;
    font-weight:        500;
}

div[wliu-dropdown] > ul > li:hover {
    color:              #000000;
}

div[wliu-dropdown][active] > ul {
    display:            block;
}

@media screen and (max-width: 600px) {
    div[wliu-nav] > div[head] {
        display:        block;
        float:          none;
        /*
        border:         1px solid orange;
        */
    }
 
    div[wliu-nav] > div[head] > a[menu-button] {
        display:        block;
    }
    div[wliu-nav] > div[menu] {
        display:        none;
    }
    div[wliu-nav] > div[menu] > ul {
        margin:         0px;
    }
    div[wliu-nav] > div[menu] > ul[left] {
        float:          none;
        margin:         0px;
    }
    div[wliu-nav] > div[menu] > ul[right] {
        float:          none;
    }
    div[wliu-nav] > div[menu] > ul > li {
       float:           none;
    }



    div[wliu-dropdown] > ul {
        position:       relative;
        box-shadow:     none;
        margin-top:     0px;
    }
}






@keyframes example {
    from    { opacity: 0;}
    to      { opacity: 1; }
    /*
    to      { opacity: 0.8; }
    0%      { opacity: 0}
    25%     { opacity: 0.1}
    50%     { opacity: 0.2}
    100%    { opacity: 0.6}
    */
}    
</style>
<script>
    $(function(){
        $(document).off("click.wliu-dropdown", "div[wliu-dropdown]").on("click.wliu-dropdown", "div[wliu-dropdown]", function(evt){
            if( $(this).hasAttr("active") ) {
                $(this).removeAttr("active");
            } else {
                $("div[wliu-dropdown]").removeAttr("active");
                $(this).addAttr("active");
            }
        });

        $(document).off("click.wliu-nav", "div[wliu-nav] > div[head] > a[menu-button]").on("click.wliu-nav", "div[wliu-nav] > div[head] > a[menu-button]", function(evt){
            if( $("div[menu]", $(this).closest("div[wliu-nav")).hasAttr("active") ) {
                $("div[menu]", $(this).closest("div[wliu-nav")).removeAttr("active");
            } else {
                $("div[menu]", $(this).closest("div[wliu-nav")).addAttr("active");
            }
        });


        $("body").unbind("click.wliu-dropdown").bind("click.wliu-dropdown", function(evt){
            //console.log("body click: " + $(evt.target).hasAttr("wliu-dropdown") + " : " + $(evt.target).parents("[wliu-dropdown]").length);
            if( !$(evt.target).hasAttr("wliu-dropdown") && $(evt.target).parents("[wliu-dropdown]").length <= 0 ) {
                $("div[wliu-dropdown][active]").removeAttr("active");
            }
        });
    });
</script>
</head>
<body>


<div wliu-nav-bg>
    <div class="container">
        <div wliu-nav>
            <div head>
                <a logo><img src='http://dev-admin.investx.com/Images/logo.png' ></a>
                <a menu-button><i class="wliu-btn24 wliu-btn24-menubar"></i></a>
            </div>
            <div menu>
                <ul left>
                    <li style="width:20px;"></li>
                    <li><a>Home</a></li>
                    <li><a>Deals</a></li>
                    <li>

                        <div wliu-dropdown>My Profile <i class="fa fa-caret-down" aria-hidden="true"></i>
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
                                <li id="item">BBBBBBBB BBB</li>
                                <li><a href="http://www.investx.com">CCCCCCCC</a></li>
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