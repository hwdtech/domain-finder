const models = require('../models');
const chunks = require('array.chunk');
const sendDataToQueue = require('../utils/sendDataToQueue');
const errors = require('../scenarios/errors');
const {ending} = require('../scenarios/success');
const {connectSLDwithTLD} = require('../services/godaddy/dataPreparationService');
const {prepareSldForRuZone} = require('../services/domainInformation_DE/preparators');
const {queueForRuZone} = require('../appConfig');

models.sequelize.sync()
  .catch(err => errors.dbConnectionRefused(err))
  .then(() => prepareSldForRuZone())
  .then(slds => connectSLDwithTLD(slds, ['ru']))
  .then(websites => chunks(websites, 5))
  .then(data => sendDataToQueue(queueForRuZone, data))
  .then(() => ending())
  .catch(err => errors.internetConnectionDead(err));
