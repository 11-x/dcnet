var _tests_failed=[];
var _tests_passed=[];

class Tester
{
	constructor(test_name) {
		this.name=test_name;
		this.action=undefined;
		this._result=undefined;
	}

	report(success) {
		if (typeof this._result!="undefined") {
			this._result='rereported';
		} else if (success) {
			this._result='success';
		} else {
			this._result='fail';
		}
	}

	get result() { return this._result; }
};

async function run_test(func) {
	let tester=new Tester(func);
	let result=undefined;
	try {
		func(tester);
		result=tester.result;
	} catch (err) {
		result='exceptio
		_tests_failed.push([func.name, tester.action, err]);
		console.error("TEST FAILED:", func.name, err);
	}
		_tests_passed.push(func.name);
		console.log("TEST PASSED:", func.name);
}

async function test() {
	await test_crypt();

	let total = _tests_failed.length + _tests_passed.length;

	if (_tests_failed.length) {
		console.error("Testing done; failed:",
			_tests_failed.length, "of", total);
	} else {
		console.log("All", total, "tests passed");
	}
}
