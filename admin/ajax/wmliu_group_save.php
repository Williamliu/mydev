<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_form.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["form"]["detail"]["head"]["action"]=="load"?"view":$action;	
	$action = $_REQUEST["form"]["detail"]["head"]["action"]=="init"?"view":$action;	
	$action = $_REQUEST["form"]["detail"]["head"]["action"]=="fresh"?"view":$action;	
	
	$action_ff = $_REQUEST["form"]["detail"]["head"]["state"];
	$action = $action_ff=="new"?"add":$action;	
	$action = $action_ff=="update"?"save":$action;	
	$action = $action_ff=="delete"?"delete":$action;	
	include_once("website_a_auth.php");



	/*** your code here ***/
    $form = new WMLIUFORM($db, $_REQUEST["form"], $DLang);
    //print_r($_REQUEST["tree"]);
    switch($_REQUEST["form"]["head"]["state"]) {
        case "add":
            $_REQUEST["tree"]["schema"]["head"]["actboxid"] = $form->form["head"]["table"]["val"];
            
            if( $form->form["head"]["error"] <= 0 ) {
                foreach($_REQUEST["tree"]["nodes"][0]["nodes"] as $node) {
                    update_nodes($form->form["head"]["table"]["val"], $node);
                }
            }
            break;
        case "update":
            $_REQUEST["tree"]["schema"]["head"]["actboxid"] = $form->form["head"]["table"]["val"];
            if( $form->form["head"]["error"] <= 0 ) {
                $db->delete( "website_group_right",  array("group_id"=>$_REQUEST["tree"]["schema"]["head"]["actboxid"]) );
                foreach($_REQUEST["tree"]["nodes"][0]["nodes"] as $node) {
                    update_nodes($form->form["head"]["table"]["val"], $node);
                }
            }
            break;
        case "delete":
            $_REQUEST["tree"]["schema"]["head"]["actboxid"] = -1;
            break;
    }
	$response["form"]	    		= $form->form;
    $response["errorCode"] 		    = 0;
	$response["errorMessage"]	    = "";
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " .  $_REQUEST["form"]["schema"]["table"]["pptable"]["name"];
	$audit_table 	.= "\nmmtable: " . $_REQUEST["form"]["schema"]["table"]["mmtable"]["name"];
	$audit_table 	.= "\nsstable: " . $_REQUEST["form"]["schema"]["table"]["sstable"]["name"];
	$audit_detail 	= "\npid: " . $_REQUEST["form"]["schema"]["idvals"]["pid"];
	$audit_detail 	.= "\nsid: " . $_REQUEST["form"]["schema"]["idvals"]["sid"];
	$audit_detail 	.= "\nstate: " . $_REQUEST["form"]["detail"]["head"]["state"];
	$audit_detail 	.= "\nError: " . $form->result["detail"]["head"]["error"];
	$audit_detail 	.= "\nMessage: " . $form->result["detail"]["head"]["errorMessage"];
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

function update_nodes($gid, $node) {
    global $db;
    $feilds = array();
    $feilds["group_id"] = $gid;
    $feilds["menu_id"]  =  $node["nodeid"];
    foreach($node["right_id"] as $key=>$val ) {
        if(strtolower($val)=="true" || $val===true) { 
            $feilds["right_id"] =  $key;
            $db->insert("website_group_right", $feilds);
        }
    }

    foreach($node["nodes"] as $child) {
        update_nodes($gid, $child);
    }
}
?>