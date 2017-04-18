<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
include_once($CFG["include_path"] . "/wliu/language/language.php");
?>
<!DOCTYPE html>
<html>
<head>
<?php include("public_head.php"); ?>
</head>
<body ng-app="myApp">
<?php include("public_menu.php"); ?>

<div style="clear:both;"></div>
<br><br>
<br><br>

<div class="container" style="border:0px solid red; padding:0px;">


<!--Section: Blog v.1-->
<section class="section extra-margins">
    <!--First row-->
    <div class="row card card-block">

        <!--First column-->
        <div class="col-md-5 m-b-r">
            <!--Featured image-->
            <a href="" class="amber-text"><h3><i class="fa fa-eye"></i><i class="fa fa-eye"></i> 关注我们</h3></a>
			<p>
			请扫描二维码，关注我们
			</p>
            <div class="view"  style="box-shadow:none;">
                <img src="theme/wliu/logo/dsgj_qr.jpg">
                <a>
                    <div class="mask"></div>
                </a>
            </div>
        </div>
        <!--/First column-->

        <!--Second column-->
        <div class="col-md-7 m-b-r">
            <!--Excerpt-->
            <a href="" class="amber-text"><h3><i class="fa fa-users"></i> 关于我们</h3></a>
<p>
读书国际用心为每一名学生量身定制留学方案，进而规划适合每一个孩子的人生之路。帮助孩子们身心健康成长，成功完成学业
</p>
<p>
读书国际是加拿大注册的专业留学服务机构，在加拿大维多利亚，温哥华和多伦多设有办公室
</p>
<p>
我们的高级学生导师团队拥有在加拿大生活工作20年以上的经验，经历了自己孩子在加拿大出生到上大学的整个过程，对加拿大的教育和就业有亲身的了解，同时明了中国学生和家长的需求。我们能够根据学生自身的情况制定最合适的留学方案，并指导就业和移民安排
</p>
<p>
自2006年以来，读书国际成功帮助1000多名中国学生实现了加拿大留学就业移民梦想。早期的学生已经在加拿大大学毕业并且工作，他们快乐地生活在这里，享受着全球最美好的环境和一流的福利
</p>
<p>
申请学校录取和签证只是留学之前的最基础准备，是万里长征的第一步，孩子们新的人生从踏上加拿大国土那一天才真正开始。读书国际能够真正做到申请学校办理签证，在加拿大期间的学习和生活管理，包括升入大学和毕业后就业移民的全程服务。孩子人生的每一步，每一个关键时刻，我们都在他们身边，一路引领他们跨越障碍，走向成功
</p>
<p>
读书国际真心为学生和家长着想，用心服务。读书国际总结多年经验，精心推出的“家长放心服务”，对孩子们顺利完成学业，身心健康成长提供了极大的帮助
</p>
<p>
读书国际真诚帮助中国学子实现加拿大留学就业人生梦想
</p>
        </div>
        <!--/Second column-->

    </div>
    <!--/First row-->


</section>

<!--/Section: Blog v.1-->


    <div class="row">
        <div class="col-md-12">
            <!--Excerpt-->
            <a href="" class="amber-text"><h3><i class="fa fa-diamond"></i><i class="fa fa-diamond"></i><i class="fa fa-diamond"></i> 留学助跑人生新的起点</h3></a>
		</div>
        <!--First column-->
        <div class="col-md-12">
			<div class="row">
				<div class="col-md-12">
					<img src="theme/wliu/student/stu_14.jpg" class="col-md-12 img-responsive" />
				</div>
			</div>
        </div>
        <div class="col-md-12">
			<div class="row">
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_01.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_02.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_03.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_04.jpg" class="col-md-12 img-responsive" />
				</div>
			</div>
        </div>

        <div class="col-md-12">
			<div class="row">
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_05.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_06.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_07.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_08.jpg" class="col-md-12 img-responsive" />
				</div>
			</div>
        </div>

        <div class="col-md-12">
			<div class="row">
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_09.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_10.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_11.jpg" class="col-md-12 img-responsive" />
				</div>
				<div class="col-md-3">
					<img src="theme/wliu/student/stu_12.jpg" class="col-md-12 img-responsive" />
				</div>
			</div>
        </div>
        <!--/Second column-->
    </div>
</div>
<?php include("public_foot.php"); ?>
</body>
</html>