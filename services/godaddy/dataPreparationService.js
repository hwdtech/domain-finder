const bunyan = require('bunyan');
const log = require('../../utils/createLogger')('dataPreparationService')
const {bruteForceAccomodations2, bruteForceAccomodations3} = require('../../utils/bruteforcers');
const {possibleCharacters} = require('../../dummyData/dummyData');
const models = require('../../models/index');
const concat = require('lodash.concat');
const {prepareDomainInfo} = require('./dto');
const rp = require('request-promise');
const {bruteSLDs} = require('../../utils/bruteforcers');

module.exports = {
    connectSLDwithTLD: function (SLDs, TLDs) {
        log.info('getting fullDomainNames: started');
        const fullDomainNames = [];
        SLDs.map(singleSLD => {
            TLDs.map(singleTLD => {
                fullDomainNames.push(`${singleSLD}.${singleTLD}`);
            });
        });
        log.info('getting fullDomainNames: ended');
        return fullDomainNames;
    },
    prepareSLDsArray: function () {
        log.info('preparing SLDs array');
        const brutedSLDs = concat(bruteSLDs(1), bruteSLDs(2), bruteSLDs(3))
            .filter(sld => !(sld.endsWith('-') || sld.startsWith('-'))) ;
        return concat(bruteSLDs(1), bruteSLDs(2), bruteSLDs(3));
    },
    workWithChunkedDomainsInfo: function (chunkedInfo) {
        log.info('Start: workWithChunkedDomainsInfo');
        return rp({
            uri: 'http://api.fixer.io/latest?base=USD&symbols=USD,RUB',
            json: true
        })
            .then(result => result.rates.RUB)
            .then(rate => {
                log.info('Looking for free domains');
                let freeDomains = [];
                chunkedInfo.map(singleResponseInfo => {
                    const freeDomainsFromCycle = singleResponseInfo.domains
                        .filter(domain => {
                            if (domain.available === true) {
                                return domain;
                            }
                        })
                        .map(freeDomain => prepareDomainInfo(freeDomain, rate));
                    freeDomains = concat(freeDomains, freeDomainsFromCycle);
                });
                log.info('Found possible free domains in current iteration');
                return freeDomains;
            })
            .then(freeDomains => models.FreeDomain.bulkCreate(freeDomains))
            .then(result => log.info(`Successful adding in DB ${result.length} items`));
    }
};
