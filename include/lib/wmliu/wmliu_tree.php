<?php
class WMLIUTREE {
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
                $this->result["listTables"]  			= $this->tree["listTables"];
                break;
            case "fresh":
                $this->checklist();
                $this->checkVlist();
				$this->load();

                $this->result["schema"]["head"]         = $this->tree["schema"]["head"];
                $this->result["listTables"]   = $this->tree["listTables"];
                $this->result["nodes"]                  = $this->tree["nodes"];
                break;
                		
        	case "load":
				$this->load();
                $this->result["schema"]["head"]         = $this->tree["schema"]["head"];
                $this->result["nodes"]                  = $this->tree["nodes"];
				break;
			case "save":
                $this->save();
                $this->result["schema"]["head"]        = $this->tree["schema"]["head"];
                $this->result["node"]                  = $this->tree["node"];
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
            $ppnodes[$pkey] = $this->nodeValue($ppnodes[$pkey]);
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
                    $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
                    $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];

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
                    $theNode[$colName] = count($check_val)>0?$check_val:null;
                    break;

                case "bool":
                    $theNode[$colName] = $theNode[$colName]==1 || $theNode[$colName]=="1"?true:false;
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
               case "radio":
               case "radiocom":
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

    public function save() {
        $db = $this->db;
        $node = $this->tree["node"];

        $this->tree["schema"]["head"]["error"]          = 0;    
        $this->tree["schema"]["head"]["errorMessage"]   = "";            
	    $this->tree["node"]["error"]                    = 0;
	    $this->tree["node"]["errorMessage"]             = "";

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

        switch($node["nodestate"]) {
            case "1":
                switch($node["nodetable"]) {
                    case "pptable":
                        $fields = $this->getRow($this->tree["schema"]["cols"], $node["nodetable"]);
                        if($this->tree["node"]["error"]<1) {
                            if(count($fields)>0) {
                                $db->update($pptable, array($pcol=>$node["nodeid"]), $fields);
                            }                

				            // special for checkbox, 	
		                    foreach($this->tree["schema"]["cols"]["pptable"] as $col) {
    		                    $colName = $col["col"];
		                        $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                        $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];

                                if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                    $db->delete($ref_table, array($ref_col=>$node["nodeid"]));						
						            $new_check = array();
						            foreach($node[$colName] as $key1=>$val1) {
							            if(strtolower($val1)=="true"||$val1===true) {
								            //echo "$key1 + $val1";
								            $new_check[$key1] = true;

								            $clist = array();
								            $clist[$ref_col] = $node["nodeid"];
								            $clist[$colName] = $key1;
                                            //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								            $db->insert($ref_table, $clist);
							            }
						            }
                                    $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                }                        
                            }
                            // end checkbox   

                        } // error < 1
                        break;
                    case "tttable":
                        $fields = $this->getRow($this->tree["schema"]["cols"], $node["nodetable"]);
                        $nnfields = $this->getRow($this->tree["schema"]["cols"], "nntable"); // getRow function has been updated to handle nntable 
                        if($this->tree["node"]["error"]<1) {
                            if(count($fields)>0) {
                                $db->update($tttable, array($tcol=>$node["nodeid"]), $fields);
                            }

				            // special for checkbox, 	
		                    foreach($this->tree["schema"]["cols"]["tttable"] as $col) {
                                $col["table"]=$col["table"]?$col["table"]:$node["nodetable"];
                                if($node["nodetable"]!=$col["table"]) continue;

    		                    $colName = $col["col"];
		                        $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                        $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];

                                if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                    $db->delete($ref_table, array($ref_col=>$node["nodeid"]));						
						            $new_check = array();
						            foreach($node[$colName] as $key1=>$val1) {
							            if(strtolower($val1)=="true"||$val1===true) {
								            //echo "$key1 + $val1";
								            $new_check[$key1] = true;

								            $clist = array();
								            $clist[$ref_col] = $node["nodeid"];
								            $clist[$colName] = $key1;
                                            //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								            $db->insert($ref_table, $clist);
							            }
						            }
                                    $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                }                        
                            }
                            // end checkbox  
                            
                            /*************************************************************************/
                            if($nntable!="") {
                                $nnccc = array();
                                $nnccc[$npref] = $node["parentid"];
                                $nnccc[$ntref] = $node["nodeid"];
                                if(count($nnfields)>0) {
                                    $db->update($nntable, $nnccc, $nnfields);
                                }

				                // special for checkbox, 				
		                        foreach($this->tree["schema"]["cols"]["tttable"] as $col) {
                                    if($col["table"]=="nntable") {
                                        $nnccc = array();
                                        $nnccc[$npref] = $node["parentid"];
                                        $nnccc[$ntref] = $node["nodeid"];

                                        $colName = $col["col"];
		                                $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                                $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];

                                        //echo "ref: $ref_table col: $ref_col";
                                        if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                            $db->delete($ref_table, $nnccc);						
						                    $new_check = array();
						                    foreach($node[$colName] as $key1=>$val1) {
							                    if(strtolower($val1)=="true"||$val1===true) {
								                    //echo "$key1 + $val1";
								                    $new_check[$key1]   = true;

								                    $nnccc[$colName]    = $key1;
                                                    //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								                    $db->insert($ref_table, $nnccc);
							                    }
						                    }
                                            $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                        }                        
                                    } // end table==nntable
                                } // end foreach
                            }  // nntable != ""
                            /***********************************************************************************/
                            
                        } // error < 1                                            
                        break;
                    case "sstable":
                        $fields = $this->getRow($this->tree["schema"]["cols"], $node["nodetable"]);
                        $mmfields = $this->getRow($this->tree["schema"]["cols"], "mmtable"); // getRow function has been updated to handle mmtable 
                        if($this->tree["node"]["error"]<1) {
                            if(count($fields)>0) {
                                $db->update($sstable, array($scol=>$node["nodeid"]), $fields);
                            }

				            // special for checkbox, 	
		                    // sstable , ddtable are the same
                            foreach($this->tree["schema"]["cols"]["sstable"] as $col) {
                                $col["table"]=$col["table"]?$col["table"]:$node["nodetable"];
                                $col["table"]=$col["table"]=="ddtable"?"sstable":$col["table"]; // ddtable convert to sstable, they are same for checkbox
                                if($node["nodetable"]!=$col["table"]) continue;
    		                    
                                $colName = $col["col"];
		                        $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                        $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];

                                if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                    $db->delete($ref_table, array($ref_col=>$node["nodeid"]));						
						            $new_check = array();
						            foreach($node[$colName] as $key1=>$val1) {
							            if(strtolower($val1)=="true"||$val1===true) {
								            //echo "$key1 + $val1";
								            $new_check[$key1] = true;

								            $clist = array();
								            $clist[$ref_col] = $node["nodeid"];
								            $clist[$colName] = $key1;
                                            //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								            $db->insert($ref_table, $clist);
							            }
						            }
                                    $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                }                        
                            }
                            // end checkbox  

                            if($mmtable!="") {
                                $mmccc = array();
                                if($nntable!="") {
                                    $mmccc[$mpref] = $node["grandid"];
                                    $mmccc[$mtref] = $node["parentid"];
                                    $mmccc[$msref] = $node["nodeid"];
                                } else if($tttable!="") {
                                    $mmccc[$mtref] = $node["parentid"];
                                    $mmccc[$msref] = $node["nodeid"];
                                } else {
                                    $mmccc[$mpref] = $node["parentid"];
                                    $mmccc[$msref] = $node["nodeid"];
                                }
                                
                                if(count($mmfields)>0) {
                                    $db->update($mmtable, $mmccc, $mmfields);                                    
                                }


				                // special for checkbox, 				
		                        foreach($this->tree["schema"]["cols"]["sstable"] as $col) {
                                    if($col["table"]=="mmtable") {

                                        $mmccc = array();
                                        if($nntable!="") {
                                            $mmccc[$mpref] = $node["grandid"];
                                            $mmccc[$mtref] = $node["parentid"];
                                            $mmccc[$msref] = $node["nodeid"];
                                        } else if($tttable!="") {
                                            $mmccc[$mtref] = $node["parentid"];
                                            $mmccc[$msref] = $node["nodeid"];
                                        } else {
                                            $mmccc[$mpref] = $node["parentid"];
                                            $mmccc[$msref] = $node["nodeid"];
                                        }

                                        $colName = $col["col"];
		                                $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];

                                        //echo "ref: $ref_table col: $ref_col";
                                        if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                            $db->delete($ref_table, $mmccc);						
						                    $new_check = array();
						                    foreach($node[$colName] as $key1=>$val1) {
							                    if(strtolower($val1)=="true"||$val1===true) {
								                    //echo "$key1 + $val1";
								                    $new_check[$key1]   = true;

								                    $mmccc[$colName]    = $key1;
                                                    //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								                    $db->insert($ref_table, $mmccc);
							                    }
						                    }
                                            $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                        }                        
                                    } // end table==nntable
                                } // end foreach

                            } // mmtable !=""

                        } // error < 1                        
                        break;
                } // end case 1
                break;
            case "2":
                switch($node["nodetable"]) {
                    case "pptable":
                        $fields = $this->getRow($this->tree["schema"]["cols"], $node["nodetable"]);
                        if( $this->tree["node"]["error"]<1 ) {
                            if($pref!="") $fields[$pref] = $node["parentid"]?$node["parentid"]:0;
                            $nodeid = $db->insert($pptable, $fields);
                            $node["nodeid"] = $nodeid;
                            $this->tree["node"]["nodeid"] = $nodeid;

				            // special for checkbox, 	
		                    foreach($this->tree["schema"]["cols"][$node["nodetable"]] as $col) {
    		                    $colName = $col["col"];
		                        $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                        $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];
                                //echo "ref: $ref_table col: $ref_col";
                                if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                    $db->delete($ref_table, array($ref_col=>$node["nodeid"]));						
						            $new_check = array();
						            foreach($node[$colName] as $key1=>$val1) {
							            if(strtolower($val1)=="true"||$val1===true) {
								            //echo "$key1 + $val1";
								            $new_check[$key1] = true;

								            $clist = array();
								            $clist[$ref_col] = $node["nodeid"];
								            $clist[$colName] = $key1;
                                            //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								            $db->insert($ref_table, $clist);
							            }
						            }
                                    $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                }                        
                            }
                            // end checkbox   

                        }
                        break;
                    case "tttable":
                        $fields = $this->getRow($this->tree["schema"]["cols"], $node["nodetable"]);
                        $nnfields = $this->getRow($this->tree["schema"]["cols"], "nntable"); // getRow function has been updated to handle nntable 
                       
                        if( $this->tree["node"]["error"]<1 ) {
                            if($nntable=="") $fields[$tpref] = $node["parentid"];
                            $nodeid = $db->insert($tttable, $fields);
                            $node["nodeid"] = $nodeid;
                            $this->tree["node"]["nodeid"] = $nodeid;

				            // special for checkbox, 	
		                    foreach($this->tree["schema"]["cols"][$node["nodetable"]] as $col) {
                                $col["table"]=$col["table"]?$col["table"]:$node["nodetable"];
                                if( $col["table"]!=$node["nodetable"] ) continue;
    		                    $colName = $col["col"];
		                        $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                        $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];
                                //echo "ref: $ref_table col: $ref_col";
                                if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                    $db->delete($ref_table, array($ref_col=>$node["nodeid"]));						
						            $new_check = array();
						            foreach($node[$colName] as $key1=>$val1) {
							            if(strtolower($val1)=="true"||$val1===true) {
								            //echo "$key1 + $val1";
								            $new_check[$key1] = true;

								            $clist = array();
								            $clist[$ref_col] = $node["nodeid"];
								            $clist[$colName] = $key1;
                                            //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								            $db->insert($ref_table, $clist);
							            }
						            }
                                    $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                }                        
                            }
                            // end checkbox   

                            if($nntable!="") {
                                $nnccc = array();
                                $nnccc[$npref] = $node["parentid"];
                                $nnccc[$ntref] = $node["nodeid"];
                                if( $db->hasRow($nntable, $nnccc) ) { 
                                    $db->update($nntable, $nnccc, $nnfields);
                                } else {
                                    $nnfields[$npref] = $node["parentid"];
                                    $nnfields[$ntref] = $node["nodeid"];
                                    $db->insert($nntable, $nnfields);
                                } 

				                // special for checkbox, 				
		                        foreach($this->tree["schema"]["cols"]["tttable"] as $col) {
                                    if($col["table"]=="nntable") {
                                        $nnccc = array();
                                        $nnccc[$npref] = $node["parentid"];
                                        $nnccc[$ntref] = $node["nodeid"];

                                        $colName = $col["col"];
		                                $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];

                                        if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                            $db->delete($ref_table, $nnccc);						
						                    $new_check = array();
						                    foreach($node[$colName] as $key1=>$val1) {
							                    if(strtolower($val1)=="true"||$val1===true) {
								                    //echo "$key1 + $val1";
								                    $new_check[$key1]   = true;

								                    $nnccc[$colName]    = $key1;
                                                    //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								                    $db->insert($ref_table, $nnccc);
							                    }
						                    }
                                            $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                        }                        
                                    } // end table==nntable
                                } // end foreach
                            } // nntable!=""
                        } // error < 1
                        break;
                    case "sstable":
                        $fields     = $this->getRow($this->tree["schema"]["cols"], $node["nodetable"]);
                        $mmfields   = $this->getRow($this->tree["schema"]["cols"], "mmtable"); // getRow function has been updated to handle nntable 
                       
                        if( $this->tree["node"]["error"]<1 ) {
                            if($mmtable=="") {
                                if($tttable!="") 
                                    $fields[$stref] = $node["parentid"]; // pp->nn->tt->ss; pp->tt->ss
                                else
                                    $fields[$spref] = $node["parentid"]; // pp->ss
                            }
                            $nodeid = $db->insert($sstable, $fields);
                            $node["nodeid"] = $nodeid;
                            $this->tree["node"]["nodeid"] = $nodeid;

				            // special for checkbox, 	
		                    // sstable , ddtable are the same
                            foreach($this->tree["schema"]["cols"]["sstable"] as $col) {
                                $col["table"]=$col["table"]?$col["table"]:$node["nodetable"];
                                $col["table"]=$col["table"]=="ddtable"?"sstable":$col["table"]; // ddtable convert to sstable, they are same for checkbox
                                if($node["nodetable"]!=$col["table"]) continue;
    		                    
                                $colName = $col["col"];
		                        $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];
		                        $ref_col 	= $this->tree["schema"]["checklist"][$colName]["rcol"];

                                if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                    $db->delete($ref_table, array($ref_col=>$node["nodeid"]));						
						            $new_check = array();
						            foreach($node[$colName] as $key1=>$val1) {
							            if(strtolower($val1)=="true"||$val1===true) {
								            //echo "$key1 + $val1";
								            $new_check[$key1] = true;

								            $clist = array();
								            $clist[$ref_col] = $node["nodeid"];
								            $clist[$colName] = $key1;
                                            //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								            $db->insert($ref_table, $clist);
							            }
						            }
                                    $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                }                        
                            }
                            // end checkbox  

                            if($mmtable!="") { 
                                $mmccc = array();
                                if($nntable!="") {  // pp->nn->tt->mm->ss
                                    $mmccc[$mpref] = $node["grandid"];
                                    $mmccc[$mtref] = $node["parentid"];
                                    $mmccc[$msref] = $node["nodeid"];
                                } else if($tttable!="") { // pp->tt->mm->ss
                                    $mmccc[$mtref] = $node["parentid"];
                                    $mmccc[$msref] = $node["nodeid"];
                                } else { // pp->mm->ss
                                    $mmccc[$mpref] = $node["parentid"];
                                    $mmccc[$msref] = $node["nodeid"];
                                }
                             
                                if( $db->hasRow($mmtable, $mmccc) ) { 
                                    $db->update($mmtable, $mmccc, $mmfields);
                                } else {
                                    foreach($mmccc as $mmkk=>$mmvv ) {
                                        $mmfields[$mmkk] = $mmvv;
                                    }
                                    $db->insert($mmtable, $mmfields);
                                } 
                                
				                // special for checkbox, 				
		                        foreach($this->tree["schema"]["cols"]["sstable"] as $col) {
                                    if($col["table"]=="mmtable") {

                                        $mmccc = array();
                                        if($nntable!="") {
                                            $mmccc[$mpref] = $node["grandid"];
                                            $mmccc[$mtref] = $node["parentid"];
                                            $mmccc[$msref] = $node["nodeid"];
                                        } else if($tttable!="") {
                                            $mmccc[$mtref] = $node["parentid"];
                                            $mmccc[$msref] = $node["nodeid"];
                                        } else {
                                            $mmccc[$mpref] = $node["parentid"];
                                            $mmccc[$msref] = $node["nodeid"];
                                        }

                                        $colName = $col["col"];
		                                $ref_table 	= $this->tree["schema"]["checklist"][$colName]["rtable"];

                                        //echo "ref: $ref_table col: $ref_col";
                                        if( $col["type"]=="checkbox" || $col["type"]=="checkcom" || $col["type"]=="actbox" ) {
    			                            $db->delete($ref_table, $mmccc);						
						                    $new_check = array();
						                    foreach($node[$colName] as $key1=>$val1) {
							                    if(strtolower($val1)=="true"||$val1===true) {
								                    //echo "$key1 + $val1";
								                    $new_check[$key1]   = true;

								                    $mmccc[$colName]    = $key1;
                                                    //echo "here : " . $node["nodeid"] . "  key:" . $key1;
								                    $db->insert($ref_table, $mmccc);
							                    }
						                    }
                                            $this->tree["node"][$colName] = count($new_check)>0?$new_check:null;
                                        }                        
                                    } // end table==nntable
                                } // end foreach

                            } // mmtable !=""

                        } // error < 1                        
                        break;
                } // end switch    
                break;
            case "3":
                switch($node["nodetable"]) {
                    case "pptable":
                        $db->detach($pptable, array($pcol=>$node["nodeid"]));
                        break;
                    case "tttable":
                        if($nntable!="") {
                            $nnccc = array();
                            $nnccc[$npref] = $node["parentid"];
                            $nnccc[$ntref] = $node["nodeid"];
                            if( $db->hasRow($nntable, $nnccc) ) { 
                                $db->delete($nntable, $nnccc);
                            } 
                        } else {
                            $db->detach($tttable, array($tcol=>$node["nodeid"]));
                        }
                        break;
                    case "sstable":
                        if($mmtable!="") {
                            $mmccc = array();
                            if($nntable!="") {  // pp->nn->tt->mm->ss
                                $mmccc[$mpref] = $node["grandid"];
                                $mmccc[$mtref] = $node["parentid"];
                                $mmccc[$msref] = $node["nodeid"];
                            } else if($tttable!="") { // pp->tt->mm->ss
                                $mmccc[$mtref] = $node["parentid"];
                                $mmccc[$msref] = $node["nodeid"];
                            } else {  // pp->mm->ss
                                $mmccc[$mpref] = $node["parentid"];
                                $mmccc[$msref] = $node["nodeid"];
                            }
                            if( $db->hasRow($mmtable, $mmccc) ) { 
                                $db->delete($mmtable, $mmccc);
                            } 
                        } else {
                            // pp->ss 
                            // pp->tt->ss
                            $db->detach($sstable, array($scol=>$node["nodeid"]));
                        }
                        break;
                } // end switch    
                break;
        }
    }

    private function getRow($cols, $tableName) {
	    $temp = array();
        $tabName = $tableName;
        if($tableName=="nntable") $tabName = "tttable";
        if($tableName=="mmtable") $tabName = "sstable";

        foreach($cols[$tabName] as $col) {
            $colName = $col["col"];
            $col["table"] = $col["table"]?$col["table"]:$tabName;
            if($col["table"]!=$tableName) continue;

			$this->tree["node"][$colName] = str_replace(array("undefined", "null"), array("",""),  $this->tree["node"][$colName]);
            $len = mb_strlen($this->tree["node"][$colName]);

            switch($col["type"]) {
                case "treelink":
                    if( ($len <=0 && $col["required"]=="1") || $this->tree["node"][$colName]=="0" ) {
                        $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                        $this->tree["node"]["error"] = 1;
                        $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                        $this->tree["schema"]["head"]["error"] = 1;    
                        $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                    }
                    break;

                case "vtext":
                case "radio":
                case "radiocom":
                case "radiolist":
                case "radiodiag":
                    if( ($len <=0 && $col["required"]=="1") || $this->tree["node"][$colName]=="0" ) {
                        if($col["other"]!="" && $this->tree["node"][$col["other"]]==""){
                            $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                            $this->tree["node"]["error"] = 1;
                            $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                            $this->tree["schema"]["head"]["error"] = 1;    
                            $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                        }
                    }
                    //echo "colName:" . $colName .  "  isSet:" . isset($this->tree["node"][$colName]) . " value:" . $this->tree["node"][$colName] . "  required:" . $col["required"]. "\n"; 
                    if($len > 0) $temp[$colName] = $this->tree["node"][$colName]?$this->tree["node"][$colName]:0;
                    if($col["other"]!="") $temp[$col["other"]] = LANG::trans($this->tree["node"][$col["other"]], $this->dlang);
                    break;

                case "select":
                    if( ($len <=0 && $col["required"]=="1") || $this->tree["node"][$colName]=="0" ) {
                        $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                        $this->tree["node"]["error"] = 1;
                        $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                        $this->tree["schema"]["head"]["error"] = 1;    
                        $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                    }
                    //echo "colName:" . $colName .  "  isSet:" . isset($this->tree["node"][$colName]) . " value:" . $this->tree["node"][$colName] . "  required:" . $col["required"]. "\n"; 
                    if($len > 0) $temp[$colName] = $this->tree["node"][$colName]?$this->tree["node"][$colName]:0;
                    break;

                case "textbox":
                    if( $len <=0 && $col["required"]=="1" ) {
                        $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                        $this->tree["node"]["error"] = 1;
                        $this->tree["node"]["errorMessage"][$colName] .= $errMsg;
                        
                        $this->tree["schema"]["head"]["error"] = 1;    
                        $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                    }
                    
                    if($len > 0 && $len > $col["maxlength"] && $col["maxlength"]>0) {
                           $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("over_max_length", $lang, $len, $col["maxlength"]);
                           $this->tree["node"]["error"] = 1;
                           $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                           $this->tree["schema"]["head"]["error"] = 1;    
                           $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                    }
                    

                    if($this->tree["node"]["error"] <= 0 && $col["pattern"] == "number" )  $this->tree["node"][$colName] = $this->tree["node"][$colName]?$this->tree["node"][$colName]:0;
                    
                    if($len > 0 && $col["pattern"] != "" ) {
                        if(!preg_match($this->dataType[ strtoupper($col["pattern"]) ], $this->tree["node"][$colName])) {
                            $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"": "\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("invalid_type", $lang, $col["pattern"]);
                            $this->tree["node"]["error"] = 1;
                            $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                            $this->tree["schema"]["head"]["error"] = 1;    
                            $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                        }

                       

                        if($col["pattern"] == "number") {
                                   if( isset($col["min"]) && isset($col["max"]) ) {
                                        if(floatval($this->tree["node"][$colName]) < floatval($col["min"]) || floatval($this->tree["node"][$colName]) > floatval($col["max"])) {
                                               $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("out_of_range", $lang, $col["min"], $col["max"]);
                                               $this->tree["node"]["error"] = 1;
                                               $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                                               $this->tree["schema"]["head"]["error"] = 1;    
                                               $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                                        }
                                    } elseif ( $col["min"]!="" ) {
                                        if( floatval($this->tree["node"][$colName]) < floatval($col["min"]) ) {
                                               $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("less_than_min", $lang, $this->tree["node"][$colName], $col["min"]);
                                               $this->tree["node"]["error"] = 1;
                                               $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                                               $this->tree["schema"]["head"]["error"] = 1;    
                                               $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                                        }
                                    } elseif( $col["max"]!="" ) {
                                        if( floatval($this->tree["node"][$colName]) > floatval($col["max"]) ) {
                                               $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("large_than_max", $lang, $this->tree["node"][$colName], $col["max"]);
                                               $this->tree["node"]["error"] = 1;
                                               $this->tree["node"]["errorMessage"][$colName] .= $errMsg;

                                               $this->tree["schema"]["head"]["error"] = 1;    
                                               $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                                        }
                                   }
                           
                        }        

                    } 

                    //echo "colName:" . $colName .  "  isSet:" . isset($this->tree["node"][$colName]) . " value:" . $this->tree["node"][$colName] . "\n"; 
                    $temp[$colName] = LANG::trans($this->tree["node"][$colName], $this->dlang);
                    if($col["pattern"] == "number")  $temp[$colName] = $this->tree["node"][$colName]?$this->tree["node"][$colName]:0;
                    break;

				case "actbox":      // must filter undefined element
				case "cktext":      // must filter undefined element
				case "checkcom":    // must filter undefined element
				case "checkbox":    // must filter undefined element
				case "checklist":    // must filter undefined element
				case "checkdiag":    // must filter undefined element
					if( $col["required"]=="1" ) {
                            $select_ck = false;
		                    foreach($this->tree["node"][$colName] as $key1=>$val1) {
			                    if(strtolower($val1)=="true"||$val1===true) $select_ck = true;
		                    }
                            if(!$select_ck) {
                                if($col["other"]!="" && $this->tree["node"][$col["other"]]==""){
                                    $errMsg = ($this->tree["node"]["errorMessage"][$colName]==""?"":"\n") .  "'" . ($col["title"]?$col["title"]:ucwords($colName)) . "' " . LANG::words("required_col", $lang);
                                    $this->tree["node"]["error"] = 1;
                                    $this->tree["node"]["errorMessage"][$colName] .= $errMsg;
                        
                                    $this->tree["schema"]["head"]["error"] = 1;    
                                    $this->tree["schema"]["head"]["errorMessage"] .= $errMsg;            
                                }
                            }                    
                    }
                    if($col["other"]!="") $temp[$col["other"]] = LANG::trans($this->tree["node"][$col["other"]], $this->dlang);
					break;

                case "bool":
                    $temp[$colName] = $this->tree["node"][$colName]=="true"?1:0;   
                    $this->tree["node"][$colName] = $temp[$colName]==1?true:false;
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
			"TIME"		=> "/^((2[0-3]|[01]?[0-9])(:[0-5][0-9](:[0-5][0-9])?)?[ ]*(am|pm)?)$/i",
			"DATETIME"	=> "/^(?:19|20)[0-9]{2}(?:-|\/)(?:1[0-2]|0?[1-9])(?:-|\/)(?:3[01]|[0-2]?[0-9])[ ]+((2[0-3]|[01]?[0-9])(:[0-5][0-9](:[0-5][0-9])?)?[ ]*(am|pm)?)$/i"
	);
	
}
?>
