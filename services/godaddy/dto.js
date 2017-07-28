const pick = require('lodash.pick');

module.exports = {
  prepareDomainInfo: function (domainInfo, exchangeRate) {
    const lighterDomainData = pick(domainInfo, ['domain', 'price', 'available', 'definitive']);
    if (lighterDomainData.price) {
      lighterDomainData.price = Math.ceil(lighterDomainData.price / 1000000);
      lighterDomainData.roublePrice = Math.ceil(lighterDomainData.price * exchangeRate);
    } else {
      lighterDomainData.price = 'not-given';
      lighterDomainData.roublePrice = 'not-given';
    }
    lighterDomainData.tld = lighterDomainData.domain.substr(lighterDomainData.domain.indexOf('.') + 1);
    lighterDomainData.sld = lighterDomainData.domain.slice(0, lighterDomainData.domain.indexOf('.'));
    lighterDomainData.sldLength = lighterDomainData.sld.length;
    return lighterDomainData;
  }
};
