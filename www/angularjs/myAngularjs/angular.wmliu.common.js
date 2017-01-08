// [[@:location]]  if location!="" ,  then output @
String.prototype.conreplace = function (rarr) {
    var ret = this.toString();
    var partt = /{{(\w+):?(.)?}}/ig;
    var mm = ret.match(partt);  // return match array 
    ret = ret.cccplace(mm, rarr);
    return ret;
}

// [[@:location]]  if location!="" ,  then output @
String.prototype.cccplace = function (sarr, rarr) {
    var ret = this.toString();

    for (var key in sarr) {
        var tmp = sarr[key].replaceAll("{", "").replaceAll("}", "");
        var tmp1 = tmp.split(":");
        var col = tmp1[0] ? tmp1[0] : "";
        var out = tmp1[1] ? tmp1[1] : "";
        // value of location 
        var val = rarr[col] ? rarr[col] : "";
        if (out != "" && val!="")
            ret = ret.replaceAll(sarr[key], out + val);
        else
            ret = ret.replaceAll(sarr[key], val);
    }

    return ret;
}


String.prototype.colreplace = function (rarr) {
    var ret = this.toString();
    var partt = /{{(\w+)}}/ig;
    var mm = ret.match(partt);  // return match array 
    ret = ret.areplace(mm, rarr);
    return ret;
}

String.prototype.areplace = function (sarr, rarr) {
    var ret = this.toString();
    for (var key in sarr) {
        var col = sarr[key].replaceAll("{", "").replaceAll("}", "");
        ret = ret.replaceAll(sarr[key], rarr[col]!=undefined?rarr[col]:"");
    }
    return ret;
}

String.prototype.vtext = function (list) {
    var cstr = this.toString();
    var cc = $.grep(list, function (e, i) {
        //console.log(e.key + " : " + this.toString());   don't use this here, it present $.grep object
        if (e.key == cstr)
            return true;
    });

    if (cc.length > 0) {
        return cc[0].title;
    } else {
        return "";
    }
}

function getTimezone() {
    var d = new Date();
    return d.getTimezoneOffset();    
}

function langCol(colName, lang) {
    var ret_col = colName;
    if(lang) {
        switch(lang) {
            case "tw":
            case "hk":
                ret_col = ret_col + "_cn";
                break;
            default:
                ret_col = ret_col + "_" + lang;
                break;
        }
    } else {
        ret_col = ret_col + "_cn";
    }
    return ret_col;
}


