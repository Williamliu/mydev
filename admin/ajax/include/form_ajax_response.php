<?php
	cACTION::clearForm($table);
	$response["table"] = $table;
	$db->close();
	echo json_encode($response);
?>