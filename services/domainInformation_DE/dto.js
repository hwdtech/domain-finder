module.exports = {
  prepareRussianDomain(domainInfo, domainName){
    const temp = {};
    // temp.description = domainInfo.whoisResponse.replace(/(\r\n|\n|\r)/gm,"");
    temp.description = domainInfo.whoisResponse;
    temp.domain = domainName;
    temp.available = domainInfo.available;
    temp.tld = domainName.substr(domainName.indexOf('.') + 1);
    temp.sld = domainName.slice(0, domainName.indexOf('.'));
    temp.sldLength = temp.sld.length;
    domainInfo.whoisResponse.split('\n').map(info => {
      if (info.startsWith('free-date')) {
        const a = info.split(' ');
        temp.freeDate = a[a.length - 1];
      }
    });
    if (!temp.hasOwnProperty('freeDate')){
      temp.freeDate = 'no-info';
    }
    return temp;
  }
};
