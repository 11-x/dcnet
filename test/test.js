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
		success=Boolean(success);
		if (typeof this._result!="undefined") {
			this._result='rereported';
		} else {
			this._result=success;
		}
	}

	get result() { return this._result; }

	get is_ok() {
		return Boolean(this._result);
	}
};

/**
	Run a test

	The test being run reports current action and final test
	status (success/failure).

	If an exception is thrown during test the last reported
	action is considered the cause.

	The result is printed to console and accumulated.

	If the final result is not reported or reported more than once
	the test is considered failed.
 */
async function run_test(func) {
	let tester=new Tester(func);
	try {
		await func(tester);
		if (typeof tester.result=="undefined") {
			_tests_failed.push([func.name, tester.action,
				"final status unset"]);
			console.error("TEST FAILED (final status unset):",
				func.name, tester.action);
		} else if (tester.result=="rereported") {
			_tests_failed.push([func.name, undefined,
				"final status rereported"]);
			console.error("TEST FAILED (final status rereported):",
				func.name);
		} else if (!tester.is_ok) {
			_tests_failed.push([func.name, "final status: err"]);
			console.error("TEST FAILED (final status: error)");
		} else {
			_tests_passed.push(func.name);
			console.log("TEST PASSED", func.name);
		}
	} catch (err) {
		_tests_failed.push([func.name, tester.action, "exception: " + err]);
		console.error("TEST FAILED:", func.name, "exception:", err);
	}
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
