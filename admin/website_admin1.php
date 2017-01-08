<?php
session_start();
ini_set("display_errors", 0);
include_once("website_a_secure.php");
include_once("website_a_auth.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
        <?php require("website_a_include.php")?>
		<?php include_once($CFG["include_path"] . "/lib/html/html.php"); ?>

		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.formp.js"></script>
		<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.ajax.js"></script>
        <script language="javascript" type="text/javascript">
			var lwh;

			$(function() {
				lwh = new LWH.FORM({
							lang:		GLang,
							container: "#myform",
							sstable:	"website_admin",
							sid:		1
						});

				//lwh.error("aaa", 1, "you are bet");
				//lwh.error("bbb", 1, "select ok");
				lwh.setCallback({
					before: function(data) {
						console.log(data);
					},
					after: function(data) {
						console.log(data);
					}
				})

			});

            var app = angular.module("myApp", ["wmliuFormp"])
            app.controller("webAdmin", function ($scope, wmliuFormpService) {

                $scope.adminForm = {
                    buttons: {
                        button: [{ key: "save", title: words["save"] }, { key: "cancel", title: words["cancel"] } ],
                        rights:  GUserRight
                    },
                    schema: {
                        table: {
                            sstable: { name: "website_admin", col: "id"}
                        },
                        checklist: {
							group_id: { rtable: "website_admin_group", rcol: "admin_id", stable: "website_group", scol:"id", stitle: langCol("title", GLang), sdesc: langCol("desc", GLang) },
                       		weight:	  { stable: "website_weight_unit", scol: "id", stitle: langCol("title", GLang) }
					    },
						tablelist: {
							country_id: { 
								stable: "website_country", 
								scol:   "id",
								rtable: "website_admin_country", 
								rcol: "admin_id",
								cols:  [
									{col: "", 							type:"iselect", align:"center"	},
									{col: "", 							type:"rowno", 	align:"center", title: words["sn"], required: 1, maxlength: 64 },
									{col: langCol("country", GLang), 	type:"textbox", title: words["country"], width: 40, 	required: 1, maxlength: 64 },
									{col: langCol("currency", GLang), 	type:"textbox", title: words["currency"], width:40,		required: 1, maxlength: 16},
									{col: "symbol", 					type:"textbox",	title: words["currency.symbol"], width:30, align:"center", required: 1, maxlength: 16 },
									{col: "price", 						type:"textbox", title: words["price"], required: 1, maxlength: 16, pattern: "NUMBER", table:"rtable" },
									{col: "weight", 					type:"select",	title: words["weight"], required: 1,  align:"center",	table:"rtable" }
								]			
							}
						},
                        idvals: { sid: "" }
                    },
                    detail: {
                        head: {
                            lang: GLang,
                            wait: 1,
                            loading: 0,

                            state: 		"none",
                            action: 	"none",
                            timezone: 	getTimezone(),
                            error: 		0,
                            errorMessage: ""
                        },
                        cols: {
                            user_name: 	{ type: "textbox", 	title: words["user_name"], 	required: 0, maxlength: 64 },
                            email: 		{ type: "textbox", 	title: words["email"], 		pattern: "email", required: 1, maxlength: 256 },
                            password: 	{ type: "password", title: words["password"], 	required: 1, minlength: 6, maxlength: 16 },
                            full_name: 	{ type: "textbox", 	title: words["full_name"], 	required: 1, maxlength: 256 },
                            phone: 		{ type: "textbox", 	title: words["phone"],		required: 0, maxlength: 64 },
                            cell: 		{ type: "textbox", 	title: words["cell"],		required: 0, maxlength: 64 },
                            address: 	{ type: "textbox", 	title: words["address"],	required: 0, maxlength: 256 },
                            city: 		{ type: "textbox", 	title: words["city"],		required: 0, maxlength: 64 },
                            state: 		{ type: "textbox", 	title: words["state"],		required: 0, maxlength: 64 },
                            country: 	{ type: "textbox", 	title: words["country"],	required: 0, maxlength: 64 },
                            postal: 	{ type: "textbox", 	title: words["postal"],		required: 0, maxlength: 16 },
							group_id:	{ type: "checkbox", title: words["right.group"],required: 0 },
							country_id:	{ type: "tablelist",title: words["country"] },
                            status: 	{ type: "bool", 	title: words["status"] },
                            created_time: { type: "intdate",title: words["created_time"] },
                            last_updated: { type: "intdate",title: words["last_updated"] },
                            last_login: { type: "intdate",  title: words["last_login"] },
							hits:		{ type: "text", 	title: words["admin.hits"] }
                        },
                        vals: {
                        }
                    }
                }; // end form

            });
			
			function get() {
				lwh.action({action:"save"});
			}
        </script>
</head>
<body ng-app="myApp">
<?php require("website_a_header.php")?>
<?php require("website_a_menu.php")?>
<div class="main-content"><div class="frame-center">
<!------------------------------------------------ Begin of website content --------------------------------------------->

	<div id="myform">
    <!--
    <span name="user_name" 	coltype="readonly">dfasdfds</span><br />
    <span name="group_id" 	coltype="readcheck" 	rtable="website_admin_group" rcol="admin_id"  stable="website_group" 	scol="id" stitle="<?php echo LANG::langCol("title", $GLang);?>"></span><br />
    <span name="password" 	coltype="readselect" 	stable="website_menu" scol="id" stitle="<?php echo LANG::langCol("title", $GLang);?>"></span><br />
    -->
    <?php 
		$colObj = array();
		$colObj["name"] 	= "group_id";
		$colObj["col"]  	= "group_id";
		$colObj["colname"] 	= $words["right.group"];
		$colObj["table"] 	= "sstable";
		$colObj["rtable"] 	= "website_admin_group";
		$colObj["rcol"] 	= "admin_id";
		
		$colObj["stable"] 	= "website_group";
		$colObj["scol"] 	= "id";
		$colObj["stitle"] 	= LANG::langCol("title", $GLang);
		$colObj["sdesc"] 	= LANG::langCol("desc", $GLang);
		
		$colObj["sn"] 		= 1;
		$colObj["colnum"] 	= 3;
		$colObj["align"] 	= 0;
		$colObj["notnull"] 	= 1;
		
		echo HTML::checkbox($db, $GLang, $colObj, "1,3");
		 
	?>
    <br />
    <br />
    <input   name="aaa"   col="email" datatype="email" maxlength="25" notnull=1 value="hello kitty"  colname="<?php echo $words["email"];?>" />


    <?php 
		$colObj = array();
		$colObj["name"] 	= "password";
		$colObj["colname"] 	= $words["password"];
		$colObj["table"] 	= "sstable";
		
		$colObj["stable"] 	= "website_group";
		$colObj["scol"] 	= "id";
		$colObj["stitle"] 	= LANG::langCol("title", $GLang);
		$colObj["sdesc"] 	= LANG::langCol("desc", $GLang);
		
		$colObj["sn"] 		= 1;
		//$colObj["colnum"] 	= 0;
		//$colObj["align"] 	= 1;
		$colObj["notnull"] 	= 1;
		
		echo HTML::select($db, $GLang, $colObj, "3");
		 
	?>
    <input type="button" onclick="get()" value="GET" />
    <br />
    <br />
    </div>
    <div ng-controller="webAdmin" >
        <wmliu.formp form="adminForm" name="admin_form" loading="0">
		<table>
        	<tr>
            	<td valign="top" style="padding-left:20px;">
                                <table>
                                    <tr>
                                        <td><formp.label form="adminForm" col="email"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="email" ></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="user_name"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="user_name"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td valign="top"><formp.label form="adminForm" col="password"></formp.label>: </td>
                                        <td><formp.password form="adminForm" col="password" ></formp.password></td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td valign="top"><formp.label form="adminForm" col="full_name"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="full_name"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="phone"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="phone" ></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="cell"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="cell"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="address"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="address"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="city"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="city"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="state"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="state"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="country"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="country"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="postal"></formp.label>: </td>
                                        <td><formp.textbox form="adminForm" col="postal"></formp.textbox></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="status"></formp.label>: </td>
                                        <td><formp.bool form="adminForm" col="status"></formp.bool></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <br />
                                            <formp.button form="adminForm"></formp.button>
                                            <formp.error form="adminForm" ww="40%" hh="40%" minww="300px" minhh="200px"></formp.error>
                                        </td>
                                    </tr>
                                </table>
                </td>
            	<td valign="top">
                                <table>
                                    <tr>
                                        <td valign="top"><formp.label form="adminForm" col="group_id"></formp.label>: </td>
                                        <td><formp.checkbox form="adminForm" col="group_id" colnum="1"></formp.checkbox></td>
                                    </tr>
                                    <tr><td colspan="2"><br /></td></tr>

                                    <tr>
                                        <td valign="top"><formp.label form="adminForm" col="country_id"></formp.label>: </td>
                                        <td><formp.tablelist form="adminForm" col="country_id"></formp.tablelist></td>
                                    </tr>
                                    
                                    <tr><td colspan="2"><br /></td></tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="created_time"></formp.label>: </td>
                                        <td><formp.intdate form="adminForm" col="created_time" format=""></formp.intdate></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="last_updated"></formp.label>: </td>
                                        <td><formp.intdate form="adminForm" col="last_updated" format=""></formp.intdate></td>
                                    </tr>
                                    <tr>
                                        <td><formp.label form="adminForm" col="hits"></formp.label>: </td>
                                        <td><formp.text form="adminForm" col="hits"></formp.text></td>
                                    </tr>
								</table>                     
                </td>
        	</tr>
      	</table>        
    </wmliu.formp>
	</div>

<!------------------------------------------------ End of website content --------------------------------------------->
</div></div>

<?php include_once("website_a_common.php");?>
</body>
</html>
