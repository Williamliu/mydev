<?php
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhFilter.php");
class LWHACCORD {
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
				$this->valObj 			= $this->getSelection();
				$this->result["valObj"] = $this->valObj;
				$this->result["head"] 		= $this->table["head"];
				break;
		}
	}

	private function load() {
		$db 		= $this->db;
        $pptable	= $this->table["schema"]["table"]["pptable"];
		$ppname		= $pptable["view"];
		$ppid		= $pptable["id"];
		$pprid		= $pptable["rid"];
		$pprval		= $pptable["rval"];
		$pporder	= $pptable["orderBY"]?" ORDER BY " . $pptable["orderBY"]:"";

        $mmtable	= $this->table["schema"]["table"]["mmtable"];
		$mmname		= $mmtable["view"];
		$mmid		= $mmtable["id"];
		$mmrid		= $mmtable["rid"];
		$mmrval		= $mmtable["rval"];
		$mmorder	= $mmtable["orderBY"]?" ORDER BY " . $mmtable["orderBY"]:"";
		$ppref		= $mmtable["pref"];


        $sstable	= $this->table["schema"]["table"]["sstable"];
		$ssname		= $sstable["view"];
		$ssid		= $sstable["id"];
		$mmref		= $sstable["mref"];
		$ssorder	= $sstable["orderBY"]?" ORDER BY " . $sstable["orderBY"]:"";

		$match 		= intval($this->table["head"]["match"])?true:false;
		
		// create seach text  string
		$sscriteria = "";
		$ffval		= $sstable["fval"];
		//echo "fval: " . $ffval;
		if( $ffval != "" ) {
			$cccc = "";
		    foreach( $sstable["cols"] as $colObj ) {
				$colName 	= $colObj["col"]?$colObj["col"]:$colObj["name"];
				if(intval($colObj["search"])==1) {
					$cccc .= ($cccc==""?"":" OR ") . "$ssname.$colName" . " LIKE '%" . $ffval . "%'"; 
				}
			}
			$cccc = $cccc==""?"":"(" . $cccc . ")";
		}
		$sscriteria .= $sscriteria!="" && $cccc!=""?" AND " . $cccc : $cccc;				
		$sscriteria = ($sscriteria==""?"":" AND ") . $sscriteria;
		///////////////////////////
		
		
		
		$data = array();
		
		// pptable
		if( $ppname != "" ) {
			$this->table["head"]["level"] = 1;
			$ppccc 	= $this->getFilter($ppname, $pptable["filter"]); 
			$ppcols = $this->getFields($ppname, $pptable["cols"]);
			$pp_fields = implode(",", $ppcols);
			SEARCH::concat( $pp_fields, ", ", "$ppname.$ppid as pid");

			if( $match ) 
				$ppquery = "SELECT distinct $pp_fields
										FROM $ppname 
										INNER JOIN $mmname ON ( $ppname.$ppid = $mmname.$ppref ) 
										INNER JOIN $ssname ON ( $mmname.$mmid = $ssname.$mmref ) 
										WHERE  $ppname.deleted <> 1 AND $mmname.deleted <> 1 AND $ssname.deleted <> 1 $ppccc $sscriteria $pporder";
			else 
				$ppquery = "SELECT  distinct $pp_fields
										FROM $ppname 
										WHERE  $ppname.deleted <> 1 $ppccc $pporder";

			if( 1==1 ) $this->table["head"]["query"]["pp"] = $ppquery;


	 		$resultpp = $db->query( $ppquery );
			$cntpp = 0;
			while( $rowpp = $db->fetch($resultpp)) {
				$data[$cntpp]["pid"] = $rowpp["pid"];
				
				foreach( $pptable["cols"] as $colObj ) {
					$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
					$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";
	
					switch( $colType ) {
						case "bool":
						case "checkbutton":
						case "intdate":
						case "intdatetime":
						case "intdatehide":
						case "intdatetimehide":
							$data[$cntpp][$colName] = $rowpp[$colName]?$rowpp[$colName]:0;
							break;
							
						case "hidden":
						case "text":
							$data[$cntpp][$colName] = LANG::trans($db->unquote($rowpp[$colName]), $this->table["head"]["lang"]);			         
							break;
					}
				}
				
				$data[$cntpp]["data"] = $this->mmtable($mmtable, $sscriteria, $data[$cntpp]["pid"]);
				$cntpp++;
			}
		} else {
			$data = $this->mmtable($mmtable, $sscriteria, "");
		}
		// end of pptable
		
		$this->valObj = $this->getSelection();	
		///////////////////////////////////////////////////
	
	
		$this->table["data"] 		= $data;
		$this->result["data"] 		= $this->table["data"];
		$this->result["head"] 		= $this->table["head"];
		$this->result["valObj"] 	= $this->valObj;
		
		//$this->result["filter"] 	= $this->table["filter"];
		//$this->result["criteria"] 	= LWHFILTER::output($this->table["filter"]);
	}

	private function mmtable($mmtable, $sscriteria, $pval) {
		$db 		= $this->db;
		$mmdata 	= array();
		$mmname		= $mmtable["view"];
		$mmid		= $mmtable["id"];
		$mmrid		= $mmtable["rid"];
		$mmrval		= $mmtable["rval"];
		$mmorder	= $mmtable["orderBY"]?" ORDER BY " . $mmtable["orderBY"]:"";
		$ppref		= $mmtable["pref"];

        $sstable	= $this->table["schema"]["table"]["sstable"];
		$ssname		= $sstable["view"];
		$ssid		= $sstable["id"];
		$mmref		= $sstable["mref"];
		$ssorder	= $sstable["orderBY"]?" ORDER BY " . $sstable["orderBY"]:"";

		$match 		= intval($this->table["head"]["match"])?true:false;
		

		$mmccc 	= $this->getFilter($mmname, $mmtable["filter"]); 
		$mmcols = $this->getFields($mmname, $mmtable["cols"]);
		$mm_fields = implode(",", $mmcols);
		SEARCH::concat( $mm_fields, ", ", "$mmname.$mmid as mid");

		if( $pval != "" ) {
			$mmccc .=  " AND $mmname.$ppref='" . $pval . "'";
		} else {
			$this->table["head"]["level"] = 2;
		}


		if( $match ) 
			$mmquery = "SELECT distinct $mm_fields
									FROM $mmname 
									INNER JOIN $ssname ON ( $mmname.$mmid = $ssname.$mmref ) 
									WHERE  $mmname.deleted <> 1 AND $ssname.deleted <> 1 $mmccc $sscriteria $mmorder";
		else 
			$mmquery = "SELECT distinct	$mm_fields
									FROM $mmname 
									WHERE  $mmname.deleted <> 1 $mmccc $mmorder";


		if( 1==1 ) $this->table["head"]["query"]["mm"] = $mmquery;


		$resultmm = $db->query( $mmquery );
		$cntmm = 0;
		while( $rowmm = $db->fetch($resultmm)) {
			$mmdata[$cntmm]["mid"] = $rowmm["mid"];
			
			foreach( $mmtable["cols"] as $colObj ) {
				$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
				$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";

				switch( $colType ) {
					case "bool":
					case "checkbutton":
					case "intdate":
					case "intdatetime":
					case "intdatehide":
					case "intdatetimehide":
						$mmdata[$cntmm][$colName] = $rowmm[$colName]?$rowmm[$colName]:0;
						break;
						
					case "hidden":
					case "text":
						$mmdata[$cntmm][$colName] = LANG::trans($db->unquote($rowmm[$colName]), $this->table["head"]["lang"]);			         
						break;
				}
			}
			$mmdata[$cntmm]["data"] = $this->sstable($sstable, $sscriteria, $mmdata[$cntmm]["mid"]);
			$cntmm++;
		}
		
		return $mmdata;
	}


	private function sstable($sstable, $sscriteria, $mval) {
		$db 		= $this->db;
		$ssname		= $sstable["view"];
		$ssid		= $sstable["id"];
		$mmref		= $sstable["mref"];
		$ssorder	= $sstable["orderBY"]?" ORDER BY " . $sstable["orderBY"]:"";

	
		$ssdata 	= array();
		$ssccc 	= $this->getFilter($ssname, $sstable["filter"]); 
		$sscols = $this->getFields($ssname, $sstable["cols"]);
		$ss_fields = implode(",", $sscols);
		SEARCH::concat( $ss_fields, ", ", "$ssname.$ssid as sid");

		$ssccc .=  " AND $ssname.$mmref='" . $mval . "'";

		$ssquery = "SELECT  	$ss_fields
								FROM $ssname 
								WHERE  $ssname.deleted <> 1 $ssccc $sscriteria $ssorder";

		if( 1==1 ) $this->table["head"]["query"]["ss"] = $ssquery;
		
		$resultss = $db->query( $ssquery );
		$cntss = 0;
		while( $rowss = $db->fetch($resultss)) {
			$ssdata[$cntss]["sid"] = $rowss["sid"];
			
			foreach( $sstable["cols"] as $colObj ) {
				$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
				$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";

				switch( $colType ) {
					case "bool":
					case "checkbutton":
					case "intdate":
					case "intdatetime":
					case "intdatehide":
					case "intdatetimehide":
						$ssdata[$cntss][$colName] = $rowss[$colName]?$rowss[$colName]:0;
						break;
						
					case "hidden":
					case "text":
						$ssdata[$cntss][$colName] = LANG::trans($db->unquote($rowss[$colName]), $this->table["head"]["lang"]);			         
						break;
				}
			}
			$cntss++;
		}
		
		return $ssdata;
		
	
	}
	

	private function getSelection() {
		$db 	= $this->db;
		$ret 	= array();
		// selection text and value
        $sstable	= $this->table["schema"]["table"]["sstable"];
		$ssname		= $sstable["view"];
		$ssid		= $sstable["id"];
		$mmref		= $sstable["mref"];
		$ssorder	= $sstable["orderBY"]?" ORDER BY " . $sstable["orderBY"]:"";
	
	
		$sscols = $this->getFields($ssname, $sstable["cols"]);
		$ss_fields = implode(",", $sscols);
		SEARCH::concat( $ss_fields, ", ", "$ssname.$ssid as sid");
	
		$valstr = implode(",", $this->valObj["val"]);
		if( $valstr != "") 	
			$criteria = "AND $ssname.$ssid IN (" . $valstr . ")";
		else 
			$criteria = "AND $ssname.$ssid IN (-1)";
	
		$query = "SELECT $ss_fields FROM $ssname WHERE $ssname.deleted <> 1 $criteria $ssorder";
		if( 1==1 ) $this->table["head"]["query"]["val"] = $query;

		$result = $db->query( $query );
		$nnval 	= array();
		$nntxt  = array();
        while( $row = $db->fetch($result)) {
			$nnval[] = $row["sid"];
			$tttt	 = "";
		    foreach( $sstable["cols"] as $colObj ) {
				$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
				$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";
				switch( $colType ) {
					case "bool":
							if( intval($row[$colName]) ) 
								$tttt .= '<a class="lwhAccord-imgvalue lwhAccord-imgvalue-status lwhAccord-imgvalue-status-1"></a>'; 
							else 
								$tttt .= '<a class="lwhAccord-imgvalue lwhAccord-imgvalue-status lwhAccord-imgvalue-status-0"></a>'; 
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
					case "hidden":
					case "text":
							$tttt .= LANG::trans($db->unquote($row[$colName]), $this->table["head"]["lang"]);			         
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
	
	private function getFields($tableName, $cols) {
	    $temp = array();
        foreach($cols as $colObj) {
			$colName = $colObj["col"]?$colObj["col"]:$colObj["name"];
			$colType = $colObj["coltype"]?strtolower($colObj["coltype"]):"text";
			switch( $colType ) {
				case "bool":
				case "hidden":
				case "text":
				case "intdate":
				case "intdatetime":
				case "intdatehide":
				case "intdatetimehide":
					$temp[] = "$tableName.$colName";
					break;
			}
		}
		return $temp;
	}

	private function getFilter($tableName, $filters) {
		$ccc = "";
		foreach( $filters as $colName=>$colVal ) {
			if( trim($colVal) != "" ) {
				$ccc .= ($ccc==""?"":" AND ") . "$tableName.$colName" . " = '" . trim($colVal) . "'"; 
			}
		}
		$ccc = ($ccc==""?"":" AND ") . $ccc;
	}
}
?>