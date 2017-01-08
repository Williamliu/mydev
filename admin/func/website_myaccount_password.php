<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");

	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$form = $_REQUEST["form"];
	$action = $form["head"]["action"];
	include_once("website_a_auth.php");


	/*** your code here ***/
	$form["head"]["base"] = "website_admin";
	$formObj = new LWHFORM($db, $form, $DLang);
	switch( $action ) {
		case "save":
			$form = $formObj->verify();
			if( $form["head"]["error"] == 0 ) {
				$pass_old 	=  SEARCH::colVal($form["cols"], "password_old");
				$pass 		=  SEARCH::colVal($form["cols"], "password");
				$pass_con	=  SEARCH::colVal($form["cols"], "password_confirm");
				$admin_id 	=  $form["filter"]["id"];
				
				if( $admin_id == $admin_user["id"] ) {
					$query  = "SELECT * FROM website_admin WHERE deleted <> 1 AND id = '" . $admin_id . "' AND password = '" . $pass_old . "'";
					$result = $db->query($query);
					if( $db->row_nums($result) > 0 ) {
						$db->query("UPDATE website_admin SET password = '" . $pass . "' WHERE id = '" . $admin_id . "'");
					} else {
						$pidx = SEARCH::array_find( SEARCH::array_col($form["cols"],"col"), "password_old");
						$msg =  "'" . $form["cols"][$pidx]["colname"] . "' " . $words["password.incorrect"];
						SEARCH::writeErr($form["head"], $form["cols"][$pidx], $msg);
					}
				} else {
					$msg = $words["account.notallow"];
					SEARCH::writeErr($form["head"], $a, $msg);
				}
			}
			break;
	}

	$response["form"]					= $form;
	$response["errorCode"] 		    	= $form["head"]["error"];
	$response["errorMessage"]	    	= $form["head"]["errorMessage"];
	/**********************/


	/*** audit ***/
	$audit_action 	= "Change Password";
	$audit_table 	= "table: website_admin";
	$audit_detail 	= "id: " . $form["filter"]["id"];
	$audit_detail 	.= "user: " . $admin_user["user_name"];
	$audit_detail 	.= "\nError: " . $formObj->result["formData"]["schema"]["error"];
	$audit_detail 	.= "\nMessage: " . $formObj->result["formData"]["schema"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["formData"] 			= $_REQUEST["formData"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>