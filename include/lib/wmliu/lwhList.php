<?php
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhFilter.php");
class LWHLIST {
	public 	$table;
	public 	$valObj;
    public 	$result;
	public 	$db;
	private $dlang;
	public function __construct($db, $table, $valObj,  $dlang) {
		$this->table 	                        = $table;
		$this->valObj 	                        = $valObj;
		$this->db 		                        = $db;
		$this->dlang							= $dlang;
		$this->table["head"]["lang"] 			= $table["head"]["lang"]?$table["head"]["lang"]:$this->dlang;
	}

	public function action() {
		$this->table["head"]["loading"]	= 0;
		switch($this->table["head"]["action"]) {
			case "view":
				$this->load();
				break;
			case "select":
				$this->valObj = $this->getSelection();
				$this->result["valObj"]		= $this->valObj;
				$this->result["head"] 		= $this->table["head"];
				break;
		}
	}

	private function load() {
		$db 		= $this->db;
        $sstable    = $this->table["schema"]["table"]["view"]?$this->table["schema"]["table"]["view"]:$this->table["schema"]["table"]["base"];
        $sscol      = $this->table["schema"]["table"]["id"];
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";
		$ffval 		= $this->table["schema"]["table"]["fval"]?$this->table["schema"]["table"]["fval"]:"";


		$fields		= $this->getFields();
		$order_str  = $this->getOrder();
		
		// reference
		$field_str 	= implode(",", $fields);
		SEARCH::concat($field_str, ",", "$sscol as sid");
		if($ppcol!="") SEARCH::concat($field_str, ",", "$ppcol as pid");
		////////////
		
		
		if( 1==0 ) $this->table["head"]["query"]["fields"] = $field_str;
		if( 1==0 ) $this->table["head"]["query"]["order"] 	= $order_str;
		
		$criteria = "";
		foreach( $this->table["schema"]["table"]["filter"] as $fkey=>$fObj ) {
			if( trim($fObj) != "") 
				$criteria .= ($criteria==""?"":" AND ") . $fkey . " = '" . trim($fObj) . "'";				
		}
		
		if( $ffval != "" ) {
			$cccc = "";
		    foreach( $this->table["schema"]["table"]["cols"] as $colObj ) {
				$colName 	= $colObj["col"]?$colObj["col"]:$colObj["name"];
				if(intval($colObj["search"])==1) {
					$cccc .= ($cccc==""?"":" OR ") . $colName . " LIKE '%" . $ffval . "%'"; 
				}
			}
			$cccc = $cccc==""?"":"(" . $cccc . ")";
		}
		$criteria .= $criteria!="" && $cccc!=""?" AND " . $cccc : $cccc;				
		
		$criteria = ($criteria==""?"":" AND ") . $criteria;

		if( 1==1 ) $this->table["head"]["criteria"]	= $criteria;
		
		
		$query = "";
		if( $ppcol != "" ) 
			$query = "SELECT $field_str FROM $sstable WHERE $sstable.deleted <> 1 AND $sstable.$ppcol = '" . $ppval . "' $criteria";
		else 
			$query = "SELECT $field_str FROM $sstable WHERE $sstable.deleted <> 1 $criteria";


				
		//echo "query: " . $query;
		$result_num 	= $db->query("SELECT COUNT(1) AS CNT FROM ( " . $query . " ) res1");
		$row_total 		= $db->fetch($result_num);
		$this->table["head"]["totalNo"] 	= intval($row_total["CNT"])?intval($row_total["CNT"]):0;
		$this->table["head"]["pageNo"] 	    = intval($this->table["head"]["pageNo"]) > 0?$this->table["head"]["pageNo"]:1;
		$this->table["head"]["pageSize"] 	= intval($this->table["head"]["pageSize"]) <= 0 ? 20: intval($this->table["head"]["pageSize"]);
		$this->table["head"]["pageSize"] 	= intval($this->table["head"]["pageSize"]) > 200 ? 200: intval($this->table["head"]["pageSize"]);
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
		
		if( 1==1 ) $this->table["head"]["query"]["sql"] 	= $query;

 		$result = $db->query( $query );
		$rows = array();
		$cnt = 0;
        while( $row = $db->fetch($result)) {
			$rows[$cnt]["sid"] = $row["sid"];
			if($ppcol!="") $rows[$cnt]["pid"] = $row["pid"]?$row["pid"]:"";


		    foreach( $this->table["schema"]["table"]["cols"] as $colObj ) {
				$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
				$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";

				switch( $colType ) {
					case "bool":
					case "checkbutton":
					case "intdate":
					case "intdatetime":
					case "intdatehide":
					case "intdatetimehide":
			            $rows[$cnt][$colName] = $row[$colName]?$row[$colName]:0;
						break;
						
					case "hidden":
					case "text":
						$rows[$cnt][$colName] = LANG::trans($db->unquote($row[$colName]), $this->table["schema"]["lang"]);			         
						break;
				}
			}
			$cnt++;
		}
		
		$this->valObj = $this->getSelection();	

		
		$this->table["data"] 		= $rows;
		$this->result["data"] 		= $this->table["data"];
		$this->result["head"] 		= $this->table["head"];
		$this->result["valObj"] 	= $this->valObj;
	}

	private function getSelection() {
		$db 	= $this->db;
		$ret 	= array();

        $sstable    = $this->table["schema"]["table"]["view"]?$this->table["schema"]["table"]["view"]:$this->table["schema"]["table"]["base"];
        $sscol      = $this->table["schema"]["table"]["id"];
        $ppcol      = $this->table["schema"]["table"]["pid"]?$this->table["schema"]["table"]["pid"]:"";
        $ppval      = $this->table["schema"]["table"]["pval"]?$this->table["schema"]["table"]["pval"]:"";
		$ffval 		= $this->table["schema"]["table"]["fval"]?$this->table["schema"]["table"]["fval"]:"";

		$fields		= $this->getFields();
		$order_str  = $this->getOrder();
		
		// reference
		$field_str 	= implode(",", $fields);
		SEARCH::concat($field_str, ",", "$sscol as sid");
		if($ppcol!="") SEARCH::concat($field_str, ",", "$ppcol as pid");


		$valstr = implode(",", $this->valObj["val"]);
		if( $valstr != "") 	
			$criteria = "AND $sstable.$sscol IN (" . $valstr . ")";
		else 
			$criteria = "AND $sstable.$sscol IN (-1)";
		
		$query = "";
		if( $ppcol != "" ) 
			$query = "SELECT $field_str FROM $sstable WHERE $sstable.deleted <> 1 AND $sstable.$ppcol = '" . $ppval . "' $criteria $order_str";
		else 
			$query = "SELECT $field_str FROM $sstable WHERE $sstable.deleted <> 1 $criteria $order_str";

		$result = $db->query( $query );
		$nnval 	= array();
		$nntxt  = array();
        while( $row = $db->fetch($result)) {
			$nnval[] = $row["sid"];
			$tttt	 = "";
		    foreach( $this->table["schema"]["table"]["cols"] as $colObj ) {
				$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
				$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";
				switch( $colType ) {
					case "bool":
							if( intval($row[$colName]) ) 
								$tttt .= '<a class="lwhList-imgvalue lwhList-imgvalue-status lwhList-imgvalue-status-1"></a>'; 
							else 
								$tttt .= '<a class="lwhList-imgvalue lwhList-imgvalue-status lwhList-imgvalue-status-0"></a>'; 
							break;					
					case "checkbutton":
							if( intval($row[$colName]) ) 
								$tttt .= '<a class="lwhList-checkButton lwhList-checkButton-checked"></a>'; 
							else 
								$tttt .= '<a class="lwhList-checkButton"></a>'; 
							break;
					case "intdate":
								if( intval($row[$colName]) > 0 )
									$tttt .= date("Y-m-d", intval($row[$colName])); 
							break;
					case "intdatehide":
							break;
					case "intdatetime":
								if( intval($row[$colName]) > 0 )
									$tttt .= date("Y-m-d H:i", intval($row[$colName])); 
							break;
					case "intdatetimehide":
							break;
					//case "hidden":
					case "text":
							$tttt .= LANG::trans($db->unquote($row[$colName]), $this->table["schema"]["lang"]);			         
						break;
					case "seperator":
						if( $colObj["on"]!="" ) {
							$colArr = explode("|" , $colObj["on"]);
							$sp_flag = false;
							foreach($colArr as $val) {
								$sp_flag = $sp_flag || ($row[$val]?true:false);
							}
							if($sp_flag) $tttt .= $colObj["colname"]; 
						} else {
							 $tttt .= $colObj["colname"]; 								
						}
						break;
						
				}
			}

			$nntxt[] = $tttt;
		}

		$ret["val"] 	= $nnval;
		$ret["text"] 	= $nntxt;
		return $ret;
	}
	
	private function getFields() {
	    $temp = array();
        foreach($this->table["schema"]["table"]["cols"] as $colObj) {
			$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
			$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";
			switch( $colType ) {
				case "bool":
				case "checkbutton":
				case "hidden":
				case "text":
				case "intdate":
				case "intdatetime":
				case "intdatehide":
				case "intdatetimehide":
					$temp[] = $colName;
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

}
?>