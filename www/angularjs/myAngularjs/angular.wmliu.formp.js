/***********************************************************************************************/
/* AngularJS  TreeView                                                                         */
/* Required:  angular3.13.js ; angular-cookies.min.js ; angular.wmliu.tree.js                  */
/* Required:  angular.wmliu.tree.css                                                          */
/* Author:    William Liu                                                                      */
/* Date:      2015-05-31                                                                       */
/***********************************************************************************************/
var wmliu_formp = angular.module("wmliuFormp",  ["ngSanitize"]);
wmliu_formp.directive("wmliu.formp", function (wmliuFormpService) {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            name: "@",
            form: "=",
            loading: "="
            //buttonclick: "&" - can not pass parameter because it is in isolated scope
        },
        template: '<span><form name="{{name}}" ng-transclude></form></span>',
        transclude: true,
        controller: function ($scope) {
            $scope.form.name = $scope.name;
            $scope.form.detail.head.loading = $scope.loading;
            // init 
            $scope.form.schema.idvals = $scope.form.schema.idvals ? $scope.form.schema.idvals : {};
            $scope.form.detail.vals = $scope.form.detail.vals ? $scope.form.detail.vals : {};

            $scope.form.listTables 				= $scope.form.listTables ? $scope.form.listTables : {};
			$scope.form.listTables.checklist 	= $scope.form.listTables.checklist ? $scope.form.listTables.checklist : {};
			$scope.form.listTables.clist 		= $scope.form.listTables.clist ? $scope.form.listTables.clist : {};
			$scope.form.listTables.vlist 		= $scope.form.listTables.vlist ? $scope.form.listTables.vlist : {};
			$scope.form.listTables.tablelist 	= $scope.form.listTables.tablelist ? $scope.form.listTables.tablelist : {};

            // method
            wmliuFormpService.init[$scope.name] = function (idvals) {
                if (idvals != undefined) {
                    if (angular.isObject(idvals)) {
                        if (idvals.pid) $scope.form.schema.idvals.pid = idvals.pid;
                        if (idvals.sid) $scope.form.schema.idvals.sid = idvals.sid;
                    }
                }

                $scope.form.detail.head.action  = "init";
                $scope.form.detail.head.state   = "none";
                $scope.form.detail.head.loading = 1;
                wmliuFormpService.formpAjax($scope.form, $scope.form.detail.head.action, $scope);
            }

            wmliuFormpService.init[$scope.form.name]();
        }
    }
});

wmliu_formp.directive("formp.hidden", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            col: "@",
            form: "="
        },
        template: '<span><input type="hidden" ng-model="form.detail.vals[col]" ng-change="changeState(col)" /></span>',
        controller: function ($scope) {
            $scope.changeState = function (colName) {
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}
            }
        }
    }
});

wmliu_formp.directive("formp.label", function () {
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
                        '<span class="wmliu-common-label-required" ng-if="form.detail.cols[col].required==\'1\'">*</span>',
                        '<span   class="{{ form.detail.cols[col].errorMessage?\'wmliu-common-label-invalid\':\'\' }}" ',
                                'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                            '{{form.detail.cols[col].title}}',
                        '</span> ',
                    '</span>'
                  ].join(''),
        controller: function ($scope) {
        }
    }
});

wmliu_formp.directive("formp.textbox", function () {
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
                    '<input type="textbox" ng-model="form.detail.vals[col]" ',
					'class="wmliu-common-input {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}
            }
        }
    }
});

wmliu_formp.directive("formp.password", function () {
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
					'ng-change="changeState(col)" ng-model="form.detail.vals[col]" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                    '<br>',
                    '<input type="password" class="wmliu-common-input {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'placeholder="Confirm Password" style="margin-top:2px;" ',
                    'ng-change="changeState(col)" ng-model="form.detail.vals[col + \'_confirm\']" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" /> ',
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
                        if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "new";
                    }
                } else {
                    $scope.form.detail.cols[colName].error = 0;
                    $scope.form.detail.cols[colName].errorMessage = "";
                    if ($scope.form.detail.head.state == "view") $scope.form.detail.head.state = "new";
                }
            }
        }
    }
});

wmliu_formp.directive("formp.textarea", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            valuechange: "&"
        },
        template: [ '<textarea class="wmliu-common-textarea {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-model="form.detail.vals[col]" ng-change="changeState(col)" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea>'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}
            }
        }
    }
});

wmliu_formp.directive("formp.bool", function () {
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
                    '<label class="{{ form.detail.vals[col]?\'wmliu-common-input-checked\':\'\' }} {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}">',
                    '<input type="checkbox" ng-model="form.detail.vals[col]" ng-change="changeState(col)" />{{ form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}',
                    '</label>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
            }
        }
    }
});


wmliu_formp.directive("formp.select", function () {
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
				'ng-change="changeState(col)" >',
			    '<option value=""></option>',
                '</select>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}
            }
        }
    }
});


wmliu_formp.directive("formp.radio", function () {
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
                        '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj.key" ng-change="changeState(col)" />',
                        '{{ rdObj.title?rdObj.title:rdObj.key.uword() }}',
                    '</label>',
                    '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-focus="form.detail.vals[col]=\'\'" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',

            '</div>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != "") {
                        if ($scope.form.detail.head.state == "view") {
                            $scope.form.detail.head.state = "new";
                            $scope.form.detail.head.errorMessage = "";
                        }
                    }
                }

            }
        }
    }
});


wmliu_formp.directive("formp.radiocom", function () {
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
                    'ng-init="colnum=colnum?colnum:0;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.checklist[col]">',
                    '<label     class="{{ form.detail.vals[col]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj.key" ng-change="changeState(col)" />',
                        '{{ rdObj.title?rdObj.title:rdObj.key.uword() }}',
                    '</label>',
                    '<br ng-if="colnum>0?(($index+1)%colnum)==0:false" />',
                '</span>',
          
                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-focus="form.detail.vals[col]=\'\'" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',

            '</div>',

            '</div>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != "") {
                        if ($scope.form.detail.head.state == "view") {
                            $scope.form.detail.head.state = "new";
                            $scope.form.detail.head.errorMessage = "";
                        }
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
wmliu_formp.directive("formp.radiolist", function () {
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
                            '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj1.key" ng-change="changeState(col)" />',
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
				if( $scope.form.detail.vals[colName] != "" ) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
				}
            }
        }
    }
});

// important:  radiodiag , radiolist  is  type: "radio",  only checklist :  ctable: ccol, stable, scol, sref
wmliu_formp.directive("formp.radiodiag", function () {
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

        //radiolist below
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
                            '<input type="radio" ng-model="form.detail.vals[col]" ng-value="rdObj1.key" ng-change="changeState(col)" />',
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
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
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


wmliu_formp.directive("formp.checkbox", function () {
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
                        '<input type="checkbox" ng-model="form.detail.vals[col][rdObj.key]" ng-value="rdObj.key"  ng-change="changeState(col)" />',
                        '{{ rdObj.title?rdObj.title:rdObj.key.uword() }}',
                    '</label>',
                    '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',
           
            '</div>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != "") {
                        if ($scope.form.detail.head.state == "view") {
                            $scope.form.detail.head.state = "new";
                            $scope.form.detail.head.errorMessage = "";
                        }
                    }
                }

            }
        }
    }
});


wmliu_formp.directive("formp.checkcom", function () {
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
                    'ng-init="form.detail.vals[col]=form.detail.vals[col]?form.detail.vals[col]:{}; colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',

                '<span ng-repeat="rdObj in form.listTables.checklist[col]">',
                    '<label  class="{{ form.detail.vals[col][rdObj.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                            'title="{{ rdObj.desc?rdObj.desc:rdObj.title?rdObj.title:rdObj.key.uword() }}">',
                        '<input type="checkbox" ng-model="form.detail.vals[col][rdObj.key]" ng-value="rdObj.key"  ng-change="changeState(col)" />',
                        '{{ rdObj.title?rdObj.title:rdObj.key.uword() }}',
                    '</label>',
                    '<br ng-if="colnum1>0?(($index+1)%colnum1)==0:false" />',
                '</span>',

                '<span ng-if="form.detail.cols[col][\'other\']" style="margin-left:10px;">',
                '<input  ng-if="form.detail.cols[col][\'other\']" class="wmliu-common-input-other {{col.css}}" style="{{col.style}}" type="textbox" ',
                        'title="{{form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\'}}" placeholder="Specify Other" ',
                        'ng-model="form.detail.vals[form.detail.cols[col][\'other\']]" ',
                        'ng-change="changeState(col)" ',
                        'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
                '</span>',

            '</div>',

            '</div>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }

                if ($scope.form.detail.cols[colName]["other"]) {
                    if ($scope.form.detail.vals[$scope.form.detail.cols[colName]["other"]] != "") {
                        if ($scope.form.detail.head.state == "view") {
                            $scope.form.detail.head.state = "new";
                            $scope.form.detail.head.errorMessage = "";
                        }
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
        link: function (sc, el, attrs) {
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
wmliu_formp.directive("formp.checklist", function () {
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
                            '<input type="checkbox" ng-model="form.detail.vals[col][rdObj1.key]" ng-value="rdObj1.key"  ng-change="changeState(col)" />',
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
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }
        }
    }
});

// important:  radiodiag , radiolist  is  type: "radio",  only checklist :  ctable: ccol, stable, scol, sref
wmliu_formp.directive("formp.checkdiag", function () {
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

        //checklist below
            '<div class="lwhDivBox-content {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                    'ng-init="form.detail.vals[col]=form.detail.vals[col]?form.detail.vals[col]:{}; colnum1=colnum?colnum:form.detail.cols[col].colnum;" ',
                    'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:\'\' }}">',
                '<span ng-repeat="rdObj in form.listTables.clist[col]">',
                '<div class="wmliu-common-checklist-box">',
                    '<span class="wmliu-common-checklist-header">{{rdObj.title}}</span>',
                    '<span ng-repeat="rdObj1 in rdObj.list">',
                        '<label  class="{{ form.detail.vals[col][rdObj1.key]?\'wmliu-common-input-checked\':\'\' }}" ',
                                'title="{{ rdObj1.desc?rdObj1.desc:rdObj1.title?rdObj1.title:rdObj1.key.uword() }}">',
                            '<input type="checkbox" ng-model="form.detail.vals[col][rdObj1.key]" ng-value="rdObj1.key"  ng-change="changeState(col)" />',
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
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }

            $scope.getText = function (ckObj) {
                var str = '';
                var colnum1 = $scope.form.detail.cols[$scope.col].colnum ? $scope.form.detail.cols[$scope.col].colnum : 0;
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
        link: function (sc, el, attrs) {

            $(function () {
                $("#lwhDivBox" + sc.form.name + sc.col).lwhDivBox();
                $(".lwhDivBox-Button").unbind("click.lwhDivBox").bind("click.lwhDivBox", function (ev) {
                    $("#" + $(this).attr("did")).divBoxShow();
                });

            });
        }
    }
});


wmliu_formp.directive("formp.text", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            col: "@",
            form: "="
        },
        template: '<span ng-bind="form.detail.vals[col]"></span>',
        controller: function ($scope) {
        }
    }
});

wmliu_formp.directive("formp.cktext", function () {
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
                    '<span class="wmliu-common-input-checked" ng-bind-html="getCKText(form.detail.vals, form.detail.cols[col])">',
        //'{{ getText(form.detail.vals[col]) }}',
                    '</span>'
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

wmliu_formp.directive("formp.ptext", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: [	'<span>',
                        '<span style="{{ form.detail.cols[col].errorMessage?\'color:red;\':\'\' }}" ',
					            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}">',
                            '{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.schema.idvals[col] }}',
                        '</span>',
                    '</span>'
				  ].join(''),
        controller: function ($scope) {
        }
    }
});

wmliu_formp.directive("formp.vtext", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@"
        },
        template: [	
                    '<span>',
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


wmliu_formp.directive("formp.datetype", function (wmliuFormpService) {
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
                                'ng-model="form.detail.vals[form.detail.cols[col].start_time]" ng-change="changeState(form.detail.cols[col].start_time);" ',
                                'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" />',			        

                        ' <b>~</b> ',
                        '{{ trans[form.detail.head.lang].words[\'end_time\'] }}: ',
                        '<input type="text" class="wmliu-common-time {{ form.detail.cols[form.detail.cols[col].end_time].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" title="{{ form.detail.cols[form.detail.cols[col].end_time].errorMessage?form.detail.cols[form.detail.cols[col].end_time].errorMessage:\'\' }}" ',
                                'ng-model="form.detail.vals[form.detail.cols[col].end_time]" ng-change="changeState(form.detail.cols[col].end_time);" ',
                                'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="hh:mm:ss" />',			        

                    '</div>',

                    '<div style="margin-top:5px;" class="{{ form.detail.cols[form.detail.cols[col].date_type].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" title="{{ form.detail.cols[form.detail.cols[col].date_type].errorMessage?form.detail.cols[form.detail.cols[col].date_type].errorMessage:\'\' }}">',
				        '{{ trans[form.detail.head.lang].words[\'sch_type\'] }}:',
					    '<label ng-repeat="rdObj in basic[form.detail.head.lang].dateType" style="margin-left:20px;" class="{{ form.detail.vals[form.detail.cols[col].date_type]==rdObj.key?\'wmliu-common-input-checked\':\'\' }}">',
                            '<input type="radio" ng-model="form.detail.vals[form.detail.cols[col].date_type]" ng-value="rdObj.key"  ng-change="changeState(form.detail.cols[col].date_type)" />',
                            '{{rdObj.title}}',
                        '</label>',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Once\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].once_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].once_date].errorMessage?form.detail.cols[form.detail.cols[col].once_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].once_date]" ng-change="changeState(form.detail.cols[col].once_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Daily\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'start_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?form.detail.cols[form.detail.cols[col].start_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].start_date]"  ng-change="changeState(form.detail.cols[col].start_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                            ' <b>~</b> ',
                            '{{ trans[form.detail.head.lang].words[\'end_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?form.detail.cols[form.detail.cols[col].end_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].end_date]" ng-change="changeState(form.detail.cols[col].end_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Weekly\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'start_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?form.detail.cols[form.detail.cols[col].start_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].start_date]"  ng-change="changeState(form.detail.cols[col].start_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                            ' <b>~</b> ',
                            '{{ trans[form.detail.head.lang].words[\'end_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?form.detail.cols[form.detail.cols[col].end_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].end_date]" ng-change="changeState(form.detail.cols[col].end_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',

                            '<br><br>',
						    '<div class="{{ form.detail.cols[form.detail.cols[col].date_sets].errorMessage?\'wmliu-common-input-invalid\':\'\'}}">',
	                            '<label ng-repeat="rdObj1 in basic[form.detail.head.lang].day_short" ',
		                            'class="{{ form.detail.vals[col][\'wdates\'][$index]?\'wmliu-common-input-checked\':\'\' }}" style="margin-right:5px;">',
                                    '<input type="checkbox" ng-model="form.detail.vals[col][\'wdates\'][$index]"   ng-change="changeState(col)" />',
                                    '{{rdObj1}}',
    	                        '</label>',
						    '</div>',
                    '</div>',

                    '<div ng-show="form.detail.vals[form.detail.cols[col].date_type]==\'Monthly\'" class="wmliu-common-checklist-box1">',
                            '{{ trans[form.detail.head.lang].words[\'start_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].start_date].errorMessage?form.detail.cols[form.detail.cols[col].start_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].start_date]"  ng-change="changeState(form.detail.cols[col].start_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',
                            ' <b>~</b> ',
                            '{{ trans[form.detail.head.lang].words[\'end_date\'] }}: ',
                            '<input type="text" class="wmliu-common-date {{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?\'wmliu-common-input-invalid\':\'\'}}" title="{{ form.detail.cols[form.detail.cols[col].end_date].errorMessage?form.detail.cols[form.detail.cols[col].end_date].errorMessage:\'\' }}" ',
                                    'ng-model="form.detail.vals[form.detail.cols[col].end_date]" ng-change="changeState(form.detail.cols[col].end_date);" ',
                                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" placeholder="yyyy-mm-dd" />',

                            '<br><br>',

						    '<div class="{{form.detail.cols[form.detail.cols[col].date_sets].errorMessage?\'wmliu-common-input-invalid\':\'\'}}">',
                        	    '<span ng-repeat="rdObj1 in basic[form.detail.head.lang].days">',
								    '<label class="{{ form.detail.vals[col][\'mdates\'][rdObj1]?\'wmliu-common-input-checked\':\'\' }}" style="display:inline-block; width:40px;">',
                            		    '<input type="checkbox" ng-model="form.detail.vals[col][\'mdates\'][rdObj1]"  ng-change="changeState(col)" />',
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
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
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



wmliu_formp.directive("formp.date", function () {
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
                    '<input type="textbox" id="{{form.name}}{{col}}" ng-model="form.detail.vals[col]" ',
                    'placeholder="YYYY-MM-DD" ',
					'class="wmliu-common-date {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />'
				  ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
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

wmliu_formp.directive("formp.time", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            defval: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
                    
                    '<input type="textbox" ng-model="form.detail.vals[col + \'_hh\']" ',
					'class="wmliu-common-time-hh {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" minlength="0" maxlength="2" placeholder="Hour" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 300, blur:0}}" /><b>:</b>',

                    '<input type="textbox" ng-model="form.detail.vals[col + \'_ii\']" ',
					'class="wmliu-common-time-ii {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" minlength="0" maxlength="2" placeholder="Min" ',
					'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
					'ng-change="changeState(col)" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 300, blur:0}}" />',

                    '</span>'

				  ].join(''),
        controller: function ($scope) {
            if ($scope.defval != "") {
                var hi_tmp = $scope.defval.split(":");
                $scope.form.detail.vals[$scope.col + "_hh"] = parseInt(hi_tmp[0]);
                $scope.form.detail.vals[$scope.col + "_ii"] = parseInt(hi_tmp[1]);
            }
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_hh"] != "" ||
                    $scope.form.detail.vals[colName + "_ii"] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }
        }
    }
});


wmliu_formp.directive("formp.time1", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            defval:"@",
            valuechange: "&"
        },
        template: [
                    '<span>',
			        '<select ng-model="form.detail.vals[col + \'_hh\']" placeholder="Hr" ',
            			    'class="wmliu-common-date-hh {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)">',
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
				            'ng-change="changeState(col)">',
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
            if ($scope.defval != "") {
                var hi_tmp = $scope.defval.split(":");
                $scope.form.detail.vals[$scope.col + "_hh"] = parseInt(hi_tmp[0]);
                $scope.form.detail.vals[$scope.col + "_ii"] = parseInt(hi_tmp[1]);
            }
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_hh"] != "" ||
                    $scope.form.detail.vals[colName + "_ii"] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }
        }
    }
});


wmliu_formp.directive("formp.dateymd", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            defval: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
			        '<select ng-model="form.detail.vals[col + \'_mm\']" placeholder="Month" ',
            			    'class="wmliu-common-date-mm {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)">',
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
				            'ng-change="changeState(col)">',
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
					'ng-change="changeState(col)" ',
                    'ng-model-options="{updateOn:\'default blur\', debounce:{default: 300, blur:0}}" />',

                    '</span>'
				  ].join(''),
        controller: function ($scope) {
            if ($scope.defval != "") {
                var dt = new Date($scope.defval);
                $scope.form.detail.vals[$scope.col + "_yy"] = dt.getFullYear();
                $scope.form.detail.vals[$scope.col + "_mm"] = dt.getMonth() + 1;
                $scope.form.detail.vals[$scope.col + "_dd"] = dt.getDate();
            }
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_yy"] != "" ||
                    $scope.form.detail.vals[colName + "_mm"] != "" ||
                    $scope.form.detail.vals[colName + "_dd"] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }
        }
    }
});

wmliu_formp.directive("formp.timehi", function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            form: "=",
            col: "@",
            defval: "@",
            valuechange: "&"
        },
        template: [
                    '<span>',
			        '<select ng-model="form.detail.vals[col + \'_hh\']" placeholder="Hr" ',
            			    'class="wmliu-common-date-hh {{ form.detail.cols[col].errorMessage?\'wmliu-common-input-invalid\':\'\' }}" ',
                            'title="{{ form.detail.cols[col].errorMessage?form.detail.cols[col].errorMessage:form.detail.cols[col].desc?form.detail.cols[col].desc:form.detail.cols[col].title?form.detail.cols[col].title:col.uword() }}" ',
				            'ng-change="changeState(col)">',
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
				            'ng-change="changeState(col)">',
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
            if ($scope.defval != "") {
                var hi_tmp = $scope.defval.split(":");
                $scope.form.detail.vals[$scope.col + "_hh"] = parseInt(hi_tmp[0]);
                $scope.form.detail.vals[$scope.col + "_ii"] = parseInt(hi_tmp[1]);
            }
            $scope.changeState = function (colName) {
                if ($scope.form.detail.vals[colName + "_hh"] != "" ||
                    $scope.form.detail.vals[colName + "_ii"] != "") {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }
        }
    }
});


wmliu_formp.directive("formp.intdate", function () {
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

wmliu_formp.directive("formp.tablelist", function (wmliuFormpService) {
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
								'ng-model="form.detail.vals.tablelist[col][row.sid][\'selected\']" ng-change="changeState(\'selected\');" />',
							'</span>',
							
							'<span ng-switch-when="rowno" class="{{colObj.css}}" style="{{colObj.style}};">{{row.sn}}</span>',
							
							'<span ng-switch-when="text" ng-if="colObj.table!=\'rtable\'" class="{{colObj.css}}" style="{{colObj.style}};">{{row[colObj.col] && row[colObj.col]!="null"?row[colObj.col]:""}}</span>',
							'<span ng-switch-when="text" ng-if="colObj.table==\'rtable\'" class="{{colObj.css}}" style="{{colObj.style}};">{{form.detail.vals.tablelist[col][row.sid][colObj.col] && form.detail.vals.tablelist[col][row.sid][colObj.col]!="null"?form.detail.vals.tablelist[col][row.sid][colObj.col]:""}}</span>',
	
							'<span ng-switch-when="textbox">',
								'<input ng-if="colObj.table!=\'rtable\'" class="input {{colObj.css}} {{row.errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" type="textbox" title="{{row.errorMessage[colObj.col]?row.errorMessage[colObj.col]:\'\'}}" ',
								'ng-model="row[colObj.col]" ng-change="changeState(colObj.col);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
	
								'<input ng-if="colObj.table==\'rtable\'" class="input {{colObj.css}} {{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" type="textbox" title="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]:\'\'}}" ',
								'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}" />',
							'</span>',

							'<span ng-switch-when="textarea">',
								'<textarea ng-if="colObj.table!=\'rtable\'" class="input {{colObj.css}} {{row.errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" title="{{row.errorMessage[colObj.col]?row.errorMessage[colObj.col]:\'\'}}" ',
											'ng-model="row[colObj.col]" ng-change="changeState(colObj.col);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea>',
								'<textarea ng-if="colObj.table==\'rtable\'" class="input {{colObj.css}} {{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?colObj.width+\'px\':\'\'}};" title="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]:\'\'}}" ',
											'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" ng-model-options="{updateOn:\'default blur\', debounce:{default: 800, blur:0}}"></textarea>',
							'</span>',

							'<span ng-switch-when="select">',
								'<select 	class="input {{colObj.css}} {{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" style="{{colObj.style}};{{colObj.width>0?\'width:\'+colObj.width+\'px\':\'\'}};" ',
											'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" ',
											'ng-options="sObj.key as (sObj.title?sObj.title:sObj.key.uword()) for sObj in form.listTables.checklist[colObj.col]" ',
											'title="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]:colObj.desc?colObj.desc:colObj.title?colObj.title:colObj.col.uword()}}">',
									"<option value='0'></option>",
								"</select>",
							'</span>',

							'<span ng-switch-when="bool">',
								'<label ng-if="colObj.table!=\'rtable\'" class="{{row.errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-class="{\'wmliu-common-input-checked\':row[colObj.col]}">',
									'<input class="{{colObj.css}}" style="{{colObj.style}}" type="checkbox" title="{{colObj.desc?colObj.desc:colObj.title?colObj.title:colObj.col.uword()}}" ',
											'ng-model="row[colObj.col]" ng-change="changeState(colObj.col);" /><span ng-if="colObj.nowrap">{{colObj.title?colObj.title:colObj.col.uword()}}</span>',
								'</label>',
								'<label ng-if="colObj.table==\'rtable\'" class="{{form.detail.vals.tablelist[col][row.sid].errorMessage[colObj.col]?\'wmliu-common-input-invalid\':\'\'}}" ng-class="{\'wmliu-common-input-checked\':form.detail.vals.tablelist[col][row.sid][colObj.col]}">',
									'<input class="{{colObj.css}}" style="{{colObj.style}}" type="checkbox" ',
											'ng-model="form.detail.vals.tablelist[col][row.sid][colObj.col]" ng-change="changeState(colObj.col);" /><span ng-if="colObj.nowrap">{{colObj.title?colObj.title:colObj.col.uword()}}</span>',
								'</label>',
							'</span>',
			
						'</td>',
					'</tr>',	
					
                '</table>'
        ].join(''),
        controller: function ($scope) {
            $scope.changeState = function (colName) {
                if (true) {
                    if ($scope.form.detail.head.state == "view") {
                        $scope.form.detail.head.state = "new";
                        $scope.form.detail.head.errorMessage = "";
                    }
                }
            }
        }
    }
});


wmliu_formp.directive("formp.error", function () {
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
            $scope.getText = function (ckObj) {
                var str = '';
                str += $scope.form.detail.head.error ? $scope.form.detail.head.errorMessage.nl2br() : '';
                return str;
            }
        }
    }
});

wmliu_formp.directive("formp.button", function (wmliuFormpService) {
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
        //'<span style="color:green;" ng-if="form.head.error==0">{{form.head.errorMessage}}</span>',
            '</span>'
        ].join(''),
        controller: function ($scope) {
            $scope.buttonState = function (state, btn_name) {
                //console.log("button state: " + state + " : "  + btn_name + "  active:"  + wmliuFormService.formbtnActive[state][btn_name]);
                var btnActive1 = false;
                if (state) {
                    btnActive1 = $scope.form.buttons.rights[btn_name] && wmliuFormpService.btnActive[state][btn_name] && !$scope.form.detail.head.loading;
                }
                return btnActive1;
            }

            $scope.buttonClick = function (action, formObj) {
                if ($scope.form.buttons.rights[action]) {
                    $scope.form.detail.head.action = action;
                    var btnClick = wmliuFormpService.getButtonClick($scope.form.name, action);

                    formObj.detail.head.action = action;

                    switch (action) {
                        case "cancel":
                            formObj.detail.head.action  = "init";
                            formObj.detail.head.state   = "view";
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);
                            wmliuFormpService.formpAjax(formObj, formObj.detail.head.action, $scope);
                            break;
                        case "save":
                            formObj.detail.head.loading = 1;
                            if (btnClick) if (angular.isFunction(btnClick)) btnClick(action, $scope.form);
                            wmliuFormpService.formpAjax(formObj, formObj.detail.head.action, $scope);
                            break;
                    }  // end switch
                } // end right[action]
            }// end buttonclick
        } //end controller
    }// end return
});


wmliu_formp.service("wmliuFormpService", function () {
    var self = this;

    self.init = [];
    self.callBack = []; //angular.noop;
    self.buttonClick = {}; //angular.noop;

    self.btnActive = {
        "none": { "save": 0, "cancel": 0 },  // not in use in post form
        "view": { "save": 0, "cancel": 0 },
        "new": { "save": 1, "cancel": 1 }
    };


    this.formpAjax = function (scform, action, sc) {
        if (sc.form.detail.head.wait == "1") wait_show();

        // don't use scform , it is orignal $scope.form
        // create an new form object
        var cform = {};
        cform.schema = angular.copy(scform.schema);
		cform.listTables = {};
		cform.listTables.tablelist = {};
		if(scform.listTables) if(scform.listTables.tablelist) cform.listTables.tablelist = angular.copy(scform.listTables.tablelist);
        cform.detail = angular.copy(scform.detail);

        // call  before ajax  callback function, you can modify cform object.    
        var evtObj = self.getCallBack(sc.form.name, action);
        if (evtObj) if (evtObj.before) if (angular.isFunction(evtObj.before)) evtObj.before(action, cform);
        $.ajax({
            data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
                form: cform
            },
            dataType: "json",
            error: function (xhr, tStatus, errorTh) {
                if (sc.form.detail.head.wait == "1") wait_hide();
                sc.form.detail.head.loading = 0;
                sc.form.detail.head.action = "init";
                sc.form.detail.head.state = "new";
                if (evtObj) if (evtObj.error) if (angular.isFunction(evtObj.error)) evtObj.error(action, cform);
                //tool_tips("Error (wmliu_formp_data.php): " + xhr.responseText + "\nStatus: " + tStatus);
            },
            success: function (req, tStatus) {
                if (sc.form.detail.head.wait == "1") wait_hide();

				errorHandler(req);
				sc.form.detail.head.loading = 0;
				sc.$apply();
                
				if (req.form.detail.head.error < 1) {
                    if(req.errorCode < 900 ) {
						self.updateData(req.form, sc.form, sc);
						// after ajax,   action : new, update, delete
						var evtObj1 = self.getCallBack(sc.form.name, "save");
						switch (req.form.detail.head.action) {
							case "save":
								if(req.errorCode <=0) {
									tool_tips(gcommon.trans[sc.form.detail.head.lang].words["submit success"]);
									sc.form.detail.vals = {};
									sc.$apply();
								} else {
									sc.form.detail.vals = {};
									sc.$apply();
								}
								break;
							default:
								// other case : init
								evtObj1 = self.getCallBack(sc.form.name, req.form.detail.head.action);
								break;
						}
					}

                    if (evtObj1) if (evtObj1.success) if (angular.isFunction(evtObj1.success)) evtObj1.success(req.form.detail.head.action, sc.form);

                } else {
                    if(req.errorCode < 900 ) self.updateData(req.form, sc.form, sc);
	 				sc.form.detail.head.loading = 0;
	 				sc.form.detail.head.state 	= "view";
				}
            },
            type: "post",
            url: "ajax/wmliu_formp_data.php"
        });
    }

    self.updateData = updateFormpData;

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

function updateFormpData(rForm, oForm, sc) {
        oForm.detail.head.loading = 0;
        if (rForm.detail.head.error != "1") {
            if (rForm.schema.idvals) oForm.schema.idvals = angular.copy(rForm.schema.idvals);
            if (rForm.detail.head) oForm.detail.head = angular.copy(rForm.detail.head);
            if (rForm.detail.cols) oForm.detail.cols = angular.copy(rForm.detail.cols);
            oForm.detail.vals = angular.copy(rForm.detail.vals);
         
            // don't directly copy listTables,   we will reservce user-defined checklist;
            if (rForm.listTables) {
				if(!oForm.listTables) oForm.listTables = {};
				$.extend(oForm.listTables.checklist, rForm.listTables.checklist);  
				$.extend(oForm.listTables.clist, rForm.listTables.clist);  
				$.extend(oForm.listTables.vlist, rForm.listTables.vlist);  
				$.extend(oForm.listTables.tablelist, rForm.listTables.tablelist);  
			}
			/*			
			if (rForm.listTables) {
				if(!oForm.listTables) oForm.listTables = {}; 
				$.extend(oForm.listTables, rForm.listTables);  
			}
			*/

        } else {
            if (rForm.schema.idvals) oForm.schema.idvals = angular.copy(rForm.schema.idvals);
            if (rForm.detail.head) oForm.detail.head = angular.copy(rForm.detail.head);
            if (rForm.detail.cols) oForm.detail.cols = angular.copy(rForm.detail.cols);
            if (rForm.listTables) if(rForm.listTables.tablelist) oForm.listTables.tablelist = angular.copy(rForm.listTables.tablelist);
        }
        sc.$apply();
}