import winston from "winston"
import { format } from "date-fns"

// Initialize
export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.printf((info) => {
            //${info.timestamp}
            return `${format(info.timestamp, "yy-MM-dd HH:mm:ss")} ${info.level}\t${info.message}`
        }),
    ),
    transports: [new winston.transports.Console()],
})

export function setLoglevel(level: string) {
    logger.transports.forEach((transport) => {
        transport.level = level
    })
}
