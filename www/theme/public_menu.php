<?php 
$temp_name = substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
?>

<nav id="main_menu" class="navbar navbar-default navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
			<span class="sr-only">Toggle navigation</span>
			<i class="icon-menu"></i> 
            	网站菜单
			</button>
			<a class="navbar-brand" style="padding:5px;" href="/"><img src="theme/light/logo/readings-logo.png" /></a>
		</div>
 
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
                <li>
					<a href="index.php" title="读书国际首页">首页</a>
				</li>
                <li>
					<a href="aboutus.php" title="关于我们">关于我们</a>
				</li>
				<!--
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
				-->
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



<div ng-controller="DSGJ_ContactUS">
<div id="contactus" style="width:480px;"  >
	<div class="wliu-diag-content">
		<div class="row">
			<div class="col-md-3 text-nowrap">
				<form.label form="form" name="full_name"></form.label>
		    </div>
			<div class="col-md-9">		
				<form.textbox form="form" name="full_name" rowsn="0" tooltip="#wmtips"></form.textbox>
			</div>
		</div>

		<div class="row">
			<div class="col-md-3 text-nowrap">
				<form.label form="form" name="email"></form.label>
		    </div>
			<div class="col-md-9">		
				<form.textbox form="form" name="email" rowsn="0" tooltip="#wmtips"></form.textbox>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<form.label form="form" name="phone"></form.label>
		    </div>
			<div class="col-md-9">		
				<form.textbox form="form" name="phone" rowsn="0" tooltip="#wmtips"></form.textbox>
			</div>
		</div>
		<div class="row">
			<div class="col-md-3">
				<form.label form="form" name="detail"></form.label>
		    </div>
			<div class="col-md-9">		
				<form.textarea form="form" name="detail" style="height:160px;width:100%;" rowsn="0" tooltip="#wmtips"></form.textarea>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<center>
			<form.linkbutton form="form" rowsn="0" name="save" outline="1" actname="提交"></form.linkbutton>
			<form.linkbutton form="form" rowsn="0" name="cancel" outline="1" actname="取消"></form.linkbutton>
				</center>
		    </div>
		</div>
	</div>
</div>

<div id="wmtips" wliu-popup></div>
<div id="wmwait" wliu-load maskable><div wliu-load-text>请稍等...</div></div>
<div id="wmautotip" wliu-tips></div>
<form.rowerror form="form" rowsn="0" targetid="taberror" maskable=0></form.rowerror>
</div>


<script language="javascript" type="text/javascript">
	var col1 = new WLIU.COL({key:1, coltype:"hidden", 		name:"id", 			colname:"ID",  			coldesc:"Contact US ID" });
	var col2 = new WLIU.COL({key:0, coltype:"textbox", 		name:"full_name",	colname:"姓名", 		  coldesc:"Full Name", 	  need:1,  notnull: 1});
	var col3 = new WLIU.COL({key:0, coltype:"textbox", 		name:"email", 	  	colname:"电子邮件", 	coldesc:"Email Address", need:1, notnull: 1, datatype:"EMAIL" });
	var col4 = new WLIU.COL({key:0, coltype:"textbox", 		name:"phone", 	  	colname:"电话", 		  coldesc:"Phone" });
	var col5 = new WLIU.COL({key:0, coltype:"textarea", 	name:"detail", 		colname:"咨询内容", 	 coldesc:"Detail",       need: 1, notnull:1});

	var cols = [];
	cols.push(col1);
	cols.push(col2);
	cols.push(col3);
	cols.push(col4);
	cols.push(col5);

	var form = new WLIU.FORM({
		scope: 	"contactus",
		url:   	"ajax/contactus_action.php",
		
		wait:   	"#wmwait",
		tooltip:	"#wmtips",		
		autotip: 	"#wmautotip",
		rowerror:   "#taberror",
		rights: {detail:1, add:1, save:1, cancel:1, clear:1, delete:1, print:1, output:1},
		cols: 	cols,
		callback: {
			ajaxSuccess: function( theTable ) {
				$("#contactus").trigger("hide");
			}
		}

	});

	app.controller("DSGJ_ContactUS", function ($scope) {
		form.setScope( $scope );
		form.addRecord();
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

