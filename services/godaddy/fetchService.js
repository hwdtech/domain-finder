const rp = require('request-promise');
const P = require('bluebird');
const log = require('../../utils/createLogger')('fetchService');
const promiseRetry = require('promise-retry');
const {prepareSLDsArray, connectSLDwithTLD} = require('./dataPreparationService');
const {workWithChunkedDomainsInfo} = require('./dataPreparationService');
const chunks = require('array.chunk');

const getCurrencyExchangeRate = async () => {
    log.info('Getting currency exchange rate');
    const result = await rp({
        uri: 'http://api.fixer.io/latest?base=USD&symbols=USD,RUB',
        json: true
    });
    return result.rates.RUB;
};
function makeRequest(data) {
    //secret WyF2XttkN1DQVCKWCRH5nk
    // key 2s7YtNpHjf_WyEyVKJJmAxCdxKq4u2xgt
    // set header Authorization: sso-key {API_KEY}:{API_SECRET}
    const options = {retries: 3, minTimeout: 60000};
    return promiseRetry(options, (retry, number) => {
        return rp({
            method: 'POST',
            headers: {
                'Authorization': 'sso-key 2s7YtNpHjf_WyEyVKJJmAxCdxKq4u2xgt:WyF2XttkN1DQVCKWCRH5nk'
            },
            uri: 'https://api.ote-godaddy.com/v1/domains/available?checkType=FULL',
            body: data,
            json: true
        })
            .catch(function (err) {
                retry(err);
            });
    });
}
const makeBulkRequests = (data) => {
    const chunkedWebsites = chunks(data, 500);
    const tasks = [];
    chunkedWebsites.map(websites => {
        tasks.push(makeRequest(websites));
    });
    return P.all(tasks);
};
function innerGetAllPossibleTLDs() {
    log.info('Start getting all possible TLDs');
    const accumulatorArray = [];
    return rp({
        uri: 'https://api.ote-godaddy.com/v1/domains/tlds',
        headers: {
            'Authorization': 'sso-key 2s7YtNpHjf_WyEyVKJJmAxCdxKq4u2xgt:WyF2XttkN1DQVCKWCRH5nk'
        },
        json: true
    })
        .then(result => {
            result.map(tldInfo =>
                accumulatorArray.push(tldInfo.name)
            );
            log.info('End getting all possible TLDs');
            return accumulatorArray;
        });
}
function getAllPossibleTLDs() {
    const options = {retries: 3, minTimeout: 1000};
    return promiseRetry(options, (retry, number) => {
        console.log('attempt number', number);
        return innerGetAllPossibleTLDs()
            .catch(function (err) {
                if (err.cause.code === 'ENOTFOUND') {
                    retry(err);
                }
                throw err;
            });
    })
}
module.exports = {
    getCurrencyExchangeRate: function () {
        log.info('getting currency exchange rate');
        return rp({
            uri: 'http://api.fixer.io/latest?base=USD&symbols=USD,RUB',
            json: true
        })
            .then(result => result.rates.RUB);
    },
    requestPortionDomainsInfo: async (chunkOfData) => {
        log.info('Going to make bulk requests');
        const chunkedDomainsInfo = await makeBulkRequests(chunkOfData);
        log.info('Finished bulk requests');
        return chunkedDomainsInfo;
    },
    getAllPossibleWebsites(){
        return getAllPossibleTLDs()
            .then(tlds => P.props({
                tlds: tlds.filter(tld => !tld.includes('.')),
                slds: prepareSLDsArray()
            }))
            .then(result => connectSLDwithTLD(result.slds, result.tlds))
    }
};
