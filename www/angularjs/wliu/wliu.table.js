var common_scope        = 'scope="{{ table.scope }}" ';
var common_ng_hide      = 'ng-hide="table.relationHide(row, name)" ';
var common_ng_change    = 'ng-change="table.changeCol(row, name)" ';
var common_ng_class     = 'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(row, name).errorCode }" '; 
var common_ng_disabled  = 'ng-disabled="table.getCol(row, name)==undefined" '; 
var common_ng_options   = 'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ';
var common_ng =     [
                        common_scope,
                        common_ng_change,
                        common_ng_class,
                        common_ng_disabled,
                        common_ng_hide,
                        common_ng_options
                    ].join('');

var common_tooltip = [  'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" ',
                        'popup-toggle="hover" ',
                        'popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" '
                     ].join('');

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
                            '<a class="wliu-btn24 wliu-btn24-first"     ng-class="{\'wliu-btn24-first-disabled\':table.firstState()}" ',
                                'ng-click="table.firstPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="First Page" ',
                                'title="{{tooltip? \'\':\'First Page\'}}" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-previous"  ng-class="{\'wliu-btn24-previous-disabled\':table.previousState()}" ',
                                'ng-click="table.previousPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Previous Page" ',
                                'title="{{tooltip? \'\':\'Previous Page\'}}" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-next"      ng-class="{\'wliu-btn24-next-disabled\':table.nextState()}" ',
                                'ng-click="table.nextPage()" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Next Page" ',
                                'title="{{tooltip? \'\':\'Next Page\'}}" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-last"      ng-class="{\'wliu-btn24-last-disabled\':table.lastState()}" ',
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
                            '<a class="wliu-btn16 wliu-btn16-first"     ng-class="{\'wliu-btn16-first-disabled\': table.firstState() }" ',
                                'ng-click="table.firstPage()" ',
                                'title="First Page"',
                            '></a>',
                            '<a class="wliu-btn16 wliu-btn16-previous"  ng-class="{\'wliu-btn16-previous-disabled\': table.previousState() }" ',
                                'ng-click="table.previousPage()" ',
                                'title="Previous Page"',
                            '></a>',
                            '<a class="wliu-btn16 wliu-btn16-next"      ng-class="{\'wliu-btn16-next-disabled\': table.nextState() }" ',
                                'ng-click="table.nextPage()" ',
                                'title="Next Page"',
                            '></a>',
                            '<a class="wliu-btn16 wliu-btn16-last"      ng-class="{\'wliu-btn16-last-disabled\': table.lastState() }" ',
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
                                    'ng-class="{\'wliu-orderlist-active\': table.orderState(colMeta.name, \'ASC\')}" ',
                                    'ng-click="changeOrder(colMeta, \'ASC\')"',
                                '>',
                                    '{{ colMeta.colname }} <i class="fa fa-sort-asc" style="vertical-align:bottom;"></i>',
                                '</li>',
                                '<li class="wliu-orderlist" ',
                                    'ng-class="{\'wliu-orderlist-active\':table.orderState(colMeta.name, \'DESC\')}" ',
                                    'ng-click="changeOrder(colMeta, \'DESC\')"',
                                '>',
                                    '{{ colMeta.colname }} <i class="fa fa-sort-desc" style="vertical-align:top;"></i>',
                                '</li>',
                            '</ul>',
                        '</div>',
                    '</a>'    
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:24;
            $scope.changeOrder=function(colMeta, order) {
                $scope.table.navi.orderby=colMeta.table + "." + colMeta.col;
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
            table:    "=",
            row:      "="
        },
        template: [
                    '<span class="wliu-text" scope="{{ table.scope }}" style="vertical-align:middle;padding:0px;" ',
                        'ng-disabled="row==undefined" ',
                    '>',
                        //'{{table.getRow(row).rowstate}}-',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="row.error.errorCode==0 && row.rowstate==1"   title="Changed"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="row.error.errorCode==0 && row.rowstate==2"   title="New"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="row.error.errorCode==0 && row.rowstate==3"   title="Deleted"></a>',
                        ' <span title="Series Number" style="vertical-align:middle;">{{ table.indexByRow(row) - 0 + 1 }} / {{table.rows.length}}</span>',
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
            row:        "=",
            tooltip:    "@"
        },
        template: [
                    '<span class="wliu-text" scope="{{ table.scope }}" ',
                        'ng-disabled="row==undefined" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" ',
                        'popup-body="{{row.error.errorCode?row.error.errorMessage.nl2br():\'\'}}"',
                        'title="{{ tooltip?\'\':(row.error.errorCode ? row.error.errorMessage : \'\') }}"',
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error"    ng-if="row.error.errorCode" ',
                            'title="{{ tooltip?\'\':( row.error.errorCode? row.error.errorMessage : \'\') }}"',
                        '>',
                        '</a>',
                        '<span ng-if="row.error.errorCode==0 && row.rowstate==0" title="Series Number">{{ table.indexByRow(row) - 0 + 1 }}</span>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="row.error.errorCode==0 && row.rowstate==1"   title="Changed"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="row.error.errorCode==0 && row.rowstate==2"   title="New"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="row.error.errorCode==0 && row.rowstate==3"   title="Deleted"></a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("table.fileupload", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:          "=",
            row:            "=",
            name:           "@",
            icon:           "@",
            actname:        "@",
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
                                        'ng-disabled="table.getCol(row, name)==undefined" />',
                        '</i>',
                        '<div ng-if="!icon" class="btn btn-info" style="display:inline-block;position:relative;text-transform:none;overflow:hidden;height:20px;line-height:20px;padding:2px 8px;">',
                            '<a class="wliu-btn16 wliu-btn16-upload"></a> ',
                            '<input type="file" onchange="angular.element(this).scope().selectFile(event);" style="display:block; position:absolute; opacity:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." />',
                            '{{actname}}',
                        '</div>',
                        '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printFile()" ng-if="table.getCol(row, name).value" style="margin-left:5px;" ',
                            'title="{{tooltip?\'\':\'Print File\'}}" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print File" ',
                        '>',
                        '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteFile()" ng-if="table.getCol(row, name).value" ',
                            'title="{{tooltip?\'\':\'Delete File\'}}" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete File" ',
                        '></a>',
                        '<div style="display:block;position:relative;font-size:12px;font-weight:bold;color:red;" ng-if="table.getCol(row, name).errorCode">{{table.getCol(row, name).errorMessage}}</div>',
                        '<div style="display:block;text-align:left;" ng-if="table.getCol(row, name).value && !table.getCol(row, name).errorCode">',
                            '<a href="javascript:void(0)" style="text-decoration:underline;margin:0px;font-size:12px;" ng-click="downloadFile()">{{theFile.full_name.subName(12)?theFile.full_name.subName(12):table.colMeta(name).coldesc}}</a>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.theFile = new WLIU.FILE({guid:guid()});
            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                FFILE.allowSize = $scope.table.colMeta($scope.name).maxlength>0 &&$scope.table.colMeta($scope.name).maxlength<=GCONFIG.max_upload_size?$scope.table.colMeta($scope.name).maxlength:GCONFIG.max_upload_size;
                FFILE.allowType = $scope.table.colMeta($scope.name).allowtype?$scope.table.colMeta($scope.name).allowtype:GCONFIG.file_allow_type;
                FFILE.fromFile($scope.theFile, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getCol($scope.row, $scope.name).value = fObj.data?fObj.data:"";
                        $scope.table.changeCol($scope.row, $scope.name);
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
            $scope.printFile = function() {
                if(  $scope.table.getCol($scope.row, $scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.row, $scope.name).value);
                }
            }
            $scope.deleteFile = function() {
                 $scope.table.getCol($scope.row, $scope.name).value = "";
                 $scope.table.changeCol($scope.row, $scope.name);
            }
            $scope.downloadFile = function() {
                if(  $scope.table.getCol($scope.row, $scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.row, $scope.name).value);
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
            table:          "=",
            row:            "=",
            name:           "@",
            actname:        "@",

            ww:             "@",
            hh:             "@",  
            vw:             "@",
            vh:             "@",  
            view:           "@",
            minww:          "@",
            minhh:          "@",
            tooltip:        "@"
        },
        template: [
                    '<span>',
                        '<div style="position:relative;font-size:12px;font-weight:bold;color:red;" ng-if="table.getCol(row, name).errorCode">{{table.getCol(row, name).errorMessage}}</div>',
                        '<div style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;width:{{ww}}px;border:1px solid #cccccc;" class="wliu-background-1">',
                            '<i class="wliu-btn16 wliu-btn16-image" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8; overflow:hidden;" ',
                                'title="{{tooltip?\'\':\'upload Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Upload Image" ',
                            '>',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" ',
                                            'ng-disabled="table.getCol(row, name)==undefined" />',
                            '</i>',
                            '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printImage()" ng-if="table.getCol(row, name).value" style="position:absolute; margin-top:3px;margin-left:24px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print Image" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteImage()" ng-if="table.getCol(row, name).value" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Delete Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete Image" ',
                            '>',
                            '</a>',
                            '<span style="position:absolute;top:24px;left:3px;font-size:12px;font-weight:bold;color:#666666;" ng-if="!table.getCol(row, name).value && !table.getCol(row, name).errorCode">{{actname}}</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;" class="img-content" targetid="{{imgviewerid}}">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage()" onload="imageAutoFix(this)" ww={{ww}} hh="{{hh}}" src="{{table.getCol(row, name).value?table.getCol(row, name).value:\'\'}}" />',
                                '</div>',
                            '</div>',
                            '<input type="hidden" scope="{{ table.scope }}" title="" ',
                                'ng-model="table.getCol(row, name).value" ',
                                'ng-change="table.changeCol(row, name)" ',
                                'ng-disabled="table.getCol(row, name)==undefined" ',
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
            $scope.imgobj       = new WLIU.IMAGE({guid: guid(), token: guid()});
            $scope.imgviewerid  = $scope.table.scope + "_" + $scope.name + "_" + $scope.imgobj.guid;
            $scope.imgviewer    = "#" + $scope.imgviewerid; 
            $scope.minww        = $scope.minww?$scope.minww:"90";
            $scope.minhh        = $scope.minhh?$scope.minhh:"60";
            $scope.ww           = $scope.ww?$scope.ww:$scope.minww; // important for table
            $scope.vw           = $scope.vw?$scope.vw:"400";
            //$scope.vh         = $scope.vh?$scope.vh:"400";
            //$scope.view         = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
            
            $scope.printImage = function() {
                if(  $scope.table.getCol($scope.row, $scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.row, $scope.name).value);
                }
            }

            $scope.clickImage = function() {
                if( $scope.view ) {
                    if( $scope.table.getCol($scope.row, $scope.name).value ) {
                        $scope.imgobj.resize.origin.data = $scope.table.getCol($scope.row, $scope.name).value;
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
                 $scope.table.getCol($scope.row, $scope.name).value = "";
                 $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                var view = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
                FIMAGE.view = view; 
                FIMAGE.allowSize = $scope.table.colMeta($scope.name).maxlength>0 &&$scope.table.colMeta($scope.name).maxlength<=GCONFIG.max_upload_size?$scope.table.colMeta($scope.name).maxlength:GCONFIG.max_upload_size;
                FIMAGE.allowType = $scope.table.colMeta($scope.name).allowtype?$scope.table.colMeta($scope.name).allowtype:GCONFIG.image_allow_type;
                FIMAGE.fromFile($scope.imgobj, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getCol($scope.row, $scope.name).value = $scope.imgobj.resize[view].data?$scope.imgobj.resize[view].data:"";
                        $scope.table.changeCol($scope.row, $scope.name);
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
            row:            "=",
            name:           "@",
            actname:        "@",

            ww:             "@",  //  case 1: ww + hh;   case 2:  ww    don't use  only hh 
            hh:             "@",
            vw:             "@",
            vh:             "@",
            ratio:          "@",
            view:           "@",
            minww:          "@",
            minhh:          "@",
            tooltip:        "@"
        },
        template: [
                    '<span>',
                        '<div style="position:relative;font-size:12px;font-weight:bold;color:red;" ng-if="table.getCol(row, name).errorCode">{{table.getCol(row, name).errorMessage}}</div>',
                        '<div style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;width:{{ww}}px;border:1px solid #cccccc;" class="wliu-background-1">',
                            '<i class="wliu-btn16 wliu-btn16-image" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8; overflow:hidden;" ',
                                'title="{{tooltip?\'\':\'upload Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Upload Image" ',
                            '>',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" ',
                                            'ng-disabled="table.getCol(row, name)==undefined" />',
                            '</i>',
                            '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printImage()" ng-if="table.getCol(row, name).value" style="position:absolute; margin-top:3px;margin-left:24px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print Image" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteImage()" ng-if="table.getCol(row, name).value" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                'title="{{tooltip?\'\':\'Delete Image\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete Image" ',
                            '>',
                            '</a>',
                            '<span style="position:absolute;top:24px;left:3px;font-size:12px;font-weight:bold;color:#666666;" ng-if="!table.getCol(row, name).value && !table.getCol(row, name).errorCode">{{actname}}</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;" class="img-content" targetid="{{imgeditorid}}">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage()" onload="imageAutoFix(this)" ww={{ww}} hh="{{hh}}" style="cursor:pointer;" src="{{table.getCol(row, name).value?table.getCol(row, name).value:\'\'}}" />',
                                '</div>',
                            '</div>',
                            '<input type="hidden" scope="{{ table.scope }}" title="" ',
                                'ng-model="table.getCol(row, name).value" ',
                                'ng-change="table.changeCol(row, name)" ',
                                'ng-disabled="table.getCol(row, name)==undefined" ',
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
            $scope.imgobj       = new WLIU.IMAGE({guid: guid(), token: guid()});
            $scope.imgeditorid  = $scope.table.scope + "_" + $scope.name + "_" + $scope.imgobj.guid;
            $scope.imgeditor    = "#" + $scope.imgeditorid; 
            $scope.minww        = $scope.minww?$scope.minww:"80";
            $scope.minhh        = $scope.minhh?$scope.minhh:"60";
            $scope.ww           = $scope.ww?$scope.ww:$scope.minww;  // important for table
            $scope.vw       = $scope.vw?$scope.vw:"400";
            //$scope.vh       = $scope.vh?$scope.vh:"400";
            
            $scope.view = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";

            $scope.clickImage = function() {
                if( !$scope.imgobj.resize.origin.data ) {
                    $scope.imgobj.resize.origin.data = $scope.table.getCol($scope.row, $scope.name).value;
                    FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                    FIMAGE.resizeAll($scope.imgobj, function(){
                        $scope.$apply();  // async must apply
                        $($scope.imgeditor).trigger("ishow");
                    });
                } else {
                    $($scope.imgeditor).trigger("ishow");
                }
            }

            $scope.printImage = function() {
                if(  $scope.table.getCol($scope.row, $scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getCol($scope.row, $scope.name).value);
                }
            }
            
            $scope.deleteImage = function() {
                 $scope.table.getCol($scope.row, $scope.name).value = "";
                 $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                var view = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
                FIMAGE.view = $scope.view;
                FIMAGE.allowSize = $scope.table.colMeta($scope.name).maxlength>0 &&$scope.table.colMeta($scope.name).maxlength<=GCONFIG.max_upload_size?$scope.table.colMeta($scope.name).maxlength:GCONFIG.max_upload_size;
                FIMAGE.allowType = $scope.table.colMeta($scope.name).allowtype?$scope.table.colMeta($scope.name).allowtype:GCONFIG.image_allow_type;
                FIMAGE.fromFile($scope.imgobj, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getCol($scope.row, $scope.name).value = $scope.imgobj.resize[view].data?$scope.imgobj.resize[view].data:"";
                        $scope.table.changeCol($scope.row, $scope.name);
                        $scope.$apply();  // important: it is async to read image in callback

                        $($scope.imgeditor).trigger("ishow");
                    }
                });
            }


            /****************************************************** */
            $scope.rotate = function() {
                FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                FIMAGE.rotate($scope.imgobj, function(oImg){
                    $scope.$apply();
                    $($scope.imgeditor).trigger("ishow");
                });
            }

            $scope.crop = function() {
                FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                FIMAGE.cropDiv($scope.imgobj, $("div.wliu-image-frame", $scope.imgeditor), $("div.wliu-image-crop", $scope.imgeditor), function(oImg){
                    $scope.$apply();
                    $($scope.imgeditor).trigger("ishow");
                });
            }

            $scope.reset = function() {
                FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                FIMAGE.cropReset($scope.imgobj, function(oImg){
                    $scope.$apply();
                    $($scope.imgeditor).trigger("ishow");
                });
            }

            $scope.save = function() {
                if($scope.imgobj.resize.origin.data!="") {
					$scope.table.setImage($scope.row, $scope.name,  $scope.imgobj);
                    $scope.table.changeCol($scope.row, $scope.name);
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
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", sc.imgeditor) );
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
                                FIMAGE.cropDivReset( $("div.wliu-image-crop", sc.imgeditor) );
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

wliu_table.directive("table.esign", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@",

            subject:    "@",
            firstname:  "@",
            lastname:   "@",

            ww:         "@",
            hh:         "@",
            minww:      "@",
            minhh:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                        '<span style="font-size:16px;font-weight:bold;color:red;" ng-if="table.getCol(row, name).errorCode">{{table.getCol(row, name).errorMessage}}</span>',
                        '<br ng-if="table.getCol(row, name).errorCode">',
                        '<div ng-click="showEsign()" style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;border:1px solid #cccccc;" class="wliu-background-11" >',
                            '<div style="display:table;">',
                            '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{minww}}px;height:{{minhh}}px;" class="esign-content" targetid="{{esignDivid}}">',
                                '<img class="img-responsive" width="100%" onload="imageAutoFix(this)" ww={{minww}} hh={{minhh}} src="{{table.getCol(row, name).value?table.getCol(row, name).value:\'\'}}" />',
                            '</div>',
                            '<input type="hidden" scope="{{ table.scope }}" title="" ',
                                'ng-model="table.getCol(row, name).value" ',
                                'ng-change="table.changeCol(row, name)" ',
                                'ng-disabled="table.getCol(row, name)==undefined" ',
                            '/>',
                        '</div>',
                        '<div id="{{esignDivid}}" wliu-diag maskable fade esign-diag disposable>',
                            '<div wliu-diag-body>',
                                '<span style="display:block;color:blue;">Please use mouse or touch screen pen to sign your name:</span>',
                                '<canvas id="can" width="{{ww}}" height={{hh}} style="border:2px solid #666666;"></canvas>',
                                '<div style="text-align:center;">',
                                    '<button ng-click="save()" title="Save" class="btn btn-lg btn-outline-success waves-effect" ',
                                            'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                            ' Confirm',
                                    '</button>',
                                    //'<button ng-click="clear()" title="Close" class="btn btn-lg btn-outline-danger waves-effect" ',
                                    //        'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    //        ' Clear',
                                    //'</button>',
                                    '<button ng-click="cancel()" title="Be careful. clear signature!" class="btn btn-lg btn-outline-danger waves-effect" ',
                                            'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                            ' Clear Signature',
                                    '</button>',
                                    '<button ng-click="close()" title="Close" class="btn btn-lg btn-outline-info waves-effect pull-right" ',
                                            'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                            ' Close',
                                    '</button>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '<span>',
                ].join(''),
        controller: function ($scope) {
            $scope.ww = $scope.ww?$scope.ww:640;
            $scope.hh = $scope.hh?$scope.hh:320;
            $scope.minww  = $scope.minww?$scope.minww:"100";
            $scope.minhh  = $scope.minhh?$scope.minhh:"50";

            $scope.esignDivid  = $scope.table.scope + "_" + $scope.name + "_" + guid();
            $scope.esignDiv    = "#" + $scope.esignDivid; 
            
            $scope.showEsign = function() {
                FIMAGE.image2Canvas($scope.esign_canvas.ctx, $scope.table.getCol($scope.row, $scope.name).value);
                $($scope.esignDiv).trigger("show");
            }

            $scope.save  = function() {
                if( $scope.esign_canvas.signed ) {
                    $scope.esign_canvas.subject = $scope.subject;
                    
                    if($scope.table.getCol($scope.row, $scope.firstname) )
                        $scope.esign_canvas.firstName = $scope.table.getCol($scope.row, $scope.firstname).value;
    
                    if($scope.table.getCol($scope.row, $scope.lastname) )
                        $scope.esign_canvas.lastName = $scope.table.getCol($scope.row, $scope.lastname).value;
                    
                    $scope.table.getCol($scope.row, $scope.name).value = $scope.esign_canvas.getDataUrl();
                    $scope.table.changeCol($scope.row, $scope.name);
                    $scope.esign_canvas.clear();  
                }
                $($scope.esignDiv).trigger("hide");
            }
            $scope.cancel = function() {
                $scope.table.getCol($scope.row, $scope.name).value = "";
                $scope.table.changeCol($scope.row, $scope.name);
                $scope.esign_canvas.clear();  
                //$($scope.esignDiv).trigger("hide");
            }
            $scope.close = function() {
                $($scope.esignDiv).trigger("hide");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $("body > div[esign-diag][disposable]").each(function(el_idx, el_esign) {
                    if( $("div.esign-content[targetid='" + $(el_esign).attr("id") + "']").length<=0 ) $(el_esign).remove();
                });
                $("body>" + sc.esignDiv).remove();
                $(sc.esignDiv).appendTo("body");
                $(sc.esignDiv).wliuDiag();

                sc.esign_canvas = new WLIU.CANVAS({ 
                    canvas: $("canvas", sc.esignDiv).get(0)
                });
                sc.esign_canvas.init();
                
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
                                'ng-class="{\'wliu-btn16-sort-asc\': table.orderState(name, \'ASC\') ',
                                ',\'wliu-btn16-sort-desc\':table.orderState(name, \'DESC\') }" title="Sort by {{table.colMeta(name).colname}}"',
                        '>',
                        '</a>',
                    '</label>'
                ].join(''),
        controller: function ($scope) {
            $scope.changeOrder=function() {
                var colMeta = $scope.table.colMeta($scope.name);
                if( $scope.table.navi.orderby== colMeta.table + "." + colMeta.col ) {
                    if($scope.table.navi.sortby.toUpperCase=="ASC") {
                        $scope.table.navi.sortby = "DESC";
                    } else {
                        $scope.table.navi.sortby = "ASC";
                    }
                } else {
                    $scope.table.navi.orderby = colMeta.table + "." + colMeta.col;
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
            row:        "=",
            name:       "@"
        },
        template: [
                    '<span scope="{{ table.scope }}" ng-bind-html="getHTML()" ng-hide="table.relationHide(row, name)"></span>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.getCol($scope.row, $scope.name) )
                    return $sce.trustAsHtml($scope.table.getCol($scope.row, $scope.name).value);
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="wliu-text" scope="{{ table.scope }}" ng-hide="table.relationHide(row, name)" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(row, name).errorCode }" ',
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{ tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
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

wliu_table.directive("table.hidden", function () {
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
                    '<span><input type="hidden" scope="{{ table.scope }}" ',
                        'ng-model="table.getCol(row, name).value" ',
                        'ng-change="table.changeCol(row, name)" ',
                        'ng-disabled="table.getCol(row, name)==undefined" ',
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" ',
                        'ng-model="table.getCol(row, name).value" ',
                        common_ng,
                        common_tooltip,
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="password" placeholder="Password" ',
                        'ng-model="table.getCol(row, name).value" ',
                        common_ng,
                        common_tooltip,
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span style="display:inline-block;vertical-align:top;" ' + common_ng_hide + '>',
                    '<input type="password" style="box-sizing:border-box;width:100%;" placeholder="Password" ',
                        'ng-model="table.getCol(row, name).value.password" ',
                        'ng-change="passChange()" ',
                        common_scope,
                        common_ng_class,
                        common_ng_disabled,
                        common_ng_options,
                        common_tooltip,
                        //'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():\'\'}}" ',
                        //'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:\'\'}}" ',
                    '/>',
                    '<input type="password" style="box-sizing:border-box;width:100%;" placeholder="Confirm Password" ',
                        'ng-model="table.getCol(row, name).value.confirm" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getCol(row, name).value.password!=table.getCol(row, name).value.confirm }" ',
                        //'ng-change="confirmChange()" ',
                        common_scope,
                        common_ng_disabled,
                        common_ng_options,
                        'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).value.password!=table.getCol(row, name).value.confirm ?\'Password not match!\':\'\'}}" ',
                        'title="{{tooltip?\'\':table.getCol(row, name).value.password!=table.getCol(row, name).value.confirm?\'Password not match!\':\'\'}}" ',
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.passChange = function() {
                $scope.table.changeCol($scope.row, $scope.name);
                //$scope.confirmChange();
            }
            /*
            $scope.confirmChange = function() {
                if( $scope.table.getCol($scope.row, $scope.name).value.password == $scope.table.getCol($scope.row, $scope.name).value.confirm ) {
                    $scope.table.colErrorByIndex($scope.row, $scope.name, {errorCode:0, errorMessage:""});
                } else {
                    $scope.table.colErrorByIndex($scope.row, $scope.name, {errorCode:1, errorMessage:"Password not match"});
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<textarea ',
                        'ng-model="table.getCol(row, name).value" ',
                        common_ng,
                        common_tooltip,
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
			    '<select ',
                        'ng-model="table.getCol(row, name).value" ',
                        'ng-options="sObj.key as sObj.value for sObj in table.lists[table.colMeta(name).list].list" ',                        
                        common_scope,
                        common_ng_change,
                        common_ng_class,
                        common_ng_disabled,
                        common_ng_hide,
                        common_tooltip,
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
            row:        "=",
            name:       "@",
            label:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="checkbox" ',
                        common_scope,
                        common_ng_class,
                        common_tooltip,
                    '>',
                            '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row}}" ',
                                'ng-model="table.getCol(row, name).value" ng-value="1"  ',
                                'ng-change="table.relationChange(row); table.changeCol(row, name);" ',
                                common_scope,
                                common_ng_disabled,                                
                            '/>',
                            '<label for="{{table.scope}}_{{name}}_{{row}}" title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}">',
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
            row:        "=",
            name:       "@",
            label:      "@",
            tooltip:    "@"
        },
        template: [
                    '<span class="checkbox" ',
                        common_scope,
                        common_ng_class,
                        common_ng_hide,
                        common_tooltip,
                    '>',
                            '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row}}" ',
                                'ng-model="table.getCol(row, name).value" ng-value="1"  ',
                                common_scope,
                                common_ng_change,
                                common_ng_disabled,
                            '/>',
                            '<label for="{{table.scope}}_{{name}}_{{row}}" title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}">',
                                //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                '{{ label.toLowerCase()=="default"?table.colMeta(name).colname:label?label:"" }}',
                            '</label>',
                            '<br ng-if="table.getCol(row, name).errorCode">',
                            '<span style="color:red;" ng-if="table.getCol(row, name).errorCode">{{table.getCol(row, name).errorMessage}}</span>',
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<span  ',
                        common_ng_hide,
                        common_tooltip,
                    '>',
                        '<input type="textbox" class="wliuCommon-datepicker" placeholder="yyyy-mm-dd" ',
                            'ng-model="table.getCol(row, name).value.date" ',
                            common_scope,
                            common_ng_change,
                            common_ng_class,
                            common_ng_disabled,
                        '/>',
                        '<input type="textbox" class="wliuCommon-timepicker" placeholder="hh:mm" ',
                            'ng-model="table.getCol(row, name).value.time" ',
                            common_scope,
                            common_ng_change,
                            common_ng_class,
                            common_ng_disabled,
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
                    //disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 100,
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
            row:      "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-datepicker" placeholder="yyyy-mm-dd" ',
                        'ng-model="table.getCol(row, name).value" ',
                        common_scope,
                        common_ng_change,
                        common_ng_class,
                        common_ng_disabled,
                        common_ng_hide,

                        common_tooltip,
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
                    //disable: [ {from:[2016,9,1], to:[2016,9,10]} , [2016,10,5] ],
                    //min: new Date(2015,3,20),
                    //max: new Date(2016,11,14),
                    selectYears: 100,
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
            row:        "=",
            name:       "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-timepicker" placeholder="hh:mm" ',
                        'ng-model="table.getCol(row, name).value" ',
                        common_scope,
                        common_ng_change,
                        common_ng_class,
                        common_ng_hide,
                        common_ng_disabled,
                        common_tooltip,
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
            row:        "=",
            name:       "@",
            format:     "@"
        },
        template: [
                    '<span ',
                        common_ng_hide,
                    '>',
                        '{{ table.getCol(row, name).value?(table.getCol(row, name).value>0?(table.getCol(row, name).value * 1000 | date : (format?format:"yyyy-MM-dd H:mm") ):"") :"" }}',
                    '</span>'
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
            row:        "=",
            name:       "@",
            colnum:     "@",
            tooltip:    "@"
        },
        template: [
                    '<div ',
                        common_scope,
                        common_ng_class,
                        common_ng_hide,
                        common_tooltip,
                    '>',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.colMeta(name).list].list">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(row, name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            common_scope,
                                            common_ng_change,
                                            common_ng_disabled,
                                        '/>',

                                        '<label for="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
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
            row:        "=",
            name:       "@",  // col_name 
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(row, name)" ',
                            'diag-target="#{{targetid}}" diag-toggle="click" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            common_scope,
                            common_ng_class,
                            common_ng_disabled,
                            common_ng_hide,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(name).keys.guid = row.guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                    var text = $.map( $scope.table.colList($scope.name).list , function(n) {
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

wliu_table.directive("table.checkdiag1", function () {
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
                        common_scope,
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
                            common_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all"  ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all"  ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                            'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                            common_scope,
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
            $scope.checkall = function(guid, name) {
                $scope.table.getColByGuid(guid, name).value = $scope.table.getColByGuid(guid, name).value || {};
                for( var key in $scope.table.lists[$scope.name].list ) {
                   $scope.table.getColByGuid(guid, name).value[$scope.table.lists[$scope.name].list[key].key] = true;
                }
                $scope.table.changeColByGuid(guid, name);
            }

            $scope.removeall = function(guid, name) {
                $scope.table.getColByGuid(guid, name).value = {};
                $scope.table.changeColByGuid(guid, name);
            }
            // $scope.name  is different with  name;  $scope.name is listName,   name is col_name for selected value
            $scope.valueArr = function(guid, name) {
               var valueArr = $.map( $scope.table.lists[$scope.name].list , function(n) {
                   if( $scope.table.getColByGuid(guid, name)!= undefined ) {
                        if( $scope.table.getColByGuid(guid, name).value[n.key] ) 
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
            row:        "=",
            name:       "@",   // $scope.name is  col_name 
            colnum:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px; padding:2px; overflow-y:auto;text-align:left; min-width:240px;" ',
                        common_scope,
                        common_ng_hide,
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

                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.colList(name).list|filter:search">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(row, name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            common_scope,
                                            common_ng_change,
                                            common_ng_disabled,
                                        '/>',
                                        '<label for="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',

                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '</span>',
                        '</div>',    
                    '</div>'
            
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};

            $scope.checkall = function() {
                $scope.table.getCol($scope.row, $scope.name).value = $scope.table.getCol($scope.row, $scope.name).value || {};
                for( var key in $scope.table.colList($scope.name).list  ) {
                    $scope.table.getCol($scope.row, $scope.name).value[$scope.table.colList($scope.name).list[key].key] = true;
                }
                $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.removeall = function() {
                $scope.table.getCol($scope.row, $scope.name).value = {};
                $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.valueArr = function() {
               var valueArr = $.map( $scope.table.colList($scope.name).list , function(n) {
                   if( $scope.table.getCol($scope.row, $scope.name)!= undefined ) {
                        if( $scope.table.getCol($scope.row, $scope.name).value[n.key] ) 
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
            row:        "=",
            name:       "@", // col_name
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                        '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                                'ng-click="change(row, name)" ',
                                'diag-target="#{{targetid}}" diag-toggle="click" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                common_scope,
                                common_ng_class,
                                common_ng_disabled,
                                common_ng_hide,
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(name).keys.guid = row.guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.getCol($scope.row, $scope.name)!=undefined ) {
                            if($scope.table.getCol($scope.row, $scope.name).value[n.key]) 
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
            name:       "@",  // ListName  
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable class="container" ',
                        common_scope,
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
                            common_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
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
                                                                    '<input type="checkbox" id="{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                                                        'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                                                        common_scope,
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

            $scope.checkall = function(guid, name) {
                $scope.table.getColByGuid(guid, name).value = $scope.table.getColByGuid(guid, name).value || {};
                for( var key in $scope.table.lists[$scope.name].list  ) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    for( var dkey in dList) {
                        $scope.table.getColByGuid(guid, name).value[dList[dkey].key] = true;
                    }
                }

                $scope.table.changeColByGuid(guid, name);
            }

            $scope.removeall = function(guid, name) {
                $scope.table.getColByGuid(guid, name).value = {};
                $scope.table.changeColByGuid(guid, name);
            }

            $scope.valueArr = function(guid, name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getColByGuid(guid, name)!= undefined  ) {
                                if( $scope.table.getColByGuid(guid, name).value[n.key] ) 
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
            row:        "=",
            name:       "@",  // col_name
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" ',
                        common_scope,
                        common_ng_hide,
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
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="min-height:250px;min-width:350px;font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.colList(name).list|filter:search"></span>',
                                    '<div class="col-sm-{{colnum}}" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol(row, name).value[tdObj.key]" ng-value="tdObj.key" ',
                                                                        common_scope,
                                                                        common_ng_change,
                                                                        common_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};

            $scope.checkall = function() {
                $scope.table.getCol($scope.row, $scope.name).value = $scope.table.getCol($scope.row, $scope.name).value || {};
                for( var key in $scope.table.colList($scope.name).list  ) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    for( var dkey in dList) {
                        $scope.table.getCol($scope.row, $scope.name).value[dList[dkey].key] = true;
                    }
                }
                $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.removeall = function() {
                $scope.table.getCol($scope.row, $scope.name).value = {};
                $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key in  $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getCol($scope.row, $scope.name)!= undefined  ) {
                                if( $scope.table.getCol($scope.row, $scope.name).value[n.key] ) 
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
            row:        "=", 
            name:       "@",  // col_name
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(row, name)" ',
                            'diag-target="#{{targetid}}" diag-toggle="click" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            common_scope,
                            common_ng_class,
                            common_ng_disabled,
                            common_ng_hide,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(name).keys.guid = row.guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key1 in $scope.table.colList($scope.name).list) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var text = $.map( list3 , function(n) {
                            if( $scope.table.getCol($scope.row, $scope.name)!= undefined ) {
                                if( $scope.table.getCol($scope.row, $scope.name).value[n.key] ) 
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
            name:       "@",  // listName
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag maskable movable class="container" ',
                        common_scope,
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
                            common_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
                        
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
                                                                    '<input type="checkbox" id="{{table.scope}}_{{name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                                                        'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                                                        common_scope,
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

            $scope.checkall = function(guid, name) {
                $scope.table.getColByGuid(guid, name).value = $scope.table.getColByGuid(guid, name).value || {};
                for( var key1 in $scope.table.lists[$scope.name].list  ) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for( var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.getColByGuid(guid, name).value[list3[key3].key] = true;
                        }
                     }
                }
                $scope.table.changeColByGuid(guid, name);
            }

            $scope.removeall = function(guid, name) {
                $scope.table.getColByGuid(guid, name).value = {};
                $scope.table.changeColByGuid(guid, name);
            }

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function(guid, name) {
                var ret_arr = [];
                for(var key1 in $scope.table.lists[$scope.name].list) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
                            if( $scope.table.getColByGuid(guid, name)!= undefined  ) {
                                    if( $scope.table.getColByGuid(guid, name).value[n.key] ) 
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
            row:        "=",
            name:       "@", // col_name
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" ',
                        common_scope,
                        common_ng_hide,
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
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<a class="wliu-btn24 wliu-btn24-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn24 wliu-btn24-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.colList(name).list" ',                        
                        ' ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="min-height:250px;min-width:350px;font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.colList(name).list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<span style="white-space:nowrap;font-weight:700;">{{ rdObj.value }}</span>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="checkbox">',
                                                                    '<input type="checkbox" id="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, row ).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        common_scope,
                                                                        common_ng_change,
                                                                        common_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.listFilter = $scope.listFilter || {};

            $scope.checkall = function() {
                $scope.table.getCol($scope.row, $scope.name).value = $scope.table.getCol($scope.row, $scope.name).value || {};
                for(var key1 in $scope.table.colList($scope.name).list) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.getCol($scope.row, $scope.name).value[list3[key3].key] = true;
                        }
                     }
                }
                $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.removeall = function() {
                $scope.table.getCol($scope.row, $scope.name).value = {};
                $scope.table.changeCol($scope.row, $scope.name);
            }

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key1 in $scope.table.colList($scope.name).list) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
                            if( $scope.table.getCol($scope.row, $scope.name)!= undefined  ) {
                                    if( $scope.table.getCol($scope.row, $scope.name).value[n.key] ) 
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
            row:        "=",
            name:       "@",
            colnum:     "@",
            tooltip:    "@"
        },
        template: [
                    '<div ',
                        common_scope,
                        common_ng_class,
                        common_ng_hide,
                        common_tooltip,
                    '>',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[table.colMeta(name).list].list">',
                                '<span class="radio">',
                                        '<input type="radio" id="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(row, name).value" ng-value="rdObj.key"  ',
                                            common_scope,
                                            common_ng_change,
                                            common_ng_disabled,
                                        '/>',
                                        '<label scope="{{ table.scope }}" for="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
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
            row:        "=",
            name:       "@",  // col_name
            targetid:   "@",
            tooltip:    "@"
        },
        template: [     '<input  type="text" readonly class="wliuCommon-radiolist" value="{{ valueText() }}" ',
                                'ng-click="change(row, name)" ',
                                'diag-target="#{{targetid}}" diag-toggle="click" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                common_scope,
                                common_ng_class,
                                common_ng_disabled,
                                common_ng_hide,
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(name).keys.guid = row.guid;
                $scope.table.colList(name).keys.name = name;
            }

            $scope.valueText = function() {
               var val =  $scope.table.getCol($scope.row, $scope.name)?$scope.table.getCol($scope.row, $scope.name).value:"";
               var valText = FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val})?FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} ).value:"";
               return valText;
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
            name:       "@",  // listName
            targetid:   "@",
            colnum:     "@",
            bar:        "@", 
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable ',
                        common_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText(table.lists[name].keys.guid, table.lists[name].keys.name) }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="radio">',
                                        '<input type="radio" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name).value" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                            'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                            common_scope,
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
                var val =  $scope.table.getColByGuid(guid, name)?$scope.table.getColByGuid(guid, name).value:"";
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

wliu_table.directive("table.radiolist1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            row:        "=",
            name:       "@", // col_name
            colnum:     "@",
            bar:        "@", 
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px; padding:2px; overflow-y:auto;text-align:left; min-width:240px;" ',
                        common_scope,
                        common_ng_hide,
                    '>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText() }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.colList(name).list|filter:search">',
                                '<span class="radio">',
                                        '<input type="radio" name="{{table.scope}}_{{name}}_{{row}}" id="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" ',
                                            'ng-model="table.getCol(row, name).value" ng-value="rdObj.key"  ',
                                            common_scope,
                                            common_ng_change,
                                            common_ng_disabled,
                                        '/>',
                                        '<label for="{{table.scope}}_{{name}}_{{row}}_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
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
                var val =  $scope.table.getCol($scope.row, $scope.name)?$scope.table.getCol($scope.row, $scope.name).value:"";
                var valueText = $scope.table.FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} )?$scope.table.FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} ).value:"";
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
            row:        "=",
            name:       "@", // col_name
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                        '<input type="text" readonly class="wliuCommon-radiolist" value="{{ valueText() }}" ',
                                'ng-click="change(row, name)" ',
                                'diag-target="#{{targetid}}" diag-toggle="click" ',

                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                common_scope,
                                common_ng_class,
                                common_ng_disabled,
                                common_ng_hide,
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(name).keys.guid = row.guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var text = $.map(dList , function(n) {
                        if($scope.table.getCol($scope.row, $scope.name)!=undefined) {
                            if($scope.table.getCol($scope.row, $scope.name).value == n.key) 
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
            name:       "@",  //listName
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable class="container" ',
                        common_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.guid, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
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
                                                                    '<input type="radio" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColByGuid( table.lists[name].keys.guid, table.lists[name].keys.name).value" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                                                        'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                                                        common_scope,
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

            $scope.valueArr = function(guid, name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getColByGuid(guid, name)!= undefined  ) {
                                if( $scope.table.getColByGuid(guid, name).value == n.key ) 
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
            row:        "=",
            name:       "@",  // col_name
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;"',
                        common_scope,
                        common_ng_hide,
                    '>',
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
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="rdObj in table.colList(name).list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="radio">',
                                                                    '<input type="radio" name="{{table.scope}}_{{name}}_{{row}}" id="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, row ).value" ng-value="tdObj.key"  ',
                                                                        common_scope,
                                                                        common_ng_change,
                                                                        common_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var valueArr = $.map(dList , function(n) {
                        if( $scope.table.getCol($scope.row, $scope.name)!= undefined  ) {
                                if( $scope.table.getCol($scope.row, $scope.name).value == n.key ) 
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
            row:        "=",
            name:       "@", // col_name
            targetid:   "@",
            tooltip:    "@"
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-radiolist" value="{{ valueText() }}" ',
                            'ng-click="change(row, name)" ',
                            'diag-target="#{{targetid}}" diag-toggle="click" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{tooltip?\'\':table.getCol(row, name).errorCode?table.getCol(row, name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            common_scope,
                            common_ng_class,
                            common_ng_disabled,
                            common_ng_hide,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(row, name) {
                $scope.table.colList(name).keys.guid = row.guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    for(var pkey in dList) {
                        var pList = dList[pkey].list;
                        var text = $.map( pList , function(n) {
                            if( $scope.table.getCol($scope.row, $scope.name)!=undefined ) {
                                if($scope.table.getCol($scope.row, $scope.name).value==n.key) 
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
            name:       "@",  // listName
            targetid:   "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable class="container" ',
                        common_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn24-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title">Selected Items</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '<li ng-repeat="vObj in valueArr(table.lists[name].keys.guid, table.lists[name].keys.name)">',
                                    '{{ vObj.value }}',
                                    '</li>',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
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
                                                                    '<input type="radio" name="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}" id="{{table.scope}}_{{name}}_{{table.lists[name].keys.name}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name).value" ng-value="tdObj.key"  ',
                                                                        'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                                                        'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                                                        common_scope,
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

            $scope.valueArr = function(guid, name) {
                var ret_arr = [];
                for(var key in $scope.table.lists[$scope.name].list) {
                    var dList = $scope.table.lists[$scope.name].list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getColByGuid(guid, name)!= undefined  ) {
                                if( $scope.table.getColByGuid(guid, name).value == n.key ) 
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
            row:        "=",
            name:       "@", // col_name
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" ',
                        common_scope,
                        common_ng_hide,
                    '>',
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
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            common_ng_options,
                        '/>',
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.colList(name).list" ',                        
                        'ng-show="bar==1">',
                        '<option value=""></option>',
                        '</select>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                            '<span style="display:none;" ng-repeat-start="bbObj in table.colList(name).list|filter:getListFilter()"></span>',
                            '<span style="display:none;" ng-repeat-start="rdObj in bbObj.list|filter:search"></span>',
                                    '<div class="col-md-{{colnum}} col-sm-{{colnum}} col-xs-12" ng-if="rdObj.list && rdObj.list.length>0">',
                                        '<ul>',
                                            '<li title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                                '<b>{{ rdObj.value }}</b>',
                                                '<ul style="border-top:1px solid #cccccc;">',
                                                        '<span ng-repeat="tdObj in rdObj.list|filter:search">',
                                                            '<span class="radio">',
                                                                    '<input type="radio" name="{{table.scope}}_{{name}}_{{row}}" id="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" ',
                                                                        'ng-model="table.getCol( name, row ).value" ng-value="tdObj.key"  ',
                                                                        common_scope,
                                                                        common_ng_change,
                                                                        common_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_{{row}}_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.listFilter = $scope.listFilter || {};

            $scope.getListFilter = function() {
                $scope.listFilter.key = $scope.listFilter.key?$scope.listFilter.key:""; 
                return $scope.listFilter;
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var valueArr = $.map(dList , function(n) {
                        if( $scope.table.getCol($scope.row, $scope.name)!= undefined  ) {
                                if( $scope.table.getCol($scope.row, $scope.name).value == n.key ) 
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
            row:        "=",
            actname:    "@"
        },
        template: [
                    '<div class="dropdown" style="white-space:nowrap;">',
                        '<button type="button" data-toggle="dropdown" ',
                            'style="font-size:0.8em;" ',
                            'ng-class="{\'btn-info\': table.getRow(row).rowstate==0, \'btn-warning\': table.getRow(row).rowstate!=0}" ',
                            common_scope,
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
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn-outline-primary waves-effect" ',
                            'ng-click="navRecord()" ',
                            'ng-if="table.navRightState()"',
                        '>',
                            '{{actname?actname:name}}',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.navRecord = function() {
                // add you code here 
                $scope.table.navRight();
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
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<button class="btn btn-outline-primary waves-effect" ',
                            'ng-click="navRecord()" ',
                            'ng-if="table.navLeftState()"',
                        '>',
                            '{{actname}}',
                        '</button>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.navRecord = function() {
                // add you code here 
                $scope.table.navLeft();
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
            row:        "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<a href="javascript:void(0);" class="wliuCommon-table-btn16" ',
                            'ng-click="action1(table.getRow(row))" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                             common_scope,
                        '>',
                            '<i class="wliu-btn16 wliu-btn16-{{name}}"></i> ',
                            '<span style="vertical-align:middle;">{{actname}}</span>',
                        '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.action1 = function(theRow) {
                // add you code here 
                switch( $scope.name.toLowerCase() ) {
                    case "detail":
                        $scope.table.current = theRow.guid;
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
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
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
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" ',
                            'style="min-width:60px;" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'ng-click="action1()" ',
                            common_scope,
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
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
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
            row:        "=",
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
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" ',
                            'style="min-width:60px;" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'ng-disabled="!buttonState(name, table.getRow(row).rowstate)" ',
                            'ng-click="action1(table.getRow(row))" ',
                            'title="{{ table.getRow(row).error.errorCode ? table.getRow(row).error.errorMessage : \'\' }}" ',
                            common_scope,
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
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
                                }
                        }
                        break;
                }                
                //
                $scope.action();
                $scope.after();
            };

            $scope.buttonState = function(name, row) {
                var right = $scope.table.rights?(parseInt($scope.table.rights[name])?true:false):false;
                return  row>=0 && right;
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
            row:        "=",
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
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" ',
                            'style="min-width:60px;" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'ng-click="action1(table.getRow(row))" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',
                            'title="{{ table.getRow(row).error.errorCode ? table.getRow(row).error.errorMessage : \'\' }}" ',
                            common_scope,
                        '>',
                            '<span ng-if="icon==1" style="vertical-align:middle;">',
                                '<i class="wliu-btn16 wliu-btn16-rowstate-error"    ng-if="table.getRow(row).error.errorCode" ',
                                    'title="{{ table.getRow(row).error.errorCode ? table.getRow(row).error.errorMessage : \'\' }}"',
                                '></i> ',
                                '<i class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="table.getRow(row).error.errorCode==0 && table.getRow(row).rowstate==1" title="Changed"></i> ',
                                '<i class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="table.getRow(row).error.errorCode==0 && table.getRow(row).rowstate==2" title="New"></i> ',
                                '<i class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="table.getRow(row).error.errorCode==0 && table.getRow(row).rowstate==3" tilte="Deleted"></i> ',
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
                        $scope.table.current = theRow.guid;
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
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
                                }
                        }
                        break;
                    case "reset":
                        $scope.table.resetRow(theRow);
                        // ckeditor  reset value to old value;  due to single way sync 
                        for(var cidx in $scope.table.cols) {
                            if( $scope.table.cols[cidx].coltype.toLowerCase() == "ckeditor" )
                                if(CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name]) {
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
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
            row:        "=",
            xsize:      "@",
            name:       "@",
            actname:    "@",
            action:     "&",
            tooltip:    "@"
        },
        template: [
                    '<span>',
                        '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-{{name}}" ',
                            'ng-click="action1(table.getRow(row))" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{actname?actname:name}}" popup-placement="down" ',
                            'title="{{tooltip?\'\':actname?actname:name}}" ',
                            common_scope,
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
                        $scope.table.current = theRow.guid;
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
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
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
            row:        "=",
            name:       "@",
            actname:    "@",
            action:     "&"
        },
        template: [
                    '<span>',
                        '<a href="javascript:void(0)" class="wliu-table-button" ',
                            'title="{{actname?actname:name}}" ',
                            'ng-click="action1(table.getRow(row))" ',
                            'ng-if="buttonState(name, table.getRow(row).rowstate)" ',   
                            common_scope, 
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
                        $scope.table.current = theRow.guid;
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
                                    CKEDITOR.instances[$scope.table.scope + "_" + $scope.table.cols[cidx].name].setData( $scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value?$scope.table.getCol($scope.table.cols[cidx].name, $scope.row).value:"" );
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
                        '<button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ',
                             'style="font-size:0.8em;" ',
                             'ng-class="{\'btn-info\':  rowstate()==0, \'btn-warning\':  rowstate()!=0}" ',
                             common_scope,
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
                    '<span>',
                        '<a href="javascript:void(0);" class="wliuCommon-table-btn16" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'ng-click="action1()" ',
                            'ng-if="buttonState(name, rowstate())" ',
                            common_scope,
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
                        '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-{{name}}" ',
                            'ng-click="action1()" ',
                            'ng-if="buttonState(name, rowstate())" ',
                            'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{actname?actname:name}}" popup-placement="down" ',
                            'title="{{tooltip?\'\':actname?actname:name}}" ',
                            common_scope,
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
                        '<a href="javascript:void(0)" class="wliu-table-hbutton" ',
                                'title="{{ actname?actname:name }}" ',
                                'ng-click="action1()" ',
                                'ng-if="buttonState(name, rowstate())" ',  
                                common_scope,                   
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