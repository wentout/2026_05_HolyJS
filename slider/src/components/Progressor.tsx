import React from 'react';
import { Progress } from 'theme-ui';

const Progressor = function () {};

Progressor.prototype.View = function () {
	const me = this;
	const {
		counters
	} = me;
	return (
		<Progress max={counters.amount} value={counters.current}></Progress>
	);
};

export default Progressor;