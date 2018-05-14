const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const moment = require('moment');

async function getPrecipForNumberOfDays({ state, place, endDate, numberOfDays, callback }) {
	const dateDifference = numberOfDays - 1;
	const startDate = moment(endDate)
		.subtract(dateDifference, 'days')
		.format('YYYY-MM-DD');
	return getPrecipForDateRange({ state, place, startDate, endDate, callback });
}

async function getPrecipForDateRange({ state, place, startDate, endDate, callback }) {
	const data = {};

	for (const date of getDatesInRange({ startDate, endDate })) {
		const precip = await getPrecipForDate({ state, place, date });
		data[date] = precip;

		if (callback) {
			callback({ date, precip });
		}
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

module.exports = { getPrecipForDate, getPrecipForNumberOfDays };
