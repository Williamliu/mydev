<?php 
$temp_name = substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
?>
<div wliu-nav-bg fixed>
    <div class="container">
        <div wliu-nav>
            <div head>
                <a logo><img src='theme/wliu/company/readings-logo.png' ></a>
                <a menu-button><i class="wliu-btn24 wliu-btn24-menubar"></i></a>
            </div>
            <div menu>
                <ul left>
                    <li style="width:20px;"></li>
						<li>
							<a href="index.php" title="读书国际首页">首页</a>
						</li>
						<li>
							<a href="aboutus.php" title="关于我们">关于我们</a>
						</li>
						<li>
							<a href="nxservice.php" title="家长放心服务">家长放心服务</a>
						</li>
						<li>
							<a href="services.php" title="精品境外服务">精品境外服务</a>
						</li>
						<li>
							<a href="javascript:void(0);" title="联系我们" wliu-diag  diag-target="#contactus" diag-toggle="click">联系我们</a>
						</li>
                </ul>
                <ul right>
					<li><a href="#" style="padding-left:5px;padding-right:5px;"><span class="glyphicon glyphicon-user"></span> 注册账号</a></li>
					<li highlight><a href="#" style="padding-left:5px;padding-right:5px;"><span class="glyphicon glyphicon-log-in"></span> 登录</a></li>                
                </ul>
            </div>
        </div>
    </div>
</div>

<!--

<nav id="main_menu" class="navbar navbar-default navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			<span class="sr-only">Toggle navigation</span>
			<i class="icon-menu"></i> 
            	网站菜单
			</button>
			<a class="navbar-brand" style="padding:5px;" href="/"><img src="theme/wliu/company/readings-logo.png" /></a>
		</div>
 
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
                <li>
					<a href="index.php" title="读书国际首页">首页</a>
				</li>
                <li>
					<a href="aboutus.php" title="关于我们">关于我们</a>
				</li>

				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" title="学校介绍">官方代理</a>
					<ul class="dropdown-menu">
						<li>
							<a href="university.php" title="关于大学"><i class="icon-layers fa-fw"></i>关于大学</a>
						</li>
						<li>
							<a href="schoolzone.php" title="关于学区"><i class="icon-star fa-fw"></i>关于学区</a>
						</li>
						<li>
							<a href="glenlyonnorfolk.php" title="GNS贵族学校"><i class="icon-star fa-fw"></i>GNS贵族学校</a>
						</li>
					</ul>
				</li>


				<li>
					<a href="nxservice.php" title="家长放心服务">家长放心服务</a>
				</li>
				<li>
					<a href="services.php" title="精品境外服务">精品境外服务</a>
				</li>
				<li>
					<a href="javascript:void(0);" title="联系我们" wliu-diag  diag-target="#contactus" diag-toggle="click">联系我们</a>
				</li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
				<li><a href="#" style="padding-left:5px;padding-right:5px;"><span class="glyphicon glyphicon-user"></span> 注册账号</a></li>
        		<li><a href="#" style="padding-left:5px;padding-right:5px;"><span class="glyphicon glyphicon-log-in"></span> 登录</a></li>                
            </ul>
		</div>
	</div>
</nav>
-->


<div ng-controller="DSGJ_CONTACTUS">
	<div id="contactus" style="width:480px;">
		<div class="wliu-diag-content">
			<div class="row">
				<div class="col-md-3 text-nowrap">
					<form.label table="contactus_table" name="full_name"></form.label>
				</div>
				<div class="col-md-9">		
					<form.textbox table="contactus_table" name="full_name"></form.textbox>
				</div>
			</div>

			<div class="row">
				<div class="col-md-3 text-nowrap">
					<form.label table="contactus_table" name="email"></form.label>
				</div>
				<div class="col-md-9">		
					<form.textbox table="contactus_table" name="email"></form.textbox>
				</div>
			</div>
			<div class="row">
				<div class="col-md-3">
					<form.label table="contactus_table" name="phone"></form.label>
				</div>
				<div class="col-md-9">		
					<form.textbox table="contactus_table" name="phone"></form.textbox>
				</div>
			</div>
			<div class="row">
				<div class="col-md-3">
					<form.label table="contactus_table" name="detail"></form.label>
				</div>
				<div class="col-md-9">		
					<form.textarea table="contactus_table" name="detail" style="height:160px;width:100%;"></form.textarea>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<center>
						<form.button table="contactus_table" name="save" 	actname="提交" action="" success="postSuccess()"></form.button>
						<form.button table="contactus_table" name="reset" 	actname="取消"></form.button>
					</center>
				</div>
			</div>
		</div>
	</div>
	<table.popup table="contactus_table"></table.popup>
</div>


<div wliu-autotip></div>
<div wliu-wait></div>
<div id="wmtips" wliu-popup></div>


<script language="javascript" type="text/javascript">
	var col1 = new WLIU.COL({key:1, coltype:"hidden", 		name:"id", 			colname:"ID",  			coldesc:"Contact US ID" });
	var col2 = new WLIU.COL({key:0, coltype:"textbox", 		name:"full_name",	colname:"姓名", 			coldesc:"Full Name", 	  need:1,  notnull: 1});
	var col3 = new WLIU.COL({key:0, coltype:"textbox", 		name:"email", 	  	colname:"电子邮件", 	coldesc:"Email Address", need:1, notnull: 1, datatype:"EMAIL" });
	var col4 = new WLIU.COL({key:0, coltype:"textbox", 		name:"phone", 	  	colname:"电话", 		  coldesc:"Phone" });
	var col5 = new WLIU.COL({key:0, coltype:"textarea", 	name:"detail", 		colname:"咨询内容", 	 coldesc:"Detail",       need: 1, notnull:1});

	var cols = [];
	cols.push(col1);
	cols.push(col2);
	cols.push(col3);
	cols.push(col4);
	cols.push(col5);

	var form = new WLIU.TABLE({
		lang:	 	GLang,
		scope: 		"mytab",
		url:   		"ajax/contactus_action.php",
		tooltip:	"wmtips",
		cols: 		cols
	});


	app.controller("DSGJ_CONTACTUS", function ($scope) {
		form.setScope( $scope, "contactus_table" );
		form.formNew();

		$scope.postSuccess = function() {
			form.formReset();
			$("#contactus").trigger("hide");
		}
	});

	$(function(){
		$("li a[href='<?php echo $temp_name; ?>']", "#main_menu ul").parents("ul > li").addClass("active");

		$("#contactus").wliuDiag({
							title:		"联系我们",
							maskable: 	true,
							movable: 	true
		});
	});
</script>

