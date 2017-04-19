
<!--Double navigation-->
<header>
    <!-- Sidebar navigation -->
    <ul id="slide-out" class="side-nav fixed sn-bg-1 custom-scrollbar" style="background-color:#293a48;">
        <!-- Logo -->
        <li>
            <div class="logo-wrapper waves-light">
                <a href="#"><img src="https://mdbootstrap.com/img/logo/mdb-transparent.png" class="img-fluid flex-center"></a>
            </div>
        </li>
        <!--/. Logo -->
        <hr style="height:0px;color:white;border-bottom:1px solid white;padding:0px;margin:0px;">
        <!-- Side navigation links -->
        <li>
            <ul class="collapsible collapsible-accordion">
                <?php
                    if(count($menus["menus"])>0) {
                            /****** create menu *******/
                            $menu_html = '';
                            foreach($menus["menus"] as $menu1) {
                                $menu2_html = '';
                                $menu2_selected = false;
                                if( is_array($menu1["menus"]) ) {
                                    $menu2_html .= '<div class="collapsible-body">';
                                    $menu2_html .= '<ul>';
                                        foreach($menu1["menus"] as $menu2) {
                                            $menu2_active = '';

                                            if( $menu2["menu_key"]==$web_user["current"]["menu_key"]) {
                                                $menu2_selected = true;
                                                $menu2_active   = 'active';
                                            }                                           
                                            
                                            $menu2_html .= '<li>';
                                            $menu2_html .= str_replace( array("{class}", "{arrow}"), array("waves-effect $menu2_active", ""),  $menu2["link"]);
                                            $menu2_html .= '</li>';
                                        }
                                    $menu2_html .= '</ul>';
                                    $menu2_html .= '</div>';
                                }
                                
                                ////////////////////////////////////////
                                $menu1_html = '';

                                if($menu2_selected) { 
                                    $menu1_html .= '<li class="active">';
                                    $menu1_arrow = is_array($menu1["menus"])?'<i class="fa fa-angle-down rotate-icon"></i>':'';
                                    $menu1_html .= str_replace(array("{class}","{arrow}"), array("collapsible-header waves-effect arrow-r active", $menu1_arrow), $menu1["link"]); 
                                } else { 
                                    if($menu1["menu_key"]==$web_user["current"]["menu_key"]) {
                                        $menu1_html .= '<li class="active">';
                                        $menu1_arrow = is_array($menu1["menus"])?'<i class="fa fa-angle-down rotate-icon"></i>':'';
                                        $menu1_html .= str_replace(array("{class}","{arrow}"), array("collapsible-header waves-effect arrow-r active", $menu1_arrow), $menu1["link"]); 
                                    } else {
                                        $menu1_html .= '<li>';
                                        $menu1_arrow = is_array($menu1["menus"])?'<i class="fa fa-angle-down rotate-icon"></i>':'';
                                        $menu1_html .= str_replace(array("{class}","{arrow}"), array("collapsible-header waves-effect arrow-r", $menu1_arrow), $menu1["link"]); 
                                    }
                                }
                                $menu1_html .= $menu2_html;
                                $menu1_html .= '</li>';
                                ///////////////////////////////////////
                                $menu_html .= $menu1_html;
                            }
                            echo $menu_html;
                            /****** \\create menu *******/
                    } else {
                        echo '<br><span style="color:white;font-size:16px;font-weight:bold;margin-left:10px;">' . gwords("you.do.not.have.right.to.use") . '</span>';
                    }
               ?>
            </ul>
        </li>
        <!--/. Side navigation links -->
        <div class="sidenav-bg mask-strong"></div>
    </ul>
    <!--/. Sidebar navigation -->

    <!--Navbar-->
    <nav class="navbar fixed-top navbar-toggleable-md navbar-dark scrolling-navbar double-nav" style="background-color:#293a48;">
        <!-- SideNav slide-out button -->
        <div class="float-left">
            <a href="#" data-activates="slide-out" class="button-collapse"><i class="fa fa-bars"></i></a>
        </div>
        <!-- Breadcrumb-->
        <div class="breadcrumb-dn mr-auto">
            <p><span style="font-size:0.9em"><?php echo gwords("you.are.here")?>:</span> <?php echo $web_user["current"]["url"]?></p>
        </div>
        <ul class="nav navbar-nav nav-flex-icons ml-auto">
            <li class="nav-item">
                <div id="wliuWebsite-lang" style="margin-top:6px;">
                    <a class="wliu-website-lang-options <?php echo $GLang=="en"?"wliu-lang-selected":"" ?>" lang="en">English</a>
                    <span class="seperator">|</span>
                    <a class="wliu-website-lang-options <?php echo $GLang=="cn"?"wliu-lang-selected":"" ?>" lang="cn">简体版</a>
                    <span class="seperator">|</span>
                    <a class="wliu-website-lang-options <?php echo $GLang=="tw"?"wliu-lang-selected":"" ?>" lang="tw">繁体版</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-user"></i> <span class="hidden-sm-down">Profile</span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="<?php echo $CFG["secure_auth_return"]?>"><i class="fa fa-sign-out" aria-hidden="true"></i> <?php echo gwords("logout")?></a>
                    <a class="dropdown-item" href="<?php echo $CFG["secure_login_home"]?>"><i class="fa fa-user-circle-o" aria-hidden="true"></i> <?php echo gwords("my.account")?></a>
                </div>
            </li>
        </ul> 
    </nav>
    <!--/.Navbar-->
</header>
<!--/Double navigation-->

<!--Main layout-->
<main>
    <div class="container-fluid">
        <!--Section: Main carousel-->
        <section>
            <div class="row">
                <div class="col-md-12">
<!--Main layout-->

<form name="wliuWebsiteLang" action="<?php echo $_SERVER["REQUEST_URI"];?>" method="get">
	<input type="hidden" name="lang" id="wliu-website-lang" value="<?php echo $Glang;?>" />
</form>
<script type="text/javascript" language="javascript">
	$(function(){
		$("a.wliu-website-lang-options", "div#wliuWebsite-lang").bind("click", function(ev) {
			$("#wliu-website-lang").val( $(this).attr("lang") );
			wliuWebsiteLang.submit();
		});
	});
</script>
