debugger;

with ([2, 5]) {
	console.log(
		'Math.pow(...reverse()) : ',
		Math.pow(
			...reverse()
		)
	);      // 25
}

debugger;