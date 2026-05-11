class MyAsyncClass {
	field = undefined;
	constructor() {
		const self = this;
		return new Promise((resolve) => {
			setTimeout(() => {
				self.field = 123;
				resolve(self);
			}, 1000);
		});
	}
}

debugger;

class MySubAsyncClass extends MyAsyncClass {
	constructor() {
		const promise = super();
		return new Promise(async (resolve) => {
			console.log('start');
			const item = await promise;
			console.log('item.field : ', item.field); // 123
			console.log('finish : ', 'finish');
			// not this, but item, cause awaited
			resolve(item);
		});
	}

}

debugger;

(async () => {
	const item = await (new MySubAsyncClass);
	console.log('item.field : ', item.field); // 123
	debugger;
})();