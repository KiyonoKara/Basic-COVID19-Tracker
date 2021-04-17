const { globalCov, countryCov } = require('../src');

// All testing here
(async function() {
    console.log(await globalCov());
    console.log(await countryCov("Japan"));
})();
