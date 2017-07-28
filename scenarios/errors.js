const log = require('../utils/createLogger')('errors');
module.exports = {
    dbConnectionRefused (err) {
        if (err.name === 'SequelizeConnectionRefusedError') {
            log.error(err.message);
            process.exit(0)
        }
        throw(err);
    },
    internetConnectionDead(err){
        if (err.cause.code === 'ENOTFOUND') {
            log.info('RIP internet connection');
            process.exit(0)
        }
    }
};
