const combinatorics = require('js-combinatorics');
const {possibleCharacters} = require('../dummyData/dummyData');

function bruteForceAccomodations(initString, count) {
    return combinatorics.baseN(initString.split(''), count)
        .toArray()
        .map(element => element.join(''));
}
module.exports = {
    bruteSLDs(count){
        return bruteForceAccomodations(possibleCharacters, count);
    }
};

