wliu_table.directive("table.list", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            action:     "&",
            tooltip:    "@",
            display:    "@",
            title:      "@",
            format:     "@"
        },
        template: [

                    '<div class="card z-depth-1" style="min-width:260px;">',
                        '<div class="card-header info-color text-center white-text">',
                            '{{title}}',
                        '</div>',
                        '<div class="card-header text-left" style="padding:0px; background-color:#ffffff;">',
                            '<div style="padding:2px 5px;">',
                                '<input type="text" class="wliuCommon-search" ng-model="search" style="width:160px;vertical-align:middle;" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" />',   
                                '<table.order table="table" class="pull-right" xsize="24"><table.order>',
                            '</div>',
                            '<div style="padding:0px 5px;">',
                                '<table.navi1 table="table"></table.navi1>',
                            '</div>',
                        '</div>',
                        '<div class="card-block" style="padding:0px;">',
                            '<ul class="list-group wliuCommon-list-group">',
                                '<li class="list-group-item" ',
                                    'ng-class="{\'active\': $index==table.rowno()}" ',
                                    'ng-repeat="row in table.rows" ',
                                    'ng-click="action1(row)" ',
                                    'wliu-popup popup-target="{{tooltip}}" popup-toggle="hover" ',
                                    'popup-content="{{ table.rowByIndex($index).error.errorCode?table.rowByIndex($index).error.errorMessage.nl2br1(): tipText($index).nl2br1() }}"',
                                    'title="{{ tooltip?\'\':(table.rowByIndex($index).error.errorCode ? table.rowByIndex($index).error.errorMessage : \'\') }}"',
                                '>',
                                
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-error"    ng-if="table.rowByIndex($index).error.errorCode" ',
                                        'title="{{ tooltip!=\'\' ? \'\' : (table.rowByIndex($index).error.errorCode ? table.rowByIndex($index).error.errorMessage : \'\') }}"',
                                    '>',
                                    '</a>',
                                    '<span ng-if="table.rowByIndex($index).error.errorCode==0 && table.rowByIndex($index).rowstate==0" title="Series Number">{{ ($index-0) + 1 }}.</span>',
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="table.rowByIndex($index).error.errorCode==0 && table.rowByIndex($index).rowstate==1"   title="Changed"></a>',
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="table.rowByIndex($index).error.errorCode==0 && table.rowByIndex($index).rowstate==2"   title="New"></a>',
                                    '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="table.rowByIndex($index).error.errorCode==0 && table.rowByIndex($index).rowstate==3"   title="Deleted"></a>',

                                    ' <span ng-bind-html="valueText(row)"></span>',
                                '</li>',
                            '</ul>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.keypress = function(ev) {
                if(ev.keyCode==13) {
                    $scope.table.getRows();
                } 
            }
            
            $scope.action1=function(theRow) {
                $scope.table.rownoByRow(theRow);
                $scope.action();
            }
            $scope.valueText=function(theRow) {
                var ret_val = FUNC.ARRAY.colreplace($scope.format, theRow.cols);
                return $sce.trustAsHtml(ret_val);
            }
            $scope.tipText=function(rowsn) {
                var ret_val = '';
                if($scope.display && $scope.display!="") {
                    var cols = $scope.display.split(",");
                    for(var cidx in cols) {
                        var colName = (''+cols[cidx]).trim();
                        var colMeta = $scope.table.colMeta( colName );
                        if(colMeta) {
                            ret_val += '<label title="' + colMeta.coldesc + '" style="font-size:0.8em;font-weight:bold;">'+ colMeta.colname + '</label>: ';
                            switch( (""+colMeta.coltype).toLowerCase() ) {
                                case "checkbox":
                                case "checkbox1":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.checkText1(rowsn, colName );
                                    ret_val += '</span>';
                                    ret_val += "\n";
                                    break;
                                case "checkbox2":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.checkText2(rowsn, colName );
                                    ret_val += '</span>';
                                    ret_val += "\n";
                                    break;
                                case "checkbox3":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.checkText3(rowsn, colName );
                                    ret_val += '</span>';
                                    ret_val += "\n";
                                    break;
                                case "datetime":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += FUNC.ARRAY.array2Datetime( $scope.table.colByIndex(rowsn, colName).value );
                                    ret_val += '</span>';
                                    ret_val += "\n";
                                    break;
                                case "password":
                                case "passpair":
                                    ret_val += '';
                                    ret_val += "\n";
                                    break;
                                case "bool":
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.table.colByIndex(rowsn, colName).value?"Yes":"No";
                                    ret_val += '</span>';
                                    ret_val += "\n";
                                    break;
                                default:
                                    ret_val += '<span style="color:#000000;">';
                                    ret_val += $scope.table.colByIndex(rowsn, colName).value;
                                    ret_val += '</span>';
                                    ret_val += "\n";
                                    break;
                            }
                        }
                    }
                }
                return ret_val;
            }


            $scope.checkText1 = function(rowsn, name) {
               var text = $.map( $scope.table.lists[$scope.table.colMeta(name).list].list , function(n) {
                    if( $scope.table.colByIndex( rowsn, name )!= undefined ) {
                        if($scope.table.colByIndex( rowsn, name ).value[n.key]) 
                            return n.value;
                        else
                            return null;
                    } else {
                        return null;
                    }

               }).join("; ");
               return text;
            },

            $scope.checkText2 = function(rowsn, name) {
                var ret_text = "";
                for(var key in $scope.table.lists[$scope.table.colMeta(name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta(name).list].list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.colByIndex( rowsn, name )!=undefined ) {
                            if($scope.table.colByIndex( rowsn, name ).value[n.key]) 
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

            $scope.checkText3 = function(rowsn, name) {
                var ret_text = "";
                for(var key in $scope.table.lists[$scope.table.colMeta(name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta(name).list].list[key].list;
                    for(var pkey in dList) {
                        var pList = dList[pkey].list;
                        var text = $.map( pList , function(n) {
                            if( $scope.table.colByIndex( rowsn, name )!= undefined ) {
                                if($scope.table.colByIndex( rowsn, name ).value[n.key]) 
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
        }
    }
});
