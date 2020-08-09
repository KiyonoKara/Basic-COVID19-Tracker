// Using the request module in order to get the data
const request = require('request');

// Using ascii-table so we can display the data
const asciiTable = require('ascii-table');
const globalCovTable = new asciiTable("Global COVID-19 Stats");

// This is optional but I'm using it to make everything look fancy.
const { appendCommaToNumber, capitalizeFirstLetter } = require('./util.js');

/**
 * This will be the based URL and can be added upon
 * */
const covURL = 'https://covid19.mathdro.id/api/';

// Simple way to get the global statistics
function globalCov() {
    request.get(covURL, (error, response, body) => {
        const globalCOVIDData = JSON.parse(body);

        // Gets the time the data was last updated from the parsed data
        const globalCovLastUpdated = new Date(globalCOVIDData['lastUpdate']);
        // Various date and time formatting in UTC
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' });
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(globalCovLastUpdated);
        const timestamp = globalCovLastUpdated.toISOString().replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, '$1');
        // Get the names of the objects instead of manually listing them
        /**
         * Using Object is really useful for getting the names than what's inside
         * */
        const gcdKeys = Object.keys(globalCOVIDData);
        for (let i = 0; i < 3; i++) {
            globalCovTable.addRow(`${capitalizeFirstLetter(gcdKeys[i])}`, `${appendCommaToNumber(globalCOVIDData[gcdKeys[i]].value)}`);
        }

        // Adding timestamp to the last row
        globalCovTable.addRow(`Last Updated`, `${month}/${day}/${year} - ${timestamp} UTC`);

        // Prints out the data
        console.log(globalCovTable.toString());
    });
}

// Get COVID-19 data by country using a parameter
/**
 * The country's parameters should be the name / ISO2 / ISO3
 * For example => Name: Japan, ISO2: JP, ISO3: JPN
 * Be aware that there are some exceptions in the data like USA is => Name: US, ISO2: US, ISO3: USA
 * */
function countryCov(country) {
    const covCountryURL = covURL + "countries/" + country;
    const countryCovTable = new asciiTable(`COVID-19 Stats for ${country}`);
    request.get(covCountryURL, (error, response, body) => {
        // Parsing the country data for COVID-19
        const countryCovData = JSON.parse(body);

        // Once again getting the names of the objects instead of manually listing them
        const ccdKeys = Object.keys(countryCovData);

        // Gets the time the data was last updated from the parsed data
        const countryCovLastUpdated = new Date(countryCovData['lastUpdate']);
        // Various date and time formatting in UTC
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' });
        const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(countryCovLastUpdated);
        const timestamp = countryCovLastUpdated.toISOString().replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, '$1');

        // Simple and efficient for loop to add the main data that we are looking for
        for (let i = 0; i < 3; i++) {
            countryCovTable.addRow(`${capitalizeFirstLetter(ccdKeys[i])}`, `${appendCommaToNumber(countryCovData[ccdKeys[i]].value)}`);
        }

        // Timestamp when the data was last updated which has been formatted
        // This is optional but doing it for educational purposes
        countryCovTable.addRow(`Last Updated`, `${month}/${day}/${year} - ${timestamp} UTC`);

        console.log(countryCovTable.toString());
    });
}

// Calling the functions so you can see what it the data looks like
globalCov();

// Using Japan as an example
countryCov('japan');