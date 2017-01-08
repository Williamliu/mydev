<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$form = $_REQUEST["form"];
	$form["head"]["base"] = "public_user";

	$action = $form["head"]["action"];
	include_once("public_a_auth.php");

	/*** your code here ***/
	$formObj = new LWHFORM($db, $form, $DLang);
	switch( $action ) {
		case "view":
			$formObj->action();
			$form["filter"]  		= $formObj->result["filter"];
			$form["head"]			= $formObj->result["head"];
			$form["cols"]  			= $formObj->result["cols"];
			break;
		case "save":
			$form = $formObj->verify();
			if( $form["head"]["error"] == 0 ) {
				$user_name 	=  SEARCH::colVal($form["cols"], "user_name");
				$email 		=  SEARCH::colVal($form["cols"], "email");
				$user_id 	=  $form["filter"]["id"];
				if( $user_id == $public_user["id"] ) {
					$result = $db->query("SELECT * FROM public_user WHERE deleted <> 1 AND id <> '" . $user_id . "' AND user_name = '" . $user_name . "'");
					if( $db->row_nums($result) > 0 ) {
							$msg = '"' . $user_name . '" ' . $words["account.used"];
							$uidx = SEARCH::array_find( SEARCH::array_col($form["cols"],"col"), "user_name");
							SEARCH::writeErr($form["head"], $form["cols"][$uidx], $msg);
					}
				
					$result = $db->query("SELECT * FROM public_user WHERE deleted <> 1 AND id <> '" . $user_id . "' AND email = '" . $email . "'");
					if( $db->row_nums($result) > 0 ) {
						$msg = '"' . $email . '" ' . $words["account.used"];
						$eidx = SEARCH::array_find( SEARCH::array_col($form["cols"],"col"), "email");
						SEARCH::writeErr($form["head"], $form["cols"][$eidx], $msg);
					}
				} else {
					$msg = $words["account.notallow"];
					SEARCH::writeErr($form["head"], $a, $msg);
				}
			}
			
			if( $form["head"]["error"] == 0 ) {
				$formObj = new LWHFORM($db, $form, $DLang);
				$formObj->action();
				$form["filter"]  		= $formObj->result["filter"];
				$form["head"]			= $formObj->result["head"];
				$form["cols"]  			= $formObj->result["cols"];
			}
			
			break;
	}
		

	$response["form"]					= $form;
	$response["errorCode"] 		    	= $form["head"]["error"];
	$response["errorMessage"]	    	= $form["head"]["errorMessage"];
	/**********************/


	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "table: public_user";
	$audit_detail 	= "id: " . $form["filter"]["id"];
	$audit_detail 	.= "\nError: " . $form["head"]["error"];
	$audit_detail 	.= "\nMessage: " . $form["head"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);
		
	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["form"] 				= $_REQUEST["form"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>