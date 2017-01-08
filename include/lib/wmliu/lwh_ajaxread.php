<?php
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");
class LWHREAD {
	public $schema;
    public $result;
	public $data;
	public $db;
	private $dlang;
	public function __construct($db, $schema, $dlang) {
		$this->schema 	        = $schema;
		$this->db 		        = $db;
		$this->dlang			= $dlang;
		$this->schema["lang"] 	= $schema["lang"]?$schema["lang"]:$this->dlang;
		$this->data 			= array();
	}

	public function action() {
		switch($this->schema["action"]) {
			case "load":
                $this->checklist();
				$this->data 			= $this->load();
                $this->result["schema"] = $this->schema;
                $this->result["data"] 	= $this->data;
				break;
		}
	}

	public function load() {
		$db = $this->db;

		$data = array();
		if( $this->schema["pptable"]["name"]!= "" ) {
			$fields 	= $this->getCols("pptable");
			$field_str 	= implode(",", $fields);
			$pptable 	= $this->schema["pptable"]["name"];
			$pcol		= $this->schema["pptable"]["col"];
			$pval		= $this->schema["pptable"]["val"];
			$criteria 	= $this->schema["pptable"]["criteria"]?$this->schema["pptable"]["criteria"]:"";
			$orderby	= $this->schema["pptable"]["orderby"]?$this->schema["pptable"]["orderby"]:"";
			$orderby	= ($orderby==""?"":" ORDER BY ") . $orderby;
			$pageno		= $this->schema["pptable"]["pageNo"]?$this->schema["pptable"]["pageNo"]:0;
			$pagesize	= $this->schema["pptable"]["pageSize"]?$this->schema["pptable"]["pageSize"]:0;
			if($pval !="" && $criteria=="") 	$criteria = " AND $pcol = '" . $pval . "'";
			
			$querypp0 	= "SELECT $pcol as pid, $field_str FROM $pptable WHERE deleted <> 1 AND status = 1 $criteria $orderby";
			if($pageno > 0 || $pagesize > 0) {
				$pageno 	= $pageno?$pageno:1;
				$pagesize 	= $pagesize?$pagesize:20;
				$querypp 	= "SELECT * FROM (" . $querypp0 . ") res1  LIMIT " . ($pageno-1) * $pagesize . " , " . $pagesize;
			} else {
				$querypp = $querypp0;
			}
			
			$this->schema["pptable"]["query"]= $querypp;
			
			$resultpp 	= $db->query($querypp);
			$cnt 		= 0;
			while( $rowpp = $db->fetch($resultpp) ) {
				$data[$cnt][$pid] = $rowpp[$pcol];
				foreach( $this->schema["pptable"]["cols"] as $colObj ) {
						switch( strtolower($colObj["type"]) ) {
							case "text":
								$data[$cnt][$colObj["col"]] = LANG::trans($rowpp[$colObj["col"]], $this->schema["lang"]);
								break;
							case "image":
								$schema = array();
								$schema["filter"] 	= $colObj["filter"];
								$schema["mode"] 	= $colObj["mode"]?$colObj["mode"]:"thumb";
								$schema["noimg"] 	= 0;
						
								$download = new DOWNLOADIMAGE($db, $schema, $this->dlang);
								
								$download->refid($rowpp[$pid]);
        				    	$data[$cnt][$colObj["col"]] = $download->MainBase64($schema["mode"]);  //WMIMAGE::Base64($db, $row["sid"], "thumb", 0);
								break;
							case "checkbox":
								$rtable = $colObj["rtable"];
								$rcol 	= $colObj["rcol"];
								$resultppcc = $db->select( $colObj["rtable"], $colObj["col"], array( $rcol=>$rowpp[$pcol] ));
								$rowsppcc	= $db->rows($resultppcc); 
								$vals 		= '';							
								foreach($rowsppcc as $rowppcc) {
									$vals  .= ($vals==""?"":",") . $rowppcc[$colObj["col"]];
								}
								$data[$cnt][$colObj["col"]] = $vals;
								break;
						}
				} // end of pptable cols
				
				
				if( $this->schema["mmtable"]["name"]!= "" ) {
					// mmtable 
					$mmtable 	= $this->schema["mmtable"]["name"];
					$pref		= $this->schema["mmtable"]["pref"];
					$sref		= $this->schema["mmtable"]["sref"];

					// sstable 
					$data_ss	= array();
					$fields 	= $this->getCols("sstable");
					$field_str 	= implode(",", $fields);
					$sstable 	= $this->schema["sstable"]["name"];
					$scol		= $this->schema["sstable"]["col"];
					$sval		= $this->schema["sstable"]["val"];
					$criteria 	= $this->schema["sstable"]["criteria"]?$this->schema["sstable"]["criteria"]:"";
					$orderby	= $this->schema["sstable"]["orderby"]?$this->schema["sstable"]["orderby"]:"";
					$orderby	= ($orderby==""?"":" ORDER BY ") . $orderby;
					$pageno		= $this->schema["sstable"]["pageNo"]?$this->schema["sstable"]["pageNo"]:0;
					$pagesize	= $this->schema["sstable"]["pageSize"]?$this->schema["sstable"]["pageSize"]:0;
					if($sval !="" && $criteria=="") 	$criteria = " AND $scol = '" . $sval . "'";
					$queryss0 	= "SELECT $scol as sid, $field_str 
										FROM $sstable
									 	INNER JOIN $mmtable ON ($sstable.$scol = $mmtable.$sref AND $mmtable.$pref = '" . $rowpp[$pcol] . "') 
										WHERE $sstable.deleted <> 1 AND $sstable.status = 1 AND $mmtable.$pref = '" . $rowpp[$pcol] . "' $criteria $orderby";
				
					if($pageno > 0 || $pagesize > 0) {
						$pageno 	= $pageno?$pageno:1;
						$pagesize 	= $pagesize?$pagesize:20;
						$queryss 	= "SELECT * FROM (" . $queryss0 . ") res1  LIMIT " . ($pageno-1) * $pagesize . " , " . $pagesize;
					} else {
						$queryss = $queryss0;
					}

				
				} else {
					// sstable 
					$data_ss	= array();
					$fields 	= $this->getCols("sstable");
					$field_str 	= implode(",", $fields);
					$sstable 	= $this->schema["sstable"]["name"];
					$pref		= $this->schema["sstable"]["pref"];
					$scol		= $this->schema["sstable"]["col"];
					$sval		= $this->schema["sstable"]["val"];
					$criteria 	= $this->schema["sstable"]["criteria"]?$this->schema["sstable"]["criteria"]:"";
					$orderby	= $this->schema["sstable"]["orderby"]?$this->schema["sstable"]["orderby"]:"";
					$orderby	= ($orderby==""?"":" ORDER BY ") . $orderby;
					$pageno		= $this->schema["sstable"]["pageNo"]?$this->schema["sstable"]["pageNo"]:0;
					$pagesize	= $this->schema["sstable"]["pageSize"]?$this->schema["sstable"]["pageSize"]:0;
					if($sval !="" && $criteria=="") 	$criteria = " AND $scol = '" . $sval . "'";
					$queryss0 	= "SELECT $scol as sid, $field_str FROM $sstable WHERE deleted <> 1 AND status = 1 AND $pref = '" . $rowpp[$pcol] . "' $criteria $orderby";

					if($pageno > 0 || $pagesize > 0) {
						$pageno 	= $pageno?$pageno:1;
						$pagesize 	= $pagesize?$pagesize:20;
						$queryss 	= "SELECT * FROM (" . $queryss0 . ") res1  LIMIT " . ($pageno-1) * $pagesize . " , " . $pagesize;
					} else {
						$queryss = $queryss0;
					}

				}
				
				$this->schema["sstable"]["query"]= $queryss;
				
				$resultss 	= $db->query($queryss);
				$cnt1 		= 0;
				while( $rowss = $db->fetch($resultss) ) {
					$data_ss[$cnt1][$scol] = $rowss[$scol];
					foreach( $this->schema["sstable"]["cols"] as $colObj ) {
							switch( strtolower($colObj["type"]) ) {
								case "text":
									$data_ss[$cnt1][$colObj["col"]] = LANG::trans($rowss[$colObj["col"]], $this->schema["lang"]);
									break;
								case "image":
									$schema = array();
									$schema["filter"] 	= $colObj["filter"];
									$schema["mode"] 	= $colObj["mode"]?$colObj["mode"]:"thumb";
									$schema["noimg"] 	= 0;
							
									$download = new DOWNLOADIMAGE($db, $schema, $this->dlang);
									
									$download->refid($rowss[$scol]);
									$data_ss[$cnt1][$colObj["col"]] = $download->MainBase64($schema["mode"]);  //WMIMAGE::Base64($db, $row["sid"], "thumb", 0);
									break;
								case "checkbox":
									$rtable = $colObj["rtable"];
									$rcol 	= $colObj["rcol"];
									$resultsscc = $db->select( $colObj["rtable"], $colObj["col"], array( $rcol=>$rowss[$scol] ));
									$rowssscc	= $db->rows($resultsscc); 
									$vals 		= '';							
									foreach($rowssscc as $rowsscc) {
										$vals  .= ($vals==""?"":",") . $rowsscc[$colObj["col"]];
									}
									$data_ss[$cnt1][$colObj["col"]] = $vals;
									break;
							}
					} // end of sstable cols
					$cnt1++;
				} // end of while sstable
				
				$data[$cnt]["rows"] = $data_ss;
				$cnt++;
			}
		} // end of pptable

		else
		// only sstable 
		{
			// sstable 
			$data_ss	= array();
			$fields 	= $this->getCols("sstable");
			$field_str 	= implode(",", $fields);
			$sstable 	= $this->schema["sstable"]["name"];
			$scol		= $this->schema["sstable"]["col"];
			$sval		= $this->schema["sstable"]["val"];
			$criteria 	= $this->schema["sstable"]["criteria"]?$this->schema["sstable"]["criteria"]:"";
			$orderby	= $this->schema["sstable"]["orderby"]?$this->schema["sstable"]["orderby"]:"";
			$orderby	= ($orderby==""?"":" ORDER BY ") . $orderby;
			$pageno		= $this->schema["sstable"]["pageNo"]?$this->schema["sstable"]["pageNo"]:0;
			$pagesize	= $this->schema["sstable"]["pageSize"]?$this->schema["sstable"]["pageSize"]:0;
			if($sval !="" && $criteria=="") 	$criteria = " AND $scol = '" . $sval . "'";
			$queryss0 	= "SELECT $scol as sid, $field_str FROM $sstable WHERE deleted <> 1 AND status = 1 $criteria $orderby";
	
			if($pageno > 0 || $pagesize > 0) {
				$pageno 	= $pageno?$pageno:1;
				$pagesize 	= $pagesize?$pagesize:20;
				$queryss 	= "SELECT * FROM (" . $queryss0 . ") res1  LIMIT " . ($pageno-1) * $pagesize . " , " . $pagesize;
			} else {
				$queryss = $queryss0;
			}
			
			$resultss 	= $db->query($queryss);
			$cnt1 		= 0;
			while( $rowss = $db->fetch($resultss) ) {
				$data_ss[$cnt1][$scol] = $rowss[$scol];
				foreach( $this->schema["sstable"]["cols"] as $colObj ) {
						switch( strtolower($colObj["type"]) ) {
							case "text":
								$data_ss[$cnt1][$colObj["col"]] = LANG::trans($rowss[$colObj["col"]], $this->schema["lang"]);
								break;
							case "image":
								$schema = array();
								$schema["filter"] 	= $colObj["filter"];
								$schema["mode"] 	= $colObj["mode"]?$colObj["mode"]:"thumb";
								$schema["noimg"] 	= 0;
						
								$download = new DOWNLOADIMAGE($db, $schema, $this->dlang);
								
								$download->refid($rowss[$scol]);
								$data_ss[$cnt1][$colObj["col"]] = $download->MainBase64($schema["mode"]);  //WMIMAGE::Base64($db, $row["sid"], "thumb", 0);
								break;
							case "checkbox":
								$rtable = $colObj["rtable"];
								$rcol 	= $colObj["rcol"];
								$resultsscc = $db->select( $colObj["rtable"], $colObj["col"], array( $rcol=>$rowss[$scol] ));
								$rowssscc	= $db->rows($resultsscc); 
								$vals 		= '';							
								foreach($rowssscc as $rowsscc) {
									$vals  .= ($vals==""?"":",") . $rowsscc[$colObj["col"]];
								}
								$data_ss[$cnt1][$colObj["col"]] = $vals;
								break;
						}
				} // end of sstable cols
				$cnt1++;
			} // end of while sstable

			$data = $data_ss;
		}
		return $data;
	}

	public function getCols($coltable) {
		$temp = array();
		foreach( $this->schema[$coltable]["cols"] as $colObj ) {
			switch( strtolower($colObj["type"]) ) {
				case "text":
					$temp[] = $colObj["col"];
					break;
				default:
					break;
			}
		}
		return $temp;
	}
	
	public function getFields($coltable) {
		$temp = array();
		foreach( $this->form["data"] as $key=>$colObj ) {
			if( $colObj["table"] == $coltable ) { 
				$colObj["value"] = str_replace(array("undefined", "null"), array("",""), $colObj["value"]);
				$colObj["value"] = trim($colObj["value"]);
				switch( strtolower($colObj["coltype"]) ) {
					case "text":
					case "textbox":
					case "hidden":
					case "textarea":
						$temp[$key] = LANG::trans($colObj["value"], $this->dlang);
						break;
					case "radio":
					case "select":
						$temp[$key] = $colObj["value"]?$colObj["value"]:0;
						break;
					case "password":
						if( !preg_match("/_confirm$/", $colObj["col"]) ) $temp[$key] = $colObj["value"];
						break;
					case "checkbox":
						break;
				}
			}
		}
		return $temp;
	}
	
	  	
    private function checklist() {
    	$this->schema["listTables"]["checklist"]  = SEARCH::checklist($this->db,  $this->schema["lang"], $this->schema["checklist"]);
    }

	
	
	private $dataType = array(
			"EMAIL"		=> "/^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/i", 	//Email :  abd_dkkd.dkfd-dkd@hotmail.adk-dkdk.gc.ca
			"EMAILS"	=> "/^(?:(?:\w+\.?)*\w+@(?:\w+\.)+\w+(\s*,\s*)?)+$/i",  		// a@a.com, b@b.com, c@c.com
			"ALL"		=> "/^(?:.|\s)*$/i", 						// all chars
			"CHAR"		=> "/^.*$/i", 								// all chars except \n\r 
			"LETTER"	=> "/^[a-zA-Z'\",\._ ]*$/i",
			"NUMBER"	=> "/^[+-]?[0-9]*(?:(?:\.)[0-9]+)?(,)?$/i",
			"DATE"		=> "/^(?:19|20)[0-9]{2}(?:-|\/)(?:1[0-2]|0?[1-9])(?:-|\/)(?:3[01]|[0-2]?[0-9])$/i",
			"TIME"		=> "/^((2[0-3]|[01]?[0-9])(:[0-5]?[0-9](:[0-5]?[0-9])?)?[ ]*(am|pm)?)$/i",
			"DATETIME"	=> "/^(?:19|20)[0-9]{2}(?:-|\/)(?:1[0-2]|0?[1-9])(?:-|\/)(?:3[01]|[0-2]?[0-9])[ ]+((2[0-3]|[01]?[0-9])(:[0-5][0-9](:[0-5][0-9])?)?[ ]*(am|pm)?)$/i"
	);
	
}


function writeErr(&$form, $colName, $msg) {
	if( $colName != "" ) {
		$form["data"][$colName]["error"] 			= 1;
		$form["data"][$colName]["errorMessage"] 	= $msg;
	}
	$form["schema"]["error"] 			= 1;
	$form["schema"]["errorMessage"] 	.= ($form["schema"]["errorMessage"]==""?"":"<br>"). $msg;
}
?>
