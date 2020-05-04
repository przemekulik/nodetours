const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const path = require('path');

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] [${level}]: ${message}`;
});

const logger = createLogger({
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.splat(),
    logFormat
  ),
  transports: [
    // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
    // error and below
    new transports.File({
      level: 'error',
      filename: './logs/error.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: format.combine(
        format.json()
      )
      }),
    // info and below
    new transports.File({
      filename: './logs/server.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: format.combine(
        format.json()
      )
    }),
    // verbose and below
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'verbose',
      format: format.combine(
        format.colorize({ all: true }),
        logFormat
      )
    })
  ]
});

module.exports = logger;