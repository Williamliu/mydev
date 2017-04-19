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

wliu_image.directive("image.list", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:        "=",
            ww:             "@",
            hh:             "@",  // only for ratio
            view:           "@",  // only for show or hide , not for "image resize type"
            text:           "@",
            tooltip:        "@"
        },
        template: [
                    '<div style="display:block;position:relative;padding:2px;" imglist targetid="{{targetid}}" viewerid="{{viewerid}}">',
                        '<!---- img box ------------------------------------------------------------------------------------------------>',
                        '<div style="display:inline-block;position:relative;margin:2px 4px;overflow:hidden;" imgid="{{imgObj.id}}" class="image-item" ',
                                'ng-repeat="imgObj in imglist.rows"',
                        '>',
                            '<span ng-if="imglist.config.mode==\'edit\'">',                            
                                '<span style="position:absolute;color:red;margin-top:3px;margin-left:60px">{{imgObj.orderno}}</span>',
                                '<a class="wliu-btn24 wliu-btn24-img-print" ng-click="printImage(imgObj)" style="position:absolute; margin-top:3px;margin-left:3px;opacity:0.8;" ',
                                    //'title="{{tooltip?\'\':\'Print Image\'}}" ',
                                    'popup-target="#imglist_common_tooltip" popup-placement="down" popup-toggle="hover" popup-body="Print Image" ',
                                '>',
                                '</a>',
                                '<a class="wliu-btn24 wliu-btn24-comments" ng-click="textImage(imgObj)" style="position:absolute; margin-top:3px;margin-left:30px;opacity:0.8;" ',
                                    //'title="{{tooltip?\'\':\'Image Comments\'}}" ',
                                    'popup-target="#imglist_common_tooltip" popup-placement="down" popup-toggle="hover" popup-body="Image Comments" ',
                                '>',
                                '</a>',
                                '<a class="wliu-btn24 wliu-btn24-download" ng-if="imgObj.url" href="{{imgObj.url}}" style="position:absolute; margin-top:3px;margin-left:56px;opacity:0.8;" target="_blank" ',
                                    //'title="{{tooltip?\'\':\'Download Image\'}}" ',
                                    'popup-target="#imglist_common_tooltip" popup-placement="down" popup-toggle="hover" popup-body="Download Image" ',
                                '>',
                                '</a>',
                                '<a class="wliu-btn24 wliu-btn24-dispose" ng-click="deleteImage(imgObj)" style="position:absolute; right:0px; margin-top:3px;margin-right:3px;opacity:0.8;" ',
                                    //'title="{{tooltip?\'\':\'Delete Image\'}}" ',
                                    'popup-target="#imglist_common_tooltip" popup-placement="down" popup-toggle="hover" popup-body="Delete Image" ',
                                '>',
                                '</a>',
                            '</span>',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;box-sizing:content-box;border:1px solid #cccccc;border-radius:5px;" class="img-content wliu-background-1">',
                                    '<img class="img-responsive" width="100%" ng-click="clickImage(imgObj)" onload="imageAutoFix(this)" ww="{{ww}}" hh="{{hh}}" style="cursor:pointer;" src="{{imglist.thumbImageData(imgObj)}}" title="click to view image" />',
                                '</div>',
                            '</div>',
                            '<div ng-if="text" style="display:block;text-align:center;width:{{ww}}px;padding-top:6px;height:16px;line-height:16px;box-sizing:content-box;font-size:14px;cursor:pointer;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;" class="image-detail-tooltips" ',
                                 'popup-target="{{detailTips}}" popup-placement="up" popup-toggle="hover" popup-body="{{displayDetail(imgObj)}}" targetid="{{detailTipsID}}" ',
                            '>',
                                '{{displayTitle(imgObj)}}',
                            '</div>',
                        '</div>',

                        '<div ng-if="imglist.rows.length<imglist.config.max_length && imglist.config.mode==\'edit\'" style="display:inline-block;position:relative;margin:2px 4px;overflow:hidden;">',
                            '<div style="display:table;">',
                                '<div style="display:table-cell;vertical-align:middle;text-align:center;width:{{ww}}px;height:{{hh}}px;box-sizing:content-box;border:1px solid #cccccc;border-radius:5px;font-size:18px;font-weight:700;color:#666666" class="wliu-background-1">',
                                    '<input type="file" style="display:block; position:absolute; opacity:0;top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" value="Browse..." ',
                                        'onchange="angular.element(this).scope().selectFile(event);" />',
                                    'Add Image',
                                '</div>',
                            '</div>',
                            '<div ng-if="text" style="display:block;text-align:center;height:20px;">&nbsp;</div>',
                        '</div>',
                        '<!---// img box ---------------------------------------------------------------------------------------------->',

                        '<div ng-if="text" id="{{detailTipsID}}" wliu-popup image-popup disposable></div>',
                '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.imglist.common_tooltip = "imglist_common_tooltip";

            $scope.detailTipsID = $scope.imglist.scope + "_" + guid();
            $scope.detailTips = "#" + $scope.detailTipsID;
            
            $scope.ww           = $scope.ww?$scope.ww:"100";
            $scope.hh           = $scope.hh?$scope.hh:"100";
            $scope.displayTitle = function(imgObj) {
                return imgObj["title_" + $scope.imglist.lang];
            }
            $scope.displayDetail = function(imgObj) {
                var detail_str = imgObj["title_" + $scope.imglist.lang]?"<center>" + imgObj["title_" + $scope.imglist.lang] + "</center>":"";
                detail_str = detail_str.join("<hr>", imgObj["detail_" + $scope.imglist.lang]?imgObj["detail_" + $scope.imglist.lang].nl2br():"");
                return detail_str;
            }
            $scope.selectFile = function(event) {
                var newImg       = new WLIU.IMAGE({guid: guid(), token:guid()});
                files = (event.srcElement || event.target).files;
                
                var view = $scope.imglist.config.thumb?$scope.imglist.config.thumb:"tiny";
                FIMAGE.view = view;
                
                FIMAGE.allowSize = parseInt($scope.imglist.config.max_size)>0 && ($scope.imglist.config.max_size)<GCONFIG.max_upload_size?parseInt($scope.imglist.config.max_size):GCONFIG.max_upload_size;
                FIMAGE.allowType = (""+$scope.imglist.config.allow_type).toArray(",","upper");
                FIMAGE.fromFile(newImg, files[0], null, function(fObj){
                    if(fObj.errorCode) {
                        alert(fObj.errorMessage);
                    } else {
                        $scope.imglist.addImage(newImg);
                    }
                });
            }
            
            $scope.printImage = function(imgObj) {
                FFILE.exportDataURL( $scope.imglist.viewImageData(imgObj) );
            }
            $scope.clickImage = function(imgObj) {
                if( $scope.view ) {
                    $scope.imglist.current = imgObj.guid;
                    if($scope.imglist.config.mode=="edit") {
                        $($scope.imglist.imgEditor).trigger("ishow");
                    } else {
                        $($scope.imglist.imgViewer).trigger("ishow");
                    }
                }
            }
            $scope.textImage = function(imgObj) {
                $scope.imglist.current = imgObj.guid;
                imgObj.status=imgObj.status=="1"?true:false;
                $($scope.imglist.infoEditor).trigger("show");
            }
            $scope.deleteImage = function(imgObj) {
                if( confirm("Delete image, are you sure?") )
                    $scope.imglist.deleteImage(imgObj);
            }
        },
        link: function (sc, el, attr) {
            $(function(){
                if( $("#" + sc.imglist.common_tooltip).length <= 0 ) {
                    $("body").append('<div id="' + sc.imglist.common_tooltip + '" wliu-popup></div>');
                    $("#" + sc.imglist.common_tooltip).wliuPopup();
                }
          
                $("body > div[image-popup][disposable]").each(function(img_idx, img_detail) {
                    if( $("div.image-detail-tooltips[targetid='" + $(img_detail).attr("id") + "']").length<=0 ) $(img_detail).remove();
                });

                $("body>" + sc.detailTips).remove();
                $(sc.detailTips).appendTo("body");

                $(sc.detailTips).wliuPopup({});
             
             
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

wliu_image.directive("image.editor", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            imglist:         "=",
            targetid:       "@",
            title:          "@",
            view:           "@",
            ww:             "@",
            hh:             "@"
        },
        template: [
                    '<div id="{{targetid}}" wliu-diag movable maskable fade>',
                        '<div wliu-diag-head>{{title}}</div>',
                        '<div wliu-diag-body>',
                            
                            '<div ng-if="imglist.getCurrent().errorCode">',
                                '{{imglist.getCurrent().errorMessage}}',
                            '</div>',
                            '<div ng-if="!imglist.getCurrent().errorCode">',
                                '<div style="min-height:300px;">',
                                    '<div class="wliu-image-frame" style="position:relative;">',
                                        '<img class="img-responsive" width="100%" ww="{{ww}}" hh="{{hh}}" style="cursor:pointer;" src="{{ imglist.currentViewData() }}" />',
                                        '<div class="wliu-image-crop">',
                                            '<div class="wliu-image-crop-h"></div>',
                                            '<div class="wliu-image-crop-v"></div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                                '<div style="text-align:center;">',

                                    '<button ng-click="reset()" title="Restore Image" class="btn btn-outline-success waves-effect pull-right {{ imglist.currentViewData()?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    '<a class="wliu-btn16 wliu-btn16-restore"></a>',
                                    ' Reset</button>',

                                    '<button ng-click="crop()" title="Crop Image" class="btn btn-outline-primary waves-effect pull-right {{ imglist.currentViewData()?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    '<a class="wliu-btn16 wliu-btn16-crop"></a>',
                                    ' Crop</button>',

                                    '<button ng-click="rotate()" title="Rotate Image" class="btn btn-outline-primary waves-effect pull-right {{ imglist.currentViewData()?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    '<a class="wliu-btn16 wliu-btn16-rotate-right"></a>',
                                    ' Rotate</button>',

                                    '<button ng-click="save()" title="Upload Image" class="btn btn-outline-secondary pull-left waves-effect {{ imglist.currentViewData()?\'\':\'disabled\' }}" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    '<a class="wliu-btn16 wliu-btn16-okey"></a>',
                                    ' Save</button>',
                                    /*
                                    '<button ng-click="dispose()" title="Cancel Upload" class="btn btn-outline-warning pull-left waves-effect" style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                    '<a class="wliu-btn16 wliu-btn16-dispose"></a>',
                                    ' Cancel</button>',
                                    */
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.title    = $scope.title?$scope.title:"Image Editor";
            $scope.ww       = $scope.ww?$scope.ww:"400";
            //$scope.hh     = $scope.hh?$scope.hh:"400";

            $scope.rotate = function() {
                var view = $scope.imglist.config.view?$scope.imglist.config.view:"medium";
                FIMAGE.view = view;
                FIMAGE.rotate($scope.imglist.getCurrent(), null, function(oImg){
                    $scope.$apply();
                    $scope.imglist.sc.$apply();
                    $("#"+$scope.targetid).trigger("ishow");
                });
            }

            $scope.crop = function() {
                var view = $scope.imglist.config.view?$scope.imglist.config.view:"medium";
                FIMAGE.view = view;
                FIMAGE.cropDiv($scope.imglist.getCurrent(), $("div.wliu-image-frame", "#" + $scope.targetid), $("div.wliu-image-crop", "#" + $scope.targetid), null, function(oImg){
                    $scope.$apply();
                    $scope.imglist.sc.$apply();
                    $("#"+$scope.targetid).trigger("ishow");
                });
            }

            $scope.reset = function() {
                var view = $scope.imglist.config.view?$scope.imglist.config.view:"medium";
                FIMAGE.view = view;
                FIMAGE.cropReset($scope.imglist.getCurrent(), null, function(oImg){
                    $scope.$apply();
                    $scope.imglist.sc.$apply();
                    $("#"+$scope.targetid).trigger("ishow");
                });
            }

            $scope.save = function() {
                $scope.imglist.saveImage($scope.imglist.getCurrent(), function(){
                    $("#" + $scope.targetid).trigger("hide");
                });
            }

            $scope.dispose = function() {
                $scope.reset();
                $("#" + $scope.targetid).trigger("hide");
            }

        },
        link: function (sc, el, attr) {
            $(function(){

                $(el).wliuDiag({});
                /*********************************************************/
                $(el).unbind("ishow").bind("ishow", function(evt){
                    $(el).trigger("show");
                    FIMAGE.cropDivReset( $("div.wliu-image-crop", el) );
                    var click_flag = true;
                    $("img", el).unbind("load").bind("load", function(ev){
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
                                $(el).trigger("show");
                                FIMAGE.cropDivReset( $("div.wliu-image-crop", el) );
                            }
                    });

                });
                /*********************************************************/
                var ratio = 0;
                if( sc.ww && sc.hh ) {
                    var ratio = parseInt(sc.ww)/parseInt(sc.hh);
                } 

                $("div.wliu-image-crop", el).draggable({
                    containment: "parent"
                });
				$("div.wliu-image-crop", el).resizable({ 
                    aspectRatio: ratio,
                    containment: "parent"
   			    });
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
                        '<div wliu-diag-body border style="width:400px;">',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Title-EN</span><br>',
                                    '<input type="textbox" ng-model="imglist.getCurrent().title_en" style="width:100%;" />',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Description-EN</span><br>',
                                    '<textarea ng-model="imglist.getCurrent().detail_en" style="width:100%;height:60px;"></textarea>',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Title-CN</span><br>',
                                    '<input type="textbox" ng-model="imglist.getCurrent().title_cn" style="width:100%;" />',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-12">',
                                    '<span class="wliuCommon-label">Description-CN</span><br>',
                                    '<textarea ng-model="imglist.getCurrent().detail_cn" style="width:100%;height:60px;"></textarea>',
                                '</div>',
                            '</div>',
                            '<div class="row">',
                                '<div class="col-md-2 text-md-right">',
                                    '<span class="wliuCommon-label">Status</span>',
                                '</div>',
                                '<div class="col-md-4 text-md-left">',
                                    '<input id="{{targetid}}_status" type="checkbox" ng-model="imglist.getCurrent().status" /> <label for="{{targetid}}_status">Active</label>',
                                '</div>',
                                '<div class="col-md-4 text-md-right">',
                                    '<span class="wliuCommon-label">Order</span>',
                                '</div>',
                                '<div class="col-md-2 text-md-left">',
                                    '<input type="textbox" ng-model="imglist.getCurrent().orderno" style="width:100%;text-align:center;" />',
                                '</div>',
                            '</div>',

                            '<center>',
                                '<button ng-click="save()" title="Save" class="btn btn-lg btn-outline-success waves-effect" ',
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
            $scope.save = function() {
                //var rowidx = FCOLLECT.indexByKV( $scope.imglist.rows, {id: imgObj.id});
                $scope.imglist.saveText( $scope.imglist.getCurrent(), { ajaxAfter:
                    function(oImg){
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
                            '<a class="wliu-btn24 wliu-btn24-nav-left" ng-click="navLeft()" ng-show="imglist.navLeftState()" style="position:absolute;left:2px;opacity:0.6;top:45%;z-index:99;"></a>',
                            '<div wliu-diag-body style="text-align:center;">',
                                    '<img class="img-responsive" width="100%" ww="{{ww}}" hh="{{hh}}" src="{{imglist.currentViewData()}}" />',
                            '</div>',
                            '<a class="wliu-btn24 wliu-btn24-nav-right" ng-click="navRight()" ng-show="imglist.navRightState()" style="position:absolute;right:2px;opacity:0.6;top:45%;z-index:99;"></a>',
                        '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.ww = $scope.ww?$scope.ww:600;
            $scope.hh = $scope.hh?$scope.hh:600;
            $scope.navLeft = function() {
                $scope.imglist.navLeft( function(oImg) {
                    $("#" + $scope.targetid).trigger("ishow");
                });
            }
            $scope.navRight = function() {
                $scope.imglist.navRight( function(oImg) {
                    $("#" + $scope.targetid).trigger("ishow");
                });
            }

        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                //onload="imageAutoFix(this)"
                $(el).unbind("ishow").bind("ishow", function(evt){
                    $(el).trigger("show");
                    var click_flag = true;
                    $("img", el).unbind("load").bind("load", function(ev){
                            var img = ev.target;
                            var i_ww = img.naturalWidth;
                            var i_hh = img.naturalHeight;
                            var img_rate = i_hh / i_ww;

                            var c_ww = 100;
                            var c_hh = 100;
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
                                $(el).trigger("show");
                            }
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


wliu_image.directive("image.esign", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            table:          "=",  // table of form is ok;
            name:           "@",
            targetid:       "@",
            ww:             "@",
            hh:             "@"
        },
        template: [
                        '<div id="{{targetid}}" wliu-diag maskable fade>',
                            '<div wliu-diag-body>',
                                '<span style="display:block;color:blue;">Please Sign Your Name</span>',
                                '<canvas id="can" width="{{ww}}" height={{hh}} style="border:2px solid #666666;"></canvas>',
                                '<div style="text-align:center;">',
                                    '<button ng-click="save()" title="Save" class="btn btn-lg btn-outline-success waves-effect" ',
                                            'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                            ' Confirm',
                                    '</button>',
                                    '<button ng-click="clear()" title="Close" class="btn btn-lg btn-outline-danger waves-effect" ',
                                            'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                            ' Clear',
                                    '</button>',
                                    '<button ng-click="cancel()" title="Close" class="btn btn-lg btn-outline-info waves-effect" ',
                                            'style="display:inline-block;position:relative;text-transform:none;height:20px;line-height:20px;padding:2px 8px;margin:0px 2px;">',
                                            ' Cancel',
                                    '</button>',
                                '</div>',
                            '</div>',
                        '</div>'
                ].join(''),
        controller: function ($scope) {
            $scope.ww = $scope.ww?$scope.ww:640;
            $scope.hh = $scope.hh?$scope.hh:480;

            $scope.save  = function() {
                $scope.mycan.save();
            }
            $scope.clear = function() {
              $scope.mycan.clear();  
            }
            $scope.cancel = function() {
                $scope.clear();
                $("#" + $scope.targetid).trigger("hide");
            }

        },
        link: function (sc, el, attr) {
            $(function(){
                $(el).wliuDiag();
                sc.mycan = new WLIU.CANVAS({ canvas: $("canvas", el).get(0) });
                sc.mycan.init();
            });
        }
    }
});
