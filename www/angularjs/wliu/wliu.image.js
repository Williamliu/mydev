var wliu_image = angular.module("wliuImage",[]);

/****** Filter  ******/
/** label, textbox, select, bool, datetime, date, time */
wliu_image.directive("image.button.select", function () {
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
            targetid:       "@",
            title:          "@"
        },
        template: [
                    '<div id="{{targetid}}" class="wliu-diag" style="min-width:200px;min-height:200px;">',
                        '<div class="wliu-diag-content" style="padding:0px;">',
                            
                            '<div ng-if="imgobj.errorCode">',
                                '{{imgobj.errorMessage}}',
                            '</div>',
                            
                            '<div ng-if="!imglist.list[imglist.rowno].error.errorCode">',
                                '<div class="wliu-image-frame">',
                                    '<img src="{{ imglist.list[imglist.rowno].resize[imglist.view].data?imglist.list[imglist.rowno].resize[imglist.view].data:\'\' }}" />',
                                    //'<img src="1.jpg" />',
                                    '<div class="wliu-image-crop">',
                                        '<div class="wliu-image-crop-h"></div>',
                                        '<div class="wliu-image-crop-v"></div>',
                                    '</div>',
                                '</div>',
                                
                                '<div style="text-align:center;">',
                                '<INPUT type="button" ng-click="rotate()" value="Rotate" />',
                                '<INPUT type="button" ng-click="crop()" value="Crop" />',
                                '<INPUT type="button" ng-click="reset()" value="Reset" />',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.iaction = new WLIU.IMAGEACTION({view: $scope.imglist.view});
            $scope.rotate = function() {
                $scope.iaction.setImage( $scope.imglist.list[$scope.imglist.rowno] );
                $scope.iaction.rotate(function(imgObj){
                    $scope.iaction.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                    $scope.$apply();
                });
            }

            $scope.crop = function() {
                $scope.iaction.setImage( $scope.imglist.list[$scope.imglist.rowno] );
                $scope.iaction.cropDiv($("div.wliu-image-frame", "#" + $scope.targetid), $("div.wliu-image-crop", "#" + $scope.targetid), function(imgObj){
                    $scope.iaction.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                    $scope.$apply();
                });
            }

            $scope.reset = function() {
                $scope.iaction.setImage( $scope.imglist.list[$scope.imglist.rowno] );
                $scope.iaction.cropReset(function(imgObj){
                    $scope.iaction.cropDivReset( $("div.wliu-image-crop", "#" + $scope.targetid) );
                    $scope.$apply();
                });
            }

        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag({ fade:false, movable: true, title: sc.title?sc.title:"Image Eidtor"});
                
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
