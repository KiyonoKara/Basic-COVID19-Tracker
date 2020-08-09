// These are just other functions so I can display the data
// It's optional but I recommend it
module.exports = {
    appendCommaToNumber: function(args) {
        return args.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    capitalizeFirstLetter: function(str) {
        return str.replace(/\w\S*/g, function(text) {
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        });
    }
}