<?php
class WMLIULIST {
    public  $list;
	private $db;
	private $dlang;
	private $query;
	public function __construct($db, $list, $dlang) {
		$this->list            = $list;
        //$this->table["rows"]    = array();

		$this->db 		= $db;
		$this->dlang	= $dlang;
        $this->list["navi"]["head"]["lang"] = $list["navi"]["head"]["lang"]?$list["navi"]["head"]["lang"]:$this->dlang;

        $fields     = $this->getCol();        
        $field_str  = "";
        foreach($fields as $field) {
            $field_str .= ($field_str==""?"":", ") . $field;
        }

        $pptable    = $this->list["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->list["schema"]["table"]["pptable"]["col"];
        $pid        = $this->list["schema"]["idvals"]["pid"];

        $temp_ccc = "";
        if($this->list["navi"]["filterVals"]["search"]!="") {
            foreach($this->list["schema"]["cols"] as $colObj) {
                $colName = $colObj["col"];
                switch($colObj["type"]) {
	                case "hidden":
	                case "text":
                    case "imgvalue":
                        $temp_ccc .= ($temp_ccc==""?"":" OR ") . $colName . " LIKE '%"  . LANG::trans($this->list["navi"]["filterVals"]["search"], $this->dlang) . "%'";
					    break;
			    }
		    }
        }
        $temp_ccc = $temp_ccc == ""?"":" (" . $temp_ccc . ")"; 
        $criteria = "";
        $criteria = ($temp_ccc == ""?"":" AND ") . $temp_ccc;  
        if($this->list["navi"]["head"]["match"]=="1" && $criteria=="")  $criteria = " AND 1 = 0";
        $this->query = "SELECT $pptable.$pcol as pid, $pptable.$pcol as sid, $field_str FROM $pptable  WHERE $pptable.deleted <> 1 $criteria";


		//echo "query: " . $this->query;

		$result_num 	= $db->query("SELECT COUNT(1) AS CNT FROM ( " . $this->query . " ) res1");
		$row_total 		= $db->fetch($result_num);
		$this->list["navi"]["head"]["totalNo"] 	= $row_total["CNT"]?$row_total["CNT"]:0;
		$this->list["navi"]["head"]["pageNo"] 	= $list["navi"]["head"]["pageNo"]?$list["navi"]["head"]["pageNo"]:1;
		$this->list["navi"]["head"]["pageSize"] = $list["navi"]["head"]["pageSize"] > 0 && $list["navi"]["head"]["pageSize"] <= 200?$list["navi"]["head"]["pageSize"]:20;

        if( $this->list["navi"]["head"]["pageNo"] > ceil($this->list["navi"]["head"]["totalNo"]/$this->list["navi"]["head"]["pageSize"])  )
            $this->list["navi"]["head"]["pageNo"] = ceil($this->list["navi"]["head"]["totalNo"]/$this->list["navi"]["head"]["pageSize"]);

        $this->query = $this->query . " " . $this->orderStr();     

		// debug info
        $this->list["navi"]["head"]["query"] = $this->query;
        //$this->table["criteria"]    = $criteria;

   		$this->action();
	}
    
	private function action() {
        $this->list["navi"]["head"]["loading"] = 0;
		switch($this->list["navi"]["head"]["action"]) {
			case "load":
                $this->list["rows"]             = $this->rows();
                // response data;
                $this->result["navi"]["head"]   = $this->list["navi"]["head"];
                $this->result["rows"]           = $this->list["rows"];
				break;
		}
	}

	private function orderStr() {
		$order_str = "";
		if($this->list["navi"]["head"]["orderBy"] != "") {	
			$order_str 	= " ORDER BY " . $this->list["navi"]["head"]["orderBy"];
		} 
		return $order_str;
	}
    
	private function rows() {
		$db = $this->db;
		$this->list["navi"]["head"]["pageNo"] = $this->list["navi"]["head"]["pageNo"]<=0?1:$this->list["navi"]["head"]["pageNo"];
		$query 	= "SELECT * FROM (" . $this->query . ") res1  LIMIT " . ($this->list["navi"]["head"]["pageNo"]-1) * $this->list["navi"]["head"]["pageSize"] . " , " . $this->list["navi"]["head"]["pageSize"];
		
        //debug info
        //$this->list["query1"] = $query;
		
		$result = $db->query( $query );
		
		$rows = array();
		$cnt = 0;
        while( $row = $db->fetch($result)) {
            $rows[$cnt]["pid"] = $row["pid"];
            $rows[$cnt]["sid"] = $row["sid"];
		    foreach( $this->list["schema"]["cols"] as $col ) {
                if($col["col"]!="") {
			        switch($col["type"]) {
                        case "imgvalue":  //  true / false
        				    $rows[$cnt][$col["col"]] = $row[$col["col"]]?$row[$col["col"]]:"";
                            break;
                        case "bool":  //  true / false
        				    $rows[$cnt][$col["col"]] = $row[$col["col"]]==1||$row[$col["col"]]=="1"?true:false;
                            break;
                        case "text": //  "abc"
        				    $rows[$cnt][$col["col"]] = LANG::trans($row[$col["col"]], $this->list["navi"]["head"]["lang"]);
                            break;
                        default:     // null => ""
        				    $rows[$cnt][$col["col"]] = $row[$col["col"]]?LANG::trans($row[$col["col"]], $this->list["navi"]["head"]["lang"]):"";
                            break;
			        }
                }
		    }
			$cnt++;	
		}
        $this->list["navi"]["head"]["pageNo"] = $this->list["navi"]["head"]["totalNo"]==0?0:$this->list["navi"]["head"]["pageNo"];
		return $rows;
	}

	private function getCol() {
	    $temp = array();
        foreach($this->list["schema"]["cols"] as $colObj) {
            $colName = $colObj["col"];
            switch($colObj["type"]) {
	            case "hidden":
	            case "text":
                case "imgvalue":
                    $temp[] = $colName;
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
