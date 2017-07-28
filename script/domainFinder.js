const log = require('../utils/createLogger')('domainFinderProducer');
const chunks = require('array.chunk');
const {getAllPossibleWebsites} = require('../services/godaddy/fetchService');
const errors = require('../scenarios/errors');
const start = require('../utils/startProducer');
const {ending} = require('../scenarios/success');
const sendDataToQueue = require('../utils/sendDataToQueue');
const {queueName} = require('../appConfig');

start()
    .then(() => getAllPossibleWebsites())
    .then(allWebsites => chunks(allWebsites, 5000))
    .then(result => sendDataToQueue(queueName, result))
    .then(() => ending())
    .catch(err => errors.internetConnectionDead(err));
