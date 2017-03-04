var wliu_file = angular.module("wliuFile",[]);

/****** Filter  ******/
/** label, textbox, select, bool, datetime, date, time */
wliu_file.directive("file.list", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            filelist:       "=",
            tooltip:        "@",
            actname:        "@",
            namemax:        "@"
        },
        template: [
                    '<ul style="display:inline-block;">',
                        '<li ng-repeat="fileObj in filelist.rows" style="text-decoration:underline;">',
                            '<a href="{{fileObj.url?fileObj.url:\'javascript:void(0);\'}}" target="_blank" ',
                                'title="{{fileObj.title_en}}\n{{fileObj.title_cn}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="{{ fileObj.title_en.join(\'<br>\',fileObj.detail_en).join(\'<br>\',fileObj.title_cn).join(\'<br>\',fileObj.detail_cn)  }}" ',
                            '>',
                                    '{{$index+1}}. {{(\'\'+fileObj.full_name).subName(namemax)}}',
                            '</a>',
                            '<a class="wliu-btn16 wliu-btn16-notes" ng-click="textFile(fileObj)" style="margin-left:10px;" ',
                                'title="{{tooltip?\'\':\'File Comments\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="File Comments" ',
                            '>',
                            '</a>',
                            '<a class="wliu-btn16 wliu-btn16-img-print" ng-click="printFile(fileObj)" style="margin-left:2px;" ',
                                'title="{{tooltip?\'\':\'Print File\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print File" ',
                            '>',
                            '<a class="wliu-btn16 wliu-btn16-dispose" ng-click="deleteFile(fileObj)" style="margin-left:2px;" ',
                                'title="{{tooltip?\'\':\'Delete File\'}}" ',
                                'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete File" ',
                            '>',
                            '</a>',
                        '</li>',
                        '<li ng-if="filelist.rows.length<filelist.config.max_length && filelist.config.mode==\'edit\'">',
                                '<div class="btn btn-default" style="display:inline-block;position:relative;text-transform:none;overflow:hidden;height:20px;line-height:20px;padding:2px 8px;">',
                                    '<a class="wliu-btn16 wliu-btn16-upload"></a>',
                                    '<input type="file" onchange="angular.element(this).scope().selectFile(event);" style="display:block; position:absolute; opacity:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." />',
                                    ' {{actname}}',
                                '</div>',
                        '</li>',
                    '</ul>'
                ].join(''),
        controller: function ($scope) {
            $scope.actname      = $scope.actname?$scope.actname:"Upload File";
            $scope.namemax      = $scope.namemax?parseInt($scope.namemax):20;

            $scope.selectFile = function(event) {
                var newFile       = new WLIU.FILE({rowsn: guid(), token:guid()});
                files = (event.srcElement || event.target).files;
                FFILE.allowSize = parseInt($scope.filelist.config.max_size)>0 && ($scope.filelist.config.max_size)<GCONFIG.max_upload_size?parseInt($scope.filelist.config.max_size):GCONFIG.max_upload_size;
                FFILE.allowType = (""+$scope.filelist.config.allow_type).toArray(",","upper");
                console.log(FFILE.allowType);
                FFILE.fromFile(newFile, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.filelist.addFile(newFile);
                    }
                });
            }
            $scope.printFile = function(fileObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.filelist.rows, {id: fileObj.id});
                $scope.filelist.printFile(rowidx, function(oFile){
                    if( oFile.data ) FFILE.exportDataURL(oFile.data);
                });
            }
            $scope.textFile = function(fileObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.filelist.rows, {id: fileObj.id});
                $scope.filelist.curidx = rowidx;
                $scope.filelist.rows[rowidx].status=$scope.filelist.rows[rowidx].status=="1"?true:false;
                $($scope.filelist.infoEditor).trigger("show");
            }
            $scope.deleteFile = function(fileObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.filelist.rows, {id: fileObj.id});
                if( confirm("Delete file, are you sure?") )
                    $scope.filelist.deleteFile(rowidx);
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                /*
                $(el).sortable({
                    items: ">div.image-item",
					stop: function(ev, ui) {
                        $("div.image-item", el).each(function(imgidx, imgel){
                           var imgObj = FCOLLECT.objectByKV(sc.filelist.rows, {id: $(imgel).attr("imgid")});
                           imgObj.sn  = parseInt(imgidx) + 1;
                        })
                        sc.$apply();
                        sc.filelist.saveOrder();
                    }
                });
                */
            });
        }
    }
});

wliu_file.directive("file.info", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            filelist:        "=",
            targetid:       "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable fade>',
                        '<div wliu-diag-head>Image Information</div>',
                        
                        '<div wliu-diag-body style="width:400px;">',
                            '<div class="row">',
                                '<div class="col-md-3 text-md-right">',
                                    '<span class="wliuCommon-label">Title-EN</span>',
                                '</div>',
                                '<div class="col-md-9 text-md-left">',
                                    '<input type="textbox" ng-model="filelist.rows[filelist.curidx].title_en" style="width:100%;" />',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-3 text-md-right">',
                                    '<span class="wliuCommon-label">Title-CN</span>',
                                '</div>',
                                '<div class="col-md-9 text-md-left">',
                                    '<input type="textbox" ng-model="filelist.rows[filelist.curidx].title_cn" style="width:100%;" />',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Description-EN</span><br>',
                                    '<textarea ng-model="filelist.rows[filelist.curidx].detail_en" style="width:100%;height:60px;"></textarea>',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Description-CN</span><br>',
                                    '<textarea ng-model="filelist.rows[filelist.curidx].detail_cn" style="width:100%;height:60px;"></textarea>',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-2 text-md-right">',
                                    '<span class="wliuCommon-label">Status</span>',
                                '</div>',
                                '<div class="col-md-4 text-md-left">',
                                    '<input id="{{targetid}}_status" type="checkbox" ng-model="filelist.rows[filelist.curidx].status" /> <label for="{{targetid}}_status">Active</label>',
                                '</div>',
                                '<div class="col-md-4 text-md-right">',
                                    '<span class="wliuCommon-label">Order</span>',
                                '</div>',
                                '<div class="col-md-2 text-md-left">',
                                    '<input type="textbox" ng-model="filelist.rows[filelist.curidx].orderno" style="width:100%;text-align:center;" />',
                                '</div>',
                            '</div>',

                            '<center>',
                                '<button ng-click="save(filelist.curidx)" title="Save" class="btn btn-lg btn-outline-success waves-effect" ',
                                        'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        ' Save',
                                '</button>',
                                '<button ng-click="close()" title="Close" class="btn btn-lg btn-outline-info waves-effect" ',
                                        'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                        ' Close',
                                '</button>',
                            '</center>',
                        '</div>',

                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.save = function(rowidx) {
                //var rowidx = FCOLLECT.indexByKV( $scope.filelist.rows, {id: imgObj.id});
                $scope.filelist.saveText(rowidx, { ajaxAfter:
                    function(ofiles){
                       $("#" + $scope.targetid).trigger("hide"); 
                    }
                });
            }
            $scope.close = function() {
                 $("#" + $scope.targetid).trigger("hide");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
            });
        }
    }
});

wliu_file.directive("file.error", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            filelist:        "=",
            targetid:       "@"
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
                if( $scope.filelist.errorCode )
                    return $sce.trustAsHtml($scope.filelist.errorMessage.nl2br());
                else 
                    return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                $(el).unbind("errorshow").bind("errorshow", function(evt){
                    if( parseInt(sc.filelist.errorCode) ) {
                        $(el).trigger("show");
                    }
                });
            });
        }
    }
});
