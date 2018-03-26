'use strict';

module.exports = {
	getRandomBusinessIterator
};

function getRandomBusinessIterator(userContext, events, done) {
	const randIterator = Math.floor(Math.random() * 10000000);
	userContext.vars.iterator = randIterator;
	return done();
}