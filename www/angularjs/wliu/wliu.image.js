var wliu_image = angular.module("wliuImage",[]);

/****** Filter  ******/
/** label, textbox, select, bool, datetime, date, time */
wliu_image.directive("image.viewer", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
            targetid:       "@",
            title:          "@"
        },
        template: [
                    '<div id="{{targetid}}" class="wliu-diag" style="min-width:200px;min-height:200px;">',
                        '<div class="wliu-diag-content" style="padding:0px;">',
                            
                            '<div ng-if="imglist.list[imglist.rowno].error.errorCode">',
                                '{{imglist.list[imglist.rowno].error.errorMessage}}',
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
