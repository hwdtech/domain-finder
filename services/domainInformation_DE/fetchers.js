const log = require('../../utils/createLogger')('ruDomainsFetcher');
const rp = require('request-promise');
const P = require('bluebird');
const promiseRetry = require('promise-retry');

function makeRequest(site) {
  const options = {retries: 3, minTimeout: 60000};
  return promiseRetry(options, (retry, number) => {
    return rp({
      uri: `https://whois-v0.p.mashape.com/check?domain=${site}`,
      headers: {
        "X-Mashape-Key": "INSERT_YOUR_KEY"
      },
      json: true
    })
      .catch(function (err) {
        retry(err);
      });
  });
}
function makeBulkRequests(data) {
  const tasks = {};
  data.map(website => {
    tasks[website] = makeRequest(website);
  });
  return P.props(tasks);
}

module.exports = {
  async request10RuDomains(chunkOfData) {
    log.info('Going to make bulk requests');
    const chunkedDomainsInfo = await makeBulkRequests(chunkOfData);
    log.info('Finished bulk requests');
    return chunkedDomainsInfo;
  }
};
