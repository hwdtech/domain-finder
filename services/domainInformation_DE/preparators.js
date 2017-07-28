const log = require('../../utils/createLogger')('domainFinderReceiver');
const models = require('../../models');
const {bruteForceAccomodations2} = require('../../utils/bruteforcers');
const concat = require('lodash.concat');
const {possibleCharacters} = require('../../dummyData/dummyData');
const {prepareRussianDomain} = require('./dto');

module.exports = {
  prepareSldForRuZone() {
    return concat(possibleCharacters.split(""), bruteForceAccomodations2(possibleCharacters)).filter(sld => !sld.startsWith('-'))
  },
  workWithRuDomains(chunkedInfo) {
    log.info('Start: workWithChunkedDomainsInfo');
    log.info('Looking for free domains');
    let preparedFreeDomains = [];
    for (let item in chunkedInfo) {
      preparedFreeDomains.push(prepareRussianDomain(chunkedInfo[item], item));
    }
    log.info('Found possible free domains in current iteration');
    return models.RussianDomain.bulkCreate(preparedFreeDomains)
      .then(result => log.info(`Successful adding in DB ${result.length} items`));
  }
};
