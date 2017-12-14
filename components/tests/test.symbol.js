var assert = chai.assert;

var inc1 = 1;
var inc2 = Math.floor(Math.random() * 16)+1;
var inc3 = Math.floor(Math.random() * 16)+1;
var re, v, str, result, coord, c, testing;


var range = ssw.type("hand");
var start = parseInt(range[0],16);
var end = parseInt(range[1],16);

for (low=start;low<end;low+=inc1){
  for (high=low;high<end;high+=inc2){
    testit(low,high,start,end);
  }
}

function testit(low,high,start,end){
  var rFill = Math.floor(Math.random() * 6);
  var rRota = Math.floor(Math.random() * 16);

  var min = ssw.fsw2swu("S" + low.toString(16).toLowerCase() + rFill.toString(16) + rRota.toString(16).toLowerCase());
  var max = ssw.fsw2swu("S" + high.toString(16).toLowerCase() + rFill.toString(16) + rRota.toString(16).toLowerCase());

  var re = new RegExp(ssw.rangeu(min,max));
  suite('.rangeu(' + min + ',' + max + ' )', function(){
    var rF2,rR2
    this.timeout(5000);
    test('regex equals math', function(){
      for (test=start;test<end;test+=inc3){
        rF2 = Math.floor(Math.random() * 6);
        rR2 = Math.floor(Math.random() * 16);
        testing = ssw.fsw2swu("S" + test.toString(16).toLowerCase() + rF2.toString(16) + rR2.toString(16).toLowerCase());
        v = (testing >= min) && (testing <= max);
        result = !!testing.match(re);
        assert.equal(result,v,test);
      }
    });
  });
}
