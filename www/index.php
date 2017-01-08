<?php
session_start();
ini_set("display_errors", 0);
require("public_a_secure.php");
include_once($CFG["include_path"] . "/lib/html/html.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("public_a_include.php");?>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />


		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageroll.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageroll.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.imageshow.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.imageshow.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.category.js"></script>
        <link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.category.css" rel="stylesheet" />

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.ajax.read.js"></script>

        <script language="javascript" type="text/javascript">
		$(function(){
			$(".lwhTab1").lwhTab1({trigger:"mouseover", height:270});
			$(".lwhTab2").lwhTab2({trigger:"click", height:200});
			$(".lwhTab3").lwhTab3({trigger:"mouseover", height: 200});
			$(".lwhTab4").lwhTab4({trigger:"mouseover", height: 400});
			$(".lwhTab5").lwhTab5({trigger:"mouseover", height: 270});
			$(".lwhTab6").lwhTab6({height: 270});
			$(".lwhTab9").lwhTab9({trigger:"mouseover", height: 270});

			
			ishow = new LWH.ImageShow({name:"photoshow", lang: GLang, filter:"info_content", mode:"medium", view:"small", 	imgww:600, imghh:450, tips:true, edit:false, single:true });
			
			ipic = new LWH.ImageRoll({name:"productImage", lang: GLang, filter:"info_content", mode:"medium", view:"small", container:"#imglist", tips:false, imgww:200, imghh:150, orient:"h",
										click: function(imgObj) {
											ishow.imgobj(imgObj);
										}
									});
			ipic.refid(95);
			
		});
        </script>
</head>
<body>
<?php 
	require("public_a_header.php");
	require("public_a_menu.php");
	LANG::hit("Public", "主页", "主页"." :".$public_user["user_name"]);
?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->
<div id="imglist"></div>
<br />
<div class="lwhTab9 lwhTab9-mint">
    <ul >
        <li>账号管理<s></s></li>
    </ul>   
	<div class="lwhTab9-border" style="display:block;">
	   	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    </div>
</div>
<br />

<div class="lwhTab9 lwhTab9-orange lwhTab9-border-grey">
    <ul >
        <li class="selected">账号管理<s></s></li>
    </ul>   
	<div style="display:block;">
	   	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    	44444444444 111<br />
    </div>
</div>
<br />
       <?php 
	   		$tableObj = array();

			$tableObj["head"]["id"] 	= "lwh";
			$tableObj["head"]["rownum"] = "4";
			$tableObj["head"]["colnum"] = "12";
			$tableObj["head"]["type"] 	= "lwhTab9";
			$tableObj["head"]["color"] 	= "mint";
			$tableObj["head"]["style"] 	= "display:inline-block; width:476px;";
			$tableObj["head"]["more"] 	= "advertise.php";
			$tableObj["head"]["url"] 	= "advertise_detail.php?sid={{id}}";
			
			$tableObj["schema"]["table"]["fftable"]["name"] 	= "vw_info_filter";
			$tableObj["schema"]["table"]["fftable"]["id"] 		= "filter_id";
			$tableObj["schema"]["table"]["fftable"]["rid"] 		= "class_id";
			$tableObj["schema"]["table"]["fftable"]["rval"] 	= "";
			$tableObj["schema"]["table"]["fftable"]["val"] 		= "2";
			
			$tableObj["schema"]["table"]["mmtable"]["name"] 	= "info_class";
			$tableObj["schema"]["table"]["mmtable"]["id"] 		= "id";
			$tableObj["schema"]["table"]["mmtable"]["title"] 	= "{{title_cn}}";
			$tableObj["schema"]["table"]["mmtable"]["desc"] 	= "{{desc_en}}";
			$tableObj["schema"]["table"]["mmtable"]["cols"] 	= "title_cn,desc_en";
			$tableObj["schema"]["table"]["mmtable"]["order"] 	= "orderno DESC,desc_en";
			

			$tableObj["schema"]["table"]["sstable"]["name"]		= "vw_info_content";
			$tableObj["schema"]["table"]["sstable"]["id"] 		= "id";
			$tableObj["schema"]["table"]["sstable"]["mref"] 	= "class_id";
			$tableObj["schema"]["table"]["sstable"]["fid"] 		= "filter_id";
			$tableObj["schema"]["table"]["sstable"]["fval"] 	= "2";

			$tableObj["schema"]["table"]["sstable"]["title"] 	= "{{a_desc_cn}}";
			$tableObj["schema"]["table"]["sstable"]["desc"] 	= "{{a_desc_en}}";
			$tableObj["schema"]["table"]["sstable"]["cols"] 	= "a_title_cn,a_desc_cn";
			$tableObj["schema"]["table"]["sstable"]["order"] 	= "created_time DESC";
		
			echo HTML::tab($db, $GLang, $tableObj);	
	   ?> 

       <?php 
	   		$tableObj = array();

			$tableObj["head"]["id"] 	= "lwh";
			$tableObj["head"]["rownum"] = "4";
			$tableObj["head"]["colnum"] = "12";
			$tableObj["head"]["type"] 	= "lwhTab5";
			$tableObj["head"]["color"] 	= "";
			$tableObj["head"]["style"] 	= "display:inline-block; width:476px;";
			$tableObj["head"]["more"] 	= "advertise.php";
			$tableObj["head"]["url"] 	= "advertise_detail.php?sid={{id}}";
			
			$tableObj["schema"]["table"]["fftable"]["name"] 	= "vw_info_filter";
			$tableObj["schema"]["table"]["fftable"]["id"] 		= "filter_id";
			$tableObj["schema"]["table"]["fftable"]["rid"] 		= "class_id";
			$tableObj["schema"]["table"]["fftable"]["rval"] 	= "";
			$tableObj["schema"]["table"]["fftable"]["val"] 		= "3";
			
			$tableObj["schema"]["table"]["mmtable"]["name"] 	= "info_class";
			$tableObj["schema"]["table"]["mmtable"]["id"] 		= "id";
			$tableObj["schema"]["table"]["mmtable"]["title"] 	= "{{title_cn}}";
			$tableObj["schema"]["table"]["mmtable"]["desc"] 	= "{{desc_en}}";
			$tableObj["schema"]["table"]["mmtable"]["cols"] 	= "title_cn,desc_en";
			$tableObj["schema"]["table"]["mmtable"]["order"] 	= "orderno DESC,desc_en";
			

			$tableObj["schema"]["table"]["sstable"]["name"]		= "vw_info_content";
			$tableObj["schema"]["table"]["sstable"]["id"] 		= "id";
			$tableObj["schema"]["table"]["sstable"]["mref"] 	= "class_id";
			$tableObj["schema"]["table"]["sstable"]["fid"] 		= "filter_id";
			$tableObj["schema"]["table"]["sstable"]["fval"] 	= "3";

			$tableObj["schema"]["table"]["sstable"]["title"] 	= "{{a_desc_cn}}";
			$tableObj["schema"]["table"]["sstable"]["desc"] 	= "{{a_desc_en}}";
			$tableObj["schema"]["table"]["sstable"]["cols"] 	= "a_title_cn,a_desc_cn";
			$tableObj["schema"]["table"]["sstable"]["order"] 	= "created_time DESC";
		
			echo HTML::tab($db, $GLang, $tableObj);	
	   ?> 
        <br />
		<br />
        <div class="lwhTab1 lwhTab1-green" style="display:inline-block; width:476px;">
            <ul>
            	<li><a>教育广告</a></li><li><a>二手广告</a></li><li><a>个人广告</a></li>
            	<a>更多...</a>
            </ul>
            <div>
                111111111111111111111
            </div>
            <div>
                22222222222222222
            </div>
            <div>
                3333333333333333333
            </div>
        </div>
        <div class="lwhTab2 lwhTab2-purple" style="display:inline-block; width:476px;">
            <ul>
            	<li>本站活动</li><li>教会活动</li><li>其他活动</li>
				<a>更多...</a>            
            </ul>
            <div>
                111111111111111111111
            </div>
            <div>
                22222222222222222
            </div>
            <div>
                3333333333333333333
            </div>
        </div>

		<br /><br />
        <div class="lwhTab6">
        	<ul>
            	<li class="header">商品分类</li>
            	<li class="item">女士服装</li>
            	<li class="item"><a>男士服装</a></li>
            	<li class="item">教育书籍</li>
            	<li class="item"><a>儿童玩具</a></li>
            	<li class="item">电子产品</li>
            	<li class="item">音乐乐器</li>
            </ul>
            <div>
				<div class="header"></div>
				<div class="header-content">
                dlfjasdklfj sadkfjlsda
                </div>
				<div class="content">111111111</div>
				<div class="content">222222222</div>
				<div class="content">333333333</div>
				<div class="content">444444444</div>
				<div class="content">555555555</div>
				<div class="content">666666666</div>
            </div>
        </div>

		<br />
        <br />
        <div class="lwhTab2" style="display:inline-block; width:476px;">
            <ul>
            	<li><a>教育广告</a></li><li><a>二手广告</a></li><li><a>个人广告</a></li>
				<a>更多...</a>            
            </ul>
            <div>
                111111111111111111111
            </div>
            <div>
                22222222222222222
            </div>
            <div>
                3333333333333333333
            </div>
        </div>
        <div class="lwhTab1 lwhTab1-yellow" style="display:inline-block; width:476px;">
            <ul>
            	<li>本站活动</li><li>教会活动</li><li>其他活动</li>
				<a>更多...</a>            
            </ul>
            <div>
                111111111111111111111
            </div>
            <div>
                22222222222222222
            </div>
            <div>
                3333333333333333333
            </div>
        </div>
		<br /> 
        <br />
        <div class="lwhTab3" style="display:inline-block; width:476px;">
            <ul>
            	<li>移民机构</li><li>留学机构</li><li>教育机构</li>
            </ul>
            <div style="height:300px;">
                111111111111111111111
            </div>
            <div>
                <div style="height:400px;">
                    22222222222222222
                </div>
            </div>
            <div style="height:500px;">
                3333333333333333333
            </div>
        </div>
        <div class="lwhTab2 lwhTab2-green" style="display:inline-block; width:476px;">
            <ul>
            	<li><a>好文分享</a></li><li><a>好文分享</a></li><li><a>好文分享</a></li>
				<a>更多...</a>                
            </ul>
            <div>
                111111111111111111111
            </div>
            <div>
                22222222222222222
            </div>
            <div>
                3333333333333333333
            </div>
        </div>
        <br />
        <br />

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>
<?php require("public_a_common.php");?>
</body>
</html>
