#!/usr/bin/env node
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const moment = require('moment');

async function getPrecipForNumberOfDays({ state, place, endDate, numberOfDays }) {
	const dateDifference = numberOfDays - 1;
	const startDate = moment(endDate)
		.subtract(dateDifference, 'days')
		.format('YYYY-MM-DD');
	return getPrecipForDateRange({ state, place, startDate, endDate });
}

async function getPrecipForDateRange({ state, place, startDate, endDate }) {
	const data = {};

	for (const date of getDatesInRange({ startDate, endDate })) {
		const precip = await getPrecipForDate({ state, place, date });
		data[date] = precip;
	}

	return data;
}

function getDatesInRange({ startDate, endDate }) {
	const dates = [];
	let date = startDate;

	while (date != endDate) {
		dates.push(date);

		date = moment(date)
			.add(1, 'days')
			.format('YYYY-MM-DD');
	}

	dates.push(date);

	return dates;
}

async function getPrecipForDate({ state, place, date }) {
	const data = await fetch(`https://www.almanac.com/weather/history/${state}/${place}/${date}`)
		.then(response => response.text());

	const dom = new JSDOM(data);
	const document = dom.window.document;
	const precipSpan = document.querySelector('.weatherhistory_results_datavalue.prcp .value');

	return precipSpan.innerHTML;
}

async function main() {
	const data = await getPrecipForNumberOfDays({ state: 'GA', place: 'Rome', endDate: '2018-04-25', numberOfDays: 7 });
	console.log(data);
	console.log('Total', Object.values(data).reduce((a, b) => Number(a) + Number(b), 0));
}

main();
