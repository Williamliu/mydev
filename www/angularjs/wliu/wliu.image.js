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


wliu_image.directive("image.viewer", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imgobj:         "=",
            imglist:        "=",
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

                                    '<button ng-click="upload()" title="Upload Image" class="btn btn-outline-secondary pull-left waves-effect {{ imgobj.resize[view].data?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    '<a class="wliu-btn16 wliu-btn16-okey"></a>',
                                    ' Upload</button>',

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

            $scope.upload = function() {
                if($scope.imgobj.resize.origin.data!="") {
                    $scope.imglist.push( angular.copy($scope.imgobj) );
                    $scope.action($scope.imgobj);
                    $scope.dispose();
                }
            }

            $scope.dispose = function() {
                $scope.imgobj = FIMAGE.clearImage( $scope.imgobj );
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
