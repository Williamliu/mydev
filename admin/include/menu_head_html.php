
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
                    $current_menu = '';
                    if(count($menus["menus"])>0) {
                            /****** create menu *******/
                            $menu_html = '';
                            foreach($menus["menus"] as $menu1) {
                                $menu1_url  = $menu1["url"]?'href="' . $menu1["url"] .'" target="_blank"':''; 
                                $menu1_url  = $menu1["template"]?'href="' . $menu1["template"] .'"':''; 

                                $menu2_selected = false;
                                if( is_array($menu1["menus"]) ) {
                                    $menu2_html = '<div class="collapsible-body">';
                                    $menu2_html .= '<ul>';
                                        foreach($menu1["menus"] as $menu2) {
                                            $menu2_url      = $menu2["url"]?'href="' . $menu2["url"] .'" target="_blank"':''; 
                                            $menu2_url      = $menu2["template"]?'href="' . $menu2["template"] .'"':''; 
                                            
                                            if(substr(strrchr('/'.$menu2["template"], "/"), 1)==substr(strrchr($_SERVER["SCRIPT_NAME"], "/"), 1)) {
                                                $menu2_url      = '';
                                                $menu2_selected = true;
                                                $current_menu = '<a ' . $menu2_url . ' style="font-weight:bold;">' . $menu2["icon"] . ' ' . $menu2["title"] . '</a>';
                                            } 
                                            
                                            $menu2_active = substr(strrchr('/'.$menu2["template"], "/"), 1)==substr(strrchr($_SERVER["SCRIPT_NAME"], "/"), 1)?' active':'InActive';  
                                            
                                            $menu2_html .= '<li>';
                                            $menu2_html .= '<a ' . $menu2_url . ' class="waves-effect' . $menu2_active . '">' . $menu2["icon"] . ' ' . $menu2["title"] . '</a>';
                                            $menu2_html .= '</li>';
                                        }
                                    $menu2_html .= '</ul>';
                                    $menu2_html .= '</div>';
                                }
                                
                                ////////////////////////////////////////
                                $menu1_html = '';

                                if($menu2_selected) 
                                    $menu1_html .= '<li class="active"><a class="collapsible-header waves-effect arrow-r active" ' . $menu1_url . '>' . $menu1["icon"] . ' ' . $menu1["title"] . '<i class="fa fa-angle-down rotate-icon"></i></a>';
                                else 
                                    $menu1_html .= '<li><a class="collapsible-header waves-effect arrow-r" ' . $menu1_url . '>' . $menu1["icon"] . ' ' . $menu1["title"] . '<i class="fa fa-angle-down rotate-icon"></i></a>';
                                
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
            <p><span style="font-size:0.9em"><?php echo gwords("you.are.here")?>:</span> <?php echo $current_menu?></p>
        </div>
        <ul class="nav navbar-nav nav-flex-icons ml-auto">
            <li class="nav-item">
                <a class="nav-link"> <span class="badge red z-depth-1">2</span> <i class="fa fa-shopping-cart"></i> <span class="hidden-sm-down">Cart</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link"><i class="fa fa-envelope"></i> <span class="hidden-sm-down">Contact</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link"><i class="fa fa-comments-o"></i> <span class="hidden-sm-down">Support</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link"><i class="fa fa-sign-in"></i> <span class="hidden-sm-down">Register</span></a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-user"></i> <span class="hidden-sm-down">Profile</span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="<?php echo $CFG["secure_a_return"]?>"><i class="fa fa-sign-out" aria-hidden="true"></i> <?php echo gwords("logout")?></a>
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