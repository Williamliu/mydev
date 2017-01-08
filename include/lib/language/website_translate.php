<?php
class LANG {
	public static function getWords() {
		global $CFG;
		global $db;
		$def_o 	= $CFG["lang_default"]?$CFG["lang_default"]:"cn";
		$def 	= $def_o;
		if($def=="tw" || $def=="hk") $def = "cn";
		
		$pnum 	= func_num_args();
		$params	= func_get_args();
		//$db 	= $params[0];
		$lang_o	= $params[0]?$params[0]:$def_o;
		if(!in_array($lang_o, $CFG["lang"])) $lang_o = $def_o; 
		$lang   = $lang_o;
		if($lang=="tw" || $lang=="hk") $lang = "cn";

		
		$col_str = "";
		if($def==$lang) 
			$col_str = "$lang, $lang as def";
		else 
			$col_str = "$lang, $def as def";

		//$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
		$query_lang = "SELECT keyword, $col_str FROM website_language WHERE deleted <>1";
		$result_lang = $db->query($query_lang);
		$words = array();
		while($row_lang = $db->fetch($result_lang)) {
			$words[$row_lang["keyword"]] = trim($row_lang[$lang])?
												self::trans(trim($row_lang[$lang]), $lang_o): 
												(
													trim($row_lang["def"])? self::trans(trim($row_lang["def"]), $def_o):
													"*". ucwords(trim($row_lang["keyword"]))
												);			
		}
		/*
		echo "<pre>";
		print_r($words);
		echo "</pre>";
		*/
		return $words;
	}
	
	public static function content() {
		global $CFG;
		global $db;
		$def_o 	= $CFG["lang_default"]?$CFG["lang_default"]:"cn";
		$def 	= $def_o;
		if($def=="tw" || $def=="hk") $def = "cn";

		$pnum 		= func_num_args();
		$params		= func_get_args();
		//$db 		= $params[0];
		$keyword 	= $params[0];
		$lang_o		= $params[1]?$params[1]:$def_o;
		if(!in_array($lang_o, $CFG["lang"])) $lang_o = $def_o; 
		$lang   = $lang_o;
		if($lang=="tw" || $lang=="hk") $lang = "cn";

		//$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
		$query_content 	= "SELECT content FROM website_content WHERE deleted <>1 AND status = 1 AND keyword = '" . $keyword . "'";
		$result_content = $db->query($query_content);
		$row_content 	= $db->fetch($result_content);
		return self::trans($row_content["content"], $lang_o);
	}

	public static function hit($filter, $webpage, $info) {
		global $CFG;
		global $db;
		$browser 				= new Browser();
		$fields = array();
		$fields["template"] 	= substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
		$fields["url"] 			= $_SERVER['REQUEST_URI'];
		
		$fields["platform"] 	= $browser->getPlatform(); 
		$fields["browser"] 		= $browser->getBrowser(); 
		$fields["version"] 		= $browser->getVersion(); 

		$fields["filter"] 		= $filter; 
		$fields["webpage"] 		= $webpage;
		$fields["info"] 		= $info;

		$fields["ip_address"] 	= $_SERVER['REMOTE_ADDR']; 
		$fields["status"] 		= 1;
		$fields["deleted"] 		= 0;
		$fields["created_time"]	= time();
		
		$db->insert("website_hits", $fields);
	}
	
	public static function langCol($col, $lang) {
		$ret_lang = "";
		switch($lang) {
            case "cn":
            case "tw":
            case "hk":
				$ret_lang = $col . "_cn";        
                break;
            default:
				$ret_lang = $col . "_" . $lang;        
                break;
        }
		return $ret_lang;
	}

	public static function nltobr( $str ) {
		return str_replace(array("\n", "\r", " "), array("<br>", "<br>", "&nbsp;"), $str);
	}

	public static function brtonl( $str ) {
		return str_replace(array("<br>", "<br>", "&nbsp;"), array("\n", "\r", " "),  $str);
	}


    public static function trans($str, $lang) {
        $word = "";
        switch($lang) {
            case "cn":
                $word = self::toCN($str);
                break;
            case "tw":
                $word = self::toTW($str);
                break;
            case "hk":
                $word = self::toHK($str);
                break;
            default:
                $word = $str;
                break;
        }
        return $word;
    }
	
    public static function toTW ($str) {  
            $str_t = '';  
            $len = strlen($str);  
            $a = 0;  
            while ($a < $len){  
                    if (ord($str{$a})>=224 && ord($str{$a})<=239){  
                            if (($temp = strpos( self::$utf8_cn, $str{$a} . $str{$a+1} . $str{$a+2})) !== false){  
                                    $str_t .= self::$utf8_tw{$temp} . self::$utf8_tw{$temp+1} . self::$utf8_tw{$temp+2};  
                                    $a += 3;  
                                    continue;  
                            }  
                    }  
                    $str_t .= $str{$a};  
                    $a += 1;  
            } 
             
            return $str_t;  
    }  

    public static function toHK ($str) { 
            $str_t = '';  
            $len = strlen($str);  
            $a = 0;  
            while ($a < $len){  
                    if (ord($str{$a})>=224 && ord($str{$a})<=239){  
                            if (($temp = strpos( self::$utf8_cn, $str{$a} . $str{$a+1} . $str{$a+2})) !== false){  
                                    $str_t .= self::$utf8_hk{$temp} . self::$utf8_hk{$temp+1} . self::$utf8_hk{$temp+2};  
                                    $a += 3;  
                                    continue;  
                            }  
                    }  
                    $str_t .= $str{$a};  
                    $a += 1;  
            } 
            return $str_t;  
    }  

    public static function toCN($str) {  
            $str_t = '';  
            $len = strlen($str);  
            $a = 0;  
            while ($a < $len){  
                    if (ord($str{$a})>=224 && ord($str{$a})<=239){  
                            if (($temp = strpos( self::$utf8_tw, $str{$a} . $str{$a+1} . $str{$a+2})) !== false){  
                                    $str_t .= self::$utf8_cn{$temp} . self::$utf8_cn{$temp+1} . self::$utf8_cn{$temp+2};  
                                    $a += 3;  
                                    continue;  
                            }  
                    }  
                    $str_t .= $str{$a};  
                    $a += 1;  
            } 
            return $str_t;  
    } 
	

	public static function words($key, $lang="cn", $replace="", $replace1="") {
		$ret = $key;
		if($lang=="") $lang = "cn";
		$oldLang = $lang;
		if($lang=="tw" || $lang=="hk") $lang = "cn";
		$wordArr0 = "wordArr_" . $lang;
		$wordArr = self::$$wordArr0;
		
		if( $wordArr[$key] ) $ret = $wordArr[$key]; 
		if($replace!="" || strlen($replace)>0)   $ret = str_replace("{{replace}}", $replace, $ret); 
		if($replace1!="" || strlen($replace1)>0)  $ret = str_replace("{{replace1}}", $replace1, $ret); 
		if($oldLang=="tw" || $oldLang=="hk") $ret = self::toTW($ret);
		return $ret;
	}
	
	static private $wordArr_en = array(
		"required_col"=>"is required.",
		"invalid_type"=>"is invalid {{replace}} type.",
		"over_max_length"=>"over maximum lengh ( {{replace}} > {{replace1}} ).",
		"less_min_length"=>"less than minimum lengh ( {{replace}} < {{replace1}} ).",
		"out_of_range"=>"out of range ( {{replace}} ~ {{replace1}} ).",
		"less_than_min"=>"less than minimum value ( {{replace}} < {{replace1}} ).",
		"large_than_max"=>"large than maximum value ( {{replace}} > {{replace1}} ).",
		"password_not_match"=>"Password do not match.",
		"do_not_match"=>"do not match.",
		"welcome login"=>"Welcome to use our web application",
		"login fail"=>"Login Failed !",
		"login lock"=>"You have failed to login {{count}} times, please contact us.",
		"login user lock"=>"You have failed to login {{count}} times, please try after {{minutes}} minutes.<br>\nIf you forget password, please click on [Forget Password] or contact us.",
		"save.no.right"=>"You don't have right to change data!",
		"add.no.right"=>"You don't have right to add data!",
		"delete.no.right"=>"You don't have right to add data!",
		"you choose"=>"Choose",
		"navi.page"=>"Page",
		"navi.per_page"=>"Page",
		"navi.total"=>"Total",
		"navi.noresult"=>"Sorry we can't find any result",
		"navi.first"=>"First",
		"navi.previous"=>"Previous",
		"navi.next"=>"Next",
		"navi.last"=>"Last",
		"navi.refresh"=>"Reload Recored",
		"navi.loading"=>"Loading...",
		"years"		  => " years ",
		"year"		  => " year ",
		"days"		  =>" days ",
		"day"		  =>" day ",
		"ago"		  =>" ago",
		"from"		  =>"From",
		"to"		  =>"To",
		"navi.hits"	  =>"Read",
		"navi.review" =>"Reviews",
		"more" 		  =>"More",
		"click to view image" =>"Click to view image",
		"no change need to save" =>"No change need to save",
		"no record need to save" =>"No record need to save"
		
	);  

	static private $wordArr_cn = array(
		"required_col"=>"是必填的内容.",
		"invalid_type"=>"是无效的 {{replace}} 数据类型.",
		"over_max_length"=>"字符长度超过了最大限制 ( {{replace}} > {{replace1}} ).",
		"less_min_length"=>"字符长度少于最低限制 ( {{replace}} < {{replace1}} ).",
		"out_of_range"=>"取值超出了范围 ( {{replace}} ~ {{replace1}} ).",
		"less_than_min"=>"小于要求的最小值 ( {{replace}} < {{replace1}} ).",
		"large_than_max"=>"大于要求的最大值 ( {{replace}} > {{replace1}} ).",
		"password_not_match"=>"密码不匹配.",
		"do_not_match"=>"不匹配.",
		"welcome login"=>"登录成功, 欢迎使用 !",
		"login fail"=>"登录失败, 请输入正确的用户名和密码 !",
		"login lock"=>"你已经尝试登录 {{count}} 次, 账号已经被锁, 请联系网站管理员.",
		"login user lock"=>"你已经尝试登录 {{count}} 次, 账号已经被锁, 请{{minutes}}分钟以后再試. <br>\n如果忘记密码请点击【忘记密码】, 或者联系网站管理员.",
		"save.no.right"=>"你没有权限保存修改的数据!",
		"add.no.right"=>"你没有权限新增数据!",
		"delete.no.right"=>"你没有权限删除数据!",
		"you choose"=>"已选",
		"navi.page"=>"分页",
		"navi.per_page"=>"页",
		"navi.total"=>"总共",
		"navi.noresult"=>"对不起我们找不到任何有关的记录",
		"navi.first"=>"第一页",
		"navi.previous"=>"上一页",
		"navi.next"=>"下一页",
		"navi.last"=>"最后一页",
		"navi.refresh"=>"重新刷新",
		"navi.loading"=>"加载中...",
		"years"		  => "年",
		"year"		  => "年",
		"days"		  =>"天",
		"day"		  =>"天",
		"ago"		  =>"以前",
		"from"		  =>"自",
		"to"		  =>"至",
		"navi.hits"	  =>"阅读",
		"navi.review" =>"评论",
		"more" 		  =>"更多",
		"click to view image" =>"点击查看图片",
		"no change need to save" =>"没有修改需要保存",
		"no record need to save" =>"没有找到需要保存的资料"
	);  

    // 如果有任何翻译错误， 或者遗漏， 可以修改此翻译对照表
    static private $utf8_cn = "么万与丑专业丛东丝丢两严丧个丬丰临为丽举么义乌乐乔习乡书买乱争于亏云亘亚产亩亲亵亸亿仅从仑仓仪们价众优伙会伛伞伟传伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬俣俦俨俩俪俭债倾偬偻偾偿傥傧储傩儿兑兖党兰关兴兹养兽冁内冈册写军农冢冯冲决况冻净凄凉凌减凑凛几凤凫凭凯击凼凿刍划刘则刚创删别刬刭刽刿剀剂剐剑剥剧劝办务劢动励劲劳势勋勐勚匀匦匮区医华协单卖卢卤卧卫却卺厂厅历厉压厌厍厕厢厣厦厨厩厮县参叆叇双发变叙叠叶号叹叽吁后吓吕吗吣吨听启吴呒呓呕呖呗员呙呛呜咏咔咙咛咝咤咴咸哌响哑哒哓哔哕哗哙哜哝哟唛唝唠唡唢唣唤唿啧啬啭啮啰啴啸喷喽喾嗫呵嗳嘘嘤嘱噜噼嚣嚯团园囱围囵国图圆圣圹场坂坏块坚坛坜坝坞坟坠垄垅垆垒垦垧垩垫垭垯垱垲垴埘埙埚埝埯堑堕塆墙壮声壳壶壸处备复够头夸夹夺奁奂奋奖奥妆妇妈妩妪妫姗姜娄娅娆娇娈娱娲娴婳婴婵婶媪嫒嫔嫱嬷孙学孪宁宝实宠审宪宫宽宾寝对寻导寿将尔尘尧尴尸尽层屃屉届属屡屦屿岁岂岖岗岘岙岚岛岭岳岽岿峃峄峡峣峤峥峦崂崃崄崭嵘嵚嵛嵝嵴巅巩巯币帅师帏帐帘帜带帧帮帱帻帼幂幞干并广庄庆庐庑库应庙庞废庼廪开异弃张弥弪弯弹强归当录彟彦彻径徕御忆忏忧忾怀态怂怃怄怅怆怜总怼怿恋恳恶恸恹恺恻恼恽悦悫悬悭悯惊惧惨惩惫惬惭惮惯愍愠愤愦愿慑慭憷懑懒懔戆戋戏戗战戬户扎扑扦执扩扪扫扬扰抚抛抟抠抡抢护报担拟拢拣拥拦拧拨择挂挚挛挜挝挞挟挠挡挢挣挤挥挦捞损捡换捣据捻掳掴掷掸掺掼揸揽揿搀搁搂搅携摄摅摆摇摈摊撄撑撵撷撸撺擞攒敌敛数斋斓斗斩断无旧时旷旸昙昼昽显晋晒晓晔晕晖暂暧札术朴机杀杂权条来杨杩杰极构枞枢枣枥枧枨枪枫枭柜柠柽栀栅标栈栉栊栋栌栎栏树栖样栾桊桠桡桢档桤桥桦桧桨桩梦梼梾检棂椁椟椠椤椭楼榄榇榈榉槚槛槟槠横樯樱橥橱橹橼檐檩欢欤欧歼殁殇残殒殓殚殡殴毁毂毕毙毡毵氇气氢氩氲汇汉污汤汹沓沟没沣沤沥沦沧沨沩沪沵泞泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涂涌涛涝涞涟涠涡涢涣涤润涧涨涩淀渊渌渍渎渐渑渔渖渗温游湾湿溃溅溆溇滗滚滞滟滠满滢滤滥滦滨滩滪漤潆潇潋潍潜潴澜濑濒灏灭灯灵灾灿炀炉炖炜炝点炼炽烁烂烃烛烟烦烧烨烩烫烬热焕焖焘煅煳熘爱爷牍牦牵牺犊犟状犷犸犹狈狍狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珉珏珐珑珰珲琎琏琐琼瑶瑷璇璎瓒瓮瓯电画畅畲畴疖疗疟疠疡疬疮疯疱疴痈痉痒痖痨痪痫痴瘅瘆瘗瘘瘪瘫瘾瘿癞癣癫癯皑皱皲盏盐监盖盗盘眍眦眬着睁睐睑瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硅硕硖硗硙硚确硷碍碛碜碱碹磙礼祎祢祯祷祸禀禄禅离秃秆种积称秽秾稆税稣稳穑穷窃窍窑窜窝窥窦窭竖竞笃笋笔笕笺笼笾筑筚筛筜筝筹签简箓箦箧箨箩箪箫篑篓篮篱簖籁籴类籼粜粝粤粪粮糁糇紧絷纟纠纡红纣纤纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络绝绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缐缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡翘翙翚耢耧耸耻聂聋职聍联聩聪肃肠肤肷肾肿胀胁胆胜胧胨胪胫胶脉脍脏脐脑脓脔脚脱脶脸腊腌腘腭腻腼腽腾膑臜舆舣舰舱舻艰艳艹艺节芈芗芜芦苁苇苈苋苌苍苎苏苘苹茎茏茑茔茕茧荆荐荙荚荛荜荞荟荠荡荣荤荥荦荧荨荩荪荫荬荭荮药莅莜莱莲莳莴莶获莸莹莺莼萚萝萤营萦萧萨葱蒇蒉蒋蒌蓝蓟蓠蓣蓥蓦蔷蔹蔺蔼蕲蕴薮藁藓虏虑虚虫虬虮虽虾虿蚀蚁蚂蚕蚝蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蜡蝇蝈蝉蝎蝼蝾螀螨蟏衅衔补衬衮袄袅袆袜袭袯装裆裈裢裣裤裥褛褴襁襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯詟誉誊讠计订讣认讥讦讧讨让讪讫训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳说诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谥谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶谷豮贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赝赞赟赠赡赢赣赪赵赶趋趱趸跃跄跖跞践跶跷跸跹跻踊踌踪踬踯蹑蹒蹰蹿躏躜躯车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辩辫边辽达迁过迈运还这进远违连迟迩迳迹适选逊递逦逻遗遥邓邝邬邮邹邺邻郁郄郏郐郑郓郦郧郸酝酦酱酽酾酿释里鉅鉴銮錾钆钇针钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钝钞钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铈铉铊铋铍铎铏铐铑铒铕铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铪铫铬铭铮铯铰铱铲铳铴铵银铷铸铹铺铻铼铽链铿销锁锂锃锄锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗错锚锜锞锟锠锡锢锣锤锥锦锨锩锫锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镆镇镈镉镊镌镍镎镏镐镑镒镕镖镗镙镚镛镜镝镞镟镠镡镢镣镤镥镦镧镨镩镪镫镬镭镮镯镰镱镲镳镴镶长门闩闪闫闬闭问闯闰闱闲闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陧陨险随隐隶隽难雏雠雳雾霁霉霭靓静靥鞑鞒鞯鞴韦韧韨韩韪韫韬韵页顶顷顸项顺须顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饤饥饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓魇魉鱼鱽鱾鱿鲀鲁鲂鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳛鳜鳝鳞鳟鳠鳡鳢鳣鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹇鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹯鹰鹱鹲鹳鹴鹾麦麸黄黉黡黩黪黾鼋鼌鼍鼗鼹齄齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟志制咨只里系范松没尝尝闹面准钟别闲干尽脏拼";  
    static private $utf8_tw = "麽萬與醜專業叢東絲丟兩嚴喪個爿豐臨為麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞產畝親褻嚲億僅從侖倉儀們價眾優夥會傴傘偉傳傷倀倫傖偽佇體餘傭僉俠侶僥偵側僑儈儕儂俁儔儼倆儷儉債傾傯僂僨償儻儐儲儺兒兌兗黨蘭關興茲養獸囅內岡冊寫軍農塚馮衝決況凍淨淒涼淩減湊凜幾鳳鳧憑凱擊氹鑿芻劃劉則剛創刪別剗剄劊劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳猛勩勻匭匱區醫華協單賣盧鹵臥衛卻巹廠廳曆厲壓厭厙廁廂厴廈廚廄廝縣參靉靆雙發變敘疊葉號歎嘰籲後嚇呂嗎唚噸聽啟吳嘸囈嘔嚦唄員咼嗆嗚詠哢嚨嚀噝吒噅鹹呱響啞噠嘵嗶噦嘩噲嚌噥喲嘜嗊嘮啢嗩唕喚呼嘖嗇囀齧囉嘽嘯噴嘍嚳囁嗬噯噓嚶囑嚕劈囂謔團園囪圍圇國圖圓聖壙場阪壞塊堅壇壢壩塢墳墜壟壟壚壘墾坰堊墊埡墶壋塏堖塒塤堝墊垵塹墮壪牆壯聲殼壺壼處備複夠頭誇夾奪奩奐奮獎奧妝婦媽嫵嫗媯姍薑婁婭嬈嬌孌娛媧嫻嫿嬰嬋嬸媼嬡嬪嬙嬤孫學孿寧寶實寵審憲宮寬賓寢對尋導壽將爾塵堯尷屍盡層屭屜屆屬屢屨嶼歲豈嶇崗峴嶴嵐島嶺嶽崠巋嶨嶧峽嶢嶠崢巒嶗崍嶮嶄嶸嶔崳嶁脊巔鞏巰幣帥師幃帳簾幟帶幀幫幬幘幗冪襆幹並廣莊慶廬廡庫應廟龐廢廎廩開異棄張彌弳彎彈強歸當錄彠彥徹徑徠禦憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀懇惡慟懨愷惻惱惲悅愨懸慳憫驚懼慘懲憊愜慚憚慣湣慍憤憒願懾憖怵懣懶懍戇戔戲戧戰戩戶紮撲扡執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏撈損撿換搗據撚擄摑擲撣摻摜摣攬撳攙擱摟攪攜攝攄擺搖擯攤攖撐攆擷擼攛擻攢敵斂數齋斕鬥斬斷無舊時曠暘曇晝曨顯晉曬曉曄暈暉暫曖劄術樸機殺雜權條來楊榪傑極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒棬椏橈楨檔榿橋樺檜槳樁夢檮棶檢欞槨櫝槧欏橢樓欖櫬櫚櫸檟檻檳櫧橫檣櫻櫫櫥櫓櫞簷檁歡歟歐殲歿殤殘殞殮殫殯毆毀轂畢斃氈毿氌氣氫氬氳匯漢汙湯洶遝溝沒灃漚瀝淪滄渢溈滬濔濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣濕潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦濫瀠瀟瀲濰潛瀦瀾瀨瀕灝滅燈靈災燦煬爐燉煒熗點煉熾爍爛烴燭煙煩燒燁燴燙燼熱煥燜燾煆糊溜愛爺牘犛牽犧犢強狀獷獁猶狽麅獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽瑉玨琺瓏璫琿璡璉瑣瓊瑤璦璿瓔瓚甕甌電畫暢佘疇癤療瘧癘瘍鬁瘡瘋皰屙癰痙癢瘂癆瘓癇癡癉瘮瘞瘺癟癱癮癭癩癬癲臒皚皺皸盞鹽監蓋盜盤瞘眥矓著睜睞瞼瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜矽碩硤磽磑礄確鹼礙磧磣堿镟滾禮禕禰禎禱禍稟祿禪離禿稈種積稱穢穠穭稅穌穩穡窮竊竅窯竄窩窺竇窶豎競篤筍筆筧箋籠籩築篳篩簹箏籌簽簡籙簀篋籜籮簞簫簣簍籃籬籪籟糴類秈糶糲粵糞糧糝餱緊縶糸糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺絏紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽緔緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒韁繾繰繯繳纘罌網羅罰罷羆羈羥羨翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚膁腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏臢輿艤艦艙艫艱豔艸藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇檾蘋莖蘢蔦塋煢繭荊薦薘莢蕘蓽蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞蓧萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蕆蕢蔣蔞藍薊蘺蕷鎣驀薔蘞藺藹蘄蘊藪槁蘚虜慮虛蟲虯蟣雖蝦蠆蝕蟻螞蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁銜補襯袞襖嫋褘襪襲襏裝襠褌褳襝褲襇褸襤繈襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶讋譽謄訁計訂訃認譏訐訌討讓訕訖訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗諡謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖穀豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗讚贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒踐躂蹺蹕躚躋踴躊蹤躓躑躡蹣躕躥躪躦軀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郤郟鄶鄭鄆酈鄖鄲醞醱醬釅釃釀釋裏钜鑒鑾鏨釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鈍鈔鍾鈉鋇鋼鈑鈐鑰欽鈞鎢鉤鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷缽鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鈰鉉鉈鉍鈹鐸鉶銬銠鉺銪鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺錯錨錡錁錕錩錫錮鑼錘錐錦鍁錈錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鏌鎮鎛鎘鑷鐫鎳鎿鎦鎬鎊鎰鎔鏢鏜鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔鑣鑞鑲長門閂閃閆閈閉問闖閏闈閑閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隉隕險隨隱隸雋難雛讎靂霧霽黴靄靚靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飆飛饗饜飣饑飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢魘魎魚魛魢魷魨魯魴魺鮁鮃鯰鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鯵鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鼇鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅鰼鱖鱔鱗鱒鱯鱤鱧鱣鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鴬鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鶤鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶿鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺鸇鷹鸌鸏鸛鸘鹺麥麩黃黌黶黷黲黽黿鼂鼉鞀鼴齇齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜誌製谘隻裡係範鬆冇嚐嘗鬨麵準鐘彆閒乾儘臟拚";  
    static private $utf8_hk = "麽萬與醜專業叢東絲丟兩嚴喪個爿豐臨為麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞產畝親褻嚲億僅從侖倉儀們價眾優夥會傴傘偉傳傷倀倫傖偽佇體餘傭僉俠侶僥偵側僑儈儕儂俁儔儼倆儷儉債傾傯僂僨償儻儐儲儺兒兌兗黨蘭關興茲養獸囅內岡冊寫軍農塚馮衝決況凍淨淒涼淩減湊凜幾鳳鳧憑凱擊氹鑿芻劃劉則剛創刪別剗剄劊劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳猛勩勻匭匱區醫華協單賣盧鹵臥衛卻巹廠廳曆厲壓厭厙廁廂厴廈廚廄廝縣參靉靆雙發變敘疊葉號歎嘰籲後嚇呂嗎唚噸聽啟吳嘸囈嘔嚦唄員咼嗆嗚詠哢嚨嚀噝吒噅鹹呱響啞噠嘵嗶噦嘩噲嚌噥喲嘜嗊嘮啢嗩唕喚呼嘖嗇囀齧囉嘽嘯噴嘍嚳囁嗬噯噓嚶囑嚕劈囂謔團園囪圍圇國圖圓聖壙場阪壞塊堅壇壢壩塢墳墜壟壟壚壘墾坰堊墊埡墶壋塏堖塒塤堝墊垵塹墮壪牆壯聲殼壺壼處備複夠頭誇夾奪奩奐奮獎奧妝婦媽嫵嫗媯姍薑婁婭嬈嬌孌娛媧嫻嫿嬰嬋嬸媼嬡嬪嬙嬤孫學孿寧寶實寵審憲宮寬賓寢對尋導壽將爾塵堯尷屍盡層屭屜屆屬屢屨嶼歲豈嶇崗峴嶴嵐島嶺嶽崠巋嶨嶧峽嶢嶠崢巒嶗崍嶮嶄嶸嶔崳嶁脊巔鞏巰幣帥師幃帳簾幟帶幀幫幬幘幗冪襆幹並廣莊慶廬廡庫應廟龐廢廎廩開異棄張彌弳彎彈強歸當錄彠彥徹徑徠禦憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀懇惡慟懨愷惻惱惲悅愨懸慳憫驚懼慘懲憊愜慚憚慣湣慍憤憒願懾憖怵懣懶懍戇戔戲戧戰戩戶紮撲扡執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏撈損撿換搗據撚擄摑擲撣摻摜摣攬撳攙擱摟攪攜攝攄擺搖擯攤攖撐攆擷擼攛擻攢敵斂數齋斕鬥斬斷無舊時曠暘曇晝曨顯晉曬曉曄暈暉暫曖劄術樸機殺雜權條來楊榪傑極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒棬椏橈楨檔榿橋樺檜槳樁夢檮棶檢欞槨櫝槧欏橢樓欖櫬櫚櫸檟檻檳櫧橫檣櫻櫫櫥櫓櫞簷檁歡歟歐殲歿殤殘殞殮殫殯毆毀轂畢斃氈毿氌氣氫氬氳匯漢汙湯洶遝溝沒灃漚瀝淪滄渢溈滬濔濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣濕潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦濫瀠瀟瀲濰潛瀦瀾瀨瀕灝滅燈靈災燦煬爐燉煒熗點煉熾爍爛烴燭煙煩燒燁燴燙燼熱煥燜燾煆糊溜愛爺牘犛牽犧犢強狀獷獁猶狽麅獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽瑉玨琺瓏璫琿璡璉瑣瓊瑤璦璿瓔瓚甕甌電畫暢佘疇癤療瘧癘瘍鬁瘡瘋皰屙癰痙癢瘂癆瘓癇癡癉瘮瘞瘺癟癱癮癭癩癬癲臒皚皺皸盞鹽監蓋盜盤瞘眥矓著睜睞瞼瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜矽碩硤磽磑礄確鹼礙磧磣堿镟滾禮禕禰禎禱禍稟祿禪離禿稈種積稱穢穠穭稅穌穩穡窮竊竅窯竄窩窺竇窶豎競篤筍筆筧箋籠籩築篳篩簹箏籌簽簡籙簀篋籜籮簞簫簣簍籃籬籪籟糴類秈糶糲粵糞糧糝餱緊縶糸糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺絏紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽緔緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒韁繾繰繯繳纘罌網羅罰罷羆羈羥羨翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚膁腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏臢輿艤艦艙艫艱豔艸藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇檾蘋莖蘢蔦塋煢繭荊薦薘莢蕘蓽蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞蓧萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蕆蕢蔣蔞藍薊蘺蕷鎣驀薔蘞藺藹蘄蘊藪槁蘚虜慮虛蟲虯蟣雖蝦蠆蝕蟻螞蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁銜補襯袞襖嫋褘襪襲襏裝襠褌褳襝褲襇褸襤繈襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶讋譽謄訁計訂訃認譏訐訌討讓訕訖訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗諡謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖穀豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗讚贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒踐躂蹺蹕躚躋踴躊蹤躓躑躡蹣躕躥躪躦軀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郤郟鄶鄭鄆酈鄖鄲醞醱醬釅釃釀釋裏钜鑒鑾鏨釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鈍鈔鍾鈉鋇鋼鈑鈐鑰欽鈞鎢鉤鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷缽鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鈰鉉鉈鉍鈹鐸鉶銬銠鉺銪鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺錯錨錡錁錕錩錫錮鑼錘錐錦鍁錈錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鏌鎮鎛鎘鑷鐫鎳鎿鎦鎬鎊鎰鎔鏢鏜鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔鑣鑞鑲長門閂閃閆閈閉問闖閏闈閑閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隉隕險隨隱隸雋難雛讎靂霧霽黴靄靚靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飆飛饗饜飣饑飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢魘魎魚魛魢魷魨魯魴魺鮁鮃鯰鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鯵鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鼇鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅鰼鱖鱔鱗鱒鱯鱤鱧鱣鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鴬鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鶤鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶿鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺鸇鷹鸌鸏鸛鸘鹺麥麩黃黌黶黷黲黽黿鼂鼉鞀鼴齇齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜誌製谘隻裡係範鬆冇嚐嘗鬨麵準鐘彆閒乾儘臟拚";  
}






class Browser {
    private $_agent = '';
    private $_browser_name = '';
    private $_version = '';
    private $_platform = '';
    private $_os = '';
    private $_is_aol = false;
    private $_is_mobile = false;
    private $_is_robot = false;
    private $_aol_version = '';

    const BROWSER_UNKNOWN = 'unknown';
    const VERSION_UNKNOWN = 'unknown';

    const BROWSER_OPERA = 'Opera'; 
    const BROWSER_OPERA_MINI = 'Opera Mini';
    const BROWSER_WEBTV = 'WebTV';
    const BROWSER_IE = 'Internet Explorer'; 
    const BROWSER_POCKET_IE = 'Pocket Internet Explorer';
    const BROWSER_KONQUEROR = 'Konqueror';
    const BROWSER_ICAB = 'iCab';
    const BROWSER_OMNIWEB = 'OmniWeb';
    const BROWSER_FIREBIRD = 'Firebird';
    const BROWSER_FIREFOX = 'Firefox';
    const BROWSER_ICEWEASEL = 'Iceweasel';
    const BROWSER_SHIRETOKO = 'Shiretoko';
    const BROWSER_MOZILLA = 'Mozilla';
    const BROWSER_AMAYA = 'Amaya';
    const BROWSER_LYNX = 'Lynx';
    const BROWSER_SAFARI = 'Safari';
    const BROWSER_IPHONE = 'iPhone';
    const BROWSER_IPOD = 'iPod';
    const BROWSER_IPAD = 'iPad';
    const BROWSER_CHROME = 'Chrome';
    const BROWSER_ANDROID = 'Android';
    const BROWSER_GOOGLEBOT = 'GoogleBot';
    const BROWSER_SLURP = 'Yahoo! Slurp';
    const BROWSER_W3CVALIDATOR = 'W3C Validator';
    const BROWSER_BLACKBERRY = 'BlackBerry';
    const BROWSER_ICECAT = 'IceCat';
    const BROWSER_NOKIA_S60 = 'Nokia S60 OSS Browser';
    const BROWSER_NOKIA = 'Nokia Browser';
    const BROWSER_MSN = 'MSN Browser';
    const BROWSER_MSNBOT = 'MSN Bot';

    const BROWSER_NETSCAPE_NAVIGATOR = 'Netscape Navigator';
    const BROWSER_GALEON = 'Galeon';
    const BROWSER_NETPOSITIVE = 'NetPositive';
    const BROWSER_PHOENIX = 'Phoenix';

    const PLATFORM_UNKNOWN = 'unknown';
    const PLATFORM_WINDOWS = 'Windows';
    const PLATFORM_WINDOWS_CE = 'Windows CE';
    const PLATFORM_APPLE = 'Apple';
    const PLATFORM_LINUX = 'Linux';
    const PLATFORM_OS2 = 'OS/2';
    const PLATFORM_BEOS = 'BeOS';
    const PLATFORM_IPHONE = 'iPhone';
    const PLATFORM_IPOD = 'iPod';
    const PLATFORM_IPAD = 'iPad';
    const PLATFORM_BLACKBERRY = 'BlackBerry';
    const PLATFORM_NOKIA = 'Nokia';
    const PLATFORM_FREEBSD = 'FreeBSD';
    const PLATFORM_OPENBSD = 'OpenBSD';
    const PLATFORM_NETBSD = 'NetBSD';
    const PLATFORM_SUNOS = 'SunOS';
    const PLATFORM_OPENSOLARIS = 'OpenSolaris';
    const PLATFORM_ANDROID = 'Android';

    const OPERATING_SYSTEM_UNKNOWN = 'unknown';

    public function Browser($useragent="") {
        $this->reset();
        if( $useragent != "" ) {
            $this->setUserAgent($useragent);
        }
        else {
            $this->determine();
        }
    }

    /**
    * Reset all properties
    */
    public function reset() {
        $this->_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : "";
        $this->_browser_name = self::BROWSER_UNKNOWN;
        $this->_version = self::VERSION_UNKNOWN;
        $this->_platform = self::PLATFORM_UNKNOWN;
        $this->_os = self::OPERATING_SYSTEM_UNKNOWN;
        $this->_is_aol = false;
        $this->_is_mobile = false;
        $this->_is_robot = false;
        $this->_aol_version = self::VERSION_UNKNOWN;
    }

    /**
    * Check to see if the specific browser is valid
    * @param string $browserName
    * @return boolean
    */
    function isBrowser($browserName) { return( 0 == strcasecmp($this->_browser_name, trim($browserName))); }

    /**
    * The name of the browser.  All return types are from the class contants
    * @return string Name of the browser
    */
    public function getBrowser() { return $this->_browser_name; }
    /**
    * Set the name of the browser
    * @param $browser The name of the Browser
    */
    public function setBrowser($browser) { return $this->_browser_name = $browser; }
    /**
    * The name of the platform.  All return types are from the class contants
    * @return string Name of the browser
    */
    public function getPlatform() { return $this->_platform; }
    /**
    * Set the name of the platform
    * @param $platform The name of the Platform
    */
    public function setPlatform($platform) { return $this->_platform = $platform; }
    /**
    * The version of the browser.
    * @return string Version of the browser (will only contain alpha-numeric characters and a period)
    */
    public function getVersion() { return $this->_version; }
    /**
    * Set the version of the browser
    * @param $version The version of the Browser
    */
    public function setVersion($version) { $this->_version = preg_replace('/[^0-9,.,a-z,A-Z-]/','',$version); }
    /**
    * The version of AOL.
    * @return string Version of AOL (will only contain alpha-numeric characters and a period)
    */
    public function getAolVersion() { return $this->_aol_version; }
    /**
    * Set the version of AOL
    * @param $version The version of AOL
    */
    public function setAolVersion($version) { $this->_aol_version = preg_replace('/[^0-9,.,a-z,A-Z]/','',$version); }
    /**
    * Is the browser from AOL?
    * @return boolean
    */
    public function isAol() { return $this->_is_aol; }
    /**
    * Is the browser from a mobile device?
    * @return boolean
    */
    public function isMobile() { return $this->_is_mobile; }
    /**
    * Is the browser from a robot (ex Slurp,GoogleBot)?
    * @return boolean
    */
    public function isRobot() { return $this->_is_robot; }
    /**
    * Set the browser to be from AOL
    * @param $isAol
    */
    public function setAol($isAol) { $this->_is_aol = $isAol; }
    /**
     * Set the Browser to be mobile
     * @param boolean
     */
    protected function setMobile($value=true) { $this->_is_mobile = $value; }
    /**
     * Set the Browser to be a robot
     * @param boolean
     */
    protected function setRobot($value=true) { $this->_is_robot = $value; }
    /**
    * Get the user agent value in use to determine the browser
    * @return string The user agent from the HTTP header
    */
    public function getUserAgent() { return $this->_agent; }
    /**
    * Set the user agent value (the construction will use the HTTP header value - this will overwrite it)
    * @param $agent_string The value for the User Agent
    */
    public function setUserAgent($agent_string) {
        $this->reset();
        $this->_agent = $agent_string;
        $this->determine();
    }
    /**
     * Used to determine if the browser is actually "chromeframe"
     * @return boolean
     */
    public function isChromeFrame() {
        return( strpos($this->_agent,"chromeframe") !== false );
    }
    /**
    * Returns a formatted string with a summary of the details of the browser.
    * @return string formatted string with a summary of the browser
    */
    public function __toString() {
        return "<strong>Browser Name:</strong>{$this->getBrowser()}<br/>\n" .
               "<strong>Browser Version:</strong>{$this->getVersion()}<br/>\n" .
               "<strong>Browser User Agent String:</strong>{$this->getUserAgent()}<br/>\n" .
               "<strong>Platform:</strong>{$this->getPlatform()}<br/>";
    }
    /**
     * Protected routine to calculate and determine what the browser is in use (including platform)
     */
    protected function determine() {
        $this->checkPlatform();
        $this->checkBrowsers();
        $this->checkForAol();
    }
    /**
     * Protected routine to determine the browser type
     * @return boolean
     */
     protected function checkBrowsers() {
        return (
            $this->checkBrowserWebTv() ||
            $this->checkBrowserInternetExplorer() ||
            $this->checkBrowserOpera() ||
            $this->checkBrowserGaleon() ||
            $this->checkBrowserNetscapeNavigator9Plus() ||
            $this->checkBrowserFirefox() ||
            $this->checkBrowserChrome() ||
            $this->checkBrowserOmniWeb() ||

            // common mobile
            $this->checkBrowserAndroid() ||
            $this->checkBrowseriPad() ||
            $this->checkBrowseriPod() ||
            $this->checkBrowseriPhone() ||
            $this->checkBrowserBlackBerry() ||
            $this->checkBrowserNokia() ||

            // common bots
            $this->checkBrowserGoogleBot() ||
            $this->checkBrowserMSNBot() ||
            $this->checkBrowserSlurp() ||

            // WebKit base check (post mobile and others)
            $this->checkBrowserSafari() ||

            // everyone else
            $this->checkBrowserNetPositive() ||
            $this->checkBrowserFirebird() ||
            $this->checkBrowserKonqueror() ||
            $this->checkBrowserIcab() ||
            $this->checkBrowserPhoenix() ||
            $this->checkBrowserAmaya() ||
            $this->checkBrowserLynx() ||
            $this->checkBrowserShiretoko() ||
            $this->checkBrowserIceCat() ||
            $this->checkBrowserW3CValidator() ||
            $this->checkBrowserMozilla() /* Mozilla is such an open standard that you must check it last */
        );
    }

    protected function checkBrowserBlackBerry() {
        if( stripos($this->_agent,'blackberry') !== false ) {
            $aresult = explode("/",stristr($this->_agent,"BlackBerry"));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->_browser_name = self::BROWSER_BLACKBERRY;
            $this->setMobile(true);
            return true;
        }
        return false;
    }

    protected function checkForAol() {
        $this->setAol(false);
        $this->setAolVersion(self::VERSION_UNKNOWN);

        if( stripos($this->_agent,'aol') !== false ) {
            $aversion = explode(' ',stristr($this->_agent, 'AOL'));
            $this->setAol(true);
            $this->setAolVersion(preg_replace('/[^0-9\.a-z]/i', '', $aversion[1]));
            return true;
        }
        return false;
    }


    protected function checkBrowserGoogleBot() {
        if( stripos($this->_agent,'googlebot') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'googlebot'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion(str_replace(';','',$aversion[0]));
            $this->_browser_name = self::BROWSER_GOOGLEBOT;
            $this->setRobot(true);
            return true;
        }
        return false;
    }

    protected function checkBrowserMSNBot() {
        if( stripos($this->_agent,"msnbot") !== false ) {
            $aresult = explode("/",stristr($this->_agent,"msnbot"));
            $aversion = explode(" ",$aresult[1]);
            $this->setVersion(str_replace(";","",$aversion[0]));
            $this->_browser_name = self::BROWSER_MSNBOT;
            $this->setRobot(true);
            return true;
        }
        return false;
    }       

    protected function checkBrowserW3CValidator() {
        if( stripos($this->_agent,'W3C-checklink') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'W3C-checklink'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->_browser_name = self::BROWSER_W3CVALIDATOR;
            return true;
        }
        else if( stripos($this->_agent,'W3C_Validator') !== false ) {
            // Some of the Validator versions do not delineate w/ a slash - add it back in
            $ua = str_replace("W3C_Validator ", "W3C_Validator/", $this->_agent);
            $aresult = explode('/',stristr($ua,'W3C_Validator'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->_browser_name = self::BROWSER_W3CVALIDATOR;
            return true;
        }
        return false;
    }

    protected function checkBrowserSlurp() {
        if( stripos($this->_agent,'slurp') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Slurp'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->_browser_name = self::BROWSER_SLURP;
            $this->setRobot(true);
            $this->setMobile(false);
            return true;
        }
        return false;
    }

    protected function checkBrowserInternetExplorer() {

        // Test for v1 - v1.5 IE
        if( stripos($this->_agent,'microsoft internet explorer') !== false ) {
            $this->setBrowser(self::BROWSER_IE);
            $this->setVersion('1.0');
            $aresult = stristr($this->_agent, '/');
            if( preg_match('/308|425|426|474|0b1/i', $aresult) ) {
                $this->setVersion('1.5');
            }
            return true;
        }
        // Test for versions > 1.5
        else if( stripos($this->_agent,'msie') !== false && stripos($this->_agent,'opera') === false ) {
            // See if the browser is the odd MSN Explorer
            if( stripos($this->_agent,'msnb') !== false ) {
                $aresult = explode(' ',stristr(str_replace(';','; ',$this->_agent),'MSN'));
                $this->setBrowser( self::BROWSER_MSN );
                $this->setVersion(str_replace(array('(',')',';'),'',$aresult[1]));
                return true;
            }
            $aresult = explode(' ',stristr(str_replace(';','; ',$this->_agent),'msie'));
            $this->setBrowser( self::BROWSER_IE );
            $this->setVersion(str_replace(array('(',')',';'),'',$aresult[1]));
            return true;
        }
        // Test for Pocket IE
        else if( stripos($this->_agent,'mspie') !== false || stripos($this->_agent,'pocket') !== false ) {
            $aresult = explode(' ',stristr($this->_agent,'mspie'));
            $this->setPlatform( self::PLATFORM_WINDOWS_CE );
            $this->setBrowser( self::BROWSER_POCKET_IE );
            $this->setMobile(true);

            if( stripos($this->_agent,'mspie') !== false ) {
                $this->setVersion($aresult[1]);
            }
            else {
                $aversion = explode('/',$this->_agent);
                $this->setVersion($aversion[1]);
            }
            return true;
        }
        return false;
    }

    protected function checkBrowserOpera() {
        if( stripos($this->_agent,'opera mini') !== false ) {
            $resultant = stristr($this->_agent, 'opera mini');
            if( preg_match('/\//',$resultant) ) {
                $aresult = explode('/',$resultant);
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $aversion = explode(' ',stristr($resultant,'opera mini'));
                $this->setVersion($aversion[1]);
            }
            $this->_browser_name = self::BROWSER_OPERA_MINI;
            $this->setMobile(true);
            return true;
        }
        else if( stripos($this->_agent,'opera') !== false ) {
            $resultant = stristr($this->_agent, 'opera');
            if( preg_match('/Version\/(10.*)$/',$resultant,$matches) ) {
                $this->setVersion($matches[1]);
            }
            else if( preg_match('/\//',$resultant) ) {
                $aresult = explode('/',str_replace("("," ",$resultant));
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $aversion = explode(' ',stristr($resultant,'opera'));
                $this->setVersion(isset($aversion[1])?$aversion[1]:"");
            }
            $this->_browser_name = self::BROWSER_OPERA;
            return true;
        }
        return false;
    }


    protected function checkBrowserChrome() {
        if( stripos($this->_agent,'Chrome') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Chrome'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);

            $this->setBrowser(self::BROWSER_CHROME);
            return true;
        }
        return false;
    }

    protected function checkBrowserWebTv() {
        if( stripos($this->_agent,'webtv') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'webtv'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->setBrowser(self::BROWSER_WEBTV);
            return true;
        }
        return false;
    }

    protected function checkBrowserNetPositive() {
        if( stripos($this->_agent,'NetPositive') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'NetPositive'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion(str_replace(array('(',')',';'),'',$aversion[0]));
            $this->setBrowser(self::BROWSER_NETPOSITIVE);
            return true;
        }
        return false;
    }

    protected function checkBrowserGaleon() {
        if( stripos($this->_agent,'galeon') !== false ) {
            $aresult = explode(' ',stristr($this->_agent,'galeon'));
            $aversion = explode('/',$aresult[0]);
            $this->setVersion($aversion[1]);
            $this->setBrowser(self::BROWSER_GALEON);
            return true;
        }
        return false;
    }

    protected function checkBrowserKonqueror() {
        if( stripos($this->_agent,'Konqueror') !== false ) {
            $aresult = explode(' ',stristr($this->_agent,'Konqueror'));
            $aversion = explode('/',$aresult[0]);
            $this->setVersion($aversion[1]);
            $this->setBrowser(self::BROWSER_KONQUEROR);
            return true;
        }
        return false;
    }

    protected function checkBrowserIcab() {
        if( stripos($this->_agent,'icab') !== false ) {
            $aversion = explode(' ',stristr(str_replace('/',' ',$this->_agent),'icab'));
            $this->setVersion($aversion[1]);
            $this->setBrowser(self::BROWSER_ICAB);
            return true;
        }
        return false;
    }

    protected function checkBrowserOmniWeb() {
        if( stripos($this->_agent,'omniweb') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'omniweb'));
            $aversion = explode(' ',isset($aresult[1])?$aresult[1]:"");
            $this->setVersion($aversion[0]);
            $this->setBrowser(self::BROWSER_OMNIWEB);
            return true;
        }
        return false;
    }

    protected function checkBrowserPhoenix() {
        if( stripos($this->_agent,'Phoenix') !== false ) {
            $aversion = explode('/',stristr($this->_agent,'Phoenix'));
            $this->setVersion($aversion[1]);
            $this->setBrowser(self::BROWSER_PHOENIX);
            return true;
        }
        return false;
    }

    protected function checkBrowserFirebird() {
        if( stripos($this->_agent,'Firebird') !== false ) {
            $aversion = explode('/',stristr($this->_agent,'Firebird'));
            $this->setVersion($aversion[1]);
            $this->setBrowser(self::BROWSER_FIREBIRD);
            return true;
        }
        return false;
    }

    protected function checkBrowserNetscapeNavigator9Plus() {
        if( stripos($this->_agent,'Firefox') !== false && preg_match('/Navigator\/([^ ]*)/i',$this->_agent,$matches) ) {
            $this->setVersion($matches[1]);
            $this->setBrowser(self::BROWSER_NETSCAPE_NAVIGATOR);
            return true;
        }
        else if( stripos($this->_agent,'Firefox') === false && preg_match('/Netscape6?\/([^ ]*)/i',$this->_agent,$matches) ) {
            $this->setVersion($matches[1]);
            $this->setBrowser(self::BROWSER_NETSCAPE_NAVIGATOR);
            return true;
        }
        return false;
    }

    protected function checkBrowserShiretoko() {
        if( stripos($this->_agent,'Mozilla') !== false && preg_match('/Shiretoko\/([^ ]*)/i',$this->_agent,$matches) ) {
            $this->setVersion($matches[1]);
            $this->setBrowser(self::BROWSER_SHIRETOKO);
            return true;
        }
        return false;
    }

    protected function checkBrowserIceCat() {
        if( stripos($this->_agent,'Mozilla') !== false && preg_match('/IceCat\/([^ ]*)/i',$this->_agent,$matches) ) {
            $this->setVersion($matches[1]);
            $this->setBrowser(self::BROWSER_ICECAT);
            return true;
        }
        return false;
    }

    protected function checkBrowserNokia() {
        if( preg_match("/Nokia([^\/]+)\/([^ SP]+)/i",$this->_agent,$matches) ) {
            $this->setVersion($matches[2]);
            if( stripos($this->_agent,'Series60') !== false || strpos($this->_agent,'S60') !== false ) {
                $this->setBrowser(self::BROWSER_NOKIA_S60);
            }
            else {
                $this->setBrowser( self::BROWSER_NOKIA );
            }
            $this->setMobile(true);
            return true;
        }
        return false;
    }

    protected function checkBrowserFirefox() {
        if( stripos($this->_agent,'safari') === false ) {
            if( preg_match("/Firefox[\/ \(]([^ ;\)]+)/i",$this->_agent,$matches) ) {
                $this->setVersion($matches[1]);
                $this->setBrowser(self::BROWSER_FIREFOX);
                return true;
            }
            else if( preg_match("/Firefox$/i",$this->_agent,$matches) ) {
                $this->setVersion("");
                $this->setBrowser(self::BROWSER_FIREFOX);
                return true;
            }
        }
        return false;
    }

    protected function checkBrowserIceweasel() {
        if( stripos($this->_agent,'Iceweasel') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Iceweasel'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->setBrowser(self::BROWSER_ICEWEASEL);
            return true;
        }
        return false;
    }

    protected function checkBrowserMozilla() {
        if( stripos($this->_agent,'mozilla') !== false  && preg_match('/rv:[0-9].[0-9][a-b]?/i',$this->_agent) && stripos($this->_agent,'netscape') === false) {
            $aversion = explode(' ',stristr($this->_agent,'rv:'));
            preg_match('/rv:[0-9].[0-9][a-b]?/i',$this->_agent,$aversion);
            $this->setVersion(str_replace('rv:','',$aversion[0]));
            $this->setBrowser(self::BROWSER_MOZILLA);
            return true;
        }
        else if( stripos($this->_agent,'mozilla') !== false && preg_match('/rv:[0-9]\.[0-9]/i',$this->_agent) && stripos($this->_agent,'netscape') === false ) {
            $aversion = explode('',stristr($this->_agent,'rv:'));
            $this->setVersion(str_replace('rv:','',$aversion[0]));
            $this->setBrowser(self::BROWSER_MOZILLA);
            return true;
        }
        else if( stripos($this->_agent,'mozilla') !== false  && preg_match('/mozilla\/([^ ]*)/i',$this->_agent,$matches) && stripos($this->_agent,'netscape') === false ) {
            $this->setVersion($matches[1]);
            $this->setBrowser(self::BROWSER_MOZILLA);
            return true;
        }
        return false;
    }

    protected function checkBrowserLynx() {
        if( stripos($this->_agent,'lynx') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Lynx'));
            $aversion = explode(' ',(isset($aresult[1])?$aresult[1]:""));
            $this->setVersion($aversion[0]);
            $this->setBrowser(self::BROWSER_LYNX);
            return true;
        }
        return false;
    }

    protected function checkBrowserAmaya() {
        if( stripos($this->_agent,'amaya') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Amaya'));
            $aversion = explode(' ',$aresult[1]);
            $this->setVersion($aversion[0]);
            $this->setBrowser(self::BROWSER_AMAYA);
            return true;
        }
        return false;
    }

    protected function checkBrowserSafari() {
        if( stripos($this->_agent,'Safari') !== false && stripos($this->_agent,'iPhone') === false && stripos($this->_agent,'iPod') === false ) {
            $aresult = explode('/',stristr($this->_agent,'Version'));
            if( isset($aresult[1]) ) {
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $this->setVersion(self::VERSION_UNKNOWN);
            }
            $this->setBrowser(self::BROWSER_SAFARI);
            return true;
        }
        return false;
    }

    protected function checkBrowseriPhone() {
        if( stripos($this->_agent,'iPhone') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Version'));
            if( isset($aresult[1]) ) {
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $this->setVersion(self::VERSION_UNKNOWN);
            }
            $this->setMobile(true);
            $this->setBrowser(self::BROWSER_IPHONE);
            return true;
        }
        return false;
    }

    protected function checkBrowseriPad() {
        if( stripos($this->_agent,'iPad') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Version'));
            if( isset($aresult[1]) ) {
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $this->setVersion(self::VERSION_UNKNOWN);
            }
            $this->setMobile(true);
            $this->setBrowser(self::BROWSER_IPAD);
            return true;
        }
        return false;
    }

    protected function checkBrowseriPod() {
        if( stripos($this->_agent,'iPod') !== false ) {
            $aresult = explode('/',stristr($this->_agent,'Version'));
            if( isset($aresult[1]) ) {
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $this->setVersion(self::VERSION_UNKNOWN);
            }
            $this->setMobile(true);
            $this->setBrowser(self::BROWSER_IPOD);
            return true;
        }
        return false;
    }

    protected function checkBrowserAndroid() {
        if( stripos($this->_agent,'Android') !== false ) {
            $aresult = explode(' ',stristr($this->_agent,'Android'));
            if( isset($aresult[1]) ) {
                $aversion = explode(' ',$aresult[1]);
                $this->setVersion($aversion[0]);
            }
            else {
                $this->setVersion(self::VERSION_UNKNOWN);
            }
            $this->setMobile(true);
            $this->setBrowser(self::BROWSER_ANDROID);
            return true;
        }
        return false;
    }

    /**
     * Determine the user's platform
     */
    protected function checkPlatform() {
        if( stripos($this->_agent, 'windows') !== false ) {
            $this->_platform = self::PLATFORM_WINDOWS;
        }
        else if( stripos($this->_agent, 'iPad') !== false ) {
            $this->_platform = self::PLATFORM_IPAD;
        }
        else if( stripos($this->_agent, 'iPod') !== false ) {
            $this->_platform = self::PLATFORM_IPOD;
        }
        else if( stripos($this->_agent, 'iPhone') !== false ) {
            $this->_platform = self::PLATFORM_IPHONE;
        }
        elseif( stripos($this->_agent, 'mac') !== false ) {
            $this->_platform = self::PLATFORM_APPLE;
        }
        elseif( stripos($this->_agent, 'android') !== false ) {
            $this->_platform = self::PLATFORM_ANDROID;
        }
        elseif( stripos($this->_agent, 'linux') !== false ) {
            $this->_platform = self::PLATFORM_LINUX;
        }
        else if( stripos($this->_agent, 'Nokia') !== false ) {
            $this->_platform = self::PLATFORM_NOKIA;
        }
        else if( stripos($this->_agent, 'BlackBerry') !== false ) {
            $this->_platform = self::PLATFORM_BLACKBERRY;
        }
        elseif( stripos($this->_agent,'FreeBSD') !== false ) {
            $this->_platform = self::PLATFORM_FREEBSD;
        }
        elseif( stripos($this->_agent,'OpenBSD') !== false ) {
            $this->_platform = self::PLATFORM_OPENBSD;
        }
        elseif( stripos($this->_agent,'NetBSD') !== false ) {
            $this->_platform = self::PLATFORM_NETBSD;
        }
        elseif( stripos($this->_agent, 'OpenSolaris') !== false ) {
            $this->_platform = self::PLATFORM_OPENSOLARIS;
        }
        elseif( stripos($this->_agent, 'SunOS') !== false ) {
            $this->_platform = self::PLATFORM_SUNOS;
        }
        elseif( stripos($this->_agent, 'OS\/2') !== false ) {
            $this->_platform = self::PLATFORM_OS2;
        }
        elseif( stripos($this->_agent, 'BeOS') !== false ) {
            $this->_platform = self::PLATFORM_BEOS;
        }
        elseif( stripos($this->_agent, 'win') !== false ) {
            $this->_platform = self::PLATFORM_WINDOWS;
        }

    }
}

?>