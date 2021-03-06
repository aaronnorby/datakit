'use strict'
var dk = require('../../lib/datakit.js');
var fs = require('fs');
var exec = require('child_process').exec;

describe('isclose',function(){
  it('should return true for close numbers',function(){
    expect(dk.isclose(0,Math.pow(10,-15))).toBe(true);
  });
  it('should return false for distant numbers',function(){
    expect(dk.isclose(0,Math.pow(10,-5))).toBe(false);
  });
});

var floats = [];
for (var i=0; i<10000; i++){
  floats.push(0.1);
  floats.push(0.2);
  floats.push(0.3);
}

describe('sum',function(){
  var top = 10000;
  var nums = [];
  for (var i=0; i<=top; i++){
    nums.push(i);
  }
  it('should accurately sum numbers',function(){
    expect(dk.sum(nums)).toBe((top*(top+1)/2));
  });

  it('should minimize errors in floating point arithmetic',function(){
    expect(dk.isclose(6000,dk.sum(floats))).toBe(true);
  });
});

describe('mean',function(){
  var nums = [-10,15,25,0,-5];
  it('should accurately compute the mean of numbers',function(){
    expect(dk.mean(nums)).toBe(5);
  });

  it('should minimize errors in floating point arithmetic',function(){
    expect(dk.isclose(0.2,dk.mean(floats))).toBe(true);
  });
});

describe('prod',function(){
  var top = 10;
  var nums = [];
  for (var i=1; i<=top; i++){
    nums.push(i);
  }
  it('should accurately compute a product of numbers',function(){
    expect(dk.prod(nums)).toBe(3628800);
  });

  var floats_ = [Math.pow(10,75)].concat(floats.slice(0,99));
  it('should minimize errors in floating point arithmetic',function(){
    expect(dk.isclose(dk.prod(floats_),47.751966659678405306351616)).toBe(true);
  });
});

describe('max and min',function(){
  var nums = [10,-2,23,12,43,123213,2];
  it('should accurately identify the maximum',function(){
    expect(dk.max(nums)).toBe(123213);
  });

  it('should accurately identify the minimum',function(){
    expect(dk.min(nums)).toBe(-2);
  });
});

describe('cov, vari, and sd',function(){
  var nums = [-10,-5,0,5,10];
  var nums_ = [0,10,20,30,40];
  it('should accurately compute covariance', function(){
    expect(dk.cov(nums,nums_)).toBe(125);
  });
  it('should accurately compute variance', function(){
    expect(dk.vari(nums)).toBe(62.5);
  });
  it('should accurately compute standard deviation', function(){
    expect(dk.sd(nums_)).toBe(Math.sqrt(250));
  });
});

describe('random number generators', function(){
  var u = dk.uni(100);
  var n = dk.norm(100);
  var e = dk.exp(100);
  var n_ = dk.norm(3);
  it('should have the right length',function(){
    expect(u.length).toBe(100);
    expect(n.length).toBe(100);
    expect(e.length).toBe(100);
    expect(n_.length).toBe(3);
  });
  it('should generate normals from Box-Muller',function(){
    var z1 = n[0];
    var z2 = n[1];
    var u = Math.exp(Math.pow(Math.pow(z1,2)+Math.pow(z2,2),2)*(-2));
    expect(u).toBeGreaterThan(0);
    expect(u).toBeLessThan(1);
  });
  it('should have the correct uniform boundaries',function(){
    expect(dk.min(u)).toBeGreaterThan(0);
    expect(dk.max(u)).toBeLessThan(1);
  });
  it('should generate exponentials from uniforms',function(){
    u = Math.exp(-e[0]);
    expect(u).toBeGreaterThan(0);
    expect(u).toBeLessThan(1);
  });
});

describe('csv and col', function(){
  var val, d;
  beforeEach(function(done) {
    dk.csv('spec/test/test.csv',function(data){
      d = data;
      val = d[0].COL1;
      done();
    });
  });

  it('should correctly read a csv file and find columns', function(done) {
    expect(val).toBe('val11');
    expect(dk.col(d,'COL2')[0]).toBe('val12');
    done();
  });
});

describe('seq',function(){
  it('should return accurate sequences',function(){
    expect(dk.seq(1,10).length).toBe(10);
    expect(dk.seq(-10,10,2)[5]).toBe(0);
  });
});

describe('reg',function(){
  var x = [1,2,3,5];
  var y = [2,4,6,10];
  var m = dk.reg(x,y);
  it('should return an accurate model',function(){
    expect(m.f(4)).toBe(8);
  });
  it('should return an accurate interpolation of the linear model', function(){
    expect(m.pts[0]).toBe(2);
  });
});

describe('rep',function(){
  var arr = dk.rep(0.5,100);
  it('should have the correct length',function(){
    expect(arr.length).toBe(100);
  });
  it('should have the correct value',function(){
    expect(arr[0]).toBe(0.5);
  });
});

describe('plot',function(){
  var p;
  beforeEach(function(done) {
    p = dk.plot([1,2,3])
    done();
  });

  it('should return an html string',function(done){
    expect(p.slice(0,6)).toBe('<html>');
    expect(p.slice(p.length-7,p.length)).toBe('</html>')
    done();
  });
});

describe('numeric', function() {
  var d;
  beforeEach(function(done) {
    dk.csv('spec/test/test2.csv', function(data) {
      d = dk.numeric(data, ['COL2', 'COL3'], 6253);
      done();
    });
  });

  it('should convert string values to numbers', function(done) {
    expect(dk.col(d, 'COL2')[0]).toBe(1);
    expect(dk.col(d, 'COL3')[0]).toBe(2);
    done();
  });

  it('should convert empty cells to the supplied default', function(done) {
    expect(dk.col(d, 'COL2')[2]).toBe(6253);
    done();
  });


});
