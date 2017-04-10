var form_scope          = 'scope="{{ table.scope }}" ';
var form_ng_hide        = 'ng-hide="table.relationHideCurrent(name)" ';
var form_ng_change      = 'ng-change="table.changeColCurrent(name)" ';
var form_ng_class       = 'ng-class="{ \'wliuCommon-input-invalid\': table.getColCurrent(name).errorCode }" '; 
var form_ng_disabled    = 'ng-disabled="table.getColCurrent(name)==undefined" '; 
var form_ng_options     = 'ng-model-options="{ updateOn:\'default blur\', debounce:{default: 500, blur:0} }" ';
var form_ng =     [
                        form_scope,
                        form_ng_change,
                        form_ng_class,
                        form_ng_disabled,
                        form_ng_hide,
                        form_ng_options
                    ].join('');

var form_tooltip = [  
                        'popup-target="{{table.colMeta(name).tooltip?\'#\'+table.colMeta(name).tooltip:\'\'}}" ',
                        'popup-toggle="hover" ',
                        'popup-placement="down" ',
                        'popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                        'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" '
                     ].join('');

wliu_table.directive("form.rowstatus", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "="
        },
        template: [
                    '<span class="wliu-text" style="vertical-align:middle;padding:0px;" ',
                        //'title="{{ table.tooltip?\'\':(table.getCurrent().error.errorCode ? table.getCurrent().error.errorMessage:\'\') }}"',
                        'popup-target="#table_rowno_tooltip" ',
                        'popup-toggle="hover" popup-placement="down" ',
                        'popup-body="{{ table.getCurrent().error.errorCode?table.getCurrent().error.errorMessage.nl2br():\'\' }}" ',
                        form_scope,
                        form_ng_disabled,
                    '>',
                        /*
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error"    ng-if="table.getCurrent().error.errorCode" ',
                            'title="{{ table.tooltip?\'\':(table.getCurrent().error.errorCode? table.getCurrent().error.errorMessage : \'\') }}"',
                        '>',
                        */
                        '<span ng-if="table.getCurrent()==undefined" style="color:red;vertical-align:middle;">No record found!</span>',
                        '<span ng-if="table.getCurrent().error.errorCode" style="color:red;vertical-align:middle;font-size:16px;">Error : </span>',
                        '<a class="wliu-btn16 wliu-btn16-error-help" ',
                            'ng-if="table.getCurrent().error.errorCode" ',
                            'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-placement="down" ',
                            'popup-body="{{table.getCurrent().error.errorCode?table.getCurrent().error.errorMessage.nl2br():\'\'}}" ',
                            //'title="{{ table.tooltip?\'\':(table.getCurrent().error.errorCode? table.getCurrent().error.errorMessage : \'\') }}"',
                        '>',
                        '</a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-save"     ng-if="table.getCurrent().error.errorCode==0 && table.getCurrent().rowstate==1" style="padding-left:20px;vertical-align:middle;font-size:14px;" title="Changed"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-add"      ng-if="table.getCurrent().error.errorCode==0 && table.getCurrent().rowstate==2" style="padding-left:20px;vertical-align:middle;font-size:14px;" title="New"></a>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-delete"   ng-if="table.getCurrent().error.errorCode==0 && table.getCurrent().rowstate==3" style="padding-left:20px;vertical-align:middle;font-size:14px;" title="Deleted"></a>',
                        //'<div style="margin-top:12px;" ng-bind-html="getHTML()"></div>',
                    '</span>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.table.error_tooltip = "table_rowno_tooltip";
            $scope.getHTML = function() {
                if($scopt.table.getCurrent() )
                    if($scopt.table.getCurrent().error.errorCode )
                        return $sce.trustAsHtml($scopt.table.getCurrent().error.errorMessage.nl2br());
                    else 
                        return $sce.trustAsHtml("");
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

wliu_table.directive("form.ckeditor", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            hh:         "@"
        },
        template: [
                    '<span ',
                        form_ng_hide,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error" ng-if="table.getColCurrent(name).errorCode"></a>',
                        '<span style="color:red; vertical-align:middle;" ng-if="table.getColCurrent(name).errorCode">Error: {{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:""}}</span>',
                        '<textarea id="{{table.scope}}_{{name}}" ',
                                  'ng-model="table.getColCurrent(name).value" ',
                                  'title="{{ table.getCurrent().error.errorCode ? table.getCurrent().error.errorMessage : \'\' }}" ',
                                  form_scope,
                        '>',
                        '</textarea>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            //  model change ,  it will not sync to ckeditor
            //  only sync to ckeditor when initialize the model.
            //$scope.initLoad = true;
            //$scope.changeByCK = false;
            $scope.modelChange = function() {
                //if($scope.changeByCK) return;
                if( $scope.table.getColCurrent($scope.name) )  {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name])
                        if( $scope.table.getColCurrent($scope.name).value != CKEDITOR.instances[$scope.table.scope+"_"+$scope.name].getData() )
                            CKEDITOR.instances[$scope.table.scope+"_"+$scope.name].setData( $scope.table.getColCurrent($scope.name).value );
                }  else {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name])
                        CKEDITOR.instances[$scope.table.scope+"_"+$scope.name].setData("");
                }
            }
            $scope.$watch("table.getColCurrent(name).value", $scope.modelChange);
        },
        link: function (sc, el, attr) {
            $(function(){
                htmlObj_cn = CKEDITOR.replace(sc.table.scope + "_" + sc.name,{height:sc.hh});
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj_cn.on('change', function (evt) {
                    //sc.changeByCK = true;
                    if( !sc.$root.$$phase ) {  // very important 
                        //if(sc.initLoad) {
                        //    sc.initLoad=false;
                        //    return;
                        //} 

                        if( sc.table.getColCurrent(sc.name) ) {
                            if( sc.table.getColCurrent(sc.name).value != CKEDITOR.instances[sc.table.scope+"_"+sc.name].getData() ) {
                                sc.table.getColCurrent(sc.name).value = CKEDITOR.instances[sc.table.scope+"_"+sc.name].getData();
                                sc.table.changeColCurrent(sc.name);
                                // to prevent diggest in progress in angular.
                                sc.$apply();
                            }
                        }
                    }
                    //sc.changeByCK = false;
                });
            });
        }
    }
});

wliu_table.directive("form.ckinline", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            hh:         "@",
            minhh:      "@"
        },
        template: [
                    '<span ',
                        form_ng_hide,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-rowstate-error" ng-if="table.getColCurrent(name).errorCode"></a>',
                        '<span style="color:red; vertical-align:middle;" ng-if="table.getColCurrent(name).errorCode">Error: {{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:""}}</span>',
                        '<input type="hidden" ng-model="table.getColCurrent(name).value" />',
                        '<div scope="{{ table.scope }}" id="{{table.scope}}_{{name}}" contentEditable=true style="display:block;overflow:auto;min-height:{{minhh}}px;height:{{hh}}px;border:1px solid #cccccc;">',
                        '{{table.getColCurrent(name).value}}',
                        '</div>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.minhh = $scope.minhh?$scope.minhh:"80";

            //  model change ,  it will not sync to ckeditor
            //  only sync to ckeditor when initialize the model.
            $scope.initLoad = true;
            $scope.changeByCK = false;
            $scope.modelChange = function() {
                if($scope.changeByCK) return;
                if( $scope.table.getColCurrent($scope.name) )  {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name])
                        if( $scope.table.getColCurrent($scope.name).value != CKEDITOR.instances[$scope.table.scope+"_"+$scope.name].getData() )
                            CKEDITOR.instances[$scope.table.scope+"_"+$scope.name].setData( $scope.table.getColCurrent($scope.name).value );
                }  else {
                    if(CKEDITOR.instances[$scope.table.scope+"_"+$scope.name])
                        CKEDITOR.instances[$scope.table.scope+"_"+$scope.name].setData("");
                }
            }
            $scope.$watch("table.getColCurrent(name).value", $scope.modelChange);
        },
        link: function (sc, el, attr) {
            $(function(){
                CKEDITOR.disableAutoInline = true;
                htmlObj_cn = CKEDITOR.inline(sc.table.scope + "_" + sc.name);
                // The "change" event is fired whenever a change is made in the editor.
                htmlObj_cn.on('change', function (evt) {
                    sc.changeByCK = true;
                    if( !sc.$root.$$phase ) {   // very important 
                        if(sc.initLoad) {
                            sc.initLoad=false;
                            return;
                        } 
                        if( sc.table.getColCurrent(sc.name) ) {
                            if( sc.table.getColCurrent(sc.name).value != CKEDITOR.instances[sc.table.scope+"_"+sc.name].getData() ) {
                                sc.table.getColCurrent(sc.name).value = CKEDITOR.instances[sc.table.scope+"_"+sc.name].getData();
                                sc.table.changeColCurrent(sc.name);
                                // to prevent diggest in progress in angular.
                                sc.$apply();
                            }
                        }
                    }
                    sc.changeByCK = false;
                });
            });
        }
    }
});


wliu_table.directive("form.fileupload", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:          "=",
            name:           "@",
            icon:           "@",
            actname:        "@",
            filename:       "@"
        },
        template: [
                    '<div style="display:inline-block;">',
                        '<i ng-if="icon" class="wliu-btn24 wliu-btn24-file-upload" style="overflow:hidden;" ',
                            //'title="{{table.colMeta(name).tooltip?\'\':\'upload File\'}}" ',
                            'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Upload File" popup-placement="down" ',
                        '>',
                                '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                        'onchange="angular.element(this).scope().selectFile(event);" ',
                                        form_ng_disabled,
                                '>',
                        '</i>',
                        '<div ng-if="!icon" class="btn btn-info" style="display:inline-block;position:relative;text-transform:none;overflow:hidden;height:20px;line-height:20px;padding:2px 8px;">',
                            '<a class="wliu-btn16 wliu-btn16-upload"></a>',
                            '<input type="file" onchange="angular.element(this).scope().selectFile(event);" style="display:block; position:absolute; opacity:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." />',
                            ' {{actname}}',
                        '</div>',
                        '<div style="display:inline-block;position:relative;margin-left:5px;font-size:12px;font-weight:bold;color:red;" ng-if="table.getColCurrent(name).errorCode">{{table.getColCurrent(name).errorMessage}}</div>',
                        '<div style="display:inline-block;margin-left:5px;" ng-if="table.getColCurrent(name).value && !table.getColCurrent(name).errorCode">',
                            '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteFile()" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'Delete File\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Delete File" popup-placement="down" ',
                            '>',
                            '<a href="javascript:void(0)" style="vertical-align:middle;margin-left:2px;font-size:12px;text-decoration:underline;" ng-click="downloadFile()">{{theFile.full_name.subName(12)?theFile.full_name.subName(12):filename}}</a>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.error_tooltip = "table_rowno_tooltip";

            $scope.theFile = new WLIU.FILE();
            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                FFILE.allowSize = $scope.table.colMeta($scope.name).maxlength>0 &&$scope.table.colMeta($scope.name).maxlength<=GCONFIG.max_upload_size?$scope.table.colMeta($scope.name).maxlength:GCONFIG.max_upload_size;
                FFILE.allowType = $scope.table.colMeta($scope.name).allowtype?$scope.table.colMeta($scope.name).allowtype:GCONFIG.file_allow_type;
                FFILE.fromFile($scope.theFile, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.table.getColCurrent($scope.name).value = fObj.data?fObj.data:"";
                        $scope.table.changeColCurrent($scope.name);
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
            $scope.deleteFile = function() {
                 $scope.table.getColCurrent($scope.name).value = "";
                 $scope.table.changeColCurrent($scope.name);
            }
            $scope.downloadFile = function() {
                if(  $scope.table.getColCurrent($scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getColCurrent($scope.name).value);
                }
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

wliu_table.directive("form.imgupload", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:          "=",
            name:           "@",
            actname:        "@",

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
                        '<div style="position:relative;font-size:16px;font-weight:bold;color:red;" ng-if="table.getColCurrent(name).errorCode">{{table.getColCurrent(name).errorMessage}}</div>',
                        '<div style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;border:1px solid #cccccc;" class="wliu-background-1" >',
                            '<i class="wliu-btn24 wliu-btn24-image" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8; overflow:hidden;" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'upload Image\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Upload Image" popup-placement="down" ',
                            '>',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" ',
                                            form_ng_disabled,
                                            '>',
                            '</i>',
                            '<a class="wliu-btn24 wliu-btn24-img-print" ng-click="printImage()" ng-if="table.getColCurrent(name).value" style="position:absolute; margin-top:3px;margin-left:30px;opacity:0.8;" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'Print Image\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Print Image" popup-placement="down" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-dispose" ng-click="deleteImage()" ng-if="table.getColCurrent(name).value" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'Delete Image\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Delete Image" popup-placement="down" ',
                            '>',
                            '</a>',
                            '<span style="position:absolute;top:32px;left:3px;font-size:16px;font-weight:bold;color:#666666;" ng-if="!table.getColCurrent(name).value && !table.getColCurrent(name).errorCode">{{actname}}</span>',
                            '<div style="display:table;">',
                            '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;" class="img-content" targetid="{{imgviewerid}}">',
                                '<img class="img-responsive" width="100%" ng-click="clickImage()" onload="imageAutoFix(this)" ww={{ww}} hh={{hh}} src="{{table.getColCurrent(name).value?table.getColCurrent(name).value:\'\'}}" />',
                            '</div>',
                            '<div>',
                            '<input type="hidden" ',
                                'ng-model="table.getColCurrent(name).value" ',
                                form_scope,
                                form_ng_disabled,
                                form_ng_change,
                            '/>',
                        '</div>',

                        '<div id="{{imgviewerid}}" ng-if="view" wliu-diag maskable fade form-diag disposable>',
                            '<div wliu-diag-body style="text-align:center;">',
                                    '<img class="img-responsive" width="100%" ww="{{vw}}" hh="{{vh}}" src="{{ imgobj.resize[view].data?imgobj.resize[view].data:\'\' }}" />',
                            '</div>',
                        '</div>',
                        
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.error_tooltip = "table_rowno_tooltip";

            $scope.imgobj       = new WLIU.IMAGE({guid: guid()});
            $scope.imgviewerid  = $scope.table.scope + "_" + $scope.name + "_" + $scope.imgobj.guid;
            $scope.imgviewer    = "#" + $scope.imgviewerid; 
            $scope.minww        = $scope.minww?$scope.minww:"100";
            $scope.minhh        = $scope.minhh?$scope.minhh:"80";
            $scope.vw           = $scope.vw?$scope.vw:"400";
            //$scope.vh         = $scope.vh?$scope.vh:"400";
            //$scope.view        = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";

            $scope.printImage = function() {
                if(  $scope.table.getColCurrent($scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getColCurrent($scope.name).value);
                }
            }

            $scope.clickImage = function() {
                if($scope.view) {
                    if( $scope.table.getColCurrent($scope.name).value ) {
                        $scope.imgobj.resize.origin.data = $scope.table.getColCurrent($scope.name).value;
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
                 $scope.table.getColCurrent($scope.name).value = "";
                 $scope.table.changeColCurrent($scope.name);
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
                        $scope.table.getColCurrent($scope.name).value = $scope.imgobj.resize[view].data?$scope.imgobj.resize[view].data:"";
                        $scope.table.changeColCurrent($scope.name);
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                if( $("#" + sc.table.error_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.table.error_tooltip + '" wliu-popup></div>');
                    $("#" + sc.table.error_tooltip).wliuPopup();
                }
            
                // remove all image editor dialog which record has bee disposed.
                $("body > div[form-diag][disposable]").each(function(img_idx, img_viewer) {
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
                                click_flag = false;
                                $(sc.imgviewer).trigger("show");
                            }
                    });

                });
                /*********************************************************/
                    
            });
        }
    }
});

wliu_table.directive("form.imgupload1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:          "=",
            name:           "@",
            actname:        "@",

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
                        '<div style="position:relative;font-size:16px;font-weight:bold;color:red;" ng-if="table.getColCurrent(name).errorCode">{{table.getColCurrent(name).errorMessage}}</div>',
                        '<div style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;border:1px solid #cccccc;"  class="wliu-background-1">',
                            '<i class="wliu-btn24 wliu-btn24-image" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8; overflow:hidden;" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'upload Image\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Upload Image" popup-placement="down" ',
                            '>',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" ',
                                            form_ng_disabled,
                                    '/>',
                            '</i>',
                            '<a class="wliu-btn24 wliu-btn24-img-print" ng-click="printImage()" ng-if="table.getColCurrent(name).value" style="position:absolute; margin-top:3px;margin-left:30px;opacity:0.8;" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'Print Image\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Print Image" popup-placement="down" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn24 wliu-btn24-dispose" ng-click="deleteImage()" ng-if="table.getColCurrent(name).value" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':\'Delete Image\'}}" ',
                                'popup-target="#table_rowno_tooltip" popup-toggle="hover" popup-body="Delete Image" popup-placement="down" ',
                            '>',
                            '</a>',
                            '<span style="position:absolute;top:32px;left:3px;font-size:16px;font-weight:bold;color:#666666;" ng-if="!table.getColCurrent(name).value && !table.getColCurrent(name).errorCode">{{actname}}</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;" class="img-content" targetid="{{imgeditorid}}">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage()" onload="imageAutoFix(this)" ww={{ww}} hh="{{hh}}" style="cursor:pointer;" src="{{table.getColCurrent(name).value?table.getColCurrent(name).value:\'\'}}" />',
                                '</div>',
                            '</div>',
                            '<input type="hidden" title="" ',
                                'ng-model="table.getColCurrent(name).value" ',
                                form_scope,
                                form_ng_change,
                                form_ng_disabled,
                            '/>',
                        '</div>',
                
                        '<div id="{{imgeditorid}}" wliu-diag movable maskable fade form-diag disposable>',
                            '<div wliu-diag-head>Image Editor</div>',
                            '<div wliu-diag-body>',
                                
                                '<div ng-if="imgobj.errorCode">',
                                    '{{imgobj.errorMessage}}',
                                '</div>',
                                '<div ng-if="!imgobj.errorCode">',
                                    '<div style="min-height:300px;">',
                                        '<div class="wliu-image-frame" style="position:relative;">',
                                            '<img class="img-responsive" width="100%" ww="{{vw}}" hh="{{vh}}" src="{{ imgobj.resize[view].data?imgobj.resize[view].data:\'\' }}" />',
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
            $scope.table.error_tooltip = "table_rowno_tooltip";

            $scope.imgobj       = new WLIU.IMAGE({guid: guid()});
            $scope.imgeditorid  = $scope.table.scope + "_" + $scope.name + "_" + $scope.imgobj.guid;
            $scope.imgeditor    = "#" + $scope.imgeditorid; 
            $scope.minww    = $scope.minww?$scope.minww:"120";
            $scope.minhh    = $scope.minhh?$scope.minhh:"80";
            $scope.vw       = $scope.vw?$scope.vw:"400";
            //$scope.vh       = $scope.vh?$scope.vh:"400";
            $scope.view     = $scope.table.colMeta($scope.name).view?$scope.table.colMeta($scope.name).view:"medium";
            

            $scope.clickImage = function() {
                if( !$scope.imgobj.resize.origin.data ) {
                    $scope.imgobj.resize.origin.data = $scope.table.getColCurrent($scope.name).value;
                    FIMAGE.setView($scope.view);  // important to make ng-model data sync with the callback
                    FIMAGE.resizeAll($scope.imgobj, function(){
                        $($scope.imgeditor).trigger("ishow");
                        $scope.$apply();  // async must apply
                    });
                } else {
                    $($scope.imgeditor).trigger("ishow");
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", $scope.imgeditor) );
                }
            }

            $scope.printImage = function() {
                if(  $scope.table.getColCurrent($scope.name).value ) {
                    FFILE.exportDataURL($scope.table.getColCurrent($scope.name).value);
                }
            }
            
            $scope.deleteImage = function() {
                 $scope.table.getColCurrent($scope.name).value = "";
                 $scope.table.changeColCurrent($scope.name);
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
                        $scope.table.getColCurrent($scope.name).value = $scope.imgobj.resize[view].data?$scope.imgobj.resize[view].data:"";
                        $scope.table.changeColCurrent($scope.name);
                        $scope.$apply();  // important: it is async to read image in callback
                        $($scope.imgeditor).trigger("ishow");
                    }
                });
            }


            /****************************************************** */
            $scope.rotate = function() {
                FIMAGE.rotate($scope.imgobj, function(oImg){
                    $scope.$apply();
                    $($scope.imgeditor).trigger("ishow");
                });
            }

            $scope.crop = function() {
                FIMAGE.cropDiv($scope.imgobj, $("div.wliu-image-frame", $scope.imgeditor), $("div.wliu-image-crop", $scope.imgeditor), function(oImg){
                    $scope.$apply();
                    $($scope.imgeditor).trigger("ishow");
                });
            }

            $scope.reset = function() {
                FIMAGE.cropReset($scope.imgobj, function(oImg){
                    $scope.$apply();
                    $($scope.imgeditor).trigger("ishow");
                });
            }

            $scope.save = function() {
                if($scope.imgobj.resize.origin.data!="") {
					$scope.table.setImageCurrent($scope.name, $scope.imgobj);
                    $scope.table.changeColCurrent($scope.name);
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
                if( $("#" + sc.table.error_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.table.error_tooltip + '" wliu-popup></div>');
                    $("#" + sc.table.error_tooltip).wliuPopup();
                }

                var ratio = 0;
                if( sc.ww && sc.hh ) {
                    var ratio = parseInt(sc.ww)/parseInt(sc.hh);
                } 

                // remove all image editor dialog which record has bee disposed.
                $("body > div[form-diag][disposable]").each(function(img_idx, img_editor) {
                    if( $("div.img-content[targetid='" + $(img_editor).attr("id") + "']").length<=0 ) $(img_editor).remove();
                });

                $("body>" + sc.imgeditor).remove();
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

wliu_table.directive("form.esign", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            subject:    "@",
            firstname:  "@",
            lastname:   "@",
            ww:         "@",
            hh:         "@",
            minww:      "@",
            minhh:      "@"
        },
        template: [
                    '<span>',
                        '<span style="font-size:16px;font-weight:bold;color:red;" ng-if="table.getColCurrent(name).errorCode">{{table.getColCurrent(name).errorMessage}}</span>',
                        '<br ng-if="table.getColCurrent(name).errorCode">',
                        '<div ng-click="showEsign()" style="display:inline-block;position:relative;min-width:{{minww}}px;min-height:{{minhh}}px;border:1px solid #cccccc;" class="wliu-background-11" >',
                            '<div style="display:table;">',
                            '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{minww}}px;height:{{minhh}}px;" class="esign-content" targetid="{{esignDivid}}">',
                                '<img class="img-responsive" width="100%" onload="imageAutoFix(this)" ww={{minww}} hh={{minhh}} src="{{table.getColCurrent(name).value?table.getColCurrent(name).value:\'\'}}" />',
                            '</div>',
                            '<input type="hidden" ',
                                'ng-model="table.getColCurrent(name).value" ',
                                form_scope,
                                form_ng_change,
                                form_ng_disabled,
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
                                    '<button ng-click="cancel()" title="Be careful. clear signature" class="btn btn-lg btn-outline-danger waves-effect" ',
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
                FIMAGE.image2Canvas($scope.esign_canvas.ctx, $scope.table.getColCurrent($scope.name).value);
                $($scope.esignDiv).trigger("show");
            }

            $scope.save  = function() {
                if( $scope.esign_canvas.signed ) {
                    $scope.esign_canvas.subject = $scope.subject;
                    
                    if($scope.table.getColCurrent($scope.firstname) )
                        $scope.esign_canvas.firstName = $scope.table.getColCurrent($scope.firstname).value;
    
                    if($scope.table.getColCurrent($scope.lastname) )
                        $scope.esign_canvas.lastName = $scope.table.getColCurrent($scope.lastname).value;
                    
                    $scope.table.getColCurrent($scope.name).value = $scope.esign_canvas.getDataUrl();
                    $scope.table.changeColCurrent($scope.name);
                    $scope.esign_canvas.clear();  
                }
                $($scope.esignDiv).trigger("hide");
            }
            $scope.cancel = function() {
                $scope.table.getColCurrent($scope.name).value = "";
                $scope.table.changeColCurrent($scope.name);
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


wliu_table.directive("form.label", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<label class="wliuCommon-label" ',
                        'popup-target="{{table.colMeta(name).tooltip?\'#\'+table.colMeta(name).tooltip:\'\'}}" popup-placement="down" popup-toggle="hover" popup-body="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}" ',
                        'title="{{table.colMeta(name).tooltip? \'\':table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}" ',
                        form_scope,
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

wliu_table.directive("form.html", function ($sce) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<span ng-bind-html="getHTML()" ',
                        form_scope,
                        form_ng_hide,
                    '>',
                    '</span>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.getColCurrent($scope.name) )
                    return $sce.trustAsHtml($scope.table.getColCurrent($scope.name).value);
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

wliu_table.directive("form.text", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<span class="wliuCommon-label" ',
                        form_scope,
                        form_ng_hide,
                        form_ng_class,
                        form_tooltip,
                    '>',
                        '{{ table.getColCurrent(name).value }}',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.hidden", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<span>',
                        '<input type="hidden" ',
                            'ng-model="table.getColCurrent(name).value" ',
                            form_scope,
                            form_ng_change,
                            form_ng_disabled,
                        '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        }
    }
});

wliu_table.directive("form.readonly", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            class:      "@"
        },
        template: [
                    '<span>',
                        '<input type="textbox" ng-if="table.getCurrent().rowstate>=2" ',
                            'class="{{class}}" ',
                            'ng-model="table.getColCurrent(name).value" ',
                            form_ng,
                            form_tooltip,
                        '/>',
                        '<span class="wliuCommon-label" ng-if="table.getCurrent().rowstate<2" ',
                            form_scope,
                            form_ng_hide,
                            form_ng_class,
                            form_tooltip,
                        '>',
                            '{{ table.getColCurrent(name).value }}',
                        '</span>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.textbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<input type="textbox" ',
                        'ng-model="table.getColCurrent(name).value" ',
                        form_ng,
                        form_tooltip,
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.password", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<input type="password" placeholder="Password" ',
                        'ng-model="table.getColCurrent(name).value" ',
                        form_ng,
                        form_tooltip,
                    '/>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.passpair", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<span style="display:inline-block;vertical-align:top;" ',
                        form_ng_hide,
                    '>',
                    '<input type="password" style="width:100%;" placeholder="Password" ',
                        'ng-model="table.getColCurrent(name).value.password" ',
                        'ng-change="passChange()" ',
                        form_scope,
                        form_ng_class,
                        form_ng_options,
                        form_ng_disabled,
                        form_tooltip,
                    '/>',
                    '<input type="password" style="width:100%;" placeholder="Confirm Password" ',
                        'ng-class="{ \'wliuCommon-input-invalid\': table.getColCurrent(name).value.password!=table.getColCurrent(name).value.confirm }" ',
                        'ng-model="table.getColCurrent(name).value.confirm" ',
                        'popup-target="{{table.colMeta(name).tooltip?\'#\'+table.colMeta(name).tooltip:\'\'}}" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).value.password!=table.getColCurrent(name).value.confirm ?\'Password not match!\':\'\'}}" ',
                        'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).value.password!=table.getColCurrent(name).value.confirm?\'Password not match!\':\'\'}}" ',
                        form_scope,
                        form_ng_disabled,
                        form_ng_options,
                    '/>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.passChange = function() {
                $scope.table.changeColCurrent($scope.name);
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.textarea", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<textarea ',
                        'ng-model="table.getColCurrent(name).value" ',
                        form_ng,
                        form_tooltip,
                    '>',
                    '</textarea>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.select", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
			    '<select ',
                        'ng-model="table.getColCurrent(name).value" ',
                        'ng-options="sObj.key as sObj.value for sObj in table.colList(name).list" ',                        
                        form_scope,
                        form_ng_class,
                        form_ng_disabled,
                        form_ng_change,
                        form_ng_hide,
                        form_tooltip,
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

wliu_table.directive("form.relation", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            label:      "@"
        },
        template: [
                    '<span class="checkbox" ',
                        form_scope,
                        form_ng_class,
                        form_tooltip,
                    '>',
                            '<input type="checkbox" id="{{table.scope}}_{{name}}_current" ',
                                'ng-model="table.getColCurrent(name).value" ng-value="1"  ',
                                'ng-change="table.relationChange(name); table.changeColCurrent(name);" ',
                                form_scope,
                                form_ng_disabled,
                            '/>',

                            '<label for="{{table.scope}}_{{name}}_current" title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}">',
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

wliu_table.directive("form.bool", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            label:      "@"
        },
        template: [
                    '<span class="checkbox" ',
                        form_scope,
                        form_ng_hide,
                        form_ng_class,
                        form_tooltip,
                    '>',

                            '<input type="checkbox" id="{{table.scope}}_{{name}}_current" ',
                                'ng-model="table.getColCurrent(name).value" ng-value="1"  ',
                                form_scope,
                                form_ng_change,
                                form_ng_disabled,
                            '/>',

                            '<label for="{{table.scope}}_{{name}}_current" title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname?table.colMeta(name).colname:name}}">',
                                //'<abbr title="{{rdObj.desc}}" ng-if="rdObj.desc!=\'\'">{{ rdObj.value }}</abbr>',
                                '{{ label.toLowerCase()=="default"?table.colMeta(name).colname:label?label:"" }}',
                            '</label>',
                            //'<br ng-if="table.getColCurrent(name).errorCode">',
                            //'<span style="color:red;" ng-if="table.getColCurrent(name).errorCode">{{table.getColCurrent(name).errorMessage}}</span>',
                    '</span>',
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.datetime", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<span ',
                        form_ng_hide,
                        form_tooltip,
                    '>',
                        '<input type="textbox" class="wliuCommon-datepicker" placeholder="yyyy-mm-dd" ',
                            'ng-model="table.getColCurrent(name).value.date" ',
                            form_scope,
                            form_ng_class,
                            form_ng_change,
                            form_ng_disabled,
                        '/>',
                        '<input type="textbox" class="wliuCommon-timepicker" placeholder="hh:mm" ',
                            'ng-model="table.getColCurrent(name).value.time" ',
                            form_scope,
                            form_ng_class,
                            form_ng_change,
                            form_ng_disabled,
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

wliu_table.directive("form.date", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-datepicker" placeholder="yyyy-mm-dd" ',
                        'ng-model="table.getColCurrent(name).value" ',
                        form_scope,
                        form_ng_hide,
                        form_ng_class,
                        form_ng_change,
                        form_ng_disabled,
                        form_tooltip,
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
                    selectYears: 100,
                    min: new Date(today.getFullYear()-90,1,1),
                    max: new Date(today.getFullYear()+10,12,31)
                });
            });
        }
    }
});

wliu_table.directive("form.time", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<input type="textbox" class="wliuCommon-timepicker" placeholder="hh:mm" ',
                        'ng-model="table.getColCurrent(name).value" ',
                        form_scope,
                        form_ng_class,
                        form_ng_change,
                        form_ng_disabled,
                        form_ng_hide,
                        form_tooltip,
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

wliu_table.directive("form.intdate", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            table:      "=",
            name:       "@",
            format:     "@"
        },
        template: [
                    '<span class="wliuCommon-label" ',
                        form_ng_hide,
                    '>',
                    '{{ table.getColCurrent(name).value?(table.getColCurrent(name).value>0?(table.getColCurrent(name).value * 1000 | date : (format?format:"yyyy-MM-dd H:mm") ):"") :"" }}',
                    '</span>'
				  ].join(''),
        controller: function ($scope) {
        }
    }
});

wliu_table.directive("form.checkbox", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@"
        },
        template: [
                    '<div class="wliuCommon-label" ',
                        form_scope,
                        form_ng_class,
                        form_ng_hide,
                        form_tooltip,
                    '>',
                        '<span ng-repeat-start="rdObj in table.colList(name).list"></span>',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_current_{{rdObj.key}}" ',
                                            'ng-model="table.getColCurrent(name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            form_scope,
                                            form_ng_change,
                                            form_ng_disabled,
                                        '/>',
                                        '<label for="{{table.scope}}_{{name}}_current_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
                                            '{{ rdObj.value }}',
                                        '</label>',
                                '</span>',
                                '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                        '<span ng-repeat-end></span>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.checkbox1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(name)" ',
                            'diag-target="#{{table.colMeta(name).targetid}}" diag-toggle="click" ',
                            'popup-target="#table_rowno_tooltip" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            //'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            form_scope,
                            form_ng_hide,
                            form_ng_class,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.error_tooltip = "table_rowno_tooltip";

            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList($scope.name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList($scope.name).keys.name = name;
            }
            $scope.valueText = function() {
                    var text = $.map( $scope.table.colList($scope.name).list , function(n) {
                    if( $scope.table.getColCurrent($scope.name)!= undefined ) {
                        if($scope.table.getColCurrent($scope.name).value[n.key]) 
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
            $(function(){
                if( $("#" + sc.table.error_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.table.error_tooltip + '" wliu-popup></div>');
                    $("#" + sc.table.error_tooltip).wliuPopup();
                }
            })
        }
    }
});

wliu_table.directive("form.checktext1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                    '<span class="wliuCommon-label">{{ valueText() }}</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.valueText = function() {
                    var text = $.map( $scope.table.colList($scope.name).list , function(n) {
                    if( $scope.table.getColCurrent($scope.name)!= undefined ) {
                        if($scope.table.getColCurrent($scope.name).value[n.key]) 
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

// exactly same as table.checkdiag1
wliu_table.directive("form.checkdiag1", function () {
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
                        form_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn24 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<a class="wliu-btn16 wliu-btn16-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all"  ng-show="bar==1"></a>',
                        '<a class="wliu-btn16 wliu-btn16-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all"  ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-body" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.lists[name].list|filter:search">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_{{rdObj.key}}" ',
                                            'ng-model="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            'ng-change="table.changeColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)" ',
                                            'ng-disabled="table.getColByGuid(table.lists[name].keys.guid, table.lists[name].keys.name)==undefined" ',
                                            form_scope,
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


wliu_table.directive("form.checklist1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px; padding:2px; overflow-y:auto; overflow:visible; text-align:left; min-width:240px;" ',
                        form_scope,
                        form_ng_class,
                        form_ng_hide,
                        form_tooltip,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" style="z-index:99;" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<a class="wliu-btn16 wliu-btn16-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn16 wliu-btn16-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.colList(name).list|filter:search">',
                                '<span class="checkbox">',
                                        '<input type="checkbox" id="{{table.scope}}_{{name}}_current_{{rdObj.key}}" ',
                                            'ng-model="table.getColCurrent(name).value[rdObj.key]" ng-value="rdObj.key"  ',
                                            form_scope,
                                            form_ng_change,
                                            form_ng_disabled,
                                        '/>',
                                        '<label for="{{table.scope}}_{{name}}_current_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
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
                $scope.table.getColCurrent($scope.name).value = $scope.table.getColCurrent($scope.name).value || {};
                for( var key in $scope.table.colList($scope.name).list  ) {
                    $scope.table.getColCurrent($scope.name).value[ $scope.table.colList($scope.name).list[key].key ] = true;
                }
                $scope.table.changeColCurrent($scope.name);
            }

            $scope.removeall = function() {
                $scope.table.getColCurrent($scope.name).value = {};
                $scope.table.changeColCurrent($scope.name);
            }

            $scope.valueArr = function() {
               var valueArr = $.map( $scope.table.colList($scope.name).list, function(n) {
                   if( $scope.table.getColCurrent($scope.name)!= undefined  ) {
                        if( $scope.table.getColCurrent($scope.name).value[n.key] ) 
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

wliu_table.directive("form.checkbox2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"  //col_name
        },
        template: [ 
                        '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                                'ng-click="change(name)" ',
                                'diag-target="#{{table.colMeta(name).targetid}}" diag-toggle="click" ',
                                'popup-target="#table_rowno_tooltip" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                //'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                form_scope,
                                form_ng_hide,
                                form_ng_class,
                        '/>',
                ].join(''),
        controller: function ($scope) {
            $scope.table.error_tooltip = "table_rowno_tooltip";

            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for( var key in $scope.table.colList($scope.name).list ) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.getColCurrent($scope.name)!=undefined ) {
                            if($scope.table.getColCurrent($scope.name).value[n.key]) 
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
            $(function(){
                if( $("#" + sc.table.error_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.table.error_tooltip + '" wliu-popup></div>');
                    $("#" + sc.table.error_tooltip).wliuPopup();
                }
            })
        }
    }
});

wliu_table.directive("form.checktext2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"  //col_name
        },
        template: [ 
                        '<span class="wliuCommon-label">{{ valueText() }}</span>',
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.valueText = function() {
                var ret_text = "";
                for( var key in $scope.table.colList($scope.name).list ) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var text = $.map( dList , function(n) {
                        if( $scope.table.getColCurrent($scope.name)!=undefined ) {
                            if($scope.table.getColCurrent($scope.name).value[n.key]) 
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

wliu_table.directive("form.checkdiag2", function () {
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
                        form_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<a class="wliu-btn16 wliu-btn16-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn16 wliu-btn16-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
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
                                                                        form_scope,
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

wliu_table.directive("form.checklist2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",  //col_name
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;overflow:visible;" ',
                        form_scope,
                        form_ng_hide,
                        form_ng_class,
                        form_tooltip,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<a class="wliu-btn16 wliu-btn16-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn16 wliu-btn16-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
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
                                                                    '<input type="checkbox" id="{{table.scope}}_{{name}}_current_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColCurrent(name).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        form_scope,
                                                                        form_ng_change,
                                                                        form_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_current_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
                $scope.table.getColCurrent($scope.name).value = $scope.table.getColCurrent($scope.name).value || {};
                for( var key in $scope.table.colList($scope.name).list  ) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    for( var dkey in dList) {
                        $scope.table.getColCurrent($scope.name).value[ dList[dkey].key ] = true;
                    }
                }
                $scope.table.changeColCurrent($scope.name);
            }

            $scope.removeall = function() {
                for( var key in $scope.table.colList($scope.name).list  ) {
                    $scope.table.getColCurrent($scope.name).value = {};
                }
                $scope.table.changeColCurrent($scope.name);
            }

            $scope.valueArr = function() {
                var ret_arr = [];
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getColCurrent($scope.name)!= undefined  ) {
                                if( $scope.table.getColCurrent($scope.name).value[n.key] ) 
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

wliu_table.directive("form.checkbox3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"  // col_name
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-checklist" value="{{ valueText() }}" ',
                            'ng-click="change(name)" ',
                            'diag-target="#{{table.colMeta(name).targetid}}" diag-toggle="click" ',
                            'popup-target="#table_rowno_tooltip" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            //'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            form_scope,
                            form_ng_class,
                            form_ng_hide,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.error_tooltip = "table_rowno_tooltip";

            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key1 in $scope.table.colList($scope.name).list) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var text = $.map( list3 , function(n) {
                            if( $scope.table.getColCurrent($scope.name)!= undefined ) {
                                if($scope.table.getColCurrent($scope.name).value[n.key]) 
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
            $(function(){
                if( $("#" + sc.table.error_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.table.error_tooltip + '" wliu-popup></div>');
                    $("#" + sc.table.error_tooltip).wliuPopup();
                }
            })
        }
    }
});

wliu_table.directive("form.checktext3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"  // col_name
        },
        template: [
                    '<span class="wliuCommon-label">{{ valueText() }}</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.valueText = function() {
                var ret_text = "";
                for(var key1 in $scope.table.colList($scope.name).list) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var text = $.map( list3 , function(n) {
                            if( $scope.table.getColCurrent($scope.name)!= undefined ) {
                                if($scope.table.getColCurrent($scope.name).value[n.key]) 
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

wliu_table.directive("form.checkdiag3", function () {
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
                        form_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<a class="wliu-btn16 wliu-btn16-checkall" ng-click="checkall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn16 wliu-btn16-removeall" ng-click="removeall(table.lists[name].keys.guid, table.lists[name].keys.name)" title="remove all" ng-show="bar==1"></a>',
                        
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
                                                                        form_scope,
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

wliu_table.directive("form.checklist3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",  //col_name
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;overflow:visible;" ',
                        form_scope,
                        form_ng_class,
                        form_ng_hide,
                        form_tooltip,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<a class="wliu-btn16 wliu-btn16-checkall" ng-click="checkall()" title="check all" ng-show="bar==1"></a>',
                        '<a class="wliu-btn16 wliu-btn16-removeall" ng-click="removeall()" title="remove all" ng-show="bar==1"></a>',
                        
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
                                                                    '<input type="checkbox" id="{{table.scope}}_{{name}}_current_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColCurrent(name).value[tdObj.key]" ng-value="tdObj.key"  ',
                                                                        form_scope,
                                                                        form_ng_change,
                                                                        form_ng_disabled,
                                                                    '/>',

                                                                    '<label for="{{table.scope}}_{{name}}_current_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
                $scope.table.getColCurrent($scope.name).value = $scope.table.getColCurrent($scope.name).value || {};
                for( var key1 in $scope.table.colList($scope.name).list ) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for( var key2 in list2) {
                        var list3 = list2[key2].list;
                        for(var key3 in list3) {
                            $scope.table.getColCurrent($scope.name).value[ list3[key3].key ] = true;
                        }
                     }
                }
                $scope.table.changeColCurrent($scope.name);
            }

            $scope.removeall = function() {
                $scope.table.getColCurrent($scope.name).value = {};
                $scope.table.changeColCurrent($scope.name);
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
                            if( $scope.table.getColCurrent($scope.name)!= undefined  ) {
                                    if( $scope.table.getColCurrent($scope.name).value[n.key] ) 
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

wliu_table.directive("form.radio", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            colnum:     "@",
            name:       "@"
        },
        template: [
                    '<div class="wliuCommon-label" ',
                        form_scope,
                        form_ng_class,
                        form_ng_hide,
                        form_tooltip,
                    '>',
                        '<span ng-repeat="rdObj in table.colList(name).list">',
                                '<span class="radio">',
                                        '<input type="radio" id="{{table.scope}}_{{name}}_current_{{rdObj.key}}" ',
                                            'ng-model="table.getColCurrent(name).value" ng-value="rdObj.key"  ',
                                            form_scope,
                                            form_ng_change,
                                            form_ng_disabled,
                                        '/>',
                                        '<label scope="{{ table.scope }}" for="{{table.scope}}_{{name}}_current_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
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

wliu_table.directive("form.radio1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                        '<input  type="text" readonly class="wliuCommon-radiolist" value="{{valueText()}}" ',
                                'ng-click="change(name)" ',
                                'diag-target="#{{table.colMeta(name).targetid}}" diag-toggle="click" ',
                                'popup-target="{{table.colMeta(name).tooltip?\'#\'+table.colMeta(name).tooltip:\'\'}}" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                form_scope,
                                form_ng_class,
                                form_ng_hide,
                        '/>',
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var val =  $scope.table.getColCurrent($scope.name)?$scope.table.getColCurrent($scope.name).value:"";
                var valueText = FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} )?FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} ).value:"";
                return valueText;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.radiotext1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                        '<span class="wliuCommon-label">{{ valueText() }}</span>',
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var val =  $scope.table.getColCurrent($scope.name)?$scope.table.getColCurrent($scope.name).value:"";
                var valueText = FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} )?FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} ).value:"";
                return valueText;
            }
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.radiodiag1", function () {
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
                        form_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText(table.lists[name].keys.guid, table.lists[name].keys.name) }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            form_ng_options,
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
                                            form_scope,
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

wliu_table.directive("form.radiolist1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@", // col_name
            colnum:     "@",
            bar:        "@", 
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px; padding:2px; overflow-y:auto; overflow:visible; text-align:left; min-width:240px;" ',
                        form_scope,
                        form_ng_hide,
                        form_ng_class,
                        form_tooltip,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
                            '<div class="wliu-selectlist">',
                                '<div class="wliu-selectlist-title info-color text-center">SELECTED</div>',
                                '<ul class="wliu-selectlist-content">',
                                    '{{ valueText() }}',
                                '</ul>',
                            '</div>',
                        '</a>',
                        '<input type="text" class="wliuCommon-search" ng-model="search" ng-show="bar==1" ',
                            form_ng_options,
                        '/>',
                        '<div class="wliu-underline" ng-show="bar==1"></div>',
                        '<div class="wliu-diag-content" style="font-size:14px;">',
                        '<span ',
                            'ng-repeat="rdObj in table.colList(name).list|filter:search">',
                                '<span class="radio">',
                                        '<input type="radio" name="{{table.scope}}_{{name}}_current" id="{{table.scope}}_{{name}}_current_{{rdObj.key}}" ',
                                            'ng-model="table.getColCurrent(name).value" ng-value="rdObj.key"  ',
                                            form_scope,
                                            form_ng_change,
                                            form_ng_disabled,
                                        '/>',
                                        '<label for="{{table.scope}}_{{name}}_current_{{rdObj.key}}" title="{{rdObj.desc?rdObj.desc:rdObj.value}}">',
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
                var val =  $scope.table.getColCurrent($scope.name)?$scope.table.getColCurrent($scope.name).value:"";
                var valueText = FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} )?FCOLLECT.firstByKV( $scope.table.colList($scope.name).list, {key:val} ).value:"";
                return valueText;
            }
            
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.radio2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                        '<input type="text" readonly class="wliuCommon-radiolist" value="{{ valueText() }}" ',
                                'ng-click="change(name)" ',
                                'diag-target="#{{table.colMeta(name).targetid}}" diag-toggle="click" ',
                                'popup-target="{{table.colMeta(name).tooltip?\'#\'+table.colMeta(name).tooltip:\'\'}}" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                                form_scope,
                                form_ng_class,
                                form_ng_hide,
                                form_ng_disabled,
                        '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var text = $.map( dList , function(n) {
                        if($scope.table.getColCurrent($scope.name)!=undefined) {
                            if($scope.table.getColCurrent($scope.name).value == n.key) 
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

wliu_table.directive("form.radiotext2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@"
        },
        template: [
                        '<span class="wliuCommon-label">{{ valueText() }}</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in $scope.table.colList($scope.name).list) {
                    var dList = $scope.table.colList($scope.name).list[key].list;
                    var text = $.map( dList , function(n) {
                        if($scope.table.getColCurrent($scope.name)!=undefined) {
                            if($scope.table.getColCurrent($scope.name).value == n.key) 
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

wliu_table.directive("form.radiodiag2", function () {
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
                        form_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
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
                                                                        form_scope,
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

wliu_table.directive("form.radiolist2", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" ',
                        form_scope,
                        form_ng_class,
                        form_ng_hide,
                        form_tooltip,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
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
                                                                    '<input type="radio" name="{{table.scope}}_{{name}}_current" id="{{table.scope}}_{{name}}_current_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColCurrent(name).value" ng-value="tdObj.key"  ',
                                                                        form_scope,
                                                                        form_ng_change,
                                                                        form_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_current_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
                    var valueArr = $.map( dList , function(n) {
                        if( $scope.table.getColCurrent($scope.name)!= undefined  ) {
                                if( $scope.table.getColCurrent($scope.name).value == n.key ) 
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

wliu_table.directive("form.radio3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@"
        },
        template: [
                    '<input type="text" readonly class="wliuCommon-radiolist" value="{{ valueText() }}" ',
                            'ng-click="change(name)" ',
                            'diag-target="#{{table.colMeta(name).targetid}}" diag-toggle="click" ',
                            'popup-target="{{table.colMeta(name).tooltip?\'#\'+table.colMeta(name).tooltip:\'\'}}" popup-placement="down" popup-toggle="hover" popup-body="{{table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage.nl2br():valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            'title="{{table.colMeta(name).tooltip?\'\':table.getColCurrent(name).errorCode?table.getColCurrent(name).errorMessage:valueText()?valueText():table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}" ',
                            form_scope,
                            form_ng_hide,
                            form_ng_class,
                            form_ng_disabled,
                    '/>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in  $scope.table.colList($scope.name).list) {
                    var dList =  $scope.table.colList($scope.name).list[key].list;
                    for(var pkey in dList) {
                        var pList = dList[pkey].list;
                        var text = $.map( pList , function(n) {
                            if( $scope.table.getColCurrent($scope.name)!=undefined ) {
                                if($scope.table.getColCurrent($scope.name).value==n.key) 
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

wliu_table.directive("form.radiotext3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            rowsn:      "@",
            name:       "@"
        },
        template: [
                    '<span class="wliuCommon-label">{{ valueText() }}</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.table.colList($scope.name).keys = $scope.table.colList($scope.name).keys || {};
            $scope.change = function(name) {
                $scope.table.colList(name).keys.guid = $scope.table.getCurrent().guid;
                $scope.table.colList(name).keys.name = name;
            }
            $scope.valueText = function() {
                var ret_text = "";
                for(var key in  $scope.table.colList($scope.name).list) {
                    var dList =  $scope.table.colList($scope.name).list[key].list;
                    for(var pkey in dList) {
                        var pList = dList[pkey].list;
                        var text = $.map( pList , function(n) {
                            if( $scope.table.getColCurrent($scope.name)!=undefined ) {
                                if($scope.table.getColCurrent($scope.name).value==n.key) 
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

wliu_table.directive("form.radiodiag3", function () {
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
                        form_scope,
                    '>',
                        '<div wliu-diag-head>{{ title }}</div>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
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
                                                                        form_scope,
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
                for(var key1 in $scope.table.lists[$scope.name].list) {
                    var list2 = $scope.table.lists[$scope.name].list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
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

wliu_table.directive("form.radiolist3", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            colnum:     "@",  // col-md-{{colnum}}
            colnum1:    "@",
            bar:        "@",
            title:      "@"
        },
        template: [
                    '<div class="col-md-12" style="border:1px dotted #666666;border-radius:5px;overflow-y:auto;" ',
                        form_scope,
                        form_ng_hide,
                        form_ng_class,
                        form_tooltip,
                    '>',
                        '<a class="wliu-btn16 wliu-btn16-selectlist" ng-show="bar==1">',
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
                            form_ng_options,
                        '/>',
                        '<select class="wliuCommon-filter" ',
                                'ng-model="listFilter.key" ',
                                'ng-options="sObj.key as sObj.value for sObj in table.colList(name).list" ',                        
                        ' ng-show="bar==1">',
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
                                                                    '<input type="radio" name="{{table.scope}}_{{name}}_current" id="{{table.scope}}_{{name}}_current_{{tdObj.key}}" ',
                                                                        'ng-model="table.getColCurrent(name).value" ng-value="tdObj.key"  ',
                                                                        form_scope,
                                                                        form_ng_change,
                                                                        form_ng_disabled,
                                                                    '/>',
                                                                    '<label for="{{table.scope}}_{{name}}_current_{{tdObj.key}}" title="{{tdObj.desc?tdObj.desc:tdObj.value}}">',
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
                for(var key1 in $scope.table.colList($scope.name).list) {
                    var list2 = $scope.table.colList($scope.name).list[key1].list;
                    for(var key2 in list2) {
                        var list3 = list2[key2].list;
                        var valueArr = $.map( list3 , function(n) {
                            if( $scope.table.getColCurrent($scope.name)!= undefined  ) {
                                    if( $scope.table.getColCurrent($scope.name).value == n.key ) 
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

wliu_table.directive("form.button", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            action:     "&",
            outline:    "@",
            icon:       "@",
            before:     "&",
            after:      "&"
        },
        template: [
                    '<div class="white-block">',
                        '<button class="btn btn{{ outline==1?\'-outline\':\'\'}}-{{ buttonStyle() }} waves-effect" ',
                            'style="min-width:60px;{{!buttonState(name, table.getCurrent().rowstate)?\'border-color:grey;\':\'\'}}" ',
                            'title="{{table.colMeta(name).coldesc?table.colMeta(name).coldesc:table.colMeta(name).colname}}"',
                            'ng-disabled="!buttonState(name, table.getCurrent().rowstate)" ',
                            'ng-click="action1(table.getCurrent())" ',

                            'popup-target="{{table.tooltip?\'#\'+table.tooltip:\'\'}}" popup-placement="down" popup-toggle="hover" ',
                            'popup-body="{{table.getCurrent().error.errorCode?table.getCurrent().error.errorMessage.nl2br():\'\'}}"',
                            'title="{{ table.tooltip?\'\':(table.getCurrent().error.errorCode? table.getCurrent().error.errorMessage : \'\') }}"',
                            form_scope,
                        '>',
                        '<span style="vertical-align:middle;{{!buttonState(name, table.getCurrent().rowstate)?\'color:#666666;\':\'\'}}">',
                            '{{actname}}',
                        '</span>',
                        '</button>',
                    '</div>'
                ].join(''),
        controller: function ($scope, wliuTableService) {
            $scope.buttonStyle = function() {
                var ret_val = "primary";
                switch( $scope.name ) {
                    case "add":
                        ret_val = "default";
                        break;
                    case "save":
                        ret_val = "secondary";
                        break;
                    case "cancel":
                        ret_val = "warning";
                    case "reset":
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
                    case "add":
                        $scope.table.addRow();
                        break;
                    case "save":
                        $scope.table.saveRow(theRow, {
                            ajaxComplete: $scope.action
                        });
                        break;
                    case "cancel":
                        $scope.table.cancelRow(theRow);
                        break;
                    case "reset":
                        switch(theRow.rowstate) {
                            case 0:
                                break;
                            case 1:
                                $scope.table.cancelRow(theRow);
                                break;
                            case 2:
                                $scope.table.resetRow(theRow);
                                break;
                            case 3:
                                $scope.table.cancelRow(theRow);
                                break;
                        } 
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
                if( name=="add") {
                    rowstate = rowstate?rowstate:0;
                    if(rowstate<1) return true;
                } 
                return  wliuTableService.buttonState(name,rowstate) && right;
            };
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.linkbutton", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:      "=",
            name:       "@",
            actname:    "@",
            action:     "&",
            icon:       "@",
            before:     "&",
            after:      "&"
        },
        template: [
                    '<span>',
                    '<a href="javascript:void(0)" ',
                        'class="btn btn-{{ buttonStyle() }} waves-effect {{!buttonState(name, table.getCurrent().rowstate)?\'grey\':\'\'}} {{!buttonState(name, table.getCurrent().rowstate)?\'disabled\':\'\'}}" ',
                        'style="min-width:60px;" ',
                        'ng-click="action1(table.getCurrent())" ',
                        'popup-target="{{table.tooltip?\'#\'+table.tooltip:\'\'}}" popup-toggle="hover" popup-placement="down" ',
                        'popup-body="{{table.getCurrent().error.errorCode?table.getCurrent().error.errorMessage.nl2br():\'\'}}"',
                        'title="{{ table.tooltip?\'\':(table.getCurrent().error.errorCode? table.getCurrent().error.errorMessage : \'\') }}"',
                        form_scope,
                    '>',
                        '{{actname?actname:name.capital()}}',
                    '</a>',
                    '</span>'
                ].join(''),
        controller: function ($scope) {
            $scope.buttonStyle = function() {
                var ret_val = "primary";
                switch( $scope.name ) {
                    case "add":
                        ret_val = "default";
                        break;
                    case "save":
                        ret_val = "secondary";
                        break;
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
                    case "add":
                        $scope.table.addRow();
                        break;
                    case "save":
                        $scope.table.saveRow(theRow);
                        break;
                    case "cancel":
                        switch(theRow.rowstate) {
                            case 0:
                                break;
                            case 1:
                                $scope.table.cancelRow(theRow);
                                break;
                            case 2:
                                $scope.table.resetRow(theRow);
                                break;
                            case 3:
                                $scope.table.cancelRow(theRow);
                                break;
                        } 
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
                if( name=="add") {
                    rowstate = rowstate?rowstate:0;
                    if(rowstate<1) return true;
                } 
                return  wliuTableService.buttonState(name,rowstate) && right;
            };
       },
        link: function (sc, el, attr) {
        }
    }
});

wliu_table.directive("form.message", function (wliuTableService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table: "="
        },
        template: [
                    '<div ng-show="table.error.errorCode>0 || table.getCurrent().error.errorCode>0" class="card card-danger text-center z-depth-2 mb-1 white-text" style="padding:10px;">',
                        '<div wliu-diag-body style="font-size:16px;text-align:left;">',
                        '<i class="fa fa-exclamation-triangle fa-md" aria-hidden="true" style="color:white;"></i> <span style="font-size:16px;">We can\'t process submitted data:</span>',

                        '<p class="white-text mb-0" style="padding-left:20px;" ng-bind-html="getHTML()">',
                        '</p>',
                    '</div>'
                ].join(''),
        controller: function ($scope, $sce) {
            $scope.getHTML = function() {
                if( $scope.table.error.errorCode || ( $scope.table.getCurrent() && $scope.table.getCurrent().error.errorCode ) ) {
                    var errMsg = $scope.table.error.errorMessage.nl2br1();
                    if( $scope.table.getCurrent() ) errMsg += "<br>" + $scope.table.getCurrent().error.errorMessage.nl2br1();
                    return $sce.trustAsHtml(errMsg);
                } else { 
                    return $sce.trustAsHtml("");
                }
                /*                
                if( $scope.table.error.errorCode )
                    return $sce.trustAsHtml($scope.table.error.errorMessage.nl2br1());
                else 
                    return $sce.trustAsHtml("");
                */
            }
        },
        link: function (sc, el, attr) {
        }
    }
});
