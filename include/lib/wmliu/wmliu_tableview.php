<?php
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");
class WMLIUTABLEVIEW {
    public  $table;
    public  $result;
    public  $vlist;
	private $db;
	private $dlang;
	private $query;
	private $download;
	public 	$error;
	public 	$errorMessage;
	public function __construct($db, $table, $dlang) {
		$this->table            = $table;
        $this->vlist            = array();
        //$this->table["rows"]    = array();
				
		$this->db 		= $db;
		$this->dlang	= $dlang;
        $this->table["navi"]["head"]["lang"] = $table["navi"]["head"]["lang"]?$table["navi"]["head"]["lang"]:$this->dlang;

		$schema["filter"] 	= $this->table["navi"]["head"]["imgsettings"]["filter"];
		$schema["mode"] 	= "thumb";  // don't send to table , too big
		$schema["view"] 	= $this->table["navi"]["head"]["imgsettings"]["view"];
		$schema["noimg"] 	= 0;
		
		$this->download = new DOWNLOADIMAGE($db, $schema, $dlang);

        $fields     = $this->getCol();        
        $field_str  = "";
        foreach($fields as $field) {
            $field_str .= ($field_str==""?"":", ") . $field;
        }

        $pptable    = $this->table["schema"]["table"]["pptable"]["name"];
        $pptext      = $this->table["schema"]["table"]["pptable"]["ptext"];
        $pcol       = $this->table["schema"]["table"]["pptable"]["col"];
        $pid        = $this->table["schema"]["idvals"]["pid"];

        $mmtable    = $this->table["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->table["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->table["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->table["schema"]["table"]["sstable"]["name"];
        $scol       = $this->table["schema"]["table"]["sstable"]["col"];
        $spref      = $this->table["schema"]["table"]["sstable"]["pref"];
        $sid        = $this->table["schema"]["idvals"]["sid"];

        $ddtable    = $this->table["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->table["schema"]["table"]["ddtable"]["col"];

        $criteria = "";
        $ppccc      = WMSEARCH::filterID($this->table["schema"]["table"]["pptable"], $this->table["schema"]["idvals"]["pid"]);
        $mmccc      = WMSEARCH::filter($this->table["schema"]["table"]["mmtable"], $this->table["schema"]["filterVals"]["mmtable"]);
        $ssccc      = WMSEARCH::filter($this->table["schema"]["table"]["sstable"], $this->table["schema"]["filterVals"]["sstable"]);
        $ddccc      = WMSEARCH::filter($this->table["schema"]["table"]["ddtable"], $this->table["schema"]["filterVals"]["ddtable"]);


		// case of view
		$criteria   = WMSEARCH::concat($criteria, $ppccc);
		$criteria   = WMSEARCH::concat($criteria, $mmccc);
		$criteria   = WMSEARCH::concat($criteria, $ssccc);
		$criteria   = WMSEARCH::concat($criteria, $ddccc);

		if($pptable != "" ) {
				if($mmtable != "") {
						if($ddtable!="") { 
								if($ddccc!="") {
									//$criteria = SEARCH:concat($criteria, $ddccc);
									$this->query = "SELECT $pptable.$pcol as pid, $sstable.$scol as sid,  $ddtable.$dcol as did, 
															IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
																	   $field_str FROM $pptable 
																				  INNER JOIN $mmtable ON ( $pptable.$pcol = $mmtable.$mpref )
																				  INNER JOIN $sstable ON ( $mmtable.$msref = $sstable.$scol ) 
																				  LEFT  JOIN $ddtable ON ( $sstable.$scol = $ddtable.$dcol ) 
																		WHERE $sstable.deleted <> 1 AND $ddtable.deleted <> 1 $criteria";
								} else {
									$this->query = "SELECT $pptable.$pcol as pid, $sstable.$scol as sid, $ddtable.$dcol as did,  
															IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
																		$field_str FROM $pptable 
																				  INNER JOIN $mmtable ON ( $pptable.$pcol = $mmtable.$mpref )
																				  INNER JOIN $sstable ON ( $mmtable.$msref = $sstable.$scol ) 
																				  LEFT JOIN ( SELECT aaa.* FROM $ddtable aaa WHERE aaa.deleted <> 1 ) $ddtable ON ( $sstable.$scol = $ddtable.$dcol )
																		WHERE $sstable.deleted <> 1 $criteria";
								}
						} else {
								$this->query = "SELECT $pptable.$pcol as pid, $sstable.$scol as sid,  
													   IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
																   $field_str FROM $pptable 
																			  INNER JOIN $mmtable ON ( $pptable.$pcol = $mmtable.$mpref )
																			  INNER JOIN $sstable ON ( $mmtable.$msref = $sstable.$scol ) 
																	WHERE $sstable.deleted <> 1 $criteria";
						} // end of ddtable != ""
				} else {
						if($ddtable!="") {
							if($ddccc!="") {
									//$criteria = SEARCH:concat($criteria, $ddccc);
									$this->query = "SELECT $pptable.$pcol as pid, $sstable.$scol as sid,  $ddtable.$dcol as did, 
														   IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
																		 $field_str FROM $pptable 
																					INNER JOIN $sstable ON ( $pptable.$pcol = $sstable.$spref ) 
																					LEFT  JOIN $ddtable ON ( $sstable.$scol = $ddtable.$dcol ) 
																		WHERE $sstable.deleted <> 1 AND $ddtable.deleted <> 1 AND $criteria";
							} else {
									$this->query = "SELECT $pptable.$pcol as pid, $sstable.$scol as sid,  $ddtable.$dcol as did, 
														   IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
																		 $field_str FROM $pptable 
																					INNER JOIN $sstable ON ( $pptable.$pcol = $sstable.$spref ) 
																					LEFT JOIN ( SELECT aaa.* FROM $ddtable aaa WHERE aaa.deleted <> 1 ) $ddtable ON ( $sstable.$scol = $ddtable.$dcol ) 
																		WHERE $sstable.deleted <> 1 $criteria";
			
							}
						} else {
							$this->query = "SELECT $pptable.$pcol as pid, $sstable.$scol as sid, 
												   IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
																 $field_str FROM $pptable 
																			INNER JOIN $sstable ON ( $pptable.$pcol = $sstable.$spref ) 
																WHERE $sstable.deleted <> 1 $criteria";
						}
				} // end of mmtable !=""   
		} else {
				//$criteria = SEARCH:concat($criteria, $ssccc);
				if($ddtable!="") {
						if($ddccc!="") {
							//$criteria = SEARCH:concat($criteria, $ddccc);
							$this->query = "SELECT  $sstable.$scol as sid,  $ddtable.$dcol as did, 
													IF(ISNULL($ddtable.$dcol), 0, 1) AS refcheck, 
													 $field_str FROM $sstable  
																LEFT  JOIN $ddtable ON ( $sstable.$scol = $ddtable.$dcol ) 
																WHERE $sstable.deleted <> 1 AND $ddtable.deleted <> 1 $criteria";
						} else {
							$this->query = "SELECT $sstable.$scol as sid,  $ddtable.$dcol as did, 
												   IF(ISNULL($ddtable.$dcol), 0, 1) AS refcheck, 
																$field_str FROM $sstable  
																LEFT JOIN ( SELECT aaa.* FROM $ddtable aaa WHERE aaa.deleted <> 1 ) $ddtable ON ( $sstable.$scol = $ddtable.$dcol ) 
																WHERE $sstable.deleted <> 1 $criteria";
						}
				} else {
						$this->query = "SELECT $sstable.$scol as sid, 
											   IF(ISNULL($sstable.$scol), 0, 1) AS refcheck, 
											   $field_str FROM $sstable  
															WHERE $sstable.deleted <> 1 $criteria";
				}
		}  // end of pptable != ""

		//echo "query: " . $this->query;
		// end of case view


		$result_num 	= $db->query("SELECT COUNT(1) AS CNT FROM ( " . $this->query . " ) res1");
		$row_total 		= $db->fetch($result_num);
		$this->table["navi"]["head"]["totalNo"] 	= $row_total["CNT"]?$row_total["CNT"]:0;
		$this->table["navi"]["head"]["pageNo"] 	    = $table["navi"]["head"]["pageNo"]?$table["navi"]["head"]["pageNo"]:1;
		$this->table["navi"]["head"]["pageSize"] 	= $table["navi"]["head"]["pageSize"] > 0 && $table["navi"]["head"]["pageSize"] <= 200?$table["navi"]["head"]["pageSize"]:20;

         $this->table["navi"]["head"]["pageNo"] = $this->table["navi"]["head"]["totalNo"]==0?0:
                                                    ($this->table["navi"]["head"]["pageNo"]>ceil($this->table["navi"]["head"]["totalNo"]/$this->table["navi"]["head"]["pageSize"]))?
                                                    ceil($this->table["navi"]["head"]["totalNo"]/$this->table["navi"]["head"]["pageSize"]):
                                                    $this->table["navi"]["head"]["pageNo"];


        $this->query          = $this->query . " " . $this->orderStr();     

		// debug info
        //$this->table["navi"]["head"]["query"]       = $this->query;
        //$this->table["navi"]["head"]["criteria"]    = $criteria;

   		$this->action();
	}
    
	private function action() {
        $this->table["navi"]["head"]["loading"] = 0;
		switch($this->table["navi"]["head"]["action"]) {
            case "init":
                $this->checklist();
                $this->checkVlist();
                $this->checkClist();
                $this->initPtext();

                // response data;
                $this->result["schema"]["idvals"]   = $this->table["schema"]["idvals"];
                $this->result["navi"]["head"]       = $this->table["navi"]["head"];
                $this->result["listTables"]         = $this->table["listTables"];

                break;
            case "fresh":
                $this->checklist();
                $this->checkVlist();
                $this->checkClist();
                $this->initPtext();

                $this->table["rows"] = $this->rows();
                // response data;
                $this->result["schema"]["idvals"]   = $this->table["schema"]["idvals"];
                $this->result["navi"]["head"]       = $this->table["navi"]["head"];
                $this->result["listTables"]         = $this->table["listTables"];
                $this->result["rows"]               = $this->table["rows"];
                break;
			case "load":
                $this->initPtext();
                $this->table["rows"]                = $this->rows();
                // response data;
                $this->result["schema"]["idvals"]   = $this->table["schema"]["idvals"];
                $this->result["navi"]["head"]       = $this->table["navi"]["head"];
                $this->result["rows"]               = $this->table["rows"];
				break;

			case "save":
                $this->save();
                // response data;
                $this->result["schema"]["idvals"] = $this->table["schema"]["idvals"];
                $this->result["navi"]["head"]   = $this->table["navi"]["head"];
                $this->result["rows"]           = $this->table["rows"];
				break;
			case "cancel":
				break;
			case "delete":  // only change state  to "delete",  "save" means submit delete
				break;
			case "add":  // add only create client side empty {} 
				break;
			case "excel":
				break;

			case "print":
				break;
		}
	}

	private function orderStr() {
		$order_str = "";
		if($this->table["navi"]["head"]["orderBY"] != "" &&  $this->table["navi"]["head"]["orderSN"] != "") {	
			$order_str 	= " ORDER BY " . $this->table["navi"]["head"]["orderBY"] . " " . $this->table["navi"]["head"]["orderSN"];
		} elseif($orderBY != "") {
			$order_str 	= " ORDER BY " . $this->table["navi"]["head"]["orderBY"] . " ASC";
			$this->table["navi"]["head"]["orderSN"] 	= "ASC";
		} 
		return $order_str;
	}

    public function initPtext() {

        $db = $this->db;
        $pptable    = $this->table["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->table["schema"]["table"]["pptable"]["col"];
        $pid        = $this->table["schema"]["idvals"]["pid"];
        if($pptable!="") {
            $field_str = "";
            foreach( $this->table["schema"]["cols"] as $colObj ) {
                if($colObj["type"]=="ptext") {
                    $colName    = $colObj["col"];
                    $field_str  = ($field_str==""?"":",") . $colObj["pcol"] . " as " . $colName;        
                }            
            }
            if($field_str!="") {
                $query  = "SELECT $field_str FROM $pptable WHERE $pptable.$pcol = '" . $pid . "'";
                $result = $db->query($query);
                $row    = $db->fetch($result);
                
                foreach( $this->table["schema"]["cols"] as $colObj ) {
                    if($colObj["type"]=="ptext") {
                        $colName = $colObj["col"];
                        $this->table["schema"]["idvals"][$colName] = LANG::trans($row[$colName], $this->table["navi"]["head"]["lang"]);        
                    }            
                }
            }
        }

    }

	private function rows() {
		$db = $this->db;
		$this->table["navi"]["head"]["pageNo"] = $this->table["navi"]["head"]["pageNo"]<=0?1:$this->table["navi"]["head"]["pageNo"];
		$query 	= "SELECT * FROM (" . $this->query . ") res1  LIMIT " . ($this->table["navi"]["head"]["pageNo"]-1) * $this->table["navi"]["head"]["pageSize"] . " , " . $this->table["navi"]["head"]["pageSize"];
		
        //debug info
        //$this->table["query1"] = $query;
		
		$result = $db->query( $query );
		
		$rows = array();
		$cnt = 0;
        while( $row = $db->fetch($result)) {
            $rows[$cnt]["pid"]      = $row["pid"];
            $rows[$cnt]["sid"]      = $row["sid"];
            $rows[$cnt]["refcheck"] = $row["refcheck"]=="1"?true:false;

		    foreach( $this->table["schema"]["cols"] as $col ) {
                if($col["col"]!="") {
			        switch($col["type"]) {
                        case "date":
                        case "time":
							$rows[$cnt][$col["col"]] = $row[$col["col"]]>0?$row[$col["col"]]:"";
							break;
						case "vtext":
                        case "intdate":
                        case "timezone":
                        case "ymdtext":
                                $rows[$cnt][$col["col"]]  = $row[str_replace("_ymd","",$col["col"]) . "_yy"]!=""?$row[str_replace("_ymd","",$col["col"]) . "_yy"]:"????";
                                $rows[$cnt][$col["col"]] .= "-";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_ymd","",$col["col"]) . "_mm"]!=""?substr("0". $row[str_replace("_ymd","",$col["col"]) . "_mm"], -2):"??";
                                $rows[$cnt][$col["col"]] .= "-";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_ymd","",$col["col"]) . "_dd"]!=""?substr("0". $row[str_replace("_ymd","",$col["col"]) . "_dd"], -2):"??";

                                $rows[$cnt][$col["col"]] = $rows[$cnt][$col["col"]]!="????-??-??"?$rows[$cnt][$col["col"]]:"";
                            break;
                        case "hitext":
                                $rows[$cnt][$col["col"]] = $row[str_replace("_hi","",$col["col"]) . "_hh"]!=""?substr("0". $row[str_replace("_hi","",$col["col"]) . "_hh"], -2):"??";
                                $rows[$cnt][$col["col"]] .= ":";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_hi","",$col["col"]) . "_ii"]!=""?substr("0". $row[str_replace("_hi","",$col["col"]) . "_ii"], -2):"??";

                                $rows[$cnt][$col["col"]] = $rows[$cnt][$col["col"]]!="??:??"?$rows[$cnt][$col["col"]]:"";
                            break;
                        case "ymdhitext":
                                $rows[$cnt][$col["col"]]  = $row[str_replace("_ymd","",$col["col"]) . "_yy"]!=""?$row[str_replace("_ymd","",$col["col"]) . "_yy"]:"????";
                                $rows[$cnt][$col["col"]] .= "-";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_ymd","",$col["col"]) . "_mm"]!=""?substr("0". $row[str_replace("_ymd","",$col["col"]) . "_mm"], -2):"??";
                                $rows[$cnt][$col["col"]] .= "-";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_ymd","",$col["col"]) . "_dd"]!=""?substr("0". $row[str_replace("_ymd","",$col["col"]) . "_dd"], -2):"??";
                                $rows[$cnt][$col["col"]] .= " ";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_hi","",$col["col"]) . "_hh"]!=""?substr("0". $row[str_replace("_hi","",$col["col"]) . "_hh"], -2):"??";
                                $rows[$cnt][$col["col"]] .= ":";
                                $rows[$cnt][$col["col"]] .= $row[str_replace("_hi","",$col["col"]) . "_ii"]!=""?substr("0". $row[str_replace("_hi","",$col["col"]) . "_ii"], -2):"??";

                                $rows[$cnt][$col["col"]] = $rows[$cnt][$col["col"]]!="????-??-?? ??:??"?$rows[$cnt][$col["col"]]:"";
                            break;
                        case "datetimetext":
                                $rows[$cnt][$col["col"]]  = $row[$col["col"] . "_date"]!=""?$row[$col["col"] . "_date"]:"";
                                $rows[$cnt][$col["col"]] .= " ";
                                $rows[$cnt][$col["col"]] .= $row[$col["col"] . "_time"]!=""?$row[$col["col"] . "_time"]:"";
                            break;
                        case "imgvalue":
                            break;
                        case "thumb":
							if( $this->table["navi"]["head"]["imgsettings"]["singleImage"] ) {
								$rows[$cnt][$col["col"]] = $this->download->ImageBase64($row["sid"], $this->table["navi"]["head"]["imgsettings"]["view"]);  //WMIMAGE::Base64($db, $row["sid"], "thumb", 0);
							} else { 
								$this->download->refid($row["sid"]);
								$rows[$cnt][$col["col"]] = $this->download->MainBase64($this->table["navi"]["head"]["imgsettings"]["view"]);  //WMIMAGE::Base64($db, $row["sid"], "thumb", 0);
							}
                            break;
                        case "bool":  //  true / false
        				    $rows[$cnt][$col["col"]] = $row[$col["col"]]==1||$row[$col["col"]]=="1"?true:false;
                            break;
                        case "text": //  "abc"
        				    $rows[$cnt][$col["col"]] = LANG::trans($row[$col["col"]], $this->table["navi"]["head"]["lang"]);
                            break;
                        case "ptext": //  "abc"
        				    $rows[$cnt][$col["col"]] = $this->table["schema"]["idvals"]["pid"];
                            break;
                        default:     // null => ""
        				    $rows[$cnt][$col["col"]] = $row[$col["col"]]?$row[$col["col"]]:"";
                            break;
			        }
                }
		    }
			$cnt++;	
		}
        $this->table["navi"]["head"]["pageNo"] = $this->table["navi"]["head"]["totalNo"]==0?0:$this->table["navi"]["head"]["pageNo"];
		return $rows;
	}
	
    private function checklist() {
    	$this->table["listTables"]["checklist"] = WMSEARCH::checklist($this->db, $this->table["navi"]["head"]["lang"], $this->table["schema"]["checklist"]);
    }

    private function checkVlist() {
        $this->table["listTables"]["vlist"] = WMSEARCH::checkVlist($this->db, $this->table["navi"]["head"]["lang"], $this->table["schema"]["checklist"]);
    }

    private function checkClist() {
        $this->table["listTables"]["clist"] = WMSEARCH::checkClist($this->db, $this->table["navi"]["head"]["lang"], $this->table["schema"]["checklist"]);
    }

    // save table part 
    public function save() {

        $pptable        = $this->table["schema"]["table"]["pptable"]["name"];
        $pcol           = $this->table["schema"]["table"]["pptable"]["col"];
        $pid            = $this->table["schema"]["idvals"]["pid"];

        $mmtable        = $this->table["schema"]["table"]["mmtable"]["name"];
        $mpref          = $this->table["schema"]["table"]["mmtable"]["pref"];  
        $msref          = $this->table["schema"]["table"]["mmtable"]["sref"];  

        $sstable        = $this->table["schema"]["table"]["sstable"]["name"];
        $scol           = $this->table["schema"]["table"]["sstable"]["col"];  
        $spref          = $this->table["schema"]["table"]["sstable"]["pref"];  
        $sid            = $this->table["schema"]["idvals"]["sid"];

        $ddtable        = $this->table["schema"]["table"]["ddtable"]["name"];
        $dcol           = $this->table["schema"]["table"]["ddtable"]["col"];

        $db = $this->db;
	    foreach($this->table["rows"] as $key=>$row) {
            $this->table["rows"][$key]["error"] = 0;
            $this->table["rows"][$key]["errorMessage"] = "";


            $row["pid"] = $row["pid"]?$row["pid"]:$this->table["schema"]["idvals"]["pid"];
            $this->table["rows"][$key]["pid"] = $row["pid"];

            if($pptable!="" && $row["pid"]=="") {
                $this->table["rows"][$key]["error"] = 1;
                $this->table["rows"][$key]["errorMessage"]["refcheck"] = "Please select a record from $pptable first.";
            }
            if($pptable!="" && $mmtable!="" && $row["pid"]!="" && $row["refcheck"]==true) {
                $mmfields = array();
                $mmfields = $this->getRow($row, $key, "mmtable");
            }
            $ssfields = array();
		    $ssfields = $this->getRow($row, $key, "sstable");

            if($ddtable!="") {
                $ddfields = array();
                $ddfields = $this->getRow($row, $key, "ddtable");
            }

            if($this->table["rows"][$key]["error"] < 1) {

                switch($row["rowstate"]) {
			            case 1:
                           if($this->user["save"]) {    
                           // mmtable
                                if($pptable!="" && $mmtable!="") {
                                    $row["pid"] = $this->table["schema"]["idvals"]["pid"];
                                    $this->table["rows"][$key]["pid"] = $row["pid"];
                                    $mmccc = array();
                                    $mmccc[$mpref] = $row["pid"]; 
                                    $mmccc[$msref] = $row["sid"]; 

                                    if($row["refcheck"]==true) {
                                        if(!$db->hasRow($mmtable, $mmccc)) {
                                            $mmfields[$mpref] =  $row["pid"];
                                            $mmfields[$msref] =  $row["sid"];
                                            $db->insert($mmtable, $mmfields);
                                        } else {
                                            $db->update($mmtable, $mmccc, $mmfields);
                                        }

				                        // special for checkbox, 				
		                                foreach($this->table["schema"]["cols"] as $col) {
					                        if( $col["table"] == "mmtable" && ( $col["type"] == "checkbox" || $col["type"] == "checklist" || $col["type"] == "checkcom" || $col["type"] == "checkdiag") ) {
						                        $colName    = $col["col"];
						                        $ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
						                        $ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
						        
                                                $db->delete($ref_table, $mmccc);						

						                        $this->table["rows"][$key][$colName] = array();
						                        foreach($row[$colName] as $key1=>$val1) {
							                        if(strtolower($val1)=="true"||$val1===true) {
								                        //echo "$key1 + $val1";
								                        $this->table["rows"][$key][$colName][$key1] = true;

								                        $clist = array();
								                        $clist[$mpref] = $row["pid"];
								                        $clist[$msref] = $row["sid"];
								                        $clist[$colName] = $key1;
								                        $db->insert($ref_table, $clist);
							                        }
						                        }
					                        }
				                        } // end of checkbox


                                    } else {   //refcheck = false

				                        // special for checkbox, 				
		                                foreach($this->table["schema"]["cols"] as $col) {
					                        if( $col["table"] == "mmtable") {
                                                switch($col["type"]) {
                                                    case "checklist":
                                                    case "checkcom":
                                                    case "checkdiag":
                                                    case "checkbox":
						                                    $colName    = $col["col"];
						                                    $ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
						                                    $ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
                                                            $db->delete($ref_table, $mmccc);						
						                                    $this->table["rows"][$key][$colName] = null;
                                                        break;
                                                    default:
                                                        $colName    = $col["col"];
						                                $this->table["rows"][$key][$colName] = "";
                                                        break;
                                                } 
					                        }
				                        } // end of checkbox

                                        $db->delete($mmtable, $mmccc);

                                    }  // refcheck==true

                                }
                                // end of mmtable




                                // sstable
                                $ssfields["last_updated"] = time();
	    			            $db->update($sstable, array($scol=>$row["sid"]), $ssfields);
				                // special for checkbox, 				
		                        foreach($this->table["schema"]["cols"] as $col) {
                                    $col["table"] = $col["table"]!=""?$col["table"]:"sstable";
					                if($col["table"]=="sstable" && ( $col["type"] == "checkbox" || $col["type"] == "checklist" || $col["type"] == "checkcom" || $col["type"] == "checkdiag") ) {
						                $colName = $col["col"];
						                $ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
						                $ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
						                $db->delete($ref_table, array($ref_col=>$row["sid"]));						

						                $this->table["rows"][$key][$colName] = array();
						                foreach($row[$colName] as $key1=>$val1) {
							                if(strtolower($val1)=="true"||$val1===true) {
								                //echo "$key1 + $val1";
								                $this->table["rows"][$key][$colName][$key1] = true;

								                $clist = array();
								                $clist[$ref_col] = $row["sid"];
								                $clist[$colName] = $key1;
								                $db->insert($ref_table, $clist);
							                }
						                }
					                }
				                }
                                // end of checkbox





                                // ddtable
                                if(count($ddfields) > 0) {
                                    // relationship already setup above,  no insert, delete case
                                    if( $db->hasRow($ddtable, array($dcol=>$row["sid"])) ) {
                                        $ddfields["deleted"]      = 0;
                                        $ddfields["last_updated"] = time();
                                        $db->update($ddtable, array($dcol=>$row["sid"]), $ddfields);
                                    } else {
                                        $ddfields[$dcol]          = $row["sid"];
                                        $ddfields["deleted"]      = 0;
                                        $ddfields["created_time"] = time();
                                        $db->insert($ddtable, $ddfields);
                                    }

				                    // special for checkbox, 				
		                            foreach($this->table["schema"]["cols"] as $col) {
					                    if( $col["table"] == "ddtable" && ( $col["type"] == "checkbox" || $col["type"] == "checklist" || $col["type"] == "checkcom" || $col["type"] == "checkdiag") ) {
						                    $colName    = $col["col"];
						                    $ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
						                    $ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
						        
                                            $db->delete($ref_table, array($ref_col=>$row["sid"]) );						

						                    $this->table["rows"][$key][$colName] = array();
						                    foreach($row[$colName] as $key1=>$val1) {
							                    if(strtolower($val1)=="true"||$val1===true) {
								                    //echo "$key1 + $val1";
								                    $this->table["rows"][$key][$colName][$key1] = true;

								                    $clist = array();
								                    $clist[$ref_col] = $row["sid"];
								                    $clist[$colName] = $key1;
								                    $db->insert($ref_table, $clist);
							                    }
						                    }
					                    }
				                    } // end of checkbox
                                } // end count > 0
                                // end of ddtable

 							} // user right
							else 
							{
								$this->table["rows"][$key]["error"] 		= 1;								
								$this->table["rows"][$key]["errorMessage"] 	= LANG::words("save.no.right", $lang);
								$this->error = 990;
								$this->errorMessage .= ($this->errorMessage==""?"":"<br>") . LANG::words("save.no.right", $lang); 					
							}
                                                       
                            break;
                        case 2:
	                        if($this->user["add"]) {    
								$row["pid"] = $this->table["schema"]["idvals"]["pid"];
								//$this->table["rows"][$key]["refcheck"] = true;
								if($pptable!="" && $mmtable=="") $ssfields[$spref] = $row["pid"];
	
								if($row["sid"]!="") {
									if( $db->hasRow($sstable,array($scol=>$row["sid"])) ) {
										$ssfields["deleted"] = 0;
										$db->update($sstable, array($scol=>$row["sid"]), $ssfields);
									} else {
										// one to many relationship
										// independ  insert + one to many if exist
										$ssfields["created_time"] = time();
										$ssfields["deleted"]      = 0;
										$row["sid"] = $db->insert($sstable, $ssfields);
									}
								} else {
									// one to many relationship
									// independ  insert + one to many if exist
									$ssfields["created_time"] = time();
									$ssfields["deleted"]      = 0;
									$row["sid"] = $db->insert($sstable, $ssfields);
								}
	
	
								// sstable
								// special for checkbox, 				
								foreach($this->table["schema"]["cols"] as $col) {
									$col["table"] = $col["table"]!=""?$col["table"]:"sstable";
									if($col["table"]=="sstable" && ( $col["type"] == "checkbox" || $col["type"] == "checklist" || $col["type"] == "checkcom" || $col["type"] == "checkdiag") ) {
										$colName = $col["col"];
										$ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
										$ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
										$db->delete($ref_table, array($ref_col=>$row["sid"]));						
	
										$this->table["rows"][$key][$colName] = array();
										foreach($row[$colName] as $key1=>$val1) {
											if(strtolower($val1)=="true"||$val1===true) {
												//echo "$key1 + $val1";
												$this->table["rows"][$key][$colName][$key1] = true;
	
												$clist = array();
												$clist[$ref_col] = $row["sid"];
												$clist[$colName] = $key1;
												$db->insert($ref_table, $clist);
											}
										}
									}
								}
								// end of checkbox
	
	
								// mmtable
								// many to manay relationship
								if($pptable!="" && $mmtable!="" && $row["pid"]!="") {
									$mmccc = array();
									$mmccc[$mpref] = $row["pid"]; 
									$mmccc[$msref] = $row["sid"]; 
	
									if($row["refcheck"]==true) {
										if(!$db->hasRow($mmtable, $mmccc)) {
											$mmfields[$mpref] =  $row["pid"];
											$mmfields[$msref] =  $row["sid"];
											$db->insert($mmtable, $mmfields);
										} else {
											$db->update($mmtable, $mmccc, $mmfields);
										}
	
										// special for checkbox, 				
										foreach($this->table["schema"]["cols"] as $col) {
											if( $col["table"] == "mmtable" && ( $col["type"] == "checkbox" || $col["type"] == "checklist" || $col["type"] == "checkcom" || $col["type"] == "checkdiag")  ) {
												$colName    = $col["col"];
												$ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
												$ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
									
												$db->delete($ref_table, $mmccc);						
	
												$this->table["rows"][$key][$colName] = array();
												foreach($row[$colName] as $key1=>$val1) {
													if(strtolower($val1)=="true"||$val1===true) {
														//echo "$key1 + $val1";
														$this->table["rows"][$key][$colName][$key1] = true;
	
														$clist = array();
														$clist[$mpref] = $row["pid"];
														$clist[$msref] = $row["sid"];
														$clist[$colName] = $key1;
														$db->insert($ref_table, $clist);
													}
												}
											}
										} // end of checkbox
	
	
									} else {
										// special for checkbox, 				
										foreach($this->table["schema"]["cols"] as $col) {
											if( $col["table"] == "mmtable") {
												switch($col["type"]) {
													case "checklist":
													case "checkcom":
													case "checkdiag":
													case "checkbox":
															$colName    = $col["col"];
															$ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
															$ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
															$db->delete($ref_table, $mmccc);						
															$this->table["rows"][$key][$colName] = null;
														break;
													default:
														$colName    = $col["col"];
														$this->table["rows"][$key][$colName] = "";
														break;
												} 
											}
										} // end of checkbox
	
										$db->delete($mmtable, $mmccc);
	
									}  // refcheck==true
	
								}
								// end of mmtable
	
							  
	
								// ddtable
								if(count($ddfields) > 0) {
									// relationship already setup above,  no insert, delete case
									if( $db->hasRow($ddtable, array($dcol=>$row["sid"])) ) {
										$ddfields["deleted"]      = 0;
										$ddfields["last_updated"] = time();
										$db->update($ddtable, array($dcol=>$row["sid"]), $ddfields);
									} else {
										$ddfields[$dcol]          = $row["sid"];
										$ddfields["deleted"]      = 0;
										$ddfields["created_time"] = time();
										$db->insert($ddtable, $ddfields);
									}
	
									// special for checkbox, 				
									foreach($this->table["schema"]["cols"] as $col) {
										if( $col["table"] == "ddtable" && ( $col["type"] == "checkbox" || $col["type"] == "checklist" || $col["type"] == "checkcom" || $col["type"] == "checkdiag") ) {
											$colName    = $col["col"];
											$ref_table 	= $this->table["schema"]["checklist"][$colName]["rtable"];
											$ref_col 	= $this->table["schema"]["checklist"][$colName]["rcol"];
									
											$db->delete($ref_table, array($ref_col=>$row["sid"]) );						
	
											$this->table["rows"][$key][$colName] = array();
											foreach($row[$colName] as $key1=>$val1) {
												if(strtolower($val1)=="true"||$val1===true) {
													//echo "$key1 + $val1";
													$this->table["rows"][$key][$colName][$key1] = true;
	
													$clist = array();
													$clist[$ref_col] = $row["sid"];
													$clist[$colName] = $key1;
													$db->insert($ref_table, $clist);
												}
											}
										}
									} // end of checkbox
								} // end count > 0
								// end of ddtable
	
	
								$this->table["rows"][$key]["pid"] = $row["pid"];
								$this->table["rows"][$key]["sid"] = $row["sid"];

							}
							else 
							{
								$this->table["rows"][$key]["error"] 		= 1;								
								$this->table["rows"][$key]["errorMessage"] 	= LANG::words("add.no.right", $lang);						
								$this->error = 990;
								$this->errorMessage .= ($this->errorMessage==""?"":"<br>") . LANG::words("add.no.right", $lang); 					
							}



                            break;
                        case 3:
	                        if($this->user["delete"]) {    
								if($mmtable!="" && $row["pid"]!="") {
									$mmccc = array();
									$mmccc[$mpref] = $row["pid"]; 
									$mmccc[$msref] = $row["sid"]; 
									$db->delete($mmtable, $mmccc);
								} 
	
								$db->detach($sstable, array($scol=>$row["sid"]));
								if($ddtable!="") {
									$db->detach($ddtable, array($dcol=>$row["sid"]));
								}
	
								$this->table["rows"][$key]["error"]         = 0;  // delete case , don't need to verify column
								$this->table["rows"][$key]["errorMessage"]  = "";
							}
							else 
							{
								$this->table["rows"][$key]["error"] 		= 1;								
								$this->table["rows"][$key]["errorMessage"] 	= LANG::words("delete.no.right", $lang);						
								$this->error = 990;
								$this->errorMessage .= ($this->errorMessage==""?"":"<br>") . LANG::words("delete.no.right", $lang); 					
							}

                            break;
                    } // end of switch

            }  // error < 1


            if($this->table["rows"][$key]["error"] < 1) $this->table["rows"][$key]["rowstate"] = 0;

	    } // end of foreach

        $query_base = "SELECT count(1) as CNT FROM (" . $this->query . ") aa";
	    $result_num = $db->query($query_base);
	    $row_total = $db->fetch($result_num);
	    $recoTotal =  $row_total["CNT"];
	    $this->table["navi"]["head"]["totalNo"] = $recoTotal;

         $this->table["navi"]["head"]["pageNo"] = $this->table["navi"]["head"]["totalNo"]==0?0:
                                                    ($this->table["navi"]["head"]["pageNo"]>ceil($this->table["navi"]["head"]["totalNo"]/$this->table["navi"]["head"]["pageSize"]))?
                                                    ceil($this->table["navi"]["head"]["totalNo"]/$this->table["navi"]["head"]["pageSize"]):
                                                    $this->table["navi"]["head"]["pageNo"];
    }

    
    private function getRow($row, $key, $tableLevel) {
		$lang = $this->table["navi"]["head"]["lang"];
	    $temp = array();

        foreach($this->table["schema"]["cols"] as $col) {
            $colName = $col["col"];
			//$row[$colName] = trim($row[$colName]);
			$row[$colName] = str_replace(array("undefined", "null", "NULL"), array("","",""), $row[$colName]);
            
            if( $col["table"] == "" ) $col["table"] = "sstable";
            if( $col["table"] != $tableLevel ) continue;

            $len = mb_strlen($row[$colName]);

            switch($col["type"]) {
                case "vtext":
                case "select":
                    if( ($len <=0 && $col["required"]=="1") || $row[$colName]=="0" ) {
                        if($col["other"]!="" && $row[$col["other"]]==""){
                            $this->table["rows"][$key]["error"] = 1;
                            $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                        }
                    }
                    $temp[$colName] = $row[$colName]?$row[$colName]:"0";
                    if($col["other"]!="") $temp[$col["other"]] = LANG::trans($row[$col["other"]], $this->dlang);
                    break;
                case "date":
                    if($len <=0 && $col["required"]=="1") {
                        $this->table["rows"][$key]["error"] = 1;
                        $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                    } 
					if($len > 0) {
                        if(!preg_match($this->dataType[ strtoupper($col["type"]) ], $row[$colName])) {
                            $this->table["rows"][$key]["error"] = 1;
                            $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"": "\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("invalid_type", $lang, strtoupper($col["type"]) );
                        }
					}
					$temp[$colName] = $row[$colName]?$row[$colName]:"0000-00-00";
					break;
                case "time":
                    if($len <=0 && $col["required"]=="1") {
                        $this->table["rows"][$key]["error"] = 1;
                        $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                    } 
					if($len > 0) {
                        if(!preg_match($this->dataType[ strtoupper($col["type"]) ], $row[$colName])) {
                            $this->table["rows"][$key]["error"] = 1;
                            $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"": "\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("invalid_type", $lang, strtoupper($col["type"]) );
                        }
					}
					$temp[$colName] = $row[$colName]?$row[$colName]:"00:00";
					break;
                case "textbox":
                case "textarea":
                    if( $len <=0 && $col["required"]=="1" ) {
                        $this->table["rows"][$key]["error"] = 1;
                        $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                    }
                    
                    if($len > $col["maxlength"] && $col["maxlength"]>0) {
                           $this->table["rows"][$key]["error"] = 1;
                           $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("over_max_length", $lang, $len, $col["maxlength"]);
                    }
                    

                    if($len < $col["minlength"] && $col["minlength"]>0) {
                           $this->table["rows"][$key]["error"] = 1;
                           $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("less_min_length", $lang, $len, $col["minlength"]);
                    }

                    if($this->table["rows"][$key]["error"] <= 0 && $col["pattern"] == "number" )  $row[$colName] = $row[$colName]?$row[$colName]:0;
					
                    if($len > 0 && $col["pattern"] != "" ) {
                        if(!preg_match($this->dataType[ strtoupper($col["pattern"]) ], $row[$colName])) {
                            $this->table["rows"][$key]["error"] = 1;
                            $this->table["rows"][$key]["errorMessage"][$colName] .= ($this->table["rows"][$key]["errorMessage"][$colName]==""?"": "\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("invalid_type", $lang, $col["pattern"]);
                        }
                        
						//echo "qty: " . $row[$colName] . "  min:" . $col["min"] . "  max:". $col["max"] . "\n";
						
                        if($col["pattern"] == "number") {
                                $row[$colName] = $row[$colName]?$row[$colName]:0;
								if( isset($col["min"]) && isset($col["max"]) ) {
									//echo "min & max \n";
									if(floatval($row[$colName]) < floatval($col["min"]) || floatval($row[$colName]) > floatval($col["max"])) {
										   //echo "min & max in \n";
										   $errMsg = ($row["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("out_of_range", $lang, $col["min"], $col["max"]);
			
										   $this->table["rows"][$key]["error"] = 1;    
										   $this->table["rows"][$key]["errorMessage"][$colName] .= $errMsg;            
									}
								} elseif ( $col["min"]!="" ) {
									if( floatval($row[$colName]) < floatval($col["min"]) ) {
										   $errMsg = ($row["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("less_than_min", $lang, $row[$colName], $col["min"]);
			
										   $this->table["rows"][$key]["error"] = 1;    
										   $this->table["rows"][$key]["errorMessage"][$colName] .= $errMsg;            
									}
								} elseif( $col["max"]!="" ) {
									if( floatval($row[$colName]) > floatval($col["max"]) ) {
										   $errMsg = ($row["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("large_than_max", $lang, $row[$colName], $col["max"]);
			
										   $this->table["rows"][$key]["error"] = 1;    
										   $this->table["rows"][$key]["errorMessage"][$colName] .= $errMsg;            
									}
								}
		
                        }        
                    } 
                                        
                    if($col["pattern"] == "number" && $row[$colName]=="") $row[$colName]="0";
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "\n"; 
                    $temp[$colName] = LANG::trans($row[$colName], $this->dlang);
                    break;
                case "bool":
                    $temp[$colName] = $row[$colName]=="true"?1:0;   
                    $this->table["rows"][$key][$colName] = $temp[$colName]==1?true:false;
                    break;
            }
        }
        return $temp;        
    }

	private function getCol() {
	    $temp = array();
        foreach($this->table["schema"]["cols"] as $colObj) {
            $colName = $colObj["col"];
            switch($colObj["type"]) {
                case "hidden":
	            case "date":
	            case "time":
	            case "intdate":
	            case "text":
                case "select":
                case "textbox":
                case "textarea":
                case "bool":
                    $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                    $table = $this->table["schema"]["table"][$colObj["table"]]["name"];
                    // if ddtable empty , then sstable
                    //if($table=="") $table = $this->table["schema"]["head"]["sstable"]["name"];
                    if($table!="") $temp[] = "$table.$colName";
					break;

                case "ymdtext":
                    $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                    $table = $this->table["schema"]["table"][$colObj["table"]]["name"];

                    if( $table!="" ) {
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_yy";  
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_mm";  
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_dd";  
                    } 
                    break;
                case "hitext":
                    $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                    $table = $this->table["schema"]["table"][$colObj["table"]]["name"];
                    if( $table!="" ) {
                        $temp[] = "$table." . str_replace("_hi","", $colName) . "_hh";  
                        $temp[] = "$table." . str_replace("_hi","", $colName) . "_ii";  
                    } 
                    break;
                case "ymdhitext":
                    $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                    $table = $this->table["schema"]["table"][$colObj["table"]]["name"];

                    if( $table!="" ) {
                        $temp[] = "$table." . $colName . "_yy";  
                        $temp[] = "$table." . $colName . "_mm";  
                        $temp[] = "$table." . $colName . "_dd";  
                        $temp[] = "$table." . $colName . "_hh";  
                        $temp[] = "$table." . $colName . "_ii";  
                    } 
                    break;
                case "datetimetext":
                    $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                    $table = $this->table["schema"]["table"][$colObj["table"]]["name"];

                    if( $table!="" ) {
                        $temp[] = "$table." . $colName . "_date";  
                        $temp[] = "$table." . $colName . "_time";  
                    } 
                    break;

	            case "vtext":
                    if($colObj["other"]!="") $temp[] = "$table." . $colObj["other"];
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
