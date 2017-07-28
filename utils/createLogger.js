const bunyan = require('bunyan');

module.exports = function (name) {
    return bunyan.createLogger({
        name: name,
        streams: [
            {
                level: 'info',
                stream: process.stdout            // log INFO and above to stdout
            },
            {
                level: 'error',
                path: './common.log'  // log ERROR and above to a file
            }
        ]
    });
};
