<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_search.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_treeview.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["tree"]["schema"]["head"]["action"]=="load"?"view":$action;	
	$action = $_REQUEST["tree"]["schema"]["head"]["action"]=="init"?"view":$action;	
	$action = $_REQUEST["tree"]["schema"]["head"]["action"]=="fresh"?"view":$action;	
	$action = $_REQUEST["tree"]["schema"]["head"]["action"]=="save"?"save":$action;	
	include_once("website_a_auth.php");

	/*** your code here ***/
	$tree = new WMLIUTREEVIEW($db, $_REQUEST["tree"], $DLang);
	$response["tree"]	    		= $tree->result;
	$response["errorCode"] 		    = $tree->result["schema"]["head"]["error"];
	$response["errorMessage"]	    = $tree->result["schema"]["head"]["errorMessage"];
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " . $_REQUEST["tree"]["schema"]["table"]["pptable"]["name"];
	$audit_table 	.= "\nnntable: " . $_REQUEST["tree"]["schema"]["table"]["nntable"]["name"];
	$audit_table 	.= "\ntttable: " . $_REQUEST["tree"]["schema"]["table"]["tttable"]["name"];
	$audit_table 	.= "\nmmtable: " . $_REQUEST["tree"]["schema"]["table"]["mmtable"]["name"];
	$audit_table 	.= "\nsstable: " . $_REQUEST["tree"]["schema"]["table"]["sstable"]["name"];
	$audit_table 	.= "\nddtable: " . $_REQUEST["tree"]["schema"]["table"]["ddtable"]["name"];
	$audit_detail 	= "\nNodeID: " .  $tree->result["node"]["nodeid"];
	$audit_detail 	.= "\nParent: " .  $tree->result["node"]["parentid"];
	$audit_detail 	.= "\nState: " .  $tree->result["node"]["nodestate"];
	$audit_detail 	.= "\nError: " . $tree->result["schema"]["head"]["error"];
	$audit_detail 	.= "\nMessage: " . $tree->result["schema"]["head"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);

	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["tree"] 							        = $_REQUEST["tree"];
	$_REQUEST["tree"]["schema"]["head"]["error"] 		= $e->getCode();
	$_REQUEST["tree"]["schema"]["head"]["errorMessage"] = $e->getMessage();
	$response["errorCode"] 		    			        = $e->getCode();
	$response["errorMessage"] 	    			        = $e->getMessage();
	$response["errorLine"] 		    			        = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   						= $e->getField();
	echo json_encode($response);
}
?>