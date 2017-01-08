<?php
class WMLIUFORM {
	public $form;
    public $result;
	private $dlang;
	public function __construct($db, $form, $dlang) {
		$this->form 	                        = $form;
		$this->db 		                        = $db;
		$this->dlang							= $dlang;
		$this->form["detail"]["head"]["lang"] 	= $form["detail"]["head"]["lang"]?$form["detail"]["head"]["lang"]:$this->dlang;
		$this->action();
	}

	public function action() {
    	$this->form["detail"]["head"]["loading"] 	= 0;
		switch($this->form["detail"]["head"]["action"]) {
            case "init":
                $this->checklist();
                $this->checkVlist();
                $this->checkClist();
                $this->initTablelist();
                $this->initPtext();

                $this->result["listTables"]         = $this->form["listTables"];
                $this->result["detail"]             = $this->form["detail"];
                $this->result["schema"]["idvals"]   = $this->form["schema"]["idvals"];
                break;
            case "fresh":
                $this->checklist();
                $this->checkVlist();
                $this->checkClist();
                $this->initTablelist();
                $this->initPtext();

				$this->load();
                $this->result["listTables"]         = $this->form["listTables"];
                $this->result["detail"]             = $this->form["detail"];
                $this->result["schema"]["idvals"]   = $this->form["schema"]["idvals"];
                break;
            case "load":
				$this->load();
                $this->initPtext();

                $this->result["detail"]             = $this->form["detail"];
                $this->result["schema"]["idvals"]   = $this->form["schema"]["idvals"];
				break;
			case "save":
				$this->form["detail"]["head"]["action"] = $this->form["detail"]["head"]["state"];
				if($this->form["detail"]["head"]["state"]=="new") 	    $this->add();
				if($this->form["detail"]["head"]["state"]=="update") 	$this->save();
				if($this->form["detail"]["head"]["state"]=="delete") 	$this->delete();

                 foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                    if($colObj["nosync"]=="1") $this->form["detail"]["vals"][$colName] = null;
                 }
                $this->result["detail"] = $this->form["detail"];
                $this->result["listTables"]["tablelist"]   	= $this->form["listTables"]["tablelist"];
                $this->result["schema"]["idvals"]  			= $this->form["schema"]["idvals"];
				break;
			case "cancel":
				break;
			case "excel":
				break;
			case "print":
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
        $db         = $this->db;
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
	public function load() {
        $db         = $this->db;

        $pptable    = $this->form["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->form["schema"]["table"]["pptable"]["col"];

        $mmtable    = $this->form["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->form["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->form["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->form["schema"]["table"]["sstable"]["name"];
        $scol       = $this->form["schema"]["table"]["sstable"]["col"];
        $spref       = $this->form["schema"]["table"]["sstable"]["pref"];
        
        $ddtable    = $this->form["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->form["schema"]["table"]["ddtable"]["col"];


        $pid        = $this->form["schema"]["idvals"]["pid"];
        $sid        = $this->form["schema"]["idvals"]["sid"];
        $did        = $sid;

        $ppssqqq    = "";
        if($pptable!="") $ppssqqq = "LEFT JOIN $pptable ON ($pptable.$pcol = $sstable.$spref AND $pptable.deleted <> 1 AND $pptable.$pcol = '" . $pid . "')";

        $ppmmqqq    = "";
        if($pptable!="" && $mmtable!="") 
            $ppmmqqq = "LEFT JOIN $mmtable ON ($mmtable.$msref = $sstable.$scol AND $mmtable.$mpref = '" . $pid . "') LEFT JOIN $pptable ON ($pptable.$pcol = $mmtable.$mpref AND $pptable.deleted <> 1 AND $pptable.$pcol = '" . $pid . "')";

        $ddfff      = $this->getColTT( array("ddtable") );
        $ddfff_str  = implode(",", $ddfff);
        $ddqqq      = "";
        if($ddtable!="" && $ddfff_str!="") 
            $ddqqq = "LEFT JOIN (SELECT ddd.$dcol as did, $ddfff_str FROM $ddtable ddd WHERE ddd.deleted <> 1 AND ddd.$dcol = '" . $sid . "') $ddtable ON ($sstable.$scol = $ddtable.did)";

        // get all fields
        $fields     = $this->getCol( array("pptable", "mmtable", "sstable", "ddtable") );
        $field_str  = implode(",", $fields);

        if($pptable!="") {
            $field_str  = WMSEARCH::join(",", "$pptable.$pcol as pid", $field_str);
            $field_str  = WMSEARCH::join(",", "$sstable.$scol as sid", $field_str);

            if($mmtable!="") {
                $query = "SELECT $field_str FROM $sstable $ppmmqqq $ddqqq WHERE $sstable.deleted <> 1 AND $sstable.$scol = '" . $sid . "'";
            } else {
                $query = "SELECT $field_str FROM $sstable $ppssqqq $ddqqq WHERE $sstable.deleted <> 1 AND $sstable.$scol = '" . $sid . "'";
            } 
        } else {
            $field_str  = WMSEARCH::join(",", "$sstable.$scol as sid", $field_str);
            $query = "SELECT $field_str FROM $sstable $ddqqq WHERE  $sstable.deleted <> 1 AND $sstable.$scol = '" . $sid . "'";
        } 


        // debug info.
        //$this->form["detail"]["query"] = $query;
        
        $rows = array();
        if( $db->exists($query) ) {
                $result = $db->query($query);
		        $rows = $db->rows( $result );
                $rows = $rows[0];
		        // special for checkbox, 				
		        foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                    switch($colObj["type"]) {
                        case "vtext":
                            $rows[$colName] = $rows[$colName]?$rows[$colName]:"";
                            if($col["other"]!="") $rows[$col["other"]] = LANG::trans($rows[$col["other"]], $this->form["detail"]["head"]["lang"]);
                            break;

                        case "datetype":
                            $rows[$colObj["start_date"]]    = $rows[$colObj["start_date"]]>0?$rows[$colObj["start_date"]]:"";
                            $rows[$colObj["end_date"]]      = $rows[$colObj["end_date"]]>0?$rows[$colObj["end_date"]]:"";
                            $rows[$colObj["once_date"]]     = $rows[$colObj["once_date"]]>0?$rows[$colObj["once_date"]]:"";
                            $rows[$colObj["start_time"]]    = $rows[$colObj["start_time"]]>0?$rows[$colObj["start_time"]]:"";
                            $rows[$colObj["end_time"]]      = $rows[$colObj["end_time"]]>0?$rows[$colObj["end_time"]]:"";

							switch( $rows[$colObj["date_type"]]) {
								case "Daily":
									break;
								case "Weekly":
									$wdates = explode(",", $rows[$colObj["date_sets"]]);
									$warr = array();
									foreach($wdates as $wval) {
										$warr[$wval] = true;
									}
									$rows[$colName]["wdates"] = $warr;
									break;
								case "Monthly":
									$wdates = explode(",", $rows[$colObj["date_sets"]]);
									$warr = array();
									foreach($wdates as $wval) {
										$warr[$wval] = true;
									}
									$rows[$colName]["mdates"] = $warr;
									break;
							}
							break;

                        case "timezone":
                        case "date":
                                $rows[$colName] = $rows[$colName]>0?$rows[$colName]:"";
                            break;
                        case "time":
								if( $rows[$colName]>0 ) {
                                	$time_part = explode(":", $rows[$colName]);
                                	$rows[$colName . "_hh"] = $time_part[0]?$time_part[0]:"00";
                                	$rows[$colName . "_ii"] = $time_part[1]?$time_part[1]:"00";
								} else {
                                	$rows[$colName . "_hh"] = "";
                                	$rows[$colName . "_ii"] = "";
								}
                            break;
                        case "time1":
                                $time_part = explode(":", $rows[$colName]);
                                $rows[$colName . "_hh"] = $time_part[0]?intval($time_part[0]):"";
                                $rows[$colName . "_ii"] = $time_part[1]?intval($time_part[1]):"";
                            break;
                        case "dateymd":
                                $rows[$colName . "_yy"] = $rows[str_replace("_ymd","",$colName) . "_yy"]?$rows[str_replace("_ymd","",$colName) . "_yy"]:"";
                                $rows[$colName . "_mm"] = $rows[str_replace("_ymd","",$colName) . "_mm"]?$rows[str_replace("_ymd","",$colName) . "_mm"]:"";
                                $rows[$colName . "_dd"] = $rows[str_replace("_ymd","",$colName) . "_dd"]?$rows[str_replace("_ymd","",$colName) . "_dd"]:"";
                            break;
                        case "timehi":
                                $rows[$colName . "_hh"] = $rows[str_replace("_hi","",$colName) . "_hh"]?$rows[str_replace("_hi","",$colName) . "_hh"]:"";
                                $rows[$colName . "_ii"] = $rows[str_replace("_hi","",$colName) . "_ii"]?$rows[str_replace("_hi","",$colName) . "_ii"]:"";
                            break;
                        case "ymdtext":
                                $rows[$colName]  = $rows[str_replace("_ymd","",$colName) . "_yy"]!=""?$rows[str_replace("_ymd","",$colName) . "_yy"]:"????";
                                $rows[$colName] .= "-";
                                $rows[$colName] .= $rows[str_replace("_ymd","",$colName) . "_mm"]!=""?substr("0". $rows[str_replace("_ymd","",$colName) . "_mm"], -2):"??";
                                $rows[$colName] .= "-";
                                $rows[$colName] .= $rows[str_replace("_ymd","",$colName) . "_dd"]!=""?substr("0". $rows[str_replace("_ymd","",$colName) . "_dd"], -2):"??";
                                
                                $rows[$colName]  = $rows[$colName]!="????-??-??"?$rows[$colName]:""; 
                            break;
                        case "hitext":
                                $rows[$colName] = $rows[str_replace("_hi","",$colName) . "_hh"]!=""?substr("0". $rows[str_replace("_hi","",$colName) . "_hh"], -2):"??";
                                $rows[$colName] .= ":";
                                $rows[$colName] .= $rows[str_replace("_hi","",$colName) . "_ii"]!=""?substr("0". $rows[str_replace("_hi","",$colName) . "_ii"], -2):"??";

                                $rows[$colName]  = $rows[$colName]!="??:??"?$rows[$colName]:""; 
                            break;
                        case "ymdhitext":
                                $rows[$colName]  = $rows[str_replace("_ymd","",$colName) . "_yy"]!=""?$rows[str_replace("_ymd","",$colName) . "_yy"]:"????";
                                $rows[$colName] .= "-";
                                $rows[$colName] .= $rows[str_replace("_ymd","",$colName) . "_mm"]!=""?substr("0". $rows[str_replace("_ymd","",$colName) . "_mm"], -2):"??";
                                $rows[$colName] .= "-";
                                $rows[$colName] .= $rows[str_replace("_ymd","",$colName) . "_dd"]!=""?substr("0". $rows[str_replace("_ymd","",$colName) . "_dd"], -2):"??";
                                $rows[$colName] .= " ";
                                $rows[$colName] .= $rows[str_replace("_hi","",$colName) . "_hh"]!=""?substr("0". $rows[str_replace("_hi","",$colName) . "_hh"], -2):"??";
                                $rows[$colName] .= ":";
                                $rows[$colName] .= $rows[str_replace("_hi","",$colName) . "_ii"]!=""?substr("0". $rows[str_replace("_hi","",$colName) . "_ii"], -2):"??";

                                $rows[$colName]  = $rows[$colName]!="????-??-?? ??:??"?$rows[$colName]:""; 
                            break;
                        case "datetimetext":
                                $rows[$colName]  = $rows[$colName . "_date"]!=""?$rows[$colName . "_date"]:"";
                                $rows[$colName] .= " ";
                                $rows[$colName] .= $rows[$colName . "_time"]!=""?$rows[$colName . "_time"]:"";
                            break;
                        case "text":
                                $rows[$colName] = LANG::trans($rows[$colName], $this->form["detail"]["head"]["lang"]);
                            break;
  
                        case "treemulti":
				                $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
				                $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];
   				                $result_ck    = $db->select($ref_table, $colName, array($ref_col=>$sid));
				                while( $row_ck = $db->fetch($result_ck) ) {
					                $rows[$colName][$row_ck[$colName]] = true;
				                }
                            break;
                        
						case "treecheck":
									foreach( $colObj["tree"] as $tcol=>$tcolObj ) {
										$ref_table 	= $tcolObj["table"];
										$ref_col 	= $tcolObj["col"];
										$val_col	= $tcolObj["val"];
										//echo "here $ref_table - $colName - $ref_col - $val_col - $sid\n";
										$rows[$colName][$tcol] = array();
										
										$result_ck    = $db->select($ref_table, $ref_col, array($colName=>$sid));
										while( $row_ck = $db->fetch($result_ck) ) {
											$ref_val = $row_ck[$ref_col];
											$rows[$colName][$tcol][$ref_val] = array();
											$result_ck1 = $db->select($ref_table,  $val_col, array($colName=>$sid, $ref_col=>$ref_val));
											while($row_ck1 = $db->fetch($result_ck1)) {
												$val_val = $row_ck1[$val_col];
												$rows[$colName][$tcol][$ref_val][$val_val] = true;
											}
										}
									} 
                            break;
							
						case "treetextbox":
						case "treeselect":
						case "treebool":
						case "treeradio":
									foreach( $colObj["tree"] as $tcol=>$tcolObj ) {
										$ref_table 	= $tcolObj["table"];
										$ref_col 	= $tcolObj["col"];
										$val_col	= $tcolObj["val"];
										//echo "here $ref_table - $colName - $ref_col - $val_col - $sid\n";
										$rows[$colName][$tcol] = array();
										
										$result_ck    = $db->select($ref_table, array($ref_col, $val_col), array($colName=>$sid));
										while( $row_ck = $db->fetch($result_ck) ) {
											$ref_val = $row_ck[$ref_col];
											$rows[$colName][$tcol][$ref_val] = array();
											$val_val = $row_ck[$val_col];
											$rows[$colName][$tcol][$ref_val]=$val_val;
										}
									}
									$rows[$colName][$tcol] = $rows[$colName][$tcol]?$rows[$colName][$tcol]:null; 
                            break;
						
                        case "checkbox":
				                $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
				                $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];

                                $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                                switch($colObj["table"]) {
                                    case "pptable":
        				                $result_ck    = $db->select($ref_table, $colName, array($ref_col=>$pid));
                                        break;
                                    case "mmtable":
        				                $result_ck    = $db->select($ref_table, $colName, array($mpref=>$pid, $msref=>$sid));
                                        break;
                                    case "sstable":
        				                $result_ck    = $db->select($ref_table, $colName, array($ref_col=>$sid));
                                        break;
                                    case "ddtable":
        				                $result_ck    = $db->select($ref_table, $colName, array($ref_col=>$did));
                                        break;
                                }
				                while( $row_ck = $db->fetch($result_ck) ) {
					                $rows[$colName][$row_ck[$colName]] = true;
				                }
                            break;

			            case "cktext":
				            $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
				            $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];

                            $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
                            switch($colObj["table"]) {
                                case "pptable":
                                    $query_list = "SELECT $ref_table.$colName FROM $ref_table WHERE $ref_table.$ref_col = '" . $pid . "'";  
                                    break;
                                case "mmtable":
                                    $query_list = "SELECT $ref_table.$colName FROM $ref_table WHERE $ref_table.$mpref = '" . $pid . "' AND $ref_table.$msref = '" . $sid . "'";  
                                    break;
                                case "sstable":
                                    $query_list = "SELECT $ref_table.$colName FROM $ref_table WHERE $ref_table.$ref_col = '" . $sid . "'";  
                                    break;
                                case "ddtable":
                                    $query_list = "SELECT $ref_table.$colName FROM $ref_table WHERE $ref_table.$ref_col = '" . $did . "'";  
                                    break;
                            }

                            $result_list = $db->query($query_list);
                            $check_val = array();
                            while( $row_list = $db->fetch($result_list) ) {
                                $check_val[] = $row_list[$colName];                                
                            }
                            $rows[$colName] =  $check_val;
                            if($col["other"]!="") $rows[$col["other"]] = LANG::trans($rows[$col["other"]], $this->dlang);
                            break;

                        case "bool":
        				        $rows[$colName] = $rows[$colName]==1?true:false;
                            break;
						
						case "tablelist":
							$stable = $this->form["schema"]["tablelist"][$colName]["stable"];
							$scol 	= $this->form["schema"]["tablelist"][$colName]["scol"];
							$rtable = $this->form["schema"]["tablelist"][$colName]["rtable"];
							$rcol 	= $this->form["schema"]["tablelist"][$colName]["rcol"];
							$tlCols = $this->getTLCol($colName, "rtable");
							$tlFields 	= implode(",", $tlCols);
							$tlFields  	= WMSEARCH::join(",", "$stable.$scol as sid, $rtable.$rcol as rid, $rtable.$colName", $tlFields);
							$tlquery 	= "SELECT $tlFields FROM $stable LEFT JOIN (SELECT * FROM $rtable WHERE $rcol = '" . $sid . "') $rtable ON ($stable.$scol = $rtable.$colName) WHERE $stable.deleted <> 1 AND $stable.status = 1 ORDER BY $stable.orderno DESC, $stable.created_time DESC";
			                $tlresult 	= $db->query($tlquery);
					        $tlrows0 	= $db->rows( $tlresult );
							$tlrows		= array();
							
							foreach($tlrows0 as $key1=>$tlrow1) {
								$tlrows[$tlrow1["sid"]] = $tlrow1;
							}
							
							
							foreach($tlrows as $key1=>$tlrow) {	
								$tlrows[$key1]["selected"] = $tlrow["rid"]?true:false;
								foreach( $this->form["schema"]["tablelist"][$colName]["cols"] as $key2=>$colObj2 ) {
									switch($colObj2["type"]) {
										case "bool":
											$tlrows[$key1][$colObj2["col"]] = $tlrows[$key1][$colObj2["col"]]==1?true:false; 			
											break;
									}
								}
							}
							$rows["tablelist"][$colName] = $tlrows;
							break;
                    }
		        }

		        foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
			        $this->form["detail"]["cols"][$colName]["error"] 		    = 0;
			        $this->form["detail"]["cols"][$colName]["errorMessage"] 	= "";
		        }
		        // end of checkbox

    		$this->form["detail"]["head"]["state"] 		= "view";
        } else {
    		$this->form["detail"]["head"]["state"] 		= "none";
        }

		$this->form["detail"]["vals"] = count($rows)>0?$rows:null;
		$this->form["detail"]["head"]["error"] 		= 0;
		$this->form["detail"]["head"]["errorMessage"]  = "";
	}

	public function add() {
		$this->form["detail"]["head"]["error"] 	   = 0;
		$this->form["detail"]["head"]["errorMessage"] = "";

        $db = $this->db;

        $pptable    = $this->form["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->form["schema"]["table"]["pptable"]["col"];

        $mmtable    = $this->form["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->form["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->form["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->form["schema"]["table"]["sstable"]["name"];
        $scol       = $this->form["schema"]["table"]["sstable"]["col"];
        $spref       = $this->form["schema"]["table"]["sstable"]["pref"];
        
        $ddtable    = $this->form["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->form["schema"]["table"]["ddtable"]["col"];


        $pid        = $this->form["schema"]["idvals"]["pid"];
        $sid        = $this->form["schema"]["idvals"]["sid"];
        $did        = $sid;

        if($pptable!="" && $pid=="") {
            $this->form["detail"]["head"]["error"]          = 1;
            $this->form["detail"]["head"]["errorMessage"]   = "Please select a record from $pptable first !";
        }

        $ppfields = $this->getRow("pptable");
        $mmfields = $this->getRow("mmtable");
        $ssfields = $this->getRow("sstable");
        $ddfields = $this->getRow("ddtable");

		$tlsfields = $this->getStableRow();
		$tlrfields = $this->getRtableRow();

        if($this->form["detail"]["head"]["error"] < 1) {

            if($pptable!="") {
                // update pptable
                if(count($ppfields)>0) {
                    if($db->hasRow($pptable, array($pcol=>$pid)) ) { 
                        $ppfields["last_updated"] = time();
                        $ppfields["deleted"] = 0;
                        $db->update($pptable, array($pcol=>$pid), $ppfields);
                    } 
                }

                if($mmtable!="") {
                        $ssfields["created_time"] = time();
                        $ssfields["deleted"]      = 0;
                        $sid = $db->insert($sstable, $ssfields);
                        $this->form["schema"]["idvals"]["sid"] = $sid;
                        $did = $sid;

                        $ck_val                     = array();
                        $ck_val["mmtable"][$mpref]  = $pid;
                        $ck_val["mmtable"][$msref]  = $sid;

                        $mmfields[$mpref] = $pid;
                        $mmfields[$msref] = $sid;
                        $db->insert($mmtable, $mmfields);


                } else {
                        $ssfields[$spref] = $pid;
                        $ssfields["created_time"] = time();
                        $ssfields["deleted"]      = 0;
                        $sid = $db->insert($sstable, $ssfields);
                        $this->form["schema"]["idvals"]["sid"] = $sid;
                        $did = $sid;
                }

            } else {
                $ssfields["created_time"] = time();
                $ssfields["deleted"]      = 0;
                $sid = $db->insert($sstable, $ssfields);
                $this->form["schema"]["idvals"]["sid"] = $sid;
                $did = $sid;
            }

            // ddtable 
            if(count($ddfields)>0) {
                if($db->hasRow($ddtable, array($dcol=>$did)) ) { 
                    $ddfields["last_updated"] = time();
                    $ddfields["deleted"]      = 0;
                    $db->update($ddtable, array($dcol=>$did), $ddfields);
                } else {
                        
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
                        $ddfields["created_time"] = time();
                        $ddfields["deleted"]      = 0;
                        $db->insert($ddtable, $ddfields);
                    }
                } 
            } // count>0



            $ck_val             = array();
            $ck_val["pptable"]  = $pid;
            $ck_val["sstable"]  = $sid;
            $ck_val["ddtable"]  = $did;
            $ck_val["mmtable"][$mpref]  = $pid;
            $ck_val["mmtable"][$msref]  = $sid;

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



            // special for treemulti, 				
            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                if( $colObj["type"] == "treemulti") {
		                $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
		                $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];
                        $db->delete($ref_table, array($ref_col=>$sid));						

		                $temp_ck = array();
		                foreach($this->form["detail"]["vals"][$colName] as $key1=>$val1) {
			                if(strtolower($val1)=="true"||$val1===true) {
				                //echo "$key1 + $val1";
				                $temp_ck[$key1] = true;
							    
				                $clist = array();
				                $clist[$ref_col] = $sid;
				                $clist[$colName] = $key1;
				                $db->insert($ref_table, $clist);
			                }
		                }
		                $this->form["detail"]["vals"][$colName] = count($temp_ck)>0?$temp_ck:null;
                } 
            }
            // end of checkbox


            // special for treecheck, 				
            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                switch($colObj["type"]) {
					case "treecheck":
						foreach( $colObj["tree"] as $tcol=>$tcolObj ) {
							$ref_table 	= $tcolObj["table"];
							$ref_col 	= $tcolObj["col"];
							$val_col	= $tcolObj["val"];
							//echo "here $ref_table - $colName - $ref_col - $val_col - $sid\n";

		                    $db->delete($ref_table, array($colName=>$sid));						

							$clist = array();
							$clist[$colName] = $sid;

							foreach($this->form["detail"]["vals"][$colName][$tcol] as $key1=>$ttArray) {
								//echo "key1: $key1\n";
								$clist[$ref_col] = $key1;
								$temp_ck = array();

								foreach($ttArray as $key2=>$val2) {
									//echo "key2: $key2\n";
									if(strtolower($val2)=="true"||$val2===true) {
										$temp_ck[$key2] = true;

										$clist[$val_col] = $key2;
										$db->insert($ref_table, $clist);
									}
								}
								$this->form["detail"]["vals"][$colName][$tcol][$key1] = count($temp_ck)>0?$temp_ck:null;
							}
						}
						break;
					case "treetextbox":
					case "treeselect":
					case "treebool":
					case "treeradio":
						foreach( $colObj["tree"] as $tcol=>$tcolObj ) {
							$ref_table 	= $tcolObj["table"];
							$ref_col 	= $tcolObj["col"];
							$val_col	= $tcolObj["val"];
							//echo "here $ref_table - $colName - $ref_col - $val_col - $sid\n";

		                    $db->delete($ref_table, array($colName=>$sid));						

							$clist = array();
							$clist[$colName] = $sid;

							foreach($this->form["detail"]["vals"][$colName][$tcol] as $key1=>$val1) {
								//echo "key1: $key1\n";
								$clist[$ref_col] = $key1;
								$clist[$val_col] = $val1;
								$db->insert($ref_table, $clist);
							}
						}
						break;
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


        } // error < 1




		if($this->form["detail"]["head"]["error"] < 1) {
            $this->form["detail"]["head"]["state"] = "view";
			$this->form["detail"]["head"]["errorMessage"] = "Added Successful.";
		}
	}

	
	public function save() {
		$this->form["detail"]["head"]["error"] 	   = 0;
		$this->form["detail"]["head"]["errorMessage"] = "";

        $db = $this->db;

        $pptable    = $this->form["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->form["schema"]["table"]["pptable"]["col"];

        $mmtable    = $this->form["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->form["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->form["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->form["schema"]["table"]["sstable"]["name"];
        $scol       = $this->form["schema"]["table"]["sstable"]["col"];
        $spref       = $this->form["schema"]["table"]["sstable"]["pref"];
        
        $ddtable    = $this->form["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->form["schema"]["table"]["ddtable"]["col"];


        $pid        = $this->form["schema"]["idvals"]["pid"];
        $sid        = $this->form["schema"]["idvals"]["sid"];
        $did        = $sid;

        if($pptable!="" && $pid=="") {
            $this->form["detail"]["head"]["error"]          = 1;
            $this->form["detail"]["head"]["errorMessage"]   = "Please select a record from $pptable first !";
        }

        $ppfields = $this->getRow("pptable");
        $mmfields = $this->getRow("mmtable");
        $ssfields = $this->getRow("sstable");
        $ddfields = $this->getRow("ddtable");
		
		$tlsfields = $this->getStableRow();
		$tlrfields = $this->getRtableRow();

        if($this->form["detail"]["head"]["error"] < 1) {
            if(count($ssfields)>0) {
                $ssfields["last_updated"] = time();
                $ssfields["deleted"]      = 0;
                $db->update($sstable, array($scol=>$sid), $ssfields);
            }

            if($pptable!="") {
                // update pptable
                if(count($ppfields)>0) {
                    if($db->hasRow($pptable, array($pcol=>$pid)) ) { 
                        $ppfields["last_updated"] = time();
                        $ppfields["deleted"] = 0;
                        $db->update($pptable, array($pcol=>$pid), $ppfields);
                    } 
                }

                if($mmtable!="") {
                    if(count($mmfields)>0) { 
                        $ck_val                     = array();
                        $ck_val["mmtable"][$mpref]  = $pid;
                        $ck_val["mmtable"][$msref]  = $sid;
                        if($db->hasRow($mmtable, $ck_val["mmtable"]) ) { 
                            $db->update($mmtable, $ck_val["mmtable"], $mmfields);
                        } else {
                            // clear mmtable fields  if relation ship not exists,  we don't insert to create relationship
                            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
           		                $colObj["table"] = $colObj["table"]!=""?$colObj["table"] : "sstable";

                                if($colObj["table"] == "mmtable") {
                                    switch($colObj["type"]) {
                                        case "checkbox":
		                                    $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
		                                    $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];
                                            $db->delete( $ref_table, $ck_val[$colObj["table"]]);						
                                            break;
                                        default: 
                                            $this->form["detail"]["vals"][$colName] = "";
                                            break;
                                    }
                                }
                            }  // foreach
                        } 
                    }
                } // mmtable!=""
            } // pptable!=""

            // ddtable 
            if(count($ddfields)>0) {
                if($db->hasRow($ddtable, array($dcol=>$did)) ) { 
                    $ddfields["last_updated"] = time();
                    $ddfields["deleted"]      = 0;
                    $db->update($ddtable, array($dcol=>$did), $ddfields);
                } else {
                        
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
                        $ddfields["created_time"] = time();
                        $ddfields["deleted"]      = 0;
                        $db->insert($ddtable, $ddfields);
                    }
                } 
            } // count>0



            $ck_val             = array();
            $ck_val["pptable"]  = $pid;
            $ck_val["sstable"]  = $sid;
            $ck_val["ddtable"]  = $did;
            $ck_val["mmtable"][$mpref]  = $pid;
            $ck_val["mmtable"][$msref]  = $sid;

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

            // special for treemulti, 				
            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                if( $colObj["type"] == "treemulti") {
		                $ref_table 	= $this->form["schema"]["checklist"][$colName]["rtable"];
		                $ref_col 	= $this->form["schema"]["checklist"][$colName]["rcol"];
                        $db->delete($ref_table, array($ref_col=>$sid));						

		                $temp_ck = array();
		                foreach($this->form["detail"]["vals"][$colName] as $key1=>$val1) {
			                if(strtolower($val1)=="true"||$val1===true) {
				                //echo "$key1 + $val1";
				                $temp_ck[$key1] = true;
							    
				                $clist = array();
				                $clist[$ref_col] = $sid;
				                $clist[$colName] = $key1;
				                $db->insert($ref_table, $clist);
			                }
		                }
		                $this->form["detail"]["vals"][$colName] = count($temp_ck)>0?$temp_ck:null;
                } 
            }
            // end of checkbox


            // special for treecheck, 				
            foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
                switch($colObj["type"]) {
					case "treecheck":
						foreach( $colObj["tree"] as $tcol=>$tcolObj ) {
							$ref_table 	= $tcolObj["table"];
							$ref_col 	= $tcolObj["col"];
							$val_col	= $tcolObj["val"];
							//echo "here $ref_table - $colName - $ref_col - $val_col - $sid\n";

		                    $db->delete($ref_table, array($colName=>$sid));						

							$clist = array();
							$clist[$colName] = $sid;

							foreach($this->form["detail"]["vals"][$colName][$tcol] as $key1=>$ttArray) {
								//echo "key1: $key1\n";
								$clist[$ref_col] = $key1;
								$temp_ck = array();

								foreach($ttArray as $key2=>$val2) {
									//echo "key2: $key2\n";
									if(strtolower($val2)=="true"||$val2===true) {
										$temp_ck[$key2] = true;

										$clist[$val_col] = $key2;
										$db->insert($ref_table, $clist);
									}
								}
								$this->form["detail"]["vals"][$colName][$tcol][$key1] = count($temp_ck)>0?$temp_ck:null;
							}
						}
						break;
					case "treetextbox":
					case "treeselect":
					case "treebool":
					case "treeradio":
						foreach( $colObj["tree"] as $tcol=>$tcolObj ) {
							$ref_table 	= $tcolObj["table"];
							$ref_col 	= $tcolObj["col"];
							$val_col	= $tcolObj["val"];
							//echo "here $ref_table - $colName - $ref_col - $val_col - $sid\n";

		                    $db->delete($ref_table, array($colName=>$sid));						

							$clist = array();
							$clist[$colName] = $sid;

							foreach($this->form["detail"]["vals"][$colName][$tcol] as $key1=>$val1) {
								//echo "key1: $key1\n";
								$clist[$ref_col] = $key1;
								$clist[$val_col] = $val1;
								$db->insert($ref_table, $clist);
							}
						}
						break;
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
        }

		if($this->form["detail"]["head"]["error"] < 1) {
            $this->form["detail"]["head"]["state"] = "view";
			$this->form["detail"]["head"]["errorMessage"] = "Save Successful.";
		}
	}

	public function delete() {
		$db = $this->db;

        $pptable    = $this->form["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->form["schema"]["table"]["pptable"]["col"];

        $mmtable    = $this->form["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->form["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->form["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->form["schema"]["table"]["sstable"]["name"];
        $scol       = $this->form["schema"]["table"]["sstable"]["col"];
        $spref       = $this->form["schema"]["table"]["sstable"]["pref"];
        
        $ddtable    = $this->form["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->form["schema"]["table"]["ddtable"]["col"];


        $pid        = $this->form["schema"]["idvals"]["pid"];
        $sid        = $this->form["schema"]["idvals"]["sid"];
        $did        = $sid;

   	    $db->detach($sstable, array($scol=>$sid));
  	    if($mmtable!="") $db->delete($mmtable, array($mpref=>$pid, $msref=>$sid));
        if($ddtable!="") $db->detach($ddtable, array($dcol=>$sid));
	
		$this->form["detail"]["head"]["state"] 	        = "none";
		$this->form["detail"]["vals"]                   = null;
		$this->form["detail"]["head"]["error"] 		    = 0;
		$this->form["detail"]["head"]["errorMessage"]      = "";
		foreach( $this->form["detail"]["cols"] as $colName=>$colObj ) {
			$this->form["detail"]["cols"][$colName]["error"]           = 0;
			$this->form["detail"]["cols"][$colName]["errorMessage"]    = "";
		}

   		if($this->form["detail"]["head"]["error"] < 1) {
			$this->form["detail"]["head"]["errorMessage"] = "Delete Successful.";
		}
	}
        
	private function getCol($table_arr) {
	    $temp = array();
        foreach($this->form["detail"]["cols"] as $colName=>$colObj) {
            if( $colObj["type"] == "treemulti" || $colObj["type"] == "treesingle" ) $colObj["table"] = "sstable";
            $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
            $table = $this->form["schema"]["table"][$colObj["table"]]["name"];

            switch($colObj["type"]) {
                case "password":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table.$colName";
                        $temp[] = "$table.$colName as $colName" . "_confirm";
                    }
                    break;
	            case "hidden":
	            case "text":
                case "treesingle":
                case "select":
                case "seal":
                case "date":
                case "time":
                case "time1":
                case "timezone":
                case "intdate":
                case "textbox":
                case "textarea":
                case "bool":
                    if( in_array($colObj["table"], $table_arr) ) $temp[] = "$table.$colName";
					break;
                case "dateymd":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_yy";  
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_mm";  
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_dd";  
                    } 
                    break;
                case "timehi":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table." . str_replace("_hi","", $colName) . "_hh";  
                        $temp[] = "$table." . str_replace("_hi","", $colName) . "_ii";  
                    } 
                    break;
                case "ymdtext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_yy";  
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_mm";  
                        $temp[] = "$table." . str_replace("_ymd","", $colName) . "_dd";  
                    } 
                    break;
                case "hitext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table." . str_replace("_hi","", $colName) . "_hh";  
                        $temp[] = "$table." . str_replace("_hi","", $colName) . "_ii";  
                    } 
                    break;
                case "ymdhitext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table." . $colName . "_yy";  
                        $temp[] = "$table." . $colName . "_mm";  
                        $temp[] = "$table." . $colName . "_dd";  
                        $temp[] = "$table." . $colName . "_hh";  
                        $temp[] = "$table." . $colName . "_ii";  
                    } 
                    break;
                case "datetimetext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$table." . $colName . "_date";  
                        $temp[] = "$table." . $colName . "_time";  
                    } 
                    break;
	            case "vtext":
                case "radio":  // cover radiocom, radiolist, radiodiag
                    if( in_array($colObj["table"], $table_arr) ) $temp[] = "$table.$colName";
                    if( in_array($colObj["table"], $table_arr) ) {
                        if( $colObj["other"]!="") $temp[] = $table . "." . $colObj["other"];  
                    } 
                    break;

	           case "cktext":
               case "checkbox": // cover checkcom, checklist, checkdiag
                    if( in_array($colObj["table"], $table_arr) ) {
                        if( $colObj["other"]!="") $temp[] = $table . "." . $colObj["other"];  
                    } 
                    break;

    		}
		}
		return $temp;
	}

	private function getColTT($table_arr) {
	    $temp = array();
        foreach($this->form["detail"]["cols"] as $colName=>$colObj) {
            if( $colObj["type"] == "treemulti" || $colObj["type"] == "treesingle" ) $colObj["table"] = "sstable";
            $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:"sstable";
            $table = $this->form["schema"]["table"][$colObj["table"]]["name"];

            switch($colObj["type"]) {
                case "password":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = "$colName";                        
                        $temp[] = "$colName as $colName as $colName" . "_confirm";                        
                    }
					break;
	            case "hidden":
	            case "text":
                case "treesingle":
                case "select":
                case "seal":
                case "date":
                case "time":
                case "time1":
                case "timezone":
                case "intdate":
                case "textbox":
                case "textarea":
                case "bool":
                    if( in_array($colObj["table"], $table_arr) ) $temp[] = "$colName";
					break;
                case "dateymd":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = str_replace("_ymd","", $colName) . "_yy";  
                        $temp[] = str_replace("_ymd","", $colName) . "_mm";  
                        $temp[] = str_replace("_ymd","", $colName) . "_dd";  
                    } 
                    break;
                case "timehi":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = str_replace("_hi","", $colName) . "_hh";  
                        $temp[] = str_replace("_hi","", $colName) . "_ii";  
                    } 
                    break;
                case "ymdtext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = str_replace("_ymd","", $colName) . "_yy";  
                        $temp[] = str_replace("_ymd","", $colName) . "_mm";  
                        $temp[] = str_replace("_ymd","", $colName) . "_dd";  
                    } 
                    break;
                case "hitext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = str_replace("_hi","", $colName) . "_hh";  
                        $temp[] = str_replace("_hi","", $colName) . "_ii";  
                    } 
                    break;
                case "ymdhitext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = $colName . "_yy";  
                        $temp[] = $colName . "_mm";  
                        $temp[] = $colName . "_dd";  
                        $temp[] = $colName . "_hh";  
                        $temp[] = $colName . "_ii";  
                    } 
                    break;
                case "datetimetext":
                    if( in_array($colObj["table"], $table_arr) ) {
                        $temp[] = $colName . "_date";  
                        $temp[] = $colName . "_time";  
                    } 
                    break;
	            case "vtext":
                case "radio":  // cover radiocom, radiolist, radiodiag
                    if( in_array($colObj["table"], $table_arr) ) $temp[] = "$colName";
                    if( in_array($colObj["table"], $table_arr) ) {
                        if( $colObj["other"]!="") $temp[] = $colObj["other"];  
                    } 
                    break;

	            case "cktext":
                case "checkbox":  // cover radiocom, radiolist, radiodiag
                     
                    if( in_array($colObj["table"], $table_arr) ) {
                        if( $colObj["other"]!="") $temp[] = $colObj["other"];  
                    }
                    break;

			}
		}
		return $temp;
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
						
											if(strtoupper($tObj["pattern"]) == "NUMBER" && $tVal=="") $this->form["listTables"]["tablelist"][$colName][$lkey][$tCol]="0";
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
		    if($colObj["nosync"]=="1" && $colObj["changed"]=="0") continue; 
            
            // form pptable conflict with tree pptable,  treeradio always using form sstable
            if( $colObj["type"] == "treemulti" || $colObj["type"] == "treersingle" ) $colObj["table"] = "sstable";

            $colObj["table"] = $colObj["table"]!=""?$colObj["table"] : "sstable";
            if( $tttt != $colObj["table"] ) continue; 

            $this->form["detail"]["cols"][$colName]["error"] = 0;
			$this->form["detail"]["cols"][$colName]["errorMessage"] = "";
			$this->form["detail"]["vals"][$colName] = str_replace(array("undefined", "null"), array("",""), $this->form["detail"]["vals"][$colName]);
            
            $len = mb_strlen($this->form["detail"]["vals"][$colName]);
			//echo "$colName: " . $this->form["detail"][$colName] . " len: $len " . $colObj["required"].  "\n";
            switch($colObj["type"]) {
                case "vtext":
                case "radio":
                    if( ($len <=0 && $colObj["required"]=="1") || intval($this->form["detail"]["vals"][$colName]) == 0 ) {
                        if($colObj["other"]!="" && $this->form["detail"]["vals"][$colObj["other"]]==""){
							$errMsg = "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
							$this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . $errMsg;
						    $this->form["detail"]["head"]["error"] = 1;
						    $this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
                        } else if(!$colObj["other"]) {
							$errMsg = "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
							$this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . $errMsg;
						    $this->form["detail"]["head"]["error"] = 1;
						    $this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
						}
                    }
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "  required:" . $col["required"]. "\n"; 
                    $temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0";
                    if($colObj["other"]!="") $temp[$colObj["other"]] = LANG::trans($this->form["detail"]["vals"][$colObj["other"]], $this->dlang);
                    break;
                case "treesingle":
                case "select":
                    if( ($len <=0 && $colObj["required"]=="1") || $this->form["detail"]["vals"][$colName] == "0" ) {
						$errMsg = "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
	                    $this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . $errMsg;
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
                    }
                    //echo "colName:" . $colName .  "  isSet:" . isset($row[$colName]) . " value:" . $row[$colName] . "  required:" . $col["required"]. "\n"; 
                    $temp[$colName] = $this->form["detail"]["vals"][$colName]?$this->form["detail"]["vals"][$colName]:"0";
                    break;
                case "password":
                     if(preg_match("/_confirm$/", $colName)) continue;
                     if($this->form["detail"]["vals"][$colName]!= $this->form["detail"]["vals"][$colName . "_confirm"]) {
							$errMsg =  "'" .($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' ". LANG::words("do_not_match", $lang);
	                        $this->form["detail"]["cols"][$colName]["error"] = 1;
                            $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . $errMsg;
	                        $this->form["detail"]["cols"][$colName . "_confirm"]["error"] = 1;
                            $this->form["detail"]["cols"][$colName . "_confirm"]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . $errMsg;
						    $this->form["detail"]["head"]["error"] = 1;
						    $this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
                     }
                case "hidden":
                case "textbox":
                case "textarea":
                    if($len <=0 && $colObj["required"]=="1" ) {
						$errMsg =  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("required_col", $lang);
						$this->form["detail"]["cols"][$colName]["error"] = 1;
                        $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") . $errMsg; 
						$this->form["detail"]["head"]["error"] = 1;
						$this->form["detail"]["head"]["errorMessage"] .=  ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . $errMsg;
                    }
                    
					if($len > 0 && $this->form["detail"]["cols"][$colName]["min"]!="") {
						if(floatval($this->form["detail"]["vals"][$colName]) < floatval($this->form["detail"]["cols"][$colName]["min"])) {
							$this->form["detail"]["cols"][$colName]["error"] = 1;
							$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
							$this->form["detail"]["head"]["error"]		= 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
						}
					}

					if($len > 0 && $this->form["detail"]["cols"][$colName]["max"]!="") {
						if(floatval($this->form["detail"]["vals"][$colName]) > floatval($this->form["detail"]["cols"][$colName]["max"])) {
							$this->form["detail"]["cols"][$colName]["error"] = 1;
							$this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["detail"]["cols"][$colName]["errorMessage"]==""?"":"\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'(" . floatval($this->form["detail"]["vals"][$colName]) . ") " . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
							$this->form["detail"]["head"]["error"]		= 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "'(" . floatval($this->form["detail"]["vals"][$colName]) . ") " . LANG::words("out_of_range", $lang, $colObj["min"], $colObj["max"]);
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
                                $this->form["detail"]["cols"][$colName]["errorMessage"] .= ($this->form["cols"][$colName]["errorMessage"]==""?"": "\n") .  "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, $valtype);
							    $this->form["detail"]["head"]["error"] = 1;
							    $this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, $valtype);
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
							$this->form["detail"]["head"]["error"] = 1;
							$this->form["detail"]["head"]["errorMessage"] .= ($this->form["detail"]["head"]["errorMessage"]==""?"":"\n") . "'" . ($colObj["title"]?$colObj["title"]: ucwords($colName) ) . "' " . LANG::words("invalid_type", $lang, "DATE");
                        }        
                    } 

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

                    $colymd = str_replace("_ymd","", $colName);
                    $temp[$colymd . "_yy"] = $this->form["detail"]["vals"][$colName . "_yy"]?$this->form["detail"]["vals"][$colName . "_yy"]:0;
                    $temp[$colymd . "_mm"] = $this->form["detail"]["vals"][$colName . "_mm"]?$this->form["detail"]["vals"][$colName . "_mm"]:0;
                    $temp[$colymd . "_dd"] = $this->form["detail"]["vals"][$colName . "_dd"]?$this->form["detail"]["vals"][$colName . "_dd"]:0;
                    break;
                            

                case "timehi":
                    $timehi = substr("0". trim($this->form["detail"]["vals"][$colName . "_hh"]), -2) . ":" . substr("0" . trim($this->form["detail"]["vals"][$colName . "_ii"]), -2); 

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
                
                case "cktext":  // must filter undder
				case "treemulti":  // must filter undder
				case "checkbox":  // must filter undder , cover checkcom, checklist, checkdiag
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

    private function checklist() {
    	$this->form["listTables"]["checklist"]  = WMSEARCH::checklist($this->db,  $this->form["detail"]["head"]["lang"], $this->form["schema"]["checklist"]);
    }

    private function checkVlist() {
        $this->form["listTables"]["vlist"]      = WMSEARCH::checkVlist($this->db, $this->form["detail"]["head"]["lang"], $this->form["schema"]["checklist"]);
    }

    private function checkClist() {
        $this->form["listTables"]["clist"]      = WMSEARCH::checkClist($this->db, $this->form["detail"]["head"]["lang"], $this->form["schema"]["checklist"]);
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
