var assert = chai.assert;

// re()
suite('.re{}', function(){
  suite('fsw', function(){
    test('regular expression for "fsw" sign', function(){
      assert.equal(ssw.re["fsw"]["sign"],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*");
    });
    test('regular expression for "fsw" spatial symbol', function(){
      assert.equal(ssw.re["fsw"]["spatial"],"S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3}");
    });
    test('regular expression for "fsw" symbol', function(){
      assert.equal(ssw.re["fsw"]["symbol"],"S[123][0-9a-f]{2}[0-5][0-9a-f]");
    });
    test('regular expression for "fsw" coord', function(){
      assert.equal(ssw.re["fsw"]["coord"],"[0-9]{3}x[0-9]{3}");
    });
    test('regular expression for "fsw" sorting sequence marker', function(){
      assert.equal(ssw.re["fsw"]["sort"],"A");
    });
    test('regular expression for "fsw" signbox marker', function(){
      assert.equal(ssw.re["fsw"]["box"],"[BLMR]");
    });
  });
  suite('swu', function(){
    test('regular expression for "swu" sign', function(){
      assert.equal(ssw.re["swu"]["sign"],"(\uD836\uDC00(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FB][\uDC00-\uDFFF])|(\uD8FC[\uDC00-\uDEA0])))+)?\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FA][\uDC00-\uDFFF])|(\uD8FB[\uDC00-\uDFA0]))(\uD836[\uDC0C-\uDDFF]){2})*");
    });
    test('regular expression for "swu" spatial', function(){
      assert.equal(ssw.re["swu"]["spatial"],"((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2}");
    });
    test('regular expression for "swu" symbol', function(){
      assert.equal(ssw.re["swu"]["symbol"],"((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))");
    });
    test('regular expression for "swu" coord', function(){
      assert.equal(ssw.re["swu"]["coord"],"(\uD836[\uDC0C-\uDDFF]){2}");
    });
    test('regular expression for "swu" sorting sequence marker', function(){
      assert.equal(ssw.re["swu"]["sort"],"\uD836\uDC00");
    });
    test('regular expression for "swu" signbox marker', function(){
      assert.equal(ssw.re["swu"]["box"],"\uD836[\uDC01-\uDC04]");
    });
  });
});

// chars()
suite('.chars( )', function(){
  suite('hex', function(){
    test('"hex" for plane 1 or plane 4 hex codes', function(){
      assert.equal(ssw.chars("1D800"),"hex");
      assert.equal(ssw.chars("40001"),"hex");
    });
  });
  suite('fsw', function(){
    test('"fsw" for FSW strings', function(){
      assert.equal(ssw.chars("AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520"),"fsw");
      assert.equal(ssw.chars("S20310"),"fsw");
      assert.equal(ssw.chars("500x500"),"fsw");
      assert.equal(ssw.chars("S10000500x500"),"fsw");
    });
  });
  suite('swu', function(){
    test('"swu" for SWU strings', function(){
      assert.equal(ssw.chars("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚"),"swu");
      assert.equal(ssw.chars("񈠣"),"swu");
      assert.equal(ssw.chars("𝤉𝤚"),"swu");
      assert.equal(ssw.chars("񍉡𝣴𝣵"),"swu");
    });
  });
  suite('other', function(){
    test('"" for other strings', function(){
      assert.equal(ssw.chars("other"),'');
      assert.equal(ssw.chars("chars񆄱񈠣񍉡mixed"),'');
    });
  });
});

// parse()
suite('.parse( )', function(){
  suite('hex', function(){
    test('objects for hex values', function(){
      assert.deepEqual(ssw.parse("1D800"),{chars:"hex", hex: "1D800", line :"1D800"});
      assert.deepEqual(ssw.parse("40001"),{chars:"hex", hex: "40001", line :"40001"});
    });
  });
  suite('fsw', function(){
    test('objects for FSW strings', function(){
      assert.deepEqual(ssw.parse("AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520"),
        {chars:"fsw",type:"sign",fsw:"AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520",line:"AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520"});
      assert.deepEqual(ssw.parse("S20310"),
        {chars:"fsw",type:"symbol",fsw:"S20310",line:"S20310"});
      assert.deepEqual(ssw.parse("500x500"),
        {chars:"fsw",type:"coord",fsw:"500x500",line:"500x500"});
      assert.deepEqual(ssw.parse("S10000500x500"),
        {chars:"fsw",type:"spatial",fsw:"S10000500x500",line:"S10000500x500"});
    });
    test('objects for FSW strings with style string', function(){
      assert.deepEqual(ssw.parse("AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520-C"),
        {chars:"fsw",type:"sign",fsw:"AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520",line:"AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520-C", style:"-C"});
      assert.deepEqual(ssw.parse("S20310-C"),
        {chars:"fsw",type:"symbol",fsw:"S20310",line:"S20310-C", style:"-C"});
      assert.deepEqual(ssw.parse("S10000500x500-C"),
        {chars:"fsw",type:"spatial",fsw:"S10000500x500",line:"S10000500x500-C", style:"-C"});
    });
  });
  suite('swu', function(){
    test('objects for SWU strings', function(){
      assert.deepEqual(ssw.parse("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚"),{chars:"swu",type:"sign",swu:"𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",line:"𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚"});
      assert.deepEqual(ssw.parse("񈠣"),{chars:"swu",type:"symbol",swu:"񈠣",line:"񈠣"});
      assert.deepEqual(ssw.parse("𝤉𝤚"),{chars:"swu",type:"coord",swu:"𝤉𝤚",line:"𝤉𝤚"});
      assert.deepEqual(ssw.parse("񍉡𝣴𝣵"),{chars:"swu",type:"spatial",swu:"񍉡𝣴𝣵",line:"񍉡𝣴𝣵"});
    });
    test('objects for SWU strings with style strings', function(){
      assert.deepEqual(ssw.parse("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚-C"),{chars:"swu",type:"sign",swu:"𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",line:"𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚-C", style:"-C"});
      assert.deepEqual(ssw.parse("񈠣-C"),{chars:"swu",type:"symbol",swu:"񈠣",line:"񈠣-C", style:"-C"});
      assert.deepEqual(ssw.parse("񍉡𝣴𝣵-C"),{chars:"swu",type:"spatial",swu:"񍉡𝣴𝣵",line:"񍉡𝣴𝣵-C", style:"-C"});
    });
    test('multiple SWU strings', function(){
      assert.deepEqual(ssw.parse("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭 𝠀񂇢񂇈񆙡񋎥񋎵𝠃𝤛𝤬񂇈𝤀𝣺񂇢𝤄𝣻񋎥𝤄𝤗񋎵𝤃𝣟񆙡𝣱𝣸 𝠀񅨑񀀙񆉁𝠃𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮 񏌁𝣢𝤂","swu",true),{"chars":"swu","type":"sign","all":["𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭","𝠀񂇢񂇈񆙡񋎥񋎵𝠃𝤛𝤬񂇈𝤀𝣺񂇢𝤄𝣻񋎥𝤄𝤗񋎵𝤃𝣟񆙡𝣱𝣸","𝠀񅨑񀀙񆉁𝠃𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮","񏌁𝣢𝤂"],"swu":"𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭"});
    });
  });
  suite('find', function(){
    test('first SWU or false for other strings', function(){
      assert.deepEqual(ssw.parse("chars񆄱񈠣񍉡mixed","swu",true),{"chars":"swu","type":"symbol","all":["񆄱","񈠣","񍉡"],"swu":"񆄱"});
      assert.equal(ssw.parse("other","swu",true),false);
    });
  });
  suite('other', function(){
    test('false for other strings', function(){
      assert.equal(ssw.parse("other"),false);
      assert.equal(ssw.parse("chars񆄱񈠣񍉡mixed"),false);
    });
  });
});

// .fsw2swu()
suite('.fsw2swu( )', function(){
  suite('sign', function(){
    test('fsw sign to swu', function(){
      assert.equal(ssw.fsw2swu("AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520"),"𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚");
    });
  });
  suite('symbol', function(){
    test('fsw symbol to swu', function(){
      assert.equal(ssw.fsw2swu("S20310"),"񆄱");
    });
  });
  suite('spatial', function(){
    test('fsw spatial to swu', function(){
      assert.equal(ssw.fsw2swu("S33100482x483"),"񍉡𝣴𝣵");
    });
  });
  suite('coord', function(){
    test('fsw coord to swu', function(){
      assert.equal(ssw.fsw2swu("482x483"),"𝣴𝣵");
    });
  });
});

// .swu2fsw()
suite('.swu2fsw( )', function(){
  suite('sign', function(){
    test('swu sign to fsw', function(){
      assert.equal(ssw.swu2fsw("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚"),"AS20310S26b02S33100M521x547S33100482x483S20310506x500S26b02503x520");
    });
  });
  suite('symbol', function(){
    test('swu symbol to fsw', function(){
      assert.equal(ssw.swu2fsw("񆄱"),"S20310");
    });
  });
  suite('spatial', function(){
    test('swu spatial to fsw', function(){
      assert.equal(ssw.swu2fsw("񍉡𝣴𝣵"),"S33100482x483");
    });
  });
  suite('coord', function(){
    test('swu coord to fsw', function(){
      assert.equal(ssw.swu2fsw("𝣴𝣵"),"482x483");
    });
  });
});

// .swu2hex()
suite('.swu2hex( )', function(){
  suite('Valid Plane 1', function(){
    test('hex value of first unicode character', function(){
      assert.equal(ssw.swu2hex("𝠀"),"1D800");
    });
  });
  suite('Valid Plane 4', function(){
    test('hex value of first unicode character', function(){
      assert.equal(ssw.swu2hex("񀀁"),"40001");
    });
  });
  suite('Invalid', function(){
    test('false for empty string', function(){
      assert.deepEqual(ssw.swu2hex(""),false);
    });
    test('false for lower plane conversion', function(){
      assert.equal(ssw.swu2hex("S10000"),false);
    });
  });
});

// .symbol()
suite('.symbol( )', function(){
  suite('Valid FSW', function(){
    test('valid key when present', function(){
      assert.equal(ssw.symbol("S10000"),"S10000");
      assert.equal(ssw.symbol("S38b5f500x500"),"S38b5f500x500");
    });
  });
  suite('Valid SWU', function(){
    test('valid key for plane 4 characters', function(){
      assert.equal(ssw.symbol("񀀁"),"񀀁");
      assert.equal(ssw.symbol("񆇡𝤉𝣻"),"񆇡𝤉𝣻");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.symbol("S1000"),'');
      assert.equal(ssw.symbol("S4005f"),'');
    });
  });
});

// .sign()
suite('.sign( )', function(){
  suite('Valid FSW', function(){
    test('FSW string when present', function(){
      assert.equal(ssw.sign("M500x500"),"M500x500");
      assert.equal(ssw.sign("AS10000M505x510S10000490x480"),"AS10000M505x510S10000490x480");
    });
  });
  suite('Valid SWU', function(){
    test('FSW string when SWU', function(){
      assert.equal(ssw.sign("𝠃𝤤𝤙񀀁𝣨𝣴񆇡𝤚𝤎"),"𝠃𝤤𝤙񀀁𝣨𝣴񆇡𝤚𝤎");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid FSW strings', function(){
      assert.equal(ssw.sign("Q500x500"),'');
      assert.equal(ssw.sign("505x510S10000490x480"),'S10000490x480');
    });
  });
});

// .mirror()
suite('.mirror( )', function(){
  suite('Valid FSW', function(){
    test('valid mirror key if available', function(){
      assert.equal(ssw.mirror("S10000"),"S10008");
      assert.equal(ssw.mirror("S1005f"),"S10057");
      assert.equal(ssw.mirror("S29b0e"),"S29b06");
    });
  });
  suite('Valid SWU', function(){
    test('valid mirror key if available', function(){
      assert.equal(ssw.mirror("񆄱"),"񆄹");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.mirror("S1000"),'');
      assert.equal(ssw.mirror("S4005f"),'');
    });
  });
});

// .fill()
suite('.fill( )', function(){
  suite('Valid FSW', function(){
    test('valid key for next fill', function(){
      assert.equal(ssw.fill("S10000"),"S10010");
      assert.equal(ssw.fill("S10000",-1),"S10050");
    });
  });
  suite('Valid SWU', function(){
    test('valid SWU key for next fill', function(){
      assert.equal(ssw.fill("񀀁"),"񀀑");
      assert.equal(ssw.fill("񀀁",-1),"񀁑");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.fill("S1000"),'');
      assert.equal(ssw.fill("S4005f"),'');
    });
  });
});

// .rotate()
suite('.rotate( )', function(){
  suite('Valid FSW', function(){
    test('valid key for next rotation', function(){
      assert.equal(ssw.rotate("S10000"),"S10007");
      assert.equal(ssw.rotate("S10000",-1),"S10001");
      assert.equal(ssw.rotate("S10008"),"S10009");
      assert.equal(ssw.rotate("S1000f",-1),"S1000e");
    });
  });
  suite('Valid SWU', function(){
    test('valid SWU key for next rotation', function(){
      assert.equal(ssw.rotate("񀀁"),"񀀈");
      assert.equal(ssw.rotate("񀀁",-1),"񀀂");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.rotate("S1000"),'');
      assert.equal(ssw.rotate("S4005f"),'');
    });
  });
});

// .scroll()
suite('.scroll( )', function(){
  suite('Valid', function(){
    test('next or previous base if valid', function(){
      assert.equal(ssw.scroll("S10000"),"S10100");
      assert.equal(ssw.scroll("S10000",-1),"S10000");
    });
  });
  suite('Valid SWU', function(){
    test('valid SWU key for next rotation', function(){
      assert.equal(ssw.scroll("񀀁"),"񀁡");
      assert.equal(ssw.scroll("񆉁",-1),"񆇡");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.scroll("S1000"),'');
      assert.equal(ssw.scroll("S4005f"),'');
    });
  });
});

// .type()
suite('.type( )', function(){
  suite('Valid', function(){
    test('start and end range for type', function(){
      assert.sameMembers(ssw.type('hand'),['100', '204']);
    });
  });
  suite('Invalid', function(){
    test('entire range for invalid type', function(){
      assert.sameMembers(ssw.type(''),['100', '38b']);
    });
  });
});

// .is()
suite('.is( )', function(){
  suite('True for FSW', function(){
    test('true when key is of type', function(){
      assert.ok(ssw.is('S10000','hand'));
    });
  });
  suite('True for SWU', function(){
    test('true when key is of type', function(){
      assert.equal(ssw.is("񀀁","hand"),true);
      assert.equal(ssw.is("񆉁","movement"),true);
    });
  });
  suite('False', function(){
    test('false when key is not of type', function(){
      assert.notOk(ssw.is('S38b00','hand'));
    });
  });
});

// .filter()
suite('.filter( )', function(){
  suite('Found in FSW', function(){
    test('FSW key and coordinates of the specified type', function(){
      assert.equal(ssw.filter('M518x529S14c20481x471S27106503x489','hand'),'S14c20481x471');
      assert.equal(ssw.filter('M518x529S14c20481x471S27106503x489','movement'),'S27106503x489');
      assert.equal(ssw.filter('M518x533S1870a489x515S18701482x490S20500508x496S2e734500x468','hand'),'S1870a489x515S18701482x490');
    });
  });
  suite('Found in SWU', function(){
    test('SWU symbol and coordinate for the specified type', function(){
      assert.equal(ssw.filter("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",'hand'),'񆄱𝤌𝤆');
      assert.equal(ssw.filter("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",'movement'),'񈠣𝤉𝤚');
      assert.equal(ssw.filter("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",'hcenter'),'񍉡𝣴𝣵');
    });
  });
  suite('Missing', function(){
    test('empty string if type not found', function(){
      assert.equal(ssw.filter('M518x529S14c20481x471S27106503x489','vcenter'),'');
      assert.equal(ssw.filter('M518x529S14c20481x471S27106503x489','hcenter'),'');
    });
  });
});

// .random()
suite('.random( )', function(){
  suite('Okay for fsw', function(){
    test('key of the right type', function(){
      assert.ok(ssw.is(ssw.random('hand'),'hand'));
    });
  });
  suite('Okay for swu', function(){
    test('symbol of the right type', function(){
      assert.ok(ssw.is(ssw.random('hand',true),'hand'));
    });
  });
});

// .colorize()
suite('.colorize( )', function(){
  suite('Colors for fsw', function(){
    test('right color for type', function(){
      assert.equal(ssw.colorize("S10000"),"0000CC");
      assert.equal(ssw.colorize("S20500"),"CC0000");
      assert.equal(ssw.colorize("S2ff00"),"006600");
    });
  });
  suite('Colors for swu', function(){
    test('right color for type', function(){
      assert.equal(ssw.colorize("񆄱"),"0000CC");
      assert.equal(ssw.colorize("񈠣"),"CC0000");
      assert.equal(ssw.colorize("񍉡"),"006600");
    });
  });
});

// .view()
suite('.view( )', function(){
  suite('View for fsw', function(){
    test('correct fill', function(){
      assert.equal(ssw.view("S10000"),"S10000");
      assert.equal(ssw.view("S1003f"),"S10000");
      assert.equal(ssw.view("S10000",1),"S10000");
      assert.equal(ssw.view("S1003f",1),"S10000");
      assert.equal(ssw.view("S10100"),"S10110");
      assert.equal(ssw.view("S1013f"),"S10110");
      assert.equal(ssw.view("S10100",1),"S10100");
      assert.equal(ssw.view("S1013f",1),"S10100");
    });
  });
  suite('View for swu', function(){
    test('correct fill', function(){
      assert.equal(ssw.view("񀀁"),"񀀁");
      assert.equal(ssw.view("񀁀",1),"񀀁");
      assert.equal(ssw.view("񆄱"),"񆄱");
      assert.equal(ssw.view("񆄱",1),"񆄡");
    });
  });
});

// .uni()
suite('.uni( )', function(){
  suite('Plane 4', function(){
    test('1 character per key', function(){
      assert.equal(ssw.uni("S10000",4),'񀀁');
      assert.equal(ssw.uni("S10000",4,true),'40001');
      assert.equal(ssw.uni("S38b5f",4),'񏒀');
      assert.equal(ssw.uni("񆄱",4),'񆄱');
      assert.equal(ssw.uni("񆄱",4,true),'46131');
    });
  });
  suite('Plane 15 and 16', function(){
    test('valid code on plane 16 for key', function(){
      assert.equal(ssw.uni("S10000","10"),'􀀁');
      assert.equal(ssw.uni("S10000","10",true),'100001');
      assert.equal(ssw.uni("S38b5f","10"),'􏒀');
      assert.equal(ssw.uni("񆄱","F"),'󶄱');
      assert.equal(ssw.uni("񆄱","F",true),'F6131');
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.uni("S1000"),'');
      assert.equal(ssw.uni("S4005f"),'');
    });
  });
});

// .bbox()
suite('.bbox( )', function(){
  suite('Valid FSW', function(){
    test('x-min x-max y-min y-max', function(){
      assert.equal(ssw.bbox("500x500"),'500 500 500 500');
      assert.equal(ssw.bbox("500x550 550x500"),'500 550 500 550');
    });
  });
  suite('Valid Coordinates', function(){
    test('x-min x-max y-min y-max', function(){
      assert.equal(ssw.bbox("450x450"),'450 550 450 550');
      assert.equal(ssw.bbox("440x660 550x330"),'440 550 330 660');
    });
  });
  suite('Valid SWU', function(){
    test('x-min x-max y-min y-max', function(){
      assert.equal(ssw.bbox("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚"),'𝣴𝤛𝣵𝤵');
    });
  });
  suite('Valid numbers', function(){
    test('x-min x-max y-min y-max', function(){
      assert.equal(ssw.bbox("񍉡𝣴𝣵"),'𝣴𝤘𝣵𝤗');
    });
  });
  suite('Invalid', function(){
    test('empty string', function(){
      assert.equal(ssw.bbox(""),'');
      assert.equal(ssw.bbox("500x50"),'');
      assert.equal(ssw.bbox("00x500"),'');
    });
  });
});

// .displace()
suite('.displace( )', function(){
  suite('FSW', function(){
    test('FSW with updated coordinates', function(){
      assert.equal(ssw.displace("M518x529S14c20481x471S27106503x489",5,10),'M523x539S14c20486x481S27106508x499');
    });
  });
  suite('Query', function(){
    test('query with updated coordinates', function(){
      assert.equal(ssw.displace("QS10000550x550R205t210500x500",-50,-50),'QS10000500x500R205t210450x450');
    });
  });
  suite('SWU', function(){
    test('SWU with updated coordinates', function(){
      assert.equal(ssw.displace("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",5,10),'𝠀񆄱񈠣񍉡𝠃𝤠𝤿񍉡𝣹𝣿񆄱𝤑𝤐񈠣𝤎𝤤');
    });
  });
  suite('No coordinates', function(){
    test('same string', function(){
      assert.equal(ssw.displace("Q"),'Q');
      assert.equal(ssw.displace("500x50"),'500x50');
      assert.equal(ssw.displace("00x500"),'00x500');
    });
  });
});

// .size()
suite('.size( )', function(){
  suite('Valid FSW sign', function(){
    test('size of sign', function(){
      assert.equal(ssw.size('M518x529S14c20481x471S27106503x489'),'37x58');
    });
  });
  suite('Valid FSW symbol with size', function(){
    test('size of key with', function(){
      assert.equal(ssw.size('S10000490x490'),'20x20');
    });
  });
  suite('Valid FSW symbol', function(){
    test('size of key', function(){
      assert.equal(ssw.size('S10000'),'15x30');
      assert.equal(ssw.size('S38b00'),'60x15');
    });
  });
  suite('Valid SWU sign', function(){
    test('size  for SWU strings', function(){
      assert.equal(ssw.size("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚"),"39x64");
    });
  });
  suite('Valid SWU symbol', function(){
    test('size  for SWU strings', function(){
      assert.equal(ssw.size("񆄱"),"15x15");
      assert.equal(ssw.size("񏌁𝣢𝤂"),"72x8");
    });
  });
  suite('Invalid key', function(){
    test('empty string for invalid keys', function(){
      assert.equal(ssw.size('S38b5f'),'');
      assert.equal(ssw.size('S1000'),'');
    });
  });
});

// .max()
suite('.max( )', function(){
  suite('Found in FSW', function(){
    test('key and coordinates of the specified type with max coordinates added', function(){
      assert.equal(ssw.max('M518x529S14c20481x471S27106503x489','hand'),'S14c20481x471504x502');
      assert.equal(ssw.max('M518x529S14c20481x471S27106503x489','movement'),'S27106503x489518x529');
      assert.equal(ssw.max('M518x533S1870a489x515S18701482x490S20500508x496S2e734500x468','hand'),'S1870a489x515518x533S18701482x490506x514');
    });
  });
  suite('Missing', function(){
    test('empty string if type not found', function(){
      assert.equal(ssw.max('M518x529S14c20481x471S27106503x489','vcenter'),'');
      assert.equal(ssw.max('M518x529S14c20481x471S27106503x489','hcenter'),'');
    });
  });
  suite('Found in SWU', function(){
    test('key and coordinates of the specified type with max coordinates added', function(){
      assert.equal(ssw.max("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",'hand'),'񆄱𝤌𝤆𝤛𝤕');
      assert.equal(ssw.max("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",'movement'),'񈠣𝤉𝤚𝤛𝤵');
      assert.equal(ssw.max("𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚",'vcenter'),'񍉡𝣴𝣵𝤘𝤘');
    });
  });
});

// .norm()
suite('.norm( )', function(){
  suite('Valid FSW', function(){
    test('normalized FSW string based on proper center', function(){
      assert.equal(ssw.norm('M519x529S14c20482x471S27106504x489'),'M519x529S14c20482x471S27106504x489');
      assert.equal(ssw.norm('M518x529S14c20481x471S27106503x489'),'M519x529S14c20482x471S27106504x489');
      assert.equal(ssw.norm('M518x533S1870a489x515S18701482x490S20500508x496S2e734500x468'),'M518x533S1870a489x515S18701482x490S20500508x496S2e734500x468');
      assert.equal(ssw.norm('S10000500x500'),'M508x515S10000493x485');
      assert.equal(ssw.norm('LS10000500x500'),'L508x515S10000493x485');
      assert.equal(ssw.norm('LS10200510x510S20500530x520'),'L515x515S10200485x485S20500505x495');
    });
  });
  suite('Valid SWU', function(){
    test('normalized SWU string based on proper center', function(){
      assert.equal(ssw.norm('𝠀񆄱񈠣񍉡𝠃𝤠𝤿񍉡𝣹𝣿񆄱𝤑𝤐񈠣𝤎𝤤'),"𝠀񆄱񈠣񍉡𝠃𝤛𝤵񍉡𝣴𝣵񆄱𝤌𝤆񈠣𝤉𝤚");
    });
  });
  suite('Invalid', function(){
    test('empty string if invalid FSW', function(){
      assert.equal(ssw.norm('a'),'');
      assert.equal(ssw.norm('Q'),'');
    });
  });
});

// .svg()

// .canvas()

// .png()

// .query()
suite('.query( )', function(){
  suite('Valid', function(){
    test('query string when present', function(){
      assert.equal(ssw.query("Q"),"Q");
      assert.equal(ssw.query("QT"),"QT");
      assert.equal(ssw.query("QAS100uuT"),"QAS100uuT");
      assert.equal(ssw.query("QS10000"),"QS10000");
      assert.equal(ssw.query("QR100t120"),"QR100t120");
      assert.equal(ssw.query("QS10000500x500"),"QS10000500x500");
      assert.equal(ssw.query("QR100t120500x500"),"QR100t120500x500");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid query strings', function(){
      assert.equal(ssw.query("M500x500"),'');
      assert.equal(ssw.query("505x510S10000490x480"),'');
      assert.equal(ssw.query("qrti"),'');
    });
  });
});

// .queryu()
suite('.queryu( )', function(){
  suite('Valid', function(){
    test('query string when present', function(){
      assert.equal(ssw.queryu("Q"),"Q");
      assert.equal(ssw.queryu("QT"),"QT");
      assert.equal(ssw.queryu("QA񀀚T"),"QA񀀚T");
      assert.equal(ssw.queryu("Q񀀚fr"),"Q񀀚fr");
      assert.equal(ssw.queryu("QR񀀁񀏁"),"QR񀀁񀏁");
      assert.equal(ssw.queryu("Q񀀚𝤉𝤚"),"Q񀀚𝤉𝤚");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid query strings', function(){
      assert.equal(ssw.queryu("M500x500"),'');
      assert.equal(ssw.queryu("505x510S10000490x480"),'');
      assert.equal(ssw.queryu("qrti"),'');
    });
  });
});

// .query2swu()
suite('.query2swu( )', function(){
  suite('Valid', function(){
    test('query string when present', function(){
      assert.equal(ssw.query2swu("Q"),"Q");
      assert.equal(ssw.query2swu("QT"),"QT");
      assert.equal(ssw.query2swu("QAS100uuT"),"QA񀀁frT");
      assert.equal(ssw.query2swu("QS10000"),"Q񀀁");
      assert.equal(ssw.query2swu("QR100t120"),"QR񀀁񀰑");
      assert.equal(ssw.query2swu("QS10000500x500"),"Q񀀁𝤆𝤆");
      assert.equal(ssw.query2swu("QR100t120500x500"),"QR񀀁񀰑𝤆𝤆");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid query strings', function(){
      assert.equal(ssw.query2swu("M500x500"),'');
      assert.equal(ssw.query2swu("505x510S10000490x480"),'');
      assert.equal(ssw.query2swu("qrti"),'');
    });
  });
});

// .query2fsw()
suite('.query2fsw( )', function(){
  suite('Valid', function(){
    test('query string when present', function(){
      assert.equal(ssw.query2fsw("Q"),"Q");
      assert.equal(ssw.query2fsw("QT"),"QT");
      assert.equal(ssw.query2fsw("QA񀀁frT"),"QAS100uuT");
      assert.equal(ssw.query2fsw("Q񀀁"),"QS10000");
      assert.equal(ssw.query2fsw("QR񀀁񀰑"),"QR100t120");
      assert.equal(ssw.query2fsw("Q񀀁𝤆𝤆"),"QS10000500x500");
      assert.equal(ssw.query2fsw("QR񀀁񀰑𝤆𝤆"),"QR100t120500x500");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid query strings', function(){
      assert.equal(ssw.query2fsw("M500x500"),'');
      assert.equal(ssw.query2fsw("505x510S10000490x480"),'');
      assert.equal(ssw.query2fsw("qrti"),'');
    });
  });
});

// .range()
suite('.range( )', function(){
  suite('Decimal', function(){
    test('regular expression for range', function(){
      assert.equal(ssw.range(250,400),'((2[5-9][0-9])|(3[0-9][0-9])|(400))');
      assert.equal(ssw.range(277,429),'((27[7-9])|(2[89][0-9])|(3[0-9][0-9])|(4[01][0-9])|(42[0-9]))');
    });
  });
  suite('Hex', function(){
    test('regular expression for range', function(){
      assert.equal(ssw.range(250,400,true),'((2[5-9a-f][0-9a-f])|(3[0-9a-f][0-9a-f])|(400))');
      assert.equal(ssw.range(277,429,true),'((27[7-9a-f])|(2[89a-f][0-9a-f])|(3[0-9a-f][0-9a-f])|(4[01][0-9a-f])|(42[0-9]))');
    });
  });
});

// .rangeu()
suite('.rangeu( )', function(){
  suite('numbers', function(){
    test('regular expression for number range', function(){
      assert.equal(ssw.rangeu('񀀁񀏁'),'\uD8C0[\uDC01-\uDFC1]');
      assert.equal(ssw.rangeu('񀀁','񀏁'),'\uD8C0[\uDC01-\uDFC1]');
    });
  });
  suite('symbols', function(){
    test('regular expression for symbol range', function(){
      assert.equal(ssw.rangeu('𝤉𝤚'),'\uD836[\uDD09-\uDD1A]');
      assert.equal(ssw.rangeu('𝤉','𝤚'),'\uD836[\uDD09-\uDD1A]');
    });
  });
});

// .regex()
suite('.regex( )', function(){
  suite('Valid', function(){
    test('regular expression for query string', function(){
      assert.equal(ssw.regex("Q")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","A");
      assert.equal(ssw.regex("QT")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","A");
      assert.equal(ssw.regex("QS10000")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000[0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","A");
      assert.equal(ssw.regex("QTS10000")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000[0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","B");
      assert.equal(ssw.regex("QAS100uuR100t204T")[0],"(AS100[0-5][0-9a-f]S((1[0-9a-f][0-9a-f])|(20[0-4]))[0-5][0-9a-f](S[123][0-9a-f]{2}[0-5][0-9a-f])*)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","C");
      assert.equal(ssw.regex("QR100t120")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S((1[01][0-9a-f])|(120))[0-5][0-9a-f][0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","D");
      assert.equal(ssw.regex("QS10000500x500")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000((4[89][0-9])|(5[01][0-9])|(520))x((4[89][0-9])|(5[01][0-9])|(520))(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","E");
      assert.equal(ssw.regex("QS10000500x500V10")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S10000((49[0-9])|(50[0-9])|(510))x((49[0-9])|(50[0-9])|(510))(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","F");
      assert.equal(ssw.regex("QR100t120500x500S20500")[0],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S20500[0-9]{3}x[0-9]{3}(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","G");
      assert.equal(ssw.regex("QR100t120500x500S20500")[1],"(A(S[123][0-9a-f]{2}[0-5][0-9a-f])+)?[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*S((1[01][0-9a-f])|(120))[0-5][0-9a-f]((4[89][0-9])|(5[01][0-9])|(520))x((4[89][0-9])|(5[01][0-9])|(520))(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*","H");
      assert.equal(ssw.regex("QAS10000R100t204S20500T")[0],"(AS10000S((1[0-9a-f][0-9a-f])|(20[0-4]))[0-5][0-9a-f]S20500(S[123][0-9a-f]{2}[0-5][0-9a-f])*)[BLMR]([0-9]{3}x[0-9]{3})(S[123][0-9a-f]{2}[0-5][0-9a-f][0-9]{3}x[0-9]{3})*");
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid query strings', function(){
      assert.equal(ssw.regex("M500x500"),'');
      assert.equal(ssw.regex("505x510S10000490x480"),'');
      assert.equal(ssw.regex("qrti"),'');
    });
  });
});

// .regexu()
suite('.regexu( )', function(){
  suite('Valid', function(){
    test('regular expression for query string', function(){
      assert.equal(ssw.regexu("Q")[0],"(\uD836\uDC00(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FB][\uDC00-\uDFFF])|(\uD8FC[\uDC00-\uDEA0])))+)?\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FA][\uDC00-\uDFFF])|(\uD8FB[\uDC00-\uDFA0]))(\uD836[\uDC0C-\uDDFF]){2})*");
      assert.equal(ssw.regexu("QT")[0],"\uD836\uDC00((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))+\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*");
      assert.deepEqual(ssw.regexu("QA񆄱T"),["(\uD836\uDC00\uD8D8\uDD31(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80])))*)\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*"]);
      assert.deepEqual(ssw.regexu("Q񀀚fr"),["(\uD836\uDC00(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80])))+)?\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*\uD8C0[\uDC01-\uDC50](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*"]);
      assert.deepEqual(ssw.regexu("QR񀀁񀏁"),["(\uD836\uDC00(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80])))+)?\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*((\uD8C0[\uDC01-\uDFFF])|(\uD8C1[\uDC00-\uDC20]))(\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*"]);
      assert.deepEqual(ssw.regexu("Q񀀚𝣮𝣭"),["(\uD836\uDC00(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80])))+)?\uD836[\uDC01-\uDC04](\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*\uD8C0\uDC1A(\uD836[\uDC0C-\uDDFF]){2}(((\uD8C0[\uDC01-\uDFFF])|([\uD8C1-\uD8FC][\uDC00-\uDFFF])|(\uD8FD[\uDC00-\uDC80]))(\uD836[\uDC0C-\uDDFF]){2})*"]);
    });
  });
  suite('Invalid', function(){
    test('empty string for invalid query strings', function(){
      assert.equal(ssw.regexu("M500x500"),'');
      assert.equal(ssw.regexu("505x510S10000490x480"),'');
      assert.equal(ssw.regexu("qrti"),'');
    });
  });
});

// .results()
var text = 'M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537 M524x514S11541500x487S1154a477x490 M510x545S1f720490x456S14720496x476S14720496x503S14a20495x530 M542x582S20320474x567S16d20472x419S11502459x443S1f720469x462S11a20474x480S1dc20465x514S14a20474x548S18d20516x419S19220521x450S16d20519x474S11502506x498S14a20521x518S1dc20512x538';
suite('.results( )', function(){
  suite('results', function(){
    test('array of matching words for query string', function(){
      assert.sameMembers(ssw.results("Q",text),[ "M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537", "M524x514S11541500x487S1154a477x490", "M510x545S1f720490x456S14720496x476S14720496x503S14a20495x530", "M542x582S20320474x567S16d20472x419S11502459x443S1f720469x462S11a20474x480S1dc20465x514S14a20474x548S18d20516x419S19220521x450S16d20519x474S11502506x498S14a20521x518S1dc20512x538" ]);
      assert.sameMembers(ssw.results("Q",text,"B"),[ "B537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537", "B524x514S11541500x487S1154a477x490", "B510x545S1f720490x456S14720496x476S14720496x503S14a20495x530", "B542x582S20320474x567S16d20472x419S11502459x443S1f720469x462S11a20474x480S1dc20465x514S14a20474x548S18d20516x419S19220521x450S16d20519x474S11502506x498S14a20521x518S1dc20512x538" ]);
      assert.sameMembers(ssw.results("QR100t120",text),[ "M524x514S11541500x487S1154a477x490", "M542x582S20320474x567S16d20472x419S11502459x443S1f720469x462S11a20474x480S1dc20465x514S14a20474x548S18d20516x419S19220521x450S16d20519x474S11502506x498S14a20521x518S1dc20512x538" ]);
    });
  });
  suite('Invalid', function(){
    test('empty array when no results found', function(){
      assert.sameMembers(ssw.results("Q","500x500"),[],'a');
      assert.sameMembers(ssw.results("QT","505x510S10000490x480"),[],'b');
      assert.sameMembers(ssw.results("qrti",text),[],'c');
    });
  });
});

// .resultsu()
var textu = '𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭 𝠀񂇢񂇈񆙡񋎥񋎵𝠃𝤛𝤬񂇈𝤀𝣺񂇢𝤄𝣻񋎥𝤄𝤗񋎵𝤃𝣟񆙡𝣱𝣸 𝠀񅨑񀀙񆉁𝠃𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮 񏌁𝣢𝤂';
suite('.resultsu( )', function(){
  suite('resultsu', function(){
    test('array of matching words for query string', function(){
      assert.deepEqual(ssw.resultsu("Q񀀒",textu),[ "𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭" ]);
      assert.deepEqual(ssw.resultsu("Q񀀒fr",textu,"\uD836\uDC01"),[ "𝠀񀀒񀀚񋚥񋛩𝠁𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭", "𝠀񅨑񀀙񆉁𝠁𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮" ]);
      assert.deepEqual(ssw.resultsu("QR񂇈񅨑",textu),[ "𝠀񂇢񂇈񆙡񋎥񋎵𝠃𝤛𝤬񂇈𝤀𝣺񂇢𝤄𝣻񋎥𝤄𝤗񋎵𝤃𝣟񆙡𝣱𝣸", "𝠀񅨑񀀙񆉁𝠃𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮" ]);
    });
  });
  suite('Invalid', function(){
    test('empty array when no results found', function(){
      assert.sameMembers(ssw.resultsu("Q","500x500"),[],'a');
      assert.sameMembers(ssw.resultsu("QT","505x510S10000490x480"),[],'b');
      assert.sameMembers(ssw.resultsu("qrti",text),[],'c');
    });
  });
});

// .lines()
var lines = 'M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537 line 1 stuff\n';
lines += 'M524x514S11541500x487S1154a477x490 line 2 stuff\n';
lines += 'M542x582S20320474x567S16d20472x419S11502459x443S1f720469x462S11a20474x480S1dc20465x514S14a20474x548S18d20516x419S19220521x450S16d20519x474S11502506x498S14a20521x518S1dc20512x538 final lines stuff';
suite('.lines( )', function(){
  suite('lines', function(){
    test('array of matching words and the rest of the line', function(){
      assert.sameMembers(ssw.lines("Q",lines),[ "M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537 line 1 stuff", "M524x514S11541500x487S1154a477x490 line 2 stuff", "M542x582S20320474x567S16d20472x419S11502459x443S1f720469x462S11a20474x480S1dc20465x514S14a20474x548S18d20516x419S19220521x450S16d20519x474S11502506x498S14a20521x518S1dc20512x538 final lines stuff" ]);
    });
  });
  suite('Invalid', function(){
    test('empty array when no results found', function(){
      assert.sameMembers(ssw.lines("Q","500x500"),[],'a');
      assert.sameMembers(ssw.lines("QT","505x510S10000490x480"),[],'b');
      assert.sameMembers(ssw.lines("qrti",lines),[],'c');
    });
  });
});

// .linesu()
var linesu = '𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭 first line\n';
linesu += '𝠀񂇢񂇈񆙡񋎥񋎵𝠃𝤛𝤬񂇈𝤀𝣺񂇢𝤄𝣻񋎥𝤄𝤗񋎵𝤃𝣟񆙡𝣱𝣸 second line\n';
linesu += '𝠀񅨑񀀙񆉁𝠃𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮 third line\n';
suite('.linesu( )', function(){
  suite('linesu', function(){
    test('array of matching words and the rest of the line', function(){
      assert.deepEqual(ssw.linesu("Q",linesu),[ '𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭 first line', '𝠀񂇢񂇈񆙡񋎥񋎵𝠃𝤛𝤬񂇈𝤀𝣺񂇢𝤄𝣻񋎥𝤄𝤗񋎵𝤃𝣟񆙡𝣱𝣸 second line','𝠀񅨑񀀙񆉁𝠃𝤙𝤞񀀙𝣷𝤀񅨑𝣼𝤀񆉁𝣳𝣮 third line' ]);
    });
  });
  suite('Invalid', function(){
    test('empty array when no results found', function(){
      assert.sameMembers(ssw.lines("Q","500x500"),[],'a');
      assert.sameMembers(ssw.lines("QT","505x510S10000490x480"),[],'b');
      assert.sameMembers(ssw.lines("qrti",linesu),[],'c');
    });
  });
});

// .convert()
suite('.convert( )', function(){
  suite('convert', function(){
    test('query string from FSW', function(){
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'A'),'QAS2ff00S14c20T');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'a'),'QAS2ffuuS14cuuT');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'S'),'QS2ff00S14c20S22b03S14c10S20500');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'s'),'QS2ffuuS14cuuS22buuS14cuuS205uu');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'SL'),'QS2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'sL'),'QS2ffuu482x483S14cuu514x470S22buu505x507S14cuu476x524S205uu501x537');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'ASL'),'QAS2ff00S14c20TS2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537');
      assert.equal(ssw.convert("AS2ff00S14c20M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537",'asL'),'QAS2ffuuS14cuuTS2ffuu482x483S14cuu514x470S22buu505x507S14cuu476x524S205uu501x537');
    });
  });
  suite('Invalid FSW', function(){
    test('empty string for bad FSW', function(){
      assert.equal(ssw.convert("Q","E"),'');
      assert.equal(ssw.convert("QT","G"),'');
      assert.equal(ssw.convert("qrti","GL"),'');
    });
  });
  suite('Invalid Flags', function(){
    test('empty string for bad FSW', function(){
      assert.equal(ssw.convert("M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537","eL"),'');
      assert.equal(ssw.convert("M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537","Z"),'');
      assert.equal(ssw.convert("M537x555S2ff00482x483S14c20514x470S22b03505x507S14c10476x524S20500501x537","eg"),'');
    });
  });
});

// .convertu()
suite('.convertu( )', function(){
  suite('convert', function(){
    test('query string from FSW', function(){
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'A'),'QA񀀒񀀚񋚥񋛩T');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'a'),'QA񀀒fr񀀚fr񋚥fr񋛩frT');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'S'),'Q񋛩񀀒񋚥񀀚');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'s'),'Q񋛩fr񀀒fr񋚥fr񀀚fr');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'SL'),'Q񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'sL'),'Q񋛩fr𝣵𝤐񀀒fr𝤇𝣤񋚥fr𝤐𝤆񀀚fr𝣮𝣭');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'ASL'),'QA񀀒񀀚񋚥񋛩T񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭",'asL'),'QA񀀒fr񀀚fr񋚥fr񋛩frT񋛩fr𝣵𝤐񀀒fr𝤇𝣤񋚥fr𝤐𝤆񀀚fr𝣮𝣭');
    });
  });
  suite('Invalid SWU', function(){
    test('empty string for bad FSW', function(){
      assert.equal(ssw.convertu("Q","E"),'');
      assert.equal(ssw.convertu("QT","G"),'');
      assert.equal(ssw.convertu("qrti","GL"),'');
    });
  });
  suite('Invalid Flags', function(){
    test('empty string for bad FSW', function(){
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭","eL"),'');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭","Z"),'');
      assert.equal(ssw.convertu("𝠀񀀒񀀚񋚥񋛩𝠃𝤟𝤩񋛩𝣵𝤐񀀒𝤇𝣤񋚥𝤐𝤆񀀚𝣮𝣭","eg"),'');
    });
  });
});

