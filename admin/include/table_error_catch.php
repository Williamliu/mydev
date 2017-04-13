<?php
    $response 									= array();
    
    $table 										= $_REQUEST["table"];
    $table["navi"]["loading"]       			= 0;
    $table["error"]["errorCode"] 				= $e->getCode();
    $table["error"]["errorMessage"] 			= $e->getMessage();
    $table["error"]["errorField"]		   	 	= $e->getField();
    unset($table["cols"]);

    $response["table"] 							= $table; 

    $response["errorCode"] 		    			= $e->getCode();
    $response["errorMessage"] 	    			= $e->getMessage();
    $response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
    $response["errorField"]		   	 			= $e->getField();
    echo json_encode($response);
?>