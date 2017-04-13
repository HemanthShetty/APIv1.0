var Logger = require('bunyan');
var morgan=require('morgan');
var fs=require('fs');
/*
var log = new Logger({
    name: 'api.nyllabs.tech',
    streams: [
        {
            path: process.stdout,
            level: 'info'
        },
        {
            stream: './debug.log',
            level: 'debug'
        },
        {
            path: './error.log',
            level: 'error'
        }
    ],
    serializers: {
        // custom
        // user: function (u) { if (u) return {login: u.login, name: u.name}; }
        req: Logger.stdSerializers.req,
        res: Logger.stdSerializers.res
    },
});
*/

/**
 * Module that creates the correct instance of HTTP request logging based on the environment
 * @function
 * @param {string} env String which represents the current node process environment variable
 * @returns {object} The instance of morgan logger corresponding to the environment
 */
module.exports.getRequestLogger=function(env)
{
    var requestLogger;
    if (env == 'production') {
        var accessLogStream = fs.createWriteStream('access.log', {flags: 'a'});
        requestLogger=morgan('combined', {stream: accessLogStream});
    }
    else {
        requestLogger=morgan('dev');

    }
    return requestLogger;
}


/*
module.exports = log;
*/
