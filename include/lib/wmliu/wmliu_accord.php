<?php
class WMLIUACCORD {
    public  $table;
    public  $result;
    public  $vlist;
	private $db;
	private $dlang;
	private $query;
    private $query1;
	public function __construct($db, $list, $dlang) {
		$this->list     = $list;
		$this->db 		= $db;
		$this->dlang 	= $dlang;
        $this->list["list"]["head"]["lang"] = $list["list"]["head"]["lang"]?$list["list"]["head"]["lang"]:$this->dlang;
		$this->action();
	}
    
	private function action() {
        $this->list["list"]["head"]["loading"] = 0;
		switch($this->list["list"]["head"]["action"]) {
            case "load":
                $this->list["list"]["nodes"] = $this->load();
                // response data;
                $this->result["schema"]["idvals"]   = $this->list["schema"]["idvals"];
                $this->result["list"]["head"]       = $this->list["list"]["head"];
                $this->result["list"]["nodes"]      = $this->list["list"]["nodes"];
                break;
		}
	}

	private function load() {
		$db = $this->db;

        $pptable    = $this->list["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->list["schema"]["table"]["pptable"]["col"];
        $pid        = $this->list["schema"]["idvals"]["pid"];

        $qqtable    = $this->list["schema"]["table"]["qqtable"]["name"];
        $qcol       = $this->list["schema"]["table"]["qqtable"]["col"];


        $mmtable    = $this->list["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->list["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->list["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->list["schema"]["table"]["sstable"]["name"];
        $scol       = $this->list["schema"]["table"]["sstable"]["col"];
        $spref      = $this->list["schema"]["table"]["sstable"]["pref"];
        $sid        = $this->list["schema"]["idvals"]["sid"];

        $ddtable    = $this->list["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->list["schema"]["table"]["ddtable"]["col"];

        $criteria   = "";
        $ppccc      = WMSEARCH::filter($this->list["schema"]["table"]["pptable"], $this->list["schema"]["filterVals"]["pptable"]);
        $qqccc      = WMSEARCH::filter($this->list["schema"]["table"]["qqtable"], $this->list["schema"]["filterVals"]["qqtable"]);
        $ssccc      = WMSEARCH::filter($this->list["schema"]["table"]["sstable"], $this->list["schema"]["filterVals"]["sstable"]);
        $ddccc      = WMSEARCH::filter($this->list["schema"]["table"]["ddtable"], $this->list["schema"]["filterVals"]["ddtable"]);


        $criteria   = WMSEARCH::concat($criteria, $ppccc);
        $criteria   = WMSEARCH::concat($criteria, $qqccc);
        $criteria   = WMSEARCH::concat($criteria, $ssccc);
        $criteria   = WMSEARCH::concat($criteria, $ddccc);


        $fields_pp     = $this->getCol("pptable");     
        $field_pp_str  = "";
        foreach($fields_pp as $field) {
            $field_pp_str .= ($field_pp_str==""?"":", ") . $field;
        }

        $fields_ss     = $this->getCol("sstable");     
        $field_ss_str  = "";
        foreach($fields_ss as $field) {
            $field_ss_str .= ($field_ss_str==""?"":", ") . $field;
        }


        if($qqtable!="") $qq_join = "INNER JOIN $qqtable ON ($pptable.$pcol = $qqtable.$qcol)";
        if($ddtable!="") $dd_join = "INNER JOIN $ddtable ON ($sstable.$scol = $ddtable.$dcol)";


        $criteria_pp = "";
        $criteria_pp   = WMSEARCH::concat($criteria_pp, $ppccc);
        $criteria_pp   = WMSEARCH::concat($criteria_pp, $qqccc);

        $this->query = "SELECT  $pptable.$pcol as pid, $field_pp_str 
                                FROM $pptable $qq_join 
                                WHERE $pptable.deleted <> 1 AND $pptable.status = 1 $criteria_pp 
                                ORDER BY $pptable.orderno DESC";        


		// debug info
        //$this->list["list"]["head"]["query"]       = $this->query;
        //$this->list["list"]["head"]["criteria"]    = $criteria;
		
		
		$result = $db->query( $this->query );
		
		$rows = array();
		$cnt = 0;
        while( $row = $db->fetch($result)) {
            $rows[$cnt]["pid"]      = $row["pid"];
		    
            foreach( $this->list["schema"]["cols"]["pptable"] as $colName=>$colObj ) {
			    switch($colObj["type"]) {
                    case "hidden":
                    case "text":
        				$rows[$cnt][$colName] = LANG::trans($row[$colName], $this->list["list"]["head"]["lang"]);
                        break;
                    case "bool":  //  true / false
        				$rows[$cnt][$colName] = $row[$colName]==1||$row[$colName]=="1"?true:false;
                        break;
			    }
		    }

            if($mmtable!="") {
                $this->query1 = "SELECT  $pptable.$pcol as pid, $sstable.$scol as sid, $field_ss_str  
                                        FROM $pptable 
                                        INNER JOIN $mmtable ON ($pptable.$pcol  = $mmtable.$mpref) 
                                        INNER JOIN $sstable ON ($mmtable.$msref = $sstable.$scol) 
                                        $dd_join 
                                        WHERE   $pptable.deleted <> 1 AND $pptable.status = 1 AND $pptable.$pcol = '". $rows[$cnt]["pid"] ."' AND  
                                                $sstable.deleted <> 1 AND $sstable.status = 1 
                                        ORDER BY $pptable.orderno DESC, $sstable.orderno DESC";        
            } else {
                $this->query1 = "SELECT  $pptable.$pcol as pid, $sstable.$scol as sid, $field_ss_str
                                        FROM $pptable 
                                        INNER JOIN $sstable ON ($pptable.$pcol = $sstable.$spref) 
                                        $dd_join 
                                        WHERE   $pptable.deleted <> 1 AND $pptable.status = 1 AND $pptable.$pcol = '". $rows[$cnt]["pid"] ."' AND  
                                                $sstable.deleted <> 1 AND $sstable.status = 1 
                                        ORDER BY $pptable.orderno DESC, $sstable.orderno DESC";        
            }
            
            //debug info
            //$this->list["list"]["head"][$cnt]["query1"] = $this->query1;

            $result_ss = $db->query( $this->query1 );

            $rows_ss = array();
            $cnt1 = 0;
            while( $row1 = $db->fetch($result_ss)) {
                $rows_ss[$cnt1]["pid"]      = $row1["pid"];
                $rows_ss[$cnt1]["sid"]      = $row1["sid"];

		        foreach( $this->list["schema"]["cols"]["sstable"] as $colName=>$colObj ) {
			        switch($colObj["type"]) {
                        case "hidden":
                        case "text":
        				    $rows_ss[$cnt1][$colName] = LANG::trans($row1[$colName], $this->list["list"]["head"]["lang"]);
                            break;
                        case "bool":  //  true / false
        				    $rows_ss[$cnt1][$colName] = $row1[$colName]==1||$row1[$colName]=="1"?true:false;
                            break;
			        }
		        }
            

                $cnt1++;
            }
            $rows[$cnt]["nodes"] = $rows_ss;
			$cnt++;	
		}
		return $rows;
	}
	
	private function getCol($colTable) {
	    $temp = array();
        foreach($this->list["schema"]["cols"][$colTable] as $colName=>$colObj) {
            switch($colObj["type"]) {
	            case "hidden":
	            case "text":
                case "select":
                case "bool":
                    $colObj["table"] = $colObj["table"]!=""?$colObj["table"]:$colTable;
                    $table = $this->list["schema"]["table"][$colObj["table"]]["name"];
                    // if ddtable empty , then sstable
                    //if($table=="") $table = $this->table["schema"]["head"]["sstable"]["name"];
                    if($table!="") $temp[] = "$table.$colName";
					break;
			}
		}
		return $temp;
	}
}
?>
