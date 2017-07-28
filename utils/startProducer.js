const models = require('../models');
const log = require('./createLogger')('startProducer');
const errors = require('../scenarios/errors');

module.exports = function start() {
    log.info('Welcome to program, it will find free domains for you');
    return models.sequelize.sync()
        .catch(err => errors.dbConnectionRefused(err))
};
