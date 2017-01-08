/***********************************************************************************************/
/* AngularJS  TreeView                                                                         */
/* Required:  angular3.13.js ; angular-cookies.min.js ; angular.wmliu.tree.js                  */
/* Required:  angular.wmliu.tree.css                                                          */
/* Author:    William Liu                                                                      */
/* Date:      2015-05-31                                                                       */
/***********************************************************************************************/
var tree_first_load = true;
var wmliu_tree = wmliu_tree || angular.module("wmliuTree",  ["ngCookies"]);
wmliu_tree.directive("wmliu.treetitle", function (wmliuTreeService) {
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
                '<a ng-click="buttonClick();$event.stopPropagation()" class="wmliu-common-icon16 wmliu-common-icon16-folder"></a>',
                '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.buttonClick = function () {
                var newNode = { nodetable: "pptable", type: "nodes", parentid: $scope.tree.schema.idvals.rootid, nodestate: 2 };
                $scope.tree.nodes = $scope.tree.nodes || [];
                $scope.tree.nodes.push(newNode);
            }
        }
    }
});

wmliu_tree.directive("wmliu.tree", function ($compile, $cookieStore, wmliuTreeService) {
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
            tree: "=",
            nodes: "="
            //buttonclick: "&" - can not pass parameter because it is in isolated scope
        },
        template: '<ul class="wmliu-tree"></ul>',
        transclude: false,
        controller: function ($scope) {
            $scope.expandcurrent = {};
            $scope.getNumber = function () {
                return Math.floor((Math.random() * 60000) + 1);
            }

            $scope.getText = function (theNode, colObj) {
                var str = '';
                if (theNode[colObj.col]) {
                    for (var key in theNode[colObj.col]) {
                        if (theNode[colObj.col][key]) {
                            if ($scope.tree.listTables.vlist[colObj.col][key]) {
                                str += (str == '' ? '' : ', ') + $scope.tree.listTables.vlist[colObj.col][key];
                            }
                        }
                    }
                }

                if (colObj.other) {
                    if (theNode[colObj.other]) {
                        str += (str ?', ' : '') + theNode[colObj.other];
                    }
                }
                return str;
            }


            if (tree_first_load) {


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
                tree_first_load = false;

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

                sc.buttonState = function (theNode, btn_name) {
                    var btnActive = 0;
                    var ret_css = "";
                    btnActive = sc.tree.schema.buttons.rights[btn_name] && wmliuTreeService.nodeButton[theNode.nodestate ? theNode.nodestate : 0][btn_name];
                    if (btn_name == "folder" && theNode.nodetable == "pptable" && sc.tree.schema.table.pptable.pcol == "") btnActive = 0;
                    if (btn_name == "delete") if (theNode.nodes) if (theNode.nodes.length > 0) btnActive = 0;
                    if (btnActive < 1) ret_css = "wmliu-common-icon16-" + btn_name + "-na";
                    return ret_css;
                }

                sc.buttonClick = function (btn_name, nodeIdx, theNode) {
                    switch (btn_name) {
                        case "folder":
                            var newNode = { nodetable: theNode.nodetable, type: "nodes", parentid: theNode.nodeid, nodestate: 2 };
                            theNode.nodes = theNode.nodes || [];
                            theNode.nodes.push(newNode);
                            sc.nodeOpen(theNode);
                            break;
                        case "add":
                            if (theNode.nodetable == "pptable" && sc.tree.schema.table.tttable) {
                                var newNode = { nodetable: "tttable", type: "nodes", parentid: theNode.nodeid, nodestate: 2 };
                                theNode.nodes = theNode.nodes || [];
                                theNode.nodes.push(newNode);
                                sc.nodeOpen(theNode);
                            } else {
                                var newNode = { nodetable: "sstable", type: "node", grandid: theNode.parentid, parentid: theNode.nodeid, nodestate: 2 };
                                theNode.nodes = theNode.nodes || [];
                                theNode.nodes.push(newNode);
                                sc.nodeOpen(theNode);
                            }
                            break;
                        case "cancel":
                            switch (theNode.nodestate) {
                                case 1:
                                    for (var key in sc.tree.schema.cols[theNode.nodetable]) {
                                        var colObj = sc.tree.schema.cols[theNode.nodetable][key];
                                        var colName = colObj.col;

                                        switch (colObj.type) {
                                            case "textbox":
                                            case "select":
                                            case "bool":
                                            case "radio":
                                            case "radiocom":
                                                var oldIdx = theNode.nodetable + ":" + theNode.parentid + ":" + theNode.nodeid;
                                                sc.tree.oldnodes[oldIdx][colName] = sc.tree.oldnodes[oldIdx][colName] || "";
                                                theNode[colName] = sc.tree.oldnodes[oldIdx][colName];
                                                break;
                                            case "actbox":
                                            case "checkbox":
                                            case "checkcom":
                                                var oldIdx = theNode.nodetable + ":" + theNode.parentid + ":" + theNode.nodeid;
                                                for (var i in theNode[colName]) {
                                                    theNode[colName][i] = sc.tree.oldnodes[oldIdx][colName][i] ? true : false;

                                                }
                                                break;
                                        }
                                    }
                                    theNode.nodestate = 0;
                                    break;
                                case 2:
                                    sc.nodes.splice(nodeIdx, 1);
                                    break;
                                case 3:
                                    var oldIdx = theNode.nodetable + ":" + theNode.parentid + ":" + theNode.nodeid;
                                    sc.nodes[nodeIdx] = angular.copy(sc.tree.oldnodes[oldIdx]);
                                    sc.nodes[nodeIdx].nodestate = 0;
                                    break;
                            }
                            break;
                        case "save":
                            sc.tree.schema.head.action = "save";
                            sc.tree.schema.head.state = "save";
                            sc.tree.schema.head.loading = 1;

                            wmliuTreeService.treeSaveAjax(sc.tree, sc.nodes, nodeIdx, sc.tree.schema.head.action, sc);
                            break;
                        case "delete":
                            theNode.nodestate = 3;
                            break;
                    }
                }

                sc.changeState = function (nodeIdx, theNode) {
                    var oldIdx = theNode.nodetable + ":" + theNode.parentid + ":" + theNode.nodeid;
                    theNode.nodestate = theNode.nodestate || 0;
                    if (theNode.nodestate < 2) {
                        for (var key in sc.tree.schema.cols[theNode.nodetable]) {
                            var colObj = sc.tree.schema.cols[theNode.nodetable][key];
                            var colName = colObj.col;
                            switch (colObj.type) {
                                case "textbox":
                                case "bool":
                                case "select":
                                case "radiocom":
                                case "radio":
                                    if (theNode[colName] != sc.tree.oldnodes[oldIdx][colName]) {
                                        theNode.nodestate = 1;
                                    }
                                    if(colObj.other) {
                                        if(theNode[colObj.other]!=sc.tree.oldnodes[oldIdx][colObj.other]) theNode.nodestate = 1;
                                    }
                                    break;
                                case "actbox":
                                case "checkcom":
                                case "checkbox":
                                    sc.tree.oldnodes[oldIdx][colName] = sc.tree.oldnodes[oldIdx][colName] || {};
                                    for (var i in theNode[colName]) {
                                        if (theNode[colName][i] != sc.tree.oldnodes[oldIdx][colName][i]) {
                                            theNode.nodestate = 1;
                                            break;
                                        }
                                    }
                                    if(colObj.other) {
                                        if(theNode[colObj.other]!=sc.tree.oldnodes[oldIdx][colObj.other]) theNode.nodestate = 1;
                                    }
                                    break;
                            }
                        }
                    }
                }


                sc.formChange = function (theNode) {
                    if (sc.linkform && sc.linkcol) {
                        if (sc.linkform.detail.cols[sc.linkcol]["table"] == theNode.nodetable) {
                            if (sc.linkform.detail.head.state == "view") sc.linkform.detail.head.state = "update";
                            if (sc.linkform.detail.head.state == "add") sc.linkform.detail.head.state = "new";
                        }
                    }
                }
                /*** end of button  & icon ***/


                var contents = $compile(
                                        [
                '<li id="tree.{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid}}"	',
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
                        '<label ng-switch-when="single" class="title {{linkform.linkvals[linkcol][theNode.nodetable]==theNode.nodeid?\'wmliu-common-input-checked\':\'\'}}" title="{{getDesc(theNode)}}">',
                                '<input ng-if="tree.schema.table[theNode.nodetable].selectmode==\'single\'" type="radio" name="wmliu.tree.{{theNode.nodetable}}.{{name}}" ng-model="linkform.linkvals[linkcol][theNode.nodetable]" ng-change="formChange(theNode);" ng-value="theNode.nodeid" />',
                                '{{getTitle(theNode)}}',
                        '</label>',

                        '<label ng-switch-when="multiple" class="title {{linkform.linkvals[linkcol][theNode.nodetable][theNode.nodeid]?\'wmliu-common-input-checked\':\'\'}}" title="{{getDesc(theNode)}}">',
                                '<input ng-if="tree.schema.table[theNode.nodetable].selectmode==\'multiple\'" type="checkbox" name="wmliu.tree.{{theNode.nodetable}}.{{name}}" ng-model="linkform.linkvals[linkcol][theNode.nodetable][theNode.nodeid]"  ng-change="formChange(theNode);" />',
                                '{{getTitle(theNode)}}',
                        '</label>',

                        '<label ng-switch-default class="title" title="{{getDesc(theNode)}}">',
                                '{{getTitle(theNode)}}',
                        '</label>',
                    '</span>',
                /*** end of tree title ***/

                /*** common : title, hidden, text, textbox ***/
                    '<span ng-repeat="col in tree.schema.cols[theNode.nodetable]" ng-switch="col.type.toLowerCase()">',

                        '<input ng-switch-when="hidden" type="hidden" ng-model="theNode[col.col]" />',

                        '<span ng-switch-when="text" class="{{col.css}} {{theNode[col.col]?\'edit\':\'\'}}">{{theNode[col.col]}}</span>',

                        '<span ng-switch-when="textbox" class="edit">',
                            '<span class="inputlabel {{theNode.errorMessage[col.col]?\'wmliu-common-label-invalid\':\'\'}}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}">{{col.title}}</span>:',
                            '<input class="input {{col.css}} {{theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{col.style}}" type="textbox" ',
                                    'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}" ',
                                    'ng-model="theNode[col.col]" ',
                                    'ng-change="changeState($parent.$parent.$index,theNode)" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                        '</span>',

                        '<span ng-switch-when="bool" class="edit">',
                            '<span class="inputlabel {{theNode.errorMessage[col.col]?\'wmliu-common-label-invalid\':\'\'}}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}">{{col.title}}</span>:',
                            '<input class="checkbox {{col.css}}  {{theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{col.style}}" type="checkbox" ',
                                    'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}" ',
                                    'ng-model="theNode[col.col]" ',
                                    'ng-change="changeState($parent.$parent.$index,theNode)" />',
                        '</span>',

                        '<span ng-switch-when="radio" ng-click="$event.stopPropagation()" class="edit">',
                            '<span class="inputlabel {{theNode.errorMessage[col.col]?\'wmliu-common-label-invalid\':\'\'}}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}">{{col.title}}</span>:',
                            '<span class="{{theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}">',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'class="{{theNode[col.col]==rdObj.key?\'wmliu-common-input-checked\':\'\'}}" ',
                                            'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                                    '<input class="{{col.css}}" style="{{col.style}}" type="radio" ng-model="theNode[col.col]"  ng-change="changeState($parent.$parent.$parent.$index,theNode);" ng-value="rdObj.key" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                '</label>',
                            '</span>',

                            '<span ng-if="col.other" style="margin-left:10px;">',
                            '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                                    'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                                    'ng-model="theNode[col.other]" ',
                                    'ng-focus="theNode[col.col]=\'\'" ',
                                    'ng-change="changeState($parent.$parent.$index,theNode)" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                            '</span>',

                        '</span>',



                /************** radiocom  *****************************************/
                            '<span ng-switch-when="radiocom" ng-init="comcnt = getNumber();">',
                            '<a class="lwhDivBox-Button wmliu-common-icon18 wmliu-common-icon18-search" did="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid + \'-\' + comcnt }}" title="Please Select"></a> ',
                            '<span class="wmliu-common-input-checked {{ theNode.errorMessage[col.col] && !tree.listTables.vlist[col.col][theNode[col.col]]  && !theNode[col.other] ?\'wmliu-common-error-message\':\'\' }}">',
                                '{{ theNode.errorMessage[col.col] && !tree.listTables.vlist[col.col][theNode[col.col]] && !theNode[col.other] ? theNode.errorMessage[col.col]: ',
                                'tree.listTables.vlist[col.col][theNode[col.col]] + (tree.listTables.vlist[col.col][theNode[col.col]]?theNode[col.other]?\', \':\'\':\'\') + theNode[col.other] }}',
                            '</span>',
                            '<div id="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid + \'-\' + comcnt }}" ww="400px" hh="30px" class="lwhDivBox">',

                            '<div class="lwhDivBox-content {{ theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\' }}" ',
                                    'title="{{ theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\' }}">',
                                '<span ng-repeat="rdObj in tree.listTables.checklist[col.col]">',
                                    '<label     class="{{ theNode[col.col]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                                'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                                        '<input type="radio" ng-model="theNode[col.col]" ng-value="rdObj.key" ng-change="changeState($parent.$parent.$parent.$index,theNode)" />',
                                        '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                    '</label>',
                                    '<br ng-if="col.colnum>0?(($index+1)%col.colnum)==0:false" />',
                                '</span>',

                                '<span ng-if="col.other" style="margin-left:10px;">',
                                '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                                        'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                                        'ng-model="theNode[col.other]" ',
                                        'ng-change="changeState($parent.$parent.$index,theNode)" ',
                                        'ng-focus="theNode[col.col]=\'\'" ',
                                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                                '</span>',

                            '</div>',

                            '</div>',
                            '</span>',

                /************ end of radiocom **************************************/



                        '<span ng-switch-when="select" ng-click="$event.stopPropagation()" class="edit">',
                            '<span class="inputlabel {{theNode.errorMessage[col.col]?\'wmliu-common-label-invalid\':\'\'}}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}">{{col.title}}</span>:',
			                '<select class="{{col.css}} {{theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-model="theNode[col.col]" ng-change="changeState($parent.$parent.$index, theNode);" ',
                            'ng-options="sObj.key as (sObj.title?sObj.title:sObj.key.uword()) for sObj in tree.listTables.checklist[col.col]" ',
                            'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
			                "<option value='0'></option>",
                            "</select>",
                        '</span>',


                        '<span ng-switch-when="actbox" ng-click="$event.stopPropagation()" class="edit" ng-init="theNode[col.col]=theNode[col.col]?theNode[col.col]:{};" >',
                            '<span class="inputlabel {{theNode.errorMessage[col.col]?\'wmliu-common-label-invalid\':\'\'}}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}">{{col.title}}</span>:',
                            '<span class="{{theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}">',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'ng-if="theNode.actbox[col.col][rdObj.key]" ', // important to filter
                                            'class="{{theNode[col.col][rdObj.key]?\'wmliu-common-input-checked\':\'\'}}" ',
                                            'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                                    '<input class="{{col.css}}" style="{{col.style}}" type="checkbox" ng-model="theNode[col.col][rdObj.key]"  ng-change="changeState($parent.$parent.$parent.$index,theNode);" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                "</label>",
                            '</span>',
                        '</span>',


                        '<span ng-switch-when="checkbox" ng-click="$event.stopPropagation()" class="edit" ng-init="theNode[col.col]=theNode[col.col]?theNode[col.col]:{};" >',
                            '<span class="inputlabel {{theNode.errorMessage[col.col]?\'wmliu-common-label-invalid\':\'\'}}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}">{{col.title}}</span>:',
                            '<span class="{{theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\'}}">',
                                '<label     ng-repeat="rdObj in tree.listTables.checklist[col.col]" ',
                                            'class="{{theNode[col.col][rdObj.key]?\'wmliu-common-input-checked\':\'\'}}" ',
                                            'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                                    '<input class="checkbox {{col.css}}" style="{{col.style}}" type="checkbox" ng-model="theNode[col.col][rdObj.key]"  ng-change="changeState($parent.$parent.$parent.$index,theNode);" />',
                                    '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                "</label>",
                            '</span>',

                            '<span ng-if="col.other" style="margin-left:10px;">',
                            '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                                    'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                                    'ng-model="theNode[col.other]" ',
                                    'ng-change="changeState($parent.$parent.$index,theNode)" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                            '</span>',
                        '</span>',


                /************** checkcom  *****************************************/
                        '<span ng-switch-when="checkcom" ng-init="comcnt = getNumber();">',
                            '<a class="lwhDivBox-Button wmliu-common-icon18 wmliu-common-icon18-search" did="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' +theNode.nodeid + \'-\' + comcnt }}" title="Please Select"></a> ',
                            '<span class="wmliu-common-input-checked" style="min-width:60px;">{{ getText(theNode, col) }}</span>',
                            '<span ng-if="theNode.errorMessage[col.col] && getText(theNode,col)==\'\'?true:false" style="color:red;">{{ theNode.errorMessage[col.col] }}</span>',

                            '<div id="lwhDivBox{{name + \'-\' + theNode.nodetable + \'-\' + theNode.parentid + \'-\' + theNode.nodeid + \'-\' + comcnt }}" ww="400px" hh="30px" class="lwhDivBox">',

                //checkbox below
                            '<div class="lwhDivBox-content {{ theNode.errorMessage[col.col]?\'wmliu-common-input-invalid\':\'\' }}"  ng-init="theNode[col.col]=theNode[col.col]?theNode[col.col]:{};">',
			                    '<span ng-repeat="rdObj in tree.listTables.checklist[col.col]">',
                                '<label class="{{ theNode[col.col][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}">',
                                '<input class="checkbox" type="checkbox" ng-model="theNode[col.col][rdObj.key]" ng-change="changeState($parent.$parent.$parent.$index,theNode);" />',
                                '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                                '</label>',
                                '<br ng-if="col.colnum>0?(($index+1)%col.colnum)==0:false" />',
                                '</span>',

                                '<span ng-if="col.other" style="margin-left:10px;">',
                                '<input  ng-if="col.other" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                                        'title="{{theNode.errorMessage[col.col]?theNode.errorMessage[col.col]:\'\'}}" placeholder="Specify Other" ',
                                        'ng-model="theNode[col.other]" ',
                                        'ng-change="changeState($parent.$parent.$index, theNode)" ',
                                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                                '</span>',
                            '</div>',
                // end of checkbox

                            '</div>',
                        '</span>',
                /************ end of checkcom **************************************/


                	    '<span ng-switch-when="icon" ng-init="iconCSS=\'wmliu-common-icon16\'" ng-click="$event.stopPropagation();" style="position:relative; left:5px;">',
						    '<span ng-repeat="rdObj in tree.schema.buttons[theNode.nodetable].icon">',
                //'No: {{$parent.$parent.$parent.$index}}',  - important to use $parent to get parent.$index
                            '<a ng-click="buttonClick(rdObj.key, $parent.$parent.$parent.$index, theNode);$event.stopPropagation()" class="{{iconCSS}} {{iconCSS}}-{{rdObj.key}} {{buttonState(theNode, rdObj.key)}}" title="{{rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword()}}"></a>',
						    '</span>',
					    '</span>',

                    '</span>',
                /*** end of common ***/

                    '<wmliu.tree ',
									'name="{{name}}" single="{{single}}" showall="{{showall}}" ',
                                    'expandnodes="expandnodes" selectnodes="selectnodes" linkform="linkform" linkcol="{{linkcol}}" tree="tree" nodes="theNode.nodes" ',
                                    'ng-show="getShowState(theNode)">',
                    '</wmliu.tree>',
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
    self.nodeButton = {
        0: { "folder": 1, "add": 1, "save": 0, "delete": 1, "cancel": 0, "print": 1, "excel": 1 },
        1: { "folder": 0, "add": 0, "save": 1, "delete": 0, "cancel": 1, "print": 0, "excel": 0 },
        2: { "folder": 0, "add": 0, "save": 1, "delete": 0, "cancel": 1, "print": 0, "excel": 0 },
        3: { "folder": 0, "add": 0, "save": 1, "delete": 0, "cancel": 1, "print": 0, "excel": 0 }
    };
    self.expandnodes = {}
    self.selectnode = {};

    self.init = [];
    self.fresh = [];
    self.load = [];
    self.clear = [];

    self.callBack = []; //angular.noop;
    self.buttonClick = []; //angular.noop;

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
                alert("Error (wmliu_tree_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.tree.schema.head.wait == "1") wait_hide();
				
				errorHandler(req);
            	if(req.errorCode < 900 ) {
                	self.updateTreeData(req.tree, scTree, sc);
				}
  				sc.tree.schema.head.loading = 0;
                
				// after ajax,   action : new, update, delete
                if (req.errorCode <=0 ) {
                    evtObj1 = self.getCallBack(sc.tree.name, req.tree.schema.head.action);
                    if (evtObj1) if (evtObj1.success) if (angular.isFunction(evtObj1.success)) evtObj1.success(req.tree.schema.head.action, scTree);
                }
            },
            type: "post",
            url: "ajax/wmliu_tree_data.php"
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
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                tree: theTree
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (sc.tree.schema.head.wait == "1") wait_hide();
                sc.tree.schema.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, sc);
                alert("Error (wmliu_tree_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.tree.schema.head.wait == "1") wait_hide();

   				errorHandler(req);
            	if(req.errorCode < 900 ) {
					self.updateTreeNode(req.tree, scTree, scNodes, nodeIdx, sc);
				}
  				sc.tree.schema.head.loading = 0;

                evtObj1 = self.getCallBack(sc.tree.name, req.tree.schema.head.action);
                if (evtObj1) if (evtObj1.success) if (angular.isFunction(evtObj1.success)) evtObj1.success(req.schema.head.action, sc);
            },
            type: "post",
            url: "ajax/wmliu_tree_data.php"
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


    self.setButtonClick = function (eid, clickEvent, action) {
        self.buttonClick[eid] = self.buttonClick[eid] || {};
        if (action) {
            if (angular.isArray(action)) {
                for (var key in action) {
                    self.buttonClick[eid][action[key]] = clickEvent;
                }
            } else {
                self.buttonClick[eid][action] = clickEvent;
            }
        } else {
            self.buttonClick[eid] = clickEvent || {};
        }
    }

    self.getButtonClick = function (eid, action) {
        var tmp = self.buttonClick[eid] || {};
        if (action && action != "") {
            if (tmp[action]) return tmp[action];
        }
        return tmp;
    }


});

/****** javascript **********************************/
function updateTreeData (rTree, oTree, sc) {
        oTree.schema.head.loading = 0;
        if (rTree.schema.head.error <= 0 ) {

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
        if (rTree.schema.head.error <= 0) {
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