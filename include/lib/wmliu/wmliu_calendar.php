<?php
class WMLIUCALENDAR {
    public  $table;
    public  $result;
    public  $vlist;
	private $db;
	private $dlang;
	private $query;
    private $query1;
	public function __construct($db, $calendar, $dlang) {
		$this->calendar     = $calendar;
		$this->db 			= $db;
		$this->dlang		= $dlang;
        $this->calendar["list"]["head"]["lang"] = $calendar["list"]["head"]["lang"]?$calendar["list"]["head"]["lang"]:$this->dlang;
		$this->action();
	}
    
	private function action() {
        $this->calendar["list"]["head"]["loading"] = 0;
		switch($this->calendar["list"]["head"]["action"]) {
            case "load":
                $this->calendar["list"]["vals"] = $this->load();
                // response data;
                $this->result["schema"]["idvals"]   = $this->calendar["schema"]["idvals"];
                $this->result["list"]["head"]       = $this->calendar["list"]["head"];
                $this->result["list"]["vals"]       = $this->calendar["list"]["vals"];
                break;
		}
	}

	private function load() {
		$db = $this->db;

        $pptable    = $this->calendar["schema"]["table"]["pptable"]["name"];
        $pcol       = $this->calendar["schema"]["table"]["pptable"]["col"];
        $pid        = $this->calendar["schema"]["idvals"]["pid"];

        $qqtable    = $this->calendar["schema"]["table"]["qqtable"]["name"];
        $qcol       = $this->calendar["schema"]["table"]["qqtable"]["col"];


        $mmtable    = $this->calendar["schema"]["table"]["mmtable"]["name"];
        $mpref      = $this->calendar["schema"]["table"]["mmtable"]["pref"];
        $msref      = $this->calendar["schema"]["table"]["mmtable"]["sref"];

        $sstable    = $this->calendar["schema"]["table"]["sstable"]["name"];
        $scol       = $this->calendar["schema"]["table"]["sstable"]["col"];
        $spref      = $this->calendar["schema"]["table"]["sstable"]["pref"];
        $sid        = $this->calendar["schema"]["idvals"]["sid"];
		
		$curY		= $this->calendar["schema"]["current"]["Y"];
		$curM		= $this->calendar["schema"]["current"]["M"];
		$fdate		= date("Y-m-d", mktime(0,0,0, $curM + 1, 1, $curY));
		$ldate		= date("Y-m-d", mktime(0,0,0, $curM + 2, 0, $curY));

        $ddtable    = $this->calendar["schema"]["table"]["ddtable"]["name"];
        $dcol       = $this->calendar["schema"]["table"]["ddtable"]["col"];

        $schObj 	= $this->calendar["schema"]["views"]["schtype"];
		$datetype	= $schObj["date_type"];
		$start_date	= $schObj["start_date"];
		$end_date	= $schObj["end_date"];
		$once_date	= $schObj["once_date"];
		$state	    = $schObj["state"];
		$statein	= $schObj["statein"];
		$public 	= $this->calendar["list"]["head"]["public"]?true:false;

		$table_start_date 	= $this->calendar["schema"]["cols"][$start_date]["table"]?$this->calendar["schema"]["cols"][$start_date]["table"]:"sstable";
		$table_end_date 	= $this->calendar["schema"]["cols"][$end_date]["table"]?$this->calendar["schema"]["cols"][$end_date]["table"]:"sstable";
		$table_once_date 	= $this->calendar["schema"]["cols"][$once_date]["table"]?$this->calendar["schema"]["cols"][$once_date]["table"]:"sstable";
		$table_state 	    = $this->calendar["schema"]["cols"][$state]["table"]?$this->calendar["schema"]["cols"][$state]["table"]:"sstable";
		
		$tab_sd = $this->calendar["schema"]["table"][$table_start_date]["name"];
		$tab_ed = $this->calendar["schema"]["table"][$table_end_date]["name"];
		$tab_od = $this->calendar["schema"]["table"][$table_once_date]["name"];
		$tab_st = $this->calendar["schema"]["table"][$table_state]["name"];

        $criteria   = "";
      	$pppid		= WMSEARCH::searchID($this->calendar["schema"]["table"]["pptable"], $pid);
	    $ppccc      = WMSEARCH::filter($this->calendar["schema"]["table"]["pptable"], $this->calendar["schema"]["filterVals"]["pptable"]);
        $qqccc      = WMSEARCH::filter($this->calendar["schema"]["table"]["qqtable"], $this->calendar["schema"]["filterVals"]["qqtable"]);
        $ssccc      = WMSEARCH::filter($this->calendar["schema"]["table"]["sstable"], $this->calendar["schema"]["filterVals"]["sstable"]);
      	$sssid		= WMSEARCH::searchID($this->calendar["schema"]["table"]["sstable"], $sid);
        $ddccc      = WMSEARCH::filter($this->calendar["schema"]["table"]["ddtable"], $this->calendar["schema"]["filterVals"]["ddtable"]);


        $criteria   = WMSEARCH::concat($criteria, $pppid);
        $criteria   = WMSEARCH::concat($criteria, $ppccc);
        $criteria   = WMSEARCH::concat($criteria, $qqccc);
        $criteria   = WMSEARCH::concat($criteria, $sssid);
        $criteria   = WMSEARCH::concat($criteria, $ssccc);
        $criteria   = WMSEARCH::concat($criteria, $ddccc);

		if($state!="" && $statein!="") {
	        $criteria   = WMSEARCH::concat($criteria, "$tab_st.$state IN ($statein)");
		}


        $fields_ss     = $this->getCol();     
        $field_ss_str  = "";
        foreach($fields_ss as $field) {
            $field_ss_str .= ($field_ss_str==""?"":", ") . $field;
        }

		$event_date_criteria = "";
 		if( $once_date!="" ) $event_date_criteria = "($tab_od.$once_date >= '".$fdate."' AND $tab_od.$once_date <= '".$ldate."')";
		
		
		$datetype_criteria = "";
		if($datetype!="") {
			if($start_date!="") $sss = "$tab_sd.$start_date > '". $ldate . "'";
			if($end_date!="") 	$ttt = "$tab_ed.$end_date < '".$fdate."'";
			if($sss!="" && $ttt!="") 
				$datetype_criteria = "NOT (" . $sss . " OR " . $ttt . ")";
			else if($sss!="")
				$datetype_criteria = "NOT " . $sss;
			else 
				$datetype_criteria = "NOT " . $ttt;
			
		}
			
		if($event_date_criteria!="" && $datetype_criteria != "")  
			$criteria  = WMSEARCH::concat($criteria, "(" . $event_date_criteria . " OR " . $datetype_criteria . ")" );
		else if($event_date_criteria!="")
			$criteria  = SEARCH::concat($criteria, $event_date_criteria);
		else 
			$criteria  = WMSEARCH::concat($criteria, $datetype_criteria);
		
		
		
        if($qqtable!="") $qq_join = "INNER JOIN $qqtable ON ($pptable.$pcol = $qqtable.$qcol)";
        if($ddtable!="") $dd_join = "INNER JOIN $ddtable ON ($sstable.$scol = $ddtable.$dcol)";

		if($pptable!="") {
			if($mmtable!="") {
				$this->query = "SELECT  $pptable.$pcol as pid, $sstable.$scol as sid, $field_ss_str  
										FROM $pptable 
										$qq_join 
										INNER JOIN $mmtable ON ($pptable.$pcol  = $mmtable.$mpref) 
										INNER JOIN $sstable ON ($mmtable.$msref = $sstable.$scol) 
										$dd_join 
										WHERE   $pptable.deleted <> 1 AND   
												$sstable.deleted <> 1  
												$criteria 
										ORDER BY $pptable.$pcol, $sstable.$scol";        
			} else {
				$this->query = "SELECT  $pptable.$pcol as pid, $sstable.$scol as sid, $field_ss_str
										FROM $pptable 
										$qq_join 
										INNER JOIN $sstable ON ($pptable.$pcol = $sstable.$spref) 
										$dd_join 
										WHERE   $pptable.deleted <> 1 AND 
												$sstable.deleted <> 1  
												$criteria 
										ORDER BY $pptable.$pcol, $sstable.$scol";        
			}
		} else {
				$this->query = "SELECT  '' as pid, $sstable.$scol as sid, $field_ss_str
										FROM $sstable 
										$dd_join 
										WHERE   $sstable.deleted <> 1  
												$criteria 
										ORDER BY $sstable.$scol";        
		}


		// debug info
        $this->calendar["list"]["head"]["query"]       = $this->query;
        $this->calendar["list"]["head"]["criteria"]    = $criteria;
		$this->calendar["list"]["head"]["dateS"]	   = date("Y-m-d", mktime(0,0,0, $curM + 1, 1, $curY));
		$this->calendar["list"]["head"]["dateE"]	   = date("Y-m-d", mktime(0,0,0, $curM + 2, 0, $curY));

		$calArr = array();
		$result = $db->query( $this->query );

        while( $row = $db->fetch($result)) {
               switch( $row[$schObj["date_type"]] ) {
                    case "Once":
                        $curdate = $row[$schObj["once_date"]];
                        if($curdate > 0) {
                            $curcnt  = count($calArr[$curdate]);
                        
                            $calArr[$curdate][$curcnt]["pid"]                   = $row["pid"];
                            $calArr[$curdate][$curcnt]["sid"]                   = $row["sid"];
                            $calArr[$curdate][$curcnt]["calendar_date"]         = $curdate;
                            $calArr[$curdate][$curcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
                            $calArr[$curdate][$curcnt][$schObj["once_date"]]    = getSDate($row[$schObj["once_date"]]);
                            $calArr[$curdate][$curcnt][$schObj["start_time"]]   = getSTime($row[$schObj["start_time"]]);
                            $calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
                            $calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], $row[$schObj["end_time"]]);
                            
                            if( $row[$schObj["end_time"]] > 0 && $row[$schObj["end_time"]] < $row[$schObj["start_time"]] ) {
                                $calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime("24:00:00");    
                                $calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], "24:00");
                                
       							$nextdate = date("Y-m-d", strtotime($row[$schObj["once_date"]]) + 24 * 3600);
                                $nextcnt  = count($calArr[$nextdate]);

                                $calArr[$nextdate][$nextcnt]["pid"]                   = $row["pid"];
                                $calArr[$nextdate][$nextcnt]["sid"]                   = $row["sid"];
                                $calArr[$nextdate][$nextcnt]["calendar_date"]         = $nextdate;
	                            $calArr[$nextdate][$nextcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
                                $calArr[$nextdate][$nextcnt][$schObj["once_date"]]    = getSDate($nextdate);
                                $calArr[$nextdate][$nextcnt][$schObj["start_time"]]   = getSTime("00:00:00");
                                $calArr[$nextdate][$nextcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
                                $calArr[$nextdate][$nextcnt]["time_range"]            = "00:00~". getSTime($row[$schObj["end_time"]]);

							    foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
								    switch($colObj["type"]) {
									    case "hidden":
        							    case "text":
		    							    $calArr[$nextdate][$nextcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
										    break;
								    }
							    }
                            }


							foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
								switch($colObj["type"]) {
									case "hidden":
        							case "text":
		    							$calArr[$curdate][$curcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
										break;
								}
							}
                            
                        }
                        break;
                    case "Daily":
					    for($i=1; $i<= date("d", mktime(0,0,0,$curM+2,0, $curY)); $i++) {
                            $curdate = date("Y-m-d", mktime(0,0,0, $curM + 1, $i, $curY));
                            if($curdate > 0) {
                                $curcnt  = count($calArr[$curdate]);
                        
                                $calArr[$curdate][$curcnt]["pid"]                   = $row["pid"];
                                $calArr[$curdate][$curcnt]["sid"]                   = $row["sid"];
                                $calArr[$curdate][$curcnt]["calendar_date"]         = $curdate;
	                            $calArr[$curdate][$curcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
                                $calArr[$curdate][$curcnt][$schObj["once_date"]]    = getSDate($row[$schObj["once_date"]]);
                                $calArr[$curdate][$curcnt][$schObj["start_time"]]   = getSTime($row[$schObj["start_time"]]);
                                $calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
                                $calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], $row[$schObj["end_time"]]);
                            
                                if( $row[$schObj["end_time"]] > 0 && $row[$schObj["end_time"]] < $row[$schObj["start_time"]] ) {
                                    $calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime("24:00:00");    
                                    $calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], "24:00");
                                    
       							    $nextdate = date("Y-m-d", mktime(0,0,0, $curM + 1, $i+1, $curY));
                                    $nextcnt  = count($calArr[$nextdate]);

                                    $calArr[$nextdate][$nextcnt]["pid"]                   = $row["pid"];
                                    $calArr[$nextdate][$nextcnt]["sid"]                   = $row["sid"];
                                    $calArr[$nextdate][$nextcnt]["calendar_date"]         = $nextdate;
		                            $calArr[$nextdate][$nextcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
                                    $calArr[$nextdate][$nextcnt][$schObj["once_date"]]    = getSDate($nextdate);
                                    $calArr[$nextdate][$nextcnt][$schObj["start_time"]]   = getSTime("00:00");
                                    $calArr[$nextdate][$nextcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
                                    $calArr[$nextdate][$nextcnt]["time_range"]            = "00:00~" . getSTime($row[$schObj["end_time"]]);

							        foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
								        switch($colObj["type"]) {
									        case "hidden":
        							        case "text":
		    							        $calArr[$nextdate][$nextcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
										        break;
								        }
							        }
                                }


							    foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
								    switch($colObj["type"]) {
									    case "hidden":
        							    case "text":
		    							    $calArr[$curdate][$curcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
										    break;
								    }
							    }
                            
                            }
                        }
                        break;
                    case "Weekly":
						$dateSets = explode(",",$row[$schObj["date_sets"]]);
						for($i=1; $i<= date("d", mktime(0,0,0,$curM+2, 0, $curY)); $i++) {
							$curdate 	= date("Y-m-d", mktime(0,0,0, $curM + 1, $i, $curY));
							$wd 		= date("w", mktime(0,0,0, $curM + 1, $i, $curY));
							if( in_array($wd, $dateSets) ) {
								if($curdate >= $row[$schObj["start_date"]] && $curdate <= $row[$schObj["end_date"]]) {
	
										$curcnt = count($calArr[$curdate]);
										$calArr[$curdate][$curcnt]["pid"]                   = $row["pid"];
										$calArr[$curdate][$curcnt]["sid"]                   = $row["sid"];
                                        $calArr[$curdate][$curcnt]["calendar_date"]         = $curdate;
										$calArr[$curdate][$curcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
										$calArr[$curdate][$curcnt][$schObj["once_date"]]    = getSDate($row[$schObj["once_date"]]);
										$calArr[$curdate][$curcnt][$schObj["start_time"]]   = getSTime($row[$schObj["start_time"]]);
										$calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
										$calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], $row[$schObj["end_time"]]);
										
										// cross to next day
        		                        if( $row[$schObj["end_time"]] > 0 && $row[$schObj["end_time"]] < $row[$schObj["start_time"]] ) {
											$calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime("24:00:00");    
											$calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], "24:00");
												
										
											$nextdate = date("Y-m-d", mktime(0,0,0, $curM + 1, $i+1, $curY));
											$nextcnt  = count($calArr[$nextdate]);
		
											$calArr[$nextdate][$nextcnt]["pid"]                   = $row["pid"];
											$calArr[$nextdate][$nextcnt]["sid"]                   = $row["sid"];
                                            $calArr[$nextdate][$nextcnt]["calendar_date"]         = $nextdate;
											$calArr[$nextdate][$nextcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
											$calArr[$nextdate][$nextcnt][$schObj["once_date"]]    = getSDate($nextdate);
											$calArr[$nextdate][$nextcnt][$schObj["start_time"]]   = getSTime("00:00");
											$calArr[$nextdate][$nextcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
											$calArr[$nextdate][$nextcnt]["time_range"]            = "00:00~" . getSTime($row[$schObj["end_time"]]);
		
											foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
												switch($colObj["type"]) {
													case "hidden":
													case "text":
														$calArr[$nextdate][$nextcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
														break;
												}
											}
										}
										// end of cross to next day
					
										foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
											switch($colObj["type"]) {
												case "hidden":
												case "text":
													$calArr[$curdate][$curcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
													break;
											}
										}

								}
							}
						}
                        break;
                    case "Monthly":
						$dateSets  = explode(",",$row[$schObj["date_sets"]]);
                        $last_date = date("d", mktime(0,0,0,$curM+2,0, $curY));
                        if( in_array(31, $dateSets) )
                        if( !in_array($last_date, $dateSets) ) $dateSets[] = $last_date; 
						for($i=1; $i<= date("d", mktime(0,0,0,$curM+2,0, $curY)); $i++) {
							if( in_array($i, $dateSets) ) {
								$curdate = date("Y-m-d", mktime(0,0,0, $curM + 1, $i, $curY));
								if($curdate >= $row[$schObj["start_date"]] && $curdate <= $row[$schObj["end_date"]]) {
	
										$curcnt = count($calArr[$curdate]);
										$calArr[$curdate][$curcnt]["pid"]                   = $row["pid"];
										$calArr[$curdate][$curcnt]["sid"]                   = $row["sid"];
                                        $calArr[$curdate][$curcnt]["calendar_date"]         = $curdate;
										$calArr[$curdate][$curcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
										$calArr[$curdate][$curcnt][$schObj["once_date"]]    = getSDate($row[$schObj["once_date"]]);
										$calArr[$curdate][$curcnt][$schObj["start_time"]]   = getSTime($row[$schObj["start_time"]]);
										$calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
										$calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], $row[$schObj["end_time"]]);
										
										// cross to next day
        		                        if( $row[$schObj["end_time"]] > 0 && $row[$schObj["end_time"]] < $row[$schObj["start_time"]] ) {
											$calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime("24:00:00");    
											$calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], "24:00");
												
										
											$nextdate = date("Y-m-d", mktime(0,0,0, $curM + 1, $i+1, $curY));
											$nextcnt  = count($calArr[$nextdate]);
		
											$calArr[$nextdate][$nextcnt]["pid"]                   = $row["pid"];
											$calArr[$nextdate][$nextcnt]["sid"]                   = $row["sid"];
                                            $calArr[$nextdate][$nextcnt]["calendar_date"]         = $nextdate;
											$calArr[$nextdate][$nextcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
											$calArr[$nextdate][$nextcnt][$schObj["once_date"]]    = getSDate($nextdate);
											$calArr[$nextdate][$nextcnt][$schObj["start_time"]]   = getSTime("00:00");
											$calArr[$nextdate][$nextcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
											$calArr[$nextdate][$nextcnt]["time_range"]            = "00:00~" . getSTime($row[$schObj["end_time"]]);
		
											foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
												switch($colObj["type"]) {
													case "hidden":
													case "text":
														$calArr[$nextdate][$nextcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
														break;
												}
											}
										}
										// end of cross to next day
					
										foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
											switch($colObj["type"]) {
												case "hidden":
												case "text":
													$calArr[$curdate][$curcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
													break;
											}
										}
								
								}
							}
						}
                        break;
                    default:
                        $curdate = $row[$schObj["once_date"]];
                        if($curdate > 0) {
                            $curcnt  = count($calArr[$curdate]);
                        
                            $calArr[$curdate][$curcnt]["pid"]                   = $row["pid"];
                            $calArr[$curdate][$curcnt]["sid"]                   = $row["sid"];
                            $calArr[$curdate][$curcnt]["calendar_date"]         = $curdate;
                            $calArr[$curdate][$curcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
                            $calArr[$curdate][$curcnt][$schObj["once_date"]]    = getSDate($row[$schObj["once_date"]]);
                            $calArr[$curdate][$curcnt][$schObj["start_time"]]   = getSTime($row[$schObj["start_time"]]);
                            $calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
                            $calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], $row[$schObj["end_time"]]);
                            
                            if( $row[$schObj["end_time"]] > 0 && $row[$schObj["end_time"]] < $row[$schObj["start_time"]] ) {
                                $calArr[$curdate][$curcnt][$schObj["end_time"]]     = getSTime("24:00:00");    
                                $calArr[$curdate][$curcnt]["time_range"]            = getSTimeRange($row[$schObj["start_time"]], "24:00");
                                
       							$nextdate = date("Y-m-d", strtotime($row[$schObj["once_date"]]) + 24 * 3600);
                                $nextcnt  = count($calArr[$nextdate]);

                                $calArr[$nextdate][$nextcnt]["pid"]                   = $row["pid"];
                                $calArr[$nextdate][$nextcnt]["sid"]                   = $row["sid"];
                                $calArr[$nextdate][$nextcnt]["calendar_date"]         = $nextdate;
	                            $calArr[$nextdate][$nextcnt][$schObj["date_type"]]    = $row[$schObj["date_type"]];
                                $calArr[$nextdate][$nextcnt][$schObj["once_date"]]    = getSDate($nextdate);
                                $calArr[$nextdate][$nextcnt][$schObj["start_time"]]   = getSTime("00:00:00");
                                $calArr[$nextdate][$nextcnt][$schObj["end_time"]]     = getSTime($row[$schObj["end_time"]]);
                                $calArr[$nextdate][$nextcnt]["time_range"]            = "00:00~" . getSTime($row[$schObj["end_time"]]);

							    foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
								    switch($colObj["type"]) {
									    case "hidden":
        							    case "text":
		    							    $calArr[$nextdate][$nextcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
										    break;
								    }
							    }
                            }


							foreach( $this->calendar["schema"]["cols"] as $colName=>$colObj ) {
								switch($colObj["type"]) {
									case "hidden":
        							case "text":
		    							$calArr[$curdate][$curcnt][$colName] = LANG::trans($row[$colName], $this->calendar["list"]["head"]["lang"]);
										break;
								}
							}
                            
                        }
                        break;
               }  
        }      
		
		return $calArr;
	}
	
	private function getCol() {
	    $temp = array();
        foreach($this->calendar["schema"]["cols"] as $colName=>$colObj) {
            switch($colObj["type"]) {
	            case "hidden":
                case "seal":
	            case "text":
                case "select":
                case "bool":
                    $colObj["table"] = $colObj["table"]?$colObj["table"]:"sstable";
                    $table = $this->calendar["schema"]["table"][$colObj["table"]]["name"];
                    // if ddtable empty , then sstable
                    //if($table=="") $table = $this->table["schema"]["head"]["sstable"]["name"];
                    if($table!="") $temp[] = "$table.$colName";
					break;
			}
		}
		return $temp;
	}
}

function getSDate($dt) {
    return $dt>0 ? $dt : "";
}

function getSTime($tt) {
    $ret_str = "";
    if($tt>0) {
        if(strlen($tt)>5) 
            $ret_str = substr($tt, 0, strrpos($tt,":"));
    }
    return $ret_str;
}

function getSTimeRange($st, $et) {
    $ret_str = "";
    if($st>0) 
        if(strlen($st)>5)
            $ret_str = substr($st, 0, strrpos($st,":"));
        else 
            $ret_str = $st;

    if($et>0) 
        if(strlen($et)>5) 
            $ret_str .= ($ret_str!=""?"~":"") . substr($et, 0, strrpos($et,":"));
        else 
            $ret_str .= ($ret_str!=""?"~":"") . $et;

    return $ret_str;
}
?>
