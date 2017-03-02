var wliu_image = angular.module("wliuImage",[]);

/****** Filter  ******/
/** label, textbox, select, bool, datetime, date, time */
wliu_image.directive("image.pickup", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imgobj:         "=",
            targetid:       "@",
            xsize:          "@",
            actname:        "@",
            action:         "&",
            tooltip:        "@",
            view:           "@"

        },
        template: [
                    '<div class="btn btn-outline-info waves-effect" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;">',
                    '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-upload"></a>',
                    '<input type="file" onchange="angular.element(this).scope().selectFile(event);" style="display:block; position:absolute; opacity:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." />',
                    ' {{actname}}</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.xsize = $scope.xsize?$scope.xsize:16;
            $scope.view = $scope.view?$scope.view:"medium";
            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                FIMAGE.view = $scope.view;
                FIMAGE.fromFile($scope.imgobj, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.action();
                        if( $scope.targetid ) $("#" + $scope.targetid).trigger("show");
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
        },
        link: function (sc, el, attr) {
        }
    }
});


wliu_image.directive("image.upload", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imgobj:         "=",
            targetid:       "@",
            xsize:          "@",
            actname:        "@",
            action:         "&",
            tooltip:        "@",
            view:           "@",
            ww:             "@",
            hh:             "@"

        },
        template: [
                    '<div style="display:inline-block;text-align:center;border:1px solid #cccccc;border-radius:5px;">',
                        '<div class="btn btn-outline-info waves-effect" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;">',
                            '<a class="wliu-btn{{xsize}} wliu-btn{{xsize}}-upload"></a>',
                            '<input type="file" onchange="angular.element(this).scope().selectFile(event);" style="display:block; position:absolute; opacity:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." />',
                            ' {{actname}}',
                        '</div>',
                        '<div style="display:block;width:{{ww}}px;min-height:{{hh}}px;text-align:center;border-top:1px solid #cccccc;">',
                            '<img class="img-responsive" width="100%" src="{{ imgobj.resize[view].data?imgobj.resize[view].data:\'\' }}" />',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.ww = $scope.ww?$scope.ww:200;
            $scope.hh = $scope.hh?$scope.hh:120;
            $scope.xsize = $scope.xsize?$scope.xsize:16;
            $scope.view = $scope.view?$scope.view:"medium";
            $scope.selectFile = function(event) {
                files = (event.srcElement || event.target).files;
                FIMAGE.view = $scope.view;
                FIMAGE.fromFile($scope.imgobj, files[0], function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.action();
                        if( $scope.targetid ) {
                            $("#" + $scope.targetid).trigger("show");
                            FIMAGE.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                        } 
                        $scope.$apply();  // important: it is async to read image in callback
                    }
                });
            }
        },
        link: function (sc, el, attr) {
        }
    }
});


wliu_image.directive("image.editor", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imgobj:         "=",
            targetid:       "@",
            title:          "@",
            view:           "@",
            action:         "&"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable fade>',
                        '<div wliu-diag-head>{{title}}</div>',
                        '<div wliu-diag-body>',
                            
                            '<div ng-if="imgobj.errorCode">',
                                '{{imgobj.errorMessage}}',
                            '</div>',
                            '<div ng-if="!imgobj.errorCode">',
                                '<div style="min-width:320px;min-height:300px;">',
                                    '<div class="wliu-image-frame">',
                                        '<img src="{{ imgobj.resize[view].data?imgobj.resize[view].data:\'\' }}" />',
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
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.rotate = function() {
                FIMAGE.rotate($scope.imgobj, function(oImg){
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                    $scope.$apply();
                });
            }

            $scope.crop = function() {
                FIMAGE.cropDiv($scope.imgobj, $("div.wliu-image-frame", "#" + $scope.targetid), $("div.wliu-image-crop", "#" + $scope.targetid), function(oImg){
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                    $scope.$apply();
                });
            }

            $scope.reset = function() {
                FIMAGE.cropReset($scope.imgobj, function(oImg){
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                    $scope.$apply();
                });
            }

            $scope.save = function() {
                if($scope.imgobj.resize.origin.data!="") {
                    $scope.action($scope.imgobj);
                    $scope.dispose();
                }
            }

            $scope.dispose = function() {
                FIMAGE.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                if( !$scope.$root.$$phase) $scope.$apply();
                $("#" + $scope.targetid).trigger("hide");
            }

        },
        link: function (sc, el, attr) {
            $(function(){
                $("div.wliu-image-crop", el).draggable({
                    containment: "parent"
                });
				$("div.wliu-image-crop", el).resizable({ 
                    containment: "parent"
   			    });
            });
        }
    }
});


wliu_image.directive("image.list", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
            ww:             "@",
            hh:             "@"
        },
        template: [
                    '<div style="display:block;border:1px solid #cccccc;">',
                        '',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
        },
        link: function (sc, el, attr) {
        }
    }
});

wliu_image.directive("image.list1", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
            ww:             "@",
            hh:             "@",  // only for ratio
            tooltip:        "@"
        },
        template: [
                    '<div style="display:block;position:relative; border:0px solid #cccccc; padding:2px;" imglist targetid="{{targetid}}" viewerid="{{viewerid}}">',
                        '<!---- img box ------------------------------------------------------------------------------------------------>',
                        '<div style="display:inline-block;position:relative;margin:2px;" imgid="{{imgObj.id}}" class="wliu-background-1 image-item" ',
                                'ng-repeat="imgObj in imglist.rows"',
                        '>',
                            '<span ng-if="imglist.config.mode==\'edit\'">',                            
                                '<span style="position:absolute;color:red;margin-top:3px;margin-left:60px">{{imgObj.orderno}}</span>',
                                '<a class="wliu-btn24 wliu-btn24-img-print" ng-click="printImage(imgObj)" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8;" ',
                                    'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                    'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Print Image" ',
                                '>',
                                '</a>',
                                '<a class="wliu-btn24 wliu-btn24-comments" ng-click="textImage(imgObj)" style="position:absolute; margin-top:3px;margin-left:30px;opacity:0.8;" ',
                                    'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                    'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Image Comments" ',
                                '>',
                                '</a>',
                                '<a class="wliu-btn24 wliu-btn24-dispose" ng-click="deleteImage(imgObj)" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                    'title="{{tooltip?\'\':\'Delete Image\'}}" ',
                                    'popup-target="{{tooltip?\'#\'+tooltip:\'\'}}" popup-toggle="hover" popup-body="Delete Image" ',
                                '>',
                                '</a>',
                            '</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;box-sizing:content-box;border:1px solid #cccccc;" class="img-content">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage(imgObj)" onload="imageAutoFix(this)" ww="{{ww}}" hh="{{hh}}" style="display:inline;cursor:pointer;" src="{{imglist.thumb($index)}}" />',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div ng-if="imglist.rows.length<imglist.config.max_length" style="display:inline-block;position:relative;margin:2px;width:{{ww}}px;height:{{hh}}px;line-height:{{hh}}px;text-align:center;font-size:18px;font-weight:700;color:#666666;border:1px solid #cccccc; overflow:hidden;" class="wliu-background-1">',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                            'onchange="angular.element(this).scope().selectFile(event);" />',
                                    'Add Image',
                        '</div>',
                        '<!---// img box ---------------------------------------------------------------------------------------------->',
                '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.ww           = $scope.ww?$scope.ww:"100";
            $scope.hh           = $scope.hh?$scope.hh:"100";

            $scope.selectFile = function(event) {
                var newImg       = new WLIU.IMAGE({rowsn: guid()});
                files = (event.srcElement || event.target).files;
                var view = $scope.imglist.config.thumb?$scope.imglist.config.thumb:"tiny";
                FIMAGE.view = view;
                FIMAGE.fromFile(newImg, files[0], null, function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.imglist.addImage(newImg);
                    }
                });
            }
            
            $scope.printImage = function(imgObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.imglist.rows, {id: imgObj.id});
                if( $scope.imglist.view(rowidx)!="" ) {
                    FFILE.exportDataURL($scope.imglist.view(rowidx));
                } 
            }
            $scope.clickImage = function(imgObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.imglist.rows, {id: imgObj.id});
                $scope.imglist.curidx = rowidx;
                $($scope.imglist.imgViewer).trigger("ishow");
            }
            $scope.textImage = function(imgObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.imglist.rows, {id: imgObj.id});
                $scope.imglist.curidx = rowidx;
                $scope.imglist.rows[rowidx].status=$scope.imglist.rows[rowidx].status=="1"?true:false;
                $($scope.imglist.infoEditor).trigger("show");
            }
            $scope.deleteImage = function(imgObj) {
                var rowidx = FCOLLECT.indexByKV( $scope.imglist.rows, {id: imgObj.id});
                if( confirm("Delete image, are you sure?") )
                    $scope.imglist.deleteImage(rowidx);
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                /* 
                $(el).sortable({
                    items: ">div.image-item",
					stop: function(ev, ui) {
                        $("div.image-item", el).each(function(imgidx, imgel){
                           var imgObj = FCOLLECT.objectByKV(sc.imglist.rows, {id: $(imgel).attr("imgid")});
                           imgObj.sn  = parseInt(imgidx) + 1;
                        })
                        sc.$apply();
                        sc.imglist.saveOrder();
                    }
                });
                */
            });
        }
    }
});

wliu_image.directive("image.info", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
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
                                    '<input type="textbox" ng-model="imglist.rows[imglist.curidx].title_en" style="width:100%;" />',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-3 text-md-right">',
                                    '<span class="wliuCommon-label">Title-CN</span>',
                                '</div>',
                                '<div class="col-md-9 text-md-left">',
                                    '<input type="textbox" ng-model="imglist.rows[imglist.curidx].title_cn" style="width:100%;" />',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Description-EN</span><br>',
                                    '<textarea ng-model="imglist.rows[imglist.curidx].detail_en" style="width:100%;height:60px;"></textarea>',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Description-CN</span><br>',
                                    '<textarea ng-model="imglist.rows[imglist.curidx].detail_cn" style="width:100%;height:60px;"></textarea>',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-2 text-md-right">',
                                    '<span class="wliuCommon-label">Status</span>',
                                '</div>',
                                '<div class="col-md-4 text-md-left">',
                                    '<input id="{{targetid}}_status" type="checkbox" ng-model="imglist.rows[imglist.curidx].status" /> <label for="{{targetid}}_status">Active</label>',
                                '</div>',
                                '<div class="col-md-4 text-md-right">',
                                    '<span class="wliuCommon-label">Order</span>',
                                '</div>',
                                '<div class="col-md-2 text-md-left">',
                                    '<input type="textbox" ng-model="imglist.rows[imglist.curidx].orderno" style="width:100%;text-align:center;" />',
                                '</div>',
                            '</div>',

                            '<center>',
                                '<button ng-click="save(imglist.curidx)" title="Save" class="btn btn-lg btn-outline-success waves-effect" ',
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
                //var rowidx = FCOLLECT.indexByKV( $scope.imglist.rows, {id: imgObj.id});
                $scope.imglist.saveText(rowidx, { ajaxAfter:
                    function(imgs){
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

wliu_image.directive("image.viewer", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
            targetid:       "@",
            ww:             "@",
            hh:             "@"
        },
        template: [
                        '<div id="{{targetid}}" wliu-diag maskable fade>',
                            '<div wliu-diag-body style="text-align:center;">',
                                    '<img class="img-responsive" width="100%" ww="400" hh="400" style="display:inline;" src="{{imglist.view(imglist.curidx)}}" />',
                            '</div>',
                        '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.ww = $scope.ww?$scope.ww:400;
            $scope.hh = $scope.hh?$scope.hh:400;
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                //onload="imageAutoFix(this)"
                $(el).unbind("ishow").bind("ishow", function(evt){
                    $(el).trigger("show");
                    $("img", el).unbind("load").bind("load", function(ev){
                            var img = ev.target;
                            var c_ww = parseInt($(img).attr("ww"))?parseInt($(img).attr("ww")):100;
                            var c_hh = parseInt($(img).attr("hh"))?parseInt($(img).attr("hh")):100;
                            var i_ww = img.naturalWidth;
                            var i_hh = img.naturalHeight;

                            var img_rate = i_hh / i_ww;
                            
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
                            $(el).trigger("show");
                    });

                });
            });
        }
    }
});


wliu_image.directive("image.error", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
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
                if( $scope.imglist.errorCode )
                    return $sce.trustAsHtml($scope.imglist.errorMessage.nl2br());
                else 
                    return $sce.trustAsHtml("");
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                $(el).unbind("errorshow").bind("errorshow", function(evt){
                    if( parseInt(sc.imglist.errorCode) ) {
                        $(el).trigger("show");
                    }
                });
            });
        }
    }
});
