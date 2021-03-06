/**
* SignWriting Character Viewer v2.2
* https://github.com/Slevinski/SignWriting_Character_Viewer
* https://slevinski.github.io/SignWriting_Character_Viewer
* Copyright (c) 2007-2017, Stephen E Slevinski Jr
* SignWriting Character Viewer is released under the MIT License.
*/

//window.onresize = function (){
//  m.redraw();
//}

//translations
var t;
function urlUI(lang){
  if(t && lang==localStorage['langUI']) return;
  var msg = messages[lang];
  if (!msg) {
    lang='en';
    msg = messages[lang];
  }
  localStorage['langUI']=lang;
  t = libTranslate.getTranslationFunction(msg);
}
function tt(args){
  text = t.apply(this,arguments);
  text = text.replace(/@@/g,'');
  return m.trust(ssw.svg(text) || '<p>' + text + '</p>');
}

window.onhashchange = hashChange;

var urlSet,urlSym;
function hashSet(){
  var hash = '?ui=' + localStorage['langUI'];
  if (urlSet) hash+= '&set=' + urlSet;
  if (urlSym) hash+= '&sym=' + urlSym;
  window.location.hash = hash
}
function hashChange(event){
  var vars={};
  var hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }
  var newUI = vars['ui']?vars['ui']:localStorage['langUI']?localStorage['langUI']:'en';
  var newSet = vars['set']?vars['set']:'swu';
  var newSym = vars['sym']?vars['sym']:'';
  if (newUI==localStorage['langUI'] && newSet==urlSet && newSym==urlSym) return;
  urlUI(newUI);
  urlSet = newSet;
  urlSym = newSym;
  hashSet();
  m.redraw();
}

// HEADER
//////////
var header = {};
header.controller = function(){};
header.view = function(ctrl){
  return [ m('div',{onclick:function(e){urlSym='';hashSet();}},tt("ssw_symbols")),
    m('div.section',[
      m('div.btn',{style:"height:9vh",class:urlSet=='fsw'?'selected':'',onclick:function(e){urlSet='fsw';urlSym='';hashSet();}},tt('Formal SignWriting<br>(FSW)')),
      m('div.btn',{style:"height:9vh",class:urlSet=='swu'?'selected':'',onclick:function(e){urlSet='swu';urlSym='';hashSet();}},tt('SignWriting in Unicode<br>(SWU)'))
      ])
  ];
};

// TABLE
////////
var table = {};
table.controller = function (){};
table.view = function(ctrl){
  var spaces = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
  var data=[],row=[],fills=[],rots=[];
  var rowCode,rowTitle,baseKey,catKey,groupKey,key,uni,code,fill,rot,tooltip,cellSym,svg;
  var nav,first,prev,next,last;
  if (urlSym){
    switch (urlSet){
      case 'fsw':
        baseKey = urlSym;
        first = 'S100';
        last = 'S38b';
        prev = baseKey==first?first:'S'+(parseInt(baseKey.slice(1,4),16)-1).toString(16);
        next = baseKey==last?last:'S'+(parseInt(baseKey.slice(1,4),16)+1).toString(16);
        break;
      case 'swu':
        code = parseInt(urlSym.slice(1,6),16)-1;
        baseKey = "S" + parseInt(code/96+256).toString(16);
        uni = urlSym;
        first = '40001';
        last = '4F421';
        prev = uni==first?first:(parseInt(uni,16)-96).toString(16).toUpperCase();
        next = uni==last?last:(parseInt(uni,16)+96).toString(16).toUpperCase();
        break;
      default:
        return;
    }
    var cat = ssw.structure('category');
    var catKey = ssw.structure('category',baseKey + "00");
    var group = ssw.structure('group');
    var groupKey = ssw.structure('group',baseKey + "00");
    nav=[
    m("table",{class:"structure"},m('tr',cat.map(function(cell){
      attr = {title:t('cat_' + cell),onclick:function(e){urlSym=urlSet=='fsw'?cell:(ssw.uni(cell+'00','4', true));hashSet();}};
      return m(cell==catKey?'th':'td',attr,'');
    }))),
    m("table",{class:"structure"},m('tr',group.map(function(cell){
      attr = {title:t('group_' + cell),onclick:function(e){urlSym=urlSet=='fsw'?cell:(ssw.uni(cell+'00','4', true));hashSet();}};
      return m(cell==groupKey?'th':'td',attr,'');
    }))),
      m('div.title',(urlSet=='fsw')?tt("base_" + baseKey):tt("uni_" + baseKey)),
      m('div.nav',
        m('div.btn',{onclick:function(e){urlSym=first;hashSet();}},m.trust(tt('firstPage'))),
        m('div.btn',{onclick:function(e){urlSym=prev;hashSet();}},m.trust(tt('prevPage'))),
        m('div.btn',{onclick:function(e){urlSym=next;hashSet();}},m.trust(tt('nextPage'))),
        m('div.btn',{onclick:function(e){urlSym=last;hashSet();}},m.trust(tt('lastPage')))
      )
    ];

    row=[];
    row.push(['th.prime',urlSet=='fsw'?baseKey:'U+' + uni]);
    for(var c = 0; c < 6; c++) {
      fills[c]= (urlSet=='fsw')?c.toString(16):(urlSet=='uni8'?'U+1DA9'+(c+10).toString(16).toUpperCase():'');
      row.push(['th',urlSet=='fsw'?fills[c]+"0":(urlSet=='swu'?"+" + (c*16).toString(16):fills[c]),'','']);
    }
    data.push(row);

    for(var r = 0; r < 16; r++) {
      rots[r]= (urlSet=='fsw')?r.toString(16):(urlSet=='uni8'?'U+1DAA'+r.toString(16).toUpperCase():'');
    }
  
    for(var r = 0; r < 16; r++) {
      row = [];
      row.push(['th', rots[r]?(urlSet=='uni8'?rots[r]:"0"+rots[r]):"+" + r.toString(16).toUpperCase(),'','']);
      for(var c = 0; c < 6; c++) {
        key = baseKey + c.toString(16) + r.toString(16);
        //except for FireFox, view:'key" is slow...
        svg = ssw.svg(key,{view:'swu',copy:urlSet});
        if (svg){
          tooltip = urlSet=='fsw'?key:(urlSet=='swu'?'U+'+(parseInt(uni,16) + c*16+r).toString(16).toUpperCase():'U+'+uni.toString(16).toUpperCase()+' U+1DA9'+(c+10).toString(16).toUpperCase()+' U+1DAA'+r.toString(16).toUpperCase());
          if(urlSet=='swu'){
            codepoint = ssw.fsw2swu(key);
            row.push(['td.codepoint',codepoint,tooltip,'']);
          } else {
            row.push(['td',svg,tooltip,'']);
          }
        } else {
          row.push(['td.invalid','','','']);
        }
      }
      data.push(row);
    }
  } else {
    var cat = ssw.structure('category');
    var group = ssw.structure('group');
    nav=[
    m("table",{class:"structure"},m('tr',cat.map(function(cell){
      attr = {title:t('cat_' + cell),onclick:function(e){urlSym=urlSet=='fsw'?cell:(ssw.uni(cell+'00','4', true));hashSet();}};
      return m('td',attr,'');
    }))),
    m("table",{class:"structure"},m('tr',group.map(function(cell){
      attr = {title:t('group_' + cell),onclick:function(e){urlSym=urlSet=='fsw'?cell:(ssw.uni(cell+'00','4', true));hashSet();}};
      return m('td',attr,'');
    })))
    ];
    row.push(['th',spaces]);
    for(var c = 0; c < 16; c++) {
      row.push(['th',urlSet=='fsw'?c.toString(16):(urlSet=='uni8'?c.toString(16).toUpperCase():spaces)]);
    }
    data.push(row);
  
    for(var r = 0; r < 41; r++) {
      row = [];
      rowCode = 256+(r*16);
      uni = urlSet=='swu'?'4D' + (r+16+112).toString(16).toUpperCase():'1D' + (r+16+112).toString(16).toUpperCase();
      key =  'S' + rowCode.toString(16).slice(0,2);
      rowTitle = urlSet=='fsw'?key+'x':(urlSet=="uni8"?'U+'+uni+'x':spaces);
      row.push(['th', rowTitle,'','']);
      for(var c = 0; c < 16; c++) {
        baseKey = "S" + (rowCode+c).toString(16);
        key = ssw.view(baseKey + '00',urlSet!='fsw');
        svg = ssw.svg(key,{copy:urlSet});
        if (svg){
          cellSym = urlSet=='fsw'?baseKey:(ssw.uni(baseKey+'00','4', true));
          tooltip = urlSet!='fsw'?'U+':'';
          tooltip += cellSym + ': ';
          tooltip += (urlSet=='fsw')?t("base_" + baseKey):t("uni_" + baseKey);
          if(urlSet=='swu'){
            codepoint = ssw.fsw2swu(key);
            row.push(['td.codepoint',codepoint,tooltip,cellSym]);
          } else {
            row.push(['td',svg,tooltip,cellSym]);
          }
        } else {
          row.push(['td.invalid','','','']);
        }
      }
      data.push(row);
    }
  }
  var attr; 
  return [nav,
    m("table",{class:(urlSym)?"sub":"main"},data.map(function(row){
      return m("tr",row.map(function(cell){
        attr = {title:cell[2],onclick:function(e){if(cell[3]){urlSym=cell[3];hashSet();}}};
        for (var attrname in cell[4]) { attr[attrname] = cell[4][attrname]; }
        return m(cell[0],attr,m.trust(cell[1]));
      }));
    }))
  ];
};

//Init App
hashChange();
m.mount(document.getElementById("header"), header);
m.mount(document.getElementById("table"), table);
var cssCheck;
window.onload = function () {
  var cnt = 0;
  if (!ssw.size("S10000")){
    cssCheck = setInterval(function(){
      if (ssw.size("S10000")){
        clearInterval(cssCheck);
        m.redraw();
      }
    },100);
  }
}
