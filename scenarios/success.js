const log = require('../utils/createLogger')('success');

module.exports = {
    ending(){
        log.info('All writes are now complete.');
        log.info('JOB IS DONE');
        process.exit(0)
    }
};
