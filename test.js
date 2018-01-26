const fs = require('fs');
function* test() {
	console.log(111);
	var a ;
	yield fs.createReadStream(process.cwd() + '/package.json');
	yield a;
}
var hw = test();
console.log(hw.next());
console.log(hw.next());