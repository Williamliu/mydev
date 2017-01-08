var wmliu_accord= angular.module("wmliuAccord",  ["ngCookies"]);
wmliu_accord.directive("wmliu.accord", function (wmliuAccordService, $cookieStore) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            list: "=",
            name: "@",
            color: "@"
        },
        template: [
    '<ul class="wmliu-accord wmliu-accord-{{color}}">',
        '<li    class="{{ list.openArr[rdObj.pid]?\'open\':\'\' }}" ng-model="list.openArr[rdObj.pid]" ng-click="changeState(rdObj); $event.stopPropagation();" ng-init="list.openArr[rdObj.pid]=rdObj.pid==list.schema.idvals.pid?true:false" ',
                'ng-if="list.list.head.empty!=1?(rdObj.nodes?(rdObj.nodes.length>0?true:false):false):true" ng-repeat="rdObj in list.list.nodes">',
            '<a class="state"></a>',
            '<span title="{{ getDescPP(rdObj) }}">{{ getTitlePP(rdObj) }}</span>',
            '<ul ng-if="rdObj.nodes?rdObj.nodes.length>0?true:false:false">',
                '<li    class="{{ rdObj1.sid==list.schema.idvals.sid?\'selected\':\'\' }}" ',
                        'ng-click="nodeSelect(rdObj1); $event.stopPropagation();" ',
                        'ng-repeat="rdObj1 in rdObj.nodes">',
                    '<a class="state"></a>',
                    '<span title="{{ getDescSS(rdObj1) }}">{{ getTitleSS(rdObj1) }}</span>',
                '</li>',
            '</ul>',
        '</li>',
    '</ul>'
				  ].join(""),
        controller: function ($scope) {
            $scope.list.name = $scope.name;
            $scope.list.openArr = $scope.list.openArr || {};

            wmliuAccordService.load[$scope.list.name] = function () {
                $scope.list.list.head.action = "load";
                $scope.list.list.head.state = "load";
                $scope.list.list.head.loading = 1;
                var load_list = {};
                load_list.schema = $scope.list.schema;
                load_list.list = $scope.list.list;
                wmliuAccordService.listAjax(load_list, $scope.list.list.head.action, $scope, $scope.list.list.head.wait);
            }


            wmliuAccordService.select[$scope.list.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.list.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.list.schema.idvals.sid = idvals.sid;
                    }
                } else {
                    $scope.list.schema.idvals.pid = "";
                    $scope.list.schema.idvals.sid = "";
                }

                for (var key in $scope.list.list.nodes) {
                    var otherItemFlag = false;
                    for (var key1 in $scope.list.list.nodes[key].nodes) {
                        if ($scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid) otherItemFlag = true;
                    }
                    $scope.list.openArr[$scope.list.list.nodes[key].pid] = otherItemFlag;
                }
            }

            var evtObj = wmliuAccordService.getChange($scope.list.name);

            $scope.getTitlePP = function (theNode) {
                var title = $scope.list.schema.table["pptable"].title.colreplace(theNode);
                title = title.replace("[length]", theNode.nodes.length);
                return title; //$scope.list.schema.table["pptable"].title.colreplace(theNode);
            }
            $scope.getDescPP = function (theNode) {
                return $scope.list.schema.table["pptable"].desc.colreplace(theNode);
            }

            $scope.getTitleSS = function (theNode) {
                return $scope.list.schema.table["sstable"].title.colreplace(theNode);
            }
            $scope.getDescSS = function (theNode) {
                return $scope.list.schema.table["sstable"].desc.colreplace(theNode);
            }



            $scope.getText = function () {
                var robj = {};
                var curObj = $.grep($scope.list.droplist, function (nobj, idx) {
                    return (nobj.key == $scope.list.lang);
                });
                if (curObj && curObj.length > 0) robj = curObj[0];
                return robj;
            }

            $scope.changeState = function (sObj) {
                $scope.list.openArr[sObj.pid] = !$scope.list.openArr[sObj.pid]

                var curItemFlag = false;
                for (var key in $scope.list.list.nodes) {
                    if ($scope.list.list.nodes[key].pid == sObj.pid) {
                        for (var key1 in $scope.list.list.nodes[key].nodes) {
                            if ($scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid) curItemFlag = true;
                        }
                    }
                }

                if (curItemFlag) {
                    for (var key in $scope.list.list.nodes) {
                        if ($scope.list.list.nodes[key].pid != sObj.pid) {
                            var otherItemFlag = false;
                            for (var key1 in $scope.list.list.nodes[key].nodes) {
                                if ($scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid) otherItemFlag = true;
                            }
                            if ($scope.list.list.head.single == "1")
                                $scope.list.openArr[$scope.list.list.nodes[key].pid] = otherItemFlag && $scope.list.openArr[sObj.pid];
                            else
                                if ($scope.list.openArr[sObj.pid] && otherItemFlag) $scope.list.openArr[$scope.list.list.nodes[key].pid] = true;
                        }
                    }
                } else {
                    if ($scope.list.openArr[sObj.pid] && $scope.list.list.head.single == "1") {
                        for (var key in $scope.list.openArr) {
                            if (key != sObj.pid) $scope.list.openArr[key] = false;
                        }
                    }
                }
            }

            $scope.nodeSelect = function (sObj) {
                $scope.list.schema.idvals.pid = sObj.pid;
                $scope.list.schema.idvals.sid = sObj.sid;


                var curItemFlag = false;
                for (var key in $scope.list.list.nodes) {
                    if ($scope.list.list.nodes[key].pid == sObj.pid) {
                        for (var key1 in $scope.list.list.nodes[key].nodes) {
                            if ($scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid) curItemFlag = true;
                        }
                    }
                }

                if (curItemFlag) {
                    for (var key in $scope.list.list.nodes) {
                        if ($scope.list.list.nodes[key].pid != sObj.pid) {
                            var otherItemFlag = false;
                            for (var key1 in $scope.list.list.nodes[key].nodes) {
                                if ($scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid) otherItemFlag = true;
                            }
                            if ($scope.list.list.head.single == "1")
                                $scope.list.openArr[$scope.list.list.nodes[key].pid] = otherItemFlag && $scope.list.openArr[sObj.pid];
                            else
                                if ($scope.list.openArr[sObj.pid] && otherItemFlag) $scope.list.openArr[$scope.list.list.nodes[key].pid] = true;
                        }
                    }
                } else {
                    if ($scope.list.openArr[sObj.pid] && $scope.list.list.head.single == "1") {
                        for (var key in $scope.list.openArr) {
                            if (key != sObj.pid) $scope.list.openArr[key] = false;
                        }
                    }
                }

                if (evtObj) if (angular.isFunction(evtObj)) evtObj(sObj);
            }

            wmliuAccordService.load[$scope.list.name]();
        }
    }
});

wmliu_accord.directive("wmliu.accord1", function (wmliuAccordService, $cookieStore) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            list: "=",
            name: "@",
            color: "@"
        },
        template: [
	'<ul class="wmliu-accord1">',
        '<li class="{{ list.openArr[rdObj.pid]?\'selected\':\'\' }}" ng-model="list.openArr[rdObj.pid]" ng-click="changeState(rdObj); $event.stopPropagation();" ng-init="list.openArr[rdObj.pid]=rdObj.pid==list.schema.idvals.pid?true:false" ',
                'ng-if="list.list.head.empty!=1?(rdObj.nodes?(rdObj.nodes.length>0?true:false):false):true" ng-repeat="rdObj in list.list.nodes">',
            '<span title="{{ getDescPP(rdObj) }}">{{ getTitlePP(rdObj) }}</span>',
            '<ul ng-if="rdObj.nodes?rdObj.nodes.length>0?true:false:false">',
                '<li class="{{ rdObj1.sid==list.schema.idvals.sid?\'selected\':\'\' }}" ',
                        'ng-click="nodeSelect(rdObj1); $event.stopPropagation();" ',
                        'ng-repeat="rdObj1 in rdObj.nodes">',
                    '<span title="{{ getDescSS(rdObj1) }}">{{ getTitleSS(rdObj1) }}</span>',
                '</li>',
            '</ul>',
        '</li>',
    '</ul>'
				  ].join(""),
        controller: function ($scope) {
            $scope.list.name = $scope.name;
			$scope.list.openArr = $scope.list.openArr || {};
            
			wmliuAccordService.load[$scope.list.name] = function () {
                $scope.list.list.head.action = "load";
                $scope.list.list.head.state = "load";
                $scope.list.list.head.loading = 1;
                var load_list = {};
                load_list.schema    = $scope.list.schema;
                load_list.list      = $scope.list.list;
                wmliuAccordService.listAjax(load_list, $scope.list.list.head.action, $scope, $scope.list.list.head.wait);
            }


            wmliuAccordService.select[$scope.list.name] = function (idvals) {
				if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.list.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.list.schema.idvals.sid = idvals.sid;
                    }
                } else {
					$scope.list.schema.idvals.pid = "";
                    $scope.list.schema.idvals.sid = "";
				}
				
				for (var key in $scope.list.list.nodes) {
						var otherItemFlag = false;
						for(var key1 in $scope.list.list.nodes[key].nodes ) {
							 if( $scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid ) otherItemFlag = true;
						}
						$scope.list.openArr[$scope.list.list.nodes[key].pid] = otherItemFlag;
				}
				
            }




            var evtObj = wmliuAccordService.getChange($scope.list.name);

            $scope.getTitlePP = function (theNode) {
				var title = $scope.list.schema.table["pptable"].title.colreplace(theNode);
				title = title.replace("[length]", theNode.nodes.length);
                return title; //$scope.list.schema.table["pptable"].title.colreplace(theNode);
            }
            $scope.getDescPP = function (theNode) {
                return $scope.list.schema.table["pptable"].desc.colreplace(theNode);
            }

            $scope.getTitleSS = function (theNode) {
                return $scope.list.schema.table["sstable"].title.colreplace(theNode);
            }
            $scope.getDescSS = function (theNode) {
                return $scope.list.schema.table["sstable"].desc.colreplace(theNode);
            }

            $scope.getText = function () {
                var robj = {};
                var curObj = $.grep($scope.list.droplist, function (nobj, idx) {
                    return (nobj.key == $scope.list.lang);
                });
                if (curObj && curObj.length > 0) robj = curObj[0];
                return robj;
            }

			/**** changeState ******************************************************/
            $scope.changeState = function (sObj) {
				$scope.list.openArr[sObj.pid] = !$scope.list.openArr[sObj.pid]
				var curItemFlag = false;
				for (var key in $scope.list.list.nodes) {
					if ($scope.list.list.nodes[key].pid == sObj.pid) {
						for(var key1 in $scope.list.list.nodes[key].nodes ) {
							 if( $scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid ) curItemFlag = true;
						}
					}
				}

                if( curItemFlag ) {
						for (var key in $scope.list.list.nodes) {
							if ($scope.list.list.nodes[key].pid != sObj.pid) {
								var otherItemFlag = false;
								for(var key1 in $scope.list.list.nodes[key].nodes ) {
									 if( $scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid ) otherItemFlag = true;
								}
								if ($scope.list.list.head.single == "1") 
									$scope.list.openArr[$scope.list.list.nodes[key].pid] = otherItemFlag && $scope.list.openArr[sObj.pid];
								else 
									if( $scope.list.openArr[sObj.pid] && otherItemFlag ) $scope.list.openArr[$scope.list.list.nodes[key].pid] = true;
							}
						}
				} else {
					if ($scope.list.openArr[sObj.pid] && $scope.list.list.head.single == "1") {
						for(var key in $scope.list.openArr) {
							if(key != sObj.pid) $scope.list.openArr[key] = false;
						}
					}
				}
				
            }
			/*************************************************************************/
			
			/**** nodeSelect ******************************************************/
            $scope.nodeSelect = function (sObj) {
                $scope.list.schema.idvals.pid = sObj.pid;
                $scope.list.schema.idvals.sid = sObj.sid;


				var curItemFlag = false;
				for (var key in $scope.list.list.nodes) {
					if ($scope.list.list.nodes[key].pid == sObj.pid) {
						for(var key1 in $scope.list.list.nodes[key].nodes ) {
							 if( $scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid ) curItemFlag = true;
						}
					}
				}

                if( curItemFlag ) {
						for (var key in $scope.list.list.nodes) {
							if ($scope.list.list.nodes[key].pid != sObj.pid) {
								var otherItemFlag = false;
								for(var key1 in $scope.list.list.nodes[key].nodes ) {
									 if( $scope.list.list.nodes[key].nodes[key1].sid == $scope.list.schema.idvals.sid ) otherItemFlag = true;
								}
								if ($scope.list.list.head.single == "1") 
									$scope.list.openArr[$scope.list.list.nodes[key].pid] = otherItemFlag && $scope.list.openArr[sObj.pid];
								else 
									if( $scope.list.openArr[sObj.pid] && otherItemFlag ) $scope.list.openArr[$scope.list.list.nodes[key].pid] = true;
							}
						}
				} else {
					if ($scope.list.openArr[sObj.pid] && $scope.list.list.head.single == "1") {
						for(var key in $scope.list.openArr) {
							if(key != sObj.pid) $scope.list.openArr[key] = false;
						}
					}
				}

                if (evtObj) if (angular.isFunction(evtObj)) evtObj(sObj);
            }
			/*************************************************************************/
			
            wmliuAccordService.load[$scope.list.name]();
        }
    }
});



/******************************************************************************************
/*** Service ***/
wmliu_accord.service("wmliuAccordService", function () {
    var self = this;
    self.load = [];
    self.select = [];
    self.changeEvent = [];

    self.setChange = function (eid, changeEvent) {
        self.changeEvent[eid] = self.changeEvent[eid] || {};
        if (angular.isFunction(changeEvent)) {
            self.changeEvent[eid] = changeEvent;
        }
    }

    self.getChange = function (eid) {
        var tmp = self.changeEvent[eid] || null;
        return tmp;
    }


    this.listAjax = function (clist, action, sc, wait) {
        if (wait == "1") wait_show();
        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                list: clist
                // do not need to send rows
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (wait == "1") wait_hide();
                sc.list.list.head.loading = 0;
                //tool_tips("Error (wmliu_accord_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (wait == "1") wait_hide();
				errorHandler(req);
				if( req.errorCode < 900 ) {
	                self.updateData(req.list, sc);
				}
	        },
            type: "post",
            url: "ajax/wmliu_accord_data.php"
        });
    }

    self.updateData = updateAccordData;
});

/******************************************************************************************
/*** Javascript ***/

function updateAccordData(rlist, sc) {
    sc.list.list.head.loading = 0;
    if (rlist) {
        sc.list.list.nodes = angular.copy(rlist.list.nodes);
    }
	sc.$apply();

	if( sc.list.list.head.showall=="1" ) {
		for (var key in sc.list.list.nodes) {
			sc.list.openArr[sc.list.list.nodes[key].pid] = true;
		}
	} else {
		if( sc.list.schema.idvals.sid ) {
			for (var key in sc.list.list.nodes) {
					var otherItemFlag = false;
					for(var key1 in sc.list.list.nodes[key].nodes ) {
						 if( sc.list.list.nodes[key].nodes[key1].sid == sc.list.schema.idvals.sid ) otherItemFlag = true;
					}
					sc.list.openArr[sc.list.list.nodes[key].pid] = otherItemFlag;
			}
		}
	}
	sc.$apply();
}


