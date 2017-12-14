var assert = chai.assert;

var start = 250;
var end = 750;
var inc1 = 1;
var inc2 = Math.floor(Math.random() * 10)+1;
var inc3 = Math.floor(Math.random() * 10)+1;
var re, v, str, result, coord, c, testing;

for (low=start;low<end;low+=inc1){
  for (high=low;high<end;high+=inc2){
    testit(low,high,start,end);
  }
}

function testit(low,high,start,end){
  var coord = ssw.fsw2swu(low + "x" + high);
  var min = coord.substr(0,2);
  var max = coord.substr(2,2);
  var re = new RegExp(ssw.rangeu(coord));
  suite('.rangeu(' + low + ',' + high + ' )', function(){
    this.timeout(5000);
    test('regex equals math', function(){
      for (test=start;test<end;test+=inc3){
        c = 0x1D80C + test - 250;
        testing = String.fromCharCode(0xD800 + ((c - 0x10000) >> 10), 0xDC00 + ((c - 0x10000) & 0x3FF));
        v = (testing >= min) && (testing <= max);
        str = '' + testing;
        result = !!str.match(re);
        assert.equal(result,v,test);
      }
    });
  });
}
