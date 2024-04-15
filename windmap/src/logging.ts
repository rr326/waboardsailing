import winston from "winston"

// Initialize
export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf((info) => {
            //${info.timestamp}
            return `${info.level} \t${info.message}`
        }),
    ),
    transports: [new winston.transports.Console()],
})

export function setLoglevel(level: string) {
    logger.transports.forEach((transport) => {
        transport.level = level
    })
}
