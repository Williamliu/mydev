wliu_table.directive("table.list", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            action:     "&",
            searchcol:  "@",
            displaycol: "@",
            title:      "@"
        },
        template: [

                    '<div class="card z-depth-1" style="min-width:260px;">',
                        '<div class="card-header info-color text-center white-text">',
                            '{{title}}',
                        '</div>',
                        '<div class="card-header text-left" style="padding:0px; background-color:#ffffff;">',
                            '<div style="padding:2px 5px;">',
                                '<filter.textbox class="input-medium" table="table" name="list_search" ng-if="searchcol"></filter.textbox>',   
                                '<table.order table="table" class="pull-right" xsize="24"><table.order>',
                            '</div>',
                            '<div style="padding:0px 5px;">',
                                '<table.navi1 table="table"></table.navi1>',
                            '</div>',
                        '</div>',
                        '<div class="card-block" style="padding:0px;">',
                            '<ul class="list-group wliuCommon-list-group">',
                                '<li class="list-group-item" ',
                                    'ng-class="{\'active\': table.getCurrent().guid==row.guid}" ',
                                    'ng-repeat="row in table.rows" ',
                                    'ng-click="action1(row)" ',
                                    'popup-target="#table_rowno_tooltip" popup-toggle="hover" ',
                                    'popup-body="{{ tipText(row) }}"',
                                '>',
                                
                                    '<a class="wliu-btn16 wliu-btn16-error-help"  ng-if="row.error.errorCode" ',
                                        'popup-target="#table_rowno_tooltip" popup-toggle="hover" ',
                                        'popup-body="{{row.error.errorCode?row.error.errorMessage.nl2br():\'\'}}" ',
                                    '>',
                                    '</a>',

                                    '<span ng-if="row.error.errorCode==0 && row.rowstate==0" title="Series Number">{{ ($index-0) + 1 }}.</span>',
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="row.error.errorCode==0 && row.rowstate==1"   title="Changed"></a>',
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="row.error.errorCode==0 && row.rowstate==2"   title="New"></a>',
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="row.error.errorCode==0 && row.rowstate==3"   title="Deleted"></a>',
                                    '&nbsp;',
                                    '<span style="display:none;" ng-repeat-start="pcol in table.cols"></span>',
                                            '<span ng-switch on="pcol.coltype">',
                                                '<table.custom   ng-switch-when="custom"  table="table" row="row" name="{{pcol.name}}"></tree.table>',
                                            '</span>',
                                    '<span style="display:none;" ng-repeat-end></span>',
                                '</li>',
                            '</ul>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.table.error_tooltip = "table_rowno_tooltip";

            if($scope.searchcol) {
			    var filter1 = new WLIU.FILTER({name:"list_search", coltype:"textbox", cols: $scope.searchcol,  colname:"list_search",  	coldesc:"Search"});
			    var filters = [];
			    filters.push(filter1);
                $scope.table.filters = filters;
            }

            $scope.keypress = function(ev) {
                if(ev.keyCode==13) {
                    $scope.table.getRows();
                } 
            }
            
            $scope.action1=function(theRow) {
                $scope.table.current = theRow.guid;
                $scope.action();
            }
            $scope.tipText=function(row) {
                var ret_val = '';
                if($scope.displaycol && $scope.displaycol!="") {
                    var cols = $scope.displaycol.split(",");
                    for(var cidx in cols) {
                        var colName = (''+cols[cidx]).trim();
                        var colMeta = $scope.table.colMeta( colName );
                        if(colMeta) {
                            ret_val += '<label title="' + colMeta.coldesc + '" style="font-size:0.8em;color:blue;">'+ colMeta.colname + '</label>: ';
                            switch( (""+colMeta.coltype).toLowerCase() ) {
                                case "select":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.selectText(row, colName);
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;

                                case "checkbox":
                                case "checkbox1":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.checkText1(row, colName);
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                                case "checkbox2":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.checkText2(row, colName);
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                                case "checkbox3":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.checkText3(row, colName );
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                                case "datetime":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += FCOM.array2Datetime( $scope.table.getCol(row, colName).value );
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                                case "intdate":
                                    ret_val += '<span style="color:#000000;">';
                                    if( $scope.table.getCol(row, colName).value ) ret_val += ('' + $scope.table.getCol(row, colName).value).intDate();
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                                case "password":
                                case "passpair":
                                    ret_val += '';
                                    ret_val += "<br>";
                                    break;
                                case "bool":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.table.getCol(row, colName).value?"Yes":"No";
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                                default:
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.table.getCol(row, colName).value;
                                    ret_val += '</span>';
                                    ret_val += "<br>";
                                    break;
                            }
                        }
                    }
                }
                return ret_val;
            }

            $scope.selectText = function(row, name) {
               var text = $.map( $scope.table.colList(name).list , function(n) {
                    if( $scope.table.getCol(row, name)!= undefined ) {
                        if($scope.table.getCol(row, name).value==n.key) 
                            return n.value;
                        else
                            return null;
                    } else {
                        return null;
                    }

               }).join("; ");
               return text;
            },

            $scope.checkText1 = function(row, name) {
               var text = $.map( $scope.table.colList(name).list , function(n) {
                    if( $scope.table.getCol(row, name)!= undefined ) {
                        if($scope.table.getCol(row, name).value[n.key]) 
                            return n.value;
                        else
                            return null;
                    } else {
                        return null;
                    }

               }).join("; ");
               return text;
            },

            $scope.checkText2 = function(row, name) {
                var ret_text = "";
                for(var key in $scope.table.colList(name).list) {
                    var dList = $scope.table.colList(name).list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.getCol(row, name)!=undefined ) {
                            if($scope.table.getCol(row, name).value[n.key]) 
                                    return n.value;
                            else
                                    return null;
                        } else {
                            return null;
                        }

                    }).join("; ");
                    ret_text += (ret_text?";":"") + text;
                }
                return ret_text;
            }

            $scope.checkText3 = function(row, name) {
                var ret_text = "";
                for(var key in $scope.table.colList(name).list) {
                    var dList = $scope.table.colList(name).list[key].list;
                    for(var pkey in dList) {
                        var pList = dList[pkey].list;
                        var text = $.map( pList , function(n) {
                            if( $scope.table.getCol(row, name)!= undefined ) {
                                if($scope.table.getCol(row, name).value[n.key]) 
                                        return n.value;
                                else
                                        return null;
                            } else {
                                return null;
                            }

                        }).join("; ");
                        ret_text += (ret_text?";":"") + text;
                    }
                }
                return ret_text;
            }
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

wliu_table.directive("table.custom", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@"
        },
        template: [
                    '<span ng-bind-html="valueText()"></span>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.valueText=function() {
                var ret_val = FCOM.colreplace($scope.table.colMeta($scope.name).colname , $scope.row.cols);
                return $sce.trustAsHtml(ret_val);
            }
        },
        link: function (sc, el, attr) {
        }
    }
});
