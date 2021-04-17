const https = require('https');

module.exports = {
    appendCommaToNumber: function(args) {
        return args.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    capitalizeFirstLetter: function(str) {
        return str.replace(/\w\S*/g, function(text) {
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        });
    },

    GET: async function(url) {
        return new Promise((resolve, reject) => {
            https.get(url, callback => {
                let buf = [];
                callback.on('data', chunk => buf.push(chunk));
                callback.on('error', error => reject(error));
                callback.on('end', () => resolve(Buffer.concat(buf).toString()));
            });
        });
    }
}
