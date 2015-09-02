// 
// Test different color selection algorithms
// Find the best
//
// Problem:
//   Players joining a game or a chat.  Want to assign each a color as they arrive.
// Want colors to be as "different" as possible.
// We'll use a simple model -- each color is a point on the interval 0-1.
// 0 and 1 are themselves colors -- imagine them as the first two colors picked.  
// Subsequent colors Ck, k = 3,4,5, ... 
// An even division of k colors would allow a spacing of 1/(k-1),
// but that is not possible unless colors can be moved, which is not allowed.
//
// Measures:
// For any algorithm, and k
//   let z = min spacing in a selection of k colorsW
//   let m = z / (1/(k-1))  (how close we are to optimal)
// then for k>2, let
//   Wk = worst m up thru k
//   Ak = avg m up thru k
//
// For a given algorithm,
//   W = worst over all k
//   A = worst over all k
//
//
// Example 1:
//   (C1 always 0.0, C2 always 1.0)
//
//   C3 = 0.5 ==>     z3 = 0.5,  m3 = 0.5/(1/2) = 1; W3 = 1, A3 = 1
//     but then we can't do better than
//   C4 = 0.25 ==>  z4 = 0.25, m4 = 0.25/(1/3) = 0.75; W4 = 0.75, A4 = 0.875
//
// Example 2:
//
//   C3 = 0.6 ==>     z3 = 0.4, m3 = 0.4/(1/2) = 0.8; W3 = 0.8, A3 = 0.8
//   C4 = 0.3 ==>     z4 = 0.3, m4 = 0.3/(1/3) = 0.9; W4 = 0.9, A4 = 0.85
//
//  better than example 1 on W
//
// Example 3:
//
//  let  x + y = 1  (x = C3)  (x<y)
//       v + v = y  (split y to yield C4 = x + v) 
//       x/(1/2) = v/(1/3) ==> 2x = 3v ==> v=(2/3)x
//     and
//       x + 2v = 1
//     so 
//       x + (4/3)x = 1
//       x = 3/7
//       v = 2/7
//
//   thus 
//      z3 =   0.429,   W3 = 0.429/0.5 = 0.857, A3 = 0.857
//      z4 =   0.2857,  W4 = 0.2857/(1/3) = 0.857, A4 = 0.857
//
//  which is the best for k=4
//  (but isn't the best setup for k=5)
//
//  Ideas:
//  (1) split biggest in half (Example 1. won't win)
//  (2) split biggest into golden ratio (close to Ex 2 & 3)
//  (3) some taper as you work your way through k...2k intervals
//
//  Feels like it may get harder as you go 
//   ... intervals might be, say, half as large as you'd optimally like
//   ... since interval lifetime approaches roughly k as k gets larger 
//   
//

// color #s, array indexing, etc starts at 0
var TWO = 2;
var PHI = 1.61803398875;   // "Golden ratio"
var SEVEN_FOURTHS = 7/4;

var divisor = SEVEN_FOURTHS;
var name = '<<SEVEN_FOURTHS>>';


var colors = [0.0, 1.0];
var wMin = 1.0;

var wCount = 2;  // initially 2 colors
var wAvg = 1.0;
var wTot = 2;

if (process.argv[2]) {
  divisor = process.argv[2];
  console.log('using divisor: ' + divisor);
  name = process.argv[2];
}

for (var k = 2; k<100; k+=1) {
  var intervalEndpoints = findLargestInterval(colors);
  var intervalLength = intervalEndpoints[1] - intervalEndpoints[0];

  var newVal = intervalEndpoints[0] + (intervalEndpoints[1]-intervalEndpoints[0])/divisor;

  colors.push(newVal);

//  console.log('largest is: ' + intervalEndpoints[0] + ', ' + intervalEndpoints[1] + ', split at: ' + newVal);

  colors.sort(function(a,b) {return a-b});
//  console.log('colors now: ' + colors);
  var smallestIntervalEndpoints = findSmallestInterval(colors);
  var smallestIntervalLength = smallestIntervalEndpoints[1] - smallestIntervalEndpoints[0];
  var wK = smallestIntervalLength/(1/(k));
  if (wK < wMin) wMin = wK;
  wTot += wK;
  wCount += 1;
  wAvg = wTot/wCount;

  // also do average, here
  console.log(name + ', k: ' + k + ', wK: ' + wK + ', wMin: ' + wMin + ', wAvg: ' + wAvg);
}

function findLargestInterval(arr) {
	var max = 0;
	var maxStart = 0;
	var maxEnd = 0;
	for (var i = 0; i<arr.length-1; i += 1) {
		if ((arr[i+1] - arr[i]) > max) {
			max = arr[i+1] - arr[i];
			maxStart = i;
			maxEnd = i+1;
		}
	}
	return([arr[maxStart], arr[maxEnd]]);
}

// find smallest interval in sorted array of numbers
// ==> assumes numbers all between 0-1
function findSmallestInterval(arr) {
	var min = 1.1;
	var minStart = 0;
	var minEnd = 0;
	for (var i = 0; i<arr.length-1; i += 1) {
		if ((arr[i+1] - arr[i]) < min) {
			min = arr[i+1] - arr[i];
			minStart = i;
			minEnd = i+1;
		}
	}
	return([arr[minStart], arr[minEnd]]);
}

