<?php
class WMLIUFORMP {
	public $form;
    public $result;
	private $db;
	private $dlang;
	public function __construct($db, $form, $dlang) {
		$this->form 	= $form;
		$this->db 		= $db;
		$this->dlang	= $dlang;
		$this->form["detail"]["head"]["lang"] = $form["detail"]["head"]["lang"]?$form["detail"]["head"]["lang"]:$this->dlang;

		$this->action();
	}

	public function action() {
  		$this->form["detail"]["head"]["loading"] = 0;
		switch($this->form["detail"]["head"]["action"]) {
            case "init":
                $this->checklist();
                $this->checkVlist();
                $this->checkClist();
                $this->initTablelist();
                $this->initPtext();

		        foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
			        $this->form["detail"]["cols"][$colName]["error"] 		    = 0;
			        $this->form["detail"]["cols"][$colName]["errorMessage"] 	= "";
		        }
		
		        $this->form["detail"]["head"]["error"] 		    = 0;
		        $this->form["detail"]["head"]["errorMessage"]   = "";
		        $this->form["detail"]["head"]["state"] 		    = "view";

                $this->form["detail"]["vals"]       = null;
                $this->result["detail"]             = $this->form["detail"];
                $this->result["listTables"]         = $this->form["listTables"];
                $this->result["schema"]["idvals"]   = $this->form["schema"]["idvals"];


				break;
			case "save":
				$this->add();
    
                $this->form["detail"]["head"]["state"] 		= "view";
                $this->result["detail"]             		= $this->form["detail"];
                $this->result["listTables"]["tablelist"]   	= $this->form["listTables"]["tablelist"];
                $this->result["schema"]["idvals"]   		= $this->form["schema"]["idvals"];
				break;
			case "cancel":
				break;
		}
	}

	public function initTablelist() {
        $db         = $this->db;
        foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
			if($colObj["type"] == "tablelist") {
				$stable = $this->form["schema"]["tablelist"][$colName]["stable"];
				$scol 	= $this->form["schema"]["tablelist"][$colName]["scol"];
				$rtable = $this->form["schema"]["tablelist"][$colName]["rtable"];
				$rcol 	= $this->form["schema"]["tablelist"][$colName]["rcol"];
				$tlCols = $this->getTLCol($colName, "stable");
				$tlFields 	= implode(",", $tlCols);
				$tlFields  	= WMSEARCH::join(",", "$stable.$scol as sid, $rtable.$rcol as rid, $rtable.$colName", $tlFields);
				$tlquery 	= "SELECT $tlFields FROM $stable LEFT JOIN (SELECT * FROM $rtable WHERE $rcol = '-1') $rtable ON ($stable.$scol = $rtable.$colName) WHERE $stable.deleted <> 1 AND $stable.status = 1 ORDER BY $stable.orderno DESC, $stable.created_time DESC";
				$tlresult 	= $db->query($tlquery);
				$tlrows0 	= $db->rows( $tlresult );
				$tlrows		= array();
				
				foreach($tlrows0 as $key1=>$tlrow1) {
					$tlrows[$tlrow1["sid"]] = $tlrow1;
				}
				
				
				foreach($tlrows as $key1=>$tlrow) {	
					$tlrows[$key1]["selected"] = $tlrows[$key1][$rcol]?true:false;
					foreach( $this->form["schema"]["tablelist"][$colName]["cols"] as $key2=>$colObj2 ) {
						switch($colObj2["type"]) {
							case "bool":
								$tlrows[$key1][$colObj2["col"]] = $tlrows[$key1][$colObj2["col"]]==1?true:false; 			
								break;
						}
					}
				}
				$this->form["listTables"]["tablelist"][$colName] = $tlrows;
			}
		}
	}

    public function initPtext() {
        $db = $this->db;
        $pptable    = $this->form["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->form["schema"]["table"]["pptable"]["col"];
        $pid        = $this->form["schema"]["idvals"]["pid"];
        if($pptable!="") {
            $field_str = "";
            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                if($colObj["type"]=="ptext") {
                    $field_str = ($field_str==""?"":",") . $colObj["pcol"] . " as " . $colName;        
                }            
            }
            if($field_str!="") {
                $query  = "SELECT $field_str FROM $pptable WHERE $pptable.$pcol = '" . $pid . "'";
                $result = $db->query($query);
                $row    = $db->fetch($result);
                
                foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                    if($colObj["type"]=="ptext") {
                        $this->form["schema"]["idvals"][$colName] = LANG::trans($row[$colName], $this->form["detail"]["head"]["lang"]);        
                    }            
                }
            }
        }
    }

	public function add() {
        $db = $this->db;

		$this->form["detail"]["head"]["error"] 	        = 0;
		$this->form["detail"]["head"]["errorMessage"]   = "";

        $pptable    = $this->form["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->form["schema"]["table"]["pptable"]["col"];

        $mmtable    = $this->form["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->form["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->form["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->form["schema"]["table"]["sstable"]["name"];
        $scol       = $this->form["schema"]["table"]["sstable"]["col"];
        $spref      = $this->form["schema"]["table"]["sstable"]["pref"];
        
        $ddtable    = $this->form["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->form["schema"]["table"]["ddtable"]["col"];


        $pid        = $this->form["schema"]["idvals"]["pid"];
        $sid        = $this->form["schema"]["idvals"]["sid"];
        $did        = $sid;

        $ssfields = $this->getRow("sstable");
        $ddfields = $this->getRow("ddtable");
        $mmfields = $this->getRow("mmtable");

		$tlsfields = $this->getStableRow();
		$tlrfields = $this->getRtableRow();
        
        if($this->form["detail"]["head"]["error"] < 1) {
            if( count($ssfields)>0 ) {
                        if($mmtable=="" && $pptable!="" && $pid!="") $ssfields[$spref] = $pid;
                        $ssfields["created_time"] = time();
                        $ssfields["deleted"]      = 0;
                        //echo "table: $sstable\n";
                        //print_r($fields);
                        $sid = $db->insert($sstable, $ssfields);
                        $this->form["schema"]["idvals"]["sid"] = $sid;
                        $did = $sid;
            }

            if( count($ddfields)>0 ) {
                    // check ddtable values
                    $ok = false;
                    foreach( $ddfields as $colName=>$colVal ) {
                        if($colVal!="") $ok = true;
                        if(is_numeric($colVal) && intval($colVal) == 0) $ok = false;
                        //echo "$colName : " . $colVal . " ok: " . $ok . "\n";                            
                        if($ok) break;
                    }  // foreach
                        
                    if($ok) {
                        $ddfields[$dcol] = $did;
                        $ddfields["created_time"]   = time();
                        $ddfields["deleted"]        = 0;
                        $db->insert($ddtable,       $ddfields);
                    }
            }

            $ck_val             = array();
            $ck_val["pptable"]  = $pid;
            $ck_val["sstable"]  = $sid;
            $ck_val["ddtable"]  = $did;
            $ck_val["mmtable"][$mpref]  = $pid;
            $ck_val["mmtable"][$msref]  = $sid;

            if($mmtable!="") {
                if($db->hasRow($mmtable, $ck_val["mmtable"]) ) { 
                    if(count($mmfields)>0) { 
                        $db->update($mmtable, $ck_val["mmtable"], $mmfields);
                    }
                } else {
                    $mmfields[$mpref] = $pid;
                    $mmfields[$msref] = $sid;
                    $db->insert($mmtable, $mmfields);
                }
            }


            // special for checkbox, 				
            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
           		$colObj["table"] = $colObj["table"]!=""?$colObj["table"] : "sstable";
                if( $colObj["type"] == "checkbox") {
                        if( $colObj["table"] != "mmtable" ) { 
		                    $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
		                    $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];
                            $db->delete($ref_table, array($ref_col=>$ck_val[$colObj["table"]]));						

		                    $temp_ck = array();
		                    foreach($this->form["detail"]["vals"][$colName] as $key1=>$val1) {
			                    if(strtolower($val1)=="true"||$val1===true) {
				                    //echo "$key1 + $val1";
				                    $temp_ck[$key1] = true;
							    
				                    $clist = array();
				                    $clist[$ref_col] = $ck_val[$colObj["table"]];
				                    $clist[$colName] = $key1;
				                    $db->insert($ref_table, $clist);
			                    }
		                    }
		                    $this->form["detail"]["vals"][$colName] = count($temp_ck)>0?$temp_ck:null;
	                    } else {
		                    $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
		                    $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];
                            $db->delete( $ref_table, $ck_val[$colObj["table"]] );						

		                    $temp_ck = array();
		                    foreach($this->form["detail"]["vals"][$colName] as $key1=>$val1) {
			                    if(strtolower($val1)=="true"||$val1===true) {
				                    //echo "$key1 + $val1";
				                    $temp_ck[$key1] = true;
							    
				                    $clist = array();
				                    $clist[$mpref] = $pid;
				                    $clist[$msref] = $sid;
				                    $clist[$colName] = $key1;
				                    $db->insert($ref_table, $clist);
			                    }
		                    }
		                    $this->form["detail"]["vals"][$colName] = count($temp_ck)>0?$temp_ck:null;
	                    }
                } 
            }
            // end of checkbox

            // special for tablelist stable, 				
			//print_r($tlsfields);
            foreach( $tlsfields as $ccol=>$crows ) {
                $ctable = $this->form["schema"]["tablelist"][$ccol]["stable"];
				foreach($crows as $tbid=>$trow) {
					$fields = array();
					$fields = $trow;
					$db->update($ctable, $tbid, $fields);
				}
            }


            foreach( $tlrfields as $ccol=>$crows ) {
                $trtable = $this->form["schema"]["tablelist"][$ccol]["rtable"];
                $trcol = $this->form["schema"]["tablelist"][$ccol]["rcol"];
				$db->delete($trtable, array($trcol=>$sid));
				foreach($crows as $tbid=>$trow) {
					$fields = array();
					$fields = $trow;
					$fields[$trcol] = $sid;
					$db->insert($trtable,  $fields);
				}
            }
            // end of tablelist stable,


        }  // end error < 1

		if($this->form["detail"]["head"]["error"] < 1) {
            $this->form["detail"]["vals"] = null;
		}
	}

    private function checklist() {
    	$this->form["listTables"]["checklist"]  = WMSEARCH::checklist($this->db,  $this->form["detail"]["head"]["lang"], $this->form["schema"]["checklist"]);
    }

    private function checkVlist() {
        $this->form["listTables"]["vlist"]      = WMSEARCH::checkVlist($this->db, $this->form["detail"]["head"]["lang"], $this->form["schema"]["checklist"]);
    }

    private function checkClist() {
        $this->form["listTables"]["clist"]      = WMSEARCH::checkClist($this->db, $this->form["detail"]["head"]["lang"], $this->form["schema"]["checklist"]);
    }

	private function getTLCol($colName, $ctable="") {
		$temp = array();
		foreach( $this->form["schema"]["tablelist"][$colName]["cols"] as $key=>$colObj ) {
			switch($colObj["type"]) {
				case "hidden":
				case "select":
				case "bool":
				case "text":
				case "textbox":
				case "textarea":
					$ctable		= $ctable?$ctable:"stable";
					$table 		= $colObj["table"]?$colObj["table"]:"stable";
					if($table == $ctable) {
						$tableName 	= $this->form["schema"]["tablelist"][$colName][$table];
						$colName1   = $colObj["col"];
						$temp[] = 	"$tableName.$colName1";
					}
				break;
			}
		}
		return $temp;
	}

    private function getStableRow() {
		$lang 		= $this->form["detail"]["head"]["lang"];
	    $temp = array();
	    foreach($this->form["detail"]["cols"] as $colName=>$colObj) {
            if( $colObj["type"] == "tablelist" ) {
				$temp[$colName] = array();
				foreach( $this->form["listTables"]["tablelist"][$colName] as $lkey=>$lrow ) {
						$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 0;
						$ttemp = array();
						foreach( $this->form["schema"]["tablelist"][$colName]["cols"] as $tkey=>$tObj ) {
							$tObj["table"] = $tObj["table"]?$tObj["table"]:"stable";
							if($tObj["table"]=="stable") {
								$tCol = $tObj["col"];
								$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] = "";
								
								$tVal = $lrow[$tCol];
								$tVal = str_replace(array("undefined", "null"), array("",""), $tVal);
								$len = mb_strlen($tVal);
								switch( $tObj["type"] ) {
									case "bool":
											$ttemp[$tCol] = $tVal=="true"?1:0;
											$this->form["listTables"]["tablelist"][$colName][$lkey][$tCol] = $ttemp[$tCol]==1?true:false;
										break;
									case "select":
											if( ($len <=0 && $tObj["required"]=="1") || $tVal == "0" ) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("required_col", $lang);
												$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
											$ttemp[$tCol] = $tVal?$tVal:"0";
										break;
									case "textbox":
									case "textarea":
											if($len <=0 && $tObj["required"]=="1" ) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("required_col", $lang);
												$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
											
											if($len > 0 && $tObj["min"]!="") {
												if(floatval($tVal) < floatval($tObj["min"])) {
													$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("out_of_range", $lang, $tObj["min"], $tObj["max"]);
													$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
													$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
													$this->form["detail"]["head"]["error"] = 1;
													$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
												}
											}
						
											if($len > 0 && $tObj["max"]!="") {
												if(floatval($tVal) > floatval($tObj["max"])) {
													$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("out_of_range", $lang, $tObj["min"], $tObj["max"]);
													$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
													$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
													$this->form["detail"]["head"]["error"] = 1;
													$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
												}
											}
						
						
											if($len > 0 && $len > $tObj["maxlength"] && $tObj["maxlength"]>0) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("over_max_length", $lang, $len, $tObj["maxlength"]);
												$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
						
											if($len > 0 && $len < $tObj["minlength"] && $tObj["minlength"]>0) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("less_min_length", $lang, $len, $tObj["minlength"]);
												$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
											
											if($len > 0 && $tObj["pattern"] != "" ) {
												if(!preg_match($this->dataType[ strtoupper($tObj["pattern"]) ], $tVal)) {
													$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("invalid_type", $lang, $tObj["pattern"]);
													$this->form["listTables"]["tablelist"][$colName][$lkey]["error"] = 1;
													$this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["listTables"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
													$this->form["detail"]["head"]["error"] = 1;
													$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
												}        
											} 
						
											if( strtoupper($tObj["pattern"]) == "NUMBER" && $tVal=="") $this->form["listTables"]["tablelist"][$colName][$lkey][$tCol]="0";
											//echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "\n"; 
											$ttemp[$tCol] = LANG::trans($tVal, $this->dlang);
									
										break;
										
								} //switch
							} // if
						} // foreach
					
						$temp[$colName][$lkey] = $ttemp;
				} //foreach
				
			} // if
		} //foreach 
       	return $temp;        
    }


    private function getRtableRow() {
		$lang 		= $this->form["detail"]["head"]["lang"];
	    $temp = array();
	    foreach($this->form["detail"]["cols"] as $colName=>$colObj) {
            if( $colObj["type"] == "tablelist" ) {
				$temp[$colName] = array();
				foreach( $this->form["detail"]["vals"]["tablelist"][$colName] as $lkey=>$lrow ) {
						$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["selected"] = $this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["selected"]=="true"?true:false;
						
						if($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["selected"]==true) {
						$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 0;
						$ttemp = array();
						//$ttemp["selected"] 	= $this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["selected"];
						$ttemp[$colName] = $this->form["listTables"]["tablelist"][$colName][$lkey]["sid"];		
						foreach( $this->form["schema"]["tablelist"][$colName]["cols"] as $tkey=>$tObj ) {
							$tObj["table"] = $tObj["table"]?$tObj["table"]:"stable";
							if($tObj["table"]=="rtable") {
								$tCol = $tObj["col"];
								$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] = "";
								
								$tVal = $lrow[$tCol];
								$tVal = str_replace(array("undefined", "null"), array("",""), $tVal);
								$len = mb_strlen($tVal);
								switch( $tObj["type"] ) {
									case "bool":
											$ttemp[$tCol] = $tVal=="true"?1:0;
											$this->form["detail"]["vals"]["tablelist"][$colName][$lkey][$tCol] = $ttemp[$tCol]==1?true:false;
										break;
									case "select":
											if( ($len <=0 && $tObj["required"]=="1") || $tVal == "0" ) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("required_col", $lang);
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
											$ttemp[$tCol] = $tVal?$tVal:"";
										break;
									case "textbox":
									case "textarea":
											if($len <=0 && $tObj["required"]=="1" ) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("required_col", $lang);
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
											
											if($len > 0 && $tObj["min"]!="") {
												if(floatval($tVal) < floatval($tObj["min"])) {
													$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("out_of_range", $lang, $tObj["min"], $tObj["max"]);
													$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 1;
													$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
													$this->form["detail"]["head"]["error"] = 1;
													$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
												}
											}
						
											if($len > 0 && $tObj["max"]!="") {
												if(floatval($tVal) > floatval($tObj["max"])) {
													$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("out_of_range", $lang, $tObj["min"], $tObj["max"]);
													$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 1;
													$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
													$this->form["detail"]["head"]["error"] = 1;
													$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
												}
											}
						
						
											if($len > 0 && $len > $tObj["maxlength"] && $tObj["maxlength"]>0) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("over_max_length", $lang, $len, $tObj["maxlength"]);
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
						
											if($len > 0 && $len < $tObj["minlength"] && $tObj["minlength"]>0) {
												$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("less_min_length", $lang, $len, $tObj["minlength"]);
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 1;
												$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
												$this->form["detail"]["head"]["error"] = 1;
												$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
											}
											
											if($len > 0 && $tObj["pattern"] != "" ) {
												if(!preg_match($this->dataType[ strtoupper($tObj["pattern"]) ], $tVal)) {
													$errMsg = "'" . ($tObj["title"]?$tObj["title"]: ucwords($tCol) ) . "' " . LANG::words("invalid_type", $lang, $tObj["pattern"]);
													$this->form["detail"]["cols"][$colName]["error"] = 1;
													$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] .= ($this->form["schema"]["tablelist"][$colName]["cols"][$lkey]["errorMessage"][$tCol]==""?"":"\n") . $errMsg;
													$this->form["detail"]["head"]["error"] 		= 1;
													$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
												}        
											} 
						
											if( strtoupper($tObj["pattern"]) == "NUMBER" && $tVal=="") $this->form["detail"]["vals"]["tablelist"][$colName][$lkey][$tCol]="0";
											//echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "\n"; 
											$ttemp[$tCol] = LANG::trans($tVal, $this->dlang);
									
										break;
										
								} //switch
							} // if
						} // foreach
					
						$temp[$colName][$lkey] = $ttemp;
					} // if(selected)
					else
					{
						$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["error"] = 0;
						foreach( $this->form["schema"]["tablelist"][$colName]["cols"] as $tkey=>$tObj ) {
							$tObj["table"] = $tObj["table"]?$tObj["table"]:"stable";
							$tCol = $tObj["col"];
							$this->form["detail"]["vals"]["tablelist"][$colName][$lkey]["errorMessage"][$tCol] = "";
							
							$tVal = $lrow[$tCol];
							$tVal = str_replace(array("undefined", "null"), array("",""), $tVal);
							
							if($tObj["table"]=="rtable") {
								switch( $tObj["type"] ) {								
									case "bool":
										$this->form["detail"]["vals"]["tablelist"][$colName][$lkey][$tCol] = false;
										break;
									default: 
										$this->form["detail"]["vals"]["tablelist"][$colName][$lkey][$tCol]="";									
										break;
								}
							}
						}
					}
				} //foreach
				
			} // if
		} //foreach 
       	return $temp;        
    }

    private function getRow($tttt) {
		$lang 		= $this->form["detail"]["head"]["lang"];
		$table      = $this->form["schema"]["table"][$tttt]["name"];
	    $temp = array();
	    foreach($this->form["detail"]["cols"] as $colName=>$colObj) {
		    $colObj["table"] = $colObj["table"]!=""?$colObj["table"] : "sstable";
            if( $tttt != $colObj["table"]) continue; 

            $this->form["detail"]["cols"][$colName]["error"] = 0;
			$this->form["detail"]["cols"][$colName]["errorMessage"] = "";
			$this->form["detail"]["vals"][$colName] = str_replace(array("undefined", "null"), array("",""), $this->form["detail"]["vals"][$colName]);
            
            $len = mb_strlen($this->form["detail"]["vals"][$colName]);
			//echo "$colName: " . $this->form["detail"][$colName] . " len: $len " . $colObj["required"].  "\n";
            switch($colObj["type"]) {
                case "radio":
                    if( ($len <=0 && $colObj["required"]=="1") || $this->form["detail"]["vals"][$colName] == "0" ) {
                        if($colObj["other"]!="" && $this->form["detail"]["vals"][$colObj["other"]]==""){
                            $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						    $this->form["detail"]["head"]["error"] = 1;
						    $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                        }
                    }
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "  required:" . $col["required"]. "\n"; 
                    $temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0";
                    if($colObj["other"]!="") $temp[$colObj["other"]] = LANG::trans($this->form["detail"]["vals"][$colObj["other"]], $this->dlang);
                    break;

                case "vtext":
                case "select":
                    if( ($len <=0 && $colObj["required"]=="1") || $this->form["detail"]["vals"][$colName]=="0" ) {
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    }
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "  required:" . $col["required"]. "\n"; 
                    $temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0";
                    break;
                case "password":
                     if(preg_match("/_confirm$/", $colName)) continue;
                     if($this->form["detail"]["vals"][$colName]!= $this->form["detail"]["vals"][$colName . "_confirm"]) {
	                        $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . LANG::words("password_not_match", $lang);
	                        $this->form["detail"]["cols"][$colName . "_confirm"]["error"] = 1;
                            $this->form["detail"]["cols"][$colName . "_confirm"]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . LANG::words("password_not_match", $lang);
						    $this->form["detail"]["head"]["error"] = 1;
						    $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' ". LANG::words("do_not_match", $lang);
                     }
                case "hidden":
                case "textbox":
                case "textarea":
                    if($len <=0 && $colObj["required"]=="1" ) {
						//echo "required: $colName: " . $this->form["detail"][$colName] . " len: $len" . "\n";
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    }
                    
					if($len > 0 && $this->form["detail"]["cols"][$colName]["min"]!="") {
						if(floatval($this->form["detail"]["vals"][$colName]) < floatval($this->form["detail"]["cols"][$colName]["min"])) {
							$this->form["detail"]["cols"][$colName]["error"] = 1;
							$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'" . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
							$this->form["detail"]["head"]["error"]		= 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'" . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
						}
					}


					if($len > 0 && $this->form["detail"]["cols"][$colName]["max"]!="") {
						if(floatval($this->form["detail"]["vals"][$colName]) > floatval($this->form["detail"]["cols"][$colName]["max"])) {
							$this->form["detail"]["cols"][$colName]["error"] = 1;
							$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'" . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
							$this->form["detail"]["head"]["error"]		= 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'" . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
						}
					}

                    if($len > 0 && $len > $colObj["maxlength"] && $colObj["maxlength"]>0) {
                        $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("over_max_length", $lang, $len, $colObj["maxlength"]);
						$this->form["detail"]["head"]["error"] 		= 1;
						$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("over_max_length", $lang, $len, $colObj["maxlength"]);
                    }
                    
                    if($len > 0 && $len < $colObj["minlength"] && $colObj["minlength"]>0) {
                        $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("less_min_length", $lang, $len, $colObj["minlength"]);
						$this->form["detail"]["head"]["error"] 		= 1;
						$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("less_min_length", $lang, $len, $colObj["minlength"]);
                    }

                    if($len > 0 && $colObj["pattern"] != "" ) {

                        if(!preg_match($this->dataType[ strtoupper($colObj["pattern"]) ], $this->form["detail"]["vals"][$colName])) {
                            $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, $colObj["pattern"]);
							$this->form["detail"]["head"]["error"] 		= 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, $colObj["pattern"]);
                        }        
                    } 

                    if( strtoupper($colObj["pattern"]) == "NUMBER" && $this->form["detail"]["vals"][$colName]=="") $this->form["detail"]["vals"][$colName]="0";
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "\n"; 
                    $temp[$colName] = LANG::trans($this->form["detail"]["vals"][$colName], $this->dlang);
                    break;

				case "seal":
                    $dtObj = $this->form["detail"]["cols"][$colObj["ref"]];

					$datetype = $this->form["detail"]["vals"][$dtObj["date_type"]];
					$ver_flag = false;
					$valtype  = "CHAR";
					if( in_array($colName, array($dtObj["date_type"])) ) {
						$ver_flag = true;
						$temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"";
					}

					if( in_array($colName, array($dtObj["start_time"], $dtObj["end_time"])) ) {
						$ver_flag = true;
						$valtype  = "TIME";
						$temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"00:00";
					}

   					switch($datetype) {
                            case "Once":
								if( in_array($colName, array($dtObj["once_date"])) ) {
									$ver_flag = true;
									$valtype  = "DATE";
									$temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0000-00-00";
								}
								break;
						    case "Daily":
								if( in_array($colName, array($dtObj["start_date"], $dtObj["end_date"])) ) {
									$ver_flag = true;
									$valtype  = "DATE";
									$temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0000-00-00";
								}
                                break;
						    case "Weekly":
								if( in_array($colName, array($dtObj["start_date"], $dtObj["end_date"])) ) {
									$ver_flag = true;
									$valtype  = "DATE";
									$temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0000-00-00";
								}

								
								if( in_array($colName, array($dtObj["date_sets"])) ) {
								
									$select_ck = false;
									$val_str   = "";
									foreach($this->form["detail"]["vals"][$colObj["ref"]]["wdates"] as $key1=>$val1) {
										if(strtolower($val1)=="true"||$val1===true) {
											$select_ck = true;
											$val_str   .= ($val_str!=""?",":"") . $key1;
                                            // prevent true => "true"  ,  javasciprt "true" != true
                                            $this->form["detail"]["vals"][$colObj["ref"]]["wdates"][$key1] = true;
										}
									}
									// prevent "true"
                                    foreach($this->form["detail"]["vals"][$colObj["ref"]]["mdates"] as $key1=>$val1) {
                                        $this->form["detail"]["vals"][$colObj["ref"]]["mdates"][$key1] = false;
                                    }

									if(!$select_ck) {
										$this->form["detail"]["cols"][$colName]["error"] = 1;
										$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
    						            $this->form["detail"]["head"]["error"] = 1;
	    					            $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
									}
								
									$ver_flag = false;
									$temp[$colName] = $val_str?$val_str:"";
								}

							    break;
						    case "Monthly":
								if( in_array($colName, array($dtObj["start_date"], $dtObj["end_date"])) ) {
									$ver_flag = true;
									$valtype  = "DATE";
									$temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0000-00-00";
								}

								if( in_array($colName, array($dtObj["date_sets"])) ) {
								
									$select_ck = false;
									$val_str   = "";
									foreach($this->form["detail"]["vals"][$colObj["ref"]]["mdates"] as $key1=>$val1) {
										if(strtolower($val1)=="true"||$val1===true) {
											$select_ck = true;
											$val_str   .= ($val_str!=""?",":"") . $key1;
                                            // prevent true => "true"  ,  javasciprt "true" != true
                                            $this->form["detail"]["vals"][$colObj["ref"]]["mdates"][$key1] = true;
										}
									}
									// prevent "true"
                                    foreach($this->form["detail"]["vals"][$colObj["ref"]]["wdates"] as $key1=>$val1) {
                                        $this->form["detail"]["vals"][$colObj["ref"]]["wdates"][$key1] = false;
                                    }

									if(!$select_ck) {
										$this->form["detail"]["cols"][$colName]["error"] = 1;
										$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
    						            $this->form["detail"]["head"]["error"] = 1;
	    					            $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
									}
								
									$ver_flag = false;
									$temp[$colName] = $val_str?$val_str:"";
								}
							    break;
					}
					if($ver_flag) {
                        if( $len <=0 && $colObj["required"]=="1" ) {
						    //echo "required: $colName: " . $this->form["detail"][$colName] . " len: $len" . "\n";
	                        $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						    $this->form["detail"]["head"]["error"] = 1;
						    $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                        }
                    
                        if($len > 0) {
                            if(!preg_match($this->dataType[$valtype], $this->form["detail"]["vals"][$colName])) {
                                $this->form["detail"]["cols"][$colName]["error"] = 1;
                                $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'(". $this->form["detail"]["vals"][$colName] .") " . LANG::words("invalid_type", $lang, $valtype);
							    $this->form["detail"]["head"]["error"] = 1;
							    $this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'(". $this->form["detail"]["vals"][$colName] .") " . LANG::words("invalid_type", $lang, $valtype);
                            }        
                        } 
					}
					break;

                case "date":
                    if( $len <=0 && $colObj["required"]=="1" ) {
						//echo "required: $colName: " . $this->form["detail"][$colName] . " len: $len" . "\n";
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    }
                    
                    if($len > 0) {

                        if(!preg_match($this->dataType["DATE"], $this->form["detail"]["vals"][$colName])) {
                            $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "DATE");
							$this->form["detail"]["head"]["error"] 		= 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "DATE");
                        }        
                    } 
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "\n"; 
                    $temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0000-00-00";
                    break;

                case "time":
                    $timehi =  trim($this->form["detail"]["vals"][$colName . "_hh"]) . ":" . trim($this->form["detail"]["vals"][$colName . "_ii"]);     
					
                    if($colObj["required"]=="1" && trim($this->form["detail"]["vals"][$colName . "_hh"])=="" && trim($this->form["detail"]["vals"][$colName . "_ii"])=="") {
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    } else {
					    if( trim($this->form["detail"]["vals"][$colName . "_hh"])!="" || trim($this->form["detail"]["vals"][$colName . "_ii"])!="") {
							if( !preg_match($this->dataType["TIME"], $timehi) ) {
								$this->form["detail"]["cols"][$colName]["error"] = 1;
								$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "TIME");
								$this->form["detail"]["head"]["error"] = 1;
								$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "TIME");
							}
						}
					}

                    $temp[$colName] = $timehi?$timehi:"00:00";
                    break;

                case "time1":
                    $timehi =  trim($this->form["detail"]["vals"][$colName . "_hh"]) . ":" . trim($this->form["detail"]["vals"][$colName . "_ii"]);     
					
                    if($colObj["required"]=="1" && trim($this->form["detail"]["vals"][$colName . "_hh"])=="" && trim($this->form["detail"]["vals"][$colName . "_ii"])=="") {
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    } else {
					    if( trim($this->form["detail"]["vals"][$colName . "_hh"])!="" || trim($this->form["detail"]["vals"][$colName . "_ii"])!="") {
							if( !preg_match($this->dataType["TIME"], $timehi) ) {
								$this->form["detail"]["cols"][$colName]["error"] = 1;
								$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "TIME");
								$this->form["detail"]["head"]["error"] = 1;
								$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "TIME");
							}
						}
					}

                    $temp[$colName] = $timehi?$timehi:"00:00";
                    break;


                case "dateymd":
                    $dateymd = $this->form["detail"]["vals"][$colName . "_yy"] . "-" . $this->form["detail"]["vals"][$colName . "_mm"] . "-" . $this->form["detail"]["vals"][$colName . "_dd"];     
                    if($colObj["required"]=="1" ) {
                        if( !preg_match($this->dataType["DATE"], $dateymd) ) {
                            $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "DATE");
							$this->form["detail"]["head"]["error"] = 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "DATE");
                        }        
                    } 

                    $colymd= str_replace("_ymd","", $colName);
                    $temp[$colymd . "_yy"] = $this->form["detail"]["vals"][$colName . "_yy"]?$this->form["detail"]["vals"][$colName . "_yy"]:0;
                    $temp[$colymd . "_mm"] = $this->form["detail"]["vals"][$colName . "_mm"]?$this->form["detail"]["vals"][$colName . "_mm"]:0;
                    $temp[$colymd . "_dd"] = $this->form["detail"]["vals"][$colName . "_dd"]?$this->form["detail"]["vals"][$colName . "_dd"]:0;
                    break;

                case "timehi":
                    $timehi =  substr("0". trim($this->form["detail"]["vals"][$colName . "_hh"]), -2) . ":" . substr("0" . trim($this->form["detail"]["vals"][$colName . "_ii"]), -2);     
                    
                    if($colObj["required"]=="1" && (trim($this->form["detail"]["vals"][$colName . "_hh"])=="" || trim($this->form["detail"]["vals"][$colName . "_ii"])=="") ) {
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    } else {
                        $timehi =  substr("0". trim($this->form["detail"]["vals"][$colName . "_hh"]), -2) . ":" . substr("0" . trim($this->form["detail"]["vals"][$colName . "_ii"]), -2);     
                        if( !preg_match($this->dataType["TIME"], $timehi) || intval(trim($this->form["detail"]["vals"][$colName . "_hh"])) > 23 || intval(trim($this->form["detail"]["vals"][$colName . "_ii"])) > 59 ) {
                            $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "TIME");
							$this->form["detail"]["head"]["error"] = 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "TIME");
                        }        
                    }

                    $colhi = str_replace("_hi","", $colName);
                    $temp[$colhi . "_hh"] = $this->form["detail"]["vals"][$colName . "_hh"]?$this->form["detail"]["vals"][$colName . "_hh"]:0;
                    $temp[$colhi . "_ii"] = $this->form["detail"]["vals"][$colName . "_ii"]?$this->form["detail"]["vals"][$colName . "_ii"]:0;
                    break;

                case "timezone":
                    $this->form["detail"]["vals"][$colName] = $this->form["detail"]["vals"][$colName]>0?$this->form["detail"]["vals"][$colName]:$this->form["detail"]["head"]["timezone"];
                    if( $len <=0 && $colObj["required"]=="1" ) {
						//echo "required: $colName: " . $this->form["detail"][$colName] . " len: $len" . "\n";
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                    }
                    
                    if($len > 0 ) {
                        if(!preg_match($this->dataType["NUMBER"], $this->form["detail"]["vals"][$colName])) {
                            $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "Number");
							$this->form["detail"]["head"]["error"] = 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "Number");
                        }        
                    } 

                    $temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:0;
                    break;

				case "checkbox":  // must filter undder
					if($colObj["required"]=="1" ) {
                            $select_ck = false;
		                    foreach($this->form["detail"]["vals"][$colName] as $key1=>$val1) {
			                    if(strtolower($val1)=="true"||$val1===true) $select_ck = true;
		                    }
                            if(!$select_ck) {
                                if($colObj["other"]!="" && $this->form["detail"]["vals"][$colObj["other"]]==""){
	                                $this->form["detail"]["cols"][$colName]["error"] = 1;
                                    $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						            $this->form["detail"]["head"]["error"] = 1;
						            $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
                                }
                            }
                    }
                    if($colObj["other"]!="") $temp[$colObj["other"]] = LANG::trans($this->form["detail"]["vals"][$colObj["other"]], $this->dlang);
					break;
                case "bool":
                    $temp[$colName] = $this->form["detail"]["vals"][$colName]=="true"?1:0;
                    $this->form["detail"]["vals"][$colName] = $temp[$colName]==1?true:false;
                    break;
            }
        }
        return $temp;        
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
?>
