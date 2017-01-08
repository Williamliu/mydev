<?php
class WMLIUTREEVIEW {
	public $tree;
    public $result;
	private $dlang;
    public function __construct($db, $tree, $dlang) {
        $this->tree             = $tree;
		$this->db 		        = $db;
		$this->dlang			= $dlang;
		$this->tree["schema"]["head"]["lang"] = $tree["schema"]["head"]["lang"]?$tree["schema"]["head"]["lang"]:$this->dlang;
		$this->action();
	}

    
	private function action() {
    	$this->tree["schema"]["head"]["loading"] 	= 0;

		switch($this->tree["schema"]["head"]["action"]) {
            case "init":
                $this->checklist();
                $this->checkVlist();

                $this->tree["schema"]["head"]["error"]          = 0;    
                $this->tree["schema"]["head"]["errorMessage"]   = "";            

                $this->result["schema"]["head"]         = $this->tree["schema"]["head"];
                $this->result["listTables"]   			= $this->tree["listTables"];
                break;
            case "fresh":
                $this->checklist();
                $this->checkVlist();
				$this->load();

                $this->result["schema"]["head"]         = $this->tree["schema"]["head"];
                $this->result["listTables"]   			= $this->tree["listTables"];
                $this->result["nodes"]                  = $this->tree["nodes"];
                break;
                		
        	case "load":
				$this->load();
                $this->result["schema"]["head"]         = $this->tree["schema"]["head"];
                $this->result["nodes"]                  = $this->tree["nodes"];
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

	public function load() {
        $this->tree["nodes"] = $this->getNodes($this->tree["schema"]["idvals"]["rootid"]);
        $this->tree["schema"]["head"]["error"]          = 0;    
        $this->tree["schema"]["head"]["errorMessage"]   = "";            
	}

    private function getNodes($rootid) {
        $db     = $this->db;
        $lang   = $this->tree["schema"]["head"]["lang"];
        $slang  = $lang; 
        if( $this->tree["schema"]["head"]["lang"] == "tw" )  $lang = "cn";
        if( $this->tree["schema"]["head"]["lang"] == "hk" )  $lang = "cn";
      
        $pptable    = $this->tree["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->tree["schema"]["table"]["pptable"]["col"];
        $pref       = $this->tree["schema"]["table"]["pptable"]["pref"];
        
        $ppcriteria = "";
        if($pref=="") {
            if($rootid=="" || $rootid == 0 || $rootid == "0") 
                $ppcriteria = " 1 = 1 ";
            else 
                $ppcriteria = " 1 = 0 ";

        } else {
           $ppcriteria = "$pref='" . $rootid . "'";
        }
        $ppcriteria = ($ppcriteria==""?"":" AND ") . $ppcriteria;    

        $ppfields     = array();
		$ppfields     =  $this->getCol($this->tree["schema"]["cols"], "pptable");
        $field_pp  = implode(",", $ppfields);
        $field_pp  = WMSEARCH::join(",", "$pptable.$pcol as nodeid",      $field_pp);
        $field_pp  = WMSEARCH::join(",", "$pptable.$pref as parentid",    $field_pp);
        $field_pp  = WMSEARCH::join(",", "'pptable' as nodetable",        $field_pp);
        $field_pp  = WMSEARCH::join(",", "'nodes' as type",   $field_pp);
        $field_pp  = WMSEARCH::join(",", "0 as nodestate",    $field_pp);
        $field_pp  = WMSEARCH::join(",", "0 as error",        $field_pp);
        $field_pp  = WMSEARCH::join(",", "'' as errorMessage",$field_pp);
        
        $ppquery    = "SELECT $field_pp FROM $pptable WHERE deleted <> 1 $ppcriteria ORDER BY orderno DESC";
        //debug info
        $this->tree["schema"]["head"]["query"] = $ppquery;
        
        $ppresult   = $db->query($ppquery);
        $ppnodes    = $db->rows($ppresult);
        // ppnodes
        foreach($ppnodes as $pkey=>$pnode) {
            $ppnodes[$pkey] 				= $this->nodeValue($ppnodes[$pkey]);
            $ppnodes[$pkey]["nodes"] 		= $this->getNodes($pnode["nodeid"]);

            // tttable
             $tttable    = $this->tree["schema"]["table"]["tttable"]["name"];
             $tcol       = $this->tree["schema"]["table"]["tttable"]["col"];
             $tpref      = $this->tree["schema"]["table"]["tttable"]["pref"];
            if($tttable!="") {
                // tttable !=""
                $ttfields     = array();
		        $ttfields     =  $this->getCol($this->tree["schema"]["cols"], "tttable");
                $field_tt  = implode(",", $ttfields);
                $field_tt  = WMSEARCH::join(",", "$tttable.$tcol as nodeid",                  $field_tt);
                $field_tt  = WMSEARCH::join(",", "'" . $pnode["nodeid"] . "' as parentid",    $field_tt);
                $field_tt  = WMSEARCH::join(",", "'tttable' as nodetable",                    $field_tt);
                $field_tt  = WMSEARCH::join(",", "'nodes' as type",   $field_tt);
                $field_tt  = WMSEARCH::join(",", "0 as nodestate",    $field_tt);
                $field_tt  = WMSEARCH::join(",", "0 as error",        $field_tt);
                $field_tt  = WMSEARCH::join(",", "'' as errorMessage",$field_tt);

                $nntable    = $this->tree["schema"]["table"]["nntable"]["name"];
                $npref      = $this->tree["schema"]["table"]["nntable"]["pref"];
                $ntref      = $this->tree["schema"]["table"]["nntable"]["tref"];
                if($nntable!="") {
                    $ttquery  = "SELECT $field_tt FROM $nntable INNER JOIN $tttable ON ($nntable.$ntref = $tttable.$tcol AND $nntable.$npref = '" . $pnode["nodeid"] . "') WHERE $tttable.deleted <> 1 ORDER BY orderno DESC";
                } else {
                    $ttquery  = "SELECT $field_tt FROM $tttable WHERE $tttable.deleted <> 1 AND $tttable.$tpref = '" . $pnode["nodeid"]  . "' ORDER BY orderno DESC";
                }
                $ttresult   = $db->query($ttquery);
                $ttnodes      = $db->rows($ttresult);

                foreach($ttnodes as $tkey=>$tnode) {
                    $ttnodes[$tkey] = $this->nodeValue($ttnodes[$tkey]);

                    // sstable
                    $sstable    = $this->tree["schema"]["table"]["sstable"]["name"];
                    $scol       = $this->tree["schema"]["table"]["sstable"]["col"];
                    $spref      = $this->tree["schema"]["table"]["sstable"]["pref"];
                    $stref      = $this->tree["schema"]["table"]["sstable"]["tref"];

                    $ddtable    = $this->tree["schema"]["table"]["ddtable"]["name"];
                    $dcol       = $this->tree["schema"]["table"]["ddtable"]["col"];
                    $ddjoin     = "";
                    if($ddtable!="" && $dcol != "") $ddjoin = " LEFT JOIN $ddtable ON ($sstable.$scol = $ddtable.$dcol) ";
                    if($sstable!="") {
                        // sstable != ""
                        $ssfields  = array();
		                $ssfields  =  $this->getCol($this->tree["schema"]["cols"], "sstable");
                        $field_ss  = implode(",", $ssfields);
                        $field_ss  = WMSEARCH::join(",", "$sstable.$scol as nodeid",                  $field_ss);
                        
                        if($nntable!="") 
                            $field_ss  = WMSEARCH::join(",", "'" . $pnode["nodeid"] . "' as grandid",    $field_ss);

                        $field_ss  = WMSEARCH::join(",", "'" . $tnode["nodeid"] . "' as parentid",    $field_ss);
                        $field_ss  = WMSEARCH::join(",", "'sstable' as nodetable",                    $field_ss);
                        $field_ss  = WMSEARCH::join(",", "'node' as type",    $field_ss);
                        $field_ss  = WMSEARCH::join(",", "0 as nodestate",    $field_ss);
                        $field_ss  = WMSEARCH::join(",", "0 as error",        $field_ss);
                        $field_ss  = WMSEARCH::join(",", "'' as errorMessage",$field_ss);

                        $mmtable    = $this->tree["schema"]["table"]["mmtable"]["name"];
                        $mpref      = $this->tree["schema"]["table"]["mmtable"]["pref"];
                        $msref      = $this->tree["schema"]["table"]["mmtable"]["sref"];
                        $mtref      = $this->tree["schema"]["table"]["mmtable"]["tref"];
                        if($mmtable!="") {
                            if($nntable!="")
                                $ssquery  = "SELECT $field_ss FROM $mmtable INNER JOIN $sstable ON ($mmtable.$msref = $sstable.$scol AND $mmtable.$mpref = '" . $pnode["nodeid"] . "' AND $mmtable.$mtref = '" . $tnode["nodeid"] . "') $ddjoin WHERE $sstable.deleted <> 1 ORDER BY $sstable.orderno DESC";
                            else
                                $ssquery  = "SELECT $field_ss FROM $mmtable INNER JOIN $sstable ON ($mmtable.$msref = $sstable.$scol AND $mmtable.$mtref = '" . $tnode["nodeid"] . "') $ddjoin WHERE $sstable.deleted <> 1 ORDER BY $sstable.orderno DESC";
                             
                        } else {
                            $ssquery  = "SELECT $field_ss FROM $sstable $ddjoin WHERE $sstable.deleted <> 1 AND $sstable.$stref = '" . $tnode["nodeid"] . "' ORDER BY $sstable.orderno DESC";
                        } 
                        $ssresult       = $db->query($ssquery);
                        $ssnodes        = $db->rows($ssresult);

                        foreach($ssnodes as $skey=>$snode) {
                            $ssnodes[$skey] = $this->nodeValue($ssnodes[$skey]);
                            $ttnodes[$tkey]["nodes"][] = $ssnodes[$skey];                         
                        }
	                    $ttnodes[$tkey]["nodecount"] = count($ttnodes[$tkey]["nodes"]);                         
                    } 
                    // end sstable
	                $ppnodes[$pkey]["nodes"][] = $ttnodes[$tkey];
                }
            } else {
                // tttable == ""
                // sstable
                $sstable    = $this->tree["schema"]["table"]["sstable"]["name"];
                $scol       = $this->tree["schema"]["table"]["sstable"]["col"];
                $spref      = $this->tree["schema"]["table"]["sstable"]["pref"];
                $stref      = $this->tree["schema"]["table"]["sstable"]["tref"];

                $ddtable    = $this->tree["schema"]["table"]["ddtable"]["name"];
                $dcol       = $this->tree["schema"]["table"]["ddtable"]["col"];
                $ddjoin     = "";
                if($ddtable!="" && $dcol != "") $ddjoin = " LEFT JOIN $ddtable ON ($sstable.$scol = $ddtable.$dcol) ";
                if($sstable!="") {
                    // sstable != ""
                    $ssfields  = array();
		            $ssfields  =  $this->getCol($this->tree["schema"]["cols"], "sstable");
                    $field_ss  = implode(",", $ssfields);
                    $field_ss  = WMSEARCH::join(",", "$sstable.$scol as nodeid",                  $field_ss);
                    $field_ss  = WMSEARCH::join(",", "'" . $pnode["nodeid"] . "' as parentid",    $field_ss);
                    $field_ss  = WMSEARCH::join(",", "'sstable' as nodetable",                    $field_ss);
                    $field_ss  = WMSEARCH::join(",", "'node' as type",    $field_ss);
                    $field_ss  = WMSEARCH::join(",", "0 as nodestate",    $field_ss);
                    $field_ss  = WMSEARCH::join(",", "0 as error",        $field_ss);
                    $field_ss  = WMSEARCH::join(",", "'' as errorMessage",$field_ss);

                    $mmtable    = $this->tree["schema"]["table"]["mmtable"]["name"];
                    $mpref      = $this->tree["schema"]["table"]["mmtable"]["pref"];
                    $msref      = $this->tree["schema"]["table"]["mmtable"]["sref"];
                    $mtref      = $this->tree["schema"]["table"]["mmtable"]["tref"];
                    if($mmtable!="") {
                        $ssquery  = "SELECT $field_ss FROM $mmtable INNER JOIN $sstable ON ($mmtable.$msref = $sstable.$scol AND $mmtable.$mpref = '" . $pnode["nodeid"] . "') $ddjoin WHERE $sstable.deleted <> 1 ORDER BY $sstable.orderno DESC";
                    } else {
                        $ssquery  = "SELECT $field_ss FROM $sstable $ddjoin WHERE $sstable.deleted <> 1 AND $sstable.$spref = '" . $pnode["nodeid"] . "' ORDER BY $sstable.orderno DESC";
                    } 
                    $ssresult       = $db->query($ssquery);
                    $ssnodes        = $db->rows($ssresult);

                    foreach($ssnodes as $skey=>$snode) {
                        $ssnodes[$skey] = $this->nodeValue($ssnodes[$skey]);
                        $ppnodes[$pkey]["nodes"][] = $ssnodes[$skey];                         
                    }
					$ppnodes[$pkey]["nodecount"] = count($ppnodes[$pkey]["nodes"]);
                } 
                // end sstable

            }
            //end tttable

            $ppnodes[$pkey]["nodecount"] 	= count($ppnodes[$pkey]["nodes"]);
        }
        // end ppnodes
        return $ppnodes;
    }


    public function nodeValue($theNode) {
        // only update editable cols
        $pptable   = $this->tree["schema"]["table"]["pptable"]["name"];
        $pcol      = $this->tree["schema"]["table"]["pptable"]["col"];
        $pref      = $this->tree["schema"]["table"]["pptable"]["pref"];

        $nntable    = $this->tree["schema"]["table"]["nntable"]["name"];
        $npref      = $this->tree["schema"]["table"]["nntable"]["pref"];
        $ntref      = $this->tree["schema"]["table"]["nntable"]["tref"];
        

        $tttable    = $this->tree["schema"]["table"]["tttable"]["name"];
        $tcol       = $this->tree["schema"]["table"]["tttable"]["col"];
        $tpref      = $this->tree["schema"]["table"]["tttable"]["pref"];

        $mmtable    = $this->tree["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->tree["schema"]["table"]["mmtable"]["pref"];
        $mtref      = $this->tree["schema"]["table"]["mmtable"]["tref"];
        $msref      = $this->tree["schema"]["table"]["mmtable"]["sref"];


        $sstable    = $this->tree["schema"]["table"]["sstable"]["name"];
        $scol       = $this->tree["schema"]["table"]["sstable"]["col"];
        $spref      = $this->tree["schema"]["table"]["sstable"]["pref"];
        $stref      = $this->tree["schema"]["table"]["sstable"]["tref"];

        $ddtable    = $this->tree["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->tree["schema"]["table"]["ddtable"]["col"];



        $lang   = $this->tree["schema"]["head"]["lang"];
        $slang  = $lang; 
        if( $this->tree["schema"]["head"]["lang"] == "tw" )  $lang = "cn";
        if( $this->tree["schema"]["head"]["lang"] == "hk" )  $lang = "cn";

        foreach($this->tree["schema"]["cols"][$theNode["nodetable"]] as $colObj) {
            $colName = $colObj["col"];
            $colType = $colObj["type"];
            switch($colType) {
                case "hidden":
                case "text":
                    $theNode[$colName] = LANG::trans($theNode[$colName], $slang);
                    break;
                case "radio":
                case "radiocom":
                case "select":
                    break;

                case "actradio":
                case "actbox":
                    $ref_table 	= $this->tree["schema"]["checklist"][$colName]["atable"];
                    $ref_col 	= $this->tree["schema"]["checklist"][$colName]["acol"];

                    $nodeCCC = array();
                    $nodeCCC[$ref_col] = $theNode["nodeid"];

                    if($colObj["table"]=="nntable") {
                        $nodeCCC = array();
                        $nodeCCC[$npref] = $theNode["parentid"];     
                        $nodeCCC[$ntref] = $theNode["nodeid"];     
                    } 
                    if($colObj["table"]=="mmtable") {
                        $nodeCCC = array();
                        if($nntable!="") {
                            $nodeCCC[$mpref] = $theNode["grandid"];     
                            $nodeCCC[$mtref] = $theNode["parentid"];     
                            $nodeCCC[$msref] = $theNode["nodeid"];     
                        } else if($tttable!=""){
                            $nodeCCC[$mtref] = $theNode["parentid"];     
                            $nodeCCC[$msref] = $theNode["nodeid"];     
                        } else {
                            $nodeCCC[$mpref] = $theNode["parentid"];     
                            $nodeCCC[$msref] = $theNode["nodeid"];     
                        }
                    }

		            
                    $result_list =  $this->db->select($ref_table, $colName, $nodeCCC);

                    $check_val = array();
                    while( $row_list =  $this->db->fetch($result_list) ) {
                        $check_val[$row_list[$colName]] = true;                                
                    }
                    $theNode["actbox"][$colName] = count($check_val)>0?$check_val:null;
                
                    //break;
                    // don't break ,  after actbox , it still get checkbox value
                case "checkcom":
                case "checkbox":
                    break;
                case "bool":
                    break;
                default:
                    break;
            }
        }
        return $theNode;
        
    }

    private function checklist() {
    	$this->tree["listTables"]["checklist"]  = WMSEARCH::checklist($this->db,  $this->tree["schema"]["head"]["lang"], $this->tree["schema"]["checklist"]);
    }

    private function checkVlist() {
        $this->tree["listTables"]["vlist"]      = WMSEARCH::checkVlist($this->db, $this->tree["schema"]["head"]["lang"], $this->tree["schema"]["checklist"]);
    }

	private function getCol($cols, $tableName) {
	    $temp = array();
        foreach($cols[$tableName] as $key=>$colObj) {
            $colObj["table"]=$colObj["table"]?$colObj["table"]:$tableName;
            $table = $this->tree["schema"]["table"][$colObj["table"]]["name"];
            switch($colObj["type"]) {
	            case "hidden":
                case "select":
                case "textbox":
                case "bool":
                case "text":
					$temp[] = "$table." . $colObj["col"];
					break;
               //case "radio":
               //case "radiocom":
					$temp[] = "$table." . $colObj["col"];
                    if($colObj["other"]!="") 
    					$temp[] = "$table." . $colObj["other"];
                    break;
               case "checkbox":
               case "checkcom":
                    if($colObj["other"]!="") 
    					$temp[] = "$table." . $colObj["other"];
                    break;
                    
			}
		}
		return $temp;
	}
}
?>
