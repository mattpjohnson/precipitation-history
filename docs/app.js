// import { getPrecipForNumberOfDays } from '../index';

const entryForm = document.getElementById('entryForm');
const numberOfDaysInput = document.getElementById('numberOfDays');
const loadingBar = ldBar('#loadingBar');
const resultsTotalElement = document.querySelector('.precip-results__total');
let datesCalculated = 0;

entryForm.onsubmit = async (event) => {
    event.preventDefault();

    const state = 'GA';
    const place = 'Rome';
    const endDate = '2018-04-25';
    const numberOfDays = numberOfDaysInput.value;

    const callback = ({ date, precip }) => loadingBar.set(numberOfDays - ++datesCalculated);

    const data = await getPrecipForNumberOfDays({ state, place, endDate, numberOfDays, callback });
    resultsTotalElement.innerHTML = Object.values(data).reduce((a, b) => a + b, 0);
};