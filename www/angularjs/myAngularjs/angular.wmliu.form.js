var wmliu_form = angular.module("wmliuForm",  ["ngSanitize"]);
wmliu_form.directive("wmliu.form", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            name: "@",
            loading: "@"
            //buttonclick: "&" - can not pass parameter because it is in isolated scope
        },
        template: [
                    '<span>',
        //'<span style="color:{{form.head.error?\'red\':\'green\'}};">{{form.head.errorMessage}}</span>',
                    '<ng-form ng-transclude novalidate></ng-form>',
                   '</span>'
                   ].join(''),
        controller: function ($scope) {
            $scope.form.name = $scope.name;
            $scope.form.detail.head.loading = $scope.loading;

            $scope.form.listTables 				= $scope.form.listTables ? $scope.form.listTables : {};
			$scope.form.listTables.checklist 	= $scope.form.listTables.checklist ? $scope.form.listTables.checklist : {};
			$scope.form.listTables.clist 		= $scope.form.listTables.clist ? $scope.form.listTables.clist : {};
			$scope.form.listTables.vlist 		= $scope.form.listTables.vlist ? $scope.form.listTables.vlist : {};
			$scope.form.listTables.tablelist 	= $scope.form.listTables.tablelist ? $scope.form.listTables.tablelist : {};
			
            $scope.form.detail = $scope.form.detail ? $scope.form.detail : {};
            $scope.form.schema.idvals = $scope.form.schema.idvals ? $scope.form.schema.idvals : {};
            $scope.form.detail.vals = $scope.form.detail.vals ? $scope.form.detail.vals : {};
            $scope.form.olddetail = $scope.form.olddetail ? $scope.form.olddetail : angular.copy($scope.form.detail.vals);

            wmliuFormService.init[$scope.form.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.form.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.form.schema.idvals.sid = idvals.sid;
                    }
                }

                $scope.form.detail.head.action = "init";
                $scope.form.detail.head.state = "none";
                $scope.form.detail.head.loading = 1;
                wmliuFormService.formAjax($scope.form, $scope.form.detail.head.action, $scope);
            }

            wmliuFormService.fresh[$scope.form.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.form.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.form.schema.idvals.sid = idvals.sid;
                    }
                }

                $scope.form.detail.head.action = "fresh";
                $scope.form.detail.head.state = "load";
                $scope.form.detail.head.loading = 1;
                wmliuFormService.formAjax($scope.form, $scope.form.detail.head.action, $scope);
            }

            wmliuFormService.load[$scope.form.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.form.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.form.schema.idvals.sid = idvals.sid;
                    }
                }

                $scope.form.detail.head.action = "load";
                $scope.form.detail.head.state = "load";
                $scope.form.detail.head.loading = 1;
                wmliuFormService.formAjax($scope.form, $scope.form.detail.head.action, $scope);
            }


            wmliuFormService.clear[$scope.form.name] = function () {
                $scope.form.schema.idvals.pid = "";
                $scope.form.schema.idvals.sid = "";

                $scope.form.detail.head.action = "init";
                $scope.form.detail.head.state = "none";
                $scope.form.detail.head.loading = 1;
                $scope.form.detail.vals = {};
            }
			
			/*
            wmliuFormService.clearLinkVals[$scope.form.name] = function () {
                $scope.form.linkvals = $scope.form.linkvals || {};
                for (var key in $scope.form.detail.cols) {
                    var colObj = $scope.form.detail.cols[key];
                    if (colObj["type"] == "treecheck" || colObj["type"] == "treeradio") {
                        $scope.form.linkvals[key] = $scope.form.linkvals[key] || {};
                        $scope.form.linkvals[key]["pptable"] = {};
                        $scope.form.linkvals[key]["tttable"] = {};
                        $scope.form.linkvals[key]["sstable"] = {};
                    }
                }
                $scope.form.oldlinkvals = angular.copy($scope.form.linkvals);
            }
			*/


            if ($scope.form.detail.head.loading == "1")
                wmliuFormService.fresh[$scope.form.name]();
            else
                wmliuFormService.init[$scope.form.name]();

            //wmliuFormService.clearLinkVals[$scope.form.name]();
        }
    }
});


wmliu_form.directive("form.hidden", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: '<span><input type="hidden" ng-model="form.detail.vals[col]" ng-disabled="form.detail.head.state==\'none\'" ng-change="changeState(col)" /></span>',
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 
            }
        }
    }
});


wmliu_form.directive("form.label", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: [ 
                    '<span class="wmliu-common-label">',
                        '<span class="wmliu-common-label-required" ng-if="form.detail.cols[col].required==\'1\'">*</span> ',
                        '<span  class="{{ form.detail.cols[col].errorMessage?\'wmliu-common-label-invalid\':\'\' }}" ',
                                'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                            '{{form.detail.cols[col].title}}',
                        '</span> ',
                    '</span>'
                  ].join(''),
        controller: function ($scope) {
        }
    }
});


wmliu_form.directive("form.textbox", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
                    '<input type="textbox" ng-model="form.detail.vals[col]" ',
					'class="wmliu-common-input {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});

wmliu_form.directive("form.password", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            col: "@",
            form: "=",
            valuechange: "&"
        },
        template: [
                    '<span>',
                    '<input type="password" class="wmliu-common-input {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)" ng-model="form.detail.vals[col]" ng-disabled="form.detail.head.state==\'none\'" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                    '<br>',
                    '<input type="password" class="wmliu-common-input {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'placeholder="Confirm Password" style="margin-top:2px;" ',
                    'ng-change="changeState(col)" ng-model="form.detail.vals[col + \'_confirm\']" ng-disabled="form.detail.head.state==\'none\'" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /> ',
                    '<span>',
                  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.detail.vals[colName + '_confirm']) {
                    if ($scope.form.detail.vals[colName + '_confirm']) {
                        $scope.form.detail.cols[colName].error = 1;
                        $scope.form.detail.cols[colName].errorMessage = "Password doesn't match !";
                    } else {
                        $scope.form.detail.cols[colName].error = 0;
                        $scope.form.detail.cols[colName].errorMessage = "";
                        if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "update";
                        if ($scope.form.detail.head.state == "add") $scope.form.detail.head.state = "new";
                    }
                } else {
                    $scope.form.detail.cols[colName].error = 0;
                    $scope.form.detail.cols[colName].errorMessage = "";
                    if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "update";
                    if ($scope.form.detail.head.state == "add") $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});

wmliu_form.directive("form.textarea", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [ 
                    '<textarea ng-model="form.detail.vals[col]" ',
					'class="wmliu-common-textarea {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}">',
                    '</textarea>'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 
            }
        }
    }
});


wmliu_form.directive("form.bool", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
			'<span style="white-space:nowrap;">',
                    '<label ',
					'class="{{ form.detail.vals[col]?\'wmliu-common-input-checked\':\'\' }} {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}">',
                    '<input type="checkbox" ng-model="form.detail.vals[col]" ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                    '{{ form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}',
                    '</label>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 
            }
        }
    }
});


wmliu_form.directive("form.select", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
			    '<select ng-model="form.detail.vals[col]" ng-options="sObj.key as sObj.title for sObj in form.listTables.checklist[col]" ',
            			'class="wmliu-common-select {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                        'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				        'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			        '<option value=""></option>',
                '</select>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
                    if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "update";
                    if ($scope.form.detail.head.state == "add") $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});


wmliu_form.directive("form.radio", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<div class="wmliu-common-checklist {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.checklist[col]">',
                    '<label     class="{{ form.detail.vals[col]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj.key" ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                        '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                    '</label>',
                    '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-focus="form.detail.vals[col]=\'\'" ',
                        'ng-disabled="form.detail.head.state==\'none\'" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',
          
            '</div>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 

                    if ($scope.form.detail.cols[colName]["other"]) {
                        if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != $scope.form.olddetail[$scope.form.detail.cols[colName]["other"]]) {
						    if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						    if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                        }
                    }
            }
        }
    }
});


wmliu_form.directive("form.radiocom", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<span><a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{form.name + col}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked {{ form.detail.cols[col].errorMessage && !form.listTables.vlist[col][form.detail.vals[col]] && !form.detail.vals[form.detail.cols[col][\'other\']] ?\'wmliu-common-error-message\':\'\' }}">',
                '{{ form.detail.cols[col].errorMessage && !form.listTables.vlist[col][form.detail.vals[col]]  && !form.detail.vals[form.detail.cols[col][\'other\']] ? form.detail.cols[col].errorMessage:',
                'form.listTables.vlist[col][form.detail.vals[col]] +  + (form.listTables.vlist[col][form.detail.vals[col]]?form.detail.vals[form.detail.cols[col][\'other\']]?\', \':\'\':\'\') + form.detail.vals[form.detail.cols[col][\'other\']] }}',
            '</span>',
            '<div id="lwhDivBox{{form.name + col}}" class="lwhDivBox">',

            '<div class="lwhDivBox-content {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.checklist[col]">',
                    '<label     class="{{ form.detail.vals[col]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj.key" ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                        '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                    '</label>',
                    '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-focus="form.detail.vals[col]=\'\'" ',
                        'ng-disabled="form.detail.head.state==\'none\'" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',
            
            '</div>',

            '</div>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 

                    if ($scope.form.detail.cols[colName]["other"]) {
                        if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != $scope.form.olddetail[$scope.form.detail.cols[colName]["other"]]) {
						    if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						    if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                        }
                    }
            }
        },
        link: function (sc, attr, ctr) {
            $(function () { 
                $("#lwhDivBox" + sc.form.name + sc.col).lwhDivBox(); 
                $(".lwhDivBox-Button").unbind("click.lwhDivBox").bind("click.lwhDivBox", function (ev) {
                    $("#" + $(this).attr("did")).divBoxShow();
                });
            });
        }
    }
});


// important:  radiodiag , radiolist  is  type: "radio",  only checklist :  ctable: ccol, stable, scol, sref 
wmliu_form.directive("form.radiolist", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<div class="wmliu-common-checklist {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.clist[col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label ',
                                'class="{{ form.detail.vals[col]==rdObj1.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                            '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj1.key" ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                            '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label>',
                        '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                    '</span>',
                '</div>',
                '<br ng-if="form.detail.cols[col].nowrap==1?true:false" />',
                '</span>',
            '</div>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 
            }
        }
    }
});

// important:  radiodiag , radiolist  is  type: "radio",  only checklist :  ctable: ccol, stable, scol, sref 
wmliu_form.directive("form.radiodiag", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<span><a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{form.name + col}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked {{ form.detail.cols[col].errorMessage && !form.listTables.vlist[col][form.detail.vals[col]]?\'wmliu-common-error-message\':\'\' }}">',
                '{{ form.detail.cols[col].errorMessage && !form.listTables.vlist[col][form.detail.vals[col]]?form.detail.cols[col].errorMessage:form.listTables.vlist[col][form.detail.vals[col]] }}',
            '</span>',
            '<div id="lwhDivBox{{form.name + col}}" class="lwhDivBox">',

        // radiolist below
            '<div class="lwhDivBox-content {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.clist[col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label ',
                                'class="{{ form.detail.vals[col]==rdObj1.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                            '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj1.key" ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                            '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label>',
                        '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                    '</span>',
                '</div>',
                '<br ng-if="form.detail.cols[col].nowrap==1?true:false" />',
                '</span>',
            '</div>',
        // end of radiolist

            '</div>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 
            }
        },
        link: function (sc, attr, ctr) {
            $(function () { 
                $("#lwhDivBox" + sc.form.name + sc.col).lwhDivBox(); 
                $(".lwhDivBox-Button").unbind("click.lwhDivBox").bind("click.lwhDivBox", function (ev) {
                    $("#" + $(this).attr("did")).divBoxShow();
                });
            });
        }
    }
});


wmliu_form.directive("form.checkbox", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<div class="wmliu-common-checklist {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="form.detail.vals[col]=form.detail.vals[col]?form.detail.vals[col]:{}; colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.checklist[col]">',
                    '<label  class="{{ form.detail.vals[col][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="checkbox" ng-model="form.detail.vals[col][rdObj.key]" ng-value="rdObj.key"  ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                        '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                    '</label>',
                    '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-disabled="form.detail.head.state==\'none\'" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',

            '</div>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != $scope.form.olddetail[$scope.form.detail.cols[colName]["other"]]) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                    }
                }
            }
        }
    }
});


wmliu_form.directive("form.checkcom", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<span><a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{form.name + col}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked" ng-bind-html="getText(form.detail.vals[col], col)"></span>',
            '<span ng-if="form.detail.cols[col].errorMessage && getText(form.detail.vals[col], col)==\'\'?true:false" style="color:red;">{{ form.detail.cols[col].errorMessage }}</span>',

            '<div id="lwhDivBox{{form.name + col}}" class="lwhDivBox">',



            '<div class="lwhDivBox-content {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="form.detail.vals[col]=form.detail.vals[col]?form.detail.vals[col]:{}; colnum=colnum?colnum:0;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',

                '<span ng-repeat="rdObj in form.listTables.checklist[col]">',
                    '<label  class="{{ form.detail.vals[col][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="checkbox" ng-model="form.detail.vals[col][rdObj.key]" ng-value="rdObj.key"  ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                        '{{rdObj.title?rdObj.title:rdObj.key.uword()}}',
                    '</label>',
                    '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-disabled="form.detail.head.state==\'none\'" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',

            '</div>',


            '</div>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
                    if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "update";
                    if ($scope.form.detail.head.state == "add") $scope.form.detail.head.state = "new";
                }

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != $scope.form.olddetail[$scope.form.detail.cols[colName]["other"]]) {
                        if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "update";
                        if ($scope.form.detail.head.state == "add") $scope.form.detail.head.state = "new";
                    }
                }
            }

            $scope.getText = function (ckObj, colName) {
                var str = '';
                var colnum1 = $scope.form.detail.cols[$scope.col].colnum ? $scope.form.detail.cols[$scope.col].colnum : 0;
                var cnt = 0;
                for (var key in ckObj) {
                    if (ckObj[key]) {
                        if ($scope.form.listTables.vlist[$scope.col][key]) {
                            str += (str == '' ? '' : ', ') + $scope.form.listTables.vlist[$scope.col][key];
                            cnt++;
                        }
                    }
                    if (cnt > 0 && (cnt % colnum1 == 0)) {
                        str += "<br>";
                        cnt = 0;
                    }
                }

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]]) {
                        str += (str ? ', ' : '') + $scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]];
                    }
                }

                return str;
            }

        },
        link: function (sc, attr, ctr) {
            $(function () { 
                $("#lwhDivBox" + sc.form.name + sc.col).lwhDivBox(); 
                $(".lwhDivBox-Button").unbind("click.lwhDivBox").bind("click.lwhDivBox", function (ev) {
                    $("#" + $(this).attr("did")).divBoxShow();
                });
            });
        }
    }
});


// important:  checkdiag , checklist  is  type: "checkbox",  only checklist :  ctable: ccol, stable, scol, sref 
wmliu_form.directive("form.checklist", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<div class="wmliu-common-checklist {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="form.detail.vals[col]=form.detail.vals[col]?form.detail.vals[col]:{}; colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.clist[col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label  class="{{ form.detail.vals[col][rdObj1.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword() }}">',
                            '<input type="checkbox" ng-model="form.detail.vals[col][rdObj1.key]" ng-value="rdObj1.key"  ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                            '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label>',
                        '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                    '</span>',
                '</div>',
                '<br ng-if="form.detail.cols[col].nowrap==1?true:false" />',
                '</span>',
            '</div>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});

// important:  checkdiag , checklist  is  type: "checkbox",  only checklist :  ctable: ccol, stable, scol, sref 
wmliu_form.directive("form.checkdiag", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@",
            valuechange: "&"
        },
        template: [
            '<span><a class="lwhDivBox-Button wmliu-common-icon20 wmliu-common-icon20-search" did="lwhDivBox{{form.name + col}}" title="Please Select"></a> ',
            '<span class="wmliu-common-input-checked" ng-bind-html="getText(form.detail.vals[col])"></span>',
            '<span ng-if="form.detail.cols[col].errorMessage && getText(form.detail.vals[col])==\'\'?true:false" style="color:red;">{{ form.detail.cols[col].errorMessage }}</span>',
            
            '<div id="lwhDivBox{{form.name + col}}" class="lwhDivBox">',

        // checklist below
            '<div class="lwhDivBox-content {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="form.detail.vals[col]=form.detail.vals[col]?form.detail.vals[col]:{}; colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.clist[col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label  class="{{ form.detail.vals[col][rdObj1.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword() }}">',
                            '<input type="checkbox" ng-model="form.detail.vals[col][rdObj1.key]" ng-value="rdObj1.key"  ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                            '{{rdObj1.title?rdObj1.title:rdObj1.key.uword()}}',
                        '</label>',
                        '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                    '</span>',
                '</div>',
                '<br ng-if="form.detail.cols[col].nowrap==1?true:false" />',
                '</span>',
            '</div>',
        // end of checklist

            '</div>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }

            $scope.getText = function (ckObj) {
                var str = '';
                var colnum1 = $scope.form.detail.cols[$scope.col].colnum?$scope.form.detail.cols[$scope.col].colnum:0;
                var cnt = 0;
                for (var key in ckObj) {
                    if (ckObj[key]) {
                        str += (str == '' ? '' : ', ') + $scope.form.listTables.vlist[$scope.col][key];
                        cnt++;
                    }
                    if (cnt > 0 && (cnt % colnum1 == 0)) {
                        str += "<br>";
                        cnt = 0;
                    }
                }
                return str;
            }
        },
        link: function (sc, attr, ctr) {
            $(function () { 
                $("#lwhDivBox" + sc.form.name + sc.col).lwhDivBox(); 
                $(".lwhDivBox-Button").unbind("click.lwhDivBox").bind("click.lwhDivBox", function (ev) {
                    $("#" + $(this).attr("did")).divBoxShow();
                });
            });
        }
    }
});

wmliu_form.directive("form.ymdtext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: '<span ng-bind="form.detail.vals[col]"></span>',
        controller: function ($scope) {
        }
    }
});

wmliu_form.directive("form.hitext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: '<span ng-bind="form.detail.vals[col]"></span>',
        controller: function ($scope) {
        }
    }
});

wmliu_form.directive("form.ymdhitext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: '<span ng-bind="form.detail.vals[col]"></span>',
        controller: function ($scope) {
        }
    }
});

wmliu_form.directive("form.datetimetext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: '<span ng-bind="form.detail.vals[col]"></span>',
        controller: function ($scope) {
        }
    }
});

wmliu_form.directive("form.text", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: '<span ng-bind="form.detail.vals[col]"></span>',
        controller: function ($scope) {
        }
    }
});

wmliu_form.directive("form.cktext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            colnum: "@"
        },
        template: [
                    '<span class="wmliu-common-input-checked" ng-bind-html="getCKText(form.detail.vals, form.detail.cols[col])"></span>'
				  ].join(''),
        controller: function ($scope) {
            $scope.getCKText = function (vals, colObj) {
                var str = '';
                var colnum1 = colObj.colnum ? colObj.colnum : 0;
                var cnt = 0;
                for (var key in vals[$scope.col]) {
                    if (vals[$scope.col][key]) {
                        if ($scope.form.listTables.vlist[$scope.col][key]) {
                            str += (str ? ', ' : '') + $scope.form.listTables.vlist[$scope.col][key];
                            cnt++;
                        }
                    }
                    if (cnt > 0 && (cnt % colnum1 == 0)) {
                        str += "<br>";
                        cnt = 0;
                    }
                }

                if (colObj.other) {
                    if (vals[colObj.other]) {
                        str += (str != '' ? ', ' : '') + vals[colObj.other];
                    }
                }
                return str;
            }
        }
    }
});

wmliu_form.directive("form.ptext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: [	'<span>',
                        '<span  style="{{ form.detail.cols[col].errorMessage?\'color:red;\':\'\' }}" ',
					            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}">',
                            '{{ form.detail.cols[col].errorMessage? form.detail.cols[col].errorMessage:form.schema.idvals[col] }}',
                        '</span>',
                    '</span>'
				  ].join(''),
        controller: function ($scope) {
        }
    }
});

wmliu_form.directive("form.vtext", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: [
                    '<span class="wmliu-common-input-checked">',
                        '<span  style="{{ form.detail.cols[col].errorMessage?\'color:red;\':\'\' }}" ',
					            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}">',
                                '{{ getVText(form.detail.vals, form.detail.cols[col]) }}',
                        '</span>',
                    '</span>'
				  ].join(''),
        controller: function ($scope) {
            $scope.getVText = function (vals, colObj) {
                var str = '';
                if (colObj.errorMessage) {
                    str = colObj.errorMessage;
                } else {
                    if (vals[$scope.col]) {
                        if( $scope.form.listTables.vlist[$scope.col][vals[$scope.col]] ) {
                            str = $scope.form.listTables.vlist[$scope.col][vals[$scope.col]];
                        }
                    }

                    if ( colObj.other ) {
                        if ( vals[colObj.other] ) {
                            str += (str != '' ? ', ' : '') + vals[colObj.other];
                        }
                    }
                }

                return str;
            }
        }
    }
});

wmliu_form.directive("form.datetype", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
                '<div class="wmliu-common-checklist-box1">',

                    '<div>',
                        '{{ trans[form.detail.head.lang].words[\'start_time\'] }}: ',
                        '<input type="text" class="wmliu-common-time {{ form.detail.cols[form.detail.cols[col].start_time].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" title="{{ form.detail.cols[form.detail.cols[col].start_time].errorMessage?form.detail.cols[form.detail.cols[col].start_time].errorMessage:\'\' }}" ',
                                'ng-model="form.detail.vals[form.detail.cols[col].start_time]" ng-change="changeState(form.detail.cols[col].start_time);" ng-disabled="form.detail.head.state==\'none\'" ',
                                'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" />',			        

                        ' <b>~</b> ',
                        '{{ trans[form.detail.head.lang].words[\'end_time\'] }}: ',
                        '<input type="text" class="wmliu-common-time {{ form.detail.cols[form.detail.cols[col].end_time].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" title="{{ form.detail.cols[form.detail.cols[col].end_time].errorMessage?form.detail.cols[form.detail.cols[col].end_time].errorMessage:\'\' }}" ',
                                'ng-model="form.detail.vals[form.detail.cols[col].end_time]" ng-change="changeState(form.detail.cols[col].end_time);" ng-disabled="form.detail.head.state==\'none\'" ',
                                'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" />',			        

                    '</div>',

                    '<div style="margin-top:5px;" class="{{ form.detail.cols[form.detail.cols[col].date_type].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" title="{{ form.detail.cols[form.detail.cols[col].date_type].errorMessage?form.detail.cols[form.detail.cols[col].date_type].errorMessage:\'\' }}">',
				        '{{ trans[form.detail.head.lang].words[\'sch_type\'] }}:',
					    '<label ng-repeat="rdObj in basic[form.detail.head.lang].dateType" style="margin-left:20px;" class="{{ form.detail.vals[form.detail.cols[col].date_type]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}">',
                            '<input type="radio" ng-model="form.detail.vals[form.detail.cols[col].date_type]" ng-value="rdObj.key"  ng-change="changeState(form.detail.cols[col].date_type)" ng-disabled="form.detail.head.state==\'none\'" />',
                            '{{rdObj.title}}',
                        '</label>',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Once\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].once_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].once_date].errorMessage?form.detail.cols[form.detail.cols[col].once_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].once_date]" ng-change="changeState(form.detail.cols[col].once_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Daily\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'start_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?form.detail.cols[form.detail.cols[col].start_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].start_date]"  ng-change="changeState(form.detail.cols[col].start_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                            ' <b>~</b> ',
                            '{{ trans[form.detail.head.lang].words[\'end_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?form.detail.cols[form.detail.cols[col].end_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].end_date]" ng-change="changeState(form.detail.cols[col].end_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Weekly\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'start_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?form.detail.cols[form.detail.cols[col].start_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].start_date]"  ng-change="changeState(form.detail.cols[col].start_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                            ' <b>~</b> ',
                            '{{ trans[form.detail.head.lang].words[\'end_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?form.detail.cols[form.detail.cols[col].end_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].end_date]" ng-change="changeState(form.detail.cols[col].end_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',

                            '<br><br>',
						    '<div class="{{ form.detail.cols[form.detail.cols[col].date_sets].errorMessage?\'wmliu-common-input-invalid\':\'\'}}">',
	                            '<label ng-repeat="rdObj1 in basic[form.detail.head.lang].day_short" ',
		                            'class="{{ form.detail.vals[col][\'wdates\'][$index]?\'wmliu-common-input-checked\':\'\' }}" style="margin-right:5px;">',
                                    '<input type="checkbox" ng-model="form.detail.vals[col][\'wdates\'][$index]"   ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" />',
                                    '{{rdObj1}}',
    	                        '</label>',
						    '</div>',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Monthly\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'start_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?form.detail.cols[form.detail.cols[col].start_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].start_date]"  ng-change="changeState(form.detail.cols[col].start_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                            ' <b>~</b> ',
                            '{{ trans[form.detail.head.lang].words[\'end_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?form.detail.cols[form.detail.cols[col].end_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].end_date]" ng-change="changeState(form.detail.cols[col].end_date);" ng-disabled="form.detail.head.state==\'none\'" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',

                            '<br><br>',

						    '<div class="{{form.detail.cols[form.detail.cols[col].date_sets].errorMessage?\'wmliu-common-input-invalid\':\'\'}}">',
                        	    '<span ng-repeat="rdObj1 in basic[form.detail.head.lang].days">',
								    '<label class="{{ form.detail.vals[col][\'mdates\'][rdObj1]?\'wmliu-common-input-checked\':\'\' }}" style="display:inline-block; width:40px;">',
                            		    '<input type="checkbox" ng-model="form.detail.vals[col][\'mdates\'][rdObj1]"  ng-change="changeState(col)" ng-disabled="form.detail.head.state==\'none\'" />',
                            		    '{{rdObj1}}',
                        		    '</label>',
								    '<br ng-if="($index+1)%10==0" />',
							    '</span>',
								'<label class="{{ form.detail.vals[col][\'mdates\'][31]?\'wmliu-common-input-checked\':\'\' }}">',
                            		'<input type="checkbox" ng-model="form.detail.vals[col][\'mdates\'][31]"  ng-change="changeState(col)" />',
                            		'{{trans[form.detail.head.lang].words[\'last_date\']}}',
                        		'</label>',
						    '</div>',
                    '</div>',

                '</div>'

				  ].join(''),
        controller: function ($scope) {
			$scope.basic = gcommon.basic; 
			$scope.trans = gcommon.trans; 
            $scope.changeState = function (colName) {
					if( $scope.form.detail.vals[colName] != $scope.form.olddetail[colName] ) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
					} 
            }
        },
        link: function (sc, el, attrs) {
            $(function () {
                $(".wmliu-common-date", el).datepicker({
                    dateFormat: 'yy-mm-dd',
                    showOn: "button",
                    buttonImage: "theme/light/image/icon/calendar.png",
                    buttonImageOnly: true
                });
            });

        }
    }
});


wmliu_form.directive("form.date", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            col: "@",
            form: "=",
            valuechange: "&"
        },
        template: [
                    '<input type="textbox" id="{{form.name}}{{col}}" ng-model="form.detail.vals[col]" ',
					'class="wmliu-common-date {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != $scope.form.olddetail[colName]) {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        },
        link: function (sc, el, attrs) {
            $(function () {
                $("#" + attrs["id"]).datepicker({
                    dateFormat: 'yy-mm-dd',
                    showOn: "button",
                    buttonImage: "theme/light/image/icon/calendar.png",
                    buttonImageOnly: true
                });
            });

        }
    }
});


wmliu_form.directive("form.time", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
                    
                    '<input type="textbox" ng-model="form.detail.vals[col + \'_hh\']" ',
					'class="wmliu-common-time-hh {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" minlength="0" maxlength="2" placeholder="Hour" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 300, blur:0}}" /><b>:</b>',

                    '<input type="textbox" ng-model="form.detail.vals[col + \'_ii\']" ',
					'class="wmliu-common-time-ii {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" minlength="0" maxlength="2" placeholder="Min" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 300, blur:0}}" />',

                    '</span>'

				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_hh"] != $scope.form.olddetail[colName + "_hh"] || 
                    $scope.form.detail.vals[colName + "_ii"] != $scope.form.olddetail[colName + "_ii"] ) 
                {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});


wmliu_form.directive("form.time1", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
			        '<select ng-model="form.detail.vals[col + \'_hh\']" placeholder="Hr" ',
            			    'class="wmliu-common-date-hh {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			            '<option value=""></option>',
			            '<option value="1">01</option>',
			            '<option value="2">02</option>',
			            '<option value="3">03</option>',
			            '<option value="4">04</option>',
			            '<option value="5">05</option>',
			            '<option value="6">06</option>',
			            '<option value="7">07</option>',
			            '<option value="8">08</option>',
			            '<option value="9">09</option>',
			            '<option value="10">10</option>',
			            '<option value="11">11</option>',
			            '<option value="12">12</option>',
			            '<option value="13">13</option>',
			            '<option value="14">14</option>',
			            '<option value="15">15</option>',
			            '<option value="16">16</option>',
			            '<option value="17">17</option>',
			            '<option value="18">18</option>',
			            '<option value="19">19</option>',
			            '<option value="20">20</option>',
			            '<option value="21">21</option>',
			            '<option value="22">22</option>',
			            '<option value="23">23</option>',
                    '</select><b>:</b>',

			        '<select ng-model="form.detail.vals[col + \'_ii\']" placeholder="Mi" ',
            			    'class="wmliu-common-date-ii {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			            '<option value=""></option>',
			            '<option value="0">00</option>',
			            '<option value="5">05</option>',
			            '<option value="10">10</option>',
			            '<option value="15">15</option>',
			            '<option value="20">20</option>',
			            '<option value="25">25</option>',
			            '<option value="30">30</option>',
			            '<option value="35">35</option>',
			            '<option value="40">40</option>',
			            '<option value="45">45</option>',
			            '<option value="50">50</option>',
			            '<option value="55">55</option>',
                    '</select>',

                    '</span>'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_hh"] != $scope.form.olddetail[colName + "_hh"] || 
                    $scope.form.detail.vals[colName + "_ii"] != $scope.form.olddetail[colName + "_ii"] ) 
                {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});


wmliu_form.directive("form.dateymd", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
			        '<select ng-model="form.detail.vals[col + \'_mm\']" placeholder="Month" ',
            			    'class="wmliu-common-date-mm {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			            '<option value=""></option>',
			            '<option value="1">Jan</option>',
			            '<option value="2">Feb</option>',
			            '<option value="3">Mar</option>',
			            '<option value="4">Apr</option>',
			            '<option value="5">May</option>',
			            '<option value="6">Jun</option>',
			            '<option value="7">Jul</option>',
			            '<option value="8">Aug</option>',
			            '<option value="9">Sep</option>',
			            '<option value="10">Oct</option>',
			            '<option value="11">Nov</option>',
			            '<option value="12">Dec</option>',
                    '</select><b>-</b>',

			        '<select ng-model="form.detail.vals[col + \'_dd\']" placeholder="Day" ',
            			    'class="wmliu-common-date-dd {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			            '<option value=""></option>',
			            '<option value="1">1</option>',
			            '<option value="2">2</option>',
			            '<option value="3">3</option>',
			            '<option value="4">4</option>',
			            '<option value="5">5</option>',
			            '<option value="6">6</option>',
			            '<option value="7">7</option>',
			            '<option value="8">8</option>',
			            '<option value="9">9</option>',
			            '<option value="10">10</option>',
			            '<option value="11">11</option>',
			            '<option value="12">12</option>',
			            '<option value="13">13</option>',
			            '<option value="14">14</option>',
			            '<option value="15">15</option>',
			            '<option value="16">16</option>',
			            '<option value="17">17</option>',
			            '<option value="18">18</option>',
			            '<option value="19">19</option>',
			            '<option value="20">20</option>',
			            '<option value="21">21</option>',
			            '<option value="22">22</option>',
			            '<option value="23">23</option>',
			            '<option value="24">24</option>',
			            '<option value="25">25</option>',
			            '<option value="26">26</option>',
			            '<option value="27">27</option>',
			            '<option value="28">28</option>',
			            '<option value="29">29</option>',
			            '<option value="30">30</option>',
			            '<option value="31">31</option>',
                    '</select><b>-</b>',

                    '<input type="textbox" ng-model="form.detail.vals[col + \'_yy\']" ',
					'class="wmliu-common-date-yy {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" minlength="4" maxlength="4" placeholder="Year" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 300, blur:0}}" />',

                    '</span>'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_yy"] != $scope.form.olddetail[colName + "_yy"] || 
                    $scope.form.detail.vals[colName + "_mm"] != $scope.form.olddetail[colName + "_mm"] || 
                    $scope.form.detail.vals[colName + "_dd"] != $scope.form.olddetail[colName + "_dd"] ) 
                {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});

wmliu_form.directive("form.timehi", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
			        '<select ng-model="form.detail.vals[col + \'_hh\']" placeholder="Hr" ',
            			    'class="wmliu-common-date-hh {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			            '<option value=""></option>',
			            '<option value="1">01</option>',
			            '<option value="2">02</option>',
			            '<option value="3">03</option>',
			            '<option value="4">04</option>',
			            '<option value="5">05</option>',
			            '<option value="6">06</option>',
			            '<option value="7">07</option>',
			            '<option value="8">08</option>',
			            '<option value="9">09</option>',
			            '<option value="10">10</option>',
			            '<option value="11">11</option>',
			            '<option value="12">12</option>',
			            '<option value="13">13</option>',
			            '<option value="14">14</option>',
			            '<option value="15">15</option>',
			            '<option value="16">16</option>',
			            '<option value="17">17</option>',
			            '<option value="18">18</option>',
			            '<option value="19">19</option>',
			            '<option value="20">20</option>',
			            '<option value="21">21</option>',
			            '<option value="22">22</option>',
			            '<option value="23">23</option>',
                    '</select><b>:</b>',

			        '<select ng-model="form.detail.vals[col + \'_ii\']" placeholder="Mi" ',
            			    'class="wmliu-common-date-ii {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)"  ng-disabled="form.detail.head.state==\'none\'">',
			            '<option value=""></option>',
			            '<option value="0">00</option>',
			            '<option value="5">05</option>',
			            '<option value="10">10</option>',
			            '<option value="15">15</option>',
			            '<option value="20">20</option>',
			            '<option value="25">25</option>',
			            '<option value="30">30</option>',
			            '<option value="35">35</option>',
			            '<option value="40">40</option>',
			            '<option value="45">45</option>',
			            '<option value="50">50</option>',
			            '<option value="55">55</option>',
                    '</select>',

                    '</span>'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_hh"] != $scope.form.olddetail[colName + "_hh"] || 
                    $scope.form.detail.vals[colName + "_ii"] != $scope.form.olddetail[colName + "_ii"] ) 
                {
						if( $scope.form.detail.head.state == "view" ) $scope.form.detail.head.state = "update";
						if( $scope.form.detail.head.state == "add" ) $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});



wmliu_form.directive("form.intdate", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            col: "@",
            form: "=",
            format: "@"
        },
        template: [
                    '<span>{{ form.detail.vals[col]?form.detail.vals[col]>0?(form.detail.vals[col] * 1000 | date : (format?format:"yyyy-MM-dd hh:mm:ss") ):"":"" }}</span>'
				  ].join(''),
        controller: function ($scope) {
        }
    }
});


wmliu_form.directive("form.tablelist", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [
			    '<table cellspacing="0" cellpadding="2" class="wmliu-tablelist">',
            		'<tr class="header">',
						'<th ng-repeat="col in form.schema.tablelist[col][\'cols\']" ng-switch="col.type.toLowerCase()" ng-if="col.type!=\'hidden\'" title="{{col.desc?col.desc:col.title?col.title:col.col.uword()}}" style="white-space: nowrap;" align="center">',
						'<span ng-switch-when="iselect">',
							'<a class="selected" title="Please Select"></a>',
						'</span>',
						
						'<span ng-switch-default>',
							'{{col.title?col.title:col.col.uword()}}',	
						'</span>',
						'</th>',
					'</tr>',	
            		'<tr class="row {{form.detail.vals.tablelist[col][row.sid][\'selected\']?\'row-selected\':\'\'}}" ng-repeat="row in form.listTables.tablelist[col]" ng-init="row.sn=$index+1;" ',
					'ng-class-even="\'row-even\'" ng-class-odd="\'row-odd\'">',
						'<td 	ng-repeat="colObj in form.schema.tablelist[col][\'cols\']" ng-if="colObj.type!=\'hidden\'" ng-switch="colObj.type.toLowerCase()" ',
								'align="{{colObj.align}}" valign="{{colObj.valign}}" width="{{colObj.width}}" style="min-width:20px;">',
							'<span ng-switch-when="iselect">',
								'<input class="{{colObj.css}}" style="{{colObj.style}}" type="checkbox" class="{{form.detail.vals.tablelist[col][row.sid].errorMessage[\'selected\']?\'wmliu-common-input-invalid\':\'\'}}" ',
								'ng-model="form.detail.vals.tablelist[col][row.sid][\'selected\']" ng-change="changeState(\'selected\');" ng-disabled="form.detail.head.state==\'none\'" />',
							'</span>',
							
							'<span ng-switch-when="rowno" class="{{colObj.css}}" style="{{colObj.style}};">{{row.sn}}</span>',
							
							'<span ng-switch-when="text" ng-if="colObj.table!=\'rtable\'" class="{{colObj.css}}" style="{{colObj.style}};">{{row[colObj.col] && row[colObj.col]!="null"?row[colObj.col]:""}}</span>',
							'<span ng-switch-when="text" ng-if="colObj.table==\'rtable\'" class="{{colObj.css}}" style="{{colObj.style}};">{{form.detail.vals.tablelist[col][row.sid][colObj.col] && form.detail.vals.tablelist[col][row.sid][colObj.col]!="null"?form.detail.vals.tablelist[col][row.sid][colObj.col]:""}}</span>',
	
							'<span ng-switch-when="textbox">',
								'<input ng-if="colObj.table!=\'rtable\'" class="input {{colObj.css}} {{row.errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" type="textbox" title="{{row.errorMessage[colObj.col]?row.errorMessage[colObj.col]:\'\'}}" ',
								'ng-model="row[colObj.col]" ng-change="changeState(colObj.col);" ng-disabled="form.detail.head.state==\'none\'" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
	
								'<input ng-if="colObj.table==\'rtable\'" class="input {{colObj.css}} {{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" type="textbox" title="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]:\'\'}}" ',
								'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" ng-disabled="form.detail.head.state==\'none\'" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
							'</span>',

							'<span ng-switch-when="textarea">',
								'<textarea ng-if="colObj.table!=\'rtable\'" class="input {{colObj.css}} {{row.errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" title="{{row.errorMessage[colObj.col]?row.errorMessage[colObj.col]:\'\'}}" ',
											'ng-model="row[colObj.col]" ng-change="changeState(colObj.col);" ng-disabled="form.detail.head.state==\'none\'" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea>',
								'<textarea ng-if="colObj.table==\'rtable\'" class="input {{colObj.css}} {{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?colObj.width+\'px\':\'\'}};" title="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]:\'\'}}" ',
											'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" ng-disabled="form.detail.head.state==\'none\'" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea>',
							'</span>',

							'<span ng-switch-when="select">',
								'<select 	class="input {{colObj.css}} {{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" ',
											'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);"  ng-disabled="form.detail.head.state==\'none\'" ',
											'ng-options="sObj.key as (sObj.title?sObj.title:sObj.key.uword()) for sObj in form.listTables.checklist[colObj.col]" ',
											'title="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]:colObj.desc?colObj.desc:colObj.title?colObj.title:colObj.col.uword()}}">',
									"<option value='0'></option>",
								"</select>",
							'</span>',

							'<span ng-switch-when="bool">',
								'<label ng-if="colObj.table!=\'rtable\'" class="{{row.errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-class="{\'wmliu-common-input-checked\':row[colObj.col]}">',
									'<input class="{{colObj.css}}" style="{{colObj.style}}" type="checkbox" title="{{colObj.desc?colObj.desc:colObj.title?colObj.title:colObj.col.uword()}}" ',
											'ng-model="row[colObj.col]" ng-change="changeState(colObj.col);" ng-disabled="form.detail.head.state==\'none\'" /><span ng-if="colObj.nowrap">{{colObj.title?colObj.title:colObj.col.uword()}}</span>',
								'</label>',
								'<label ng-if="colObj.table==\'rtable\'" class="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-class="{\'wmliu-common-input-checked\':form.detail.vals.tablelist[col][row.sid][colObj.col]}">',
									'<input class="{{colObj.css}}" style="{{colObj.style}}" type="checkbox" ',
											'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" ng-disabled="form.detail.head.state==\'none\'" /><span ng-if="colObj.nowrap">{{colObj.title?colObj.title:colObj.col.uword()}}</span>',
								'</label>',
							'</span>',
			
						'</td>',
					'</tr>',	
					
                '</table>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ( true ) {
                    if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "update";
                    if ($scope.form.detail.head.state == "add") $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});


wmliu_form.directive("form.error", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form:   "=",
            ww:     "@",
            hh:     "@",
            minww:  "@",
            minhh:  "@"
        },
        template: [
            '<div id="lwhDivBox{{form.name}}error" class="lwhDivBox" ww="{{ww}}" hh="{{hh}}" minww="{{minww}}" minhh="{{minhh}}">',
        // checklist below
            '<div class="lwhDivBox-content">',
                '<div>',
                    '<a class="wmliu-common-state-stop"></a>',
                    '<span class="wmliu-common-state-error">{{ trans[form.detail.head.lang].words[\'input errorMsg\'] }}: </span>',
                '</div>',
                
                '<div class="wmliu-common-checklist-box">',
                '<span class="wmliu-common-error-text" ng-bind-html="getText()"></span>',
                '</div>',
            '</div>',
        // end of checklist

            '</div>',
        ].join(''),
        controller: function ($scope) {
			$scope.basic = gcommon.basic; 
			$scope.trans = gcommon.trans; 

            $scope.getText = function (ckObj) {
                var str = '';
                str += $scope.form.detail.head.error ? $scope.form.detail.head.errorMessage.nl2br() : '';
                return str;
            }
        }
    }
});

wmliu_form.directive("form.button", function (wmliuFormService) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            form: "="
        },
        template: [
			'<span>',
                '<input type="button" class="wmliu-common-button" ',
                        'ng-repeat="rdObj in form.buttons.button" ',
                        'ng-if="form.buttons.rights[rdObj.key]==\'1\'" ',
                        'ng-disabled="!buttonState(form.detail.head.state, rdObj.key)" ',
                        'ng-click="buttonClick(rdObj.key, form)" ',
			            'value="{{ rdObj.title?rdObj.title:rdObj.key.uword() }}" ',
                        'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}" />',
        //'<span style="color:green;" ng-if="form.head.errorMessage">{{form.head.errorMessage}}</span>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.buttonState = function (state, btn_name) {
                var btnActive1 = false;
                if (state) {
                    btnActive1 = $scope.form.buttons.rights[btn_name] && wmliuFormService.btnActive[state][btn_name] && !$scope.form.detail.head.loading;
                }
                return btnActive1;
            }

            $scope.buttonClick = function (action) {
                if ($scope.form.buttons.rights[action]) {
                    $scope.form.detail.head.action = action;
                    var btnClick = wmliuFormService.getButtonClick($scope.form.name, action);
                    switch (action) {
                        case "excel":
                        case "print":
                            //$scope.form.detail.head.loading = 1;
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);
                            break;
                        case "cancel":
                            switch ($scope.form.detail.head.state) {
                                case "update":
                                case "delete":
                                    $scope.form.detail.head.state = "view";
                                    break;
                                case "add":
                                case "new":
                                    $scope.form.detail.head.state = "none";
                                    break;

                            }
                            $scope.form.detail.vals = angular.copy($scope.form.olddetail);
                            for (var key in $scope.form.detail.cols) {
                                if ($scope.form.detail.cols[key]["error"] > 0) $scope.form.detail.cols[key]["error"] = 0;
                                if ($scope.form.detail.cols[key]["errorMessage"] != "") $scope.form.detail.cols[key]["errorMessage"] = "";
                            }

                            for (var key in $scope.form.linkvals) {
                                $scope.form.linkvals[key] = angular.copy($scope.form.oldlinkvals[key]);
                            }


                            $scope.form.detail.head.error = 0;
                            $scope.form.detail.head.errorMessage = "";
                            $scope.form.detail.head.loading = 0;
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);
                            break;
                        case "delete":   // delete only support delete one row, so don't push to array
                            $scope.form.detail.head.state = "delete";
                            $scope.form.detail.head.loading = 0;
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);
                            break;
                        case "add":   // delete only support delete one row, so don't push to array
                            $scope.form.detail.head.state = "add";
                            $scope.form.detail.head.loading = 0;
                            $scope.form.schema.idvals.sid = "";

                            $scope.form.detail.vals = {};
                            $scope.form.olddetail = angular.copy($scope.form.detail.vals);

                            //wmliuFormService.clearLinkVals[$scope.form.name]();

                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);

                            break;
                        case "save":
                            $scope.form.detail.head.action = action;
                            $scope.form.detail.head.loading = 1;
							
							/*
                            $scope.form.linkvals = $scope.form.linkvals || {};
                            for (var key in $scope.form.detail.cols) {
                                var colObj = $scope.form.detail.cols[key];
                                if (colObj["type"] == "treecheck" || colObj["type"] == "treeradio") {
                                    $scope.form.detail.vals[key] = $scope.form.linkvals[key][colObj["table"]] || null;
                                }
                            }
							*/
							
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);

                            wmliuFormService.formAjax($scope.form, action, $scope);
                            break;
                    }

                } else {
                    //console.log("You don't have right");
                }
            }
        }
    }
});

/******************************************************************************************
/*** Service ***/
wmliu_form.service("wmliuFormService", function () {
    var self = this;
    self.init = [];
    self.fresh = [];
    self.load = [];
    self.clear = [];
    //self.clearLinkVals = [];
    self.callBack = []; //angular.noop;
    self.buttonClick = []; //angular.noop;

    // state control button status
    self.btnActive = {
        "none": { "save": 0, "cancel": 0, "add": 1, "delete": 0, "excel": 0, "print": 0 },
        "init": { "save": 0, "cancel": 0, "add": 1, "delete": 0, "excel": 0, "print": 0 },
        "load": { "save": 0, "cancel": 0, "add": 0, "delete": 0, "excel": 0, "print": 0 },
        "view": { "save": 0, "cancel": 0, "add": 1, "delete": 1, "excel": 1, "print": 1 },
        "delete": { "save": 1, "cancel": 1, "add": 0, "delete": 0, "excel": 0, "print": 0 },
        "add": { "save": 0, "cancel": 1, "add": 0, "delete": 0, "excel": 0, "print": 0 },
        "new": { "save": 1, "cancel": 1, "add": 0, "delete": 0, "excel": 0, "print": 0 },
        "update": { "save": 1, "cancel": 1, "add": 0, "delete": 0, "excel": 0, "print": 0 }
    };

    this.formAjax = function (scform, action, sc) {
        if (sc.form.detail.head.wait == "1") wait_show();

        // don't use scform , it is orignal $scope.form
        // create an new form object
        var cform = {};
        cform.listTables = {};
		cform.listTables.tablelist = {};
		if(scform.listTables) if(scform.listTables.tablelist) cform.listTables.tablelist = angular.copy(scform.listTables.tablelist);
        cform.schema = angular.copy(scform.schema);
        cform.detail = angular.copy(scform.detail);

        switch (action) {
            case "init":
            case "save":
                break;
            case "fresh":
            case "load":
                cform.detail.vals = {};
                break;
        }

        // call  before ajax  callback function, you can modify cform object.    
        var evtObj = self.getCallBack(sc.form.name, action);
        if (evtObj) if (evtObj.before) if (angular.isFunction(evtObj.before)) evtObj.before(action, cform);

        // used for nosync content (big trunk data), only send data when changed
        switch (cform.detail.head.state) {
            case "delete":
                cform.detail.vals = {};   // delete case, only use schema.idvals  id values,  no detail.vals required to send.
                break;
            case "new":
            case "update":
                for (var key in cform.detail.cols) {
                    var colName = key;
                    var colObj = cform.detail.cols[key];
                    if (colObj["nosync"] == "1") {
                        scform.detail.vals[colName] = cform.detail.vals[colName];  // important: sync to ng-model 
                        if (cform.detail.vals[colName] != sc.form.olddetail[colName]) {
                            cform.detail.cols[colName]["changed"] = 1;
                            //console.log("changed 1111");
                        } else {
                            cform.detail.cols[colName]["changed"] = 0;
                            cform.detail.vals[colName] = null;
                            //console.log("no changed");
                        }
                    }
                }
                break;
        }

        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                form: cform
                // rows is not the same as form.rows, it will filter readonly field and no change rows
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (sc.form.detail.head.wait == "1") wait_hide();
                sc.form.detail.head.loading = 0;
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, cform);
                //tool_tips("Error (wmliu_form_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.form.detail.head.wait == "1") wait_hide();
                
				errorHandler(req);
				sc.form.detail.head.loading = 0;
				sc.$apply();
				
				if( req.errorCode < 900 ) {
                	self.updateformData(req.form, sc.form, sc);
				}

                // after ajax,   action : new, update, delete
                if (req.errorCode <=0 ) {
                    var evtObj1 = self.getCallBack(sc.form.name, "save");
                    switch (req.form.detail.head.action) {
                        case "new":
							tool_tips(gcommon.trans[sc.form.detail.head.lang].words["add success"]);
                            break;
                        case "update":
							tool_tips(gcommon.trans[sc.form.detail.head.lang].words["save success"]);
                            break;
                        case "delete":
							tool_tips(gcommon.trans[sc.form.detail.head.lang].words["delete success"]);
                            break;
                        default:
                            // other case : init, fresh, load
                            evtObj1 = self.getCallBack(sc.form.name, req.form.detail.head.action);
                            break;
                    }

                    if (evtObj1) if (evtObj1.success) if (angular.isFunction(evtObj1.success)) evtObj1.success(req.form.detail.head.action, sc.form);
                } 
            },
            type: "post",
            url: "ajax/wmliu_form_data.php"
        });
    }

    self.updateformData = updateformData;

    self.setCallBack = function (eid, callbackFunc, action) {
        self.callBack[eid] = self.callBack[eid] || {};
        if (action) {
            if (angular.isArray(action)) {
                for (var key in action) {
                    self.callBack[eid][action[key]] = callbackFunc;
                }
            } else {
                self.callBack[eid][action] = callbackFunc;
            }
        } else {
            self.callBack[eid] = callbackFunc || {};
        }
    }

    self.getCallBack = function (eid, action) {
        var tmp = self.callBack[eid] || {};
        if (action && action != "") {
            if (tmp[action]) return tmp[action];
        }
        return tmp;
    }


    self.setButtonClick = function (eid, clickEvent, action) {
        self.buttonClick[eid] = self.buttonClick[eid] || {};
        if (action) {
            if (angular.isArray(action)) {
                for (var key in action) {
                    self.buttonClick[eid][action[key]] = clickEvent;
                }
            } else {
                self.buttonClick[eid][action] = clickEvent;
            }
        } else {
            self.buttonClick[eid] = clickEvent || {};
        }
    }

    self.getButtonClick = function (eid, action) {
        var tmp = self.buttonClick[eid] || {};
        if (action && action != "") {
            if (tmp[action]) return tmp[action];
        }
        return tmp;
    }

});

/******************************************************************************************
/*** Javascript ***/

function updateformData (rForm, oForm, sc) {
        oForm.detail.head.loading = 0;
        if (rForm.detail.head.error != "1") {
            if (rForm.schema.idvals) oForm.schema.idvals = angular.copy(rForm.schema.idvals);


            switch(rForm.detail.head.action)  {
                case "update":
                case "new":
                    // deal with nosync column,  copy ng-model to response's object
                    // why copy.  it will sync to oldvalue  for next compare. 
                    for (var key in rForm.detail.cols) {
                        var colName = key;
                        var colObj = rForm.detail.cols[key];
                        if (colObj["nosync"] == "1") {
                            rForm.detail.vals[colName] = oForm.detail.vals[colName];
                            rForm.detail.cols[colName]["changed"] = 0;
                        }
                    }
                    break;
                default:
                    break;
            }


		    if (rForm.detail) oForm.detail = angular.copy(rForm.detail);
		    oForm.detail.vals = oForm.detail.vals || {};

			/*
            switch(rForm.detail.head.action)  {
                case "new":
				case "update":
					if (rForm.detail.head) oForm.detail.head = angular.copy(rForm.detail.head);
					if (rForm.detail.cols) oForm.detail.cols = angular.copy(rForm.detail.cols);
					break;
				default:
					if (rForm.detail) oForm.detail = angular.copy(rForm.detail);
					oForm.detail.vals = oForm.detail.vals || {};
					break;
            }
            */

            // don't directly copy listTables,   we will reservce user-defined checklist;
            /*
			if (rForm.listTables) {
				if(!oForm.listTables) oForm.listTables = {};
				$.extend(oForm.listTables, rForm.listTables);  
			}
			*/
			
            if (rForm.listTables) {
				if(!oForm.listTables) oForm.listTables = {};
				$.extend(oForm.listTables.checklist, rForm.listTables.checklist);  
				$.extend(oForm.listTables.clist, rForm.listTables.clist);  
				$.extend(oForm.listTables.vlist, rForm.listTables.vlist);  
				$.extend(oForm.listTables.tablelist, rForm.listTables.tablelist);  
			}
			
				
            oForm.olddetail = oForm.detail.vals ? angular.copy(oForm.detail.vals) : {};

             //console.log("after sc.form: " + sc.form.olddetail["content"]);
             //console.log("after oform: " + oForm.detail.vals["content"]);

        } else {

			if (rForm.schema.idvals) oForm.schema.idvals    = angular.copy(rForm.schema.idvals);
            if (rForm.detail.head) oForm.detail.head        = angular.copy(rForm.detail.head);
            if (rForm.detail.cols) oForm.detail.cols        = angular.copy(rForm.detail.cols);
				
            if (rForm.listTables) {
				if(!oForm.listTables) oForm.listTables = {};
				$.extend(oForm.listTables.checklist, rForm.listTables.checklist);  
				$.extend(oForm.listTables.clist, rForm.listTables.clist);  
				$.extend(oForm.listTables.vlist, rForm.listTables.vlist);  
				$.extend(oForm.listTables.tablelist, rForm.listTables.tablelist);  
			}

			if (rForm.detail.vals.tablelist)  oForm.detail.vals.tablelist = angular.copy(rForm.detail.vals.tablelist);
        }
        //after update, set action to view,  prepare for load data
        //oForm.detail.head.action = "view";

        sc.$apply();
}
