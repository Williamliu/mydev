<?php
class cXMLPARSER {
	private $xml_str;
	private $xml_pr;
	private $level 		= -1;
	private $tagsName	= array();
	private $tagsCnt 	= array();
	
	private $xml_array 	= array();
	public  $way		= "handle";
	
	function __construct() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		if($pnum >= 1) {
			$xml_str = preg_replace('/>\s+</i','><',$params[0]);
		}
		
		$this->xml_pr = xml_parser_create();
		xml_parser_set_option( $this->xml_pr, XML_OPTION_CASE_FOLDING, 0 );
		xml_parser_set_option( $this->xml_pr, XML_OPTION_SKIP_TAGSTART, 0 );
		xml_parser_set_option( $this->xml_pr, XML_OPTION_SKIP_WHITE, 1 );
		xml_parser_set_option( $this->xml_pr, XML_OPTION_TARGET_ENCODING, "UTF-8");		
		
		$this->parse($xml_str);
	}
	
	function __destruct() {
		$this->xml_str 	= null;
		$this->level 	= null;
		$this->tagsName	= null;
		$this->tagsCnt 	= null;
		
		if( $this->xml_pr ) xml_parser_free($this->xml_pr);
	}
	
	function parse($xml_text) {
		$this->xml_str 		= $xml_text;
		$this->level		= -1;
		$this->tagsName		= array();
		$this->tagsCnt		= array();
		$this->xml_array	= array();
		
		$way = "parse_{$this->way}";
		$this->$way();
		
		/*
		echo "<pre>";
		print_r($this->xml_array);
		echo "</pre>";
		*/
	}
	
	public function toArray() {
		return $this->xml_array;
	}
	
	// walk through  XML  function 
	private function tag_start($xp, $name, $attr) {
		$this->level++;
		$this->tagsName[$this->level] = $name; 
		$this->tagsCnt[$this->level][$name]++;

		// reset  children level
		for( $i=$this->level + 1; $i < count($this->tagsName); $i++) {
			if(isset($this->tagsName[$i])) $this->tagsName[$i] = null;
			if(isset($this->tagsCnt[$i]) ) $this->tagsCnt[$i]  = null;
		}
		// end of reset 
				
		$keys = $this->get_key_handle($this->level);
		if( count($attr) > 0 ) {
			$eval = '$this->xml_array' . $keys["attr"] . ' = $attr;';
			eval($eval);
		}
	}
	
	private function tag_end($xp, $name) {
		$this->level--;
	}
	
	private function el_data($xp, $val) {
		$keys = $this->get_key_handle($this->level);
		$eval = '$this->xml_array' . $keys["value"] . ' =  $val;';
		eval($eval);
	}


	// XML nodes and node
	public function nodes( $path ) {
		$xmlObj = new cXMLNODE($this->xml_array);
		$nodes 	= $xmlObj->nodes($path);
		return $nodes;
	}
	
	public function node($path) {
		$xmlObj = new cXMLNODE($this->xml_array);
		$node 	= $xmlObj->node($path);
		return $node;
	}
	
	public function tagAttr($path) {
		$p = explode("=>",$path);
		$attr = array();
		if( $path != "" ) {		
			$newArray = $this->xml_array;
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s:]*)(?:\[(\S)\])?+:?(\S*)$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;
				$pidd 	= $ma[3]?$ma[3]:"";
				if( $i < (count($p) - 1) ) {
					$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				} else {
					if($pidd != "") {
						if($pname!="") 
							$newFinal = cXMLNODE::getSubArray($newArray, $pname, $pidx, "attr", $pidd);
						else 
							$newFinal = cXMLNODE::getSubArray($this->xarray, "attr", $pidd);
						
					} else {	
						$newFinal = cXMLNODE::getSubArray($newArray, $pname, $pidx, "attr");
					}
				}
			}
			$attr = $newFinal;			
		} 
		return $attr;
	}

	// other support function 
	private function parse_handle() {
			  xml_set_element_handler( $this->xml_pr, array($this, "tag_start"), array($this, "tag_end"));
			  xml_set_character_data_handler( $this->xml_pr, array($this, "el_data"));
			  xml_parse($this->xml_pr, $this->xml_str);
	}
	
	private function parse_struct() {
			  xml_parse_into_struct( $this->xml_pr, $this->xml_str, $vals, $index);
			  foreach( $vals as $val ) {
				  switch($val["type"]) {
					  case "open":
						  $this->tagsName[$val["level"]] = $val["tag"];
						  $this->tagsCnt[$val["level"]][$val["tag"]]++;
						  
						  // reset  children level
						  for( $i=$val["level"] + 1; $i <= count($this->tagsName); $i++) {
							  if(isset($this->tagsName[$i])) $this->tagsName[$i] = null;
							  if(isset($this->tagsCnt[$i]) ) $this->tagsCnt[$i]  = null;
						  }
						  // end of reset 
			  
						  $keys 	= $this->get_key_struct($val["level"]);
						  $tattr 	= $val["attributes"];
						  if( count($tattr) > 0 ) {
							  $eval = '$this->xml_array' . $keys["attr"] . ' = $tattr;';
							  eval($eval);
						  }
						  break;
					  case "close":
						  break;
					  case "complete":
						  $this->tagsName[$val["level"]] = $val["tag"];
						  $this->tagsCnt[$val["level"]][$val["tag"]]++;
			  
						  // reset  children level
						  for( $i=$val["level"] + 1; $i <= count($this->tagsName); $i++) {
							  if(isset($this->tagsName[$i])) $this->tagsName[$i] = null;
							  if(isset($this->tagsCnt[$i]) ) $this->tagsCnt[$i]  = null;
						  }
						  // end of reset 
						  
						  $keys = $this->get_key_struct($val["level"]); 
						  $tval = $val["value"];
						  $eval = '$this->xml_array' . $keys["value"] . ' =  $tval;';
						  eval($eval);
			  
						  $tattr 	= $val["attributes"];
						  if( count($tattr) > 0 ) {
							  $eval = '$this->xml_array' . $keys["attr"] . ' = $tattr;';
							  eval($eval);
						  }
						  break;
				  }
			  }
	}
	
	// struct  level index  start from 1    ,   so  ( 1 ~ level -1) + level  
	private function get_key_struct( $level ) {
		$key 		= '';
		$keys 		= array();


		for($i = 1; $i <= $level-1; $i++) {
			$idx = $this->tagsCnt[$i][$this->tagsName[$i]]<=0?0:$this->tagsCnt[$i][$this->tagsName[$i]]-1;
			$key .= '[' . $this->tagsName[$i] . '][' . $idx . '][value]';
		}

		$idx = $this->tagsCnt[$level][$this->tagsName[$level]]<=0?0:$this->tagsCnt[$level][$this->tagsName[$level]]-1;
		$key_last = '[' . $this->tagsName[$level] . '][' . $idx . ']';

		$keys["attr"] 	= $key . $key_last . "[attr]" ;
		$keys["value"] 	= $key . $key_last . "[value]" ;
		return $keys;
	}

	// handler level index start from 0:   so ( 0 ~ level - 1) + level 
	private function get_key_handle( $level ) {
		$key 		= '';
		$keys 		= array();

		for($i = 0; $i <= $level-1; $i++) {
			$idx = $this->tagsCnt[$i][$this->tagsName[$i]]<=0?0:$this->tagsCnt[$i][$this->tagsName[$i]]-1;
			$key .= '[' . $this->tagsName[$i] . '][' . $idx . '][value]';
		}
		
		$idx = $this->tagsCnt[$level][$this->tagsName[$level]]<=0?0:$this->tagsCnt[$level][$this->tagsName[$level]]-1;
		$key_last = '[' . $this->tagsName[$level] . '][' . $idx . ']';
		$keys["attr"] 	= $key . $key_last . "[attr]" ;
		$keys["value"] 	= $key . $key_last . "[value]" ;
		return $keys;
	}
}

class cXMLNODE {
	private $xarray = array();
	function __construct( $xml_arr ) {
		if( is_array($xml_arr) ) 
			$this->xarray = $xml_arr;
		else 
			$this->xarray = array();
	}

	public function show() {
		echo "<br>show<pre>";
		print_r($this->xarray);
		echo "</pre><br>";
	}
	
	public function nodes($path) {
		$nodes = array();
		$p = explode("=>",$path);
		if( $path != "" ) {		
			$newArray = $this->xarray;
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s]+)(?:\[(\S)\])?+$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;

				if( $i < (count($p) - 1) ) {
					$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				} else {
					if( $pidx > 0 ) 
						$newFinal[0] = cXMLNODE::getSubArray($newArray, $pname, $pidx);
					else 
						$newFinal = cXMLNODE::getSubArray($newArray, $pname); 
				}
			}
			
			if( is_array( $newFinal ) ) {
				foreach( $newFinal as $key=>$val ) {
					$nodes[$key] = new cXMLNODE($val);			
				}
			}
		}
		return $nodes;
	}
	
	public function node($path) {
		$node = null;
		$p = explode("=>",$path);
		if( $path != "" ) {		
			$newArray = $this->xarray;
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s]+)(?:\[(\S)\])?+$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;

				if( $i < (count($p) - 1) ) {
						$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				} else {
						$newFinal = cXMLNODE::getSubArray($newArray, $pname, $pidx);
				}
			}
			
			$node = new cXMLNODE($newFinal);			
		} else {
			$node = new cXMLNODE();
		}
		return $node;
	}
	
	public function value() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		$path = '';
		if($pnum >= 1) {
			$path = $params[0];
		}
		$p = explode("=>",$path);
		
		$newArray = $this->xarray["value"];
		if( $path != "" ) {		
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s]+)(?:\[(\S)\])?+$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;
				if( $i < (count($p) ) ) {
					$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				}
			}
		} 
		return $newArray;
	}
	
	public function attr() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		$path = '';
		if($pnum >= 1) {
			$path = $params[0];
		}
		$p = explode("=>",$path);

		$attr = array();
		if( $path != "" ) {		
			$newArray = $this->xarray["value"];
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s:]*)(?:\[(\S)\])?+:?(\S*)$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;
				$pidd 	= $ma[3]?$ma[3]:"";
				if( $i < (count($p) - 1) ) {
					$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				} else {
						if($pidd != "") {
							if($pname!="") 
								$newFinal = cXMLNODE::getSubArray($newArray, $pname, $pidx, "attr", $pidd);
							else 
								$newFinal = cXMLNODE::getSubArray($this->xarray, "attr", $pidd);
							
						} else {	
							$newFinal = cXMLNODE::getSubArray($newArray, $pname, $pidx, "attr");
						}
				}
			}
			$attr = $newFinal;			
		} else {
			$attr = $this->xarray["attr"];
		}
		return $attr;
	}
	
	public function hasChild() {
		$pnum 	= func_num_args();
		$params	= func_get_args();
		$path = '';
		if($pnum >= 1) {
			$path = $params[0];
		}
		$p = explode("=>",$path);
		
		if( $path != "" ) {		
			$newArray = $this->xarray["value"];
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s]+)(?:\[(\S)\])?+$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;
				if( $i < (count($p) - 1 ) ) {
					$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				} else {
					if($ma[2]!="") {
						$newFinal = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
						return is_array($newFinal)?true:false;
					} else {
						$newFinal = cXMLNODE::getSubArray($newArray, $pname);
						return is_array($newFinal) && count($newFinal)>1?true:false;
					}
				}
			}
		} else {
			$newFinal = $this->xarray["value"];
			return is_array($newFinal)?true:false;
		}
	}
	
	public function children( $path ) {
		$nodes = array();
		$p = explode("=>",$path);
		if( $path != "" ) {		
			$newArray = $this->xarray["value"];
			for($i  = 0 ; $i < count($p); $i++) {
				$pa = "/^([^\[\]\s]+)(?:\[(\S)\])?+$/i";
				$ma = array();
				preg_match($pa, $p[$i], $ma);
				$pname 	= $ma[1];
				$pidx	= $ma[2]?$ma[2]:0;

				if( $i < (count($p) - 1) ) {
					$newArray = cXMLNODE::getSubArray($newArray, $pname, $pidx, "value");
				} else {
					if( $pidx > 0 ) 
						$newFinal[0] = cXMLNODE::getSubArray($newArray, $pname, $pidx);
					else 
						$newFinal = cXMLNODE::getSubArray($newArray, $pname);
				}
			}
			
			if( is_array( $newFinal ) ) {
				foreach( $newFinal as $key=>$val ) {
					$nodes[$key] = new cXMLNODE($val);			
				}
			}
		}
		return $nodes;
	}
	
	// support function 
	static public function  getSubArray() {
		$newArr = null;

		$pnum 	= func_num_args();
		$params	= func_get_args();
		
		if($pnum >= 1) {
			$arr = $params[0];
			if( is_array($arr) ) {
				$key = '';
				for($i = 1; $i < $pnum ; $i++) {
					$key .= '[' . $params[$i] . ']';
				}
				$eval = '$newArr=$arr' . $key . ';';
				//echo "eval:" . $eval . "<br>";
				eval($eval);
			}
		}
		return $newArr;
	}
}
?>
