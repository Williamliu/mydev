<?php
class LWHOPTION {
	public 	$table;
	public 	$valObj;
    public 	$result;
	public 	$db;
	private $dlang;
	public function __construct($db, $table, $valObj, $dlang) {
		$this->table 	                        = $table;
		$this->valObj 	                        = $valObj;
		$this->db 		                        = $db;
		$this->dlang							= $dlang;
		$this->table["head"]["lang"] 			= $table["head"]["lang"]?$table["head"]["lang"]:$this->dlang;
	}

	public function action() {
		$this->table["head"]["loading"]	= 0;
		switch($this->table["head"]["action"]) {
			case "load":
				$this->load();
				break;
		}
	}


	private function load() {
		$db 		= $this->db;
		$lang 		= $this->table["head"]["lang"];

		$tables 	= $this->table["schema"];
		$fftable	= $this->table["schema"]["fftable"]; 

		$pptable	= $this->table["schema"]["pptable"]; 
		$ppname 	= $pptable["name"];
		$ppid   	= $pptable["id"];
		$pptitle 	= $ppname . "." . ($pptable["title"]?$pptable["title"]:LANG::langCol("title", $lang));
		$ppdesc 	= $pptable["desc"]?$ppname . "." . $pptable["desc"]:$pptitle;
		
		$mmtable	= $this->table["schema"]["mmtable"]; 
		$mmname 	= $mmtable["name"];
		$mmid   	= $mmtable["id"];
		$mmpp   	= $mmtable["pid"];
		$mmtitle 	= $mmname . "." . ($mmtable["title"]?$mmtable["title"]:LANG::langCol("title", $lang));
		$mmdesc 	= $mmtable["desc"]?$mmname . "." . $mmtable["desc"]:$mmtitle;

		$sstable	= $this->table["schema"]["sstable"]; 
		$ssname 	= $sstable["name"];
		$ssid   	= $sstable["id"];
		$ssmm   	= $sstable["mid"];
		$sstitle 	= $ssname . "." . ($sstable["title"]?$sstable["title"]:LANG::langCol("title", $lang));
		$ssdesc 	= $sstable["desc"]?$ssname . "." . $sstable["desc"]:$sstitle;
		
		if( $pptable["name"] != "") {
			// pptable & mmtable & sstable
			$this->table["head"]["level"] = 1;
			
			$data 			= array();
			$query_pp       = $this->getQQ("pp");
			$result_pp		= $db->query($query_pp);
			$cntpp = 0;
			while( $row_pp = $db->fetch($result_pp) ) {
				$datapp = array();
				$datapp["id"] 			= $row_pp["pid"];
				$datapp["title"] 		= LANG::trans($row_pp["title"], $lang);
				$datapp["desciption"] 	= LANG::trans($row_pp["desciption"], $lang);
				$datapp["data"]			= array();
				
				$query_mm = $this->getQQ("mm", $datapp["id"]);
				$result_mm = $db->query($query_mm);
				$cntmm = 0;
				while($row_mm = $db->fetch($result_mm)) {
					$datamm = array();
					$datamm["id"] 			= $row_mm["mid"];
					$datamm["title"] 		= LANG::trans($row_mm["title"], $lang);
					$datamm["desciption"] 	= LANG::trans($row_mm["desciption"], $lang);
					$datamm["data"]			= array();
					
					$query_ss = $this->getQQ("ss", $datamm["id"]);
					$result_ss = $db->query($query_ss);
					$cntss = 0;
					while($row_ss = $db->fetch($result_ss)) {
						$datass = array();
						$datass["id"] 			= $row_ss["sid"];
						$datass["title"] 		= LANG::trans($row_ss["title"], $lang);
						$datass["desciption"] 	= LANG::trans($row_ss["desciption"], $lang);

						$datamm["data"][$cntss++] = $datass;				
					}
				
					$datapp["data"][$cntmm++] = $datamm;				
				}
				$data[$cntpp++] = $datapp;
			}
			//end of pptable & mmtable & sstable

		} else {
			if( $mmtable["name"] != "") {
				// mmtable & sstable
				$this->table["head"]["level"] = 2;
				$data 			= array();
				$query_mm 		= $this->getQQ("mm");
				$result_mm 		= $db->query($query_mm);
				$cntmm = 0;
				while($row_mm = $db->fetch($result_mm)) {
					$datamm = array();
					$datamm["id"] 			= $row_mm["mid"];
					$datamm["title"] 		= LANG::trans($row_mm["title"], $lang);
					$datamm["desciption"] 	= LANG::trans($row_mm["desciption"], $lang);
					$datamm["data"]			= array();
					
					$query_ss = $this->getQQ("ss", $datamm["id"]);
					$result_ss = $db->query($query_ss);
					$cntss = 0;
					while($row_ss = $db->fetch($result_ss)) {
						$datass = array();
						$datass["id"] 			= $row_ss["sid"];
						$datass["title"] 		= LANG::trans($row_ss["title"], $lang);
						$datass["desciption"] 	= LANG::trans($row_ss["desciption"], $lang);

						$datamm["data"][$cntss++] = $datass;				
					}
					$data[$cntmm++] = $datamm;				
				}
				// end of mmtable & sstable
				
			} else {
				// sstable
				$this->table["head"]["level"] = 3;
				$data 			= array();
				$query_ss = $this->getQQ("ss");
				$result_ss = $db->query($query_ss);
				$cntss = 0;
				while($row_ss = $db->fetch($result_ss)) {
					$datass = array();
					$datass["id"] 			= $row_ss["sid"];
					$datass["title"] 		= LANG::trans($row_ss["title"], $lang);
					$datass["desciption"] 	= LANG::trans($row_ss["desciption"], $lang);
					$data[$cntss++] 		= $datass;				
				}
				// end of sstable
			}
		}

		$sstable	= $this->table["schema"]["sstable"]; 
		$ssname = $sstable["name"];
		$ssid   = $sstable["id"];
		
		$valstr = implode(",", $this->valObj["val"]);
		if( $valstr != "") 	
			$criteria = "AND $ssname.$ssid IN (" . $valstr . ")";
		else 
			$criteria = "AND $ssname.$ssid IN (-1)";
				

		$query	= "SELECT $ssname.$ssid as sid, $sstitle as title
										FROM $ssname 
										WHERE $ssname.deleted <> 1 AND $ssname.status = 1 
											  $criteria 
										ORDER BY 
											$ssname.orderno DESC, $ssname.created_time ASC
										";
		$result = $db->query($query);
		$nnval 	= array();
		$nntxt  = array();
		while( $row = $db->fetch($result) ) {
			$nnval[] = $row["sid"];
			$nntxt[] = $row["title"];
		}
				
		$this->valObj["val"]	= $nnval;
		$this->valObj["text"]	= $nntxt;
		$this->table["data"] 	= $data;
		$this->result["data"] 	= $this->table["data"];
		$this->result["head"] 	= $this->table["head"];
		$this->result["schema"] = $this->table["schema"];
		
	}
	
	private function filter($col, $ff) {
		$db = $this->db;
		$val = "";
		if( $ff["name"] != "") {
			$fnn = $ff["name"];
			$fid = $ff["fid"];
			$vid = $ff["vid"];
			$fvv = $ff["val"];
			$query = "SELECT $vid FROM $fnn WHERE $fid = '" . $fvv . "'";
			$result = $db->query($query);
			while($row = $db->fetch($result)) {
				$val .= ($val==""?"":",") . $row[$vid];
			}
			
			if( $val!="" ) 
				$val = "AND $col IN (" . $val . ")";
			else 
				$val = "AND $col IN (-1)";
		}
		return $val;
	}
	
	private function getQQ($tt, $val) {
		$lang 			= $this->table["head"]["lang"];
		$tables 	= $this->table["schema"];
		$fftable	= $this->table["schema"]["fftable"]; 
		$pptable	= $this->table["schema"]["pptable"]; 
		$mmtable	= $this->table["schema"]["mmtable"]; 
		$sstable	= $this->table["schema"]["sstable"]; 
		
		$match   	= intval($this->table["head"]["match"])?1:0;

		$ppname 	= $pptable["name"];
		$ppid   	= $pptable["id"];
		$pptitle 	= $ppname . "." . ($pptable["title"]?$pptable["title"]:LANG::langCol("title", $lang));
		$ppdesc 	= $pptable["desc"]?$ppname . "." . $pptable["desc"]:$pptitle;
		
		$mmname 	= $mmtable["name"];
		$mmid   	= $mmtable["id"];
		$mmpp   	= $mmtable["pid"];
		$mmtitle 	= $mmname . "." . ($mmtable["title"]?$mmtable["title"]:LANG::langCol("title", $lang));
		$mmdesc 	= $mmtable["desc"]?$mmname . "." . $mmtable["desc"]:$mmtitle;

		$ssname 	= $sstable["name"];
		$ssid   	= $sstable["id"];
		$ssmm   	= $sstable["mid"];
		$sstitle 	= $ssname . "." . ($sstable["title"]?$sstable["title"]:LANG::langCol("title", $lang));
		$ssdesc 	= $sstable["desc"]?$ssname . "." . $sstable["desc"]:$sstitle;

		$sss_search = trim($this->table["schema"]["fval"])!=""?trim($this->table["schema"]["fval"]):"";
		if($sss_search != "") {
			$sss_search = LANG::trans($sss_search, $this->dlang);
			$criteria = "AND ( $ssname.title_en LIKE '%" . $sss_search . "%' OR $ssname.title_cn LIKE '%" . $sss_search . "%' OR $ssname.desc_en LIKE '%" . $sss_search . "%' OR $ssname.desc_cn LIKE '%" . $sss_search . "%' )"; 
		}
	
		if($ppname!="") $ppp_filter = $this->filter($ppname . "." . $ppid, $fftable);
		$query["pp"][1] = "SELECT 	distinct $ppname.$ppid as pid, 
										$pptitle 	as title, 
										$ppdesc 	as description
										FROM $ppname   
										INNER JOIN $mmname ON ($ppname.$ppid = $mmname.$mmpp) 
										INNER JOIN $ssname ON ($mmname.$mmid = $ssname.$ssmm) 
										WHERE $ppname.deleted <> 1 AND $ppname.status = 1 AND 
											  $mmname.deleted <> 1 AND $mmname.status = 1 AND 
											  $ssname.deleted <> 1 AND $ssname.status = 1  
											  $criteria 
											  $ppp_filter 
										ORDER BY 
											$ppname.orderno DESC, $ppname.created_time ASC
										";

		$query["pp"][0] = "SELECT 	distinct $ppname.$ppid as pid, 
										$pptitle 	as title, 
										$ppdesc 	as description 
										FROM $ppname 
										LEFT JOIN $mmname ON ($ppname.$ppid = $mmname.$mmpp) 
										LEFT JOIN $ssname ON ($mmname.$mmid = $ssname.$ssmm) 
										WHERE $ppname.deleted <> 1 AND $ppname.status = 1 
											  $criteria 
											  $ppp_filter 
										ORDER BY 
											$ppname.orderno DESC, $ppname.created_time ASC
										";



		if($ppname=="") $mmm_filter = $this->filter($mmname . "." . $mmid, $fftable);
		$query["mm"][1] = "SELECT 	distinct $mmname.$mmid as mid, 
										$mmtitle 	as title, 
										$mmdesc 	as description  
										FROM $mmname 
										INNER JOIN $ssname ON ($mmname.$mmid = $ssname.$ssmm) 
										WHERE " . ($val?"$mmname.$mmpp = '" . $val . "' AND":"") . "
											  $mmname.deleted <> 1 AND $mmname.status = 1 AND 
											  $ssname.deleted <> 1 AND $ssname.status = 1 
											  $criteria 
											  $mmm_filter 
										ORDER BY 
											$mmname.orderno DESC, $mmname.created_time ASC
										";

		$query["mm"][0] = "SELECT 	distinct $mmname.$mmid as mid, 
										$mmtitle 	as title, 
										$mmdesc 	as description 
										FROM $mmname 
										LEFT JOIN $ssname ON ($mmname.$mmid = $ssname.$ssmm) 
										WHERE " . ($val?"$mmname.$mmpp = '" . $val . "' AND":"") . " 
											  $mmname.deleted <> 1 AND $mmname.status = 1 
											  $criteria 
											  $mmm_filter 
										ORDER BY 
											$mmname.orderno DESC, $mmname.created_time ASC
										";


		if($ppname=="" && $mmtable=="") $sss_filter = $this->filter($ssname . "." . $ssid, $fftable);
		
		$query["ss"][1] = "SELECT 	$ssname.$ssid as sid, 
										$sstitle 	as title, 
										$ssdesc	 	as description  
										FROM $ssname 
										WHERE " . ($val?"$ssname.$ssmm = '" . $val . "' AND":"") . "
											  $ssname.deleted <> 1 AND $ssname.status = 1 
											  $criteria 
											  $sss_filter 
										ORDER BY 
											$ssname.orderno DESC, $ssname.created_time ASC
										";

		$query["ss"][0] = "SELECT 	$ssname.$ssid as sid, 
										$sstitle	as title, 
										$ssdesc		as description 
										FROM $ssname 
										WHERE " . ($val?"$ssname.$ssmm = '" . $val . "' AND":"") . " 
											  $ssname.deleted <> 1 AND $ssname.status = 1 
											  $criteria 
											  $sss_filter 
										ORDER BY 
											$ssname.orderno DESC, $ssname.created_time ASC
										";

		 return $query[$tt][$match];
	}
}
?>