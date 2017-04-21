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
<?php include("public_head.php"); ?>
</head>
<body ng-app="myApp">
<?php include("public_menu.php"); ?>
<div style="clear:both;display:block;position:relative;"></div>
<br><br>
<br><br>




<div class="container" style="border:0px solid red; padding:0px;">

	<img src="theme/wliu/company/Title-002.jpg" style="width:100%;" class="animated wow bounceInUp z-depth-2" />
	<br>
	<br>
	<!--
	<div class="panel panel-default z-depth-2">
		<div class="panel-body">
			<div class="row">
				<div class="col-md-3">
					<div class="view">
						<img class="img-thumbnail img-fluid" src="theme/wliu/company/subject01.jpg" />
						<div class="mask flex-center">
							<span style="color:#ffffff;font-size:24px;font-weight:bold;">维多利亚大学</span>       
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="view">
						<img class="img-thumbnail img-fluid" src="theme/wliu/company/subject02.jpg" />
						<div class="mask flex-center">
							<span style="color:#ffffff;font-size:24px;font-weight:bold;">卡莫森学院</span>       
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<div class="view">
						<img class="img-thumbnail img-fluid" src="theme/wliu/company/subject03.jpg" />
						<div class="mask flex-center">
							<span style="color:#ffffff;font-size:24px;font-weight:bold;">贵族学校</span>       
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<div class="view">
						<img class="img-thumbnail img-fluid" src="theme/wliu/company/subject04.jpg" />
						<div class="mask flex-center">
							<span style="color:#ffffff;font-size:24px;font-weight:bold;">学区</span>       
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
	-->

	<br>

	<!--Section: Magazine v.2-->
	<section class="section magazine-section">

		<!--Section heading-->
		<!-- layout row-->
		<div class="row text-xs-left">

			<!--First column-->
			<div class="col-md-8">
				<!--Featured news-->
				<div class="single-news">
					<h3><a>学生感言</a></h3>
				</div>
				<!--/Featured news-->

				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-3">
							<!--Image-->
 							<div class="avatar">
                        		<img src="theme/wliu/student/wang.jpg" class="img-circle img-fluid">
                    		</div>
						</div>

						<!--Excerpt-->
						<div class="col-md-9">
							<p><strong>王同学在Stellys高中学习2年，高中毕业后，2015年9月开始在麦吉尔大学工程学院学习</strong></p>
							<a>
							在麦吉尔大学生活学习了一年之后，不由得怀念起当初在Stelly上高中的时光。整体来讲，加拿大高中的教学氛围是轻松而愉快的，大部分课程对于中国学生来讲都很简单，只需平时认真的听讲做笔记，下课简单的做练习就可以了。然而对于英语这一国际学生相对头疼的学科，还是需要投入大量的时间去学习，除了完成高中英语课程里的作业，还需尽早的考过雅思，因为雅思是进入大学院校的硬门槛（每个大学对雅思的要求会有细微的差别，需提前查看）。对我影响最深也最怀念的，就是维多利亚的老师和寄宿家庭，他们是如此的和蔼热情，对于我的困难他们都会毫不犹豫的帮助，竭尽所能的帮我渡过难关。Naomi, Diane, Tissari 还有 Jack Wong 都是我难以忘记的老师，当一个国际学生孤身一人来到加拿大读书时，他们对于我来说都扮演了护航者的角色。我也听说不少已经去其他省读书的毕业生，不约而同的选择在假期回到维多利亚看看，也许是那里的景色宜人，也许是那里有良师益友，也许我们已经默默的把这段生活转化作了 一种不能割舍的感情……
							</a>
						</div>

					</div>
				</div>
				<!--/Small news-->

				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-3">
							<!--Image-->
 							<div class="avatar">
                        		<img src="theme/wliu/student/li.jpg" class="img-circle img-fluid">
                    		</div>
						</div>

						<!--Excerpt-->
						<div class="col-md-9">
							<p><strong>李同学，2014年9月进入 Claremont 高中学习，2016年6月高中毕业，同年9月入读加拿大排名第一的多伦多大学工程和应用科学学院</strong></p>
							<a>
							我叫李嘉翔，2014年，我在中国哈尔滨有幸被 Jack Wong 校长面试选中，来到维多利亚 Claremont 高中学习。因合理选课，没有降级，直接入读11年级。2016年6月高中毕业后成功进入多伦多大学工程和应用科学学院。在 Claremont 学习的这段时间，我感受到了很多不同的文化，不同的学习方法。在我刚刚来到这个学校时，在 Wong 校长的帮助下很快熟悉了环境，了解了当地的风土人情，在我遇到困难时也得到了很多的帮助。在第一次选课的时候，辅导员老师用大量时间帮我规划，12年级学习最繁重的时候，一群好朋友在图书馆共同学习，互相帮助，经常学习到深夜。转眼两年就过去了，到了毕业的时刻，所有人打扮成最帅，最漂亮的样子来参加毕业典礼，带着一点小紧张走过舞台，与校长握手，照相，接过毕业证，同时代表着高中时代的结束 … 感谢这些一路陪伴我，帮助我的人们！感谢 Claremont 中学！
							</a>
						</div>

					</div>
				</div>
				<!--/Small news-->


				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-3">
							<!--Image-->
 							<div class="avatar">
                        		<img src="theme/wliu/student/lu.jpg" width="320" height="240" class="img-circle img-fluid">
                    		</div>
						</div>

						<!--Excerpt-->
						<div class="col-md-9">
							<p><strong>陆氏姐妹，2013年9月入读 Parkland 高中9年级，成绩优异</strong></p>
							<a>
							我们是来自中国的双胞胎姐妹陆沫潼和陆沫洁。我们在中国完成初二的学业之后选择到加拿大维多利亚念书，渴望能在外学到更多知识和提高英语能力并且锻炼自我。这两年在加拿大的学习生活改变了我们很多。一开始交流与生活都存在着很多的问题，可是现在我们很庆幸当初做出了这样的选择。
							在国内的时候一直接受着应试教育，不能够很好的展现自我。到了加拿大之后我们变得更加开朗，自信并且独立。我们很享受加拿大的学校生活。Parkland 提供的自选课程与国内的教育有很大的不同，在学校我们认识了很多的加拿大和来自于其他国家的朋友。加拿大是个开放、自由和友好的国度，最直接的表现是加拿大家庭的热情好客。对于我们来说寄宿家庭是最重要的一部分，寄宿家庭会安排我们参加一些家庭活动，也许是一场球赛，也许是一次外出野餐，或许更简单的是坐在沙发上看一部电影。特殊节日的家庭晚餐和活动都是我们独一无二的体验。我们交流的障碍都会在一次又一次的互动中慢慢消解，让我们在生活中真正成为他们的一份子，这样我们能够更好地了解加拿大文化。维多利亚气候宜人，因为这样的好天气成为了我们能在室外活动的重要因素，免费的网球场、便宜受欢迎的健身房 、或是免费的森林公园都丰富了我们的生活，并陶冶了情操让我们学生有了更健康的生活方式。
							所以选择加拿大我们从不后悔。
  							</a>
						</div>

					</div>
				</div>
				<!--/Small news-->
             

			</div>
			<!--/First column-->

			<!--Second column-->
			<div class="col-md-4">
				<!--Featured news-->
				<div class="single-news">
					<h3><a>为什么选择读书国际</a></h3>
				</div>
				<!--/Featured news-->

				<!--Small news-->
				<div class="single-news">
				<div class="row">
						<div class="col-md-12">
							<h4><a>1. 我们有丰富的经验</a></h4>
							<p>
								十几年以来，读书国际为每一位学生量身定制留学方案，规划孩子们的教育和就业之路。成功帮助1000多名中国学生实现了加拿大留学梦想，早期的学生已经完成学业，在加拿大工作
							</p>
						</div>
					</div>
				</div>
				<!--/Small news-->

				<!--Small news-->
				<div class="single-news">
				<div class="row">
						<div class="col-md-12">
							<h4><a>2. 我们更了解加拿大</a></h4>
							<p>
								读书国际的高级学生导师团队拥有在加拿大工作生活二十年以上的经验，经历了自己孩子在加拿大出生到上大学的完整过程，对加拿大政策，国情，各种教育资源和就业市场更加了解。我们知道在加拿大如何为人父母，怎样做好家长。读书国际的高级管理团队，都亲身经历了从中国来加拿大读中学然后上大学的完整过程，或毕业于多伦多大学，或毕业于英属哥伦比亚大学，或毕业于维多利亚大学，他们能够精准的理解和帮助孩子们。我们精通英文，我们了解加拿大人的价值观，更加懂得如何跟学校和寄宿家庭交流
							</p>
						</div>
					</div>
				</div>
				<!--/Small news-->

				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-12">
							<h4><a>3. 我们源自中国</a></h4>
							<p>
								我们都来自中国，完全了解中国家长和孩子们的想法。我们的母语是中文，与中国学生和家长交流没有任何障碍
							</p>
						</div>
					</div>
				</div>
				<!--/Small news-->

				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-12">
							<h4><a>4. 我们在加拿大</a></h4>
							<p>
								读书国际在温哥华，维多利亚和多伦多，为中国学生提供服务。申请学校和签证成功只是完成了留学前基本准备，乃是万里长征的第一步，孩子新的人生从踏上加拿大国土开始上学那一天才真正开始。我们在孩子身边，能够真正做好学业监管，生活服务和就业移民等全程服务
							</p>
						</div>
					</div>
				</div>
				<!--/Small news-->

				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-12">
							<h4><a>5. 我们专业</a></h4>
							<p>
								读书国际只做加拿大，只为大温哥华，维多利亚和大多伦多的中国学生提供服务。我们更了解这些地区，我们更专业
							</p>
						</div>
					</div>
				</div>
				<!--/Small news-->

				<!--Small news-->
				<div class="single-news">
					<div class="row">
						<div class="col-md-12">
							<h4><a>6. 我们用心</a></h4>
							<p>
								读书国际用心为学生和家长着想，用心为他们服务
							</p>
						</div>
					</div>
				</div>
				<!--/Small news-->

			</div>
			<!--/Second column-->

		</div>
		<!--/layout row-->

	</section>
	<!--/Section: Magazine v.2-->


	<div class="row">
		<div class="col-md-4">
						<!--Card-->
						<div class="card">
							<!--Card image-->
							<div class="view overlay hm-white-slight">
								 <img src="http://mdbootstrap.com/images/regular/nature/img%20(75).jpg">
								<a>
									<div class="mask"></div>
								</a>
							</div>
							<!--/.Card image-->

							<!--Social buttons-->
							<div class="card-share">
								<div class="social-reveal">
									<!--Facebook-->
									<a type="button" class="btn-floating btn-fb"><i class="fa fa-facebook"></i></a>
									<!--Twitter-->
									<a type="button" class="btn-floating btn-tw"><i class="fa fa-twitter"></i></a>
									<!--Google -->
									<a type="button" class="btn-floating btn-gplus"><i class="fa fa-google-plus"></i></a>
								</div>
								<a class="btn-floating btn-action share-toggle primary-color-dark"><i class="fa fa-share-alt"></i></a>
							</div>
							<!--/Social buttons-->

							<!--Card content-->
							<div class="card-block" style="height:280px;">
								<!--Title-->
								<h4 class="card-title">暖心服务</h4>
								<hr>
								<!--Text-->
								<p class="card-text">寄宿家庭日常协调监管；入学欢迎晚会（中秋节欢聚）；高中选课指导；与任课老师沟通，学业指导；选择家教的决策和安排；大学升学指导；与学生，家长及时沟通.</p>
							</div>
							<div class="text-xs-center">
								<a href="nxservice.php#nx" class="btn btn-primary">Read more</a>
							</div><br>
							<!--/.Card content-->

						</div>
						<!--/.Card-->
		</div>

		<div class="col-md-4">
						<!--Card-->
						<div class="card">
							<!--Card image-->
							<div class="view overlay hm-white-slight">
								<img src="http://mdbootstrap.com/images/regular/nature/img%20(78).jpg">
								<a>
									<div class="mask"></div>
								</a>
							</div>
							<!--/.Card image-->

							<!--Social buttons-->
							<div class="card-share">
								<div class="social-reveal">
									<!--Facebook-->
									<a type="button" class="btn-floating btn-fb"><i class="fa fa-facebook"></i></a>
									<!--Twitter-->
									<a type="button" class="btn-floating btn-tw"><i class="fa fa-twitter"></i></a>
									<!--Google -->
									<a type="button" class="btn-floating btn-gplus"><i class="fa fa-google-plus"></i></a>
								</div>
								<a class="btn-floating btn-action share-toggle primary-color-dark"><i class="fa fa-share-alt"></i></a>
							</div>
							<!--/Social buttons-->

							<!--Card content-->
							<div class="card-block" style="height:280px;">
								<!--Title-->
								<h4 class="card-title">贴心服务</h4>
								<hr>
								<!--Text-->
								<p class="card-text">在“暖心服务”上增加：在线专有帐户，每月更新；寄宿家庭细致服务，每月向中国家长图文通报；每月向中国家长提供考勤信息；每月与任课老师交流，向中国家长通报；每月与学生促膝谈心；定期提供成绩单及翻译件；代为申请大学，安排参观本地大学；欢庆生日；欢度春节，中秋；办理手机，银行开户，看医生等生活服务.</p>
							</div>
							<div class="text-xs-center">
								<a href="nxservice.php#tx" class="btn btn-primary">Read more</a>
							</div><br>
							<!--/.Card content-->

						</div>
						<!--/.Card-->
		</div>

		<div class="col-md-4">

						<!--Card-->
						<div class="card">
							<!--Card image-->
							<div class="view overlay hm-white-slight">
								<img src="http://mdbootstrap.com/images/regular/people/img%20(84).jpg">
								<a>
									<div class="mask"></div>
								</a>
							</div>
							<!--/.Card image-->

							<!--Social buttons-->
							<div class="card-share">
								<div class="social-reveal">
									<!--Facebook-->
									<a type="button" class="btn-floating btn-fb"><i class="fa fa-facebook"></i></a>
									<!--Twitter-->
									<a type="button" class="btn-floating btn-tw"><i class="fa fa-twitter"></i></a>
									<!--Google -->
									<a type="button" class="btn-floating btn-gplus"><i class="fa fa-google-plus"></i></a>
								</div>
								<a class="btn-floating btn-action share-toggle primary-color-dark"><i class="fa fa-share-alt"></i></a>
							</div>
							<!--/Social buttons-->

							<!--Card content-->
							<div class="card-block" style="height:280px;">
								<!--Title-->
								<h4 class="card-title">亲子服务</h4>
								<hr>
								<!--Text-->
								<p class="card-text">在“贴心服务”上增加：每2周更新在线专有帐户内容；每月定期与寄宿家长见面，每2周向中国家长通报寄宿家庭情况；贴心导师每2周与学生促膝谈心；每2周向中国家长通报学习情况；在生日当天为学生举办生日派对；亲子指导（家长学校）；与学生，家长热线联系.</p>
							</div>
							<div class="text-xs-center">
								<a href="nxservice.php#qz" class="btn btn-primary">Read more</a>
							</div><br>
							<!--/.Card content-->

						</div>
						<!--/.Card-->
		</div>

	</div>
	<br>
	<br>


</div>
<?php include("public_foot.php"); ?>
</body>
</html>