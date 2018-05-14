#!/usr/bin/env node
const { getPrecipForNumberOfDays } = require('./index');

async function main() {
	const data = await getPrecipForNumberOfDays({ state: 'GA', place: 'Rome', endDate: '2018-05-02', numberOfDays: 30 });
	console.log(data);
	console.log('Total', Object.values(data).reduce((a, b) => Number(a) + Number(b), 0));
}

main();
