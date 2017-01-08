<?php
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhFilter.php");
class LWHTABLE {
	public 	$table;
    public 	$result;
	public 	$db;
	private $dlang;
	public function __construct($db, $table, $dlang) {
		$this->table 	                        = $table;
		$this->db 		                        = $db;
		$this->dlang							= $dlang;
		$this->table["head"]["lang"] 			= $table["head"]["lang"]?$table["head"]["lang"]:$this->dlang;
	}

	public function action() {
		$this->table["head"]["loading"]	= 0;
		switch($this->table["head"]["action"]) {
			case "init": 
				$this->init();
				break;
			case "load":
				$this->load();
				break;
			case "view":
				$this->view();
				break;
			case "save":
				$this->save();
				break;
		}
	}

	private function init() {
		$this->checklist();
		$this->result["head"] 			= $this->table["head"];
		$this->result["listTables"] 	= $this->table["listTables"];
	}

	private function save() {
		$db = $this->db;
		$sstable	= $this->table["schema"]["table"]["base"]?$this->table["schema"]["table"]["base"]:$this->table["schema"]["table"]["view"];
		$sscol 		= $this->table["schema"]["table"]["id"];
	
        $mode    	= strtolower($this->table["schema"]["table"]["mode"]?$this->table["schema"]["table"]["mode"]:"all");
        $rrtable    = $this->table["schema"]["table"]["reftable"]?$this->table["schema"]["table"]["reftable"]:"";
        $rrcol      = $this->table["schema"]["table"]["rid"]?$this->table["schema"]["table"]["rid"]:"";
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";

		foreach($this->table["data"] as $idx=>&$theRow) {
			$this->validate($this->table["data"][$idx]);
			switch( $theRow["general"]["state"] ) {
				case 0:
					break;
				case 1:
					if( $this->table["data"][$idx]["general"]["error"] <= 0 ) {
						$sid = $theRow["sid"];
						
						$fields	= array();
						$fields = $this->getRow($theRow);
						$fields["last_updated"] = time();
						$ssarr = array($sscol=>$sid);
						if( count($fields)>0 ) $db->update($sstable, $ssarr, $fields); 
						
						// handle reference 
						if( $rrtable != "" ) {
							$rcheck = $theRow["general"]["refcheck"]=="1"?true:false; 
							$rcheck = $theRow["general"]["oldrefcheck"] = $theRow["general"]["refcheck"];
							if( $ppcol=="" ) 
								$rrarr = array($rrcol=>$sid);
							else 
								$rrarr = array($rrcol=>$sid, $ppcol=>$ppval);
							
							if( $rcheck ) {
									$theRow["general"]["rid"] = $sid;
									$result_rr = $db->select($rrtable, $rrcol, $rrarr);
									if( $db->row_nums($result_rr) > 0 ) {
										// update reference
										$fields	= array();
										$fields = $this->getRow($theRow, true);
										$fields["last_updated"] = time();
										if( count($fields)>0 ) $db->update($rrtable, $rrarr, $fields); 
									} else {
										$fields	= array();
										$fields = $this->getRow($theRow, true);
										if( $ppcol=="" ) {
											$fields[$rrcol] = $sid;
										} else { 
											$fields[$rrcol] = $sid;
											$fields[$ppcol] = $ppval;
										}
										$fields["created_time"] = time();
										
										if( count($fields)>0 ) $db->insert($rrtable, $fields); 
									}
							} else {
								$theRow["general"]["rid"] = "-1";
								$db->delete($rrtable, $rrarr); 
								$this->clearReference($theRow);
							}
						}
						// end of reference
						// for reference,   checkbox value clear to "" ,  so it will delete checkbox value					
						$this->checkboxRow($theRow);
						$this->radioRow($theRow);
					}
					break;
				case 2:
					if( $this->table["data"][$idx]["general"]["error"] <= 0 ) {
						$fields	= array();
						$fields = $this->getRow($theRow);
						$fields["created_time"] = time();
						$theRow["general"]["sid"] = $db->insert($sstable, $fields); 
						//don't update due to search :   $theRow["sid"] = $theRow["sid"];
		
						$sid = $theRow["general"]["sid"];
						// handle reference 
						if( $rrtable != "" ) {
							$rcheck = $theRow["general"]["refcheck"]=="1"?true:false; 
							$rcheck = $theRow["general"]["oldrefcheck"] = $theRow["general"]["refcheck"];

							if( $ppcol=="" ) 
								$rrarr = array($rrcol=>$sid);
							else 
								$rrarr = array($rrcol=>$sid, $ppcol=>$ppval);
							
							if( $rcheck ) {
									$theRow["general"]["rid"] = $sid;
									$result_rr = $db->select($rrtable, $rrcol, $rrarr);
									if( $db->row_nums($result_rr) > 0 ) {
										// update reference
										$fields	= array();
										$fields = $this->getRow($theRow, true);
										$fields["last_updated"] = time();
										if( count($fields)>0 ) $db->update($rrtable, $rrarr, $fields); 
									} else {
										$fields	= array();
										$fields = $this->getRow($theRow, true);
										if( $ppcol=="" ) {
											$fields[$rrcol] = $sid;
										} else { 
											$fields[$rrcol] = $sid;
											$fields[$ppcol] = $ppval;
										}
										$fields["created_time"] = time();
										
										if( count($fields)>0 ) $db->insert($rrtable, $fields); 
									}
							} else {
								$theRow["general"]["rid"] = "-1";
								$db->delete($rrtable, $rrarr); 
								$this->clearReference($theRow);
							}
						}
						// end of reference
						

						$this->checkboxRow($theRow);
						$this->radioRow($theRow);
					}
					break;
				case 3:
					if( $this->table["data"][$idx]["general"]["error"] <= 0 ) {
						$sid = $theRow["sid"];

						$fields	= array();
						$fields["last_updated"] = time();
						$db->update($sstable, array($sscol=>$sid), $fields); 
						$db->detach($sstable, array($sscol=>$sid)); 
						
						// handle reference 
						if( $rrtable != "" ) {
							$rcheck = $theRow["general"]["oldrefcheck"] = $theRow["general"]["refcheck"];
							$theRow["general"]["rid"] = "-1";
							if( $ppcol=="" ) 
								$rrarr = array($rrcol=>$sid);
							else 
								$rrarr = array($rrcol=>$sid, $ppcol=>$ppval);

							$db->delete($rrtable, $rrarr); 
							$this->clearReference($theRow);
						}
						// end of reference

					}
					break;
			}
		}
		
		
		$criteria = "";
		$query = "SELECT $sscol as sid FROM $sstable WHERE deleted <> 1 $criteria";

		$result_num 	= $db->query("SELECT COUNT(1) AS CNT FROM ( " . $query . " ) res1");
		$row_total 		= $db->fetch($result_num);
		$this->table["head"]["totalNo"] 	= intval($row_total["CNT"])?intval($row_total["CNT"]):0;
		$this->table["head"]["pageNo"] 	    = intval($this->table["head"]["pageNo"]) > 0?$this->table["head"]["pageNo"]:1;
		$this->table["head"]["pageSize"] 	= intval($this->table["head"]["pageSize"]) > 0 && intval($this->table["head"]["pageSize"]) <= 200?$this->table["head"]["pageSize"]:20;
        $this->table["head"]["pageTotal"] 	= ceil($this->table["head"]["totalNo"]/$this->table["head"]["pageSize"]);

        $this->table["head"]["pageNo"] 		= intval($this->table["head"]["totalNo"])<=0?0: 
													(
                                                    	($this->table["head"]["pageNo"]>ceil($this->table["head"]["totalNo"]/$this->table["head"]["pageSize"]))?
                                                    	ceil($this->table["head"]["totalNo"]/$this->table["head"]["pageSize"]):
                                                    	$this->table["head"]["pageNo"]
													);
		
		
		$this->result["head"] 			= $this->table["head"];
		$this->result["data"] 			= $this->table["data"];
	}

	private function checkboxRow(&$theRow) {
		$db 	= $this->db;

        $mode    	= strtolower($this->table["schema"]["table"]["mode"]?$this->table["schema"]["table"]["mode"]:"all");
        $rrtable    = $this->table["schema"]["table"]["reftable"]?$this->table["schema"]["table"]["reftable"]:"";
        $rrcol      = $this->table["schema"]["table"]["rid"]?$this->table["schema"]["table"]["rid"]:"";
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";

		// don't use  $theRow["sid"], because add case.  $theRow["sid"] = -1  search client row index  
		$sid 	= $theRow["general"]["sid"];
		if( $rrtable != "" ) {
			if( $ppcol=="" ) 
				$rrarr = array($rrcol=>$sid);
			else 
				$rrarr = array($rrcol=>$sid, $ppcol=>$ppval);
		}

		foreach( $theRow as $colName=>&$colObj ) {
			$colInfo = SEARCH::colObj( $this->table["schema"]["table"]["cols"], array("name"=>$colName) ) ;
			switch( $colInfo["coltype"] ) {
				case "checkbox":
					$checkSchema = SEARCH::colObj($this->table["schema"]["checklist"], $colName);
					$ck_value = SEARCH::checkSave($this->db, $this->table["head"]["lang"], $checkSchema , $rrarr, $colObj["value"]);
					$colObj["value"] = $ck_value["value"]; 
					break;		
				case "checklist":
				case "checktext":
					$checkSchema = SEARCH::colObj($this->table["schema"]["checklist"], $colName);
					$ck_value = SEARCH::checkSave($this->db, $this->table["head"]["lang"], $checkSchema , $rrarr, $colObj["value"]);
					$colObj["value"] 		= $ck_value["value"]; 
					$colObj["valuetext"] 	= $ck_value["valuetext"]; 
					break;		
			}
		}
		return $fields;
	}

	private function radioRow(&$theRow) {
		$db 	= $this->db;
		foreach( $theRow as $colName=>&$colObj ) {
			$colInfo = SEARCH::colObj( $this->table["schema"]["table"]["cols"], array("name"=>$colName) ) ;
			switch( $colInfo["coltype"] ) {
				case "radiolist":
					$checkSchema = SEARCH::colObj($this->table["schema"]["checklist"], $colName);
					$ck_value = SEARCH::radioValue($this->db, $this->table["head"]["lang"], $checkSchema, $colObj["value"]);
					$colObj["value"] 		= $ck_value["value"]; 
					$colObj["valuetext"] 	= $ck_value["valuetext"]; 
					break;		
				case "radiotext":
					$checkSchema = SEARCH::colObj($this->table["schema"]["checklist"], $colName);
					$ck_value = SEARCH::radioValue($this->db, $this->table["head"]["lang"], $checkSchema , $colObj["value"]);
					$colObj["value"] 		= $ck_value["value"]; 
					$colObj["valuetext"] 	= $ck_value["valuetext"]; 
					break;		
			}
		}
		return $fields;
	}

	private function clearReference(&$theRow) {
        $mode    	= strtolower($this->table["schema"]["table"]["mode"]?$this->table["schema"]["table"]["mode"]:"all");
        $rrtable    = $this->table["schema"]["table"]["reftable"]?$this->table["schema"]["table"]["reftable"]:"";
        $rrcol      = $this->table["schema"]["table"]["rid"]?$this->table["schema"]["table"]["rid"]:"";
        $refcols    = $this->table["schema"]["table"]["refcols"]?$this->table["schema"]["table"]["refcols"]:array();
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";
		
		foreach( $theRow as $colName=>&$colObj ) {
			if( $colName != "general" && $colName != "sid" ) {

				if( $rrtable != "" ) {
					if(  in_array($colName, $refcols) ) {
							$colInfo = SEARCH::colObj( $this->table["schema"]["table"]["cols"], array("name"=>$colName) ) ;
							switch( $colInfo["coltype"] ) {
								case "hidden":
								case "textbox":
								case "textarea":
								case "date":
								case "time":
								case "datetime":
								case "checkbox":
									$colObj["value"] = "";
									break;
								case "select":
								case "radio":
								case "radiolist":
								case "radiotext":
								case "bool":
								case "checkbutton":
									$colObj["value"] = 0;
									break;
								case "checklist":
								case "checktext":	
									$colObj["value"]	 = "";
									$colObj["valuetext"] = "";
									break;		
								case "ymd":
									$colObj["value"]["yy"] = 0;
									$colObj["value"]["mm"] = 0;
									$colObj["value"]["dd"] = 0;
									break;
							}
					}
				}
			}
		}
	}


	private function getRow($theRow, $ref) {
        $mode    	= strtolower($this->table["schema"]["table"]["mode"]?$this->table["schema"]["table"]["mode"]:"all");
        $rrtable    = $this->table["schema"]["table"]["reftable"]?$this->table["schema"]["table"]["reftable"]:"";
        $rrcol      = $this->table["schema"]["table"]["rid"]?$this->table["schema"]["table"]["rid"]:"";
        $refcols    = $this->table["schema"]["table"]["refcols"]?$this->table["schema"]["table"]["refcols"]:array();
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";
		
		
		$fields = array();
		foreach( $theRow as $colName=>$colObj ) {
			if( $colName != "general" && $colName != "sid" ) {

				if( $rrtable != "" ) {
					if( $ref ) {
						if( !in_array($colName, $refcols) ) continue; 						
					} else {
						if(  in_array($colName, $refcols) ) continue;
					}
				}

				$colInfo = SEARCH::colObj( $this->table["schema"]["table"]["cols"], array("name"=>$colName) ) ;
				switch( $colInfo["coltype"] ) {
					case "hidden":
					case "textbox":
					case "textarea":
						$fields[$colName] = $colObj["value"]?$colObj["value"]:"";
						break;
					case "select":
					case "radio":
					case "radiolist":
					case "radiotext":
						$fields[$colName] = $colObj["value"]?$colObj["value"]:0;
						break;
					case "bool":
					case "checkbutton":
						$fields[$colName] = $colObj["value"]?1:0;
						break;
					case "checkbox":
					case "checklist":
					case "checktext":
						break;		
					case "date":
						$fields[$colName] = $colObj["value"]?$colObj["value"]:"";
						break;
					case "time":
						$fields[$colName] = $colObj["value"]?$colObj["value"]:"";
						break;
					case "datetime":
						$fields[$colName] = $colObj["value"]?$colObj["value"]:"";
						break;
					case "ymd":
						$fields[$colName . "_yy"] = $colObj["value"]["yy"]?$colObj["value"]["yy"]:0;
						$fields[$colName . "_mm"] = $colObj["value"]["mm"]?$colObj["value"]["mm"]:0;
						$fields[$colName . "_dd"] = $colObj["value"]["dd"]?$colObj["value"]["dd"]:0;
						break;
				}
			}
		}
		return $fields;
	}

	private function load() {
		$db 		= $this->db;
        $sstable    = $this->table["schema"]["table"]["view"]?$this->table["schema"]["table"]["view"]:$this->table["schema"]["table"]["base"];
        $sscol      = $this->table["schema"]["table"]["id"];

        $mode    	= strtolower($this->table["schema"]["table"]["mode"]?$this->table["schema"]["table"]["mode"]:"all");
        $rrtable    = $this->table["schema"]["table"]["reftable"]?$this->table["schema"]["table"]["reftable"]:"";
        $refcols    = $this->table["schema"]["table"]["refcols"]?$this->table["schema"]["table"]["refcols"]:array();
        $rrcol      = $this->table["schema"]["table"]["rid"]?$this->table["schema"]["table"]["rid"]:"";
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";


		$fields		= $this->getFields();
		$order_str  = $this->getOrder();
		
		// reference
		$field_str 	= implode(",", $fields);
		$field_str  = SEARCH::join(",", $field_str, "$sscol as sid");
		if( $rrtable != "" ) {
			if($ppcol!="") $field_str  = SEARCH::join(",", $field_str, "$ppcol as pid");
			if($rrcol!="") $field_str  = SEARCH::join(",", $field_str, "$rrcol as rid");
		}
		////////////
		
		
		if( 1==0 ) $this->table["head"]["query"]["fields"] = $field_str;
		if( 1==0 ) $this->table["head"]["query"]["order"] 	= $order_str;
		$criteria = LWHFILTER::output($this->table["filter"]);
		if( 1==0 ) $this->table["head"]["query"]["filter"] 	= $this->table["filter"];

		$query = "";
		if( $rrtable=="" ) {		
			$query = "SELECT $field_str FROM $sstable WHERE $sstable.deleted <> 1 $criteria";
		} else {
			if( $mode == "all" ) {
				if( $ppcol != "" ) 
					$query = "SELECT $field_str FROM $sstable LEFT JOIN $rrtable ON ($sstable.$sscol = $rrtable.$rrcol AND $rrtable.$ppcol = '" . $ppval . "') WHERE $sstable.deleted <> 1 $criteria";
				else 
					$query = "SELECT $field_str FROM $sstable LEFT JOIN $rrtable ON ($sstable.$sscol = $rrtable.$rrcol) WHERE $sstable.deleted <> 1 $criteria";
				
			} else {
				if( $ppcol != "" ) 
					$query = "SELECT $field_str FROM $sstable INNER JOIN $rrtable ON ($sstable.$sscol = $rrtable.$rrcol AND $rrtable.$ppcol = '" . $ppval . "') WHERE $sstable.deleted <> 1 $criteria";
				else 
					$query = "SELECT $field_str FROM $sstable INNER JOIN $rrtable ON ($sstable.$sscol = $rrtable.$rrcol) WHERE $sstable.deleted <> 1 $criteria";
			}
		}
		//echo "query: " . $query;
		$result_num 	= $db->query("SELECT COUNT(1) AS CNT FROM ( " . $query . " ) res1");
		$row_total 		= $db->fetch($result_num);
		$this->table["head"]["totalNo"] 	= intval($row_total["CNT"])?intval($row_total["CNT"]):0;
		$this->table["head"]["pageNo"] 	    = intval($this->table["head"]["pageNo"]) > 0?$this->table["head"]["pageNo"]:1;
		$this->table["head"]["pageSize"] 	= intval($this->table["head"]["pageSize"]) > 0 && intval($this->table["head"]["pageSize"]) <= 200?$this->table["head"]["pageSize"]:20;
        $this->table["head"]["pageTotal"] 	= ceil($this->table["head"]["totalNo"]/$this->table["head"]["pageSize"]);

        $this->table["head"]["pageNo"] 		= intval($this->table["head"]["totalNo"])<=0?0:
													(
                                                    	($this->table["head"]["pageNo"]>ceil($this->table["head"]["totalNo"]/$this->table["head"]["pageSize"]))?
                                                    	ceil($this->table["head"]["totalNo"]/$this->table["head"]["pageSize"]):
                                                    	$this->table["head"]["pageNo"]
													);
	    
		$query = $query . " " . $order_str;     
		$pageNo = $this->table["head"]["pageNo"]<=0?1:$this->table["head"]["pageNo"];

		if( $this->table["head"]["paging"] == "1" ) 
			$query 	= "SELECT * FROM (" . $query . ") res1  LIMIT " . ($pageNo-1) * $this->table["head"]["pageSize"] . " , " . $this->table["head"]["pageSize"];
		
		if( 1==0 ) $this->table["head"]["query"]["sql"] 	= $query;

 		$result = $db->query( $query );
		$rows = array();
		$cnt = 0;
        while( $row = $db->fetch($result)) {

            $rows[$cnt]["general"]["sid"]			= $row["sid"];
            $rows[$cnt]["general"]["state"]			= 0;
            $rows[$cnt]["general"]["error"]			= 0;
            $rows[$cnt]["general"]["errorMessage"]	= "";
            $rows[$cnt]["sid"] = $row["sid"];

			if( $rrtable != "" ) {
	            $rows[$cnt]["general"]["rid"] = $row["rid"]?$row["rid"]:"-1";
				if( $rows[$cnt]["general"]["rid"] == $rows[$cnt]["sid"] ) 
					$rows[$cnt]["general"]["refcheck"] = 1;
				else   
					$rows[$cnt]["general"]["refcheck"] = 0;

				$rows[$cnt]["general"]["oldrefcheck"] = $rows[$cnt]["general"]["refcheck"];


				if($ppcol!="") 
		            $rows[$cnt]["general"]["pid"] = $row["pid"]?$row["pid"]:"-1";
			}

		    foreach( $this->table["schema"]["table"]["cols"] as $colObj ) {
				$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
				$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"textbox";

				switch( $colType ) {
					case "hidden":
					case "textbox":
					case "textarea":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
			            $rows[$cnt][$colName]["value"] = $db->unquote($row[$colName]);
						break;

					case "radio":
					case "refer":
					case "select":
					case "bool":
					case "checkbutton":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
			            $rows[$cnt][$colName]["value"] = $row[$colName]?$row[$colName]:0;
						break;
						
					case "radiolist":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";

						$checkSchema 	= SEARCH::colObj($this->table["schema"]["checklist"], $colName);
						$radio_value 	= SEARCH::radioValue($this->db, $this->table["head"]["lang"], $checkSchema , $row[$colName]);
			            $rows[$cnt][$colName]["value"] 		= $radio_value["value"];
			            $rows[$cnt][$colName]["valuetext"]	= $radio_value["valuetext"];
						break;

					case "radiotext":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";

						$checkSchema 	= SEARCH::colObj($this->table["schema"]["checklist"], $colName);
						$radio_value 	= SEARCH::radioValue($this->db, $this->table["head"]["lang"], $checkSchema , $row[$colName]);
			            $rows[$cnt][$colName]["value"] 		= $radio_value["value"];
			            $rows[$cnt][$colName]["valuetext"]	= $radio_value["valuetext"];
						break;
						
					case "text":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
						$rows[$cnt][$colName]["value"] = LANG::trans($db->unquote($row[$colName]), $this->table["head"]["lang"]);			         
						break;

					case "checkbox":
						$checkSchema = SEARCH::colObj($this->table["schema"]["checklist"], $colName);
					
						if( $rrtable != "" ) {
							if( in_array($colName, $refcols) ) 
								if( $ppcol != "" )
									$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , array($rrcol=>$rows[$cnt]["general"]["rid"], $ppcol=>$ppval) );
								else 
									$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $rows[$cnt]["general"]["rid"]);
								
							else	 						
								$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $row["sid"]);
						} else {
							$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $row["sid"]);
						}
					
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
			            $rows[$cnt][$colName]["value"] 			= $ck_value["value"];
						break;

					case "checklist":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
						
						$checkSchema 	= SEARCH::colObj($this->table["schema"]["checklist"], $colName);

						if( $rrtable != "" ) {
							if( in_array($colName, $refcols) ) 

								if( $ppcol != "" )
									$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , array($rrcol=>$rows[$cnt]["general"]["rid"], $ppcol=>$ppval) );
								else 
									$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $rows[$cnt]["general"]["rid"]);

							else	 						
								$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $row["sid"]);
						} else {
							$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $row["sid"]);
						}

			            $rows[$cnt][$colName]["value"] 		= $ck_value["value"];
			            $rows[$cnt][$colName]["valuetext"]	= $ck_value["valuetext"];
						break;

					case "checktext":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
						
						$checkSchema 	= SEARCH::colObj($this->table["schema"]["checklist"], $colName);
						
						if( $rrtable != "" ) {
							if( in_array($colName, $refcols) ) 
								if( $ppcol != "" )
									$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , array($rrcol=>$rows[$cnt]["general"]["rid"], $ppcol=>$ppval) );
								else 
									$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $rows[$cnt]["general"]["rid"]);
							else	 						
								$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $row["sid"]);
						} else {
							$ck_value = SEARCH::checkValue($this->db, $this->table["head"]["lang"], $checkSchema , $row["sid"]);
						}
			            
						$rows[$cnt][$colName]["value"] 		= $ck_value["value"];
			            $rows[$cnt][$colName]["valuetext"]	= $ck_value["valuetext"];
						break;

					case "date":
					case "dateint":
					case "time":
					case "datetime":
					case "intdate":
					case "intdatetime":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
			            $rows[$cnt][$colName]["value"] 			= $row[$colName]?$row[$colName]:"";
						break;
					case "ymd":
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
			            $rows[$cnt][$colName]["value"]["yy"] 	= $row[$colName . "_yy"]?$row[$colName . "_yy"]:"";
			            $rows[$cnt][$colName]["value"]["mm"] 	= $row[$colName . "_mm"]?$row[$colName . "_mm"]:"";
			            $rows[$cnt][$colName]["value"]["dd"] 	= $row[$colName . "_dd"]?$row[$colName . "_dd"]:"";
						break;


					case "thumb":
						$imgSchema = array();
						$imgSchema["filter"] 	= $colObj["filter"];
						$imgSchema["mode"] 		= $colObj["mode"];
						$imgSchema["view"] 		= $colObj["view"];
						$imgSchema["noimg"] 	= $colObj["noimg"];
						
						$download = new DOWNLOADIMAGE($db, 	$imgSchema, $this->table["head"]["lang"]);

						$download->refid($row["sid"]);
						$img_base64 = $download->MainBase64($imgSchema["view"]);
						$rows[$cnt][$colName]["state"] 			= 0;
						$rows[$cnt][$colName]["error"] 			= 0;
						$rows[$cnt][$colName]["errorMessage"] 	= "";
			            $rows[$cnt][$colName]["value"] 			= $img_base64?$img_base64:"";
						break;
				}
			}
			$cnt++;
		}
		
		$this->table["data"] 		= $rows;
		$this->result["data"] 		= $this->table["data"];
		$this->result["head"] 		= $this->table["head"];
		//$this->result["filter"] 	= $this->table["filter"];
		//$this->result["criteria"] 	= LWHFILTER::output($this->table["filter"]);
	}

	private function view() {
		$this->load();
		$this->checklist();
		$this->result["listTables"] 	= $this->table["listTables"];
	}
	
    private function checklist() {
		foreach( $this->table["schema"]["checklist"] as $checkSchema ) {
			$this->table["listTables"]["checklist"][$checkSchema["col"]] = SEARCH::checkCollect($this->db, $this->table["head"]["lang"], $checkSchema); 	
		}
    }
	
	private function getFields() {
	    $temp = array();
        foreach($this->table["schema"]["table"]["cols"] as $colObj) {
			$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
			$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"textbox";
			switch( $colType ) {
				case "select":
				case "radio":
				case "radiolist":
				case "radiotext":
				case "bool":
				case "checkbutton":
				case "hidden":
				case "textbox":
				case "textarea":
				case "text":
				case "date":
				case "dateint":
				case "time":
				case "datetime":
				case "intdate":
				case "intdatetime":
					$temp[] = $colName;
					break;
				case "ymd":
					$temp[] = $colName . "_yy";
					$temp[] = $colName . "_mm";
					$temp[] = $colName . "_dd";
					break;
			}
		}
		return $temp;
	}

	private function getOrder() {
		$order_str = "";
		if($this->table["head"]["orderBY"] != "" &&  $this->table["head"]["orderSN"] != "") {	
			$order_str 	= "ORDER BY " . $this->table["head"]["orderBY"] . " " . strtoupper($this->table["head"]["orderSN"]);
		} elseif( $this->table["head"]["orderBY"] != "" ) {
			$order_str 	= "ORDER BY " . $this->table["head"]["orderBY"] . " ASC";
			$this->table["head"]["orderSN"] = "ASC";
		} 
		return $order_str;
	}
	
	private function validate(&$theRow) {
			$error 	= 0;
			$errMsg = '';
			foreach( $theRow as $colName=>&$colObj ) {
				if( $colName != "general" && $colName != "sid" ) {
					$colInfo = SEARCH::colObj( $this->table["schema"]["table"]["cols"], array("name"=>$colName) ) ;

					$colObj["error"] 		= 0;
					$colObj["errorMessage"] = "";

					$this->validateCol($colObj, $colInfo, $theRow["general"]);
					$error 	= max($error, $colObj["error"]);
					$errMsg .= ($errMsg!="" && $colObj["errorMessage"]!=""?"\n":"") . $colObj["errorMessage"];
				}
			}
			$theRow["general"]["error"] 		= $error;
			$theRow["general"]["errorMessage"] 	= $errMsg;
	}
	
	private function validateCol(&$colObj, $colInfo, $rowGeneral) {

		// handle reference column,  must be checked  
		$rrtable    = $this->table["schema"]["table"]["reftable"]?$this->table["schema"]["table"]["reftable"]:"";
		$refcols    = $this->table["schema"]["table"]["refcols"]?$this->table["schema"]["table"]["refcols"]:array();
		$rcheck 	= $rowGeneral["refcheck"]=="1"?true:false; 
		if( $rrtable != "" && !$rcheck ) if( in_array($colInfo["name"], $refcols) ) return;
		
		/*
		echo "colName:" . $colInfo["name"] . "\n";
		echo "General:";
		print_r( $rowGeneral );
		echo "Col:";
		print_r( $colObj );
		*/
		
		if( !is_array($colObj["value"]) ) $colObj["value"] 		= trim($colObj["value"]);
        $len = mb_strlen($colObj["value"]);
		
		switch( $colInfo["coltype"] ) {
			case "hidden":
			case "textbox":
			case "textarea":
				if($len <=0 && $colInfo["notnull"] ) {
					$errMsg =  "'" . ($colInfo["colname"]?$colInfo["colname"]:ucwords($colInfo["name"]) ) . "' " . LANG::words("required_col", $this->table["head"]["lang"]);
					$colObj["error"] 		= 1;
					$colObj["errorMessage"] = $errMsg;
				}
				
				if($len > 0 && $colInfo["min"]!="") {
					if(floatval($colObj["value"]) < floatval($colInfo["min"])) {
						$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("out_of_range", $this->table["head"]["lang"], $colInfo["min"], $colInfo["max"]);
						$colObj["error"] 		= 1;
						SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
					}
				}

				if($len > 0 && $colInfo["max"]!="") {
					if(floatval($colObj["value"]) > floatval($colInfo["max"])) {
						$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("out_of_range", $this->table["head"]["lang"], $colInfo["min"], $colInfo["max"]);
						$colObj["error"] 		= 1;
						SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
					}
				}


				if($len > 0 && $len > $colInfo["maxlength"] && $colInfo["maxlength"]>0) {
					$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("over_max_length", $this->table["head"]["lang"], $len, $colInfo["maxlength"]);
					$colObj["error"] 		= 1;
					SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
				}

				if($len > 0 && $len < $colInfo["minlength"] && $colInfo["minlength"]>0) {
					$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("less_min_length", $this->table["head"]["lang"], $len, $colInfo["minlength"]);
					$colObj["error"] 		= 1;
					SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
				}

				
				if($len > 0 && $colInfo["datatype"] != "" ) {
					if(!preg_match( SEARCH::$DATATYPE[ strtoupper($colInfo["datatype"]) ], $colObj["value"])) {
						$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("invalid_type", $this->table["head"]["lang"], ucwords($colInfo["datatype"]) );
						$colObj["error"] 		= 1;
						SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
					}        
				} 

				if( strtoupper($colInfo["datatype"]) == "NUMBER" && $colObj["value"]=="") $colObj["value"]= 0;
				$colObj["value"] = LANG::trans($colObj["value"], $this->dlang);
				break;
			case "select":
			case "radio":
			case "radiolist":
				if( ($len <=0 && $colInfo["notnull"]) || ( $colObj["value"] == "0" && $colInfo["notnull"] ) ) {
					$errMsg =  "'" . ($colInfo["colname"]?$colInfo["colname"]:ucwords($colInfo["name"]) ) . "' " . LANG::words("required_col", $this->table["head"]["lang"]);
					$colObj["error"] 		= 1;
					$colObj["errorMessage"] = $errMsg;
				}
				$colObj["value"] = $colObj["value"]?$colObj["value"]:0;
				break;
			case "bool":
			case "checkbutton":
				$colObj["value"] = $colObj["value"]?1:0;
				break;
			case "checkbox":
			case "checklist":
				//echo "len: " . $len . "  notnull: " . $colInfo["notnull"] . " value:" . $colObj["value"]; 
				if( $len <=0 && $colInfo["notnull"] ) {
					$errMsg =  "'" . ($colInfo["colname"]?$colInfo["colname"]:ucwords($colInfo["name"]) ) . "' " . LANG::words("required_col", $this->table["head"]["lang"]);
					$colObj["error"] 		= 1;
					$colObj["errorMessage"] = $errMsg;
				}
				$colObj["value"] = $colObj["value"]?$colObj["value"]:"";
				break;
		
			case "date":
			case "time":
			case "datetime":
				if($len <=0 && $colInfo["notnull"] ) {
					$errMsg =  "'" . ($colInfo["colname"]?$colInfo["colname"]:ucwords($colInfo["name"]) ) . "' " . LANG::words("required_col", $this->table["head"]["lang"]);
					$colObj["error"] 		= 1;
					$colObj["errorMessage"] = $errMsg;
				}

				if($len > 0 && $colInfo["datatype"] != "" ) {
					if(!preg_match( SEARCH::$DATATYPE[ strtoupper($colInfo["datatype"]) ], $colObj["value"])) {
						$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("invalid_type", $this->table["head"]["lang"], ucwords($colInfo["datatype"]) );
						$colObj["error"] 		= 1;
						SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
					}        
				} 
				
				if( $colObj["error"] <= 0 ) {
					if($len > 0 && $colInfo["min"]!="") {
						if( strtotime($colObj["value"]) < strtotime($colInfo["min"])) {
							$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("out_of_range", $this->table["head"]["lang"], $colInfo["min"], $colInfo["max"]);
							$colObj["error"] 		= 1;
							SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
						}
					}
	
					if($len > 0 && $colInfo["max"]!="") {
						if(strtotime($colObj["value"]) > strtotime($colInfo["max"])) {
							$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("out_of_range", $this->table["head"]["lang"], $colInfo["min"], $colInfo["max"]);
							$colObj["error"] 		= 1;
							SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
						}
					}
				}
				break;		

			case "ymd":
				$ymd_val0  = $colObj["value"]["yy"]?$colObj["value"]["yy"]:"";
				$ymd_val0 .= $colObj["value"]["mm"]?$colObj["value"]["mm"]:"";
				$ymd_val0 .= $colObj["value"]["dd"]?$colObj["value"]["dd"]:"";
				
				$ymd_val = $colObj["value"]["yy"] . "-" . $colObj["value"]["mm"] . "-" . $colObj["value"]["dd"]; 
		        $len = mb_strlen($ymd_val0);
				
							
				if(strlen(trim($colObj["value"]["yy"]))> 0 ) {
					if(!preg_match( SEARCH::$DATATYPE["NUMBER"], trim($colObj["value"]["yy"]) )) {
						$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' Year " . LANG::words("invalid_type", $this->table["head"]["lang"], "YEAR" );
						$colObj["error"] 		= 1;
						SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
					}        
				} 
				
				if($len <=0 && $colInfo["notnull"] ) {
					$errMsg =  "'" . ($colInfo["colname"]?$colInfo["colname"]:ucwords($colInfo["name"]) ) . "' " . LANG::words("required_col", $this->table["head"]["lang"]);
					$colObj["error"] 		= 1;
					$colObj["errorMessage"] = $errMsg;
				}

				if($len > 0 && $colInfo["datatype"] != "" ) {
					if(!preg_match( SEARCH::$DATATYPE[ strtoupper($colInfo["datatype"]) ], $ymd_val)) {
						$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("invalid_type", $this->table["head"]["lang"], ucwords($colInfo["datatype"]) );
						$colObj["error"] 		= 1;
						SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
					}        
				} 
				
				if( $colObj["error"] <= 0 ) {
					if($len > 0 && $colInfo["min"]!="") {
						if( strtotime($ymd_val) < strtotime($colInfo["min"])) {
							$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("out_of_range", $this->table["head"]["lang"], $colInfo["min"], $colInfo["max"]);
							$colObj["error"] 		= 1;
							SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
						}
					}
	
					if($len > 0 && $colInfo["max"]!="") {
						if(strtotime($ymd_val) > strtotime($colInfo["max"])) {
							$errMsg = "'" . ($colInfo["colname"]?$colInfo["colname"]: ucwords($colInfo["name"]) ) . "' " . LANG::words("out_of_range", $this->table["head"]["lang"], $colInfo["min"], $colInfo["max"]);
							$colObj["error"] 		= 1;
							SEARCH::concat($colObj["errorMessage"], "\n", $errMsg);
						}
					}
				}
				break;		

		}
	}	
}
?>