const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} : [${label || 'Logger'}] : ${level} : ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        myFormat
    ),
    transports: [
        new transports.Console(),

        // Info-level and above (info, warn, error)
        new DailyRotateFile({
            filename: path.join('Loggers', 'info', '%DATE%.info.log'),
            datePattern: 'YYYY-MM',
            level: 'info',
            zippedArchive: false,
            maxFiles: '12m'
        }),

        // Error-level only
        new DailyRotateFile({
            filename: path.join('Loggers', 'error', '%DATE%.error.log'),
            datePattern: 'YYYY-MM',
            level: 'error',
            zippedArchive: false,
            maxFiles: '12m'
        })
    ]
});

module.exports = logger;