// Utilities
const { appendCommaToNumber, capitalizeFirstLetter, GET } = require('./util.js');

// Local ascii renderer
const Ascii = require('./table');
const globalCovTable = new Ascii().setHeading("Key", "Global COVID-19 Stats");

/*
 * Author note: Discontinuing this completely since COVID-19 was supposed to be saved for 2020 only. 2020 has already passed so these are just finishing touches.
 */

/**
 * This will be the based URL and can be added upon
 * */
const covURL = 'https://covid19.mathdro.id/api/';

// Global statistics
function globalCov() {
    return new Promise(resolve => {
        GET(covURL).then(body => {
            const globalCOVIDData = JSON.parse(String(body));

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

            resolve(globalCovTable.toString());
        });
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
    const countryCovTable = new Ascii().setHeading("Key", `COVID-19 Stats for ${country}`);
    return new Promise(resolve => {
        GET(covCountryURL).then(body => {
            // Parsing the country data for COVID-19
            const countryCovData = JSON.parse(body.toString());

            // Once again getting the names of the objects instead of manually listing them
            const ccdKeys = Object.keys(countryCovData);

            // Gets the time the data was last updated from the parsed data
            const countryCovLastUpdated = new Date(countryCovData['lastUpdate']);
            // Various date and time formatting in UTC
            const dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'numeric', day: '2-digit'});
            const [{value: month}, , {value: day}, , {value: year}] = dateTimeFormat.formatToParts(countryCovLastUpdated);
            const timestamp = countryCovLastUpdated.toISOString().replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, '$1');

            // Simple and efficient for loop to add the main data that we are looking for
            for (let i = 0; i < 3; i++) {
                countryCovTable.addRow(`${capitalizeFirstLetter(ccdKeys[i])}`, `${appendCommaToNumber(countryCovData[ccdKeys[i]].value)}`);
            }

            // Timestamp when the data was last updated which has been formatted
            // Optional timing
            countryCovTable.addRow(`Last Updated`, `${month}/${day}/${year} - ${timestamp} UTC`);

            resolve(countryCovTable.toString());
        });
    });
}

module.exports = { globalCov, countryCov };
