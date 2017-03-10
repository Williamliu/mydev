<?php
$a = "dkfadskfds;base64,/9dkfjasdk";
$b = substr( $a, strpos($a, "base64,") + strlen("base64,"));
echo "b=$b";
echo "<br>";
echo "<br>";
echo "<br>";

class cARRAY {
	static public function arrayFilter($arr, $kv) {
        $ret = array();
        foreach($arr as $ar ) {
                $match = true;
                if(is_array($kv) ) {
                    foreach($kv as $key=>$val) {
                        echo "$key = $val  val=" . $ar[$key] . "<br>";
                        if( $ar[$key]!=$val ) {
                            $match=false;
                            break;
                        }
                    }
                } else {
                    $match = false;
                }
                if($match) $ret[] = $ar;
        }
        return $ret;
	}
	static public function arrayIndex($arr, $kv ) {
		$ret_idx = -1;
		$match = true;
		foreach($arr as $idx=>$obj) {
			$match = true;
			foreach( $kv as $key=>$val ) {
				if( $obj[$key] != $val ) $match = false; 
			}

			if($match) {
				$ret_idx = $idx;
				break;
			}
		}
		return $ret_idx;
	}

	static public function arrayMerge($arr1, $arr2) {
		return array_merge($arr1, $arr2);
	}
}

$a = array();
$a[] = array("key"=>1, "id"=>10, "name"=>"AAAA");
$a[] = array("key"=>0, "id"=>20, "name"=>"BBBB");
$a[] = array("key"=>1, "id"=>30, "name"=>"BBBB");
$a[] = array("key"=>0, "id"=>40, "name"=>"CCCC");
$a[] = array("key"=>1, "id"=>50, "name"=>"DDDDD");
$a[] = array("key"=>1, "id"=>60, "name"=>"BBBB");

$b = cARRAY::arrayFilter($a, array("key"=>1));
print_r($b);

$a = array("aaa", "ddd");
$b = array("ccc","aaa");
print_r( array_merge($a, $b) );
?>

<script>
</script>