var wliu_table = angular.module("wliuTable",[]);

wliu_table.directive("table.navi", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            tooltip:    "@"
        },
        template: [
                    '<div class="row" style="padding:0px; margin:5px;" ng-show="table.navi.paging==1">',
                        '<div class="col-md-12" ng-if="table.navi.paging">',
                        '<div class="pull-left" style="padding:0px; margin:0px; white-space:nowrap;">',
                            '<span style="vertical-align:middle;">Page: </span>',                           
                            '<input type="text" class="input-tiny" style="height:1.2em;width:30px;font-size:1.2em;text-align:center;" ng-model="table.navi.pageno" ',
                                'ng-keypress="keypress($event)" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Page Number" ',
                                'title="{{tooltip? \'\':\'Page Number\'}}" ',
                            '/>',
                            '<span style="vertical-align:middle;font-size:1.2em;font-weight:bold"> / </span>',                           
                            '<span style="vertical-align:middle;font-size:1.2em;">{{ table.navi.pagetotal }}</span>',                           
                            '<span style="vertical-align:middle;font-size:1.2em;"> | </span>',                           
                            '<a class="wliu-btn24 wliu-btn24-first"     ng-class="{\'wliu-btn24-first-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno<=1 || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.firstPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="First Page" ',
                                'title="{{tooltip? \'\':\'First Page\'}}" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-previous"  ng-class="{\'wliu-btn24-previous-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno<=1 || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.previousPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Previous Page" ',
                                'title="{{tooltip? \'\':\'Previous Page\'}}" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-next"      ng-class="{\'wliu-btn24-next-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno>=table.navi.pagetotal || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.nextPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Next Page" ',
                                'title="{{tooltip? \'\':\'Next Page\'}}" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-last"      ng-class="{\'wliu-btn24-last-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno>=table.navi.pagetotal || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.lastPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Last Page" ',
                                'title="{{tooltip? \'\':\'Last Page\'}}" ',
                            '>',
                            '</a>',
                            '<span style="vertical-align:middle;font-size:1.2em;"> | </span>',                           
                            '<a class="wliu-btn24 wliu-btn24-reload" ',
                                'ng-hide="table.navi.loading==1" ',
                                'ng-click="table.getRows()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Reload Data" ',
                                'title="{{tooltip? \'\':\'Reload Data\'}}" ',
                            '></a>',
                            '<i class="fa fa-spinner fa-lg fa-pulse fa-fw" aria-hidden="true" ng-show="table.navi.loading==1"></i>',
                            '<span style="vertical-align:middle;font-size:1.2em;"> | </span>',                           
                            '<span style="vertical-align:middle; white-space:nowrap;">Total: ',
                            '<span style="vertical-align:middle;" ng-bind="table.navi.recordtotal"></span>',
                            '</span>',
                        '</div>',
                        '<div class="pull-right" style="padding:0px; margin:0px;" ng-if="table.navi.pagetotal>0 || table.navi.recordtotal>0">',
                            '<span style="vertical-align:middle;">Size: </span>',                           
                            '<input type="text" class="input-tiny" style="height:1.2em;width:40px;font-size:1.2em;text-align:center;" ng-model="table.navi.pagesize" ',
                                'ng-keypress="keypress($event)" ',                                
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Page Size" ',
                                'title="{{tooltip? \'\':\'Page Size\'}}" ',
                            '/>',
                            '<a class="wliu-btn24 wliu-btn24-reload" ',
                                'ng-hide="table.navi.loading==1" ',
                                'ng-click="table.getRows()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Reload Data" ',
                                'title="{{tooltip? \'\':\'Reload Data\'}}" ',
                            '></a>',
                            '<i class="fa fa-spinner fa-lg fa-pulse fa-fw" aria-hidden="true" ng-show="table.navi.loading==1"></i>',
                            '<table.order table="table" style="margin-right:10px" xsize="24" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Sort By" ',
                                'title="{{tooltip? \'\':\'Sort By\'}}" ',
                            '><table.order>',
                        '</div>',
                        '</div>',
                    '</div>'    
                ].join(''),
        controller: function ($scope) {
            $scope.keypress = function(ev) {
                if(ev.keyCode==13) {
                    $scope.table.getRows();
                } 
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.navi1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            tooltip:    "@"
        },
        template: [
                    '<div style="display:block; position:relative; padding:0px; margin:5px;" ng-show="table.navi.paging==1">',
                        '<div style="padding:0px; margin:0px; white-space:nowrap;">',
                            '<a class="wliu-btn16 wliu-btn16-reload" ',
                                'ng-hide="table.navi.loading==1" ',
                                'ng-click="table.getRows()" ',
                                'title="Reload Data" ',
                            '></a>',
                            '<i class="fa fa-spinner fa-pulse fa-fw" aria-hidden="true" ng-show="table.navi.loading==1"></i>',
                            '<span style="vertical-align:middle;font-size:1em;"> | </span>',                           
                            '<a class="wliu-btn16 wliu-btn16-first"     ng-class="{\'wliu-btn16-first-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno<=1 || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.firstPage()" ',
                                'title="First Page"',
                            '></a>',
                            '<a class="wliu-btn16 wliu-btn16-previous"  ng-class="{\'wliu-btn16-previous-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno<=1 || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.previousPage()" ',
                                'title="Previous Page"',
                            '></a>',
                            '<a class="wliu-btn16 wliu-btn16-next"      ng-class="{\'wliu-btn16-next-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno>=table.navi.pagetotal || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.nextPage()" ',
                                'title="Next Page"',
                            '></a>',
                            '<a class="wliu-btn16 wliu-btn16-last"      ng-class="{\'wliu-btn16-last-disabled\':(!table.navi.pageno || !table.navi.pagetotal || table.navi.pageno>=table.navi.pagetotal || table.navi.pagetotal<=0)}" ',
                                'ng-click="table.lastPage()" ',
                                'title="Last Page"',
                            '></a>',
                            '<span style="vertical-align:middle;font-size:1em;"> | </span>',                           
                            '<input type="text" class="input-tiny" style="height:1em;width:40px;font-size:1em;text-align:center;" ng-model="table.navi.pageno" ',
                                'ng-keypress="keypress($event)" ',
                                'title="Page Number"',
                            '/>',
                            '<span style="vertical-align:middle;font-size:1em;font-weight:bold">/</span>',                           
                            '<span style="vertical-align:middle;font-size:1em;">{{ table.navi.pagetotal }}</span>',                           
                            '<span style="vertical-align:middle;font-size:1em;"> | </span>',                           
                            '<input type="text" class="input-tiny" style="height:1em;width:30px;font-size:1em;text-align:center;" ng-model="table.navi.pagesize" ',
                                'ng-keypress="keypress($event)" ',                                
                                'title="Page Size"',
                            '/>',
                        '</div>',
                    '</div>'    
                ].join(''),
        controller: function ($scope) {
            $scope.keypress = function(ev) {
                if(ev.keyCode==13) {
                    $scope.table.getRows();
                } 
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.order", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            xsize:      "@"
        },
        template: [
                    '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-order">',
                        '<div class="wliu-selectlist" style="right:0px;left:auto;">',
                            '<div class="wliu-selectlist-title info-color text-center">ORDER</div>',
                            '<ul class="wliu-selectlist-content" ng-repeat="colMeta in table.cols" ng-if="colMeta.sort" style="color:#333333;">',
                                '<li class="wliu-orderlist" ',
                                    'ng-class="{\'wliu-orderlist-active\':colMeta.name==table.navi.orderby && table.navi.sortby.toLowerCase()==\'asc\'}" ',
                                    'ng-click="changeOrder(colMeta.name, \'ASC\')"',
                                '>',
                                    '{{ colMeta.colname }} <i class="fa fa-sort-asc" style="vertical-align:bottom;"></i>',
                                '</li>',
                                '<li class="wliu-orderlist" ',
                                    'ng-class="{\'wliu-orderlist-active\':colMeta.name==table.navi.orderby && table.navi.sortby.toLowerCase()==\'desc\'}" ',
                                    'ng-click="changeOrder(colMeta.name, \'DESC\')"',
                                '>',
                                    '{{ colMeta.colname }} <i class="fa fa-sort-desc" style="vertical-align:top;"></i>',
                                '</li>',
                            '</ul>',
                        '</div>',
                    '</a>'    
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:24;
            $scope.changeOrder=function(name, order) {
                $scope.table.navi.orderby=name;
                $scope.table.navi.sortby=order;
                $scope.table.getRows();
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.rowstatus", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@"
        },
        template: [
                    '<span class="wliu-text" scope="{{ table.scope }}" style="vertical-align:middle;padding:0px;" ',
                        'ng-disabled="table.getRow(rowsn)==undefined" ',
                    '>',
                        //'{{table.getRow(rowsn).rowstate}}-',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==1"   title="Changed"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==2"   title="New"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==3"   title="Deleted"></a>',
                        ' <span title="Series Number" style="vertical-align:middle;">{{ (rowsn-0) + 1 }} / {{table.rows.length}}</span>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.rowno", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="wliu-text" scope="{{ table.scope }}" ',
                        'ng-disabled="table.getRow(rowsn)==undefined" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" ',
                        'popup-body="{{table.getRow(rowsn).error.errorCode?table.getRow(rowsn).error.errorMessage.nl2br():\'\'}}"',
                        'title="{{ tooltip?\'\':(table.getRow(rowsn).error.errorCode ? table.getRow(rowsn).error.errorMessage : \'\') }}"',
                    '>',
                        //'{{table.getRow(rowsn).rowstate}}-',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error"    ng-if="table.getRow(rowsn).error.errorCode" ',
                            'title="{{ tooltip?\'\':(table.getRow(rowsn).error.errorCode? table.getRow(rowsn).error.errorMessage : \'\') }}"',
                        '>',
                        '</a>',
                        '<span ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==0" title="Series Number">{{ (rowsn-0) + 1 }}</span>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==1"   title="Changed"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==2"   title="New"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==3"   title="Deleted"></a>',
                        //' - {{table.getRow(rowsn).keys}}',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

/*
wliu_table.directive("table.ckeditor", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            hh:         "@"
        },
        template: [
                    '<span ng-hide="table.relationHide(rowsn, name)">',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error" ng-if="table.getCol(name, rowsn).errorCode"></a>',
                        '<span style="color:red; vertical-align:middle;" ng-if="table.getCol(name, rowsn).errorCode">Error: {{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:""}}</span>',
                        '<textarea scope="{{ table.scope }}" ng-model="table.getCol(name, rowsn).value" id="{{table.scope}}_{{name}}_{{rowsn}}" ',
                                  'title="{{ table.getRow(rowsn).error.errorCode ? table.getRow(rowsn).error.errorMessage : \'\' }}"',
                        '>',
                        '</textarea>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            //  model change ,  it will not sync to ckeditor
            //  only sync to ckeditor when initialize the model.
            $scope.modelChange = function() {
                if( $scope.table.getCol($scope.name, $scope.rowsn) )  {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn])
                        if( $scope.table.getCol( $scope.name, $scope.rowsn ).value != CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].getData() )
                            CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].setData( $scope.table.getCol($scope.name, $scope.rowsn).value );
                }  else {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn])
                        CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].setData("");
                }
            }
            $scope.$watch("table.getCol(name, rowsn).value", $scope.modelChange);
        },
        link: function (sc, el, attr) {
            $(function(){
                htmlObj_cn = CKEDITOR.replace(sc.table.scope + "_" + sc.name+"_"+sc.rowsn,{height:sc.hh});
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj_cn.on('change', function (evt) {
                    if( sc.table.getCol( sc.name, sc.rowsn ) ) {
                        if( sc.table.getCol( sc.name, sc.rowsn ).value != CKEDITOR.instances[sc.table.scope+"_"+sc.name+"_"+sc.rowsn].getData() ) {
                            sc.table.getCol( sc.name, sc.rowsn ).value = CKEDITOR.instances[sc.table.scope+"_"+sc.name+"_"+sc.rowsn].getData();
                            sc.table.changeCol(sc.name, sc.rowsn);
                            // to prevent diggest in progress in angular.
                            if( !sc.$root.$$phase) sc.$apply();
                        }
                    }
                });
            });
        }
    }
});

wliu_table.directive("table.ckinline", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            hh:         "@"
        },
        template: [
                    '<div>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error" ng-if="table.getCol(name, rowsn).errorCode"></a>',
                        '<span style="color:red; vertical-align:middle;" ng-if="table.getCol(name, rowsn).errorCode">Error: {{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:""}}</span>',
                        '<input type="hidden" ng-model="table.getCol(name, rowsn).value" />',
                        '<div scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}" contentEditable=true ',
                                //'ng-bind-html="table.getCol(name, rowsn).value" ',
                                'style="display:block;overflow:auto;min-height:120px;height:{{hh?hh+\'px\':\'auto\'}};border:1px solid #cccccc;">',
                            '{{ table.getCol(name, rowsn).value }}',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            //  model change ,  it will not sync to ckeditor
            //  only sync to ckeditor when initialize the model.
            $scope.getHTML = function() {
                if( $scope.table.getCol($scope.name, $scope.rowsn) )
                    return $sce.trustAsHtml($scope.table.getCol($scope.name, $scope.rowsn).value);
                else 
                    return $sce.trustAsHtml("");
            }

            if( $scope.table.getCol($scope.name, $scope.rowsn) )  {
                if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn])
                    if( $scope.table.getCol( $scope.name, $scope.rowsn ).value != CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].getData() )
                        CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].setData( $scope.table.getCol($scope.name, $scope.rowsn).value );
            }  else {
                if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn])
                    CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].setData("");
            }



            $scope.modelChange = function() {
                if( $scope.table.getCol($scope.name, $scope.rowsn) )  {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn])
                        if( $scope.table.getCol( $scope.name, $scope.rowsn ).value != CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].getData() )
                            CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].setData( $scope.table.getCol($scope.name, $scope.rowsn).value );
                }  else {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn])
                        CKEDITOR.instances[$scope.table.scope+"_"+$scope.name+"_"+$scope.rowsn].setData("");
                }
            }
            $scope.$watch("table.getCol(name, rowsn).value", $scope.modelChange);
        },
        link: function (sc, el, attr) {
            $(function(){
                CKEDITOR.disableAutoInline = true;
                htmlObj_cn = CKEDITOR.inline(sc.table.scope + "_" + sc.name+"_"+sc.rowsn);
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj_cn.on('change', function (evt) {
                    if( sc.table.getCol( sc.name, sc.rowsn ) ) {
                        if( sc.table.getCol( sc.name, sc.rowsn ).value != CKEDITOR.instances[sc.table.scope+"_"+sc.name+"_"+sc.rowsn].getData() ) {
                            sc.table.getCol( sc.name, sc.rowsn ).value = CKEDITOR.instances[sc.table.scope+"_"+sc.name+"_"+sc.rowsn].getData();
                            sc.table.changeCol(sc.name, sc.rowsn);
                            // to prevent diggest in progress in angular.
                            if( !sc.$root.$$phase) sc.$apply();
                        }
                    }
                });
            });
        }
    }
});
*/
wliu_table.directive("table.fileupload", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:           "=",
            file:           "=",
            rowsn:          "@",
            name:           "@",
            icon:           "@",
            actname:        "@",
            filename:       "@",
            tooltip:        "@"
        },
        template: [
                    '<div style="display:inline-block;min-width:120px;text-align:left;">',
                        '<i ng-if="icon" class="wliu-btn24 wliu-btn24-file-upload" style="overflow:hidden;" ',
                            'title="{{tooltip?\'\':\'upload File\'}}" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Upload File" ',
                        '>',
                                '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                        'onchange="angular.element(this).scope().selectFile(event);" ',
                                        'ng-disabled="table.getCol(name, rowsn)==undefined" />',
                        '</i>',
                        '<div ng-if="!icon" class="btn btn-info" style="display:inline-block;position:relative;text-transform:none;overflow:hidden;height:20px;line-height:20px;padding:2px 8px;">',
                            '<a class="wliu-btn16 wliu-btn16-upload"></a> ',
                            '<input type="file" onchange="angular.element(this).scope().selectFile(event);" style="display:block; position:absolute; opacity:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." />',
                            '{{actname}}',
                        '</div>',
                        '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printFile()" ng-if="table.getCol(name, rowsn).value" style="margin-left:5px;" ',
                            'title="{{tooltip?\'\':\'Print File\'}}" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print File" ',
                        '>',
                        '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteFile()" ng-if="table.getCol(name, rowsn).value" ',
                            'title="{{tooltip?\'\':\'Delete File\'}}" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete File" ',
                        '></a>',
                        '<div style="display:block;position:relative;font-size:12px;font-weight:bold;color:red;" ng-if="table.getCol(name, rowsn).errorCode">{{table.getCol(name, rowsn).errorMessage}}</div>',
                        '<div style="display:block;text-align:left;" ng-if="table.getCol(name, rowsn).value && !table.getCol(name, rowsn).errorCode">',
                            '<a href="javascript:void(0)" style="text-decoration:underline;margin:0px;font-size:12px;" ng-click="downloadFile()">{{theFile.full_name.subName(12)?theFile.full_name.subName(12):filename.subName(12)}}</a>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.theFile = new WLIU.FILE();
            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                FFILE.fromFile($scope.theFile, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getCol($scope.name, $scope.rowsn).value = fObj.data?fObj.data:"";
                        $scope.table.changeCol($scope.name, $scope.rowsn);
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
            $scope.printFile = function() {
                if(  $scope.table.getCol($scope.name, $scope.rowsn).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.name, $scope.rowsn).value);
                }
            }
            $scope.deleteFile = function() {
                 $scope.table.getCol($scope.name, $scope.rowsn).value = "";
                 $scope.table.changeCol($scope.name, $scope.rowsn);
            }
            $scope.downloadFile = function() {
                if(  $scope.table.getCol($scope.name, $scope.rowsn).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.name, $scope.rowsn).value);
                }
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.imgupload", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:           "=",
            rowsn:          "@",
            name:           "@",
            actname:        "@",

            tooltip:        "@",
            ww:             "@",
            hh:             "@",  
            vw:             "@",
            vh:             "@",  
            view:           "@",
            minww:          "@",
            minhh:          "@"
        },
        template: [
                    '<span>',
                        '<div style="position:relative;font-size:12px;font-weight:bold;color:red;" ng-if="table.getCol(name, rowsn).errorCode">{{table.getCol(name, rowsn).errorMessage}}</div>',
                        '<div style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;width:{{ww}}px;border:1px solid #cccccc;" class="wliu-background-1">',
                            '<i class="wliu-btn16 wliu-btn16-image" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8; overflow:hidden;" ',
                                'title="{{tooltip?\'\':\'upload Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Upload Image" ',
                            '>',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" ',
                                            'ng-disabled="table.getCol(name, rowsn)==undefined" />',
                            '</i>',
                            '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printImage()" ng-if="table.getCol(name, rowsn).value" style="position:absolute; margin-top:3px;margin-left:24px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print Image" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteImage()" ng-if="table.getCol(name, rowsn).value" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Delete Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete Image" ',
                            '>',
                            '</a>',
                            '<span style="position:absolute;top:24px;left:3px;font-size:12px;font-weight:bold;color:#666666;" ng-if="!table.getCol(name, rowsn).value && !table.getCol(name, rowsn).errorCode">{{actname}}</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;" class="img-content" targetid="{{imgviewerid}}">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage()" onload="imageAutoFix(this)" ww={{ww}} hh="{{hh}}" src="{{table.getCol(name, rowsn).value?table.getCol(name, rowsn).value:\'\'}}" />',
                                '</div>',
                            '</div>',
                            '<input type="hidden" scope="{{ table.scope }}" title="" ',
                                'ng-model="table.getCol(name, rowsn).value" ',
                                'ng-change="table.changeCol(name, rowsn)" ',
                                'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                            '/>',
                        '</div>',

                        '<div id="{{imgviewerid}}" ng-if="view" wliu-diag maskable fade table-diag disposable>',
                            '<div wliu-diag-body style="text-align:center;">',
                                    '<img class="img-responsive" width="100%" ww="{{vw}}" hh="{{vh}}" src="{{ imgobj.resize[view].data?imgobj.resize[view].data:\'\' }}" />',
                            '</div>',
                        '</div>',
                        
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.imgobj       = new WLIU.IMAGE({rowsn: guid()});
            $scope.imgviewerid  = $scope.table.scope + "_" + $scope.name + "_" + $scope.imgobj.rowsn;
            $scope.imgviewer    = "#" + $scope.imgviewerid; 
            $scope.minww        = $scope.minww?$scope.minww:"90";
            $scope.minhh        = $scope.minhh?$scope.minhh:"60";
            $scope.ww           = $scope.ww?$scope.ww:$scope.minww; // important for table
            $scope.vw           = $scope.vw?$scope.vw:"400";
            //$scope.vh         = $scope.vh?$scope.vh:"400";
            //$scope.view         = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
            
            $scope.printImage = function() {
                if(  $scope.table.getCol($scope.name, $scope.rowsn).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.name, $scope.rowsn).value);
                }
            }

            $scope.clickImage = function() {
                if( $scope.view ) {
                    if( $scope.table.getCol($scope.name, $scope.rowsn).value ) {
                        $scope.imgobj.resize.origin.data = $scope.table.getCol($scope.name, $scope.rowsn).value;
                        FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                        FIMAGE.resizeAll($scope.imgobj, function(){
                            $scope.$apply();  // async must apply
                            $($scope.imgviewer).trigger("ishow");
                        });
                    } else {
                        $($scope.imgviewer).trigger("ishow");
                    }
                }
            }
            
            $scope.deleteImage = function() {
                 $scope.table.getCol($scope.name, $scope.rowsn).value = "";
                 $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                var view = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
                FIMAGE.view = view; 
                FIMAGE.fromFile($scope.imgobj, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getCol($scope.name, $scope.rowsn).value = $scope.imgobj.resize[view].data?$scope.imgobj.resize[view].data:"";
                        $scope.table.changeCol($scope.name, $scope.rowsn);
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                // remove all image editor dialog which record has bee disposed.
                $("body > div[table-diag][disposable]").each(function(img_idx, img_viewer) {
                    if( $("div.img-content[targetid='" + $(img_viewer).attr("id") + "']").length<=0 ) $(img_viewer).remove();
                });

                $("body>" + sc.imgviewer).remove();
                $(sc.imgviewer).appendTo("body");

                $(sc.imgviewer).wliuDiag({});
                /*********************************************************/
                $(sc.imgviewer).unbind("ishow").bind("ishow", function(evt){
                    $(sc.imgviewer).trigger("show");
                    var click_flag = true;
                    $("img", sc.imgviewer).unbind("load").bind("load", function(ev){
                            var img = ev.target;
                            var i_ww = img.naturalWidth;
                            var i_hh = img.naturalHeight;
                            var img_rate = i_hh / i_ww;

                            var c_ww = 400;
                            var c_hh = 400;
                            if( parseInt($(img).attr("ww")) && parseInt($(img).attr("hh")) ) {
                                c_ww = parseInt($(img).attr("ww"));
                                c_hh = parseInt($(img).attr("hh"));
                            } else if( parseInt($(img).attr("ww")) ) {
                                c_ww = parseInt($(img).attr("ww"));
                                c_hh = c_ww * img_rate;
                            } else if( parseInt($(img).attr("hh")) ) {
                                c_hh = parseInt($(img).attr("hh"));
                                c_ww = c_hh / img_rate;
                            } 
                                                    
                            if( !c_ww && !c_hh ) {
                                $(img).css("width", "100%");
                            } else { 
                                $(img).css("width","");
                                if( c_ww && c_hh ) {
                                    var rate_ww = 1;
                                    var rate_hh = 1;
                                    rate_ww = c_ww / img.naturalWidth;
                                    rate_hh = c_hh / img.naturalHeight;
                                    var rate = Math.min(rate_ww, rate_hh);
                                    if(rate < 1) {
                                        if(rate_ww < rate_hh) {
                                            i_ww 	= c_ww;
                                            i_hh 	= c_ww * img_rate;
                                        } else { 
                                            i_hh 	= c_hh;
                                            i_ww	= c_hh / img_rate;
                                        }
                                    }
                                } else if(sc.ww) {
                                    i_ww        = c_ww;
                                    i_hh        = c_ww * img_rate;
                                } else if(sc.hh) {
                                    i_hh        = c_hh;
                                    i_ww        = c_hh / img_rate;
                                    img.width   = i_ww;
                                    img.height  = i_hh;
                                }
                            } // if

                            img.width   = i_ww;
                            img.height  = i_hh;  
                            if(click_flag) {
                                click_flag=false;
                                $(sc.imgviewer).trigger("show");
                            }
                    });

                });
                /*********************************************************/
                    
            });
            
        }
    }
});

wliu_table.directive("table.imgupload1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:          "=",
            rowsn:          "@",
            name:           "@",
            actname:        "@",

            actname:        "@",
            tooltip:        "@",
            ww:             "@",  //  case 1: ww + hh;   case 2:  ww    don't use  only hh 
            hh:             "@",
            vw:             "@",
            vh:             "@",
            ratio:          "@",
            view:           "@",
            minww:          "@",
            minhh:          "@"
        },
        template: [
                    '<span>',
                        '<div style="position:relative;font-size:12px;font-weight:bold;color:red;" ng-if="table.getCol(name, rowsn).errorCode">{{table.getCol(name, rowsn).errorMessage}}</div>',
                        '<div style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;width:{{ww}}px;border:1px solid #cccccc;" class="wliu-background-1">',
                            '<i class="wliu-btn16 wliu-btn16-image" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8; overflow:hidden;" ',
                                'title="{{tooltip?\'\':\'upload Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Upload Image" ',
                            '>',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" ',
                                            'ng-disabled="table.getCol(name, rowsn)==undefined" />',
                            '</i>',
                            '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printImage()" ng-if="table.getCol(name, rowsn).value" style="position:absolute; margin-top:3px;margin-left:24px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print Image" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteImage()" ng-if="table.getCol(name, rowsn).value" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Delete Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete Image" ',
                            '>',
                            '</a>',
                            '<span style="position:absolute;top:24px;left:3px;font-size:12px;font-weight:bold;color:#666666;" ng-if="!table.getCol(name, rowsn).value && !table.getCol(name, rowsn).errorCode">{{actname}}</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;" class="img-content" targetid="{{imgeditorid}}">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage()" onload="imageAutoFix(this)" ww={{ww}} hh="{{hh}}" style="cursor:pointer;" src="{{table.getCol(name, rowsn).value?table.getCol(name, rowsn).value:\'\'}}" />',
                                '</div>',
                            '</div>',
                            '<input type="hidden" scope="{{ table.scope }}" title="" ',
                                'ng-model="table.getCol(name, rowsn).value" ',
                                'ng-change="table.changeCol(name, rowsn)" ',
                                'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                            '/>',
                        '</div>',
                
                        '<div id="{{imgeditorid}}" wliu-diag movable maskable fade table-diag disposable>',
                            '<div wliu-diag-head>Image Editor</div>',
                            '<div wliu-diag-body>',
                                
                                '<div ng-if="imgobj.errorCode">',
                                    '{{imgobj.errorMessage}}',
                                '</div>',
                                '<div ng-if="!imgobj.errorCode">',
                                    '<div style="min-height:300px;">',
                                        '<div class="wliu-image-frame" style="position:relative;">',
                                            '<img class="img-responsive" width="100%" ww="{{vw}}" hh="{{vh}}" style="cursor:pointer;" src="{{ imgobj.resize[view].data?imgobj.resize[view].data:\'\' }}" />',
                                            '<div class="wliu-image-crop">',
                                                '<div class="wliu-image-crop-h"></div>',
                                                '<div class="wliu-image-crop-v"></div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                    '<div style="text-align:center;">',

                                        '<button ng-click="reset()" title="Restore Image" class="btn btn-outline-success waves-effect pull-right {{ imgobj.resize[view].data?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        '<a class="wliu-btn16 wliu-btn16-restore"></a>',
                                        ' Reset</button>',

                                        '<button ng-click="crop()" title="Crop Image" class="btn btn-outline-primary waves-effect pull-right {{ imgobj.resize[view].data?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        '<a class="wliu-btn16 wliu-btn16-crop"></a>',
                                        ' Crop</button>',

                                        '<button ng-click="rotate()" title="Rotate Image" class="btn btn-outline-primary waves-effect pull-right {{ imgobj.resize[view].data?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        '<a class="wliu-btn16 wliu-btn16-rotate-right"></a>',
                                        ' Rotate</button>',

                                        '<button ng-click="save()" title="Upload Image" class="btn btn-outline-secondary pull-left waves-effect {{ imgobj.resize[view].data?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        '<a class="wliu-btn16 wliu-btn16-okey"></a>',
                                        ' Save</button>',

                                        '<button ng-click="dispose()" title="Cancel Upload" class="btn btn-outline-warning pull-left waves-effect" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        '<a class="wliu-btn16 wliu-btn16-dispose"></a>',
                                        ' Cancel</button>',

                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',


                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.imgobj       = new WLIU.IMAGE({rowsn: guid()});
            $scope.imgeditorid  = $scope.table.scope + "_" + $scope.name + "_" + $scope.imgobj.rowsn;
            $scope.imgeditor    = "#" + $scope.imgeditorid; 
            $scope.minww        = $scope.minww?$scope.minww:"80";
            $scope.minhh        = $scope.minhh?$scope.minhh:"60";
            $scope.ww           = $scope.ww?$scope.ww:$scope.minww;  // important for table
            $scope.vw       = $scope.vw?$scope.vw:"400";
            //$scope.vh       = $scope.vh?$scope.vh:"400";
            
            $scope.view = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";

            $scope.clickImage = function() {
                if( !$scope.imgobj.resize.origin.data ) {
                    $scope.imgobj.resize.origin.data = $scope.table.getCol($scope.name, $scope.rowsn).value;
                    FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                    FIMAGE.resizeAll($scope.imgobj, function(){
                        $($scope.imgeditor).trigger("ishow");
                        FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                        $scope.$apply();  // async must apply
                    });
                } else {
                    $($scope.imgeditor).trigger("ishow");
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                }
            }

            $scope.printImage = function() {
                if(  $scope.table.getCol($scope.name, $scope.rowsn).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.name, $scope.rowsn).value);
                }
            }
            
            $scope.deleteImage = function() {
                 $scope.table.getCol($scope.name, $scope.rowsn).value = "";
                 $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                var view = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
                FIMAGE.view = $scope.view;
                FIMAGE.fromFile($scope.imgobj, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getCol($scope.name, $scope.rowsn).value = $scope.imgobj.resize[view].data?$scope.imgobj.resize[view].data:"";
                        $scope.table.changeCol($scope.name, $scope.rowsn);
                        $scope.$apply();  // important: it is async to read image in callback

                        $($scope.imgeditor).trigger("ishow");
                        FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                        
                    }
                });
            }


            /****************************************************** */
            $scope.rotate = function() {
                FIMAGE.rotate($scope.imgobj, function(oImg){
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                    $scope.$apply();
                });
            }

            $scope.crop = function() {
                FIMAGE.cropDiv($scope.imgobj, $("div.wliu-image-frame", $scope.imgeditor), $("div.wliu-image-crop", $scope.imgeditor), function(oImg){
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                    $scope.$apply();
                });
            }

            $scope.reset = function() {
                FIMAGE.cropReset($scope.imgobj, function(oImg){
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                    $scope.$apply();
                });
            }

            $scope.save = function() {
                if($scope.imgobj.resize.origin.data!="") {
					$scope.table.setImage($scope.name, $scope.rowsn, $scope.imgobj);
                    $scope.table.changeCol($scope.name, $scope.rowsn);
                    $scope.dispose();
                }
            }

            $scope.dispose = function() {
                FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                if( !$scope.$root.$$phase) $scope.$apply();
                $($scope.imgeditor).trigger("hide");
            }
            
        },
        link: function (sc, el, attr) {
           $(function(){
                var ratio = 0;
                if( sc.ww && sc.hh ) {
                    var ratio = parseInt(sc.ww)/parseInt(sc.hh);
                } 
                
                // remove all image editor dialog which record has bee disposed.
                $("body > div[table-diag][disposable]").each(function(img_idx, img_editor) {
                    if( $("div.img-content[targetid='" + $(img_editor).attr("id") + "']").length<=0 ) $(img_editor).remove();
                });

                $("body > " + sc.imgeditor).remove();
                $(sc.imgeditor).appendTo("body");
                $(sc.imgeditor).wliuDiag({});
                /*********************************************************/
                $(sc.imgeditor).unbind("ishow").bind("ishow", function(evt){
                    $(sc.imgeditor).trigger("show");
                    var click_flag = true;
                    $("img", sc.imgeditor).unbind("load").bind("load", function(ev){
                            var img = ev.target;
                            var i_ww = img.naturalWidth;
                            var i_hh = img.naturalHeight;
                            var img_rate = i_hh / i_ww;

                            var c_ww = 400;
                            var c_hh = 400;
                            if( parseInt($(img).attr("ww")) && parseInt($(img).attr("hh")) ) {
                                c_ww = parseInt($(img).attr("ww"));
                                c_hh = parseInt($(img).attr("hh"));
                            } else if( parseInt($(img).attr("ww")) ) {
                                c_ww = parseInt($(img).attr("ww"));
                                c_hh = c_ww * img_rate;
                            } else if( parseInt($(img).attr("hh")) ) {
                                c_hh = parseInt($(img).attr("hh"));
                                c_ww = c_hh / img_rate;
                            } 
                                                    
                            if( !c_ww && !c_hh ) {
                                $(img).css("width", "100%");
                            } else { 
                                $(img).css("width","");
                                if( c_ww && c_hh ) {
                                    var rate_ww = 1;
                                    var rate_hh = 1;
                                    rate_ww = c_ww / img.naturalWidth;
                                    rate_hh = c_hh / img.naturalHeight;
                                    var rate = Math.min(rate_ww, rate_hh);
                                    if(rate < 1) {
                                        if(rate_ww < rate_hh) {
                                            i_ww 	= c_ww;
                                            i_hh 	= c_ww * img_rate;
                                        } else { 
                                            i_hh 	= c_hh;
                                            i_ww	= c_hh / img_rate;
                                        }
                                    }
                                } else if(sc.ww) {
                                    i_ww        = c_ww;
                                    i_hh        = c_ww * img_rate;
                                } else if(sc.hh) {
                                    i_hh        = c_hh;
                                    i_ww        = c_hh / img_rate;
                                    img.width   = i_ww;
                                    img.height  = i_hh;
                                }
                            } // if

                            img.width   = i_ww;
                            img.height  = i_hh;  
                            if(click_flag) {
                                click_flag = false;
                                $(sc.imgeditor).trigger("show");
                            }
                    });

                });
                /*********************************************************/

               $("div.wliu-image-crop", sc.imgeditor).draggable({
                    containment: "parent"
               });
               $("div.wliu-image-crop", sc.imgeditor).resizable({ 
                    aspectRatio: ratio,
                    containment: "parent"
               });
           });
        }
    }
});


wliu_table.directive("table.head", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<label for="navi_{{table.scope}}_{{name}}" class="wliuCommon-header" scope="{{ table.scope }}" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}" ',
                        'title="{{tooltip? \'\':table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}" ',
                    '>',
                        '<span style="vertival-align:middle;">{{ table.colMeta(name).colname?table.colMeta(name).colname:name }}</span>',
                        '<span style="vertival-align:middle;" class="wliuCommon-text-error" ng-if="table.colMeta(name).notnull"> <b>*</b></span> ',
                        '<a id="navi_{{table.scope}}_{{name}}" ng-click="changeOrder()" class="wliu-btn16 wliu-btn16-sort" ng-if="table.colMeta(name).sort" ',
                                'ng-class="{\'wliu-btn16-sort-asc\':(name==table.navi.orderby && ( table.navi.sortby.toLowerCase()==\'asc\' || ( table.navi.sortby==\'\' && table.colMeta(name).sort.toLowerCase()==\'asc\'))) ',
                                ',\'wliu-btn16-sort-desc\':(name==table.navi.orderby && ( table.navi.sortby.toLowerCase()==\'desc\' || (table.navi.sortby==\'\' && table.colMeta(name).sort.toLowerCase()==\'desc\') )) }" title="Sort by {{table.colMeta(name).colname}}"',
                        '>',
                        '</a>',
                    '</label>'
                ].join(''),
        controller: function ($scope) {
            $scope.changeOrder=function() {
                if( $scope.table.navi.orderby.toLowerCase()==$scope.name.toLowerCase() ) {
                    if($scope.table.navi.sortby.toLowerCase()=="asc") {
                        $scope.table.navi.sortby = "DESC";
                    } else {
                        $scope.table.navi.sortby = "ASC";
                    }
                } else {
                    $scope.table.navi.orderby = $scope.name;
                    $scope.table.navi.sortby = $scope.table.colMeta($scope.name).sort?$scope.table.colMeta($scope.name).sort.toUpperCase():"ASC";
                }
                $scope.table.getRows();
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.label", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<label class="wliuCommon-label" scope="{{ table.scope }}" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}" ',
                        'title="{{tooltip? \'\':table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}" ',
                    '>',
                        '<span style="vertival-align:middle;">{{ table.colMeta(name).colname?table.colMeta(name).colname:name }}</span>',
                        '<span style="vertival-align:middle;" class="wliuCommon-text-error" ng-if="table.colMeta(name).notnull"> <b>*</b></span>',
                    '</label>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.html", function ($sce) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@"
        },
        template: [
                    '<span scope="{{ table.scope }}" ng-bind-html="getHTML()" ng-hide="table.relationHide(rowsn, name)"></span>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.getCol($scope.name, $scope.rowsn) )
                    return $sce.trustAsHtml($scope.table.getCol($scope.name, $scope.rowsn).value);
                else 
                    return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
            });
        }
    }
});

wliu_table.directive("table.text", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="wliu-text" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{ tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                    '>',
                        '{{ table.getCol(name, rowsn).value }}',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.hidden", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@"
        },
        template: [
                    '<span><input type="hidden" scope="{{ table.scope }}" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        }
    }
});

wliu_table.directive("table.textbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="col=table.getCol(name, rowsn)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ',

                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip? \'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.password", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="password" scope="{{ table.scope }}" placeholder="Password" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="col=table.getCol(name, rowsn)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ',

                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.passpair", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span style="display:inline-block;vertical-align:top;" ng-hide="table.relationHide(rowsn, name)">',
                    '<input type="password" style="box-sizing:border-box;width:100%;" scope="{{ table.scope }}" placeholder="Password" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value.password" ',
                        'ng-change="passChange()" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ',

                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():\'\'}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:\'\'}}" ',
                    '/>',
                    '<input type="password" style="box-sizing:border-box;width:100%;" scope="{{ table.scope }}" placeholder="Confirm Password" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).value.password!=table.getCol(name, rowsn).value.confirm }" ',
                        'ng-model="table.getCol(name, rowsn).value.confirm" ',
                        //'ng-change="confirmChange()" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ',

                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).value.password!=table.getCol(name, rowsn).value.confirm ?\'Password not match!\':\'\'}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).value.password!=table.getCol(name, rowsn).value.confirm?\'Password not match!\':\'\'}}" ',
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.passChange = function() {
                $scope.table.changeCol($scope.name, $scope.rowsn);
                //$scope.confirmChange();
            }
            /*
            $scope.confirmChange = function() {
                if( $scope.table.getCol($scope.name, $scope.rowsn).value.password == $scope.table.getCol($scope.name, $scope.rowsn).value.confirm ) {
                    $scope.table.colErrorByIndex($scope.rowsn, $scope.name, {errorCode:0, errorMessage:""});
                } else {
                    $scope.table.colErrorByIndex($scope.rowsn, $scope.name, {errorCode:1, errorMessage:"Password not match"});
                }
            }
            */
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.textarea", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<textarea scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="col=table.getCol(name, rowsn)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ',

                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '>',
                    '</textarea>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.select", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
			    '<select scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'ng-options="sObj.key as sObj.value for sObj in table.lists[table.colMeta(name).list].list" ',                        
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                 '>',
                 '<option value=""></option>',
                 '</select>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.relation", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            label:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="checkbox" scope="{{ table.scope }}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip==\'1\'?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '>',
                            '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}" ',
                                'ng-model="table.getCol(name, rowsn).value" ng-value="1"  ',
                                'ng-change="table.relationChange(rowsn); table.changeCol(name, rowsn);" ',
                                'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                            '/>',

                            '<label for="{{table.scope}}_{{name}}_{{rowsn}}" title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}">',
                                //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                '{{ label.toLowerCase()=="default"?table.colMeta(name).colname:label?label:"" }}',
                            '</label>',

                    '</span>',
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.bool", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            label:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="checkbox" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip==\'1\'?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '>',

                            '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}" ',
                                'ng-model="table.getCol(name, rowsn).value" ng-value="1"  ',
                                'ng-change="table.changeCol(name, rowsn)" ',
                                'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                            '/>',

                            '<label for="{{table.scope}}_{{name}}_{{rowsn}}" title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}">',
                                //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                '{{ label.toLowerCase()=="default"?table.colMeta(name).colname:label?label:"" }}',
                            '</label>',

                    '</span>',
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.datetime", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span  ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="table.getCol(name, rowsn).value=$.isPlainObject(table.getCol(name, rowsn).value)?table.getCol(name, rowsn).value:{}" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',                    
                    '>',
                        '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" placeholder="yyyy-mm-dd" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                            'ng-model="table.getCol(name, rowsn).value.date" ',
                            'ng-change="table.changeCol(name, rowsn)" ',
                            'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        '/>',
                        '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" placeholder="hh:mm" ',
                            //'ng-init="col=table.getCol(name, rowsn)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                            'ng-model="table.getCol(name, rowsn).value.time" ',
                            'ng-change="table.changeCol(name, rowsn)" ',
                            'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $("input.wliuCommon-datepicker", el).pickadate({
                    format: "yyyy-mm-dd",
                    formatSubmit: "yyyy-mm-dd",
                    closeOnSelect: true,
                    disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 200,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });

                $("input.wliuCommon-timepicker", el).pickatime({
                    twelvehour: false
                });

            });
        }
    }
});

wliu_table.directive("table.date", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-datepicker" scope="{{ table.scope }}" placeholder="yyyy-mm-dd" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="col=table.getCol(name, rowsn)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            $(function(){
                var today = new Date();
                $(el).pickadate({
                    format: "yyyy-mm-dd",
                    formatSubmit: "yyyy-mm-dd",
                    closeOnSelect: true,
                    disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 200,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });
            });
        }
    }
});

wliu_table.directive("table.time", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-timepicker" scope="{{ table.scope }}" placeholder="hh:mm" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="col=table.getCol(name, rowsn)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'ng-model="table.getCol(name, rowsn).value" ',
                        'ng-change="table.changeCol(name, rowsn)" ',
                        'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).pickatime({
                    twelvehour: false
                });
            });
        }
    }
});

wliu_table.directive("table.intdate", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            format:     "@"
        },
        template: [
                    '<span ng-hide="table.relationHide(rowsn, name)">{{ table.getCol(name, rowsn).value?(table.getCol(name, rowsn).value>0?(table.getCol(name, rowsn).value * 1000 | date : (format?format:"yyyy-MM-dd H:mm") ):"") :"" }}</span>'
				  ].join(''),
        controller: function ($scope) {
        }
    }
});

wliu_table.directive("table.checkbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            tooltip:    "@"
        },
        template: [
                    '<div  scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="table.getCol(name, rowsn).value=$.isPlainObject(table.getCol(name, rowsn).value)?table.getCol(name, rowsn).value:{}" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '>',
                        '<span ',
                            //'ng-init="table.getCol(name, rowsn).value=table.getCol(name, rowsn).value?table.getCol(name, rowsn).value:{};" ',                          
                            'ng-repeat="rdObj in table.lists[table.colMeta(name).list].list">',
                                '<span class="checkbox">',

                                        '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(name, rowsn).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(name, rowsn)" ',
                                            'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                                        '/>',

                                        '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.checkbox1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-checklist" value="{{ valueText() }}" ng-hide="table.relationHide(rowsn, name)" ',
                            'ng-click="change(rowsn, name)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                            'diag-target="#{{targetid}}" diag-toggle="click" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys || {};
            $scope.change = function(rowsn, name) {
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.rowsn = rowsn;
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                    var text = $.map( $scope.table.lists[$scope.table.colMeta($scope.name).list].list , function(n) {
                    if( $scope.table.getCol($scope.name, $scope.rowsn)!= undefined ) {
                        if($scope.table.getCol($scope.name, $scope.rowsn).value[n.key]) 
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

wliu_table.directive("table.checkdiag1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable scope="{{ table.scope }}" ',
                        //'ng-init="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value=$.isPlainObject(table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value)?table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value:{}" ',
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.rowsn, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',

                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.rowsn, table.lists[name].keys.name)" title="check all"  ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.rowsn, table.lists[name].keys.name)" title="remove all"  ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="checkbox">',

                                        '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(table.lists[name].keys.name, table.lists[name].keys.rowsn)" ',
                                            'ng-disabled="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn )==undefined" ',
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
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};
            $scope.change = function(rowsn, name) {
                // $scope.name is  lists[name],   name is colname
                $scope.table.lists[$scope.name].keys.rowsn = rowsn;
                $scope.table.lists[$scope.name].keys.name = name;
            }

            $scope.checkall = function(rowsn, name) {
                $scope.table.getCol( name, rowsn ).value = $scope.table.getCol( name, rowsn ).value || {};
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.getCol( name, rowsn ).value[ $scope.table.lists[$scope.name].list[key].key ] = true;
                }
                $scope.table.changeCol(name, rowsn);
            }

            $scope.removeall = function(rowsn, name) {
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.getCol( name, rowsn ).value = {};
                }
                $scope.table.changeCol(name, rowsn);
            }

            $scope.valueArr = function(rowsn, name) {
               var valueArr = $.map( $scope.table.lists[$scope.name].list , function(n) {
                   if( $scope.table.getCol( name, rowsn )!= undefined  ) {
                        if( $scope.table.getCol( name, rowsn ).value[n.key] ) 
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

wliu_table.directive("table.checklist1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px; padding:2px; overflow-y:auto;text-align:left; min-width:240px;" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="table.getCol( name, rowsn ).value=$.isPlainObject(table.getCol( name, rowsn ).value)?table.getCol( name, rowsn ).value:{}"',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr()">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',

                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.colMeta(name).list].list|filter:search">',
                                '<span class="checkbox">',

                                        '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol( name, rowsn ).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(name, rowsn)" ',
                                            'ng-disabled="table.getCol( name, rowsn )==undefined" ',
                                        '/>',

                                        '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.table.colMeta($scope.name).list].keys = $scope.table.lists[$scope.table.colMeta($scope.name).list].keys || {};

            $scope.checkall = function() {
                $scope.table.getCol($scope.name, $scope.rowsn).value = $scope.table.getCol($scope.name, $scope.rowsn).value || {};
                for( var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list  ) {
                    $scope.table.getCol($scope.name, $scope.rowsn).value[ $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].key ] = true;
                }

                $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.removeall = function() {
                for( var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list  ) {
                    $scope.table.getCol($scope.name, $scope.rowsn).value = {};
                }
                $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.valueArr = function() {
               var valueArr = $.map( $scope.table.lists[$scope.table.colMeta($scope.name).list].list , function(n) {
                   if( $scope.table.getCol( $scope.name, $scope.rowsn  )!= undefined  ) {
                        if( $scope.table.getCol( $scope.name, $scope.rowsn  ).value[n.key] ) 
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
        }
    }
});

wliu_table.directive("table.checkbox2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                        '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-checklist" value="{{ valueText() }}" ng-hide="table.relationHide(rowsn, name)" ',
                                'ng-click="change(rowsn, name)" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',

                                'diag-target="#{{targetid}}" diag-toggle="click" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys || {};
            $scope.change = function(rowsn, name) {
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.rowsn = rowsn;
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.getCol($scope.name, $scope.rowsn)!=undefined ) {
                            if($scope.table.getCol($scope.name, $scope.rowsn).value[n.key]) 
                                    return n.value;
                            else
                                    return null;
                        } else {
                            return null;
                        }

                    }).join("; ");
                    ret_text += (ret_text && text?"; ":"") + text;
                }
                return ret_text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.checkdiag2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable class="container" scope="{{ table.scope }}" ',
                        //'ng-init="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value=$.isPlainObject(table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value)?table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value:{}"',
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.rowsn, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.rowsn, table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.rowsn, table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.lists[name].list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(table.lists[name].keys.name, table.lists[name].keys.rowsn)" ',
                                                                        'ng-disabled="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none;" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};
            $scope.change = function(rowsn, name) {
                // $scope.name is  lists[name],   name is colname
                $scope.table.lists[$scope.name].keys.rowsn = rowsn;
                $scope.table.lists[$scope.name].keys.name = name;
            }

            $scope.checkall = function(rowsn, name) {
                $scope.table.getCol( name, rowsn ).value = $scope.table.getCol( name, rowsn ).value || {};
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    for( var dkey in dList) {
                        $scope.table.getCol( name, rowsn ).value[ dList[dkey].key ] = true;
                    }
                }

                $scope.table.changeCol(name, rowsn);
            }

            $scope.removeall = function(rowsn, name) {
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.getCol( name, rowsn ).value = {};
                }
                $scope.table.changeCol(name, rowsn);
            }

            $scope.valueArr = function(rowsn, name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol( name, rowsn )!= undefined  ) {
                                if( $scope.table.getCol( name, rowsn ).value[n.key] ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_table.directive("table.checklist2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="table.getCol( name, rowsn ).value=$.isPlainObject(table.getCol( name, rowsn ).value)?table.getCol( name, rowsn ).value:{}"',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr()">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="min-height:250px;min-width:350px;font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.lists[table.colMeta(name).list].list|filter:search"></span>',
                                    '<div class="col-sm-{{colnum}}" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, rowsn ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(name, rowsn)" ',
                                                                        'ng-disabled="table.getCol( name, rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none;" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.table.colMeta($scope.name).list].keys = $scope.table.lists[$scope.table.colMeta($scope.name).list].keys || {};

            $scope.checkall = function() {
                $scope.table.getCol($scope.name, $scope.rowsn).value = $scope.table.getCol($scope.name, $scope.rowsn).value || {};
                for( var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list  ) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    for( var dkey in dList) {
                        $scope.table.getCol($scope.name, $scope.rowsn).value[ dList[dkey].key ] = true;
                    }
                }
                $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.removeall = function() {
                for( var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list  ) {
                    $scope.table.getCol($scope.name, $scope.rowsn).value = {};
                }
                $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol( $scope.name, $scope.rowsn  )!= undefined  ) {
                                if( $scope.table.getCol( $scope.name, $scope.rowsn  ).value[n.key] ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.checkbox3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-checklist" value="{{ valueText() }}" ng-hide="table.relationHide(rowsn, name)" ',
                            'ng-click="change(rowsn, name)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',

                            'diag-target="#{{targetid}}" diag-toggle="click" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys || {};
            $scope.change = function(rowsn, name) {
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.rowsn = rowsn;
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key1 in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var list2 = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var text = $.map( list3 , function(n) {
                            if( $scope.table.getCol($scope.name, $scope.rowsn)!= undefined ) {
                                if($scope.table.getCol($scope.name, $scope.rowsn).value[n.key]) 
                                        return n.value;
                                else
                                        return null;
                            } else {
                                return null;
                            }

                        }).join("; ");
                        ret_text += (ret_text && text?"; ":"") + text;
                    }
                }
                return ret_text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.checkdiag3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag maskable movable class="container" scope="{{ table.scope }}" ',
                        //'ng-init="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value=$.isPlainObject(table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value)?table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value:{}"',
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.rowsn, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.rowsn, table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.rowsn, table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
                        
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.lists[name].list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.lists[name].list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<span style="white-space:nowrap;font-weight:700;">{{ rdObj.value }}</span>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(table.lists[name].keys.name, table.lists[name].keys.rowsn)" ',
                                                                        'ng-disabled="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none" ng-repeat-end></span>',
                            '<span style="display:none" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};
            $scope.listFilter = $scope.listFilter || {};
            $scope.change = function(rowsn, name) {
                // $scope.name is  lists[name],   name is colname
                $scope.table.lists[$scope.name].keys.rowsn = rowsn;
                $scope.table.lists[$scope.name].keys.name = name;
            }

            $scope.checkall = function(rowsn, name) {
                $scope.table.getCol( name, rowsn ).value = $scope.table.getCol( name, rowsn ).value || {};
                for( var key1 in $scope.table.lists[$scope.name].list  ) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for( var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.getCol( name, rowsn ).value[ list3[key3].key ] = true;
                        }
                     }
                }
                $scope.table.changeCol(name, rowsn);
            }

            $scope.removeall = function(rowsn, name) {
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    $scope.table.getCol( name, rowsn ).value = {};
                }
                $scope.table.changeCol(name, rowsn);
            }

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function(rowsn, name) {
                var ret_arr = [];
                for(var key1 in $scope.table.lists[$scope.name].list) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
                            if( $scope.table.getCol( name, rowsn )!= undefined  ) {
                                    if( $scope.table.getCol( name, rowsn ).value[n.key] ) 
                                            return n;
                                    else
                                            return null;
                            } else {
                                return null;
                            }
                        });
                        $.merge(ret_arr, valueArr);
                    }
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_table.directive("table.checklist3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        //'ng-init="table.getCol( name, rowsn ).value=$.isPlainObject(table.getCol( name, rowsn ).value)?table.getCol( name, rowsn ).value:{}"',
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr()">',
                                    '{{ vObj.value }}, ',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.lists[table.colMeta(name).list].list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="min-height:250px;min-width:350px;font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.lists[table.colMeta(name).list].list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<span style="white-space:nowrap;font-weight:700;">{{ rdObj.value }}</span>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, rowsn ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(name, rowsn)" ',
                                                                        'ng-disabled="table.getCol( name, rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none" ng-repeat-end></span>',
                            '<span style="display:none" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.table.colMeta($scope.name).list].keys = $scope.table.lists[$scope.table.colMeta($scope.name).list].keys || {};
            $scope.listFilter = $scope.listFilter || {};

            $scope.checkall = function() {
                $scope.table.getCol($scope.name, $scope.rowsn).value = $scope.table.getCol($scope.name, $scope.rowsn).value || {};
                for( var key1 in $scope.table.lists[$scope.table.colMeta($scope.name).list].list ) {
                    var list2 = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key1].list;
                    for( var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.getCol($scope.name, $scope.rowsn).value[ list3[key3].key ] = true;
                        }
                     }
                }
                $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.removeall = function() {
                for( var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list  ) {
                    $scope.table.getCol($scope.name, $scope.rowsn).value = {};
                }
                $scope.table.changeCol($scope.name, $scope.rowsn);
            }

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key1 in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var list2 = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
                            if( $scope.table.getCol($scope.name, $scope.rowsn)!= undefined  ) {
                                    if( $scope.table.getCol($scope.name, $scope.rowsn).value[n.key] ) 
                                            return n;
                                    else
                                            return null;
                            } else {
                                return null;
                            }
                        });
                        $.merge(ret_arr, valueArr);
                    }
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radio", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            colnum:     "@",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<div scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '>',
                        '<span ',
                            //'ng-init="table.getCol(name, rowsn).value=table.getCol(name, rowsn).value?table.getCol(name, rowsn).value:{};" ',                          
                            'ng-repeat="rdObj in table.lists[table.colMeta(name).list].list">',
                                '<span class="radio">',

                                        '<input type="radio"  scope="{{ table.scope }}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(name, rowsn).value" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(name, rowsn)" ',
                                            'ng-disabled="table.getCol(name, rowsn)==undefined" ',
                                        '/>',

                                        '<label scope="{{ table.scope }}" for="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radio1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                        '<input  type="text" readonly scope="{{ table.scope }}" class="wliuCommon-radiolist" value="{{ valueText() }}" ng-hide="table.relationHide(rowsn, name)" ',
                                'ng-click="change(rowsn, name)" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',

                                'diag-target="#{{targetid}}" diag-toggle="click" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        '/>',
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys || {};
            $scope.change = function(rowsn, name) {
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.rowsn = rowsn;
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var val =  $scope.table.getCol( $scope.name, $scope.rowsn  )?$scope.table.getCol($scope.name, $scope.rowsn).value:"";
                var valueText = $scope.table.FCOLLECT.firstByKV( $scope.table.lists[$scope.table.colMeta($scope.name).list].list, {key:val} )?$scope.table.FCOLLECT.firstByKV( $scope.table.lists[$scope.table.colMeta($scope.name).list].list, {key:val} ).value:"";
                return valueText;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radiodiag1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            bar:        "@", 
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable scope="{{ table.scope }}">',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText(table.lists[name].keys.rowsn, table.lists[name].keys.name) }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="radio">',

                                        '<input type="radio" scope="{{ table.scope }}" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(table.lists[name].keys.name, table.lists[name].keys.rowsn)" ',
                                            'ng-disabled="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn )==undefined" ',
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

            $scope.valueText = function(rowsn, name) {
                var val =  $scope.table.getCol( name, rowsn )?$scope.table.getCol( name, rowsn ).value:"";
                var valueText = $scope.table.FCOLLECT.firstByKV( $scope.table.lists[$scope.name].list, {key:val} )?$scope.table.FCOLLECT.firstByKV( $scope.table.lists[$scope.name].list, {key:val} ).value:"";
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

wliu_table.directive("table.radiolist1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            bar:        "@", 
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px; padding:2px; overflow-y:auto;text-align:left; min-width:240px;" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)">',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText() }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.colMeta(name).list].list|filter:search">',
                                '<span class="radio">',

                                        '<input type="radio" scope="{{ table.scope }}" name="{{table.scope}}_{{name}}_{{rowsn}}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol( name, rowsn ).value" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeCol(name,rowsn)" ',
                                            'ng-disabled="table.getCol( name, rowsn )==undefined" ',
                                        '/>',

                                        '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.valueText = function() {
                var val =  $scope.table.getCol( $scope.name, $scope.rowsn  )?$scope.table.getCol( $scope.name, $scope.rowsn  ).value:"";
                var valueText = $scope.table.FCOLLECT.firstByKV( $scope.table.lists[$scope.table.colMeta($scope.name).list].list, {key:val} )?$scope.table.FCOLLECT.firstByKV( $scope.table.lists[$scope.table.colMeta($scope.name).list].list, {key:val} ).value:"";
                return valueText;
            }
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radio2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                        '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-radiolist" value="{{ valueText() }}" ng-hide="table.relationHide(rowsn, name)" ',
                                'ng-click="change(rowsn, name)" ',
                                'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',

                                'diag-target="#{{targetid}}" diag-toggle="click" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys || {};
            $scope.change = function(rowsn, name) {
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.rowsn = rowsn;
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    var text = $.map( dList , function(n) {
                        if($scope.table.getCol($scope.name, $scope.rowsn)!=undefined) {
                            if($scope.table.getCol($scope.name, $scope.rowsn).value == n.key) 
                                    return n.value;
                            else
                                    return null;
                        } else {
                            return null;
                        }

                    }).join("; ");
                    ret_text += text;
                }
                return ret_text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radiodiag2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable class="container" scope="{{ table.scope }}">',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.rowsn, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.lists[name].list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="radio">',
                                                                    '<input type="radio" scope="{{ table.scope }}" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(table.lists[name].keys.name, table.lists[name].keys.rowsn)" ',
                                                                        'ng-disabled="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none;" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.name].keys = $scope.table.lists[$scope.name].keys || {};

            $scope.valueArr = function(rowsn, name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol( name, rowsn )!= undefined  ) {
                                if( $scope.table.getCol( name, rowsn ).value == n.key ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_table.directive("table.radiolist2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)">',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr()">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.lists[table.colMeta(name).list].list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="radio">',
                                                                    '<input type="radio" scope="{{ table.scope }}" name="{{table.scope}}_{{name}}_{{rowsn}}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, rowsn ).value" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(name, rowsn)" ',
                                                                        'ng-disabled="table.getCol( name, rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none;" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol( $scope.name, $scope.rowsn  )!= undefined  ) {
                                if( $scope.table.getCol( $scope.name, $scope.rowsn  ).value == n.key ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radio3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly scope="{{ table.scope }}" class="wliuCommon-radiolist" value="{{ valueText() }}" ng-hide="table.relationHide(rowsn, name)" ',
                            'ng-click="change(rowsn, name)" ',
                            'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(name, rowsn).errorCode }" ',

                            'diag-target="#{{targetid}}" diag-toggle="click" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.getCol(name, rowsn).errorCode?table.getCol(name, rowsn).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys = $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys || {};
            $scope.change = function(rowsn, name) {
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.rowsn = rowsn;
                $scope.table.lists[ $scope.table.colMeta($scope.name).list ].keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    for(var pkey in dList) {
                        var pList = dList[pkey].list;
                        var text = $.map( pList , function(n) {
                            if( $scope.table.getCol($scope.name, $scope.rowsn)!=undefined ) {
                                if($scope.table.getCol($scope.name, $scope.rowsn).value==n.key) 
                                        return n.value;
                                else
                                        return null;
                            } else {
                                return null;
                            }

                        }).join("; ");
                        ret_text += text;
                    }
                }
                return ret_text;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.radiodiag3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable class="container" scope="{{ table.scope }}">',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.rowsn, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ng-show="bar==1" />',
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.lists[name].list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.lists[name].list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="radio">',
                                                                    '<input type="radio" scope="{{ table.scope }}" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn ).value" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(table.lists[name].keys.name, table.lists[name].keys.rowsn)" ',
                                                                        'ng-disabled="table.getCol( table.lists[name].keys.name, table.lists[name].keys.rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none" ng-repeat-end></span>',
                            '<span style="display:none" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.listFilter = $scope.listFilter || {};
            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function(rowsn, name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol( name, rowsn )!= undefined  ) {
                                if( $scope.table.getCol( name, rowsn ).value == n.key ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_table.directive("table.radiolist3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            rowsn:      "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" scope="{{ table.scope }}" ng-hide="table.relationHide(rowsn, name)">',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr()">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }"  ng-show="bar==1" />',
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.lists[table.colMeta(name).list].list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.lists[table.colMeta(name).list].list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="radio">',
                                                                    '<input type="radio" scope="{{ table.scope }}" name="{{table.scope}}_{{name}}_{{rowsn}}" id="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, rowsn ).value" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeCol(name, rowsn)" ',
                                                                        'ng-disabled="table.getCol( name, rowsn )==undefined" ',
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_{{rowsn}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
                                                                        '{{ tdObj.value }}',
                                                                    '</label>',

                                                            '</span>',
                                                            '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',  
                                                        '</span>',                                                  
                                                '</ul>',    
                                            '</li>',
                                        '</ul>',
                                    '</div>',
                            '<span style="display:none" ng-repeat-end></span>',
                            '<span style="display:none" ng-repeat-end></span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.lists[$scope.table.colMeta($scope.name).list].keys = $scope.table.lists[$scope.table.colMeta($scope.name).list].keys || {};
            $scope.listFilter = $scope.listFilter || {};

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.table.colMeta($scope.name).list].list) {
                    var dList = $scope.table.lists[$scope.table.colMeta($scope.name).list].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol( $scope.name, $scope.rowsn  )!= undefined  ) {
                                if( $scope.table.getCol( $scope.name, $scope.rowsn  ).value == n.key ) 
                                        return n;
                                else
                                        return null;
                        } else {
                            return null;
                        }
                    });
                    $.merge(ret_arr, valueArr);
               }
               return ret_arr;
            }
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.bgroup", function () {
    return {
        restrict:   "E",
        replace:    true,
        transclude: true,           
        scope: {
            table:      "=",
            rowsn:      "@",
            actname:    "@"
        },
        template: [
                    '<div class="dropdown" style="white-space:nowrap;">',
                        '<button scope="{{ table.scope }} class="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" ',
                         'style="font-size:0.8em;" ',
                         'ng-class="{\'btn-info\': table.getRow(rowsn).rowstate==0, \'btn-warning\': table.getRow(rowsn).rowstate!=0}"',
                         '>',
                            '{{actname}} ',
                            '<i class="fa fa-1 fa-caret-down"></i>',
                        '</button>',
                        '<ul class="dropdown-menu" style="white-space:nowrap;" ng-transclude>',
                        '</ul>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.next", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn-outline-primary waves-effect" ',
                            'ng-click="naviRecord()" ',
                            'ng-if="table.rowno()<table.rows.length-1 && table.rows.length>0 && table.rowno()>=0"',
                        '>',
                            '{{actname?actname:name}}',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.naviRecord = function() {
                // add you code here 
                $scope.table.nextRecord();
                // end of code
                $scope.action(); // trigger outside event
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.previous", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn-outline-primary waves-effect" ',
                            'ng-click="naviRecord()" ',
                            'ng-if="table.rows.length>0 && table.rowno()>0"',
                        '>',
                            '{{actname?actname:name}}',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.naviRecord = function() {
                // add you code here 
                $scope.table.previousRecord();
                // end of code
                $scope.action(); // trigger outside event
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.blink", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span><a href="javascript:void(0);" class="wliuCommon-table-btn16" scope="{{ table.scope }}" ',
                        'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                        'ng-click="action1(table.getRow(rowsn))" ',
                         'ng-if="buttonState(name, table.getRow(rowsn).rowstate)"',
                    '>',
                    '<i class="wliu-btn16 wliu-btn16-{{name}}"></i> ',
                    '<span style="vertical-align:middle;">{{actname}}</span>',
                    '</a></span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function(theRow) {
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        var ridx = $scope.table.indexByKeys(theRow.keys);
                        $scope.table.rowno(ridx);
                        break;
                    case "save":
                        $scope.table.saveRow(theRow);
                        break;
                    case "cancel":
                        $scope.table.cancelRow(theRow);

                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                    case "add":
                        // none 
                        break;
                    case "delete":
                        $scope.table.deleteRow(theRow);
                        break;
                }                
                // end of code
                $scope.action(); // trigger outside event
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                 return  wliuTableService.buttonState(name, rowstate) && right;
            };
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.tablebutton", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            outline:    "@",
            action:     "&",
            before:     "&",
            after:      "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" scope="{{ table.scope }}" ',
                            'style="min-width:60px;" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                            'ng-click="action1()" ',
                        '>',
                        '{{actname}}',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            
            $scope.buttonStyle = function() {
                var ret_val = "primary";
                switch( $scope.name ) {
                    case "search":
                        ret_val = "secondary";
                        break;
                    case "match":
                        ret_val = "secondary";
                        break;
                    case "save":
                        ret_val = "secondary";
                        break;
                    case "cancel":
                        ret_val = "warning";
                        break;
                    default:
                        ret_val = "info";
                        break;
                }
                return ret_val;
            }
            $scope.action1 = function(theRow) {
                $scope.before();
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "search":
                        $scope.table.allRows();
                        break;
                    case "match":
                        $scope.table.matchRows();
                        break;
                    case "save":
                        $scope.table.saveRows();
                        break;
                    case "cancel":
                        $scope.table.cancelRows();
                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                    default:
                        break;
                }                
                //
                $scope.action();
                $scope.after();
            };

            $scope.buttonState = function() {

            };
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.singlebutton", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            actname:    "@",
            action:     "&",
            outline:    "@",
            icon:       "@",
            before:     "&",
            after:      "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" scope="{{ table.scope }}" ',
                            'style="min-width:60px;" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                            'ng-disabled="!buttonState(name, table.getRow(rowsn).rowstate)" ',
                            'ng-click="action1(table.getRow(rowsn))" ',
                            'title="{{ table.getRow(rowsn).error.errorCode ? table.getRow(rowsn).error.errorMessage : \'\' }}"',
                        '>',
                        '<span style="vertical-align:middle;">',
                            '{{actname}}',
                        '</span>',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.buttonStyle = function() {
                var ret_val = "primary";
                switch( $scope.name ) {
                    case "save":
                        ret_val = "secondary";
                        break;
                    case "cancel":
                        ret_val = "warning";
                        break;
                }
                return ret_val;
            }
            $scope.action1 = function(theRow) {
                $scope.before();
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "save":
                        $scope.table.saveRow(theRow);
                        break;
                    case "cancel":
                        if( $scope.table.singleKeys ) 
                            $scope.table.cancelRow(theRow);
                         else 
                            $scope.table.resetRow(theRow);

                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                               if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                }                
                //
                $scope.action();
                $scope.after();
            };

            $scope.buttonState = function(name, rowsn) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  rowsn>=0 && right;
            };
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.rowbutton", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            actname:    "@",
            action:     "&",
            outline:    "@",
            icon:       "@",
            before:     "&",
            after:      "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" scope="{{ table.scope }}" ',
                            'style="min-width:60px;" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                            'ng-click="action1(table.getRow(rowsn))" ',
                            'ng-if="buttonState(name, table.getRow(rowsn).rowstate)" ',
                            'title="{{ table.getRow(rowsn).error.errorCode ? table.getRow(rowsn).error.errorMessage : \'\' }}"',
                        '>',
                        '<span ng-if="icon==1" style="vertical-align:middle;">',
                            '<i class="wliu-btn16 wliu-btn16-rowstate-error"    ng-if="table.getRow(rowsn).error.errorCode" ',
                                'title="{{ table.getRow(rowsn).error.errorCode ? table.getRow(rowsn).error.errorMessage : \'\' }}"',
                            '></i> ',
                            '<i class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==1" title="Changed"></i> ',
                            '<i class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==2" title="New"></i> ',
                            '<i class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="table.getRow(rowsn).error.errorCode==0 && table.getRow(rowsn).rowstate==3" tilte="Deleted"></i> ',
                        '</span>',
                        '<span style="vertical-align:middle;">',
                            '{{actname}}',
                        '</span>',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.buttonStyle = function() {
                var ret_val = "primary";
                switch( $scope.name ) {
                    case "detail":
                        ret_val = "info";
                        break;
                    case "add":
                        ret_val = "default";
                        break;
                    case "save":
                        ret_val = "secondary";
                        break;
                    case "reset":
                    case "cancel":
                        ret_val = "warning";
                        break;
                    case "delete":
                        ret_val = "danger";
                        break;
                }
                return ret_val;
            }
            $scope.action1 = function(theRow) {
                $scope.before();
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        var ridx = $scope.table.indexByKeys(theRow.keys);
                        $scope.table.rowno(ridx);
                        break;
                    case "save":
                        $scope.table.saveRow(theRow);
                        break;
                    case "cancel":
                        $scope.table.cancelRow(theRow);
                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                    case "reset":
                        $scope.table.resetRow(theRow);
                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                    case "add":
                        $scope.table.addRow(0, $scope.table.newRow());
                        $scope.table.rowno(0);
                        break;
                    case "delete":
                        $scope.table.deleteRow(theRow);
                        break;
                }                
                //
                $scope.action();
                $scope.after();
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                if( name=="add" && rowstate==undefined ) return true;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.bicon", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            xsize:      "@",
            name:       "@",
            actname:    "@",
            action:     "&",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                    '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-{{name}}" scope="{{ table.scope }}" ',
                        'ng-click="action1(table.getRow(rowsn))" ',
                        'ng-if="buttonState(name, table.getRow(rowsn).rowstate)"',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{actname?actname:name}}" popup-placement="down" ',
                        'title="{{tooltip?\'\':actname?actname:name}}" ',
                    '>',
                    '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:16;

            $scope.action1 = function(theRow) {
                // add you code here 
                 switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        var ridx = $scope.table.indexByKeys(theRow.keys);
                        $scope.table.rowno(ridx);
                        break;
                    case "save":
                        $scope.table.saveRow(theRow);
                        break;
                    case "cancel":
                        $scope.table.cancelRow(theRow);

                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                    case "add":
                        // none 
                        break;
                    case "delete":
                        $scope.table.deleteRow(theRow);
                        break;
                }                
               //
                $scope.action();
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.btext", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                    '<a href="javascript:void(0)" class="wliu-table-button" scope="{{ table.scope }}" ',
                        'title="{{actname?actname:name}}" ',
                        'ng-click="action1(table.getRow(rowsn))" ',
                        'ng-if="buttonState(name, table.getRow(rowsn).rowstate)" ',    
                    '>',
                    '{{actname?actname:name.capital()}}',
                    '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function(theRow) {
                // add you code here 
                 switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        var ridx = $scope.table.indexByKeys(theRow.keys);
                        $scope.table.rowno(ridx);
                        break;
                    case "save":
                        $scope.table.saveRow(theRow);
                        break;
                    case "cancel":
                        $scope.table.cancelRow(theRow);

                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.rowsn).value:"" );
                                }
                        }
                        break;
                    case "add":
                        // none 
                        break;
                    case "delete":
                        $scope.table.deleteRow(theRow);
                        break;
                }                
               //
                $scope.action();
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.hgroup", function () {
    return {
        restrict:   "E",
        replace:    true,
        transclude: true,           
        scope: {
            table:      "=",
            actname:    "@"
        },
        template: [
                    '<div class="dropdown" style="white-space:nowrap;">',
                        '<button scope="{{ table.scope }} class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ',
                             'style="font-size:0.8em;" ',
                             'ng-class="{\'btn-info\':  rowstate()==0, \'btn-warning\':  rowstate()!=0}"',
                         '>',
                            '{{actname}} ',
                            '<i class="fa fa-1 fa-caret-down"></i>',
                        '</button>',
                        '<ul class="dropdown-menu" style="white-space:nowrap;" ng-transclude>',
                        '</ul>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.rowstate = function() {
                var _state = 0;
                for(var ridx in $scope.table.rows) {
                    _state = Math.max( _state, $scope.table.rows[ridx].rowstate );
                }
                return _state;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.hlink", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span><a href="javascript:void(0);" class="wliuCommon-table-btn16" scope="{{ table.scope }}" ',
                        'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                        'ng-click="action1()" ',
                        'ng-if="buttonState(name, rowstate())"',
                    '>',
                    '<i class="wliu-btn16 wliu-btn16-{{name}}"></i> ',
                    '<span style="vertical-align:middle;">{{actname}}</span>',
                    '</a></span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function() {
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "save":
                        $scope.table.saveRows();
                        break;
                    case "cancel":
                        $scope.table.cancelRows();
                        break;
                    case "add":
                        $scope.table.addRow(0, $scope.table.newRow());
                        break;
                    case "delete":
                        // No
                        break;
                }                
                //
                $scope.action();
            };

            $scope.rowstate = function() {
                var _state = 0;
                for(var ridx in $scope.table.rows) {
                    _state = Math.max( _state, $scope.table.rows[ridx].rowstate );
                }
                return _state;
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.hicon", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            xsize:      "@",
            name:       "@",
            actname:    "@",
            action:     "&",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                    '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-{{name}}" scope="{{ table.scope }}" ',
                        'ng-click="action1()" ',
                        'ng-if="buttonState(name, rowstate())"',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{actname?actname:name}}" popup-placement="down" ',
                        'title="{{tooltip?\'\':actname?actname:name}}" ',
                    '>',
                    '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:16;

            $scope.action1 = function() {
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "save":
                        $scope.table.saveRows();
                        break;
                    case "cancel":
                        $scope.table.cancelRows();
                        break;
                    case "add":
                        $scope.table.addRow();
                        break;
                    case "delete":
                        // No
                        break;
                }                
                //
                $scope.action();
            };

            $scope.rowstate = function() {
                var _state = 0;
                for(var ridx in $scope.table.rows) {
                    _state = Math.max( _state, $scope.table.rows[ridx].rowstate );
                }
                return _state;
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.htext", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                    '<a href="javascript:void(0)" class="wliu-table-hbutton" scope="{{ table.scope }}" ',
                            'title="{{ actname?actname:name }}" ',
                            'ng-click="action1()"',
                            'ng-if="buttonState(name, rowstate())"',                     
                    '>',
                    '{{ actname?actname:name.capital() }}',
                    '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function() {
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "save":
                        $scope.table.saveRows();
                        break;
                    case "cancel":
                        $scope.table.cancelRows();
                        break;
                    case "add":
                        $scope.table.addRow();
                        break;
                    case "delete":
                        // No
                        break;
                }                
                //
                $scope.action();
            };

            $scope.rowstate = function() {
                var _state = 0;
                for(var ridx in $scope.table.rows) {
                    _state = Math.max( _state, $scope.table.rows[ridx].rowstate );
                }
                return _state;
            };

            $scope.buttonState = function(name, rowstate) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  wliuTableService.buttonState(name, rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.rowerror", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            targetid:   "@",
            rowsn:      "@"
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
                if( $scope.table.getRow($scope.rowsn) )
                    if( $scope.table.getRow($scope.rowsn).error.errorCode )
                        return $sce.trustAsHtml($scope.table.getRow($scope.rowsn).error.errorMessage.nl2br());
                    else 
                        return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                $(el).unbind("errorshow").bind("errorshow", function(evt){
                    if( sc.table.getRow(sc.rowsn) ) {
                        if( parseInt(sc.table.getRow(sc.rowsn).error.errorCode) ) {
                            $(el).trigger("show");
                        }
                    }
                });
            });
        }
    }
});

wliu_table.directive("table.taberror", function (wliuTableService) {
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
                    return $sce.trustAsHtml($scope.table.error.errorMessage.nl2br());
                else 
                    return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                $(el).unbind("errorshow").bind("errorshow", function(evt){
                    if( parseInt(sc.table.error.errorCode) ) {
                        $(el).trigger("show");
                    }
                });
            });
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