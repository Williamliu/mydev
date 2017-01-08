/***********************************************************************************************/
/* AngularJS  TreeView                                                                         */
/* Required:  angular3.13.js ; angular-cookies.min.js ; angular.wmliu.tree.js                  */
/* Required:  angular.wmliu.tree.css                                                          */
/* Author:    William Liu                                                                      */
/* Date:      2015-05-31                                                                       */
/***********************************************************************************************/
var treeview_first_load = true;
var wmliu_tree = wmliu_tree || angular.module("wmliuTree",  ["ngCookies"]);
wmliu_tree.directive("wmliu.treeviewtitle", function (wmliuTreeService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            tree:       "=",
            linkform:   "=",
            linkcol:    "@"
        },
        template: [
                '<span class="{{ linkform.detail.cols[linkcol].errorMessage?\'wmliu-common-label-invalid\':\'\' }}" style="font-size:1.2em; margin-left:10px;" title="{{ linkform.detail.cols[linkcol].errorMessage?linkform.detail.cols[linkcol].errorMessage:tree.general.desc }}">',
                '{{tree.general.title}} ',
                '<span class="wmliu-common-label-required" ng-if="linkform.detail.cols[linkcol].required==\'1\'">*</span>',
                '</span>'
                ].join(''),
        controller: function ($scope) {
        }
    }
});

wmliu_tree.directive("wmliu.treeview", function ($compile, $cookieStore, wmliuTreeService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            name: "@",
            single: "@",
            showall: "@",
            loading: "@",
            expandnodes: "=",
            selectnodes: "=",
            linkform: "=",
            linkcol: "@",
            linkselect: "@",
            tree: "=",
            nodes: "="
            //buttonclick: "&" - can not pass parameter because it is in isolated scope
        },
        template: '<ul class="wmliu-treeview"></ul>',
        transclude: false,
        controller: function ($scope) {
            $scope.expandcurrent = {};
            $scope.getNumber = function () {
                return Math.floor((Math.random() * 60000) + 1);
            }

            $scope.getText = function (theNode, colObj) {
                var str = '';
                if (theNode) {
                    for (var key in theNode) {
                        if (theNode[key]) {
                            if ($scope.tree.listTables.vlist[colObj.col][key]) {
                                str += (str == '' ? '' : ', ') + $scope.tree.listTables.vlist[colObj.col][key];
                            }
                        }
                    }
                }
                return str;
            }


            if (treeview_first_load) {


                $scope.tree.name = $scope.name;
                // load methods
                wmliuTreeService.init[$scope.tree.name] = function (idvals) {
                    if (idvals != undefined) {
                        if (angular.isObject(idvals)) {
                            if (idvals.pid) $scope.tree.schema.idvals.pid = idvals.pid;
                            if (idvals.sid) $scope.tree.schema.idvals.sid = idvals.sid;
                        }
                    }

                    $scope.tree.schema.head.action = "init";
                    $scope.tree.schema.head.state = "load";
                    $scope.tree.schema.head.loading = 1;
                    wmliuTreeService.treeLoadAjax($scope.tree, $scope.tree.schema.head.action, $scope);
                }


                wmliuTreeService.fresh[$scope.tree.name] = function (idvals) {
                    if (idvals != undefined) {
                        if (angular.isObject(idvals)) {
                            if (idvals.pid) $scope.tree.schema.idvals.pid = idvals.pid;
                            if (idvals.sid) $scope.tree.schema.idvals.sid = idvals.sid;
                        }
                    }

                    $scope.tree.schema.head.action = "fresh";
                    $scope.tree.schema.head.state = "load";
                    $scope.tree.schema.head.loading = 1;
                    wmliuTreeService.treeLoadAjax($scope.tree, $scope.tree.schema.head.action, $scope);
                }
                // end of load methods


                wmliuTreeService.expandnodes[$scope.tree.name] = wmliuTreeService.expandnodes[$scope.tree.name] || {};
                if (wmliuTreeService.expandnodes[$scope.tree.name]) wmliuTreeService.expandnodes[$scope.tree.name] = $scope.selectnodes ? $scope.selectnodes : $cookieStore.get("wmliu.tree.expandnodes." + $scope.tree.name) || {};
                treeview_first_load = false;

                if ($scope.loading == "1") {
                    wmliuTreeService.fresh[$scope.tree.name]();
                } else {
                    wmliuTreeService.init[$scope.tree.name]();
                }
            }
        },
        compile: function (el, attrs) {
            return function (sc, el, attrs) {
                $(".lwhDivBox-Button").live("click.lwhDivBox", function (ev) {
                    $("#" + $(this).attr("did")).lwhDivBox();
                    $("#" + $(this).attr("did")).divBoxShow();
                });

                // tree title and description
                sc.getTitle = function (theNode) {
                    return sc.tree.schema.table[theNode.nodetable].title.colreplace(theNode);
                }
                sc.getDesc = function (theNode) {
                    return sc.tree.schema.table[theNode.nodetable].desc.colreplace(theNode);
                }
                // end of title

                /*** deal with nodes open|close ***/
                sc.nodeShowHide = function (theNode) {
                    if (theNode.nodes) {
                        if (theNode.nodes.length > 0) {
                            var cur_key = theNode.nodetable + "." + theNode.parentid + "." + theNode.nodeid;
                            sc.expandcurrent[cur_key] = sc.expandcurrent[cur_key] || false;
                            if (wmliuTreeService.expandnodes[sc.tree.name]) wmliuTreeService.expandnodes[sc.tree.name][cur_key] = sc.expandcurrent[cur_key];

                            if (sc.single == "1") {
                                for (var key in sc.expandcurrent) {
                                    if (key != cur_key) {
                                        sc.expandcurrent[key] = false;
                                        if (wmliuTreeService.expandnodes[sc.tree.name]) wmliuTreeService.expandnodes[sc.tree.name][key] = sc.expandcurrent[key];
                                    }
                                }
                            }
                            sc.expandcurrent[cur_key] = !sc.expandcurrent[cur_key];

                            if (wmliuTreeService.expandnodes[sc.tree.name]) {
                                wmliuTreeService.expandnodes[sc.tree.name][cur_key] = sc.expandcurrent[cur_key];
                                $cookieStore.put("wmliu.tree.expandnodes." + sc.tree.name, wmliuTreeService.expandnodes[sc.tree.name]);
                            }
                        }
                    }
                };

                sc.nodeOpen = function (theNode) {
                    if (theNode.nodes) {
                        if (theNode.nodes.length > 0) {
                            var cur_key = theNode.nodetable + "." + theNode.parentid + "." + theNode.nodeid;
                            sc.expandcurrent[cur_key] = sc.expandcurrent[cur_key] || false;
                            if (wmliuTreeService.expandnodes[sc.tree.name]) wmliuTreeService.expandnodes[sc.tree.name][cur_key] = sc.expandcurrent[cur_key];

                            if (sc.single == "1") {
                                for (var key in sc.expandcurrent) {
                                    if (key != cur_key) {
                                        sc.expandcurrent[key] = false;
                                        if (wmliuTreeService.expandnodes[sc.tree.name]) wmliuTreeService.expandnodes[sc.tree.name][key] = sc.expandcurrent[key];
                                    }
                                }
                            }
                            sc.expandcurrent[cur_key] = true;

                            if (wmliuTreeService.expandnodes[sc.tree.name]) {
                                wmliuTreeService.expandnodes[sc.tree.name][cur_key] = sc.expandcurrent[cur_key];
                                $cookieStore.put("wmliu.tree.expandnodes." + sc.tree.name, wmliuTreeService.expandnodes[sc.tree.name]);
                            }
                        }
                    }
                };

                sc.getShowState = function (theNode) {
                    var open_flag = false;
                    if (theNode.nodes) {
                        if (theNode.nodes.length > 0) {
                            var cur_key = theNode.nodetable + "." + theNode.parentid + "." + theNode.nodeid;
                            sc.expandcurrent[cur_key] = sc.expandcurrent[cur_key] || false;
                            open_flag = sc.expandcurrent[cur_key];
                        }
                    }
                    return open_flag;
                }

                sc.initShowState = function (theNode) {
                    if (theNode.nodes) {
                        if (theNode.nodes.length > 0) {
                            var cur_key = theNode.nodetable + "." + theNode.parentid + "." + theNode.nodeid;
                            sc.expandcurrent[cur_key] = sc.expandcurrent[cur_key] || false;

                            if (wmliuTreeService.expandnodes[sc.tree.name]) wmliuTreeService.expandnodes[sc.tree.name][cur_key] = wmliuTreeService.expandnodes[sc.tree.name][cur_key] || false;

                            if (wmliuTreeService.expandnodes[sc.tree.name]) sc.expandcurrent[cur_key] = wmliuTreeService.expandnodes[sc.tree.name][cur_key];
                            
                            if (sc.showall == "1") sc.expandcurrent[cur_key] = true;
                        }
                    }
                }
                /*** end of deal with nodes open/close ***/

                /*** button  & icon ***/
                sc.treeIcon = function (theNode) {
                    var ret_css = '';
                    switch (theNode.nodetable) {
                        case "pptable":
                        case "tttable":
                            if (sc.getShowState(theNode)) {
                                if (sc.tree.schema.table[theNode.nodetable].openicon)
                                    ret_css = 'background:center center url(' + sc.tree.schema.table[theNode.nodetable].openicon + ') no-repeat;';
                            } else {
                                if (sc.tree.schema.table[theNode.nodetable].closeicon)
                                    ret_css = 'background:center center url(' + sc.tree.schema.table[theNode.nodetable].closeicon + ') no-repeat;';
                            }
                            break;
                        case "sstable":
                            for (var colName in sc.tree.schema.table[theNode.nodetable].nodeicon) {
                                var iObj = sc.tree.schema.table[theNode.nodetable].nodeicon[colName];
                                if (theNode[colName] > 0) {
                                    if (iObj) ret_css = 'background:center center url(' + iObj.colreplace(theNode) + ') no-repeat;';

                                }
                            }
                            break;
                    }
                    return ret_css;
                }


                sc.changeState = function (nodeIdx, theNode) {
                    if (sc.linkform && sc.linkcol) {
                            if (sc.linkform.detail.head.state == "view") sc.linkform.detail.head.state = "update";
                            if (sc.linkform.detail.head.state == "add") sc.linkform.detail.head.state = "new";
                    }
                }


                sc.formChange = function (theNode) {
                    if (sc.linkform && ( sc.linkcol || sc.linkselect) ) {
                            if (sc.linkform.detail.head.state == "view") sc.linkform.detail.head.state = "update";
                            if (sc.linkform.detail.head.state == "add") sc.linkform.detail.head.state = "new";
                    }
                }
                /*** end of button  & icon ***/


                var contents = $compile(
                                        [
                '<li ',
						'ng-repeat="theNode in nodes" ',
                        'ng-init="initShowState(theNode);" ',
                        'class="{{theNode.type==\'nodes\'?\'nodes\':\'\'}} ',
                        '{{theNode.nodetable}} ',
                        '{{theNode.nodes?theNode.nodes.length>0?\'\':\'nodes-nochild\':\'nodes-nochild\'}}">',

                // tree line and icon
                    '<s class="line {{getShowState(theNode)?\'line-open\':\'\'}}"   ng-click="nodeShowHide(theNode)"></s>',
                    '<s class="img  {{getShowState(theNode)?\'img-open\':\'\'}} {{theNode.nodestate>0?\'wmliu-tree-nodestate wmliu-tree-nodestate-\' + theNode.nodestate:\'\'}}" ',
                    'style="{{treeIcon(theNode)}}" ',
                    'ng-click="nodeShowHide(theNode)"></s>&nbsp;',
             		
				
                /***  title and tree selection ***/
                    '<span ng-switch on="tree.schema.table[theNode.nodetable].selectmode">',
                        '<label ng-switch-when="single" class="title {{ linkform.detail.vals[linkselect]==theNode.nodeid?\'wmliu-common-input-checked\':\'\'}}" title="{{getDesc(theNode)}}">',
                                '<input ng-if="tree.schema.table[theNode.nodetable].selectmode==\'single\'" type="radio" name="wmliu.tree.{{theNode.nodetable}}.{{name}}" ng-model="linkform.detail.vals[linkselect]" ng-change="formChange();" ng-value="theNode.nodeid" />',
                                '{{getTitle(theNode)}}',
                        '</label>',

                        '<label ng-switch-when="multiple" class="title {{ linkform.detail.vals[linkselect][theNode.nodeid]?\'wmliu-common-input-checked\':\'\'}}" title="{{getDesc(theNode)}}">',
                                '<input ng-if="tree.schema.table[theNode.nodetable].selectmode==\'multiple\'" type="checkbox" name="wmliu.tree.{{theNode.nodetable}}.{{name}}" ng-model="linkform.detail.vals[linkselect][theNode.nodeid]"  ng-change="formChange();" />',
                                '{{getTitle(theNode)}}',
                        '</label>',

                        '<label ng-switch-default class="title" title="{{getDesc(theNode)}}">',
                                '{{getTitle(theNode)}}',
                        '</label>',
                    '</span>',
                /*** end of tree title ***/
				
					/*				
					'<span class="wmliu-tree-title">',
			  		'{{getTitle(theNode)}}',
					'</span>',
					*/

                /*** common : title, hidden, text, textbox ***/
                    '<span ng-repeat="col in tree.schema.cols[theNode.nodetable]" ng-switch="col.type.toLowerCase()">',
                        '<span ng-switch-when="text" class="{{col.css}} {{theNode[col.col]?\'edit\':\'\'}}">{{theNode[col.col]}}</span>',

						'<span ng-switch-when="custom">{{col.col}}</span>',
						'<span ng-switch-when="nodecount">{{theNode["nodecount"]}}</span>',

                        '<span ng-switch-when="textbox" class="edit">',
                            '<span class="inputlabel" title="{{col.desc}}">{{col.title}}</span>:',
                            '<input class="input {{col.css}}" style="{{col.style}}" type="textbox" ',
                                    'ng-model="linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]" ',
                                    'ng-change="changeState()" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                        '</span>',

                        '<span ng-switch-when="bool" class="edit">',
                            '<input class="checkbox {{col.css}}" style="{{col.style}}" type="checkbox" ',
                                    'ng-model="linkform.detail.vals[linkcol][col.col]" ',
                                    'ng-change="changeState()" />',
                            '<span class="inputlabel {{theNode[col.col]?\'wmliu-common-input-checked\':\'\'}}" title="{{col.desc}}">{{col.title}}</span>',
                        '</span>',

                        '<span ng-switch-when="radio" ng-click="$event.stopPropagation()" class="edit" ng-init="linkform.detail.vals[linkcol][theNode.nodetable]=linkform.detail.vals[linkcol][theNode.nodetable]?linkform.detail.vals[linkcol][theNode.nodetable]:{}">',
                            '<span class="inputlabel" title="{{col.desc}}">{{col.title}}</span>:',
                            '<span>',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'class="{{ linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                                    '<input class="{{col.css}}" style="{{col.style}}" type="radio" ng-model="linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]"  ng-change="changeState();" ng-value="rdObj.key" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                '</label>',
                            '</span>',
                        '</span>',

                        '<span ng-switch-when="actradio" ng-click="$event.stopPropagation()" class="edit" ng-init="linkform.detail.vals[linkcol][theNode.nodetable]=linkform.detail.vals[linkcol][theNode.nodetable]?linkform.detail.vals[linkcol][theNode.nodetable]:{}">',
                            '<span class="inputlabel" title="{{col.desc}}">{{col.title}}</span>:',
                            '<span>',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'ng-if="theNode.actbox[col.col][rdObj.key]" ', // important to filter
											'class="{{ linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                                    '<input class="{{col.css}}" style="{{col.style}}" type="radio" ng-model="linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]"  ng-change="changeState();" ng-value="rdObj.key" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                '</label>',
                            '</span>',
                        '</span>',


                /************** radiocom  *****************************************/
						'<span ng-switch-when="radiocom" ng-init="comcnt = getNumber();">',
						'<a class="lwhDivBox-Button wmliu-common-icon18 wmliu-common-icon18-search" did="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid + \'-\' + comcnt }}" title="Please Select"></a> ',
						'<span class="wmliu-common-input-checked">',
							'{{ tree.listTables.vlist[col.col][ linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid] ] }}',
						'</span>',
						'<div id="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid + \'-\' + comcnt }}" ww="400px" hh="30px" class="lwhDivBox">',

						'<div class="lwhDivBox-content">',
							'<span ng-repeat="rdObj in tree.listTables.checklist[col.col]">',
								'<label     class="{{ linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
											'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
									'<input type="radio" ng-model="linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]" ng-value="rdObj.key" ng-change="changeState()" />',
									'{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
								'</label>',
								'<br ng-if="col.colnum>0?(($index+1)%col.colnum)==0:false" />',
							'</span>',

						'</div>',

						'</div>',
						'</span>',
                /************ end of radiocom **************************************/


                        '<span ng-switch-when="select" ng-click="$event.stopPropagation()" class="edit">',
                            '<span class="inputlabel" title="{{col.desc}}">{{col.title}}</span>:',
			                '<select class="{{col.css}}" ng-model="linkform.detail.vals[linkcol][theNode.nodetable][theNode.nodeid]" ng-change="changeState();" ',
                            'ng-options="sObj.key as (sObj.title?sObj.title:sObj.key.uword()) for sObj in tree.listTables.checklist[col.col]" ',
                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
			                "<option value=''></option>",
                            "</select>",
                        '</span>',

                        '<span ng-switch-when="actbox" ng-click="$event.stopPropagation()" class="edit" ng-init="theNode[col.col]=theNode[col.col]?theNode[col.col]:{};" >',
                            '<span class="inputlabel" title="{{col.desc}}">{{col.title}}</span>:',
                            '<span>',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'ng-if="theNode.actbox[col.col][rdObj.key]" ', // important to filter
                                            'class="{{ linkform.detail.vals[linkcol][col.col][theNode.nodeid][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                                    '<input class="{{col.css}}" style="{{col.style}}" type="checkbox" ng-model="linkform.detail.vals[linkcol][col.col][theNode.nodeid][rdObj.key]"  ng-change="changeState();" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                "</label>",
                            '</span>',
                        '</span>',


                        '<span ng-switch-when="checkbox" ng-click="$event.stopPropagation()" class="edit" ng-init="linkform.detail.vals[linkcol]=linkform.detail.vals[linkcol]?linkform.detail.vals[linkcol]:{};" >',
                            '<span class="inputlabel" title="{{col.desc}}">{{col.title}}</span>:',
                            '<span class>',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'class="{{ linkform.detail.vals[linkcol][col.col][theNode.nodeid][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                                    '<input class="checkbox {{col.css}}" style="{{col.style}}" type="checkbox" ng-model="linkform.detail.vals[linkcol][col.col][theNode.nodeid][rdObj.key]"  ng-change="changeState();" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                "</label>",
                            '</span>',
                        '</span>',


               			 /************** checkcom  *****************************************/
                        '<span ng-switch-when="checkcom" ng-init="comcnt = getNumber();" class="edit">',
                            '<a class="lwhDivBox-Button wmliu-common-icon18 wmliu-common-icon18-search" did="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid + \'-\' + comcnt }}" title="Please Select"></a> ',
                            '<span class="wmliu-common-input-checked" style="min-width:60px;">{{ getText(linkform.detail.vals[linkcol][col.col][theNode.nodeid], col) }}</span>',

                            '<div id="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' + theNode.nodeid + \'-\' + comcnt }}" ww="400px" hh="30px" class="lwhDivBox">',

                			//checkbox below
                            '<div class="lwhDivBox-content"  ng-init="linkform.detail.vals[linkcol]=linkform.detail.vals[linkcol]?linkform.detail.vals[linkcol]:{};">',
			                    '<span ng-repeat="rdObj in tree.listTables.checklist[col.col]">',
                                '<label class="{{ linkform.detail.vals[linkcol][col.col][theNode.nodeid][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                                '<input class="checkbox" type="checkbox" ng-model="linkform.detail.vals[linkcol][col.col][theNode.nodeid][rdObj.key]" ng-change="changeState();" />',
                                '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                '</label>',
                                '<br ng-if="col.colnum>0?(($index+1)%col.colnum)==0:false" />',
                                '</span>',
                            '</div>',
               				// end of checkbox

                            '</div>',
                        '</span>',
                		/************ end of checkcom **************************************/


                    '</span>',
                /*** end of common ***/

                    '<wmliu.treeview ',
									'name="{{name}}" single="{{single}}" showall="{{showall}}" ',
                                    'expandnodes="expandnodes" selectnodes="selectnodes" linkform="linkform" linkcol="{{linkcol}}" linkselect="{{linkselect}}" tree="tree" nodes="theNode.nodes" ',
                                    'ng-show="getShowState(theNode)">',
                    '</wmliu.treeview>',
                '</li>'
                                        ].join('')
                                        )(sc);

                el.append(contents);
            }
        }
    }
});



wmliu_tree.service("wmliuTreeService", function () {
    var self = this;

    self.expandnodes = {}
    self.selectnode = {};

    self.init = [];
    self.fresh = [];
    self.load = [];
    self.clear = [];

    self.callBack = []; //angular.noop;

    this.treeLoadAjax = function (scTree, action, sc) {
        if (sc.tree.schema.head.wait == "1") wait_show();

        var theTree = {};
        theTree.schema = {};
        theTree.schema.head = angular.copy(scTree.schema.head);
        theTree.schema.table = angular.copy(scTree.schema.table);
        theTree.schema.cols = angular.copy(scTree.schema.cols);
        theTree.schema.idvals = angular.copy(scTree.schema.idvals);
        theTree.schema.checklist = angular.copy(scTree.schema.checklist);
        theTree.nodes = [];
        // call  before ajax  callback function, you can modify cform object.    
        var evtObj = self.getCallBack(sc.tree.name, action);
        if (evtObj) if (evtObj.before) if (angular.isFunction(evtObj.before)) evtObj.before(action, theTree);

        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                tree: theTree
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (sc.tree.schema.head.wait == "1") wait_hide();
                sc.tree.schema.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, scTree);
                //tool_tips("Error (wmliu_treeview_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.tree.schema.head.wait == "1") wait_hide();
				
				errorHandler(req);
  				sc.tree.schema.head.loading = 0;
				sc.$apply();
            	
				if(req.errorCode < 900 ) {
	                self.updateTreeData(req.tree, scTree, sc);
				}

                // after ajax,   action : new, update, delete
                if (req.tree.schema.head.error < 1) {
                    evtObj1 = self.getCallBack(sc.tree.name, req.tree.schema.head.action);
                    if (evtObj1) if (evtObj1.success) if (angular.isFunction(evtObj1.success)) evtObj1.success(req.tree.schema.head.action, scTree);
                }
            },
            type: "post",
            url: "ajax/wmliu_treeview_data.php"
        });
    }

    this.treeSaveAjax = function (scTree, scNodes, nodeIdx, action, sc) {
        if (sc.tree.schema.head.wait == "1") wait_show();
        // call  before ajax  callback function, you can modify cform object.    

        var theTree = {};
        theTree.schema = {};
        theTree.schema.head = angular.copy(scTree.schema.head);
        theTree.schema.table = angular.copy(scTree.schema.table);
        theTree.schema.cols = angular.copy(scTree.schema.cols);
        theTree.schema.idvals = angular.copy(scTree.schema.idvals);
        theTree.schema.checklist = angular.copy(scTree.schema.checklist);
        theTree.node = angular.copy(scNodes[nodeIdx]);
        theTree.node.nodes = null;

        var evtObj = self.getCallBack(sc.tree.name, action);
        if (evtObj) if (evtObj.before) if (angular.isFunction(evtObj.before)) evtObj.before(action, theTree);


        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,

                tree: theTree
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {S
                if (sc.tree.schema.head.wait == "1") wait_hide();
                sc.tree.schema.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, sc);
                //tool_tips("Error (wmliu_treeview_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.tree.schema.head.wait == "1") wait_hide();

				errorHandler(req);
  				sc.tree.schema.head.loading = 0;
				sc.$apply();
            	
				if(req.errorCode < 900 ) {
	                self.updateTreeNode(req.tree, scTree, scNodes, nodeIdx, sc);
				}

                evtObj1 = self.getCallBack(sc.tree.name, req.tree.schema.head.action);
                if (evtObj1) if (evtObj1.success) if (angular.isFunction(evtObj1.success)) evtObj1.success(req.schema.head.action, sc);

            },
            type: "post",
            url: "ajax/wmliu_treeview_data.php"
        });
    }

    self.updateTreeData = updateTreeData;
    self.updateTreeNode = updateTreeNode;

    self.setCallBack = function (eid, callbackFunc, action) {
        self.callBack[eid] = self.callBack[eid] || {};
        if (action) {
            if (angular.isArray(action)) {
                for (var key in action) {
                    self.callBack[eid][action[key]] = callbackFunc;
                }
            } else {
                self.callBack[eid][action] = callbackFunc;
            }
        } else {
            self.callBack[eid] = callbackFunc || {};
        }
    }

    self.getCallBack = function (eid, action) {
        var tmp = self.callBack[eid] || {};
        if (action && action != "") {
            if (tmp[action]) return tmp[action];
        }
        return tmp;
    }

});

/****** javascript **********************************/
function updateTreeData (rTree, oTree, sc) {
        oTree.schema.head.loading = 0;
        if (rTree.schema.head.error != "1") {

            if (rTree.schema.head) oTree.schema.head = angular.copy(rTree.schema.head);

            // don't directly copy listTables,   we will reservce user-defined checklist;
			if (rTree.listTables) {
				if(!oTree.listTables) oTree.listTables = {};
				$.extend(oTree.listTables, rTree.listTables);  
			}
            
            if (rTree.nodes) oTree.nodes = angular.copy(rTree.nodes);
            
            oldnodes = [];
            nodesToarray(oTree.nodes);
            sc.tree.oldnodes = oldnodes;
        } else {
            if (rForm.schema.head) oForm.detail.head        = angular.copy(rForm.schema.head);
        }
        sc.$apply();
}


function updateTreeNode (rTree, oTree, scNodes, nodeIdx, sc) {
        oTree.schema.head.loading = 0;
        if (rTree.schema.head.error != "1") {
            if(rTree.schema.head) oTree.schema.head = angular.copy(rTree.schema.head);
            
            switch(rTree.node.nodestate) {
                case "1":
                case "2":
                    if (rTree.node) {
                        for (var key in rTree.node) {
                            if (key != "nodes") scNodes[nodeIdx][key] = angular.copy(rTree.node[key]);
                        }
                        var oldIdx = rTree.node.nodetable + ":" + rTree.node.parentid + ":" + rTree.node.nodeid;
                        oldnodes[oldIdx] = angular.copy(rTree.node);
                    }
                    scNodes[nodeIdx]["nodestate"] = 0;
                    break;
                case "3":
                    scNodes[nodeIdx]["nodestate"] = 0;
                    scNodes.splice(nodeIdx, 1);
                    break;
            }

        } else {
            if(rTree.schema.head) oTree.schema.head = angular.copy(rTree.schema.head);
            scNodes[nodeIdx].error = angular.copy(rTree.node.error);
            scNodes[nodeIdx].errorMessage = angular.copy(rTree.node.errorMessage);
        }
        sc.$apply();
}

var oldnodes = [];
function nodesToarray(nodes) {
    if(nodes && angular.isArray(nodes) ) {
        if(nodes.length>0) {
            for(var key in nodes) {
                var nodeObj = nodes[key];
                var nodeIdx = nodeObj.nodetable + ":" + nodeObj.parentid + ":" + nodeObj.nodeid;
                oldnodes[nodeIdx] = angular.copy(nodes[key]);
                nodesToarray(nodes[key].nodes);
            }
        }
    } 
}