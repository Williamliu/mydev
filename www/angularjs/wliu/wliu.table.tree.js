var tree_scope        = 'scope="{{ table.scope }}" ';
var tree_ng_change    = 'ng-change="table.changeCol(row, name)" ';
var tree_ng_class     = 'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(row, name).errorCode }" '; 
var tree_ng_disabled  = 'ng-disabled="table.getCol(row, name)==undefined" '; 
var tree_ng_options   = 'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ';
var tree_ng =     [
                        tree_scope,
                        tree_ng_change,
                        tree_ng_class,
                        tree_ng_disabled,
                        tree_ng_options
                    ].join('');

var tree_tooltip = [    'popup-target="{{table.colMeta(row, name).tooltip?\'#\'+table.colMeta(row, name).tooltip:\'\'}}" ',
                        'popup-toggle="hover" ',
                        'popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}" ',
                        'title="{{table.colMeta(row, name).tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}" '
                     ].join('');

var wliu_table = angular.module("wliuTable",[]);

wliu_table.directive("table.tree", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "="
        },
        template: [
                    '<ul id="' + 'tree_' + table.treeid + '" wliu-tree root>',
                        '<li nodes open><s folder></s>',
                            '{{table.title?table.title:\'Tree Root\'}} ',
                            '<tree.hicon table="table" rows="table.rows" row="root" name="add" actname="Add"></tree.hicon>',
                            /*** ptable ***/
                            '<ul wliu-tree>',
                                '<li nodes open ng-repeat="prow in table.rows" name="meme"><s folder></s>',
                                    '<tree.rowstatus table="table" row="prow"></tree.rowstatus>',
                                    '<span style="display:none;" ng-repeat-start="pcol in prow.cols"></span>',
                                            '<span ng-switch on="pcol.coltype">',
                                                '<tree.text ng-switch-when="text"       table="table" row="prow" name="{{pcol.name}}"></tree.text>',

                                                '<tree.label ng-switch-when="textbox"   table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.textbox ng-switch-when="textbox" table="table" row="prow" name="{{pcol.name}}" class="{{table.colMeta(prow, pcol.name).css}}" style="{{table.colMeta(prow, pcol.name).style}}"></tree.textbox>',

                                                '<tree.label ng-switch-when="select"    table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.select ng-switch-when="select"   table="table" row="prow" name="{{pcol.name}}" class="{{table.colMeta(prow, pcol.name).css}}" style="{{table.colMeta(prow, pcol.name).style}}"></tree.select>',

                                                '<tree.label ng-switch-when="bool"      table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.bool ng-switch-when="bool"       table="table" row="prow" name="{{pcol.name}}"></tree.bool>',

                                                '<tree.label ng-switch-when="checkbox1"     table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.checkbox1 ng-switch-when="checkbox1" table="table" row="prow" name="{{pcol.name}}"></tree.checkbox1>',

                                                '<tree.label   ng-switch-when="radio1"      table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.radio1  ng-switch-when="radio1"      table="table" row="prow" name="{{pcol.name}}"></tree.radio1>',
                                            '</span>',
                                    '<span style="display:none;" ng-repeat-end></span>',
                                    '<tree.bicon ng-repeat="actname in table.pbutton" table="table" rows="table.rows" row="prow" name="{{actname}}"></tree.bicon>',
                                    /*** stable ***/
                                    '<ul wliu-tree>',
                                            /*********** 3 layer tree ******************************************/
                                            '<li ng-if="table.cols.m" nodes open ng-repeat="srow in prow.rows">',
                                            '<s folder></s>',
                                                '<tree.rowstatus table="table" row="srow"></tree.rowstatus>',
                                                '<span style="display:none;" ng-repeat-start="scol in srow.cols"></span>',
                                                        '<span ng-switch on="scol.coltype">',
                                                            '<tree.text ng-switch-when="text"       table="table" row="srow" name="{{scol.name}}"></tree.text>',

                                                            '<tree.label ng-switch-when="textbox"   table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.textbox ng-switch-when="textbox" table="table" row="srow" name="{{scol.name}}" class="{{table.colMeta(srow, scol.name).css}}" style="{{table.colMeta(srow, scol.name).style}}"></tree.textbox>',

                                                            '<tree.label ng-switch-when="select"    table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.select ng-switch-when="select"   table="table" row="srow" name="{{scol.name}}" class="{{table.colMeta(srow, scol.name).css}}" style="{{table.colMeta(srow, scol.name).style}}"></tree.select>',

                                                            '<tree.label ng-switch-when="bool"      table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.bool ng-switch-when="bool"       table="table" row="srow" name="{{scol.name}}"></tree.bool>',

                                                            '<tree.label ng-switch-when="checkbox1"     table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.checkbox1 ng-switch-when="checkbox1" table="table" row="srow" name="{{scol.name}}"></tree.checkbox1>',

                                                            '<tree.label   ng-switch-when="radio1"  table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.radio1  ng-switch-when="radio1"  table="table" row="srow" name="{{scol.name}}"></tree.radio1>',
                                                        '</span>',
                                                '<span style="display:none;" ng-repeat-end></span>',
                                                '<tree.bicon ng-repeat="actname in table.sbutton" table="table" rows="prow.rows" row="srow" name="{{actname}}"></tree.bicon>',
                                                /*** mtable ***/
                                                '<ul wliu-tree>',
                                                    '<li node ng-repeat="mrow in srow.rows"><s folder></s>',
                                                        '<tree.rowstatus table="table" row="mrow"></tree.rowstatus>',
                                                        '<span style="display:none;" ng-repeat-start="mcol in mrow.cols"></span>',
                                                                '<span ng-switch on="mcol.coltype">',
                                                                    '<tree.text ng-switch-when="text"       table="table" row="mrow" name="{{mcol.name}}"></tree.text>',

                                                                    '<tree.label ng-switch-when="textbox"   table="table" row="mrow" name="{{mcol.name}}"></tree.label>',
                                                                    '<tree.textbox ng-switch-when="textbox" table="table" row="mrow" name="{{mcol.name}}" class="{{table.colMeta(mrow, mcol.name).css}}" style="{{table.colMeta(mrow, mcol.name).style}}"></tree.textbox>',

                                                                    '<tree.label ng-switch-when="select"    table="table" row="mrow" name="{{mcol.name}}"></tree.label>',
                                                                    '<tree.select ng-switch-when="select"   table="table" row="mrow" name="{{mcol.name}}" class="{{table.colMeta(mrow, mcol.name).css}}" style="{{table.colMeta(mrow, mcol.name).style}}"></tree.select>',

                                                                    '<tree.label ng-switch-when="bool"      table="table" row="mrow" name="{{mcol.name}}"></tree.label>',
                                                                    '<tree.bool ng-switch-when="bool"       table="table" row="mrow" name="{{mcol.name}}"></tree.bool>',

                                                                    '<tree.label ng-switch-when="checkbox1"     table="table" row="mrow" name="{{mcol.name}}"></tree.label>',
                                                                    '<tree.checkbox1 ng-switch-when="checkbox1" table="table" row="mrow" name="{{mcol.name}}"></tree.checkbox1>',

                                                                    '<tree.label   ng-switch-when="radio1"      table="table" row="mrow" name="{{mcol.name}}"></tree.label>',
                                                                    '<tree.radio1  ng-switch-when="radio1"      table="table" row="mrow" name="{{mcol.name}}"></tree.radio1>',
                                                                '</span>',
                                                        '<span style="display:none;" ng-repeat-end></span>',
                                                        '<tree.bicon ng-repeat="actname in table.mbutton" table="table" rows="srow.rows" row="mrow" name="{{actname}}"></tree.bicon>',
                                                    '</li>',
                                                '</ul>',
                                                /***\\mtable ***/
                                            '</li>',
                                            /*********** 3 layer tree ******************************************/

                                            /*********** 2 layer tree ******************************************/
                                            '<li ng-if="!table.cols.m" node ng-repeat="srow in prow.rows">',
                                            '<s folder></s>',
                                                '<tree.rowstatus table="table" row="srow"></tree.rowstatus>',
                                                '<span style="display:none;" ng-repeat-start="scol in srow.cols"></span>',
                                                        '<span ng-switch on="scol.coltype">',
                                                            '<tree.text ng-switch-when="text"       table="table" row="srow" name="{{scol.name}}"></tree.text>',

                                                            '<tree.label ng-switch-when="textbox"   table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.textbox ng-switch-when="textbox" table="table" row="srow" name="{{scol.name}}" class="{{table.colMeta(srow, scol.name).css}}" style="{{table.colMeta(srow, scol.name).style}}"></tree.textbox>',

                                                            '<tree.label ng-switch-when="select"    table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.select ng-switch-when="select"   table="table" row="srow" name="{{scol.name}}" class="{{table.colMeta(srow, scol.name).css}}" style="{{table.colMeta(srow, scol.name).style}}"></tree.select>',

                                                            '<tree.label ng-switch-when="bool"      table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.bool ng-switch-when="bool"       table="table" row="srow" name="{{scol.name}}"></tree.bool>',

                                                            '<tree.label ng-switch-when="checkbox1"     table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.checkbox1 ng-switch-when="checkbox1" table="table" row="srow" name="{{scol.name}}"></tree.checkbox1>',

                                                            '<tree.label   ng-switch-when="radio1"  table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.radio1  ng-switch-when="radio1"  table="table" row="srow" name="{{scol.name}}"></tree.radio1>',
                                                        '</span>',
                                                '<span style="display:none;" ng-repeat-end></span>',
                                                '<tree.bicon ng-repeat="actname in table.sbutton" table="table" rows="prow.rows" row="srow" name="{{actname}}"></tree.bicon>',
                                            '</li>',
                                            /*********** 2 layer tree ******************************************/
                                    '</ul>',
                                    /*** \\stable ***/
                                '</li>',
                            '</ul>',
                            /*** \\ptable ***/
                        '</li>',
                    '</ul>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            var count = 0;
            $(function(){
                //JQuery 3.0+ no longer support die and live; this is same as die and live,  must using document 
                $(document).off("click.treebutton", $("a[treebutton][name='add']", el) ).on("click.treebutton", "a[treebutton][name='add']", function(evt){
                     console.log("count: " + count);
                     $(this).parents("li").removeAttr("close").addAttr("open");
                });
                 /*  this is same as  unbind and bind
                 $("a[treebutton][name='add']", el).off("click.treebutton").on("click.treebutton", function(){
                    $(this).parents("li").removeAttr("close").addAttr("open");
                 });
                 */
            })

        }
    }
});

wliu_table.directive("table.treeview", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            action:     "&"
        },
        template: [
                    '<ul id="' + 'tree_' + table.treeid + '" wliu-tree root>',
                        '<li nodes open><s folder></s>',
                            '{{table.title?table.title:\'Tree Root\'}} ',
                            '<tree.hicon table="table" rows="table.rows" row="root" name="add" actname="Add"></tree.hicon>',
                            /*** ptable ***/
                            '<ul wliu-tree>',
                                '<li nodes open ng-repeat="prow in table.rows"><s folder></s>',
                                    '<tree.rowstatus table="table" row="prow"></tree.rowstatus>',
                                    '<span style="display:none;" ng-repeat-start="pcol in prow.cols"></span>',
                                            '<span ng-switch on="pcol.coltype">',
                                                '<tree.text ng-switch-when="text"       table="table" row="prow" name="{{pcol.name}}"></tree.text>',

                                                //'<tree.label ng-switch-when="checkbox"     table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.checkbox ng-switch-when="checkbox"  table="table" row="prow" name="{{pcol.name}}"></tree.checkbox>',

                                                '<tree.label   ng-switch-when="radio1"      table="table" row="prow" name="{{pcol.name}}"></tree.label>',
                                                '<tree.radio1  ng-switch-when="radio1"      table="table" row="prow" name="{{pcol.name}}"></tree.radio1>',
                                            '</span>',
                                    '<span style="display:none;" ng-repeat-end></span>',
                                    /*** stable ***/
                                    '<ul wliu-tree>',
                                            '<li nodes open ng-repeat="srow in prow.rows"><s folder></s>',
                                                '<tree.rowstatus table="table" row="srow"></tree.rowstatus>',
                                                '<span style="display:none;" ng-repeat-start="scol in srow.cols"></span>',
                                                        '<span ng-switch on="scol.coltype">',
                                                            '<tree.text ng-switch-when="text"       table="table" row="srow" name="{{scol.name}}"></tree.text>',

                                                            //'<tree.label ng-switch-when="checkbox"     table="table" row="srow" name="{{scol.name}}"></tree.label>',
                                                            '<tree.checkbox ng-switch-when="checkbox" table="table" row="srow" name="{{scol.name}}"></tree.checkbox>',
                                                            '<tree.radio1  ng-switch-when="radio1"  table="table" row="srow" name="{{scol.name}}"></tree.radio1>',
                                                        '</span>',
                                                '<span style="display:none;" ng-repeat-end></span>',
                                                /*** mtable ***/
                                                '<ul wliu-tree>',
                                                    '<li node ng-repeat="mrow in srow.rows"><s folder></s>',
                                                        '<tree.rowstatus table="table" row="mrow"></tree.rowstatus>',
                                                        '<span style="display:none;" ng-repeat-start="mcol in mrow.cols"></span>',
                                                                '<span ng-switch on="mcol.coltype">',
                                                                    '<tree.text ng-switch-when="text"       table="table" row="mrow" name="{{mcol.name}}"></tree.text>',

                                                                    //'<tree.label ng-switch-when="checkbox"     table="table" row="mrow" name="{{mcol.name}}"></tree.label>',
                                                                    '<tree.checkbox ng-switch-when="checkbox" table="table" row="mrow" name="{{mcol.name}}"></tree.checkbox>',
                                                                    '<tree.radio1  ng-switch-when="radio1"      table="table" row="mrow" name="{{mcol.name}}"></tree.radio1>',
                                                                '</span>',
                                                        '<span style="display:none;" ng-repeat-end></span>',
                                                    '</li>',
                                                '</ul>',
                                                /***\\mtable ***/
                                            '</li>',
                                    '</ul>',
                                    /*** \\stable ***/
                                '</li>',
                            '</ul>',
                            /*** \\ptable ***/
                        '</li>',
                    '</ul>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.rowstatus", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:    "=",
            row:      "="
        },
        template: [
                    '<span style="vertical-align:middle;padding:0px;" ',
                        'ng-disabled="row==undefined" ',
                        'popup-target="#table_rowno_tooltip" popup-toggle="hover" ',
                        'popup-body="{{row.error.errorCode?row.error.errorMessage.nl2br():\'\'}}"',
                        //'title="{{ tooltip?\'\':(row.error.errorCode ? row.error.errorMessage : \'\') }}"',
                        tree_scope,
                    '>',
                        '{{row.type}}-{{row.parent}}-{{table.keyValue(row)}}',
                        '<a class="wliu-btn16 wliu-btn16-error-help"    ng-if="row.error.errorCode" ',
                            //'title="{{ tooltip?\'\':( row.error.errorCode? row.error.errorMessage : \'\') }}"',
                        '>',
                        '</a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="row.error.errorCode==0 && row.rowstate==1"   title="Changed"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="row.error.errorCode==0 && row.rowstate==2"   title="New"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="row.error.errorCode==0 && row.rowstate==3"   title="Deleted"></a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.error_tooltip = "table_rowno_tooltip";
        },
        link: function (sc, el, attr) {
            $(function(){
                if( $("#" + sc.table.error_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.table.error_tooltip + '" wliu-popup></div>');
                    $("#" + sc.table.error_tooltip).wliuPopup();
                }
            })
        }
    }
});

wliu_table.directive("tree.label", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
                    '<label class="wliuCommon-label" ',
                        'popup-target="{{table.colMeta(row, name).tooltip?\'#\'+table.colMeta(row, name).tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname?table.colMeta(row, name).colname:name}}" ',
                        'title="{{table.colMeta(row, name).tooltip? \'\':table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname?table.colMeta(row, name).colname:name}}" ',
                        tree_scope,
                    '>',
                        '<span style="vertival-align:middle;" class="wliuCommon-text-error" ng-if="table.colMeta(row, name).notnull">*</span>',
                        '<span style="vertival-align:middle;">{{ table.colMeta(row, name).colname?table.colMeta(row, name).colname:name }}</span>',
                    '</label>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.text", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
                    '<span class="wliu-text" ',
                        tree_scope,
                        tree_ng_class,
                        tree_tooltip,
                    '>',
                        '{{ table.getCol(row, name).value }}',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.hidden", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
                    '<input type="hidden" ',
                        'ng-model="table.getCol(row, name).value" ',
                        tree_scope,
                        tree_ng_disabled,
                        tree_ng_change,
                    '/>'
                ].join(''),
        controller: function ($scope) {
        }
    }
});

wliu_table.directive("tree.textbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
                    '<input type="textbox" ',
                        'ng-model="table.getCol(row, name).value" ',
                        tree_ng,
                        tree_tooltip,
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.select", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
			    '<select ',
                        'ng-model="table.getCol(row, name).value" ',
                        'ng-options="sObj.key as sObj.value for sObj in table.colList(row, name).list" ',                        
                        tree_scope,
                        tree_ng_change,
                        tree_ng_class,
                        tree_ng_disabled,
                        tree_tooltip,
                 '>',
                 '<option value=""></option>',
                 '</select>'
                ].join(''),
        controller: function ($scope) {
            $scope.css = $scope.css?$scope.css:"input-short"; 
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.bool", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@",
            label:      "@"
        },
        template: [
                    '<span class="checkbox" ',
                        tree_scope,
                        tree_ng_class,
                        tree_tooltip,
                    '>',
                            '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row.guid}}" ',
                                'ng-click="checkme()" ',
                                'ng-model="table.getCol(row, name).value" ng-value="1"  ',
                                tree_scope,
                                tree_ng_change,
                                tree_ng_disabled,
                            '/>',
                            '<label for="{{table.scope}}_{{name}}_{{row.guid}}" title="{{table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname?table.colMeta(row, name).colname:name}}">',
                                '{{ label.toLowerCase()=="default"?table.colMeta(row, name).colname:label?label:"" }}',
                            '</label>',
                            //'<br ng-if="table.getCol(row, name).errorCode">',
                            //'<span style="color:red;" ng-if="table.getCol(row, name).errorCode">{{table.getCol(row, name).errorMessage}}</span>',
                    '</span>',
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            $(el).unbind("click.treeBool").bind("click.treeBool", function(){
                sc.table.getCol(sc.row, sc.name).value = !sc.table.getCol(sc.row, sc.name).value;
                sc.table.changeCol(sc.row, sc.name);
                sc.$apply();
            })
        }
    }
});

wliu_table.directive("tree.checkbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
                    '<div style="display:inline-block;" ',
                        tree_scope,
                        tree_ng_class,
                        tree_tooltip,
                    '>',
                        '<span ',
                            'ng-repeat="rdObj in table.colList(row, name).list">',
                                '<span class="checkbox" ckval="{{rdObj.key}}">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row.guid}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(row, name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            tree_scope,
                                            tree_ng_change,
                                            //tree_ng_disabled,
                                        '/>',

                                        '<label for="{{table.scope}}_{{name}}_{{row.guid}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                        '</span>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
           $scope.table.getCol($scope.row, $scope.name).value = $scope.table.getCol($scope.row, $scope.name).value?$scope.table.getCol($scope.row, $scope.name).value:{}; 
        },
        link: function (sc, el, attr) {
            $("span.checkbox" , el).unbind("click.treeBool").bind("click.treeBool", function(){
                alert( $(this).attr("ckval") );
                sc.table.getCol(sc.row, sc.name).value[$(this).attr("ckval")] = !sc.table.getCol(sc.row, sc.name).value([$(this).attr("ckval")]);
                sc.table.changeCol(sc.row, sc.name);
                sc.$apply();
            })
        }
    }
});

wliu_table.directive("tree.checkbox1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"  // col_name 
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(row, name)" ',
                            'diag-target="#{{table.colMeta(row, name).targetid}}" diag-toggle="click" ',
                            'popup-target="{{table.colMeta(row, name).tooltip?\'#\'+table.colMeta(row, name).tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}" ',
                            'title="{{table.colMeta(row, name).tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}" ',
                            tree_scope,
                            tree_ng_class,
                            tree_ng_disabled,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.row, $scope.name).keys = $scope.table.colList($scope.row, $scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(row, name).keys.guid = row;
                $scope.table.colList(row, name).keys.name = name;
            }
            $scope.valueText = function() {
                    var text = $.map( $scope.table.colList($scope.row, $scope.name).list , function(n) {
                    if( $scope.table.getCol($scope.row, $scope.name)!= undefined ) {
                        if($scope.table.getCol($scope.row, $scope.name).value[n.key]) 
                            return n.value;
                        else
                            return null;
                    } else {
                        return null;
                    }

               }).join("; ");
               return text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.checkdiag1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",   // $scope.name is  listName
            targetid:   "@",
            colnum:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable ',
                        tree_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.guid, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',

                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            tree_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all"  ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all"  ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(table.lists[name].keys.guid, table.lists[name].keys.name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                            'ng-disabled="table.getCol(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                            tree_scope,
                                        '/>',

                                        '<label for="{{table.scope}}_{{name}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            // important: guid is row,  due to rows is multiple layers
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};
            $scope.checkall = function(guid, name) {
                $scope.table.getCol(guid, name).value = $scope.table.getCol(guid, name).value || {};
                for( var key in $scope.table.lists[$scope.name].list ) {
                   $scope.table.getCol(guid, name).value[$scope.table.lists[$scope.name].list[key].key] = true;
                }
                $scope.table.changeCol(guid, name);
            }

            $scope.removeall = function(guid, name) {
                $scope.table.getCol(guid, name).value = {};
                $scope.table.changeCol(guid, name);
            }
            // $scope.name  is different with  name;  $scope.name is listName,   name is col_name for selected value
            $scope.valueArr = function(guid, name) {
               var valueArr = $.map( $scope.table.lists[$scope.name].list , function(n) {
                   if( $scope.table.getCol(guid, name)!= undefined ) {
                        if( $scope.table.getCol(guid, name).value[n.key] ) 
                                return n;
                        else
                                return null;
                   } else {
                       return null;
                   }

               });
               return valueArr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_table.directive("tree.radio1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"  // col_name
        },
        template: [     '<input  type="text" readonly class="wliuCommon-radiolist" value="{{ valueText() }}" ',
                                'ng-click="change(row, name)" ',
                                'diag-target="#{{table.colMeta(row, name).targetid}}" diag-toggle="click" ',
                                'popup-target="{{table.colMeta(row, name).tooltip?\'#\'+table.colMeta(row, name).tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}" ',
                                'title="{{table.colMeta(row, name).tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}" ',
                                tree_scope,
                                tree_ng_class,
                                tree_ng_disabled,
                        '/>'
                ].join(''),
        controller: function ($scope) {
            //important:  guid is row;
            $scope.table.colList($scope.row, $scope.name).keys = $scope.table.colList($scope.row, $scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(row, name).keys.guid = row;
                $scope.table.colList(row, name).keys.name = name;
            }

            $scope.valueText = function() {
               var val =  $scope.table.getCol($scope.row, $scope.name)?$scope.table.getCol($scope.row, $scope.name).value:"";
               var valText = FCOLLECT.firstByKV( $scope.table.colList($scope.row, $scope.name).list, {key:val})?FCOLLECT.firstByKV( $scope.table.colList($scope.row, $scope.name).list, {key:val} ).value:"";
               return valText;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.radiodiag1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",  // listName
            targetid:   "@",
            colnum:     "@",
            bar:        "@", 
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable ',
                        tree_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText(table.lists[name].keys.guid, table.lists[name].keys.name) }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            tree_ng_options,
                        '/>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="radio">',
                                        '<input type="radio" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(table.lists[name].keys.guid, table.lists[name].keys.name).value" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                            'ng-disabled="table.getCol(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                            tree_scope,
                                        '/>',
                                        '<label for="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};
            $scope.valueText = function(guid, name) {
                var val =  $scope.table.getCol(guid, name)?$scope.table.getCol(guid, name).value:"";
                var valueText = FCOLLECT.firstByKV($scope.table.lists[$scope.name].list, {key:val})?FCOLLECT.firstByKV($scope.table.lists[$scope.name].list, {key:val}).value:"";
                return valueText;
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_table.directive("tree.hicon", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rows:       "=",
            row:        "@",
            name:       "@",
            xsize:      "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<a name="{{name}}" treebutton class="wliu-btn{{xsize}} wliu-btn{{xsize}}-{{name}}" ',
                            'ng-click="action1()" ',
                            'popup-target="{{table.tooltip?\'#\'+table.tooltip:\'\'}}" popup-toggle="hover" popup-body="{{actname?actname:name}}" popup-placement="down" ',
                            'title="{{table.tooltip?\'\':actname?actname:name}}" ',
                            tree_scope,
                        '>',
                        '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:16;
            $scope.action1 = function() {
                // add you code here 
                 switch( $scope.name.toLowerCase() ) {
                    case "add":
                        $scope.table.addChild($scope.rows, $scope.row);
                        break;
                }                
               //
                $scope.action();
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.blink", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rows:       "=",
            row:        "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<a name="{{name}}" treebutton href="javascript:void(0);" class="wliuCommon-table-btn16" ',
                            'ng-click="action1()" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',
                            'title="{{table.colMeta(row, name).coldesc?table.colMeta(row, name).coldesc:table.colMeta(row, name).colname}}"',
                             tree_scope,
                        '>',
                            '<i class="wliu-btn16 wliu-btn16-{{name}}"></i> ',
                            '<span style="vertical-align:middle;">{{actname}}</span>',
                        '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function() {
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        $scope.table.current = theRow;
                        break;
                    case "save":
                        $scope.table.saveRow($scope.rows, $scope.row);
                        break;
                    case "cancel":
                        $scope.table.cancelRow($scope.rows, $scope.row);
                        break;
                    case "add":
                        $scope.table.addChild($scope.rows, $scope.row);
                        break;
                    case "delete":
                        $scope.table.deleteRow($scope.rows, $scope.row);
                        break;
                }                
                // end of code
                $scope.action(); // trigger outside event
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                var rightDelete = $scope.name.toLowerCase()=="delete"?($scope.row.rows?($scope.row.rows.length>0?false:true):true):true; 
                right = right && rightDelete;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.bicon", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rows:       "=",
            row:        "=",
            name:       "@",
            xsize:      "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<a name="{{name}}" treebutton class="wliu-btn{{xsize}} wliu-btn{{xsize}}-{{name}}" ',
                            'ng-click="action1()" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',
                            'popup-target="{{table.tooltip?\'#\'+table.tooltip:\'\'}}" popup-toggle="hover" popup-body="{{actname?actname:name}}" popup-placement="down" ',
                            'title="{{table.tooltip?\'\':actname?actname:name}}" ',
                            tree_scope,
                        '>',
                        '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:16;

            $scope.action1 = function() {
                // add you code here 
                 switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        $scope.table.current = $scope.row;
                        break;
                    case "save":
                        $scope.table.saveRow($scope.rows, $scope.row);
                        break;
                    case "cancel":
                        $scope.table.cancelRow($scope.rows, $scope.row);
                        break;
                    case "add":
                        $scope.table.addChild($scope.rows, $scope.row);
                        break;
                    case "delete":
                        $scope.table.deleteRow($scope.rows, $scope.row);
                        break;
                }                
               //
                $scope.action();
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                var rightDelete = $scope.name.toLowerCase()=="delete"?($scope.row.rows?($scope.row.rows.length>0?false:true):true):true; 
                right = right && rightDelete;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.btext", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rows:       "=",
            row:        "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<a name="{{name}}" treebutton href="javascript:void(0)" class="wliu-table-button" ',
                            'title="{{actname?actname:name}}" ',
                            'ng-click="action1()" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',   
                            tree_scope, 
                        '>',
                            '{{actname?actname:name.capital()}}',
                        '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function() {
                // add you code here 
                 switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        $scope.table.current = $scope.row;
                        break;
                    case "save":
                        $scope.table.saveRow($scope.rows, $scope.row);
                        break;
                    case "cancel":
                        $scope.table.cancelRow($scope.rows, $scope.row);
                        break;
                    case "add":
                        $scope.table.addChild($scope.rows, $scope.row);
                        break;
                    case "delete":
                        $scope.table.deleteRow($scope.rows, $scope.row);
                        break;
                }                
               //
                $scope.action();
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                var rightDelete = $scope.name.toLowerCase()=="delete"?($scope.row.rows?($scope.row.rows.length>0?false:true):true):true; 
                right = right && rightDelete;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("tree.rowerror", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            targetid:   "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable>',
                        '<div wliu-diag-head>Message</div>',
                        '<div wliu-diag-body style="font-size:16px;">',
                            '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true" style="color:red;"></i> <span style="font-size:16px;">We can\'t process submitted data:</span>',
                            '<div style="margin-top:12px;" ng-bind-html="getHTML()"></div>',
                        '</div>',    
                    '</div>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.getRow($scope.row) )
                    if( $scope.table.getRow($scope.row).error.errorCode )
                        return $sce.trustAsHtml($scope.table.getRow($scope.row).error.errorMessage.nl2br());
                    else 
                        return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                $(el).unbind("ishow").bind("ishow", function(evt){
                    if( sc.table.getRow(sc.row) ) {
                        if( parseInt(sc.table.getRow(sc.row).error.errorCode) ) {
                            $(el).trigger("show");
                        }
                    }
                });
            });
        }
    }
});

wliu_table.directive("tree.taberror", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            targetid:   "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable>',
                        '<div wliu-diag-head>Message</div>',
                            '<div wliu-diag-body style="font-size:16px;">',
                            '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true" style="color:red;"></i> <span style="font-size:16px;">We can\'t process submitted data:</span>',
                            '<div style="margin-top:12px;" ng-bind-html="getHTML()"></div>',
                        '</div>',    
                    '</div>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.error.errorCode )
                    return $sce.trustAsHtml($scope.table.error.errorMessage.nl2br1());
                else 
                    return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                $(el).unbind("ishow").bind("ishow", function(evt){
                    if( parseInt(sc.table.error.errorCode) ) {
                        $(el).trigger("show");
                    }
                });
            });
        }
    }
});

wliu_table.directive("tree.message", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "="
        },
        template: [
                    '<div ng-show="table.error.errorCode>0 || table.getCurrent().error.errorCode>0" class="card card-danger text-center z-depth-2 mb-1 white-text" style="padding:10px;">',
                        '<div wliu-diag-body style="font-size:16px;">',
                        '<i class="fa fa-exclamation-triangle fa-md" aria-hidden="true" style="color:white;"></i> <span style="font-size:16px;">We can\'t process submitted data:</span>',

                        '<p class="white-text mb-0" ng-bind-html="getHTML()">',
                        '</p>',
                    '</div>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.error.errorCode || ( $scope.table.getCurrent() && $scope.table.getCurrent().error.errorCode ) ) {
                    var errMsg = $scope.table.error.errorMessage.nl2br1();
                    if( $scope.table.getCurrent() ) errMsg += "\n" + $scope.table.getCurrent().error.errorMessage.nl2br1();
                    return $sce.trustAsHtml(errMsg);
                } else { 
                    return $sce.trustAsHtml("");
                }
            }
        },
        link: function (sc, el, attr) {
        }
    }
});


/****** Form Service *********/
wliu_table.service("wliuTableService", function () {
    var self = this;
    // state control button status
    self.btnActive = {
        "0": { "detail": 1, "save": 0, "cancel": 0, "reset":0, "add": 1, "delete": 1, "output": 1, "print": 1, "email": 1 },
        "1": { "detail": 1, "save": 1, "cancel": 1, "reset":1, "add": 0, "delete": 0, "output": 0, "print": 0, "email": 0 },
        "2": { "detail": 1, "save": 1, "cancel": 1, "reset":1, "add": 0, "delete": 0, "output": 0, "print": 0, "email": 0 },
        "3": { "detail": 1, "save": 1, "cancel": 1, "reset":0, "add": 0, "delete": 0, "output": 0, "print": 0, "email": 0 }
    };

    self.buttonState = function(name, rowstate ) {
        return self.btnActive[rowstate]?(self.btnActive[rowstate][name]?true:false):false;
    }
});