/**
* Sutton SignWriting JavaScript Library v2.2.0
* https://github.com/Slevinski/SuttonSignWriting
* Copyright (c) 2007-2018, Stephen E Slevinski Jr
* SuttonSignWriting.js is released under the MaIT License.
*/
var ssw = {
  re : {
    "fsw": {
      "sign": "(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*",
      "spatial": "S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3}",
      "symbol": "S[123][0-9a-f]{2}[0-5][0-9a-f]",
      "coord": "[0-9]{3}x[0-9]{3}",
      "sort": "A",
      "box": "[BLMR]",
      "query": "Q((A(S[123][0-9a-f]{2}[0-5u][0-9a-fu]|R[123][0-9a-f]{2}t[123][0-9a-f]{2})+)?T)?((R[123][0-9a-f]{2}t[123][0-9a-f]{2}([0-9]{3}x[0-9]{3})?)|(S[123][0-9a-f]{2}[0-5u][0-9a-fu]([0-9]{3}x[0-9]{3})?))*(V[0-9]+)?-?"
    },
    "swu": {
      "sign": "(\uD836\uDC00(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FB][\uDC00-\uDFFF])|(\uD8FC[\uDC00-\uDEA0])))+)?\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FA][\uDC00-\uDFFF])|(\uD8FB[\uDC00-\uDFA0]))(\uD836[\uDC0C-\uDDFF]){2})*",
      "spatial": "((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2}",
      "symbol": "((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))",
      "coord": "(\uD836[\uDC0C-\uDDFF]){2}",
      "sort": "\uD836\uDC00",
      "box": "\uD836[\uDC01-\uDC04]",
      "query": "Q((A(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))f?r?|R((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))f?r?((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))f?r?)+)?T)?((R((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))f?r?((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))f?r?(\uD836[\uDC0C-\uDDFF]\uD836[\uDC0C-\uDDFF])?)|(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))f?r?(\uD836[\uDC0C-\uDDFF]\uD836[\uDC0C-\uDDFF])?))*(V[0-9]+)?-?"
    },
    "style": "-C?(P[0-9]{2})?(G_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)_)?(D_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)(,([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+))?_)?(Z([0-9]+(.[0-9]+)?|x))?(-(D[0-9]{2}_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)(,([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+))?_)*(Z[0-9]{2},[0-9]+(.[0-9]+)?(,[0-9]{3}x[0-9]{3})?)*)?(--?[_a-zA-Z][_a-zA-Z0-9-]{0,100}( -?[_a-zA-Z][_a-zA-Z0-9-]{0,100})*!([a-zA-Z][_a-zA-Z0-9-]{0,100}!)?)?"
  },
  encode: function(text){
    text = text.replace(/[\u007F-\uFFFF]/g, function(chr) {
      return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4).toUpperCase();
    });
    return text;
  },
  decode: function(text){
    text = text.replace(/\\u([0-9A-F]{4})/g, function (match, chr) {
      return String.fromCharCode(parseInt(chr, 16));
    });
    return text;
  },
  pair: function(value){
    //utf-16 code points
    var code;
    if (ssw.chars(value)=="swu"){
      value = ssw.swu2hex(value);
    }
    var re = '[0-9A-F]{5}';
    var swu2hex = value.match(new RegExp(re));
    if (swu2hex) {
      code = parseInt(value,16);
    } else {
      return false;
    }
    var str = String.fromCharCode(0xD800 + (((code) - 0x10000) >> 10), 0xDC00 + (((code) - 0x10000) & 0x3FF));
    if (value && str.length == 2){
      return [str.charCodeAt(0).toString(16).toUpperCase(),str.charCodeAt(1).toString(16).toUpperCase()];
    } else {
      return false;
    }
  },
  chars: function(line){
    if (!line) return '';
    var re,match;
    re = '^[A-F0-9]{5}';
    var hex = line.match(new RegExp(re));
    if (hex) {
      return "hex";
    }

    var re = '^[ABLMRSxa-f0-9]{5,}';
    var fsw = line.match(new RegExp(re));
    if (fsw) {
      return "fsw";
    }

    re = '^[0-9]{3}';
    var num = line.match(new RegExp(re));
    if (num) {
      return "num";
    }

    //rangeu("1D800","1D9FF");
    //rangeu("40001","4F480")
    var re = "^((\uD836[\uDC00-\uDDFF])|(\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))+";
    var swu = line.match(new RegExp(re));
    if (swu) {
      return "swu";
    }
    return '';
  },
  parse: function(line,find,all){
    var start = (find||all)?"":"^";
    var re,match,pos,info;
    switch(find || ssw.chars(line)){
      case "hex":
        re = start + '[A-F0-9]{5}';
        var hex = line.match(new RegExp(re,all?"g":''));
        if (hex) {
          info = {chars:"hex","hex":hex[0]};
          if (all){
            info["all"] = hex;
          } else {
            info["line"] = line;
          }
          return info;
        }
        break;
      case "num":
        re = start + '[0-9]{3}';
        var num = line.match(new RegExp(re,all?"g":''));
        if (num) {
          info = {chars:"num","num":num[0]};
          if (all){
            info["all"] = num;
          } else {
            info["line"] = line;
          }
          return info;
        }
        break;
      case "fsw":
        if (all){
          re = start + "(" + ssw.re["fsw"]["sign"] + "(" + ssw.re["style"] + ")?|" + ssw.re["fsw"]["spatial"] + "(" + ssw.re["style"] + ")?)";
        } else {
          re = start + ssw.re["fsw"]["sign"] + "(" + ssw.re["style"] + ")?";
        }
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"fsw",type:"sign"};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          pos = match[0].indexOf("-");
          if (pos>-1){
            info["fsw"] = match[0].slice(0,pos);
            info["style"] = match[0].slice(pos);
          } else {
            info["fsw"] = match[0];
          }
          return info;
        }
        re = start + ssw.re["fsw"]["spatial"] + "(" + ssw.re["style"] + ")?";
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"fsw",type:"spatial"};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          pos = match[0].indexOf("-");
          if (pos>-1){
            info["fsw"] = match[0].slice(0,pos);
            info["style"] = match[0].slice(pos);
          } else {
            info["fsw"] = match[0];
          }
          return info;
        }
        re = start + ssw.re["fsw"]["symbol"] + "(" + ssw.re["style"] + ")?";
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"fsw",type:"symbol"};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          pos = match[0].indexOf("-");
          if (pos>-1){
            info["fsw"] = match[0].slice(0,pos);
            info["style"] = match[0].slice(pos);
          } else {
            info["fsw"] = match[0];
          }
          return info;
        }
        re = start + ssw.re["fsw"]["coord"];
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"fsw",type:"coord","fsw":match[0]};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          return info;
        }
        break;
      case "swu":
        if (all){
          re = start + "(" + ssw.re["swu"]["sign"] + "(" + ssw.re["style"] + ")?|" + ssw.re["swu"]["spatial"] + "(" + ssw.re["style"] + ")?)";
        } else {
          re = start + ssw.re["swu"]["sign"] + "(" + ssw.re["style"] + ")?";
        }
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"swu",type:"sign"};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          pos = match[0].indexOf("-");
          if (pos>-1){
            info["swu"] = match[0].slice(0,pos);
            info["style"] = match[0].slice(pos);
          } else {
            info["swu"] = match[0];
          }
          return info;
        }
        re = start + ssw.re["swu"]["spatial"] + "(" + ssw.re["style"] + ")?";
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"swu",type:"spatial"};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          pos = match[0].indexOf("-");
          if (pos>-1){
            info["swu"] = match[0].slice(0,pos);
            info["style"] = match[0].slice(pos);
          } else {
            info["swu"] = match[0];
          }
          return info;
        }
        re = start + ssw.re["swu"]["symbol"] + "(" + ssw.re["style"] + ")?";
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"swu",type:"symbol"};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          pos = match[0].indexOf("-");
          if (pos>-1){
            info["swu"] = match[0].slice(0,pos);
            info["style"] = match[0].slice(pos);
          } else {
            info["swu"] = match[0];
          }
          return info;
        }
        re = start + ssw.re["swu"]["coord"];
        match = line.match(new RegExp(re,all?"g":''));
        if (match) {
          info = {chars:"swu",type:"coord","swu":match[0]};
          if (all){
            info["all"] = match;
          } else {
            info["line"] = line;
          }
          return info;
        }
        break;
    }
    return false;
  },
  fsw2swu: function(text){
    if (!text) return '';
    var code = parseInt('1D800',16);
    var fsw = text.replace(/B/g,'B!');
    var len,str,coord,key;
    fsw = fsw.replace(/A/g,String.fromCharCode(0xD800 + (((code) - 0x10000) >> 10), 0xDC00 + (((code) - 0x10000) & 0x3FF)));
    fsw = fsw.replace(/B!/g,String.fromCharCode(0xD800 + (((code+1) - 0x10000) >> 10), 0xDC00 + (((code+1) - 0x10000) & 0x3FF)));
    fsw = fsw.replace(/L/g,String.fromCharCode(0xD800 + (((code+2) - 0x10000) >> 10), 0xDC00 + (((code+2) - 0x10000) & 0x3FF)));
    fsw = fsw.replace(/M/g,String.fromCharCode(0xD800 + (((code+3) - 0x10000) >> 10), 0xDC00 + (((code+3) - 0x10000) & 0x3FF)));
    fsw = fsw.replace(/R/g,String.fromCharCode(0xD800 + (((code+4) - 0x10000) >> 10), 0xDC00 + (((code+4) - 0x10000) & 0x3FF)));
    var matches = fsw.match(new RegExp(ssw.re['fsw']['coord'],'g'));
    len = matches?matches.length:0;
    var i;
    for(i=0; i<len; i+=1) {
      str = matches[i];
      coord = str.split('x');
      coord = coord.map(function(c){  
        c = 0x1D80C + parseInt(c) - 250;
        return String.fromCharCode(0xD800 + ((c - 0x10000) >> 10), 0xDC00 + ((c - 0x10000) & 0x3FF));
      });
      fsw = fsw.replace(str,coord.join(''));
    }
    var pattern = 'S[123][0-9a-f]{2}[0-5][0-9a-f]';
    var matches = fsw.match(new RegExp(pattern,'g'));
    var len = matches?matches.length:0;
    for(i=0; i<len; i+=1) {
      key = matches[i];
      fsw = fsw.replace(key,ssw.uni(key,"4"));
    }
    return fsw;
  },
  swu2fsw: function(text){
    if (!text) return '';
    var fsw=text.replace(/𝠀/g,"A").replace(/𝠁/g,"B").replace(/𝠂/g,"L").replace(/𝠃/g,"M").replace(/𝠄/g,"R");
    var syms = fsw.match(new RegExp(ssw.re['swu']['symbol'],'g'));
    if (syms) {
      syms.forEach(function(sym){
        var hexcode = ssw.swu2hex(sym);
        var symcode = parseInt(hexcode.slice(1),16) -1;
        var base = parseInt(symcode/96);
        var key = "S" + (base+256).toString(16);
        var fill = parseInt((symcode-(base*96))/16);
        key += fill.toString(16);
        var rot = parseInt(symcode-(base*96)-(fill*16));
        key += rot.toString(16);
        fsw = fsw.replace(sym,key);
      });
    }
    var coords = fsw.match(new RegExp(ssw.re['swu']['coord'],'g'));
    if (coords) {
      coords.forEach(function(coord){
        var n1 = parseInt(ssw.swu2hex(coord.slice(0,2)),16) - 0X1D80C + 250;
        var n2 = parseInt(ssw.swu2hex(coord.slice(2,4)),16) - 0X1D80C + 250;
        if (n1>=250 && n1<749 && n2>=250 && n2<749){
          fsw = fsw.replace(coord,n1 + "x" + n2);
        } else {
          throw("invalid numbers: " + n1 + ", " + n2);
        }
      });
    }
    return fsw;
  },
  swu2hex: function (value){
    var cp = value.codePointAt(0);
    if (cp) {
      var hex = value.codePointAt(0).toString(16).toUpperCase();
      if (hex.length<=4) return false;
      return hex;
    } else {
      return false;
    }
  },
  symbol: function(text,style){
    var parsed = ssw.parse(text);
    var re;
    switch(parsed['chars']){
      case "swu":
        re = ssw.re["swu"]["symbol"] + "(" + ssw.re["swu"]["coord"] + ")?";
        break;
      case "fsw":
        re = ssw.re["fsw"]["symbol"] + "(" + ssw.re["fsw"]["coord"] + ")?";
        break;
      default:
        return '';
    }
    if (style){
      re += '(' + ssw.re['style'] + ')?';
    }
    var key = text.match(new RegExp(re));
    if (!key) {
      return '';
    } else {
      return key[0];
    }
  },
  sign: function(text,style){
    var parsed = ssw.parse(text);
    var re;
    switch(parsed['chars']){
      case "swu":
        re = ssw.re["swu"]["sign"];
        break;
      case "fsw":
        re = ssw.re["fsw"]["sign"];
        break;
      default:
        return '';
    }
    if (style){
      re += '(' + ssw.re['style'] + ')?';
    }
    var fsw = text.match(new RegExp(re));
    if (!fsw) {
      return ssw.symbol(text,style);
    } else {
      return fsw[0];
    }
  },
  mirror: function(key){
    key = ssw.symbol(key);
    var extra;
    var parsed = ssw.parse(key);
    switch(parsed['chars']){
      case "swu":
        extra = key.slice(2);
        key = ssw.swu2fsw(key.slice(0,2));
        break;
      case "fsw":
        extra = key.slice(6);
        key = ssw.swu2fsw(key.slice(0,6));
        break;
      default:
        return false;
    }
    if (!ssw.size(key)) {return '';}
    var base = key.slice(0,4);
    var fill = key.slice(4,5);
    var rot = parseInt(key.slice(5,6),16);
    var key1 = base + "08";
    var key2 = base + "18";
    var rAdd;
    if (ssw.size(key1) || ssw.size(key2)){
      rAdd = 8;
    } else {
      if ((rot===0) || (rot==4)) {rAdd=0;}
      if ((rot==1) || (rot==5)) {rAdd=6;}
      if ((rot==2) || (rot==6)) {rAdd=4;}
      if ((rot==3) || (rot==7)) {rAdd=2;}
    }
    key='';
    while (!ssw.size(key)) {
      rot += rAdd;
      if ((rot>7) && (rAdd<8)) { rot = rot -8;}
      if (rot>15) { rot = rot -16;}
      key = base + fill + rot.toString(16);
    }
    if (parsed['chars'] == "swu") {
      key = ssw.fsw2swu(key);
    }
    return key + extra;
  },
  fill: function(key,step){
    key = ssw.symbol(key);
    var extra;
    var parsed = ssw.parse(key);
    switch(parsed['chars']){
      case "swu":
        extra = key.slice(2);
        key = ssw.swu2fsw(key.slice(0,2));
        break;
      case "fsw":
        extra = key.slice(6);
        key = ssw.swu2fsw(key.slice(0,6));
        break;
      default:
        return false;
    }
    if (!ssw.size(key)) {return '';}
    if (step!=-1) {step=1;}
    var base = key.slice(0,4);
    var fill = parseInt(key.slice(4,5));
    var rot = key.slice(5,6);
    key='';
    while (!ssw.size(key)){
      fill += step;
      if (fill>5) {fill=0;}
      if (fill<0) {fill=5;}
      key = base + fill + rot;
    }
    if (parsed['chars'] == "swu") {
      key = ssw.fsw2swu(key);
    }
    return key + extra;
  },
  rotate: function(key,step){
    key = ssw.symbol(key);
    var extra;
    var parsed = ssw.parse(key);
    switch(parsed['chars']){
      case "swu":
        extra = key.slice(2);
        key = ssw.swu2fsw(key.slice(0,2));
        break;
      case "fsw":
        extra = key.slice(6);
        key = ssw.swu2fsw(key.slice(0,6));
        break;
      default:
        return false;
    }
    if (!ssw.size(key)) {return '';}
    if (step!=-1) {step=1;}
    var base = key.slice(0,4);
    var fill = key.slice(4,5);
    var rot = parseInt(key.slice(5,6),16);
    key='';
    while (!ssw.size(key)){
      if (rot>7){
        rot += step;
        if (rot>15) {rot=8;}
        if (rot<8) {rot=15;}
        key = base + fill + rot.toString(16);
      } else {
        rot -= step;
        if (rot>7) {rot=0;}
        if (rot<0) {rot=7;}
        key = base + fill + rot;
      }
    }
    if (parsed['chars'] == "swu") {
      key = ssw.fsw2swu(key);
    }
    return key + extra;
  },
  scroll: function(key,step){
    key = ssw.symbol(key);
    var extra;
    var parsed = ssw.parse(key);
    switch(parsed['chars']){
      case "swu":
        extra = key.slice(2);
        key = ssw.swu2fsw(key.slice(0,2));
        break;
      case "fsw":
        extra = key.slice(6);
        key = ssw.swu2fsw(key.slice(0,6));
        break;
      default:
        return false;
    }
    if (!ssw.size(key)) {return '';}
    if (step!=-1) {step=1;}
    var base = parseInt(key.slice(1,4),16) + step;
    var fill = key.slice(4,5);
    var rot = key.slice(5,6);
    var nkey= 'S' + base.toString(16) + fill + rot;
    if(ssw.size(nkey)){
      key = nkey;
    } else {
      nkey = ssw.view(nkey);
      if(ssw.size(nkey)){
        key = nkey;
      }
    }
    if (parsed['chars'] == "swu") {
      key = ssw.fsw2swu(key);
    }
    return key + extra;
  },
  structure: function(division,key,option){
    key = ssw.symbol(key);
    var parsed = ssw.parse(key);
    switch(parsed['chars']){
      case "swu":
        key = ssw.swu2fsw(key);
      case "fsw":
        break;
      default:
    }
    var arrs = {kind:['S100','S37f','S387'],
      category:['S100','S205','S2f7','S2ff','S36d','S37f','S387'],
      group:['S100','S10e','S11e','S144','S14c','S186','S1a4','S1ba','S1cd','S1f5','S205','S216','S22a','S255','S265','S288','S2a6','S2b7','S2d5','S2e3','S2f7','S2ff','S30a','S32a','S33b','S359','S36d','S376','S37f','S387']
    };
    var arr = arrs[division];
    if (!arr) {return !key?[]:option=="is"?false:'';}
    if (!key&&!option) {return arr;}
    if (!option) {option='';}
    var adj;
    switch(option){
      case 'is':
        return (arr.indexOf(key.slice(0,4))==-1)?false:true;
      case 'first':
        return arr[0];
      case 'last':
        return arr.slice(-1)[0];
      case 'prev':
        adj = -2;
        break;
      case '':
        adj = -1;
        break;
      case 'next':
        adj = 0;
        break;
      default:
        return '';
    }
    var i;
    var index = arr.length;
    for(i=0; i<arr.length; i+=1) {
      if(parseInt(key.slice(1,4),16) < parseInt(arr[i].slice(1,4),16)) {
        index = i;
        break;
      }
    }
    index += adj;
    index = index<0?0:index>=arr.length?arr.length-1:index;
    return arr[index];
  },
  type: function(type){
    var start;
    var end;
    switch(type) {
      case "writing":
        start = '100';
        end = '37e';
        break;
      case "hand":
        start = '100';
        end = '204';
        break;
      case "movement":
        start = '205';
        end = '2f6';
        break;
      case "dynamic":
        start = '2f7';
        end = '2fe';
        break;
      case "head":
      case "hcenter":
        start = '2ff';
        end = '36c';
        break;
      case "vcenter":
        start = '2ff';
        end = '375';
        break;
      case "trunk":
        start = '36d';
        end = '375';
        break;
      case "limb":
        start = '376';
        end = '37e';
        break;
      case "location":
        start = '37f';
        end = '386';
        break;
      case "punctuation":
        start = '387';
        end = '38b';
        break;
      default:
        start = '100';
        end = '38b';
        break;
    }
    return [start,end];
  },
  is: function(key,type){
    key = ssw.symbol(key);
    var parsed = ssw.parse(key);
    switch(parsed['chars']){
      case "swu":
        key = ssw.swu2fsw(key);
      case "fsw":
        break;
      default:
        return false;
    }
    var range = ssw.type(type);
    var start = range[0];
    var end = range[1];
    var char = key.slice(1,4);
    return (parseInt(start,16)<=parseInt(char,16) && parseInt(end,16)>=parseInt(char,16));
  },
  filter: function (text,type) {
    var parsed,parts;
    switch(ssw.chars(text)){
      case "swu":
        parsed = ssw.parse(text,"swu","spatials");
        text = ssw.swu2fsw((parsed.all||[]).join(''));
        break;
      case "fsw":
        parsed = ssw.parse(text,"fsw","spatials");
        text = (parsed.all||[]).join('');
        break;
      default:
        return '';
    }
    var range = ssw.type(type);
    var start = range[0];
    var end = range[1];
    var re = 'S' + ssw.range(start,end,1) + '[0-5][0-9a-f][0-9]{3}x[0-9]{3}';
    var matches = text.match(new RegExp(re,'g'));
    if (!matches){
      return '';
    }
    text = matches.join('');
    if (parsed['chars']=="swu"){
      text = ssw.fsw2swu(text);
    }
    return text;
  },
  random: function(type,swu) {
    var range = ssw.type(type);
    var start = range[0];
    var end = range[1];
    var rBase = Math.floor(Math.random() * (parseInt(end,16)-parseInt(start,16)+1) + parseInt(start,16));
    var rFill = Math.floor(Math.random() * 6);
    var rRota = Math.floor(Math.random() * 16);
    var key = "S" + rBase.toString(16) + rFill.toString(16) + rRota.toString(16);
    if (ssw.size(key)){
      if (swu){
        return ssw.fsw2swu(key);
      } else {
        return key;
      }
    } else {
      return ssw.random(type,swu);
    }
  },
  colorize: function(key) {
    key = ssw.symbol(key);
    if (ssw.chars(key)=="swu"){
      key = ssw.swu2fsw(key);
    }
    var color = '000000';
    if (ssw.is(key,'hand')) {color = '0000CC';}
    if (ssw.is(key,'movement')) {color = 'CC0000';}
    if (ssw.is(key,'dynamic')) {color = 'FF0099';}
    if (ssw.is(key,'head')) {color = '006600';}
//    if (ssw.is(key,'trunk')) {color = '000000';}
//    if (ssw.is(key,'limb')) {color = '000000';}
    if (ssw.is(key,'location')) {color = '884411';}
    if (ssw.is(key,'punctuation')) {color = 'FF9900';}
    return color;
  },
  view: function(key,fillone) {
    key = ssw.symbol(key);
    var chars = ssw.chars(key);
    if (chars=="swu"){
      key = ssw.swu2fsw(key);
    }
    if (!ssw.is(key)) {return '';}
    var prefix = key.slice(0,4);
    if (fillone){
      key = prefix + ((ssw.size(prefix + '00'))?'0':'1') +'0';
    } else {
      key = prefix + ((ssw.is(key,'hand') && !ssw.structure('group',key,'is'))?'1':'0') +'0';
    }
    if (chars=="swu"){
      return ssw.fsw2swu(key);
    } else {
      return key;
    }
  },
  uni: function(text,plane,hexval){
    var parsed = ssw.parse(text);
    var re,i,key;
    switch(parsed['chars']){
      case "swu":
        re = ssw.re["swu"]["symbol"];
        break;
      case "fsw":
        re = ssw.re["fsw"]["symbol"];
        break;
      case "hex":
        re = '[0-9A-F]{5}';
        break;
      default:
        return false;
    }
    var matches = text.match(new RegExp(re,'g'));
    var len = matches?matches.length:0;
    var code;
    for(i=0; i<len; i+=1) {
      key = matches[i];
      switch(parsed['chars']){
        case "swu":
          key = ssw.swu2fsw(key);
        case "fsw":
          code = parseInt(plane + "0000", 16) + ((parseInt(key.slice(1,4),16) - 256) * 96) + ((parseInt(key.slice(4,5),16))*16) + parseInt(key.slice(5,6),16) + 1;
          break;
        case "hex":
          code = parseInt(key,16);
          break;
      }
      key = key.replace(key.substr(0,6),hexval?code.toString(16).toUpperCase():String.fromCharCode(0xD800 + ((code - 0x10000) >> 10), 0xDC00 + ((code - 0x10000) & 0x3FF)));
      text = text.replace(matches[i],key);
    }
    return text;
  },
  bbox: function(fsw) {
    var chars = ssw.chars(fsw);
    if (chars=="swu"){
      fsw = ssw.swu2fsw(fsw);
    }
    var rcoord = /[0-9]{3}x[0-9]{3}/g;
    var x;
    var y;
    var x1;
    var x2;
    var y1;
    var y2;
    var coords = fsw.match(rcoord);
    if (coords){
      var i;
      for (i=0; i < coords.length; i+=1) {
        x = parseInt(coords[i].slice(0, 3));
        y = parseInt(coords[i].slice(4, 7));
        if (i===0){
          x1 = x;
          x2 = x;
          y1 = y;
          y2 = y;
        } else {
          x1 = Math.min(x1, x);
          x2 = Math.max(x2, x);
          y1 = Math.min(y1, y);
          y2 = Math.max(y2, y);
        }
      }
      if (x1==x2 && y1==y2){
        if (x1>500) {
          x1 = 1000 - x1;
        } else {
          x2 = 1000 - x2;
        }
        if (y1>500) {
          y1 = 1000 - y1;
        } else {
          y2 = 1000 - y2;
        }
      }
      if (chars == "swu"){
        return ssw.fsw2swu('' + x1 + 'x' + x2 + '' + y1 + 'x' + y2);
      } else {
        return '' + x1 + ' ' + x2 + ' ' + y1 + ' ' + y2;
      }
    } else {
      return '';
    }
  },
  displace: function(text,x,y){
    var chars = ssw.chars(text);
    if (chars=="swu"){
      text = ssw.swu2fsw(text);
    }
    var xpos;
    var ypos;
    var re = '[0-9]{3}x[0-9]{3}';
    var matches = text.match(new RegExp(re,'g'));
    if (matches){
      var i;
      for(i=0; i<matches.length; i+=1) {
        xpos = parseInt(matches[i].slice(0, 3)) + x;
        ypos = parseInt(matches[i].slice(4, 7)) + y;
        text = text.replace(matches[i],xpos + "X" + ypos);
      }
      text = text.replace(/X/g,"x");
    }
    if (chars == "swu"){
      return ssw.fsw2swu(text);
    } else {
      return text;
    }
    return text;
  },
  sizes:{
  },
  size: function(text) {
    var parsed = ssw.parse(text);
    switch(parsed['chars']){
      case "swu":
        text = ssw.swu2fsw(text);
        break;
      case "fsw":
        break;
      default:
        return false;
    }
    if (parsed.type == "sign" || parsed.type == "spatial"){
      var bbox = ssw.bbox(ssw.sign(text));
      bbox = bbox.split(' ');
      var x1 = bbox[0];
      var x2 = bbox[1];
      var y1 = bbox[2];
      var y2 = bbox[3];
      size = (x2-x1) + 'x' + (y2-y1);
      if (size=='0x0') {return '';}
      return size;
    
    }

    var w;
    var h;
    var s;
    var size;

    var fsw = ssw.sign(text);
    if (fsw) {
    }
    var key = ssw.symbol(text);
    if (!key) {return '';}
    if (ssw.sizes[key]) {return ssw.sizes[key];}

    var imgData;
    var i;
    var zoom = 2;
    var bound = 76 * zoom;
    if (!ssw.canvaser){
      ssw.canvaser = document.createElement("canvas");
      ssw.canvaser.width = bound;
      ssw.canvaser.height = bound;
    }
    var canvas = ssw.canvaser;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, bound, bound);
    context.font = (30*zoom) + "px 'SuttonSignWritingLine'";
    context.fillText(ssw.uni(key,"F"),0,0);
    imgData = context.getImageData(0,0,bound,bound).data;

    wloop:
    for (w=bound-1;w>=0;w--){
      for (h=0;h<bound;h+=1){
        for (s=0;s<4;s+=1){
          i=w*4+(h*4*bound) +s;
          if (imgData[i]){
            break wloop;
          }
        }
      }
    }
    var width = w;
    hloop:
    for (h=bound-1;h>=0;h--){
      for (w=0;w<width;w+=1){
        for (s=0;s<4;s+=1){
          i=w*4+(h*4*bound) +s;
          if (imgData[i]){
            break hloop;
          }
        }
      }
    }
    var height = h+1;
    width= '' + Math.ceil(width/zoom);
    height= '' + Math.ceil(height/zoom);
    // Rounding error in chrome.  Manual fixes.
    if ('S19559'.indexOf(key)>-1){
      width = '19';
    }
    if ('S16d03 S16d0f S16d1f S16d2f S16d23 S16d43 S16d53 S1710d S1711d S1712d S17311 S17321 S17733 S1773f S17743 S1774f S17753 S1775f S16d33 S1713d S1714d S17301 S17329 S1715d'.indexOf(key)>-1){
      width = '20';
    }
    if ('S24c15 S24c30'.indexOf(key)>-1){
      width = '22';
    }
    if ('S2903b'.indexOf(key)>-1){
      width = '23';
    }
    if ('S1d203 S1d233'.indexOf(key)>-1){
      width = '25';
    }
    if ('S24c15'.indexOf(key)>-1){
      width = '28';
    }
    if ('S2e629'.indexOf(key)>-1){
      width = '29';
    }
    if ('S23425'.indexOf(key)>-1){
      width = '30';
    }
    if ('S2d316'.indexOf(key)>-1){
      width = '40';
    }
    if ('S2541a'.indexOf(key)>-1){
      width = '50';
    }
    if ('S1732f S17731 S17741 S17751'.indexOf(key)>-1){
      height = '20';
    }
    if ('S1412c'.indexOf(key)>-1){
      height = '21';
    }
    if ('S2a903'.indexOf(key)>-1){
      height = '31';
    }
    if ('S2b002'.indexOf(key)>-1){
      height = '36';
    }
    size = width + 'x' + height;
    // Error in chrome.  Manual fix.
    if (size=='0x0') {
      var sizefix = 'S1000815x30 S1000921x30 S1000a30x15 S1000b30x21 S1000c15x30 S1000d21x30 ';
      var ipos = sizefix.indexOf(key);
      if (ipos ==-1) {
        size = '';
      } else {
        var iend = sizefix.indexOf(' ',ipos);
        size = sizefix.slice(ipos + 6,iend);
      }
    } else {
      ssw.sizes[key]=size;
    }
    return size;
  },
  max: function(fsw,type){
    var chars = ssw.chars(fsw);
    if (chars=="swu"){
      fsw = ssw.swu2fsw(fsw);
    }
    var range = ssw.type(type);
    var start = range[0];
    var end = range[1];
    var re = 'S' + ssw.range(start,end,1) + '[0-5][0-9a-f][0-9]{3}x[0-9]{3}';
    var matches = fsw.match(new RegExp(re,'g'));
    if (matches){
      var key;
      var x;
      var y;
      var size;
      var output='';
      var i;
      for (i=0; i < matches.length; i+=1) {
        key = matches[i].slice(0,6);
        x = parseInt(matches[i].slice(6, 9));
        y = parseInt(matches[i].slice(10, 13));
        size =ssw.size(key).split('x');
        output += key + x + "x" + y + (x+parseInt(size[0])) + 'x' + (y+parseInt(size[1]));
      }
      if (chars=="swu"){
        return ssw.fsw2swu(output);
      } else {
        return output;
      }
    } else {
      return '';
    }
  },
  norm: function (fsw){
    var chars = ssw.chars(fsw);
    if (chars=="swu"){
      fsw = ssw.swu2fsw(fsw);
    }
    var minx;
    var maxx;
    var miny;
    var maxy;
    var hbox = ssw.bbox(ssw.max(fsw,'hcenter'));
    var vbox = ssw.bbox(ssw.max(fsw,'vcenter'));
    var box = ssw.bbox(ssw.max(fsw));
    
    if (!box) {return "";}
    if (vbox){
      minx = parseInt(vbox.slice(0,3));
      maxx = parseInt(vbox.slice(4,7));
    } else {
      minx = parseInt(box.slice(0,3));
      maxx = parseInt(box.slice(4,7));
    }
    if (hbox){
      miny = parseInt(hbox.slice(8,11));
      maxy = parseInt(hbox.slice(12,15));
    } else {
      miny = parseInt(box.slice(8,11));
      maxy = parseInt(box.slice(12,15));
    }
    var xcenter = parseInt((minx + maxx)/2);
    var ycenter = parseInt((miny + maxy)/2);
    var xdiff = 500 - xcenter;
    var ydiff = 500 - ycenter;
    var start = fsw.match(/(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]/);
    if (!start) {
      start = 'M';
    } else {
      start = start[0];
    }
    fsw = start + parseInt(box.slice(4,7)) + "x" + parseInt(box.slice(12,15)) + ssw.filter(fsw);
    fsw = ssw.displace(fsw,xdiff,ydiff);
    if (chars=="swu"){
      return ssw.fsw2swu(fsw);
    } else {
      return fsw;
    }
  },
  svg: function(text,options){
    var fsw = ssw.sign(text,true);
    var parsed = ssw.parse(fsw);
    var chars = parsed['chars'];
    if (chars=="swu"){
      fsw = ssw.swu2fsw(fsw);
    }
    console.log(fsw);
    if (!fsw) return '';
    var pos = fsw.indexOf("-");
    var styling;
    if (pos>-1){
      styling = fsw.slice(pos);
    }
    var stylings;
    var pos;
    var keysize;
    var colors;
    var i;
    var size;
    if (parsed['type'] == "symbol") {
      var key = ssw.symbol(fsw);
      keysize = ssw.size(key);
      if (!keysize) {return '';}
      if (key.length==6) {
        fsw = key + "500x500";
      } else {
        fsw = key;
      }
    }
    if (!options) {
      options = {};
    }
    if (options.size) {
      options.size = parseFloat(options.size) || 'x';
    } else {
      options.size = 1;
    }
    if (options.colorize) {
      options.colorize = true;
    } else {
      options.colorize = false;
    }
    if (options.pad) {
      options.pad = parseInt(options.pad);
    } else {
      options.pad = 0;
    }
    if (!options.line){
      options.line="black";
    } else {
      options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.line)?"#"+options.line:options.line;
    }
    if (!options.fill){
      options.fill="white";
    } else {
      options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.fill)?"#"+options.fill:options.fill;
    }
    if (!options.back){
      options.back="";
    } else {
      options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.back)?"#"+options.back:options.back;
    }
    options.E = [];
    options.F = [];
    options.copy = options.copy  || chars;

    if (styling){
      var rs;
      stylings = styling.split('-');
      rs = stylings[1].match(/C/);
      options.colorize = rs?true:false;

      rs = stylings[1].match(/P[0-9]{2}/);
      if (rs){
        options.pad = parseInt(rs[0].substring(1,rs[0].length));
      }

      rs = stylings[1].match(/G_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)_/);
      if (rs){
        var back = rs[0].substring(2,rs[0].length-1);
        options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(back)?"#"+back:back;
      }

      rs = stylings[1].match(/D_([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+))?_/);
      if (rs) {
        colors = rs[0].substring(2,rs[0].length-1).split(',');
        if (colors[0]) {
          options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
        }
        if (colors[1]) {
          options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
        }
      }

      rs = stylings[1].match(/Z([0-9]+(\.[0-9]+)?|x)/);
      if (rs){
        options.size = parseFloat(rs[0].substring(1,rs[0].length)) || 'x';
      }

      if (!stylings[2]) {
        stylings[2]='';
      }

      rs = stylings[2].match(/D[0-9]{2}_([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+))?_/g);
      if (rs) {
        for (i=0; i < rs.length; i+=1) {
          pos = parseInt(rs[i].substring(1,3));
          colors = rs[i].substring(4,rs[i].length-1).split(',');
          if (colors[0]) {
            colors[0] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
          }
          if (colors[1]) {
            colors[1] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
          }
          options.E[pos]=colors;
        }
      }

      rs = stylings[2].match(/Z[0-9]{2},[0-9]+(\.[0-9]+)?(,[0-9]{3}x[0-9]{3})?/g);
      if (rs){
        for (i=0; i < rs.length; i+=1) {
          pos = parseInt(rs[i].substring(1,3));
          size = rs[i].substring(4,rs[i].length).split(',');
          size[0]=parseFloat(size[0]);
          options.F[pos]=size;
        }
      }

      if (stylings.length>3){
        stylings = stylings.slice(3).join('-').split('!');
        options.class = stylings[0]?stylings[0]:'';
        options.id = stylings[1]?stylings[1]:'';
      }
    }

    var sym;
    var syms;
    var gelem;
    var rsym = /S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3}/g;
    var o = {};
    o.L = -1;
    o.R = 1;
    var x;
    var x1 = 500;
    var x2 = 500;
    var y;
    var y1 = 500;
    var y2 = 500;
    var k;
    var w;
    var h;
    var l;
    k = fsw.charAt(0);
    var bbox = ssw.bbox(fsw);
    bbox = bbox.split(' ');
    x1 = parseInt(bbox[0]);
    x2 = parseInt(bbox[1]);
    y1 = parseInt(bbox[2]);
    y2 = parseInt(bbox[3]);
    if (k == 'S') {
      if (x1==500 && y1==500){
        size = keysize.split('x');
        x2 = 500 + parseInt(size[0]);
        y2 = 500 + parseInt(size[1]);
      } else {
        x2 = 1000-x1;
        y2 = 1000-y1;
      }
    }
    syms = fsw.match(rsym);
    if (!syms) syms=[];
    var keysized;
    for (i=0; i < syms.length; i+=1) {
      sym = syms[i].slice(0,6);
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      if (options.F[i+1]){
        if (options.F[i+1][1]){
          x = parseInt(x) + parseInt(options.F[i+1][1].slice(0,3))-500;
          y = parseInt(y) + parseInt(options.F[i+1][1].slice(4,7))-500;
          x1 = Math.min(x1,x);
          y1 = Math.min(y1,y);
        }
        keysized = ssw.size(sym);
        if (keysized) {
          keysized = keysized.split('x');
          x2 = Math.max(x2,parseInt(x) + (options.F[i+1][0] * parseInt(keysized[0])));
          y2 = Math.max(y2,parseInt(y) + (options.F[i+1][0] * parseInt(keysized[1])));
        }

      }
      y = parseInt(y);
      gelem = '<g transform="translate(' + x + ',' + y + ')">';
      gelem += '<text ';
      gelem += 'class="sym-fill" ';
      if (!options.css) {
        gelem += 'style="pointer-events:none;font-family:\'SuttonSignWritingFill\';font-size:' + (options.F[i+1]?30*options.F[i+1][0]:30) + 'px;fill:' + (options.E[i+1]?options.E[i+1][1]?options.E[i+1][1]:options.fill:options.fill) + ';';
        gelem += '"';
      }
      gelem += '>';
      gelem += ssw.uni(sym,"10");
      gelem += '</text>';
      gelem += '<text ';
      gelem += 'class="sym-line" ';
      if (!options.css) {
        gelem += 'style="pointer-events:none;';
        gelem += 'font-family:\'SuttonSignWritingLine\';font-size:' + (options.F[i+1]?30*options.F[i+1][0]:30) + 'px;fill:' + (options.E[i+1]?options.E[i+1][0]:options.colorize?'#'+ssw.colorize(sym):options.line) + ';';
        gelem += '"';
      }
      gelem += '>';
      gelem += ssw.uni(sym,"F");
      gelem += '</text>';
      gelem += '</g>';
      syms[i] = gelem;
    }

    x1 = x1 - options.pad;
    x2 = x2 + options.pad;
    y1 = y1 - options.pad;
    y2 = y2 + options.pad;
    w = x2 - x1;
    h = y2 - y1;
    l = o[k] || 0;
    l = l * 75 + x1 - 400;
    var svg = '<svg ';
    if (options.class) {
      svg += 'class="' + options.class + '" ';
    }
    if (options.id) {
      svg += 'id="' + options.id + '" ';
    }
    svg += 'version="1.1" xmlns="http://www.w3.org/2000/svg" ';
    if (options.size!='x') {
      svg += 'width="' + (w * options.size) + '" height="' + (h * options.size) + '" ';
    }
    svg += 'viewBox="' + x1 + ' ' + y1 + ' ' + w + ' ' + h + '">';
    svg += '<text style="font-size:0%;">';
    if (options.copy == "swu"){
      svg += ssw.fsw2swu(fsw);
    } else {
      svg += text;
    }
    svg += '</text>';
    if (options.back) {
      svg += '  <rect x="' + x1 + '" y="' + y1 + '" width="' + w + '" height="' + h + '" style="fill:' + options.back + ';" />';
    }
    svg += syms.join('') + "</svg>";
    if (options.laned){
      svg = '<div style="padding:10px;position:relative;width:' + w + 'px;height:' + h + 'px;left:' + l + 'px;">' + svg + '</div>';
    }
    return svg;
  },
  canvas: function(text,options){
    var canvas = document.createElement("canvas");
    var fsw = ssw.sign(text,true);
    var parsed = ssw.parse(fsw);
    var chars = ssw.chars(fsw);
    if (chars=="swu"){
      fsw = ssw.swu2fsw(fsw);
    }
    var pos = fsw.indexOf("-");
    var styling;
    if (pos>-1){
      styling = fsw.slice(pos);
    }
    var stylings;
    var colors;
    var keysize;
    var keysized;
    var size;
    var i;
    var pos;
    if (parsed['type'] == "symbol") {
      var key = ssw.symbol(fsw);
      keysize=ssw.size(key);
      if (!key) {return '';}
      if (key.length==6) {
        fsw = key + "500x500";
      } else {
        fsw = key;
      }
    }
    if (!options) {
      options = {};
    }
    if (options.size) {
      options.size = parseFloat(options.size);
    } else {
      options.size = 1;
    }
    if (options.colorize) {
      options.colorize = true;
    } else {
      options.colorize = false;
    }
    if (options.pad) {
      options.pad = parseInt(options.pad);
    } else {
      options.pad = 0;
    }
    if (!options.line){
      options.line="black";
    } else {
      options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.line)?"#"+options.line:options.line;
    }
    if (!options.fill){
      options.fill="white";
    } else {
      options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.fill)?"#"+options.fill:options.fill;
    }
    if (!options.back){
      options.back="";
    } else {
      options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(options.back)?"#"+options.back:options.back;
    }
    options.E = [];
    options.F = [];

    if (styling){
      var rs;
      stylings = styling.split('-');

      rs = stylings[1].match(/C/);
      options.colorize = rs?true:false;

      rs = stylings[1].match(/P[0-9]{2}/);
      if (rs){
        options.pad = parseInt(rs[0].substring(1,rs[0].length));
      }

      rs = stylings[1].match(/G_([0-9a-fA-F]{3}([0-9a-fA-F]{3})?|[a-zA-Z]+)_/);
      if (rs){
        var back = rs[0].substring(2,rs[0].length-1);
        options.back = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(back)?"#"+back:back;
      }

      rs = stylings[1].match(/D_([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-zA-Z]+))?_/);
      if (rs) {
        colors = rs[0].substring(2,rs[0].length-1).split(',');
        if (colors[0]) {
          options.line = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
        }
        if (colors[1]) {
          options.fill = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
        }
      }

      rs = stylings[1].match(/Z[0-9]+(\.[0-9]+)?/);
      if (rs){
        options.size = rs[0].substring(1,rs[0].length);
      }

      if (!stylings[2]) {
        stylings[2]='';
      }

      rs = stylings[2].match(/D[0-9]{2}_([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+)(,([0-9a-f]{3}([0-9a-f]{3})?|[a-wyzA-Z]+))?_/g);
      if (rs) {
        for (i=0; i < rs.length; i+=1) {
          pos = parseInt(rs[i].substring(1,3));
          colors = rs[i].substring(4,rs[i].length-1).split(',');
          if (colors[0]) {
            colors[0] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[0])?"#"+colors[0]:colors[0];
          }
          if (colors[1]) {
            colors[1] = /^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/g.test(colors[1])?"#"+colors[1]:colors[1];
          }
          options.E[pos]=colors;
        }
      }

      rs = stylings[2].match(/Z[0-9]{2},[0-9]+(\.[0-9]+)?(,[0-9]{3}x[0-9]{3})?/g);
      if (rs){
        for (i=0; i < rs.length; i+=1) {
          pos = parseInt(rs[i].substring(1,3));
          size = rs[i].substring(4,rs[i].length).split(',');
          size[0]=parseFloat(size[0]);
          options.F[pos]=size;
        }
      }
    }

    var sym;
    var syms;
    var rsym = /S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3}/g;
    var o = {};
    o.L = -1;
    o.R = 1;
    var x;
    var x1 = 500;
    var x2 = 500;
    var y;
    var y1 = 500;
    var y2 = 500;
    var k;
    var w;
    var h;
    k = fsw.charAt(0);
    var bbox = ssw.bbox(fsw);
    bbox = bbox.split(' ');
    x1 = parseInt(bbox[0]);
    x2 = parseInt(bbox[1]);
    y1 = parseInt(bbox[2]);
    y2 = parseInt(bbox[3]);

    if (k == 'S') {
      if (x1==500 && y1==500){
        size = keysize.split('x');
        x2 = 500 + parseInt(size[0]);
        y2 = 500 + parseInt(size[1]);
      } else {
        x2 = 1000-x1;
        y2 = 1000-y1;
      }
    }

    syms = fsw.match(rsym);
    var len = syms?syms.length:0;
    for (i=0; i < len; i+=1) {
      sym = syms[i].slice(0,6);
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      if (options.F[i+1]){
        if (options.F[i+1][1]){
          x = parseInt(x) + parseInt(options.F[i+1][1].slice(0,3))-500;
          y = parseInt(y) + parseInt(options.F[i+1][1].slice(4,7))-500;
          x1 = Math.min(x1,x);
          y1 = Math.min(y1,y);
        }
        keysized = ssw.size(sym);
        if (keysized) {
          keysized = keysized.split('x');
          x2 = Math.max(x2,parseInt(x) + (options.F[i+1][0] * parseInt(keysized[0])));
          y2 = Math.max(y2,parseInt(y) + (options.F[i+1][0] * parseInt(keysized[1])));
        }

      }
    }

    x1 = x1 - options.pad;
    x2 = x2 + options.pad;
    y1 = y1 - options.pad;
    y2 = y2 + options.pad;
    w = (x2-x1) * options.size;
    h = (y2-y1) * options.size;
    canvas.width = w?w:1;
    canvas.height = h?h:1;
    var context = canvas.getContext("2d");
    if (options.back){
      context.rect(0,0,w,h);
      context.fillStyle=options.back;
      context.fill();
//      context.fillStyle = options.back;
//      context.fillRect(0,0,w,h);
    }
    syms = fsw.match(rsym);
    for (i=0; i < len; i+=1) {
      sym = syms[i].slice(0,6);
      x = syms[i].slice(6, 9);
      y = syms[i].slice(10, 13);
      if (options.F[i+1]){
        if (options.F[i+1][1]){
          x = parseInt(x) + parseInt(options.F[i+1][1].slice(0,3))-500;
          y = parseInt(y) + parseInt(options.F[i+1][1].slice(4,7))-500;
          x1 = Math.min(x1,x);
          y1 = Math.min(y1,y);
        }
        keysized = ssw.size(sym);
        if (keysized) {
          keysized = keysized.split('x');
          x2 = Math.max(x2,parseInt(x) + (options.F[i+1][0] * parseInt(keysized[0])));
          y2 = Math.max(y2,parseInt(y) + (options.F[i+1][0] * parseInt(keysized[1])));
        }

      }
      context.font = (options.F[i+1]?30*options.size*options.F[i+1][0]:30*options.size) + "px 'SuttonSignWritingFill'";
      context.fillStyle =  (options.E[i+1]?options.E[i+1][1]?options.E[i+1][1]:options.fill:options.fill);
      context.fillText(ssw.uni(sym,"10"),((x-x1)*options.size),((y-y1)*options.size));
      context.font = (options.F[i+1]?30*options.size*options.F[i+1][0]:30*options.size) + "px 'SuttonSignWritingLine'";
      context.fillStyle = (options.E[i+1]?options.E[i+1][0]:options.colorize?'#'+ssw.colorize(sym):options.line);
      context.fillText(ssw.uni(sym,"F"),((x-x1)*options.size),((y-y1)*options.size));
    }
    return canvas;
  },
  png: function (fsw,options){
    var chars = ssw.chars(fsw);
    if (chars=="swu"){
      fsw = ssw.swu2fsw(fsw);
    }
    if (ssw.sign(fsw,true) || ssw.symbol(fsw,true) ){
      var canvas = ssw.canvas(fsw,options);
      var png = canvas.toDataURL("image/png");
      canvas.remove();
      return png;
    } else {
      return '';
    }
  },
  query: function (query){
    if (query=='-') {
      return '-';
    }
    query = query.match(new RegExp(ssw.re['fsw']['query']));
    if (query) {
      return query[0];
    } else {
      return '';
    }
  },
  queryu: function (query){
    if (query=='-') {
      return '-';
    }

    query = query.match(new RegExp(ssw.re['swu']['query']));
    if (query) {
      return query[0];
    } else {
      return '';
    }
  },
  query2swu: function (query){
    query = ssw.query(query);
    if (!query) {
      return '';
    }
    var matches;
    var i;
    var from;
    var to;
    var segment;
    var key;
    var fill;
    var rotate;

    var re_coord = '[0-9]{3}x[0-9]{3}';
    var q_range = 'R[123][0-9a-f]{2}t[123][0-9a-f]{2}';
    var q_sym = 'S[123][0-9a-f]{2}[0-5u][0-9a-fu]';

    matches = query.match(new RegExp(re_coord,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        query = query.replace(matches[i],ssw.fsw2swu(matches[i]));
      }
    }

    matches = query.match(new RegExp(q_range,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        from = ssw.view('S' + matches[i].slice(1,4) + "00");
        to = ssw.view('S' + matches[i].slice(5,8) + "00");
        segment = "R" + ssw.fsw2swu(from) + ssw.fsw2swu(to);
        query = query.replace(matches[i],segment);
      }
    }

    matches = query.match(new RegExp(q_sym,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        key = matches[i].slice(0,4);
        fill = matches[i].slice(4,5);
        if (fill=='u') {
          key += ssw.view(key + '00').slice(4,5);
          fill = 'f';
        } else {
          key += fill;
          fill = '';
        }
        rotate = matches[i].slice(5,6);
        if (rotate=='u') {
          key += '0';
          rotate = 'r';
        } else {
          key += rotate;
          rotate = '';
        }
        query = query.replace(matches[i],ssw.fsw2swu(key)+fill+rotate);
      }
    }
    return query;
  },
  query2fsw: function (query){
    query = ssw.queryu(query);
    if (!query) {
      return '';
    }
    var matches;
    var i;
    var from;
    var to;
    var segment;
    var key;
    var fill;
    var rotate;

    var re_sym = ssw.re['swu']['symbol'];
    var re_coord = ssw.re['swu']['coord'];

    var q_range = 'R' + re_sym + re_sym;
    var q_sym = re_sym + 'f?r?';

    matches = query.match(new RegExp(re_coord,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        query = query.replace(matches[i],ssw.swu2fsw(matches[i]));
      }
    }

    matches = query.match(new RegExp(q_range,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        from = ssw.swu2fsw(matches[i].slice(1,3)).slice(1,4);
        to = ssw.swu2fsw(matches[i].slice(-2)).slice(1,4);
        segment = "R" + from + "t" + to;
        query = query.replace(matches[i],segment);
      }
    }

    matches = query.match(new RegExp(q_sym,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        key = ssw.swu2fsw(matches[i].slice(0,2));
        if (matches[i].indexOf('f')>-1){
          key = key.slice(0,4) + 'u' + key.slice(5,6);
        }
        if (matches[i].indexOf('r')>-1){
          key = key.slice(0,5) + 'u';
        }
        query = query.replace(matches[i],key);
      }
    }

    return query;
  },
  range: function (min,max,hex){
    var pattern;
    var re;
    var diff;
    var tmax;
    var cnt;
    var minV;
    var maxV;
    if (!hex) {
      hex='';
    }
    min = ("000" + min).slice(-3);
    max = '' + max;
    pattern='';

    if (min===max) {return min;}

    //ending pattern will be series of connected OR ranges
    re = [];

    //first pattern+  10's don't match and the min 1's are not zero
    //odd number to 9
    if (!(min[0]==max[0] && min[1]==max[1])) {
      if (min[2]!='0'){
        pattern = min[0] + min[1];
        if (hex) {
          //switch for dex
          switch (min[2]){
          case "f":
            pattern += 'f';
            break;
          case "e":
            pattern += '[ef]';
            break;
          case "d":
          case "c":
          case "b":
          case "a":
            pattern += '[' + min[2] + '-f]';
            break;
          default:
            switch (min[2]){
              case "9":
             pattern += '[9a-f]';
              break;
            case "8":
              pattern += '[89a-f]';
              break;
            default:
             pattern += '[' + min[2] + '-9a-f]';
              break;
            }
            break;
          }
          diff = 15-parseInt(min[2],16) +1;
          min = '' + ((parseInt(min,16)+diff)).toString(16);
          re.push(pattern);
        } else {
          //switch for dex
          switch (min[2]){
          case "9":
            pattern += '9';
            break;
          case "8":
            pattern += '[89]';
            break;
          default:
           pattern += '[' + min[2] + '-9]';
            break;
          }
          diff = 9-min[2] +1;
          min = '' + (min*1 + diff);
          re.push(pattern);
        }
      }
    }
    pattern = '';

    //if hundreds are different, get odd to 99 or ff
    if (min[0]!=max[0]){
      if (min[1]!='0'){
        if (hex){
          //scrape to ff
          pattern = min[0];
          switch (min[1]){
          case "f":
            pattern += 'f';
            break;
          case "e":
            pattern += '[ef]';
            break;
          case "d":
          case "c":
          case "b":
          case "a":
            pattern += '[' + min[1] + '-f]';
            break;
          case "9":
            pattern += '[9a-f]';
            break;
          case "8":
            pattern += '[89a-f]';
            break;
          default:
            pattern += '[' + min[1] + '-9a-f]';
            break;
          }
          pattern += '[0-9a-f]';
          diff = 15-parseInt(min[1],16) +1;
          min = '' + (parseInt(min,16)+diff*16).toString(16);
          re.push(pattern);
        } else {
          //scrape to 99
          pattern = min[0];
          diff = 9-min[1] +1;
          switch (min[1]){
          case "9":
            pattern += '9';
            break;
          case "8":
            pattern += '[89]';
            break;
          default:
            pattern += '[' + min[1] + '-9]';
            break;
          }
          pattern += '[0-9]';
          diff = 9-min[1] +1;
          min = '' + (min*1 + diff*10);
          re.push(pattern);
        }
      }
    }
    pattern = '';

    //if hundreds are different, get to same
    if (min[0]!=max[0]){
      if (hex){
        diff = parseInt(max[0],16) - parseInt(min[0],16);
        tmax = (parseInt(min[0],16) + diff-1).toString(16);

        switch (diff){
        case 1:
          pattern = min[0];
          break;
        case 2:
          pattern = '[' + min[0] + tmax + ']';
          break;
        default:
          if (parseInt(min[0],16)>9){
            minV = 'h';
          } else {
            minV = 'd';
          }
          if (parseInt(tmax,16)>9){
            maxV = 'h';
          } else {
            maxV = 'd';
          }
          switch (minV + maxV){
          case "dd":
            pattern += '[' + min[0] + '-' + tmax + ']';
            break;
          case "dh":
            diff = 9 - min[0];
            //firs get up to 9
            switch (diff){
            case 0:
              pattern += '[9';
              break;
            case 1:
              pattern += '[89';
              break;
            default:
              pattern += '[' + min[0] + '-9';
              break;
            }
            switch (tmax[0]){
            case 'a':
              pattern += 'a]';
              break;
            case 'b':
              pattern += 'ab]';
              break;
            default:
              pattern += 'a-' + tmax + ']';
              break;
            }
            break;
          case "hh":
            pattern += '[' + min[0] + '-' + tmax + ']';
            break;
          }
        }

        pattern += '[0-9a-f][0-9a-f]';
        diff = parseInt(max[0],16) - parseInt(min[0],16);
        min = '' + (parseInt(min,16)+diff*256).toString(16);
        re.push(pattern);
      } else {
        diff = max[0] - min[0];
        tmax = min[0]*1 + diff-1;

        switch (diff){
        case 1:
          pattern = min[0];
          break;
        case 2:
          pattern = '[' + min[0] + tmax + ']';
          break;
        default:
          pattern = '[' + min[0] + '-' + tmax + ']';
          break;
        }
        pattern += '[0-9][0-9]';
        min = '' + (min*1 + diff*100);
        re.push(pattern);
      }
    }
    pattern = '';

    //if tens are different, get to same
    if (min[1]!=max[1]){
      if (hex){
        diff = parseInt(max[1],16) - parseInt(min[1],16);
        tmax = (parseInt(min[1],16) + diff-1).toString(16);
        pattern = min[0];
        switch (diff){
        case 1:
          pattern += min[1];
          break;
        case 2:
          pattern += '[' + min[1] + tmax + ']';
          break;
        default:

          if (parseInt(min[1],16)>9){
            minV = 'h';
          } else {
            minV = 'd';
          }
          if (parseInt(tmax,16)>9){
            maxV = 'h';
          } else {
            maxV = 'd';
          }
          switch (minV + maxV){
          case "dd":
            pattern += '[' + min[1];
            if (diff>1) {
              pattern += '-';
            }
            pattern += tmax + ']';
            break;
          case "dh":
            diff = 9 - min[1];
            //firs get up to 9
            switch (diff){
            case 0:
              pattern += '[9';
              break;
            case 1:
              pattern += '[89';
              break;
            default:
              pattern += '[' + min[1] + '-9';
              break;
            }
            switch (max[1]){
            case 'a':
              pattern += ']';
              break;
            case 'b':
              pattern += 'a]';
              break;
            default:
              pattern += 'a-' + (parseInt(max[1],16)-1).toString(16) + ']';
              break;
            }
            break;
          case "hh":
            pattern += '[' + min[1];
            if (diff>1) {
              pattern += '-';
            }
            pattern += (parseInt(max[1],16)-1).toString(16) + ']';
            break;
          }
          break;
        }
        pattern += '[0-9a-f]';
        diff = parseInt(max[1],16) - parseInt(min[1],16);
        min = '' + (parseInt(min,16)+diff*16).toString(16);
        re.push(pattern);
      } else {
        diff = max[1] - min[1];
        tmax = min[1]*1 + diff-1;
        pattern = min[0];
        switch (diff){
        case 1:
          pattern += min[1];
          break;
        case 2:
          pattern += '[' + min[1] + tmax + ']';
          break;
        default:
         pattern += '[' + min[1] + '-' + tmax + ']';
          break;
        }
        pattern += '[0-9]';
        min = '' + (min*1 + diff*10);
        re.push(pattern);
      }
    }
    pattern = '';

    //if digits are different, get to same
    if (min[2]!=max[2]){
      if (hex){
        pattern = min[0] + min[1];
        diff = parseInt(max[2],16) - parseInt(min[2],16);
        if (parseInt(min[2],16)>9){
          minV = 'h';
        } else {
          minV = 'd';
        }
        if (parseInt(max[2],16)>9){
          maxV = 'h';
        } else {
          maxV = 'd';
        }
        switch (minV + maxV){
        case "dd":
          pattern += '[' + min[2];
          if (diff>1) {
            pattern += '-';
          }
          pattern += max[2] + ']';
          break;
        case "dh":
          diff = 9 - min[2];
          //firs get up to 9
          switch (diff){
          case 0:
            pattern += '[9';
            break;
          case 1:
            pattern += '[89';
            break;
          default:
            pattern += '[' + min[2] + '-9';
            break;
          }
          switch (max[2]){
          case 'a':
            pattern += 'a]';
            break;
          case 'b':
            pattern += 'ab]';
            break;
          default:
            pattern += 'a-' + max[2] + ']';
            break;
          }

          break;
        case "hh":
          pattern += '[' + min[2];
          if (diff>1) {
            pattern += '-';
          }
          pattern += max[2] + ']';
          break;
        }
        diff = parseInt(max[2],16) - parseInt(min[2],16);
        min = '' + (parseInt(min,16) + diff).toString(16);
        re.push(pattern);
      } else {
        diff = max[2] - min[2];
        pattern = min[0] + min[1];
        switch (diff){
        case 0:
          pattern += min[2];
          break;
        case 1:
          pattern += '[' + min[2] + max[2] + ']';
          break;
        default:
         pattern += '[' + min[2] + '-' + max[2] + ']';
          break;
        }
        min = '' + (min*1 + diff);
        re.push(pattern);
      }
    }
    pattern = '';

    //last place is whole hundred
    if (min[2]=='0' && max[2]=='0') {
      pattern = max;
      re.push(pattern);
    }
    pattern = '';

    cnt = re.length;
    if (cnt==1){
      pattern = re[0];
    } else {
      pattern = re.join(')|(');
      pattern = '((' + pattern + '))';
    }
    return pattern;
  },
  rangeu: function (min,max){
    max = max?max:'';
    var parts;
    switch(ssw.chars(min)){
      case "fsw":
      case "num":
        parts = (min + "x" + max).split("x");
        min = (parseInt("1D906",16) + parseInt(parts[0]) - 500).toString(16);
        max = (parseInt("1D906",16) + parseInt(parts[1]) - 500).toString(16);
        if (min<250 || min>749 || min<250 || min>749) return false;
        break;
      case "swu":
        parts = ssw.parse(min+max,"swu",true);
        if (parts.type=="coord") {
          min = ssw.swu2hex(parts.all[0].substr(0,2));
          max = ssw.swu2hex(parts.all[0].substr(2,2));
        } else if (parts.type=="symbol") {
          if (parts.all.length<2) return false;
          min = ssw.swu2hex(parts.all[0]);
          max = ssw.swu2hex(parts.all[1]);
        } else {
          return false;
        }
      default:
    }
      
    if (min>max) return '';
    var pattern = '';
    var cnt,code,str;
    var re = [];

    code = parseInt(min,16);
    str = String.fromCharCode(0xD800 + (((code) - 0x10000) >> 10), 0xDC00 + (((code) - 0x10000) & 0x3FF));
    min = [str.charCodeAt(0).toString(16).toUpperCase(),str.charCodeAt(1).toString(16).toUpperCase()];
    code = parseInt(max,16);
    str = String.fromCharCode(0xD800 + (((code) - 0x10000) >> 10), 0xDC00 + (((code) - 0x10000) & 0x3FF));
    max = [str.charCodeAt(0).toString(16).toUpperCase(),str.charCodeAt(1).toString(16).toUpperCase()];
    if (min.length!=2 && max.length!=2) return '';
    // HEAD // min[0] with range of min[1] to (DFFF or max[1])
    if (min[0]==max[0]) {
      if (min[1]==max[1]) {
        pattern = '\\u' + min[0] + '\\u' + min[1];
        re.push(pattern);
      } else {
        pattern = '\\u' + min[0] + '[\\u' + min[1] + '-\\u' + max[1] + ']';
        re.push(pattern);
      }
    } else {
      if(min[1]=="DFFF"){
        pattern = '\\u' + min[0] + '\\uDFFF';
      } else {
        pattern = '\\u' + min[0] + '[\\u' + min[1] + '-\\uDFFF]';
      }
      re.push(pattern);

      // BODY // range of (min[0] +1) to (max[0] -1) with all DC00-DFFF
      var diff = (parseInt(max[0],16)) - (parseInt(min[0],16));
      if (diff==2){
        pattern = '\\u' + (parseInt(min[0],16)+1).toString(16).toUpperCase();
        pattern += '[\\uDC00-\\uDFFF]';
        re.push(pattern);
      }
      if (diff>2){
        pattern = '[';
        pattern += '\\u' + (parseInt(min[0],16)+1).toString(16).toUpperCase();
        pattern += '-\\u' + (parseInt(max[0],16)-1).toString(16).toUpperCase();
        pattern += '][\\uDC00-\\uDFFF]';
        re.push(pattern);
      }

      // TAIL // max[0] with range of DC00 to max[1]
      if(max[1]=="DC00"){
        pattern = '\\u' + max[0] + '\\uDC00';
      } else {
        pattern = '\\u' + max[0] + '[\\uDC00-\\u' + max[1] + ']';
      }
      re.push(pattern);

    }
    cnt = re.length;
    if (cnt==1){
      pattern = re[0];
    } else {
      pattern = re.join(')|(');
      pattern = '((' + pattern + '))';
    }
    return ssw.decode(pattern);
  },
  ranges: function (symfr){
    var match = symfr.match(new RegExp(ssw.re['swu']['symbol'] + 'f?r?'));
    if (match){
      var sym = match[0].slice(0,2);
      var key = ssw.swu2fsw(sym);
      var base = key.slice(0,4);
      var start,end;
      if (match[0].slice(-2) == 'fr'){
        start = ssw.fsw2swu(base + "00");
        end = ssw.fsw2swu(base + "4f");
        return ssw.rangeu(start,end);
      } else if (match[0].slice(-1) == 'r') {
        start = ssw.fsw2swu(key.slice(0,5) + '0');
        end = ssw.fsw2swu(key.slice(0,5) + 'f');
        return ssw.rangeu(start,end);
      } else if (match[0].slice(-1) == 'f') {
        var list = [0,1,2,3,4,5].map(function(f){
          return ssw.fsw2swu(base + f + key.slice(-1));
        })
        return "(" + list.join("|") + ")";
      } else {
        return sym;
      }
    } else {
      return '';
    }
  },
  regex: function (query,fuzz){
    query = ssw.query(query);
    if (!query) {
      return '';
    }
    var matches;
    var i;
    var fsw_pattern;
    var part;
    var from;
    var to;
    var re_range;
    var segment;
    var x;
    var y;
    var base;
    var fill;
    var rotate;
    if (!fuzz) {
      fuzz = 20;
    }
    var re_sym = 'S[123][0-9a-f]{2}[0-5][0-9a-f]';
    var re_coord = '[0-9]{3}x[0-9]{3}';
    var re_word = '[BLMR](' + re_coord + ')(' + re_sym + re_coord + ')*';
    var re_term = '(A(' + re_sym+ ')+)';
    var q_range = 'R[123][0-9a-f]{2}t[123][0-9a-f]{2}';
    var q_sym = 'S[123][0-9a-f]{2}[0-5u][0-9a-fu]';
    var q_coord = '([0-9]{3}x[0-9]{3})?';
    var q_var = '(V[0-9]+)';
    var q_style = '(' + ssw.re['style'] + ')?';
    var q_term;

    if (query=='-'){
      return [q_styling];
    }
    if (query=='Q'){
      return [re_term + "?" + re_word];
    }
    if (query=='Q-'){
      return [re_term + "?" + re_word + q_style];
    }
    if (query=='QT'){
      return [re_term + re_word];
    }
    if (query=='QT-'){
      return [re_term + re_word + q_style];
    }
    var segments = [];
    var term = query.indexOf('T')+1;
    if (term){
      q_term = '(A';
      var qat = query.slice(0,term);
      query = query.replace(qat,'');
      if (qat == 'QT') {
        q_term += '(' + re_sym + ')+)';
      } else {
        matches = qat.match(new RegExp('(' + q_sym + '|' + q_range + ')','g'));
        if (matches){
          var matched;
          for(i=0; i<matches.length; i+=1) {
            matched = matches[i].match(new RegExp(q_sym));
            if (matched){
              segment = matched[0].slice(0,4);
              fill = matched[0].slice(4,5);
              if (fill=='u') {
                segment += '[0-5]';
              } else {
                segment += fill;
              }
              rotate = matched[0].slice(5,6);
              if (rotate=='u') {
                segment += '[0-9a-f]';
              } else {
                segment += rotate;
              }
              q_term += segment;
            } else {
              from = matches[i].slice(1,4);
              to = matches[i].slice(5,8);
              re_range = ssw.range(from,to,'hex');
              segment = 'S' + re_range + '[0-5][0-9a-f]';
              q_term += segment;
            }
          }
          q_term += '(' + re_sym + ')*)';
        }
      }
    }
    //get the variance
    matches = query.match(new RegExp(q_var,'g'));
    if (matches) {
      fuzz = matches.toString().slice(1)*1;
    }
    //this gets all symbols with or without location
    fsw_pattern = q_sym + q_coord;
    matches = query.match(new RegExp(fsw_pattern,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        part = matches[i].toString();
        base = part.slice(1,4);
        segment = 'S' + base;
        fill = part.slice(4,5);
        if (fill=='u') {
          segment += '[0-5]';
        } else {
          segment += fill;
        }
        rotate = part.slice(5,6);
        if (rotate=='u') {
          segment += '[0-9a-f]';
        } else {
          segment += rotate;
        }
        if (part.length>6){
          x = part.slice(6,9)*1;
          y = part.slice(10,13)*1;
          //now get the x segment range+++
          segment += ssw.range((x-fuzz),(x+fuzz));
          segment += 'x';
          segment += ssw.range((y-fuzz),(y+fuzz));
        } else {
          segment += re_coord;
        }
        //now I have the specific search symbol
        // add to general ksw word
        segment = re_word + segment + '(' + re_sym + re_coord + ')*';
        if (term) {
          segment = q_term + segment;
        } else {
          segment = re_term + "?" + segment;
        }
        if (query.indexOf('-')>0){
          segment += q_style;
        }
        segments.push(segment);
      }
    }
    //this gets all ranges
    fsw_pattern = q_range + q_coord;
    matches = query.match(new RegExp(fsw_pattern,'g'));
    if (matches){
      for(i=0; i<matches.length; i+=1) {
        part = matches[i].toString();
        from = part.slice(1,4);
        to = part.slice(5,8);
        re_range = ssw.range(from,to,"hex");
        segment = 'S' + re_range + '[0-5][0-9a-f]';
        if (part.length>8){
          x = part.slice(8,11)*1;
          y = part.slice(12,15)*1;
          //now get the x segment range+++
          segment += ssw.range((x-fuzz),(x+fuzz));
          segment += 'x';
          segment += ssw.range((y-fuzz),(y+fuzz));
        } else {
          segment += re_coord;
        }
        // add to general ksw word
        segment = re_word + segment + '(' + re_sym + re_coord + ')*';
        if (term) {
          segment = q_term + segment;
        } else {
          segment = re_term + "?" + segment;
        }
        if (query.indexOf('-')>0){
          segment += q_style;
        }
        segments.push(segment);
      }
    }
    if (!segments.length){
        if (query.indexOf('-')>0){
          segment += q_style;
        }
      segments.push(q_term + re_word);
    }
    return segments;
  },
  regexu: function (query,fuzz){
    query = ssw.queryu(query);
    if (!query) {
      return '';
    }
    var matches;
    var i;
    var fsw_pattern;
    var part;
    var from;
    var to;
    var coord;
    var re_range;
    var segment;
    var x;
    var y;
    var base;
    var fill;
    var rotate;
    if (!fuzz) {
      fuzz = 20;
    }

    var re_sym = ssw.re['swu']['symbol'];
    var re_coord = ssw.re['swu']['coord'];
    var re_signbox = ssw.re['swu']['box'];
    var re_seq = ssw.re['swu']['sort'];
    var re_word = re_signbox + re_coord + '(' + re_sym + re_coord + ')*';
    var re_term = '(' + re_seq + '(' + re_sym + ')+)';

    var q_range = 'R' + re_sym + re_sym;
    var q_sym = re_sym + 'f?r?';
    var q_coord = '(' + re_coord + ')?';
    var q_var = '(V[0-9]+)';
    var q_style = '(' + ssw.re['style'] + ')?';
    var q_term;


    if (query=='-'){
      return ssw.re['style'];
    }
    if (query=='Q'){
      return [ssw.re['swu']['sign']];
    }
    if (query=='Q-'){
      return [ssw.re['swu']['sign'] + "(" + ssw.re['style'] + ")?"];
    }
    if (query=='QT'){
      return [ssw.re['swu']['sort'] + ssw.re['swu']['symbol'] + "+" + ssw.re['swu']['box'] + ssw.re['swu']['coord'] + "(" + ssw.re['swu']['spatial'] + ")*"];
    }
    if (query=='QT-'){
      return [ssw.re['swu']['sort'] + ssw.re['swu']['symbol'] + "+" + ssw.re['swu']['box'] + ssw.re['swu']['coord'] + "(" + ssw.re['swu']['spatial'] + ")*(" + ssw.re['style'] + ")?"];
    }
    var segments = [];
    var sym,key;
    var term = query.indexOf('T')+1;
    if (term){
      q_term = '(' + ssw.re['swu']['sort'];
      var qat = query.slice(0,term);
      query = query.replace(qat,'');
      if (qat == 'QT') {
        q_term += '(' + re_sym + ')+)';
      } else {
        matches = qat.match(new RegExp('(' + q_sym + '|' + q_range + ')','g'));
        if (matches){
          var matched;
          for(i=0; i<matches.length; i+=1) {
            matched = matches[i].match(new RegExp('^' + q_sym));
            if (matched){
              q_term += ssw.ranges(matched[0]);
            } else {
              from = ssw.swu2fsw(matches[i].slice(1,3));
              to = ssw.swu2fsw(matches[i].slice(-2));
              from = ssw.fsw2swu(from.slice(0,4) + '00');
              to = ssw.fsw2swu(to.slice(0,4) + '5f');
              q_term += ssw.rangeu(from,to);
            }
          }
          q_term += '(' + re_sym + ')*)';
        }
      }
    }
    //get the variance
    matches = query.match(new RegExp(q_var,'g'));
    if (matches) {
      fuzz = matches.toString().slice(1)*1;
    }
    //this gets all symbols with or without location
    fsw_pattern = q_sym + q_coord;
    matches = query.match(new RegExp("(" + q_range + q_coord + "|" + q_sym + q_coord + ")",'g'));

    if (matches){
      for(i=0; i<matches.length; i+=1) {
        part = matches[i].toString();
        if (part[0] != "R"){
          sym = part.match(new RegExp(q_sym))[0];
          segment = ssw.ranges(sym);
          if (sym.length>part.length){
            coord = ssw.swu2fsw(part.slice(-4)).split('x');
            console.log(coord);
            x = coord[0];
            y = coord[1];
            //now get the x segment range+++
            segment += ssw.rangeu(ssw.fsw2swu((x-fuzz) + 'x' + (x+fuzz)));
            segment += ssw.rangeu(ssw.fsw2swu((y-fuzz) + 'x' + (y+fuzz)));
          } else {
            segment += re_coord;
          }
          //now I have the specific search symbol
          // add to general swu word
          segment = re_word + segment + '(' + re_sym + re_coord + ')*';
          if (term) {
            segment = q_term + segment;
          } else {
            segment = re_term + "?" + segment;
          }
          if (query.indexOf('-')>0){
            segment += q_style;
          }
          segments.push(segment);
        } else {
        //ranges
          part = matches[i].toString();
          from = ssw.swu2fsw(part.slice(1,3));
          to = ssw.swu2fsw(part.slice(3,5));
          from = ssw.fsw2swu(from.slice(0,4) + '00');
          to = ssw.fsw2swu(to.slice(0,4) + '5f');
          segment = ssw.rangeu(from,to);

          if (part.length>5){
            coord = ssw.swu2fsw(part.slice(5,9)).split('x');
            x = coord[0];
            y = coord[1];
            //now get the x segment range+++
            segment += ssw.rangeu(ssw.fsw2swu((x-fuzz) + 'x' + (x+fuzz)));
            segment += ssw.rangeu(ssw.fsw2swu((y-fuzz) + 'x' + (y+fuzz)));
          } else {
            segment += re_coord;
          }
          // add to general swu word
          segment = re_word + segment + '(' + re_sym + re_coord + ')*';
          if (term) {
            segment = q_term + segment;
          } else {
            segment = re_term + "?" + segment;
          }
          if (query.indexOf('-')>0){
            segment += q_style;
          }
          segments.push(segment);
        }
      }
    }
    if (!segments.length){
        if (query.indexOf('-')>0){
          segment += q_style;
        }
      segments.push(q_term + re_word);
    }
    return segments;
  },
  results: function (query,text,lane){
    if (!text) {return [];}
    if("BLMR".indexOf(lane) === -1 || lane.length>1) {
      lane='';
    }
    var pattern;
    var matches;
    var parts;
    var words;
    var re = ssw.regex(query);
    if (!re) {return [];}
    var i;
    for(i=0; i<re.length; i+=1) {
      pattern = re[i];
      matches = text.match(new RegExp(pattern,'g'));
      if (matches){
        text = matches.join(' ');
      } else {
        text ='';
      }
    }
    if (text){
      if (lane){
        text = text.replace(/B/g,lane);
        text = text.replace(/L/g,lane);
        text = text.replace(/M/g,lane);
        text = text.replace(/R/g,lane);
      }
      parts = text.split(' ');
      words = parts.filter(function(element) {
        return element in parts ? false : parts[element] = true;
      }, {});
    } else {
      words = [];
    }
    return words;
  },
  resultsu: function (query,text,lane){
    if (!text) {return [];}
    if(lane && !lane.match(new RegExp(ssw.re['swu']['box']))) {
      lane='';
    }
    var pattern;
    var matches;
    var parts;
    var words;
    var re = ssw.regexu(query);
    if (!re) {return [];}
    var i;
    for(i=0; i<re.length; i+=1) {
      pattern = re[i];
      matches = text.match(new RegExp(pattern,'g'));
      if (matches){
        text = matches.join(' ');
      } else {
        text ='';
      }
    }
    if (text){
      if (lane){
        text = text.replace(/\uD836\uDC01/g,lane);
        text = text.replace(/\uD836\uDC02/g,lane);
        text = text.replace(/\uD836\uDC03/g,lane);
        text = text.replace(/\uD836\uDC04/g,lane);
      }
      parts = text.split(' ');
      words = parts.filter(function(element) {
        return element in parts ? false : parts[element] = true;
      }, {});
    } else {
      words = [];
    }
    return words;
  },
  lines: function (query,text,lane){
    if (!text) {return [];}
    if("BLMR".indexOf(lane) === -1 || lane.length>1) {
      lane='';
    }
    var pattern;
    var matches;
    var parts;
    var words;
    var re = ssw.regex(query);
    if (!re) {return [];}
    var i;
    for(i=0; i<re.length; i+=1) {
      pattern = re[i];
      pattern = '^' + pattern + '.*';
      matches = text.match(new RegExp(pattern,'mg'));
      if (matches){
        text = matches.join("\n");
      } else {
        text ='';
      }
    }
    if (text){
      if (lane){
        text = text.replace(/B/g,lane);
        text = text.replace(/L/g,lane);
        text = text.replace(/M/g,lane);
        text = text.replace(/R/g,lane);
      }
      parts = text.split("\n");
      words = parts.filter(function(element) {
        return element in parts ? false : parts[element] = true;
      }, {});
    } else {
      words = [];
    }
    return words;
  },
  linesu: function (query,text,lane){
    if (!text) {return [];}
    if(lane && !lane.match(new RegExp(ssw.re['swu']['box']))) {
      lane='';
    }
    var pattern;
    var matches;
    var parts;
    var words;
    var re = ssw.regexu(query);
    if (!re) {return [];}
    var i;
    for(i=0; i<re.length; i+=1) {
      pattern = re[i];
      pattern = '^' + pattern + '.*';
      matches = text.match(new RegExp(pattern,'mg'));
      if (matches){
        text = matches.join("\n");
      } else {
        text ='';
      }
    }
    if (text){
      if (lane){
        text = text.replace(/\uD836\uDC01/g,lane);
        text = text.replace(/\uD836\uDC02/g,lane);
        text = text.replace(/\uD836\uDC03/g,lane);
        text = text.replace(/\uD836\uDC04/g,lane);
      }
      parts = text.split("\n");
      words = parts.filter(function(element) {
        return element in parts ? false : parts[element] = true;
      }, {});
    } else {
      words = [];
    }
    return words;
  },
  convert: function (fsw,flags){
    // update to new set of flags
    // A - exact symbol in temporal prefix
    // a - general symbol in temporal prefix
    // S - exact symbol in spatial signbox
    // s - general symbol in spatial signbox
    // L - spatial signbox symbol at location
    var i;
    var query = '';
    if (ssw.sign(fsw)){
      if (/^[Aa]?([Ss]L?)?$/.test(flags)){
        var re_base = 'S[123][0-9a-f]{2}';
        var re_sym = re_base + '[0-5][0-9a-f]';
        var re_coord = '[0-9]{3}x[0-9]{3}';
        var matches;
        var matched;

        if (flags.indexOf('A') > -1 || flags.indexOf('a') > -1) {
          //exact symbols or general symbols in order
          matches = fsw.match(new RegExp('A(' + re_sym + ')*','g'));
          if (matches){
            matched = matches[0];
            if (flags.indexOf('A') > -1) {
              query += matched + "T";
            } else {
              matches = matched.match(new RegExp(re_base,'g'));
              query += "A";
              for(i=0; i<matches.length; i+=1) {
                query += matches[i] + "uu";
              }
              query += "T";
            }
          }
        }

        if (flags.indexOf('S') > -1 || flags.indexOf('s') > -1) {
          //exact symbols or general symbols in spatial
          matches = fsw.match(new RegExp(re_sym + re_coord,'g'));
          if (matches){
            for(i=0; i<matches.length; i+=1) {
              if (flags.indexOf('S') > -1) {
                query += matches[i].slice(0,6);
              } else {
                query += matches[i].slice(0,4) + "uu";
              }
              if (flags.indexOf('L') > -1) {
                query += matches[i].slice(6,13);
              }
            }
          }
        }
      }
    }
    return query?"Q" + query:'';
  },
  convertu: function (swu,flags){
    // update to new set of flags
    // A - exact symbol in temporal prefix
    // a - general symbol in temporal prefix
    // S - exact symbol in spatial signbox
    // s - general symbol in spatial signbox
    // L - spatial signbox symbol at location
    var i;
    var query = '';
    if (ssw.sign(swu)){
      if (/^[Aa]?([Ss]L?)?$/.test(flags)){
        var matches;
        var matched;

        if (flags.indexOf('A') > -1 || flags.indexOf('a') > -1) {
          //exact symbols or general symbols in order
          matches = swu.match(new RegExp(ssw.re['swu']['sort'] + '(' + ssw.re['swu']['symbol'] + ')*','g'));
          if (matches){
            matched = matches[0];
            if (flags.indexOf('A') > -1) {
              query += matched.replace(/\uD836\uDC00/g,"A") + "T";
            } else {
              matches = matched.match(new RegExp(ssw.re['swu']['symbol'],'g'));
              query += "A";
              for(i=0; i<matches.length; i+=1) {
                query += matches[i] + "fr";
              }
              query += "T";
            }
          }
        }

        if (flags.indexOf('S') > -1 || flags.indexOf('s') > -1) {
          //exact symbols or general symbols in spatial
          matches = swu.match(new RegExp(ssw.re['swu']['symbol'] + ssw.re['swu']['coord'],'g'));
          if (matches){
            for(i=0; i<matches.length; i+=1) {
              if (flags.indexOf('S') > -1) {
                query += matches[i].slice(0,2);
              } else {
                query += matches[i].slice(0,2) + "fr";
              }
              if (flags.indexOf('L') > -1) {
                query += matches[i].slice(2,6);
              }
            }
          }
        }
      }
    }
    return query?"Q" + query:'';
  },
  paragraph: function (signtext){
    var chars = ssw.chars(signtext);
    var signs = (ssw.parse(signtext,chars,true).all||[]).map(function(fsw) {
      if (chars == "swu"){
        fsw = ssw.swu2fsw(fsw);
      }
      var zoom = fsw.match(/Z([0-9]+(\.[0-9]+)?)/);
      zoom = zoom?parseFloat(zoom[1]):1;
      var bbox = ssw.bbox(fsw).split(' ');
      var w = (bbox[1]-bbox[0]) * zoom;
      var h = (bbox[3]-bbox[2]) * zoom;
      var adj = (1000 - bbox[0] - bbox[1])*zoom;
      adj += 2; //adjust for center dotted line
      if (fsw.indexOf('L')>-1) adj += 150;
      if (fsw.indexOf('R')>-1) adj -= 150;
      var style = 'width: ' + w + 'px;height: ' + h + 'px;'
      if (adj>0) {
        style += 'margin-right: ' + adj + 'px;'
      } else if (adj<0) {
        adj = -adj;
        style += 'border-left: ' + adj + 'px solid transparent;';
      }
      return '<div class="sign" style="' + style + '">' + ssw.svg(fsw,{copy:chars}) + '</div>';
    });
    return '<span class="outside"><span class="middle"><span class="inside">' + signs.join('') + '</span></span></span>';
  }
};
