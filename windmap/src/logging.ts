import winston from "winston"
import { format } from "date-fns"

// Initialize
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf((info) => {
        //${info.timestamp}
        return `${format(info.timestamp, "yy-MM-dd HH:mm:ss")} ${info.level}\t${info.message}`
    }),
)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    fileFormat,
)

export const logger = winston.createLogger({
    level: "debug",
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new winston.transports.File({
            filename: "./windmap.log",
            format: fileFormat,
        }),
    ],
})

export function setLoglevel(level: string) {
    logger.transports.forEach((transport) => {
        transport.level = level
    })
}
